import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { robotsMeta, shouldIndexGroomer } from '@/lib/seo/indexability';
import type { Groomer } from '@/lib/types';
import { getProviderGroomerById } from '@/lib/db/provider-groomers';
import { sanitizeGroomerProfile } from '@/lib/public/provider-profile-sanitizers';
import { GroomerProfileLoader } from './groomer-profile-loader';

interface GroomerPageProps {
  params: Promise<{ id: string }>;
}

async function createGroomerShell(id: string): Promise<Groomer> {
  const groomer = await getProviderGroomerById(id);
  if (groomer) return groomer;

  notFound();
}

export async function generateMetadata({ params }: GroomerPageProps): Promise<Metadata> {
  const { id } = await params;
  const groomer = await createGroomerShell(id);
  const publicGroomer = sanitizeGroomerProfile(groomer)!;
  return {
    title: { absolute: `${publicGroomer.name}` },
    description: publicGroomer.safeBio || 'Profil groomera na PetParku.',
    alternates: { canonical: `/groomer/${id}` },
    robots: robotsMeta(shouldIndexGroomer(groomer)),
  };
}

export default async function GroomerPage({ params }: GroomerPageProps) {
  const { id } = await params;
  const groomer = await createGroomerShell(id);
  const publicGroomer = sanitizeGroomerProfile(groomer)!;

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Grooming', href: '/njega' },
        { label: publicGroomer.name, href: `/groomer/${id}` },
      ]} />
      <GroomerProfileLoader id={id} initialGroomer={publicGroomer} />
    </>
  );
}
