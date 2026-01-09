import Image from 'next/image';
import Link from 'next/link';
import type { CarListing, Photo, DealerProfile, User } from '@prisma/client';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { formatCurrency } from '@/lib/utils';

export type ListingWithDetails = CarListing & {
  photos: Photo[];
  dealerProfile: DealerProfile | null;
  seller: User;
};

export function ListingCard({ listing }: { listing: ListingWithDetails }) {
  const primaryPhoto = listing.photos.find((photo) => photo.isPrimary) ?? listing.photos[0];
  const formatEnum = (value: string) => value.toLowerCase().replace(/_/g, ' ');
  return (
    <Card className="overflow-hidden">
      <Link href={`/listings/${listing.id}`} className="block">
        <div className="relative h-44 w-full bg-slate-100">
          {primaryPhoto ? (
            <Image
              src={primaryPhoto.url}
              alt={primaryPhoto.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : null}
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">{listing.title}</h3>
            <Badge variant={listing.sellerType === 'DEALER' ? 'brand' : 'neutral'}>
              {listing.sellerType === 'DEALER' ? 'Dealer' : 'Private'}
            </Badge>
          </div>
          <p className="text-sm text-slate-600">
            {listing.year} · {listing.mileage.toLocaleString()} km · {formatEnum(listing.fuel)}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(listing.price)}
            </span>
            <span className="text-sm text-slate-500">{listing.location}</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
