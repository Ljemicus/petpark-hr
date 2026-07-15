import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { PetParkAction } from './types';
import { PetParkButton } from './pp-button';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryAction?: PetParkAction;
  secondaryAction?: PetParkAction;
  visual?: ReactNode;
  variant?: 'default' | 'colorful' | 'compact' | 'dark';
  className?: string;
};

const variantClasses = {
  default: 'bg-[color:var(--pp-warm-white)] text-[color:var(--pp-ink)]',
  colorful: 'bg-[radial-gradient(circle_at_12%_12%,rgba(255,179,71,.28),transparent_30%),radial-gradient(circle_at_86%_16%,rgba(20,184,166,.20),transparent_30%),linear-gradient(135deg,var(--pp-warm-white),var(--pp-cream))] text-[color:var(--pp-ink)]',
  compact: 'bg-[color:var(--pp-cream)] text-[color:var(--pp-ink)]',
  dark: 'bg-[color:var(--pp-forest-dark)] text-[color:var(--pp-cream)]',
};

export function PageHero({ eyebrow, title, description, primaryAction, secondaryAction, visual, variant = 'default', className }: PageHeroProps) {
  const isDark = variant === 'dark';

  return (
    <section className={cn('relative max-w-full overflow-hidden rounded-[var(--pp-radius-28)] border border-[color:var(--pp-line)] p-5 shadow-[var(--pp-shadow-soft)] sm:rounded-[var(--pp-radius-40)] sm:p-6 md:p-10', variantClasses[variant], className)}>
      <div className="grid min-w-0 max-w-full gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div className="min-w-0 max-w-full space-y-6">
          {eyebrow ? <p className={cn('text-sm font-black uppercase', isDark ? 'text-[color:var(--pp-logo-yellow)]' : 'text-[color:var(--pp-logo-orange)]')}>{eyebrow}</p> : null}
          <div className="min-w-0 max-w-full space-y-4">
            <h1 className="max-w-full break-words font-heading text-4xl font-black leading-[1.04] md:text-6xl">{title}</h1>
            {description ? <p className={cn('max-w-2xl break-words text-base leading-7 md:text-lg md:leading-8', isDark ? 'text-[color:var(--pp-sand)]' : 'text-[color:var(--pp-muted)]')}>{description}</p> : null}
          </div>
          {(primaryAction || secondaryAction) ? (
            <div className="flex min-w-0 max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
              {primaryAction ? <PetParkButton href={primaryAction.href}>{primaryAction.label}</PetParkButton> : null}
              {secondaryAction ? <PetParkButton href={secondaryAction.href} variant={isDark ? 'accent' : 'secondary'}>{secondaryAction.label}</PetParkButton> : null}
            </div>
          ) : null}
        </div>
        {visual ? <div className="hidden min-w-0 max-w-full overflow-hidden rounded-[var(--pp-radius-32)] bg-white/35 p-4 shadow-[var(--pp-shadow-card)] md:block">{visual}</div> : null}
      </div>
    </section>
  );
}
