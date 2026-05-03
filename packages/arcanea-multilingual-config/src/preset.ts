/**
 * One-line preset factory: `createArcaneanConfig(domain)` returns a fully
 * configured `LocaleConfig` ready to pass to next-intl, the multilingual
 * middleware, and SEO/sitemap helpers.
 *
 * Use this in apps/web (and any future Arcanean property) to avoid
 * re-deriving the locale list, pathnames, and conventions per app.
 */

import {
  defineLocaleConfig,
  type LocaleConfig,
  type LocalePrefixMode,
} from '@starlight/multilingual';
import { ARCANEAN_ACTIVE_LOCALES, ARCANEAN_DEFAULT_LOCALE } from './locales';
import { ARCANEAN_PATHNAMES } from './pathnames';

export interface CreateArcaneanConfigInput {
  /** Site domain, e.g. 'https://www.arcanea.ai'. Required. */
  domain: string;
  /**
   * Override the active locale list. Defaults to Phase 1 (`['en', 'de']`).
   * Pass `['en', 'de', 'es', 'ja']` to activate Phase 2.
   */
  locales?: ReadonlyArray<string>;
  /** Override default locale. Defaults to 'en'. */
  defaultLocale?: string;
  /** Override locale prefix mode. Defaults to 'as-needed'. */
  localePrefix?: LocalePrefixMode;
  /**
   * Override or extend pathnames. By default uses `ARCANEAN_PATHNAMES`.
   * Pass `extraPathnames` to merge property-specific routes into the
   * Arcanean baseline.
   */
  extraPathnames?: Record<string, string | Record<string, string>>;
}

/**
 * Build the canonical Arcanean LocaleConfig for a given domain.
 *
 * Example:
 *
 *   // apps/web/i18n/routing.ts
 *   import { createArcaneanConfig } from '@arcanea/multilingual-config';
 *   export const routing = createArcaneanConfig({
 *     domain: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.arcanea.ai',
 *   });
 *
 * For a sister Arcanean property with extra routes:
 *
 *   export const routing = createArcaneanConfig({
 *     domain: 'https://stories.arcanea.ai',
 *     extraPathnames: {
 *       '/stories/[slug]': { en: '/stories/[slug]', de: '/geschichten/[slug]' },
 *     },
 *   });
 */
export function createArcaneanConfig(input: CreateArcaneanConfigInput): LocaleConfig {
  return defineLocaleConfig({
    domain: input.domain,
    locales: input.locales ?? ARCANEAN_ACTIVE_LOCALES,
    defaultLocale: input.defaultLocale ?? ARCANEAN_DEFAULT_LOCALE,
    localePrefix: input.localePrefix ?? 'as-needed',
    pathnames: {
      ...ARCANEAN_PATHNAMES,
      ...(input.extraPathnames ?? {}),
    },
  });
}
