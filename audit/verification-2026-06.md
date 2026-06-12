# PetPark audit verification — 2026-06-12

## Static grep checks before build

```
-- Nacrt Service Listing
-- within_2_hours
components/shared/petpark/service-detail.tsx:84:    within_2_hours: 'Odgovara unutar 2 sata',
lib/petpark/service-listings/mappers.ts:105:    within_2_hours: 'Odgovara unutar 2 sata',
-- Plaćanje nije uključeno u ovaj MVP
-- Booking Request MVP
-- 1.220
-- PetPark | PetPark
-- google-site-verification-code
-- prilagođen kućnim ljubimcima-plaze-parkovi-hrvatska
next.config.ts:29:      { source: '/blog/prilagođen kućnim ljubimcima-plaze-parkovi-hrvatska', destination: '/blog/pet-friendly-plaze-parkovi-hrvatska', permanent: true },
```

## Gates

- npm run lint: PASS (warnings only, pre-existing)
- npx tsc --noEmit: PASS
- npm run build: PASS
- node scripts/check-placeholders.mjs: EXPECTED FAIL because T2 legal impressum placeholders remain until OIB/MBS/adresa/kapital are supplied

## Post-build placeholder guard output

```
Placeholder tokeni {{...}} pronađeni izvan dopuštenog T2 impressum izvora:
- .next/server/app/hard-404.html: {{PUNA_ADRESA}}, {{OIB}}, {{MBS}}, {{KAPITAL}}
- .next/server/chunks/ssr/_0en7.2a._.js: {{PUNA_ADRESA}}, {{OIB}}, {{MBS}}, {{KAPITAL}}
- .next/server/chunks/ssr/app_(site)_privatnost_page_tsx_0xi5_96._.js: {{PUNA_ADRESA}}, {{OIB}}, {{MBS}}, {{KAPITAL}}
- .next/server/chunks/ssr/app_(site)_uvjeti_page_tsx_0elkwg9._.js: {{PUNA_ADRESA}}, {{OIB}}, {{MBS}}, {{KAPITAL}}
- .next/static/chunks/0.2qlqdds_-hj.js: {{PUNA_ADRESA}}, {{OIB}}, {{MBS}}, {{KAPITAL}}
```

## Manual checklist

- [x] GSC placeholder removed; env-gated NEXT_PUBLIC_GSC_TOKEN only
- [x] Detail service metadata has title/description/OG/canonical in generateMetadata
- [x] Nema hardkodiranog “1.220” brojača; koristi stvarni count ili tekst bez broja
- [x] Homepage feed više ne glumi stvarne lokacije/vremena; označen je kao primjer prikaza
- [x] Stari blog slug redirecta na novi slug u next.config.ts
- [x] Uvjeti: uklonjen Stripe/provizija/povrat online naplate; dodan ARS/ODR; potreban human legal review
- [x] Logo i homepage slider nisu dirani namjerno; promjena feeda je ispod slidera
