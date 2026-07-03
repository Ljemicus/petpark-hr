# SCHEMA GAPS — KIT-C read-only

Datum: 2026-07-03

## Types regeneration

Fresh remote Supabase types were generated read-only from project `hmtlcgjcxhjecsbmmxol`.

- Web existing convention: `lib/supabase/types.ts`
- Mobile existing convention: `lib/database.types.ts`

Result:

- Web `lib/supabase/types.ts` matches fresh generated remote output.
- Mobile `lib/database.types.ts` matches fresh generated remote output.
- No type files changed in this slice.
- Supabase CLI local note: type generation required neutral `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN` env because the default local env contains an invalid empty DSN for the CLI process.

## Known product/schema gaps

These are intentional disabled/blocked modules, not hidden production features:

| Module                     | Remote schema status                                                           | App status                                 |
| -------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------ |
| Forum                      | No `forum_*` tables                                                            | Disabled / `Uskoro`                        |
| Shop                       | No `products`, `cart_items`, `product_reviews` tables                          | Disabled / `Uskoro`, fake fallback removed |
| Breeder marketplace extras | No `litters`, `puppies`, `breeder_*` tables                                    | Disabled / honest unavailable states       |
| Payments activation        | Remote has payment-related canonical tables, but product payments are disabled | Routes/UI fail closed                      |
| Rescue extras              | No draft rescue tables on remote                                               | Not launch-ready                           |

## Rule

Do not create code paths that pretend these schemas exist. Any activation requires a new additive draft migration, RLS/storage tests, and explicit owner approval before remote apply.
