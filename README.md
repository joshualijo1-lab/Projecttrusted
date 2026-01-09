# TrustedCars MVP

TrustedCars is a verified car listings marketplace for Ireland. This MVP includes listings, dealer pages, inquiries, favorites, moderation, and basic analytics/logging.

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Prisma + Postgres
- NextAuth (Email + Google)
- Cloudinary image uploads

## Getting started

```bash
npm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in values.

```bash
cp .env.example .env
```

### Database

Start Postgres locally:

```bash
docker compose up -d
```

Run migrations and seed data:

```bash
npm run prisma:migrate
npm run seed
```

### Development

```bash
npm run dev
```

## Key user flows

- **Visitor**: search listings, compare cars, view dealer pages.
- **Seller / Dealer**: sign in, create listings, upload photos, manage inquiries.
- **Admin**: approve listings, verify dealers, review reports.

## Image uploads

Uploads use Cloudinary signed requests. Files are validated client-side for type and size before upload.

## Deployment

### Vercel

1. Create a new Vercel project and link the repo.
2. Add environment variables from `.env.example`.
3. Set the build command to `npm run build` and output directory `.next`.
4. Deploy.

### Custom domain (trustedcars.ie)

1. Add `trustedcars.ie` and `www.trustedcars.ie` in Vercel domains.
2. Update DNS records to the Vercel-provided values.
3. Update `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` to `https://trustedcars.ie`.

## Scripts

- `npm run dev` – dev server
- `npm run lint` – lint
- `npm run test` – unit tests
- `npm run prisma:migrate` – migrations
- `npm run seed` – seed data
