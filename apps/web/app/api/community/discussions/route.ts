/**
 * Community Discussions API
 *
 * GET  /api/community/discussions - List discussion threads
 * POST /api/community/discussions - Create a new discussion thread
 *
 * Uses the feedback table as a simple discussion store (type='discussion'),
 * with reply counts tracked via metadata. Falls back to demo data when DB is empty.
 */

import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export interface DiscussionThread {
  id: string;
  title: string;
  body: string;
  author: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    magicRank?: string;
  };
  replyCount: number;
  lastActivityAt: string;
  tags: string[];
  createdAt: string;
}

// ── GET: List discussions ──────────────────────────────────────────────────

async function fetchLiveDiscussions(params: {
  page: number;
  pageSize: number;
  search?: string;
  tag?: string;
}): Promise<{ discussions: DiscussionThread[]; total: number } | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON) return null;

  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON,
    Authorization: `Bearer ${SUPABASE_ANON}`,
    Prefer: 'count=exact',
  };

  try {
    // Query feedback table where type='discussion'
    let url = `${SUPABASE_URL}/rest/v1/feedback?select=id,message,user_id,created_at,email&type=eq.discussion&order=created_at.desc`;

    if (params.search) {
      url += `&message=ilike.*${encodeURIComponent(params.search)}*`;
    }

    const offset = (params.page - 1) * params.pageSize;
    url += `&offset=${offset}&limit=${params.pageSize}`;

    const res = await fetch(url, { headers, next: { revalidate: 60 } });
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data)) return null;

    const total = parseInt(res.headers.get('content-range')?.split('/')[1] ?? '0');

    // Collect unique user IDs to batch-fetch profiles
    const userIds = [...new Set(data.map((r: Record<string, unknown>) => r.user_id as string).filter(Boolean))];
    const profileMap: Record<string, { display_name: string; avatar_url?: string; magic_rank?: string }> = {};

    if (userIds.length > 0) {
      try {
        const profileUrl = `${SUPABASE_URL}/rest/v1/profiles?select=id,display_name,avatar_url,magic_rank&id=in.(${userIds.join(',')})`;
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
        // Profile fetch failed — proceed without profile data
      }
    }

    const discussions: DiscussionThread[] = data.map((row: Record<string, unknown>) => {
      const userId = row.user_id as string | null;
      const profile = userId ? profileMap[userId] : undefined;
      const message = row.message as string;

      // Title is the first line, body is the rest
      const lines = message.split('\n');
      const title = lines[0] || 'Untitled Discussion';
      const body = lines.slice(1).join('\n').trim();

      // Tags extracted from email field (repurposed as comma-separated tags)
      const tags = (row.email as string)?.split(',').filter(Boolean) ?? [];

      return {
        id: row.id as string,
        title,
        body,
        author: {
          id: userId || 'anonymous',
          displayName: profile?.display_name || 'Anonymous Creator',
          avatarUrl: profile?.avatar_url || undefined,
          magicRank: profile?.magic_rank || undefined,
        },
        replyCount: 0, // Would need a separate replies table or count
        lastActivityAt: row.created_at as string,
        tags,
        createdAt: row.created_at as string,
      };
    });

    return { discussions, total };
  } catch {
    return null;
  }
}

