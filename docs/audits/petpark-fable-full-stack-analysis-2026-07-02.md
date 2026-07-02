# PetPark — Full Frontend + Backend Analysis for Fable

**Date:** 2026-07-02  
**Prepared for:** Fable / external AI review  
**Prepared by:** Zippo  
**Scope:** PetPark web app + PetPark mobile app + backend/API/Supabase architecture  
**Primary web repo:** `/Users/ljemicus/Projects/petpark`  
**Primary mobile repo:** `/Users/ljemicus/Projects/petpark-mobile`  
**Do not include secrets:** this document intentionally lists env var names only, never values.

---

## 0. How Fable should use this document

This is a review pack, not a marketing overview. Fable should analyze PetPark as a real pre-production product with a large feature surface and some known transitional debt.

Recommended Fable review goals:

1. Find architectural inconsistencies between frontend, backend routes, mobile app, and Supabase schema.
2. Identify production blockers before a Croatian public launch.
3. Rank backend/API/security risks, especially auth, RLS, service-role usage, CSRF, rate limiting, payments, uploads, notifications, and cron routes.
4. Rank frontend UX/product risks: too many routes, preview/demo debt, unclear disabled features, SEO inconsistency, payment expectation mismatch.
5. Propose a realistic stabilization plan: what to cut, what to gate, what to verify, what to migrate, and what to ship first.

Important context: PetPark is no longer “Šapica”. Do not recommend renaming/branding back to Šapica.

---

## 1. Executive summary

PetPark is a broad all-in-one pet platform for Croatia. It started from a pet-sitting marketplace model and expanded into a much wider product: sitters, dog walking, grooming, trainers, lost pets, adoption/rescue, vets, pet passport, community/forum/social features, shop, breeders, dashboards, notifications, payments, SEO city landing pages, and mobile app.

The project has a strong amount of real infrastructure:

- Next.js App Router web app.
- Expo Router mobile app.
- Supabase Auth, PostgreSQL, RLS-oriented schema, generated types on mobile.
- Large API route surface.
- Stripe/Connect code paths.
- Resend/SMS/push notification foundations.
- Sentry/logging/analytics foundations.
- CSP, CSRF, sanitization, rate-limit utilities.
- Multiple dashboard roles.
- Playwright/Vitest tests on web.
- Mobile TypeScript/export gates previously passed.

But the product is still in a risky transition state:

- Web says/assumes some things are disabled or pre-production while code still contains active-looking API/UI surfaces.
- Payments are intentionally off from product perspective, but Stripe/checkout/refund/connect routes remain present.
- Legal/company placeholders have previously been used as intentional production blockers.
- Web and mobile are not perfectly feature-equivalent.
- Mobile has been aligned to remote Supabase schema, but several planned modules are honest “Uskoro”/empty because remote tables are missing.
- Backend is broad enough that production confidence depends on targeted security/RLS/API tests, not just TypeScript passing.

**Bottom line:** treat PetPark as a mature prototype / pre-production platform, not a clean launch candidate. The right next step is not adding more features; it is cutting scope, hardening critical backend flows, and making disabled features impossible to accidentally invoke.

---

## 2. Current repo state checked

### Web

- Local path: `/Users/ljemicus/Projects/petpark`
- Branch: `fix/audit-2026-06`
- Last observed commit: `405f9dcd docs: add PetPark Fable full audit`
- Framework: Next.js App Router, React 19, TypeScript, Tailwind/shadcn-style components.
- Package says app name: `petpark` version `0.1.0`.

### Mobile

- Local path: `/Users/ljemicus/Projects/petpark-mobile`
- Branch: `feat/mobile-complete-kit`
- Last observed commit: `b252b36 refactor(mobile): finish remote schema alignment gates`
- Framework: Expo SDK 55, React Native 0.83, Expo Router, Supabase JS.
- Package says app name: `petpark-mobile` version `1.0.0`.

### Verification run now

Ran on 2026-07-02:

```bash
cd /Users/ljemicus/Projects/petpark
npm run type-check
# PASS: tsc --noEmit exited 0

cd /Users/ljemicus/Projects/petpark-mobile
npx tsc --noEmit
# PASS: exited 0
```

No deploy, DB write, migration push, or external publication was performed.

---

## 3. Product scope map

PetPark currently contains these product areas:

