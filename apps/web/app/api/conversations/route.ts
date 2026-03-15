/**
 * Conversations API Route
 *
 * GET  /api/conversations?limit=&offset=&luminorId=
 *   List conversations for the authenticated user.
 *
 * POST /api/conversations
 *   Body: { messages, sessionId?, luminorId?, modelId?, title? }
 *   Save a conversation (create new or update existing).
 *
 * Requires authentication -- returns 401 for anonymous users.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  listConversations,
  saveConversation,
  type ConversationMessage,
} from '@/lib/services/conversation-service';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

async function getAuthUserId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// GET -- list conversations
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json(
      { data: null, error: 'Authentication required' },
      { status: 401 }
    );
  }

  const params = req.nextUrl.searchParams;
  const limit = Number(params.get('limit') || 20);
  const offset = Number(params.get('offset') || 0);
  const luminorId = params.get('luminorId') ?? undefined;

  try {
    const result = await listConversations(userId, { limit, offset, luminorId });

    return NextResponse.json(
      { data: result.conversations, total: result.total, error: null },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error('[conversations GET]', err);
    return NextResponse.json(
      { data: null, error: 'Failed to list conversations' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST -- save conversation
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json(
      { data: null, error: 'Authentication required' },
      { status: 401 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { data: null, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const validMessages: ConversationMessage[] = messages
    .filter(
      (m: unknown): m is { role: string; content: string } =>
        typeof m === 'object' &&
        m !== null &&
        typeof (m as Record<string, unknown>).role === 'string' &&
        typeof (m as Record<string, unknown>).content === 'string'
    )
    .map((m) => ({
      id: typeof (m as Record<string, unknown>).id === 'string'
        ? (m as Record<string, string>).id
        : undefined,
      role: m.role as ConversationMessage['role'],
      content: m.content,
      modelId: typeof (m as Record<string, unknown>).modelId === 'string'
        ? (m as Record<string, string>).modelId
        : undefined,
      timestamp:
        typeof (m as Record<string, unknown>).timestamp === 'string'
          ? (m as Record<string, string>).timestamp
          : new Date().toISOString(),
    }));

  if (validMessages.length === 0) {
    return NextResponse.json(
      { data: null, error: 'At least one valid message is required' },
      { status: 400 }
    );
  }

  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : undefined;
  const luminorId = typeof body.luminorId === 'string' ? body.luminorId : undefined;
  const modelId = typeof body.modelId === 'string' ? body.modelId : undefined;
  const title = typeof body.title === 'string' ? body.title : undefined;

  try {
    const conversation = await saveConversation(userId, validMessages, {
      sessionId,
      luminorId,
      modelId,
      title,
    });

    return NextResponse.json(
      { data: conversation, error: null },
      { status: sessionId ? 200 : 201 }
    );
  } catch (err) {
    console.error('[conversations POST]', err);
    return NextResponse.json(
      { data: null, error: 'Failed to save conversation' },
      { status: 500 }
    );
  }
}
