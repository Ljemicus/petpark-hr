# KIT-F4 REVIEW INTEGRITY — read-only check

Datum: 2026-07-02
Scope: bez DB promjena.

## Web `/api/reviews` status

Datoteka: `app/(site)/api/reviews/route.ts`

POST review flow trenutno provjerava:

- korisnik mora biti autentificiran
- payload mora proći `reviewSchema`
- `booking_id` mora postojati
- booking mora biti `completed`
- `booking.owner_id` mora biti trenutno ulogirani user
- `reviewee_id` se uzima iz booking sitter/provider strane, ne iz slobodnog client payload-a

Presuda: core review create pravilo je vezano uz stvarnu interakciju/booking i nije slobodni fake review endpoint.

## Nalazi

### F4-F01 — prijava neprimjerene marketplace recenzije nije potvrđena

Status: otvoreno / product+DB decision

Postoje vet review flag rute, ali za marketplace `reviews` nije potvrđen zaseban minimalni report/moderation flow u ovom sliceu.

Ne implementiram bez odluke jer treba schema/policy izbor:

- nova `review_reports` tablica
- ili reuse `notifications`/admin queue
- ili soft-moderation polja na `reviews`

## Preporučeno pravilo za budući draft

Minimalni safe model:

- `review_reports(id, review_id, reporter_profile_id, reason, details, status, created_at, reviewed_at, reviewed_by_profile_id)`
- owner/provider/admin može reportati relevantnu recenziju
- admin može list/update report status
- public ne može čitati reportove

Remote apply samo uz vlasnikov potpis.
