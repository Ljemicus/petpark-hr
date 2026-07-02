# RLS FINDINGS — KIT-C read-only

Datum: 2026-07-02
Izvor: `docs/truth/live-schema-dump-2026-07-02.md`

## Confirmed

- Sve public tablice u današnjem dumpu imaju RLS enabled.
- `Tablice s RLS=off` sekcija je prazna.
- Verification bucket `verification-docs` je private (`public=false`).

## Findings / needs test harness

### RLS-F01 — Policy-only migracije nisu automatski dokazano jednake očekivanju

Status: otvoreno / test-needed

Opis: Dump pokazuje policyje, ali nije pokrenut persona-based test harness za anon/owner/provider/admin/suspendirani matricu.

Rizik: policy može izgledati ispravno, ali propustiti edge case.

Akcija: lokalni/staging RLS test harness prema `RLS-MATRIX.md`. Nema remote writeova na produkciju.

### RLS-F02 — `booking_requests` anon insert je namjerno otvoren, treba abuse/rate-limit smoke

Status: dokumentirano

Opis: `booking_requests_insert_anon_or_admin` dopušta anon/auth insert za web request flow uz field checks. To je product feature, ali mora biti pokriveno rate-limitom i spam obranom.

Trenutna mitigacija: KIT-B PR-B3 rate limit hardening je commitan na webu.

Akcija: prije launch gatea napraviti smoke da limiter radi na request endpointu.

### RLS-F03 — Public trainer read policies su široke

Status: owner/product review

Opis: `trainers`, `training_programs`, `trainer_availability`, `trainer_reviews` imaju public read policy. To može biti OK za marketplace discovery, ali treba potvrditi da nijedno polje nije privatno.

Akcija: field-level audit UI/API outputa; ako ima privatnih polja, koristiti view/select projection ili policy tightening draft.

### RLS-F04 — Storage policy detalji nisu dumpani

Status: test-needed

Opis: Bucket public flagovi su poznati, ali object-level storage policies nisu dokumentirane u ovom dumpu.

Akcija: storage policy introspection + tests za `avatars`, `pet-photos`, `verification-docs`.

## Draft migrations

Nema novih policy draft migracija u ovom safe sliceu jer nema automatiziranog failing testa. Svaki stvarni policy fix mora ići kao novi draft u `supabase/drafts/` i čeka vlasnikov potpis prije remote applya.
