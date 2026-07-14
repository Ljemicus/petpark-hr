import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from './helpers';
import type { Pet, WalkLabelPet } from '@/lib/types';

export interface PetCardData {
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  weight: number;
  microchip: string;
  ownerName: string;
  ownerPhone: string;
  vetName: string;
  vetPhone: string;
  allergies: string[];
  specialNeeds: string;
}

export async function getPets(): Promise<Pet[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('pets').select('*');
    if (error || !data) return [];
    return data as Pet[];
  } catch {
    return [];
  }
}

type PetFields = 'full' | 'walk-label';

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

export async function getPetsByOwner(ownerId: string, fields: 'walk-label'): Promise<WalkLabelPet[]>;
export async function getPetsByOwner(ownerId: string, fields?: 'full'): Promise<Pet[]>;
export async function getPetsByOwner(ownerId: string, fields: PetFields = 'full'): Promise<Pet[] | WalkLabelPet[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('owner_profile_id', ownerId);
    if (error || !data) return [];
    const pets = (data as unknown as Record<string, unknown>[]).map(normalizePet);
    return fields === 'walk-label'
      ? pets.map(({ id, owner_id, name, species, created_at }) => ({ id, owner_id, name, species, created_at })) as WalkLabelPet[]
      : pets;
  } catch {
    return [];
  }
}

export async function getPet(id: string): Promise<Pet | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('pets').select('*').eq('id', id).single();
    if (error || !data) return null;
    return normalizePet(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function createPet(petData: {
  owner_id: string;
  name: string;
  species: string;
  breed?: string | null;
  age?: number | null;
  weight?: number | null;
  special_needs?: string | null;
  photo_url?: string | null;
}): Promise<Pet | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pets')
      .insert({
        owner_profile_id: petData.owner_id,
        name: petData.name,
        species: petData.species,
        breed: petData.breed ?? null,
        weight_kg: petData.weight ?? null,
        special_needs: petData.special_needs ?? null,
      })
      .select()
      .single();
    if (error || !data) return null;
    return normalizePet(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function getPetCardData(_id: string): Promise<PetCardData | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return null;
}
