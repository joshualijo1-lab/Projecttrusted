import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency, fairPriceBand } from '@/lib/utils';
import { TrustPanel } from '@/components/TrustPanel';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { createInquiry, toggleFavorite } from '@/lib/actions';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { ReportForm } from '@/components/ReportForm';

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await prisma.carListing.findUnique({
    where: { id: params.id },
    include: {
      photos: true,
      dealerProfile: true,
      seller: { include: { sellerProfile: true } }
    }
  });

  if (!listing) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const isFavorite = session?.user?.id
    ? await prisma.favorite.findUnique({
        where: { userId_listingId: { userId: session.user.id, listingId: listing.id } }
      })
    : null;

  const similarListings = await prisma.carListing.findMany({
    where: {
      make: listing.make,
      model: listing.model,
      status: 'ACTIVE'
    },
    take: 8,
    orderBy: { price: 'asc' }
  });

  const priceBand = fairPriceBand(similarListings);
  const formatEnum = (value: string) => value.toLowerCase().replace(/_/g, ' ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: listing.title,
    brand: listing.make,
    model: listing.model,
    productionDate: listing.year,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: listing.mileage,
      unitCode: 'KMT'
    },
    fuelType: listing.fuel,
    vehicleTransmission: listing.transmission,
    bodyType: listing.bodyType,
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock'
    }
  };

  const primaryPhoto = listing.photos.find((photo) => photo.isPrimary) ?? listing.photos[0];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <AnalyticsTracker name="listing_viewed" metadata={{ listingId: listing.id }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-slate-100">
            {primaryPhoto ? (
              <Image src={primaryPhoto.url} alt={primaryPhoto.alt} fill className="object-cover" />
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {listing.photos.slice(0, 4).map((photo) => (
              <div key={photo.id} className="relative h-32 overflow-hidden rounded-lg bg-slate-100">
                <Image src={photo.url} alt={photo.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
          <Card className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-slate-900">{listing.title}</h1>
              <Badge variant={listing.sellerType === 'DEALER' ? 'brand' : 'neutral'}>
                {listing.sellerType === 'DEALER' ? 'Dealer' : 'Private'}
              </Badge>
            </div>
            <p className="text-sm text-slate-600">{listing.location}</p>
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(listing.price)}</div>
            {priceBand ? (
              <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                Fair price band: {formatCurrency(priceBand.low)} - {formatCurrency(priceBand.high)}
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
              <div>Year: {listing.year}</div>
              <div>Mileage: {listing.mileage.toLocaleString()} km</div>
              <div>Fuel: {formatEnum(listing.fuel)}</div>
              <div>Transmission: {formatEnum(listing.transmission)}</div>
              <div>Body type: {formatEnum(listing.bodyType)}</div>
              <div>Engine: {listing.engine}</div>
              <div>Condition: {formatEnum(listing.condition)}</div>
              {listing.nctExpiry ? <div>NCT expiry: {listing.nctExpiry.toDateString()}</div> : null}
            </div>
            <p className="prose-trust">{listing.description}</p>
          </Card>
        </div>

        <div className="space-y-4">
          <TrustPanel
            sellerType={listing.sellerType}
            dealerProfile={listing.dealerProfile}
            sellerProfile={listing.seller.sellerProfile ?? null}
          />
          <Card className="space-y-4 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Contact seller</h3>
            <form
              action={async (formData) => {
                'use server';
                const message = String(formData.get('message') ?? '');
                const honeypot = String(formData.get('company') ?? '');
                await createInquiry(listing.id, message, honeypot);
              }}
              className="space-y-3"
            >
              <Input type="text" name="company" className="hidden" tabIndex={-1} />
              <Textarea name="message" rows={4} placeholder="Ask about availability or schedule a viewing." required />
              <Button type="submit">Send inquiry</Button>
            </form>
          </Card>
          <Card className="space-y-3 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Listing actions</h3>
            <form
              action={async () => {
                'use server';
                await toggleFavorite(listing.id);
              }}
            >
              <Button type="submit" variant={isFavorite ? 'secondary' : 'outline'}>
                {isFavorite ? 'Remove favorite' : 'Save to favorites'}
              </Button>
            </form>
            <div className="pt-2">
              <ReportForm listingId={listing.id} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const listing = await prisma.carListing.findUnique({ where: { id: params.id } });
  if (!listing) {
    return {};
  }
  const title = `${listing.year} ${listing.make} ${listing.model}`;
  return {
    title,
    description: listing.description,
    alternates: {
      canonical: `https://trustedcars.ie/listings/${listing.id}`
    },
    openGraph: {
      title,
      description: listing.description,
      url: `https://trustedcars.ie/listings/${listing.id}`
    }
  };
}
