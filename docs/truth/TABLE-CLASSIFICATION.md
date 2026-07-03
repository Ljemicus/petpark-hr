# TABLE-CLASSIFICATION — 2026-07-03

Izvor: `docs/truth/live-schema-dump-2026-07-03.md` (read-only introspekcija remote Supabase baze preko poolera). Remote shema je autoritativna.

## Sažetak

- Public tablica na remoteu: 32
- RLS off: 0 — sve public tablice iz dumpa imaju `rls_ukljucen=true`
- Storage bucketi: `avatars` public, `pet-photos` public, `verification-docs` private
- Forum tablice: ne postoje na remoteu
- Shop/product tablice: ne postoje na remoteu
- Breeder tablice: ne postoje na remoteu
- Trainer/training tablice: postoje na remoteu i imaju RLS politike

## LIVE-CANONICAL

Postoje na remoteu, dio su aktivne sheme i imaju RLS uključen:

`availability_slots`, `booking_items`, `booking_request_events`, `booking_request_messages`, `booking_requests`, `bookings`, `conversation_participants`, `conversations`, `messages`, `notifications`, `payments`, `payout_requests`, `pet_passports`, `pets`, `profile_roles`, `profiles`, `provider_groomer_settings`, `provider_services`, `provider_sitter_settings`, `provider_trainer_settings`, `providers`, `reviews`, `service_listings`, `stripe_events`, `trainer_availability`, `trainer_bookings`, `trainer_reviews`, `trainers`, `training_programs`, `waitlist_requests`, `walk_checkpoints`, `walks`.

## DRAFT / NIJE NA REMOTEU

Ove površine postoje u kodu ili planu, ali tablice nisu potvrđene na remoteu:

- Forum: `forum_categories`, `forum_topics`, `forum_replies/comments`, `forum_likes` — web API rute postoje, ali remote target query nije vratio nijednu `forum%` tablicu.
- Shop/product: `shop%`, `product%` — nema remote tablica.
- Breeder: `breeder%` — nema remote tablica.

Presuda za V1: forum/shop/breeder moraju biti `Uskoro` / gated dok se ne odobri aditivna migracija.

## RLS crvena lista

Nema public tablica s `rls_ukljucen=false` u dumpu od 2026-07-03.

## Napomene za KIT-C

- `trainer_*` i `training_programs` su žive tablice, ne draft.
- `stripe_events` postoji i ima RLS; payments i dalje ostaju server-side fail-closed dok je `PAYMENTS_ENABLED=false`.
- Storage policy testovi i persona matrica nisu izvršeni ovim dokumentom; ovo je schema/classification input za KIT-C.
