# AUTH MATRIX — PetPark local baseline

Datum: 2026-07-02
Scope: lokalni policy baseline iz koda. Nije live proof jer nema preview/live test usera.

Canonical machine-readable source: `docs/truth/AUTH-MATRIX.json`.

## Persone

- `anon` — bez sessiona/Bearer tokena
- `owner` — vlasnik ljubimca / obični korisnik
- `provider_owner` — pružatelj koji je vlasnik svog provider/resource zapisa
- `other_provider` — drugi pružatelj, tuđi resource
- `admin` — samo DB-backed admin iz `profile_roles.role = 'admin'`
- `suspended` — mora biti deny prije launch-a gdje god je suspension model aktivan; ako route još nema taj signal, ostaje launch nalaz

## Sažetak po grupama

### Admin

Uzorci: `/admin`, `/admin/service-listings`, `/api/admin/verifications`.

- anon: deny redirect/401
- owner/provider/other_provider: deny 403 ili redirect
- admin: allow samo preko `profile_roles`
- suspended: deny

Guard: `requireAdmin` + proxy prefilter, DB-backed.

### Payments

Uzorci: 6 payment API ruta bez webhooka.

Plaćanja su trenutno OFF. Svi profili dobivaju fail-closed 503 prije Stripe poziva.
Webhook je poseban slučaj: mora validirati Stripe signature i ne smije mijenjati poslovna stanja dok je payments flag off.

### Booking requests

Uzorci: `/api/booking-requests`, owner/provider liste i status ruta.

- anon: deny 401
- owner: samo vlastiti zapisi
- provider: samo vlastiti provider zapisi
- other_provider: deny/empty
- admin: samo gdje je kod eksplicitno dopušta
- suspended: launch blocker ako route ne provjerava suspension

### Uploads / verification documents

Uzorci: generic upload, verification upload, rescue verification upload, signed URL.

- anon: deny 401
- owner/provider: samo vlastita putanja ili vlastiti dokument
- other_provider: deny 403
- admin: allow za review docs samo DB-backed admin
- format datoteke: MIME/extension + magic bytes moraju se slagati

### Notifications

Uzorci: push, sms, booking/review email, welcome sequence.

- bulk push/sms/cross-user welcome: admin only preko `requireAdmin`
- SMS internal path: `SMS_INTERNAL_KEY` mora biti konfiguriran i matchati; missing env nikad nije implicitni allow
- owner/provider: samo vlastiti welcome sequence

### Lost pets relay/contact/status

- owner: vlastiti izgubljeni ljubimac
- admin: DB-backed admin gdje je kod dopušta
- ostali: deny ili public-contact flow uz rate limit, ovisno o ruti

## Test status

`tests/auth-matrix.test.ts` asertira da JSON baseline postoji, ima svih 6 persona i pokriva kritične route grupe iz KIT-B plana. To nije zamjena za preview/live E2E s pravim korisnicima.

## Launch blocker

Pravi integracijski auth test s realnim Supabase korisnicima ostaje human-gated jer traži test usere/sessione na preview/live i ne smije se raditi naslijepo protiv produkcije.
