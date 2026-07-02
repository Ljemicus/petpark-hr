# PAYMENTS FAIL-CLOSED — KIT-B PR-B5 (2026-07-02)

Payments remain disabled unless `PAYMENTS_ENABLED=true` is explicitly set.

Implemented server-side gate via `lib/payments-gate.ts`:

- `PAYMENTS_ENABLED` defaults false.
- All payment/provider-connect route handlers return `503 PAYMENTS_DISABLED` before auth, DB Stripe state lookup, webhook body parsing, or Stripe helper calls.
- No Stripe checkout, Connect, account-link, dashboard-link, refund, or webhook processing can start while disabled.

Guarded routes:

- `app/(site)/api/payments/account-link/route.ts`
- `app/(site)/api/payments/account-status/route.ts`
- `app/(site)/api/payments/connect/route.ts`
- `app/(site)/api/payments/create-checkout/route.ts`
- `app/(site)/api/payments/dashboard-link/route.ts`
- `app/(site)/api/payments/refund/route.ts`
- `app/(site)/api/payments/webhook/route.ts`
- `app/(site)/api/provider-connect/route.ts`

Verification:

- Static scan: `missing_gate_count 0` for payment/provider-connect route handlers with Stripe signals.
