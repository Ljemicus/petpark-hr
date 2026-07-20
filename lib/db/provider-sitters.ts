import { createAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from './helpers';
import type { Availability, PublicSitterReview, ServiceType, SitterProfile, User } from '@/lib/types';

interface ProviderRow {
  id: string;
  profile_id: string | null;
  provider_kind: string;
  display_name: string | null;
  bio: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  experience_years: number | null;
  verified_status: string | null;
  public_status: string | null;
  response_time_label: string | null;
  rating_avg: number | null;
  review_count: number | null;
  instant_booking_enabled: boolean | null;
  created_at: string | null;
}

interface ProfileRow {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  city: string | null;
  created_at: string | null;
}

interface ProviderSitterSettingsRow {
  provider_id: string;
  services: string[] | null;
  photos: string[] | null;
  superhost: boolean | null;
}

interface ProviderServiceRow {
  provider_id: string;
  service_code: string;
  base_price: number | null;
  is_active: boolean | null;
}

interface ProviderSitterFilters {
  city?: string;
  service?: ServiceType;
  min_rating?: number;
  min_price?: number;
  max_price?: number;
  sort?: 'rating' | 'reviews' | 'price_asc' | 'price_desc';
  limit?: number;
}

interface AvailabilitySlotRow {
  id: string;
  provider_id: string;
  starts_at: string;
  status: string | null;
}

interface ReviewRow {
  id: string;
  provider_id: string;
  reviewer_profile_id: string | null;
  rating: number;
  comment: string | null;
  status: string | null;
  created_at: string;
}

const SERVICE_MAP: Record<string, ServiceType> = {
  boarding: 'boarding',
  walking: 'walking',
  house_sitting: 'house-sitting',
  housesitting: 'house-sitting',
  drop_in: 'drop-in',
  daycare: 'daycare',
};

function mapServices(values: string[] | null | undefined): ServiceType[] {
  const mapped = (values || [])
    .map((value) => SERVICE_MAP[String(value).toLowerCase()])
    .filter((value): value is ServiceType => Boolean(value));
  return Array.from(new Set(mapped));
}

function mapProviderServices(services: ProviderServiceRow[]): ServiceType[] {
  const mapped = services
    .filter((service) => service.is_active !== false)
    .map((service) => SERVICE_MAP[String(service.service_code).toLowerCase()])
    .filter((value): value is ServiceType => Boolean(value));

  return Array.from(new Set(mapped));
}

function buildPrices(services: ProviderServiceRow[]): Record<ServiceType, number> {
  const base: Record<ServiceType, number> = {
    boarding: 0,
    walking: 0,
    'house-sitting': 0,
    'drop-in': 0,
    daycare: 0,
  };

  for (const service of services) {
    if (service.is_active === false) continue;
    const mapped = SERVICE_MAP[String(service.service_code).toLowerCase()];
    if (!mapped) continue;
    base[mapped] = Number(service.base_price || 0);
  }

  return base;
}

function sitterLowestPrice(profile: SitterProfile & { user: User }): number {
  const values = Object.values(profile.prices || {}).filter((value) => typeof value === 'number' && value > 0);
  return values.length ? Math.min(...values) : Number.POSITIVE_INFINITY;
}

function toUser(profile: ProfileRow, provider: ProviderRow): User {
  return {
    id: profile.id,
    email: profile.email || provider.email || '',
    name: profile.display_name || provider.display_name || 'Sitter',
    role: 'sitter',
    avatar_url: profile.avatar_url,
    phone: profile.phone || provider.phone || null,
    city: profile.city || provider.city || null,
    created_at: profile.created_at || new Date().toISOString(),
  };
}

function toSitter(
  provider: ProviderRow,
  profile: ProfileRow,
  settings: ProviderSitterSettingsRow | null,
  services: ProviderServiceRow[]
): SitterProfile & { user: User } {
  const settingsServices = mapServices(settings?.services);
  const providerServices = mapProviderServices(services);

  return {
    user_id: provider.profile_id || profile.id,
    bio: provider.bio || null,
    experience_years: Number(provider.experience_years || 0),
    services: settingsServices.length > 0 ? settingsServices : providerServices,
    prices: buildPrices(services),
    verified: provider.verified_status === 'verified',
    superhost: Boolean(settings?.superhost),
    response_time: provider.response_time_label || null,
    rating_avg: Number(provider.rating_avg || 0),
    review_count: Number(provider.review_count || 0),
    location_lat: null,
    location_lng: null,
    city: provider.city || profile.city || null,
    photos: (settings?.photos || []) as string[],
    created_at: provider.created_at || new Date().toISOString(),
    instant_booking: Boolean(provider.instant_booking_enabled),
    user: toUser(profile, provider),
  };
}

export async function getProviderSitters(filters?: ProviderSitterFilters): Promise<(SitterProfile & { user: User })[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  let query = supabase
    .from('providers')
    .select('*')
    .eq('provider_kind', 'sitter')
    .eq('public_status', 'listed');

  if (filters?.city) {
    query = query.eq('city', filters.city);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  const providers = data as ProviderRow[];
  const providerIds = providers.map((provider) => provider.id);
  const profileIds = providers.map((provider) => provider.profile_id).filter(Boolean) as string[];

  const [{ data: profiles }, { data: settings }, { data: services }] = await Promise.all([
    profileIds.length > 0 ? supabase.from('profiles').select('*').in('id', profileIds) : Promise.resolve({ data: [] }),
    providerIds.length > 0 ? supabase.from('provider_sitter_settings').select('*').in('provider_id', providerIds) : Promise.resolve({ data: [] }),
    providerIds.length > 0 ? supabase.from('provider_services').select('*').in('provider_id', providerIds).eq('is_active', true) : Promise.resolve({ data: [] }),
  ]);

  const profileMap = new Map(((profiles as ProfileRow[] | null) || []).map((row) => [row.id, row]));
  const settingsMap = new Map(((settings as ProviderSitterSettingsRow[] | null) || []).map((row) => [row.provider_id, row]));
  const servicesByProvider = new Map<string, ProviderServiceRow[]>();

  for (const service of ((services as ProviderServiceRow[] | null) || [])) {
    const list = servicesByProvider.get(service.provider_id) || [];
    list.push(service);
    servicesByProvider.set(service.provider_id, list);
  }

  let sitters = providers
    .map((provider) => {
      const profile = provider.profile_id ? profileMap.get(provider.profile_id) : null;
      if (!profile) return null;
      return toSitter(provider, profile, settingsMap.get(provider.id) || null, servicesByProvider.get(provider.id) || []);
    })
    .filter((profile): profile is SitterProfile & { user: User } => Boolean(profile));

  if (filters?.service) {
    sitters = sitters.filter((profile) => profile.services.includes(filters.service!));
  }

  if (filters?.min_rating !== undefined) {
    sitters = sitters.filter((profile) => profile.rating_avg >= filters.min_rating!);
  }

  if (filters?.min_price !== undefined) {
    sitters = sitters.filter((profile) => sitterLowestPrice(profile) >= filters.min_price!);
  }

  if (filters?.max_price !== undefined) {
    sitters = sitters.filter((profile) => sitterLowestPrice(profile) <= filters.max_price!);
  }

  switch (filters?.sort) {
    case 'reviews':
      sitters.sort((a, b) => b.review_count - a.review_count);
      break;
    case 'price_asc':
      sitters.sort((a, b) => sitterLowestPrice(a) - sitterLowestPrice(b));
      break;
    case 'price_desc':
      sitters.sort((a, b) => sitterLowestPrice(b) - sitterLowestPrice(a));
      break;
    case 'rating':
    default:
      sitters.sort((a, b) => b.rating_avg - a.rating_avg || b.review_count - a.review_count);
      break;
  }

  return sitters;
}

export async function getProviderSitterById(providerId: string): Promise<(SitterProfile & { user: User }) | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createAdminClient();
  const { data: provider, error } = await supabase
    .from('providers')
    .select('*')
    .eq('id', providerId)
    .eq('provider_kind', 'sitter')
    .eq('public_status', 'listed')
    .maybeSingle();

  if (error || !provider || !provider.profile_id) return null;

  const [{ data: profile }, { data: settings }, { data: services }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', provider.profile_id).maybeSingle(),
    supabase.from('provider_sitter_settings').select('*').eq('provider_id', provider.id).maybeSingle(),
    supabase.from('provider_services').select('*').eq('provider_id', provider.id).eq('is_active', true),
  ]);

  if (!profile) return null;

  return {
    ...toSitter(
      provider as ProviderRow,
      profile as ProfileRow,
      (settings as ProviderSitterSettingsRow | null) ?? null,
      (services as ProviderServiceRow[]) || []
    ),
  };
}

