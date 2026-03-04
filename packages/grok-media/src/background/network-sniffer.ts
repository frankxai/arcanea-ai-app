/**
 * Network Sniffer — "God Mode" media URL discovery.
 * Opens a background tab at a post URL, injects a MAIN world script
 * that monkey-patches fetch/XHR to capture media asset URLs.
 *
 * Pattern from: brndnsmth/grok-imagine-favorites-manager
 */

import { RATE_LIMITS, CDN_DOMAINS, MEDIA_EXTENSIONS } from '../shared/constants';
import { createLogger } from '../shared/logger';

const log = createLogger('NetworkSniffer');

/** Captured media URL result */
export interface SniffResult {
  urls: string[];
  postId: string;
}

/**
 * Open a post URL in a background tab, sniff network requests
 * for media asset URLs, then close the tab.
 */
const ALLOWED_POST_URL = /^https:\/\/grok\.com\/imagine\/post\/[0-9a-f-]+$/i;

export async function sniffPostMedia(postUrl: string): Promise<SniffResult> {
  const postId = postUrl.split('/').pop() ?? '';

  if (!ALLOWED_POST_URL.test(postUrl)) {
    log.warn(`Blocked sniff for non-Grok URL: ${postUrl}`);
    return { urls: [], postId };
  }

  log.debug(`Sniffing: ${postUrl}`);

  return new Promise((resolve) => {
    const capturedUrls = new Set<string>();
    let tabId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout>;
    let idleTimeoutId: ReturnType<typeof setTimeout>;

    let messageListener: ((message: { type: string; urls?: string[] }, sender: chrome.runtime.MessageSender) => void) | null = null;

    // Cleanup function
    const finish = () => {
      clearTimeout(timeoutId);
      clearTimeout(idleTimeoutId);
      if (messageListener) {
        chrome.runtime.onMessage.removeListener(messageListener);
        messageListener = null;
      }
      if (tabId !== undefined) {
        chrome.tabs.remove(tabId).catch(() => {});
      }
      resolve({ urls: Array.from(capturedUrls), postId });
    };

    // Absolute timeout
    timeoutId = setTimeout(finish, RATE_LIMITS.MAX_SNIFF_WAIT);

    // Create background tab
    chrome.tabs.create({ url: postUrl, active: false }, async (tab) => {
      if (!tab?.id) {
        resolve({ urls: [], postId });
        return;
      }
      tabId = tab.id;

      // Wait for page to load enough
      const waitForLoad = () => new Promise<void>((res) => {
        const listener = (
          updatedTabId: number,
          info: chrome.tabs.TabChangeInfo,
        ) => {
          if (updatedTabId === tabId && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            res();
          }
        };
        chrome.tabs.onUpdated.addListener(listener);
        // Fallback timeout
        setTimeout(res, 5000);
      });

      await waitForLoad();

      // Inject sniffer script into MAIN world
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          world: 'MAIN',
          func: injectSniffer,
        });
      } catch (err) {
        log.error('Failed to inject sniffer', err);
        finish();
        return;
      }

      // Inject relay reader in ISOLATED world
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: readRelayData,
          args: [Array.from(CDN_DOMAINS), [...MEDIA_EXTENSIONS] as string[]],
        });
      } catch {
        // May fail if page navigated, that's ok
      }

      // Listen for messages from the injected script
      messageListener = (
        message: { type: string; urls?: string[] },
        sender: chrome.runtime.MessageSender,
      ) => {
        if (sender.tab?.id !== tabId) return;
        if (message.type === 'SNIFFER_URLS' && message.urls) {
          for (const url of message.urls) {
            capturedUrls.add(url);
          }
          // Reset idle timeout on new data
          clearTimeout(idleTimeoutId);
          idleTimeoutId = setTimeout(finish, RATE_LIMITS.SNIFF_IDLE_TIMEOUT);
        }
      };

      chrome.runtime.onMessage.addListener(messageListener);

      // Start idle countdown
      idleTimeoutId = setTimeout(finish, RATE_LIMITS.SNIFF_IDLE_TIMEOUT + 2000);
    });
  });
}

/**
 * Injected into MAIN world — monkey-patches fetch and XHR to capture media URLs.
 * Communicates via a hidden DOM element (avoids cross-world messaging limits).
 */
function injectSniffer(): void {
  const relay = document.createElement('div');
  relay.id = 'grok-sniffer-relay';
  relay.style.display = 'none';
  document.body.appendChild(relay);

  const captured: string[] = [];

  function isMediaUrl(url: string): boolean {
    const mediaExts = ['.mp4', '.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const mediaDomains = ['assets.grok.com', 'imagine-public.x.ai', 'assets.grokusercontent.com'];
    try {
      const parsed = new URL(url);
      return (
        mediaDomains.some(d => parsed.hostname.includes(d)) ||
        mediaExts.some(ext => parsed.pathname.toLowerCase().includes(ext))
      );
    } catch {
      return false;
    }
  }

  function recordUrl(url: string): void {
    if (isMediaUrl(url) && !captured.includes(url)) {
      captured.push(url);
      relay.setAttribute('data-urls', JSON.stringify(captured));
      relay.dispatchEvent(new CustomEvent('sniffer-update'));
    }
  }

  // Patch fetch
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url;
    if (url) recordUrl(url);

    return originalFetch.apply(this, args).then(response => {
      if (url) recordUrl(response.url);
      return response;
    });
  };

  // Patch XHR
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method: string, url: string | URL, ...rest: unknown[]) {
    recordUrl(String(url));
    return originalOpen.apply(this, [method, url, ...rest] as Parameters<typeof originalOpen>);
  };
}

/**
 * Injected into ISOLATED world — reads the relay element and sends URLs to background.
 */
function readRelayData(_cdnDomains: string[], _mediaExts: string[]): void {
  const relay = document.getElementById('grok-sniffer-relay');
  if (!relay) return;

  const sendUrls = () => {
    const raw = relay.getAttribute('data-urls');
    if (raw) {
      try {
        const urls = JSON.parse(raw) as string[];
        chrome.runtime.sendMessage({ type: 'SNIFFER_URLS', urls });
      } catch { /* invalid JSON, skip */ }
    }
  };

  relay.addEventListener('sniffer-update', sendUrls);

  // Also poll a few times in case the event is missed
  setTimeout(sendUrls, 500);
  setTimeout(sendUrls, 1500);
  setTimeout(sendUrls, 3000);
}
