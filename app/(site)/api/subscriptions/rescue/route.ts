import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-errors';
import { appLogger } from '@/lib/logger';
import { rateLimitAsync } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Parse form data
    const formData = await request.formData();
    const organizationId = formData.get('organization_id') as string;
    const email = (formData.get('email') as string | null)?.toLowerCase().trim() || '';

    if (!organizationId || !email) {
      return apiError({ 
        status: 400, 
        code: 'INVALID_REQUEST', 
        message: 'Organization ID and email are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return apiError({ 
        status: 400, 
        code: 'INVALID_EMAIL', 
        message: 'Please enter a valid email address' 
      });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const rateLimitKey = `rescue-subscription:${ip}:${email}`;
    if (!(await rateLimitAsync(rateLimitKey, 5, 60 * 60_000, { route: 'rescue-subscription', failClosed: false }))) {
      return apiError({
        status: 429,
        code: 'RATE_LIMITED',
        message: 'Too many subscription attempts. Please try again later',
      });
    }

    // Check if organization exists
    const { data: org, error: orgError } = await supabase
      .from('rescue_organizations')
      .select('id, display_name')
      .eq('id', organizationId)
      .single();

    if (orgError || !org) {
      return apiError({ 
        status: 404, 
        code: 'ORGANIZATION_NOT_FOUND', 
        message: 'Organization not found' 
      });
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('rescue_email_subscriptions')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      // Already subscribed - just return success
      return NextResponse.json({ 
        success: true, 
        message: 'Već ste pretplaćeni na novosti ove organizacije' 
      });
    }

    // Create subscription
    const { error } = await supabase
      .from('rescue_email_subscriptions')
      .insert({
        organization_id: organizationId,
        email,
        subscribed_at: new Date().toISOString(),
      });

    if (error) {
      appLogger.error('rescue.subscription', 'Failed to create subscription', {
        error: error.message,
        organizationId,
        email,
      });
      return apiError({ 
        status: 500, 
        code: 'SUBSCRIPTION_FAILED', 
        message: 'Failed to create subscription' 
      });
    }

    appLogger.info('rescue.subscription', 'New subscription created', {
      organizationId,
      organizationName: org.display_name,
    });

    // Return redirect to success page or organization page
    return NextResponse.redirect(
      new URL(`/udruge?subscribed=1`, request.url),
      303
    );

  } catch (error) {
    appLogger.error('rescue.subscription', 'Subscription error', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    return apiError({ 
      status: 500, 
      code: 'INTERNAL_ERROR', 
      message: 'Internal server error' 
    });
  }
}
