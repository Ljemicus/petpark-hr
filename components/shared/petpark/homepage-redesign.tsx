import Image from 'next/image';
import Link from 'next/link';
import {
  BadgeCheck,
  Bell,
  BookOpen,
  Camera,
  ChevronRight,
  Clock3,
  Footprints,
  Heart,
  HeartHandshake,
  Home,
  MapPin,
  MessageCircle,
  PawPrint,
  Search,
  Scissors,
  ShieldCheck,
  type LucideIcon,
  UsersRound,
} from 'lucide-react';
import { PetParkLogo } from '@/components/shared/brand';
import { cn } from '@/lib/utils';

type HomepageRedesignProps = {
  mode?: 'production' | 'preview';
};

type CategoryIconName = 'care' | 'walk' | 'grooming' | 'training' | 'lost' | 'adoption';
type Tone = 'orange' | 'green' | 'teal' | 'yellow';

const navItems = [
  { label: 'Usluge', href: '/usluge' },
  { label: 'Kako radi', href: '#kako-radi' },
  { label: 'Zajednica', href: '/zajednica' },
  { label: 'Blog', href: '/blog' },
];

const categories: { label: string; href: string; icon: CategoryIconName; tone: 'orange' | 'green' }[] = [
  { label: 'Čuvanje', href: '/usluge', icon: 'care', tone: 'orange' },
  { label: 'Šetnja', href: '/usluge', icon: 'walk', tone: 'green' },
  { label: 'Grooming', href: '/njega', icon: 'grooming', tone: 'green' },
  { label: 'Trening', href: '/dresura', icon: 'training', tone: 'green' },
  { label: 'Izgubljeni', href: '/izgubljeni', icon: 'lost', tone: 'green' },
  { label: 'Udomljavanje', href: '/udomljavanje', icon: 'adoption', tone: 'orange' },
];

const heroMoments = [
  { title: 'Mila traži čuvanje', meta: 'subota, 2 noći · Rijeka', Icon: Home, tone: 'orange' as Tone },
  { title: 'Bobi ide u šetnju', meta: '18:30 · kvart Zamet', Icon: Footprints, tone: 'green' as Tone },
  { title: 'Pronađena maca', meta: 'Kantrida · zajednica prati', Icon: Bell, tone: 'teal' as Tone },
];

const dailySignals = [
  { title: 'Photo update', meta: 'Mila je pojela i spava', Icon: Camera, tone: 'orange' as Tone },
  { title: 'Šetnja potvrđena', meta: 'Bobi · 18:30 · Zamet', Icon: Clock3, tone: 'green' as Tone },
  { title: 'Hitna objava', meta: 'pronađena maca kod parka', Icon: Bell, tone: 'teal' as Tone },
];

const feedItems = [
  {
    title: 'Primjer upozorenja o nestalom ljubimcu',
    body: 'Fotka, lokacija i zadnje viđenje idu odmah na jedno mjesto.',
    location: 'Pećine · Rijeka',
    badge: 'HITNO',
    time: 'prije 14 min',
    tone: 'orange' as Tone,
    image: '/images/design-lab/petpark-reference-feed-cat.png',
  },
  {
    title: 'Primjer objave o pronađenom ljubimcu',
    body: 'Netko je pronašao psa, zajednica dijeli objavu dok se vlasnik ne javi.',
    location: 'Maksimir · Zagreb',
    badge: 'PRONAĐEN',
    time: 'danas',
    tone: 'green' as Tone,
    image: '/images/design-lab/petpark-reference-feed-dog.png',
  },
  {
    title: 'Nova tema: priprema psa za čuvanje',
    body: 'Lista stvari koje sitter treba znati prije prvog noćenja.',
    location: 'Forum zajednice',
    badge: 'FORUM',
    time: '12 odgovora',
    tone: 'teal' as Tone,
    Icon: MessageCircle,
  },
  {
    title: 'Članak: kako odabrati groomera',
    body: 'Pitanja koja vrijedi postaviti prije prvog termina.',
    location: 'PetPark blog',
    badge: 'BLOG',
    time: 'vodič',
    tone: 'yellow' as Tone,
    Icon: BookOpen,
  },
];

