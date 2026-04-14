/**
 * Author Studio v3 — Draft status for a book
 *
 * GET /api/author/[bookSlug]/drafts
 *   Returns draft count, latest updated_at, and per-chapter metadata for
 *   the authenticated user. Used by the book header to show an
 *   "N unpublished drafts" badge.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

interface DraftSummaryEntry {
  chapterSlug: string;
  wordCount: number;
  updatedAt: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookSlug: string }> },
) {
  const { bookSlug } = await params;

  try {
    const supabase = (await createClient()) as DB;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        count: 0,
        latestUpdatedAt: null,
        chapters: [] as DraftSummaryEntry[],
        authenticated: false,
      });
    }

    const { data, error } = await supabase
      .from('book_chapter_drafts')
      .select('chapter_slug, word_count, updated_at')
      .eq('book_slug', bookSlug)
      .eq('author_user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[drafts GET] query failed:', error);
      return NextResponse.json(
        { error: 'Failed to load drafts' },
        { status: 500 },
      );
    }

    const rows = (data ?? []) as Array<{
      chapter_slug: string;
      word_count: number;
      updated_at: string;
    }>;

    const chapters: DraftSummaryEntry[] = rows.map(r => ({
      chapterSlug: r.chapter_slug,
      wordCount: r.word_count,
      updatedAt: r.updated_at,
    }));

    return NextResponse.json({
      count: chapters.length,
      latestUpdatedAt: chapters[0]?.updatedAt ?? null,
      chapters,
      authenticated: true,
    });
  } catch (err) {
    console.error('[drafts GET] error:', err);
    return NextResponse.json(
      {
        count: 0,
        latestUpdatedAt: null,
        chapters: [] as DraftSummaryEntry[],
        authenticated: false,
        unavailable: true,
      },
      { status: 200 },
    );
  }
}
