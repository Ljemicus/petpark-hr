# PetPark handoff za Fable — 2026-07-03

## TL;DR

PetPark Master Kit je procesiran, DB promjene su owner-approved i aplicirane na remote Supabase, web je deployan na produkciju `https://petpark.hr`, a Chromium live QA je prošao bez HTTP/console/browser warninga na ključnim rutama.

Zadnji live web build:

- Production: `https://petpark.hr`
- Health buildSha: `d020f9a9ae0d0a9912c2d60b2ed4a85243a61577`
- Web branch: `fix/kit-b-pr-b6-input-validation`
- Mobile branch: `fix/kit-e-mobile-istina`

## Repo stanje

### Web

Path:

- `/Users/ljemicus/Projects/petpark`

Branch:

- `fix/kit-b-pr-b6-input-validation`

Latest commits:

- `d020f9a9 fix(pwa): add mobile web app capability meta`
- `2e0bbac3 kit(db): apply approved remote schema foundations`
- `14b05e7c docs: finalize petpark master kit handoff`
- `5d5fe040 kitF(launch): document gated readiness and health sha`
- `b56026be kitD(seo): clean localized surfaces`
- `536964f8 kitC(docs): refresh schema truth from live dump`
- `7d0db2ad kitB(security): consolidate rate limit and fail closed admin client`
- `1b99fa5d kitA(legal): align copy with disabled payments`
- `b558b212 kit0: add master kit truth inventory`

Pushed to GitHub:

- `origin/fix/kit-b-pr-b6-input-validation`

### Mobile

Path:

- `/Users/ljemicus/Projects/petpark-mobile`

Branch:

- `fix/kit-e-mobile-istina`

Latest relevant commits:

- `a1bb717 kit(db): refresh mobile schema types`
- `ca6d41b kitE(mobile): close diagnostics and gated surfaces`
- `a3f974e kit0: refresh mobile truth inventory`

Pushed to GitHub:

- `origin/fix/kit-e-mobile-istina`

Mobile app store deploy was **not** done.

## Master Kit source

ZIP source of truth:

- `/Users/ljemicus/.openclaw/media/inbound/PETPARK-MASTER-KIT-2026-07-02---2a2a4ae5-22e9-4cbc-bace-fe104969822f.zip`

Extracted path:

- `/Users/ljemicus/.openclaw/workspace/artifacts/petpark-master-kit-2026-07-02/PETPARK-MASTER-KIT-2026-07-02`

Main prior handoff:

- `/Users/ljemicus/Projects/petpark/docs/handoff-petpark-master-kit-2026-07-03.md`

## What was done

### KIT-0 inventory / truth

Added/generated truth inventory scripts and docs.

Important files:

- `scripts/kit/00-inventura.sh`
- `scripts/kit/introspect-remote.sql`
- `scripts/kit/run-introspect.cjs`
- `docs/truth/TRUTH.md`
- `docs/truth/TABLE-CLASSIFICATION.md`
- `docs/truth/ENV-MATRIX.md`
- `docs/truth/FAKE-SURFACES.md`
- `docs/truth/live-schema-dump-2026-07-03.md`

Remote introspection found:

- 32 public tables before new DB apply
- RLS disabled count: 0
- buckets: `avatars` public, `pet-photos` public, `verification-docs` private
- trainer/training tables existed
- forum/shop/product/breeder tables were missing before apply

### KIT-A legal/copy

Safe legal/copy alignment only.

Commit:

- `1b99fa5d kitA(legal): align copy with disabled payments`

Key decision:

- Do **not** invent legal data.
- `/impressum` / full legal block remains blocked until real company/legal data and sign-off.
- Payments remain disabled/gated.

### KIT-B security

Consolidated rate limiting and hardened admin Supabase client behavior.

Commit:

- `7d0db2ad kitB(security): consolidate rate limit and fail closed admin client`

Key changes:

- `lib/rate-limit.ts` is canonical.
- `lib/upstash-rate-limit.ts` and `lib/rate-limiter.ts` re-export canonical limiter.
- `lib/supabase/admin.ts` fails closed at runtime if admin env vars are missing, while allowing CI/build placeholder behavior.

### KIT-C schema truth/types

Generated fresh remote Supabase types.

Commit:

- `536964f8 kitC(docs): refresh schema truth from live dump`

Notes:

- Web type convention: `lib/supabase/types.ts`
- Mobile type convention: `lib/database.types.ts`
- Supabase CLI initially failed with Sentry empty username; workaround was neutral env:
  - `SENTRY_DSN='' NEXT_PUBLIC_SENTRY_DSN=''`

