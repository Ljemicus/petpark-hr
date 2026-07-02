import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type HealthCheck = {
  status: 'ok' | 'warning' | 'error';
  responseTime?: number;
  message?: string;
};

const isConfigured = (value: string | undefined, placeholder: string) => Boolean(value && !value.includes(placeholder));

// Health check endpoint for monitoring and load balancers.
// Keep this side-effect free: no test writes, no synthetic Sentry events, no secrets in response.
export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, HealthCheck> = {};

  // Check Supabase connection. Prefer service role on the server because public RLS can intentionally block anon reads.
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      checks.database = { status: 'error', message: 'Missing Supabase credentials' };
    } else {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const dbStart = Date.now();
      const { error } = await supabase.from('profiles').select('id').limit(1);
      checks.database = {
        status: error ? 'error' : 'ok',
        responseTime: Date.now() - dbStart,
        message: error?.message,
      };
    }
  } catch (error) {
    checks.database = { status: 'error', message: String(error) };
  }

  // Check Redis/Upstash if configured. Rate limiting must fail closed in production when URL exists but token is missing.
  if (isConfigured(process.env.UPSTASH_REDIS_REST_URL, 'your-url')) {
    if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
      checks.redis = { status: 'error', message: 'Missing Upstash Redis token' };
    } else {
      try {
        const redisStart = Date.now();
        const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/ping`, {
          headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
          cache: 'no-store',
        });
        checks.redis = {
          status: response.ok ? 'ok' : 'error',
          responseTime: Date.now() - redisStart,
          message: response.ok ? undefined : `Redis ping failed with ${response.status}`,
        };
      } catch (error) {
        checks.redis = { status: 'error', message: String(error) };
      }
    }
  } else {
    checks.redis = { status: 'warning', message: 'Redis not configured; rate limit fallback may be local only' };
  }

  // Configuration-only Sentry check. Do not emit synthetic health events.
  checks.sentry = {
    status: isConfigured(process.env.SENTRY_DSN, 'your-dsn') || isConfigured(process.env.NEXT_PUBLIC_SENTRY_DSN, 'your-dsn') ? 'ok' : 'warning',
    message:
      isConfigured(process.env.SENTRY_DSN, 'your-dsn') || isConfigured(process.env.NEXT_PUBLIC_SENTRY_DSN, 'your-dsn')
        ? undefined
        : 'Sentry DSN not configured',
  };

  const totalResponseTime = Date.now() - startTime;
  const criticalChecksHealthy = Object.entries(checks)
    .filter(([name]) => name === 'database' || name === 'redis')
    .every(([, check]) => check.status === 'ok' || check.status === 'warning');

  return NextResponse.json(
    {
      status: criticalChecksHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
      environment: process.env.NODE_ENV,
      responseTime: totalResponseTime,
      checks,
    },
    {
      status: criticalChecksHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Health-Check': 'true',
      },
    },
  );
}
