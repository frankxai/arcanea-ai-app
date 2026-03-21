/**
 * Command Center — Social Queue API
 *
 * GET   /api/command/social — List social queue items (filterable)
 * POST  /api/command/social — Create a new social post from an approved asset
 * PATCH /api/command/social — Approve or schedule an existing social post
 *
 * Uses the `social_queue` Supabase table. All queries respect RLS.
 *
 * NOTE: Tables created by migration 20260317 — types will be generated
 * after `supabase gen types`. Until then we cast via `as any` to bypass
 * the generated Database type that doesn't yet include these tables.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type {
  SocialPlatform,
  SocialStatus,
} from '@/lib/command-center/types';

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const VALID_PLATFORMS: SocialPlatform[] = ['instagram', 'linkedin', 'x', 'youtube', 'tiktok'];
const VALID_STATUSES: SocialStatus[] = [
  'draft', 'ready', 'approved', 'scheduled', 'publishing', 'published', 'failed',
];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ---------------------------------------------------------------------------
// GET — List social queue
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const platform = searchParams.get('platform') as SocialPlatform | null;
  const status = searchParams.get('status') as SocialStatus | null;
  const limit = Math.min(
    Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10) || 50),
    200,
  );
  const offset = Math.max(0, parseInt(searchParams.get('offset') ?? '0', 10) || 0);

  if (platform && !VALID_PLATFORMS.includes(platform)) {
    return NextResponse.json(
      { error: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(', ')}` },
      { status: 400 },
    );
  }
  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();

    let query = (supabase as any)
      .from('social_queue' as never)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (platform) query = query.eq('platform', platform);
    if (status) query = query.eq('status', status);

    const { data, count, error } = await query;

    if (error) {
      console.error('[api/command/social] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [], count: count ?? 0 });
  } catch (err) {
    console.error('[api/command/social] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST — Create a new social post from an approved asset
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { asset_id, platform, caption, hashtags } = body as {
      asset_id?: string;
      platform?: SocialPlatform;
      caption?: string;
      hashtags?: string[];
    };

    // Required fields
    if (!asset_id || !UUID_RE.test(asset_id)) {
      return NextResponse.json(
        { error: 'asset_id is required and must be a valid UUID' },
        { status: 400 },
      );
    }
    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      return NextResponse.json(
        { error: `platform is required. Must be one of: ${VALID_PLATFORMS.join(', ')}` },
        { status: 400 },
      );
    }
    if (!caption || typeof caption !== 'string' || caption.trim().length === 0) {
      return NextResponse.json(
        { error: 'caption is required and must be a non-empty string' },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verify the asset exists and is approved
    const { data: asset, error: assetError } = await (supabase as any)
      .from('asset_metadata' as never)
      .select('id, status')
      .eq('id', asset_id)
      .single();

    if (assetError || !asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    if (asset.status !== 'approved' && asset.status !== 'published') {
      return NextResponse.json(
        { error: `Asset must be approved or published before creating social posts. Current status: ${asset.status}` },
        { status: 422 },
      );
    }

    const { data, error } = await (supabase as any)
      .from('social_queue' as never)
      .insert({
        asset_id,
        platform,
        status: 'draft',
        caption: caption.trim(),
        hashtags: Array.isArray(hashtags) ? hashtags.map((h) => h.trim()) : [],
      })
      .select()
      .single();

    if (error) {
      console.error('[api/command/social] POST error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('[api/command/social] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH — Approve or schedule a social post
// ---------------------------------------------------------------------------

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, scheduled_at } = body as {
      id?: string;
      status?: SocialStatus;
      scheduled_at?: string;
    };

    if (!id || !UUID_RE.test(id)) {
      return NextResponse.json(
        { error: 'id is required and must be a valid UUID' },
        { status: 400 },
      );
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
          { status: 400 },
        );
      }
      updates.status = status;
    }

    if (scheduled_at) {
      const parsed = new Date(scheduled_at);
      if (isNaN(parsed.getTime())) {
        return NextResponse.json(
          { error: 'scheduled_at must be a valid ISO 8601 date string' },
          { status: 400 },
        );
      }
      updates.scheduled_at = parsed.toISOString();
      // Auto-set status to scheduled if not explicitly set
      if (!status) {
        updates.status = 'scheduled';
      }
    }

    if (Object.keys(updates).length <= 1) {
      return NextResponse.json(
        { error: 'At least one of status or scheduled_at must be provided' },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data, error } = await (supabase as any)
      .from('social_queue' as never)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Social queue item not found' }, { status: 404 });
      }
      console.error('[api/command/social] PATCH error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[api/command/social] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
