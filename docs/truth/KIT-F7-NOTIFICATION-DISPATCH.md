# KIT-F7 NOTIFICATION DISPATCH — safe hardening

Datum: 2026-07-02
Scope: bez vanjskog slanja i bez remote promjena.

## Što je provjereno

Kanali postoje u kodu:

- email: `lib/email.ts`, Resend preko `RESEND_API_KEY`
- push: `lib/push-notifications.ts`, VAPID env
- SMS: `lib/sms.ts`, Twilio/Infobip env
- in-app: `notifications` / booking-request activity helpers

## Safe hardening primijenjen

`app/(site)/api/sms/send/route.ts`

Prije:

- internal poziv se računao kao `internalKey === process.env.SMS_INTERNAL_KEY`
- ako `SMS_INTERNAL_KEY` nije postavljen i client ne pošalje key, usporedba može biti `undefined === undefined`
- običan auth user nije imao jasan admin check unatoč komentaru “Verify admin or system role”

Sada:

- internal poziv je dopušten samo ako je `SMS_INTERNAL_KEY` konfiguriran i payload key se poklapa
- unauthenticated poziv bez validnog internal keya vraća 401
- authenticated non-internal poziv mora biti admin, inače 403
- validacijske greške koriste isti `apiError` pattern kao ostali P0 endpointi

## Nije rađeno

- nije poslan nijedan email/SMS/push
- nisu rotirani ni čitani secret-i
- nije mijenjana notification schema
- nije uključen centralni dispatcher bez product odluke

## Launch-grade preporuka

Prije produkcijskog uključivanja dispatchera dodati centralni kill-switch model:

- `NOTIFY_EMAIL_ENABLED`
- `NOTIFY_PUSH_ENABLED`
- `NOTIFY_SMS_ENABLED`
- `NOTIFY_IN_APP_ENABLED`

I testirati svaku granu s dummy recipientima ili staging providerima.
