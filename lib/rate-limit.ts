import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

let redis: Redis | null = null;
const limiters = new Map<string, Ratelimit>();
const memoryStore = new Map<string, { count: number; resetTime: number }>();
const MEMORY_CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

export interface RateLimitConfig {
  limit: number;
  windowSeconds: number;
  identifier: string;
  prefix?: string;
  /** Sensitive routes fail closed when Redis is unavailable or errors. */
  failClosed?: boolean;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
  reason?: 'redis_unavailable' | 'redis_error' | 'limited';
}

export type LegacyRateLimitResult = {
  allowed: boolean;
  remaining: number;
  reset: number;
};

export function getRedisClient(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error('Upstash Redis credentials not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');
    }

    redis = new Redis({ url, token });
  }

  return redis;
}

export function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function getRateLimiter(config: RateLimitConfig): Ratelimit {
  const cacheKey = `${config.identifier}:${config.limit}:${config.windowSeconds}:${config.prefix ?? 'ratelimit'}`;
  const cached = limiters.get(cacheKey);
  if (cached) return cached;

  const limiter = new Ratelimit({
    redis: getRedisClient(),
    limiter: Ratelimit.slidingWindow(config.limit, `${config.windowSeconds}s`),
    analytics: true,
    prefix: config.prefix || 'ratelimit',
  });

  limiters.set(cacheKey, limiter);
  return limiter;
}

function deny(config: RateLimitConfig, reason: RateLimitResult['reason']): RateLimitResult {
  const retryAfter = Math.max(config.windowSeconds, 1);
  return {
    success: false,
    limit: config.limit,
    remaining: 0,
    reset: Date.now() + retryAfter * 1000,
    retryAfter,
    reason,
  };
}

function checkMemoryRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const fullKey = `${config.identifier}:${key}`;

  if (now - lastCleanup > MEMORY_CLEANUP_INTERVAL) {
    lastCleanup = now;
    for (const k of Array.from(memoryStore.keys())) {
      const value = memoryStore.get(k);
      if (value && now > value.resetTime) memoryStore.delete(k);
    }
  }

  const entry = memoryStore.get(fullKey);
  if (!entry || now > entry.resetTime) {
    memoryStore.set(fullKey, { count: 1, resetTime: now + windowMs });
    return { success: true, limit: config.limit, remaining: config.limit - 1, reset: now + windowMs };
  }

  if (entry.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      reason: 'limited',
    };
  }

  entry.count += 1;
  return { success: true, limit: config.limit, remaining: config.limit - entry.count, reset: entry.resetTime };
}

export async function checkRateLimit(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
  if (!isRedisConfigured()) {
    console.warn('[rate-limit] Redis not configured', { identifier: config.identifier, failClosed: Boolean(config.failClosed) });
    return config.failClosed ? deny(config, 'redis_unavailable') : checkMemoryRateLimit(key, config);
  }

  try {
    const result = await getRateLimiter(config).limit(`${config.identifier}:${key}`);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: result.success ? undefined : Math.ceil((result.reset - Date.now()) / 1000),
      reason: result.success ? undefined : 'limited',
    };
  } catch (error) {
    console.error('[rate-limit] Redis error', { identifier: config.identifier, failClosed: Boolean(config.failClosed), error });
    return config.failClosed ? deny(config, 'redis_error') : checkMemoryRateLimit(key, config);
  }
}

export const RateLimits = {
  login: { limit: 10, windowSeconds: 15 * 60, identifier: 'auth:login', failClosed: true },
  register: { limit: 5, windowSeconds: 60 * 60, identifier: 'auth:register', failClosed: true },
  forgotPassword: { limit: 5, windowSeconds: 60 * 60, identifier: 'auth:forgot-password', failClosed: true },
  passwordReset: { limit: 5, windowSeconds: 60 * 60, identifier: 'auth:password-reset', failClosed: true },
  auth: { limit: 10, windowSeconds: 15 * 60, identifier: 'auth', failClosed: true },

  api: { limit: 100, windowSeconds: 60, identifier: 'api' },
  apiGeneral: { limit: 100, windowSeconds: 60, identifier: 'api:general' },
  apiWrite: { limit: 60, windowSeconds: 15 * 60, identifier: 'api:write' },

  bookingRequestCreate: { limit: 10, windowSeconds: 60 * 60, identifier: 'booking-request:create', failClosed: true },
  lostPetRelayIp: { limit: 3, windowSeconds: 60 * 60, identifier: 'lost-pets:relay:ip', failClosed: true },
  lostPetRelayUser: { limit: 10, windowSeconds: 24 * 60 * 60, identifier: 'lost-pets:relay:user', failClosed: true },
  smsSend: { limit: 5, windowSeconds: 60 * 60, identifier: 'sms:send', failClosed: true },
  emailSend: { limit: 10, windowSeconds: 60 * 60, identifier: 'email:send', failClosed: true },
  pushSend: { limit: 20, windowSeconds: 60 * 60, identifier: 'push:send', failClosed: true },
  uploads: { limit: 20, windowSeconds: 60 * 60, identifier: 'uploads', failClosed: true },

  social: { limit: 10, windowSeconds: 60, identifier: 'social' },
  socialPosts: { limit: 10, windowSeconds: 60, identifier: 'social:posts' },
  socialComments: { limit: 20, windowSeconds: 60, identifier: 'social:comments' },
  socialLikes: { limit: 30, windowSeconds: 60, identifier: 'social:likes' },
  messages: { limit: 30, windowSeconds: 60, identifier: 'messages:send' },
} as const;

export async function rateLimitRequest(
  request: Request,
  config: Omit<RateLimitConfig, 'identifier'> & { identifier?: string },
  customIdentifier?: string
): Promise<RateLimitResult> {
  const fullConfig: RateLimitConfig = {
    ...config,
    identifier: config.identifier || 'api:general',
  };
  return checkRateLimit(customIdentifier || getClientIdentifier(request), fullConfig);
}

export function getClientIdentifier(request: Request): string {
  const headers = request.headers;
  const forwarded = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const cfConnectingIp = headers.get('cf-connecting-ip');
  return cfConnectingIp || realIp || forwarded?.split(',')[0]?.trim() || 'unknown';
}

export function createRateLimitResponse(result: RateLimitResult): Response {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
  });
  if (result.retryAfter) headers.set('Retry-After', String(result.retryAfter));

  return new Response(
    JSON.stringify({
      error: 'Previše zahtjeva. Pokušaj ponovno kasnije.',
      code: 'RATE_LIMITED',
      retryAfter: result.retryAfter,
    }),
    { status: 429, headers }
  );
}

export async function limit(
  key: string,
  config: Pick<RateLimitConfig, 'windowSeconds' | 'identifier' | 'failClosed'> & { requests: number; prefix?: string }
): Promise<{ success: boolean; remaining: number; retryAfter?: number }> {
  const result = await checkRateLimit(key, {
    limit: config.requests,
    windowSeconds: config.windowSeconds,
    identifier: config.identifier,
    prefix: config.prefix,
    failClosed: config.failClosed,
  });
  return { success: result.success, remaining: result.remaining, retryAfter: result.retryAfter };
}

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
  const result = await checkRateLimit(identifier, {
    limit: points,
    windowSeconds: Math.max(1, Math.ceil(durationMs / 1000)),
    identifier: options.route || 'legacy:custom',
    failClosed: options.failClosed,
  });
  return result.success;
}
