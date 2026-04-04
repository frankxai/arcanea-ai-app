import type { PlatformSelectors } from '../../shared/types';

/**
 * Gemini (gemini.google.com) DOM selectors.
 * Last verified: 2026-04-04 against gemini.google.com
 */
export const GEMINI_SELECTORS: PlatformSelectors = {
  conversationContainer: '.conversation-container, main',
  messageBlock: 'message-content, .query-content, .response-content, .model-response-text',
  userMessage: '.query-content, user-query, .user-message',
  assistantMessage: '.response-content, model-response, .model-response-text',
  codeBlock: 'pre code, code-block code',
  imageBlock: '.response-content img, .generated-image img',
  artifactPanel: undefined,
  conversationTitle: 'title',
  sidebarConversationList: '.conversation-list a, nav a[href*="/app/"]',
  citationBlock: '.source-card a, .citation a',
};
