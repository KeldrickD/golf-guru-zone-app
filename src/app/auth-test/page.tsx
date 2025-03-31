'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export default function AuthTest() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div>
        <p>You are not signed in</p>
        <Button onClick={() => { /* Mock sign in */ }}>Sign in</Button>
      </div>
    );
  }

  return (
    <div>
      <p>Signed in as {session?.user?.email}</p>
      <Button onClick={() => { /* Mock sign out */ }}>Sign out</Button>
    </div>
  );
} 