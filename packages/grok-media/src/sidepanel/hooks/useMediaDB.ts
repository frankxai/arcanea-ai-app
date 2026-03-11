/**
 * IndexedDB wrapper using Dexie.js for persistent media storage.
 * Handles media items, download history, projects, and queue state.
 * Survives service worker restarts.
 */

import Dexie, { type Table } from 'dexie';
import type { MediaItem, DownloadRecord, Project, QueueItem } from '../../shared/types';

class ArcanMediaDB extends Dexie {
  media!: Table<MediaItem, string>;
  downloads!: Table<DownloadRecord, string>;
  projects!: Table<Project, string>;
  queue!: Table<QueueItem, string>;

  constructor() {
    super('ArcanMediaDB');

    this.version(1).stores({
      media: 'id, type, timestamp, upscaleStatus, projectId, guardian, element',
      downloads: 'mediaId, downloadedAt',
      projects: 'id, name, createdAt',
      queue: 'id, type, status, createdAt',
    });
  }
}

const db = new ArcanMediaDB();

// ---------------------------------------------------------------------------
// Media Items
// ---------------------------------------------------------------------------

export async function upsertMedia(item: MediaItem): Promise<void> {
  await db.media.put(item);
}

export async function upsertMediaBatch(items: MediaItem[]): Promise<void> {
  await db.media.bulkPut(items);
}

export async function getMedia(id: string): Promise<MediaItem | undefined> {
  return db.media.get(id);
}

export async function getAllMedia(): Promise<MediaItem[]> {
  return db.media.orderBy('timestamp').reverse().toArray();
}

export async function getMediaByType(type: 'image' | 'video'): Promise<MediaItem[]> {
  return db.media.where('type').equals(type).reverse().sortBy('timestamp');
}

export async function getMediaByUpscaleStatus(status: string): Promise<MediaItem[]> {
  return db.media.where('upscaleStatus').equals(status).toArray();
}

export async function deleteMedia(id: string): Promise<void> {
  await db.media.delete(id);
}

export async function getMediaCount(): Promise<number> {
  return db.media.count();
}

// ---------------------------------------------------------------------------
// Download History
// ---------------------------------------------------------------------------

export async function recordDownload(record: DownloadRecord): Promise<void> {
  await db.downloads.put(record);
}

export async function isDownloaded(mediaId: string): Promise<boolean> {
  const count = await db.downloads.where('mediaId').equals(mediaId).count();
  return count > 0;
}

export async function getDownloadHistory(): Promise<DownloadRecord[]> {
  return db.downloads.orderBy('downloadedAt').reverse().toArray();
}

export async function getDownloadCount(): Promise<number> {
  return db.downloads.count();
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function createProject(project: Project): Promise<void> {
  await db.projects.put(project);
}

export async function getProject(id: string): Promise<Project | undefined> {
  return db.projects.get(id);
}

export async function getAllProjects(): Promise<Project[]> {
  return db.projects.orderBy('createdAt').reverse().toArray();
}

// ---------------------------------------------------------------------------
// Queue
// ---------------------------------------------------------------------------

export async function enqueueItem(item: QueueItem): Promise<void> {
  await db.queue.put(item);
}

export async function dequeueItem(id: string): Promise<void> {
  await db.queue.delete(id);
}

export async function getPendingQueue(): Promise<QueueItem[]> {
  return db.queue.where('status').anyOf('pending', 'retrying').toArray();
}

export async function updateQueueStatus(id: string, status: string): Promise<void> {
  await db.queue.update(id, { status });
}

// ---------------------------------------------------------------------------
// Export / Import (Phase 4)
// ---------------------------------------------------------------------------

export async function exportDatabase(): Promise<string> {
  const [media, downloads, projects, queue] = await Promise.all([
    db.media.toArray(),
    db.downloads.toArray(),
    db.projects.toArray(),
    db.queue.toArray(),
  ]);
  return JSON.stringify({ media, downloads, projects, queue, exportedAt: new Date().toISOString() }, null, 2);
}

export async function importDatabase(json: string): Promise<{ imported: number }> {
  const data = JSON.parse(json);
  let imported = 0;

  if (data.media) {
    await db.media.bulkPut(data.media);
    imported += data.media.length;
  }
  if (data.downloads) {
    await db.downloads.bulkPut(data.downloads);
    imported += data.downloads.length;
  }
  if (data.projects) {
    await db.projects.bulkPut(data.projects);
    imported += data.projects.length;
  }

  return { imported };
}

export { db };
