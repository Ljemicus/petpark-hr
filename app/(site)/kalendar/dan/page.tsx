import type { Metadata } from 'next';
import { GroomerDaySchedulePage } from '@/components/shared/petpark/groomer-day-schedule-page';

export const metadata: Metadata = {
  title: 'Dnevni raspored',
  description: 'Dnevni raspored grooming rezervacija, timeline, narudžbe i priprema za PetPark pružatelje usluga.',
};

export default function KalendarDanPage() {
  return <GroomerDaySchedulePage />;
}
