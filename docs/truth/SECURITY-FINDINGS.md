# KIT-B0 SECURITY FINDINGS — read-only dijagnostika (2026-07-02)

Ovaj dokument je samo input za KIT-B PR-ove. Nema produkcijskih promjena, nema deploya, nema DB writeova.

## Sažetak

- Mutirajuće API rute bez lokalnog CSRF signala: **112**.
- Payment/provider-connect rute sa Stripe signalom bez `PAYMENTS_ENABLED` gatea: **8**.
- Register flow sadrži `email_confirm: true` preko service-role admin clienta: **DA**.
- Upload rute validiraju MIME/ekstenziju/veličinu, ali nema dokaza content sniffinga/magic-byte validacije u dijagnostici.
- Admin rute imaju guard signale po rough grepu; ručni review i dalje potreban za stvarnu policy provjeru.

## PR-B1 — CSRF kandidati

Globalna CSRF zaštita postoji (`proxy.ts`, `middleware/csrf.ts`, `lib/csrf.ts`), ali lokalni handleri uglavnom nemaju explicit CSRF signal. Sljedeći PR mora pažljivo razlikovati browser cookie flow i mobile Bearer flow.

Detalji: `docs/truth/security-csrf-candidates.txt`.

## PR-B2 — Email verification

`app/(site)/api/auth/register/route.ts` koristi service-role admin client i `email_confirm: true`. To je human-gate promjena: ukloniti bypass tek nakon pregleda UX-a i Supabase email flowa.

## PR-B3 — Rate limiting

Postoje tri paralelna rate-limit helpera:

- `lib/rate-limit.ts`
- `lib/rate-limiter.ts`
- `lib/upstash-rate-limit.ts`

Neki helperi fail-open kad Redis env fali, drugi throwaju. PR-B3 treba standardizirati semantiku po ruti: auth/sensitive ne smiju tiho fail-open u produkciji.

## PR-B4 — Upload hardening

Upload kandidati: `docs/truth/security-upload-candidates.txt`. Posebno provjeriti:

- `app/(site)/api/upload/route.ts`
- `app/(site)/api/upload/verification/route.ts`
- `app/(site)/api/rescue-verification-documents/upload/route.ts`

Potrebno: magic-byte/content sniffing, canonical extension map, privatni bucket za verification docs, i server-side path ownership.

## PR-B5 — Payments fail-closed

Kandidati bez flag gatea prije Stripe signala:

- `app/(site)/api/payments/account-link/route.ts`
- `app/(site)/api/payments/account-status/route.ts`
- `app/(site)/api/payments/connect/route.ts`
- `app/(site)/api/payments/create-checkout/route.ts`
- `app/(site)/api/payments/dashboard-link/route.ts`
- `app/(site)/api/payments/refund/route.ts`
- `app/(site)/api/payments/webhook/route.ts`
- `app/(site)/api/provider-connect/route.ts`

PR-B5 treba prvu liniju svake payments rute zaključati na `PAYMENTS_ENABLED=false` prije Stripe/helper poziva, uključujući webhook.

## PR-B6 — Zod/request validation

B0 nije dovoljno duboko mapirao sve body parsere. Input za PR-B6: mutirajuće rute iz `security-csrf-candidates.txt` plus booking/profile/provider/admin rute iz `ROUTE-MANIFEST.md`.

## Service-role review

Detalji: `docs/truth/security-service-role-candidates.txt`. Legitiman service-role usage može ostati samo za server-only admin/storage/webhook poslove, nikako za zaobilaženje email verificationa ili user-scoped authorizationa.
