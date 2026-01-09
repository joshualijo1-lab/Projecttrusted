'use client';

export default function GlobalError() {
  return (
    <html>
      <body>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Unexpected error</h1>
          <p className="text-sm text-slate-600">Please refresh the page.</p>
        </div>
      </body>
    </html>
  );
}
