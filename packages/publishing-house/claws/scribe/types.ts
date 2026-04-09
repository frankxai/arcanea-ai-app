/**
 * Arcanea Publishing House — Scribe Claw Types
 *
 * All types for the content formatting, distribution, and translation pipelines.
 */

// ---------------------------------------------------------------------------
// Format Pipeline
// ---------------------------------------------------------------------------

export interface FormatOptions {
  title: string;
  author: string;
  language: string;
  coverImage?: string;
  tocDepth?: number;
  css?: string;
}

export interface FormatResult {
  epub: string;
  pdf: string;
  docx: string;
  html: string;
}

export interface FrontMatter {
  title?: string;
  author?: string;
  date?: string;
  language?: string;
  description?: string;
  [key: string]: string | undefined;
}

// ---------------------------------------------------------------------------
// Distribution Pipeline
// ---------------------------------------------------------------------------

export type Platform = 'leanpub' | 'arcanea-web' | 'social-queue' | 'nft-forge';

export type DistributeStatus = 'submitted' | 'live' | 'failed';

export interface DistributeInput {
  /** Unique content identifier */
  contentId: string;
  /** Title of the content */
  title: string;
  /** Path to the source markdown file */
  sourcePath: string;
  /** Path to the formatted EPUB (if available) */
  epubPath?: string;
  /** Path to the formatted PDF (if available) */
  pdfPath?: string;
  /** Author name */
  author: string;
  /** Short description / blurb */
  description?: string;
  /** Cover image path */
  coverImage?: string;
  /** Optional metadata for platform-specific fields */
  metadata?: Record<string, string>;
}

export interface DistributeResult {
  platform: Platform;
  status: DistributeStatus;
  url?: string;
  error?: string;
}

export interface LeanpubConfig {
  slug: string;
  apiKey: string;
}

export interface ArcaneaWebConfig {
  deployDir: string;
  vercelToken?: string;
  vercelProjectId?: string;
  vercelTeamId?: string;
}

export interface SocialQueueConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export interface NftForgeConfig {
  outputDir: string;
  triggerUrl?: string;
}

export interface DistributeConfig {
  leanpub?: LeanpubConfig;
  arcaneaWeb?: ArcaneaWebConfig;
  socialQueue?: SocialQueueConfig;
  nftForge?: NftForgeConfig;
}

// ---------------------------------------------------------------------------
// Translation Pipeline
// ---------------------------------------------------------------------------

export type Language = 'nl' | 'de' | 'es' | 'pt' | 'ja' | 'fr' | 'zh' | 'ko';

export type TranslationProvider = 'claude' | 'deepl';

export interface TranslateOptions {
  provider: TranslationProvider;
  preserveFormatting: boolean;
  glossary?: Record<string, string>;
}

export interface TranslateResult {
  translatedText: string;
  sourceLang: string;
  targetLang: Language;
  provider: TranslationProvider;
  wordCount: number;
  chunkCount: number;
}

export interface ClaudeTranslateConfig {
  apiKey: string;
  model?: string;
}

export interface DeepLTranslateConfig {
  apiKey: string;
  formality?: 'default' | 'more' | 'less';
}

export interface TranslateConfig {
  claude?: ClaudeTranslateConfig;
  deepl?: DeepLTranslateConfig;
}

// ---------------------------------------------------------------------------
// Content Chunk (used internally for long-document translation)
// ---------------------------------------------------------------------------

export interface ContentChunk {
  index: number;
  heading?: string;
  text: string;
  wordCount: number;
}
