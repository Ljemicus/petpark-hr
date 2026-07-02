# KIT-B dijagnostika (raw, 2026-07-02)

## 1. CSRF

### CSRF_EXCLUDED_ROUTES sadržaj:

proxy.ts:44:const CSRF_EXCLUDED_ROUTES = [
proxy.ts:58: return CSRF_EXCLUDED_ROUTES.some(route => pathname.startsWith(route));

### csrf datoteke:

total 16
drwx------ 3 ljemicus staff 96 May 31 11:18 .
drwx------ 83 ljemicus staff 2656 Jun 12 19:50 ..
-rw------- 1 ljemicus staff 4942 May 31 11:18 csrf.ts
middleware/csrf.ts
lib/security-audit.ts
lib/api/openapi-generator-fixed.ts
lib/csrf.ts
proxy.ts

## 2. Rate limit — tri datoteke i tko ih zove

### lib/rate-limit.ts

// Rate limiting with Upstash Redis for production
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis client if credentials are available
function createRedisClient(): Redis | null {
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
return null;
}

return new Redis({ url, token });
}

// Rate limit configurations
const rateLimits = {
// Strict limits for authentication endpoints
auth: {
limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
analytics: true,
},
// Standard API limits
api: {
limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
analytics: true,
},
// Generous limits for public pages
public: {
limiter: Ratelimit.slidingWindow(1000, '10 m'), // 1000 requests per 10 minutes
analytics: false,
},
// Strict limits for sensitive operations
sensitive: {
limiter: Ratelimit.slidingWindow(3, '1 m'), // 3 requests per minute
analytics: true,
},
};

// Get rate limiter for a specific type
export function getRateLimiter(type: keyof typeof rateLimits) {
const redis = createRedisClient();

if (!redis) {
// Return a no-op rate limiter if Redis is not configured
return {
limit: async () => ({ success: true, limit: 100, remaining: 100, reset: Date.now() + 60000 }),
};
}

const config = rateLimits[type];
return new Ratelimit({
redis,
limiter: config.limiter,
analytics: config.analytics,
prefix: `@upstash/ratelimit/${type}`,
});
}

### lib/rate-limiter.ts

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Redis client singleton
let redis: Redis | null = null;

/\*\*

- Gets or creates the Redis client
  \*/
  export function getRedisClient(): Redis {
  if (!redis) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

      if (!url || !token) {
        throw new Error('Upstash Redis credentials not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');
      }

      redis = new Redis({
        url,
        token,
      });

  }

return redis;
}

/\*\*

- Checks if Redis is configured
  \*/
  export function isRedisConfigured(): boolean {
  return !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
  );
  }

// Rate limiter instances cache
const limiters = new Map<string, Ratelimit>();

export interface RateLimitConfig {
/** Number of requests allowed in the window \*/
limit: number;
/** Time window in seconds _/
windowSeconds: number;
/\*\* Unique identifier for this rate limiter (e.g., 'auth:login') _/
identifier: string;
/\*_ Optional prefix for Redis keys _/
prefix?: string;
}

export interface RateLimitResult {
success: boolean;
limit: number;
remaining: number;
reset: number;
retryAfter?: number;
}

/\*\*

### lib/upstash-rate-limit.ts

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Redis client singleton
let redis: Redis | null = null;

/\*\*

- Gets or creates the Redis client
  \*/
  export function getRedisClient(): Redis {
  if (!redis) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

      if (!url || !token) {
        throw new Error('Upstash Redis credentials not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');
      }

      redis = new Redis({
        url,
        token,
      });

  }

return redis;
}

/\*\*

- Checks if Redis is configured
  \*/
  export function isRedisConfigured(): boolean {
  return !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
  );
  }

// Rate limiter instances cache
const limiters = new Map<string, Ratelimit>();