// Demo discussions
const DEMO_DISCUSSIONS: DiscussionThread[] = [
  {
    id: 'd1',
    title: 'Best practices for channeling the Fire element in code generation',
    body: 'I have been experimenting with invoking Draconia before starting intense coding sessions. The transformation energy seems to flow into the architecture decisions. Anyone else tried element-aligned development?',
    author: { id: 'u1', displayName: 'Flame Weaver', magicRank: 'Archmage' },
    replyCount: 12,
    lastActivityAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    tags: ['fire', 'code', 'practice'],
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'd2',
    title: 'The Heart Gate changed how I write — here is what I learned',
    body: 'After unlocking the Heart Gate, my creative writing has taken on a completely different quality. The connection to Maylinn and healing energy translates directly into more emotionally resonant prose.',
    author: { id: 'u2', displayName: 'Crystal Singer', magicRank: 'Mage' },
    replyCount: 8,
    lastActivityAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    tags: ['heart', 'writing', 'gates'],
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: 'd3',
    title: 'Void element artists — share your dark ambient creations',
    body: 'Looking for fellow Void-aligned creators who work in dark ambient, experimental sound, or shadow art. Started a collection of works exploring the fertile darkness that Nero represents.',
    author: { id: 'u3', displayName: 'Void Weaver', magicRank: 'Archmage' },
    replyCount: 15,
    lastActivityAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    tags: ['void', 'audio', 'art'],
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
  {
    id: 'd4',
    title: 'Weekly Godbeast illustration challenge — Week 12: Kaelith',
    body: 'This week we illustrate Kaelith, the Godbeast of the Foundation Gate. Post your interpretations here. Remember: Kaelith embodies Earth, survival, and the bedrock of all creation.',
    author: { id: 'u4', displayName: 'Archive Walker', magicRank: 'Master' },
    replyCount: 23,
    lastActivityAt: new Date(Date.now() - 30 * 60000).toISOString(),
    tags: ['challenge', 'art', 'godbeasts'],
    createdAt: new Date(Date.now() - 96 * 3600000).toISOString(),
  },
  {
    id: 'd5',
    title: 'Request for canon clarification: Malachar and the Hungry Void',
    body: 'In CANON_LOCKED.md, Malachar falls into the Hungry Void after being rejected by Shinkami. Is the Hungry Void the same as corrupted Void (Shadow), or is it a separate phenomenon? The distinction matters for my story.',
    author: { id: 'u5', displayName: 'Lumina Scribe', magicRank: 'Luminor' },
    replyCount: 6,
    lastActivityAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    tags: ['lore', 'canon', 'question'],
    createdAt: new Date(Date.now() - 120 * 3600000).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = {
    page: Math.max(1, parseInt(searchParams.get('page') || '1')),
    pageSize: Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '20'))),
    search: searchParams.get('search') || undefined,
    tag: searchParams.get('tag') || undefined,
  };

  const live = await fetchLiveDiscussions(params);

  if (live && live.discussions.length > 0) {
    return NextResponse.json(
      { success: true, data: live.discussions, total: live.total },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
    );
  }

  // Filter demo data by tag if specified
  let filtered = DEMO_DISCUSSIONS;
  if (params.tag) {
    filtered = filtered.filter((d) => d.tags.includes(params.tag!));
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (d) => d.title.toLowerCase().includes(q) || d.body.toLowerCase().includes(q)
    );
  }

  return NextResponse.json(
    { success: true, data: filtered, total: filtered.length },
    { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300' } }
  );
}

// ── POST: Create discussion ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    return NextResponse.json(
      { success: false, error: 'Supabase not configured' },
      { status: 503 }
    );
  }

  try {
    // Get auth token from header
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, content, tags } = body as {
      title?: string;
      content?: string;
      tags?: string[];
    };

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Title must be 200 characters or fewer' },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Content must be 5000 characters or fewer' },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      apikey: SUPABASE_ANON,
      Authorization: authHeader,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };

    // First, get the user from auth
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: authHeader,
      },
    });

    if (!userRes.ok) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication' },
        { status: 401 }
      );
    }

    const user = await userRes.json();

    // Insert into feedback table with type='discussion'
    // Message = title\nbody, email = comma-separated tags
    const message = `${title.trim()}\n${content.trim()}`;
    const tagStr = (tags || []).slice(0, 5).join(',');

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        user_id: user.id,
        message,
        type: 'discussion',
        email: tagStr || null,
      }),
    });

    if (!insertRes.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to create discussion' },
        { status: 500 }
      );
    }

    const created = await insertRes.json();
    const row = Array.isArray(created) ? created[0] : created;

    return NextResponse.json({
      success: true,
      data: {
        id: row.id,
        title: title.trim(),
        body: content.trim(),
        tags: tags || [],
        createdAt: row.created_at,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