### KIT-D SEO/frontend truth cleanup

Commit:

- `b56026be kitD(seo): clean localized surfaces`

Key changes:

- Added `/o-nama` to localized static routes in sitemap.
- Fixed dead English link in `/o-nama/en`.
- Cleaned `docs/truth/en-surface.md`.
- Kept PetPark logo and homepage slider untouched.

### KIT-E mobile

Commit:

- `ca6d41b kitE(mobile): close diagnostics and gated surfaces`

Key changes:

- Added honest disabled breeder chat route:
  - `app/dashboard/breeder/chat.tsx`
- `completeOnboarding()` now captures app errors and fails honestly instead of locally marking onboarding complete when Supabase save fails.
- Confirmed bearer auth flow for booking requests.
- Added/updated diagnostics docs:
  - `docs/truth/mobile-kit-e-diagnostics.md`
  - `docs/truth/KIT-E5-SENTRY-RN.md`
  - `docs/truth/KIT-E6-REAL-DEVICE-QA.md`
  - `docs/truth/DEVICE-QA.md`

### KIT-F launch/gate-aware work

Commit:

- `5d5fe040 kitF(launch): document gated readiness and health sha`

Key changes:

- Did **not** mark launch green.
- Added `buildSha` to `/api/health` from Vercel commit env.
- Added/updated launch docs:
  - `docs/truth/KIT-F1-PERFORMANCE.md`
  - `docs/truth/KIT-F2-OBSERVABILITY.md`
  - `docs/truth/KIT-F3-SUPPLY-FUNNEL.md`
  - `docs/truth/KIT-F5-GROWTH-SEO.md`
  - `docs/truth/LAUNCH-GATE-STATUS.md`

## DB apply — owner approved

Ljemicus explicitly approved DB apply on 2026-07-03.

Supabase project:

- `hmtlcgjcxhjecsbmmxol`

Applied remote migrations:

- `20260703125000_forum_shop_breeder_pet_extras.sql`
- `20260703125500_search_indexes.sql`

Commit:

- `2e0bbac3 kit(db): apply approved remote schema foundations`

Mobile types commit:

- `a1bb717 kit(db): refresh mobile schema types`

Important DB doc:

- `docs/truth/DB-APPLY-2026-07-03.md`

### Why direct query, not `supabase db push`

`supabase db push` was intentionally avoided because old local migration `20260423140000_rls_least_privilege_hardening.sql` was not on remote and referenced incompatible legacy assumptions.

That file was moved to:

- `supabase/drafts/legacy/20260423140000_rls_least_privilege_hardening.LEGACY_NOT_APPLIED.sql`

### New tables created

- `forum_topics`
- `forum_comments`
- `products`
- `product_reviews`
- `cart_items`
- `publisher_profiles`
- `litters`
- `puppies`
- `applications`
- `breeder_reviews`
- `breeder_documents`
- `rescue_listings`
- `rescue_appeals`
- `pet_appointments`
- `pet_documents`
- `pet_updates`

RLS enabled immediately on all new tables.

### Search indexes applied

- `service_listings_city_category_public_idx`
- `service_listings_category_city_public_idx`
- `provider_services_active_service_provider_idx`
- `service_listings_title_trgm_idx`
- `service_listings_description_trgm_idx`

Also ensured `pg_trgm` exists in `extensions` schema.

### DB verification

After apply:

- new tables present: 16
- RLS disabled on new tables: 0
- search indexes present: 5
- policies on new tables: 30
- DB lint: PASS
- migration history includes:
  - `20260703125000`
  - `20260703125500`

### Drafts intentionally not applied verbatim

Not applied raw:

- mobile `00006_mobile_feature_foundation.DRAFT.sql`
- mobile `00007_forum_shop_breeder_pet_extras.DRAFT.sql`

Reason:

- `00006` says it is superseded by remote schema.
- `00007` did not match current app code:
  - `forum_replies` vs current `forum_comments`
  - `price_cents` vs current `price`
  - `profile_id/publisher_type` vs current `user_id/type`

A corrected additive migration aligned to current code was applied instead.

## Production deploy

Ljemicus approved deploy on 2026-07-03.

Deploy method:

- Vercel CLI using Keychain token.

Production URL:

- `https://petpark.hr`

Initial deploy buildSha:

- `2e0bbac3efbcd3a93ec257d7725b3592a61909ab`

After Chromium QA PWA fix, final production buildSha:

- `d020f9a9ae0d0a9912c2d60b2ed4a85243a61577`

Final deployment commit:

- `d020f9a9 fix(pwa): add mobile web app capability meta`

