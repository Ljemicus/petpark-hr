# KIT-B5 ADMIN GUARD — local hardening

Datum: 2026-07-02
Scope: lokalni kod, bez remote promjena.

## Problem

Admin status se na više mjesta mogao oslanjati na `users.role` ili `user_metadata.role`. To nije dovoljno dobro kao konačni security source jer metadata može biti krivi ili zastarjeli signal.

Canonical DB izvor iz remote schema dumpa:

- `profile_roles(profile_id, role, granted_at, granted_by_profile_id)`
- RLS policy: self/admin read, admin manage

## Promjena

- `getAuthUser()` sada admin status dodjeljuje samo ako postoji `profile_roles.role = 'admin'` za trenutni `profile_id`.
- Ako fallback metadata ili `users.role` kaže `admin`, ali `profile_roles` ne potvrđuje, role se spušta na `owner` u server-side auth objektu.
- `requireAdmin()` time postaje DB-backed jer koristi `getAuthUser()`.
- `proxy.ts` admin prefilter za `/admin/service-listings` više ne koristi `user_metadata.role`; provjerava `profile_roles`.
- `/api/push/send` i `/api/sms/send` prebačeni su na `requireAdmin()` umjesto direktnog čitanja `users.role`.

## Nije rađeno

- nije mijenjana remote schema/policy
- nije masovno mijenjan svaki UI-only prikaz admin badgea; server guard je prioritet
- nije testirano s real admin userom na preview/live

## Rizik / napomena

Ako postojeći admin korisnik nema `profile_roles` redak s `role='admin'`, nakon ovoga neće proći admin guard dok se taj redak ne doda remote migracijom ili ručno uz vlasnikovo odobrenje.
