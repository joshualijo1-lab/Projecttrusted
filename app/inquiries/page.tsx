import { requireSession } from '@/lib/guards';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/Card';
import Link from 'next/link';

export default async function InquiriesPage() {
  const session = await requireSession();
  const threads = await prisma.inquiryThread.findMany({
    where: { buyerId: session.user.id },
    include: { listing: true, messages: { orderBy: { createdAt: 'desc' }, take: 1 } }
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Your inquiries</h1>
      <div className="space-y-4">
        {threads.map((thread) => (
          <Card key={thread.id} className="space-y-2 p-4">
            <Link href={`/listings/${thread.listingId}`} className="text-lg font-semibold text-brand-600">
              {thread.listing.title}
            </Link>
            <p className="text-sm text-slate-600">Latest message: {thread.messages[0]?.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
