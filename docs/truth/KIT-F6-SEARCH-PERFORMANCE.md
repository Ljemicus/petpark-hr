# KIT-F6 SEARCH PERFORMANCE — read-only/draft slice

Datum: 2026-07-02
Scope: bez remote applya.

## Trenutno stanje

Iz postojećih migracija remote canonical schema već ima ove relevantne indekse:

- `providers_profile_id_idx`
- `providers_kind_public_idx`
- `provider_services_provider_id_idx`
- `provider_services_code_active_idx`
- `service_listings_provider_id_idx`
- `service_listings_provider_service_id_idx`
- `service_listings_public_idx` on `(status, moderation_status, city, category)`
- `service_listings_provider_status_idx`
- `service_listings_updated_at_idx`

Zaključak: osnovni filteri za `/pretraga` već imaju pokrivenost preko `service_listings_public_idx` i `provider_services_code_active_idx`.

## Draft pripremljen

Dodano je review-only SQL:

- `supabase/drafts/20260702_search_indexes_review_only.DRAFT.sql`

Sadrži samo aditivne candidate indekse:

- public city/category partial indexes
- active provider service lookup index
- pg_trgm candidate indekse za title/description search

## Pravilo

Ne primjenjivati bez vlasnikovog potpisa. Prije applya obavezno:

1. staging/preview DB
2. `EXPLAIN ANALYZE` za glavne `/pretraga` queryje
3. usporedba prije/poslije
4. rollback plan: `drop index concurrently if exists ...`

## Nije rađeno

- Nije primijenjen nijedan index na remote.
- Nije mijenjana `/pretraga` arhitektura jer nema dokaza o N+1 problemu iz ovog read-only slicea.
