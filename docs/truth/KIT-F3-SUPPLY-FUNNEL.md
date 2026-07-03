# KIT-F3 SUPPLY FUNNEL — pre-launch findings

Datum: 2026-07-03
Scope: read-only/product-safe; bez mijenjanja schema i bez realnog signup smokea.

## Provider onboarding

Relevantne površine:

- `/registracija`
- `/onboarding/publisher-type`
- `/onboarding/provider`
- `/objavi-uslugu`
- `/verifikacija`
- provider dashboardi: sitter/groomer/trainer

## Trenja / nalaz

- Realni end-to-end signup nije izvršen jer nema odobrenog test user/preview workflowa u ovom sliceu.
- Copy je već oprezan oko review/verifikacije; ne obećava automatski javni profil.
- Verification badge treba ostati vezan uz stvarni status (`verified_status` / review state), ne uz self-declared podatke.

## Preporučena next akcija kad se odobri smoke

1. Kreirati test provider account.
2. Proći registracija → publisher type → provider onboarding.
3. Zapisati gdje forma koči: naziv usluge, grad, opis, dokumenti, očekivanja oko verifikacije.
4. Popraviti samo copy/redoslijed/validacijske poruke; ne mijenjati strukturu podataka bez posebne odluke.

## Empty-state CTA pravilo

Za prazne kategorije/gradove koristiti iskren CTA:

> Budi prvi pružatelj za [kategorija] u [grad].

Link treba voditi na registraciju/onboarding s preselektiranim kontekstom kad taj parametar postoji. Ako parametar ne postoji, ne fejkati — voditi na obični onboarding.
