'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { env } from '@/lib/env';

const listingSchema = z.object({
  title: z.string().min(5),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 1),
  trim: z.string().optional(),
  mileage: z.coerce.number().int().min(0),
  fuel: z.enum(['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC', 'PLUG_IN_HYBRID']),
  transmission: z.enum(['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC']),
  engine: z.string().min(1),
  bodyType: z.enum(['SEDAN', 'HATCHBACK', 'SUV', 'COUPE', 'CONVERTIBLE', 'WAGON', 'VAN', 'PICKUP']),
  price: z.coerce.number().int().min(0),
  location: z.string().min(1),
  condition: z.enum(['NEW', 'USED', 'CERTIFIED']),
  vin: z.string().optional(),
  serviceHistory: z.boolean().optional(),
  nctExpiry: z.string().optional(),
  description: z.string().min(10),
  sellerType: z.enum(['DEALER', 'PRIVATE'])
});

export async function toggleFavorite(listingId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_listingId: { userId: session.user.id, listingId } }
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({
      data: { userId: session.user.id, listingId }
    });
  }

  revalidatePath('/favorites');
  revalidatePath(`/listings/${listingId}`);
}

export async function createInquiry(listingId: string, message: string, honeypot: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  if (honeypot) {
    logger.warn({ listingId, userId: session.user.id }, 'honeypot_triggered');
    return;
  }
  if (message.trim().length < 5) {
    throw new Error('Message too short.');
  }

  const lastMessage = await prisma.inquiryMessage.findFirst({
    where: { senderId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  if (lastMessage && Date.now() - lastMessage.createdAt.getTime() < 1000 * 60 * 2) {
    throw new Error('Please wait before sending another inquiry.');
  }

  const thread = await prisma.inquiryThread.upsert({
    where: { listingId_buyerId: { listingId, buyerId: session.user.id } },
    update: {},
    create: { listingId, buyerId: session.user.id }
  });

  await prisma.inquiryMessage.create({
    data: { threadId: thread.id, senderId: session.user.id, content: message }
  });

  const listing = await prisma.carListing.findUnique({
    where: { id: listingId },
    include: { seller: true }
  });

  if (listing?.seller.email) {
    const transporter = nodemailer.createTransport(env.EMAIL_SERVER);
    await transporter.sendMail({
      to: listing.seller.email,
      from: env.EMAIL_FROM,
      subject: `New inquiry for ${listing.title}`,
      text: message
    });
  }

  logger.info({ listingId, threadId: thread.id }, 'inquiry_created');
  revalidatePath(`/listings/${listingId}`);
}

export async function createListing(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const payload = Object.fromEntries(formData.entries());
  const parsed = listingSchema.parse({
    ...payload,
    serviceHistory: payload.serviceHistory === 'on'
  });

  const photoUrls = formData.getAll('photos').filter((url) => typeof url === 'string') as string[];

  const listing = await prisma.carListing.create({
    data: {
      title: parsed.title,
      make: parsed.make,
      model: parsed.model,
      year: parsed.year,
      trim: parsed.trim ?? null,
      mileage: parsed.mileage,
      fuel: parsed.fuel,
      transmission: parsed.transmission,
      engine: parsed.engine,
      bodyType: parsed.bodyType,
      price: parsed.price,
      location: parsed.location,
      condition: parsed.condition,
      vin: parsed.vin ?? null,
      serviceHistory: parsed.serviceHistory ?? false,
      nctExpiry: parsed.nctExpiry ? new Date(parsed.nctExpiry) : null,
      description: parsed.description,
      status: 'PENDING',
      sellerType: parsed.sellerType,
      sellerUserId: session.user.id,
      photos: {
        create: photoUrls.map((url, index) => ({
          url,
          alt: `${parsed.make} photo ${index + 1}`,
          isPrimary: index === 0
        }))
      }
    }
  });

  if (session.user.role === 'VISITOR') {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: parsed.sellerType === 'DEALER' ? 'DEALER' : 'SELLER' }
    });
  }

  revalidatePath('/listings');
  return listing.id;
}
