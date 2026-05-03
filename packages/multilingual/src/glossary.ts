/**
 * Canon glossary for fiction-rich Starlight properties (Arcanea, future
 * fiction sites). Distinguishes terms that must be preserved across all
 * locales (proper nouns, brand-canonical names) from terms that should be
 * translated (descriptive concepts) from terms that need cultural adaptation.
 *
 * Empty glossary is fine for non-fiction sites (FrankX, marketing pages).
 *
 * The glossary is consulted by:
 * - Translation Studio (suggests correct rendering as translator types)
 * - AI translation pipeline (constrains machine translation output)
 * - Voice consistency check (flags drift in proper-noun handling)
 * - Pre-publish validation (sample-checks translated content)
 */

export type GlossaryFlag = 'preserve' | 'translate' | 'adapt';

export interface GlossaryEntry {
  /** Canonical term in the source language (often English). Used as lookup key. */
  term: string;
  /** How this term should be handled across locales. */
  flag: GlossaryFlag;
  /**
   * Per-locale rendering. For `preserve` flag, all locales should typically
   * be the same. For `translate` flag, each locale gets its native form. For
   * `adapt` flag, each locale may have a culturally-reframed version.
   */
  perLocale: Record<string, string>;
  /** Optional explanation surfaced to translators in Translation Studio. */
  note?: string;
  /**
   * Optional world scoping. Glossary lookup filters by world for the active
   * book. E.g., `world: 'pyrathis'` only surfaces when translating a Pyrathis book.
   */
  world?: string;
  /**
   * Optional category for UI grouping. E.g., 'character', 'place', 'artifact',
   * 'concept', 'faction', 'magic-system'.
   */
  category?: string;
}

export interface Glossary {
  entries: GlossaryEntry[];
  /** Default locale used when an entry's perLocale doesn't include the requested locale. */
  defaultLocale: string;
}

export interface DefineGlossaryInput {
  defaultLocale: string;
  entries: GlossaryEntry[];
}

/**
 * Define a canon glossary. Validates uniqueness of terms (case-insensitive)
 * and that every entry's perLocale at least contains the defaultLocale.
 */
export function defineGlossary(input: DefineGlossaryInput): Glossary {
  const seen = new Set<string>();
  for (const entry of input.entries) {
    const key = entry.term.toLowerCase();
    if (seen.has(key)) {
      throw new Error(
        `defineGlossary: duplicate term "${entry.term}" (case-insensitive). Each canonical term must appear once.`,
      );
    }
    seen.add(key);

    if (!(input.defaultLocale in entry.perLocale)) {
      throw new Error(
        `defineGlossary: entry "${entry.term}" missing default-locale rendering "${input.defaultLocale}".`,
      );
    }
  }
  return {
    entries: input.entries,
    defaultLocale: input.defaultLocale,
  };
}

/**
 * Look up the correct rendering of a term in a target locale, optionally
 * scoped to a world. Returns the source-language term unchanged if not in
 * glossary (caller decides whether to machine-translate).
 */
export function lookupTerm(
  glossary: Glossary,
  term: string,
  targetLocale: string,
  world?: string,
): { rendering: string; flag: GlossaryFlag | null; entry?: GlossaryEntry } {
  const key = term.toLowerCase();
  const entry = glossary.entries.find((e) => {
    if (e.term.toLowerCase() !== key) return false;
    if (world && e.world && e.world !== world) return false;
    return true;
  });

  if (!entry) {
    return { rendering: term, flag: null };
  }

  const rendering =
    entry.perLocale[targetLocale] ?? entry.perLocale[glossary.defaultLocale] ?? term;

  return { rendering, flag: entry.flag, entry };
}

/**
 * Detect whether a term contains characters from a script without word
 * separators (CJK, Thai, etc.). For such terms, word-boundary lookarounds
 * are wrong — Japanese sentences write `彼は門の鍵を持っていた` with no
 * separator before/after `門の鍵`, so any boundary check sees the term
 * surrounded by letters and rejects the match.
 */
function isUnseparatedScript(term: string): boolean {
  // CJK Unified Ideographs, Hiragana, Katakana, Hangul, Thai
  return /[぀-ゟ゠-ヿ一-鿿가-힯฀-๿]/.test(term);
}

/**
 * Build a Unicode-aware word-boundary regex for a glossary term.
 *
 * JavaScript's \b only works for ASCII word characters (per ECMA-262 \w =
 * [A-Za-z0-9_]). For canon terms containing apostrophes (Vel'Tara),
 * non-Latin scripts, or any non-ASCII letters, \b mismatches.
 *
 * Strategy:
 * - Latin/Greek/Cyrillic terms (script with word separators) → use Unicode
 *   lookarounds against \p{L}/\p{N} so 'cat' doesn't match 'category'
 * - CJK/Thai/Hangul terms → no boundaries (these scripts don't use word
 *   separators; boundary check would always fail when surrounded by other
 *   characters of the same script)
 */
function buildTermRegex(term: string, flags: string): RegExp {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (isUnseparatedScript(term)) {
    return new RegExp(escaped, flags + 'u');
  }
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, flags + 'u');
}

interface ScanHit {
  term: string;
  rendering: string;
  flag: GlossaryFlag;
  index: number;
  length: number;
}