## Chromium live QA

Ljemicus asked to connect Chromium and do what was needed.

Used isolated Chromium profile with CDP/debug port, not the user’s existing profile.

Audit artifact folder:

- `/Users/ljemicus/.openclaw/workspace/artifacts/petpark-browser-audit-2026-07-03/`

Checked routes:

- `/`
- `/pretraga`
- `/forum`
- `/shop`
- `/uzgajivacnice`
- `/udomljavanje`
- `/o-nama`
- `/kontakt`
- mobile `/`
- mobile `/shop`

Initial finding:

- Browser warning: deprecated Apple-only PWA meta without `mobile-web-app-capable`.

Fix:

- Added `<meta name="mobile-web-app-capable" content="yes" />` in `app/layout.tsx`.

Final Chromium audit after deploy:

- HTTP errors: 0
- console errors: 0
- browser warnings: 0
- placeholders: false on audited routes
- focused rerun for `/o-nama` and `/kontakt` showed no repeatable failed URL

Screenshots/artifacts:

- `artifacts/petpark-browser-audit-2026-07-03/desktop-home.png`
- `artifacts/petpark-browser-audit-2026-07-03/mobile-home.png`
- plus screenshots for forum, shop, search, breeders, adoption, about, contact.

## Verification gates run

### Web

Passed:

- `npm run type-check`
- `npm run build`
- placeholder guard
- draft-copy guard
- `supabase db lint --linked`
- live smoke:
  - `/api/health` HTTP 200
  - `/` HTTP 200
  - `/sitemap.xml` HTTP 200
  - `/robots.txt` HTTP 200
- Chromium live QA final pass

### Mobile

Passed:

- `npx tsc --noEmit`
- `npx expo-doctor` — 19/19
- `npx expo export --output-dir /tmp/petpark-mobile-export`
- booking bearer check script
- feature audit script

## Known warnings / still blocked

### Production health warnings

`/api/health` is healthy and DB is ok, but still reports warnings:

- Redis not configured / rate limit fallback may be local only
- Sentry DSN not configured

These are not current deploy blockers, but should be fixed before serious launch/traffic.

### Launch Gate is still not fully green

Still blocked:

- real legal/impressum data and owner/legal sign-off
- real-device mobile QA on physical iOS/Android
- Sentry/Slack/uptime production monitoring setup
- Search Console domain verification and sitemap submit
- payment enablement
- app store deploy

### Legal hard gate

Do not invent:

- legal company name
- OIB
- MBS/MBO
- registered address
- share capital
- competent register/court

`content/legal/legal-data.json` still intentionally contains placeholders.

### Payments

Payments remain off/gated.

Do not enable Stripe/payment flows without explicit approval and production readiness checks.

## What Fable should do next

Recommended next order:

1. Fix production env warnings:
   - configure Redis env vars on Vercel if available
   - configure Sentry DSN / auth token if Sentry is intended for prod
2. Run a tighter authenticated flow QA:
   - login/register
   - owner dashboard
   - provider dashboard
   - pet creation
   - booking request creation
   - forum create/comment if product wants it live
3. Decide which newly-created DB-backed surfaces should become live vs remain “uskoro”.
4. Legal/impressum: collect real legal data from owner and only then update public legal pages.
5. Search Console + sitemap submit.
6. Real-device mobile QA.
7. Only after explicit approval: payments and app-store release.

## Useful commands

Web local checks:

```bash
cd /Users/ljemicus/Projects/petpark
npm run type-check
npm run build
SENTRY_DSN='' NEXT_PUBLIC_SENTRY_DSN='' supabase db lint --linked
```

Mobile checks:

```bash
cd /Users/ljemicus/Projects/petpark-mobile
npx tsc --noEmit
npx expo-doctor
npx expo export --output-dir /tmp/petpark-mobile-export
```

Health check:

```bash
curl -sS https://petpark.hr/api/health
```

Current important docs:

- `docs/handoff-petpark-master-kit-2026-07-03.md`
- `docs/truth/DB-APPLY-2026-07-03.md`
- `docs/truth/LAUNCH-GATE-STATUS.md`
- `docs/truth/RUNBOOK.md`
- `docs/truth/DEVICE-QA.md`

## Non-negotiables

- Do not change the real PetPark logo.
- Do not remove/change homepage top slider unless Ljemicus explicitly approves.
- Do not deploy new visual homepage changes without preview → approval → live.
- Do not enable payments without explicit approval.
- Do not invent legal data.
- Do not run `supabase db push` blindly; remote schema is source of truth and legacy drafts exist.
- Do not expose secrets in logs or files.
