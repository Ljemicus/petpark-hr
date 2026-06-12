# PetPark Full Frontend + Backend Audit for Fable Review

**Date:** 2026-06-12  
**Repo:** `github.com/Ljemicus/petpark-hr`  
**Local path audited:** `/Users/ljemicus/Projects/petpark`  
**Branch audited:** `fix/audit-2026-06`  
**Current PR context:** audit-fix PR already exists for legal/SEO/trust-copy fixes.  
**Scope:** Next.js web app only. No mobile app review. No production deploy performed. No DB writes or migrations performed.

---

## 1. Executive summary

PetPark has strong product breadth and a lot of useful foundations already in place: Next.js App Router, Supabase integration, CSP work, service-listing read guards, admin checks in many places, Sentry/logging, structured route handlers, and a broad test suite.

However, the app is currently in a risky transitional state: public copy says online payments are not active, while Stripe/Connect/checkout/refund APIs and UI paths are still present; legal/company data is intentionally placeholder-blocked; CSRF middleware appears to break/bypass important proxy logic; old rate limiting is a no-op on multiple sensitive endpoints; and parts of the frontend still contain preview/demo/design-lab debt that can leak inconsistent UX/SEO signals.

**Fable should treat this as a pre-production hardening review, not a final launch candidate.**

### Overall risk rating

| Area             |   Rating | Why                                                                                                        |
| ---------------- | -------: | ---------------------------------------------------------------------------------------------------------- |
| Legal/compliance |     High | Terms fixed toward no-payments model, but company impressum placeholders still block production.           |
| Auth/security    | Critical | CSRF/proxy flow + email auto-confirm + no-op legacy rate limiter need fixes before trust-sensitive launch. |
| Payments         |     High | Product says payments disabled, but API/UI surface remains reachable.                                      |
| Data/RLS/backend |     High | Broad service-role usage and reconstructed migrations require live schema comparison.                      |
| Frontend UX/copy |   Medium | Many improvements landed, but old Stripe/MVP/demo strings remain outside the audited pages.                |
| SEO              |   Medium | Canonical/title/GSC fixes landed; sitemap and metadata still have inconsistencies.                         |
| Performance      |   Medium | Homepage is visually controlled but includes pixel/design-lab patterns and large route surface.            |
| Test confidence  |   Medium | Many tests exist, build passes, but critical security behaviors need targeted regression tests.            |

---

## 2. Review context and recent fixes already applied

The branch `fix/audit-2026-06` contains the audit-fix kit work:

- `audit/diagnostics-2026-06.md`
- `audit/verification-2026-06.md`
- Terms updated away from Stripe/provision/refund claims.
- Impressum placeholders added to footer, `/uvjeti`, `/privatnost`.
- `scripts/check-placeholders.mjs` added and wired to `prebuild`.
- Root canonical removed; GSC verification is env-gated.
- Duplicate `| PetPark` title suffix cleanup performed.
- Service detail metadata improved.
- Blog slug fixed with redirect.
- Fake service trust signals reduced.
- Homepage feed marked as example instead of fake live alert.
- Price formatting improved in main service surfaces.

### Current intentional blocker

Production build is intentionally blocked from shipping placeholder legal values:

- `{{PUNA_ADRESA}}`
- `{{OIB}}`
- `{{MBS}}`
- `{{KAPITAL}}`

`npm run build` passes because `prebuild` only checks source placement. Post-build `node scripts/check-placeholders.mjs` correctly fails while these values are still in the production bundle.

**Required before production:** replace placeholders with official Sudski registar values or keep production deploy blocked.

---

## 3. Verification run during audit

Known gates from current branch:

- `npm run lint` — PASS, warnings only.
- `npx tsc --noEmit` — PASS.
- `npm run build` — PASS.
- Final grep after audit fixes — PASS for critical prior strings:
  - `Nacrt Service Listing`
  - `within_2_hours`
  - `Plaćanje nije uključeno u ovaj MVP`
  - `Booking Request MVP`
  - `1.220`
  - `PetPark | PetPark`
  - `google-site-verification-code`

Test inventory: repo has ~51 test/spec files across unit, e2e, component and domain tests.

---

## 4. Critical findings — must fix before production