/**
 * Scan a passage of text, find all glossary terms it contains, and return
 * the rendering each one should have in the target locale. Caller can use
 * this to apply substitutions or surface suggestions.
 *
 * Substring-overlap handling: when two glossary entries overlap (e.g.
 * "Vel'Tara" and "Vel'Tara Sword"), the longest match wins at any given
 * position. This prevents false-positive validation violations.
 */
export function scanPassage(
  glossary: Glossary,
  text: string,
  targetLocale: string,
  world?: string,
): ScanHit[] {
  const allHits: ScanHit[] = [];

  for (const entry of glossary.entries) {
    if (world && entry.world && entry.world !== world) continue;

    let regex: RegExp;
    try {
      regex = buildTermRegex(entry.term, 'gi');
    } catch {
      // Term contains no matchable content; skip
      continue;
    }

    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const rendering =
        entry.perLocale[targetLocale] ??
        entry.perLocale[glossary.defaultLocale] ??
        entry.term;
      allHits.push({
        term: entry.term,
        rendering,
        flag: entry.flag,
        index: match.index,
        length: match[0].length,
      });
      // Prevent zero-width match infinite loop
      if (match.index === regex.lastIndex) regex.lastIndex++;
    }
  }

  // Sort by position, then by length descending (longer matches preferred)
  allHits.sort((a, b) => a.index - b.index || b.length - a.length);

  // Filter overlapping matches: keep longest, drop shorter ones inside it
  const filtered: ScanHit[] = [];
  let lastEnd = -1;
  for (const hit of allHits) {
    if (hit.index >= lastEnd) {
      filtered.push(hit);
      lastEnd = hit.index + hit.length;
    }
    // else: this hit is inside a previously-accepted longer match; skip
  }

  return filtered;
}

/**
 * Validate that a translated passage correctly preserves `preserve` flag
 * terms and uses the canonical rendering for `translate` flag terms.
 *
 * Returns an array of violations. Empty array = passage passes validation.
 *
 * Used by Translation Studio pre-submit validation and CI checks on
 * published translations.
 */
export interface GlossaryViolation {
  term: string;
  expectedRendering: string;
  flag: GlossaryFlag;
  reason: string;
}

export function validateTranslation(
  glossary: Glossary,
  sourceText: string,
  translatedText: string,
  sourceLocale: string,
  targetLocale: string,
  world?: string,
): GlossaryViolation[] {
  const violations: GlossaryViolation[] = [];
  const sourceHits = scanPassage(glossary, sourceText, targetLocale, world);

  for (const hit of sourceHits) {
    if (hit.flag === 'preserve') {
      // Term must appear verbatim in translated text. Use Unicode-aware regex.
      const regex = buildTermRegex(hit.term, '');
      if (!regex.test(translatedText)) {
        violations.push({
          term: hit.term,
          expectedRendering: hit.rendering,
          flag: 'preserve',
          reason: `Proper noun "${hit.term}" must appear verbatim in ${targetLocale} translation but was missing or altered.`,
        });
      }
    } else if (hit.flag === 'translate') {
      // Translated text should contain the canonical target-locale rendering
      const regex = buildTermRegex(hit.rendering, 'i');
      if (!regex.test(translatedText)) {
        violations.push({
          term: hit.term,
          expectedRendering: hit.rendering,
          flag: 'translate',
          reason: `Term "${hit.term}" should render as "${hit.rendering}" in ${targetLocale}, but canonical form was not found.`,
        });
      }
    }
    // 'adapt' flag is not auto-validated — adaptation requires human judgment.
  }

  return violations;
}

/**
 * Sample Arcanean canon glossary entries — illustrative, not exhaustive.
 * Real glossary lives in apps/web/i18n/glossary.ts and is sourced from
 * the canon files in book/ and .arcanea/.
 */
export const SAMPLE_ARCANEAN_GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    term: 'Pyrathis',
    flag: 'preserve',
    perLocale: { en: 'Pyrathis', de: 'Pyrathis', es: 'Pyrathis', ja: 'Pyrathis' },
    category: 'place',
    world: 'pyrathis',
    note: 'Proper noun — name of the unhatched world-dragon. Always preserved verbatim.',
  },
  {
    term: "Vel'Tara",
    flag: 'preserve',
    perLocale: { en: "Vel'Tara", de: "Vel'Tara", es: "Vel'Tara", ja: "Vel'Tara" },
    category: 'place',
    world: 'vel-tara',
  },
  {
    term: 'Lumina',
    flag: 'preserve',
    perLocale: { en: 'Lumina', de: 'Lumina', es: 'Lumina', ja: 'Lumina' },
    category: 'character',
    note: 'First Light, Form-Giver. AI persona. Always preserved.',
  },
  {
    term: 'Gate Keys',
    flag: 'translate',
    perLocale: {
      en: 'Gate Keys',
      de: 'Tor-Schlüssel',
      es: 'Llaves de la Puerta',
      ja: '門の鍵',
    },
    category: 'artifact',
    note: 'Descriptive category of artifact, not a specific named object. Translates literally.',
  },
  {
    term: 'the Forge',
    flag: 'translate',
    perLocale: { en: 'the Forge', de: 'die Schmiede', es: 'la Forja', ja: '工房' },
    category: 'place',
  },
  {
    term: 'Starbound Crew',
    flag: 'translate',
    perLocale: {
      en: 'Starbound Crew',
      de: 'Sternenwanderer-Crew',
      es: 'Tripulación Astrolímite',
      ja: '星境クルー',
    },
    category: 'faction',
  },
];