### Marketplace core

- Public search/explore.
- Sitter public profiles.
- Groomer public profiles.
- Trainer public profiles.
- Service categories and service listings.
- Booking requests and booking status flow.
- Calendar/availability.
- Owner and provider dashboards.

### Pet owner tools

- Pets management.
- Pet passport / pet health records.
- Booking history.
- Messages/conversations.
- Favorites.
- Notifications/preferences.

### Provider tools

- Sitter dashboard.
- Groomer dashboard.
- Trainer dashboard.
- Provider application/onboarding.
- Verification/admin review.
- Availability and booking management.
- Stripe Connect/payout foundations.

### Expansion modules

- Lost pets, sightings, alerts, contact relay, renew/status/update.
- Adoption/rescue organizations and appeals.
- Veterinarians and emergency vets.
- Dog-friendly locations.
- Forum/community/social posts/challenges/playdates.
- Blog/content and SEO landing pages.
- Shop/cart/product paths.
- Breeders/kennels/litters.
- Walk tracking.
- Push notifications.
- Email/SMS sequences.
- Analytics/funnel tracking.

The breadth is impressive, but it is also the main risk. There are too many production-facing surfaces for the current hardening level.

---

## 4. Web frontend analysis

### 4.1 Size and route surface

Observed web counts:

- `137` page files (`page.tsx`).
- `142` API route handlers.
- `171` component files.
- `213` lib files.
- `18` Supabase migration SQL files.

Major web route groups by frontend file count:

- `dashboard`: 56 files — largest UI surface and highest auth/role complexity.
- `izgubljeni`: 16 files — lost pet flow is large and public-sensitive.
- `admin`: 9 files — privileged UI.
- `veterinari`: 9 files.
- `forum`: 8 files.
- `udomljavanje`: 8 files.
- `shop`: 7 files.
- `blog`, `dresura`, `pretraga`, `uzgajivacnice`: each 6 files.
- Multiple EN/localized SEO pages exist for selected pages/cities.

Main app structure:

- `app/layout.tsx` and root `app/page.tsx`.
- Main site under `app/(site)/...`.
- API routes also under `app/(site)/api/...`.
- Shared components under `components/shared`, `components/ui`, feature folders.
- Backend/domain helpers under `lib/`, especially `lib/db`, `lib/supabase`, `lib/petpark`, `lib/auth`, `lib/seo`, `lib/security`.

### 4.2 Frontend strengths

- Uses App Router structure with route-level pages and layouts.
- Good separation of reusable UI: `components/ui`, `components/shared`, feature components.
- There are loading/error/not-found routes in many places.
- There are public SEO pages and city landing pages.
- There is a visible effort toward accessibility/performance: skip links, optimized images, Sentry, web vitals, Playwright responsive/a11y gates.
- The homepage and service surfaces have been visually iterated a lot.
- There are dedicated dashboards by role instead of one overloaded generic dashboard.

### 4.3 Frontend weaknesses / risks

1. **Too much public surface.** 137 pages is very large for a pre-production marketplace. Every route needs auth state, metadata, copy, empty states, error states, mobile layout, and backend truth.

2. **Preview/design-lab debt exists.** Routes like `design-lab` and `redizajn-preview` exist. If they are not fully blocked from indexing and public navigation, they can leak inconsistent UX/SEO signals.

3. **Feature expectation mismatch.** Some pages imply mature functionality while backend/mobile may return empty, disabled, demo, or “Uskoro” behavior.

4. **Payments expectation mismatch.** Checkout/payment routes and components exist, but payments are intentionally not active as a product decision. This must be hard-gated in both UI and API, not just hidden.

5. **Role complexity.** Owner/sitter/groomer/trainer/breeder/rescue/admin flows are all present. This increases risk of broken redirects, wrong dashboard access, and accidental data leakage.

6. **Demo/mock debt.** Codebase still has many references to mock/demo/MVP/placeholder concepts. Some are harmless seed/demo files, but the count is high enough that Fable should inspect production imports carefully.

Observed broad grep count in web across `app/lib/components/supabase/tests`:

- `TODO|FIXME|mock|demo|placeholder|MVP`: 593 matches.
- `stripe|Stripe|payment|checkout`: 456 matches.
- `csrf|rateLimit|rate-limit|sanitize`: 293 matches.
- `createClient|supabase`: 1319 matches.
- `service_role|SERVICE_ROLE`: 23 matches.

