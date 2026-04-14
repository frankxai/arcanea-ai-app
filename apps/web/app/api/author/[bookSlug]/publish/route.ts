/**
 * Author Studio v3 — Publish to Git
 *
 * POST /api/author/[bookSlug]/publish
 *   Commits all Supabase drafts for this book (owned by the authenticated
 *   user) back to git via the GitHub Contents API. On success, the
 *   committed drafts are removed from Supabase and Vercel rebuilds pick
 *   up the new content automatically.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { createClient } from '@/lib/supabase/server';

const GITHUB_OWNER = process.env.GITHUB_OWNER || 'frankxai';
const GITHUB_REPO = process.env.GITHUB_REPO || 'arcanea-ai-app';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

interface PublishResult {
  chapter: string;
  sha?: string;
  error?: string;
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ bookSlug: string }> },
) {
  const { bookSlug } = await params;

  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'Publishing not configured. Set GITHUB_TOKEN env var.' },
      { status: 503 },
    );
  }

  const supabase = (await createClient()) as DB;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Verify user is an author of this book
  const { data: bookRow } = await supabase
    .from('books')
    .select('id')
    .eq('slug', bookSlug)
    .maybeSingle();

  if (!bookRow) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const { data: authorRow } = await supabase
    .from('book_authors')
    .select('role')
    .eq('book_id', bookRow.id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!authorRow) {
    return NextResponse.json({ error: 'Not an author of this book' }, { status: 403 });
  }

  // Load all drafts for this book for this user
  const { data: drafts } = await supabase
    .from('book_chapter_drafts')
    .select('chapter_slug, content, word_count')
    .eq('book_slug', bookSlug)
    .eq('author_user_id', user.id);

  const draftRows = (drafts ?? []) as Array<{
    chapter_slug: string;
    content: string;
    word_count: number;
  }>;

  if (draftRows.length === 0) {
    return NextResponse.json({ error: 'No drafts to publish' }, { status: 400 });
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const results: PublishResult[] = [];

  for (const draft of draftRows) {
    const path = `book/${bookSlug}/chapters/${draft.chapter_slug}.md`;

    // Get current file SHA (required for updates; undefined for new files)
    let sha: string | undefined;
    try {
      const { data: existing } = await octokit.rest.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path,
        ref: GITHUB_BRANCH,
      });
      if (!Array.isArray(existing) && 'sha' in existing) {
        sha = existing.sha;
      }
    } catch {
      // File doesn't exist — new chapter, leave sha undefined
    }

    try {
      const result = await octokit.rest.repos.createOrUpdateFileContents({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path,
        message: `publish(${bookSlug}): update ${draft.chapter_slug} (${draft.word_count} words)`,
        content: Buffer.from(draft.content, 'utf-8').toString('base64'),
        branch: GITHUB_BRANCH,
        sha,
      });

      results.push({ chapter: draft.chapter_slug, sha: result.data.commit.sha });
    } catch (e: unknown) {
      const error = e instanceof Error ? e.message : 'Unknown error';
      results.push({ chapter: draft.chapter_slug, error });
    }
  }

  // Delete successfully published drafts
  const publishedChapters = results.filter(r => r.sha).map(r => r.chapter);
  if (publishedChapters.length > 0) {
    await supabase
      .from('book_chapter_drafts')
      .delete()
      .eq('book_slug', bookSlug)
      .eq('author_user_id', user.id)
      .in('chapter_slug', publishedChapters);
  }

  return NextResponse.json({
    success: true,
    published: publishedChapters.length,
    failed: results.filter(r => r.error).length,
    results,
    deployUrl: `https://arcanea.ai/books/drafts/${bookSlug}`,
  });
}
