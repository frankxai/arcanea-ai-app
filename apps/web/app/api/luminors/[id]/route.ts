/**
 * /api/luminors/[id] — Single Luminor operations.
 *
 * GET: Fetch a Luminor by ID (public if published, or owned)
 * PATCH: Update a Luminor (creator only)
 * DELETE: Delete a Luminor (creator only)
 *
 * Uses Node.js runtime (cookie-based Supabase auth requires next/headers).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLuminor, saveLuminor, deleteLuminor, incrementUsage, rowToSpec } from '@/lib/luminors/luminor-service';
import { createClient } from '@/lib/supabase/server';
import type { LuminorSpec } from '@/lib/luminors/luminor-spec';

// ---------------------------------------------------------------------------
// GET — Fetch a single Luminor
// ---------------------------------------------------------------------------

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const row = await getLuminor(id);

    if (!row) {
      return NextResponse.json({ error: 'Luminor not found' }, { status: 404 });
    }

    // Fire-and-forget: increment usage when fetched (e.g., "Use in Chat")
    incrementUsage(id).catch(() => { /* non-critical */ });

    return NextResponse.json(row);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch luminor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH — Update a Luminor (creator only)
// ---------------------------------------------------------------------------

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Authenticate via cookie session
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id ?? null;
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify the luminor exists and belongs to the user
    const existing = await getLuminor(id);
    if (!existing) {
      return NextResponse.json({ error: 'Luminor not found' }, { status: 404 });
    }
    if (existing.creator_id !== userId) {
      return NextResponse.json({ error: 'You can only edit your own Luminors' }, { status: 403 });
    }

    const updates = await req.json();

    // Merge existing row into a LuminorSpec, apply updates, then save
    const existingSpec = rowToSpec(existing);
    const merged: LuminorSpec = {
      ...existingSpec,
      ...pickDefinedFields(updates),
      id, // never change the ID
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveLuminor(merged, userId);

    return NextResponse.json({ data: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update luminor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE — Delete a Luminor (creator only)
// ---------------------------------------------------------------------------

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id ?? null;
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify ownership before deleting
    const existing = await getLuminor(id);
    if (!existing) {
      return NextResponse.json({ error: 'Luminor not found' }, { status: 404 });
    }
    if (existing.creator_id !== userId) {
      return NextResponse.json({ error: 'You can only delete your own Luminors' }, { status: 403 });
    }

    await deleteLuminor(id, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete luminor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Pick only fields that are explicitly provided (not undefined) and map snake_case to camelCase */
function pickDefinedFields(updates: Record<string, unknown>): Partial<LuminorSpec> {
  const map: Record<string, string> = {
    name: 'name',
    title: 'title',
    tagline: 'tagline',
    origin: 'origin',
    domain: 'domain',
    voice: 'voice',
    personality: 'personality',
    element: 'element',
    wisdom: 'wisdom',
    systemPrompt: 'systemPrompt',
    system_prompt: 'systemPrompt',
    preferredModel: 'preferredModel',
    preferred_model: 'preferredModel',
    temperature: 'temperature',
    knowledge: 'knowledge',
    starters: 'starters',
    tools: 'tools',
    tags: 'tags',
    gateAlignment: 'gateAlignment',
    gate_alignment: 'gateAlignment',
    avatar: 'avatar',
    color: 'color',
    gradient: 'gradient',
    companionId: 'companionId',
    companion_id: 'companionId',
    published: 'published',
    tier: 'tier',
    exportFormats: 'exportFormats',
    export_formats: 'exportFormats',
  };

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined && map[key]) {
      result[map[key]] = value;
    }
  }

  return result as Partial<LuminorSpec>;
}
