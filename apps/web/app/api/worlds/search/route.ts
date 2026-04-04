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
