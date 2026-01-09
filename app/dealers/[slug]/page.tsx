import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/Card';
import { ListingCard } from '@/components/ListingCard';

export default async function DealerDetailPage({ params }: { params: { slug: string } }) {
  const dealer = await prisma.dealerProfile.findUnique({
    where: { slug: params.slug },
    include: {
      listings: { where: { status: 'ACTIVE' }, include: { photos: true, dealerProfile: true, seller: true } }
    }
  });

  if (!dealer) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <Card className="space-y-2 p-4">
        <h1 className="text-2xl font-semibold text-slate-900">{dealer.name}</h1>
        <p className="text-sm text-slate-600">{dealer.description}</p>
        <div className="text-sm text-slate-500">{dealer.address}</div>
        <div className="text-sm text-slate-500">Hours: {dealer.hours}</div>
        {dealer.latitude && dealer.longitude ? (
          <a
            className="text-sm font-semibold text-brand-600"
            href={`https://www.google.com/maps?q=${dealer.latitude},${dealer.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            View map
          </a>
        ) : null}
      </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dealer.listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
