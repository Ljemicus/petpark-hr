# KIT-B PR-B4 — Upload i dokumenti (2026-07-02)

## Promjene

- Dodan `lib/security/file-signature.ts` za magic-byte validaciju:
  - JPEG `FFD8FF`
  - PNG `89504E47...`
  - WebP `RIFF....WEBP`
  - PDF `%PDF-`
- Upload rute sada odbijaju datoteke kada deklarirani MIME ne odgovara stvarnom potpisu.
- Limiti veličine:
  - slike: 8 MB
  - dokumenti: 15 MB
- Primijenjeno na:
  - `api/upload`
  - `api/upload/verification`
  - `api/rescue-verification-documents/upload`
- Signed URL TTL za verifikacijske dokumente spušten s 600s na 300s:
  - `api/rescue-verification-documents/[documentId]/signed-url`
  - `api/admin/verifications/documents`
- Rescue verification upload već ima cleanup ako DB insert padne; ostavljeno i dokumentirano.

## Sigurnosno ponašanje

- MIME allowlist i dalje ostaje prva brana.
- Magic-byte validacija je druga brana prije storage uploada.
- Privatni verification uploadovi ne vraćaju public URL.
- Rescue signed URL provjerava vlasništvo organizacije ili admin rolu prije generiranja linka.

## Testovi

- Dodan `lib/security/file-signature.test.ts`
- Pokriva:
  - validne potpise JPEG/PNG/WebP/PDF
  - spoofing slučaj: PNG sadržaj deklariran kao PDF → reject
  - PDF u image-only uploadu → reject

## Granice ovog slicea

- Nije mijenjana DB schema.
- Nije rađen novi storage bucket provisioning.
- Admin guard ostaje postojeći `requireAdmin`; šira DB-backed admin zamjena pripada PR-B5/S8 nastavku.
