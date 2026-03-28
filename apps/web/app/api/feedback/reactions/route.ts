import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// The message_reactions table is not yet in the generated Supabase types.
// We use a typed helper to access the table safely at runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UntypedClient = any;

/**
 * POST /api/feedback/reactions
 *
 * Upsert a thumbs-up / thumbs-down reaction on an AI message.
 * Works for authenticated users (unique per user+message).
 * Anonymous reactions are inserted without uniqueness constraint.
 */
export async function POST(req: NextRequest) {
  try {
    const { messageId, sessionId, reaction } = (await req.json()) as {
      messageId?: string;
      sessionId?: string;
      reaction?: string;
    };

    if (!messageId || !['up', 'down'].includes(reaction ?? '')) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const supabase = (await createClient()) as UntypedClient;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Authenticated: upsert so one reaction per user per message
      const { error } = await supabase.from('message_reactions').upsert(
        {
          user_id: user.id,
          message_id: messageId,
          session_id: sessionId || null,
          reaction,
        },
        { onConflict: 'user_id,message_id' },
      );

      if (error) {
        console.warn('[Reactions] Upsert failed:', error.message);
        return NextResponse.json({ error: 'Failed to save reaction' }, { status: 500 });
      }
    } else {
      // Anonymous: simple insert (no uniqueness enforcement)
      const { error } = await supabase.from('message_reactions').insert({
        message_id: messageId,
        session_id: sessionId || null,
        reaction,
      });

      if (error) {
        console.warn('[Reactions] Anonymous insert failed:', error.message);
        return NextResponse.json({ error: 'Failed to save reaction' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save reaction' }, { status: 500 });
  }
}

/**
 * DELETE /api/feedback/reactions?messageId=xxx
 *
 * Remove the current user's reaction on a message.
 * Only works for authenticated users.
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json({ error: 'messageId required' }, { status: 400 });
    }

    const supabase = (await createClient()) as UntypedClient;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', user.id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete reaction' }, { status: 500 });
  }
}
