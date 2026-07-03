# Legal sweep — 2026-07-03

## Pravne stranice / kandidati

app/(site)/kontakt/kontakt-content.tsx

## Grep nalazi nakon KIT-A sweepa

docs/audits/petpark-fable-full-stack-analysis-2026-07-02.md:50:- Payments are intentionally off from product perspective, but Stripe/checkout/refund/connect routes remain present.
docs/audits/petpark-fable-full-stack-analysis-2026-07-02.md:128:- Stripe Connect/payout foundations.
docs/audits/petpark-fable-full-stack-analysis-2026-07-02.md:310:- `/api/payments/refund`
docs/audits/petpark-fable-full-stack-analysis-2026-07-02.md:671:- Stripe Connect onboarding complete.
docs/audits/petpark-fable-full-stack-analysis-2026-07-02.md:675:- Terms/refund policy updated.
supabase/seed-veterinari.sql:101: ('Veterinarska ambulanta Novigrad Podravski', 'veterinarska-ambulanta-novigrad-podravski', '', 'Novigrad Podravski', 'veterinarska*ambulanta', 'Područna veterinarska ambulanta', 'Gajeva 13, 48325 Novigrad Podravski', 'Novigrad Podravski', '48325', 'Koprivničko-križevačka', '048/831 122', 'veterinarska-stanica@kc.t-com.hr', 'http://www.veterinarska-koprivnica. hr/Ambulante/NOVIGRAD_PODR*/novigrad*p odr*.html', '35631964454', '15.4.', 'Ministarstvo poljoprivrede — Upisnik veterinarskih stanica 25.1.2023.', 'active', true),
docs/audits/petpark-fable-full-audit-2026-06-12.md:16:However, the app is currently in a risky transitional state: public copy says online payments are not active, while Stripe/Connect/checkout/refund APIs and UI paths are still present; legal/company data is intentionally placeholder-blocked; CSRF middleware appears to break/bypass important proxy logic; old rate limiting is a no-op on multiple sensitive endpoints; and parts of the frontend still contain preview/demo/design-lab debt that can leak inconsistent UX/SEO signals.
docs/audits/petpark-fable-full-audit-2026-06-12.md:41:- Terms updated away from Stripe/provision/refund claims.
docs/audits/petpark-fable-full-audit-2026-06-12.md:56:- `{{PUNA_ADRESA}}`
docs/audits/petpark-fable-full-audit-2026-06-12.md:57:- `{{OIB}}`
docs/audits/petpark-fable-full-audit-2026-06-12.md:58:- `{{MBS}}`
docs/audits/petpark-fable-full-audit-2026-06-12.md:59:- `{{KAPITAL}}`
docs/audits/petpark-fable-full-audit-2026-06-12.md:248:User-facing audited terms/service pages now say online payments are not active. But checkout, Connect onboarding, refunds, dashboard links and webhook routes still exist.
docs/audits/petpark-fable-full-audit-2026-06-12.md:268:- UI hides checkout/Stripe Connect/Payout components when disabled.
docs/audits/petpark-fable-full-audit-2026-06-12.md:449:**Recommendation to Fable:** verify legal copy and whether ODR link text/current obligations are correct for Croatia/EU.
docs/truth/ROUTE-MANIFEST.generated.md:241:| `/api/payments/refund` | `app/(site)/api/payments/refund/route.ts` | POST | NE | ??? | ??? |
docs/truth/SECURITY-FINDINGS.md:52:- `app/(site)/api/payments/refund/route.ts`
docs/truth/ROUTE-MANIFEST.md:241:| `/api/payments/refund` | `app/(site)/api/payments/refund/route.ts` | POST | NE | payments | auth heuristika: NE |
docs/design/PetPark-Page-Blueprint-Pack-v2.0.md:994:Do not alter booking status transitions, availability, cancellation/refund rules, APIs, RLS/schema, or auth.
docs/design/PetPark-Page-Blueprint-Pack-v2.0.md:1096:Do not change Stripe logic, payment intent/session creation, webhooks, booking status transitions, refunds, APIs, env vars, or RLS/schema.
docs/truth/security-csrf-candidates.txt:74:POST app/(site)/api/payments/refund/route.ts
docs/truth/live-schema-dump-2026-07-02.md:175:│ payments │ refund_status │ text │ YES │ NULL │
docs/truth/live-schema-dump-2026-07-02.md:176:│ payments │ refunded_amount │ numeric │ YES │ NULL │
docs/truth/security-payment-candidates.txt:6:flag=False stripe=True app/(site)/api/payments/refund/route.ts
supabase/seed-blog-articles.sql:87:VAKCINACIJA ODRASLIH PASA
docs/truth/live-schema-dump-2026-07-03.md:172:| payments | refund_status | text | YES | |
docs/truth/live-schema-dump-2026-07-03.md:173:| payments | refunded_amount | numeric | YES | |
docs/truth/AUTH-MATRIX.json:38: "/api/payments/refund"
docs/truth/PAYMENTS-FAIL-CLOSED.md:9:- No Stripe checkout, Connect, account-link, dashboard-link, refund, or webhook processing can start while disabled.
docs/truth/PAYMENTS-FAIL-CLOSED.md:18:- `app/(site)/api/payments/refund/route.ts`
docs/architecture/domain-map.md:100:- payments / checkout / refund / webhook
lib/provider-connect.ts:1:// ── Provider Stripe Connect Abstraction ──
lib/provider-connect.ts:2:// Wraps Stripe Connect operations for provider onboarding.
lib/provider-connect.ts:24: _ Create a Stripe Connect Express account for a provider and return
lib/provider-connect.ts:72: _ Re-generate a Stripe Connect onboarding link (e.g. after link expiry).
lib/types/rescue.ts:10:export type AppealDonationStatus = 'pending' | 'succeeded' | 'failed' | 'refunded' | 'cancelled';
lib/types/rescue.ts:105: refunded_at: string | null;
lib/payment.ts:25: refundId: string;
lib/payment.ts:186: const refund = await stripe.refunds.create(params);
lib/payment.ts:187: return { refundId: refund.id };
lib/types.ts:6:export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
lib/types.ts:26: 'refunded': 'Vraćeno',
lib/content/blog/articles.ts:104:CIJEPLJENJE ODRASLIH PASA
lib/supabase/types.ts:593: refund_status: string | null
lib/supabase/types.ts:594: refunded_amount: number | null
lib/supabase/types.ts:610: refund_status?: string | null
lib/supabase/types.ts:611: refunded_amount?: number | null
lib/supabase/types.ts:627: refund_status?: string | null
lib/supabase/types.ts:628: refunded_amount?: number | null
lib/db/rescue-appeal-donations.ts:78: patch?: Partial<Pick<RescueAppealDonation, 'paid_at' | 'refunded_at' | 'provider_payment_intent_id' | 'provider_checkout_session_id'>>
components/payments/TransactionsList.tsx:14:export type TransactionType = 'income' | 'expense' | 'refund';
components/payments/TransactionsList.tsx:29: refund: 'Povrat',
components/payments/TransactionsList.tsx:44: refund: RotateCcw,
components/payments/TransactionsList.tsx:93: {(['all', 'income', 'expense', 'refund'] as const).map((type) => (
components/payments/TransactionsList.tsx:139: : t.type === 'refund'
components/payments/TransactionsList.tsx:159: : t.type === 'refund'
app/(site)/dashboard/trainer/components/trainer-onboarding-wizard.tsx:1140: <li>• Platforma zadržava 15% provizije</li>
app/(site)/uvjeti/page.tsx:178: {/_ 8. Plaćanje i provizije _/}
app/(site)/uvjeti/page.tsx:184: <h2 className="text-2xl font-bold text-foreground">8. Plaćanje i provizije</h2>
app/(site)/uvjeti/page.tsx:196: PetPark trenutačno ne naplaćuje proviziju. Ako se model naplate ili online plaćanja promijeni,
app/(site)/dashboard/breeder/components/breeder-onboarding-wizard.tsx:1311: <li>• Platforma ne naplaćuje proviziju na prodaju štenca</li>
app/(site)/dashboard/sitter/onboarding/page.tsx:6: _ Stripe Connect, and draft-save support.
app/(site)/faq/page.tsx:22: { q: 'Kolika je provizija PetParka?', a: 'PetPark naplaćuje 10% provizije na svaku rezervaciju. Registracija i korištenje platforme su potpuno besplatni.' },
app/(site)/dashboard/sitter/components/sitter-onboarding-wizard.tsx:675: <li>• Platforma zadržava 15% provizije</li>
app/(site)/faq/faq-content.tsx:37: { q: 'Kolika je provizija PetParka?', a: 'PetPark naplaćuje 10% provizije na svaku rezervaciju. Registracija i korištenje platforme su potpuno besplatni.' },
app/(site)/faq/faq-content.tsx:38: { q: 'Mogu li dobiti povrat novca?', a: 'Da, u slučaju otkazivanja prema pravilima ili nezadovoljstva uslugom. Kontaktirajte podršku unutar 24 sata.' },
app/(site)/faq/faq-content.tsx:90: { q: 'Can I get a refund?', a: 'Yes, depending on the cancellation policy or in case of service issues. Contact support within 24 hours so we can review it.' },
app/(site)/kontakt/kontakt-content.tsx:209: { q: 'Je li korištenje platforme besplatno?', a: 'Da, registracija i pretraživanje su potpuno besplatni. PetPark naplaćuje proviziju od 10% samo na uspješno obavljene rezervacije.' },
app/(site)/api/payments/refund/route.ts:74: // Validate reason matches the actor to prevent owners claiming sitter_cancel for 100% refund
app/(site)/api/payments/refund/route.ts:90: const refundPercentage = calculateRefundPercentage(booking.start_date, reason);
app/(site)/api/payments/refund/route.ts:92: const refundAmountCents = Math.round(totalCents _ (refundPercentage / 100));
app/(site)/api/payments/refund/route.ts:94: if (refundPercentage === 0) {
app/(site)/api/payments/refund/route.ts:95: // Still cancel the booking even if no refund is given
app/(site)/api/payments/refund/route.ts:102: refundId: null,
app/(site)/api/payments/refund/route.ts:112: const { refundId } = await createRefund(
app/(site)/api/payments/refund/route.ts:114: refundAmountCents
app/(site)/api/payments/refund/route.ts:122: payment_status: 'refunded',
app/(site)/api/payments/refund/route.ts:126: // Log refund in payments
app/(site)/api/payments/refund/route.ts:130: amount: refundAmountCents,
app/(site)/api/payments/refund/route.ts:134: status: 'refunded',
app/(site)/api/payments/refund/route.ts:135: refund_id: refundId,
app/(site)/api/payments/refund/route.ts:136: refund_amount: refundAmountCents,
app/(site)/api/payments/refund/route.ts:159: subject: 'Rezervacija otkazana — povrat sredstava',
app/(site)/api/payments/refund/route.ts:161: }).catch((err) => appLogger.error('payments.refund', 'Failed to send cancellation email', { error: String(err) }));
app/(site)/api/payments/refund/route.ts:165: appLogger.error('payments.refund', 'Email notification error', { error: String(emailErr) });
app/(site)/api/payments/refund/route.ts:169: refundId,
app/(site)/api/payments/refund/route.ts:170: amount: refundAmountCents,
app/(site)/api/payments/refund/route.ts:171: amountFormatted: formatCurrency(refundAmountCents),
app/(site)/api/payments/refund/route.ts:172: percentage: refundPercentage,
app/(site)/api/payments/refund/route.ts:175: refundPercentage === 100
app/(site)/api/payments/refund/route.ts:176: ? 'Puni povrat sredstava.'
app/(site)/api/payments/refund/route.ts:177: : `Djelomični povrat (${refundPercentage}%).`,
app/(site)/api/payments/refund/route.ts:180: appLogger.error('payments.refund', 'Refund creation failed', { error: String(err) });
app/(site)/api/payments/refund/route.ts:183: service: 'payments.refund',
app/(site)/api/payments/refund/route.ts:184: description: 'Stripe refund creation failed — user expecting money back',
app/(site)/api/payments/refund/route.ts:185: value: `booking=${bookingId}, amount=${refundAmountCents}`,
app/(site)/api/payments/connect/route.ts:110: description: 'Stripe Connect account creation/link failed — sitter cannot onboard',

## Footer identifikacijski blok

app/(site)/privatnost/page.tsx:258: {/_ Impressum _/}
app/(site)/privatnost/page.tsx:263: <p className="font-semibold text-foreground">Impressum</p>
app/(site)/privatnost/page.tsx:266: Prije javnog lansiranja potrebno je unijeti puni naziv, OIB, MBS/MBO, registriranu adresu,
app/(site)/uvjeti/page.tsx:328: {/_ Impressum _/}
app/(site)/uvjeti/page.tsx:333: <p className="font-semibold text-foreground">Impressum</p>
app/(site)/uvjeti/page.tsx:336: Prije javnog lansiranja potrebno je unijeti puni naziv, OIB, MBS/MBO, registriranu adresu,
components/shared/footer.tsx:290: <p>Registracijski podaci bit će objavljeni nakon pravne potvrde prije javnog lansiranja.</p>

## Blokirano ljudskim inputom

- content/legal/legal-data.json još sadrži ISPUNI vrijednosti; /impressum i puni footer identifikacijski blok čekaju stvarne podatke i pravni potpis.