export async function getProviderSitterReviews(providerId: string): Promise<PublicSitterReview[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('provider_id', providerId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  const reviews = data as ReviewRow[];
  const reviewerIds = Array.from(new Set(reviews.map((review) => review.reviewer_profile_id).filter(Boolean))) as string[];
  const reviewerMap = new Map<string, ProfileRow>();

  if (reviewerIds.length > 0) {
    const { data: profiles } = await supabase.from('profiles').select('*').in('id', reviewerIds);
    for (const profile of (profiles as ProfileRow[] | null) || []) reviewerMap.set(profile.id, profile);
  }

  return reviews.map((review) => {
    const reviewer = review.reviewer_profile_id ? reviewerMap.get(review.reviewer_profile_id) : null;
    const reviewerUser: User = {
      id: reviewer?.id || '',
      email: reviewer?.email || '',
      name: reviewer?.display_name || 'PetPark korisnik',
      role: 'owner',
      avatar_url: reviewer?.avatar_url || null,
      phone: reviewer?.phone || null,
      city: reviewer?.city || null,
      created_at: reviewer?.created_at || review.created_at,
    };

    return {
      id: review.id,
      booking_id: '',
      reviewer_id: reviewer?.id || '',
      reviewee_id: '',
      rating: Number(review.rating || 0),
      comment: review.comment || '',
      created_at: review.created_at,
      reviewer: reviewerUser,
      booking: { service_type: 'boarding' },
    } as PublicSitterReview;
  });
}

export async function getProviderSitterAvailability(providerId: string): Promise<Availability[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('availability_slots')
    .select('id, provider_id, starts_at, status')
    .eq('provider_id', providerId)
    .eq('status', 'available')
    .order('starts_at', { ascending: true });

  if (error || !data) return [];

  const daily = new Map<string, Availability>();
  for (const slot of data as AvailabilitySlotRow[]) {
    const date = slot.starts_at.slice(0, 10);
    if (!daily.has(date)) {
      daily.set(date, {
        id: slot.id,
        sitter_id: providerId,
        date,
        available: true,
      });
    }
  }

  return Array.from(daily.values());
}
