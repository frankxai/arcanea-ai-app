/**
 * Content script entry point.
 * Injected into grok.com pages. Handles scanning, stream capture,
 * and message routing with the background service worker.
 */

import type { Message, MediaItem } from '../shared/types';
import { createLogger } from '../shared/logger';
import { scanFavorites, quickScan } from './scanner';
import { startStreamCapture, stopStreamCapture } from './stream-capture';
import { unfavoriteViaApi, requestUpscale } from './dom-actions';

const log = createLogger('Content');

let scanController: AbortController | null = null;

// Listen for messages from background / side panel
chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse) => {
    handleMessage(message, sendResponse).catch((err) => {
      console.error('[Arcanea Media] Content handler error:', err);
      sendResponse({ error: String(err) });
    });
    return true; // Keep channel open for async responses
  },
);

async function handleMessage(
  message: Message,
  sendResponse: (response: unknown) => void,
): Promise<void> {
  switch (message.type) {
    case 'SCAN_FAVORITES': {
      // Cancel any existing scan
      scanController?.abort();
      scanController = new AbortController();

      const result = await scanFavorites({
        scrollDelay: message.payload.scrollDelay,
        signal: scanController.signal,
        onProgress: (found, position) => {
          chrome.runtime.sendMessage({
            type: 'SCAN_PROGRESS',
            payload: { found, scrollPosition: position },
          });
        },
      });

      sendResponse(result);
      chrome.runtime.sendMessage({ type: 'SCAN_RESULT', payload: result });
      break;
    }

    case 'STREAM_CAPTURE_START': {
      startStreamCapture((item: MediaItem) => {
        chrome.runtime.sendMessage({
          type: 'STREAM_CAPTURE_ITEM',
          payload: { item },
        });
      });
      sendResponse({ ok: true });
      break;
    }

    case 'STREAM_CAPTURE_STOP': {
      stopStreamCapture();
      sendResponse({ ok: true });
      break;
    }

    case 'UPSCALE_REQUEST': {
      const success = await requestUpscale(message.payload.videoId);
      sendResponse({ ok: success });
      chrome.runtime.sendMessage({
        type: 'UPSCALE_STATUS',
        payload: {
          videoId: message.payload.videoId,
          status: success ? 'processing' : 'failed',
        },
      });
      break;
    }

    case 'CANCEL_OPERATION': {
      scanController?.abort();
      stopStreamCapture();
      sendResponse({ ok: true });
      break;
    }

    case 'GET_STATS': {
      const ids = quickScan();
      sendResponse({ visibleItems: ids.length });
      break;
    }

    default:
      log.debug('Unhandled message type', message);
  }
}

// Notify background that content script is loaded
chrome.runtime.sendMessage({ type: 'CONTENT_READY' } satisfies Message).catch(() => {
  // Background may not be listening yet, that's fine
});

log.info('Content script loaded on', window.location.href);
