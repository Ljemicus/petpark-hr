# PetPark audit diagnostics — 2026-06-12

## D1 canonical + generateMetadata

```
app/(site)/postani-sitter/oglas/page.tsx:17:  alternates: { canonical: 'https://petpark.hr/postani-sitter/oglas' },
app/(site)/postani-sitter/page.tsx:17:  alternates: { canonical: 'https://petpark.hr/postani-sitter' },
app/(site)/udruge/page.tsx:26:    canonical: `${BASE_URL}/udruge`,
app/(site)/udruge/[slug]/page.tsx:68:      canonical: `${BASE_URL}/udruge/${slug}`,
app/(site)/o-nama/en/page.tsx:12:  alternates: { canonical: 'https://petpark.hr/o-nama/en' },
app/(site)/o-nama/page.tsx:14:  alternates: { canonical: 'https://petpark.hr/o-nama' },
app/(site)/kontakt/layout.tsx:13:  alternates: { canonical: 'https://petpark.hr/kontakt' },
app/(site)/trener/[id]/page.tsx:41:    alternates: { canonical: `/trener/${id}` },
app/(site)/udomljavanje/udruga/[id]/page.tsx:29:      canonical: `${BASE_URL}/udomljavanje/udruga/${publisher.id}`,
app/(site)/groomer/[id]/page.tsx:41:    alternates: { canonical: `/groomer/${id}` },
app/(site)/zaboravljena-lozinka/page.tsx:8:  alternates: { canonical: 'https://petpark.hr/zaboravljena-lozinka' },
app/(site)/privatnost/page.tsx:10:  alternates: { canonical: 'https://petpark.hr/privatnost' },
app/(site)/blog/page.tsx:19:  alternates: { canonical: 'https://petpark.hr/blog' },
app/(site)/blog/[slug]/page.tsx:50:      canonical: `${BASE_URL}/blog/${slug}`,
app/(site)/apelacije/page.tsx:31:    canonical: `${BASE_URL}/apelacije`,
app/(site)/apelacije/[slug]/page.tsx:60:      canonical: `${BASE_URL}/apelacije/${slug}`,
app/(site)/forum/[id]/page.tsx:73:      canonical: `${BASE_URL}/forum/${id}`,
app/(site)/forum/page.tsx:46:      canonical: lang === 'en' ? 'https://petpark.hr/forum/en' : 'https://petpark.hr/forum',
app/(site)/hitno/page.tsx:17:  alternates: { canonical: 'https://petpark.hr/hitno' },
app/(site)/uzgajivacnice/[id]/page.tsx:20:      canonical: `${BASE_URL}/uzgajivacnice/${id}`,
app/(site)/uvjeti/page.tsx:10:  alternates: { canonical: 'https://petpark.hr/uvjeti' },
app/(site)/nova-lozinka/page.tsx:8:  alternates: { canonical: 'https://petpark.hr/nova-lozinka' },
app/(site)/sitter/[id]/page.tsx:53:    alternates: { canonical: `/sitter/${id}` },
app/(site)/zajednica/page.tsx:40:    canonical: 'https://petpark.hr/zajednica',
app/(site)/zajednica/[slug]/page.tsx:65:      canonical: `${BASE_URL}/zajednica/${slug}`,
app/(site)/prijava/page.tsx:8:  alternates: { canonical: 'https://petpark.hr/prijava' },
app/(site)/registracija/page.tsx:8:  alternates: { canonical: 'https://petpark.hr/registracija' },
app/layout.tsx:44:    canonical: 'https://petpark.hr',
app/page.tsx:8:    canonical: 'https://petpark.hr/',
--- generateMetadata files ---
app/(site)/udruge/[slug]/page.tsx
app/(site)/veterinari/[slug]/page.tsx
app/(site)/trener/[id]/page.tsx
app/(site)/udomljavanje/udruga/[id]/page.tsx
app/(site)/udomljavanje/en/[id]/page.tsx
app/(site)/udomljavanje/[id]/page.tsx
app/(site)/groomer/[id]/page.tsx
app/(site)/blog/[slug]/page.tsx
app/(site)/apelacije/[slug]/page.tsx
app/(site)/dashboard/rescue/apelacije/[appealId]/page.tsx
app/(site)/forum/[id]/page.tsx
app/(site)/uzgajivacnice/[id]/page.tsx
app/(site)/usluge/[slug]/page.tsx
app/(site)/sitter/[id]/page.tsx
app/(site)/zajednica/[slug]/page.tsx
app/(site)/izgubljeni/en/[id]/page.tsx
app/(site)/izgubljeni/[id]/letak/page.tsx
app/(site)/izgubljeni/[id]/page.tsx
```

