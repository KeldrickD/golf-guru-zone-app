import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, extractLocaleFromPath } from '@/lib/route-utils';

// Define premium feature paths that require subscription
const PREMIUM_PATHS = [
  '/api/analyze',  // Full analysis features
  '/api/rules',    // Advanced rules assistance
  '/api/equipment',// Custom equipment recommendations
  '/api/courses',  // Advanced course search
];

// Define authenticated paths - add these with locale pattern
const AUTH_PATHS = [
  '/dashboard',
  '/api/subscription',
  ...PREMIUM_PATHS,
];

const PUBLIC_FILE = /\.(.*)$/;

/**
 * Middleware to handle language based on URL path
 * Examples:
 * - /en/courses -> English version of courses
 * - /es/courses -> Spanish version of courses
 * - /courses -> Default language (from cookies or browser) version of courses
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return response;
  }

  // Skip middleware for public files like images, fonts, etc.
  if (PUBLIC_FILE.test(request.nextUrl.pathname) || 
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api/')) {
    return response;
  }

  const pathname = request.nextUrl.pathname;
  
  // Check if the pathname already has a locale prefix
  const pathLocale = extractLocaleFromPath(pathname);
  const pathnameHasLocale = !!pathLocale;

  // If the pathname doesn't have locale prefix, add it
  if (!pathnameHasLocale) {
    // Get the preferred locale from the request
    const locale = getLocale(request);
    
    // Build the new URL with the locale prefix
    let newPath = `/${locale}${pathname === '/' ? '' : pathname}`;
    
    // Ensure we don't end up with double slashes
    newPath = newPath.replace(/\/+/g, '/');
    
    const newUrl = new URL(newPath, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  // For pages with locale, update HTML lang attribute
  if (pathnameHasLocale && pathLocale) {
    response.headers.set('x-locale', pathLocale);
    
    // Authentication logic for locale prefixed paths
    const pathWithoutLocale = pathname.substring(pathLocale.length + 1) || '/';
    const token = await getToken({ req: request });
    
    // Check if this is an auth path without considering locale
    const isAuthPath = AUTH_PATHS.some(path => pathWithoutLocale.startsWith(path));
    const isPremiumPath = PREMIUM_PATHS.some(path => pathWithoutLocale.startsWith(path));

    // Redirect unauthenticated users to login
    if (!token && isAuthPath) {
      return NextResponse.redirect(new URL(`/${pathLocale}/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
    }

    // Premium path checks for authenticated users
    if (token && isPremiumPath) {
      // Check premium status in token
      const hasSubscription = token.subscription === 'premium';
      
      if (!hasSubscription) {
        return NextResponse.redirect(new URL(`/${pathLocale}/pricing`, request.url));
      }
    }
  }

  return response;
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
  const pathLocale = extractLocaleFromPath(pathname);
  
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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 