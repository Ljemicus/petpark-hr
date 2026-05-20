'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const PerformanceMonitor = dynamic(
  () => import('@/components/providers/performance-monitor').then((mod) => mod.PerformanceMonitor),
  { ssr: false }
);

const DeferredUI = dynamic(
  () => import('@/components/shared/deferred-ui').then((mod) => mod.DeferredUI),
  { ssr: false }
);

const CookieConsentBanner = dynamic(
  () => import('@/components/shared/cookie-consent-banner').then((mod) => mod.CookieConsentBanner),
  { ssr: false }
);

const AccountChatWidget = dynamic(
  () => import('@/components/chat/chat-widget').then((mod) => mod.ChatWidget),
  { ssr: false }
);

const WebVitals = dynamic(
  () => import('@/components/monitoring/web-vitals').then((mod) => mod.WebVitals),
  { ssr: false }
);

function registerServiceWorkerWhenIdle() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker
    .register('/sw.js')
    .then((reg) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[SW] Registered:', reg.scope);
      }
    })
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('[SW] Registration failed:', err);
      }
    });
}

export function DelayedGlobalUI() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setReady(true), 2500);
    let idleId: number | undefined;

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(
        () => {
          window.clearTimeout(timeoutId);
          setReady(true);
        },
        { timeout: 2500 }
      );
    }

    return () => {
      window.clearTimeout(timeoutId);
      if (idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const timeoutId = window.setTimeout(registerServiceWorkerWhenIdle, 1000);
    return () => window.clearTimeout(timeoutId);
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <WebVitals />
      <PerformanceMonitor />
      <DeferredUI />
      <CookieConsentBanner />
      <AccountChatWidget />
    </>
  );
}
