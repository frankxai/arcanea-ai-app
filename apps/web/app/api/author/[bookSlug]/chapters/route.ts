import { readdir, readFile, writeFile, access } from 'fs/promises';
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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookSlug: string }> }
) {
  const { bookSlug } = await params;
  const chaptersDir = join(BOOK_ROOT, bookSlug, 'chapters');

  if (!(await exists(chaptersDir))) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const { title } = (await req.json()) as { title?: string };
  const chapterTitle = title?.trim() || 'New Chapter';

  // Find next chapter number from existing files
  const files = await readdir(chaptersDir);
  const mdFiles = files.filter((f) => f.endsWith('.md') && f !== 'CLAUDE.md').sort();
  const nextNum = mdFiles.length + 1;
  const paddedNum = String(nextNum).padStart(2, '0');

  // Generate slug from title
  const titleSlug = chapterTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const filename = `${paddedNum}-${titleSlug || 'chapter'}.md`;

  const content = `# ${chapterTitle}\n\nBegin writing...\n`;
  await writeFile(join(chaptersDir, filename), content, 'utf-8');

  return NextResponse.json({
    success: true,
    slug: filename.replace(/\.md$/, ''),
    filename,
    number: nextNum,
  });
}
