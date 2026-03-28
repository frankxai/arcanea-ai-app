/**
 * Community Creators API
 *
 * GET /api/community/creators - Discover creators with filtering and sorting.
 * Queries Supabase for real profiles, falls back to demo data when DB is empty.
 *
 * Query params:
 *   element  - Filter by element affinity (Fire, Water, Earth, Wind, Void, Spirit)
 *   gate     - Filter by current gate name
 *   house    - Filter by academy house
 *   search   - Full-text search on username, display_name, bio
 *   sort     - trending | followers | creations | newest | gate (default: trending)
 *   page     - Page number (default: 1)
 *   pageSize - Results per page (default: 12, max: 50)
 */

import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

interface CreatorProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  element?: string;
  gate_level?: number;
  gate_name?: string;
  house?: string;
  creation_count: number;
  follower_count: number;
  rank: string;
  featured?: boolean;
  created_at: string;
}

function getRank(gateLevel: number): string {
  if (gateLevel >= 9) return 'Luminor';
  if (gateLevel >= 7) return 'Archmage';
  if (gateLevel >= 5) return 'Master';
  if (gateLevel >= 3) return 'Mage';
  return 'Apprentice';
}

async function fetchLiveCreators(params: {
  element?: string;
  gate?: string;
  house?: string;
  search?: string;
  sort?: string;
  page: number;
  pageSize: number;
}): Promise<{ creators: CreatorProfile[]; total: number } | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON) return null;

  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON,
    Authorization: `Bearer ${SUPABASE_ANON}`,
    Prefer: 'count=exact',
  };

  try {
    let url = `${SUPABASE_URL}/rest/v1/profiles?select=id,username,display_name,avatar_url,bio,element,gate_level,gate_name,house,creation_count,follower_count,featured,created_at`;

    // Filters
    if (params.element && params.element !== 'All') {
      url += `&element=eq.${encodeURIComponent(params.element)}`;
    }
    if (params.gate && params.gate !== 'All') {
      url += `&gate_name=eq.${encodeURIComponent(params.gate)}`;
    }
    if (params.house && params.house !== 'All') {
      url += `&house=eq.${encodeURIComponent(params.house)}`;
    }
    if (params.search) {
      url += `&or=(username.ilike.*${encodeURIComponent(params.search)}*,display_name.ilike.*${encodeURIComponent(params.search)}*,bio.ilike.*${encodeURIComponent(params.search)}*)`;
    }

    // Sort
    switch (params.sort) {
      case 'followers':
        url += '&order=follower_count.desc.nullslast';
        break;
      case 'creations':
        url += '&order=creation_count.desc.nullslast';
        break;
      case 'gate':
        url += '&order=gate_level.desc.nullslast';
        break;
      case 'newest':
        url += '&order=created_at.desc';
        break;
      case 'trending':
      default:
        url += '&order=featured.desc.nullslast,follower_count.desc.nullslast';
        break;
    }

    // Pagination
    const offset = (params.page - 1) * params.pageSize;
    url += `&offset=${offset}&limit=${params.pageSize}`;

    const res = await fetch(url, {
      headers,
      next: { revalidate: 120 },
    });

    if (!res.ok) return null;

    const data: CreatorProfile[] = await res.json();
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] ?? '0');

    // Compute ranks
    const creators = data.map((p) => ({
      ...p,
      rank: getRank(p.gate_level ?? 0),
      creation_count: p.creation_count ?? 0,
      follower_count: p.follower_count ?? 0,
    }));

    return { creators, total };
  } catch {
    return null;
  }
}

// Demo fallback
const DEMO_CREATORS: CreatorProfile[] = [
  {
    id: 'c1', username: 'resonance_mage', display_name: 'Resonance Mage',
    bio: 'Voice Gate practitioner. Writing ritual texts and guided meditations.',
    element: 'Water', gate_level: 5, gate_name: 'Voice', house: 'Aqualis',
    creation_count: 47, follower_count: 312, rank: 'Master', featured: true,
    created_at: '2025-12-01T00:00:00Z',
  },
  {
    id: 'c2', username: 'archive_walker', display_name: 'Archive Walker',
    bio: 'Visual chronicler of the Godbeasts.',
    element: 'Void', gate_level: 6, gate_name: 'Sight', house: 'Nero',
    creation_count: 83, follower_count: 567, rank: 'Master', featured: true,
    created_at: '2025-11-15T00:00:00Z',
  },
  {
    id: 'c3', username: 'flame_weaver', display_name: 'Flame Weaver',
    bio: 'Code and fire. Building tools that channel transformative energy.',
    element: 'Fire', gate_level: 7, gate_name: 'Crown', house: 'Pyros',
    creation_count: 156, follower_count: 892, rank: 'Archmage', featured: true,
    created_at: '2025-10-01T00:00:00Z',
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = {
    element: searchParams.get('element') || undefined,
    gate: searchParams.get('gate') || undefined,
    house: searchParams.get('house') || undefined,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || 'trending',
    page: Math.max(1, parseInt(searchParams.get('page') || '1')),
    pageSize: Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '12'))),
  };

  const live = await fetchLiveCreators(params);

  if (live && live.creators.length > 0) {
    return NextResponse.json(
      { success: true, data: live.creators, total: live.total },
      { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' } }
    );
  }

  // Fallback to demo data
  return NextResponse.json(
    { success: true, data: DEMO_CREATORS, total: DEMO_CREATORS.length },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
  );
}
