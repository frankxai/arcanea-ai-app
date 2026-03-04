/**
 * Background Service Worker — central message router, download orchestration,
 * and extension lifecycle management.
 */

import type { Message, MediaItem, ExtensionSettings } from '../shared/types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../shared/constants';
import { createLogger } from '../shared/logger';
import {
  enqueueDownloads,
  cancelDownloads,
  setProgressCallback,
  isAlreadyDownloaded,
  getQueueStatus,
} from './download-manager';
import { sniffPostMedia } from './network-sniffer';

const log = createLogger('ServiceWorker');

// ---------------------------------------------------------------------------
// Installation & Lifecycle
// ---------------------------------------------------------------------------

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    log.info('Extension installed');
    await chrome.storage.local.set({
      [STORAGE_KEYS.SETTINGS]: DEFAULT_SETTINGS,
      downloadHistory: [],
    });
  }

  // Enable side panel behavior
  if (chrome.sidePanel) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
  }
});

// Open side panel when extension icon is clicked (fallback)
chrome.action.onClicked.addListener((tab) => {
  if (chrome.sidePanel && tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// ---------------------------------------------------------------------------
// Message Routing
// ---------------------------------------------------------------------------

chrome.runtime.onMessage.addListener(
  (message: Message | { type: string; [key: string]: unknown }, sender, sendResponse) => {
    handleMessage(message as Message, sender, sendResponse).catch((err) => {
      log.error('Message handler error', err);
      sendResponse({ error: String(err) });
    });
    return true; // keep channel open for async
  },
);

async function handleMessage(
  message: Message,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: unknown) => void,
): Promise<void> {
  switch (message.type) {
    // -- Scanning (forwarded to content script) --
    case 'SCAN_FAVORITES': {
      const tab = await getGrokTab();
      if (!tab?.id) {
        sendResponse({ error: 'No Grok tab found. Please open grok.com first.' });
        return;
      }
      chrome.tabs.sendMessage(tab.id, message, sendResponse);
      break;
    }

    // -- Scan results from content script --
    case 'SCAN_RESULT': {
      const { items } = message.payload;
      log.info(`Scan complete: ${items.length} items`);
      // Filter out already-downloaded items
      const newItems: MediaItem[] = [];
      for (const item of items) {
        if (!(await isAlreadyDownloaded(item.id))) {
          newItems.push(item);
        }
      }
      // Broadcast filtered results to side panel
      broadcastToSidePanel({
        type: 'SCAN_RESULT',
        payload: {
          items: newItems,
          totalFound: items.length,
          duplicatesSkipped: items.length - newItems.length,
        },
      });
      break;
    }

    // -- Download --
    case 'DOWNLOAD_BATCH': {
      const { mediaIds, projectName } = message.payload;
      // Retrieve full items from storage or scan results
      const stored = await getStoredItems();
      const toDownload = stored.filter(i => mediaIds.includes(i.id));
      enqueueDownloads(toDownload, projectName);
      sendResponse({ queued: toDownload.length });
      break;
    }

    case 'DOWNLOAD_SINGLE': {
      enqueueDownloads([message.payload.item]);
      sendResponse({ queued: 1 });
      break;
    }

    // -- Upscale (forwarded to content script) --
    case 'UPSCALE_REQUEST': {
      const tab = await getGrokTab();
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, message, sendResponse);
      }
      break;
    }

    // -- Stream Capture (forwarded to content script) --
    case 'STREAM_CAPTURE_START':
    case 'STREAM_CAPTURE_STOP': {
      const tab = await getGrokTab();
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, message, sendResponse);
      }
      break;
    }

    // -- Stream capture item from content script --
    case 'STREAM_CAPTURE_ITEM': {
      const { item } = message.payload;
      await storeItem(item);
      broadcastToSidePanel(message);
      break;
    }

    // -- Network sniffing --
    case 'NETWORK_SNIFF': {
      const result = await sniffPostMedia(message.payload.postUrl);
      sendResponse(result);
      break;
    }

    // -- Cancel --
    case 'CANCEL_OPERATION': {
      cancelDownloads();
      const tab = await getGrokTab();
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, message);
      }
      sendResponse({ ok: true });
      break;
    }

    // -- Settings --
    case 'GET_SETTINGS': {
      const settings = await getSettings();
      sendResponse(settings);
      break;
    }

    case 'UPDATE_SETTINGS': {
      const current = await getSettings();
      const updated = { ...current, ...message.payload };
      await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: updated });
      sendResponse(updated);
      break;
    }

    // -- Stats --
    case 'GET_STATS': {
      const items = await getStoredItems();
      const { downloadHistory = [] } = await chrome.storage.local.get('downloadHistory');
      sendResponse({
        totalImages: items.filter(i => i.type === 'image').length,
        totalVideos: items.filter(i => i.type === 'video').length,
        totalDownloaded: downloadHistory.length,
        sdVideos: items.filter(i => i.type === 'video' && i.upscaleStatus !== 'done').length,
        hdVideos: items.filter(i => i.type === 'video' && i.upscaleStatus === 'done').length,
        pendingUpscales: items.filter(i => i.upscaleStatus === 'pending').length,
      });
      break;
    }

    // -- Side panel open --
    case 'OPEN_SIDE_PANEL': {
      const tab = await getGrokTab();
      if (tab?.id && chrome.sidePanel) {
        chrome.sidePanel.open({ tabId: tab.id });
      }
      sendResponse({ ok: true });
      break;
    }

    default:
      log.debug('Unhandled message', message);
  }
}

// ---------------------------------------------------------------------------
// Download progress forwarding
// ---------------------------------------------------------------------------

setProgressCallback((progress) => {
  broadcastToSidePanel({ type: 'DOWNLOAD_PROGRESS', payload: progress });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getGrokTab(): Promise<chrome.tabs.Tab | undefined> {
  const tabs = await chrome.tabs.query({ url: 'https://grok.com/*' });
  return tabs[0];
}

async function getSettings(): Promise<ExtensionSettings> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
  return result[STORAGE_KEYS.SETTINGS] ?? DEFAULT_SETTINGS;
}

async function getStoredItems(): Promise<MediaItem[]> {
  const { scannedItems = [] } = await chrome.storage.local.get('scannedItems');
  return scannedItems;
}

async function storeItem(item: MediaItem): Promise<void> {
  const { scannedItems = [] } = await chrome.storage.local.get('scannedItems');
  if (!scannedItems.some((i: MediaItem) => i.id === item.id)) {
    scannedItems.push(item);
    await chrome.storage.local.set({ scannedItems });
  }
}

function broadcastToSidePanel(message: Message | Record<string, unknown>): void {
  chrome.runtime.sendMessage(message).catch(() => {
    // Side panel may not be open, that's fine
  });
}
