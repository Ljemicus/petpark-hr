'use client';

import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { usePushNotifications } from '@/lib/push-client';
import { toast } from 'sonner';

export function PushNotificationPrompt() {
  const { user } = useAuth();
  const { isSupported, isSubscribed, permission, isLoading, subscribe } = usePushNotifications();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user || !isSupported || isSubscribed || permission !== 'default') return;

    const dismissed = localStorage.getItem('push-notification-dismissed');
    if (dismissed) return;

    const timer = window.setTimeout(() => setShow(true), 3000);
    return () => window.clearTimeout(timer);
  }, [user, isSupported, isSubscribed, permission]);

  const handleSubscribe = async () => {
    const subscribed = await subscribe();
    if (subscribed) {
      localStorage.setItem('push-notification-dismissed', 'true');
      toast.success('Obavijesti su uključene!');
      setShow(false);
      return;
    }

    toast.info('Obavijesti nisu uključene. Provjerite dozvolu preglednika ili VAPID konfiguraciju.');
    setShow(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('push-notification-dismissed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm animate-fade-in-up">
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
            <Bell className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Uključite obavijesti</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Primajte obavijesti o novim porukama, rezervacijama i ažuriranjima o vašem ljubimcu.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleSubscribe}
                disabled={isLoading}
                className="h-8 bg-orange-500 text-xs text-white hover:bg-orange-600"
              >
                {isLoading ? 'Uključujem...' : 'Uključi'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="h-8 text-xs text-gray-500"
              >
                Ne sada
              </Button>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600" aria-label="Zatvori obavijesti">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