export interface RateLimitConfig {
/** Number of requests allowed in the window \*/
limit: number;
/** Time window in seconds _/
windowSeconds: number;
/\*\* Unique identifier for this rate limiter (e.g., 'auth:login') _/
identifier: string;
/\*_ Optional prefix for Redis keys _/
prefix?: string;
}

export interface RateLimitResult {
success: boolean;
limit: number;
remaining: number;
reset: number;
retryAfter?: number;
}

/\*\*

### Pozivatelji rate-limit funkcija:

app/(site)/api/sitters/route.ts:5:import { rateLimit } from '@/lib/rate-limit';
app/(site)/api/sitters/route.ts:17: if (!rateLimit(`sitters:list:${ip}`, 60, 60_000)) {
app/(site)/api/messages/route.ts:10:import { checkRateLimit, RateLimits, getClientIdentifier } from '@/lib/upstash-rate-limit';
app/(site)/api/messages/route.ts:33: const rateLimitResult = await checkRateLimit(`${ip}:${user.id}`, RateLimits.messages);
app/(site)/api/messages/route.ts:34: if (!rateLimitResult.success) {
app/(site)/api/lost-pets/[id]/relay/route.ts:8:import { rateLimit } from '@/lib/rate-limit';
app/(site)/api/lost-pets/[id]/relay/route.ts:37: if (!rateLimit(`lost-pet-relay:${id}:${ip}`, 3, 10 _ 60_000)) {
app/(site)/api/lost-pets/[id]/sightings/route.ts:9:import { rateLimit } from '@/lib/rate-limit';
app/(site)/api/lost-pets/[id]/sightings/route.ts:35: if (!rateLimit(`lost-pet-sighting:${id}:${ip}`, 5, 10 _ 60_000)) {
app/(site)/api/auth/register/route.ts:10:import { checkRateLimit, RateLimits, getClientIdentifier } from '@/lib/upstash-rate-limit';
app/(site)/api/auth/register/route.ts:15: const rateLimitResult = await checkRateLimit(ip, RateLimits.register);
app/(site)/api/auth/register/route.ts:16: if (!rateLimitResult.success) {
app/(site)/api/auth/forgot-password/route.ts:5:import { checkRateLimit, RateLimits, getClientIdentifier } from '@/lib/upstash-rate-limit';
app/(site)/api/auth/forgot-password/route.ts:12: const rateLimitResult = await checkRateLimit(ip, RateLimits.forgotPassword);
app/(site)/api/auth/forgot-password/route.ts:13: if (!rateLimitResult.success) {
app/(site)/api/auth/login/route.ts:9:import { checkRateLimit, RateLimits, getClientIdentifier } from '@/lib/upstash-rate-limit';
app/(site)/api/auth/login/route.ts:18: const rateLimitResult = await checkRateLimit(ip, RateLimits.login);
app/(site)/api/auth/login/route.ts:19: if (!rateLimitResult.success) {
app/(site)/api/groomers/route.ts:5:import { rateLimit } from '@/lib/rate-limit';
app/(site)/api/groomers/route.ts:13: if (!rateLimit(`groomers:list:${ip}`, 60, 60_000)) {
app/(site)/api/trainers/[id]/programs/route.ts:3:import { rateLimit } from '@/lib/rate-limit';
app/(site)/api/trainers/[id]/programs/route.ts:10: if (!rateLimit(`trainer:programs:${ip}`, 60, 60_000)) {
app/(site)/api/social/comments/route.ts:3:import { checkRateLimit, RateLimits, getClientIdentifier } from '@/lib/upstash-rate-limit';
app/(site)/api/social/comments/route.ts:53: const rateLimitResult = await checkRateLimit(`${ip}:${user.id}`, RateLimits.socialComments);
app/(site)/api/social/comments/route.ts:54: if (!rateLimitResult.success) {
app/(site)/api/social/posts/route.ts:3:import { checkRateLimit, RateLimits, getClientIdentifier } from '@/lib/upstash-rate-limit';
app/(site)/api/social/posts/route.ts:71: const rateLimitResult = await checkRateLimit(`${ip}:${user.id}`, RateLimits.socialPosts);
app/(site)/api/social/posts/route.ts:72: if (!rateLimitResult.success) {
app/(site)/api/support/route.ts:6:import { rateLimit } from '@/lib/rate-limit';
app/(site)/api/support/route.ts:23: if (!rateLimit(key, 3, 10 _ 60_000)) {
app/(site)/api/rescue-verification-documents/upload/route.ts:12:import { rateLimit } from '@/lib/rate-limit';
app/(site)/api/rescue-verification-documents/upload/route.ts:45: if (!rateLimit(`rescue-verification-upload:${user.id}:${ip}`, 6, 60_000)) {
app/(site)/api/appeals/donation-click/route.ts:4:import { rateLimit } from '@/lib/rate-limit';
app/(site)/api/appeals/donation-click/route.ts:30: const rateLimitKey = `donation-click:${ip}:${appealId}`;
app/(site)/api/appeals/donation-click/route.ts:31: if (!rateLimit(rateLimitKey, 3, 10 _ 60 \* 1000)) {
app/(site)/api/availability/route.ts:5:import { rateLimit } from '@/lib/rate-limit';
app/(site)/api/availability/route.ts:33: if (!rateLimit(`availability:${ip}`, 120, 60_000)) {
app/(site)/api/trainer-programs/route.ts:6:import { rateLimit } from '@/lib/rate-limit';
app/(site)/api/trainer-programs/route.ts:49: if (!rateLimit(`trainer:programs:write:${ip}`, 20, 60_000)) {
app/(site)/api/trainer-programs/route.ts:97: if (!rateLimit(`trainer:programs:write:${ip}`, 20, 60_000)) {
app/(site)/api/trainer-programs/route.ts:149: if (!rateLimit(`trainer:programs:write:${ip}`, 20, 60_000)) {
app/(site)/api/booking-requests/route.ts:4:import { createRateLimitResponse, rateLimitRequest, RateLimits } from '@/lib/rate-limiter';
app/(site)/api/booking-requests/route.ts:9: const rateLimit = await rateLimitRequest(request, { ...RateLimits.apiWrite, identifier: 'booking-requests:create' });
app/(site)/api/booking-requests/route.ts:10: if (!rateLimit.success) {
app/(site)/api/booking-requests/route.ts:11: return createRateLimitResponse(rateLimit);
app/(site)/api/booking-requests/[id]/messages/route.ts:5:import { createRateLimitResponse, rateLimitRequest, RateLimits } from '@/lib/rate-limiter';
app/(site)/api/booking-requests/[id]/messages/route.ts:27: const rateLimit = await rateLimitRequest(request, { ...RateLimits.messages, identifier: 'booking-request-messages' }, user.id);
app/(site)/api/booking-requests/[id]/messages/route.ts:28: if (!rateLimit.success) return createRateLimitResponse(rateLimit);
app/(site)/api/booking-requests/[id]/status/route.ts:3:import { createRateLimitResponse, rateLimitRequest, RateLimits } from '@/lib/rate-limiter';
app/(site)/api/booking-requests/[id]/status/route.ts:9: const rateLimit = await rateLimitRequest(request, { ...RateLimits.apiWrite, identifier: 'booking-requests:status' });

## 3. Service-role upotreba (svaka linija = kandidat za pregled)

app/(site)/api/payments/webhook/route.ts:49: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
app/(site)/api/auth/register/route.ts:115: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
app/(site)/api/auth/register/route.ts:119: const adminClient = createSupabaseClient(supabaseUrl, serviceRoleKey);
app/(site)/api/auth/register/route.ts:120: const { error: confirmError } = await adminClient.auth.admin.updateUserById(data.user.id, {
app/(site)/api/health/route.ts:24: const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
app/(site)/api/admin/verifications/documents/route.ts:20: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
app/(site)/api/rescue-verification-documents/[documentId]/signed-url/route.ts:38: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
app/(site)/api/rescue-verification-documents/upload/route.ts:81: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
app/(site)/api/rescue-verification-documents/upload/route.ts:97: const adminClient = createAdminClient(supabaseUrl, serviceRoleKey);
app/(site)/api/rescue-verification-documents/upload/route.ts:101: const { error: uploadError } = await adminClient.storage.from(BUCKET).upload(storagePath, buffer, {
app/(site)/api/rescue-verification-documents/upload/route.ts:137: await adminClient.storage.from(BUCKET).remove([storagePath]).catch(() => undefined);
app/(site)/api/upload/verification/route.ts:72: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
app/(site)/api/upload/route.ts:56: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
app/(site)/api/analytics/funnel/route.ts:18: const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
lib/ops-audit.ts:55: const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
lib/kpi-digest.ts:37: const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
lib/supabase/admin.ts:5: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
lib/env-check.ts:22: { name: 'SUPABASE_SERVICE_ROLE_KEY', prodOnly: true },
lib/db/provider-directory-linking.ts:69: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
lib/db/breeders.ts:94: process.env.SUPABASE_SERVICE_ROLE_KEY!,
lib/api/env-check.ts:153: key: 'SUPABASE_SERVICE_ROLE_KEY',
lib/api/env.ts:22: serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
lib/api/env.ts:81: throw new Error('SUPABASE_SERVICE_ROLE_KEY can only be accessed on the server');
lib/api/env.ts:83: return process.env.SUPABASE_SERVICE_ROLE_KEY || '';
lib/api/env.ts:150:- \`SUPABASE_SERVICE_ROLE_KEY\`: Supabase service role key (server only)

## 4. Registracijski tok — email confirm signali

app/(site)/api/auth/register/route.ts:121: email_confirm: true,

## 5. Upload rute — trenutna validacija

### app/(site)/api/rescue-verification-documents/upload/route.ts

13:import type { RescueVerificationDocumentType } from '@/lib/types';
51: const documentType = String(formData.get('document_type') ?? '').trim() as RescueVerificationDocumentType;
72: if (!ALLOWED_TYPES.has(file.type)) {
76: if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
92: const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
95: const storagePath = `orgs/${organization.id}/${safeType}/${Date.now()}-${crypto.randomUUID()}-${safeFileStem}.${extension}`;
104: contentType: file.type,
126: document_type: documentType,
127: storage_bucket: BUCKET,
131: mime_type: file.type || null,
132: file_size_bytes: file.size,
153: fileSize: file.size,
154: mimeType: file.type,

### app/(site)/api/upload/verification/route.ts

47: const documentType = ((formData.get('document_type') as string) || '').trim();
54: if (!ALLOWED_TYPES.has(file.type)) {
55: log.warn( 'Upload rejected — invalid file type', { userId: user.id, fileType: file.type });
62: if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
63: log.warn( 'Upload rejected — file too large', { userId: user.id, fileSize: file.size });
67: log.warn( 'Upload rejected — invalid doc type', { userId: user.id, documentType });
68: return apiError({ status: 400, code: 'INVALID_DOC_TYPE', message: 'Invalid document type' });
95: contentType: file.type,
101: bucket: BUCKET,
119: fileSize: file.size,
120: fileType: file.type,
125: bucket: BUCKET,
127: document_type: documentType,
129: size: file.size,

### app/(site)/api/upload/route.ts

36: const requestedBucket = ((formData.get('bucket') as string) || 'pet-photos').trim();
44: const allowedTypes = isPrivateBucket ? VERIFICATION_TYPES : ALLOWED_TYPES;
45: if (!allowedTypes.has(file.type)) {
48: if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
52: return apiError({ status: 400, code: 'INVALID_BUCKET', message: 'Invalid bucket' });
69: const bucket = requestedBucket;
78: const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
81: contentType: file.type,
87: bucket,
95: value: `bucket=${bucket}, error=${error.message}`,
103: bucket,
105: fileSize: file.size,
106: fileType: file.type,
113: size: file.size,
114: bucket,
119: const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
124: size: file.size,
125: bucket,

### app/(site)/api/rescue-verification-documents/[documentId]/signed-url/route.ts

45: .from(document.storage_bucket)

### app/(site)/api/rescue-verification-documents/upload/route.ts

13:import type { RescueVerificationDocumentType } from '@/lib/types';
51: const documentType = String(formData.get('document_type') ?? '').trim() as RescueVerificationDocumentType;
72: if (!ALLOWED_TYPES.has(file.type)) {
76: if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
92: const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
95: const storagePath = `orgs/${organization.id}/${safeType}/${Date.now()}-${crypto.randomUUID()}-${safeFileStem}.${extension}`;
104: contentType: file.type,
126: document_type: documentType,
127: storage_bucket: BUCKET,
131: mime_type: file.type || null,
132: file_size_bytes: file.size,
153: fileSize: file.size,
154: mimeType: file.type,

## 6. Platne rute — postoji li flag provjera prije Stripe poziva

### app/(site)/api/payments/webhook/route.ts

19: const stripe = getStripe();
36: event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

### app/(site)/api/payments/create-checkout/route.ts
