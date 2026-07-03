# EN / SEO surface — KIT-D refresh

Datum: 2026-07-03

## Existing `/en` route directories

- `/cuvanje-pasa-rijeka/en`
- `/cuvanje-pasa-split/en`
- `/cuvanje-pasa-zagreb/en`
- `/dog-friendly/en`
- `/dresura/en`
- `/faq/en`
- `/forum/en`
- `/grooming-zagreb/en`
- `/izgubljeni/en`
- `/njega/en`
- `/o-nama/en`
- `/pretraga/en`
- `/udomljavanje/en`
- `/uzgajivacnice/en`
- `/verifikacija/en`
- `/veterinari/en`

## Confirmed cleanup

- Root metadata does not advertise a non-existent `/en` homepage.
- Root layout keeps only `hr-HR` and `x-default` for the homepage.
- `/blog/en` references are absent from app/components/content.
- Private/checkout/onboarding/passport target routes use noindex layouts where applicable.
- `robots.ts` disallows `/dashboard/`, `/checkout/`, `/onboarding/`, `/design-lab/`, `/redizajn-preview/`, `/ljubimac/`, and `/setnja/`.
- `sitemap.ts` excludes checkout, dashboard, onboarding, design-lab, redizajn-preview, shop, forum details, and passport routes.
- Shop/cart/product pages render `DisabledModule`; shop layout is noindex.
- Draft-copy guard is wired in `prebuild` and passed on 2026-07-03.

## Fixes from this refresh

- Added `/o-nama` to localized sitemap alternates because `/o-nama/en` exists.
- Replaced `/postani-sitter/en` in `/o-nama/en` with existing `/postani-sitter` to avoid a 404.

## Still intentional

- V1 remains Croatian-first; existing EN leaf pages are not deleted.
- Forum/shop/breeder modules remain disabled/gated unless the matching remote schema and product approval exist.
