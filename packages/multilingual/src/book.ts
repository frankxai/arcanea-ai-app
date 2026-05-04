/**
 * Book-specific multilingual helpers. Bridges @starlight/multilingual with
 * Library OS / Open Library publishing workflows.
 *
 * Provides:
 * - BookLocaleRecord shape (per-locale slug, title, status, translator credits)
 * - Book schema builder that auto-fills `workTranslation` chain when a book
 *   has multiple locales registered
 * - Translation task generation: given a book + target locales, produce the
 *   set of translation tasks to create in Author Studio
 * - Translator economy: split royalties between author + translator(s) +
 *   platform per locale
 */

import type {
  BookLocale,
  BookRecord,
  LocaleConfig,
  TranslationTask,
} from './types';
import { createBookSchema, type BookSchemaInput, type PersonSchemaInput } from './schema';
import { buildLocalizedUrl } from './routing';

export interface BookSchemaForLocaleInput {
  config: LocaleConfig;
  book: BookRecord;
  locale: string;
  /**
   * Internal route to the book detail page (e.g. '/library/[slug]'). The
   * helper substitutes the locale's slug to produce the canonical URL.
   */
  bookRoutePath: string;
  /** Authors of the original work. */
  authors: PersonSchemaInput[];
  /** AI involvement flag. Defaults to 'human-authored' if not specified. */
  aiInvolvement?: string;
  /** Optional book genre (e.g. 'fantasy', 'sci-fi'). */
  genre?: string;
  /** Optional cover image URL. */
  image?: string;
  /** Optional book description for this locale. */
  description?: string;
  /** Translator(s) for this locale. Required if locale !== originalLanguage. */
  translators?: PersonSchemaInput[];
  /** Publisher (e.g. Arcanea Open Library). */
  publisher?: { name: string; url: string; logo?: string };
}

/**
 * Build a JSON-LD `Book` schema for one locale of a multilingual book. Auto-
 * fills `workTranslation` linking back to the original work when this locale
 * is a translation, not the original.
 */
export function bookSchemaForLocale(
  input: BookSchemaForLocaleInput,
): Record<string, unknown> {
  const { config, book, locale, bookRoutePath } = input;

  const localeRecord = book.locales.find((l) => l.locale === locale);
  if (!localeRecord) {
    throw new Error(
      `bookSchemaForLocale: book ${book.id} has no locale "${locale}" registered.`,
    );
  }

  const url = buildLocalizedUrl(config, bookRoutePath, locale, localeRecord.slug);

  // If this is a translation, find the original locale and link back
  let originalWorkUrl: string | undefined;
  let originalLanguage: string | undefined;
  if (locale !== book.originalLanguage) {
    const original = book.locales.find((l) => l.locale === book.originalLanguage);
    if (!original) {
      // A translation that can't link back to its original is an AEO/SEO
      // trust hit — LLM crawlers see what looks like a German "original"
      // when it's actually translated from a missing English source.
      throw new Error(
        `bookSchemaForLocale: book ${book.id} declares originalLanguage="${book.originalLanguage}" ` +
          `but that locale is not in book.locales. Cannot generate workTranslation chain. ` +
          `Either add the original-language locale to book.locales, or correct originalLanguage.`,
      );
    }
    originalWorkUrl = buildLocalizedUrl(
      config,
      bookRoutePath,
      book.originalLanguage,
      original.slug,
    );
    originalLanguage = book.originalLanguage;
  }

  const schemaInput: BookSchemaInput = {
    id: `urn:starlight:book:${book.id}:${locale}`,
    url,
    name: localeRecord.title,
    inLanguage: locale,
    authors: input.authors,
    description: input.description,
    isbn: book.isbn,
    genre: book.genre ?? input.genre,
    datePublished: localeRecord.publishedAt,
    image: input.image,
    publisher: input.publisher,
    aiInvolvement: input.aiInvolvement,
  };

  if (originalWorkUrl && originalLanguage) {
    schemaInput.originalWorkUrl = originalWorkUrl;
    schemaInput.originalLanguage = originalLanguage;
  }
  if (input.translators) {
    schemaInput.translators = input.translators;
  }

  return createBookSchema(schemaInput);
}

/**
 * Generate the set of translation tasks to create for a book, given a list
 * of target locales. Skips locales that are already published. Defaults to
 * one task per locale at whole-book scope; chapter-scope tasks are created
 * separately by Author Studio when the book is too large for one translator.
 */
export interface GenerateTranslationTasksInput {
  book: BookRecord;
  targetLocales: string[];
  /** Optional default reward share for translators (0..1). */
  defaultRewardShare?: number;
  /** Optional due date offset in days from creation. */
  dueDays?: number;
}