### P0-1 — CSRF middleware short-circuits most GET requests before auth/session/proxy logic

**Files:**

- `proxy.ts`
- `middleware/csrf.ts`

**Observed behavior:**

`csrfMiddleware()` returns `NextResponse.next()` for `GET`, `HEAD`, and `OPTIONS` to set a CSRF cookie. In `proxy.ts`, any non-null CSRF response is immediately returned.

That means many GET requests can return before:

- `maybeHard404DynamicProfile()`
- `updateSession(request)`
- dashboard redirect checks
- some auth/profile guards
- later response header finalization logic

**Impact:**

- Session refresh may not happen consistently.
- Route protection assumptions can be false.
- Middleware ordering becomes fragile.
- Admin/dashboard behavior may differ by request method and route.

**Recommendation:**

Refactor CSRF middleware so it returns a response only when blocking a state-changing request. For GET token issuance, attach/merge the `Set-Cookie` into the final response after auth/session logic runs.

**Acceptance test:**

- Add middleware/proxy tests proving GET `/moji-upiti` unauthenticated redirects to `/prijava` and still sets CSRF cookie.
- Add test proving GET `/trener/bad-id` still hard-404s.

---

### P0-2 — Stripe webhook route is probably blocked by CSRF

**Files:**

- `proxy.ts`
- `middleware/csrf.ts`
- `app/(site)/api/payments/webhook/route.ts`

**Observed behavior:**

CSRF exclusions include `/api/webhooks/`, but actual Stripe webhook path is:

```txt
/api/payments/webhook
```

Stripe POSTs will not include `x-csrf-token`. The request is likely rejected by proxy with `403` before Stripe signature verification.

**Impact:**

If payments are ever enabled, checkout/webhook state changes may fail silently or partially.

**Recommendation:**

- If payments remain disabled: return `404`/`503` from all payments routes and exclude nothing.
- If payments are enabled: add exact `/api/payments/webhook` CSRF bypass and keep signature verification in the route.

**Acceptance test:**

- Webhook POST without CSRF but with valid Stripe signature reaches route handler.
- Webhook POST with invalid signature fails in route handler, not middleware.

---

### P0-3 — Legacy `rateLimit()` is a no-op even when Redis exists

**File:**

- `lib/rate-limit.ts`

**Affected examples:**

- `app/(site)/api/upload/route.ts`
- `app/(site)/api/upload/verification/route.ts`
- `app/(site)/api/rescue-verification-documents/upload/route.ts`
- `app/(site)/api/lost-pets/[id]/relay/route.ts`
- `app/(site)/api/lost-pets/[id]/sightings/route.ts`

**Observed behavior:**

The exported sync compatibility helper:

```ts
export function rateLimit(...): boolean {
  ...
  return true;
}
```

always returns `true`, including when Redis is configured.

**Impact:**

Public upload/contact/relay/sighting endpoints are effectively unthrottled where this helper is used.

**Recommendation:**

- Remove or deprecate sync `rateLimit()`.
- Replace call sites with `rateLimitAsync()`, `lib/upstash-rate-limit.ts`, or `lib/rate-limiter.ts`.
- Add tests for each sensitive endpoint showing `429` after threshold.

---

### P0-4 — Registration auto-confirms email via service-role key

**File:**

- `app/(site)/api/auth/register/route.ts`

**Observed behavior:**

When Supabase signup does not return a session, route uses `SUPABASE_SERVICE_ROLE_KEY` to call:

```ts
adminClient.auth.admin.updateUserById(data.user.id, { email_confirm: true });
```

Then it signs the user in.

**Impact:**

Email verification is effectively bypassed for all successful registrations if service-role env exists. This weakens account integrity, abuse prevention and future provider trust flows.

**Recommendation:**

- Remove automatic service-role email confirmation.
- Use normal Supabase confirmation flow.
- If instant login is desired only in local/dev, gate it behind explicit non-production env.

**Acceptance test:**

- In production-like env, registration returns `needsEmailConfirmation: true` if Supabase requires confirmation.
- No service-role admin confirmation call occurs.

---

### P0-5 — Payments are product-disabled in copy but API/UI surface is live

**Files / areas:**

