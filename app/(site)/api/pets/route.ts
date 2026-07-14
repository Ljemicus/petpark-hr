import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { Pet } from '@/lib/types';

function normalizePet(row: Record<string, unknown>): Pet {
  return {
    id: String(row.id),
    owner_id: String(row.owner_id ?? row.owner_profile_id),
    name: String(row.name),
    species: row.species as Pet['species'],
    breed: (row.breed as string | null) ?? null,
    age: (row.age as number | null) ?? null,
    weight: (row.weight as number | null) ?? (row.weight_kg as number | null) ?? null,
    special_needs: (row.special_needs as string | null) ?? null,
    photo_url: (row.photo_url as string | null) ?? null,
    created_at: String(row.created_at),
  };
}

// GET /api/pets - Get current user's pets
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: pets, error } = await supabase
      .from('pets')
      .select('*')
      .eq('owner_profile_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pets:', error);
      return NextResponse.json({ error: 'Failed to fetch pets' }, { status: 500 });
    }

    return NextResponse.json({ pets: (pets as Record<string, unknown>[]).map(normalizePet) });
  } catch (error) {
    console.error('Error in GET /api/pets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
