import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiError } from '@/lib/api-errors';
import { scheduleWelcomeSequence } from '@/lib/email-sequences';
import { requireAdmin } from '@/lib/admin-guard';
import type { User } from '@/lib/types';

type EmailRole = 'owner' | 'sitter' | 'groomer' | 'trainer' | 'breeder' | 'rescue';

/**
 * POST /api/email/sequences/welcome
 * Trigger welcome sequence for a new user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      return apiError({ status: 401, code: 'UNAUTHORIZED', message: 'Unauthorized' });
    }

    const body = await request.json();
    const { userId, role }: { userId: string; role: EmailRole } = body;

    if (!userId || !role) {
      return apiError({ 
        status: 400, 
        code: 'INVALID_REQUEST', 
        message: 'Missing userId or role' 
      });
    }

    // Only allow users to trigger their own welcome sequence, or DB-backed admins.
    if (userId !== authUser.id) {
      const admin = await requireAdmin();
      if (!admin.ok) return admin.response;
    }

    // Get user details from the canonical profile table. Role-specific welcome
    // content is driven by the validated request role below.
    const admin = createAdminClient();
    const { data: userData, error: userError } = await admin
      .from('profiles')
      .select('id, email, name:display_name, avatar_url, phone, city, created_at')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return apiError({ status: 404, code: 'USER_NOT_FOUND', message: 'User not found' });
    }

    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: role === 'sitter' ? 'sitter' : 'owner',
      avatar_url: userData.avatar_url,
      phone: userData.phone,
      city: userData.city,
      created_at: userData.created_at,
    };

    // Schedule welcome sequence
    await scheduleWelcomeSequence(user, role as Parameters<typeof scheduleWelcomeSequence>[1]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Welcome sequence error:', error);
    return apiError({ 
      status: 500, 
      code: 'INTERNAL_ERROR', 
      message: 'Failed to schedule welcome sequence' 
    });
  }
}
