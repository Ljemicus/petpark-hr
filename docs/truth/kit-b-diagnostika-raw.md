# KIT-B dijagnostika (raw, 2026-07-03)

## 1. CSRF

### CSRF_EXCLUDED_ROUTES sadržaj:

proxy.ts:44:const CSRF_EXCLUDED_ROUTES = [
proxy.ts:50: return CSRF_EXCLUDED_ROUTES.some(route => pathname.startsWith(route));

### csrf datoteke:

total 16
drwx------ 3 ljemicus staff 96 May 31 11:18 .
drwx------ 84 ljemicus staff 2688 Jul 3 13:57 ..
-rw------- 1 ljemicus staff 5402 Jul 2 18:20 csrf.ts
middleware/csrf.ts
lib/security-audit.ts
lib/api/openapi-generator-fixed.ts
lib/csrf.ts
proxy.ts

## 2. Rate limit — tri datoteke i tko ih zove

### lib/rate-limit.ts

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

/\*\*

- Legacy sync API was a production no-op because Redis checks are async.
- Use `rateLimitAsync` / `checkRateLimit` in route handlers instead.
  \*/
  export function rateLimit(\_identifier: string, \_points: number, \_durationMs: number): never {
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

### lib/rate-limiter.ts

// TODO(petpark): konsolidirano u lib/upstash-rate-limit.ts
export \* from './upstash-rate-limit';

### lib/upstash-rate-limit.ts

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

let redis: Redis | null = null;
const limiters = new Map<string, Ratelimit>();
const memoryStore = new Map<string, { count: number; resetTime: number }>();
const MEMORY_CLEANUP_INTERVAL = 5 _ 60 _ 1000;
let lastCleanup = Date.now();

export interface RateLimitConfig {
limit: number;
windowSeconds: number;
identifier: string;
prefix?: string;
/\*_ Sensitive routes fail closed when Redis is unavailable or errors. _/
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

### Pozivatelji rate-limit funkcija:

app/(site)/api/sitters/route.ts:5:import { rateLimitAsync } from '@/lib/rate-limit';
app/(site)/api/sitters/route.ts:17: if (!(await rateLimitAsync(`sitters:list:${ip}`, 60, 60_000, { route: 'sitters-list', failClosed: false }))) {
app/(site)/api/messages/route.ts:10:import { checkRateLimit, RateLimits, getClientIdentifier } from '@/lib/upstash-rate-limit';
app/(site)/api/messages/route.ts:33: const rateLimitResult = await checkRateLimit(`${ip}:${user.id}`, RateLimits.messages);
app/(site)/api/messages/route.ts:34: if (!rateLimitResult.success) {
app/(site)/api/lost-pets/[id]/relay/route.ts:8:import { rateLimitAsync } from '@/lib/rate-limit';
app/(site)/api/lost-pets/[id]/relay/route.ts:37: if (!(await rateLimitAsync(`lost-pet-relay:${id}:${ip}`, 3, 10 _ 60_000, { route: 'lost-pet-relay', failClosed: true }))) {
app/(site)/api/lost-pets/[id]/sightings/route.ts:9:import { rateLimitAsync } from '@/lib/rate-limit';
app/(site)/api/lost-pets/[id]/sightings/route.ts:35: if (!(await rateLimitAsync(`lost-pet-sighting:${id}:${ip}`, 5, 10 _ 60_000, { route: 'lost-pet-sighting', failClosed: true }))) {
app/(site)/api/auth/register/route.ts:9:import { checkRateLimit, RateLimits, getClientIdentifier } from '@/lib/upstash-rate-limit';
app/(site)/api/auth/register/route.ts:14: const rateLimitResult = await checkRateLimit(ip, RateLimits.register);
app/(site)/api/auth/register/route.ts:15: if (!rateLimitResult.success) {
app/(site)/api/auth/forgot-password/route.ts:5:import { checkRateLimit, RateLimits, getClientIdentifier } from '@/lib/upstash-rate-limit';
app/(site)/api/auth/forgot-password/route.ts:12: const rateLimitResult = await checkRateLimit(ip, RateLimits.forgotPassword);
app/(site)/api/auth/forgot-password/route.ts:13: if (!rateLimitResult.success) {
app/(site)/api/auth/login/route.ts:9:import { checkRateLimit, RateLimits, getClientIdentifier } from '@/lib/upstash-rate-limit';
app/(site)/api/auth/login/route.ts:18: const rateLimitResult = await checkRateLimit(ip, RateLimits.login);
app/(site)/api/auth/login/route.ts:19: if (!rateLimitResult.success) {
app/(site)/api/groomers/route.ts:5:import { rateLimitAsync } from '@/lib/rate-limit';
app/(site)/api/groomers/route.ts:13: if (!(await rateLimitAsync(`groomers:list:${ip}`, 60, 60_000, { route: 'groomers-list', failClosed: false }))) {
app/(site)/api/trainers/[id]/programs/route.ts:3:import { rateLimitAsync } from '@/lib/rate-limit';
app/(site)/api/trainers/[id]/programs/route.ts:10: if (!(await rateLimitAsync(`trainer:programs:${ip}`, 60, 60_000, { route: 'trainer-programs-list', failClosed: false }))) {
app/(site)/api/social/comments/route.ts:3:import { checkRateLimit, RateLimits, getClientIdentifier } from '@/lib/upstash-rate-limit';
app/(site)/api/social/comments/route.ts:53: const rateLimitResult = await checkRateLimit(`${ip}:${user.id}`, RateLimits.socialComments);
app/(site)/api/social/comments/route.ts:54: if (!rateLimitResult.success) {
app/(site)/api/social/posts/route.ts:3:import { checkRateLimit, RateLimits, getClientIdentifier } from '@/lib/upstash-rate-limit';
app/(site)/api/social/posts/route.ts:71: const rateLimitResult = await checkRateLimit(`${ip}:${user.id}`, RateLimits.socialPosts);
app/(site)/api/social/posts/route.ts:72: if (!rateLimitResult.success) {
app/(site)/api/support/route.ts:6:import { rateLimitAsync } from '@/lib/rate-limit';
app/(site)/api/support/route.ts:23: if (!(await rateLimitAsync(key, 3, 10 _ 60_000, { route: 'support', failClosed: true }))) {
app/(site)/api/rescue-verification-documents/upload/route.ts:12:import { rateLimitAsync } from '@/lib/rate-limit';
app/(site)/api/rescue-verification-documents/upload/route.ts:50: if (!(await rateLimitAsync(`rescue-verification-upload:${user.id}:${ip}`, 6, 60_000, { route: 'rescue-verification-upload', failClosed: true }))) {
app/(site)/api/appeals/donation-click/route.ts:4:import { rateLimitAsync } from '@/lib/rate-limit';
app/(site)/api/appeals/donation-click/route.ts:30: const rateLimitKey = `donation-click:${ip}:${appealId}`;
app/(site)/api/appeals/donation-click/route.ts:31: if (!(await rateLimitAsync(rateLimitKey, 3, 10 _ 60 \* 1000, { route: 'donation-click', failClosed: false }))) {
app/(site)/api/availability/route.ts:5:import { rateLimitAsync } from '@/lib/rate-limit';
app/(site)/api/availability/route.ts:33: if (!(await rateLimitAsync(`availability:${ip}`, 120, 60_000, { route: 'availability', failClosed: false }))) {
app/(site)/api/trainer-programs/route.ts:6:import { rateLimitAsync } from '@/lib/rate-limit';
app/(site)/api/trainer-programs/route.ts:49: if (!(await rateLimitAsync(`trainer:programs:write:${ip}`, 20, 60_000, { route: 'trainer-programs-write', failClosed: false }))) {
app/(site)/api/trainer-programs/route.ts:97: if (!(await rateLimitAsync(`trainer:programs:write:${ip}`, 20, 60_000, { route: 'trainer-programs-write', failClosed: false }))) {
app/(site)/api/trainer-programs/route.ts:149: if (!(await rateLimitAsync(`trainer:programs:write:${ip}`, 20, 60_000, { route: 'trainer-programs-write', failClosed: false }))) {
app/(site)/api/booking-requests/route.ts:4:import { createRateLimitResponse, rateLimitRequest, RateLimits } from '@/lib/upstash-rate-limit';
app/(site)/api/booking-requests/route.ts:9: const rateLimit = await rateLimitRequest(request, RateLimits.bookingRequestCreate);
app/(site)/api/booking-requests/route.ts:10: if (!rateLimit.success) {
app/(site)/api/booking-requests/route.ts:11: return createRateLimitResponse(rateLimit);
app/(site)/api/booking-requests/[id]/messages/route.ts:5:import { createRateLimitResponse, rateLimitRequest, RateLimits } from '@/lib/upstash-rate-limit';
app/(site)/api/booking-requests/[id]/messages/route.ts:27: const rateLimit = await rateLimitRequest(request, { ...RateLimits.messages, identifier: 'booking-request-messages' }, user.id);
app/(site)/api/booking-requests/[id]/messages/route.ts:28: if (!rateLimit.success) return createRateLimitResponse(rateLimit);
app/(site)/api/booking-requests/[id]/status/route.ts:3:import { createRateLimitResponse, rateLimitRequest, RateLimits } from '@/lib/upstash-rate-limit';
app/(site)/api/booking-requests/[id]/status/route.ts:9: const rateLimit = await rateLimitRequest(request, { ...RateLimits.apiWrite, identifier: 'booking-requests:status' });

## 3. Service-role upotreba (svaka linija = kandidat za pregled)

app/(site)/api/payments/webhook/route.ts:54: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
app/(site)/api/health/route.ts:21: const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
app/(site)/api/admin/verifications/documents/route.ts:20: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
app/(site)/api/rescue-verification-documents/[documentId]/signed-url/route.ts:38: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
app/(site)/api/rescue-verification-documents/upload/route.ts:86: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
app/(site)/api/rescue-verification-documents/upload/route.ts:102: const adminClient = createAdminClient(supabaseUrl, serviceRoleKey);
app/(site)/api/rescue-verification-documents/upload/route.ts:110: const { error: uploadError } = await adminClient.storage.from(BUCKET).upload(storagePath, buffer, {
app/(site)/api/rescue-verification-documents/upload/route.ts:146: await adminClient.storage.from(BUCKET).remove([storagePath]).catch(() => undefined);
app/(site)/api/upload/verification/route.ts:79: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
app/(site)/api/upload/route.ts:70: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
app/(site)/api/analytics/funnel/route.ts:18: const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
lib/ops-audit.ts:55: const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
lib/kpi-digest.ts:37: const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
lib/supabase/admin.ts:5: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
lib/env-check.ts:22: { name: 'SUPABASE_SERVICE_ROLE_KEY', prodOnly: true },
lib/db/provider-directory-linking.ts:69: const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
lib/db/breeders.ts:94: process.env.SUPABASE_SERVICE_ROLE_KEY!,
lib/api/env-check.ts:153: key: 'SUPABASE_SERVICE_ROLE_KEY',
lib/api/env.ts:22: serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
lib/api/env.ts:77: throw new Error('SUPABASE_SERVICE_ROLE_KEY can only be accessed on the server');
lib/api/env.ts:79: return process.env.SUPABASE_SERVICE_ROLE_KEY || '';
lib/api/env.ts:136:- \`SUPABASE_SERVICE_ROLE_KEY\`: Supabase service role key (server only)

## 4. Registracijski tok — email confirm signali

(nema direktnih pogodaka — čitaj auth rute ručno)

## 5. Upload rute — trenutna validacija

### app/(site)/api/rescue-verification-documents/upload/route.ts

19:import type { RescueVerificationDocumentType } from '@/lib/types';
56: const documentType = String(formData.get('document_type') ?? '').trim() as RescueVerificationDocumentType;
77: if (!isSupportedUploadMime(file.type) || !ALLOWED_TYPES.has(file.type)) {
81: if (file.size <= 0 || file.size > MAX_DOCUMENT_BYTES) {
97: const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
100: const storagePath = `orgs/${organization.id}/${safeType}/${Date.now()}-${crypto.randomUUID()}-${safeFileStem}.${extension}`;
105: const signature = validateUploadSignature(buffer, file.type, ALLOWED_TYPES);
113: contentType: signature.mime,
135: document_type: documentType,
136: storage_bucket: BUCKET,
140: mime_type: signature.mime,
141: file_size_bytes: file.size,
162: fileSize: file.size,
163: mimeType: signature.mime,

### app/(site)/api/upload/verification/route.ts

48: document_type: ((formData.get('document_type') as string) || '').trim(),
54: const documentType = metadata.data.document_type;
61: if (!isSupportedUploadMime(file.type) || !ALLOWED_TYPES.has(file.type)) {
62: log.warn( 'Upload rejected — invalid file type', { userId: user.id, fileType: file.type });
69: if (file.size <= 0 || file.size > MAX_DOCUMENT_BYTES) {
70: log.warn( 'Upload rejected — file too large', { userId: user.id, fileSize: file.size });
74: log.warn( 'Upload rejected — invalid doc type', { userId: user.id, documentType });
75: return apiError({ status: 400, code: 'INVALID_DOC_TYPE', message: 'Invalid document type' });
98: const signature = validateUploadSignature(buffer, file.type, ALLOWED_TYPES);
100: log.warn('Upload rejected — invalid file signature', { userId: user.id, fileType: file.type });
107: contentType: signature.mime,
113: bucket: BUCKET,
131: fileSize: file.size,
132: fileType: file.type,
137: bucket: BUCKET,
139: document_type: documentType,
141: size: file.size,

### app/(site)/api/upload/route.ts

43: bucket: ((formData.get('bucket') as string) || 'pet-photos').trim(),
49: const requestedBucket = metadata.data.bucket;
57: const allowedTypes = isPrivateBucket ? VERIFICATION_TYPES : ALLOWED_TYPES;
58: if (!isSupportedUploadMime(file.type) || !allowedTypes.has(file.type)) {
61: const maxFileSize = getUploadSizeLimit(allowedTypes);
62: if (file.size <= 0 || file.size > maxFileSize) {
66: return apiError({ status: 400, code: 'INVALID_BUCKET', message: 'Invalid bucket' });
83: const bucket = requestedBucket;
91: const signature = validateUploadSignature(buffer, file.type, allowedTypes);
96: const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
99: contentType: signature.mime,
105: bucket,
113: value: `bucket=${bucket}, error=${error.message}`,
121: bucket,
123: fileSize: file.size,
124: fileType: file.type,
131: size: file.size,
132: bucket,
137: const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
142: size: file.size,

### app/(site)/api/rescue-verification-documents/[documentId]/signed-url/route.ts

45: .from(document.storage_bucket)

### app/(site)/api/rescue-verification-documents/upload/route.ts

19:import type { RescueVerificationDocumentType } from '@/lib/types';
56: const documentType = String(formData.get('document_type') ?? '').trim() as RescueVerificationDocumentType;
77: if (!isSupportedUploadMime(file.type) || !ALLOWED_TYPES.has(file.type)) {
81: if (file.size <= 0 || file.size > MAX_DOCUMENT_BYTES) {
97: const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
100: const storagePath = `orgs/${organization.id}/${safeType}/${Date.now()}-${crypto.randomUUID()}-${safeFileStem}.${extension}`;
105: const signature = validateUploadSignature(buffer, file.type, ALLOWED_TYPES);
113: contentType: signature.mime,
135: document_type: documentType,
136: storage_bucket: BUCKET,
140: mime_type: signature.mime,
141: file_size_bytes: file.size,
162: fileSize: file.size,
163: mimeType: signature.mime,

## 6. Platne rute — postoji li flag provjera prije Stripe poziva

### app/(site)/api/payments/webhook/route.ts

24: const stripe = getStripe();
41: event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

### app/(site)/api/payments/create-checkout/route.ts
