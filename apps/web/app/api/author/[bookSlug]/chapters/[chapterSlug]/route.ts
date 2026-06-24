/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Author Studio v3 — Chapter read/write with Supabase draft storage
 *
 * GET  — Returns the freshest content. If an authenticated user has a draft
 *        newer than the git file mtime, returns the draft. Otherwise returns
 *        the published git content. Unauthenticated users always get git.
 *
 * POST — Requires auth. Verifies authorship via book_authors (when the book
 *        is registered in Supabase). UPSERTs the draft — never writes to the
 *        filesystem (Vercel is ephemeral).
 */

import { readFile, readdir, access, stat } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getBookRoot } from '@/lib/content/book-path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

const BOOK_ROOT = getBookRoot();

async function exists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

function findFile(slug: string, files: string[]): string | null {
  return files.find(f => f.replace(/\.md$/, '') === slug) || null;
}

function countWords(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

function extractTitle(content: string, fallback: string): string {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : fallback;
}

/**
 * Resolve the Supabase book row (if the book has been registered in
 * Open Library). Returns null when the slug only exists in git.
 */
async function resolveBook(supabase: DB, slug: string): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('books')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) return null;
  return data as { id: string };
}

async function readGitChapter(
  bookSlug: string,
  chapterSlug: string,
): Promise<{ filename: string; content: string; mtime: Date } | null> {
  const chaptersDir = join(BOOK_ROOT, bookSlug, 'chapters');
  if (!(await exists(chaptersDir))) return null;

  const files = await readdir(chaptersDir);
  const filename = findFile(chapterSlug, files.filter(f => f.endsWith('.md')));
  if (!filename) return null;

  const fullPath = join(chaptersDir, filename);
  const [content, st] = await Promise.all([
    readFile(fullPath, 'utf-8'),
    stat(fullPath),
  ]);
  return { filename, content, mtime: st.mtime };
}

// ---------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookSlug: string; chapterSlug: string }> },
) {
  const { bookSlug, chapterSlug } = await params;

  const git = await readGitChapter(bookSlug, chapterSlug);

  // Attempt to read an authenticated user's draft.
  type DraftRow = {
    content: string;
    word_count: number;
    updated_at: string;
  };
  let draft: DraftRow | null = null;

  try {
    const supabase = (await createClient()) as DB;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('book_chapter_drafts')
        .select('content, word_count, updated_at')
        .eq('book_slug', bookSlug)
        .eq('chapter_slug', chapterSlug)
        .eq('author_user_id', user.id)
        .maybeSingle();
      if (data) {
        draft = data as DraftRow;
      }
    }
  } catch (err) {
    // Supabase unavailable — fall back to git-only
    console.error('[chapter GET] supabase draft lookup failed:', err);
  }

  // Case 1: draft-only chapter (no git file)
  if (!git && draft) {
    return NextResponse.json({
      slug: chapterSlug,
      filename: `${chapterSlug}.md`,
      title: extractTitle(draft.content, chapterSlug),
      content: draft.content,
      wordCount: draft.word_count,
      source: 'draft',
      draftUpdatedAt: draft.updated_at,
    });
  }

  if (!git) {
    return draft
      ? NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
      : NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }

  // Case 2: draft newer than git mtime — return draft
  if (draft && new Date(draft.updated_at).getTime() > git.mtime.getTime()) {
    return NextResponse.json({
      slug: chapterSlug,
      filename: git.filename,
      title: extractTitle(draft.content, chapterSlug),
      content: draft.content,
      wordCount: draft.word_count,
      source: 'draft',
      draftUpdatedAt: draft.updated_at,
    });
  }

  // Case 3: git is source of truth (no draft, or draft is stale)
  return NextResponse.json({
    slug: chapterSlug,
    filename: git.filename,
    title: extractTitle(git.content, chapterSlug),
    content: git.content,
    wordCount: countWords(git.content),
    source: 'published',
    draftUpdatedAt: draft?.updated_at ?? null,
  });
}

// ---------------------------------------------------------------------
// POST — write to Supabase draft (never filesystem)
// ---------------------------------------------------------------------
export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookSlug: string; chapterSlug: string }> },
) {
  const { bookSlug, chapterSlug } = await params;

  let body: { content?: unknown; contentJson?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body.content !== 'string') {
    return NextResponse.json(
      { error: 'content must be a string' },
      { status: 400 },
    );
  }
  const content = body.content;
  const contentJson =
    body.contentJson && typeof body.contentJson === 'object'
      ? body.contentJson
      : null;

  try {
    const supabase = (await createClient()) as DB;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Verify authorship when the book is registered in Supabase.
    // Git-only books (not yet in Open Library) fall through — any authenticated
    // user can draft. This matches current expected workflow where books
    // live in git first and get registered later.
    const book = await resolveBook(supabase, bookSlug);
    if (book) {
      const { data: authorship } = await supabase
        .from('book_authors')
        .select('role')
        .eq('book_id', book.id)
        .eq('user_id', user.id)
        .maybeSingle();
      if (!authorship) {
        return NextResponse.json(
          { error: 'You are not an author of this book' },
          { status: 403 },
        );
      }
    }

    const word_count = countWords(content);

    const { error: upsertError } = await supabase
      .from('book_chapter_drafts')
      .upsert(
        {
          book_slug: bookSlug,
          chapter_slug: chapterSlug,
          author_user_id: user.id,
          content,
          content_json: contentJson,
          word_count,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'book_slug,chapter_slug,author_user_id' },
      );

    if (upsertError) {
      console.error('[chapter POST] upsert failed:', upsertError);
      return NextResponse.json(
        { error: 'Failed to save draft' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      wordCount: word_count,
      source: 'draft',
    });
  } catch (err) {
    console.error('[chapter POST] error:', err);
    return NextResponse.json(
      { error: 'Draft service temporarily unavailable' },
      { status: 503 },
    );
  }
}
