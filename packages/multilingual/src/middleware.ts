import type { LocaleConfig } from './types';

/**
 * Locale detection helpers. The actual middleware is wired in apps/web —
 * this module exposes pure functions so they can be tested in isolation
 * and composed with other middleware (e.g., Supabase auth).
 *
 * Usage in apps/web/middleware.ts:
 *
 *   import { detectLocale, shouldRedirectToLocale } from '@arcanea/i18n/middleware';
 *   import { routing } from '@/i18n/routing';
 *
 *   const locale = detectLocale(request, routing);
 *   const redirect = shouldRedirectToLocale(request, routing, locale);
 *   if (redirect) return NextResponse.redirect(redirect, 308);
 */

export const LOCALE_COOKIE = 'NEXT_LOCALE';

interface MinimalRequest {
  headers: { get(name: string): string | null };
  cookies: { get(name: string): { value: string } | undefined };
  nextUrl: URL;
  geo?: { country?: string };
}

const COUNTRY_LOCALE_FALLBACKS: Record<string, string> = {
  DE: 'de', AT: 'de', CH: 'de',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es',
  JP: 'ja',
  FR: 'fr', BE: 'fr',
  BR: 'pt-BR', PT: 'pt-BR',
  CN: 'zh-Hans', SG: 'zh-Hans',
  IT: 'it',
  NL: 'nl',
  PL: 'pl',
  TR: 'tr',
  KR: 'ko',
};

/**
 * Detect the best-matching locale for an incoming request.
 *
 * Priority:
 *   1. Path prefix (already in /de/...) → locale comes from URL
 *   2. NEXT_LOCALE cookie (user choice)
 *   3. Accept-Language header (browser)
 *   4. Vercel geo country fallback
 *   5. Default locale
 */
export function detectLocale(request: MinimalRequest, config: LocaleConfig): string {
  // 1. URL prefix
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first && config.locales.includes(first)) return first;

  // 2. Cookie
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && config.locales.includes(cookieLocale)) return cookieLocale;

  // 3. Accept-Language
  const acceptLang = request.headers.get('accept-language');
  if (acceptLang) {
    const parsed = parseAcceptLanguage(acceptLang);
    for (const lang of parsed) {
      // Exact match first
      if (config.locales.includes(lang.tag)) return lang.tag;
      // Match by primary language (e.g., en-US → en)
      const primary = lang.tag.split('-')[0];
      if (config.locales.includes(primary)) return primary;
    }
  }

  // 4. Geo
  const country = request.geo?.country;
  if (country) {
    const guess = COUNTRY_LOCALE_FALLBACKS[country];
    if (guess && config.locales.includes(guess)) return guess;
  }

  return config.defaultLocale;
}

interface ParsedAcceptLanguage {
  tag: string;
  quality: number;
}

function parseAcceptLanguage(header: string): ParsedAcceptLanguage[] {
  return header
    .split(',')
    .map((part): ParsedAcceptLanguage | null => {
      const [tag, ...attrs] = part.trim().split(';').map((s) => s.trim());
      if (!tag) return null;
      let quality = 1;
      for (const attr of attrs) {
        const [key, value] = attr.split('=');
        if (key === 'q' && value) {
          const parsed = parseFloat(value);
          if (!Number.isNaN(parsed)) quality = parsed;
        }
      }
      return { tag, quality };
    })
    .filter((x): x is ParsedAcceptLanguage => x !== null)
    .sort((a, b) => b.quality - a.quality);
}

/**
 * Decide whether to redirect a first-visit user to a localized URL.
 * Returns the URL to redirect to, or null if no redirect needed.
 *
 * Skips redirect if:
 * - URL already has a locale prefix
 * - User already has a locale cookie (respects choice)
 * - Detected locale matches default (and localePrefix is 'as-needed' or 'never')
 */
export function shouldRedirectToLocale(
  request: MinimalRequest,
  config: LocaleConfig,
  detectedLocale: string,
): URL | null {
  // Already prefixed?
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  if (segments[0] && config.locales.includes(segments[0])) return null;

  // Cookie set? Respect user choice.
  if (request.cookies.get(LOCALE_COOKIE)?.value) return null;

  // Detected default + as-needed/never → no redirect
  const isDefault = detectedLocale === config.defaultLocale;
  if (isDefault && config.localePrefix !== 'always') return null;

  // Build redirect URL with locale prefix
  const url = new URL(request.nextUrl.toString());
  url.pathname = `/${detectedLocale}${url.pathname}`;
  return url;
}

/**
 * Strip the locale prefix from a pathname if present, returning the
 * underlying internal path. Useful for routing/metadata lookup.
 */
export function stripLocalePrefix(
  pathname: string,
  config: LocaleConfig,
): { locale: string; path: string } {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first && config.locales.includes(first)) {
    return {
      locale: first,
      path: '/' + segments.slice(1).join('/'),
    };
  }
  return { locale: config.defaultLocale, path: pathname };
}
