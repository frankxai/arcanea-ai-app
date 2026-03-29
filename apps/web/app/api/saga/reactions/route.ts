/**
 * Saga Chapter Reactions API
 *
 * GET  /api/saga/reactions?bookId=x&chapter=y — Get reaction counts + user's own reactions
 * POST /api/saga/reactions — Toggle a reaction (heart/bookmark)
 *
 * Counts are public (no auth required for GET).
 * Toggling requires auth.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// chapter_reactions / chapter_reaction_counts not yet in generated types
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

const toggleSchema = z.object({
  bookId: z.string().min(1).max(50),
  chapterSlug: z.string().min(1).max(200),
  type: z.enum(['heart', 'bookmark']),
});

// ── GET ────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');
    const chapter = searchParams.get('chapter');

    if (!bookId || !chapter) {
      return jsonErr('INVALID_INPUT', 'bookId and chapter query parameters are required', 400);
    }

    const supabase = (await createClient()) as UntypedClient;

    // Fetch aggregated counts from the view (public — no auth needed)
    const { data: counts, error: countsError } = await supabase
      .from('chapter_reaction_counts')
      .select('reaction_type, count')
      .eq('book_id', bookId)
      .eq('chapter_slug', chapter);

    if (countsError) {
      console.error('[saga/reactions GET] counts error:', countsError.message);
      return jsonErr('DATABASE_ERROR', 'Failed to load reactions', 500);
    }

    // Build counts map: { heart: N, bookmark: N }
    const reactionCounts: Record<string, number> = {};
    for (const row of counts || []) {
      reactionCounts[row.reaction_type] = Number(row.count);
    }

    // If user is logged in, include which reactions are theirs
    let userReactions: string[] = [];
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: userRows } = await supabase
        .from('chapter_reactions')
        .select('reaction_type')
        .eq('book_id', bookId)
        .eq('chapter_slug', chapter)
        .eq('user_id', user.id);

      userReactions = (userRows || []).map((r: { reaction_type: string }) => r.reaction_type);
    }

    return jsonOk({ counts: reactionCounts, userReactions });
  } catch (error) {
    console.error('[saga/reactions GET] Error:', error);
    return jsonErr('INTERNAL_ERROR', 'Failed to load reactions', 500);
  }
}

// ── POST (toggle) ─────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const supabase = (await createClient()) as UntypedClient;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return jsonErr('UNAUTHORIZED', 'Sign in to react', 401);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonErr('INVALID_INPUT', 'Invalid JSON body', 400);
    }

    const validation = toggleSchema.safeParse(body);
    if (!validation.success) {
      return jsonErr('VALIDATION_ERROR', 'bookId, chapterSlug, and type (heart|bookmark) required', 400);
    }

    const { bookId, chapterSlug, type } = validation.data;

    // Check if reaction already exists (toggle behavior)
    const { data: existing } = await supabase
      .from('chapter_reactions')
      .select('id')
      .eq('user_id', user.id)
      .eq('book_id', bookId)
      .eq('chapter_slug', chapterSlug)
      .eq('reaction_type', type)
      .maybeSingle();

    if (existing) {
      // Remove existing reaction (un-react)
      const { error } = await supabase
        .from('chapter_reactions')
        .delete()
        .eq('id', existing.id)
        .eq('user_id', user.id);

      if (error) {
        console.error('[saga/reactions POST] delete error:', error.message);
        return jsonErr('DATABASE_ERROR', 'Failed to remove reaction', 500);
      }

      return jsonOk({ action: 'removed', type });
    }

    // Create new reaction
    const { error } = await supabase
      .from('chapter_reactions')
      .insert({
        user_id: user.id,
        book_id: bookId,
        chapter_slug: chapterSlug,
        reaction_type: type,
      });

    if (error) {
      console.error('[saga/reactions POST] insert error:', error.message);
      return jsonErr('DATABASE_ERROR', 'Failed to save reaction', 500);
    }

    return jsonOk({ action: 'added', type }, 201);
  } catch (error) {
    console.error('[saga/reactions POST] Error:', error);
    return jsonErr('INTERNAL_ERROR', 'Failed to save reaction', 500);
  }
}
