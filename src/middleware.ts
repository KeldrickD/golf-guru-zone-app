import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define premium feature paths that require subscription
const PREMIUM_PATHS = [
  '/api/analyze',  // Full analysis features
  '/api/rules',    // Advanced rules assistance
  '/api/equipment',// Custom equipment recommendations
  '/api/courses',  // Advanced course search
];

export async function middleware(request: NextRequest) {
  // Check if the request is for a premium feature
  const isPremiumPath = PREMIUM_PATHS.some(path => request.nextUrl.pathname.startsWith(path));

  if (isPremiumPath) {
    // Get the user's subscription status from the request
    // In a real app, you'd verify this with your database/auth system
    const subscriptionStatus = request.headers.get('x-subscription-status');
    const requestCount = parseInt(request.headers.get('x-request-count') || '0');

    // If no subscription and exceeded free tier limits
    if (!subscriptionStatus && requestCount >= 2) {
      return NextResponse.json(
        {
          error: 'Free tier limit reached. Please upgrade to continue using this feature.',
          upgradeUrl: '/pricing'
        },
        { status: 403 }
      );
    }

    // For subscribed users or within free tier limits, continue
    return NextResponse.next();
  }

  // For non-premium paths, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 