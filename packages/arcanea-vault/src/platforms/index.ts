import type { PlatformExtractor } from '../shared/types';
import { ChatGPTExtractor } from './chatgpt/extractor';
import { ClaudeExtractor } from './claude/extractor';
import { PerplexityExtractor } from './perplexity/extractor';
import { GrokExtractor } from './grok/extractor';
import { GeminiExtractor } from './gemini/extractor';

/**
 * All registered platform extractors.
 * Order doesn't matter — matchUrl handles routing.
 */
const extractors: PlatformExtractor[] = [
  new ChatGPTExtractor(),
  new ClaudeExtractor(),
  new PerplexityExtractor(),
  new GrokExtractor(),
  new GeminiExtractor(),
];

/**
 * Get the extractor matching the current page URL.
 */
export function getExtractorForUrl(url: string): PlatformExtractor | undefined {
  return extractors.find((e) => e.matchUrl(url));
}

export {
  ChatGPTExtractor,
  ClaudeExtractor,
  PerplexityExtractor,
  GrokExtractor,
  GeminiExtractor,
};