- `app/(site)/api/payments/*`
- `app/(site)/checkout/[bookingId]/page.tsx`
- `app/(site)/onboarding/provider/provider-onboarding-form.tsx`
- `components/shared/connect-stripe-button.tsx`
- `components/shared/payment-button.tsx`
- `components/shared/sitter-earnings.tsx`
- `components/payments/*`
- `lib/payment.ts`
- `lib/stripe.ts`

**Observed behavior:**

User-facing audited terms/service pages now say online payments are not active. But checkout, Connect onboarding, refunds, dashboard links and webhook routes still exist.

**Impact:**

- Legal/product mismatch.
- Users/providers may see Stripe flows in some areas.
- Attack surface remains active.
- Reviewers will flag this as inconsistent launch readiness.

**Recommendation:**

Introduce a single server-side payment feature flag, for example:

```txt
PETPARK_ENABLE_PAYMENTS=false
```

Then:

- Every payment route returns `404` or `503` when disabled.
- UI hides checkout/Stripe Connect/Payout components when disabled.
- Terms/copy stay aligned with actual behavior.
- Webhook is only active when flag enabled.

---

## 5. High severity backend/security findings

### P1-1 — CSRF design is not usable by normal browser JS

**File:** `middleware/csrf.ts`

The CSRF cookie is `HttpOnly`, while validation requires client JS to echo the raw token in `x-csrf-token`. Browser JS cannot read an HttpOnly cookie.

**Impact:** many non-excluded state-changing API calls will fail unless excluded; broad exclusions then weaken CSRF.

**Recommendation:**

Use one of:

1. readable double-submit CSRF cookie, or
2. server-rendered token in meta/header, or
3. dedicated CSRF token endpoint that returns a short-lived token.

Avoid blanket exemptions for authenticated mutations.

---

### P1-2 — Too many sensitive write APIs are CSRF-excluded

**File:** `proxy.ts`

Current exclusions include broad prefixes:

- `/api/booking-requests`
- `/api/notifications`
- `/api/admin/service-listings`
- `/api/service-listings/draft-disabled`

**Impact:** authenticated browser mutations may be vulnerable to CSRF if cookie auth is accepted.

**Recommendation:**

Reduce exclusions to:

- OAuth callback
- login/register/forgot-password as appropriate
- webhooks with independent signature verification

Apply CSRF to authenticated mutations.

---

### P1-3 — Upload validation trusts MIME and filename extension

**Files:**

- `app/(site)/api/upload/route.ts`
- `app/(site)/api/upload/verification/route.ts`
- `app/(site)/api/rescue-verification-documents/upload/route.ts`

**Impact:** attackers can upload spoofed content with image/PDF MIME and extension. Verification document uploads are especially sensitive.

**Recommendation:**

- Magic-byte sniffing.
- Normalize extension from detected type.
- Re-encode images before storage where possible.
- Add AV/malware scanning for documents.
- Enforce stricter file size and pixel dimension caps.

---

### P1-4 — Broad service-role usage increases blast radius

**Files / areas:**

- `lib/supabase/admin.ts`
- upload routes
- payment webhook
- booking request DB helpers
- analytics funnel
- sitemap dynamic DB reads

**Impact:** endpoint-level bugs bypass RLS.

**Recommendation:**

- Isolate service-role usage into narrowly named server-only modules.
- For user-scoped actions, prefer anon server client + RLS.
- Where service-role is required, enforce explicit ownership checks and add tests.

---

### P1-5 — Production Supabase admin client can fail open to placeholder host

**File:** `lib/supabase/admin.ts`

If env vars are missing in production and not CI, `createAdminClient()` returns a placeholder Supabase URL/key instead of failing closed.

**Impact:** confusing runtime failures and possible calls to placeholder host.

**Recommendation:**

In production, missing Supabase admin env must throw immediately or fail build/startup validation.

---

## 6. Medium severity backend findings

### P2-1 — Analytics funnel endpoint accepts unauthenticated arbitrary metadata

**File:** `app/(site)/api/analytics/funnel/route.ts`

Concerns:

- unauthenticated POST
- arbitrary metadata payload
- service-role insert
- body-provided `userId` trust risk
- likely weak/no rate limit

**Recommendation:** schema caps, size limits, rate limiting, anonymous session ID handling, never trust `userId` from body.

