# KIT-F OPERATIONS READINESS — safe pre-launch slice

Datum: 2026-07-03
Scope: operativa bez deploya, bez remote DB promjena.

## Što je napravljeno

- `/api/health` je hardened da bude side-effect free:
  - više ne šalje synthetic Sentry event iz health checka
  - ne ispisuje secrets
  - Redis/Upstash provjera razlikuje missing token od normalnog unconfigured stanja
  - Sentry je config-only check, ne runtime event emitter
- Postojeći runbookovi su pregledani:
  - `docs/architecture/observability-runbook.md`
  - `docs/DEPLOYMENT-CHECKLIST.md`
  - `docs/rollback-plan.md`
- KIT-C docs sada pokrivaju migration/RLS/storage readiness.

## Health endpoint očekivanje

Endpoint: `/api/health`

Critical checks:

- `database`
- `redis` kad je Redis URL konfiguriran

Warning checks:

- Redis nije konfiguriran: warning, jer app može raditi ali rate-limit fallback nije production-grade
- Sentry nije konfiguriran: warning, jer app može raditi ali observability nije launch-grade

Launch-grade očekivanje:

- `database.status = ok`
- `redis.status = ok` u productionu
- `sentry.status = ok` prije javnog launch monitoring potpisa

## Pre-launch gates koji su već zeleni u ovom master-kit ciklusu

Web:

- `npm run type-check` PASS
- `npm run build` PASS

Mobile:

- `npx tsc --noEmit` PASS
- `npx expo-doctor` PASS
- `bash scripts/audit-features.sh` PASS
- booking bearer contract check PASS

## Još blokirano / traži vlasnika

- Production deploy
- Remote Supabase migrations
- Legal/privacy/terms final data
- CSRF PR merge
- Email verification PR merge
- Real-device QA execution
- Preview integration smoke bez test usera/preview URL-a

## Minimalni launch-day redoslijed kad vlasnik odobri

1. Confirm env values in hosting without exposing secrets.
2. Confirm `/api/health` on preview.
3. Run web gate:
   - `npm run type-check`
   - `npm run build`
4. Run mobile gate:
   - `npx tsc --noEmit`
   - `npx expo-doctor`
   - `bash scripts/audit-features.sh`
5. If DB changes are needed, apply only newly reviewed additive migration with explicit owner signature.
6. Run RLS/storage tests from `RLS-MATRIX.md` and `STORAGE-MATRIX.md`.
7. Smoke core flows:
   - homepage/search/listing
   - owner booking request
   - provider dashboard message/request view
   - upload verification doc signed URL
   - disabled payment/shop/forum states remain honest
8. Production deploy only after explicit approval.
9. Watch Sentry/Vercel/Supabase for 30–60 minutes.

## Rollback principle

- Code issue: Vercel rollback first.
- DB issue: stop, assess; never destructive rollback casually.
- Feature issue in disabled modules: keep module disabled; do not hot-enable partial schemas.
