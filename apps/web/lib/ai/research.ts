/**
 * Deep Research Engine for Arcanea
 *
 * Decomposes a user question into focused sub-queries, runs them in parallel
 * against the Tavily search API, then synthesizes results into a structured
 * report using the best available AI provider.
 *
 * Usage:
 *   import { conductResearch } from '@/lib/ai/research';
 *   const result = await conductResearch('How does WebGPU compare to WebGL?');
 */

import { generateText } from 'ai';
import { executeSearch, type SearchResponse } from '@/lib/search/providers';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ResearchEvent {
  step:
    | 'planning'
    | 'searching'
    | 'reading'
    | 'synthesizing'
    | 'complete'
    | 'error';
  detail: string;
  progress?: number;
  data?: unknown;
}

export interface ResearchSource {
  title: string;
  url: string;
  snippet: string;
}

export interface ResearchResult {
  report: string;
  sources: ResearchSource[];
  subQueries: string[];
  totalSearches: number;
}

interface SearchBucket {
  query: string;
  results: Array<{
    title: string;
    url: string;
    content: string;
    score?: number;
  }>;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Conduct autonomous multi-step research on a question.
 *
 * 1. Decompose the question into focused sub-queries (fast model).
 * 2. Search Tavily in parallel for each sub-query.
 * 3. Synthesize a structured markdown report (quality model).
 */
export async function conductResearch(
  question: string,
  maxSearches: number = 5
): Promise<ResearchResult> {
  const clampedMax = Math.min(Math.max(maxSearches, 1), 10);

  // Step 1 --- Decompose into sub-queries
  const subQueries = await generateSubQueries(question, clampedMax);

  // Step 2 --- Parallel web searches (uses multi-provider abstraction)
  const searchResults = await runParallelSearches(subQueries);

  // Step 3 --- Synthesise report
  const report = await synthesizeReport(question, searchResults);

  // Deduplicate sources by URL
  const seen = new Set<string>();
  const sources: ResearchSource[] = [];
  for (const bucket of searchResults) {
    for (const r of bucket.results) {
      if (seen.has(r.url)) continue;
      seen.add(r.url);
      sources.push({
        title: r.title,
        url: r.url,
        snippet: (r.content || '').slice(0, 200),
      });
      if (sources.length >= 20) break;
    }
    if (sources.length >= 20) break;
  }

  return { report, sources, subQueries, totalSearches: subQueries.length };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function generateSubQueries(
  question: string,
  count: number
): Promise<string[]> {
  const model = await getModel('fast');

  const { text } = await generateText({
    model,
    system:
      'You decompose research questions into specific, focused web-search queries. ' +
      'Return ONLY a JSON array of strings. No explanation, no markdown fences.',
    prompt: `Break this into ${count} focused search queries that together cover the topic comprehensively:\n\n"${question}"`,
    maxOutputTokens: 500,
  });

  try {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      const parsed = JSON.parse(match[0]) as string[];
      return parsed.filter((q) => typeof q === 'string' && q.length > 3).slice(0, count);
    }
  } catch {
    // Fallback: split lines
  }

  return text
    .split('\n')
    .map((l) => l.replace(/^\d+[.)]\s*/, '').trim())
    .filter((l) => l.length > 5)
    .slice(0, count);
}

async function runParallelSearches(
  queries: string[]
): Promise<SearchBucket[]> {
  const promises = queries.map(async (query): Promise<SearchBucket> => {
    try {
      const response: SearchResponse = await executeSearch(query, {
        maxResults: 5,
      });
      return {
        query,
        results: response.results.map((r) => ({
          title: r.title,
          url: r.url,
          content: r.content,
          score: r.score,
        })),
      };
    } catch {
      return { query, results: [] };
    }
  });

  return Promise.all(promises);
}

async function synthesizeReport(
  question: string,
  searchResults: SearchBucket[]
): Promise<string> {
  const model = await getModel('quality');

  // Build context from search results
  const context = searchResults
    .map(({ query, results }) => {
      if (results.length === 0) return `### Search: "${query}"\nNo results found.`;
      const snippets = results
        .map(
          (s, i) =>
            `[${i + 1}] "${s.title}" (${s.url})\n${s.content || '(no content)'}`
        )
        .join('\n\n');
      return `### Search: "${query}"\n${snippets}`;
    })
    .join('\n\n---\n\n');

  const { text } = await generateText({
    model,
    system: `You are a research analyst synthesizing web search results into a well-structured report. Use markdown formatting:

1. **Executive Summary** - 2-3 sentences answering the core question
2. **Key Findings** - Bullet points of the most important discoveries
3. **Detailed Analysis** - Paragraphs with inline [source](url) citations
4. **Conclusion** - Brief synthesis and any remaining open questions

Be thorough, accurate, and always cite your sources with links. If results are contradictory, note the disagreement. If information is insufficient, say so honestly.`,
    prompt: `Research Question: "${question}"\n\nSearch Results:\n\n${context}`,
    maxOutputTokens: 4000,
  });

  return text;
}

// ---------------------------------------------------------------------------
// Model selection — dynamic imports to avoid bundle bloat
// ---------------------------------------------------------------------------

async function getModel(tier: 'fast' | 'quality') {
  if (tier === 'fast') {
    // Prefer Google Gemini Flash for speed/cost
    const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (googleKey) {
      const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
      return createGoogleGenerativeAI({ apiKey: googleKey })('gemini-2.5-flash');
    }
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      const { createOpenAI } = await import('@ai-sdk/openai');
      return createOpenAI({ apiKey: openaiKey })('gpt-4o-mini');
    }
  }

  // Quality tier — prefer Anthropic, then Google, then OpenAI
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    const { createAnthropic } = await import('@ai-sdk/anthropic');
    return createAnthropic({ apiKey: anthropicKey })('claude-sonnet-4-6');
  }
  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (googleKey) {
    const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
    return createGoogleGenerativeAI({ apiKey: googleKey })('gemini-2.5-flash');
  }
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    const { createOpenAI } = await import('@ai-sdk/openai');
    return createOpenAI({ apiKey: openaiKey })('gpt-4o');
  }

  throw new Error(
    'No AI provider configured for research. Set GOOGLE_GENERATIVE_AI_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY.'
  );
}
