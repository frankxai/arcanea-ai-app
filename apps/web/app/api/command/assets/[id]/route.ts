/**
 * Command Center — Single Asset API
 *
 * GET    /api/command/assets/:id — Fetch single asset with full metadata
 * PATCH  /api/command/assets/:id — Update a single asset
 * DELETE /api/command/assets/:id — Soft delete (set status to 'rejected')
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
// Validation
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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ALLOWED_FIELDS = [
  'status', 'guardian', 'element', 'gate', 'quality_tier',
  'content_type', 'tags', 'flagged', 'ai_description', 'storage_url',
];

// ---------------------------------------------------------------------------
// GET — Single asset
// ---------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid asset ID format' }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    const { data, error } = await (supabase as any)
      .from('asset_metadata' as never)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
      }
      console.error('[api/command/assets/[id]] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[api/command/assets/[id]] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH — Update single asset
// ---------------------------------------------------------------------------

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid asset ID format' }, { status: 400 });
  }

  try {
    const updates = await request.json();

    if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Request body must be a non-empty object' }, { status: 400 });
    }

    // Validate enum fields if present
    if (updates.status && !VALID_STATUSES.includes(updates.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 },
      );
    }
    if (updates.guardian && !VALID_GUARDIANS.includes(updates.guardian)) {
      return NextResponse.json(
        { error: `Invalid guardian. Must be one of: ${VALID_GUARDIANS.join(', ')}` },
        { status: 400 },
      );
    }
    if (updates.element && !VALID_ELEMENTS.includes(updates.element)) {
      return NextResponse.json(
        { error: `Invalid element. Must be one of: ${VALID_ELEMENTS.join(', ')}` },
        { status: 400 },
      );
    }
    if (updates.quality_tier && !VALID_TIERS.includes(updates.quality_tier)) {
      return NextResponse.json(
        { error: `Invalid quality_tier. Must be one of: ${VALID_TIERS.join(', ')}` },
        { status: 400 },
      );
    }

    // Sanitize to allowed fields only
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
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
      }
      console.error('[api/command/assets/[id]] PATCH error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[api/command/assets/[id]] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE — Soft delete (set status to 'rejected')
// ---------------------------------------------------------------------------

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid asset ID format' }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    const { data, error } = await (supabase as any)
      .from('asset_metadata' as never)
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, status')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
      }
      console.error('[api/command/assets/[id]] DELETE error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, message: 'Asset soft-deleted (status set to rejected)' });
  } catch (err) {
    console.error('[api/command/assets/[id]] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
