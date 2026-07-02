# KIT-B2 EMAIL VERIFICATION — local implementation

Datum: 2026-07-02
Scope: lokalni kod, bez deploya.

## Uzrok

`app/(site)/api/auth/register/route.ts` je nakon Supabase `signUp()` pokušavao koristiti service-role client i pozvati:

- `auth.admin.updateUserById(..., { email_confirm: true })`
- zatim auto sign-in s lozinkom

To je zaobilazilo normalnu email potvrdu kada je Supabase projekt konfiguriran da traži email verification.

## Promjena

- uklonjen je service-role auto-confirm blok
- uklonjen je post-confirm auto sign-in
- registracija sada vraća `needsEmailConfirmation: !session`
- UI već ima copy: “Registracija uspješna! Provjerite email za potvrdu.” i šalje korisnika na login kad nema sessiona

## Nije rađeno

- nije dodana nova resend-confirmation značajka jer postojeći kit kaže stub/TODO ako ruta ne postoji; ne gradimo novu značajku bez product odluke
- nije mijenjana Supabase remote auth konfiguracija
- nije testiran stvarni email provider

## Gate status

Lokalni gateovi se vode u commit poruci / završnom izvještaju.
