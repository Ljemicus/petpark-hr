-- PetPark search performance indexes — REVIEW ONLY
-- Date: 2026-07-02
-- Status: DRAFT. Do not apply to production without explicit owner approval.
-- Purpose: KIT-F F-V6 candidate indexes for marketplace search and text matching.
--
-- Notes:
-- - Use CONCURRENTLY only outside an explicit transaction block.
-- - Run first on staging/preview DB and compare EXPLAIN plans for /pretraga.
-- - These are additive indexes only; no data/schema destructive changes.

-- Exact/filter search acceleration for live marketplace listings.
create index concurrently if not exists service_listings_city_category_public_idx
  on public.service_listings (city, category, status, moderation_status)
  where status = 'listed' and moderation_status = 'approved';

create index concurrently if not exists service_listings_category_city_public_idx
  on public.service_listings (category, city)
  where status = 'listed' and moderation_status = 'approved';

-- Provider service filter acceleration.
create index concurrently if not exists provider_services_active_service_provider_idx
  on public.provider_services (service_code, provider_id)
  where is_active = true;

-- Text search candidates. Requires pg_trgm; enable only after staging validation.
create extension if not exists pg_trgm with schema extensions;

create index concurrently if not exists service_listings_title_trgm_idx
  on public.service_listings using gin (title gin_trgm_ops)
  where status = 'listed' and moderation_status = 'approved';

create index concurrently if not exists service_listings_description_trgm_idx
  on public.service_listings using gin (description gin_trgm_ops)
  where status = 'listed' and moderation_status = 'approved' and description is not null;
