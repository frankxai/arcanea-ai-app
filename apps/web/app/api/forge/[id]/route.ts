/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createSessionClient } from '@/lib/supabase/server';

function getForgeSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey);
}

// Identity comes from the session cookie, never from the request body or query.
async function getSessionUserId(): Promise<string | null> {
  try {
    const session = await createSessionClient();
    const { data: { user } } = await session.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

// GET /api/forge/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getForgeSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Forge backend not configured' }, { status: 503 });
    }
    const { id } = await params;
    const { data, error } = await supabase.from('custom_agents').select('*').eq('id', id).single();
    if (error || !data) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    return NextResponse.json({ agent: data });
  } catch (error) {
    console.error('[forge [id] GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/forge/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getForgeSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Forge backend not configured' }, { status: 503 });
    }
    const { id } = await params;
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { userId: _ignoredClientUserId, ...updates } = body;

    const { data: existing } = await supabase.from('custom_agents').select('creator_id').eq('id', id).single();
    if (!existing || existing.creator_id !== userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const allowed = ['name', 'description', 'avatar_emoji', 'system_prompt', 'personality_tags', 'base_luminor_id', 'preferred_tools', 'category', 'visibility'];
    const safe: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const k of allowed) if (k in updates) safe[k] = updates[k];

    const { data, error } = await supabase.from('custom_agents').update(safe).eq('id', id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ agent: data });
  } catch (error) {
    console.error('[forge [id] PATCH] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/forge/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getForgeSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Forge backend not configured' }, { status: 503 });
    }
    const { id } = await params;
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: deleted, error } = await supabase.from('custom_agents').delete().eq('id', id).eq('creator_id', userId).select('id');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!deleted || deleted.length === 0) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('[forge [id] DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