---

### P2-2 — Public placeholder operational endpoints invite probing

**Files:**

- `app/(site)/api/chat-worker/route.ts`
- `app/(site)/api/chat-trigger/route.ts`

They currently return success-like placeholders.

**Recommendation:** remove, return `410`, or protect with internal auth before future activation.

---

### P2-3 — Reconstructed migrations need live Supabase comparison

**Files:**

- `supabase/migrations/20260424114000_reconstructed_provider_services_and_settings.sql`
- `supabase/migrations/20260424122000_reconstructed_canonical_availability_bookings_reviews.sql`
- `supabase/migrations/20260424232000_reconstructed_booking_requests.sql`
- `supabase/migrations/20260425071000_reconstructed_pet_passports.sql`

Some migrations state original SQL was unavailable and should not be applied blindly.

**Recommendation:**

- Compare local migrations against live Supabase schema.
- Document which tables are service-role-only.
- Add explicit RLS policies/grants where missing.
- Do not apply reconstructed migrations to production without human review.

---

## 7. Frontend/UX findings

### P1-Frontend-1 — Legal impressum placeholders block production by design

**Files:**

- `components/shared/footer.tsx`
- `app/(site)/uvjeti/page.tsx`
- `app/(site)/privatnost/page.tsx`
- `scripts/check-placeholders.mjs`

**Status:** intentional blocker.

**Needed from human:**

- full company address
- OIB
- MBS
- share capital in EUR
- court registration details confirmation
- legal review of Zagreb vs Rijeka jurisdiction TODO

**Recommendation to Fable:** verify legal copy and whether ODR link text/current obligations are correct for Croatia/EU.

---

### P1-Frontend-2 — Stripe/payment copy still appears in non-audited pages

**Examples from grep:**

- `app/(site)/checkout/[bookingId]/page.tsx`
- `app/(site)/onboarding/provider/provider-onboarding-form.tsx`
- `components/shared/connect-stripe-button.tsx`
- `components/shared/payment-button.tsx`
- `components/shared/sitter-earnings.tsx`
- `app/(site)/postavke/page.tsx`

**Impact:** UX can contradict terms/service detail copy.

**Recommendation:** all payment UI must be controlled by the same payment feature flag. When disabled, show Croatian copy:

> Online plaćanje uskoro — za sada se dogovarate izravno s pružateljem.

---

### P1-Frontend-3 — Remaining user-facing “MVP” copy exists

**Examples:**

- `components/shared/petpark/booking-request-detail-surface.tsx`
- `components/shared/petpark/booking-request-status-actions.tsx`

**Impact:** users should not see internal product staging language.

**Recommendation:** replace with user-facing copy, e.g.

> Zatvoreni upiti trenutno se ne mogu ponovno otvoriti. Pošaljite novi upit ako želite nastaviti dogovor.

---

### P1-Frontend-4 — Homepage uses pixel/reference implementation patterns

**File:** `components/shared/petpark/homepage-redesign.tsx`

Concerns:

- pixel-perfect desktop image overlay implementation remains significant
- multiple absolute-position transparent links
- reference image dependency
- hidden shell CSS
- accessibility and responsiveness are harder to reason about

**Impact:** looks controlled visually, but fragile for SEO/a11y/responsive changes.

**Recommendation:** medium-term rebuild homepage as semantic sections/components while preserving approved visual design and logo/slider constraints.

---

### P2-Frontend-1 — Sitemap comments and active routes are inconsistent

**File:** `app/sitemap.ts`

Comment says:

```ts
// /blog and /grooming are 301-redirected to /zajednica and /njega — excluded from sitemap
```

But `/blog` is still an active route and blog entries are included later. This is at least misleading, possibly stale.

**Recommendation:** align sitemap comments, static route inclusion, redirects and canonical strategy. If `/blog` is active, include `/blog` if desired and remove stale redirect comment.

---

### P2-Frontend-2 — `keywords` metadata remains broadly used

Examples:

- many landing pages still export `keywords`
- `components/seo/city-landing-page-en.tsx`

Modern search ignores meta keywords and they create maintenance noise. This is not dangerous, but should not be treated as SEO value.

