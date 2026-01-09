import { requireSession } from '@/lib/guards';
import { prisma } from '@/lib/prisma';
import { ListingCard } from '@/components/ListingCard';

export default async function FavoritesPage() {
  const session = await requireSession();
  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { listing: { include: { photos: true, dealerProfile: true, seller: true } } }
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Saved favorites</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((favorite) => (
          <ListingCard key={favorite.id} listing={favorite.listing} />
        ))}
      </div>
    </div>
  );
}
