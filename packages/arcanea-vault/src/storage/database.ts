import Dexie, { type Table } from 'dexie';
import type {
  ExportedConversation,
  ExportedMessage,
  ExportedArtifact,
  ExportedImage,
  ExportJob,
  Platform,
} from '../shared/types';

// ─── Stored Types (flat for IndexedDB) ──────────────────────────────────────

interface StoredConversation {
  id: string;
  platform: Platform;
  title: string;
  exportedAt: number;
  messageCount: number;
  wordCount: number;
  model?: string;
  project?: string;
  hasCode: boolean;
  hasImages: boolean;
  hasArtifacts: boolean;
  /** Full text for search indexing */
  searchText: string;
}

interface StoredMessage {
  id?: number;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
  model?: string;
}

interface StoredArtifact {
  id: string;
  conversationId: string;
  type: string;
  title: string;
  content: string;
  language?: string;
}

interface StoredImage {
  id: string;
  conversationId: string;
  url: string;
  prompt?: string;
  blob?: Blob;
}

// ─── Database ───────────────────────────────────────────────────────────────

class VaultDatabase extends Dexie {
  conversations!: Table<StoredConversation, string>;
  messages!: Table<StoredMessage, number>;
  artifacts!: Table<StoredArtifact, string>;
  images!: Table<StoredImage, string>;
  exportJobs!: Table<ExportJob, string>;

  constructor() {
    super('ArcanéaVault');

    this.version(1).stores({
      conversations: 'id, platform, title, exportedAt, model, *searchText',
      messages: '++id, conversationId, role',
      artifacts: 'id, conversationId, type',
      images: 'id, conversationId',
      exportJobs: 'id, platform, status, createdAt',
    });
  }
}

export const db = new VaultDatabase();

// ─── Operations ─────────────────────────────────────────────────────────────

/**
 * Save a full exported conversation to the database.
 */
export async function saveConversation(conv: ExportedConversation): Promise<void> {
  const searchText = [
    conv.title,
    ...conv.messages.map((m) => m.content),
    ...conv.artifacts.map((a) => a.content),
  ]
    .join(' ')
    .toLowerCase();

  await db.transaction('rw', [db.conversations, db.messages, db.artifacts, db.images], async () => {
    // Upsert conversation record
    await db.conversations.put({
      id: conv.id,
      platform: conv.platform,
      title: conv.title,
      exportedAt: conv.exportedAt,
      messageCount: conv.metadata.messageCount,
      wordCount: conv.metadata.wordCount,
      model: conv.metadata.model,
      project: conv.metadata.project,
      hasCode: conv.metadata.hasCode,
      hasImages: conv.metadata.hasImages,
      hasArtifacts: conv.metadata.hasArtifacts,
      searchText,
    });

    // Clear previous messages/artifacts/images for this conversation
    await db.messages.where('conversationId').equals(conv.id).delete();
    await db.artifacts.where('conversationId').equals(conv.id).delete();
    await db.images.where('conversationId').equals(conv.id).delete();

    // Store messages
    for (const msg of conv.messages) {
      await db.messages.add({
        conversationId: conv.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        model: msg.model,
      });
    }

    // Store artifacts
    for (const artifact of conv.artifacts) {
      await db.artifacts.put({
        ...artifact,
        conversationId: conv.id,
      });
    }

    // Store images
    for (const image of conv.images) {
      await db.images.put({
        id: image.id,
        conversationId: conv.id,
        url: image.url,
        prompt: image.prompt,
        blob: image.localBlob,
      });
    }
  });
}

/**
 * Retrieve a full conversation by ID, reassembling from flat tables.
 */
export async function getConversation(id: string): Promise<ExportedConversation | undefined> {
  const conv = await db.conversations.get(id);
  if (!conv) return undefined;

  const messages = await db.messages.where('conversationId').equals(id).toArray();
  const artifacts = await db.artifacts.where('conversationId').equals(id).toArray();
  const images = await db.images.where('conversationId').equals(id).toArray();

  return {
    id: conv.id,
    platform: conv.platform,
    title: conv.title,
    exportedAt: conv.exportedAt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
      model: m.model,
    })),
    artifacts: artifacts.map((a) => ({
      id: a.id,
      type: a.type as ExportedArtifact['type'],
      title: a.title,
      content: a.content,
      language: a.language,
    })),
    images: images.map((i) => ({
      id: i.id,
      url: i.url,
      prompt: i.prompt,
      localBlob: i.blob,
    })),
    metadata: {
      model: conv.model,
      project: conv.project,
      messageCount: conv.messageCount,
      wordCount: conv.wordCount,
      hasCode: conv.hasCode,
      hasImages: conv.hasImages,
      hasArtifacts: conv.hasArtifacts,
    },
  };
}

/**
 * List all conversations, optionally filtered by platform.
 */
export async function listConversations(
  platform?: Platform,
  limit = 100,
  offset = 0
): Promise<StoredConversation[]> {
  let query = platform
    ? db.conversations.where('platform').equals(platform)
    : db.conversations.orderBy('exportedAt');

  return query.reverse().offset(offset).limit(limit).toArray();
}

/**
 * Full-text search across conversations.
 */
export async function searchConversations(
  query: string,
  platform?: Platform,
  limit = 50
): Promise<StoredConversation[]> {
  const lower = query.toLowerCase();
  let collection = db.conversations.orderBy('exportedAt').reverse();

  return collection
    .filter((c) => {
      if (platform && c.platform !== platform) return false;
      return c.searchText.includes(lower) || c.title.toLowerCase().includes(lower);
    })
    .limit(limit)
    .toArray();
}

/**
 * Delete a conversation and all its related data.
 */
export async function deleteConversation(id: string): Promise<void> {
  await db.transaction('rw', [db.conversations, db.messages, db.artifacts, db.images], async () => {
    await db.conversations.delete(id);
    await db.messages.where('conversationId').equals(id).delete();
    await db.artifacts.where('conversationId').equals(id).delete();
    await db.images.where('conversationId').equals(id).delete();
  });
}

/**
 * Get aggregate stats.
 */
export async function getStats(): Promise<{
  totalConversations: number;
  byPlatform: Record<Platform, number>;
  totalWords: number;
}> {
  const all = await db.conversations.toArray();
  const byPlatform: Record<string, number> = {};
  let totalWords = 0;

  for (const c of all) {
    byPlatform[c.platform] = (byPlatform[c.platform] || 0) + 1;
    totalWords += c.wordCount;
  }

  return {
    totalConversations: all.length,
    byPlatform: byPlatform as Record<Platform, number>,
    totalWords,
  };
}

/**
 * Save an export job record.
 */
export async function saveExportJob(job: ExportJob): Promise<void> {
  await db.exportJobs.put(job);
}

/**
 * Get recent export jobs.
 */
export async function getRecentJobs(limit = 20): Promise<ExportJob[]> {
  return db.exportJobs.orderBy('createdAt').reverse().limit(limit).toArray();
}
