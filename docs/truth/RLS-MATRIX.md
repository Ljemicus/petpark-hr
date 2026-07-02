# RLS MATRIX — KIT-C read-only baseline

Datum: 2026-07-02
Izvor: `docs/truth/live-schema-dump-2026-07-02.md`

> Ovo je očekivana matrica za budući test harness. Nije pokrenut remote write test. Remote migracije/policy promjene nisu primijenjene.

## Globalna presuda

- Sve public tablice iz današnjeg dumpa imaju RLS uključen.
- `Tablice s RLS=off` sekcija je prazna.
- Policy detalji postoje u dumpu, ali se moraju potvrditi test harnessom na lokalnom klonu/stagingu prije launch potpisa.

## Persona matrica

| Tablica / grupa             | anon                                                                              | owner                                                       | provider-vlasnik                                | tuđi-provider                  | admin                          | suspendirani |
| --------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------- | ------------------------------ | ------------------------------ | ------------ |
| `profiles`                  | no read/write                                                                     | read/update self                                            | read/update self                                | no tuđi profile                | manage/read prema admin policy | no write     |
| `profile_roles`             | no read/write                                                                     | read self roles                                             | read self roles                                 | no tuđi roles                  | manage                         | no write     |
| `providers`                 | read listed+verified only                                                         | manage own provider                                         | manage own provider                             | no tuđi provider write         | manage                         | no write     |
| `provider_services`         | read services of listed+verified providers                                        | manage own provider services                                | manage own provider services                    | no tuđi write                  | manage                         | no write     |
| `provider_*_settings`       | no public read except public service surface via joins                            | manage own provider settings                                | manage own provider settings                    | no tuđi write                  | manage                         | no write     |
| `availability_slots`        | read available slots for listed+verified providers                                | provider owner manages own                                  | provider owner manages own                      | no tuđi write                  | manage                         | no write     |
| `pets`                      | no public read                                                                    | manage own pets                                             | read only when `can_provider_view_pet()` true   | no unrelated pet read          | manage                         | no write     |
| `pet_passports`             | no public read                                                                    | manage own pet passport                                     | read only when provider can view pet            | no unrelated read              | manage                         | no write     |
| `bookings`                  | no read/write                                                                     | create/select/update own bookings                           | select/update bookings for own provider         | no tuđi booking read/write     | manage                         | no write     |
| `booking_items`             | no read/write                                                                     | read/manage as booking participant                          | read/manage as booking participant              | no unrelated read/write        | manage                         | no write     |
| `booking_requests`          | insert pending web request only                                                   | owner select only where `owner_profile_id=self` when linked | provider select via owned service listing       | no tuđi request read           | manage                         | no write     |
| `booking_request_messages`  | no read/write                                                                     | read/insert own request messages                            | read/insert own provider request messages       | no unrelated read/write        | manage                         | no write     |
| `booking_request_events`    | no read/write                                                                     | read own request events                                     | read provider request events                    | no unrelated read              | manage                         | no write     |
| `conversations`             | no read/write                                                                     | read/update participant conversations                       | read/update participant conversations           | no unrelated read              | manage                         | no write     |
| `conversation_participants` | no read/write                                                                     | read self/member rows                                       | read self/member rows                           | no unrelated read              | manage                         | no write     |
| `messages`                  | no read/write                                                                     | read/insert participant messages                            | read/insert participant messages                | no unrelated read              | manage                         | no write     |
| `notifications`             | no read/write                                                                     | read/update own notifications                               | read/update own notifications                   | no tuđi read                   | manage                         | no write     |
| `reviews`                   | read published only                                                               | insert only after completed booking participant             | insert only after completed booking participant | no fake unrelated review write | manage/moderate                | no write     |
| `service_listings`          | read listed+approved only                                                         | read own listings                                           | read own listings                               | no tuđi private listing        | manage                         | no write     |
| `payments`                  | no read/write                                                                     | read only as booking participant                            | manage own provider payments                    | no unrelated read/write        | manage                         | no write     |
| `payout_requests`           | no read/write                                                                     | no owner access unless provider owner                       | manage own provider payout requests             | no tuđi read/write             | manage                         | no write     |
| `stripe_events`             | no read/write                                                                     | no client access                                            | no client access                                | no client access               | server/admin only expected     | no write     |
| trainer tables              | public read where policies allow trainers/programs/availability; bookings private | own participant access                                      | own trainer/provider access                     | no tuđi private bookings       | manage                         | no write     |
| walk tables                 | no public read/write                                                              | read walks for own pet/booking                              | manage walks for own provider                   | no unrelated read/write        | manage                         | no write     |
| `waitlist_requests`         | no public read/write                                                              | no default read                                             | no default read                                 | no default read                | manage/read                    | no write     |

## Test harness requirements

Future tests must create/use six personas:

1. anon
2. owner
3. provider-vlasnik
4. tuđi-provider
5. admin
6. suspendirani

Minimal assertions per table:

- anon cannot read private rows
- owner cannot read/update another owner’s private rows
- provider cannot read/update another provider’s private rows
- admin has only intended elevated paths
- suspendirani cannot write
- public read exists only where product explicitly allows it (`providers` listed+verified, `service_listings` listed+approved, selected trainer public tables, published reviews)

## Launch blocker

This matrix is documentation only. Launch gate still requires automated RLS/storage tests green or explicit owner risk acceptance.
