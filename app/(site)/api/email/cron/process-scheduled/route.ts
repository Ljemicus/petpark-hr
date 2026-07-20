import { NextRequest, NextResponse } from 'next/server';
import { requireAdminOrCron } from '@/lib/admin-guard';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email';
import { getWelcomeSequence } from '@/lib/email-sequences';
import { appLogger } from '@/lib/logger';
import type { User } from '@/lib/types';

/**
 * GET /api/email/cron/process-scheduled
 * Process scheduled emails (called by cron job)
 * Requires CRON_SECRET authorization
 */
export async function GET(request: NextRequest) {
  try {
    const guard = await requireAdminOrCron(request);
    if (!guard.ok) return guard.response;

    const supabase = createAdminClient();
    
    // Get pending scheduled emails that should be sent
    const { data: pendingEmails, error } = await supabase
      .from('scheduled_emails')
      .select('*, profile:profiles!scheduled_emails_user_id_fkey(id, email, display_name, created_at)')
      .is('sent_at', null)
      .lte('scheduled_for', new Date().toISOString())
      .limit(100);

    if (error) {
      appLogger.error('email_cron', 'Failed to fetch pending emails', { error: error.message });
      return NextResponse.json({ error: 'Failed to fetch pending emails' }, { status: 500 });
    }

    if (!pendingEmails?.length) {
      return NextResponse.json({ processed: 0, message: 'No pending emails' });
    }

    let sent = 0;
    let failed = 0;

    for (const email of pendingEmails) {
      try {
        // Determine which sequence and email to send
        const role = ((email.metadata?.role as User['role'] | undefined) || 'owner');
        const sequence = getWelcomeSequence(role as User['role'] | 'groomer' | 'trainer' | 'breeder' | 'rescue');
        const sequenceEmail = sequence.find(e => e.name === email.email_name);

        if (!sequenceEmail) {
          appLogger.warn('email_cron', `Email not found in sequence: ${email.email_name}`);
          failed++;
          continue;
        }

        const profile = email.profile;
        if (!profile?.email) {
          appLogger.warn('email_cron', `Profile missing for scheduled email: ${email.id}`);
          failed++;
          continue;
        }

        const user: User = {
          id: profile.id,
          email: profile.email,
          name: profile.display_name || profile.email,
          role,
          avatar_url: null,
          phone: null,
          city: null,
          created_at: profile.created_at,
        };

        // Send the email
        const result = await sendEmail({
          to: user.email,
          subject: sequenceEmail.subject,
          html: sequenceEmail.getHtml(user),
        });

        if (result.success) {
          // Mark as sent
          await supabase
            .from('scheduled_emails')
            .update({ sent_at: new Date().toISOString() })
            .eq('id', email.id);
          sent++;
        } else {
          // Mark as failed
          await supabase
            .from('scheduled_emails')
            .update({ error: result.error || 'Unknown error' })
            .eq('id', email.id);
          failed++;
        }
      } catch (emailError) {
        const errorMsg = emailError instanceof Error ? emailError.message : String(emailError);
        await supabase
          .from('scheduled_emails')
          .update({ error: errorMsg })
          .eq('id', email.id);
        failed++;
      }
    }

    appLogger.info('email_cron', 'Processed scheduled emails', { sent, failed, total: pendingEmails.length });

    return NextResponse.json({ 
      processed: pendingEmails.length,
      sent,
      failed,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    appLogger.error('email_cron', 'Cron job failed', { error: errorMsg });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
