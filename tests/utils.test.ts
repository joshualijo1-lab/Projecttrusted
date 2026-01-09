import { describe, expect, it } from 'vitest';
import { fairPriceBand } from '@/lib/utils';

describe('fairPriceBand', () => {
  it('returns null when no listings', () => {
    expect(fairPriceBand([])).toBeNull();
  });

  it('returns a band around the median', () => {
    const listings = [{ price: 10000 }, { price: 12000 }, { price: 14000 }] as any;
    const result = fairPriceBand(listings);
    expect(result?.low).toBe(10800);
    expect(result?.high).toBe(13200);
  });
});
