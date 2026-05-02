/**
 * Slug utilities for the Arcanea i18n system.
 *
 * Rule: slugs MUST be ASCII-safe. Browsers handle Unicode URLs fine, but
 * Twitter cards, some CMS importers, copy-paste workflows, and analytics
 * tools still mangle non-ASCII bytes. Always strip diacritics and force
 * ASCII at slug-creation time.
 *
 * Per-locale slug uniqueness is enforced at the data layer (e.g., a
 * `unique(locale, slug)` constraint on book_locales). These helpers
 * assist creation; they do not enforce uniqueness.
 */

const DIACRITIC_MAP: Record<string, string> = {
  // German
  ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss',
  Ä: 'Ae', Ö: 'Oe', Ü: 'Ue',
  // Romance
  á: 'a', à: 'a', â: 'a', ã: 'a',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  í: 'i', ì: 'i', î: 'i', ï: 'i',
  ó: 'o', ò: 'o', ô: 'o', õ: 'o',
  ú: 'u', ù: 'u', û: 'u',
  ñ: 'n', ç: 'c',
  // Nordic
  å: 'a', ø: 'o', æ: 'ae',
  // Polish + Czech selection
  ł: 'l', ć: 'c', ś: 's', ź: 'z', ż: 'z',
};

const KANA_TRANSLITERATIONS: Record<string, string> = {
  // Coarse romanization — for richer JA support, consume an external library.
  // These are only used as a fallback when the caller doesn't pre-romanize.
  // Most book/world slugs in Japanese should be supplied as romaji directly.
};

/**
 * Convert any string to an ASCII-safe slug.
 * - Lowercases
 * - Maps known diacritics (German umlauts → ae/oe/ue/ss, etc.)
 * - Strips remaining non-ASCII
 * - Collapses whitespace and punctuation to single hyphens
 * - Trims leading/trailing hyphens
 */
export function asciiSlug(input: string): string {
  if (!input) return '';

  let s = input;

  // Apply known character maps
  for (const [from, to] of Object.entries(DIACRITIC_MAP)) {
    s = s.split(from).join(to);
  }
  for (const [from, to] of Object.entries(KANA_TRANSLITERATIONS)) {
    s = s.split(from).join(to);
  }

  // Lowercase
  s = s.toLowerCase();

  // Strip remaining non-ASCII (anything outside basic Latin)
  s = s.replace(/[^\x20-\x7e]/g, '');

  // Collapse whitespace and punctuation to hyphens
  s = s.replace(/[^a-z0-9]+/g, '-');

  // Trim leading/trailing hyphens
  s = s.replace(/^-+|-+$/g, '');

  return s;
}

/**
 * Validate that a slug is ASCII-safe and well-formed.
 * Returns null if valid, or an error string if not.
 */
export function validateSlug(slug: string): string | null {
  if (!slug) return 'slug is empty';
  if (slug.length > 200) return 'slug exceeds 200 characters';
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return 'slug must be lowercase ASCII with single hyphens between segments';
  }
  return null;
}

/**
 * Build a per-locale slug map from a record of locale → human title.
 * Caller should still verify uniqueness against the database.
 */
export function buildLocaleSlugMap(
  titlesByLocale: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [locale, title] of Object.entries(titlesByLocale)) {
    out[locale] = asciiSlug(title);
  }
  return out;
}
