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

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { query, maxResults = 5, provider } = await req.json();

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
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