## D2 GSC placeholder

```
app/layout.tsx:82:    google: 'google-site-verification-code',
```

## D3 internal draft listing

```
NIJE u kodu → vjerojatno u bazi (vidi T4)
```

## D4 untranslated enums

```

```

## D5 hardcoded homepage feed

```
app/(site)/mapa/page.tsx:32:  { title: 'Grooming Luna', type: 'Groomer', location: 'Zagreb · Maksimir', href: '/usluge', tone: 'orange' as const, x: 62, y: 31, icon: Sparkles },
app/(site)/cuvanje-pasa-zagreb/en/page-data.ts:14:    'Find pet sitters in Zagreb. Dog sitting in your neighborhood — Maksimir, Trešnjevka, Novi Zagreb, Dubrava and more. Send an inquiry online.',
app/(site)/cuvanje-pasa-zagreb/en/page-data.ts:28:    'Our platform covers all Zagreb neighborhoods and city districts. Whether you live in Trešnjevka, Maksimir, Novi Zagreb, Dubrava, Jarun, Trnje or Stenjevec — on PetPark you will find a sitter near your home. This is especially important because dogs feel better when they stay in a familiar environment or at least close to it.',
app/(site)/cuvanje-pasa-zagreb/en/page-data.ts:32:    { name: 'Maksimir', desc: 'Near Maksimir park-forest, ideal for walks' },
app/(site)/cuvanje-pasa-zagreb/en/page-data.ts:46:    'Zagreb is rich in green spaces that are great for walks and play with your pet. Maksimir park-forest is the largest and most famous city park with kilometers of trails through forest and grassy areas. Many Zagreb sitters use Maksimir for long walks because it offers plenty of space where dogs can safely run and explore.',
app/(site)/cuvanje-pasa-zagreb/en/page-data.ts:50:    { name: 'Maksimir Park-Forest', feature: 'Kilometers of forest trails' },
app/(site)/cuvanje-pasa-zagreb/page.tsx:23:  description: 'Pronađite pet sittere u Zagrebu i pošaljite upit za čuvanje. Čuvanje pasa u vašem kvartu — Maksimir, Trešnjevka, Novi Zagreb, Dubrava i drugi. Pošaljite upit online.',
app/(site)/cuvanje-pasa-zagreb/page.tsx:155:              Naša platforma pokriva sve zagrebačke kvartove i gradske četvrti. Bez obzira živite li na Trešnjevci,
app/(site)/cuvanje-pasa-zagreb/page.tsx:156:              u Maksimiru, Novom Zagrebu, Dubravi, na Jarunu, Trnju ili u Stenjevcu — na PetParku ćete pronaći
app/(site)/cuvanje-pasa-zagreb/page.tsx:173:                { name: 'Maksimir', desc: 'Blizina park-šume Maksimir, idealno za šetnje' },
app/(site)/cuvanje-pasa-zagreb/page.tsx:210:              Zagreb obiluje zelenim površinama koje su odlične za šetnje i igru s vašim ljubimcem. Park-šuma Maksimir
app/(site)/cuvanje-pasa-zagreb/page.tsx:212:              zagrebački sitteri koriste Maksimir za dugačke šetnje jer nudi obilje prostora gdje psi mogu sigurno
app/(site)/cuvanje-pasa-zagreb/page.tsx:225:              { name: 'Park-šuma Maksimir', feature: 'Kilometri šumskih staza' },
app/(site)/udomljavanje/adoption-browse-content.tsx:49:    id: 'toto', status: 'active', name: 'Toto', species: 'cat', breed: 'Europska kratkodlaka', age_months: 8, gender: 'male', size: 'small', city: 'Zagreb', images: [], is_urgent: false, published_at: '2026-05-11', publisher_display_name: 'Privremeni dom Maksimir',
app/(site)/dashboard/groomer/components/groomer-onboarding-wizard.tsx:79:  'Centar', 'Trešnjevka', 'Trnje', 'Maksimir', 'Dubrava', 'Novaki',
app/(site)/dashboard/sitter/components/sitter-onboarding-wizard.tsx:45:  'Centar', 'Trešnjevka', 'Trnje', 'Maksimir', 'Dubrava', 'Novaki',
app/(site)/dashboard/trainer/components/trainer-onboarding-wizard.tsx:54:  'Centar', 'Trešnjevka', 'Trnje', 'Maksimir', 'Dubrava', 'Novaki',
app/(site)/izgubljeni/[id]/lost-pet-detail-content.tsx:820:                        placeholder={isEn ? 'e.g. Maksimir Park, near the lake' : 'npr. Park Maksimir, kod jezera'}
app/(site)/izgubljeni/prijavi/report-content.tsx:329:                  <Input id="neighborhood" name="neighborhood" placeholder="npr. Maksimir" required />
app/(site)/izgubljeni/lost-pets-content.tsx:73:    neighborhood: 'Maksimir',
```

