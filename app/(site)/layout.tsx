import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { PageTransition } from '@/components/providers/page-transition';
import { ErrorBoundary } from '@/components/providers/error-boundary';
import { BottomNav } from '@/components/shared/bottom-nav';
import { AuthProvider } from '@/contexts/auth-context';
import { CartProvider } from '@/lib/cart-context';
import { CookieConsentProvider } from '@/contexts/cookie-consent-context';
import { LanguageProvider } from '@/lib/i18n';
import { SkipToContentLink } from '@/components/shared/skip-to-content-link';
import { DelayedGlobalUI } from '@/components/providers/delayed-global-ui';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CookieConsentProvider>
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
            <SkipToContentLink />
            <Navbar />
            <main id="main-content" className="flex-1">
              <ErrorBoundary>
                <PageTransition>{children}</PageTransition>
              </ErrorBoundary>
            </main>
            <div className="pb-20 md:pb-0">
              <Footer />
            </div>
            <BottomNav />
            <DelayedGlobalUI />
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </CookieConsentProvider>
  );
}
