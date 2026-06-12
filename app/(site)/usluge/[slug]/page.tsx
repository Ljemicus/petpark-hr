import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanitizeServiceDescription, ServiceDetailPage } from '@/components/shared/petpark/service-detail';
import { getPublicServiceListingBySlug } from '@/lib/db/service-listings';

const fallbackMetadata: Metadata = {
  title: 'Čuvanje psa u kućnom okruženju',
  description: 'Detalji PetPark usluge čuvanja psa, dostupnost, cijena, recenzije i rezervacija.',
};

type UslugeDetailPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: UslugeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublicServiceListingBySlug(slug);

  if (!service) return fallbackMetadata;

  const title = service.title;
  const description = sanitizeServiceDescription(service.description || service.detailDescription || `${service.title} — ${service.provider}, ${service.location}.`).slice(0, 155);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/usluge/${service.slug}`,
      siteName: 'PetPark',
    },
    alternates: { canonical: `/usluge/${service.slug}` },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function UslugeDetailPage({ params }: UslugeDetailPageProps) {
  const { slug } = await params;
  const service = await getPublicServiceListingBySlug(slug);

  if (!service && slug !== 'cuvanje-psa-u-kucnom-okruzenju') {
    notFound();
  }

  return <ServiceDetailPage service={service || undefined} />;
}
