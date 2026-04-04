import { NextResponse } from 'next/server';
import { getMultiverseStats } from '@/lib/worlds/world-stats';

export const revalidate = 120; // ISR: revalidate every 2 minutes

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
