'use client';

import type { FormEvent } from 'react';
import { cn } from '@/lib/utils';
import { PetParkButton } from './pp-button';

type SearchFilterBarProps = {
  service?: string;
  city?: string;
  date?: string;
  petType?: string;
  query?: string;
  submitLabel?: string;
  action?: string;
  method?: 'get' | 'post';
  popularCities?: string[];
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onPopularCityClick?: (city: string) => void;
  className?: string;
};

export function SearchFilterBar({ service, city, date, petType, query, submitLabel = 'Pretraži', action, method = 'get', popularCities = [], onSubmit, onPopularCityClick, className }: SearchFilterBarProps) {
  return (
    <form action={action} method={method} onSubmit={onSubmit} className={cn('min-w-0 max-w-full overflow-x-clip rounded-[var(--pp-radius-28)] border border-[color:var(--pp-line)] bg-[color:var(--pp-surface)] p-4 shadow-[var(--pp-shadow-card)] sm:rounded-[var(--pp-radius-32)]', className)}>
      <div className="grid min-w-0 gap-3 md:grid-cols-5">
        <label className="min-w-0 space-y-1 text-sm font-bold text-[color:var(--pp-muted)]">
          Usluga
          <input name="service" defaultValue={service} className="w-full rounded-[var(--pp-radius-16)] border border-[color:var(--pp-line)] bg-[color:var(--pp-warm-white)] px-3 py-2.5 text-[color:var(--pp-ink)] outline-none transition focus:border-[color:var(--pp-logo-teal)] focus:ring-2 focus:ring-[color:var(--pp-logo-teal)]/25" />
        </label>
        <label className="min-w-0 space-y-1 text-sm font-bold text-[color:var(--pp-muted)]">
          Grad
          <input name="city" defaultValue={city} className="w-full rounded-[var(--pp-radius-16)] border border-[color:var(--pp-line)] bg-[color:var(--pp-warm-white)] px-3 py-2.5 text-[color:var(--pp-ink)] outline-none transition focus:border-[color:var(--pp-logo-teal)] focus:ring-2 focus:ring-[color:var(--pp-logo-teal)]/25" />
        </label>
        <label className="min-w-0 space-y-1 text-sm font-bold text-[color:var(--pp-muted)]">
          Datum
          <input name="date" defaultValue={date} className="w-full rounded-[var(--pp-radius-16)] border border-[color:var(--pp-line)] bg-[color:var(--pp-warm-white)] px-3 py-2.5 text-[color:var(--pp-ink)] outline-none transition focus:border-[color:var(--pp-logo-teal)] focus:ring-2 focus:ring-[color:var(--pp-logo-teal)]/25" />
        </label>
        <label className="min-w-0 space-y-1 text-sm font-bold text-[color:var(--pp-muted)]">
          Ljubimac
          <input name="petType" defaultValue={petType} className="w-full rounded-[var(--pp-radius-16)] border border-[color:var(--pp-line)] bg-[color:var(--pp-warm-white)] px-3 py-2.5 text-[color:var(--pp-ink)] outline-none transition focus:border-[color:var(--pp-logo-teal)] focus:ring-2 focus:ring-[color:var(--pp-logo-teal)]/25" />
        </label>
        <label className="min-w-0 space-y-1 text-sm font-bold text-[color:var(--pp-muted)]">
          Pojam
          <input name="query" defaultValue={query} className="w-full rounded-[var(--pp-radius-16)] border border-[color:var(--pp-line)] bg-[color:var(--pp-warm-white)] px-3 py-2.5 text-[color:var(--pp-ink)] outline-none transition focus:border-[color:var(--pp-logo-teal)] focus:ring-2 focus:ring-[color:var(--pp-logo-teal)]/25" />
        </label>
      </div>
      <div className="mt-4 flex min-w-0 flex-col items-stretch justify-between gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex min-w-0 flex-wrap gap-2">
          {popularCities.map((popularCity) => (
            <button key={popularCity} type="button" onClick={() => onPopularCityClick?.(popularCity)} className="rounded-[14px] bg-[color:var(--pp-cream)] px-3 py-1.5 text-xs font-extrabold text-[color:var(--pp-muted)] transition hover:-translate-y-0.5 hover:bg-[color:var(--pp-warm-white)] hover:text-[color:var(--pp-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--pp-logo-teal)]">
              {popularCity}
            </button>
          ))}
        </div>
        <PetParkButton type="submit">{submitLabel}</PetParkButton>
      </div>
    </form>
  );
}
