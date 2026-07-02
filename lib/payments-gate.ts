import { NextResponse } from 'next/server';

export const PAYMENTS_ENABLED = process.env.PAYMENTS_ENABLED === 'true';

export function arePaymentsEnabled(): boolean {
  return PAYMENTS_ENABLED;
}

export function paymentsDisabledResponse() {
  return NextResponse.json(
    {
      error: 'Online plaćanja su trenutno isključena.',
      code: 'PAYMENTS_DISABLED',
    },
    { status: 503 }
  );
}
