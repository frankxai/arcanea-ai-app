/**
 * GET /api/chat/traces — list the current user's recent swarm traces.
 *
 * Query params:
 *   limit  (default 20, max 100)
 *   cursor (created_at ISO string — used for infinite scroll)
 *   mode   (solo | swarm)
 *
 * Uses RLS — users never see another user's traces.
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') ?? '20'), 1), 100);
  const cursor = url.searchParams.get('cursor');
  const mode = url.searchParams.get('mode');

  const client = await resolveClient(req);
  if (!client) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (client as any)
    .from('chat_traces')
    .select(
      'id, mode, planner_source, plan_luminors, total_ms, total_tokens, input, synthesis, created_at',
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }
  if (mode === 'solo' || mode === 'swarm') {
    query = query.eq('mode', mode);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type Row = {
    id: string;
    mode: string;
    planner_source: string;
    plan_luminors: Array<{ id: string; name: string }>;
    total_ms: number | null;
    total_tokens: number | null;
    input: string;
    synthesis: string | null;
    created_at: string;
  };

  const rows = (data ?? []) as Row[];
  const traces = rows.map((r) => ({
    id: r.id,
    mode: r.mode,
    planner_source: r.planner_source,
    luminor_count: r.plan_luminors?.length ?? 0,
    luminor_names: (r.plan_luminors ?? []).map((l) => l.name),
    total_ms: r.total_ms,
    total_tokens: r.total_tokens,
    input_preview: (r.input ?? '').slice(0, 200),
    synthesis_preview: (r.synthesis ?? '').slice(0, 200),
    created_at: r.created_at,
  }));

  const nextCursor =
    rows.length === limit ? rows[rows.length - 1].created_at : null;

  return NextResponse.json({ traces, nextCursor });
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
    // raw JWT — use as-is
  }

  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
}
