export interface VaultConfig {
  vaultPath: string;
  autoClassify: boolean;
  autoProcess: boolean;
  watchInterval: number;
  defaultExportFormat: string;
  pipeline: Record<string, string | null>;
}

export interface RegistryItem {
  id: string;
  title: string;
  source: string;
  importedAt: string;
  classifiedAt?: string;
  processedAt?: string;
  publishedAt?: string;
  type?: ClassificationType;
  grade?: QualityGrade;
  tags: string[];
  path: string;
  wordCount: number;
  suggestedTitle?: string;
  nextSkill?: string | null;
}

export interface RegistryStats {
  totalImported: number;
  totalClassified: number;
  totalProcessed: number;
  totalPublished: number;
  byPlatform: Record<string, number>;
  byType: Record<string, number>;
  byGrade: Record<string, number>;
}

export interface Registry {
  version: string;
  created: string;
  items: RegistryItem[];
  stats: RegistryStats;
}

export type ClassificationType =
  | 'article'
  | 'research'
  | 'code'
  | 'creative'
  | 'image'
  | 'video'
  | 'prompt'
  | 'idea';

export type QualityGrade = 'A' | 'B' | 'C' | 'D';

export interface ClassificationResult {
  type: ClassificationType;
  theme: string;
  qualityGrade: QualityGrade;
  tags: string[];
  suggestedTitle: string;
  nextSkill: string | null;
  destination: string | null;
  confidence: number;
}

export interface ChatGPTMessage {
  author: { role: 'user' | 'assistant' | 'system' };
  content: { parts: string[] };
  create_time: number;
  metadata?: { model_slug?: string };
}

export interface ChatGPTMapping {
  message: ChatGPTMessage | null;
  children: string[];
  parent: string | null;
}

export interface ChatGPTExport {
  title: string;
  create_time?: number;
  mapping: Record<string, ChatGPTMapping>;
}

export interface ParsedConversation {
  title: string;
  source: string;
  date: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  metadata: Record<string, unknown>;
  artifacts?: Array<{
    type: string;
    filename: string;
    content: string;
  }>;
}

export interface FrontmatterData {
  title: string;
  source: string;
  date: string;
  type?: ClassificationType;
  grade?: QualityGrade;
  tags?: string[];
  wordCount?: number;
  nextSkill?: string | null;
  [key: string]: unknown;
}

export interface SearchResult {
  path: string;
  title: string;
  source: string;
  grade?: QualityGrade;
  type?: ClassificationType;
  snippet: string;
  score: number;
}

export interface DigestData {
  date: string;
  imports: {
    total: number;
    byPlatform: Record<string, { total: number; byType: Record<string, number> }>;
  };
  highlights: Array<{ title: string; type: string; wordCount: number }>;
  readyForProcessing: Record<string, { count: number; skill: string }>;
  pendingClassification: number;
}
