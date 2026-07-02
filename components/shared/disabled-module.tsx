import type { ReactNode } from 'react';
import { Clock3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DisabledModuleProps {
  naslov?: string;
  opis?: string;
  ikona?: ReactNode;
}

export function DisabledModule({
  naslov = 'Uskoro',
  opis = 'Radimo na tome. Hvala na strpljenju.',
  ikona,
}: DisabledModuleProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 py-16">
      <Card className="w-full border-orange-100 bg-white/90 text-center shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 px-6 py-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            {ikona ?? <Clock3 className="h-7 w-7" aria-hidden="true" />}
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground">{naslov}</h1>
            <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground">{opis}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
