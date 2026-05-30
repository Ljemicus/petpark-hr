/**
 * Content Security Policy utilities with nonce support.
 *
 * Next.js reads the nonce for framework inline scripts from the `x-nonce`
 * request header. PetPark also exposes the same value as `X-CSP-Nonce` for
 * app-level server components that need to render nonce-bearing inline tags.
 */

import { randomBytes } from 'crypto';

export const CSP_NONCE_HEADER = 'X-CSP-Nonce';
export const NEXT_NONCE_HEADER = 'x-nonce';

export interface CSPConfig {
  nonce?: string;
  reportUri?: string;
  reportOnly?: boolean;
}

/**
 * Generate a cryptographically secure nonce.
 */
export function generateNonce(): string {
  return randomBytes(16).toString('base64');
}

/**
 * Build CSP header value with nonce support.
 */
export function buildCSPHeader(config: CSPConfig = {}): string {
  const { nonce, reportUri, reportOnly = false } = config;
  void reportOnly;

  const scriptSources = [
    "'self'",
    nonce ? `'nonce-${nonce}'` : "'unsafe-inline'",
    ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : []),
    'https://plausible.io',
  ];

  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src ${scriptSources.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://plausible.io https://api.resend.com https://api.stripe.com",
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
 * Get CSP header name based on configuration.
 */
export function getCSPHeaderName(reportOnly = false): string {
  return reportOnly
    ? 'Content-Security-Policy-Report-Only'
    : 'Content-Security-Policy';
}

/**
 * Create CSP middleware for Next.js.
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
        [CSP_NONCE_HEADER]: nonce,
        [NEXT_NONCE_HEADER]: nonce,
      },
    };
  };
}
