# KIT-D SEO / frontend istina — 2026-07-02

## Provedeno u ovom sliceu

- Root hreflang više ne oglašava nepostojeći `/en`; ostaje HR + x-default na homepage.
- Mobile bottom nav više ne vodi EN korisnike na nepostojeći `/blog/en`; koristi `/blog`.
- Dodan `scripts/check-draft-copy.mjs` i vezan u `prebuild` nakon postojećeg placeholder guarda.
- Dodan `DisabledModule` za iskrena “uskoro” stanja.
- Shop i checkout/payments UI površine prikazuju iskreno “uskoro” stanje umjesto redirecta ili aktivnog checkout dojma.
- Breeder dashboard/upiti više ne prikazuju mock statistike, osobe, emailove ili upite; prikazuju “Uzgajivačnice uskoro”.
- Payout kartica više nema default mock isplate; isplate su UI-jem isključene za ovaj release.
- `robots.txt` disallow uključuje `/design-lab/`, `/redizajn-preview/`, `/ljubimac/` uz postojeće privatne površine.
- Noindex metadata dodan za design foundation, checkout segment, shop segment i privatne/dashboard/onboarding/passport segmente.
- `/ljubimac/[id]/passport` prebačen iza server-side owner guarda: neulogirani → `/prijava`, tuđi passport → 404.
- `/ljubimac/[id]/passport/share` također zahtijeva vlasnika jer ne postoji produkcijski share-token/permisija model; nismo izmišljali pseudo-share.
- Sitemap više ne uključuje forum/uzgajivačnice dok remote schema za te module ne postoji.

## Verifikacija

- `node scripts/check-draft-copy.mjs` PASS
- `npm run type-check` PASS
- `npm run build` PASS; prebuild guard PASS; sitemap log: forum 0, total 48

## Namjerno nije dirano

- PetPark logo i homepage slider nisu dirani.
- Nema deploya, DB writeova ni remote migracija.
- Postojeće EN stranice nisu brisane; samo je maknut nepostojeći root `/en` signal.
- Legal/KIT-A i security PR-B1/B2 human-gate dijelovi nisu rađeni u ovom sliceu.
