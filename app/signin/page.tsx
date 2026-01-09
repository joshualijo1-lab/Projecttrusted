'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';

export default function SignInPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="mx-auto flex max-w-3xl justify-center px-4 py-16">
      <Card className="w-full max-w-md space-y-4 p-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Sign in to TrustedCars</h1>
          <p className="text-sm text-slate-600">Use email or Google to continue.</p>
        </div>
        <Button onClick={() => signIn('google')}>Continue with Google</Button>
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button variant="outline" onClick={() => signIn('email', { email })}>
            Continue with Email
          </Button>
        </div>
      </Card>
    </div>
  );
}
