import { sendEmail } from '@/lib/email';
import { appLogger } from '@/lib/logger';
import { sendPushToMultiple, type NotificationPayload, type PushSubscription } from '@/lib/push-notifications';
import { sendSMS, type SMSMessage, type SMSResult } from '@/lib/sms';

type NotificationChannel = 'email' | 'push' | 'sms';

export type DispatchStatus = 'sent' | 'skipped' | 'failed';

export interface DispatchResult<T = unknown> {
  status: DispatchStatus;
  channel: NotificationChannel;
  reason?: string;
  result?: T;
}

export interface DispatchEmailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export interface DispatchPushInput {
  subscriptions: PushSubscription[];
  payload: NotificationPayload;
}

function isChannelEnabled(channel: NotificationChannel): boolean {
  const envName = `NOTIFY_${channel.toUpperCase()}_ENABLED`;
  const value = process.env[envName];

  // Default keeps current behavior. Only explicit false/0/off disables a channel.
  return !value || !['false', '0', 'off'].includes(value.toLowerCase());
}

function skipped<T>(channel: NotificationChannel, reason: string): DispatchResult<T> {
  appLogger.info('notifications.dispatch', 'Notification channel skipped', { channel, reason });
  return { status: 'skipped', channel, reason };
}

export async function dispatchEmail(input: DispatchEmailInput): Promise<DispatchResult<Awaited<ReturnType<typeof sendEmail>>>> {
  if (!isChannelEnabled('email')) return skipped('email', 'NOTIFY_EMAIL_ENABLED=false');

  const result = await sendEmail(input);
  return { status: result.success ? 'sent' : 'failed', channel: 'email', result };
}

export async function dispatchSms(input: SMSMessage): Promise<DispatchResult<SMSResult>> {
  if (!isChannelEnabled('sms')) return skipped('sms', 'NOTIFY_SMS_ENABLED=false');

  const result = await sendSMS(input);
  return { status: result.success ? 'sent' : 'failed', channel: 'sms', result };
}

export async function dispatchPushToMultiple(input: DispatchPushInput): Promise<DispatchResult<Awaited<ReturnType<typeof sendPushToMultiple>>>> {
  if (!isChannelEnabled('push')) return skipped('push', 'NOTIFY_PUSH_ENABLED=false');

  const result = await sendPushToMultiple(input.subscriptions, input.payload);
  return {
    status: result.failed.length === 0 ? 'sent' : 'failed',
    channel: 'push',
    result,
  };
}

export const notificationDispatch = {
  email: dispatchEmail,
  pushToMultiple: dispatchPushToMultiple,
  sms: dispatchSms,
  isChannelEnabled,
};
