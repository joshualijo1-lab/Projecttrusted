import { prisma } from '@/lib/prisma';
import { ListingCard } from '@/components/ListingCard';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { calculateDistanceKm } from '@/lib/utils';

function parseNumber(value?: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export default async function ListingsPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const make = typeof searchParams.make === 'string' ? searchParams.make : undefined;
  const model = typeof searchParams.model === 'string' ? searchParams.model : undefined;
  const fuel = typeof searchParams.fuel === 'string' ? searchParams.fuel : undefined;
  const transmission = typeof searchParams.transmission === 'string' ? searchParams.transmission : undefined;
  const minYear = parseNumber(typeof searchParams.minYear === 'string' ? searchParams.minYear : undefined);
  const maxYear = parseNumber(typeof searchParams.maxYear === 'string' ? searchParams.maxYear : undefined);
  const minPrice = parseNumber(typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined);
  const maxPrice = parseNumber(typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined);
  const minMileage = parseNumber(typeof searchParams.minMileage === 'string' ? searchParams.minMileage : undefined);
  const maxMileage = parseNumber(typeof searchParams.maxMileage === 'string' ? searchParams.maxMileage : undefined);
  const latitude = parseNumber(typeof searchParams.lat === 'string' ? searchParams.lat : undefined);
  const longitude = parseNumber(typeof searchParams.lng === 'string' ? searchParams.lng : undefined);
  const radius = parseNumber(typeof searchParams.radius === 'string' ? searchParams.radius : undefined);

  const listings = await prisma.carListing.findMany({
    where: {
      status: 'ACTIVE',
      make: make ? { contains: make, mode: 'insensitive' } : undefined,
      model: model ? { contains: model, mode: 'insensitive' } : undefined,
      fuel: fuel ? (fuel as never) : undefined,
      transmission: transmission ? (transmission as never) : undefined,
      year: {
        gte: minYear,
        lte: maxYear
      },
      price: {
        gte: minPrice,
        lte: maxPrice
      },
      mileage: {
        gte: minMileage,
        lte: maxMileage
      }
    },
    include: { photos: true, dealerProfile: true, seller: true },
    orderBy: { createdAt: 'desc' }
  });

  const filteredListings = radius && latitude && longitude
    ? listings.filter((listing) => {
        const distance = calculateDistanceKm(
          { latitude, longitude },
          { latitude: listing.latitude, longitude: listing.longitude }
        );
        return distance !== null && distance <= radius;
      })
    : listings;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Search listings</h1>
        <p className="text-sm text-slate-600">Filter by make, model, year, price, and fuel type.</p>
      </div>

      <form className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
        <Input name="make" placeholder="Make" defaultValue={make} />
        <Input name="model" placeholder="Model" defaultValue={model} />
        <Input name="fuel" placeholder="Fuel" defaultValue={fuel} />
        <Input name="transmission" placeholder="Transmission" defaultValue={transmission} />
        <Input name="minYear" placeholder="Min year" defaultValue={minYear} />
        <Input name="maxYear" placeholder="Max year" defaultValue={maxYear} />
        <Input name="minPrice" placeholder="Min price" defaultValue={minPrice} />
        <Input name="maxPrice" placeholder="Max price" defaultValue={maxPrice} />
        <Input name="minMileage" placeholder="Min mileage" defaultValue={minMileage} />
        <Input name="maxMileage" placeholder="Max mileage" defaultValue={maxMileage} />
        <Input name="lat" placeholder="Latitude" defaultValue={latitude} />
        <Input name="lng" placeholder="Longitude" defaultValue={longitude} />
        <Input name="radius" placeholder="Radius (km)" defaultValue={radius} />
        <Button type="submit" className="md:col-span-3">
          Apply filters
        </Button>
      </form>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
