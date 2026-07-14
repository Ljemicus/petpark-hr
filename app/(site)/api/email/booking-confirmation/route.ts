import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiError } from '@/lib/api-errors';
import { sendBookingConfirmationEmail } from '@/lib/email-sequences';
import { bookingConfirmationEmailSchema } from '@/lib/validation';
import type { User } from '@/lib/types';

/**
 * POST /api/email/booking-confirmation
 * Send booking confirmation email
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      return apiError({ status: 401, code: 'UNAUTHORIZED', message: 'Unauthorized' });
    }

    const body = await request.json().catch(() => null);
    const parsed = bookingConfirmationEmailSchema.safeParse(body);
    if (!parsed.success) {
      return apiError({
        status: 400,
        code: 'INVALID_INPUT',
        message: 'Neispravni podaci.',
        details: parsed.error.flatten().fieldErrors,
      });
    }
    const { userId, petName, serviceName, providerName, dates, totalPrice } = parsed.data;

    // Get user details from the canonical profile table. Email routes run server-side
    // because booking emails may target another participant in the booking.
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

    const result = await sendBookingConfirmationEmail(user, {
      petName,
      serviceName,
      providerName: providerName || 'Vaš čuvar',
      dates,
      totalPrice: totalPrice || '0 HRK',
    });

    if (!result.success) {
      return apiError({ 
        status: 500, 
        code: 'EMAIL_SEND_FAILED', 
        message: result.error || 'Failed to send confirmation email' 
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Booking confirmation email error:', error);
    return apiError({ 
      status: 500, 
      code: 'INTERNAL_ERROR', 
      message: 'Failed to send booking confirmation' 
    });
  }
}
