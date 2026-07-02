import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendEmailMock = vi.fn();
const sendSmsMock = vi.fn();
const sendPushToMultipleMock = vi.fn();

vi.mock('@/lib/email', () => ({
  sendEmail: sendEmailMock,
}));

vi.mock('@/lib/sms', () => ({
  sendSMS: sendSmsMock,
}));

vi.mock('@/lib/push-notifications', () => ({
  sendPushToMultiple: sendPushToMultipleMock,
}));

vi.mock('@/lib/logger', () => ({
  appLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('notification dispatcher kill-switches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.NOTIFY_EMAIL_ENABLED;
    delete process.env.NOTIFY_SMS_ENABLED;
    delete process.env.NOTIFY_PUSH_ENABLED;
  });

  it('keeps email enabled by default', async () => {
    sendEmailMock.mockResolvedValue({ success: true });
    const { dispatchEmail } = await import('@/lib/notifications/dispatch');

    const result = await dispatchEmail({ to: 'test@petpark.hr', subject: 'Test', html: '<p>Test</p>' });

    expect(result.status).toBe('sent');
    expect(sendEmailMock).toHaveBeenCalledOnce();
  });

  it('skips email when NOTIFY_EMAIL_ENABLED=false', async () => {
    process.env.NOTIFY_EMAIL_ENABLED = 'false';
    const { dispatchEmail } = await import('@/lib/notifications/dispatch');

    const result = await dispatchEmail({ to: 'test@petpark.hr', subject: 'Test', html: '<p>Test</p>' });

    expect(result.status).toBe('skipped');
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it('skips sms when NOTIFY_SMS_ENABLED=0', async () => {
    process.env.NOTIFY_SMS_ENABLED = '0';
    const { dispatchSms } = await import('@/lib/notifications/dispatch');

    const result = await dispatchSms({ to: '+38551123456', body: 'Test' });

    expect(result.status).toBe('skipped');
    expect(sendSmsMock).not.toHaveBeenCalled();
  });

  it('skips push when NOTIFY_PUSH_ENABLED=off', async () => {
    process.env.NOTIFY_PUSH_ENABLED = 'off';
    const { dispatchPushToMultiple } = await import('@/lib/notifications/dispatch');

    const result = await dispatchPushToMultiple({
      subscriptions: [],
      payload: { title: 'Test', body: 'Test' },
    });

    expect(result.status).toBe('skipped');
    expect(sendPushToMultipleMock).not.toHaveBeenCalled();
  });

  it('marks push failed when underlying sender reports failures', async () => {
    sendPushToMultipleMock.mockResolvedValue({ success: [], expired: [], failed: ['endpoint'] });
    const { dispatchPushToMultiple } = await import('@/lib/notifications/dispatch');

    const result = await dispatchPushToMultiple({
      subscriptions: [],
      payload: { title: 'Test', body: 'Test' },
    });

    expect(result.status).toBe('failed');
    expect(sendPushToMultipleMock).toHaveBeenCalledOnce();
  });
});
