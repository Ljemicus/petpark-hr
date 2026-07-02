# KIT-B PR-B6 — Zod validacija ulaza (2026-07-02)

## Stanje prije promjene

Već su postojale Zod sheme za dio P0 ruta:

- auth login/register/forgot-password
- booking-request create
- lost-pets relay/contact

Nedostajala ili je bila ručna/slaba validacija za:

- SMS send
- transactional email send
- push send
- upload metadata iz `formData`

## Promjene

Dodano u `lib/validation/schemas.ts`:

- `smsSendSchema`
- `bookingConfirmationEmailSchema`
- `reviewRequestEmailSchema`
- `pushSendSchema`
- `uploadMetadataSchema`
- `verificationUploadMetadataSchema`

Primijenjeno na rute:

- `app/(site)/api/sms/send/route.ts`
- `app/(site)/api/email/booking-confirmation/route.ts`
- `app/(site)/api/email/review-request/route.ts`
- `app/(site)/api/push/send/route.ts`
- `app/(site)/api/upload/route.ts`
- `app/(site)/api/upload/verification/route.ts`

## Pravila odgovora

Invalid payload sada vraća 400 s hrvatskim copyjem:

```json
{ "error": "Neispravni podaci." }
```

Za postojeće `apiError` rute koristi se `message: "Neispravni podaci."` i `details` kao Zod fieldErrors, bez echoanja sirovog inputa.

## Testovi

Dodan `lib/validation/security-p0-schemas.test.ts`:

- SMS bez template/body → reject
- email UUID provjera → reject invalid
- push bez primatelja → reject
- upload path traversal metadata → reject

## Granice ovog slicea

- Nije diran PR-B1 CSRF.
- Nije diran PR-B2 email verification bypass.
- Payments rute su već fail-closed; dodatna payment payload validacija može ići u budući payments activation PR jer se trenutno ne izvršava dok je `PAYMENTS_ENABLED` false.
- Ostale P1 rute ostaju za kasnije širenje validacije.
