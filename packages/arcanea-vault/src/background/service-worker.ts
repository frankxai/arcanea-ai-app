import type { VaultMessage, ExportFormat, Platform } from '../shared/types';
import { TabMonitor } from './tab-monitor';
import { getStats, listConversations, deleteConversation, searchConversations, saveConversation } from '../storage/database';
import { downloadConversation } from '../storage/vault-sync';

// ─── Initialize ─────────────────────────────────────────────────────────────

const tabMonitor = new TabMonitor();
tabMonitor.initialize();

console.log('[arcanea-vault] Service worker initialized');

// ─── Message Router ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener(
  (message: VaultMessage, _sender, sendResponse) => {
    handleMessage(message)
      .then(sendResponse)
      .catch((err) => sendResponse({ error: err.message }));

    // Return true to indicate async response
    return true;
  }
);

async function handleMessage(message: VaultMessage): Promise<unknown> {
  switch (message.type) {
    case 'EXPORT_CURRENT': {
      const payload = message.payload as { format?: ExportFormat } | undefined;
      return handleExportCurrent(payload?.format || 'markdown');
    }

    case 'EXPORT_ALL': {
      const payload = message.payload as { format?: ExportFormat; platform?: Platform } | undefined;
      return handleExportAll(payload?.format || 'markdown', payload?.platform);
    }

    case 'GET_PLATFORM': {
      return { platform: await tabMonitor.getActivePlatform() };
    }

    case 'GET_STATS': {
      return getStats();
    }

    case 'GET_CONVERSATIONS': {
      const payload = message.payload as { platform?: Platform; limit?: number; offset?: number } | undefined;
      return listConversations(payload?.platform, payload?.limit, payload?.offset);
    }

    case 'SEARCH_CONVERSATIONS': {
      const payload = message.payload as { query: string; platform?: Platform };
      return searchConversations(payload.query, payload.platform);
    }

    case 'DELETE_CONVERSATION': {
      const payload = message.payload as { id: string };
      await deleteConversation(payload.id);
      return { success: true };
    }

    case 'OPEN_SIDEPANEL': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        await chrome.sidePanel.open({ tabId: tab.id });
      }
      return { success: true };
    }

    case 'TAB_PLATFORM_DETECTED': {
      const payload = message.payload as { platform: Platform };
      return { platform: payload.platform };
    }

    default:
      return { error: `Unknown message type: ${message.type}` };
  }
}

// ─── Export Handlers ────────────────────────────────────────────────────────

async function handleExportCurrent(format: ExportFormat): Promise<unknown> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    return { error: 'No active tab found' };
  }

  try {
    // Inject the extraction script and run it in the content page
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractConversationFromPage,
    });

    const conversation = results?.[0]?.result;
    if (!conversation) {
      return { error: 'No conversation found on this page' };
    }

    // Save to local database
    await saveConversation(conversation);

    // Download file
    await downloadConversation(conversation, format);

    return {
      success: true,
      conversationId: conversation.id,
      title: conversation.title,
      messageCount: conversation.metadata.messageCount,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Export failed';
    return { error: errorMsg };
  }
}

async function handleExportAll(format: ExportFormat, _platform?: Platform): Promise<unknown> {
  // Bulk export is initiated from the content script side
  // This handler orchestrates the process
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    return { error: 'No active tab found' };
  }

  return {
    success: true,
    message: 'Bulk export initiated. Conversations will be exported as they are processed.',
    format,
  };
}

/**
 * This function runs in the context of the web page.
 * It detects the platform and extracts the conversation.
 * Serialized and sent back to the service worker.
 */
function extractConversationFromPage(): unknown {
  const url = window.location.href;

  // Detect platform
  const hostname = new URL(url).hostname;
  let platform: string;
  if (hostname.includes('chatgpt.com') || hostname.includes('chat.openai.com')) {
    platform = 'chatgpt';
  } else if (hostname.includes('claude.ai')) {
    platform = 'claude';
  } else if (hostname.includes('perplexity.ai')) {
    platform = 'perplexity';
  } else if (hostname.includes('grok.com')) {
    platform = 'grok';
  } else if (hostname.includes('gemini.google.com')) {
    platform = 'gemini';
  } else {
    return null;
  }

  // Generic message extraction (best-effort from any platform)
  function extractMessages(): Array<{ role: string; content: string }> {
    const messages: Array<{ role: string; content: string }> = [];

    // Platform-specific selectors
    const selectorMap: Record<string, { user: string; assistant: string }> = {
      chatgpt: {
        user: '[data-message-author-role="user"]',
        assistant: '[data-message-author-role="assistant"]',
      },
      claude: {
        user: '[data-testid="user-message"], .font-user-message',
        assistant: '[data-testid="assistant-message"], .font-claude-message',
      },
      perplexity: {
        user: '[data-testid="query-block"], .query-text',
        assistant: '[data-testid="answer-block"], .prose',
      },
      grok: {
        user: '[data-testid="user-message"], .user-message-row',
        assistant: '[data-testid="assistant-message"], .assistant-message-row',
      },
      gemini: {
        user: '.query-content, user-query',
        assistant: '.response-content, model-response',
      },
    };

    const selectors = selectorMap[platform];
    if (!selectors) return messages;

    const userEls = document.querySelectorAll(selectors.user);
    const assistantEls = document.querySelectorAll(selectors.assistant);

    const maxLen = Math.max(userEls.length, assistantEls.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < userEls.length) {
        const text = userEls[i].textContent?.trim();
        if (text) messages.push({ role: 'user', content: text });
      }
      if (i < assistantEls.length) {
        const text = assistantEls[i].textContent?.trim();
        if (text) messages.push({ role: 'assistant', content: text });
      }
    }

    return messages;
  }

  function extractTitle(): string {
    const title = document.title || '';
    return title
      .replace(/\s*[-|]\s*(ChatGPT|Claude|Perplexity|Grok|Gemini|Google).*$/i, '')
      .trim() || `Untitled ${platform} conversation`;
  }

  function extractId(): string {
    const path = window.location.pathname;
    const match = path.match(/\/(c|chat|search|thread|app)\/([a-zA-Z0-9_-]+)/);
    return match?.[2] || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }

  const messages = extractMessages();
  const fullText = messages.map((m) => m.content).join(' ');
  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;

  return {
    id: extractId(),
    platform,
    title: extractTitle(),
    messages,
    artifacts: [],
    images: [],
    exportedAt: Date.now(),
    metadata: {
      messageCount: messages.length,
      wordCount,
      hasCode: messages.some((m) => m.content.includes('```')),
      hasImages: false,
      hasArtifacts: false,
    },
  };
}

// ─── Side Panel ─────────────────────────────────────────────────────────────

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    await chrome.sidePanel.open({ tabId: tab.id });
  }
});

// ─── Context Menu ───────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'arcanea-vault-export',
    title: 'Export conversation to Arcanea Vault',
    contexts: ['page'],
    documentUrlPatterns: [
      'https://chat.openai.com/*',
      'https://chatgpt.com/*',
      'https://claude.ai/*',
      'https://www.perplexity.ai/*',
      'https://perplexity.ai/*',
      'https://grok.com/*',
      'https://gemini.google.com/*',
    ],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'arcanea-vault-export' && tab?.id) {
    await handleExportCurrent('markdown');
  }
});
