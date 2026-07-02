# KIT-F7 NOTIFICATION DISPATCH — safe slice

Datum: 2026-07-02
Scope: lokalni kod, bez slanja vanjskih poruka u verifikaciji.

## Promjena

Dodan je centralni dispatcher:

- `lib/notifications/dispatch.ts`

Podržani kanali:

- email → `dispatchEmail()`
- SMS → `dispatchSms()`
- push → `dispatchPushToMultiple()`

Kill-switch env varijable:

- `NOTIFY_EMAIL_ENABLED`
- `NOTIFY_SMS_ENABLED`
- `NOTIFY_PUSH_ENABLED`

Default ponašanje ostaje isto kao prije. Kanal se gasi samo eksplicitno s:

- `false`
- `0`
- `off`

Ako je kanal ugašen, dispatcher vraća `status: "skipped"` i ne poziva vanjski provider.

## Preusmjerene rute u ovom safe sliceu

- `/api/push/send` → `dispatchPushToMultiple()`
- `/api/sms/send` → `dispatchSms()`
- `/api/notifications` → `dispatchEmail()`

## Nije rađeno

- nije masovno mijenjan svaki postojeći helper u jednom velikom refaktoru
- nije slan testni email/SMS/push prema van
- nije mijenjan default behavior dok env kill-switch nije eksplicitno postavljen

## Testovi

- `tests/notification-dispatch.test.ts`
  - default email ostaje enabled
  - `NOTIFY_EMAIL_ENABLED=false` preskače slanje
  - `NOTIFY_SMS_ENABLED=0` preskače slanje
  - `NOTIFY_PUSH_ENABLED=off` preskače slanje
  - push failure iz underlying sendera mapira se u `failed`

## Launch napomena

Prije launch-a odlučiti hoće li se `NOTIFY_SMS_ENABLED` držati `false` dok se SMS provider i real trošak ne potvrde.
