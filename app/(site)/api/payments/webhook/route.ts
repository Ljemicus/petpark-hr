import { NextResponse } from 'next/server';
import { arePaymentsEnabled, paymentsDisabledResponse } from '@/lib/payments-gate';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { apiError } from '@/lib/api-errors';
import { getStripe } from '@/lib/stripe';
import { calculateSitterPayout, calculatePlatformFee, formatCurrency } from '@/lib/payment';
import { SERVICE_LABELS, type ServiceType } from '@/lib/types';
import { dispatchAlert } from '@/lib/alerting';
import { getRequestId, createScopedLogger } from '@/lib/request-context';
import { sendEmail } from '@/lib/email';
import { paymentConfirmationEmail, sitterPaymentNotificationEmail } from '@/lib/email-templates';
import { enforcePaymentRateLimit } from '@/lib/payments-rate-limit';
import type Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!arePaymentsEnabled()) {
    return paymentsDisabledResponse();
  }

  const rateLimitResponse = await enforcePaymentRateLimit(request, 'webhook');
  if (rateLimitResponse) return rateLimitResponse;

  const reqId = getRequestId(request);
  const log = createScopedLogger('payments.webhook', reqId);
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || webhookSecret.includes('REPLACE')) {
    return apiError({ status: 500, code: 'WEBHOOK_UNAVAILABLE', message: 'Webhook not configured' });
  }

  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    log.warn('Missing stripe-signature header');
    return apiError({ status: 400, code: 'SIGNATURE_MISSING', message: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    log.error('Signature verification failed');
    dispatchAlert({
      severity: 'P1',
      service: 'payments.webhook',
      description: 'Stripe signature verification failed — possible tampering or misconfigured secret',
      owner: 'platform',
    });
    return apiError({ status: 400, code: 'INVALID_SIGNATURE', message: 'Invalid signature' });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    log.error('Supabase service role is not configured for webhook processing');
    return apiError({ status: 500, code: 'WEBHOOK_STORAGE_UNAVAILABLE', message: 'Webhook storage not configured' });
  }

  const supabase = createSupabaseClient(supabaseUrl, serviceRoleKey);

  const { error: eventInsertError } = await supabase.from('stripe_events').insert({
    event_id: event.id,
    event_type: event.type,
    payload: event as unknown as Record<string, unknown>,
  });

  if (eventInsertError) {
    if (eventInsertError.code === '23505') {
      const { data: existingEvent, error: existingEventError } = await supabase
        .from('stripe_events')
        .select('processed_at')
        .eq('event_id', event.id)
        .maybeSingle();

      if (existingEventError) {
        log.error('Failed to inspect duplicate Stripe webhook event', {
          eventId: event.id,
          eventType: event.type,
          reason: existingEventError.message,
        });
        return apiError({ status: 500, code: 'WEBHOOK_IDEMPOTENCY_UNAVAILABLE', message: 'Webhook idempotency unavailable' });
      }

      if (!existingEvent?.processed_at) {
        log.warn('Duplicate Stripe webhook event is still unprocessed', {
          eventId: event.id,
          eventType: event.type,
        });
        return apiError({ status: 409, code: 'WEBHOOK_EVENT_IN_PROGRESS', message: 'Webhook event already received' });
      }

      log.info('Skipping duplicate Stripe webhook event', {
        eventId: event.id,
        eventType: event.type,
      });
      return NextResponse.json({ received: true, duplicate: true });
    }

    log.error('Failed to record Stripe webhook event for idempotency', {
      eventId: event.id,
      eventType: event.type,
      reason: eventInsertError.message,
    });
    dispatchAlert({
      severity: 'P1',
      service: 'payments.webhook',
      description: 'Failed to record Stripe event idempotency key — webhook processing stopped fail-closed',
      value: `event=${event.id}, type=${event.type}`,
      owner: 'platform',
    });
    return apiError({ status: 500, code: 'WEBHOOK_IDEMPOTENCY_UNAVAILABLE', message: 'Webhook idempotency unavailable' });
  }

  async function failWebhookForRetry(params: {
    code: string;
    message: string;
    description: string;
    value: string;
  }) {
    const { error: releaseError } = await supabase
      .from('stripe_events')
      .delete()
      .eq('event_id', event.id)
      .is('processed_at', null);

    if (releaseError) {
      log.error('Failed to release Stripe webhook event for retry', {
        eventId: event.id,
        eventType: event.type,
        reason: releaseError.message,
      });
    }

    dispatchAlert({
      severity: 'P1',
      service: 'payments.webhook',
      description: params.description,
      value: params.value,
      owner: 'platform',
    });

    return apiError({ status: 500, code: params.code, message: params.message });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) {
        log.warn('checkout.session.completed missing bookingId metadata', {
          sessionId: session.id,
        });
        break;
      }

      const amountTotal = session.amount_total || 0;
      if (amountTotal <= 0) {
        log.error('checkout.session.completed has invalid amount', {
          sessionId: session.id,
          bookingId,
          amountTotal,
        });
        break;
      }

      // Idempotency: skip if already processed
      {
        const { data: existingBooking } = await supabase
          .from('bookings')
          .select('payment_status')
          .eq('id', bookingId)
          .single();

        if (existingBooking?.payment_status === 'paid') {
          log.info('Skipping already-paid booking (duplicate webhook)', {
            bookingId,
            sessionId: session.id,
          });
          break;
        }
      }

      {
        const platformFee = calculatePlatformFee(amountTotal);
        const sitterPayout = calculateSitterPayout(amountTotal);

        // Update booking
        const { error: bookingUpdateError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            stripe_payment_intent_id: typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id || null,
            stripe_session_id: session.id,
            platform_fee: platformFee / 100,
          })
          .eq('id', bookingId);

        if (bookingUpdateError) {
          log.error('Failed to update booking after checkout completion', {
            bookingId,
            sessionId: session.id,
            reason: bookingUpdateError.message,
          });
          return failWebhookForRetry({
            code: 'BOOKING_PAYMENT_UPDATE_FAILED',
            message: 'Booking payment update failed',
            description: 'Failed to update booking after successful Stripe checkout — webhook released for retry',
            value: `booking=${bookingId}`,
          });
        }

        // Log payment
        const { error: paymentInsertError } = await supabase.from('payments').insert({
          booking_id: bookingId,
          stripe_payment_intent_id: typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id || null,
          stripe_session_id: session.id,
          amount: amountTotal,
          platform_fee: platformFee,
          sitter_payout: sitterPayout,
          currency: session.currency || 'eur',
          status: 'succeeded',
        });

        if (paymentInsertError) {
          log.error('Failed to insert payment log after checkout completion', {
            bookingId,
            sessionId: session.id,
            reason: paymentInsertError.message,
          });
          dispatchAlert({
            severity: 'P2',
            service: 'payments.webhook',
            description: 'Failed to insert payment record — booking updated but payment log missing',
            value: `booking=${bookingId}`,
            owner: 'platform',
          });
        }

        // Best-effort: send payment confirmation emails
        try {
          const { data: bookingDetails } = await supabase
            .from('bookings')
            .select('*, owner:profiles!bookings_owner_id_fkey(name, email), sitter:profiles!bookings_sitter_id_fkey(name, email), pet:pets!bookings_pet_id_fkey(name)')
            .eq('id', bookingId)
            .single();

          if (bookingDetails?.owner?.email) {
            const dates = `${new Date(bookingDetails.start_date).toLocaleDateString('hr-HR')} – ${new Date(bookingDetails.end_date).toLocaleDateString('hr-HR')}`;
            const serviceName = SERVICE_LABELS[bookingDetails.service_type as ServiceType] || bookingDetails.service_type || 'Usluga';

            sendEmail({
              to: bookingDetails.owner.email,
              subject: 'Plaćanje potvrđeno!',
              html: paymentConfirmationEmail(
                bookingDetails.owner.name || 'Korisnik',
                bookingDetails.pet?.name || 'Ljubimac',
                serviceName,
                dates,
                formatCurrency(amountTotal),
              ),
            }).catch((err) => log.error('Failed to send owner payment email', { error: String(err) }));

            if (bookingDetails.sitter?.email) {
              sendEmail({
                to: bookingDetails.sitter.email,
                subject: 'Nova uplata primljena!',
                html: sitterPaymentNotificationEmail(
                  bookingDetails.sitter.name || 'Čuvar',
                  bookingDetails.owner.name || 'Korisnik',
                  bookingDetails.pet?.name || 'Ljubimac',
                  serviceName,
                  dates,
                  formatCurrency(sitterPayout),
                ),
              }).catch((err) => log.error('Failed to send sitter payment email', { error: String(err) }));
            }
          }
        } catch (emailErr) {
          log.error('Failed to fetch booking details for email', { error: String(emailErr) });
        }
      }
      break;
    }

    case 'payment_intent.succeeded': {
      break;
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const bookingId = pi.metadata?.bookingId;

      if (!bookingId) {
        log.warn('payment_intent.payment_failed missing bookingId metadata', {
          paymentIntentId: pi.id,
        });
        break;
      }

      const { error: paymentFailedUpdateError } = await supabase
        .from('bookings')
        .update({ payment_status: 'failed' })
        .eq('id', bookingId);

      if (paymentFailedUpdateError) {
        log.error('Failed to mark booking payment as failed', {
          bookingId,
          paymentIntentId: pi.id,
          reason: paymentFailedUpdateError.message,
        });
        return failWebhookForRetry({
          code: 'BOOKING_PAYMENT_FAILURE_UPDATE_FAILED',
          message: 'Booking payment failure update failed',
          description: 'Failed to mark booking as payment_failed in DB after Stripe failure event — webhook released for retry',
          value: `booking=${bookingId}, pi=${pi.id}`,
        });
      } else {
        // Payment failed is noteworthy even when DB update succeeds
        dispatchAlert({
          severity: 'P2',
          service: 'payments.webhook',
          description: 'Payment intent failed for booking',
          value: `booking=${bookingId}, pi=${pi.id}`,
          owner: 'platform',
        });
      }
      break;
    }

    case 'account.updated': {
      const account = event.data.object as Stripe.Account;

      // Update sitter onboarding status
      const { error: accountUpdateError } = await supabase
        .from('sitter_profiles')
        .update({
          stripe_onboarding_complete: account.details_submitted || false,
          payout_enabled: account.payouts_enabled || false,
        })
        .eq('stripe_account_id', account.id);

      if (accountUpdateError) {
        log.error('Failed to update sitter onboarding status', {
          stripeAccountId: account.id,
          reason: accountUpdateError.message,
        });
        return failWebhookForRetry({
          code: 'STRIPE_ACCOUNT_UPDATE_FAILED',
          message: 'Stripe account update failed',
          description: 'Failed to update sitter onboarding status from Stripe account.updated — webhook released for retry',
          value: `stripeAccount=${account.id}`,
        });
      }
      break;
    }

    case 'charge.dispute.created': {
      const dispute = event.data.object as Stripe.Dispute;
      log.error('Dispute created', {
        disputeId: dispute.id,
        amount: dispute.amount || 0,
      });
      dispatchAlert({
        severity: 'P0',
        service: 'payments.webhook',
        description: 'Stripe dispute opened — immediate action required',
        value: `dispute=${dispute.id}, amount=${dispute.amount || 0}`,
        owner: 'founder',
      });
      break;
    }

    default:
      break;
  }

  const { error: eventProcessedError } = await supabase
    .from('stripe_events')
    .update({
      processed_at: new Date().toISOString(),
      processing_result: { received: true },
    })
    .eq('event_id', event.id);

  if (eventProcessedError) {
    log.error('Failed to mark Stripe webhook event as processed', {
      eventId: event.id,
      eventType: event.type,
      reason: eventProcessedError.message,
    });
  }

  return NextResponse.json({ received: true });
}
