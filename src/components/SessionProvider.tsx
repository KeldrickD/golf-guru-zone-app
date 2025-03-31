'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, Session as AuthSession } from '@/auth';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

// Define the session type
interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface Session {
  user: User;
}

interface SessionContextType {
  session: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

// Create the context
const SessionContext = createContext<SessionContextType>({
  session: null,
  status: 'loading',
});

// Hook to use the session
export const useSession = () => {
  return useContext(SessionContext);
};

// Convert auth session to our session format
const convertSession = (authSession: AuthSession | null): Session | null => {
  if (!authSession || !authSession.user) return null;
  
  return {
    user: {
      id: authSession.user.id || '',
      name: authSession.user.name || '',
      email: authSession.user.email || '',
      image: authSession.user.image || null,
    }
  };
};

// Provider component
export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionData, setSessionData] = useState<SessionContextType>({
    session: null,
    status: 'loading',
  });

  useEffect(() => {
    // Simulate loading the session
    const loadSession = async () => {
      try {
        // Get the session from the auth module
        const authSession = await auth();
        const session = convertSession(authSession);
        
        setSessionData({
          session,
          status: session ? 'authenticated' : 'unauthenticated',
        });
      } catch (error) {
        console.error('Error loading session:', error);
        setSessionData({
          session: null,
          status: 'unauthenticated',
        });
      }
    };

    loadSession();
  }, []);

  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
};

interface SessionProviderProps {
  children: ReactNode;
  session: any;
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}

export function useSession() {
  const { data: session, status } = useSession();
  return { session, status };
}

export default SessionProvider; 