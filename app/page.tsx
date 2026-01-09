import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ListingCard } from '@/components/ListingCard';

export default async function HomePage() {
  const listings = await prisma.carListing.findMany({
    where: { status: 'ACTIVE' },
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: { photos: true, dealerProfile: true, seller: true }
  });

  return (
    <div className="space-y-16">
      <section className="bg-slate-900">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 text-white md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold md:text-4xl">
              Verified car listings built for trust across Ireland.
            </h1>
            <p className="text-lg text-slate-200">
              Find dealer-verified vehicles, compare listings, and connect with trusted sellers on
              trustedcars.ie.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Browse listings
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center justify-center rounded-md border border-white px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sell a car
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-6">
            <h2 className="text-lg font-semibold">Quick search</h2>
            <form action="/listings" className="mt-4 grid gap-3">
              <input
                name="make"
                placeholder="Make"
                aria-label="Search by make"
                className="rounded-md px-3 py-2 text-slate-900"
              />
              <input
                name="model"
                placeholder="Model"
                aria-label="Search by model"
                className="rounded-md px-3 py-2 text-slate-900"
              />
              <button className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Latest trusted listings</h2>
          <Link href="/listings" className="text-sm font-semibold text-brand-600">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
