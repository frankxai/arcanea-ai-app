/**
 * Single Conversation API Route
 *
 * GET    /api/conversations/[id]
 *   Get a single conversation with all messages.
 *
 * DELETE /api/conversations/[id]
 *   Delete a conversation and all its messages.
 *
 * Requires authentication -- returns 401 for anonymous users.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getConversation,
  deleteConversation,
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
// GET -- single conversation
// ---------------------------------------------------------------------------

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json(
      { data: null, error: 'Authentication required' },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const conversation = await getConversation(id, userId);
    return NextResponse.json(
      { data: conversation, error: null },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Not found';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json(
      { data: null, error: message },
      { status }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE -- remove conversation
// ---------------------------------------------------------------------------

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json(
      { data: null, error: 'Authentication required' },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    await deleteConversation(id, userId);
    return NextResponse.json({ data: { deleted: true }, error: null });
  } catch (err) {
    console.error('[conversations DELETE]', err);
    return NextResponse.json(
      { data: null, error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}
