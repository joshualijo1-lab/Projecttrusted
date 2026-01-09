import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import type { DealerProfile, SellerProfile } from '@prisma/client';

export function TrustPanel({
  sellerType,
  dealerProfile,
  sellerProfile
}: {
  sellerType: 'DEALER' | 'PRIVATE';
  dealerProfile?: DealerProfile | null;
  sellerProfile?: SellerProfile | null;
}) {
  const verified = dealerProfile?.isVerified ?? false;
  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Trust panel</h3>
        <Badge variant={verified ? 'success' : 'warning'}>
          {verified ? 'Verified dealer' : 'Verification pending'}
        </Badge>
      </div>
      <div className="text-sm text-slate-600">
        <p>Seller type: {sellerType === 'DEALER' ? 'Dealer' : 'Private Seller'}</p>
        {dealerProfile ? (
          <>
            <p>Dealer: {dealerProfile.name}</p>
            {dealerProfile.phone ? <p>Phone: {dealerProfile.phone}</p> : null}
          </>
        ) : (
          <>
            <p>Seller: {sellerProfile?.displayName ?? 'Trusted Seller'}</p>
            {sellerProfile?.phone ? <p>Phone: {sellerProfile.phone}</p> : null}
          </>
        )}
      </div>
      <div className="text-xs text-slate-500">
        All listings go through moderation and flagged reports are reviewed by TrustedCars.
      </div>
    </Card>
  );
}
