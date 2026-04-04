import type { Platform, TabSnapshot, TabSessionSnapshot } from '../shared/types';
import { detectPlatform } from '../shared/platform-registry';

/**
 * Track AI platform tabs and update the extension badge.
 */
export class TabMonitor {
  private activeTabs = new Map<number, TabSnapshot>();

  async initialize(): Promise<void> {
    // Scan existing tabs
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id && tab.url) {
        this.processTab(tab.id, tab.url, tab.title || '');
      }
    }

    // Listen for tab changes
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.url || changeInfo.status === 'complete') {
        this.processTab(tabId, tab.url || '', tab.title || '');
      }
    });

    chrome.tabs.onRemoved.addListener((tabId) => {
      this.activeTabs.delete(tabId);
    });

    chrome.tabs.onActivated.addListener(async (activeInfo) => {
      const tab = await chrome.tabs.get(activeInfo.tabId);
      if (tab.url) {
        this.updateBadge(tab.url);
      }
    });
  }

  private processTab(tabId: number, url: string, title: string): void {
    const platformConfig = detectPlatform(url);

    if (platformConfig) {
      this.activeTabs.set(tabId, {
        tabId,
        url,
        title,
        platform: platformConfig.platform,
        timestamp: Date.now(),
      });
    } else {
      this.activeTabs.delete(tabId);
    }

    this.updateBadge(url);
  }

  private updateBadge(currentUrl: string): void {
    const platformConfig = detectPlatform(currentUrl);

    if (platformConfig) {
      chrome.action.setBadgeText({ text: platformConfig.icon });
      chrome.action.setBadgeBackgroundColor({ color: platformConfig.color });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  }

  /**
   * Get the platform for a specific tab.
   */
  getPlatformForTab(tabId: number): Platform | undefined {
    return this.activeTabs.get(tabId)?.platform;
  }

  /**
   * Get all currently tracked AI platform tabs.
   */
  getAiTabs(): TabSnapshot[] {
    return Array.from(this.activeTabs.values());
  }

  /**
   * Create a snapshot of all current AI platform tabs.
   */
  createSessionSnapshot(): TabSessionSnapshot {
    return {
      tabs: this.getAiTabs(),
      capturedAt: Date.now(),
    };
  }

  /**
   * Get the platform detected on the currently active tab.
   */
  async getActivePlatform(): Promise<Platform | undefined> {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url) return undefined;
    return detectPlatform(tab.url)?.platform;
  }
}
