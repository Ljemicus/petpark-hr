import { NextResponse, type NextRequest } from 'next/server';
import { generateNonce, buildCSPHeader, CSP_NONCE_HEADER } from '@/lib/security/csp';
import { createServerClient } from '@supabase/ssr';
import { updateSession } from '@/lib/supabase/middleware';
import { generateRequestId, REQUEST_ID_HEADER } from '@/lib/request-context';
import { detectLocaleFromPathname, LOCALE_HEADER } from '@/lib/i18n/routing';
import { appendCsrfCookie, csrfMiddleware, isStateChangingMethod } from './middleware/csrf';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TRAINER_DEMO_RE = /^trainer[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/i;
const GROOMER_DEMO_RE = /^groomer[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/i;
const MOCK_TRAINER_RE = /^tr-\d+$/i;
const MOCK_GROOMER_RE = /^gr-\d+$/i;

function isAllowedSitterId(id: string) {
  return UUID_RE.test(id);
}

function isAllowedTrainerId(id: string) {
  return UUID_RE.test(id) || TRAINER_DEMO_RE.test(id) || MOCK_TRAINER_RE.test(id);
}

function isAllowedGroomerId(id: string) {
  return UUID_RE.test(id) || GROOMER_DEMO_RE.test(id) || MOCK_GROOMER_RE.test(id);
}

async function providerExists(request: NextRequest, id: string, kind: 'sitter' | 'groomer' | 'trainer') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return true;

  const supabase = createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll() { /* proxy guard is read-only */ },
    },
  });

  const { data, error } = await supabase
    .from('providers')
    .select('id')
    .eq('id', id)
    .eq('provider_kind', kind)
    .eq('public_status', 'listed')
    .maybeSingle();

  if (error) return true;
  return Boolean(data);
}

async function maybeHard404DynamicProfile(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/sitter/')) {
    const id = pathname.slice('/sitter/'.length);
    if (id && (!isAllowedSitterId(id) || !(await providerExists(request, id, 'sitter')))) {
      return NextResponse.rewrite(new URL('/hard-404', request.url), { status: 404 });
    }
  }

  if (pathname.startsWith('/trener/')) {
    const id = pathname.slice('/trener/'.length);
    if (id && (!isAllowedTrainerId(id) || (UUID_RE.test(id) && !(await providerExists(request, id, 'trainer'))))) {
      return NextResponse.rewrite(new URL('/hard-404', request.url), { status: 404 });
    }
  }

  if (pathname.startsWith('/groomer/')) {
    const id = pathname.slice('/groomer/'.length);
    if (id && (!isAllowedGroomerId(id) || (UUID_RE.test(id) && !(await providerExists(request, id, 'groomer'))))) {
      return NextResponse.rewrite(new URL('/hard-404', request.url), { status: 404 });
    }
  }

  return null;
}

// Routes that authenticate with an external/shared secret instead of browser cookies.
const CSRF_EXCLUDED_ROUTES = [
  '/api/payments/webhook', // Stripe signature is the authenticator.
  '/api/cron/', // Cron routes must enforce CRON_SECRET at handler level.
];

function isCsrfExcludedRoute(pathname: string): boolean {
  return CSRF_EXCLUDED_ROUTES.some(route => pathname.startsWith(route));
}


async function hasDbAdminRoleForRequest(request: NextRequest): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return false;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll() { /* proxy guard is read-only */ },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('profile_roles')
    .select('role')
    .eq('profile_id', user.id)
    .eq('role', 'admin')
    .maybeSingle();

  return !error && data?.role === 'admin';
}

async function hasValidBearerAuth(request: NextRequest): Promise<boolean> {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return false;

  const token = authorization.slice('Bearer '.length).trim();
  if (!token) return false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return false;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return []; },
      setAll() { /* bearer-only check; no cookies to set */ },
    },
  });

  const { data, error } = await supabase.auth.getUser(token);
  return !error && Boolean(data.user);
}

/**
 * Standard security headers applied to every response.
 * NOTE: Content-Security-Policy is intentionally NOT set here — it is applied
 * per-branch below so the nonce stays consistent. CSP must come from exactly
 * ONE place; the duplicate CSP in next.config.ts headers() has been removed.
 */
function applyBaseSecurityHeaders(res: NextResponse) {
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  );
}

async function decorateProxyResponse(res: NextResponse, request: NextRequest, requestId: string, locale: string, cspValue: string, nonce?: string) {
  res.headers.set(REQUEST_ID_HEADER, requestId);
  res.headers.set(LOCALE_HEADER, locale);
  applyBaseSecurityHeaders(res);
  res.headers.set('Content-Security-Policy', cspValue);
  if (nonce) res.headers.set(CSP_NONCE_HEADER, nonce);
  return appendCsrfCookie(res, request);
}

