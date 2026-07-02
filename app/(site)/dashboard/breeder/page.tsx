import { unstable_noStore as noStore } from 'next/cache';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { DisabledModule } from '@/components/shared/disabled-module';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Uzgajivačnica uskoro — PetPark',
  description: 'Modul za uzgajivače još nije uključen.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BreederDashboardPage() {
  noStore();

  const user = await getAuthUser();
  if (!user) redirect('/prijava?returnTo=/dashboard/breeder');

  return (
    <DisabledModule
      naslov="Uzgajivačnice uskoro"
      opis="Modul za uzgajivače još nije spojen na produkcijsku bazu. Ne prikazujemo demo upite, legla ni statistike."
    />
  );
}
