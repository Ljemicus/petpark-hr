import { NextResponse } from 'next/server';
import { getPrograms } from '@/lib/db';
import { rateLimitAsync } from '@/lib/rate-limit';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!(await rateLimitAsync(`trainer:programs:${ip}`, 60, 60_000, { route: 'trainer-programs-list', failClosed: false }))) {
    return NextResponse.json({ error: 'Previše zahtjeva. Pokušajte kasnije.' }, { status: 429 });
  }

  const { id } = await params;
  const programs = await getPrograms(id);
  return NextResponse.json(programs);
}
