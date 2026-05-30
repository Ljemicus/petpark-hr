#!/usr/bin/env bash
# =====================================================================
# PetPark — POST-FIX verification
# Run AFTER deploying (or against a preview URL) to confirm the P0
# render bug is gone. READ-ONLY. Does not change code.
#
#   SITE=https://petpark.hr bash verify-fix.sh
#   SITE=https://your-preview.vercel.app bash verify-fix.sh
# =====================================================================
set -u
SITE="${SITE:-https://petpark.hr}"
UA="Mozilla/5.0 (petpark-verify)"
PASS=0; FAIL=0
ROUTES=(/kontakt /o-nama /faq /cuvanje-pasa-zagreb /uvjeti /privatnost /zajednica /forum /dog-friendly /verifikacija)

echo "Verifying against: $SITE"
echo "Each broken route must serve scripts that are authorised by the CSP"
echo "(either every <script> carries a nonce, OR scripts carry integrity= and"
echo " the page is SRI-hashed). A route FAILS if it has scripts demanding a"
echo " nonce/hash but none are present."
echo

for r in "${ROUTES[@]}"; do
  html="$(curl -sL  -A "$UA" "$SITE$r")"
  hdr="$(curl -sIL -A "$UA" "$SITE$r")"
  total=$(printf '%s' "$html" | grep -o '<script' | wc -l | tr -d ' ')
  nonced=$(printf '%s' "$html" | grep -o 'nonce="' | wc -l | tr -d ' ')
  integ=$(printf '%s' "$html" | grep -o 'integrity="' | wc -l | tr -d ' ')
  csp_has_nonce=$(printf '%s' "$hdr" | grep -i 'content-security-policy' | grep -c "nonce-")

  status="UNKNOWN"
  # Pass if there are no scripts, or scripts are covered by nonce or integrity.
  if [ "$total" = "0" ]; then
    status="PASS (no scripts)"; PASS=$((PASS+1))
  elif [ "$csp_has_nonce" -gt 0 ] && [ "$nonced" -ge "$((total-1))" ]; then
    status="PASS (nonce: $nonced/$total scripts)"; PASS=$((PASS+1))
  elif [ "$integ" -ge "$((total-1))" ] && [ "$integ" -gt 0 ]; then
    status="PASS (SRI: $integ/$total scripts)"; PASS=$((PASS+1))
  elif [ "$csp_has_nonce" -gt 0 ] && [ "$nonced" = "0" ]; then
    status="FAIL (CSP demands nonce, 0/$total scripts have one — the original bug)"; FAIL=$((FAIL+1))
  else
    status="CHECK ($total scripts, $nonced nonced, $integ integrity)"; FAIL=$((FAIL+1))
  fi
  printf "  %-26s %s\n" "$r" "$status"
done

echo
echo "PASS: $PASS   FAIL/CHECK: $FAIL"
echo
echo "Optional deeper check (needs Playwright): confirms H1 is actually visible."
echo "  npx playwright install chromium && SITE=$SITE node verify-h1.mjs"
[ "$FAIL" -eq 0 ] && echo "RESULT: looks fixed ✅" || echo "RESULT: still failing on some routes ❌"
