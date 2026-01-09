import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload?.name) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  logger.info({ event: payload.name, metadata: payload.metadata ?? {} }, 'analytics');
  return NextResponse.json({ ok: true });
}
