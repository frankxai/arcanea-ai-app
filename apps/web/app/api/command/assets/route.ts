/**
 * Command Center — Assets API
 *
 * GET  /api/command/assets  — Fetch assets with filtering, pagination
 * PATCH /api/command/assets — Bulk update assets (approve, reject, reclassify)
 *
 * Uses the `asset_metadata` Supabase table. All queries respect RLS.
 *
 * NOTE: Tables created by migration 20260317 — types will be generated
 * after `supabase gen types`. Until then we cast via `as any` to bypass
 * the generated Database type that doesn't yet include these tables.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type {
  AssetStatus,
  Guardian,
  Element,
  QualityTier,
} from '@/lib/command-center/types';

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const VALID_STATUSES: AssetStatus[] = [
  'new', 'classified', 'processed', 'scored', 'approved', 'rejected', 'published',
];

const VALID_GUARDIANS: Guardian[] = [
  'Lyssandria', 'Leyla', 'Draconia', 'Maylinn', 'Alera',
  'Lyria', 'Aiyami', 'Elara', 'Ino', 'Shinkami',
];

const VALID_ELEMENTS: Element[] = ['Earth', 'Water', 'Fire', 'Wind', 'Void'];

const VALID_TIERS: QualityTier[] = ['hero', 'gallery', 'thumbnail', 'reject', 'unscored'];

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

// ---------------------------------------------------------------------------
// GET — List assets with filters
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const status = searchParams.get('status') as AssetStatus | null;
  const guardian = searchParams.get('guardian') as Guardian | null;
  const element = searchParams.get('element') as Element | null;
  const qualityTier = searchParams.get('quality_tier') as QualityTier | null;
  const search = searchParams.get('search');
  const sourceAgent = searchParams.get('source_agent');
  const flagged = searchParams.get('flagged');
  const limit = Math.min(
    Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT),
    MAX_LIMIT,
  );
  const offset = Math.max(0, parseInt(searchParams.get('offset') ?? '0', 10) || 0);

  // Validate enum params
  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 },
    );
  }
  if (guardian && !VALID_GUARDIANS.includes(guardian)) {
    return NextResponse.json(
      { error: `Invalid guardian. Must be one of: ${VALID_GUARDIANS.join(', ')}` },
      { status: 400 },
    );
  }
  if (element && !VALID_ELEMENTS.includes(element)) {
    return NextResponse.json(
      { error: `Invalid element. Must be one of: ${VALID_ELEMENTS.join(', ')}` },
      { status: 400 },
    );
  }
  if (qualityTier && !VALID_TIERS.includes(qualityTier)) {
    return NextResponse.json(
      { error: `Invalid quality_tier. Must be one of: ${VALID_TIERS.join(', ')}` },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();

    let query = (supabase as any)
      .from('asset_metadata' as never)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);
    if (guardian) query = query.eq('guardian', guardian);
    if (element) query = query.eq('element', element);
    if (qualityTier) query = query.eq('quality_tier', qualityTier);
    if (sourceAgent) query = query.eq('source_agent', sourceAgent);
    if (flagged === 'true') query = query.eq('flagged', true);
    if (flagged === 'false') query = query.eq('flagged', false);

    if (search) {
      query = query.or(
        `filename.ilike.%${search}%,ai_description.ilike.%${search}%`,
      );
    }

    const { data, count, error } = await query;

    if (error) {
      console.error('[api/command/assets] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [], count: count ?? 0 });
  } catch (err) {
    console.error('[api/command/assets] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// PATCH — Bulk update assets
// ---------------------------------------------------------------------------

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, updates } = body as {
      ids?: string[];
      updates?: Record<string, unknown>;
    };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'ids must be a non-empty array of asset UUIDs' },
        { status: 400 },
      );
    }

    if (ids.length > 200) {
      return NextResponse.json(
        { error: 'Maximum 200 assets per bulk operation' },
        { status: 400 },
      );
    }

    if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'updates must be a non-empty object' },
        { status: 400 },
      );
    }

    // Validate specific update fields
    if (updates.status && !VALID_STATUSES.includes(updates.status as AssetStatus)) {
      return NextResponse.json(
        { error: `Invalid status value. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 },
      );
    }
    if (updates.guardian && !VALID_GUARDIANS.includes(updates.guardian as Guardian)) {
      return NextResponse.json(
        { error: `Invalid guardian value. Must be one of: ${VALID_GUARDIANS.join(', ')}` },
        { status: 400 },
      );
    }
    if (updates.element && !VALID_ELEMENTS.includes(updates.element as Element)) {
      return NextResponse.json(
        { error: `Invalid element value. Must be one of: ${VALID_ELEMENTS.join(', ')}` },
        { status: 400 },
      );
    }
    if (updates.quality_tier && !VALID_TIERS.includes(updates.quality_tier as QualityTier)) {
      return NextResponse.json(
        { error: `Invalid quality_tier value. Must be one of: ${VALID_TIERS.join(', ')}` },
        { status: 400 },
      );
    }

    // Allowlist of updatable columns to prevent arbitrary writes
    const ALLOWED_FIELDS = [
      'status', 'guardian', 'element', 'gate', 'quality_tier',
      'content_type', 'tags', 'flagged', 'ai_description',
    ];

    const sanitized: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const key of Object.keys(updates)) {
      if (ALLOWED_FIELDS.includes(key)) {
        sanitized[key] = updates[key];
      }
    }

    const supabase = await createClient();

    const { data, error } = await (supabase as any)
      .from('asset_metadata' as never)
      .update(sanitized)
      .in('id', ids)
      .select('id');

    if (error) {
      console.error('[api/command/assets] PATCH error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ updated: data?.length ?? 0 });
  } catch (err) {
    console.error('[api/command/assets] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
