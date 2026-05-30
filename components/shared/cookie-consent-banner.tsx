"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ChevronDown, ChevronUp, Shield, BarChart3, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCookieConsent } from "@/contexts/cookie-consent-context";

// Routes where the banner must never obscure primary content. On these pages
// the collapsed banner is rendered as a slim, low-height bar.
const CRITICAL_ROUTES = ["/hitno", "/hitna-pomoc", "/veterinari", "/izgubljeni"];

export function CookieConsentBanner() {
  const { showBanner, acceptAll, acceptNecessaryOnly, acceptSelected, isLoaded } = useCookieConsent();
  const pathname = usePathname() || "";
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  });

  if (!isLoaded || !showBanner) return null;

  const isCritical = CRITICAL_ROUTES.some((r) => pathname.startsWith(r));

  const handleAcceptSelected = () => {
    acceptSelected(preferences);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 md:p-6 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
          role="dialog"
          aria-label="Postavke kolačića"
        >
          <div className="mx-auto max-w-4xl">
            {/*
              Mobile: compact bottom sheet. Collapsed banner is capped so it
              never exceeds ~28% of the viewport; when expanded it is scrollable
              instead of growing past the screen. Desktop keeps the roomy layout.
            */}
            <div
              className={[
                "rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col",
                isExpanded
                  ? "max-h-[80vh] sm:max-h-none"
                  : isCritical
                    ? "max-h-[22vh] sm:max-h-none"
                    : "max-h-[28vh] sm:max-h-none",
              ].join(" ")}
            >
              {/* Header — compact on mobile */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 sm:px-6 sm:py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Cookie className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base leading-tight">Kolačići</h3>
                    <p className="hidden sm:block text-sm text-white/80">Vaša privatnost je važna</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  aria-label={isExpanded ? "Smanji" : "Proširi"}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                </button>
              </div>

              {/* Content — scrolls within the capped sheet rather than overflowing */}
              <div className="p-4 sm:p-6 overflow-y-auto">
                {/* Short copy on mobile; full copy from sm: up */}
                <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                  <span className="sm:hidden">
                    Koristimo kolačiće za bolje iskustvo. Neophodni su obavezni; analitiku i marketing možete odbiti.
                  </span>
                  <span className="hidden sm:inline">
                    Koristimo kolačiće za poboljšanje vašeg iskustva. Neophodni kolačići su obavezni za rad stranice.
                    Analitički kolačići nam pomažu razumjeti kako koristite stranicu. Marketinški kolačići koriste se za personalizirane oglase.
                  </span>
                </p>

                {/* Expandable Preferences */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100">
                        {/* Necessary - Always On */}
                        <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Shield className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">Neophodni</h4>
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                                Uvijek uključeno
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Ovi kolačići su neophodni za funkcioniranje stranice i ne mogu se isključiti.
                              Uključuju autentikaciju i sigurnosne funkcije.
                            </p>
                          </div>
                        </div>

                        {/* Analytics */}
                        <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">Analitika</h4>
                              <Switch
                                checked={preferences.analytics}
                                onCheckedChange={(checked) =>
                                  setPreferences((prev) => ({ ...prev, analytics: checked }))
                                }
                              />
                            </div>
                            <p className="text-sm text-gray-600">
                              Pomažu nam razumjeti kako posjetitelji koriste našu stranicu.
                              Koristimo Plausible Analytics koji poštuje privatnost.
                            </p>
                          </div>
                        </div>

                        {/* Marketing */}
                        <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <Megaphone className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">Marketing</h4>
                              <Switch
                                checked={preferences.marketing}
                                onCheckedChange={(checked) =>
                                  setPreferences((prev) => ({ ...prev, marketing: checked }))
                                }
                              />
                            </div>
                            <p className="text-sm text-gray-600">
                              Koriste se za prikaz relevantnih oglasa i praćenje učinkovitosti marketinških kampanja.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Buttons — primary actions always reachable */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    onClick={acceptAll}
                    className="flex-1 bg-warm-orange hover:bg-warm-orange/90 text-white"
                  >
                    Prihvati sve
                  </Button>
                  {isExpanded ? (
                    <Button
                      onClick={handleAcceptSelected}
                      variant="outline"
                      className="flex-1 border-warm-orange text-warm-orange hover:bg-warm-orange/5"
                    >
                      Spremi preference
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsExpanded(true)}
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Postavke
                    </Button>
                  )}
                  <Button
                    onClick={acceptNecessaryOnly}
                    variant="ghost"
                    className="flex-1 text-gray-600 hover:text-gray-900"
                  >
                    Samo neophodni
                  </Button>
                </div>

                {/* Privacy Link — hidden on mobile to save vertical space */}
                <p className="hidden sm:block text-center text-sm text-gray-500 mt-4">
                  Više informacija u našoj{" "}
                  <a href="/privatnost" className="text-warm-orange hover:underline font-medium">
                    Politici privatnosti
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Compact button for footer/settings
export function CookieSettingsButton({ className }: { className?: string }) {
  const { openBanner } = useCookieConsent();

  return (
    <button
      onClick={openBanner}
      className={`inline-flex items-center gap-2 text-sm text-gray-600 hover:text-warm-orange transition-colors ${className}`}
    >
      <Cookie className="h-4 w-4" />
      Postavke kolačića
    </button>
  );
}
