/**
 * TypeScript types for Arcanea Publishing House Notion databases.
 *
 * These types mirror the 6 Notion database schemas and provide
 * strong typing for all setup, query, and sync operations.
 */

// ---------------------------------------------------------------------------
// Notion property type helpers
// ---------------------------------------------------------------------------

export type NotionPropertyType =
  | 'title'
  | 'rich_text'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'checkbox'
  | 'url'
  | 'relation';

export interface SelectOption {
  name: string;
  color?: string;
}

export interface NotionPropertySchema {
  type: NotionPropertyType;
  options?: SelectOption[];
  /** Database ID to relate to — resolved at runtime */
  relation_database_id?: string;
}

export interface NotionDatabaseSchema {
  title: string;
  icon?: string;
  properties: Record<string, NotionPropertySchema>;
}

// ---------------------------------------------------------------------------
// Database IDs returned after setup
// ---------------------------------------------------------------------------

export interface DatabaseIds {
  editorialBoard: string;
  assetLibrary: string;
  distributionTracker: string;
  translationQueue: string;
  analytics: string;
  clientPortal: string;
}

// ---------------------------------------------------------------------------
// Editorial Board
// ---------------------------------------------------------------------------

export type EditorialStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'published'
  | 'archived';

export type Language = 'en' | 'nl' | 'de' | 'es' | 'pt' | 'ja' | 'fr';

export interface EditorialBoardEntry {
  title: string;
  status: EditorialStatus;
  collection: string;
  author: string;
  wordCount: number;
  qualityScore: number;
  language: Language;
  sourcePath: string;
  lastSynced: string; // ISO 8601
}

// ---------------------------------------------------------------------------
// Asset Library
// ---------------------------------------------------------------------------

export type AssetType = 'cover' | 'illustration' | 'banner' | 'social' | 'nft';

export type Guardian =
  | 'Aiyami'
  | 'Alera'
  | 'Draconia'
  | 'Elara'
  | 'Ino'
  | 'Ismael'
  | 'Leyla'
  | 'Lumina'
  | 'Lyria'
  | 'Lyssandria'
  | 'Maylinn'
  | 'Shinkami';

export type Element =
  | 'Fire'
  | 'Water'
  | 'Earth'
  | 'Air'
  | 'Light'
  | 'Shadow'
  | 'Arcane';

export interface AssetLibraryEntry {
  name: string;
  type: AssetType;
  tasteScore: number;
  guardian: Guardian;
  element: Element;
  approved: boolean;
  contentId: string; // relation to Editorial Board
}

// ---------------------------------------------------------------------------
// Distribution Tracker
// ---------------------------------------------------------------------------

export type Platform =
  | 'Kindle'
  | 'Leanpub'
  | 'Draft2Digital'
  | 'NFT'
  | 'Web'
  | 'Social';

export type DistributionStatus = 'pending' | 'submitted' | 'live' | 'failed';

export interface DistributionTrackerEntry {
  content: string;
  platforms: Platform[];
  status: DistributionStatus;
  url: string;
  revenue: number;
  datePublished: string; // ISO 8601
}

// ---------------------------------------------------------------------------
// Translation Queue
// ---------------------------------------------------------------------------

export type TargetLanguage =
  | 'nl'
  | 'de'
  | 'es'
  | 'pt'
  | 'ja'
  | 'fr'
  | 'zh'
  | 'ko';

export type TranslationStatus =
  | 'pending'
  | 'translating'
  | 'reviewing'
  | 'done';

export interface TranslationQueueEntry {
  source: string;
  targetLanguage: TargetLanguage;
  status: TranslationStatus;
  qualityScore: number;
  outputPath: string;
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export type AnalyticsPlatform =
  | 'Kindle'
  | 'Leanpub'
  | 'Web'
  | 'Social'
  | 'NFT';

export interface AnalyticsEntry {
  content: string;
  platform: AnalyticsPlatform;
  views: number;
  revenue: number;
  engagement: number;
  period: string; // ISO 8601
}

// ---------------------------------------------------------------------------
// Client Portal
// ---------------------------------------------------------------------------

export type ClientVertical =
  | 'conscious-ai'
  | 'music'
  | 'fiction'
  | 'non-fiction'
  | 'education';

export type ClientStatus = 'onboarding' | 'active' | 'churned';

export interface ClientPortalEntry {
  clientName: string;
  vertical: ClientVertical;
  contentCount: number;
  status: ClientStatus;
  agentFleet: string;
}
