import {
  createRateLimitResponse,
  getClientIdentifier,
  rateLimitRequest,
  RateLimits,
  type RateLimitConfig,
} from '@/lib/rate-limit';

export type PaymentRateLimitKind = keyof typeof PAYMENT_RATE_LIMITS;

export const PAYMENT_RATE_LIMITS = {
  connect: RateLimits.paymentConnect,
  accountLink: RateLimits.paymentAccountLink,
  accountStatus: RateLimits.paymentAccountStatus,
  checkout: RateLimits.paymentCheckout,
  dashboardLink: RateLimits.paymentDashboardLink,
  refund: RateLimits.paymentRefund,
  webhook: RateLimits.paymentWebhook,
} as const satisfies Record<string, RateLimitConfig>;

export async function enforcePaymentRateLimit(
  request: Request,
  kind: PaymentRateLimitKind,
  customIdentifier?: string
): Promise<Response | null> {
  const config = PAYMENT_RATE_LIMITS[kind];
  const identifier = customIdentifier || getClientIdentifier(request);
  const result = await rateLimitRequest(request, config, identifier);

  if (!result.success) {
    return createRateLimitResponse(result);
  }

  return null;
}
