/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest, NextResponse } from 'next/server';
import { searchWorlds } from '@/lib/worlds/world-search';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get('q') || '';
  const genre = searchParams.get('genre') || undefined;
  const sort = (searchParams.get('sort') || 'relevance') as 'relevance' | 'stars' | 'recent' | 'forks';
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 20)));
  const offset = Math.max(0, Number(searchParams.get('offset') || 0));

  try {
    const result = await searchWorlds({ query, genre, sort, limit, offset });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Search failed' },
      { status: 500 }
    );
  }
}
