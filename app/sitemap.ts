import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://trustedcars.ie';
  const listings = await prisma.carListing.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, updatedAt: true }
  });

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/listings`, lastModified: new Date() },
    { url: `${baseUrl}/dealers`, lastModified: new Date() },
    ...listings.map((listing) => ({
      url: `${baseUrl}/listings/${listing.id}`,
      lastModified: listing.updatedAt
    }))
  ];
}
