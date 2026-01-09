import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';

export default async function DealersPage() {
  const dealers = await prisma.dealerProfile.findMany({
    include: { listings: { where: { status: 'ACTIVE' } } }
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Verified dealers</h1>
        <p className="text-sm text-slate-600">Meet trusted dealer partners across Ireland.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {dealers.map((dealer) => (
          <Card key={dealer.id} className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">{dealer.name}</h2>
              <Badge variant={dealer.isVerified ? 'success' : 'warning'}>
                {dealer.isVerified ? 'Verified' : 'Pending'}
              </Badge>
            </div>
            <p className="text-sm text-slate-600">{dealer.description}</p>
            <div className="text-sm text-slate-500">{dealer.address}</div>
            <Link href={`/dealers/${dealer.slug}`} className="text-sm font-semibold text-brand-600">
              View dealer page ({dealer.listings.length} listings)
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
