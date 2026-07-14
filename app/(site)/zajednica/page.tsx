export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Camera,
  CheckCircle2,
  HeartHandshake,
  MessageCircle,
  PawPrint,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
} from 'lucide-react';
import {
  AppHeader,
  Badge,
  ButtonLink,
  Card,
  LeafDecoration,
  PawDecoration,
} from '@/components/shared/petpark/design-foundation';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: { absolute: 'Zajednica ljubitelja ljubimaca' },
  description: 'PetPark zajednica okuplja vlasnike, sittere, groomere, trenere i sve ljubitelje ljubimaca na jednom mjestu.',
  alternates: {
    canonical: 'https://petpark.hr/zajednica',
  },
};

const navItems = [
  { href: '/usluge', label: 'Usluge' },
  { href: '/pretraga', label: 'Pretraga' },
  { href: '/forum', label: 'Forum' },
  { href: '/blog', label: 'Blog' },
  { href: '/izgubljeni', label: 'Izgubljeni' },
];

const tabs = [
  { label: 'Sve', href: '/zajednica', icon: Sparkles, active: true },
  { label: 'Forum', href: '/forum', icon: MessageCircle },
  { label: 'Izgubljeni / pronađeni', href: '/izgubljeni', icon: Bell },
  { label: 'Udomljavanje', href: '/udomljavanje', icon: HeartHandshake },
  { label: 'Savjeti', href: '/blog', icon: BookOpen },
];

const communityModules = [
  {
    title: 'Forum',
    category: 'Rasprave',
    excerpt: 'Pitanja, iskustva i savjeti vlasnika ljubimaca. Objave se prikazuju iz stvarnog forum modula.',
    href: '/forum',
    tone: 'teal' as const,
    icon: MessageCircle,
  },
  {
    title: 'Izgubljeni / pronađeni',
    category: 'Sigurnost',
    excerpt: 'Prijave nestalih i pronađenih ljubimaca. Ovdje ne glumimo hitne slučajeve — vodi na stvarni modul.',
    href: '/izgubljeni',
    tone: 'orange' as const,
    icon: Bell,
  },
  {
    title: 'Udomljavanje',
    category: 'Dom za ljubimce',
    excerpt: 'Pregled stvarnih oglasa za udomljavanje kad su dostupni, bez izmišljenih profila i lažnih upita.',
    href: '/udomljavanje',
    tone: 'sage' as const,
    icon: HeartHandshake,
  },
  {
    title: 'Savjeti',
    category: 'PetPark vodiči',
    excerpt: 'Članci i checklistovi iz PetPark bloga, od prvog čuvanja do pripreme za šetnju ili grooming.',
    href: '/blog',
    tone: 'cream' as const,
    icon: BookOpen,
  },
];

const popularTopics = ['prvo čuvanje', 'socijalizacija šteneta', 'grooming preporuke', 'izgubljeni ljubimci', 'udomljavanje mačke'];

function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: typeof PawPrint }) {
  return (
    <Card radius="24" tone="sage" shadow="small" className="p-5">
      <Icon className="size-5 text-[color:var(--pp-color-orange-primary)]" aria-hidden />
      <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-[color:var(--pp-color-forest-text)]">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--pp-color-muted-text)]">{label}</p>
    </Card>
  );
}

