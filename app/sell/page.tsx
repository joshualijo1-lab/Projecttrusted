import { requireSession } from '@/lib/guards';
import { createListing } from '@/lib/actions';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';
import { ImageUpload } from '@/components/ImageUpload';

export default async function SellPage() {
  await requireSession();

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Create a listing</h1>
        <p className="text-sm text-slate-600">
          Verified listings go live once approved by the TrustedCars moderation team.
        </p>
      </div>
      <Card className="p-6">
        <form action={createListing} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="title">Listing title</Label>
              <Input id="title" name="title" required />
            </div>
            <div>
              <Label htmlFor="price">Price (€)</Label>
              <Input id="price" name="price" type="number" required />
            </div>
            <div>
              <Label htmlFor="make">Make</Label>
              <Input id="make" name="make" required />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" required />
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Input id="year" name="year" type="number" required />
            </div>
            <div>
              <Label htmlFor="mileage">Mileage (km)</Label>
              <Input id="mileage" name="mileage" type="number" required />
            </div>
            <div>
              <Label htmlFor="fuel">Fuel</Label>
              <select
                id="fuel"
                name="fuel"
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ELECTRIC">Electric</option>
                <option value="PLUG_IN_HYBRID">Plug-in Hybrid</option>
              </select>
            </div>
            <div>
              <Label htmlFor="transmission">Transmission</Label>
              <select
                id="transmission"
                name="transmission"
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="MANUAL">Manual</option>
                <option value="AUTOMATIC">Automatic</option>
                <option value="SEMI_AUTOMATIC">Semi-automatic</option>
              </select>
            </div>
            <div>
              <Label htmlFor="engine">Engine</Label>
              <Input id="engine" name="engine" required />
            </div>
            <div>
              <Label htmlFor="bodyType">Body type</Label>
              <select
                id="bodyType"
                name="bodyType"
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="SEDAN">Sedan</option>
                <option value="HATCHBACK">Hatchback</option>
                <option value="SUV">SUV</option>
                <option value="COUPE">Coupe</option>
                <option value="CONVERTIBLE">Convertible</option>
                <option value="WAGON">Wagon</option>
                <option value="VAN">Van</option>
                <option value="PICKUP">Pickup</option>
              </select>
            </div>
            <div>
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                name="condition"
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="NEW">New</option>
                <option value="USED">Used</option>
                <option value="CERTIFIED">Certified</option>
              </select>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" required />
            </div>
            <div>
              <Label htmlFor="sellerType">Seller type</Label>
              <select
                id="sellerType"
                name="sellerType"
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="PRIVATE">Private seller</option>
                <option value="DEALER">Dealer</option>
              </select>
            </div>
            <div>
              <Label htmlFor="trim">Trim</Label>
              <Input id="trim" name="trim" />
            </div>
            <div>
              <Label htmlFor="vin">VIN</Label>
              <Input id="vin" name="vin" />
            </div>
            <div>
              <Label htmlFor="nctExpiry">NCT expiry</Label>
              <Input id="nctExpiry" name="nctExpiry" type="date" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input id="serviceHistory" name="serviceHistory" type="checkbox" />
            <Label htmlFor="serviceHistory">Service history available</Label>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} required />
          </div>
          <ImageUpload />
          <Button type="submit">Submit listing</Button>
        </form>
      </Card>
    </div>
  );
}
