import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  if (!payload?.listingId || !payload?.reason) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const report = await prisma.report.create({
    data: {
      userId: session.user.id,
      listingId: payload.listingId,
      reason: payload.reason,
      details: payload.details ?? null
    }
  });

  logger.warn({ reportId: report.id, listingId: payload.listingId }, 'listing_reported');
  return NextResponse.json({ ok: true, reportId: report.id });
}