function ModuleCard({ module }: { module: (typeof communityModules)[number] }) {
  return (
    <Link href={module.href} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--pp-color-teal-accent)] focus-visible:ring-offset-2">
      <Card radius="28" tone={module.tone} interactive className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-[var(--pp-radius-control)] bg-[color:var(--pp-color-card-surface)] shadow-[var(--pp-shadow-small-card)]">
            <module.icon className="size-6 text-[color:var(--pp-color-orange-primary)]" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-black text-[color:var(--pp-color-forest-text)]">{module.title}</p>
              <Badge variant="teal">{module.category}</Badge>
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-[color:var(--pp-color-muted-text)]">{module.excerpt}</p>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[color:var(--pp-color-orange-primary)] group-hover:text-[color:var(--pp-color-forest-text)]">Otvori modul →</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function SidebarCard({ title, icon: Icon, children, tone = 'default' }: { title: string; icon: typeof PawPrint; children: React.ReactNode; tone?: 'default' | 'sage' | 'cream' | 'teal' | 'orange' }) {
  return (
    <Card radius="28" tone={tone} className="p-5">
      <h2 className="flex items-center gap-2 text-lg font-black tracking-[-0.03em] text-[color:var(--pp-color-forest-text)]">
        <Icon className="size-5 text-[color:var(--pp-color-orange-primary)]" aria-hidden />
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

export default function ZajednicaPage() {
  return (
    <main data-petpark-route="zajednica" className="min-h-screen overflow-hidden bg-[color:var(--pp-color-cream-background)] text-[color:var(--pp-color-forest-text)]">
      <AppHeader navItems={navItems} actions={<ButtonLink href="/zajednica/feed" size="sm"><PlusCircle className="size-4" /> Nova objava</ButtonLink>} />

      <section className="relative px-5 pb-12 pt-10 sm:px-8 lg:px-20">
        <LeafDecoration className="-right-12 top-24 hidden rotate-12 lg:block" />
        <LeafDecoration className="-left-16 top-[760px] hidden scale-110 -rotate-12 lg:block" />
        <PawDecoration className="right-[12%] top-[360px] hidden size-16 rotate-12 opacity-40 xl:block" />

        <div className="mx-auto max-w-[1500px] space-y-6">
          <Card radius="28" className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="absolute right-8 top-8 hidden size-32 rounded-full bg-[color:var(--pp-color-warning-surface)] lg:block" />
            <div className="relative grid gap-8 xl:grid-cols-[1fr_430px] xl:items-end">
              <div>
                <Badge variant="orange"><UsersRound className="size-3" /> PetPark Community</Badge>
                <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-[-0.06em] text-[color:var(--pp-color-forest-text)] sm:text-7xl lg:text-8xl">PetPark zajednica</h1>
                <p className="mt-6 max-w-3xl text-base font-semibold leading-7 text-[color:var(--pp-color-muted-text)] sm:text-lg">
                  Savjeti, objave, izgubljeni ljubimci, udomljavanje i iskustva vlasnika — sve na jednom toplom mjestu.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <ButtonLink href="/zajednica/feed" size="lg"><PlusCircle className="size-5" /> Nova objava</ButtonLink>
                  <ButtonLink href="/izgubljeni/prijavi" variant="secondary" size="lg"><Bell className="size-5" /> Prijavi nestanak</ButtonLink>
                  <ButtonLink href="/blog" variant="teal" size="lg"><BookOpen className="size-5" /> Čitaj savjete</ButtonLink>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <StatCard value="20+" label="savjeta" icon={BookOpen} />
                <StatCard value="4" label="ulaza" icon={Sparkles} />
                <StatCard value="24/7" label="pomoć" icon={HeartHandshake} />
              </div>
            </div>
          </Card>

          <Card radius="24" className="p-3">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map((tab) => (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 rounded-[var(--pp-radius-control)] px-4 py-3 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--pp-color-teal-accent)]',
                    tab.active
                      ? 'bg-[color:var(--pp-color-orange-primary)] text-white shadow-[var(--pp-shadow-small-card)]'
                      : 'text-[color:var(--pp-color-muted-text)] hover:bg-[color:var(--pp-color-sage-surface)] hover:text-[color:var(--pp-color-forest-text)]',
                  )}
                >
                  <tab.icon className="size-4" aria-hidden />
                  {tab.label}
                </Link>
              ))}
            </div>
          </Card>

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <div className="flex flex-col gap-3 rounded-[var(--pp-radius-card-24)] border border-[color:var(--pp-color-warm-border)] bg-[color:var(--pp-color-card-surface)] p-5 shadow-[var(--pp-shadow-small-card)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[color:var(--pp-color-muted-text)]">Aktualno u zajednici</p>
                  <h2 className="mt-1 text-3xl font-black tracking-[-0.04em] text-[color:var(--pp-color-forest-text)]">Objave i preporuke</h2>
                </div>
                <ButtonLink href="/pretraga?category=zajednica" variant="secondary" size="sm"><Search className="size-4" /> Pretraži</ButtonLink>
              </div>

              {communityModules.map((module) => <ModuleCard key={module.title} module={module} />)}

              <Card radius="28" tone="sage" className="p-8 text-center">
                <Camera className="mx-auto size-12 text-[color:var(--pp-color-orange-primary)]" aria-hidden />
                <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-[color:var(--pp-color-forest-text)]">Feed zajednice se puni postupno.</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-6 text-[color:var(--pp-color-muted-text)]">
                  Ovaj pregled sada vodi na module koji postoje. Stvarne objave, komentari i spremanja žive u feedu kad ih korisnici kreiraju.
                </p>
                <ButtonLink href="/zajednica/feed" className="mt-6" variant="secondary">Pogledaj feed</ButtonLink>
              </Card>
            </div>

            <aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
              <SidebarCard title="Popularne teme" icon={Star}>
                <div className="flex flex-wrap gap-2">
                  {popularTopics.map((topic) => <Badge key={topic} variant="sage">#{topic}</Badge>)}
                </div>
              </SidebarCard>

              <SidebarCard title="Status zajednice" icon={UsersRound} tone="sage">
                <div className="rounded-[var(--pp-radius-control)] bg-[color:var(--pp-color-card-surface)] p-4">
                  <p className="text-sm font-black text-[color:var(--pp-color-forest-text)]">Bez lažnih aktivnih članova</p>
                  <p className="mt-2 text-xs font-bold leading-5 text-[color:var(--pp-color-muted-text)]">Kad stvarni feed dobije korisničke objave, ovdje možemo prikazati stvarnu aktivnost iz baze.</p>
                </div>
              </SidebarCard>

              <SidebarCard title="Pravila zajednice" icon={ShieldCheck} tone="cream">
                <ul className="space-y-3 text-sm font-semibold leading-6 text-[color:var(--pp-color-muted-text)]">
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[color:var(--pp-color-success)]" /> Budite konkretni i pristojni.</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[color:var(--pp-color-success)]" /> Ne dijelite tuđe podatke bez dopuštenja.</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[color:var(--pp-color-success)]" /> Hitne slučajeve prvo rješavajte s veterinarom ili policijom.</li>
                </ul>
              </SidebarCard>

              <SidebarCard title="Hitna pomoć zajednice" icon={AlertTriangle} tone="orange">
                <p className="text-sm font-semibold leading-6 text-[color:var(--pp-color-muted-text)]">Za izgubljenog ljubimca odmah pripremite sliku, lokaciju, kontakt i zadnje vrijeme viđenja.</p>
                <ButtonLink href="/izgubljeni/prijavi" className="mt-5 w-full" variant="primary"><Bell className="size-4" /> Prijavi nestanak</ButtonLink>
              </SidebarCard>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