export async function proxy(request: NextRequest) {
  // Assign a request ID for end-to-end correlation across logs.
  const requestId = request.headers.get(REQUEST_ID_HEADER) || generateRequestId();
  const pathname = request.nextUrl.pathname;
  const locale = detectLocaleFromPathname(pathname);
  request.headers.set(REQUEST_ID_HEADER, requestId);
  request.headers.set(LOCALE_HEADER, locale);

  // ---------------------------------------------------------------------------
  // CSP / nonce — generate ONCE and keep request + response perfectly in sync.
  //
  // CRITICAL: the SAME nonce must be (a) set on the REQUEST headers so Next's
  // renderer stamps it onto every <script> it emits, and (b) set on the
  // RESPONSE CSP header so the browser enforces that exact nonce. Previously
  // buildCSPHeader() was called with no args -> degraded CSP, and the nonce was
  // never placed on the request, so server-rendered scripts had no nonce.
  //
  // Statically prerendered routes do NOT hit this dynamic path the same way:
  // they are served from cache without a per-request nonce, so they rely on
  // SRI hashes (experimental.sri in next.config.ts) + a staticBuild CSP. We
  // therefore must NOT emit a nonce-CSP for a response whose HTML was frozen at
  // build time. The homepage fast-path below is the canonical example.
  // ---------------------------------------------------------------------------
  const nonce = generateNonce();

  // Make the nonce available to the renderer for dynamically-rendered routes.
  request.headers.set(CSP_NONCE_HEADER, nonce);
  request.headers.set('Content-Security-Policy', buildCSPHeader({ nonce, strict: true }));

  // Fast path for statically-served public homepage: it is prerendered and
  // cached, so it must use the staticBuild CSP (SRI-backed), NOT a per-request
  // nonce that its frozen HTML cannot carry.
  if (pathname === '/') {
    const response = NextResponse.next({ request: { headers: request.headers } });
    return decorateProxyResponse(response, request, requestId, locale, buildCSPHeader({ staticBuild: true }));
  }

  // For all dynamic responses below we use this single nonce-backed value.
  const cspValue = buildCSPHeader({ nonce, strict: true });

  if (pathname.startsWith('/admin/service-listings')) {
    if (!(await hasDbAdminRoleForRequest(request))) {
      const url = request.nextUrl.clone();
      url.pathname = '/hard-404';
      const admin404 = NextResponse.rewrite(url, { status: 404 });
      return decorateProxyResponse(admin404, request, requestId, locale, cspValue, nonce);
    }
  }

  // Apply CSRF protection to browser-cookie mutating requests. External-secret routes
  // are explicitly excluded; token-based mobile/API calls bypass only after Supabase
  // validates the bearer token.
  if (!isCsrfExcludedRoute(request.nextUrl.pathname) && isStateChangingMethod(request.method)) {
    const bearerAuthenticated = await hasValidBearerAuth(request);
    if (!bearerAuthenticated) {
      const csrfResponse = await csrfMiddleware(request);
      if (csrfResponse) {
        return decorateProxyResponse(csrfResponse, request, requestId, locale, cspValue, nonce);
      }
    }
  }

  const forced404 = await maybeHard404DynamicProfile(request);
  if (forced404) {
    return decorateProxyResponse(forced404, request, requestId, locale, cspValue, nonce);
  }

  const response = await updateSession(request);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // handled in updateSession
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && pathname === '/moji-upiti') {
      const url = request.nextUrl.clone();
      url.pathname = '/prijava';
      url.searchParams.set('redirect', '/moji-upiti');
      return decorateProxyResponse(NextResponse.redirect(url), request, requestId, locale, cspValue, nonce);
    }

    if (user) {
      const needsPublisherProfile = pathname.startsWith('/dashboard/adoption') || pathname.startsWith('/dashboard/profile');
      const needsGroomerProfile = pathname.startsWith('/dashboard/groomer');
      const needsTrainerProfile = pathname.startsWith('/dashboard/trainer');

      if (needsPublisherProfile || needsGroomerProfile || needsTrainerProfile) {
        const { data: publisher } = await supabase
          .from('publisher_profiles')
          .select('type')
          .eq('user_id', user.id)
          .maybeSingle();

        if (pathname.startsWith('/dashboard/adoption')) {
          if (!publisher) {
            const url = request.nextUrl.clone();
            url.pathname = '/onboarding/publisher-type';
            return decorateProxyResponse(NextResponse.redirect(url), request, requestId, locale, cspValue, nonce);
          }

          if (publisher.type !== 'udomljavanje') {
            const url = request.nextUrl.clone();
            url.pathname = '/dashboard/profile';
            return decorateProxyResponse(NextResponse.redirect(url), request, requestId, locale, cspValue, nonce);
          }
        }

        if (needsGroomerProfile) {
          const { data: groomer } = await supabase
            .from('groomers')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

          if (!groomer) {
            const url = request.nextUrl.clone();
            url.pathname = '/onboarding/publisher-type';
            return decorateProxyResponse(NextResponse.redirect(url), request, requestId, locale, cspValue, nonce);
          }
        }

        if (needsTrainerProfile) {
          const { data: trainer } = await supabase
            .from('trainers')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

          if (!trainer) {
            const url = request.nextUrl.clone();
            url.pathname = '/onboarding/provider';
            return decorateProxyResponse(NextResponse.redirect(url), request, requestId, locale, cspValue, nonce);
          }
        }
      }
    }
  }

  // Add security, locale, request-id, and CSP header with the SAME nonce that was placed on the request headers.
  return decorateProxyResponse(response, request, requestId, locale, cspValue, nonce);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
