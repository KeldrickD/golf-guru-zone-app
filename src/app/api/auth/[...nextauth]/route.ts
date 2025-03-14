import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

// Define custom user type
interface CustomUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  subscription?: {
    status: string;
    plan: string;
    nextBillingDate: string;
  };
}

// Mock user data
const mockUsers: CustomUser[] = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    image: 'https://via.placeholder.com/150',
    subscription: {
      status: 'active',
      plan: 'premium',
      nextBillingDate: '2023-12-01',
    }
  }
];

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-client-secret',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Mock authentication
        if (credentials?.email === 'demo@example.com' && credentials?.password === 'password') {
          return mockUsers[0] as any;
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Cast user to CustomUser to access subscription
        token.subscription = (user as unknown as CustomUser).subscription;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.subscription = token.subscription;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST }; 