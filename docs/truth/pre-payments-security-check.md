# Pre-payments security check — P0.3

Datum: 2026-07-04
Repo: `~/Projects/petpark` (`petpark-hr`)
Branch: `chore/verify-security-before-payments`
Scope: read-only dijagnostika + ovaj izvještaj. Bez deploya. Bez remote migracija.

## Sažetak gateova

- CSRF: PASS
- Globalni rate-limit / Upstash na payment rutama: FAIL / STOP
- Stripe webhook signature: PASS za invalid signature test kad je lokalno `PAYMENTS_ENABLED=true`
- Stripe webhook idempotencija preko `stripe_events`: FAIL / mora u P1
- Admin guard DB-backed: PASS
- `createAdminClient` fail-closed: PASS
- Provjera Vercel env-a: BLOCKED — lokalni Vercel CLI nema credentials/token

Zaključak: P1 se ne smije krenuti kao full payment build dok se ne riješi rate-limit na payment rutama i webhook idempotencija. CSRF i admin guard su dobri.

## 1. CSRF stvarno štiti

Status: PASS

Dokaz u kodu:

- `proxy.ts` izuzima samo `/api/payments/webhook` i `/api/cron/` iz CSRF-a.
- Mutirajuće metode prolaze kroz `csrfMiddleware` ako nema validnog Bearer tokena.
- `middleware/csrf.ts` ima state-changing metod check i double-submit cookie/header validaciju.

Stvarni lokalni curl test preko Next dev servera:

```txt
PORT=3017 npm run dev
GET / -> csrf_cookie_present=yes
POST /api/auth/logout bez CSRF tokena -> 403
body: {"error":"Nevažeći sigurnosni token. Osvježite stranicu i pokušajte ponovno.","code":"CSRF_INVALID"}
POST /api/auth/logout s csrf_token cookie + x-csrf-token header -> 200
body: {"success":true}
```

Dodatni dokaz:

```txt
npm run type-check -> PASS
npx vitest run tests/csrf.test.ts -> PASS, 15 tests
```

## 2. Rate limiting globalan / Upstash / fail-closed

Status: FAIL / STOP za naplatu

Što je dobro:

- `lib/rate-limit.ts` koristi Upstash Redis kad su `UPSTASH_REDIS_REST_URL` i `UPSTASH_REDIS_REST_TOKEN` postavljeni.
- Sensitive configovi mogu fail-closed kad Redis nije dostupan: auth, booking request create, uploads, lost-pets relay, SMS/email/push.
- Lokalni `.env.local` ima `UPSTASH_REDIS_REST_URL` i `UPSTASH_REDIS_REST_TOKEN` po imenu varijabli.

Problem:

- Payment rute u `app/(site)/api/payments/*/route.ts` trenutno ne koriste `rateLimitRequest`, `checkRateLimit`, `rateLimitAsync`, ni `createRateLimitResponse`.
- To znači da checkout/refund/connect/webhook rute nisu dokazano rate-limitane globalnim Upstash limiterom.
- Vercel env ne mogu potvrditi jer `vercel env ls` lokalno vraća: `No existing credentials found. Please run vercel login or pass --token`.

Dokaz:

```txt
grep payment/admin rate-limit usage -> nema rate-limit importa u app/(site)/api/payments/*
vercel env ls -> BLOCKED: no credentials
```

Ovo je tvrdi STOP za P1/P5 dok se ne doda fail-closed rate-limit barem na checkout/refund/connect/account-link/dashboard-link i webhook.

## 3. Webhook signature + idempotencija

Status:

- Signature validation: PASS
- `stripe_events` idempotencija: FAIL

Dokaz signature:

- `app/(site)/api/payments/webhook/route.ts` čita raw body preko `request.text()`.
- Odbija missing `stripe-signature`.
- Verificira `stripe.webhooks.constructEvent(body, sig, webhookSecret)`.

Lokalni test s privremenim dummy TEST env vrijednostima i `PAYMENTS_ENABLED=true`:

