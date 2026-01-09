import { CarListing } from '@prisma/client';

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value);
}

export function calculateDistanceKm(
  from?: { latitude?: number | null; longitude?: number | null },
  to?: { latitude?: number | null; longitude?: number | null }
) {
  if (!from?.latitude || !from?.longitude || !to?.latitude || !to?.longitude) {
    return null;
  }
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return Math.round(earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function fairPriceBand(listings: CarListing[]) {
  if (!listings.length) {
    return null;
  }
  const prices = listings.map((listing) => listing.price).sort((a, b) => a - b);
  const median = prices[Math.floor(prices.length / 2)];
  return {
    low: Math.round(median * 0.9),
    high: Math.round(median * 1.1)
  };
}
