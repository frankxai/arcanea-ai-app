import type { LocaleConfig, PathnameMap, LocalePrefixMode } from './types';

export interface DefineLocaleConfigInput {
  locales: ReadonlyArray<string>;
  defaultLocale: string;
  localePrefix?: LocalePrefixMode;
  pathnames?: PathnameMap;
  domain: string;
  alternateLocales?: Record<string, string>;
}

/**
 * Define a locale configuration. The single source of truth for an
 * Arcanea-i18n site. Pass the result to next-intl, the middleware factory,
 * and the SEO/sitemap/schema helpers — all derive from this object.
 *
 * Defaults follow the Arcanean i18n decisions locked 2026-05-02:
 * - localePrefix 'as-needed' (default locale drops its prefix)
 * - empty pathnames map (caller adds entries)
 */
export function defineLocaleConfig(input: DefineLocaleConfigInput): LocaleConfig {
  if (!input.locales.includes(input.defaultLocale)) {
    throw new Error(
      `defineLocaleConfig: defaultLocale "${input.defaultLocale}" must be in locales [${input.locales.join(', ')}]`,
    );
  }

  if (!input.domain.startsWith('http')) {
    throw new Error(
      `defineLocaleConfig: domain must include protocol (e.g. https://arcanea.ai), got "${input.domain}"`,
    );
  }

  return {
    locales: input.locales,
    defaultLocale: input.defaultLocale,
    localePrefix: input.localePrefix ?? 'as-needed',
    pathnames: input.pathnames ?? {},
    domain: input.domain.replace(/\/$/, ''),
    alternateLocales: input.alternateLocales,
  };
}

/**
 * Resolve the localized pathname for an internal route key in a given locale.
 * Returns the resolved path WITHOUT locale prefix; caller adds prefix per
 * `localePrefix` rules.
 *
 * Example:
 *   pathnames: { '/library': { en: '/library', de: '/bibliothek' } }
 *   resolvePathname(config, '/library', 'de') === '/bibliothek'
 *   resolvePathname(config, '/library', 'en') === '/library'
 */
export function resolvePathname(
  config: LocaleConfig,
  internalPath: string,
  locale: string,
): string {
  const entry = config.pathnames[internalPath];
  if (entry === undefined) return internalPath;
  if (typeof entry === 'string') return entry;
  return entry[locale] ?? entry[config.defaultLocale] ?? internalPath;
}

/**
 * A content slug may be a single string (same slug across all locales — rare,
 * usually only for content with a stable identifier) or a per-locale map
 * (the typical case: each locale's slug is its own translation).
 */
export type ContentSlugInput = string | Partial<Record<string, string>>;

/**
 * Build a fully qualified URL for a given internal path + locale.
 * Applies localePrefix rule. Accepts either a single slug or a per-locale
 * slug map.
 */
export function buildLocalizedUrl(
  config: LocaleConfig,
  internalPath: string,
  locale: string,
  contentSlug?: ContentSlugInput,
): string {
  const pathname = resolvePathname(config, internalPath, locale);
  const isDefault = locale === config.defaultLocale;
  const prefix =
    config.localePrefix === 'never' || (config.localePrefix === 'as-needed' && isDefault)
      ? ''
      : `/${locale}`;

  const resolvedSlug = resolveSlug(contentSlug, locale, config.defaultLocale);
  const slugPart = resolvedSlug ? `/${resolvedSlug}` : '';
  // Strip any leading "/" duplication when pathname already starts with "/"
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${config.domain}${prefix}${path}${slugPart}`;
}

function resolveSlug(
  slug: ContentSlugInput | undefined,
  locale: string,
  defaultLocale: string,
): string | undefined {
  if (slug === undefined) return undefined;
  if (typeof slug === 'string') return slug;
  return slug[locale] ?? slug[defaultLocale];
}

/**
 * Returns the set of locale variants for a given internal path. Useful
 * for generating hreflang alternates. Pass a per-locale slug map when
 * each locale has its own translated slug.
 */
export function getLocaleVariants(
  config: LocaleConfig,
  internalPath: string,
  contentSlug?: ContentSlugInput,
): Array<{ locale: string; url: string }> {
  return config.locales.map((locale) => ({
    locale,
    url: buildLocalizedUrl(config, internalPath, locale, contentSlug),
  }));
}
