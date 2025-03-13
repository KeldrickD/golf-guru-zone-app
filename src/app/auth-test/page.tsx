'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export default function AuthTestPage() {
  const { data: session, status } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Authentication Test</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl mb-4">Status: {status}</h2>
            {session ? (
              <div className="space-y-4">
                <p>Signed in as: {session.user?.email}</p>
                <p>User ID: {session.user?.id}</p>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-w-full">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            ) : (
              <p>Not signed in</p>
            )}
          </div>

          <div className="space-x-4">
            {!session ? (
              <Button onClick={() => signIn('google')}>
                Sign in with Google
              </Button>
            ) : (
              <Button variant="destructive" onClick={() => signOut()}>
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 