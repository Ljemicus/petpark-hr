import { notFound, redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { getPet } from '@/lib/db';
import { PetPassportClient } from './pet-passport-client';

interface PetPassportPageProps {
  params: Promise<{ id: string }>;
}

export default async function PetPassportPage({ params }: PetPassportPageProps) {
  const user = await getAuthUser();
  if (!user) redirect('/prijava');

  const { id } = await params;
  const pet = await getPet(id);
  if (!pet || pet.owner_id !== user.id) notFound();

  return <PetPassportClient />;
}
