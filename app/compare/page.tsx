import { prisma } from '@/lib/prisma';
import { Card } from '@/components/Card';
import { formatCurrency } from '@/lib/utils';

export default async function ComparePage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const ids = typeof searchParams.ids === 'string' ? searchParams.ids.split(',').slice(0, 3) : [];
  const listings = ids.length
    ? await prisma.carListing.findMany({ where: { id: { in: ids } } })
    : [];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Compare cars</h1>
        <p className="text-sm text-slate-600">Save up to three listings and compare key specs.</p>
      </div>
      {listings.length ? (
        <div className="grid gap-4 md:grid-cols-3">
          {listings.map((listing) => (
            <Card key={listing.id} className="space-y-2 p-4">
              <h2 className="text-lg font-semibold">{listing.title}</h2>
              <div className="text-sm text-slate-600">{formatCurrency(listing.price)}</div>
              <div className="text-sm text-slate-600">Year: {listing.year}</div>
              <div className="text-sm text-slate-600">Mileage: {listing.mileage.toLocaleString()} km</div>
              <div className="text-sm text-slate-600">Fuel: {listing.fuel}</div>
              <div className="text-sm text-slate-600">Transmission: {listing.transmission}</div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-4 text-sm text-slate-600">
          Add listings to compare by appending ?ids=listingId1,listingId2
        </Card>
      )}
    </div>
  );
}