These counts are not automatically bugs, but they show where review should focus.

---

## 5. Web backend/API analysis

### 5.1 API route surface

There are 142 route handler files under `app/(site)/api`.

HTTP method count by route files containing exported handlers:

- GET: 73
- POST: 90
- PATCH: 24
- DELETE: 15
- PUT: 4

API groups by route count:

- `admin`: 12
- `lost-pets`: 10
- `social`: 9
- `auth`: 7
- `payments`: 7
- `booking-requests`: 6
- `calendar`: 5
- `forum`: 5
- `vets`: 5
- `adoption-listings`: 4
- `email`: 4
- `notifications`: 4
- `blog`: 3
- `bookings`: 3
- `contests`: 3
- `public`: 3
- many other single/dual route groups.

### 5.2 Critical backend surfaces

Fable should prioritize these groups:

#### Auth

Routes:

- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/auth/forgot-password`
- `/api/auth/callback`
- `/api/auth/devices`

Risks:

- Password policy and lockout config need verification.
- Session cookies and Supabase SSR behavior need route-by-route testing.
- Auth callback needs OAuth redirect hardening.
- Device/session deletion must enforce user ownership.

#### Admin

Routes include provider applications, verifications, lost pets moderation, service listings moderation, rescue review, ops audit, KPI digest.

Risks:

- Every route must use a consistent admin guard.
- Admin status must come from a trusted DB/server-side source, not only mutable user metadata.
- Admin routes must never fall back to permissive behavior during build/env-missing conditions.

#### Booking and booking requests

Routes:

- `/api/booking-requests/*`
- `/api/bookings/*`
- `/api/calendar/*`
- `/api/availability`
- provider-specific booking routes for groomer/trainer.

Risks:

- Owner/provider identity mapping must be consistent between `profiles`, `providers`, and dashboard roles.
- Booking status transitions need server-side state machine enforcement.
- Withdraw/status/message APIs must verify participant rights.
- Calendar write APIs need anti-overlap and ownership validation.

#### Payments

Routes:

- `/api/payments/connect`
- `/api/payments/account-link`
- `/api/payments/account-status`
- `/api/payments/create-checkout`
- `/api/payments/dashboard-link`
- `/api/payments/refund`
- `/api/payments/webhook`

Current product decision: payments are off / not ready for live activation.

Risks:

- If payments are disabled, API should return deterministic disabled responses before any Stripe action.
- Webhooks must verify Stripe signatures and idempotency.
- Refund route must be admin/owner/provider-state protected.
- Connect onboarding should not expose provider Stripe state to the wrong user.
- UI copy must not promise live payments if the business model is currently inquiry/request-based.

#### Lost pets

Routes include reporting, listing, sightings, status, renew, updates, contact relay, alerts, admin moderation, cron expiry and alerts.

Risks:

- Public/private contact information boundaries.
- Contact relay abuse/spam.
- Cron auth via `CRON_SECRET`.
- Email alert volume/rate-limits.
- User ownership of updates/status/renew.

#### Uploads and documents

Routes:

- `/api/upload`
- `/api/upload/verification`
- `/api/rescue-verification-documents/upload`
- signed URL routes.

Risks:

- File type, file size, path ownership, bucket RLS, signed URL expiration.
- Verification document privacy.
- Cloudinary/Supabase storage split consistency.

#### Notifications/push/email/SMS

Routes:

- `/api/notifications/*`
- `/api/push/*`
- `/api/email/*`
- `/api/sms/send`

Risks:

- Subscription ownership.
- SMS internal key enforcement.
- Rate limiting and abuse prevention.
- Unsubscribe/preferences enforcement.
- No secret leakage in logs.

### 5.3 Middleware/proxy/security headers

Web uses `proxy.ts` for:

- request ID
- locale header
- CSP nonce/static CSP split
- base security headers
- CSRF middleware
- Supabase session update
- some auth redirects
- dynamic profile hard-404 protection
- admin route hard-404 for `admin/service-listings`

Strengths:

- CSP is centralized and nonce-aware.
- Static homepage CSP is treated separately from dynamic nonce CSP.
- Base security headers are applied.
- There is a CSRF layer.
- Some malformed dynamic profile IDs are hard-404ed.

Risks:

- CSRF excluded routes list is broad and includes sensitive routes like auth and booking requests. This may be justified, but must be tested deliberately.
- Some redirect branches in proxy must preserve security headers consistently.
- Admin checks should not rely only on `user_metadata.role === 'admin'` unless DB/RLS also enforces admin. User metadata can be a weak source depending on how it is set.
- Proxy complexity is high enough that route-level tests are needed.

### 5.4 Environment variables / external services

Web env var names referenced by code include:

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Stripe: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- Email: `RESEND_API_KEY`, `EMAIL_FROM`
- SMS: `SMS_PROVIDER`, `SMS_INTERNAL_KEY`, `INFOBIP_*`, `TWILIO_*`
- Push: `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`
- Redis/rate limit: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- Cloudinary: `CLOUDINARY_*`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- Analytics/Sentry: `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_*`, `SLACK_*`
- OAuth/Auth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- Cron: `CRON_SECRET`
- App config: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_ENV`, `APP_URL`, `APP_VERSION`, `VERCEL_ENV`, `NODE_ENV`

Fable should verify which are required for production, preview, local dev, and build-time only.

---

## 6. Supabase/backend data model analysis

### 6.1 Web migrations

Web repo has 18 migrations. Important migration themes:

- Trainer feature tables.
- RLS least privilege hardening.
- Reconstructed auth/profile/provider foundation.
- Provider services/settings.
- Availability/bookings/reviews.
- Stripe/payment fields.
- Booking requests/conversation/status/contact identity/notifications.
- Pet passports.
- Service listings.

Important caution in repo SQL:

- Some migrations are reconstructed/documentary from remote state and explicitly say “do not apply blindly”.
- `20260513093000_add_service_listings.sql` says it is a draft/revised-for-review migration and should not be applied to production without explicit approval.

### 6.2 Canonical concepts

From inspected migrations and code, core canonical concepts appear to be:

- `profiles`: one row per Supabase auth user.
- `profile_roles`: role grants.
- `providers`: public/provider-side entity attached to `profiles` via `profile_id`.
- `provider_services`: pricing/service code source of truth.
- `service_listings`: richer presentation/editorial layer for marketplace pages.
- `bookings`: confirmed/structured bookings.
- `booking_requests`: inquiry/request flow.
- `booking_request_messages` and events: conversation/status history around booking requests.
- `availability_slots`: provider availability.
- `pets`, `pet_passports`.
- feature-specific tables for lost pets, rescue/adoption, reviews, notifications, etc.

### 6.3 Service-role usage

Web has service role references. This is expected for cron/admin/server-only operations, but Fable should inspect every usage:

- Is it server-only?
- Is it behind route auth/admin/cron checks?
- Does it re-check user ownership manually before writing?
- Is it ever imported by client components?
- Does it return only sanitized data?

One important pattern in `lib/supabase/admin.ts`: if env is missing in production and not CI, it returns a placeholder Supabase client instead of throwing. This may avoid build failures, but it is risky if any runtime route accidentally proceeds with placeholder behavior. Fable should review whether this can mask misconfiguration.

### 6.4 RLS posture

Positive signs:

- Migrations enable RLS on important tables.
- There are least-privilege hardening migrations.
- Service listings migration has explicit public/owner/admin policies.
- Mobile has remote generated types from actual Supabase project.

Risks:

- Reconstructed migrations may not exactly match live production.
- Mobile remote-schema summary file appears polluted by Supabase CLI help output due `--stdin` incompatibility; do not trust only that summary.
- Need real RLS tests with anon/authenticated users for each role.
- Many routes use server helpers and service role; RLS alone is not enough if service role bypasses it.

---

## 7. Mobile frontend/backend analysis

### 7.1 Mobile size and structure

Observed mobile counts:

- `90` app screen/layout files.
- `11` component files.
- `41` lib files.
- `6` active migrations.
- `2` draft migrations.

Route groups by file count:

- `dashboard`: 41 — owner/sitter/groomer/trainer/breeder/rescue dashboards.
- `(tabs)`: 9 — main tab navigation.
- `payments`: 7.
- `booking`: 5.
- `chat`: 4.
- `pet-passport`: 3.
- `shop`: 3.
- `walk`: 3.

Mobile tech stack:

- Expo SDK 55.
- Expo Router.
- React Native 0.83.
- Supabase JS typed client.
- Expo Location/Image Picker/Document Picker.

### 7.2 Mobile strengths

- Mobile app exists and is not a new blank app.
- Typed Supabase client uses generated remote database types.
- Booking, dashboards, chat, walk, payments, pet passport screens exist.
- Remote schema alignment handoff says `npx tsc`, `expo-doctor`, audit script, iOS export, Android export passed on 2026-06-03.
- Missing remote tables were intentionally turned into empty/disabled/“Uskoro” paths rather than querying draft tables.
- Payments are intentionally disabled by config (`PAYMENTS_ENABLED = false` in prior handoff context).

### 7.3 Mobile risks

1. **README overpromises.** README lists payments as a feature, but handoff says payments remain disabled. Update public/internal docs to avoid wrong expectations.

2. **Feature parity gap.** Mobile has many screens, but not all are backed by live remote schema.

3. **Draft migrations exist.** `supabase/drafts/00006_mobile_feature_foundation.DRAFT.sql` and `00007_forum_shop_breeder_pet_extras.DRAFT.sql` are intentionally not applied. Fable should treat forum/shop/breeder/pet extras as not production-backed until approved migration exists.

4. **Remote schema summary is unreliable.** `remote-schema/SCHEMA-SUMMARY.md` contains Supabase CLI help/error text because `supabase db query --stdin` was not supported. Use generated `lib/database.types.ts` or live Supabase introspection instead.

5. **No full real-device QA recorded in this run.** TypeScript passed now, but auth, booking, chat, location/walk, uploads, push, and dashboard role flows need real device testing.

6. **Payment routes/screens exist.** Even if disabled, they must fail closed and not call Stripe unless explicitly enabled.

### 7.4 Mobile Supabase tables referenced by active code

Active mobile code references tables including:

- `profiles`
- `providers`
- `provider_services`
- `provider_groomer_settings`
- `availability_slots`
- `bookings`
- `pets`
- `pet_passports`
- `reviews`
- `conversations`
- `conversation_participants`
- `messages`
- `trainer_availability`
- `trainer_bookings`
- `trainers`
- `training_programs`
- `walks`

This is a good sign: mobile was moved toward normalized remote schema rather than old draft tables.

---

## 8. Web/mobile alignment analysis

### 8.1 Aligned concepts

Both web and mobile revolve around:

- Supabase Auth.
- `profiles` as user identity.
- `providers` as provider identity.
- service/provider dashboards.
- bookings and booking requests.
- messages/conversations.
- pets and pet passport.
- payments as present but disabled/not production-ready.

### 8.2 Misalignment risks

- Web has many more public routes and SEO pages than mobile.
- Mobile has some dashboards/screens that are UI shells around missing remote tables.
- Web may still contain older mock/demo modules while mobile was recently normalized to remote schema.
- Payment state must be globally consistent: web UI, mobile UI, API, Stripe webhook, and docs.
- Role naming must be consistent: owner/vlasnik, sitter, groomer, trainer, breeder, rescue, admin.
- Booking vs booking request must be clearly separated. If one is inquiry-only and the other is confirmed booking, UX copy and DB state machine must reflect that.

---

## 9. Testing and quality gates

### Existing web test assets

Web has:

- Vitest config.
- Unit tests for analytics, feature flags, rate limit, sanitize, CSRF, cloudinary, auth password/session helpers.
- Playwright tests for blog, forum, izgubljeni, mapa, pretraga, udomljavanje, zajednica, redirects, screenshots, responsive/a11y gates.
- Build/type/lint scripts.

Scripts in `package.json`:

- `npm run lint`
- `npm run test`
- `npm run test:ci`
- `npm run type-check`
- `npm run build`
- `npm run ci`
- `npm run validate:env`
- `npm run preflight`
- `npm run ci:regression`

### Existing mobile test gates

Mobile has no package scripts for test/lint beyond README commands, but TypeScript works via:

```bash
npx tsc --noEmit
```

Earlier handoff says these passed on 2026-06-03:

- `npx tsc --noEmit`
- `npx expo-doctor` 19/19
- `bash scripts/audit-features.sh`
- `npx expo export --platform ios`
- `npx expo export --platform android`

### Recommended new gates before launch

Fable should recommend/verify:

1. Web `npm run ci` on clean install.
2. Web Playwright smoke against local production build.
3. API auth matrix tests for all sensitive endpoints.
4. RLS tests using anon, owner, provider, admin, unrelated user.
5. Payment disabled tests: every payment UI/API route fails closed.
6. Upload file size/type/path tests.
7. Lost pet contact relay abuse/rate-limit tests.
8. Mobile real-device smoke with test users.
9. Mobile Expo export after any schema changes.
10. Post-build placeholder/legal grep.

---

## 10. Production blockers / high-priority concerns

### Blocker A — Legal/company data

Previous audit documented intentional placeholders for company legal values. If still present, production must remain blocked until official values are inserted:

- full company address
- OIB
- MBS
- share capital / legal footer details
- privacy/terms/impressum consistency

### Blocker B — Payments must be globally disabled or fully completed

Current safest state: payments disabled.

Required if disabled:

- UI says inquiry/request flow only.
- Payment buttons hidden or disabled with honest copy.
- All payment API routes return disabled before Stripe calls.
- Webhook route remains safe but no active payment creation.
- README/docs do not claim active payments.

Required if enabled:

- Stripe Connect onboarding complete.
- Webhook idempotency and signature tests.
- Refund/admin authorization tests.
- Ledger/reconciliation table and admin visibility.
- Terms/refund policy updated.

Do not ship halfway.

### Blocker C — Auth/admin/role authorization matrix

Every dashboard/API route must answer:

- anon access?
- authenticated owner access?
- provider owner access?
- provider unrelated access?
- admin access?
- deleted/suspended profile?

This is more important than visual polish.

### Blocker D — Live Supabase schema truth

Because some migrations are reconstructed and mobile schema summary is flawed, final launch requires live schema verification:

- list all tables, policies, functions, triggers, storage buckets.
- compare live schema with repo migrations.
- generate fresh types.
- run RLS tests.

### Blocker E — Scope cut

PetPark has too many modules to all launch at once. Recommended launch scope:

- homepage
- search/explore
- sitter/provider profiles
- booking request/inquiry flow
- owner/provider dashboards for that flow
- messages around requests
- lost pets if already stable
- legal/privacy/terms
- admin moderation basics

Recommended to keep disabled until later:

- payments
- shop
- breeders
- full forum/social
- complex rescue subscriptions/donations
- full walk tracker if not real-device tested

---

## 11. Detailed review questions for Fable

### Architecture

1. Is App Router structure too broad for launch?
2. Which pages should be removed, noindexed, or gated?
3. Are domain modules in `lib/db` consistent or are there duplicate old/new data paths?
4. Is `service_listings` correctly positioned as presentation layer instead of source of truth?
5. Should booking requests and bookings be merged, separated harder, or renamed in UI?

### Backend/API

1. Which API routes lack auth checks?
2. Which API routes rely on service role unnecessarily?
3. Which POST/PATCH/DELETE routes lack CSRF or safe alternative auth?
4. Are rate limit utilities consistently applied to auth, contact relay, SMS, upload, booking, and support routes?
5. Are all user-provided strings sanitized before display/email/logging?
6. Are cron routes protected by `CRON_SECRET` and safe against replay?
7. Are webhooks signature-verified and idempotent?
8. Does admin authorization come from trusted DB state?

### Supabase/RLS

1. Do live policies match intended repo policies?
2. Can one provider read/write another provider’s rows?
3. Can owners access unrelated bookings/messages/pets?
4. Can anon read private contact details?
5. Are storage buckets private where needed?
6. Are signed URLs short-lived and generated only after ownership checks?

### Frontend UX

1. Does every public page have honest empty states?
2. Are disabled features clearly marked as “Uskoro” or hidden?
3. Is the marketplace value proposition too diluted by extra modules?
4. Is mobile nav aligned with launch scope?
5. Are trust badges/reviews/provider claims backed by real data?
6. Are city landing pages and localized pages SEO-safe and non-duplicate?

### Mobile

1. Which mobile screens are fully remote-backed vs shell/disabled?
2. Does mobile auth onboarding write the same canonical profile/provider records as web?
3. Is booking request flow shared with web semantics?
4. Are payments truly disabled in every mobile path?
5. Does walk tracking need background location permissions and privacy copy?
6. Does chat realtime work with current RLS?

---

## 12. Recommended stabilization plan

### Phase 1 — Freeze scope

- Pick V1 launch modules.
- Hide/noindex preview, design-lab, disabled modules.
- Make product copy match actual backend state.
- Create one launch matrix: route → status → owner → backend table → test.

### Phase 2 — Backend hardening

- Audit all 142 API routes.
- Add auth/role tests for sensitive routes.
- Add payment-disabled API guard.
- Add upload validation tests.
- Add contact relay/SMS/email rate limiting.
- Verify admin guard source.

### Phase 3 — Supabase truth

- Fresh live schema export.
- Fresh generated types for web and mobile.
- RLS policy matrix tests.
- Storage bucket policy tests.
- Document migration status: applied, draft, reconstructed, deprecated.

### Phase 4 — Frontend cleanup

- Remove or gate design-lab/preview routes.
- Fix README/docs overpromises.
- Align all “payments” copy.
- Audit all mock/demo data imported by production pages.
- Ensure all disabled modules have consistent empty state.

### Phase 5 — Mobile real-device QA

- Test auth/register/login/logout.
- Test owner onboarding.
- Test provider onboarding.
- Test booking request or booking flow.
- Test chat send/receive.
- Test upload/photo/document flows.
- Test push notifications if enabled.
- Test walk tracking only if launch scope includes it.

---

## 13. Files/directories Fable should inspect first

### Web critical files

- `proxy.ts`
- `middleware/csrf.ts`
- `lib/supabase/server.ts`
- `lib/supabase/admin.ts`
- `lib/auth/*`
- `lib/admin-guard.ts`
- `lib/rate-limit.ts`
- `lib/rate-limiter.ts`
- `lib/upstash-rate-limit.ts`
- `lib/sanitize.ts`
- `lib/sanitize-api.ts`
- `lib/security/csp.ts`
- `lib/petpark/booking-requests/*`
- `lib/petpark/service-listings/*`
- `lib/db/*`
- `app/(site)/api/auth/*`
- `app/(site)/api/payments/*`
- `app/(site)/api/booking-requests/*`
- `app/(site)/api/calendar/*`
- `app/(site)/api/upload/*`
- `app/(site)/api/lost-pets/*`
- `app/(site)/api/admin/*`
- `supabase/migrations/*`

### Mobile critical files

- `lib/supabase.ts`
- `lib/database.types.ts`
- `lib/auth-context.tsx`
- `lib/booking-db.ts`
- `lib/owner-dashboard-db.ts`
- `lib/sitter-dashboard-db.ts`
- `lib/groomer-dashboard-db.ts`
- `lib/trainer-dashboard-db.ts`
- `lib/chat/*`
- `lib/payments/*`
- `lib/walk-db.ts`
- `app/payments/*`
- `app/booking/*`
- `app/dashboard/*`
- `supabase/migrations/*`
- `supabase/drafts/*`
- `docs/handoff-petpark-remote-align-2026-06-03.md`

---

## 14. Suggested Fable prompt

Use this prompt with Fable together with this file:

> You are reviewing PetPark, a Croatian pet marketplace/platform with Next.js web, Expo mobile, Supabase backend, Stripe code paths, and many modules. Analyze the attached full-stack handoff and the codebase if provided. Prioritize production readiness, security, backend/API authorization, Supabase RLS/schema consistency, payment-disabled safety, frontend scope control, and mobile/web alignment. Do not suggest rebranding to Šapica. Produce: (1) critical blockers, (2) high-risk backend findings, (3) frontend/product scope findings, (4) mobile findings, (5) prioritized 2-week stabilization plan, (6) exact files/routes to inspect or patch first. Be direct and assume launch should be blocked unless critical checks pass.

---

## 15. Final assessment

PetPark is promising and unusually complete for a solo/fast-build product, but it has crossed the threshold where more features make it worse. The winning move is to narrow the V1, harden the backend, and make every disabled module impossible to accidentally use.

If Fable only does one thing, ask it to audit these five areas deeply:

1. API auth/role checks across sensitive routes.
2. Supabase live schema + RLS truth vs repo assumptions.
3. Payment-disabled fail-closed behavior.
4. Service-role usage and upload/document privacy.
5. Route/scope cleanup for a realistic V1 launch.
