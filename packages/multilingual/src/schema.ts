/**
 * JSON-LD schema builders for the Starlight multilingual system.
 *
 * Provenance + locale awareness is the AEO unlock. Every Book, Article,
 * Person, and CreativeWork carries:
 * - inLanguage (BCP 47)
 * - workTranslation (link to original work, when this is a translation)
 * - translator (when translated)
 * - aiInvolvement (custom property; transparency for AEO trust)
 *
 * These builders return plain objects suitable for `JSON.stringify` and
 * inclusion in <script type="application/ld+json">.
 *
 * IMPORTANT: never call `JSON.stringify` directly when embedding in HTML.
 * Use `stringifyJsonLdSafe` to escape </script>, <!--, U+2028/2029.
 */

/**
 * @context value used by all schema builders. Includes the Arcanean
 * vocabulary mapping so custom properties (`arcanea:aiInvolvement`,
 * `arcanea:canonWorld`, etc.) are visible to JSON-LD-aware crawlers.
 *
 * Without this mapping, `arcanea:` properties are silently discarded by
 * most consumers — defeating their AEO purpose.
 */
export const STARLIGHT_JSONLD_CONTEXT = {
  '@vocab': 'https://schema.org/',
  arcanea: 'https://arcanea.ai/schema/',
} as const;

export interface OrganizationSchemaInput {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  description?: string;
}

export interface PersonSchemaInput {
  name: string;
  url?: string;
  description?: string;
  /**
   * Set true for AI personas (Lumina, Guardians). Adds a custom
   * `additionalType` flag so AEO crawlers can distinguish.
   */
  isAi?: boolean;
  knowsLanguage?: string[];
}

export interface BookSchemaInput {
  id: string;
  url: string;
  name: string;
  description?: string;
  inLanguage: string;
  /**
   * If this Book is a translation, provide the original work URL and locale.
   * Sets workTranslation + translationOfWork in the output.
   */
  originalWorkUrl?: string;
  originalLanguage?: string;
  authors: PersonSchemaInput[];
  translators?: PersonSchemaInput[];
  isbn?: string;
  genre?: string;
  datePublished?: string;
  publisher?: OrganizationSchemaInput;
  image?: string;
  /**
   * Transparency disclosure for AEO trust. Examples:
   *   'human-authored'
   *   'human-authored-ai-edited'
   *   'ai-co-authored'
   *   'ai-translated-human-reviewed'
   */
  aiInvolvement?: string;
}

export interface CreativeWorkSchemaInput {
  url: string;
  name: string;
  description?: string;
  inLanguage: string;
  creators: PersonSchemaInput[];
  datePublished?: string;
  image?: string;
  about?: string;
  aiInvolvement?: string;
}

export interface ArticleSchemaInput {
  url: string;
  headline: string;
  description?: string;
  inLanguage: string;
  authors: PersonSchemaInput[];
  datePublished: string;
  dateModified?: string;
  image?: string;
  publisher?: OrganizationSchemaInput;
  aiInvolvement?: string;
}

function personSchema(input: PersonSchemaInput): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@type': 'Person',
    name: input.name,
  };
  if (input.url) schema.url = input.url;
  if (input.description) schema.description = input.description;
  if (input.knowsLanguage?.length) schema.knowsLanguage = input.knowsLanguage;
  if (input.isAi) {
    // Transparency: explicitly mark AI personas. Custom additionalType
    // so AEO crawlers can distinguish without breaking schema.org compatibility.
    schema.additionalType = 'https://arcanea.ai/schema/AiPersona';
  }
  return schema;
}

export function createOrganizationSchema(
  input: OrganizationSchemaInput,
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': STARLIGHT_JSONLD_CONTEXT,
    '@type': 'Organization',
    name: input.name,
    url: input.url,
  };
  if (input.logo) schema.logo = input.logo;
  if (input.description) schema.description = input.description;
  if (input.sameAs?.length) schema.sameAs = input.sameAs;
  return schema;
}

export function createPersonSchema(input: PersonSchemaInput): Record<string, unknown> {
  return {
    '@context': STARLIGHT_JSONLD_CONTEXT,
    ...personSchema(input),
  };
}

