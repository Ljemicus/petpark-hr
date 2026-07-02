import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { sendSMS, smsTemplates } from '@/lib/sms';
import { smsSendSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify admin or system role
    const { data: { user } } = await supabase.auth.getUser();
    
    // Allow system/internal calls without auth for cron jobs
    const body = await request.json().catch(() => null);
    const parsed = smsSendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Neispravni podaci.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { to, template, data, body: customBody, internalKey, userId } = parsed.data;
    
    // Check internal key for system calls
    const isSystemCall = internalKey === process.env.SMS_INTERNAL_KEY;
    
    if (!user && !isSystemCall) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
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
      return NextResponse.json(
        { error: 'Neispravni podaci.', details: { body: ['SMS poruka je obavezna'] } },
        { status: 400 }
      );
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
    
    // Send SMS
    const result = await sendSMS({
      to,
      body: messageBody,
    });
    
    // Log to database
    await supabase.from('sms_logs').insert({
      user_id: userId || user?.id,
      phone: to,
      body: messageBody,
      template: template || 'custom',
      status: result.success ? 'sent' : 'failed',
      provider_message_id: result.messageId,
      error: result.error,
    });
    
    if (result.success) {
      return NextResponse.json({ success: true, messageId: result.messageId });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
