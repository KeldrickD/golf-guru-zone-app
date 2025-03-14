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

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'ja', 'ko'];
const DEFAULT_LOCALE = 'en';

/**
 * Middleware to handle language based on URL path
 * Examples:
 * - /en/courses -> English version of courses
 * - /es/courses -> Spanish version of courses
 * - /courses -> Default language (from cookies or browser) version of courses
 */
export function middleware(request: NextRequest) {
  // Skip middleware for public files like images, fonts, etc.
  if (PUBLIC_FILE.test(request.nextUrl.pathname) || 
      request.nextUrl.pathname.includes('/api/')) {
    return;
  }

  // Get the preferred locale from the request
  const locale = getLocale(request);
  const pathname = request.nextUrl.pathname;

  // Check if the pathname already has a locale prefix
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If the pathname doesn't have locale and we should add it
  if (!pathnameHasLocale && !pathname.startsWith('/_next')) {
    // Build the new URL with the locale prefix
    const newUrl = new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  // For pages with locale, update HTML lang attribute
  if (pathnameHasLocale) {
    const response = NextResponse.next();
    response.headers.set('x-locale', locale);
    return response;
  }

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

/**
 * Get the locale from:
 * 1. URL pathname (/en/courses, /es/about)
 * 2. Cookie
 * 3. Accept-Language header
 * 4. Default locale
 */
function getLocale(request: NextRequest): string {
  // 1. Check URL path
  const pathname = request.nextUrl.pathname;
  const pathLocale = SUPPORTED_LOCALES.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathLocale) return pathLocale;

  // 2. Check cookie
  const cookieLocale = request.cookies.get('language')?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 3. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const acceptedLocales = acceptLanguage.split(',');
    for (const locale of acceptedLocales) {
      const langCode = locale.split(';')[0].split('-')[0];
      if (SUPPORTED_LOCALES.includes(langCode)) {
        return langCode;
      }
    }
  }

  // 4. Default locale
  return DEFAULT_LOCALE;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
}; 