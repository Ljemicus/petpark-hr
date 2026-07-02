import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';

export const CSRF_COOKIE_NAME = 'csrf_token';
export const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32;
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export interface CsrfConfig {
  cookieName?: string;
  headerName?: string;
  tokenLength?: number;
  maxAge?: number;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
  path?: string;
}

const defaultConfig: Required<CsrfConfig> = {
  cookieName: CSRF_COOKIE_NAME,
  headerName: CSRF_HEADER_NAME,
  tokenLength: CSRF_TOKEN_LENGTH,
  maxAge: TOKEN_EXPIRY_MS / 1000,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  // Double-submit CSRF needs a JS-readable cookie so browser fetches can copy
  // the token into x-csrf-token. It is not an auth/session secret.
  httpOnly: false,
  path: '/',
};

export function generateCsrfToken(length: number = CSRF_TOKEN_LENGTH): string {
  return randomBytes(length).toString('hex');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function compareTokens(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createCsrfToken(config: CsrfConfig = {}): Promise<{ token: string; cookie: string }> {
  const cfg = { ...defaultConfig, ...config };
  const token = generateCsrfToken(cfg.tokenLength);

  const parts = [
    `${cfg.cookieName}=${token}`,
    `Path=${cfg.path}`,
    `Max-Age=${cfg.maxAge}`,
    `SameSite=${cfg.sameSite}`,
  ];
  if (cfg.secure) parts.push('Secure');
  if (cfg.httpOnly) parts.push('HttpOnly');

  return { token, cookie: parts.join('; ') };
}

export function validateCsrfToken(
  request: Pick<NextRequest, 'headers'>,
  cookieToken: string | undefined,
  config: CsrfConfig = {}
): boolean {
  const cfg = { ...defaultConfig, ...config };
  if (!cookieToken) return false;

  const headerToken = request.headers.get(cfg.headerName);
  if (!headerToken) return false;

  return compareTokens(cookieToken, headerToken);
}

function getConfiguredOrigins(request: NextRequest): Set<string> {
  const origins = new Set<string>([request.nextUrl.origin, 'https://petpark.hr', 'https://www.petpark.hr']);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (siteUrl) {
    try { origins.add(new URL(siteUrl).origin); } catch { /* ignore malformed env */ }
  }

  if (process.env.VERCEL_URL) origins.add(`https://${process.env.VERCEL_URL}`);

  for (const raw of (process.env.CSRF_ALLOWED_ORIGINS || '').split(',')) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    try { origins.add(new URL(trimmed).origin); } catch { /* ignore malformed env */ }
  }

  return origins;
}

export function hasTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const secFetchSite = request.headers.get('sec-fetch-site');
  const allowedOrigins = getConfiguredOrigins(request);

  if (origin) {
    try {
      if (!allowedOrigins.has(new URL(origin).origin)) return false;
    } catch {
      return false;
    }
  } else if (secFetchSite && !['same-origin', 'same-site', 'none'].includes(secFetchSite)) {
    return false;
  } else {
    return false;
  }

  if (secFetchSite && !['same-origin', 'same-site', 'none'].includes(secFetchSite)) return false;
  return true;
}

export function isStateChangingMethod(method: string): boolean {
  return STATE_CHANGING_METHODS.has(method.toUpperCase());
}

export async function appendCsrfCookie(response: NextResponse, request: NextRequest, config: CsrfConfig = {}) {
  const cfg = { ...defaultConfig, ...config };
  if (request.cookies.get(cfg.cookieName)?.value) return response;
  const { cookie } = await createCsrfToken(cfg);
  response.headers.append('Set-Cookie', cookie);
  return response;
}

export async function csrfMiddleware(
  request: NextRequest,
  config: CsrfConfig = {}
): Promise<NextResponse | null> {
  const cfg = { ...defaultConfig, ...config };
  const method = request.method.toUpperCase();

  if (SAFE_METHODS.has(method)) return null;
  if (!STATE_CHANGING_METHODS.has(method)) return null;

  if (!hasTrustedOrigin(request) || !validateCsrfToken(request, request.cookies.get(cfg.cookieName)?.value, cfg)) {
    return NextResponse.json(
      { error: 'Nevažeći sigurnosni token. Osvježite stranicu i pokušajte ponovno.', code: 'CSRF_INVALID' },
      { status: 403 }
    );
  }

  return null;
}

export async function getCsrfToken(request: NextRequest, config: CsrfConfig = {}): Promise<string | null> {
  const cfg = { ...defaultConfig, ...config };
  return request.cookies.get(cfg.cookieName)?.value || null;
}

export function withCsrfProtection(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config: CsrfConfig = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const csrfResponse = await csrfMiddleware(request, config);
    if (csrfResponse) return csrfResponse;
    return handler(request);
  };
}
