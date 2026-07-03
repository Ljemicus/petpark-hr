-- PetPark search performance indexes — owner approved apply
-- Date: 2026-07-03
-- Source: supabase/drafts/20260702_search_indexes_review_only.DRAFT.sql
-- Additive indexes only. Applied remotely statement-by-statement because CREATE INDEX CONCURRENTLY cannot run in a transaction block.

create extension if not exists pg_trgm with schema extensions;

create index concurrently if not exists service_listings_city_category_public_idx
  on public.service_listings (city, category, status, moderation_status)
  where status = 'listed' and moderation_status = 'approved';

create index concurrently if not exists service_listings_category_city_public_idx
  on public.service_listings (category, city)
  where status = 'listed' and moderation_status = 'approved';

create index concurrently if not exists provider_services_active_service_provider_idx
  on public.provider_services (service_code, provider_id)
  where is_active = true;

create index concurrently if not exists service_listings_title_trgm_idx
  on public.service_listings using gin (title gin_trgm_ops)
  where status = 'listed' and moderation_status = 'approved';

create index concurrently if not exists service_listings_description_trgm_idx
  on public.service_listings using gin (description gin_trgm_ops)
  where status = 'listed' and moderation_status = 'approved' and description is not null;
