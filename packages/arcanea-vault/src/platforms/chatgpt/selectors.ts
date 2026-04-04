import type { PlatformSelectors } from '../../shared/types';

/**
 * ChatGPT DOM selectors — isolated for easy updates when OpenAI changes their UI.
 * Last verified: 2026-04-04 against chatgpt.com
 */
export const CHATGPT_SELECTORS: PlatformSelectors = {
  conversationContainer: 'main div.flex.flex-col',
  messageBlock: '[data-message-author-role]',
  userMessage: '[data-message-author-role="user"]',
  assistantMessage: '[data-message-author-role="assistant"]',
  codeBlock: 'pre code',
  imageBlock: 'img[src*="oaidalleapi"], img[src*="dall-e"], img.dalle-image',
  artifactPanel: '[data-testid="canvas-panel"], .canvas-container',
  conversationTitle: 'title',
  sidebarConversationList: 'nav a[href^="/c/"]',
  citationBlock: undefined,
};
