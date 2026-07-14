import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiError } from '@/lib/api-errors';
import { sendReviewRequestEmail } from '@/lib/email-sequences';
import { reviewRequestEmailSchema } from '@/lib/validation';
import type { User } from '@/lib/types';

/**
 * POST /api/email/review-request
 * Send review request email after completed booking
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      return apiError({ status: 401, code: 'UNAUTHORIZED', message: 'Unauthorized' });
    }

    const body = await request.json().catch(() => null);
    const parsed = reviewRequestEmailSchema.safeParse(body);
    if (!parsed.success) {
      return apiError({
        status: 400,
        code: 'INVALID_INPUT',
        message: 'Neispravni podaci.',
        details: parsed.error.flatten().fieldErrors,
      });
    }
    const { userId, petName, providerName, serviceName, bookingId } = parsed.data;

    // Get user details from the canonical profile table. Email routes run server-side
    // because review emails may target another participant in the booking.
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
      role: 'owner',
      avatar_url: userData.avatar_url,
      phone: userData.phone,
      city: userData.city,
      created_at: userData.created_at,
    };

    const result = await sendReviewRequestEmail(user, {
      petName,
      providerName: providerName || 'Vaš čuvar',
      serviceName: serviceName || 'Usluga',
      bookingId,
    });

    if (!result.success) {
      return apiError({ 
        status: 500, 
        code: 'EMAIL_SEND_FAILED', 
        message: result.error || 'Failed to send review request email' 
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Review request email error:', error);
    return apiError({ 
      status: 500, 
      code: 'INTERNAL_ERROR', 
      message: 'Failed to send review request' 
    });
  }
}
