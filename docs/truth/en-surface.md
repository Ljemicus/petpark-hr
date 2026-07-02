# EN / SEO surface dijagnostika — KIT-D D.0 (2026-07-02)

## EN directories

```
app/(site)/cuvanje-pasa-rijeka/en
app/(site)/cuvanje-pasa-split/en
app/(site)/cuvanje-pasa-zagreb/en
app/(site)/dog-friendly/en
app/(site)/dresura/en
app/(site)/faq/en
app/(site)/forum/en
app/(site)/grooming-zagreb/en
app/(site)/izgubljeni/en
app/(site)/njega/en
app/(site)/o-nama/en
app/(site)/pretraga/en
app/(site)/udomljavanje/en
app/(site)/uzgajivacnice/en
app/(site)/verifikacija/en
app/(site)/veterinari/en
```

## EN page files

```
app/(site)/cuvanje-pasa-rijeka/en/page.tsx
app/(site)/cuvanje-pasa-split/en/page.tsx
app/(site)/cuvanje-pasa-zagreb/en/page.tsx
app/(site)/dog-friendly/en/page.tsx
app/(site)/dresura/en/page.tsx
app/(site)/faq/en/page.tsx
app/(site)/forum/en/page.tsx
app/(site)/grooming-zagreb/en/page.tsx
app/(site)/izgubljeni/en/page.tsx
app/(site)/njega/en/page.tsx
app/(site)/o-nama/en/page.tsx
app/(site)/pretraga/en/page.tsx
app/(site)/udomljavanje/en/page.tsx
app/(site)/uzgajivacnice/en/page.tsx
app/(site)/verifikacija/en/page.tsx
app/(site)/veterinari/en/page.tsx
```

## alternates/hreflang/canonical refs

