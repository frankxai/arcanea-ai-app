/**
 * Scroll-based favorites scanner.
 * Scrolls through the favorites page, collecting all media items
 * as they lazy-load into the DOM.
 */

import type { MediaItem, ScanResult } from '../shared/types';
import { RATE_LIMITS } from '../shared/constants';
import { extractPostId } from '../shared/uuid';
import { sleep } from '../shared/rate-limiter';
import { createLogger } from '../shared/logger';
import {
  findMediaCards,
  findScrollContainer,
  classifyCard,
  getImageUrl,
  getVideoUrl,
  getPostLink,
  hasHdBadge,
} from './selectors';

const log = createLogger('Scanner');

interface ScanOptions {
  scrollDelay?: number;
  maxIdleScrolls?: number;
  onProgress?: (found: number, position: number) => void;
  signal?: AbortSignal;
}

/**
 * Scan the current page for all media items by scrolling to trigger lazy loading.
 * Reports progress via callback and supports cancellation via AbortSignal.
 */
export async function scanFavorites(options: ScanOptions = {}): Promise<ScanResult> {
  const {
    scrollDelay = RATE_LIMITS.SCROLL_DELAY,
    maxIdleScrolls = RATE_LIMITS.MAX_IDLE_SCROLLS,
    onProgress,
    signal,
  } = options;

  const container = findScrollContainer();
  if (!container) {
    log.error('No scrollable container found');
    return { items: [], totalFound: 0, duplicatesSkipped: 0 };
  }

  const seenIds = new Set<string>();
  const items: MediaItem[] = [];
  let idleCount = 0;
  let lastHeight = 0;

  log.info('Starting favorites scan');

  while (idleCount < maxIdleScrolls) {
    if (signal?.aborted) {
      log.info('Scan cancelled by user');
      break;
    }

    // Collect items from current viewport
    const cards = findMediaCards();
    let newItemsThisScroll = 0;

    for (const card of cards) {
      const postLink = getPostLink(card);
      if (!postLink) continue;

      const id = extractPostId(postLink);
      if (!id || seenIds.has(id)) continue;

      seenIds.add(id);
      newItemsThisScroll++;

      const type = classifyCard(card);
      const url = type === 'video' ? getVideoUrl(card) : getImageUrl(card);

      items.push({
        id,
        type,
        url: url ?? postLink,
        timestamp: Date.now(),
        upscaleStatus: hasHdBadge(card) ? 'done' : 'none',
        metadata: { postUrl: postLink },
      });
    }

    onProgress?.(items.length, container.scrollTop);

    // Scroll down
    container.scrollBy({ top: 800, behavior: 'smooth' });
    await sleep(scrollDelay);

    // Check if we've reached the bottom
    const currentHeight = container.scrollHeight;
    if (currentHeight === lastHeight && newItemsThisScroll === 0) {
      idleCount++;
      log.debug(`Idle scroll ${idleCount}/${maxIdleScrolls}`);
    } else {
      idleCount = 0;
    }
    lastHeight = currentHeight;
  }

  log.info(`Scan complete: ${items.length} items found`);

  return {
    items,
    totalFound: items.length,
    duplicatesSkipped: 0,
  };
}

/**
 * Quick scan: collect all currently visible post links without scrolling.
 * Useful for getting a snapshot of what's loaded.
 */
export function quickScan(): string[] {
  const links = document.querySelectorAll<HTMLAnchorElement>('a[href*="/imagine/post/"]');
  const ids = new Set<string>();

  for (const link of links) {
    const id = extractPostId(link.href);
    if (id) ids.add(id);
  }

  return Array.from(ids);
}
