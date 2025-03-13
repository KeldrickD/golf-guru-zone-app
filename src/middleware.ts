import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define premium feature paths that require subscription
const PREMIUM_PATHS = [
  '/api/analyze',  // Full analysis features
  '/api/rules',    // Advanced rules assistance
  '/api/equipment',// Custom equipment recommendations
  '/api/courses',  // Advanced course search
];

// Define authenticated paths
const AUTH_PATHS = [
  '/dashboard',
  '/api/subscription',
  ...PREMIUM_PATHS,
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPath = AUTH_PATHS.some(path => request.nextUrl.pathname.startsWith(path));
  const isPremiumPath = PREMIUM_PATHS.some(path => request.nextUrl.pathname.startsWith(path));

  // Check authentication for protected routes
  if (isAuthPath && !token) {
    const url = new URL('/api/auth/signin', request.url);
    url.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(url);
  }

  // For authenticated users, check subscription status for premium features
  if (isPremiumPath && token) {
    const subscription = (token.user as any).subscription;
    const requestCount = parseInt(request.headers.get('x-request-count') || '0');

    // If no subscription and exceeded free tier limits
    if (!subscription && requestCount >= 2) {
      return NextResponse.json(
        {
          error: 'Free tier limit reached. Please upgrade to continue using this feature.',
          upgradeUrl: '/pricing'
        },
        { status: 403 }
      );
    }

    // If subscription is not active
    if (subscription?.status !== 'active') {
      return NextResponse.json(
        {
          error: 'Your subscription is not active. Please update your payment method or reactivate your subscription.',
          manageUrl: '/dashboard/subscription'
        },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
}; 