import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/guards';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { revalidatePath } from 'next/cache';

export default async function AdminPage() {
  await requireAdmin();

  const pendingListings = await prisma.carListing.findMany({
    where: { status: 'PENDING' },
    include: { seller: true }
  });
  const reports = await prisma.report.findMany({
    include: { listing: true, user: true },
    orderBy: { createdAt: 'desc' }
  });
  const verificationRequests = await prisma.verificationRequest.findMany({
    include: { dealerProfile: true, user: true }
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Admin moderation</h1>
      <Card className="space-y-3 p-4">
        <h2 className="text-lg font-semibold">Pending listings</h2>
        <div className="space-y-2">
          {pendingListings.map((listing) => (
            <div key={listing.id} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-semibold">{listing.title}</div>
                <div className="text-xs text-slate-500">Seller: {listing.seller.name ?? listing.seller.email}</div>
              </div>
              <form
                action={async () => {
                  'use server';
                  await prisma.carListing.update({
                    where: { id: listing.id },
                    data: { status: 'ACTIVE' }
                  });
                  revalidatePath('/admin');
                }}
              >
                <Button type="submit" variant="secondary">
                  Approve
                </Button>
              </form>
            </div>
          ))}
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <h2 className="text-lg font-semibold">Dealer verification</h2>
        <div className="space-y-2">
          {verificationRequests.map((request) => (
            <div key={request.id} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-semibold">{request.dealerProfile?.name ?? request.user?.name}</div>
                <div className="text-xs text-slate-500">Status: {request.status}</div>
              </div>
              <form
                action={async () => {
                  'use server';
                  if (request.dealerProfileId) {
                    await prisma.dealerProfile.update({
                      where: { id: request.dealerProfileId },
                      data: { isVerified: true }
                    });
                  }
                  await prisma.verificationRequest.update({
                    where: { id: request.id },
                    data: { status: 'APPROVED' }
                  });
                  revalidatePath('/admin');
                }}
              >
                <Button type="submit">Approve</Button>
              </form>
            </div>
          ))}
        </div>
      </Card>
      <Card className="space-y-3 p-4">
        <h2 className="text-lg font-semibold">Reports</h2>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="rounded-lg border border-slate-200 p-3 text-sm">
              <div className="font-semibold">{report.listing.title}</div>
              <div className="text-slate-500">Reason: {report.reason}</div>
              <div className="text-slate-500">Reported by: {report.user.email}</div>
              {report.details ? <div className="text-slate-600">{report.details}</div> : null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
