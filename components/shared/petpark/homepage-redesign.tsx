import Image from 'next/image';
import Link from 'next/link';
import {
  Bell,
  BookOpen,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  MapPin,
  MessageCircle,
  PawPrint,
  Search,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import { PetParkLogo } from '@/components/shared/brand';
import { cn } from '@/lib/utils';

type HomepageRedesignProps = {
  mode?: 'production' | 'preview';
};

type CategoryIconName = 'care' | 'walk' | 'grooming' | 'training' | 'lost' | 'adoption';
type Tone = 'orange' | 'green' | 'teal' | 'yellow';

const officialCategoryIcons: Record<CategoryIconName, string> = {
  care: '/images/design-lab/official/icons/icon-only/cuvanje.svg',
  walk: '/images/design-lab/official/icons/icon-only/setnja.svg',
  grooming: '/images/design-lab/official/icons/icon-only/grooming.svg',
  training: '/images/design-lab/official/icons/icon-only/trening.svg',
  lost: '/images/design-lab/official/icons/icon-only/izgubljeni.svg',
  adoption: '/images/design-lab/official/icons/icon-only/udomljavanje.svg',
};

const navItems = [
  { label: 'Usluge', href: '/usluge' },
  { label: 'Kako radi', href: '#kako-radi' },
  { label: 'Zajednica', href: '/zajednica' },
  { label: 'Blog', href: '/blog' },
];

const categories: {
  label: string;
  need: string;
  href: string;
  icon: CategoryIconName;
  tone: 'orange' | 'green';
}[] = [
  { label: 'Čuvanje', need: 'vikend, put ili dugi radni dan', href: '/usluge', icon: 'care', tone: 'orange' },
  { label: 'Šetnja', need: 'aktivna ruta kad ti ne stigneš', href: '/usluge', icon: 'walk', tone: 'green' },
  { label: 'Grooming', need: 'kupanje, šišanje i uredan rep', href: '/njega', icon: 'grooming', tone: 'green' },
  { label: 'Trening', need: 'bolji fokus, manje povlačenja', href: '/dresura', icon: 'training', tone: 'green' },
  { label: 'Izgubljeni', need: 'brza objava za kvart i grad', href: '/izgubljeni', icon: 'lost', tone: 'green' },
  { label: 'Udomljavanje', need: 'novi dom za nekoga važnog', href: '/udomljavanje', icon: 'adoption', tone: 'orange' },
];

const heroMoments = [
  { label: 'Vikend čuvanje', value: 'Rijeka', Icon: Home },
  { label: 'Foto update', value: 'nakon šetnje', Icon: Camera },
  { label: 'Šetnja u kvartu', value: 'Maksimir', Icon: MapPin },
];

const heroSignals = [
  { label: 'Sitter', value: 'potvrđuje', Icon: CheckCircle2, tone: 'green' as Tone, className: 'left-0 top-[22%] lg:-left-10' },
  { label: 'Kvart', value: 'širi alert', Icon: Bell, tone: 'orange' as Tone, className: 'right-1 top-[9%] lg:-right-8' },
  { label: 'Forum', value: 'ima odgovor', Icon: MessageCircle, tone: 'teal' as Tone, className: 'left-8 bottom-[26%] lg:left-2' },
];

const storyCards = [
  {
    title: 'Mala Nesta ide na prvo noćenje',
    text: 'Vlasnica šalje brief, sitter potvrđuje rutinu i dogovara update nakon večernje šetnje.',
    meta: 'Čuvanje · Rijeka',
    image: '/images/services/06-community.jpg',
    tone: 'orange' as Tone,
  },
  {
    title: 'Bruno treba dužu šetnju nakon posla',
    text: 'Usporedi dostupne šetače, rutu, cijenu i iskustvo s velikim psima.',
    meta: 'Šetnja · Zagreb',
    image: '/images/services/04-setanje-pasa.jpg',
    tone: 'green' as Tone,
  },
  {
    title: 'Grooming prije putovanja',
    text: 'Termin, napomena o osjetljivoj koži i fotografija prije preuzimanja.',
    meta: 'Njega · Split',
    image: '/images/services/01-pet-sitting.jpg',
    tone: 'teal' as Tone,
  },
];

const liveFeed = [
  {
    title: 'Vikend upit za čuvanje mačke',
    body: 'Treba netko miran, bez drugih životinja u stanu. Hrana i lijekovi su već pripremljeni.',
    location: 'Trešnjevka, Zagreb',
    badge: 'UPIT',
    time: 'primjer upita',
    tone: 'orange' as Tone,
    Icon: CalendarDays,
  },
  {
    title: 'Pronađen mladi pas kod parka',
    body: 'Objava ima lokaciju, fotografiju i kontakt. Zajednica širi prema kvartovskim grupama.',
    location: 'Kantrida, Rijeka',
    badge: 'ALERT',
    time: 'primjer objave',
    tone: 'green' as Tone,
    Icon: Bell,
  },
  {
    title: 'Pitanje: pas vuče na povodcu',
    body: 'Trener objašnjava prvi korak: kraća ruta, nagrada prije zatezanja i mirniji tempo.',
    location: 'Forum',
    badge: 'SAVJET',
    time: 'danas',
    tone: 'teal' as Tone,
    Icon: MessageCircle,
  },
];

const quickAccess = [
  { title: 'Pitaj zajednicu', body: 'Kad nisi siguran, pitaj ljude koji su to već prošli.', href: '/forum', Icon: MessageCircle, tone: 'teal' as Tone },
  { title: 'Prijavi izgubljenog', body: 'Fotografija, lokacija i kontakt odmah idu pred kvart.', href: '/izgubljeni/prijavi', Icon: Bell, tone: 'orange' as Tone },
  { title: 'Pronađi pomoć', body: 'Čuvanje, šetnja ili njega kad ti dan ode u stranu.', href: '/usluge', Icon: Search, tone: 'green' as Tone },
  { title: 'Pročitaj vodič', body: 'Kratki savjeti za one male brige koje vlasnici dobro znaju.', href: '/blog', Icon: BookOpen, tone: 'yellow' as Tone },
];

const flowItems = [
  { title: 'Upit poslan sitteru', meta: 'Luna · subota i nedjelja', Icon: CalendarDays, tone: 'orange' as Tone },
  { title: 'Foto update stigao', meta: 'Šetnja završena i zabilježena', Icon: Camera, tone: 'green' as Tone },
  { title: 'Kvart prati objavu', meta: 'Kantrida · pronađen pas', Icon: Bell, tone: 'orange' as Tone },
  { title: 'Forum ima odgovor', meta: 'pas vuče na povodcu', Icon: MessageCircle, tone: 'teal' as Tone },
];

const trustItems = [
  { title: 'Mirniji prvi dogovor', body: 'Odmah kažeš rutinu, navike, datume i što ljubimac ne voli.', Icon: CheckCircle2 },
  { title: 'Ljudi iz tvog kraja', body: 'Vidiš gdje rade, kako komuniciraju i kome bi stvarno vjerovao.', Icon: ShieldCheck },
  { title: 'Kad se nešto dogodi', body: 'Upit, savjet ili upozorenje ne ostaje zakopano u chatu.', Icon: UsersRound },
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
  #petpark-homepage-live-reference {
    background-size: auto, auto, auto, 22px 22px;
    background-image:
      radial-gradient(circle_at_8%_4%,rgba(225,237,216,.86),transparent_28%),
      radial-gradient(circle_at_88%_8%,rgba(251,233,219,.92),transparent_30%),
      linear-gradient(180deg,#FAF6EA_0%,#FFF9EF_48%,#FAF6EA_100%),
      radial-gradient(circle,rgba(15,107,87,.12) 1px,transparent 1.5px);
  }
  #petpark-homepage-live-reference .petpark-drift { animation: petpark-drift 7s ease-in-out infinite; }
  #petpark-homepage-live-reference .petpark-drift-delay { animation: petpark-drift 8.5s ease-in-out infinite; animation-delay: -2s; }
  #petpark-homepage-live-reference .petpark-drift-soft { animation: petpark-drift-soft 9s ease-in-out infinite; }
  #petpark-homepage-live-reference .petpark-pop-in { animation: petpark-pop-in .72s cubic-bezier(.16,1,.3,1) both; animation-delay: var(--delay, 0ms); }
  #petpark-homepage-live-reference .petpark-marquee { animation: petpark-marquee 28s linear infinite; }
  #petpark-homepage-live-reference .petpark-flow-up { animation: petpark-flow-up 18s linear infinite; }
  #petpark-homepage-live-reference .petpark-flow-down { animation: petpark-flow-down 21s linear infinite; }
  #petpark-homepage-live-reference .petpark-sheen {
    background-image: linear-gradient(110deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.22) 28%,rgba(255,255,255,0) 54%);
    background-size: 220% 100%;
    animation: petpark-sheen 4.8s ease-in-out infinite;
  }
  #petpark-homepage-live-reference .petpark-wave-band { animation: petpark-wave-band 16s ease-in-out infinite alternate; transform-origin: center; }
  #petpark-homepage-live-reference .petpark-pulse-dot::before {
    content: "";
    position: absolute;
    inset: -6px;
    border-radius: inherit;
    border: 1px solid rgba(242,106,0,.22);
    animation: petpark-pulse 2.4s ease-out infinite;
  }
  @keyframes petpark-drift {
    0%, 100% { transform: translate3d(0, 0, 0) rotate(-1deg); }
    50% { transform: translate3d(0, -10px, 0) rotate(1deg); }
  }
  @keyframes petpark-drift-soft {
    0%, 100% { transform: translate3d(0, 0, 0) rotate(1deg); }
    50% { transform: translate3d(10px, -12px, 0) rotate(-2deg); }
  }
  @keyframes petpark-pop-in {
    from { opacity: 0; transform: translate3d(0, 18px, 0) scale(.96); }
    to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
  }
  @keyframes petpark-marquee {
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(-50%, 0, 0); }
  }
  @keyframes petpark-flow-up {
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(0, -50%, 0); }
  }
  @keyframes petpark-flow-down {
    from { transform: translate3d(0, -50%, 0); }
    to { transform: translate3d(0, 0, 0); }
  }
  @keyframes petpark-sheen {
    0%, 42% { background-position: 160% 0; }
    68%, 100% { background-position: -80% 0; }
  }
  @keyframes petpark-wave-band {
    from { transform: translate3d(-1.5%, 0, 0) skewY(-1deg); }
    to { transform: translate3d(1.5%, -10px, 0) skewY(1deg); }
  }
  @keyframes petpark-pulse {
    0% { opacity: .75; transform: scale(.86); }
    100% { opacity: 0; transform: scale(1.7); }
  }
  @media (prefers-reduced-motion: reduce) {
    #petpark-homepage-live-reference .petpark-drift,
    #petpark-homepage-live-reference .petpark-drift-delay,
    #petpark-homepage-live-reference .petpark-drift-soft,
    #petpark-homepage-live-reference .petpark-pop-in,
    #petpark-homepage-live-reference .petpark-marquee,
    #petpark-homepage-live-reference .petpark-flow-up,
    #petpark-homepage-live-reference .petpark-flow-down,
    #petpark-homepage-live-reference .petpark-sheen,
    #petpark-homepage-live-reference .petpark-wave-band,
    #petpark-homepage-live-reference .petpark-pulse-dot::before { animation: none; }
  }
