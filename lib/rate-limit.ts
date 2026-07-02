// TODO(petpark): konsolidirano u lib/upstash-rate-limit.ts
export {
  checkRateLimit,
  createRateLimitResponse,
  getClientIdentifier,
  getRedisClient,
  isRedisConfigured,
  limit,
  rateLimitRequest,
  RateLimits,
  type RateLimitConfig,
  type RateLimitResult,
} from './upstash-rate-limit';

export type LegacyRateLimitResult = {
  allowed: boolean;
  remaining: number;
  reset: number;
};

/**
 * Legacy sync API was a production no-op because Redis checks are async.
 * Use `rateLimitAsync` / `checkRateLimit` in route handlers instead.
 */
export function rateLimit(_identifier: string, _points: number, _durationMs: number): never {
  throw new Error('rateLimit() sync API is disabled. Use rateLimitAsync() or checkRateLimit().');
}

export async function rateLimitAsync(
  identifier: string,
  points: number,
  durationMs: number,
  options: { route?: string; failClosed?: boolean } = {}
): Promise<boolean> {
  const { checkRateLimit } = await import('./upstash-rate-limit');
  const result = await checkRateLimit(identifier, {
    limit: points,
    windowSeconds: Math.max(1, Math.ceil(durationMs / 1000)),
    identifier: options.route || 'legacy:custom',
    failClosed: options.failClosed,
  });
  return result.success;
}
