/**
 * World Stats — Aggregated metrics for the multiverse.
 * Used by discovery page, ecosystem hub, and homepage.
 */

import { createClient } from '@/lib/supabase/server';
import { withCache } from './world-cache';

export interface MultiverseStats {
  worldCount: number;
  characterCount: number;
  locationCount: number;
  totalStars: number;
  totalForks: number;
  recentWorlds: { name: string; slug: string; created_at: string }[];
}

/**
 * Get aggregated stats across all public worlds.
 * Cached for 2 minutes to avoid hammering Supabase.
 */
export async function getMultiverseStats(): Promise<MultiverseStats> {
  return withCache('multiverse-stats', async () => {
    const sb = await createClient();

    const [worlds, characters, locations, recent] = await Promise.all([
      sb.from('worlds').select('star_count, fork_count', { count: 'exact' }).eq('visibility', 'public'),
      sb.from('world_characters').select('id', { count: 'exact', head: true }),
      sb.from('world_locations').select('id', { count: 'exact', head: true }),
      sb.from('worlds').select('name, slug, created_at').eq('visibility', 'public').order('created_at', { ascending: false }).limit(5),
    ]);

    const worldData = worlds.data || [];
    const totalStars = worldData.reduce((sum, w) => sum + ((w as { star_count: number }).star_count || 0), 0);
    const totalForks = worldData.reduce((sum, w) => sum + ((w as { fork_count: number }).fork_count || 0), 0);

    return {
      worldCount: worlds.count || 0,
      characterCount: characters.count || 0,
      locationCount: locations.count || 0,
      totalStars,
      totalForks,
      recentWorlds: (recent.data || []) as MultiverseStats['recentWorlds'],
    };
  }, 120_000); // 2 minute TTL
}
