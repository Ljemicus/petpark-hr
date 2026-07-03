# PETPARK RUNBOOK — launch operations

Datum: 2026-07-03
Scope: KIT-F8 operativni runbook. Bez deploya i bez remote DB promjena.

## 0. Zlatno pravilo

Ako nije jasno je li incident code, DB ili config: prvo zaustavi promjene, snapshotiraj stanje, zatim diraj najmanju reverzibilnu stvar.

## 1. Health i monitoring

Provjeri:

- `GET /`
- `GET /api/health`

Očekivanje za production launch:

- `status=healthy`
- `checks.database.status=ok`
- `checks.redis.status=ok`
- `checks.sentry.status=ok` ili svjesno prihvaćen warning prije soft launcha

Ako `/api/health` vrati 503:

1. pogledaj koji check je `error`
2. Supabase problem → provjeri Supabase status + env credentials
3. Redis problem → provjeri `UPSTASH_REDIS_REST_URL` i `UPSTASH_REDIS_REST_TOKEN`
4. Sentry warning nije sam po sebi razlog za rušenje appa, ali je launch-grade blocker za observability

## 2. Supabase PITR / backup

Prije production DB promjene:

1. potvrditi da je PITR/backup dostupan za projekt `hmtlcgjcxhjecsbmmxol`
2. zapisati vrijeme prije migracije
3. sačuvati SQL migracije i commit SHA
4. ne primjenjivati draft ako nema rollback princip

Restore princip:

- prvo procijeni može li se popraviti forward-only aditivnim hotfixom
- destructive restore samo ako je incident kritičan i vlasnik potvrdi
- nakon restorea uskladiti code deploy s vraćenim schema stanjem

## 3. Vercel rollback

Ako novi deploy ruši core flow:

1. Vercel Dashboard → Project → Deployments
2. na zadnji poznato-dobar deploy: Promote to Production
3. zabilježiti vrijeme rollbacka i razlog
4. ne raditi DB rollback ako problem nije DB

CLI ekvivalent postoji, ali dashboard rollback je sigurniji za incident bez terminal zabune.

## 4. Migracijski rollback princip

PetPark pravilo:

- preferirati aditivne migracije
- izbjegavati `drop`, `rename`, breaking constraint promjene u launch tjednu
- draft mora imati rollback komentar ili companion `drop index concurrently if exists` / policy disable plan
- remote apply samo uz eksplicitni vlasnikov potpis

## 5. Feature flag / kill-switch pravila

Plaćanja:

- payments su trenutno OFF
- payment rute/UI moraju fail-closed
- V9 aktivacija plaćanja nije dio ovog kita

Shop/forum/breeder:

- držati honest disabled dok schema/RLS/UI smoke nisu gotovi
- ne prikazivati mock kao produkcijski sadržaj

Notifikacije:

- ako kanal puca, preferirati per-channel disable umjesto globalnog gašenja appa
- budući dispatcher treba `NOTIFY_PUSH_ENABLED`, `NOTIFY_EMAIL_ENABLED`, `NOTIFY_SMS_ENABLED`

## 6. Incident koraci

### P0 — site down / auth down / data exposure

1. Stop deploys
2. Rollback code ako je zadnji deploy sumnjiv
3. Ako je credential leak: rotate secrets
4. Ako je data exposure: sakriti affected route/feature, zabilježiti scope
5. Javiti vlasniku kratko: impact, vrijeme, trenutna mjera

### P1 — booking/request flow ne radi

1. Provjeri `/api/health`
2. Provjeri request-id u response/logovima
3. Gledaj scope logove: `booking-requests`, `bookings`, `messages`
4. Ako je DB/RLS: ne popravljati UI naslijepo

### P2 — SEO/content problem

1. Ne rollbackati app ako core radi
2. popraviti canonical/noindex/sitemap u branchu
3. rebuild/preview prije produkcije

## 7. Kontakti/odgovornosti

- Owner: Ljemicus
- Hosting: Vercel
- DB/Auth/Storage: Supabase
- Error tracking: Sentry
- Email: Resend kad key bude postavljen
- Payments: Stripe, ali OFF dok V9 nije odobren

## 8. Blokirano do vlasnika

- production deploy
- remote DB migracije
- legal tekstovi
- real-device mobile QA
- Sentry/Slack alert test u produkciji
- Search Console domain verification
