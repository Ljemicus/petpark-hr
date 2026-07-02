import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { dispatchSms } from '@/lib/notifications/dispatch';
import { smsTemplates } from '@/lib/sms';
import { smsSendSchema } from '@/lib/validation';
import { apiError } from '@/lib/api-errors';
import { requireAdmin } from '@/lib/admin-guard';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify admin or system role
    const { data: { user } } = await supabase.auth.getUser();
    
    // Allow system/internal calls without auth for cron jobs
    const body = await request.json().catch(() => null);
    const parsed = smsSendSchema.safeParse(body);
    if (!parsed.success) {
      return apiError({
        status: 400,
        code: 'INVALID_INPUT',
        message: 'Neispravni podaci.',
        details: parsed.error.flatten().fieldErrors,
      });
    }
    const { to, template, data, body: customBody, internalKey, userId } = parsed.data;
    
    // Check internal key for system calls. Fail closed when SMS_INTERNAL_KEY is not configured.
    const configuredInternalKey = process.env.SMS_INTERNAL_KEY;
    const isSystemCall = Boolean(configuredInternalKey && internalKey && internalKey === configuredInternalKey);
    
    if (!user && !isSystemCall) {
      return apiError({ status: 401, code: 'UNAUTHORIZED', message: 'Unauthorized' });
    }

    if (user && !isSystemCall) {
      const admin = await requireAdmin();
      if (!admin.ok) return admin.response;
    }
    
    // Build message body from template or use custom
    let messageBody = customBody;
    if (template && data) {
      const templateFn = smsTemplates[template as keyof typeof smsTemplates];
      if (templateFn) {
        messageBody = templateFn(data as never);
      }
    }
    
    if (!messageBody) {
      return apiError({
        status: 400,
        code: 'INVALID_INPUT',
        message: 'Neispravni podaci.',
        details: { body: ['SMS poruka je obavezna'] },
      });
    }
    
    // Check user's SMS preferences
    const { data: userPrefs } = await supabase
      .from('user_notifications')
      .select('sms_enabled, phone_verified')
      .eq('user_id', userId)
      .single();
    
    if (userPrefs && !userPrefs.sms_enabled) {
      return NextResponse.json(
        { success: false, reason: 'SMS disabled by user' },
        { status: 200 }
      );
    }
    
    // Send SMS through dispatcher kill-switch.
    const dispatchResult = await dispatchSms({
      to,
      body: messageBody,
    });
    const result = dispatchResult.result;

    if (dispatchResult.status === 'skipped') {
      return NextResponse.json({ success: true, skipped: true, reason: dispatchResult.reason });
    }
    
    // Log to database
    await supabase.from('sms_logs').insert({
      user_id: userId || user?.id,
      phone: to,
      body: messageBody,
      template: template || 'custom',
      status: result?.success ? 'sent' : 'failed',
      provider_message_id: result?.messageId,
      error: result?.error,
    });
    
    if (result?.success) {
      return NextResponse.json({ success: true, messageId: result.messageId });
    } else {
      return NextResponse.json(
        { success: false, error: result?.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    return apiError({ status: 500, code: 'INTERNAL_ERROR', message: 'Internal server error' });
  }
}
