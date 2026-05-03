export * from './types';
export {
  defineLocaleConfig,
  resolvePathname,
  buildLocalizedUrl,
  getLocaleVariants,
} from './routing';
export type { ContentSlugInput } from './routing';
export {
  detectLocale,
  shouldRedirectToLocale,
  stripLocalePrefix,
  LOCALE_COOKIE,
} from './middleware';
export {
  generateHreflang,
  renderHreflangLinks,
  generateLocaleSitemap,
  renderSitemapXml,
  renderSitemapIndex,
  generateLLMsManifest,
  llmsEntryFromBook,
} from './seo';
export {
  createOrganizationSchema,
  createPersonSchema,
  createBookSchema,
  createCreativeWorkSchema,
  createArticleSchema,
  renderJsonLdScript,
  stringifyJsonLdSafe,
  escapeJsonForScript,
  STARLIGHT_JSONLD_CONTEXT,
} from './schema';
export { asciiSlug, validateSlug, buildLocaleSlugMap } from './slugs';
export {
  defineGlossary,
  lookupTerm,
  scanPassage,
  validateTranslation,
  SAMPLE_ARCANEAN_GLOSSARY_ENTRIES,
} from './glossary';
export type {
  Glossary,
  GlossaryEntry,
  GlossaryFlag,
  GlossaryViolation,
  DefineGlossaryInput,
} from './glossary';
export {
  bookSchemaForLocale,
  generateTranslationTasks,
  getRoyaltySplit,
  splitTranslatorShare,
  validateBookRecord,
  assertValidRoyaltySplit,
  ROYALTY_SPLIT_PROFILES,
} from './book';
export type {
  BookSchemaForLocaleInput,
  GenerateTranslationTasksInput,
  RoyaltySplitProfile,
  RoyaltySplit,
  TranslatorContribution,
} from './book';
