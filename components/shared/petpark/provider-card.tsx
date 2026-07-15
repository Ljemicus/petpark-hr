import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { PetParkCategory } from './types';
import { categoryStyles } from './types';
import { PetParkBadge } from './pp-badge';
import { PriceRange } from './price-range';
import { RatingSummary } from './rating-summary';

type ProviderCardProps = {
  name: string;
  city?: string;
  imageUrl?: string | null;
  description?: string;
  serviceTags?: string[];
  verified?: boolean;
  isNew?: boolean;
  rating?: number | null;
  reviewCount?: number | null;
  priceFrom?: number | string | null;
  href: string;
  availabilityLabel?: string;
  category: Extract<PetParkCategory, 'sitter' | 'grooming' | 'trainer' | 'vet' | 'breeder'>;
  className?: string;
};

export function ProviderCard({
  name,
  city,
  imageUrl,
  description,
  serviceTags = [],
  verified,
  isNew,
  rating,
  reviewCount,
  priceFrom,
  href,
  availabilityLabel,
  category,
  className,
}: ProviderCardProps) {
  const styles = categoryStyles[category];

  return (
    <Link
      href={href}
      prefetch={false}
      className={cn('group grid min-w-0 max-w-full overflow-hidden rounded-[var(--pp-radius-28)] border border-[color:var(--pp-line)] bg-[color:var(--pp-surface)] shadow-[var(--pp-shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--pp-logo-teal)]/35 hover:bg-[color:var(--pp-warm-white)] hover:shadow-[var(--pp-shadow-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--pp-logo-teal)] sm:grid-cols-[180px_1fr] sm:rounded-[var(--pp-radius-32)]', className)}
    >
      <div className={cn('relative min-h-44 overflow-hidden bg-cover bg-center', styles.bg)} style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined} aria-label={imageUrl ? `${name} fotografija` : undefined}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,.42),transparent_36%)]" />
        {!imageUrl ? <div className={cn('relative flex h-full min-h-44 items-center justify-center text-4xl transition duration-300 group-hover:scale-105', styles.accent)} aria-hidden="true">🐾</div> : null}
      </div>
      <div className="min-w-0 space-y-4 p-4 sm:p-5">
        <div className="flex min-w-0 flex-wrap gap-2">
          {verified ? <PetParkBadge variant="verified">Verificirano</PetParkBadge> : null}
          {isNew || !reviewCount ? <PetParkBadge variant="new">Novo na PetParku</PetParkBadge> : null}
          {availabilityLabel ? <PetParkBadge variant="available">{availabilityLabel}</PetParkBadge> : null}
        </div>
        <div>
          <h3 className="break-words font-heading text-[1.65rem] font-black leading-tight text-[color:var(--pp-ink)] sm:text-2xl">{name}</h3>
          {city ? <p className="text-sm font-bold text-[color:var(--pp-muted)]">{city}</p> : null}
        </div>
        {description ? <p className="line-clamp-2 break-words leading-7 text-[color:var(--pp-muted)]">{description}</p> : null}
        {serviceTags.length ? (
          <div className="flex min-w-0 flex-wrap gap-2">
            {serviceTags.slice(0, 4).map((tag) => <PetParkBadge key={tag} variant={category}>{tag}</PetParkBadge>)}
          </div>
        ) : null}
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-t border-[color:var(--pp-line)] pt-4">
          <RatingSummary rating={rating} reviewCount={reviewCount} />
          <PriceRange priceFrom={priceFrom} />
        </div>
      </div>
    </Link>
  );
}
