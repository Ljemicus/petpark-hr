import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-errors';
import { dispatchPushToMultiple } from '@/lib/notifications/dispatch';
import type { NotificationPayload } from '@/lib/push-notifications';
import { appLogger } from '@/lib/logger';
import { canSendNotification } from '@/lib/db/notifications';
import { pushSendSchema } from '@/lib/validation';
import { requireAdmin } from '@/lib/admin-guard';

/**
 * POST /api/push/send
 * Send push notifications to specific users (admin/service only)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const admin = await requireAdmin();
    if (!admin.ok) return admin.response;

    const body = await request.json().catch(() => null);
    const parsed = pushSendSchema.safeParse(body);
    if (!parsed.success) {
      return apiError({
        status: 400,
        code: 'INVALID_INPUT',
        message: 'Neispravni podaci.',
        details: parsed.error.flatten().fieldErrors,
      });
    }
    const { userIds, payload } = parsed.data as { userIds: string[]; payload: NotificationPayload };

    // Get all push subscriptions for the specified users
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth, user_id')
      .in('user_id', userIds);

    if (error || !subscriptions?.length) {
      return NextResponse.json({ 
        success: true, 
        sent: 0, 
        message: 'No active subscriptions found' 
      });
    }

    // Filter out users who have disabled push notifications
    const enabledUserIds = await Promise.all(
      userIds.map(async (userId) => {
        const canSend = await canSendNotification(userId, 'push');
        return canSend ? userId : null;
      })
    );
    
    const allowedUserIds = enabledUserIds.filter((id): id is string => id !== null);
    
    const filteredSubscriptions = subscriptions.filter(
      sub => allowedUserIds.includes(sub.user_id)
    );

    if (!filteredSubscriptions.length) {
      return NextResponse.json({ 
        success: true, 
        sent: 0, 
        message: 'All users have push notifications disabled' 
      });
    }

    // Send notifications
    const dispatchResult = await dispatchPushToMultiple({
      subscriptions: filteredSubscriptions.map(sub => ({
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      })),
      payload,
    });
    const results = dispatchResult.result ?? { success: [], expired: [], failed: [] };

    // Clean up expired subscriptions
    if (results.expired.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', results.expired);
      
      appLogger.info('push', 'Cleaned up expired subscriptions', { count: results.expired.length });
    }

    return NextResponse.json({
      success: true,
      sent: results.success.length,
      expired: results.expired.length,
      failed: results.failed.length,
    });
  } catch (error) {
    appLogger.error('push', 'Failed to send push notifications', { error: String(error) });
    return apiError({ 
      status: 500, 
      code: 'INTERNAL_ERROR', 
      message: 'Failed to send push notifications' 
    });
  }
}
