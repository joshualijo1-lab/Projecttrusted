'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export function AnalyticsTracker({ name, metadata }: { name: string; metadata?: Record<string, string | number> }) {
  useEffect(() => {
    trackEvent(name, metadata);
  }, [name, metadata]);

  return null;
}
