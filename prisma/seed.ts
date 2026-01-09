import { PrismaClient, Role, SellerType, ListingStatus, FuelType, Transmission, BodyType, VehicleCondition } from '@prisma/client';

const prisma = new PrismaClient();

const makes = [
  { make: 'Toyota', models: ['Corolla', 'Yaris', 'RAV4'] },
  { make: 'Volkswagen', models: ['Golf', 'Passat', 'Tiguan'] },
  { make: 'BMW', models: ['3 Series', '5 Series', 'X3'] },
  { make: 'Audi', models: ['A3', 'A4', 'Q5'] },
  { make: 'Hyundai', models: ['i30', 'Tucson', 'Kona'] },
  { make: 'Ford', models: ['Focus', 'Fiesta', 'Kuga'] },
  { make: 'Kia', models: ['Ceed', 'Sportage', 'Niro'] },
  { make: 'Skoda', models: ['Octavia', 'Superb', 'Karoq'] }
];

const locations = [
  { location: 'Dublin', latitude: 53.3498, longitude: -6.2603 },
  { location: 'Cork', latitude: 51.8985, longitude: -8.4756 },
  { location: 'Galway', latitude: 53.2707, longitude: -9.0568 },
  { location: 'Limerick', latitude: 52.6639, longitude: -8.6267 },
  { location: 'Waterford', latitude: 52.2593, longitude: -7.1101 },
  { location: 'Sligo', latitude: 54.2766, longitude: -8.4761 }
];

const dealerSeed = [
  {
    name: 'Northside Motors',
    slug: 'northside-motors',
    description: 'Multi-brand dealer with full service history on every vehicle.',
    address: '120 Ballymun Road, Dublin',
    hours: 'Mon-Sat 09:00-18:00',
    phone: '+353 1 555 1001',
    latitude: 53.3863,
    longitude: -6.2564
  },
  {
    name: 'Atlantic Auto Group',
    slug: 'atlantic-auto-group',
    description: 'Trusted Galway dealer with EV specialists and 12-month warranty.',
    address: '25 Dock Road, Galway',
    hours: 'Mon-Fri 08:30-17:30',
    phone: '+353 91 555 2002',
    latitude: 53.2692,
    longitude: -9.0542
  },
  {
    name: 'Munster Car Hub',
    slug: 'munster-car-hub',
    description: 'Family run dealership with verified NCT history.',
    address: '44 Henry Street, Limerick',
    hours: 'Mon-Sat 09:00-18:00',
    phone: '+353 61 555 3003',
    latitude: 52.6641,
    longitude: -8.6316
  }
];

function rand<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

async function main() {
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.report.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.inquiryMessage.deleteMany();
  await prisma.inquiryThread.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.carListing.deleteMany();
  await prisma.dealerProfile.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: 'Admin TrustedCars',
      email: 'admin@trustedcars.ie',
      role: Role.ADMIN
    }
  });

  const dealers = await Promise.all(
    dealerSeed.map((dealer, index) =>
      prisma.user.create({
        data: {
          name: dealer.name,
          email: `dealer${index + 1}@trustedcars.ie`,
          role: Role.DEALER,
          dealerProfile: {
            create: {
              ...dealer,
              isVerified: true
            }
          }
        },
        include: { dealerProfile: true }
      })
    )
  );

  const sellers = await Promise.all(
    Array.from({ length: 6 }).map((_, index) =>
      prisma.user.create({
        data: {
          name: `Private Seller ${index + 1}`,
          email: `seller${index + 1}@trustedcars.ie`,
          role: Role.SELLER,
          sellerProfile: {
            create: {
              displayName: `Private Seller ${index + 1}`,
              location: rand(locations).location,
              phone: `+353 87 555 40${index}`
            }
          }
        },
        include: { sellerProfile: true }
      })
    )
  );

  const listings = Array.from({ length: 40 }).map((_, index) => {
    const makeEntry = rand(makes);
    const model = rand(makeEntry.models);
    const locationEntry = rand(locations);
    const year = 2016 + (index % 8);
    const mileage = 20000 + index * 1500;
    const price = 12000 + index * 550;
    const isDealer = index % 2 === 0;
    const seller = isDealer ? rand(dealers) : rand(sellers);
    const dealerProfileId = isDealer ? seller.dealerProfile?.id : null;
    const sellerType = isDealer ? SellerType.DEALER : SellerType.PRIVATE;

    return {
      title: `${year} ${makeEntry.make} ${model}`,
      make: makeEntry.make,
      model,
      year,
      trim: index % 3 === 0 ? 'Sport' : 'Comfort',
      mileage,
      fuel: rand(Object.values(FuelType)),
      transmission: rand(Object.values(Transmission)),
      engine: `${1.4 + (index % 4) * 0.3}L`,
      bodyType: rand(Object.values(BodyType)),
      price,
      location: locationEntry.location,
      latitude: locationEntry.latitude,
      longitude: locationEntry.longitude,
      condition: rand(Object.values(VehicleCondition)),
      vin: index % 4 === 0 ? `VIN${100000 + index}` : null,
      serviceHistory: index % 2 === 0,
      nctExpiry: index % 3 === 0 ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) : null,
      description: 'Well maintained vehicle with trusted service history and verified documentation.',
      status: ListingStatus.ACTIVE,
      sellerType,
      sellerUserId: seller.id,
      dealerProfileId
    };
  });

  for (const listing of listings) {
    const createdListing = await prisma.carListing.create({ data: listing });
    await prisma.photo.createMany({
      data: [
        {
          listingId: createdListing.id,
          url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          alt: `${createdListing.title} front view`,
          isPrimary: true
        },
        {
          listingId: createdListing.id,
          url: 'https://res.cloudinary.com/demo/image/upload/park.jpg',
          alt: `${createdListing.title} interior`
        }
      ]
    });
  }

  await prisma.inquiryThread.create({
    data: {
      listingId: (await prisma.carListing.findFirstOrThrow()).id,
      buyerId: sellers[0].id,
      messages: {
        create: {
          senderId: sellers[0].id,
          content: 'Is this listing still available?'
        }
      }
    }
  });

  await prisma.verificationRequest.create({
    data: {
      dealerProfileId: dealers[0].dealerProfile?.id,
      status: 'APPROVED',
      notes: 'Verified business registration.'
    }
  });

  await prisma.favorite.create({
    data: {
      userId: sellers[1].id,
      listingId: (await prisma.carListing.findFirstOrThrow()).id
    }
  });

  await prisma.report.create({
    data: {
      userId: admin.id,
      listingId: (await prisma.carListing.findFirstOrThrow()).id,
      reason: 'Test report',
      details: 'Sample report for seed data.'
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
