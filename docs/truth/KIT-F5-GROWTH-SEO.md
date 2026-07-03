# KIT-F5 GROWTH / SEO — safe pass

Datum: 2026-07-03
Scope: dokumentacija i QA status; bez Search Console akcija u ime vlasnika.

## City landing status

Provjerene postojeće city landing površine u kodu:

- `/cuvanje-pasa-zagreb`, `/cuvanje-pasa-rijeka`, `/cuvanje-pasa-split`
- `/grooming-zagreb`
- EN parovi gdje postoje u `app/(site)`

KIT-D je već očistio lokalizirane površine i sitemap routing; `/o-nama` je dodan u localized static routes jer `/o-nama/en` postoji.

## JSON-LD

- Projekt ima centralni `lib/seo/structured-data.ts`.
- Nije pokretan vanjski Schema validator u ovom sliceu jer bi tražio live/preview URL i potencijalno vanjske akcije.
- Prije launch-a validirati `/`, `/pretraga`, jedan stvarni provider profil i city landing.

## Search Console

Vlasnički koraci su dokumentirani u `docs/truth/SEARCH-CONSOLE.md`.
OpenClaw ne može umjesto vlasnika potvrditi domenu bez pristupa DNS/Search Console računu.

## Blog tehnička spremnost

Blog rute postoje (`/blog`, `/blog/[slug]`) i koriste metadata/OG sloj. Sadržajni plan nije dio ovog kita.

## Otvoreno

- Schema validator PASS na live/preview URL-ovima.
- Search Console domain verification + sitemap submit.