**Recommendation:** remove gradually or leave but do not optimize around it. Focus on titles, descriptions, canonical, schema validity, content quality and internal linking.

---

### P2-Frontend-3 — Mixed currency display remains outside main service surfaces

Examples:

- legal placeholder capital uses `EUR` as legally appropriate
- backend/payment components use `Intl.NumberFormat(... currency: 'EUR')`
- some JSON-LD currency fields correctly use `EUR`

**Clarification:** JSON-LD/payment ISO currency should stay `EUR`. Visible marketplace prices should use `€`. Fable should distinguish UI copy from structured/payment data.

---

### P2-Frontend-4 — `dangerouslySetInnerHTML` is used in several places

Mostly valid uses:

- JSON-LD scripts
- critical CSS
- design-lab styles

Potentially risky use:

- `app/(site)/admin/marketing/marketing-dashboard.tsx` renders campaign content with `dangerouslySetInnerHTML`.

**Recommendation:** verify campaign content is sanitized before render. For JSON-LD, use internal object serialization only and keep nonce strategy consistent.

---

### P2-Frontend-5 — Raw `<img>` usage should be reviewed

Examples:

- `components/shared/petpark/homepage-redesign.tsx`
- `app/(site)/udomljavanje/adoption-browse-content.tsx`

Some are decorative and have `alt=""`, which can be valid. But raw image usage can bypass Next image optimization.

**Recommendation:** use `next/image` where dimensions/remote patterns are stable; keep raw `<img>` only where required for SVG/static pixel-match assets.

---

## 8. SEO review notes

### Good

- `metadataBase` set to `https://petpark.hr`.
- Root GSC placeholder removed and env-gated.
- Duplicate title suffix cleanup done.
- Service detail has `generateMetadata` with canonical/OG basics.
- Blog slug fix and redirect added.

### Needs review

1. Verify canonical output after deployment/preview for:
   - `/usluge`
   - `/blog`
   - `/o-nama`
   - `/uvjeti`
   - one `/usluge/[slug]`
2. Re-check sitemap output against live routes.
3. Validate JSON-LD with Google Rich Results for:
   - city landing pages
   - blog detail
   - veterinarian/groomer/trainer pages
   - rescue/appeal pages
4. Ensure no aggregateRating exists without real reviews.
5. Decide whether `/blog` or `/zajednica` is the primary content hub; current code suggests both exist.

---

## 9. Accessibility review notes

Known positives:

- Many buttons/links include labels.
- Footer social links have aria labels.
- Empty states added for missing reviews.

Risks:

- Pixel homepage transparent link overlay can be hard to audit.
- Some old e2e/a11y warnings exist in lint output, e.g. missing image alt in dashboard sitter profile.
- Back-to-top label fixed to Croatian, but English routes may still have Croatian-only shell labels.
- Hidden `sr-only` SEO text should not duplicate H1s.

Recommended Fable checks:

- Keyboard navigation on homepage, `/usluge`, `/usluge/[slug]`, `/prijava`, `/registracija`, `/izgubljeni/prijavi`.
- Focus states on transparent homepage overlay links.
- Screen reader pass on service detail and booking request flow.
- Color contrast on muted orange/cream badges.

---

## 10. Performance review notes

### Build status

`npm run build` passes on branch `fix/audit-2026-06`.

### Risks

- App has very large route surface: 142 API route handlers and 200+ app routes in build output.
- Homepage pixel/reference assets and overlay design can become heavy/fragile.
- Many client components and framer-motion usage can increase JS.
- Dynamic routes are frequent because of auth/Supabase/session requirements.

### Recommended measurements

Run Lighthouse/WebPageTest on Vercel preview for:

- `/`
- `/usluge`
- `/usluge/[real-slug]`
- `/blog/[slug]`
- `/izgubljeni`
- `/registracija`

Track:

- LCP
- CLS
- INP
- total JS transferred
- image payload
- third-party scripts

---

## 11. Data/model review notes

Main model areas visible in repo:

- providers
- provider_services
- service_listings
- booking_requests
- lost_pets
- adoption/rescue
- forum/social
- payments/bookings
- pet passport

Risks:

