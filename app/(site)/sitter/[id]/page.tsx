import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { robotsMeta, shouldIndexSitter } from '@/lib/seo/indexability';
import type { SitterProfile } from '@/lib/types';
import { getProviderSitterById } from '@/lib/db/provider-sitters';
import { sanitizeSitterProfile } from '@/lib/public/provider-profile-sanitizers';
import { SitterProfileLoader } from './sitter-profile-loader';

interface SitterPageProps {
  params: Promise<{ id: string }>;
}

async function createSitterShell(id: string): Promise<SitterProfile & { user: NonNullable<SitterProfile['user']> }> {
  const profile = await getProviderSitterById(id);
  if (profile) return profile as SitterProfile & { user: NonNullable<SitterProfile['user']> };

  notFound();
}

export async function generateMetadata({ params }: SitterPageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await createSitterShell(id);
  const publicProfile = sanitizeSitterProfile(profile, id)!;
  return {
    title: { absolute: `${publicProfile.name}` },
    description: publicProfile.safeBio || 'Profil sittera na PetParku.',
    alternates: { canonical: `/sitter/${id}` },
    robots: robotsMeta(shouldIndexSitter(profile)),
  };
}

export default async function SitterPage({ params }: SitterPageProps) {
  const { id } = await params;
  const profile = await createSitterShell(id);
  const publicProfile = sanitizeSitterProfile(profile, id)!;

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Pretraga sittera', href: '/pretraga' },
        { label: publicProfile.name, href: `/sitter/${id}` },
      ]} />
      <SitterProfileLoader id={id} initialProfile={publicProfile} />
    </>
  );
}