```txt
PAYMENTS_ENABLED=true STRIPE_SECRET_KEY=sk_test_... STRIPE_WEBHOOK_SECRET=whsec_testsecret PORT=3018 npm run dev
POST /api/payments/webhook sa stripe-signature: definitely-invalid -> 400
body: {"error":{"code":"INVALID_SIGNATURE","message":"Invalid signature"}}
```

Problem idempotencije:

- Migracija `supabase/migrations/20260424200000_reconstructed_stripe_events_and_payment_fields.sql` ima `public.stripe_events(event_id text primary key)`.
- Webhook handler NE insert-a `event.id` u `stripe_events` prije obrade.
- Trenutna idempotencija je parcijalna: za `checkout.session.completed` provjerava je li booking već `paid`, ali to nije opći event-level idempotency za sve evente.

Zaključak: signature dio je dobar, ali P1 mora dodati canonical `stripe_events` insert/no-op prije switch obrade eventa.

## 4. Admin guard DB-backed

Status: PASS

Dokaz:

- `lib/auth.ts` eksplicitno ne grant-a admin iz `user_metadata`.
- `hasDbAdminRole()` čita `profile_roles`.
- `applyDbBackedRole()` dodjeljuje admin samo ako DB potvrdi `profile_roles.role='admin'`; ako user/profile metadata kaže admin bez DB potvrde, spušta na owner.
- `requireAdmin()` koristi `getAuthUser()`.
- `proxy.ts` prefilter za `/admin/service-listings` također čita `profile_roles`.

Test dokaz:

```txt
npx vitest run tests/auth-matrix.test.ts -> PASS, 5 tests
```

## 5. `admin.ts` fail-closed

Status: PASS

Dokaz:

- `lib/supabase/admin.ts::createAdminClient()` baca grešku ako fale `NEXT_PUBLIC_SUPABASE_URL` ili `SUPABASE_SERVICE_ROLE_KEY` izvan build/CI faze.
- Placeholder client postoji samo za `CI=true` ili `NEXT_PHASE=phase-production-build` zbog static analysis/build kompatibilnosti.

## Verifikacija

Pokrenuto lokalno:

```txt
npm run type-check -> PASS
npx vitest run tests/csrf.test.ts tests/auth-matrix.test.ts tests/rate-limit.test.ts lib/rate-limiter.test.ts -> PASS, 61 tests
```

## Required fixes prije payments P1

1. ~~Dodati Upstash-backed fail-closed rate-limit na sve payment rute, uključujući webhook.~~ DONE na branchu `chore/verify-security-before-payments`.
2. ~~Dodati `stripe_events` event-level idempotenciju u webhook: insert `event.id` prije obrade, duplicate -> 200 no-op.~~ DONE na branchu `chore/verify-security-before-payments`.
3. Provjeriti Vercel preview/prod env imena za `UPSTASH_REDIS_REST_URL` i `UPSTASH_REDIS_REST_TOKEN` kad bude dostupan Vercel token/login.
4. Tek nakon toga nastaviti na P1 Connect kod u TEST modu.

## Remediation update — 2026-07-04

Promjene:

- Dodan `lib/payments-rate-limit.ts` kao zajednički helper za payment rute.
- Dodani fail-closed payment limiteri u `RateLimits`: connect, account-link, account-status, checkout, dashboard-link, refund, webhook.
- Sve rute u `app/(site)/api/payments/*/route.ts` sada zovu `enforcePaymentRateLimit(request, ...)` nakon `PAYMENTS_ENABLED` gatea.
- Webhook sada insert-a `event.id` u `stripe_events` prije obrade; duplicate primary-key `23505` vraća 200 no-op.
- Webhook nakon obrade best-effort upisuje `processed_at` i `processing_result`.
- Dodan regression test `tests/payments-security-regression.test.ts` da payment rute ne izgube limiter/idempotenciju.

Verifikacija nakon fixeva:

```txt
npm run type-check -> PASS
npx vitest run tests/payments-security-regression.test.ts tests/rate-limit.test.ts tests/csrf.test.ts tests/auth-matrix.test.ts lib/rate-limiter.test.ts -> PASS, 69 tests
```
