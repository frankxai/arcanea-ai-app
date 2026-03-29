/**
 * Saga Notes API
 *
 * GET  /api/saga/notes?bookId=book1&chapter=01-the-storm — list notes for a chapter
 * POST /api/saga/notes — create a note (requires auth)
 * DELETE /api/saga/notes?id=<uuid> — delete a note (requires auth, owner only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// chapter_notes table exists at runtime but isn't in generated Supabase types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UntypedClient = any;

// ── Helpers ────────────────────────────────────────

function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(
    { success: true, data, meta: { timestamp: new Date().toISOString() } },
    { status },
  );
}

function jsonErr(code: string, message: string, status: number) {
  return NextResponse.json(
    { success: false, error: { code, message }, meta: { timestamp: new Date().toISOString() } },
    { status },
  );
}

// ── Schemas ────────────────────────────────────────

const createNoteSchema = z.object({
  bookId: z.string().min(1).max(50),
  chapterSlug: z.string().min(1).max(200),
  content: z.string().min(1).max(2000),
  selectedText: z.string().max(500).optional(),
  positionHint: z.string().max(200).optional(),
});

// ── GET ────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const supabase = (await createClient()) as UntypedClient;
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');
    const chapter = searchParams.get('chapter');

    if (!bookId || !chapter) {
      return jsonErr('INVALID_INPUT', 'bookId and chapter query parameters are required', 400);
    }

    // Auth check — notes are user-scoped
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return jsonErr('UNAUTHORIZED', 'Sign in to view your notes', 401);
    }

    const { data, error } = await supabase
      .from('chapter_notes')
      .select('*')
      .eq('user_id', user.id)
      .eq('book_id', bookId)
      .eq('chapter_slug', chapter)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[saga/notes GET] Supabase error:', error);
      return jsonErr('DATABASE_ERROR', 'Failed to fetch notes', 500);
    }

    const notes = (data ?? []).map(mapNote);
    return jsonOk({ notes });
  } catch (error) {
    console.error('[saga/notes GET] Error:', error);
    return jsonErr('INTERNAL_ERROR', 'Failed to fetch notes', 500);
  }
}

// ── POST ───────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const supabase = (await createClient()) as UntypedClient;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return jsonErr('UNAUTHORIZED', 'Sign in to create notes', 401);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonErr('INVALID_INPUT', 'Invalid JSON body', 400);
    }

    const validation = createNoteSchema.safeParse(body);
    if (!validation.success) {
      return jsonErr('VALIDATION_ERROR', 'Invalid input', 400);
    }

    const { bookId, chapterSlug, content, selectedText, positionHint } = validation.data;

    const { data, error } = await supabase
      .from('chapter_notes')
      .insert({
        user_id: user.id,
        book_id: bookId,
        chapter_slug: chapterSlug,
        content,
        selected_text: selectedText ?? null,
        position_hint: positionHint ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error('[saga/notes POST] Supabase error:', error);
      return jsonErr('DATABASE_ERROR', 'Failed to create note', 500);
    }

    return jsonOk({ note: mapNote(data) }, 201);
  } catch (error) {
    console.error('[saga/notes POST] Error:', error);
    return jsonErr('INTERNAL_ERROR', 'Failed to create note', 500);
  }
}

// ── DELETE ─────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  try {
    const supabase = (await createClient()) as UntypedClient;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return jsonErr('UNAUTHORIZED', 'Sign in to delete notes', 401);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return jsonErr('INVALID_INPUT', 'id query parameter is required', 400);
    }

    // RLS ensures only the owner can delete, but we also filter explicitly
    const { error } = await supabase
      .from('chapter_notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('[saga/notes DELETE] Supabase error:', error);
      return jsonErr('DATABASE_ERROR', 'Failed to delete note', 500);
    }

    return jsonOk({ deleted: true });
  } catch (error) {
    console.error('[saga/notes DELETE] Error:', error);
    return jsonErr('INTERNAL_ERROR', 'Failed to delete note', 500);
  }
}

// ── Mapper ─────────────────────────────────────────

function mapNote(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    bookId: row.book_id as string,
    chapterSlug: row.chapter_slug as string,
    content: row.content as string,
    selectedText: (row.selected_text as string | null) ?? undefined,
    positionHint: (row.position_hint as string | null) ?? undefined,
    createdAt: row.created_at as string,
  };
}
