import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { robotsMeta, shouldIndexTrainer } from '@/lib/seo/indexability';
import type { Trainer } from '@/lib/types';
import { getProviderTrainerById } from '@/lib/db/provider-trainers';
import { sanitizeTrainerProfile } from '@/lib/public/provider-profile-sanitizers';
import { TrainerProfileLoader } from './trainer-profile-loader';

interface TrainerPageProps {
  params: Promise<{ id: string }>;
}

async function createTrainerShell(id: string): Promise<Trainer> {
  const trainer = await getProviderTrainerById(id);
  if (trainer) return trainer;

  notFound();
}

export async function generateMetadata({ params }: TrainerPageProps): Promise<Metadata> {
  const { id } = await params;
  const trainer = await createTrainerShell(id);
  const publicTrainer = sanitizeTrainerProfile(trainer)!;
  return {
    title: { absolute: `${publicTrainer.name}` },
    description: publicTrainer.safeBio || 'Profil trenera na PetParku.',
    alternates: { canonical: `/trener/${id}` },
    robots: robotsMeta(shouldIndexTrainer(trainer)),
  };
}

export default async function TrainerPage({ params }: TrainerPageProps) {
  const { id } = await params;
  const trainer = await createTrainerShell(id);
  const publicTrainer = sanitizeTrainerProfile(trainer)!;

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Školovanje pasa', href: '/dresura' },
        { label: publicTrainer.name, href: `/trener/${id}` },
      ]} />
      <TrainerProfileLoader id={id} initialTrainer={publicTrainer} />
    </>
  );
}
