#!/usr/bin/env bash
# KIT-B B.0 — read-only sigurnosna dijagnostika. Pokreni iz roota web repoa.
set -euo pipefail
[[ -f package.json ]] || { echo "GREŠKA: pokreni iz roota repoa" >&2; exit 1; }
EX=(--exclude-dir=node_modules --exclude-dir=.next)
OUT="docs/truth"; mkdir -p "$OUT"
R="$OUT/kit-b-diagnostika-raw.md"

{
echo "# KIT-B dijagnostika (raw, $(date -u +%F))"

echo; echo "## 1. CSRF"
echo "### CSRF_EXCLUDED_ROUTES sadržaj:"
grep -rn "CSRF_EXCLUDED" "${EX[@]}" proxy.ts middleware lib 2>/dev/null || echo "(nije pronađeno tim imenom — traži ručno)"
echo "### csrf datoteke:"
ls -la middleware/ 2>/dev/null || true
grep -rln "csrf" "${EX[@]}" middleware lib proxy.ts 2>/dev/null || true

echo; echo "## 2. Rate limit — tri datoteke i tko ih zove"
for f in lib/rate-limit.ts lib/rate-limiter.ts lib/upstash-rate-limit.ts; do
  echo "### $f"; [[ -f "$f" ]] && sed -n '1,60p' "$f" || echo "(ne postoji)"
done
echo "### Pozivatelji rate-limit funkcija:"
grep -rn "rate-limit\|rateLimit\|rateLimiter" "${EX[@]}" app lib --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "^lib/rate" | head -50

echo; echo "## 3. Service-role upotreba (svaka linija = kandidat za pregled)"
grep -rn "SERVICE_ROLE\|service_role\|supabaseAdmin\|adminClient" "${EX[@]}" app lib --include="*.ts" 2>/dev/null | head -80

echo; echo "## 4. Registracijski tok — email confirm signali"
grep -rn "email_confirm\|confirmed_at\|admin.createUser\|createUser(" "${EX[@]}" app lib 2>/dev/null || echo "(nema direktnih pogodaka — čitaj auth rute ručno)"

echo; echo "## 5. Upload rute — trenutna validacija"
for f in $(find app -path "*upload*" -name "route.ts"; find app -path "*verification-documents*" -name "route.ts"); do
  echo "### $f"; grep -nE "mime|type|size|extension|allowed|bucket" "$f" | head -20
done

echo; echo "## 6. Platne rute — postoji li flag provjera prije Stripe poziva"
for f in $(find app -path "*payments*" -name "route.ts"); do
  echo "### $f"
  grep -nE "PAYMENTS_ENABLED|paymentsEnabled|stripe\.|Stripe\(" "$f" | head -10
done

echo; echo "## 7. Admin provjere preko user_metadata (za zamjenu DB-backed guardom)"
grep -rn "user_metadata" "${EX[@]}" app lib proxy.ts 2>/dev/null | grep -i "role\|admin" | head -30

echo; echo "## 8. Env fail-closed kandidati (placeholder obrasci)"
grep -rn "placeholder\|dummy\|noop" "${EX[@]}" lib/supabase 2>/dev/null | head -20
} > "$R"

echo "Gotovo → $R  (read-only; sada ručno pročitaj navedene datoteke i sažmi u kit-b-diagnostika.md)"