export function createBookSchema(input: BookSchemaInput): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': STARLIGHT_JSONLD_CONTEXT,
    '@type': 'Book',
    '@id': input.id,
    url: input.url,
    name: input.name,
    inLanguage: input.inLanguage,
    author: input.authors.map(personSchema),
  };

  if (input.description) schema.description = input.description;
  if (input.translators?.length) {
    schema.translator = input.translators.map(personSchema);
  }
  if (input.originalWorkUrl && input.originalLanguage) {
    schema.translationOfWork = {
      '@type': 'Book',
      url: input.originalWorkUrl,
      inLanguage: input.originalLanguage,
    };
  }
  if (input.isbn) schema.isbn = input.isbn;
  if (input.genre) schema.genre = input.genre;
  if (input.datePublished) schema.datePublished = input.datePublished;
  if (input.image) schema.image = input.image;
  if (input.publisher) {
    schema.publisher = {
      '@type': 'Organization',
      name: input.publisher.name,
      url: input.publisher.url,
    };
  }
  if (input.aiInvolvement) {
    schema['arcanea:aiInvolvement'] = input.aiInvolvement;
  }

  return schema;
}

export function createCreativeWorkSchema(
  input: CreativeWorkSchemaInput,
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': STARLIGHT_JSONLD_CONTEXT,
    '@type': 'CreativeWork',
    url: input.url,
    name: input.name,
    inLanguage: input.inLanguage,
    creator: input.creators.map(personSchema),
  };

  if (input.description) schema.description = input.description;
  if (input.datePublished) schema.datePublished = input.datePublished;
  if (input.image) schema.image = input.image;
  if (input.about) schema.about = input.about;
  if (input.aiInvolvement) {
    schema['arcanea:aiInvolvement'] = input.aiInvolvement;
  }

  return schema;
}

export function createArticleSchema(input: ArticleSchemaInput): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': STARLIGHT_JSONLD_CONTEXT,
    '@type': 'Article',
    headline: input.headline,
    url: input.url,
    inLanguage: input.inLanguage,
    author: input.authors.map(personSchema),
    datePublished: input.datePublished,
  };

  if (input.description) schema.description = input.description;
  if (input.dateModified) schema.dateModified = input.dateModified;
  if (input.image) schema.image = input.image;
  if (input.publisher) {
    schema.publisher = {
      '@type': 'Organization',
      name: input.publisher.name,
      url: input.publisher.url,
      ...(input.publisher.logo ? { logo: input.publisher.logo } : {}),
    };
  }
  if (input.aiInvolvement) {
    schema['arcanea:aiInvolvement'] = input.aiInvolvement;
  }

  return schema;
}

/**
 * Escape a JSON string for safe inclusion in an HTML <script> tag.
 *
 * Defends against:
 * - </script> in any string field (would break out of the script context)
 * - <!-- and --> (HTML comment context)
 * - U+2028 and U+2029 (LINE SEPARATOR / PARAGRAPH SEPARATOR — valid JSON whitespace
 *   but invalid in JavaScript string literals; cause syntax errors when browsers
 *   parse the inline JSON-LD)
 *
 * Use this for ANY user-controlled or content-derived data that ends up in
 * <script type="application/ld+json"> or similar inline-script contexts.
 */
export function escapeJsonForScript(json: string): string {
  // U+2028 LINE SEPARATOR
  const ls = String.fromCharCode(0x2028);
  // U+2029 PARAGRAPH SEPARATOR
  const ps = String.fromCharCode(0x2029);
  return json
    .replace(/<\/script/gi, '<\\/script')
    .replace(/<!--/g, '<\\!--')
    .split(ls).join('\\u2028')
    .split(ps).join('\\u2029');
}

/**
 * Stringify a JSON-LD object safely for HTML inline script inclusion.
 * Always use this instead of `JSON.stringify(schema)` directly when the
 * output goes to <script type="application/ld+json">.
 */
export function stringifyJsonLdSafe(schema: Record<string, unknown>): string {
  return escapeJsonForScript(JSON.stringify(schema));
}

/**
 * Render a JSON-LD object as a <script> tag string. Useful for static
 * generation. In React Server Components prefer:
 *   import { stringifyJsonLdSafe } from '@starlight/multilingual';
 *   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: stringifyJsonLdSafe(schema) }} />
 */
export function renderJsonLdScript(schema: Record<string, unknown>): string {
  return `<script type="application/ld+json">${stringifyJsonLdSafe(schema)}</script>`;
}
