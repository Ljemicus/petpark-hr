'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n';

export function InstantSearch() {
  const router = useRouter();
  const { language } = useLanguage();
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    router.push(`/pretraga?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={language === 'hr' ? 'Pretražite usluge, gradove...' : 'Search services, cities...'}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-11 rounded-full border-0 bg-muted/50 pl-10 pr-10 focus:bg-background focus:ring-2 focus:ring-primary/20"
          aria-label={language === 'hr' ? 'Pretraga PetParka' : 'Search PetPark'}
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            aria-label={language === 'hr' ? 'Očisti pretragu' : 'Clear search'}
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        ) : null}
      </form>
    </div>
  );
}
