import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AuthButtons } from '@/components/AuthButtons';

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-slate-900">
          TrustedCars
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/listings">Browse</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/dealers">Dealers</Link>
          <Link href="/sell">Sell</Link>
        </nav>
        {session ? (
          <AuthButtons isAdmin={session.user.role === 'ADMIN'} />
        ) : (
          <Link
            href="/signin"
            className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
