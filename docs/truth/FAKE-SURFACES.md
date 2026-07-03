# FAKE-SURFACES — 2026-07-03

Izvori:

- Web raw grep: `docs/truth/fake-surfaces-web.txt`
- Mobile raw grep: `/Users/ljemicus/Projects/petpark-mobile/docs/truth/fake-surfaces-mobile.txt`

## Web — potvrđeni kandidati

| Putanja                                              | Nalaz                              | Presuda                                                                                    |
| ---------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------ |
| `app/(site)/ljubimac/[id]/karton/page.tsx`           | `DEMO_PET_IDS`                     | privatna/demo površina; za launch ukloniti demo shortcut ili noindex/guard                 |
| `app/(site)/setnja/[id]/page.tsx`                    | `DEMO_WALK_IDS`                    | privatna/demo površina; walk V1 ovisi o real-device QA                                     |
| `app/(site)/admin/marketing/marketing-dashboard.tsx` | `MOCK_CAMPAIGNS`, `MOCK_TEMPLATES` | admin mock data; ne smije hraniti produkcijsku istinu bez jasnog dev/admin stuba           |
| `lib/demo-data.ts`                                   | `DEMO_BOOKING_IDS`                 | demo booking ids; ukloniti iz produkcijskih tokova ili zamijeniti realnim praznim stanjem  |
| `lib/mock-breeders.ts`                               | `MOCK_BREEDERS`                    | breeder tablice nisu na remoteu; breeder UI mora biti `Uskoro` dok migracija nije odobrena |

## Web — prihvatljiv fallback copy

`lib/public/provider-profile-sanitizers.ts` koristi `PRICE_FALLBACK_HR = "Cijena po dogovoru"`. To je copy fallback, ne lažni katalog; ostaje dopušteno ako ne prikazuje izmišljene cijene.

## Mobile

Trenutni grep na branchu `fix/kit-e-mobile-istina` nije našao `FALLBACK_`, `MOCK_`, `DEMO_`, `hardcoded`, `sample`, `seed` u `lib/`, `app/`, `components/`.

## Prioritet za KIT-D/E

1. Breeder mock → `DisabledModule` / `Uskoro`.
2. Walk demo → real-device QA ili `Uskoro`.
3. Pet karton demo shortcut → ukloniti ili strogo guardati.
4. Admin marketing mock → jasno označiti kao admin/dev placeholder ili spojiti na stvarne podatke.
