/**
 * Arcanea locale roadmap.
 *
 * Locked decisions:
 * - English is the default locale (most content originates here)
 * - Path-based routing with `localePrefix: 'as-needed'` (English drops /en/)
 * - All translated paths use ASCII-safe slugs
 *
 * Phase 1 launches with `en` + `de` (Frank's home market + first native books).
 * Subsequent phases add locales as content + Guardian + translator capacity grows.
 */

export const ARCANEAN_LOCALES_PHASE_1 = ['en', 'de'] as const;
export const ARCANEAN_LOCALES_PHASE_2 = ['en', 'de', 'es', 'ja'] as const;
export const ARCANEAN_LOCALES_PHASE_3 = ['en', 'de', 'es', 'ja', 'fr', 'pt-BR', 'zh-Hans'] as const;

export type ArcaneanLocale = (typeof ARCANEAN_LOCALES_PHASE_3)[number];

/**
 * Default locale for Arcanea. English is the original language for most
 * existing books. Sister-property creators may override per app.
 */
export const ARCANEAN_DEFAULT_LOCALE: ArcaneanLocale = 'en';

/**
 * Active locale list. Pinned to Phase 1 until Phase 2 ships translators
 * + Guardian roster for es/ja. Override per-property if a sister site
 * launches in different locales.
 */
export const ARCANEAN_ACTIVE_LOCALES = ARCANEAN_LOCALES_PHASE_1;
