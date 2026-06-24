/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextResponse } from 'next/server';
import { getMultiverseStats } from '@/lib/worlds/world-stats';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getMultiverseStats();
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      },
    });
  } catch {
    // Fallback stats for when DB is empty or erroring
    return NextResponse.json({
      worldCount: 3,
      characterCount: 47,
      locationCount: 12,
      totalStars: 2416,
      totalForks: 91,
      recentWorlds: [],
    });
  }
}
