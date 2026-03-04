/**
 * Stream Capture — real-time image/video capture via MutationObserver.
 * Watches the DOM for new media elements as the user scrolls or generates content.
 */

import type { MediaItem } from '../shared/types';
import { extractPostId } from '../shared/uuid';
import { createLogger } from '../shared/logger';
import { classifyCard, getImageUrl, getVideoUrl, getPostLink } from './selectors';
import { SELECTORS } from '../shared/constants';

const log = createLogger('StreamCapture');

type CaptureCallback = (item: MediaItem) => void;

let observer: MutationObserver | null = null;
let capturedIds: Set<string> = new Set();
let onCapture: CaptureCallback = () => {};

/** Start watching the DOM for new media items */
export function startStreamCapture(callback: CaptureCallback): void {
  if (observer) {
    log.warn('Stream capture already running');
    return;
  }

  capturedIds = new Set();
  onCapture = callback;

  observer = new MutationObserver(handleMutations);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  log.info('Stream capture started');
}

/** Stop watching the DOM */
export function stopStreamCapture(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
    log.info(`Stream capture stopped. Captured ${capturedIds.size} items.`);
  }
}

/** Check if stream capture is running */
export function isCapturing(): boolean {
  return observer !== null;
}

function handleMutations(mutations: MutationRecord[]): void {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;

      // Check if the added node is or contains a media card
      const cards = node.matches(SELECTORS.CARD)
        ? [node]
        : Array.from(node.querySelectorAll(SELECTORS.CARD));

      for (const card of cards) {
        processCard(card);
      }

      // Also check for standalone images (outside card structure)
      const images = node.matches(SELECTORS.IMAGE)
        ? [node as HTMLImageElement]
        : Array.from(node.querySelectorAll<HTMLImageElement>(SELECTORS.IMAGE));

      for (const img of images) {
        processImage(img);
      }
    }
  }
}

function processCard(card: Element): void {
  const postLink = getPostLink(card);
  if (!postLink) return;

  const id = extractPostId(postLink);
  if (!id || capturedIds.has(id)) return;

  capturedIds.add(id);

  const type = classifyCard(card);
  const url = type === 'video' ? getVideoUrl(card) : getImageUrl(card);

  const item: MediaItem = {
    id,
    type,
    url: url ?? postLink,
    timestamp: Date.now(),
    upscaleStatus: 'none',
    metadata: { postUrl: postLink, capturedVia: 'stream' },
  };

  log.debug(`Captured ${type}: ${id}`);
  onCapture(item);
}

function processImage(img: HTMLImageElement): void {
  if (!img.src) return;

  const id = extractPostId(img.src);
  if (!id || capturedIds.has(id)) return;

  capturedIds.add(id);

  const item: MediaItem = {
    id,
    type: 'image',
    url: img.src,
    timestamp: Date.now(),
    upscaleStatus: 'none',
    metadata: { capturedVia: 'stream-image' },
  };

  log.debug(`Captured image: ${id}`);
  onCapture(item);
}
