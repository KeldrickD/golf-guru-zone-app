/**
 * Utility functions for handling internationalized routing
 */

/**
 * List of supported locales (must match the ones in middleware.ts and next.config.js)
 */
export const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'ja', 'ko'];
export const DEFAULT_LOCALE = 'en';

/**
 * Creates a localized URL by adding the locale prefix
 * 
 * @param path The path to localize
 * @param locale The locale to use (defaults to 'en')
 * @returns Localized URL
 */
export function localizeUrl(path: string, locale: string = DEFAULT_LOCALE): string {
  // Strip any existing locale prefix
  let cleanPath = path;
  SUPPORTED_LOCALES.forEach(loc => {
    if (cleanPath.startsWith(`/${loc}/`)) {
      cleanPath = cleanPath.substring(loc.length + 1);
    } else if (cleanPath === `/${loc}`) {
      cleanPath = '/';
    }
  });

  // Handle root path specially
  if (cleanPath === '/') {
    return `/${locale}`;
  }
  
  // Make sure path starts with /
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }
  
  return `/${locale}${cleanPath}`;
}

/**
 * Extracts a locale from a path
 * 
 * @param path The path to extract locale from
 * @returns The locale if found, or null
 */
export function extractLocaleFromPath(path: string): string | null {
  if (!path) return null;
  
  for (const locale of SUPPORTED_LOCALES) {
    if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
      return locale;
    }
  }
  
  return null;
}

/**
 * Removes the locale prefix from a path
 * 
 * @param path The path to strip locale from
 * @returns Path without locale prefix
 */
export function stripLocaleFromPath(path: string): string {
  if (!path) return '/';
  
  const locale = extractLocaleFromPath(path);
  if (!locale) return path;
  
  if (path === `/${locale}`) {
    return '/';
  }
  
  return path.substring(locale.length + 1);
} 