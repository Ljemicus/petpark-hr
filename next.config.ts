import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

// -----------------------------------------------------------------------------
// PATCHED (P0 render fix):
//   The static `csp` constant and its Content-Security-Policy header have been
//   REMOVED from headers() below. Reason: it emitted a SECOND, conflicting CSP
//   (script-src ... 'unsafe-inline') alongside the nonce-CSP set by proxy.ts.
//   When two CSP headers are present the browser enforces their INTERSECTION,
//   and 'unsafe-inline' is ignored whenever a nonce/hash is present — so the
//   strict policy still blocked every script on statically prerendered pages.
//
//   CSP is now owned by exactly ONE place: proxy.ts.
//     - dynamic routes  -> nonce-based CSP (per request)
//     - affected public landing routes are force-dynamic fallback for nonce CSP
// -----------------------------------------------------------------------------

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/treneri', destination: '/dresura', permanent: true },
      { source: '/groomeri', destination: '/njega', permanent: true },
      { source: '/sitters', destination: '/pretraga', permanent: true },
      { source: '/groomers', destination: '/njega', permanent: true },
      { source: '/trainers', destination: '/dresura', permanent: true },
      // NOTE: active community subroutes are excluded from legacy blog-slug redirects.
      { source: '/zajednica/:slug((?!feed|izazovi|najbolji).*)', destination: '/blog/:slug', permanent: true },
      { source: '/blog/prilago%C4%91en%20ku%C4%87nim%20ljubimcima-plaze-parkovi-hrvatska', destination: '/blog/pet-friendly-plaze-parkovi-hrvatska', permanent: true },
      { source: '/blog/prilagođen kućnim ljubimcima-plaze-parkovi-hrvatska', destination: '/blog/pet-friendly-plaze-parkovi-hrvatska', permanent: true },
      { source: '/grooming', destination: '/njega', permanent: true },
    ];
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'Link', value: '<https://hmtlcgjcxhjecsbmmxol.supabase.co>; rel=preconnect' },
        { key: 'Link', value: '<https://res.cloudinary.com>; rel=preconnect' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        // Content-Security-Policy intentionally removed here — see note above.
        // It is now set per-request in proxy.ts.
      ],
    }];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-icons'],
  },
};

const withSentry = withSentryConfig(nextConfig, {
  // For all available options, see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
  tunnelRoute: "/monitoring",

  // Source maps configuration
  sourcemaps: {
    disable: false,
  },

  // Enables automatic instrumentation of Vercel Cron Monitors
  automaticVercelMonitors: true,

  // Tree-shaking: Only include necessary Sentry features
  bundleSizeOptimizations: {
    excludeReplayShadowDom: true,
    excludeReplayIframe: true,
    excludeReplayWorker: true,
  },

  // Disable Sentry debug logging in production
  debug: false,

  disableLogger: true,
});

export default withSentry;
