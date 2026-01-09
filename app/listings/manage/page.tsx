import Link from 'next/link';
import { requireSession } from '@/lib/guards';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';

export default async function ManageListingsPage() {
  const session = await requireSession();
  const listings = await prisma.carListing.findMany({
    where: { sellerUserId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Your listings</h1>
          <p className="text-sm text-slate-600">Track status updates and manage listings.</p>
        </div>
        <Link href="/sell" className="text-sm font-semibold text-brand-600">
          Create listing
        </Link>
      </div>
      <div className="space-y-4">
        {listings.map((listing) => (
          <Card key={listing.id} className="flex items-center justify-between p-4">
            <div>
              <Link href={`/listings/${listing.id}`} className="text-lg font-semibold text-brand-600">
                {listing.title}
              </Link>
              <p className="text-sm text-slate-500">{listing.location}</p>
            </div>
            <Badge variant={listing.status === 'ACTIVE' ? 'success' : 'warning'}>
              {listing.status}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
