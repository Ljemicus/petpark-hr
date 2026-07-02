import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Chat automation is not enabled.' },
    { status: 501 }
  );
}
