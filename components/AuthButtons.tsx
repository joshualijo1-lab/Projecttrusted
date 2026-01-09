'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/Button';

export function AuthButtons({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Link href="/favorites" className="text-sm font-medium text-slate-600">
        Favorites
      </Link>
      <Link href="/listings/manage" className="text-sm font-medium text-slate-600">
        My listings
      </Link>
      <Link href="/inquiries" className="text-sm font-medium text-slate-600">
        Inquiries
      </Link>
      {isAdmin ? (
        <Link href="/admin" className="text-sm font-medium text-brand-600">
          Admin
        </Link>
      ) : null}
      <Button variant="outline" type="button" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}
