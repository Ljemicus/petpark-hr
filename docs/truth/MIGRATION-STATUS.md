# MIGRATION STATUS — KIT-C read-only

Datum: 2026-07-03
Izvor istine: `docs/truth/live-schema-dump-2026-07-03.md` + lokalne migracije u web/mobile repoima.

> Nije primijenjena nijedna remote migracija. Ovo je read-only klasifikacija.

## Web repo — `supabase/migrations/*`

| Migracija                                                                  | Status                   | Remote dokaz / napomena                                                                                               |
| -------------------------------------------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `20260421073000_create_trainer_feature_tables.sql`                         | PRIMIJENJENA             | Remote ima `trainers`, `training_programs`, `trainer_availability`, `trainer_bookings`, `trainer_reviews`.            |
| `20260423140000_rls_least_privilege_hardening.sql`                         | DJELOMIČNA / POLICY-ONLY | RLS je ON na svim public tablicama iz dumpa; policy detalji nisu uspoređeni u ovom sliceu.                            |
| `20260423140001_fix_rls_security_gaps.sql`                                 | DJELOMIČNA / POLICY-ONLY | RLS je ON; reference na stare/mobile tablice poput `sitter_profiles` ne postoje na remoteu.                           |
| `20260424112000_reconstructed_auth_profiles_provider_foundation.sql`       | PRIMIJENJENA             | Remote ima `profiles`, `profile_roles`, `providers`.                                                                  |
| `20260424114000_reconstructed_provider_services_and_settings.sql`          | PRIMIJENJENA             | Remote ima `provider_services`, `provider_sitter_settings`, `provider_groomer_settings`, `provider_trainer_settings`. |
| `20260424122000_reconstructed_canonical_availability_bookings_reviews.sql` | PRIMIJENJENA             | Remote ima `availability_slots`, `bookings`, `reviews`.                                                               |
| `20260424173000_reconstructed_provider_public_read_policies.sql`           | DJELOMIČNA / POLICY-ONLY | Ne mijenja tablice; policy detalji čekaju RLS-MATRIX testove.                                                         |
| `20260424174000_reconstructed_provider_owner_policies.sql`                 | DJELOMIČNA / POLICY-ONLY | Ne mijenja tablice; policy detalji čekaju RLS-MATRIX testove.                                                         |
| `20260424200000_reconstructed_stripe_events_and_payment_fields.sql`        | PRIMIJENJENA             | Remote ima `stripe_events`; payment kolone postoje na `bookings`. Plaćanja su app-level disabled.                     |
| `20260424201000_reconstructed_provider_payment_reconciliation_fields.sql`  | PRIMIJENJENA             | Remote `bookings/providers` imaju payment/reconciliation polja relevantna za ovu migraciju. Plaćanja ostaju disabled. |
| `20260424232000_reconstructed_booking_requests.sql`                        | PRIMIJENJENA             | Remote ima `booking_requests`.                                                                                        |
| `20260425071000_reconstructed_pet_passports.sql`                           | PRIMIJENJENA             | Remote ima `pet_passports`.                                                                                           |
| `20260513093000_add_service_listings.sql`                                  | PRIMIJENJENA             | Remote ima `service_listings`. Napomena: ovo nije forum/shop/breeder schema; samo service listing sloj.               |
| `20260514194000_booking_request_status_actions.sql`                        | PRIMIJENJENA             | Remote `booking_requests` ima status/action polja iz kasnijeg flowa.                                                  |
| `20260514202500_booking_request_contact_identity.sql`                      | PRIMIJENJENA             | Remote `booking_requests` ima requester/contact/consent polja.                                                        |
| `20260514225500_booking_request_withdrawn_status.sql`                      | PRIMIJENJENA             | Status model s withdrawn/cancel flowom je prisutan u aplikacijskom kodu; DB constraint detalji nisu testirani ovdje.  |
| `20260514233500_booking_request_notifications_activity.sql`                | PRIMIJENJENA             | Remote ima `booking_request_events`, `notifications`.                                                                 |
| `20260515090000_booking_request_conversation_messages.sql`                 | PRIMIJENJENA             | Remote ima `booking_request_messages`; `notifications` je dopunjen.                                                   |

## Mobile repo — `supabase/migrations/*`

| Migracija                            | Status                                | Napomena                                                                                                                                             |
| ------------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `00001_create_tables.sql`            | NIJE PRIMIJENJENA / LEGACY            | Kreira `users`, `sitter_profiles`; remote canonical schema koristi `profiles`, `providers`, provider settings. Ne primjenjivati na remote.           |
| `00002_create_storage_buckets.sql`   | NEPOZNATO / STORAGE-ONLY              | Storage bucket status nije u današnjem table dumpu. Treba poseban storage policy check.                                                              |
| `00003_rls_policies.sql`             | NIJE PRIMIJENJENA / LEGACY            | Policy za `users`, `sitter_profiles`; remote canonical schema je drugačija. Ne primjenjivati.                                                        |
| `00004_add_admin_notes.sql`          | NIJE PRIMIJENJENA / LEGACY            | Cilja `sitter_profiles`; remote tablica ne postoji.                                                                                                  |
| `00005_lock_verification_fields.sql` | NEPOZNATO / LEGACY                    | Potrebna ručna usporedba ako se još koristi; ne primjenjivati bez nove odluke.                                                                       |
| `001_mobile_payments.sql`            | NIJE PRIMIJENJENA / PAYMENTS DISABLED | Kreira `payment_methods`, `payouts`; remote ima `payments`, `payout_requests`, `stripe_events`, ali app plaćanja su disabled. Ne primjenjivati sada. |

## Mobile repo — `supabase/drafts/*`

| Draft                                           | Status                                 | Napomena                                                                                                                                 |
| ----------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `00006_mobile_feature_foundation.DRAFT.sql`     | DRAFT-NA-ČEKANJU / DJELOMIČNO ZASTARIO | Sadrži veliki skup tablica; dio postoji pod canonical imenima, dio ne. Ne primjenjivati kao paket.                                       |
| `00007_forum_shop_breeder_pet_extras.DRAFT.sql` | DRAFT-NA-ČEKANJU                       | Forum/shop/breeder/rescue dodatne tablice ne postoje na remoteu. Čeka vlasnikov potpis i novo usklađivanje sa stvarnom canonical shemom. |
| `additive-plan-2026-06-01.md`                   | DOKUMENTARNO                           | Plan, ne SQL migracija.                                                                                                                  |

## Remote-only objekti iz 2026-07-03 dumpa

Remote ima canonical objekte koje legacy mobile migracije ne opisuju ili ih opisuju pod drugim imenima:

- `availability_slots`
- `booking_items`
- `booking_request_events`
- `booking_request_messages`
- `booking_requests`
- `conversation_participants`
- `conversations`
- `payments`
- `payout_requests`
- `profile_roles`
- `provider_*` settings tablice
- `providers`
- `service_listings`
- `stripe_events`
- `walk_checkpoints`

## Zaključak

Web migracije uglavnom odgovaraju remote canonical schemi. Mobile `supabase/migrations` su većinom legacy ili lokalne/draft povijesti i ne smiju se slijepo primijeniti na remote. Svaka buduća DB promjena mora biti novi aditivni draft + vlasnikov potpis.
