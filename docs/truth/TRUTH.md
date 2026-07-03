# PETPARK TRUTH — 2026-07-03

Ovo je kratki source of truth nakon KIT-0 inventure. Remote Supabase shema je autoritativna; repo migracije nisu dokaz produkcijskog stanja.

## Web

- Core marketplace/search/provider/profile/booking-request: stvarno, launch kandidat uz sigurnosne gateove iz KIT-B.
- Payments/checkout: `GATED`; `PAYMENTS_ENABLED=false` ostaje. UI može pokazati `Plaćanje uskoro`, API mora fail-closed.
- Shop: `Uskoro`; shop/product tablice nisu na remoteu.
- Forum: `Uskoro`/stub; forum tablice nisu na remoteu iako web API rute postoje.
- Breeders: `Uskoro`/stub; breeder tablice nisu na remoteu, a web još ima `lib/mock-breeders.ts`.
- Private/dashboard/pet passport/walk/calendar/message surfaces: `NOINDEX` + auth guard obavezni.
- Design lab/redizajn preview: interni preview; `NOINDEX` + robots disallow.

## Mobile

- Mobile branch: `fix/kit-e-mobile-istina`.
- Env refs su minimalne: API URL, Supabase URL/anon key, Sentry DSN.
- Fake-surface grep je prazan na trenutnom branchu.
- Mobile store submit nije dio ovog rada.
- Walk tracker V1 odluka ostaje nakon real-device QA.

## Remote Supabase

- 32 public tablice potvrđene; sve imaju RLS enabled.
- Trainer/training tablice postoje i žive su: `trainers`, `trainer_bookings`, `trainer_availability`, `trainer_reviews`, `training_programs`.
- Forum/shop/breeder tablice nisu na remoteu.
- Storage: `verification-docs` je private; `avatars` i `pet-photos` su public.

## Odluke iz master kita

- V1 je hrvatski; root hreflang na nepostojeći `/en` mora van.
- Ne deployati bez launch gate checklist pass.
- Nijedna remote migracija bez ljudskog potpisa.
- Legal kit čeka stvarne podatke tvrtke u `content/legal/legal-data.json` i pravni potpis.

## Artefakti

- `docs/truth/ROUTE-MANIFEST.md`
- `docs/truth/TABLE-CLASSIFICATION.md`
- `docs/truth/ENV-MATRIX.md`
- `docs/truth/FAKE-SURFACES.md`
- `docs/truth/live-schema-dump-2026-07-03.md`
