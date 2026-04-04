import type { PlatformSelectors } from '../../shared/types';

/**
 * Perplexity.ai DOM selectors.
 * Last verified: 2026-04-04 against perplexity.ai
 */
export const PERPLEXITY_SELECTORS: PlatformSelectors = {
  conversationContainer: '.pb-lg, [data-testid="thread-container"], main',
  messageBlock: '[data-testid="query-block"], [data-testid="answer-block"], .relative.default',
  userMessage: '[data-testid="query-block"], .query-text',
  assistantMessage: '[data-testid="answer-block"], .prose.dark\\:prose-invert',
  codeBlock: 'pre code',
  imageBlock: '.answer-content img',
  artifactPanel: undefined,
  conversationTitle: 'title',
  sidebarConversationList: 'nav a[href*="/search/"]',
  citationBlock: '.citation-wrapper a, [data-testid="source-link"], a[data-testid="citation"]',
};
