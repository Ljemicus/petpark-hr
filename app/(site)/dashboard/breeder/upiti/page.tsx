import { unstable_noStore as noStore } from 'next/cache';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { DisabledModule } from '@/components/shared/disabled-module';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Upiti uzgajivačnice uskoro — PetPark',
  description: 'Upiti za uzgajivačnice još nisu uključeni.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BreederInquiriesPage() {
  noStore();

  const user = await getAuthUser();
  if (!user) redirect('/prijava?returnTo=/dashboard/breeder/upiti');

  return (
    <DisabledModule
      naslov="Upiti uzgajivačnice uskoro"
      opis="Ova površina još nema produkcijsku schemu ni stvarne upite. Demo poruke su uklonjene."
    />
  );
}
