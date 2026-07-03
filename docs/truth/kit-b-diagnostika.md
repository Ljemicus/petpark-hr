# KIT-B dijagnostika — sažetak (2026-07-03)

Izvorni raw output: `docs/truth/kit-b-diagnostika-raw.md`.

## B1 — CSRF

- `proxy.ts` primjenjuje CSRF na mutirajuće metode i izuzima samo `/api/payments/webhook` i `/api/cron/`.
- Browser-cookie zahtjevi prolaze kroz `csrfMiddleware`; Bearer token zahtjevi preskaču CSRF tek nakon Supabase `auth.getUser(token)` validacije.
- `middleware/csrf.ts` provjerava `Origin`/`Referer`/`Sec-Fetch-Site` i double-submit cookie/header token.
- Status: raniji bug je već popravljen. Nema dodatnog local patcha u ovoj rundi.

## B2 — Email verification bypass

- `app/(site)/api/auth/register/route.ts` koristi standardni `supabase.auth.signUp`.
- Nema `admin.createUser`, `email_confirm: true` ni ručnog `confirmed_at` bypassa u registracijskom toku.
- Status: raniji bug je već popravljen. UI resend/confirmation copy ostaje kandidat za zaseban UX pass, nije sigurnosni bypass.

## B3 — Rate limiting

- Prije ove runde stvarna implementacija je bila u `lib/upstash-rate-limit.ts`, a `lib/rate-limit.ts` je bio wrapper.
- Patch: konsolidirano prema kitu — `lib/rate-limit.ts` je sada stvarni Upstash modul; `lib/upstash-rate-limit.ts` i `lib/rate-limiter.ts` samo re-exportaju canonical modul.
- Sensitive rute imaju `failClosed: true`; general rute fallbackaju na memory limiter kad Redis nije konfiguriran.
- 429 odgovor sadrži hrvatsku poruku i `Retry-After` header.

## B4 — Upload i dokumenti

- Upload rute već provjeravaju MIME + magic bytes preko `validateUploadSignature`.
- Veličine: slike ≤ 8 MB, dokumenti ≤ 15 MB kroz shared helper.
- Bucket allowlist postoji; private bucket `verification-docs` ne vraća public URL.
- Signed URL TTL je 300 sekundi.
- Signed URL pristup provjerava vlasnika organizacije ili DB-backed admin rolu dobivenu kroz `getAuthUser()`.
- Napomena: generic `api/upload` putanje su `users/{userId}/...`, ne točno `{userId}/...`; to je vlasnički prefix i nije mijenjano da se ne razbije postojeći storage layout bez migracije.

## B5 — Payments/admin fail-closed

- 7 payment ruta imaju `arePaymentsEnabled()` guard prije Stripe poziva: `connect`, `account-link`, `account-status`, `create-checkout`, `dashboard-link`, `refund`, `webhook`.
- Webhook trenutno vraća 503 kad su payments off. KIT traži webhook exception + `stripe_events` idempotenciju, ali to zahtijeva novu tablicu/migraciju; bez DB write approvala nije mijenjano.
- Refund već provjerava vlasništvo/sitter/admin i reason/actor match, ali je mrtav dok je flag off.
- Patch: `lib/supabase/admin.ts` više ne vraća placeholder Supabase admin klijent u runtimeu kad env fali; baca jasnu grešku s imenima varijabli. Placeholder je dopušten samo u CI/build fazi radi statičke analize.
- Admin rola se ne grant-a iz auth metadata; `lib/auth.ts` čita `profile_roles`, a metadata `admin` spušta na `owner`.

## B6 — Zod validacija ulaza

- Auth rute, booking-request rute, upload metadata, lost-pets relay/contact, payments payloadi i više P0 ruta već imaju zod/validation sheme.
- Branch već nosi raniji KIT-B6 rad; dodatni sweeping po svim rutama ostaje P1 i nije blokirajuć za ovu rundu.

## Blokirano / nije rađeno

- `stripe_events` idempotency tablica i webhook no-op zapisivanje dok su payments off: zahtijeva migration/remote DB odluku.
- Human-gated PR-B1/PR-B2 merge flow: dokumentirano kao već popravljeno, bez novog gated PR-a.
