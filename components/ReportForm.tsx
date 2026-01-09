'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/Textarea';
import { Input } from '@/components/Input';

export function ReportForm({ listingId }: { listingId: string }) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');
    const formData = new FormData(event.currentTarget);
    const payload = {
      listingId,
      reason: formData.get('reason'),
      details: formData.get('details')
    };

    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setStatus(response.ok ? 'success' : 'error');
    if (response.ok) {
      event.currentTarget.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input name="reason" placeholder="Report reason" required />
      <Textarea name="details" rows={3} placeholder="Optional details" />
      <Button type="submit" variant="outline">
        Submit report
      </Button>
      {status === 'success' ? <p className="text-sm text-emerald-600">Report sent.</p> : null}
      {status === 'error' ? <p className="text-sm text-rose-600">Could not send report.</p> : null}
    </form>
  );
}
