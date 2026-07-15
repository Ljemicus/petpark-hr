import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Cormorant_Garamond, Inter, Nunito } from 'next/font/google';
import './globals.css';
import { WebsiteJsonLd, SiteNavigationJsonLd } from '@/components/seo/json-ld';
import { DEFAULT_LOCALE } from '@/lib/i18n';
import { CsrfFetchGuard } from '@/components/security/csrf-fetch-guard';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-heading',
  weight: ['600', '700', '800'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  weight: ['600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://petpark.hr'),
  title: {
    default: 'PetPark — Sve za ljubimce na jednom mjestu',
    template: '%s | PetPark',
  },
  description: 'PetPark je hrvatska super-aplikacija za ljubimce. Čuvanje, grooming, školovanje pasa, veterinari, udomljavanje, dog-friendly lokacije i još više — sve na jednom mjestu.',
  other: {
    'google': 'notranslate',
  },
  authors: [{ name: 'PetPark' }],
  creator: 'PetPark',
  publisher: 'PetPark',
  formatDetection: { telephone: true, email: true },
  alternates: {
    languages: {
      'hr-HR': 'https://petpark.hr',
    },
  },
  openGraph: {
    title: 'PetPark — Sve za ljubimce na jednom mjestu',
    description: 'Čuvanje, grooming, školovanje, veterinari, udomljavanje i zajednica ljubitelja životinja — sve u jednoj aplikaciji.',
    type: 'website',
    locale: 'hr_HR',
    url: 'https://petpark.hr',
    siteName: 'PetPark',
    images: [{
      url: '/opengraph-image',
      width: 1200,
      height: 630,
      alt: 'PetPark — Sve za ljubimce na jednom mjestu',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetPark — Sve za ljubimce na jednom mjestu',
    description: 'Čuvanje, grooming, školovanje, veterinari, udomljavanje i zajednica ljubitelja životinja — sve u jednoj aplikaciji.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: process.env.NEXT_PUBLIC_GSC_TOKEN ? {
    google: process.env.NEXT_PUBLIC_GSC_TOKEN,
  } : undefined,
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  themeColor: '#f97316',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const routeLocale = DEFAULT_LOCALE;

  return (
    <html lang={routeLocale} className={`${inter.variable} ${nunito.variable} ${cormorant.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#f97316" />
        <link rel="preconnect" href="https://hmtlcgjcxhjecsbmmxol.supabase.co" />
        <link rel="dns-prefetch" href="https://hmtlcgjcxhjecsbmmxol.supabase.co" />
        <link rel="dns-prefetch" href="https://plausible.io" />
        
        {/* Hreflang tags for SEO */}
        <link rel="alternate" hrefLang="hr" href="https://petpark.hr" />
        <link rel="alternate" hrefLang="x-default" href="https://petpark.hr" />
        
        {/* Inline Critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: readFileSync(join(process.cwd(), 'public', 'critical.css'), 'utf-8') }} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PetPark" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Script
          defer
          data-domain="petpark.hr"
          src="https://plausible.io/js/script.js"
          strategy="lazyOnload"
        />
        <WebsiteJsonLd />
        <SiteNavigationJsonLd />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <CsrfFetchGuard />
        {children}
      </body>
    </html>
  );
}
