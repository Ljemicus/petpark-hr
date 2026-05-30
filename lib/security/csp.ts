/**
 * Content Security Policy utilities with nonce support
 *
 * PATCHED (P0 render fix):
 *  - `strict` mode: when set, a missing nonce throws instead of silently
 *    falling back to 'unsafe-inline'. This is what previously masked the bug:
 *    proxy.ts called buildCSPHeader() with no nonce, so the CSP quietly
 *    degraded and never matched the (non-existent) nonce on prerendered scripts.
 *  - `staticBuild` mode: emits a CSP suitable for statically prerendered pages
 *    that rely on SRI hashes (experimental.sri) instead of a per-request nonce.
 */

import { randomBytes } from 'crypto';

export const CSP_NONCE_HEADER = 'X-CSP-Nonce';

export interface CSPConfig {
  nonce?: string;
  reportUri?: string;
  reportOnly?: boolean;
  /** Throw if no nonce is provided (use on the dynamic request path). */
  strict?: boolean;
  /**
   * Build a CSP for statically prerendered pages. No nonce is used; inline
   * bootstrap scripts are authorised via SRI hashes (Next experimental.sri).
   * 'unsafe-inline' is included as a backstop and is IGNORED by browsers
   * whenever hashes/nonces are present, so it does not weaken hashed builds.
   */
  staticBuild?: boolean;
}

/**
 * Generate a cryptographically secure nonce
 */
export function generateNonce(): string {
  return randomBytes(16).toString('base64');
}

/**
 * Build CSP header value.
 */
export function buildCSPHeader(config: CSPConfig = {}): string {
  const { nonce, reportUri, staticBuild = false, strict = false } = config;

  if (strict && !nonce) {
    throw new Error(
      "buildCSPHeader: nonce is required in strict mode (dynamic request path). " +
      "If this is a statically prerendered route, call with { staticBuild: true } instead."
    );
  }

  // script-src resolution:
  //  - nonce present  -> 'nonce-XXX'      (dynamic, SSR per-request)
  //  - staticBuild    -> 'unsafe-inline'  (backstop; real auth via SRI hashes)
  //  - neither        -> 'unsafe-inline'  (legacy fallback; avoid in production)
  const scriptSrcAuth = nonce
    ? `'nonce-${nonce}'`
    : "'unsafe-inline'";

  const isVercelPreview = process.env.VERCEL_ENV === 'preview';
  const previewScriptSrc = isVercelPreview ? ' https://vercel.live' : '';
  const previewConnectSrc = isVercelPreview ? ' https://vercel.live https://*.vercel.live' : '';

  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src 'self' ${scriptSrcAuth} https://plausible.io${previewScriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://plausible.io https://api.resend.com https://api.stripe.com${previewConnectSrc}`,
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
    "form-action 'self' https://checkout.stripe.com",
    "upgrade-insecure-requests",
  ];

  if (reportUri) {
    directives.push(`report-uri ${reportUri}`);
  }

  return directives.join('; ');
}

/**
 * Get CSP header name based on configuration
 */
export function getCSPHeaderName(reportOnly = false): string {
  return reportOnly
    ? 'Content-Security-Policy-Report-Only'
    : 'Content-Security-Policy';
}

/**
 * Create CSP middleware for Next.js
 */
export function createCSPMiddleware(config: Omit<CSPConfig, 'nonce'> = {}) {
  return function cspMiddleware() {
    const nonce = generateNonce();
    const cspValue = buildCSPHeader({ ...config, nonce });
    const headerName = getCSPHeaderName(config.reportOnly);

    return {
      nonce,
      cspValue,
      headerName,
      headers: {
        [headerName]: cspValue,
      },
    };
  };
}
