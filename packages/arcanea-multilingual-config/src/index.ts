// Locale roadmap
export {
  ARCANEAN_LOCALES_PHASE_1,
  ARCANEAN_LOCALES_PHASE_2,
  ARCANEAN_LOCALES_PHASE_3,
  ARCANEAN_DEFAULT_LOCALE,
  ARCANEAN_ACTIVE_LOCALES,
} from './locales';
export type { ArcaneanLocale } from './locales';

// Pathnames matrix
export { ARCANEAN_PATHNAMES, ARCANEAN_SECTION_LOCALES } from './pathnames';

// Canon glossary
export { ARCANEAN_GLOSSARY_ENTRIES, arcaneanGlossary } from './glossary';

// Voice guides
export {
  LUMINA_VOICE_EN,
  LUMINA_VOICE_DE,
  VOICE_GUIDES,
  getVoiceGuide,
  listAvailableVoices,
} from './voices';
export type { VoiceGuide } from './voices';

// Guardian roster
export {
  ARCANEAN_GUARDIAN_ROSTER,
  resolveGuardian,
  isLanguageAgnosticRole,
  buildReviewChain,
} from './guardians';
export type { GuardianRole } from './guardians';

// Royalty defaults
export {
  ARCANEAN_DEFAULT_ROYALTY_PROFILE,
  ARCANEAN_ROYALTY_TIER_DEFAULTS,
} from './royalty';

// Preset factory (the main entry point)
export { createArcaneanConfig } from './preset';
export type { CreateArcaneanConfigInput } from './preset';
