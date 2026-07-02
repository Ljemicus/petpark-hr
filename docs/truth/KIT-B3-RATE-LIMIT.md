# KIT-B PR-B3 — Rate limiting (2026-07-02)

## Uzrok

- `lib/rate-limit.ts::rateLimit()` bio je sinkroni legacy helper koji u praksi uvijek vraća `true` jer Upstash provjera mora biti async.
- Repo je imao tri app-facing rate-limit modula (`lib/rate-limit.ts`, `lib/rate-limiter.ts`, `lib/upstash-rate-limit.ts`) s različitim defaultima.

## Promjena

- `lib/upstash-rate-limit.ts` je canonical modul.
- `lib/rate-limiter.ts` je compatibility re-export shim.
- `lib/rate-limit.ts` je compatibility shim, ali stari sync `rateLimit()` je namjerno onemogućen i baca grešku ako se ponovno koristi.
- Legacy rute koje su koristile sync no-op helper prebačene su na `rateLimitAsync()`:
  - `api/upload`
  - `api/upload/verification`
  - `api/rescue-verification-documents/upload`
  - `api/lost-pets/[id]/relay`
  - `api/lost-pets/[id]/sightings`
  - `api/support`
  - `api/notifications`
  - `api/sitters`
  - `api/groomers`
  - `api/availability`
  - `api/trainer-programs`
  - `api/trainers/[id]/programs`
  - `api/appeals/donation-click`
- Sensitive konfiguracije fail-closed kad Redis nije dostupan:
  - auth login/register/reset
  - upload rute
  - lost-pets relay/sightings
  - support
  - booking-request create
  - sms/email/push konfiguracije u canonical modulu
- General/public rate-limiti ostaju fail-open s in-memory fallbackom.
- 429 odgovor vraća hrvatsku poruku i `Retry-After` header kad postoji.

## Početni limiti

- login: 10 / 15 min / IP
- registracija: 5 / h / IP
- forgot/reset password: 5 / h / IP
- booking-request create: 10 / h
- lost-pets relay: 3 / h / IP; postoji i user-level config 10 / dan za sljedeći fine-grain prolaz
- upload: 20 / h
- opći write: 60 / 15 min

## Dokaz

- `npm run type-check` PASS
- `npx vitest run tests/rate-limit.test.ts lib/rate-limiter.test.ts` PASS — 41 testa

## Granice ovog slicea

- Nije rađen PR-B1 CSRF ni PR-B2 email verification gate.
- Nije dodan Upstash E2E test protiv pravog Redis servisa; testira se in-memory fallback i fail-closed ugovor bez env varova.
- `lib/api/*rate-limit*` nije diran jer nema direktnih app-route importova.
