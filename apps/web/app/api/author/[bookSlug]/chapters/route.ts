/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Author Studio v3 — Chapter list
 *
 * GET  — Union of git chapters + draft-only chapters for the authenticated user.
 * POST — Creates a new chapter. In production, it creates a draft-only row in
 *        Supabase (no filesystem write). Locally it writes to git.
 */

import { readdir, readFile, writeFile, access } from 'fs/promises';
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

function countWords(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

function extractTitle(content: string, fallback: string): string {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : fallback;
}

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

interface ChapterListItem {
  slug: string;
  filename: string;
  title: string;
  wordCount: number;
  readTime: number;
  order: number;
  source: 'draft' | 'published';
  draftUpdatedAt?: string | null;
}

// ---------------------------------------------------------------------
// GET — list chapters (git ∪ draft-only)
// ---------------------------------------------------------------------
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookSlug: string }> },
) {
  const { bookSlug } = await params;
  const chaptersDir = join(BOOK_ROOT, bookSlug, 'chapters');
  const gitExists = await exists(chaptersDir);

  // Collect git chapters (if directory exists)
  const gitSlugs = new Set<string>();
  const gitChapters: ChapterListItem[] = [];

  if (gitExists) {
    const files = await readdir(chaptersDir);
    const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'CLAUDE.md').sort();
    await Promise.all(
      mdFiles.map(async (filename, idx) => {
        const raw = await readFile(join(chaptersDir, filename), 'utf-8');
        const wordCount = countWords(raw);
        const slug = filename.replace(/\.md$/, '');
        const title = extractTitle(raw, slug.replace(/^\d+-/, '').replace(/-/g, ' '));
        gitSlugs.add(slug);
        gitChapters.push({
          slug,
          filename,
          title,
          wordCount,
          readTime: Math.max(1, Math.ceil(wordCount / 250)),
          order: idx,
          source: 'published',
        });
      }),
    );
  }

  // Try to union with draft-only chapters for authenticated user
  const draftOnly: ChapterListItem[] = [];
  try {
    const supabase = (await createClient()) as DB;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: drafts } = await supabase
        .from('book_chapter_drafts')
        .select('chapter_slug, content, word_count, updated_at')
        .eq('book_slug', bookSlug)
        .eq('author_user_id', user.id);

      const rows = (drafts ?? []) as Array<{
        chapter_slug: string;
        content: string;
        word_count: number;
        updated_at: string;
      }>;

      for (const r of rows) {
        if (gitSlugs.has(r.chapter_slug)) {
          // Annotate the git chapter with draft info so the UI can badge it
          const existing = gitChapters.find(c => c.slug === r.chapter_slug);
          if (existing) {
            existing.draftUpdatedAt = r.updated_at;
          }
          continue;
        }
        draftOnly.push({
          slug: r.chapter_slug,
          filename: `${r.chapter_slug}.md`,
          title: extractTitle(r.content, r.chapter_slug.replace(/^\d+-/, '').replace(/-/g, ' ')),
          wordCount: r.word_count,
          readTime: Math.max(1, Math.ceil(r.word_count / 250)),
          order: gitChapters.length + draftOnly.length,
          source: 'draft',
          draftUpdatedAt: r.updated_at,
        });
      }
    }
  } catch (err) {
    console.error('[chapters GET] draft union failed:', err);
  }

  if (!gitExists && draftOnly.length === 0) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  // Sort draft-only by slug to keep order stable
  draftOnly.sort((a, b) => a.slug.localeCompare(b.slug));
  const chapters = [...gitChapters, ...draftOnly].map((c, idx) => ({ ...c, order: idx }));

  return NextResponse.json({ chapters });
}

// ---------------------------------------------------------------------
// POST — create a new chapter
//   Local dev: writes to git
//   Production: creates a placeholder draft row in Supabase (auth required)
// ---------------------------------------------------------------------
export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookSlug: string }> },
) {
  const { bookSlug } = await params;
  const chaptersDir = join(BOOK_ROOT, bookSlug, 'chapters');
  const isProd = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

  const { title } = (await req.json().catch(() => ({}))) as { title?: string };
  const chapterTitle = title?.trim() || 'New Chapter';

  // -----------------------------------------------------------------
  // Local dev path: keep filesystem creation behaviour
  // -----------------------------------------------------------------
  if (!isProd) {
    if (!(await exists(chaptersDir))) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const files = await readdir(chaptersDir);
    const mdFiles = files.filter((f) => f.endsWith('.md') && f !== 'CLAUDE.md').sort();
    const nextNum = mdFiles.length + 1;
    const paddedNum = String(nextNum).padStart(2, '0');
    const titleSlug = slugifyTitle(chapterTitle);
    const filename = `${paddedNum}-${titleSlug || 'chapter'}.md`;

    const content = `# ${chapterTitle}\n\nBegin writing...\n`;
    await writeFile(join(chaptersDir, filename), content, 'utf-8');

    return NextResponse.json({
      success: true,
      slug: filename.replace(/\.md$/, ''),
      filename,
      number: nextNum,
      source: 'published',
    });
  }

  // -----------------------------------------------------------------
  // Production path: create a draft-only chapter in Supabase
  // -----------------------------------------------------------------
  try {
    const supabase = (await createClient()) as DB;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Authorship check when the book exists in Supabase
    const { data: book } = await supabase
      .from('books')
      .select('id')
      .eq('slug', bookSlug)
      .maybeSingle();

    if (book) {
      const { data: authorship } = await supabase
        .from('book_authors')
        .select('role')
        .eq('book_id', (book as { id: string }).id)
        .eq('user_id', user.id)
        .maybeSingle();
      if (!authorship) {
        return NextResponse.json(
          { error: 'You are not an author of this book' },
          { status: 403 },
        );
      }
    }

    // Compute next chapter number from git + existing drafts combined
    const existingSlugs = new Set<string>();
    if (await exists(chaptersDir)) {
      const files = await readdir(chaptersDir);
      for (const f of files) {
        if (f.endsWith('.md') && f !== 'CLAUDE.md') {
          existingSlugs.add(f.replace(/\.md$/, ''));
        }
      }
    }

    const { data: drafts } = await supabase
      .from('book_chapter_drafts')
      .select('chapter_slug')
      .eq('book_slug', bookSlug)
      .eq('author_user_id', user.id);
    for (const d of (drafts ?? []) as Array<{ chapter_slug: string }>) {
      existingSlugs.add(d.chapter_slug);
    }

    const nextNum = existingSlugs.size + 1;
    const paddedNum = String(nextNum).padStart(2, '0');
    const titleSlug = slugifyTitle(chapterTitle);
    const slug = `${paddedNum}-${titleSlug || 'chapter'}`;
    const filename = `${slug}.md`;
    const content = `# ${chapterTitle}\n\nBegin writing...\n`;

    const { error: insertError } = await supabase
      .from('book_chapter_drafts')
      .upsert(
        {
          book_slug: bookSlug,
          chapter_slug: slug,
          author_user_id: user.id,
          content,
          word_count: countWords(content),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'book_slug,chapter_slug,author_user_id' },
      );

    if (insertError) {
      console.error('[chapters POST] insert failed:', insertError);
      return NextResponse.json(
        { error: 'Failed to create chapter draft' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      slug,
      filename,
      number: nextNum,
      source: 'draft',
    });
  } catch (err) {
    console.error('[chapters POST] error:', err);
    return NextResponse.json(
      { error: 'Draft service temporarily unavailable' },
      { status: 503 },
    );
  }
}
