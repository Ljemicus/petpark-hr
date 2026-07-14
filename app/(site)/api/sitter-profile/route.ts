import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { sitterProfileSchema } from '@/lib/validations';
import { appLogger } from '@/lib/logger';

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user || user.role !== 'sitter') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = sitterProfileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = await createClient();
  const providerPayload = {
    profile_id: user.id,
    provider_kind: 'sitter',
    display_name: user.name || user.email.split('@')[0] || 'Sitter',
    bio: parsed.data.bio,
    city: parsed.data.city,
    email: user.email || null,
    experience_years: parsed.data.experience_years,
    verified_status: 'draft',
    public_status: 'hidden',
    instant_booking_enabled: parsed.data.instant_booking ?? false,
  };

  const { data: provider, error: providerError } = await supabase
    .from('providers')
    .upsert(providerPayload, { onConflict: 'profile_id,display_name' })
    .select('id')
    .single();

  if (providerError || !provider) {
    appLogger.error('sitterProfile.save', 'provider upsert failed', { error: providerError?.message, userId: user.id });
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }

  const { error: settingsError } = await supabase
    .from('provider_sitter_settings')
    .upsert({
      provider_id: provider.id,
      accepts_cats: parsed.data.services.includes('drop-in') || parsed.data.services.includes('house-sitting'),
      max_pets_per_day: 3,
    }, { onConflict: 'provider_id' });

  if (settingsError) {
    appLogger.error('sitterProfile.save', 'settings upsert failed', { error: settingsError.message, userId: user.id, providerId: provider.id });
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }

  const serviceCodeByLegacy: Record<string, string> = {
    boarding: 'boarding',
    walking: 'walking',
    daycare: 'daycare',
    'house-sitting': 'house_sitting',
    'drop-in': 'drop_in',
  };

  const serviceRows = parsed.data.services.map((service) => ({
    provider_id: provider.id,
    service_code: serviceCodeByLegacy[service],
    base_price: parsed.data.prices[service] ?? 0,
    currency: 'EUR',
    is_active: true,
  }));

  if (serviceRows.length > 0) {
    const { error: servicesError } = await supabase
      .from('provider_services')
      .upsert(serviceRows, { onConflict: 'provider_id,service_code' });

    if (servicesError) {
      appLogger.error('sitterProfile.save', 'services upsert failed', { error: servicesError.message, userId: user.id, providerId: provider.id });
      return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
