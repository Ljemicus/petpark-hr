# ENV-MATRIX — 2026-07-03

Izvori:

- Web: `docs/truth/env-usage-web.txt`
- Mobile: `/Users/ljemicus/Projects/petpark-mobile/docs/truth/env-usage-mobile.txt`

Vrijednosti tajni nisu ispisivane.

## Web — obavezno / fail-closed

| Varijabla                                                                          | Namjena                | Obavezna?                       | Kad fali                                    |
| ---------------------------------------------------------------------------------- | ---------------------- | ------------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                                                         | Supabase public client | Da                              | app/auth/data rute pucaju; treba fail jasno |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`                                                    | Supabase anon client   | Da                              | app/auth/data rute pucaju; treba fail jasno |
| `SUPABASE_SERVICE_ROLE_KEY`                                                        | server/admin operacije | Da za server rute               | mora fail-closed u produkciji               |
| `UPSTASH_REDIS_REST_URL`                                                           | rate limiting          | Da za produkciju                | osjetljive rute trebaju fail-closed         |
| `UPSTASH_REDIS_REST_TOKEN`                                                         | rate limiting          | Da za produkciju                | osjetljive rute trebaju fail-closed         |
| `CRON_SECRET`                                                                      | cron autorizacija      | Da za cron                      | cron rute moraju odbiti zahtjev             |
| `SMS_INTERNAL_KEY` + provider keys                                                 | SMS slanje             | Da ako SMS uključen             | ruta mora odbiti slanje                     |
| `RESEND_API_KEY`, `EMAIL_FROM`                                                     | email                  | Da ako email uključen           | ruta mora odbiti slanje ili queue           |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | payments               | Ne dok `PAYMENTS_ENABLED=false` | payments rute moraju 503 bez Stripe poziva  |
| `PAYMENTS_ENABLED`                                                                 | server payment flag    | Da, default false               | false/fail-closed                           |

## Web — javni/operativni

`NEXT_PUBLIC_APP_URL`, `APP_URL`, `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_APP_VERSION`, `APP_VERSION`, `VERCEL_ENV`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `SLACK_OPS_WEBHOOK`, `SLACK_INCIDENTS_WEBHOOK`, `NEXT_PUBLIC_GSC_TOKEN`, Google/Cloudinary/analytics/VAPID varijable.

## Mobile

| Varijabla                       | Namjena                | Obavezna?                     | Kad fali             |
| ------------------------------- | ---------------------- | ----------------------------- | -------------------- |
| `EXPO_PUBLIC_API_URL`           | web API endpoint       | Da za API smoke               | API pozivi ne rade   |
| `EXPO_PUBLIC_SUPABASE_URL`      | Supabase mobile client | Da                            | auth/data ne rade    |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase mobile client | Da                            | auth/data ne rade    |
| `EXPO_PUBLIC_SENTRY_DSN`        | RN observability       | Ne za lokalni dev, da za prod | nema error reporting |

## NextAuth presuda

Grep je našao `NEXTAUTH` samo u `lib/api/env.ts`. Nema potvrde aktivnog NextAuth toka u inventuri; tretirati kao legacy kandidat za KIT-D čišćenje tek nakon dodatne provjere referenci.
