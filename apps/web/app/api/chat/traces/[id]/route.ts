/**
 * GET /api/chat/traces/:id — load a persisted swarm trace for replay.
 * DELETE /api/chat/traces/:id — user can delete their own traces.
 *
 * RLS enforces ownership — service role access is not exposed from this route.
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id || typeof id !== 'string' || id.length > 64) {
    return NextResponse.json({ error: 'Invalid trace id' }, { status: 400 });
  }

  const client = await resolveClient(req);
  if (!client) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (client as any)
    .from('chat_traces')
    .select(
      'id, mode, planner_source, plan_ms, total_ms, total_tokens, input, plan_luminors, rationale, contributions, synthesis, error, created_at',
    )
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Trace not found' }, { status: 404 });
  }
  return NextResponse.json({ trace: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Invalid trace id' }, { status: 400 });

  const client = await resolveClient(req);
  if (!client) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (client as any).from('chat_traces').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

async function resolveClient(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const cookieHeader = req.headers.get('cookie') ?? '';
  const accessToken = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('sb-') && c.includes('-auth-token'))
    ?.split('=')
    .slice(1)
    .join('=');

  if (!accessToken) return null;

  let jwt = accessToken;
  try {
    const decoded = JSON.parse(decodeURIComponent(accessToken));
    if (decoded?.access_token) jwt = decoded.access_token;
    else if (Array.isArray(decoded) && decoded[0]?.access_token) jwt = decoded[0].access_token;
  } catch {
    // raw JWT — keep as is
  }

  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
}