const careStories = [
  {
    title: 'Čuvanje bez nervoze',
    body: 'Rutina, lijekovi, hranjenje i update fotografije ostaju uz dogovor.',
    href: '/usluge',
    image: '/images/services/01-pet-sitting.jpg',
    Icon: Home,
    tone: 'orange' as Tone,
  },
  {
    title: 'Kvartovske šetnje',
    body: 'Brzi dogovor za dane kad posao, kiša ili put promijene plan.',
    href: '/usluge',
    image: '/images/services/04-setanje-pasa.jpg',
    Icon: Footprints,
    tone: 'green' as Tone,
  },
  {
    title: 'Njega i trening',
    body: 'Groomeri i treneri nisu samo ikone u gridu, nego stvarni profili s terminima.',
    href: '/njega',
    image: '/images/services/02-grooming.jpg',
    Icon: Scissors,
    tone: 'teal' as Tone,
  },
];

const serviceChips = [
  { label: 'Čuvanje', href: '/usluge', icon: 'care' as CategoryIconName },
  { label: 'Šetnja', href: '/usluge', icon: 'walk' as CategoryIconName },
  { label: 'Grooming', href: '/njega', icon: 'grooming' as CategoryIconName },
  { label: 'Trening', href: '/dresura', icon: 'training' as CategoryIconName },
  { label: 'Izgubljeni', href: '/izgubljeni', icon: 'lost' as CategoryIconName },
  { label: 'Udomljavanje', href: '/udomljavanje', icon: 'adoption' as CategoryIconName },
];

const quickAccess = [
  { title: 'Forum', body: 'Pitajte, podijelite iskustva i pomozite drugima.', href: '/forum', Icon: MessageCircle, tone: 'teal' as Tone },
  { title: 'Izgubljeni / pronađeni', body: 'Pronašli ste ljubimca ili tražite svog?', href: '/izgubljeni', Icon: MapPin, tone: 'orange' as Tone },
  { title: 'Udomljavanje', body: 'Dajte dom. Promijenite život.', href: '/udomljavanje', Icon: Heart, tone: 'green' as Tone },
  { title: 'Blog savjeti', body: 'Korisni članci i vodiči za svakog vlasnika.', href: '/blog', Icon: BookOpen, tone: 'yellow' as Tone },
];

const trustItems = [
  { title: 'Provjereni pružatelji usluga', body: 'Sigurnost i kvaliteta', Icon: ShieldCheck },
  { title: 'Zajednica koja pomaže', body: 'Stručni savjeti i podrška', Icon: UsersRound },
  { title: 'Lokalno i pouzdano', body: 'Usluge u vašem gradu', Icon: MapPin },
  { title: 'Za sve ljubimce', body: 'Psi, mačke i više', Icon: PawPrint },
];

const shellHideCss = `
  body:has(#petpark-homepage-live-reference) > header[role="banner"],
  body:has(#petpark-homepage-live-reference) footer:not(#petpark-home-footer),
  body:has(#petpark-homepage-live-reference) nav.fixed.bottom-0.left-0.right-0,
  body:has(#petpark-homepage-live-reference) .fixed.bottom-0.left-0.right-0,
  body:has(#petpark-homepage-live-reference) div.fixed.bottom-20.right-4,
  body:has(#petpark-homepage-live-reference) div.fixed.bottom-4.right-4,
  body:has(#petpark-homepage-live-reference) button.fixed.bottom-20.right-4,
  body:has(#petpark-homepage-live-reference) button.fixed.bottom-4.right-4,
  body:has(#petpark-homepage-live-reference) nextjs-portal,
  body:has(#petpark-homepage-live-reference) [data-nextjs-toast],
  body:has(#petpark-homepage-live-reference) [data-nextjs-dialog-overlay] { display: none !important; }
  body:has(#petpark-homepage-live-reference) main#main-content { overflow: hidden; }
  body:has(#petpark-homepage-live-reference) .pb-20 { padding-bottom: 0 !important; }
  @media (min-width: 768px) and (max-width: 1023px) {
    #petpark-homepage-live-reference .petpark-mobile-hero { display: flex !important; flex-direction: row !important; align-items: center !important; gap: 28px !important; }
    #petpark-homepage-live-reference .petpark-mobile-hero-visual { width: 310px !important; flex: 0 0 310px !important; }
  }
`;

const categoryIconMap: Record<CategoryIconName, LucideIcon> = {
  care: Home,
  walk: Footprints,
  grooming: Scissors,
  training: BadgeCheck,
  lost: MapPin,
  adoption: HeartHandshake,
};

