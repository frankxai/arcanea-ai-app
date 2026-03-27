/**
 * Tavily Web Search API Route
 *
 * Standalone wrapper for the Tavily search API.
 * Can be called directly from the client or used as a utility endpoint.
 * The chat tool system calls Tavily directly in its execute() function,
 * so this route exists for non-chat use cases (e.g., search UI, agents).
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content?: string;
}

export async function POST(req: NextRequest) {
  const { query, maxResults = 5, searchDepth = 'basic' } = await req.json();

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Search not configured' }, { status: 503 });
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: query.trim(),
        max_results: Math.min(Math.max(Number(maxResults) || 5, 1), 10),
        search_depth: searchDepth === 'advanced' ? 'advanced' : 'basic',
        include_answer: true,
        include_raw_content: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('Tavily API error:', response.status, errorText);
      return NextResponse.json({ error: 'Search failed' }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      query: query.trim(),
      answer: data.answer || null,
      results: (data.results || []).map((r: TavilyResult) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })),
    });
  } catch (error) {
    console.error('Web search error:', error);
    return NextResponse.json({ error: 'Search request failed' }, { status: 500 });
  }
}
