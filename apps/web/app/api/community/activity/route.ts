/**
 * Community Activity Feed API (Public)
 *
 * GET /api/community/activity - Returns recent public activity across the platform.
 * No authentication required. Queries Supabase activity_log joined with profiles,
 * falls back to demo data when DB is empty or not configured.
 *
 * Query params:
 *   limit  - Number of items (default: 20, max: 50)
 *   before - ISO timestamp cursor for pagination
 */

import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export interface CommunityActivityItem {
  id: string;
  type: 'creation' | 'follow' | 'like' | 'gate_unlock' | 'achievement';
  actor: {
    id: string;
    username: string;
    avatarUrl?: string;
    element?: string;
  };
  target?: {
    id: string;
    title?: string;
    username?: string;
    type?: string;
  };
  metadata?: {
    gateName?: string;
    creationType?: string;
    element?: string;
  };
  createdAt: string;
}

/**
 * Maps activity_log action strings to our ActivityItem types
 */
function mapActionToType(action: string): CommunityActivityItem['type'] {
  switch (action) {
    case 'create':
    case 'publish':
    case 'creation':
      return 'creation';
    case 'follow':
      return 'follow';
    case 'like':
    case 'appreciate':
      return 'like';
    case 'gate_unlock':
    case 'unlock_gate':
      return 'gate_unlock';
    case 'achievement':
    case 'milestone':
      return 'achievement';
    default:
      return 'creation';
  }
}

async function fetchLiveActivity(
  limit: number,
  before?: string
): Promise<CommunityActivityItem[] | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON) return null;

  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON,
    Authorization: `Bearer ${SUPABASE_ANON}`,
  };

  try {
    // Fetch activity_log entries
    let url = `${SUPABASE_URL}/rest/v1/activity_log?select=id,action,entity_type,entity_id,metadata,created_at,user_id&order=created_at.desc&limit=${limit}`;

    if (before) {
      url += `&created_at=lt.${encodeURIComponent(before)}`;
    }

    const res = await fetch(url, {
      headers,
      next: { revalidate: 30 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    // Batch-fetch profiles for all user IDs
    const userIds = [...new Set(data.map((r: Record<string, unknown>) => r.user_id as string).filter(Boolean))];
    const profileMap: Record<string, { display_name: string; avatar_url?: string }> = {};

    if (userIds.length > 0) {
      try {
        const profileUrl = `${SUPABASE_URL}/rest/v1/profiles?select=id,display_name,avatar_url&id=in.(${userIds.join(',')})`;
        const profileRes = await fetch(profileUrl, { headers, next: { revalidate: 120 } });
        if (profileRes.ok) {
          const profiles = await profileRes.json();
          if (Array.isArray(profiles)) {
            for (const p of profiles) {
              profileMap[p.id] = p;
            }
          }
        }
      } catch {
        // Profile fetch failed — continue without profile data
      }
    }

    const items: CommunityActivityItem[] = data.map((row: Record<string, unknown>) => {
      const userId = row.user_id as string;
      const profile = profileMap[userId];
      const meta = row.metadata as Record<string, unknown> | null;
      const type = mapActionToType(row.action as string);

      const item: CommunityActivityItem = {
        id: row.id as string,
        type,
        actor: {
          id: userId,
          username: profile?.display_name || 'Creator',
          avatarUrl: profile?.avatar_url || undefined,
          element: meta?.element as string | undefined,
        },
        createdAt: row.created_at as string,
      };

      // Add target info based on entity type
      if (row.entity_id) {
        item.target = {
          id: row.entity_id as string,
          title: meta?.title as string | undefined,
          username: meta?.target_username as string | undefined,
          type: row.entity_type as string | undefined,
        };
      }

      // Add metadata
      if (meta) {
        item.metadata = {
          gateName: meta.gate_name as string | undefined,
          creationType: (row.entity_type as string) || undefined,
          element: meta.element as string | undefined,
        };
      }

      return item;
    });

    return items;
  } catch {
    return null;
  }
}

// Demo fallback data
const DEMO_ACTIVITY: CommunityActivityItem[] = [
  {
    id: '1',
    type: 'creation',
    actor: { id: 'u1', username: 'Resonance Mage', element: 'Water' },
    target: { id: 'c1', title: 'The Sunken Hymnal', type: 'text' },
    metadata: { creationType: 'text', element: 'Water' },
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: '2',
    type: 'gate_unlock',
    actor: { id: 'u2', username: 'Archive Walker', element: 'Void' },
    metadata: { gateName: 'Sight' },
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: '3',
    type: 'follow',
    actor: { id: 'u3', username: 'Flame Weaver', element: 'Fire' },
    target: { id: 'u4', username: 'Solfeggio Wanderer' },
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '4',
    type: 'creation',
    actor: { id: 'u5', username: 'Terra Sculptor', element: 'Earth' },
    target: { id: 'c2', title: 'Godbeast Field Study: Kaelith', type: 'image' },
    metadata: { creationType: 'image', element: 'Earth' },
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: '5',
    type: 'like',
    actor: { id: 'u6', username: 'Wind Caller', element: 'Wind' },
    target: { id: 'c3', title: 'Frequency Composition: 528 Hz' },
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: '6',
    type: 'achievement',
    actor: { id: 'u7', username: 'Crystal Singer', element: 'Water' },
    metadata: { gateName: 'Voice' },
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: '7',
    type: 'creation',
    actor: { id: 'u8', username: 'Void Weaver', element: 'Void' },
    target: { id: 'c4', title: 'Malachar: The Fallen Symphony', type: 'audio' },
    metadata: { creationType: 'audio', element: 'Void' },
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: '8',
    type: 'creation',
    actor: { id: 'u9', username: 'Code Alchemist', element: 'Fire' },
    target: { id: 'c5', title: 'Guardian Invocation CLI', type: 'code' },
    metadata: { creationType: 'code', element: 'Fire' },
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  const before = searchParams.get('before') || undefined;

  const live = await fetchLiveActivity(limit, before);

  if (live && live.length > 0) {
    return NextResponse.json(
      { success: true, data: live },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
    );
  }

  // Fallback to demo data
  return NextResponse.json(
    { success: true, data: DEMO_ACTIVITY.slice(0, limit) },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
  );
}
