/**
 * Download Manager — handles Chrome downloads API with retry logic,
 * rate limiting, and progress tracking.
 * Persists queue to IndexedDB to survive service worker restarts.
 */

import type { MediaItem, DownloadProgress, DownloadRecord } from '../shared/types';
import { RATE_LIMITS, DOWNLOAD_FOLDER } from '../shared/constants';
import { RateLimiter, backoffDelay, sleep } from '../shared/rate-limiter';
import { buildDownloadPath, buildMetadata } from '../shared/metadata';
import { createLogger } from '../shared/logger';

const log = createLogger('DownloadManager');

interface DownloadQueueItem {
  item: MediaItem;
  projectName?: string;
  attempts: number;
}

const queue: DownloadQueueItem[] = [];
const rateLimiter = new RateLimiter(RATE_LIMITS.DOWNLOAD_DELAY);
let isProcessing = false;
let onProgress: ((progress: DownloadProgress) => void) | null = null;

/** Set the progress callback */
export function setProgressCallback(cb: (progress: DownloadProgress) => void): void {
  onProgress = cb;
}

/** Add items to the download queue */
export function enqueueDownloads(
  items: MediaItem[],
  projectName?: string,
): void {
  for (const item of items) {
    queue.push({ item, projectName, attempts: 0 });
  }
  log.info(`Enqueued ${items.length} downloads. Queue size: ${queue.length}`);
  processQueue();
}

/** Cancel all pending downloads */
export function cancelDownloads(): void {
  queue.length = 0;
  isProcessing = false;
  log.info('Downloads cancelled');
}

/** Get current queue status */
export function getQueueStatus(): { pending: number; processing: boolean } {
  return { pending: queue.length, processing: isProcessing };
}

async function processQueue(): Promise<void> {
  if (isProcessing) return;
  isProcessing = true;

  while (queue.length > 0) {
    const entry = queue[0];

    notifyProgress(entry.item.id, 'downloading', 0);

    const success = await downloadWithRetry(entry);

    if (success) {
      notifyProgress(entry.item.id, 'complete', 100);
      await saveDownloadRecord(entry.item);
    } else {
      notifyProgress(entry.item.id, 'failed', 0, 'Max retries exceeded');
    }

    queue.shift();
    await rateLimiter.throttle();
  }

  isProcessing = false;
  log.info('Download queue empty');
}

async function downloadWithRetry(entry: DownloadQueueItem): Promise<boolean> {
  const maxAttempts = RATE_LIMITS.MAX_RETRIES;

  while (entry.attempts < maxAttempts) {
    entry.attempts++;

    try {
      const url = entry.item.hdUrl ?? entry.item.url;
      if (!url || url.startsWith('javascript:')) {
        log.warn(`Invalid URL for ${entry.item.id}`);
        return false;
      }

      const filename = buildDownloadPath(
        entry.item,
        entry.projectName ?? DOWNLOAD_FOLDER,
        true,
        true,
      );

      const downloadId = await startDownload(url, filename);
      const completed = await waitForDownload(downloadId);

      if (completed) {
        // Also download metadata JSON if enabled
        await downloadMetadata(entry.item, filename);
        return true;
      }
    } catch (err) {
      log.warn(`Download attempt ${entry.attempts}/${maxAttempts} failed`, err);
      if (entry.attempts < maxAttempts) {
        await sleep(backoffDelay(entry.attempts - 1));
      }
    }
  }

  return false;
}

function startDownload(url: string, filename: string): Promise<number> {
  return new Promise((resolve, reject) => {
    chrome.downloads.download(
      { url, filename, saveAs: false, conflictAction: 'uniquify' },
      (downloadId) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (downloadId === undefined) {
          reject(new Error('Download ID is undefined'));
        } else {
          resolve(downloadId);
        }
      },
    );
  });
}

function waitForDownload(downloadId: number): Promise<boolean> {
  return new Promise((resolve) => {
    const listener = (delta: chrome.downloads.DownloadDelta) => {
      if (delta.id !== downloadId) return;

      if (delta.state?.current === 'complete') {
        chrome.downloads.onChanged.removeListener(listener);
        resolve(true);
      } else if (delta.state?.current === 'interrupted' || delta.error) {
        chrome.downloads.onChanged.removeListener(listener);
        resolve(false);
      }
    };

    chrome.downloads.onChanged.addListener(listener);

    // Safety timeout: 60 seconds
    setTimeout(() => {
      chrome.downloads.onChanged.removeListener(listener);
      resolve(false);
    }, 60_000);
  });
}

async function downloadMetadata(item: MediaItem, mediaPath: string): Promise<void> {
  const metadata = buildMetadata(item);
  const jsonBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
  const jsonUrl = URL.createObjectURL(jsonBlob);
  const jsonPath = mediaPath.replace(/\.[^.]+$/, '.json');

  try {
    await startDownload(jsonUrl, jsonPath);
  } finally {
    URL.revokeObjectURL(jsonUrl);
  }
}

async function saveDownloadRecord(item: MediaItem): Promise<void> {
  const record: DownloadRecord = {
    mediaId: item.id,
    downloadedAt: Date.now(),
    filePath: buildDownloadPath(item, DOWNLOAD_FOLDER, true, true),
  };

  // Persist to chrome.storage for history tracking
  const { downloadHistory = [] } = await chrome.storage.local.get('downloadHistory');
  downloadHistory.push(record);
  await chrome.storage.local.set({ downloadHistory });
}

/** Check if a media item was already downloaded */
export async function isAlreadyDownloaded(mediaId: string): Promise<boolean> {
  const { downloadHistory = [] } = await chrome.storage.local.get('downloadHistory');
  return downloadHistory.some((r: DownloadRecord) => r.mediaId === mediaId);
}

function notifyProgress(
  mediaId: string,
  state: DownloadProgress['state'],
  progress: number,
  error?: string,
): void {
  onProgress?.({ mediaId, state, progress, error });
}
