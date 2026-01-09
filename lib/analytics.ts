'use client';

export async function trackEvent(name: string, metadata?: Record<string, string | number>) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, metadata })
    });
  } catch {
    // analytics should never block UX
  }
}
