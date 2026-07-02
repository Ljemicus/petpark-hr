# KIT-B1 CSRF — local implementation

Datum: 2026-07-02
Scope: lokalni kod, bez deploya.

## Uzrok

CSRF zaštita je bila strukturalno slaba:

- previše mutirajućih ruta je bilo izuzeto u `proxy.ts`
- auth/register/login/logout/forgot-password su bili izuzeti
- booking-request i notifications rute su bile paušalno izuzete, umjesto samo validni Bearer API pozivi
- middleware je za GET vraćao `NextResponse.next()` prerano, što može preskočiti ostatak proxy logike
- double-submit token nije imao client-side način da dosljedno uđe u `x-csrf-token`

## Promjena

- `middleware/csrf.ts` sada radi:
  - trusted `Origin` / `Sec-Fetch-Site` check
  - double-submit cookie/header check
  - mutating methods only: `POST`, `PUT`, `PATCH`, `DELETE`
- `proxy.ts` sada izuzima samo:
  - Stripe webhook (`/api/payments/webhook`) — potpis je authenticator
  - cron rute (`/api/cron/`) — handler mora imati `CRON_SECRET`
- Bearer API/mobile zahtjevi preskaču CSRF samo ako Supabase `auth.getUser(token)` validira token.
- Dodan `CsrfFetchGuard` client component koji automatski dodaje `x-csrf-token` na same-origin mutirajući `fetch`.
- CSRF cookie se dodaje na proxy response bez preskakanja ostatka proxy logike.

## Namjerno

CSRF cookie nije `HttpOnly` jer double-submit pattern zahtijeva da client pročita token i stavi ga u header. Token nije session secret.

## Nije rađeno

- nije testirano na preview/live URL-u
- nije deployano
- nije mijenjana mobile auth arhitektura

## Gate status

Lokalni gateovi se vode u commit poruci / završnom izvještaju.
