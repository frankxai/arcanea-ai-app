/**
 * JSON-LD schema builders for the Arcanea i18n system.
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
 */

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
    '@context': 'https://schema.org',
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
    '@context': 'https://schema.org',
    ...personSchema(input),
  };
}

export function createBookSchema(input: BookSchemaInput): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
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
    '@context': 'https://schema.org',
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
    '@context': 'https://schema.org',
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
 * Render a JSON-LD object as a <script> tag string. Useful for static
 * generation. In React Server Components prefer:
 *   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
 */
export function renderJsonLdScript(schema: Record<string, unknown>): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}
