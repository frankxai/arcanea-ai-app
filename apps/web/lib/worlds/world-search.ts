/**
 * World Search — Full-text + semantic search for world discovery
 *
 * Supabase full-text search on worlds table with weighted ranking:
 * - name: weight A (highest)
 * - tagline: weight B
 * - description: weight C
 * - mood: weight D
 */

import { createClient } from '@/lib/supabase/server';

export interface WorldSearchOptions {
  query: string;
  limit?: number;
  offset?: number;
  genre?: string;
  sort?: 'relevance' | 'stars' | 'recent' | 'forks';
}

export interface WorldSearchResult {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  mood: string | null;
  hero_image_url: string | null;
  star_count: number;
  fork_count: number;
  character_count: number;
  creator_id: string;
  elements: unknown;
  created_at: string;
}

const GENRE_KEYWORDS: Record<string, string[]> = {
  fantasy: ['magic', 'dragon', 'wizard', 'sword', 'quest', 'kingdom', 'enchanted', 'mythical'],
  scifi: ['space', 'star', 'cyber', 'neon', 'android', 'galaxy', 'quantum', 'AI', 'robot'],
  horror: ['dark', 'shadow', 'death', 'undead', 'horror', 'nightmare', 'void', 'curse'],
  steampunk: ['steam', 'clockwork', 'Victorian', 'airship', 'brass', 'gear', 'industrial'],
  mythological: ['god', 'goddess', 'titan', 'olympus', 'norse', 'divine', 'ancient', 'temple'],
  aquatic: ['ocean', 'underwater', 'sea', 'coral', 'deep', 'tide', 'marine', 'abyss'],
};

export async function searchWorlds(options: WorldSearchOptions): Promise<{
  worlds: WorldSearchResult[];
  total: number;
}> {
  const { query, limit = 20, offset = 0, genre, sort = 'relevance' } = options;
  const sb = await createClient();

  let q = sb
    .from('worlds')
    .select('id, slug, name, tagline, description, mood, hero_image_url, star_count, fork_count, character_count, creator_id, elements, created_at', { count: 'exact' })
    .eq('visibility', 'public');

  // Text search — use ilike for now (Supabase full-text search needs tsvector column)
  if (query && query.length > 0) {
    q = q.or(`name.ilike.%${query}%,tagline.ilike.%${query}%,description.ilike.%${query}%,mood.ilike.%${query}%`);
  }

  // Genre filter via mood/description keywords
  if (genre && GENRE_KEYWORDS[genre]) {
    const keywords = GENRE_KEYWORDS[genre];
    const orClauses = keywords.map(k => `mood.ilike.%${k}%,description.ilike.%${k}%`).join(',');
    q = q.or(orClauses);
  }

  // Sort
  switch (sort) {
    case 'stars':
      q = q.order('star_count', { ascending: false });
      break;
    case 'forks':
      q = q.order('fork_count', { ascending: false });
      break;
    case 'recent':
      q = q.order('created_at', { ascending: false });
      break;
    default:
      q = q.order('star_count', { ascending: false });
  }

  q = q.range(offset, offset + limit - 1);

  const { data, error, count } = await q;

  if (error) throw new Error(`Search failed: ${error.message}`);

  return {
    worlds: (data || []) as WorldSearchResult[],
    total: count || 0,
  };
}

/**
 * Detect genre from a description string.
 * Used for predictive UX in the creation studio.
 */
export function detectGenre(description: string): { genre: string; confidence: number } | null {
  const lower = description.toLowerCase();
  let bestGenre = '';
  let bestScore = 0;

  for (const [genre, keywords] of Object.entries(GENRE_KEYWORDS)) {
    const score = keywords.filter(k => lower.includes(k.toLowerCase())).length;
    if (score > bestScore) {
      bestScore = score;
      bestGenre = genre;
    }
  }

  if (bestScore === 0) return null;

  return {
    genre: bestGenre.charAt(0).toUpperCase() + bestGenre.slice(1),
    confidence: Math.min(bestScore / 3, 1),
  };
}
