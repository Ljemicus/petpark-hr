import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const paymentRouteFiles = [
  'app/(site)/api/payments/account-link/route.ts',
  'app/(site)/api/payments/account-status/route.ts',
  'app/(site)/api/payments/connect/route.ts',
  'app/(site)/api/payments/create-checkout/route.ts',
  'app/(site)/api/payments/dashboard-link/route.ts',
  'app/(site)/api/payments/refund/route.ts',
  'app/(site)/api/payments/webhook/route.ts',
];

describe('payments security regressions', () => {
  it.each(paymentRouteFiles)('%s enforces the fail-closed payments rate limiter', (file) => {
    const source = readFileSync(file, 'utf8');

    expect(source).toContain("@/lib/payments-rate-limit");
    expect(source).toContain('enforcePaymentRateLimit(request,');
    expect(source).toContain('if (rateLimitResponse) return rateLimitResponse;');
  });

  it('webhook records Stripe event IDs before processing and no-ops duplicates', () => {
    const source = readFileSync('app/(site)/api/payments/webhook/route.ts', 'utf8');

    expect(source).toContain("from('stripe_events').insert");
    expect(source).toContain('event_id: event.id');
    expect(source).toContain("eventInsertError.code === '23505'");
    expect(source).toContain("select('processed_at')");
    expect(source).toContain('WEBHOOK_EVENT_IN_PROGRESS');
    expect(source).toContain('duplicate: true');
    expect(source).toContain('failWebhookForRetry');
    expect(source).toContain("delete()");
    expect(source).toContain("from('stripe_events')");
    expect(source).toContain('processed_at');
  });
});