```
app/page.tsx:7:  alternates: {
app/page.tsx:8:    canonical: 'https://petpark.hr/',
app/layout.tsx:37:  alternates: {
app/layout.tsx:38:    languages: {
app/layout.tsx:40:      'en-US': 'https://petpark.hr/en',
app/layout.tsx:116:        <link rel="alternate" hrefLang="en" href="https://petpark.hr/en" />
app/layout.tsx:117:        <link rel="alternate" hrefLang="x-default" href="https://petpark.hr" />
app/sitemap.ts:80:    alternates: LOCALIZED_STATIC_ROUTES.has(route)
app/sitemap.ts:81:      ? { languages: buildLanguageAlternates(route) }
app/sitemap.ts:154:      alternates: { languages: buildLanguageAlternates(`/izgubljeni/${p.id}`) },
app/sitemap.ts:164:    alternates: { languages: buildLanguageAlternates(`/udomljavanje/${String(a.id)}`) },
components/seo/city-landing-page-en.tsx:119:    alternates: buildLocaleAlternates(config.route),
app/(site)/verifikacija/page.tsx:21:  alternates: buildLocaleAlternates('/verifikacija'),
app/(site)/verifikacija/page.tsx:95:      <Breadcrumbs items={[{ label: language === 'en' ? 'Verification' : 'Verifikacija', href: language === 'en' ? '/verifikacija/en' : '/verifikacija' }]} />
app/(site)/verifikacija/page.tsx:172:                <Link href={language === 'en' ? '/faq/en' : '/faq'}><Button size="lg" variant="outline" className="border-2 border-white/40 text-white hover:bg-white/10 rounded-xl text-lg px-10 h-14">{labels.ctaSecondary}</Button></Link>
app/(site)/verifikacija/en/page.tsx:15:    ...buildLocaleOpenGraph('/verifikacija/en'),
app/(site)/verifikacija/en/page.tsx:17:  alternates: buildLocaleAlternates('/verifikacija/en'),
components/social/challenge-list.tsx:28:      const response = await fetch(`/api/social/challenges/${challenge.id}/entries?sort=votes`);
components/social/challenge-list.tsx:49:      const response = await fetch(`/api/social/challenges/${challenge.id}/entries`, {
app/(site)/pretraga/page.tsx:18:    alternates: buildLocaleAlternates(pathname),
app/(site)/pretraga/search-page-shell.tsx:43:  return locale === 'en' ? '/pretraga/en' : '/pretraga';
app/(site)/pretraga/search-page-shell.tsx:59:    { href: '/cuvanje-pasa-zagreb/en', title: 'Dog sitting in Zagreb', description: 'Neighborhood-specific context, practical tips, and local dog sitting options in Zagreb.', badge: 'City page' },
app/(site)/pretraga/search-page-shell.tsx:60:    { href: '/cuvanje-pasa-split/en', title: 'Dog sitting in Split', description: 'A practical guide for pet owners looking for care in Split and nearby areas.', badge: 'City page' },
app/(site)/pretraga/search-page-shell.tsx:61:    { href: '/cuvanje-pasa-rijeka/en', title: 'Dog sitting in Rijeka', description: 'Local context and useful information for finding pet care in Rijeka.', badge: 'City page' },
app/(site)/pretraga/search-page-shell.tsx:62:    { href: '/grooming-zagreb/en', title: 'Grooming Zagreb', description: 'Pet grooming salons, pricing, and practical grooming guidance in Zagreb.', badge: 'Landing' },
app/(site)/pretraga/search-page-shell.tsx:63:    { href: '/veterinari/en', title: 'Veterinarians in Croatia', description: 'Directory of veterinary stations and clinics with contact details.', badge: 'Directory' },
app/(site)/pretraga/search-page-shell.tsx:64:    { href: '/dog-friendly/en', title: 'Dog-friendly places', description: 'Cafés, parks, and other dog-friendly places worth bookmarking.', badge: 'Lifestyle' },
app/(site)/izgubljeni/page.tsx:17:  alternates: buildLocaleAlternates('/izgubljeni'),
lib/seo/types.ts:130:  rel: 'canonical';
app/(site)/izgubljeni/[id]/page.tsx:54:    alternates: indexable ? buildLocaleAlternates(`/izgubljeni/${id}`) : undefined,
lib/seo/locale-metadata.ts:10:export function buildLocaleAlternates(pathname: string): NonNullable<Metadata['alternates']> {
lib/seo/locale-metadata.ts:12:    canonical: getLocaleUrl(pathname, detectLocaleFromPathname(pathname)) ?? pathname,
lib/seo/locale-metadata.ts:13:    languages: buildLanguageAlternates(pathname),
app/(site)/izgubljeni/en/page.tsx:16:    ...buildLocaleOpenGraph('/izgubljeni/en'),
app/(site)/izgubljeni/en/page.tsx:18:  alternates: buildLocaleAlternates('/izgubljeni/en'),
lib/i18n/context.tsx:26:    const hasExplicitEnRoute = pathname.endsWith('/en') || pathname.includes('/en/');
app/(site)/izgubljeni/en/[id]/page.tsx:38:      ...buildLocaleOpenGraph(`/izgubljeni/en/${id}`),
app/(site)/izgubljeni/en/[id]/page.tsx:54:    alternates: indexable ? buildLocaleAlternates(`/izgubljeni/en/${id}`) : undefined,
lib/i18n/routing.ts:12:    en: '/cuvanje-pasa-zagreb/en',
lib/i18n/routing.ts:16:    en: '/cuvanje-pasa-split/en',
lib/i18n/routing.ts:20:    en: '/cuvanje-pasa-rijeka/en',
lib/i18n/routing.ts:24:    en: '/grooming-zagreb/en',
lib/i18n/routing.ts:28:    en: '/veterinari/en',
lib/i18n/routing.ts:32:    en: '/njega/en',
lib/i18n/routing.ts:36:    en: '/njega/en',
lib/i18n/routing.ts:40:    en: '/dresura/en',
lib/i18n/routing.ts:44:    en: '/dog-friendly/en',
lib/i18n/routing.ts:48:    en: '/izgubljeni/en',
lib/i18n/routing.ts:52:    en: '/udomljavanje/en',
lib/i18n/routing.ts:56:    en: '/uzgajivacnice/en',
lib/i18n/routing.ts:60:    en: '/pretraga/en',
lib/i18n/routing.ts:64:    en: '/faq/en',
lib/i18n/routing.ts:68:    en: '/forum/en',
lib/i18n/routing.ts:72:    en: '/verifikacija/en',
lib/i18n/routing.ts:77: * Detail-route prefixes where /en/[id] variants exist as real pages.
lib/i18n/routing.ts:99:  if (cleanPath.endsWith('/en')) return 'en';
lib/i18n/routing.ts:100:  // Detect /en/ infix in detail routes: /udomljavanje/en/[id]
lib/i18n/routing.ts:102:    if (cleanPath.startsWith(prefix + '/en/')) return 'en';
lib/i18n/routing.ts:109:  // Strip trailing /en for list pages: /udomljavanje/en → /udomljavanje
lib/i18n/routing.ts:110:  if (cleanPath.endsWith('/en')) {
lib/i18n/routing.ts:111:    return cleanPath.slice(0, -'/en'.length) || '/';
lib/i18n/routing.ts:113:  // Strip interior /en/ for detail pages: /udomljavanje/en/[id] → /udomljavanje/[id]
lib/i18n/routing.ts:115:    const enInfix = prefix + '/en/';
lib/i18n/routing.ts:132:  // Handle dynamic detail routes: /udomljavanje/[id] ↔ /udomljavanje/en/[id]
lib/i18n/routing.ts:137:      return locale === 'en' ? `${prefix}/en${slug}` : `${prefix}${slug}`;
lib/i18n/routing.ts:149:export function buildLanguageAlternates(pathname: string): Partial<Record<Language | 'x-default', string>> {
lib/i18n/routing.ts:150:  const alternates: Partial<Record<Language | 'x-default', string>> = {};
lib/i18n/routing.ts:155:      alternates[locale] = url;
lib/i18n/routing.ts:161:    alternates['x-default'] = defaultUrl;
lib/i18n/routing.ts:164:  return alternates;
lib/i18n/routing.ts:167:export function getLocaleSegment(locale: Language): '' | '/en' {
lib/i18n/routing.ts:168:  return locale === 'en' ? '/en' : '';
app/(site)/izgubljeni/lost-pets-page-shell.tsx:17:    pathname: '/izgubljeni/en',
app/(site)/registracija/page.tsx:8:  alternates: { canonical: 'https://petpark.hr/registracija' },
lib/api/env.ts:5:import { getValidatedEnv, isDevelopment, isProduction, isTest, FEATURES } from './env-check';
components/shared/language-switcher.tsx:16:const languages: Language[] = ['hr', 'en'];
components/shared/language-switcher.tsx:43:        {languages.map((lang) => {
lib/api/index.ts:17:export * from './env-check';
lib/api/index.ts:18:export * from './env';
app/(site)/prijava/page.tsx:8:  alternates: { canonical: 'https://petpark.hr/prijava' },
app/(site)/zajednica/[slug]/page.tsx:64:    alternates: {
app/(site)/zajednica/[slug]/page.tsx:65:      canonical: `${BASE_URL}/zajednica/${slug}`,
components/shared/footer.tsx:150:      '/njega': '/njega/en',
components/shared/footer.tsx:151:      '/dresura': '/dresura/en',
components/shared/footer.tsx:152:      '/veterinari': '/veterinari/en',
components/shared/footer.tsx:153:      '/dog-friendly': '/dog-friendly/en',
components/shared/footer.tsx:154:      '/udomljavanje': '/udomljavanje/en',
components/shared/footer.tsx:155:      '/izgubljeni': '/izgubljeni/en',
components/shared/footer.tsx:156:      '/uzgajivacnice': '/uzgajivacnice/en',
components/shared/footer.tsx:157:      '/forum': '/forum/en',
components/shared/footer.tsx:241:                <li><Link href={language === 'en' ? '/pretraga/en' : '/pretraga'} className="hover:text-orange-400 transition-colors">{t('footer.find_sitter')}</Link></li>
components/shared/footer.tsx:251:                <li><Link href={language === 'en' ? '/cuvanje-pasa-zagreb/en' : '/cuvanje-pasa-zagreb'} className="hover:text-warm-orange transition-colors">{language === 'en' ? 'Dog sitting Zagreb' : 'Čuvanje pasa Zagreb'}</Link></li>
components/shared/footer.tsx:252:                <li><Link href={language === 'en' ? '/cuvanje-pasa-split/en' : '/cuvanje-pasa-split'} className="hover:text-warm-orange transition-colors">{language === 'en' ? 'Dog sitting Split' : 'Čuvanje pasa Split'}</Link></li>
components/shared/footer.tsx:253:                <li><Link href={language === 'en' ? '/cuvanje-pasa-rijeka/en' : '/cuvanje-pasa-rijeka'} className="hover:text-warm-orange transition-colors">{language === 'en' ? 'Dog sitting Rijeka' : 'Čuvanje pasa Rijeka'}</Link></li>
components/shared/footer.tsx:254:                <li><Link href={language === 'en' ? '/grooming-zagreb/en' : '/grooming-zagreb'} className="hover:text-pink-400 transition-colors">{language === 'en' ? 'Grooming Zagreb' : 'Grooming Zagreb'}</Link></li>
app/(site)/zajednica/page.tsx:39:  alternates: {
app/(site)/zajednica/page.tsx:40:    canonical: 'https://petpark.hr/zajednica',
app/(site)/grooming-zagreb/page.tsx:29:  alternates: buildLocaleAlternates('/grooming-zagreb'),
app/(site)/grooming-zagreb/en/page.tsx:35:    url: `${BASE_URL}/grooming-zagreb/en`,
app/(site)/grooming-zagreb/en/page.tsx:46:  alternates: buildLocaleAlternates('/grooming-zagreb/en'),
app/(site)/grooming-zagreb/en/page.tsx:114:    url: `${BASE_URL}/grooming-zagreb/en`,
app/(site)/grooming-zagreb/en/page.tsx:152:      <Breadcrumbs items={[{ label: 'Grooming', href: '/njega' }, { label: 'Zagreb', href: '/grooming-zagreb/en' }]} />
app/(site)/cuvanje-pasa-rijeka/page.tsx:38:  alternates: buildLocaleAlternates('/cuvanje-pasa-rijeka'),
app/(site)/cuvanje-pasa-rijeka/en/page-data.ts:11:  route: '/cuvanje-pasa-rijeka/en',
components/shared/conditional-analytics.tsx:82:        'https://connect.facebook.net/en_US/fbevents.js');
lib/db/provider-promotion.ts:75:    warnings.push(`Provider type is not yet canonical: ${application.provider_type || 'unknown'}`);
app/(site)/sitter/[id]/page.tsx:53:    alternates: { canonical: `/sitter/${id}` },
components/shared/navbar/config.tsx:31:    '/njega': '/njega/en',
components/shared/navbar/config.tsx:32:    '/dresura': '/dresura/en',
components/shared/navbar/config.tsx:33:    '/veterinari': '/veterinari/en',
components/shared/navbar/config.tsx:34:    '/dog-friendly': '/dog-friendly/en',
components/shared/navbar/config.tsx:35:    '/izgubljeni': '/izgubljeni/en',
components/shared/navbar/config.tsx:36:    '/udomljavanje': '/udomljavanje/en',
components/shared/navbar/config.tsx:37:    '/uzgajivacnice': '/uzgajivacnice/en',
components/shared/navbar/config.tsx:38:    '/faq': '/faq/en',
components/shared/navbar/config.tsx:39:    '/verifikacija': '/verifikacija/en',
components/shared/navbar/config.tsx:40:    '/forum': '/forum/en',
app/(site)/nova-lozinka/page.tsx:8:  alternates: { canonical: 'https://petpark.hr/nova-lozinka' },
lib/db/provider-directory-linking.ts:42:function canonicalPhone(value?: string | null) {
lib/db/provider-directory-linking.ts:58:  const left = canonicalPhone(a);
lib/db/provider-directory-linking.ts:59:  const right = canonicalPhone(b);
components/shared/bottom-nav.tsx:14:  const blogHref = language === 'en' ? '/blog/en' : '/blog';
app/(site)/usluge/[slug]/page.tsx:32:    alternates: { canonical: `/usluge/${service.slug}` },
app/(site)/uvjeti/page.tsx:10:  alternates: { canonical: 'https://petpark.hr/uvjeti' },
lib/types.ts:944:// ── Trust Layer (canonical types in lib/types/trust.ts) ──
app/(site)/api/contests/[id]/entries/route.ts:5:// GET /api/contests/[id]/entries — list entries
app/(site)/api/contests/[id]/entries/route.ts:42:// POST /api/contests/[id]/entries — submit entry
app/(site)/privatnost/page.tsx:10:  alternates: { canonical: 'https://petpark.hr/privatnost' },
app/(site)/dresura/page.tsx:15:  alternates: buildLocaleAlternates('/dresura'),
app/(site)/api/contests/entries/[id]/vote/route.ts:5:// POST /api/contests/entries/[id]/vote — vote on entry
app/(site)/dresura/en/page.tsx:13:    ...buildLocaleOpenGraph('/dresura/en'),
app/(site)/dresura/en/page.tsx:15:  alternates: buildLocaleAlternates('/dresura/en'),
app/(site)/dresura/training-content.tsx:121:  const basePath = activeLanguage === 'en' ? '/dresura/en' : '/dresura';
app/(site)/dresura/training-page-shell.tsx:32:    pathname: '/dresura/en',
app/(site)/dresura/training-page-shell.tsx:42:    groomingHref: '/njega/en',
app/(site)/zaboravljena-lozinka/page.tsx:8:  alternates: { canonical: 'https://petpark.hr/zaboravljena-lozinka' },
app/(site)/groomer/[id]/page.tsx:41:    alternates: { canonical: `/groomer/${id}` },
app/(site)/udomljavanje/adoption-page-shell.tsx:18:    pathname: '/udomljavanje/en',
app/(site)/udomljavanje/page.tsx:19:  alternates: buildLocaleAlternates('/udomljavanje'),
app/(site)/veterinari/page.tsx:18:  alternates: buildLocaleAlternates('/veterinari'),
app/(site)/udomljavanje/[id]/page.tsx:32:    alternates: indexable ? buildLocaleAlternates(`/udomljavanje/${id}`) : undefined,
app/(site)/veterinari/en/page.tsx:14:    ...buildLocaleOpenGraph('/veterinari/en'),
app/(site)/veterinari/en/page.tsx:16:  alternates: buildLocaleAlternates('/veterinari/en'),
app/(site)/udomljavanje/en/page.tsx:14:    ...buildLocaleOpenGraph('/udomljavanje/en'),
app/(site)/udomljavanje/en/page.tsx:16:  alternates: buildLocaleAlternates('/udomljavanje/en'),
app/(site)/veterinari/veterinari-page-shell.tsx:18:    pathname: '/veterinari/en',
app/(site)/udomljavanje/en/[id]/page.tsx:29:      ...buildLocaleOpenGraph(`/udomljavanje/en/${id}`),
app/(site)/udomljavanje/en/[id]/page.tsx:32:    alternates: indexable ? buildLocaleAlternates(`/udomljavanje/en/${id}`) : undefined,
app/(site)/udomljavanje/udruga/[id]/page.tsx:28:    alternates: {
app/(site)/udomljavanje/udruga/[id]/page.tsx:29:      canonical: `${BASE_URL}/udomljavanje/udruga/${publisher.id}`,
app/(site)/faq/page.tsx:56:  alternates: buildLocaleAlternates('/faq'),
app/(site)/faq/page.tsx:80:    <PublicPageShell breadcrumbItems={[{ label: 'FAQ', href: locale === 'en' ? '/faq/en' : '/faq' }] }>
app/(site)/faq/en/page.tsx:16:    ...buildLocaleOpenGraph('/faq/en'),
app/(site)/faq/en/page.tsx:18:  alternates: buildLocaleAlternates('/faq/en'),
app/(site)/o-nama/page.tsx:14:  alternates: { canonical: 'https://petpark.hr/o-nama' },
app/(site)/o-nama/en/page.tsx:12:  alternates: { canonical: 'https://petpark.hr/o-nama/en' },
app/(site)/o-nama/en/page.tsx:147:              <Link href="/pretraga/en">
app/(site)/o-nama/en/page.tsx:153:              <Link href="/postani-sitter/en">
app/(site)/trener/[id]/page.tsx:41:    alternates: { canonical: `/trener/${id}` },
app/(site)/api/social/challenges/[id]/entries/route.ts:5:// GET /api/social/challenges/[id]/entries - Get entries for a challenge
app/(site)/api/social/challenges/[id]/entries/route.ts:44:    console.error('Error in GET /api/social/challenges/[id]/entries:', error);
app/(site)/kontakt/layout.tsx:13:  alternates: { canonical: 'https://petpark.hr/kontakt' },
app/(site)/udruge/[slug]/page.tsx:67:    alternates: {
app/(site)/udruge/[slug]/page.tsx:68:      canonical: `${BASE_URL}/udruge/${slug}`,
app/(site)/njega/page.tsx:15:  alternates: buildLocaleAlternates('/njega'),
app/(site)/udruge/page.tsx:25:  alternates: {
app/(site)/udruge/page.tsx:26:    canonical: `${BASE_URL}/udruge`,
app/(site)/njega/en/page.tsx:13:    ...buildLocaleOpenGraph('/njega/en'),
app/(site)/njega/en/page.tsx:15:  alternates: buildLocaleAlternates('/njega/en'),
app/(site)/postani-sitter/page.tsx:17:  alternates: { canonical: 'https://petpark.hr/postani-sitter' },
app/(site)/njega/grooming-page-shell.tsx:19:    pathname: '/njega/en',
app/(site)/postani-sitter/oglas/page.tsx:17:  alternates: { canonical: 'https://petpark.hr/postani-sitter/oglas' },
app/(site)/dog-friendly/page.tsx:18:  alternates: buildLocaleAlternates('/dog-friendly'),
app/(site)/dog-friendly/en/page.tsx:17:    ...buildLocaleOpenGraph('/dog-friendly/en'),
app/(site)/dog-friendly/en/page.tsx:19:  alternates: buildLocaleAlternates('/dog-friendly/en'),
app/(site)/dog-friendly/dog-friendly-page-shell.tsx:20:    pathname: '/dog-friendly/en',
app/(site)/cuvanje-pasa-zagreb/page.tsx:38:  alternates: buildLocaleAlternates('/cuvanje-pasa-zagreb'),
app/(site)/cuvanje-pasa-zagreb/en/page-data.ts:11:  route: '/cuvanje-pasa-zagreb/en',
app/(site)/grooming/grooming-content.tsx:137:  const basePath = activeLanguage === 'en' ? '/njega/en' : '/njega';
app/(site)/hitno/page.tsx:17:  alternates: { canonical: 'https://petpark.hr/hitno' },
app/(site)/forum/page.tsx:45:    alternates: {
app/(site)/forum/page.tsx:46:      canonical: lang === 'en' ? 'https://petpark.hr/forum/en' : 'https://petpark.hr/forum',
app/(site)/forum/[id]/page.tsx:72:    alternates: {
app/(site)/forum/[id]/page.tsx:73:      canonical: `${BASE_URL}/forum/${id}`,
app/(site)/forum/[id]/page.tsx:85:  const forumListingHref = isEn ? '/forum/en' : '/forum';
app/(site)/uzgajivacnice/breeders-content.tsx:262:function BreederCard({ breeder, index, isEn, localeSegment }: { breeder: Breeder; index: number; isEn: boolean; localeSegment: '' | '/en' }) {
app/(site)/uzgajivacnice/breeders-page-shell.tsx:18:    pathname: '/uzgajivacnice/en',
app/(site)/uzgajivacnice/page.tsx:15:  alternates: buildLocaleAlternates('/uzgajivacnice'),
app/(site)/uzgajivacnice/[id]/page.tsx:19:    alternates: breeder ? {
app/(site)/uzgajivacnice/[id]/page.tsx:20:      canonical: `${BASE_URL}/uzgajivacnice/${id}`,
app/(site)/uzgajivacnice/en/page.tsx:13:    ...buildLocaleOpenGraph('/uzgajivacnice/en'),
app/(site)/uzgajivacnice/en/page.tsx:15:  alternates: buildLocaleAlternates('/uzgajivacnice/en'),
app/(site)/apelacije/[slug]/page.tsx:59:    alternates: {
app/(site)/apelacije/[slug]/page.tsx:60:      canonical: `${BASE_URL}/apelacije/${slug}`,
app/(site)/apelacije/page.tsx:30:  alternates: {
app/(site)/apelacije/page.tsx:31:    canonical: `${BASE_URL}/apelacije`,
app/(site)/blog/[slug]/page.tsx:49:    alternates: {
app/(site)/blog/[slug]/page.tsx:50:      canonical: `${BASE_URL}/blog/${slug}`,
app/(site)/cuvanje-pasa-split/page.tsx:38:  alternates: buildLocaleAlternates('/cuvanje-pasa-split'),
app/(site)/blog/page.tsx:19:  alternates: { canonical: 'https://petpark.hr/blog' },
app/(site)/cuvanje-pasa-split/en/page-data.ts:11:  route: '/cuvanje-pasa-split/en',
```