`;

function ToneBadge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em]',
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

function CategoryRailCard({ label, need, href, icon, tone }: (typeof categories)[number]) {
  return (
    <Link
      prefetch={false}
      href={href}
      className="group flex min-w-[210px] items-center gap-3 rounded-[22px] border border-[#E5DAC8] bg-[#FFFDF8]/92 p-3 pr-4 shadow-[0_12px_24px_rgba(80,55,25,.07)] transition duration-300 hover:-translate-y-1 hover:rotate-[-.6deg] hover:shadow-[0_18px_34px_rgba(80,55,25,.11)] active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26A00] lg:min-w-0"
    >
      <span className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px]', tone === 'orange' ? 'bg-[#FBE9DB]' : 'bg-[#E9F0DF]')}>
        <Image src={officialCategoryIcons[icon]} alt="" width={42} height={42} className="h-[42px] w-[42px]" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-black leading-5 text-[#14231D]">{label}</span>
        <span className="mt-1 block text-[12px] font-semibold leading-4 text-[#607069]">{need}</span>
      </span>
    </Link>
  );
}

function QuickIcon({ tone, Icon }: { tone: Tone; Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <span
      className={cn(
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] text-white',
        tone === 'teal' && 'bg-[#159C98]',
        tone === 'orange' && 'bg-[#F26A00]',
        tone === 'green' && 'bg-[#286D45]',
        tone === 'yellow' && 'bg-[#D49A1F]',
      )}
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

function StoryCard({ title, text, meta, image, tone }: (typeof storyCards)[number]) {
  return (
    <article className="group relative min-h-[340px] overflow-hidden rounded-[30px] border border-[#E5DAC8] bg-[#123829] shadow-[0_20px_48px_rgba(24,62,46,.16)] transition duration-300 hover:-translate-y-1 hover:rotate-[.5deg]">
      <Image src={image} alt="" fill sizes="(min-width: 1024px) 31vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.035]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,47,35,.05)_0%,rgba(9,47,35,.78)_100%)]" />
      <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/20 bg-[#123829]/78 p-5 text-white shadow-[0_16px_34px_rgba(0,0,0,.20)] backdrop-blur-md">
        <ToneBadge tone={tone}>{meta}</ToneBadge>
        <h3 className="mt-3 text-[22px] font-black leading-[26px] tracking-[-0.03em]">{title}</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-white/76">{text}</p>
      </div>
    </article>
  );
}

function FeedItem({ item }: { item: (typeof liveFeed)[number] }) {
  const Icon = item.Icon;

  return (
    <article className="grid grid-cols-[54px_minmax(0,1fr)] gap-3 rounded-[24px] border border-[#E5DAC8] bg-[#FFFDF8] p-4 shadow-[0_12px_26px_rgba(80,55,25,.07)]">
      <QuickIcon tone={item.tone} Icon={Icon} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <ToneBadge tone={item.tone}>{item.badge}</ToneBadge>
          <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#69756F]">
            <Clock className="h-3.5 w-3.5" />
            {item.time}
          </span>
        </div>
        <h3 className="mt-2 text-[17px] font-black leading-[22px] tracking-[-0.015em] text-[#14231D]">{item.title}</h3>
        <p className="mt-1.5 text-[13px] font-semibold leading-5 text-[#5D6D66]">{item.body}</p>
        <p className="mt-3 flex items-center gap-1 text-[12px] font-black text-[#C65F26]">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {item.location}
        </p>
      </div>
    </article>
  );
}

function QuickCard({ title, body, href, Icon, tone }: (typeof quickAccess)[number]) {
  return (
    <Link
      prefetch={false}
      href={href}
      className="group flex items-start gap-3 rounded-[24px] border border-[#E5DAC8] bg-[#FFFDF8] p-4 shadow-[0_12px_26px_rgba(80,55,25,.07)] transition duration-300 hover:-translate-y-1 hover:rotate-[-.4deg] hover:shadow-[0_18px_34px_rgba(80,55,25,.11)] active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26A00]"
    >
      <QuickIcon tone={tone} Icon={Icon} />
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-black leading-5 text-[#17231D]">{title}</span>
        <span className="mt-1.5 block text-[13px] font-semibold leading-[19px] text-[#5A6963]">{body}</span>
      </span>
      <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-[#8B958D] transition group-hover:translate-x-0.5 group-hover:text-[#C65F26]" />
    </Link>
  );
}

function FlowCard({ title, meta, Icon, tone }: (typeof flowItems)[number]) {
  return (
    <div className="flex items-center gap-3 rounded-[24px] border border-white/16 bg-white/12 p-3 text-white shadow-[0_14px_30px_rgba(8,35,27,.16)] backdrop-blur-md">
      <span
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px]',
          tone === 'orange' && 'bg-[#FFE0BC] text-[#C65F26]',
          tone === 'green' && 'bg-[#DCF0E4] text-[#1D7862]',
          tone === 'teal' && 'bg-[#DDF1EE] text-[#08776F]',
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-black leading-5">{title}</span>
        <span className="mt-0.5 block text-[12px] font-semibold leading-4 text-white/70">{meta}</span>
      </span>
    </div>
  );
}

function MotionFlowSection() {
  const repeatedFlow = flowItems.concat(flowItems);

  return (
    <section className="relative flex flex-col overflow-hidden rounded-[34px] border border-[#0F6B57]/18 bg-[#0F6B57] p-5 text-white shadow-[0_24px_60px_rgba(18,56,41,.18)] sm:p-7 lg:grid lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-8 lg:p-8">
      <div className="petpark-sheen pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative z-10">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#FFE0BC]">Dan s ljubimcem</p>
        <h2 className="mt-3 max-w-[520px] font-serif text-[34px] font-black leading-[.98] tracking-[-0.055em] sm:text-5xl lg:text-[58px]">
          Nije katalog. Više je kao netko tko je tu kad zapne.
        </h2>
        <p className="mt-4 max-w-[520px] text-[15px] font-semibold leading-7 text-white/74 sm:text-base">
          Jedan dan trebaš čuvanje, drugi savjet, treći pomoć oko izgubljenog ljubimca. PetPark drži te trenutke zajedno, bez traženja po deset grupa.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link prefetch={false} href="/pretraga" className="inline-flex h-12 items-center justify-center gap-2 rounded-[16px] bg-[#FFE0BC] px-5 text-sm font-black text-[#123829] shadow-[0_14px_28px_rgba(0,0,0,.14)] transition hover:-translate-y-1 active:scale-[.98]">
            <Search className="h-5 w-5" />
            Otvori pretragu
          </Link>
          <Link prefetch={false} href="/zajednica" className="inline-flex h-12 items-center justify-center gap-2 rounded-[16px] border border-white/22 bg-white/10 px-5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/16 active:scale-[.98]">
            <MessageCircle className="h-5 w-5" />
            Zajednica
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-6 grid gap-2.5 sm:hidden">
        {flowItems.slice(0, 3).map((item, index) => (
          <div
            className="petpark-pop-in"
            key={`${item.title}-mobile-${index}`}
            style={{ '--delay': `${index * 110 + 120}ms` } as React.CSSProperties}
          >
            <FlowCard {...item} />
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-7 hidden h-[306px] grid-cols-2 gap-3 overflow-hidden sm:grid lg:mt-0">
        <div className="petpark-flow-up grid gap-3">
          {repeatedFlow.map((item, index) => <FlowCard key={`${item.title}-up-${index}`} {...item} />)}
        </div>
        <div className="petpark-flow-down hidden gap-3 sm:grid">
          {repeatedFlow.slice().reverse().map((item, index) => <FlowCard key={`${item.title}-down-${index}`} {...item} />)}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0F6B57] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0F6B57] to-transparent" />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative min-h-[430px] lg:min-h-[650px]">
      <div className="petpark-wave-band absolute inset-x-[-22px] bottom-[34px] h-[270px] rounded-[52%_48%_0_0/42%_48%_0_0] bg-[#A8D8CF] opacity-90 shadow-[inset_0_1px_0_rgba(255,255,255,.35)] sm:bottom-[52px] lg:bottom-[70px]" />
      <div className="absolute inset-x-0 top-8 h-[340px] overflow-hidden rounded-[34px] border border-[#E7DDCC] bg-[#FFFDF8]/80 shadow-[0_28px_70px_rgba(80,55,25,.16)] sm:h-[430px] lg:top-12 lg:h-[500px] lg:rounded-[42px]">
        <Image
          src="/images/design-lab/petpark-reference-hero-tablet-clean.webp"
          alt="Pas i mačka u PetPark zajednici"
          fill
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,238,0)_40%,rgba(17,54,40,.18)_100%)]" />
      </div>

      {heroSignals.map(({ label, value, Icon, tone, className }, index) => (
        <div
          key={label}
          className={cn('petpark-pop-in absolute hidden min-w-[154px] items-center gap-2 rounded-[22px] border border-white/70 bg-[#FFFDF8]/92 p-3 shadow-[0_14px_30px_rgba(80,55,25,.14)] backdrop-blur-md sm:flex', className)}
          style={{ '--delay': `${index * 120 + 120}ms` } as React.CSSProperties}
        >
          <span
            className={cn(
              'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px]',
              tone === 'orange' && 'bg-[#FBE9DB] text-[#F26A00]',
              tone === 'green' && 'bg-[#E9F0DF] text-[#1D7862]',
              tone === 'teal' && 'bg-[#DDF1EE] text-[#159C98]',
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[11px] font-black uppercase tracking-[0.1em] text-[#C65F26]">{label}</span>
            <span className="block text-sm font-black leading-4 text-[#123D36]">{value}</span>
          </span>
        </div>
      ))}

      <div className="petpark-drift absolute left-4 top-8 max-w-[210px] rounded-[24px] border border-white/70 bg-[#FFFDF8]/92 p-4 shadow-[0_16px_34px_rgba(80,55,25,.14)] backdrop-blur-md sm:left-8 lg:left-[-18px] lg:top-16">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FBE9DB] text-[#F26A00]">
            <Camera className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#C65F26]">Update stigao</p>
            <p className="text-sm font-black text-[#123D36]">Luna je pojela večeru.</p>
          </div>
        </div>
      </div>

      <div className="petpark-drift-delay absolute bottom-4 right-2 w-[260px] rounded-[26px] border border-white/70 bg-[#FFFDF8]/94 p-4 shadow-[0_18px_40px_rgba(80,55,25,.16)] backdrop-blur-md sm:right-8 lg:right-0">
        <p className="text-[11px] font-black uppercase tracking-[0.1em] text-[#C65F26]">Danas na PetParku</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {heroMoments.map(({ label, value, Icon }) => (
            <div key={label} className="rounded-[16px] bg-[#FAF3E7] p-2.5">
              <Icon className="h-4 w-4 text-[#1D7862]" />
              <p className="mt-2 text-[12px] font-black leading-4 text-[#123D36]">{value}</p>
              <p className="mt-0.5 text-[10px] font-bold leading-3 text-[#63716B]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="petpark-drift-soft absolute bottom-0 left-3 hidden rounded-[24px] border border-[#E7DDCC] bg-[#123829] px-4 py-3 text-white shadow-[0_16px_34px_rgba(18,56,41,.18)] sm:block lg:left-10">
        <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#FFE0BC]">Care portal</p>
        <p className="mt-1 text-sm font-black">3 nova upita u blizini</p>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="relative z-20 flex h-16 items-center justify-between gap-5 lg:h-[72px]">
      <Link prefetch={false} href="/" aria-label="PetPark početna" className="shrink-0">
        <PetParkLogo width={188} height={44} priority className="h-9 w-auto lg:h-11" />
      </Link>
      <nav aria-label="Glavna navigacija" className="hidden items-center gap-1 rounded-full border border-[#E5DAC8] bg-[#FFFDF8]/86 p-1 shadow-[0_10px_24px_rgba(80,55,25,.06)] backdrop-blur lg:flex">
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
      <div className="flex shrink-0 items-center gap-2 lg:gap-3">
        <Link prefetch={false} href="/prijava" className="hidden h-11 items-center justify-center rounded-full border border-[#D8CBB8] bg-[#FFFDF8] px-5 text-sm font-black text-[#123D36] shadow-[0_8px_18px_rgba(80,55,25,.06)] sm:inline-flex">
          Prijava
        </Link>
        <Link prefetch={false} href="/postani-sitter" className="petpark-pulse-dot relative inline-flex h-10 items-center justify-center rounded-full bg-[#F26A00] px-4 text-[12px] font-black text-white shadow-[0_12px_24px_rgba(242,106,0,.22)] transition hover:-translate-y-0.5 active:scale-[.98] sm:h-11 sm:px-5 sm:text-sm">
          Postani sitter
        </Link>
      </div>
    </header>
  );
}

function HomeContent() {
  return (
    <div className="relative mx-auto flex w-full max-w-[1360px] flex-col gap-9 px-[18px] pb-12 pt-4 sm:px-8 lg:gap-14 lg:px-8 lg:pb-16 lg:pt-6 xl:px-12">
      <Header />

      <section className="grid gap-8 pt-3 lg:min-h-[650px] lg:grid-cols-[minmax(0,1.02fr)_minmax(430px,.98fr)] lg:items-center lg:gap-12">
        <div className="relative z-10 max-w-[740px]">
          <div className="petpark-pop-in inline-flex items-center gap-2 rounded-full border border-[#E9E0D1] bg-[#FFFDF8]/92 px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#C65F26] shadow-sm sm:text-xs">
            <PawPrint className="h-4 w-4 fill-[#F26A00] text-[#F26A00]" />
            Za dane kad trebaš nekoga svog
          </div>
          <h1 className="petpark-pop-in mt-5 max-w-[720px] font-serif text-[40px] font-black leading-[0.98] tracking-[-0.058em] text-[#003B2F] min-[390px]:text-[43px] sm:text-[64px] lg:mt-7 lg:text-[78px] xl:text-[86px]" style={{ '--delay': '90ms' } as React.CSSProperties}>
            Kad ne možeš biti uz njih, nađi nekoga tko može.
          </h1>
          <p className="petpark-pop-in mt-5 max-w-[650px] text-[16px] font-semibold leading-[25px] text-[#46545A] sm:text-[19px] sm:leading-[30px] lg:mt-6 lg:text-[20px] lg:leading-8" style={{ '--delay': '170ms' } as React.CSSProperties}>
            Čuvanje preko vikenda, šetnja nakon posla, grooming prije puta ili alarm kad se ljubimac izgubi. PetPark je mjesto za sve one situacije kad ti treba pomoć, ali ne želiš birati naslijepo.
          </p>
          <div className="petpark-pop-in mt-7 flex flex-col gap-3 sm:flex-row lg:mt-8" style={{ '--delay': '250ms' } as React.CSSProperties}>
            <Link prefetch={false} href="/pretraga" className="inline-flex h-13 items-center justify-center gap-2 rounded-[16px] bg-[#F26A00] px-6 text-[15px] font-black text-white shadow-[0_16px_30px_rgba(242,106,0,.24)] transition hover:-translate-y-1 hover:rotate-[-.5deg] active:scale-[.98] sm:h-14 sm:px-7 sm:text-base">
              <Search className="h-5 w-5" />
              Nađi pomoć danas
            </Link>
            <Link prefetch={false} href="/izgubljeni/prijavi" className="inline-flex h-13 items-center justify-center gap-2 rounded-[16px] border border-[#4F7772] bg-[#FFFDF8] px-6 text-[15px] font-black text-[#103D3A] shadow-[0_10px_22px_rgba(80,55,25,.07)] transition hover:-translate-y-1 hover:rotate-[.5deg] active:scale-[.98] sm:h-14 sm:px-7 sm:text-base">
              <Bell className="h-5 w-5" />
              Prijavi izgubljenog
            </Link>
          </div>
        </div>

        <HeroVisual />
      </section>

      <section aria-label="PetPark povjerenje" className="petpark-pop-in grid gap-3 sm:grid-cols-3" style={{ '--delay': '330ms' } as React.CSSProperties}>
        {trustItems.map(({ title, body, Icon }) => (
          <div key={title} className="rounded-[22px] border border-[#E7DDCC] bg-[#FFFDF8]/88 p-4 shadow-[0_12px_24px_rgba(80,55,25,.06)] transition duration-300 hover:-translate-y-1 hover:rotate-[-.5deg]">
            <Icon className="h-6 w-6 text-[#159C98]" />
            <p className="mt-3 text-sm font-black leading-5 text-[#003B2F]">{title}</p>
            <p className="mt-1 text-xs font-semibold leading-4 text-[#65746E]">{body}</p>
          </div>
        ))}
      </section>

      <section aria-label="PetPark usluge" className="-mx-[18px] overflow-hidden border-y border-[#E5DAC8] bg-[#FFF8ED]/70 py-4 sm:-mx-8 lg:mx-0 lg:rounded-[28px] lg:border lg:px-4 lg:shadow-[0_12px_26px_rgba(80,55,25,.06)]">
        <div className="flex gap-3 overflow-x-auto px-[18px] [scrollbar-width:none] sm:px-8 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 xl:grid-cols-6 [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => <CategoryRailCard key={category.label} {...category} />)}
        </div>
      </section>

      <MotionFlowSection />

      <section id="kako-radi" className="grid gap-5 lg:grid-cols-[.92fr_1.08fr] lg:items-start">
        <div className="rounded-[32px] border border-[#E5DAC8] bg-[#123829] p-6 text-white shadow-[0_22px_54px_rgba(18,56,41,.18)] lg:sticky lg:top-6 lg:min-h-[520px] lg:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#FFE0BC]">Kako ljudi stvarno traže</p>
          <h2 className="mt-3 max-w-[520px] font-serif text-[40px] font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[58px]">
            Prvo problem. Onda prava osoba.
          </h2>
          <p className="mt-5 max-w-[500px] text-[15px] font-semibold leading-7 text-white/74 sm:text-base">
            Nitko ne kreće od kategorije. Kreće od toga da radiš do kasno, putuješ za vikend, pas treba više kretanja ili mačka ne voli nepoznate ljude. PetPark te od toga vodi do pomoći koja ima smisla.
          </p>
          <div className="mt-8 grid gap-3">
            {['Kakav je ljubimac?', 'Što se stvarno događa?', 'Tko mu može odgovarati?'].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-[20px] border border-white/12 bg-white/8 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE0BC] text-sm font-black text-[#123829]">{index + 1}</span>
                <span className="text-sm font-black">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StoryCard {...storyCards[0]} />
          <div className="grid gap-4">
            {storyCards.slice(1).map((card) => <StoryCard key={card.title} {...card} />)}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-[32px] border border-[#E7DDCC] bg-[#FFF7EC]/82 p-5 shadow-[0_18px_38px_rgba(80,55,25,.08)] sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#C65F26]">Iz susjedstva</p>
              <h2 className="mt-1 font-serif text-[36px] font-black tracking-[-0.05em] text-[#003B2F] sm:text-5xl">Što se danas događa</h2>
            </div>
            <Link prefetch={false} href="/zajednica" className="inline-flex items-center gap-1 rounded-full bg-[#FFFDF8] px-4 py-2 text-sm font-black text-[#C65F26] shadow-sm">
              Sve <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {liveFeed.map((item) => <FeedItem key={item.title} item={item} />)}
          </div>
        </div>

        <div className="grid gap-3 content-start">
          {quickAccess.map((item) => <QuickCard key={item.title} {...item} />)}
          <div className="overflow-hidden rounded-[28px] border border-[#E5DAC8] bg-[#FFFDF8] py-4 shadow-[0_12px_26px_rgba(80,55,25,.07)]">
            <div className="petpark-marquee flex w-[200%] gap-3 whitespace-nowrap px-4 text-[13px] font-black text-[#123D36]">
              {['Čuvanje u Rijeci', 'Šetnja nakon posla', 'Grooming termin', 'Pitanje treneru', 'Izgubljeni ljubimac', 'Udomljavanje', 'Kvartovska preporuka', 'Foto update'].concat(['Čuvanje u Rijeci', 'Šetnja nakon posla', 'Grooming termin', 'Pitanje treneru', 'Izgubljeni ljubimac', 'Udomljavanje', 'Kvartovska preporuka', 'Foto update']).map((item, index) => (
                <span key={`${item}-${index}`} className="rounded-full bg-[#FAF3E7] px-4 py-2">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <span className="sr-only">Preview mode ready</span>
    </div>
  );
}

export function HomepageRedesign({ mode = 'production' }: HomepageRedesignProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shellHideCss }} />
      <main id="petpark-homepage-live-reference" className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_8%_4%,rgba(225,237,216,.86),transparent_28%),radial-gradient(circle_at_88%_8%,rgba(251,233,219,.92),transparent_30%),linear-gradient(180deg,#FAF6EA_0%,#FFF9EF_48%,#FAF6EA_100%)] text-[#003B2F]">
        <HomeContent />
        {mode === 'preview' ? <span className="sr-only">Preview mode</span> : null}
        <footer id="petpark-home-footer" className="sr-only">PetPark</footer>
      </main>
    </>
  );
}
