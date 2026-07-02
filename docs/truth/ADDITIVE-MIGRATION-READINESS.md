# ADDITIVE MIGRATION READINESS — forum/shop/breeder

Datum: 2026-07-02
Scope: KIT-C C.5 dokumentacija, bez primjene migracija.

## Trenutna remote istina

Prema `docs/truth/live-schema-dump-2026-07-02.md`, remote public schema **nema** ove module kao stvarne tablice:

- Forum: `forum_categories`, `forum_topics`, `forum_replies`
- Shop: `products`, `product_reviews`, `cart_items`
- Breeder: `litters`, `puppies`, `breeder_documents`, `breeder_reviews`, `publisher_profiles`
- Rescue dodatci iz mobile drafta: `rescue_listings`, `rescue_appeals`, `applications`
- Pet extras iz mobile drafta: `pet_documents`, `pet_appointments`, `pet_updates`

Remote **ima** canonical platform core:

- `profiles`, `profile_roles`
- `providers`, `provider_services`, provider settings tablice
- `bookings`, `booking_requests`, `booking_request_messages`, `notifications`
- `pets`, `pet_passports`
- trainer/walk core tablice

## Postojeći draftovi

Mobile repo ima:

- `supabase/drafts/00006_mobile_feature_foundation.DRAFT.sql`
- `supabase/drafts/00007_forum_shop_breeder_pet_extras.DRAFT.sql`
- `supabase/drafts/additive-plan-2026-06-01.md`

Presuda: draftovi nisu spremni za blind apply. `00006` je preširok i djelomično se preklapa s canonical remote schemom. `00007` je bliži forum/shop/breeder dodatku, ali prije potpisa treba novo usklađenje s aktualnim `profiles/providers/pets` modelom i RLS matricom.

## Minimalni readiness checklist prije primjene

1. Vlasnik potpisuje da se forum/shop/breeder stvarno aktiviraju.
2. Izraditi novi mali draft, ne primjenjivati stare velike mobile draftove kao paket.
3. Draft mora biti aditivan:
   - `CREATE TABLE IF NOT EXISTS` samo za tablice koje stvarno ne postoje.
   - Bez rename/drop operacija.
   - FK-ovi moraju ići na canonical remote tablice (`profiles`, `providers`, `pets`) umjesto legacy `users/sitter_profiles` modela.
4. RLS prije applya:
   - anon samo public read na javnim sadržajima
   - owner/provider/admin write prema jasnim pravilima
   - privatni dokumenti nikad public
5. Storage prije applya:
   - javne slike odvojene od verifikacijskih/privatnih dokumenata
   - signed URL za privatne dokumente
6. App feature flags:
   - moduli ostaju `Uskoro` dok tablice + RLS + UI smoke nisu zeleni
7. Rollback plan:
   - aditivne migracije se rollbackaju novim disable flagom / policy tighteningom, ne destruktivnim dropom na launch dan.

## Rizici

- Stari mobile draftovi nose legacy modele i mogu stvoriti paralelne tablice koje aplikacija više ne koristi.
- Shop/payments mogu stvoriti lažni dojam aktivne trgovine/naplate; payments su izvan scopea i ostaju OFF.
- Forum/moderacija bez admin workflowa stvara pravni/operativni rizik.
- Breeder module treba posebnu pravnu/operativnu odluku prije public launch faze.

## Zaključak

Nema safe remote DB akcije u ovom trenutku. Safe akcija je samo dokumentacija i držanje UI-a honest disabled. Sljedeći stvarni korak je novi, mali, canonical draft nakon vlasnikovog potpisa.
