# STORAGE MATRIX — KIT-C read-only baseline

Datum: 2026-07-02
Izvor: `docs/truth/live-schema-dump-2026-07-02.md`, sekcija 6.

## Bucketi

| Bucket              | Public |                    Limit | MIME                     | Očekivanje                                                              |
| ------------------- | -----: | -----------------------: | ------------------------ | ----------------------------------------------------------------------- |
| `avatars`           |   true |                    ~5 MB | jpeg/png/webp/gif        | Javne profilne slike; upload mora biti auth/owner controlled.           |
| `pet-photos`        |   true |                    ~5 MB | jpeg/png/webp/gif        | Javne slike ljubimaca/listinga; upload mora biti auth/owner controlled. |
| `verification-docs` |  false | nije postavljeno u dumpu | nije postavljeno u dumpu | Privatni verifikacijski dokumenti; pristup samo kroz kratki signed URL. |

## Očekivani testovi

### `avatars`

- anon može čitati javni object ako zna URL
- anon ne može uploadati
- korisnik može uploadati samo na vlastitu dopuštenu putanju
- korisnik ne može overwriteati tuđi avatar
- MIME/size provjera radi na API layeru

### `pet-photos`

- anon može čitati javne slike
- anon ne može uploadati
- owner može uploadati samo za svog ljubimca/listing flow
- tuđi korisnik ne može pisati u tuđu putanju
- MIME/size provjera radi na API layeru

### `verification-docs`

- bucket nije public
- anon ne može list/read/upload
- korisnik ne može direktno čitati dokument bez signed URL-a
- admin/verifikacijski endpoint može generirati signed URL samo autorizirano
- signed URL TTL je ≤ 300 sekundi
- signed URL endpoint provjerava ownership/admin prije izdavanja

## Trenutna mitigacija iz KIT-B

- Upload rute imaju magic-byte validation.
- Verification signed URL TTL je smanjen na 300 sekundi.
- P0 upload metadata inputi imaju Zod validaciju.

## Blocker

Object-level storage policies nisu izlistane u današnjem dumpu. Prije launcha treba poseban storage policy introspection/test harness. Nema remote policy promjena bez vlasnikovog potpisa.
