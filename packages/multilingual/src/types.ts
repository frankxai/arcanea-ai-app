export type LocaleCode =
  | 'en'
  | 'de'
  | 'es'
  | 'ja'
  | 'fr'
  | 'pt-BR'
  | 'zh-Hans'
  | 'it'
  | 'nl'
  | 'pl'
  | 'tr'
  | 'ar'
  | 'ko';

export type LocalePrefixMode = 'as-needed' | 'always' | 'never';

export interface LocalizedPathname {
  [locale: string]: string;
}

export type PathnameValue = string | LocalizedPathname;

export interface PathnameMap {
  [internalPath: string]: PathnameValue;
}

export interface LocaleConfig {
  locales: ReadonlyArray<LocaleCode | string>;
  defaultLocale: LocaleCode | string;
  localePrefix: LocalePrefixMode;
  pathnames: PathnameMap;
  domain: string;
  alternateLocales?: Record<string, string>;
}

export interface BookLocale {
  locale: string;
  slug: string;
  title: string;
  status: 'planned' | 'in_progress' | 'published';
  translatorIds?: string[];
  publishedAt?: string;
}

export interface BookRecord {
  id: string;
  originalLanguage: string;
  authorIds: string[];
  isbn?: string;
  genre?: string;
  locales: BookLocale[];
}

export type TranslationStatus =
  | 'open'
  | 'claimed'
  | 'in_progress'
  | 'in_review'
  | 'approved'
  | 'published'
  | 'rejected';

export interface TranslationTask {
  id: string;
  bookId: string;
  sourceLocale: string;
  targetLocale: string;
  scope: 'chapter' | 'whole_book';
  chapterId?: string;
  status: TranslationStatus;
  assigneeId?: string;
  claimedAt?: string;
  dueAt?: string;
  rewardShare: number;
  createdAt: string;
  updatedAt: string;
}

export interface HreflangAlternate {
  hreflang: string;
  href: string;
}

export interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: HreflangAlternate[];
}

export interface LLMsManifestEntry {
  title: string;
  url: string;
  description?: string;
  category?: string;
}

export interface LLMsManifest {
  siteName: string;
  description: string;
  locale: string;
  sections: Array<{
    name: string;
    entries: LLMsManifestEntry[];
  }>;
}