export function generateTranslationTasks(
  input: GenerateTranslationTasksInput,
): Omit<TranslationTask, 'id' | 'createdAt' | 'updatedAt' | 'assigneeId' | 'claimedAt'>[] {
  const { book, targetLocales } = input;
  const reward = input.defaultRewardShare ?? 0.2;
  const dueAt = input.dueDays
    ? new Date(Date.now() + input.dueDays * 24 * 60 * 60 * 1000).toISOString()
    : undefined;

  return targetLocales
    .filter((target) => target !== book.originalLanguage)
    .filter((target) => {
      const existing = book.locales.find((l) => l.locale === target);
      return !existing || existing.status === 'planned';
    })
    .map((target) => ({
      bookId: book.id,
      sourceLocale: book.originalLanguage,
      targetLocale: target,
      scope: 'whole_book' as const,
      status: 'open' as const,
      rewardShare: reward,
      dueAt,
    }));
}

/**
 * Translator economy split for a book locale's royalties. Returns the
 * fraction of locale revenue that goes to each party.
 *
 * Defaults to "Generous" split: 50% author / 20% translator / 30% platform.
 * Override per book in Author Studio.
 */
export type RoyaltySplitProfile = 'conservative' | 'generous' | 'community-prioritized';

export interface RoyaltySplit {
  author: number;
  translator: number;
  platform: number;
}

export const ROYALTY_SPLIT_PROFILES: Record<RoyaltySplitProfile, RoyaltySplit> = {
  conservative: { author: 0.6, translator: 0.1, platform: 0.3 },
  generous: { author: 0.5, translator: 0.2, platform: 0.3 },
  'community-prioritized': { author: 0.4, translator: 0.3, platform: 0.3 },
};

/**
 * Validate that a royalty split sums to 1.0 (within floating-point tolerance)
 * and all values are in [0, 1]. Throws if invalid.
 *
 * Use when accepting a custom split from configuration. Built-in profiles are
 * tested in unit tests; this guards against future contributors defining
 * splits that overpay (e.g. {author:0.7, translator:0.5, platform:0.3}).
 */
export function assertValidRoyaltySplit(split: RoyaltySplit): void {
  for (const [k, v] of Object.entries(split)) {
    if (v < 0 || v > 1) {
      throw new Error(`assertValidRoyaltySplit: ${k}=${v} is outside [0,1].`);
    }
  }
  const sum = split.author + split.translator + split.platform;
  if (Math.abs(sum - 1) > 0.0001) {
    throw new Error(
      `assertValidRoyaltySplit: sum is ${sum.toFixed(4)}, must be 1.0. Got ${JSON.stringify(split)}.`,
    );
  }
}

export function getRoyaltySplit(profile: RoyaltySplitProfile = 'generous'): RoyaltySplit {
  return ROYALTY_SPLIT_PROFILES[profile];
}

/**
 * For multi-translator books (different translators handled different
 * chapters in a locale), split the translator share proportionally by word
 * count contributed.
 */
export interface TranslatorContribution {
  translatorId: string;
  wordCount: number;
}

export function splitTranslatorShare(
  contributions: TranslatorContribution[],
  totalTranslatorShare: number,
): Record<string, number> {
  const totalWords = contributions.reduce((s, c) => s + c.wordCount, 0);
  if (totalWords === 0) return {};

  const out: Record<string, number> = {};
  for (const c of contributions) {
    out[c.translatorId] = (c.wordCount / totalWords) * totalTranslatorShare;
  }
  return out;
}

/**
 * Validate a BookRecord — checks slug uniqueness across locales, presence
 * of originalLanguage in locale list, status consistency. Returns array of
 * issue strings; empty = valid.
 */
export function validateBookRecord(book: BookRecord): string[] {
  const issues: string[] = [];

  // originalLanguage must be in locales list
  if (!book.locales.some((l) => l.locale === book.originalLanguage)) {
    issues.push(
      `Book ${book.id}: originalLanguage "${book.originalLanguage}" not present in locales array.`,
    );
  }

  // Slug uniqueness PER-locale (across this book's locales there should be
  // one slug per locale, no duplicates)
  const slugByLocale = new Map<string, string>();
  for (const loc of book.locales) {
    const existing = slugByLocale.get(loc.locale);
    if (existing && existing !== loc.slug) {
      issues.push(
        `Book ${book.id}: locale "${loc.locale}" has multiple slugs ("${existing}" and "${loc.slug}").`,
      );
    }
    slugByLocale.set(loc.locale, loc.slug);
  }

  // Status sanity — published locales should have publishedAt
  for (const loc of book.locales) {
    if (loc.status === 'published' && !loc.publishedAt) {
      issues.push(
        `Book ${book.id}: locale "${loc.locale}" status=published but no publishedAt timestamp.`,
      );
    }
  }

  return issues;
}
