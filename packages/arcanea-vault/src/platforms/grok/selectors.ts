import type { PlatformSelectors } from '../../shared/types';

/**
 * Grok.com DOM selectors.
 * Patterns absorbed from packages/grok-media/.
 * Last verified: 2026-04-04 against grok.com
 */
export const GROK_SELECTORS: PlatformSelectors = {
  conversationContainer: 'main .flex.flex-col, [data-testid="conversation-main"]',
  messageBlock: '[data-testid="message-row"], .message-row',
  userMessage: '[data-testid="user-message"], .user-message-row',
  assistantMessage: '[data-testid="assistant-message"], .assistant-message-row',
  codeBlock: 'pre code',
  imageBlock: 'img[src*="imagine"], img[src*="grok"], .imagine-gallery img',
  artifactPanel: undefined,
  conversationTitle: 'title',
  sidebarConversationList: 'nav a[href*="/chat/"]',
  citationBlock: undefined,
};
