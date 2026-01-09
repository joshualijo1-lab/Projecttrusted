import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="text-sm text-slate-600">We couldn't find the page you're looking for.</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Back to home
      </Link>
    </div>
  );
}
