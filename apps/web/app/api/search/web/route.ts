/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Web Search API Route
 *
 * Multi-provider search endpoint using the search provider abstraction.
 * Supports Tavily, Brave, and DuckDuckGo with automatic fallback.
 * The chat tool system uses the same abstraction directly,
 * so this route exists for non-chat use cases (e.g., search UI, agents).
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeSearch } from '@/lib/search/providers';
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';

export const runtime = 'edge';

const SEARCH_RATE_LIMIT = { maxRequests: 10, windowMs: 60_000 };

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(getClientIdentifier(req), SEARCH_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)) } });
  }

  try {
    const { query, maxResults = 5, provider } = await req.json();

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const result = await executeSearch(query.trim(), {
      provider,
      maxResults: Math.min(Math.max(Number(maxResults) || 5, 1), 10),
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Web search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
