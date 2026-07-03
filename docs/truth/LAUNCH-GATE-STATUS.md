# PETPARK LAUNCH GATE STATUS

Datum: 2026-07-03
Status: NOT GREEN — launch nije spreman za javni potpis.

## Zeleno u ovom master-kit ciklusu

- Web: `npm run type-check` PASS.
- Web: `npm run build` PASS.
- Mobile: `npx tsc --noEmit` PASS.
- Mobile: `npx expo-doctor` 19/19 PASS.
- Mobile: nav orphan audit 0.
- Mobile: Expo export PASS.
- Booking request bearer contract PASS.
- Draft-copy guard PASS.
- Forum/shop/breeder/payments su honest disabled/gated gdje remote schema/odluka nedostaje.

## Glavni launch blockeri

- Vlasnik mora potpisati pravne podatke i tekstove (`/impressum`, footer identifikacijski blok, ToS, Privacy).
- Real-device `DEVICE-QA.md` nije PASS na iOS/Android.
- Sentry/Slack alert i uptime monitor nisu produkcijski testirani.
- Remote DB migracije/draftovi nisu primijenjeni niti smiju biti bez potpisa.
- RLS/storage/auth matrice trebaju završni owner-approved smoke protiv odobrenog targeta.
- Search Console domain verification i sitemap submit ostaju vlasnički koraci.

## Pravilo

KIT-F trackovi smiju ostati kao safe docs/draft/code hardening. Ne tretirati KIT-F kao zelen launch signal dok se cijeli `LAUNCH-GATE-CHECKLIST.md` ne potpiše bez iznimki.
