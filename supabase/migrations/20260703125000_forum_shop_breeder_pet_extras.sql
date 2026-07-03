-- PetPark forum/shop/breeder/pet extras — owner approved apply
-- Source: corrected additive version of mobile draft 00007, aligned to current web/mobile code.
-- Date: 2026-07-03
-- Notes: additive only; enables RLS immediately. No seed/demo content.

create extension if not exists pgcrypto with schema extensions;

-- Forum: current web code expects forum_topics + forum_comments with denormalized author display fields.
create table if not exists public.forum_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  category_slug text not null,
  title text not null,
  body text,
  author_name text not null default 'Korisnik',
  author_initial text not null default '?',
  author_gradient text not null default 'from-orange-400 to-amber-300',
  is_pinned boolean not null default false,
  is_hot boolean not null default false,
  is_solved boolean not null default false,
  status text not null default 'active' check (status in ('active','hidden','locked','deleted')),
  likes integer not null default 0 check (likes >= 0),
  comment_count integer not null default 0 check (comment_count >= 0),
  view_count integer not null default 0 check (view_count >= 0),
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.forum_comments (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.forum_topics(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  author_name text not null default 'Korisnik',
  author_initial text not null default '?',
  author_gradient text not null default 'from-orange-400 to-amber-300',
  content text not null,
  likes integer not null default 0 check (likes >= 0),
  status text not null default 'active' check (status in ('active','hidden','deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists forum_topics_category_status_idx on public.forum_topics(category_slug, status, created_at desc);
create index if not exists forum_topics_trending_idx on public.forum_topics(status, likes desc, comment_count desc);
create index if not exists forum_comments_topic_status_idx on public.forum_comments(topic_id, status, created_at);

create or replace function public.update_forum_topic_comment_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.forum_topics
      set comment_count = comment_count + 1,
          updated_at = now()
      where id = new.topic_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.forum_topics
      set comment_count = greatest(comment_count - 1, 0),
          updated_at = now()
      where id = old.topic_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_forum_comments_count_insert on public.forum_comments;
create trigger trg_forum_comments_count_insert
after insert on public.forum_comments
for each row execute function public.update_forum_topic_comment_count();

drop trigger if exists trg_forum_comments_count_delete on public.forum_comments;
create trigger trg_forum_comments_count_delete
after delete on public.forum_comments
for each row execute function public.update_forum_topic_comment_count();

-- Shop: current web code expects price/original_price/rating/review_count/in_stock/variants/specs.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  price numeric(10,2) not null check (price >= 0),
  original_price numeric(10,2) check (original_price is null or original_price >= 0),
  description text,
  emoji text not null default '🐾',
  brand text,
  rating numeric(3,2) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  in_stock boolean not null default false,
  variants jsonb not null default '[]'::jsonb,
  specs jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  reviewer_profile_id uuid references public.profiles(id) on delete set null,
  author_name text not null default 'PetPark korisnik',
  rating integer not null check (rating between 1 and 5),
  comment text,
  status text not null default 'published' check (status in ('published','hidden','deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_profile_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_profile_id, product_id)
);

create index if not exists products_status_category_idx on public.products(status, category, rating desc);
create index if not exists product_reviews_product_status_idx on public.product_reviews(product_id, status, created_at desc);
create index if not exists cart_items_user_idx on public.cart_items(user_profile_id, created_at desc);

-- Breeder/rescue publisher extras: align to existing code expecting user_id/type and rich breeder fields.
create table if not exists public.publisher_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  display_name text not null,
  bio text,
  city text,
  phone text,
  avatar_url text,
  breeds text[] not null default '{}',
  species text[] not null default '{}',
  years_experience integer not null default 0 check (years_experience >= 0),
  fci_registered boolean not null default false,
  certified boolean not null default false,
  verified boolean not null default false,
  verification_status text not null default 'pending',
  profile_completeness_pct integer not null default 60 check (profile_completeness_pct between 0 and 100),
  is_onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, type)
);

create table if not exists public.litters (
  id uuid primary key default gen_random_uuid(),
  breeder_id uuid not null references public.publisher_profiles(id) on delete cascade,
  breed text not null,
  species text not null default 'dog',
  expected_date date,
  birth_date date,
  total_puppies integer not null default 0 check (total_puppies >= 0),
  available_count integer not null default 0 check (available_count >= 0),
  reserved_count integer not null default 0 check (reserved_count >= 0),
  sold_count integer not null default 0 check (sold_count >= 0),
  price_from numeric(10,2) not null default 0 check (price_from >= 0),
  price_to numeric(10,2) not null default 0 check (price_to >= 0),
  status text not null default 'available',
  description text,
  fci_registered boolean not null default false,
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.puppies (
  id uuid primary key default gen_random_uuid(),
  litter_id uuid not null references public.litters(id) on delete cascade,
  name text,
  sex text,
  status text not null default 'available',
  price numeric(10,2) check (price is null or price >= 0),
  photos jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  publisher_id uuid not null references public.publisher_profiles(id) on delete cascade,
  puppy_id uuid references public.puppies(id) on delete set null,
  applicant_profile_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.breeder_reviews (
  id uuid primary key default gen_random_uuid(),
  publisher_id uuid not null references public.publisher_profiles(id) on delete cascade,
  reviewer_profile_id uuid references public.profiles(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.breeder_documents (
  id uuid primary key default gen_random_uuid(),
  publisher_id uuid not null references public.publisher_profiles(id) on delete cascade,
  storage_path text not null,
  document_type text,
  status text not null default 'pending',
  uploaded_at timestamptz not null default now()
);

create table if not exists public.rescue_listings (
  id uuid primary key default gen_random_uuid(),
  publisher_id uuid not null references public.publisher_profiles(id) on delete cascade,
  pet_name text not null,
  species text not null,
  city text,
  description text,
  status text not null default 'published',
  photos jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rescue_appeals (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.rescue_listings(id) on delete cascade,
  applicant_profile_id uuid references public.profiles(id) on delete set null,
  title text,
  slug text unique,
  summary text,
  body text,
  goal_cents integer check (goal_cents is null or goal_cents >= 0),
  raised_cents integer not null default 0 check (raised_cents >= 0),
  donation_url text,
  image_url text,
  message text,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists publisher_profiles_type_city_idx on public.publisher_profiles(type, city);
create index if not exists publisher_profiles_user_type_idx on public.publisher_profiles(user_id, type);
create index if not exists litters_breeder_status_idx on public.litters(breeder_id, status, created_at desc);
create index if not exists puppies_litter_status_idx on public.puppies(litter_id, status);
create index if not exists applications_publisher_status_idx on public.applications(publisher_id, status, created_at desc);
create index if not exists rescue_listings_status_city_idx on public.rescue_listings(status, city, created_at desc);
create index if not exists rescue_appeals_status_created_idx on public.rescue_appeals(status, created_at desc);

-- Pet extras: add only missing tables; existing pets/bookings stay untouched.
create table if not exists public.pet_appointments (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  title text not null,
  type text not null default 'checkup',
  date date not null,
  time text,
  provider_name text,
  vet_name text,
  notes text,
  status text not null default 'upcoming',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pet_documents (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  title text,
  name text,
  document_type text,
  type text,
  storage_path text,
  url text,
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.pet_updates (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  provider_id uuid references public.providers(id) on delete cascade,
  sitter_id uuid references public.profiles(id) on delete set null,
  pet_id uuid references public.pets(id) on delete cascade,
  update_type text,
  type text,
  emoji text not null default '🐾',
  caption text not null default '',
  photo_url text,
  created_at timestamptz not null default now()
);

create index if not exists pet_appointments_pet_date_idx on public.pet_appointments(pet_id, date desc);
create index if not exists pet_documents_pet_uploaded_idx on public.pet_documents(pet_id, uploaded_at desc);
create index if not exists pet_updates_booking_created_idx on public.pet_updates(booking_id, created_at desc);

-- RLS: enable immediately. Policies are deliberately conservative; no table is left open by accident.
alter table public.forum_topics enable row level security;
alter table public.forum_comments enable row level security;
alter table public.products enable row level security;
alter table public.product_reviews enable row level security;
alter table public.cart_items enable row level security;
alter table public.publisher_profiles enable row level security;
alter table public.litters enable row level security;
alter table public.puppies enable row level security;
alter table public.applications enable row level security;
alter table public.breeder_reviews enable row level security;
alter table public.breeder_documents enable row level security;
alter table public.rescue_listings enable row level security;
alter table public.rescue_appeals enable row level security;
alter table public.pet_appointments enable row level security;
alter table public.pet_documents enable row level security;
alter table public.pet_updates enable row level security;

-- Public reads only for published/active public surfaces.
drop policy if exists "Public can read active forum topics" on public.forum_topics;
create policy "Public can read active forum topics" on public.forum_topics for select to anon, authenticated using (status = 'active');

drop policy if exists "Authenticated users can create forum topics" on public.forum_topics;
create policy "Authenticated users can create forum topics" on public.forum_topics for insert to authenticated with check (user_id = auth.uid() and status = 'active');

drop policy if exists "Forum authors can update own topics" on public.forum_topics;
create policy "Forum authors can update own topics" on public.forum_topics for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Public can read active forum comments" on public.forum_comments;
create policy "Public can read active forum comments" on public.forum_comments for select to anon, authenticated using (status = 'active');

drop policy if exists "Authenticated users can create forum comments" on public.forum_comments;
create policy "Authenticated users can create forum comments" on public.forum_comments for insert to authenticated with check (user_id = auth.uid() and status = 'active');

drop policy if exists "Forum authors can update own comments" on public.forum_comments;
create policy "Forum authors can update own comments" on public.forum_comments for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products" on public.products for select to anon, authenticated using (status = 'published');

drop policy if exists "Public can read published product reviews" on public.product_reviews;
create policy "Public can read published product reviews" on public.product_reviews for select to anon, authenticated using (status = 'published');

drop policy if exists "Users can manage own cart items" on public.cart_items;
create policy "Users can manage own cart items" on public.cart_items for all to authenticated using (user_profile_id = auth.uid()) with check (user_profile_id = auth.uid());

drop policy if exists "Public can read verified publisher profiles" on public.publisher_profiles;
create policy "Public can read verified publisher profiles" on public.publisher_profiles for select to anon, authenticated using (verified = true and verification_status = 'approved');

drop policy if exists "Publishers can read own profile" on public.publisher_profiles;
create policy "Publishers can read own profile" on public.publisher_profiles for select to authenticated using (user_id = auth.uid());

drop policy if exists "Publishers can create own profile" on public.publisher_profiles;
create policy "Publishers can create own profile" on public.publisher_profiles for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "Publishers can update own profile" on public.publisher_profiles;
create policy "Publishers can update own profile" on public.publisher_profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Public can read available litters for verified publishers" on public.litters;
create policy "Public can read available litters for verified publishers" on public.litters for select to anon, authenticated using (
  status in ('available','upcoming') and exists (
    select 1 from public.publisher_profiles p where p.id = breeder_id and p.verified = true and p.verification_status = 'approved'
  )
);

drop policy if exists "Publishers can manage own litters" on public.litters;
create policy "Publishers can manage own litters" on public.litters for all to authenticated using (
  exists (select 1 from public.publisher_profiles p where p.id = breeder_id and p.user_id = auth.uid())
) with check (
  exists (select 1 from public.publisher_profiles p where p.id = breeder_id and p.user_id = auth.uid())
);

drop policy if exists "Public can read available puppies" on public.puppies;
create policy "Public can read available puppies" on public.puppies for select to anon, authenticated using (
  status = 'available' and exists (
    select 1 from public.litters l join public.publisher_profiles p on p.id = l.breeder_id
    where l.id = litter_id and l.status in ('available','upcoming') and p.verified = true and p.verification_status = 'approved'
  )
);

drop policy if exists "Publishers can manage own puppies" on public.puppies;
create policy "Publishers can manage own puppies" on public.puppies for all to authenticated using (
  exists (select 1 from public.litters l join public.publisher_profiles p on p.id = l.breeder_id where l.id = litter_id and p.user_id = auth.uid())
) with check (
  exists (select 1 from public.litters l join public.publisher_profiles p on p.id = l.breeder_id where l.id = litter_id and p.user_id = auth.uid())
);

drop policy if exists "Applicants and publishers can read applications" on public.applications;
create policy "Applicants and publishers can read applications" on public.applications for select to authenticated using (
  applicant_profile_id = auth.uid() or exists (select 1 from public.publisher_profiles p where p.id = publisher_id and p.user_id = auth.uid())
);

drop policy if exists "Authenticated users can create applications" on public.applications;
create policy "Authenticated users can create applications" on public.applications for insert to authenticated with check (applicant_profile_id = auth.uid());

drop policy if exists "Publishers can update own applications" on public.applications;
create policy "Publishers can update own applications" on public.applications for update to authenticated using (
  exists (select 1 from public.publisher_profiles p where p.id = publisher_id and p.user_id = auth.uid())
) with check (
  exists (select 1 from public.publisher_profiles p where p.id = publisher_id and p.user_id = auth.uid())
);

drop policy if exists "Public can read published breeder reviews" on public.breeder_reviews;
create policy "Public can read published breeder reviews" on public.breeder_reviews for select to anon, authenticated using (status = 'published');

drop policy if exists "Publishers can read own documents" on public.breeder_documents;
create policy "Publishers can read own documents" on public.breeder_documents for select to authenticated using (
  exists (select 1 from public.publisher_profiles p where p.id = publisher_id and p.user_id = auth.uid())
);

drop policy if exists "Publishers can create own documents" on public.breeder_documents;
create policy "Publishers can create own documents" on public.breeder_documents for insert to authenticated with check (
  exists (select 1 from public.publisher_profiles p where p.id = publisher_id and p.user_id = auth.uid())
);

drop policy if exists "Public can read published rescue listings" on public.rescue_listings;
create policy "Public can read published rescue listings" on public.rescue_listings for select to anon, authenticated using (status = 'published');

drop policy if exists "Publishers can manage own rescue listings" on public.rescue_listings;
create policy "Publishers can manage own rescue listings" on public.rescue_listings for all to authenticated using (
  exists (select 1 from public.publisher_profiles p where p.id = publisher_id and p.user_id = auth.uid())
) with check (
  exists (select 1 from public.publisher_profiles p where p.id = publisher_id and p.user_id = auth.uid())
);

drop policy if exists "Public can read published rescue appeals" on public.rescue_appeals;
create policy "Public can read published rescue appeals" on public.rescue_appeals for select to anon, authenticated using (status = 'published');

-- Pet extras are owner/participant private.
drop policy if exists "Pet owners can manage appointments" on public.pet_appointments;
create policy "Pet owners can manage appointments" on public.pet_appointments for all to authenticated using (
  exists (select 1 from public.pets p where p.id = pet_id and p.owner_profile_id = auth.uid())
) with check (
  exists (select 1 from public.pets p where p.id = pet_id and p.owner_profile_id = auth.uid())
);

drop policy if exists "Pet owners can manage documents" on public.pet_documents;
create policy "Pet owners can manage documents" on public.pet_documents for all to authenticated using (
  exists (select 1 from public.pets p where p.id = pet_id and p.owner_profile_id = auth.uid())
) with check (
  exists (select 1 from public.pets p where p.id = pet_id and p.owner_profile_id = auth.uid())
);

drop policy if exists "Booking participants can read pet updates" on public.pet_updates;
create policy "Booking participants can read pet updates" on public.pet_updates for select to authenticated using (
  exists (
    select 1
    from public.bookings b
    left join public.providers pr on pr.id = b.provider_id
    where b.id = booking_id
      and (b.owner_profile_id = auth.uid() or pr.profile_id = auth.uid())
  )
);

drop policy if exists "Booking providers can create pet updates" on public.pet_updates;
create policy "Booking providers can create pet updates" on public.pet_updates for insert to authenticated with check (
  exists (
    select 1
    from public.bookings b
    join public.providers pr on pr.id = b.provider_id
    where b.id = booking_id and pr.profile_id = auth.uid()
  )
);