- Some current functionality falls back between `service_listings` table and `provider_services` model.
- `service_listings` writes are disabled by guard, which is good, but future activation needs schema/RLS review.
- Local migrations include reconstructed files; live schema should be treated as source of truth until reconciled.

Recommended Fable ask:

- Compare live Supabase schema to migration history.
- Identify all service-role writes and required RLS policies.
- Produce table-by-table RLS matrix: owner, provider, admin, anonymous read, anonymous write.

---

## 12. Suggested fix order

### Phase A — Production blockers

1. Fill legal impressum placeholders and review legal text.
2. Fix CSRF/proxy control flow.
3. Add payment feature flag and disable all Stripe UI/API when false.
4. Replace no-op `rateLimit()` call sites.
5. Remove registration auto-confirm via service role.

### Phase B — Security hardening

6. Fix Stripe webhook CSRF behavior if payments enabled.
7. Harden uploads with magic-byte validation and scanning path.
8. Audit service-role routes and add ownership tests.
9. Fail closed for missing Supabase admin env in production.
10. Lock down analytics funnel schema/rate limits.

### Phase C — Frontend/SEO polish

11. Remove remaining user-facing MVP/internal copy.
12. Align sitemap/blog/zajednica canonical strategy.
13. Review `dangerouslySetInnerHTML` marketing content sanitization.
14. Replace or document raw `<img>` cases.
15. Plan semantic homepage rebuild after visual approval.

### Phase D — Regression test pack

16. Middleware/auth/CSRF tests.
17. Payment-disabled route tests.
18. Rate-limit enforcement tests.
19. Upload validation tests.
20. Playwright a11y smoke for key public flows.

---

## 13. Specific questions for Fable

1. Is the no-online-payment legal model correctly represented in `/uvjeti` and service-detail pages?
2. Should all Stripe routes be completely unavailable until online payments launch?
3. What is the preferred CSRF architecture for this app with Supabase cookie auth?
4. Should provider registration require email verification before profile/provider actions?
5. Which tables must be readable anonymously, and which must be strictly authenticated/admin-only?
6. Is the current homepage implementation acceptable as a production frontend, or should it be rebuilt semantically while preserving design?
7. Should `/blog` remain a first-class route or be folded into `/zajednica`?
8. Are reconstructed migrations acceptable as history, or should a fresh baseline migration be generated from live production schema?

---

## 14. Files Fable should inspect first

### Security/backend

- `proxy.ts`
- `middleware/csrf.ts`
- `lib/rate-limit.ts`
- `lib/upstash-rate-limit.ts`
- `lib/supabase/admin.ts`
- `app/(site)/api/auth/register/route.ts`
- `app/(site)/api/payments/webhook/route.ts`
- `app/(site)/api/payments/*`
- `app/(site)/api/upload/route.ts`
- `app/(site)/api/upload/verification/route.ts`
- `app/(site)/api/rescue-verification-documents/upload/route.ts`
- `app/(site)/api/analytics/funnel/route.ts`

### Frontend/product

- `components/shared/petpark/homepage-redesign.tsx`
- `components/shared/petpark/service-detail.tsx`
- `components/shared/petpark/services-marketplace.tsx`
- `app/(site)/usluge/[slug]/page.tsx`
- `app/(site)/checkout/[bookingId]/page.tsx`
- `app/(site)/onboarding/provider/provider-onboarding-form.tsx`
- `components/shared/footer.tsx`
- `app/(site)/uvjeti/page.tsx`
- `app/(site)/privatnost/page.tsx`
- `app/sitemap.ts`
- `next.config.ts`

### DB/schema

- `supabase/migrations/*reconstructed*.sql`
- service-listing modules under `lib/petpark/service-listings/`
- booking request modules under `lib/petpark/booking-requests/`

---

## 15. Final audit verdict

PetPark is close enough to be reviewed seriously, but not close enough for a clean production launch without targeted hardening.

The most important issue is not visual polish; it is consistency and trust:

- product says no online payments, code still exposes payment flows;
- CSRF is present but currently structurally wrong;
- rate limiting exists but one legacy helper disables it;
- email confirmation is bypassed;
- legal company data is still placeholder-blocked.

Fix those first. After that, the remaining frontend/SEO/performance work is manageable and can be sequenced without blocking the whole product.