function CategoryGlyph({ name, className = 'h-7 w-7' }: { name: CategoryIconName; className?: string }) {
  const Icon = categoryIconMap[name];

  return <Icon className={className} aria-hidden="true" strokeWidth={2.3} />;
}

function CategoryCard({ label, href, icon, tone }: (typeof categories)[number]) {
  return (
    <Link
      prefetch={false}
      href={href}
      className="group inline-flex items-center gap-2 rounded-full border border-[#E7DDCC] bg-[#FFFDF8]/86 px-4 py-2 text-sm font-black text-[#123D36] shadow-[0_8px_18px_rgba(80,55,25,.06)] transition hover:-translate-y-0.5 hover:border-[#F26A00]/35 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26A00] focus-visible:ring-offset-2"
    >
      <span className={cn('flex h-8 w-8 items-center justify-center rounded-full', tone === 'orange' ? 'bg-[#FBE9DB] text-[#C65F26]' : 'bg-[#E9F0DF] text-[#0F6B57]')}>
        <CategoryGlyph name={icon} className="h-[18px] w-[18px]" />
      </span>
      {label}
    </Link>
  );
}

function ToneBadge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'rounded-full px-3 py-1 text-[10px] font-black tracking-[0.08em]',
        tone === 'orange' && 'bg-[#FBE9DB] text-[#B4531C]',
        tone === 'green' && 'bg-[#DFEADA] text-[#286D45]',
        tone === 'teal' && 'bg-[#DDF1EE] text-[#08776F]',
        tone === 'yellow' && 'bg-[#FFF1C8] text-[#A96310]',
      )}
    >
      {children}
    </span>
  );
}

function FeedIcon({ item }: { item: (typeof feedItems)[number] }) {
  if ('image' in item && item.image) {
    return <Image src={item.image} alt="" width={106} height={77} className="h-[77px] w-[106px] rounded-[10px] object-cover" />;
  }

  const Icon = item.Icon ?? MessageCircle;
  return (
    <span className={cn('flex h-[77px] w-[106px] items-center justify-center rounded-[10px]', item.tone === 'teal' ? 'bg-[#DDF1EE] text-[#159C98]' : 'bg-[#FFF1C8] text-[#C77B12]')}>
      <Icon className="h-8 w-8" />
    </span>
  );
}

function QuickIcon({ tone, Icon }: { tone: Tone; Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <span
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] text-white',
        tone === 'teal' && 'bg-[#159C98]',
        tone === 'orange' && 'bg-[#F26A00]',
        tone === 'green' && 'bg-[#286D45]',
        tone === 'yellow' && 'bg-[#F6B23C]',
      )}
    >
      <Icon className="h-6 w-6" />
    </span>
  );
}

function DailySignal({ title, meta, Icon, tone }: (typeof dailySignals)[number]) {
  return (
    <div className="group flex items-center gap-3 rounded-[18px] border border-[#E7DDCC] bg-[#FFFDF8]/92 p-3 shadow-[0_12px_26px_rgba(80,55,25,.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(80,55,25,.12)]" style={{ padding: 12 }}>
      <span
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]',
          tone === 'orange' && 'bg-[#FBE9DB] text-[#C65F26]',
          tone === 'green' && 'bg-[#E9F0DF] text-[#0F6B57]',
          tone === 'teal' && 'bg-[#DDF1EE] text-[#08776F]',
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-black leading-4 text-[#123D36]">{title}</span>
        <span className="mt-0.5 block text-[11px] font-bold leading-4 text-[#66736D]">{meta}</span>
      </span>
    </div>
  );
}


