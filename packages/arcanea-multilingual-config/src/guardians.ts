/**
 * Per-locale Guardian agent roster for Arcanea.
 *
 * Each Guardian role (Voice Alchemist, Line Editor, Sensitivity Reader,
 * etc.) needs locale-specific variants for Translation Studio review.
 *
 * Phase 1 ships English Guardians only. Phase 4 (Translation Studio)
 * activates per-locale variants.
 *
 * Guardian definitions live in `.claude/agents/`. This file is a
 * registry mapping role + locale → agent ID.
 */

export type GuardianRole =
  | 'voiceAlchemist'
  | 'lineEditor'
  | 'sensitivityReader'
  | 'continuityGuardian'
  | 'masterStoryArchitect'
  | 'characterPsychologist'
  | 'developmentalEditor'
  | 'researchLibrarian'
  | 'publishingStrategist';

/**
 * Map of role → locale → agent ID.
 *
 * `null` means the variant doesn't exist yet. The Translation Studio
 * pipeline checks this before scheduling review and falls back to the
 * Continuity Guardian (language-agnostic) plus a human reviewer if a
 * locale Guardian isn't available.
 */
export const ARCANEAN_GUARDIAN_ROSTER: Record<GuardianRole, Record<string, string | null>> = {
  voiceAlchemist: {
    en: 'voice-alchemist',
    de: null, // Phase 4
    es: null, // Phase 4
    ja: null, // Phase 4
  },
  lineEditor: {
    en: 'line-editor-voice-alchemist',
    de: null,
    es: null,
    ja: null,
  },
  sensitivityReader: {
    en: 'sensitivity-reader',
    de: null,
    es: null,
    ja: null,
    'pt-BR': null,
  },

  // Continuity Guardian is language-agnostic (canon facts) — single agent
  // works across all locales.
  continuityGuardian: {
    en: 'continuity-guardian',
    de: 'continuity-guardian',
    es: 'continuity-guardian',
    ja: 'continuity-guardian',
    fr: 'continuity-guardian',
    'pt-BR': 'continuity-guardian',
    'zh-Hans': 'continuity-guardian',
  },

  masterStoryArchitect: {
    en: 'master-story-architect',
    de: null, // Phase 5
    ja: null, // Phase 5
  },
  characterPsychologist: {
    en: 'character-psychologist',
    de: null,
    ja: null,
  },
  developmentalEditor: {
    en: 'developmental-editor',
    de: null,
  },
  researchLibrarian: {
    en: 'research-librarian',
    de: 'research-librarian', // language-agnostic
    es: 'research-librarian',
    ja: 'research-librarian',
  },
  publishingStrategist: {
    en: 'publishing-strategist',
    de: null,
  },
};

/**
 * Resolve the Guardian agent for a role × locale, with fallback chain.
 *
 * Order:
 *   1. Specific role × locale variant (e.g. voice-alchemist-de)
 *   2. Specific role × default locale (English variant) — only when role
 *      is language-agnostic; otherwise null
 *   3. null — caller should escalate to human review or skip this Guardian
 *
 * Use isLanguageAgnostic(role) to decide whether English fallback is safe.
 */
export function resolveGuardian(role: GuardianRole, locale: string): string | null {
  return ARCANEAN_GUARDIAN_ROSTER[role]?.[locale] ?? null;
}

const LANGUAGE_AGNOSTIC_ROLES: GuardianRole[] = ['continuityGuardian', 'researchLibrarian'];

export function isLanguageAgnosticRole(role: GuardianRole): boolean {
  return LANGUAGE_AGNOSTIC_ROLES.includes(role);
}

/**
 * Build the review chain for a translated chapter. Returns the ordered
 * list of Guardian agent IDs to invoke, with null entries for missing
 * locale variants (caller decides whether to fall back to human review).
 */
export function buildReviewChain(targetLocale: string): Array<{
  role: GuardianRole;
  agentId: string | null;
  required: boolean;
}> {
  return [
    { role: 'voiceAlchemist', agentId: resolveGuardian('voiceAlchemist', targetLocale), required: true },
    { role: 'lineEditor', agentId: resolveGuardian('lineEditor', targetLocale), required: false },
    { role: 'sensitivityReader', agentId: resolveGuardian('sensitivityReader', targetLocale), required: true },
    { role: 'continuityGuardian', agentId: resolveGuardian('continuityGuardian', targetLocale), required: true },
  ];
}
