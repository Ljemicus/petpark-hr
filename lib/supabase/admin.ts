import { createClient } from '@supabase/supabase-js';

function isBuildOrCiPhase(): boolean {
  return process.env.CI === 'true' || process.env.NEXT_PHASE === 'phase-production-build';
}

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    const message = 'Supabase admin environment variables are not configured: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.';

    // During CI/build we may need import-time compatibility for static analysis,
    // but runtime server code must fail closed instead of using placeholder secrets.
    if (isBuildOrCiPhase()) {
      return createClient('https://placeholder.supabase.co', 'placeholder', {
        auth: { autoRefreshToken: false, persistSession: false },
      });
    }

    throw new Error(message);
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
