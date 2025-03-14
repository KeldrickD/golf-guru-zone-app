import { format, formatDistance, formatRelative } from 'date-fns';
import { enUS, es, fr, de, ja, ko } from 'date-fns/locale';

// Mapping of language codes to date-fns locales
const dateLocales = {
  'en': enUS,
  'es': es,
  'fr': fr,
  'de': de,
  'ja': ja,
  'ko': ko
};

/**
 * Formats a date according to the specified format string and locale
 * @param date The date to format
 * @param formatStr The format string (using date-fns format)
 * @param locale The locale code
 * @returns Formatted date string
 */
export function formatDate(date: Date | number | string, formatStr: string = 'PPP', locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { 
    locale: dateLocales[locale as keyof typeof dateLocales] || dateLocales.en 
  });
}

/**
 * Formats a date relative to current time (e.g., "3 days ago")
 * @param date The date to format
 * @param baseDate The base date to calculate the distance from (defaults to now)
 * @param locale The locale code
 * @returns Formatted relative date string
 */
export function formatRelativeDate(date: Date | number | string, baseDate?: Date, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const baseDateObj = baseDate || new Date();
  
  return formatDistance(dateObj, baseDateObj, { 
    addSuffix: true,
    locale: dateLocales[locale as keyof typeof dateLocales] || dateLocales.en 
  });
}

/**
 * Formats a number according to the locale's conventions
 * @param value The number to format
 * @param locale The locale code
 * @param options Intl.NumberFormat options
 * @returns Formatted number string
 */
export function formatNumber(value: number, locale: string = 'en', options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Formats a currency value according to the locale's conventions
 * @param value The currency value to format
 * @param currencyCode The ISO currency code (e.g., USD, EUR)
 * @param locale The locale code
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currencyCode: string = 'USD', locale: string = 'en'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

/**
 * Formats a percentage value according to the locale's conventions
 * @param value The percentage value (0-1) to format
 * @param locale The locale code
 * @param decimalPlaces Number of decimal places to display
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, locale: string = 'en', decimalPlaces: number = 0): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(value);
}

/**
 * Returns if the language is RTL (Right-to-Left)
 * @param locale The locale code
 * @returns boolean indicating if the language is RTL
 */
export function isRTL(locale: string): boolean {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(locale);
} 