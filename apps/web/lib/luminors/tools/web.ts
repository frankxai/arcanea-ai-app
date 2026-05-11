/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * web_search + deep_research — real search and multi-step investigation.
 *
 * Delegates to `lib/search/providers` (Tavily/Brave with BYOK fallback) and
 * `lib/ai/research` (the multi-query synthesis pipeline). Both tools degrade
 * gracefully on error — the Luminor gets a structured failure it can react to.
 */

import { tool } from 'ai';
import { z } from 'zod';
import { executeSearch } from '@/lib/search/providers';

export const webSearchInputSchema = z.object({
  query: z.string().describe('The search query - be specific and concise'),
  maxResults: z
    .number()
    .min(1)
    .max(10)
    .optional()
    .default(5)
    .describe('Number of results to return'),
});

export type WebSearchInput = z.infer<typeof webSearchInputSchema>;

export function buildWebSearchTool(searchApiKey?: string) {
  return tool({
    description:
      'Search the web for current information, recent events, facts, or up-to-date data. Use when the user asks about something that requires current knowledge beyond your training data.',
    inputSchema: webSearchInputSchema,
    execute: async ({ query, maxResults }: WebSearchInput) => {
      try {
        const result = await executeSearch(query, { apiKey: searchApiKey, maxResults });
        return {
          type: 'search' as const,
          query: result.query,
          answer: result.answer,
          provider: result.provider,
          results: result.results,
        };
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Search failed';
        return { type: 'search' as const, error: msg, query, results: [] };
      }
    },
  });
}

export const deepResearchInputSchema = z.object({
  question: z.string().describe('The research question to investigate thoroughly'),
  maxSearches: z
    .number()
    .min(3)
    .max(10)
    .optional()
    .default(5)
    .describe('Number of parallel search queries to run (3-10)'),
});

export type DeepResearchInput = z.infer<typeof deepResearchInputSchema>;

export function buildDeepResearchTool() {
  return tool({
    description:
      'Conduct deep, multi-step research on a topic. Searches multiple sources in parallel and synthesizes findings into a comprehensive report with citations. Use when the user explicitly asks for thorough research, investigation, or comprehensive analysis on a topic.',
    inputSchema: deepResearchInputSchema,
    execute: async ({ question, maxSearches }: DeepResearchInput) => {
      try {
        const { conductResearch } = await import('@/lib/ai/research');
        const result = await conductResearch(question, maxSearches);
        return { type: 'research_report' as const, ...result };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Research failed';
        return {
          type: 'research_report' as const,
          error: message,
          report: '',
          sources: [],
          subQueries: [],
          totalSearches: 0,
        };
      }
    },
  });
}