function MobileCategoryCard({ label, href, icon, tone }: (typeof categories)[number]) {
  return (
    <Link
      prefetch={false}
      href={href}
      aria-label={label}
      className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-[#E7DDCC] bg-[#FFFDF8]/92 px-3 py-2 text-[13px] font-black text-[#14231D] shadow-[0_8px_18px_rgba(80,55,25,.06)] transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(80,55,25,.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6EA]"
      style={{ padding: '8px 12px' }}
    >
      <span className={cn('flex h-8 w-8 items-center justify-center rounded-full', tone === 'orange' ? 'bg-[#FBE9DB] text-[#C65F26]' : 'bg-[#E9F0DF] text-[#0F6B57]')}>
        <CategoryGlyph name={icon} className="h-[18px] w-[18px]" />
      </span>
      <span>{label}</span>
    </Link>
  );
}

function MobileFeedFallbackIcon({ item }: { item: (typeof feedItems)[number] }) {
  const Icon = item.Icon ?? MessageCircle;

  return (
    <span className={cn('flex h-[74px] w-[74px] items-center justify-center rounded-[18px] sm:h-[88px] sm:w-[88px]', item.tone === 'teal' ? 'bg-[#DDF1EE] text-[#159C98]' : 'bg-[#FFF1C8] text-[#C77B12]')}>
      <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
    </span>
  );
}

function MobileFeedItem({ item, featured = false }: { item: (typeof feedItems)[number]; featured?: boolean }) {
  return (
    <article className={cn('group overflow-hidden rounded-[22px] border border-[#E7DDCC] bg-[#FFFDF8] shadow-[0_14px_28px_rgba(80,55,25,.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(80,55,25,.10)]', featured ? 'sm:min-h-[270px]' : '')}>
      <div className={cn(featured ? 'sm:block' : 'grid grid-cols-[74px_minmax(0,1fr)] gap-3 sm:grid-cols-[88px_minmax(0,1fr)]', 'p-3 sm:p-4')} style={{ padding: 12 }}>
        <div className={cn('overflow-hidden rounded-[18px]', featured ? 'sm:mb-4 sm:h-[130px] sm:w-full' : '')}>
          {'image' in item && item.image ? (
            <Image
              src={item.image}
              alt=""
              width={featured ? 360 : 88}
              height={featured ? 156 : 88}
              className={cn('object-cover', featured ? 'h-[74px] w-[74px] sm:h-full sm:w-full' : 'h-[74px] w-[74px] sm:h-[88px] sm:w-[88px]')}
            />
          ) : (
            <MobileFeedFallbackIcon item={item} />
          )}
        </div>
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <ToneBadge tone={item.tone}>{item.badge}</ToneBadge>
            <span className="text-[11px] font-bold text-[#66736D] sm:text-[12px]">{item.time}</span>
          </div>
          <h3 className="text-[15px] font-black leading-[19px] tracking-[-0.01em] text-[#15241E] sm:text-[17px] sm:leading-[22px]">{item.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-[12px] font-medium leading-[18px] text-[#5A6963] sm:text-[13px] sm:leading-[19px]">{item.body}</p>
          <p className="mt-2 flex items-center gap-1 text-[11px] font-black text-[#C65F26] sm:text-[12px]"><MapPin className="h-3.5 w-3.5 shrink-0" />{item.location}</p>
        </div>
      </div>
    </article>
  );
}

function MobileQuickCard({ title, body, href, Icon, tone }: (typeof quickAccess)[number]) {
  return (
    <Link prefetch={false} href={href} className="group relative overflow-hidden rounded-[22px] border border-[#E7DDCC] bg-[#FFFDF8] p-4 shadow-[0_12px_24px_rgba(80,55,25,.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(80,55,25,.10)]" style={{ padding: 16 }}>
      <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#FBE9DB]/70" />
      <div className="relative flex items-start gap-3">
        <QuickIcon tone={tone} Icon={Icon} />
        <span className="min-w-0 flex-1">
          <span className="block text-[16px] font-black leading-5 text-[#17231D]">{title}</span>
          <span className="mt-1.5 block text-[13px] font-medium leading-[18px] text-[#5A6963]">{body}</span>
        </span>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-[#8B958D] group-hover:text-[#C65F26]" />
      </div>
    </Link>
  );
}

function CareStoryCard({ story, featured = false }: { story: (typeof careStories)[number]; featured?: boolean }) {
  const Icon = story.Icon;

  return (
    <Link
      prefetch={false}
      href={story.href}
      className={cn(
        'group relative overflow-hidden rounded-[26px] border border-[#E7DDCC] bg-[#FFFDF8] shadow-[0_16px_34px_rgba(80,55,25,.09)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_rgba(80,55,25,.13)]',
        featured ? 'min-h-[300px]' : 'min-h-[210px]',
      )}
    >
      <Image src={story.image} alt="" fill sizes="(max-width: 1024px) 92vw, 420px" className="object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09352F]/88 via-[#09352F]/34 to-transparent" />
      <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/30 bg-white/90 text-[#0E6B58] shadow-[0_12px_26px_rgba(0,0,0,.12)] backdrop-blur">
        <Icon className="h-6 w-6" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5" style={{ padding: 20 }}>
        <h3 className="font-serif text-[28px] font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-[34px]">{story.title}</h3>
        <p className="mt-3 max-w-[360px] text-[14px] font-semibold leading-5 text-white/86">{story.body}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-black text-[#FFE4B6]">
          Otvori <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function MobileHomepage() {
  return (
    <div className="lg:hidden">
      <div className="relative mx-auto min-h-screen max-w-[900px] overflow-hidden bg-[#FAF6EA] pb-12 pt-4 text-[#003B2F] sm:px-7 md:px-8" style={{ paddingLeft: 18, paddingRight: 18 }}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(circle_at_86%_8%,rgba(252,231,214,.96),transparent_42%),radial-gradient(circle_at_10%_18%,rgba(223,234,218,.88),transparent_38%)]" />
        <div className="pointer-events-none absolute left-1/2 top-[120px] h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-[#F8E3C9]/30 blur-3xl" />

        <header className="relative z-10 flex items-center justify-between gap-2 sm:gap-4">
          <Link prefetch={false} href="/" aria-label="PetPark početna" className="block min-w-0 shrink">
            <PetParkLogo width={154} height={36} priority className="h-[30px] w-auto max-w-[130px] min-[380px]:h-[33px] min-[380px]:max-w-[154px] sm:h-[42px] sm:max-w-none" />
          </Link>
          <div className="flex shrink-0 items-center gap-1.5 min-[380px]:gap-2">
            <Link prefetch={false} href="/prijava" className="inline-flex h-10 items-center justify-center rounded-full bg-[#F26A00] px-3 text-[11px] font-black text-white shadow-[0_10px_22px_rgba(242,106,0,.22)] min-[380px]:px-4 min-[380px]:text-[12px] sm:h-11 sm:px-5 sm:text-[13px]" style={{ paddingLeft: 12, paddingRight: 12 }}>
              Prijava
            </Link>
            <Link prefetch={false} href="/postani-sitter" className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full border border-[#D8CBB8] bg-[#FFFDF8] px-3 text-[11px] font-black text-[#123D36] shadow-[0_8px_18px_rgba(80,55,25,.07)] min-[380px]:text-[12px] sm:h-11 sm:px-5 sm:text-[13px]" style={{ paddingLeft: 12, paddingRight: 12 }}>
              Postani sitter
            </Link>
          </div>
        </header>

        <nav aria-label="Brza navigacija" className="relative z-10 -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <Link key={item.label} prefetch={false} href={item.href} className="shrink-0 rounded-full border border-[#E2D7C6] bg-[#FFFDF8]/88 px-3 py-2 text-center text-[12px] font-extrabold text-[#123D36] shadow-[0_5px_14px_rgba(80,55,25,.06)] sm:px-4 sm:text-[13px]" style={{ padding: '8px 12px' }}>
              {item.label}
            </Link>
          ))}
        </nav>

        <section className="petpark-mobile-hero relative z-10 flex flex-col pt-7 sm:pt-10 md:items-center md:gap-7">
          <div className="md:flex-1">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E9E0D1] bg-[#FFFDF8]/92 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#C65F26] shadow-sm sm:text-[12px]" style={{ padding: '6px 12px' }}>
              <PawPrint className="h-4 w-4 fill-[#F26A00] text-[#F26A00]" />
              PetPark zajednica
            </div>
            <h1 className="mt-4 max-w-[680px] font-serif text-[42px] font-black leading-[0.98] tracking-[-0.058em] text-[#003B2F] min-[390px]:text-[45px] sm:text-[58px] md:text-[56px]">
              Sve za ljubimca kad dan ne ide po planu.
            </h1>
            <p className="mt-4 max-w-[610px] text-[16px] font-semibold leading-[24px] text-[#46545A] sm:text-[20px] sm:leading-[30px] md:text-[18px] md:leading-[27px]">
              Nađi čuvanje, dogovori šetnju, prijavi nestalog ljubimca ili pitaj zajednicu bez osjećaja da si sam u panici.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link prefetch={false} href="/izgubljeni/prijavi" className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#F26A00] px-5 text-[14px] font-black text-white shadow-[0_14px_26px_rgba(242,106,0,.22)] sm:w-auto sm:text-[15px]" style={{ paddingLeft: 20, paddingRight: 20 }}>
                <Bell className="h-5 w-5" />
                Objavi upozorenje
              </Link>
              <Link prefetch={false} href="/usluge" className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-[#4F7772] bg-[#FFFDF8] px-5 text-[14px] font-extrabold text-[#103D3A] shadow-[0_8px_18px_rgba(80,55,25,.06)] sm:w-auto sm:text-[15px]" style={{ paddingLeft: 20, paddingRight: 20 }}>
                <Search className="h-5 w-5" />
                Pogledaj usluge
              </Link>
            </div>
          </div>

          <div className="petpark-mobile-hero-visual relative mt-7 h-[238px] overflow-hidden rounded-[30px] border border-[#E7DDCC] bg-[#FFFDF8]/75 shadow-[0_22px_46px_rgba(80,55,25,.12)] sm:h-[330px] md:mt-0 md:h-[340px] md:w-[310px] md:shrink-0 md:rounded-[34px]">
            <Image src="/images/design-lab/petpark-reference-hero-mobile-clean.webp" alt="Pas i mačka u PetPark zajednici" fill sizes="(max-width: 640px) 100vw, 0px" className="object-cover object-center sm:hidden" />
            <Image src="/images/design-lab/petpark-reference-hero-tablet-clean.webp" alt="Pas i mačka u PetPark zajednici" fill sizes="(min-width: 640px) 720px, 0px" className="hidden object-cover object-center sm:block" />
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-[16px] border border-white/70 bg-[#FFFDF8]/90 px-3 py-2 shadow-[0_10px_22px_rgba(80,55,25,.12)] backdrop-blur" style={{ padding: '8px 12px' }}>
              <span className="h-2.5 w-2.5 rounded-[4px] bg-[#159C98]" />
              <span className="text-[12px] font-black text-[#123D36]">uživo iz zajednice</span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 rounded-[18px] border border-white/70 bg-[#FFFDF8]/88 px-4 py-3 shadow-[0_10px_24px_rgba(80,55,25,.12)] backdrop-blur" style={{ padding: '12px 16px' }}>
              <p className="text-[12px] font-black uppercase tracking-[0.12em] text-[#C65F26]">care brief</p>
              <p className="mt-0.5 text-[14px] font-extrabold text-[#123D36] sm:text-[15px]">Rutina, navike, fotke i dogovor na jednom mjestu.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3 md:hidden">
            {dailySignals.map((signal) => <DailySignal key={signal.title} {...signal} />)}
          </div>
        </section>

        <section aria-label="PetPark usluge" className="relative z-10 -mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => <MobileCategoryCard key={category.label} {...category} />)}
        </section>

        <section className="relative z-10 mt-7 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#C65F26]">Ne samo kategorije</p>
            <h2 className="mt-1 font-serif text-[34px] font-black leading-none tracking-[-0.05em] text-[#003B2F]">Tri stvarna scenarija</h2>
          </div>
          {careStories.map((story, index) => (
            <CareStoryCard key={story.title} story={story} featured={index === 0} />
          ))}
        </section>

        <section id="kako-radi-mobile" className="relative z-10 mt-9 flex flex-col rounded-[28px] border border-[#E7DDCC] bg-[#FFF7EC]/72 p-4 shadow-[0_18px_38px_rgba(80,55,25,.08)] backdrop-blur sm:p-5" style={{ padding: 16 }}>
          <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#C65F26]">Zajednica</p>
              <h2 className="font-serif text-[30px] font-black tracking-[-0.05em] text-[#003B2F] sm:text-[38px]">Aktualno</h2>
            </div>
            <Link prefetch={false} href="/zajednica" className="inline-flex items-center gap-1 rounded-full bg-[#FFFDF8] px-3 py-2 text-[13px] font-black text-[#C65F26] shadow-sm" style={{ padding: '8px 12px' }}>Sve <ChevronRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {feedItems.map((item, index) => <MobileFeedItem key={item.title} item={item} featured={index < 2} />)}
          </div>
        </section>

        <section className="relative z-10 mt-7 flex flex-col">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#C65F26]">Prečaci</p>
              <h2 className="font-serif text-[30px] font-black tracking-[-0.05em] text-[#003B2F] sm:text-[36px]">Brzi pristup</h2>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickAccess.map((item) => <MobileQuickCard key={item.title} {...item} />)}
          </div>
        </section>

        <section className="relative z-10 mt-7 grid gap-3 sm:grid-cols-2">
          {trustItems.map(({ title, body, Icon }) => (
            <div key={title} className="rounded-[22px] border border-[#E7DDCC] bg-[#FFFDF8]/90 p-4 shadow-[0_12px_24px_rgba(80,55,25,.06)]" style={{ padding: 16 }}>
              <Icon className="h-7 w-7 text-[#2E7A63]" />
              <p className="mt-3 text-[14px] font-black leading-5 text-[#003B2F]">{title}</p>
              <p className="mt-1 text-[12px] font-semibold leading-4 text-[#65746E]">{body}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}


function PremiumDesktopHomepage({ isPreview }: { isPreview: boolean }) {
  return (
    <div className="relative hidden overflow-hidden bg-[#FAF6EA] px-8 pb-16 pt-6 text-[#003B2F] lg:block xl:px-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(circle_at_82%_12%,rgba(251,233,219,.92),transparent_34%),radial-gradient(circle_at_9%_16%,rgba(225,237,216,.78),transparent_34%)]" />
      <div className="relative mx-auto flex w-full max-w-[1360px] flex-col gap-12">
        <header className="flex h-16 items-center justify-between gap-8">
          <Link prefetch={false} href="/" aria-label="PetPark početna" className="shrink-0">
            <PetParkLogo width={188} height={44} priority className="h-11 w-auto" />
          </Link>
          <nav aria-label="Glavna navigacija" className="flex items-center gap-1 rounded-full border border-[#E5DAC8] bg-[#FFFDF8]/86 p-1 shadow-[0_10px_24px_rgba(80,55,25,.06)] backdrop-blur">
            {navItems.map((item) => (
              <Link
                key={item.label}
                prefetch={false}
                href={item.href}
                className="rounded-full px-5 py-2.5 text-sm font-black text-[#315049] transition hover:bg-[#E9F0DF] hover:text-[#003B2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159C98]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link prefetch={false} href="/prijava" className="inline-flex h-11 items-center justify-center rounded-full border border-[#D8CBB8] bg-[#FFFDF8] px-5 text-sm font-black text-[#123D36] shadow-[0_8px_18px_rgba(80,55,25,.06)]">
              Prijava
            </Link>
            <Link prefetch={false} href="/postani-sitter" className="inline-flex h-11 items-center justify-center rounded-full bg-[#F26A00] px-5 text-sm font-black text-white shadow-[0_12px_24px_rgba(242,106,0,.22)]">
              Postani sitter
            </Link>
          </div>
        </header>

        <section className="grid min-h-[620px] gap-10 xl:grid-cols-[minmax(0,1.04fr)_minmax(430px,.96fr)] xl:items-center">
          <div className="max-w-[720px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E9E0D1] bg-[#FFFDF8]/92 px-4 py-2 text-xs font-black uppercase text-[#C65F26] shadow-sm">
              <PawPrint className="h-4 w-4 fill-[#F26A00] text-[#F26A00]" />
              PetPark za stvarne dane
            </div>
            <h1 className="mt-6 font-serif text-[76px] font-black leading-[0.94] tracking-[-0.055em] text-[#003B2F] xl:text-[86px]">
              Sve za ljubimca kad dan ne ide po planu.
            </h1>
            <p className="mt-6 max-w-[640px] text-[20px] font-semibold leading-8 text-[#46545A]">
              PetPark nije samo lista usluga. To je mjesto za čuvanje, šetnje, grooming, trening, izgubljene ljubimce i savjete kada trebaš brz, normalan odgovor.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link prefetch={false} href="/pretraga" className="inline-flex h-14 items-center justify-center gap-2 rounded-[16px] bg-[#F26A00] px-7 text-base font-black text-white shadow-[0_16px_30px_rgba(242,106,0,.24)] transition hover:-translate-y-0.5">
                <Search className="h-5 w-5" />
                Pronađi match
              </Link>
              <Link prefetch={false} href="/postani-sitter" className="inline-flex h-14 items-center justify-center gap-2 rounded-[16px] border border-[#4F7772] bg-[#FFFDF8] px-7 text-base font-black text-[#103D3A] shadow-[0_10px_22px_rgba(80,55,25,.07)] transition hover:-translate-y-0.5">
                Postani provider
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="mt-9 flex max-w-[760px] flex-wrap gap-3">
              {serviceChips.map((category) => {
                const source = categories.find((item) => item.icon === category.icon);
                return <CategoryCard key={category.label} label={category.label} href={category.href} icon={category.icon} tone={source?.tone ?? 'green'} />;
              })}
            </div>
          </div>

          <div className="relative min-h-[610px]">
            <div className="absolute inset-x-0 top-0 h-[520px] overflow-hidden rounded-[38px] border border-[#E7DDCC] bg-[#FFFDF8]/80 shadow-[0_28px_70px_rgba(80,55,25,.16)]">
              <Image src="/images/design-lab/petpark-reference-hero-tablet-clean.webp" alt="Pas i mačka u PetPark zajednici" fill sizes="(min-width: 1024px) 48vw, 0px" className="object-cover object-center" priority />
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-[18px] border border-white/70 bg-[#FFFDF8]/88 px-4 py-2 shadow-[0_12px_28px_rgba(80,55,25,.12)] backdrop-blur">
                <span className="h-2.5 w-2.5 rounded-[4px] bg-[#159C98]" />
                <span className="text-sm font-black text-[#123D36]">uživo iz zajednice</span>
              </div>
              <div className="absolute bottom-5 left-5 max-w-[300px] rounded-[24px] border border-white/70 bg-[#FFFDF8]/90 p-5 shadow-[0_16px_32px_rgba(80,55,25,.14)] backdrop-blur">
                <p className="text-xs font-black uppercase text-[#C65F26]">Care brief</p>
                <p className="mt-1 text-base font-black leading-6 text-[#123D36]">Rutina, navike, fotke i dogovor na jednom mjestu.</p>
              </div>
            </div>
            <div className="absolute -bottom-3 right-0 grid w-[330px] gap-3">
              {heroMoments.map((moment, index) => (
                <div key={moment.title} className={cn('flex items-center gap-3 rounded-[22px] border border-[#E7DDCC] bg-[#FFFDF8]/94 p-4 shadow-[0_16px_34px_rgba(80,55,25,.12)] backdrop-blur', index === 1 && '-ml-10', index === 2 && 'ml-8')} style={{ padding: 16 }}>
                  <QuickIcon tone={moment.tone} Icon={moment.Icon} />
                  <div>
                    <p className="text-sm font-black text-[#123D36]">{moment.title}</p>
                    <p className="mt-1 text-xs font-bold text-[#68766F]">{moment.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="PetPark scenariji" className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
          <CareStoryCard story={careStories[0]} featured />
          <div className="grid gap-5">
            {careStories.slice(1).map((story) => <CareStoryCard key={story.title} story={story} />)}
          </div>
        </section>

        <section id="kako-radi" className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-[32px] border border-[#E7DDCC] bg-[#FFF7EC]/72 p-6 shadow-[0_18px_38px_rgba(80,55,25,.08)]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-[#C65F26]">Zajednica</p>
                <h2 className="mt-1 font-serif text-5xl font-black tracking-[-0.05em] text-[#003B2F]">Aktualno</h2>
              </div>
              <Link prefetch={false} href="/zajednica" className="inline-flex items-center gap-1 rounded-full bg-[#FFFDF8] px-4 py-2 text-sm font-black text-[#C65F26] shadow-sm">
                Sve <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {feedItems.slice(0, 4).map((item) => (
                <MobileFeedItem key={item.title} item={item} featured={'image' in item} />
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {quickAccess.map((item) => <MobileQuickCard key={item.title} {...item} />)}
          </div>
        </section>
      </div>
      {isPreview ? <span className="sr-only">Preview mode</span> : null}
    </div>
  );
}

export function HomepageRedesign({ mode = 'production' }: HomepageRedesignProps) {
  const isPreview = mode === 'preview';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shellHideCss }} />
      <main id="petpark-homepage-live-reference" className="min-h-screen overflow-hidden bg-[#FAF6EA] text-[#003B2F]">
        <MobileHomepage />
        <PremiumDesktopHomepage isPreview={isPreview} />
        <footer id="petpark-home-footer" className="sr-only">PetPark</footer>
      </main>
    </>
  );
}
