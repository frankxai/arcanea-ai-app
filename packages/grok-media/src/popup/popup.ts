import type { Message, Stats } from '../shared/types';

function $(id: string): HTMLElement {
  return document.getElementById(id)!;
}

// Load stats
chrome.runtime.sendMessage({ type: 'GET_STATS' } as Message, (response: Stats) => {
  if (!response) return;
  $('img-count').textContent = String(response.totalImages);
  $('vid-count').textContent = String(response.totalVideos);
  $('dl-count').textContent = String(response.totalDownloaded);
  $('hd-count').textContent = String(response.hdVideos);
});

// Open side panel
$('btn-open-panel').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id && chrome.sidePanel) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
  window.close();
});

// Quick scan
$('btn-scan').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'SCAN_FAVORITES', payload: {} } as Message);
  window.close();
});