## H1 heuristic: files with more than one <h1/H1 occurrence

```
app/(site)/checkout/[bookingId]/page.tsx: 3
```

## robots.ts

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/admin/",
        "/poruke/",
        "/prijava",
        "/registracija",
        "/omiljeni",
        "/checkout/",
        "/onboarding/",
        "/nova-lozinka",
        "/zaboravljena-lozinka",
        "/azuriranja/",
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || "https://petpark.hr"}/sitemap.xml`,
  };
}
```

## sitemap.ts

```ts
import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/db/blog";
import { getTopics } from "@/lib/db/forum";
import { getLostPets } from "@/lib/db/lost-pets";
import {
  shouldIndexSitter,
  shouldIndexGroomer,
  shouldIndexTrainer,
  shouldIndexLostPet,
  shouldIndexAdoptionCard,
} from "@/lib/seo/indexability";
import { appLogger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildLanguageAlternates } from "@/lib/i18n/routing";
import { getProviderTrainers } from "@/lib/db/provider-trainers";
import { getProviderGroomers } from "@/lib/db/provider-groomers";
import { getProviderSitterById } from "@/lib/db/provider-sitters";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://petpark.hr";
const DEFAULT_LAST_MODIFIED = new Date("2026-04-01T00:00:00.000Z");

function toLastModified(
  value: unknown,
  fallback: Date = DEFAULT_LAST_MODIFIED,
): Date {
  if (typeof value === "string" || value instanceof Date) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return fallback;
}

const LOCALIZED_STATIC_ROUTES = new Set([
  "/cuvanje-pasa-zagreb",
  "/cuvanje-pasa-split",
  "/cuvanje-pasa-rijeka",
  "/grooming-zagreb",
  "/veterinari",
  "/njega",
  "/dresura",
  "/dog-friendly",
  "/izgubljeni",
  "/udomljavanje",
  "/uzgajivacnice",
  "/pretraga",
  "/forum",
  "/faq",
  "/verifikacija",
]);

const STATIC_PAGES: Array<{
  route: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { route: "", changeFrequency: "daily", priority: 1 },
  { route: "/pretraga", changeFrequency: "daily", priority: 0.9 },
  { route: "/kontakt", changeFrequency: "monthly", priority: 0.6 },
  { route: "/njega", changeFrequency: "weekly", priority: 0.8 },
  { route: "/dresura", changeFrequency: "weekly", priority: 0.8 },
  { route: "/zajednica", changeFrequency: "weekly", priority: 0.7 },
  { route: "/forum", changeFrequency: "daily", priority: 0.7 },
  { route: "/izgubljeni", changeFrequency: "daily", priority: 0.8 },
  { route: "/privatnost", changeFrequency: "yearly", priority: 0.2 },
  { route: "/uvjeti", changeFrequency: "yearly", priority: 0.2 },
  { route: "/o-nama", changeFrequency: "monthly", priority: 0.5 },
  { route: "/postani-sitter/oglas", changeFrequency: "monthly", priority: 0.6 },
  { route: "/hitno", changeFrequency: "weekly", priority: 0.6 },
  { route: "/faq", changeFrequency: "monthly", priority: 0.5 },
  { route: "/verifikacija", changeFrequency: "monthly", priority: 0.5 },
  { route: "/veterinari", changeFrequency: "weekly", priority: 0.7 },
  { route: "/udomljavanje", changeFrequency: "weekly", priority: 0.7 },
  { route: "/dog-friendly", changeFrequency: "weekly", priority: 0.6 },
  { route: "/uzgajivacnice", changeFrequency: "monthly", priority: 0.4 },
  { route: "/udruge", changeFrequency: "weekly", priority: 0.7 },
  { route: "/apelacije", changeFrequency: "daily", priority: 0.7 },
  // /blog and /grooming are 301-redirected to /zajednica and /njega — excluded from sitemap
  { route: "/cuvanje-pasa-zagreb", changeFrequency: "weekly", priority: 0.7 },
  { route: "/cuvanje-pasa-split", changeFrequency: "weekly", priority: 0.7 },
  { route: "/cuvanje-pasa-rijeka", changeFrequency: "weekly", priority: 0.7 },
  { route: "/grooming-zagreb", changeFrequency: "weekly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(
    ({ route, changeFrequency, priority }) => ({
      url: `${BASE_URL}${route}`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency,
      priority,
      alternates: LOCALIZED_STATIC_ROUTES.has(route)
        ? { languages: buildLanguageAlternates(route) }
        : undefined,
    }),
  );

  const admin = createAdminClient();
  const [providersResult, trainers, groomers, articles, topics, lostPets] =
    await Promise.all([
      admin
        .from("providers")
        .select("id, provider_kind")
        .eq("public_status", "listed")
        .in("provider_kind", ["sitter", "groomer", "trainer"]),
      getProviderTrainers().catch(() => []),
      getProviderGroomers().catch(() => []),
      getArticles().catch(() => []),
      getTopics().catch(() => []),
      getLostPets().catch(() => []),
    ]);

  // Avoid querying future rescue/adoption tables from sitemap until those schemas are deployed.
  // Public hub routes remain indexed via STATIC_PAGES.
  const adoptionListings: Array<Record<string, unknown>> = [];
  const rescueOrganizations: Array<{
    id: string;
    slug: string;
    status: string;
    updated_at?: string;
    created_at?: string;
  }> = [];
  const rescueAppeals: Array<{
    id: string;
    slug: string;
    status: string;
    updated_at?: string;
    created_at?: string;
  }> = [];

  const providerRows = (providersResult.data || []) as Array<{
    id: string;
    provider_kind: string;
  }>;
  const sitterProviderIds = providerRows
    .filter((provider) => provider.provider_kind === "sitter")
    .map((provider) => provider.id);
  const sitterProfiles = (
    await Promise.all(
      sitterProviderIds.map((id) =>
        getProviderSitterById(id).catch(() => null),
      ),
    )
  ).filter(Boolean);

  const sitterEntries: MetadataRoute.Sitemap = sitterProfiles
    .filter((s) => shouldIndexSitter(s as never))
    .map((s) => ({
      url: `${BASE_URL}/sitter/${String(s!.user_id)}`,
      lastModified: toLastModified((s as { created_at?: string }).created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const groomerEntries: MetadataRoute.Sitemap = groomers
    .filter((g) => shouldIndexGroomer(g as never))
    .map((g) => ({
      url: `${BASE_URL}/groomer/${String(g.id)}`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const trainerEntries: MetadataRoute.Sitemap = trainers
    .filter((t) => shouldIndexTrainer(t as never))
    .map((t) => ({
      url: `${BASE_URL}/trener/${String(t.id)}`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const blogEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/blog/${a.slug}`,
    lastModified: toLastModified(
      (a as { updated_at?: string; date?: string; created_at?: string })
        .updated_at ??
        (a as { date?: string }).date ??
        (a as { created_at?: string }).created_at,
    ),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const forumEntries: MetadataRoute.Sitemap = topics.map((t) => ({
    url: `${BASE_URL}/forum/${t.id}`,
    lastModified: toLastModified(
      (
        t as {
          last_reply_at?: string;
          created_at?: string;
          updated_at?: string;
        }
      ).last_reply_at ??
        (t as { updated_at?: string }).updated_at ??
        (t as { created_at?: string }).created_at,
    ),
    changeFrequency: "daily" as const,
    priority: 0.5,
  }));

  // "Found" pets and thin reports are excluded from the sitemap.
  const lostPetEntries: MetadataRoute.Sitemap = lostPets
    .filter(shouldIndexLostPet)
    .map((p) => ({
      url: `${BASE_URL}/izgubljeni/${p.id}`,
      lastModified: toLastModified(
        (p as { updated_at?: string; date_lost?: string; created_at?: string })
          .updated_at ??
          (p as { date_lost?: string }).date_lost ??
          (p as { created_at?: string }).created_at,
      ),
      changeFrequency: "daily" as const,
      priority: 0.6,
      alternates: { languages: buildLanguageAlternates(`/izgubljeni/${p.id}`) },
    }));

  const adoptionEntries: MetadataRoute.Sitemap = adoptionListings
    .filter((a) => shouldIndexAdoptionCard(a as never))
    .map((a) => ({
      url: `${BASE_URL}/udomljavanje/${String(a.id)}`,
      lastModified: toLastModified(
        (a as { updated_at?: string; created_at?: string }).updated_at ??
          (a as { created_at?: string }).created_at,
      ),
      changeFrequency: "weekly" as const,
      priority: 0.6,
      alternates: {
        languages: buildLanguageAlternates(`/udomljavanje/${String(a.id)}`),
      },
    }));

  const rescueOrgEntries: MetadataRoute.Sitemap = rescueOrganizations.map(
    (org) => ({
      url: `${BASE_URL}/udruge/${org.slug}`,
      lastModified: toLastModified(org.updated_at ?? org.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }),
  );

  const rescueAppealEntries: MetadataRoute.Sitemap = rescueAppeals.map(
    (appeal) => ({
      url: `${BASE_URL}/apelacije/${appeal.slug}`,
      lastModified: toLastModified(appeal.updated_at ?? appeal.created_at),
      changeFrequency: "daily" as const,
      priority: 0.6,
    }),
  );

  const all = [
    ...staticEntries,
    ...sitterEntries,
    ...groomerEntries,
    ...trainerEntries,
    ...blogEntries,
    ...forumEntries,
    ...lostPetEntries,
    ...adoptionEntries,
    ...rescueOrgEntries,
    ...rescueAppealEntries,
  ];

  appLogger.info("sitemap.generate", "Sitemap generated", {
    total: all.length,
    static: staticEntries.length,
    sitters: sitterEntries.length,
    groomers: groomerEntries.length,
    trainers: trainerEntries.length,
    articles: blogEntries.length,
    forum: forumEntries.length,
    lostPets: lostPetEntries.length,
    adoption: adoptionEntries.length,
    rescueOrgs: rescueOrgEntries.length,
    rescueAppeals: rescueAppealEntries.length,
  });

  return all;
}
```
