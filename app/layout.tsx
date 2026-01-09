import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'TrustedCars | Ireland car marketplace',
    template: '%s | TrustedCars'
  },
  description: 'TrustedCars is the verified car listings marketplace for Ireland.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://trustedcars.ie'),
  openGraph: {
    title: 'TrustedCars',
    description: 'Verified car listings for dealers and private sellers across Ireland.',
    url: 'https://trustedcars.ie',
    siteName: 'TrustedCars',
    locale: 'en_IE',
    type: 'website'
  },
  alternates: {
    canonical: 'https://trustedcars.ie'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
