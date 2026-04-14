import { readFile, readdir, writeFile, access } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

const BOOK_ROOT = join(process.cwd(), '..', '..', 'book');

async function exists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

function findFile(slug: string, files: string[]): string | null {
  return files.find(f => f.replace(/\.md$/, '') === slug) || null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookSlug: string; chapterSlug: string }> }
) {
  const { bookSlug, chapterSlug } = await params;
  const chaptersDir = join(BOOK_ROOT, bookSlug, 'chapters');

  if (!(await exists(chaptersDir))) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const files = await readdir(chaptersDir);
  const filename = findFile(chapterSlug, files.filter(f => f.endsWith('.md')));

  if (!filename) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }

  const content = await readFile(join(chaptersDir, filename), 'utf-8');
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const titleMatch = content.match(/^#\s+(.+)$/m);

  return NextResponse.json({
    slug: chapterSlug,
    filename,
    title: titleMatch ? titleMatch[1].trim() : chapterSlug,
    content,
    wordCount,
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookSlug: string; chapterSlug: string }> }
) {
  // Reject writes in production — Vercel filesystem is ephemeral, saves don't persist.
  // Users must write locally (pnpm dev) or via Claude Code with /arcanea-author.
  // v2 will introduce Supabase draft storage for persistent online editing.
  if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        error: 'Read-only in production',
        reason: 'Vercel filesystem is ephemeral. Online saves would be lost on next deploy. Use local dev or Claude Code.',
      },
      { status: 423 }, // Locked
    );
  }

  const { bookSlug, chapterSlug } = await params;
  const chaptersDir = join(BOOK_ROOT, bookSlug, 'chapters');

  if (!(await exists(chaptersDir))) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const body = await req.json();
  const { content } = body;

  if (typeof content !== 'string') {
    return NextResponse.json({ error: 'content must be a string' }, { status: 400 });
  }

  const files = await readdir(chaptersDir);
  const filename = findFile(chapterSlug, files.filter(f => f.endsWith('.md')));

  if (!filename) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }

  await writeFile(join(chaptersDir, filename), content, 'utf-8');
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return NextResponse.json({ success: true, wordCount });
}