## D6 fake count

```

```

## D7 duplicate brand suffix

```
app/(site)/postani-sitter/oglas/page.tsx:12:    title: 'Postani sitter — fleksibilan rad s ljubimcima | PetPark',
app/(site)/postani-sitter/page.tsx:12:    title: 'Postani sitter — fleksibilan rad s ljubimcima | PetPark',
app/(site)/udruge/page.tsx:10:  title: { absolute: 'Rescue udruge i organizacije | PetPark' },
app/(site)/udruge/page.tsx:13:    title: 'Rescue udruge i organizacije | PetPark',
app/(site)/udruge/page.tsx:22:    title: 'Rescue udruge i organizacije | PetPark',
app/(site)/o-nama/en/page.tsx:10:  title: { absolute: 'About Us — Our Story | PetPark' },
app/(site)/o-nama/page.tsx:12:  title: { absolute: 'O nama — Naša priča | PetPark' },
app/(site)/mapa/page.tsx:17:  title: 'PetPark mapa | PetPark',
app/(site)/profil/page.tsx:41:  title: 'Profil | PetPark',
app/(site)/veterinari/en/page.tsx:11:    title: 'Veterinary stations and clinics in Croatia | PetPark',
app/(site)/veterinari/page.tsx:13:    title: 'Veterinarske stanice i ambulante u Hrvatskoj | PetPark',
app/(site)/veterinari/[slug]/page.tsx:17:      title: 'Veterinar nije pronađen | PetPark',
app/(site)/veterinari/[slug]/page.tsx:22:    title: `${vet.name} | Recenzije i kontakt | PetPark`,
app/(site)/cuvanje-pasa-zagreb/page.tsx:26:    title: 'Čuvanje pasa u Zagrebu — pronađite pouzdanog sittera | PetPark',
app/(site)/cuvanje-pasa-zagreb/page.tsx:34:    title: 'Čuvanje pasa u Zagrebu — pronađite pouzdanog sittera | PetPark',
app/(site)/dog-friendly/en/page.tsx:13:    title: 'Dog-friendly places in Croatia | PetPark',
app/(site)/dog-friendly/page.tsx:12:    title: 'Dog-Friendly lokacije u Hrvatskoj | PetPark',
app/(site)/ai-matching/page.tsx:5:  title: 'AI Pronalaženje Čuvara | PetPark',
app/(site)/ai-matching/page.tsx:8:    title: 'AI Pronalaženje Čuvara | PetPark',
app/(site)/redizajn-preview/usluge/page.tsx:5:  title: { absolute: 'PetPark usluge redizajn preview | PetPark' },
app/(site)/redizajn-preview/listinzi/page.tsx:9:  title: { absolute: 'PetPark listinzi redizajn preview | PetPark' },
app/(site)/njega/en/page.tsx:10:    title: 'Pet Grooming — Professional Grooming Salons | PetPark',
app/(site)/njega/page.tsx:10:    title: 'Njega ljubimaca — grooming saloni i usluge | PetPark',
app/(site)/kontakt/layout.tsx:8:    title: 'Kontakt — javite nam se | PetPark',
app/(site)/pet-passport/pdf/page.tsx:5:  title: 'Pet Passport PDF | PetPark',
app/(site)/pet-passport/page.tsx:5:  title: 'Pet Passport | PetPark',
app/(site)/trener/[id]/page.tsx:39:    title: { absolute: `${publicTrainer.name} | PetPark` },
app/(site)/faq/en/page.tsx:13:    title: 'Frequently asked questions | PetPark',
app/(site)/faq/page.tsx:51:    title: 'Često postavljena pitanja | PetPark',
app/(site)/hitna-pomoc/page.tsx:5:  title: 'Hitna veterinarska pomoć | PetPark',
app/(site)/hitna-pomoc/page.tsx:8:    title: 'Hitna veterinarska pomoć | PetPark',
app/(site)/udomljavanje/udruga/[id]/page.tsx:26:    title: `${publisher.display_name} — Udomljavanje | PetPark`,
app/(site)/udomljavanje/en/[id]/page.tsx:22:    title: `${listing.name} — Adoption | PetPark`,
app/(site)/udomljavanje/en/[id]/page.tsx:26:      title: `${listing.name} is looking for a home | PetPark`,
app/(site)/udomljavanje/en/page.tsx:11:    title: 'Adoption — dogs and cats looking for a home | PetPark',
app/(site)/udomljavanje/[id]/page.tsx:22:    title: `${listing.name} — Udomljavanje | PetPark`,
app/(site)/udomljavanje/[id]/page.tsx:26:      title: `${listing.name} traži dom | PetPark`,
app/(site)/udomljavanje/page.tsx:14:    title: 'Udomljavanje — psi i mačke traže dom | PetPark',
app/(site)/kalendar/dan/page.tsx:5:  title: 'Dnevni raspored | PetPark',
app/(site)/kalendar/page.tsx:5:  title: 'Kalendar i rezervacije | PetPark',
app/(site)/groomer/[id]/page.tsx:39:    title: { absolute: `${publicGroomer.name} | PetPark` },
app/(site)/dresura/en/page.tsx:10:    title: 'Dog training — trainers and programmes | PetPark',
app/(site)/dresura/page.tsx:10:    title: 'Školovanje pasa — treneri i programi | PetPark',
app/(site)/admin/service-listings/page.tsx:8:  title: 'Service Listings moderacija | PetPark Admin',
app/(site)/moje-usluge/page.tsx:7:  title: 'Moje usluge | PetPark',
app/(site)/cuvanje-pasa-split/page.tsx:26:    title: 'Čuvanje pasa u Splitu — pronađite pouzdanog sittera | PetPark',
app/(site)/cuvanje-pasa-split/page.tsx:34:    title: 'Čuvanje pasa u Splitu — pronađite pouzdanog sittera | PetPark',
app/(site)/blog/page.tsx:14:    title: 'Blog — savjeti za vlasnike ljubimaca | PetPark',
app/(site)/blog/[slug]/page.tsx:31:    title: `${article.title} | PetPark`,
app/(site)/apelacije/page.tsx:15:  title: { absolute: 'Rescue apelacije | PetPark' },
app/(site)/apelacije/page.tsx:18:    title: 'Rescue apelacije | PetPark',
app/(site)/apelacije/page.tsx:27:    title: 'Rescue apelacije | PetPark',
app/(site)/dashboard/vlasnik/onboarding/page.tsx:10:  title: 'Dobrodošli — Vlasnik | PetPark',
app/(site)/dashboard/rescue/apelacije/[appealId]/page.tsx:24:    title: appealId === 'novo' ? 'Nova rescue apelacija | PetPark' : 'Uredi rescue apelaciju | PetPark',
app/(site)/dashboard/rescue/page.tsx:34:  title: 'Rescue dashboard | PetPark',
app/(site)/dashboard/adoption/new/page.tsx:9:export const metadata = { title: 'Novi oglas za udomljavanje | PetPark' };
app/(site)/dashboard/breeder/leglo/novo/page.tsx:16:  title: 'Novo leglo — Uzgajivač | PetPark',
app/(site)/dashboard/breeder/legla/page.tsx:13:  title: 'Moja legla — Uzgajivač | PetPark',
app/(site)/dashboard/breeder/upiti/page.tsx:15:  title: 'Upiti — Uzgajivač | PetPark',
app/(site)/dashboard/breeder/page.tsx:25:  title: 'Nadzorna ploča — Uzgajivač | PetPark',
app/(site)/dashboard/breeder/onboarding/page.tsx:10:  title: 'Dobrodošli — Uzgajivač | PetPark',
app/(site)/moji-upiti/page.tsx:8:  title: 'Moji upiti | PetPark',
app/(site)/forum/[id]/page.tsx:60:      title: `${topic.title} — Forum | PetPark`,
app/(site)/forum/[id]/page.tsx:68:      title: `${topic.title} — Forum | PetPark`,
app/(site)/forum/page.tsx:33:    hr: 'Forum za vlasnike ljubimaca | PetPark',
app/(site)/forum/page.tsx:34:    en: 'Pet Owner Forum | PetPark',
app/(site)/hitno/page.tsx:10:    title: 'Hitna veterinarska pomoć — brojevi i savjeti | PetPark',
app/(site)/uzgajivacnice/en/page.tsx:10:    title: 'Breeders — breeder profiles | PetPark',
app/(site)/uzgajivacnice/page.tsx:10:    title: 'Uzgajivači — profili uzgajivača | PetPark',
app/(site)/postavke/page.tsx:40:  title: 'Postavke | PetPark',
app/(site)/usluge/page.tsx:6:  title: 'Usluge za ljubimce | PetPark',
app/(site)/usluge/[slug]/page.tsx:7:  title: 'Čuvanje psa u kućnom okruženju | PetPark',
app/(site)/usluge/[slug]/page.tsx:19:  const title = `${service.title} | PetPark`;
app/(site)/upozorenja/page.tsx:19:  title: 'Upozorenja | PetPark',
app/(site)/sitter/[id]/page.tsx:51:    title: { absolute: `${publicProfile.name} | PetPark` },
app/(site)/cuvanje-pasa-rijeka/page.tsx:26:    title: 'Čuvanje pasa u Rijeci — pronađite pouzdanog sittera | PetPark',
app/(site)/cuvanje-pasa-rijeka/page.tsx:34:    title: 'Čuvanje pasa u Rijeci — pronađite pouzdanog sittera | PetPark',
app/(site)/grooming-zagreb/en/page.tsx:33:    title: 'Pet Grooming in Zagreb — Find a Grooming Salon for Your Pet | PetPark',
app/(site)/grooming-zagreb/en/page.tsx:42:    title: 'Pet Grooming in Zagreb — Find a Grooming Salon for Your Pet | PetPark',
app/(site)/grooming-zagreb/page.tsx:23:    title: 'Grooming saloni u Zagrebu — pronađite salon za ljubimca | PetPark',
app/(site)/zajednica/najbolji/page.tsx:8:  title: 'Najbolji ljubimac — Zajednica | PetPark',
app/(site)/zajednica/feed/page.tsx:5:  title: 'Zajednica | PetPark',
app/(site)/zajednica/page.tsx:37:  title: { absolute: 'Zajednica ljubitelja ljubimaca | PetPark' },
app/(site)/prijava/page.tsx:6:  title: 'Prijava | PetPark',
app/(site)/grupni-treninzi/page.tsx:5:  title: 'Grupni treninzi | PetPark',
app/(site)/izgubljeni/en/page.tsx:13:    title: 'Lost pets — report or find them | PetPark',
app/(site)/izgubljeni/page.tsx:12:    title: 'Izgubljeni ljubimci — prijavite ili pronađite | PetPark',
app/(site)/pretraga/search-page-shell.tsx:14:    openGraphTitle: 'Pronađite sittere i usluge za ljubimce | PetPark',
app/(site)/pretraga/search-page-shell.tsx:29:    openGraphTitle: 'Find sitters and pet services | PetPark',
app/(site)/onboarding/provider/page.tsx:12:  title: 'Onboarding providera | PetPark',
app/(site)/offline/page.tsx:4:  title: 'Offline | PetPark',
app/(site)/verifikacija/en/page.tsx:9:  title: { absolute: 'Sitter verification | PetPark' },
app/(site)/verifikacija/en/page.tsx:12:    title: 'Sitter verification | PetPark',
app/(site)/verifikacija/page.tsx:13:  title: { absolute: 'Verifikacija sittera | PetPark' },
app/(site)/verifikacija/page.tsx:16:    title: 'Verifikacija sittera | PetPark',
app/layout.tsx:27:    template: '%s | PetPark',
```

## D8 broken blog slug

```

```

## D9 HKS and /kontakt header

```
app/(site)/kontakt/layout.tsx:10:    url: 'https://petpark.hr/kontakt',
app/(site)/kontakt/layout.tsx:13:  alternates: { canonical: 'https://petpark.hr/kontakt' },
app/(site)/kontakt/page.tsx:3:import KontaktContent from './kontakt-content';
app/(site)/faq/faq-content.tsx:239:              <Link href="/kontakt">
app/(site)/dresura/training-content.tsx:309:            secondaryActionHref="/kontakt"
app/(site)/dashboard/breeder/components/breeder-onboarding-wizard.tsx:1159:                <p className="text-sm text-muted-foreground">HKS, HKL ili drugi kinološki klub</p>
app/(site)/grooming/grooming-content.tsx:323:            secondaryActionHref="/kontakt"
```

## D10 MVP copy

```

```

## D11 double bullets terms

```

```
