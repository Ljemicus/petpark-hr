import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { isSupabaseConfigured } from '@/lib/db/helpers';
import { appLogger } from '@/lib/logger';
import type { User } from '@/lib/types';

export interface AuthUserMetadata {
  name?: string;
  full_name?: string;
  role?: User['role'];
  avatar_url?: string | null;
  city?: string | null;
}

export interface AuthIdentityUser {
  id: string;
  email?: string;
  created_at: string;
  user_metadata?: AuthUserMetadata | null;
}

export function isUserRole(value: unknown): value is User['role'] {
  return value === 'owner' || value === 'sitter' || value === 'admin';
}

export function parseAuthRole(value: unknown, fallback: User['role'] = 'owner'): User['role'] {
  return isUserRole(value) ? value : fallback;
}

export function isUserRecord(value: unknown): value is User {
  if (!value || typeof value !== 'object') return false;

  const user = value as Partial<User>;
  return (
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.name === 'string' &&
    isUserRole(user.role) &&
    typeof user.created_at === 'string'
  );
}

function isExpectedDynamicUsageError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return message.includes('Dynamic server usage');
}

export function buildUserFromAuth(authUser: AuthIdentityUser): User {
  const meta = authUser.user_metadata;

  return {
    id: authUser.id,
    email: authUser.email || '',
    name: meta?.name || meta?.full_name || authUser.email?.split('@')[0] || '',
    // Never grant admin from auth metadata. Admin is DB-backed via profile_roles.
    role: parseAuthRole(meta?.role) === 'admin' ? 'owner' : parseAuthRole(meta?.role),
    avatar_url: meta?.avatar_url || null,
    phone: null,
    city: meta?.city || null,
    created_at: authUser.created_at,
  };
}

async function hasDbAdminRole(supabase: { from: (table: string) => any }, profileId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profile_roles')
    .select('role')
    .eq('profile_id', profileId)
    .eq('role', 'admin')
    .maybeSingle();

  if (error) {
    appLogger.warn('auth', 'Failed to resolve profile_roles admin role', {
      userId: profileId,
      message: error.message || 'unknown',
    });
    return false;
  }

  return data?.role === 'admin';
}

async function applyDbBackedRole(supabase: { from: (table: string) => any }, user: User): Promise<User> {
  if (await hasDbAdminRole(supabase, user.id)) return { ...user, role: 'admin' };
  if (user.role === 'admin') return { ...user, role: 'owner' };
  return user;
}

/**
 * Server-side: get the currently authenticated user via Supabase Auth.
 */
export async function getAuthUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const headerStore = await headers();
    const authHeader = headerStore.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    const supabase = bearerToken
      ? createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { global: { headers: { Authorization: `Bearer ${bearerToken}` } } }
        )
      : await createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      appLogger.warn('auth', 'Supabase auth.getUser failed', { message: error.message });
      return null;
    }

    const authUser = data.user;
    if (!authUser) return null;

    const { data: profileData } = await supabase
      .from('users')
      .select('id, email, name, role, avatar_url, phone, city, created_at')
      .eq('id', authUser.id)
      .single();

    if (isUserRecord(profileData)) return applyDbBackedRole(supabase, profileData);

    appLogger.warn('auth', 'Falling back to auth metadata because public.users profile is missing', {
      userId: authUser.id,
    });
    return applyDbBackedRole(supabase, buildUserFromAuth(authUser));
  } catch (error) {
    if (!isExpectedDynamicUsageError(error)) {
      appLogger.warn('auth', 'Failed to resolve authenticated user', {
        message: error instanceof Error ? error.message : 'unknown',
      });
    }
    return null;
  }
}
