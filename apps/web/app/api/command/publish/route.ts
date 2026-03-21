/**
 * Command Center — Publish Pipeline API
 *
 * GET  /api/command/publish — List recent publish pipeline entries
 * POST /api/command/publish — Trigger a new publish action
 *
 * Uses the `publish_pipeline` Supabase table. All queries respect RLS.
 *
 * NOTE: Tables created by migration 20260317 — types will be generated
 * after `supabase gen types`. Until then we cast via `as any` to bypass
 * the generated Database type that doesn't yet include these tables.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type {
  PublishTarget,
  PublishAction,
  PublishStatus,
} from '@/lib/command-center/types';

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const VALID_TARGETS: PublishTarget[] = ['website', 'social', 'nft', 'book', 'music_platform'];
const VALID_ACTIONS: PublishAction[] = [
  'deploy_hero', 'deploy_gallery', 'update_og_image', 'mint_nft', 'publish_track',
];
const VALID_STATUSES: PublishStatus[] = [
  'pending', 'in_progress', 'completed', 'failed', 'rolled_back',
];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ---------------------------------------------------------------------------
// GET — List recent publish pipeline entries
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const target = searchParams.get('target') as PublishTarget | null;
  const status = searchParams.get('status') as PublishStatus | null;
  const assetId = searchParams.get('asset_id');
  const limit = Math.min(
    Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10) || 50),
    200,
  );
  const offset = Math.max(0, parseInt(searchParams.get('offset') ?? '0', 10) || 0);

  if (target && !VALID_TARGETS.includes(target)) {
    return NextResponse.json(
      { error: `Invalid target. Must be one of: ${VALID_TARGETS.join(', ')}` },
      { status: 400 },
    );
  }
  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 },
    );
  }
  if (assetId && !UUID_RE.test(assetId)) {
    return NextResponse.json(
      { error: 'asset_id must be a valid UUID' },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();

    let query = (supabase as any)
      .from('publish_pipeline' as never)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (target) query = query.eq('target', target);
    if (status) query = query.eq('status', status);
    if (assetId) query = query.eq('asset_id', assetId);

    const { data, count, error } = await query;

    if (error) {
      console.error('[api/command/publish] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [], count: count ?? 0 });
  } catch (err) {
    console.error('[api/command/publish] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST — Trigger a new publish action
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      asset_id,
      target,
      action,
      destination,
      max_retries,
    } = body as {
      asset_id?: string;
      target?: PublishTarget;
      action?: PublishAction;
      destination?: string;
      max_retries?: number;
    };

    // Required fields
    if (!asset_id || !UUID_RE.test(asset_id)) {
      return NextResponse.json(
        { error: 'asset_id is required and must be a valid UUID' },
        { status: 400 },
      );
    }
    if (!target || !VALID_TARGETS.includes(target)) {
      return NextResponse.json(
        { error: `target is required. Must be one of: ${VALID_TARGETS.join(', ')}` },
        { status: 400 },
      );
    }
    if (!action || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        { error: `action is required. Must be one of: ${VALID_ACTIONS.join(', ')}` },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verify the asset exists
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
        { error: `Asset must be approved or published before triggering publish. Current status: ${asset.status}` },
        { status: 422 },
      );
    }

    const { data, error } = await (supabase as any)
      .from('publish_pipeline' as never)
      .insert({
        asset_id,
        target,
        action,
        status: 'pending',
        destination: destination ?? null,
        retry_count: 0,
        max_retries: typeof max_retries === 'number' ? Math.min(max_retries, 10) : 3,
      })
      .select()
      .single();

    if (error) {
      console.error('[api/command/publish] POST error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('[api/command/publish] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
