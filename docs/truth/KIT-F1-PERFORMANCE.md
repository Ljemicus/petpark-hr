# KIT-F1 PERFORMANCE — gate-aware status

Datum: 2026-07-03
Scope: safe pre-launch pass; bez deploya i bez Lighthouse mjerenja na produkciji.

## Presuda

F-V1 nije launch-green jer Launch Gate još nije potpuno zelen i nema odobrenog preview/prod targeta za Lighthouse CI mjerenje.

## Što je sigurno potvrđeno lokalno u master-kit ciklusu

- `npm run type-check` — PASS prije ovog KIT-F nastavka.
- `npm run build` — PASS prije ovog KIT-F nastavka.
- `@next/bundle-analyzer` već postoji u devDependencies.
- `next.config.ts` već ima Sentry tree-shaking/tunnel konfiguraciju.

## Lighthouse CI budžeti za budući gate

Targeti:

- `/`
- `/pretraga`
- jedan stvarni provider profil: `/sitter/<id>` ili `/groomer/<id>` s realnim public profilom

Budžeti:

- LCP < 2.5 s
- CLS < 0.1
- INP < 200 ms
- performance score ≥ 90

Prva 2 tjedna: warning. Nakon toga: hard fail.

## Otvoreno

- Nije dodan novi LHCI dependency u ovom prolazu da ne širimo toolchain bez odluke.
- Nisu mijenjani hero/logo/slider elementi.
- Bundle top-5 ruta treba mjeriti na build artifactu kad se odobri performance sprint/preview target.
