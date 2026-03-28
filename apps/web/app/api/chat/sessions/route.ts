/**
 * Chat Sessions API Route
 *
 * GET  /api/chat/sessions?userId=&luminorId=
 *   Returns all persisted sessions for the authenticated user (optional luminorId filter).
 *   Authenticated users -> Supabase only.
 *
 * POST /api/chat/sessions
 *   Body: { userId, luminorId, title? }
 *   Creates a fresh persisted session. Returns the new session object.
 *   Authenticated users -> Supabase only.
 *
 * Response format: always { data, error }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SessionResponse {
  id: string;
  title: string;
  luminorId: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// GET -- list sessions
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const requestedUserId = params.get('userId');
  const luminorId = params.get('luminorId') ?? undefined;

  if (!requestedUserId) {
    return NextResponse.json(
      { data: null, error: 'Missing required query parameter: userId' },
      { status: 400 }
    );
  }

  const authUserId = await getAuthenticatedUserId();

  if (!authUserId) {
    return NextResponse.json(
      { data: null, error: 'Authentication required for persisted sessions' },
      { status: 401 }
    );
  }

  try {
    const supabase = await createClient();

    let query = supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', authUserId)
      .order('updated_at', { ascending: false });

    if (luminorId) {
      query = query.eq('luminor_id', luminorId);
    }

    const { data: sessions, error: fetchError } = await query;

    if (fetchError) {
      console.error('[chat/sessions GET] Supabase error:', fetchError);
      return NextResponse.json(
        { data: null, error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }

    const sessionIds = (sessions ?? []).map((s) => s.id);
    const countMap = new Map<string, number>();

    if (sessionIds.length > 0) {
      const { data: counts } = await (supabase.rpc as Function)(
        'count_messages_per_session',
        { session_ids: sessionIds }
      ).catch(() => ({ data: null }));

      if (counts && Array.isArray(counts)) {
        for (const row of counts) {
          countMap.set(row.session_id, row.message_count ?? 0);
        }
      }
    }

    const data: SessionResponse[] = (sessions ?? []).map((row) => ({
      id: row.id,
      title: row.title ?? 'New conversation',
      luminorId: row.luminor_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      messageCount: countMap.get(row.id) ?? 0,
    }));

    return NextResponse.json(
      { data, error: null },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error('[chat/sessions GET] Supabase error:', err);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST -- create new session
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { data: null, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const requestedUserId =
    typeof body.userId === 'string' && body.userId ? body.userId : null;
  const luminorId =
    typeof body.luminorId === 'string' && body.luminorId
      ? body.luminorId
      : 'default';
  const title =
    typeof body.title === 'string' && body.title.trim()
      ? body.title.trim()
      : undefined;

  if (!requestedUserId) {
    return NextResponse.json(
      { data: null, error: 'Missing required field: userId' },
      { status: 400 }
    );
  }

  const authUserId = await getAuthenticatedUserId();

  if (!authUserId) {
    return NextResponse.json(
      { data: null, error: 'Authentication required for persisted sessions' },
      { status: 401 }
    );
  }

  try {
    const supabase = await createClient();

    const insertPayload = {
      user_id: authUserId,
      luminor_id: luminorId,
      title: title ? title.slice(0, 120) : 'New conversation',
    };

    const { data: created, error: createError } = await supabase
      .from('chat_sessions')
      .insert(insertPayload)
      .select('*')
      .single();

    if (createError || !created) {
      console.error('[chat/sessions POST] Supabase error:', createError);
      return NextResponse.json(
        { data: null, error: 'Failed to create session' },
        { status: 500 }
      );
    }

    const data: SessionResponse = {
      id: created.id,
      title: created.title ?? title ?? 'New conversation',
      luminorId: created.luminor_id,
      createdAt: created.created_at,
      updatedAt: created.updated_at,
      messageCount: 0,
    };

    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (err) {
    console.error('[chat/sessions POST] Supabase error:', err);
    return NextResponse.json(
      { data: null, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
