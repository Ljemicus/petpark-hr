import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { PetParkCategory } from './types';
import { categoryStyles } from './types';
import { PetParkBadge } from './pp-badge';

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
  category: PetParkCategory;
  statusLabel?: string;
  icon?: ReactNode;
  ctaLabel?: string;
  disabled?: boolean;
  className?: string;
};

export function ServiceCard({ title, description, href, category, statusLabel, icon, ctaLabel = 'Saznaj više', disabled = false, className }: ServiceCardProps) {
  const styles = categoryStyles[category];
  const content = (
    <>
      <div className={cn('mb-5 flex h-14 w-14 items-center justify-center rounded-[var(--pp-radius-20)] text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,.72),0_10px_18px_rgba(76,56,31,.055)] transition duration-300 group-hover:scale-105', styles.bg, styles.accent)} aria-hidden={!icon}>
        {icon ?? '🐾'}
      </div>
      <div className="min-w-0 space-y-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h3 className="min-w-0 break-words font-heading text-[1.65rem] font-black leading-tight text-[color:var(--pp-ink)] sm:text-2xl">{title}</h3>
          {statusLabel ? <PetParkBadge variant={category === 'lost' ? 'urgent' : 'available'}>{statusLabel}</PetParkBadge> : null}
        </div>
        <p className="break-words leading-7 text-[color:var(--pp-muted)]">{description}</p>
        <span className={cn('inline-flex text-sm font-extrabold transition group-hover:translate-x-1', styles.accent)}>{ctaLabel}{disabled ? null : ' →'}</span>
      </div>
    </>
  );

  const baseClassName = cn(
    'block min-w-0 max-w-full overflow-hidden rounded-[var(--pp-radius-28)] border border-[color:var(--pp-line)] bg-[color:var(--pp-surface)] p-4 shadow-[var(--pp-shadow-card)] transition duration-300 sm:rounded-[var(--pp-radius-32)] sm:p-5',
    disabled
      ? 'cursor-default'
      : 'group hover:-translate-y-1 hover:border-[color:var(--pp-logo-teal)]/35 hover:bg-[color:var(--pp-warm-white)] hover:shadow-[var(--pp-shadow-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--pp-logo-teal)]',
    className
  );

  if (disabled) {
    return (
      <article className={baseClassName}>
        {content}
      </article>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className={baseClassName}
    >
      {content}
    </Link>
  );
}
