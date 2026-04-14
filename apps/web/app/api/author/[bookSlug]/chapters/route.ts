import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

const BOOK_ROOT = join(process.cwd(), '..', '..', 'book');

async function exists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookSlug: string }> }
) {
  const { bookSlug } = await params;
  const chaptersDir = join(BOOK_ROOT, bookSlug, 'chapters');

  if (!(await exists(chaptersDir))) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const files = await readdir(chaptersDir);
  const mdFiles = files.filter(f => f.endsWith('.md')).sort();

  const chapters = await Promise.all(mdFiles.map(async (filename, idx) => {
    const raw = await readFile(join(chaptersDir, filename), 'utf-8');
    const wordCount = raw.split(/\s+/).filter(Boolean).length;
    const titleMatch = raw.match(/^#\s+(.+)$/m);
    const title = titleMatch
      ? titleMatch[1].trim()
      : filename.replace(/\.md$/, '').replace(/^\d+-/, '').replace(/-/g, ' ');

    return {
      slug: filename.replace(/\.md$/, ''),
      filename,
      title,
      wordCount,
      readTime: Math.max(1, Math.ceil(wordCount / 250)),
      order: idx,
    };
  }));

  return NextResponse.json({ chapters });
}
