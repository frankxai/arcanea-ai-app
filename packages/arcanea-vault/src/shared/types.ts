// ─── Platform Identifiers ───────────────────────────────────────────────────

export type Platform = 'chatgpt' | 'claude' | 'perplexity' | 'grok' | 'gemini';

export type ExportFormat = 'markdown' | 'json' | 'zip';

export type MessageRole = 'user' | 'assistant' | 'system';

export type ArtifactType = 'code' | 'document' | 'svg' | 'html' | 'react' | 'mermaid';

// ─── Core Data Models ───────────────────────────────────────────────────────

export interface ExportedConversation {
  id: string;
  platform: Platform;
  title: string;
  messages: ExportedMessage[];
  metadata: ConversationMetadata;
  artifacts: ExportedArtifact[];
  images: ExportedImage[];
  exportedAt: number;
}

export interface ExportedMessage {
  role: MessageRole;
  content: string;
  timestamp?: number;
  model?: string;
  attachments?: ExportedAttachment[];
}

export interface ExportedAttachment {
  id: string;
  type: 'file' | 'image' | 'code';
  name: string;
  content?: string;
  url?: string;
  mimeType?: string;
}

export interface ExportedArtifact {
  id: string;
  type: ArtifactType;
  title: string;
  content: string;
  language?: string;
}

export interface ExportedImage {
  id: string;
  url: string;
  prompt?: string;
  localBlob?: Blob;
}

export interface ConversationMetadata {
  model?: string;
  project?: string;
  createdAt?: number;
  updatedAt?: number;
  messageCount: number;
  wordCount: number;
  hasCode: boolean;
  hasImages: boolean;
  hasArtifacts: boolean;
  citations?: Citation[];
}

export interface Citation {
  title: string;
  url: string;
  snippet?: string;
}

// ─── Platform Extractor Interface ───────────────────────────────────────────

export interface PlatformSelectors {
  conversationContainer: string;
  messageBlock: string;
  userMessage: string;
  assistantMessage: string;
  codeBlock: string;
  imageBlock?: string;
  artifactPanel?: string;
  conversationTitle: string;
  sidebarConversationList?: string;
  citationBlock?: string;
}

export interface PlatformExtractor {
  platform: Platform;
  matchUrl(url: string): boolean;
  extractCurrentConversation(): Promise<ExportedConversation>;
  extractAllConversations?(): AsyncGenerator<ExportedConversation>;
  getSelectors(): PlatformSelectors;
}

// ─── Export Job ─────────────────────────────────────────────────────────────

export type ExportJobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ExportJob {
  id: string;
  platform: Platform;
  conversationId: string;
  format: ExportFormat;
  status: ExportJobStatus;
  progress: number;
  createdAt: number;
  completedAt?: number;
  error?: string;
  result?: string;
}

// ─── Message Types (Chrome messaging) ───────────────────────────────────────

export type VaultMessageType =
  | 'EXPORT_CURRENT'
  | 'EXPORT_ALL'
  | 'GET_PLATFORM'
  | 'EXPORT_COMPLETE'
  | 'EXPORT_PROGRESS'
  | 'EXPORT_ERROR'
  | 'GET_STATS'
  | 'GET_CONVERSATIONS'
  | 'DELETE_CONVERSATION'
  | 'SEARCH_CONVERSATIONS'
  | 'OPEN_SIDEPANEL'
  | 'TAB_PLATFORM_DETECTED';

export interface VaultMessage {
  type: VaultMessageType;
  payload?: unknown;
}

export interface ExportRequest {
  format: ExportFormat;
  conversationId?: string;
  platform?: Platform;
}

export interface ExportResult {
  conversationId: string;
  platform: Platform;
  title: string;
  format: ExportFormat;
  data: string;
  filename: string;
}

// ─── Settings ───────────────────────────────────────────────────────────────

export interface VaultSettings {
  defaultFormat: ExportFormat;
  autoExport: boolean;
  vaultPath: string;
  includeImages: boolean;
  includeArtifacts: boolean;
  showOverlayButton: boolean;
  theme: 'dark' | 'light';
}

export const DEFAULT_SETTINGS: VaultSettings = {
  defaultFormat: 'markdown',
  autoExport: false,
  vaultPath: 'arcanea-vault/inbox',
  includeImages: true,
  includeArtifacts: true,
  showOverlayButton: true,
  theme: 'dark',
};

// ─── Tab Intelligence ───────────────────────────────────────────────────────

export interface TabSnapshot {
  tabId: number;
  url: string;
  title: string;
  platform?: Platform;
  timestamp: number;
}

export interface TabSessionSnapshot {
  tabs: TabSnapshot[];
  capturedAt: number;
}
