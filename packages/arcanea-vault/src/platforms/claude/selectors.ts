import type { PlatformSelectors } from '../../shared/types';

/**
 * Claude.ai DOM selectors — isolated for easy updates when Anthropic changes their UI.
 * Last verified: 2026-04-04 against claude.ai
 */
export const CLAUDE_SELECTORS: PlatformSelectors = {
  conversationContainer: '.flex.flex-col.pb-6, [data-testid="conversation"]',
  messageBlock: '[data-testid="user-message"], [data-testid="assistant-message"], .font-claude-message, .font-user-message',
  userMessage: '[data-testid="user-message"], .font-user-message',
  assistantMessage: '[data-testid="assistant-message"], .font-claude-message',
  codeBlock: 'pre code, .code-block code',
  imageBlock: '.message-content img',
  artifactPanel: '[data-testid="artifact-panel"], .artifact-content, .artifact-renderer',
  conversationTitle: 'title',
  sidebarConversationList: 'nav a[href*="/chat/"]',
  citationBlock: undefined,
};
