import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ChapterReader } from '@/components/saga/chapter-reader';

/* ------------------------------------------------------------------ */
/*  Book metadata                                                      */
/* ------------------------------------------------------------------ */

const BOOK_META: Record<string, { title: string; dir: string }> = {
  book1: {
    title: 'The Five-Fold Fire',
    dir: join(process.cwd(), '..', '..', 'book', 'chapters', 'book1'),
  },
  book2: {
    title: 'The Drowned Archive',
    dir: join(process.cwd(), '..', '..', 'book', 'chapters', 'book2'),
  },
};

/* ------------------------------------------------------------------ */
/*  Data loading                                                       */
/* ------------------------------------------------------------------ */

interface ChapterFile {
  filename: string;
  id: string;
  number: number;
}

async function getChapterFiles(bookDir: string): Promise<ChapterFile[]> {
  try {
    const files = await readdir(bookDir);
    return files
      .filter((f) => f.endsWith('.md') && !f.startsWith('00-'))
      .sort()
      .map((filename, idx) => ({
        filename,
        id: filename.replace(/\.md$/, '').replace(/^\d+-/, ''),
        number: idx + 1,
      }));
  } catch {
    return [];
  }
}

function extractTitle(content: string, fallbackId: string): string {
  // Try "# Chapter One: The Storm That Remembered" pattern
  const chapterHeading = content.match(/^#\s+Chapter\s+\w+:\s+(.+)$/m);
  if (chapterHeading) return chapterHeading[1].trim();

  // Try "# PROLOGUE: BEFORE THE FLOOD" pattern
  const heading = content.match(/^#\s+(.+)$/m);
  if (heading) return heading[1].trim();

  // Fallback: humanize the slug
  return fallbackId
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function loadChapter(bookId: string, chapterId: string) {
  const bookMeta = BOOK_META[bookId];
  if (!bookMeta) return null;

  const chapters = await getChapterFiles(bookMeta.dir);
  const match = chapters.find((ch) => ch.id === chapterId);
  if (!match) return null;

  const raw = await readFile(join(bookMeta.dir, match.filename), 'utf-8');
  const title = extractTitle(raw, match.id);
  const words = raw.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 250));

  const idx = chapters.indexOf(match);
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  // Load adjacent titles
  let prevNav: { id: string; title: string } | null = null;
  let nextNav: { id: string; title: string } | null = null;

  if (prev) {
    const prevRaw = await readFile(join(bookMeta.dir, prev.filename), 'utf-8');
    prevNav = { id: prev.id, title: extractTitle(prevRaw, prev.id) };
  }
  if (next) {
    const nextRaw = await readFile(join(bookMeta.dir, next.filename), 'utf-8');
    nextNav = { id: next.id, title: extractTitle(nextRaw, next.id) };
  }

  return {
    bookTitle: bookMeta.title,
    chapterNumber: match.number,
    totalChapters: chapters.length,
    title,
    content: raw,
    wordCount: words,
    readTime,
    prev: prevNav,
    next: nextNav,
  };
}

/* ------------------------------------------------------------------ */
/*  Static generation                                                  */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  const params: { bookId: string; chapterId: string }[] = [];

  for (const [bookId, meta] of Object.entries(BOOK_META)) {
    const chapters = await getChapterFiles(meta.dir);
    for (const ch of chapters) {
      params.push({ bookId, chapterId: ch.id });
    }
  }

  return params;
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

interface PageProps {
  params: Promise<{ bookId: string; chapterId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { bookId, chapterId } = await params;
  const chapter = await loadChapter(bookId, chapterId);
  if (!chapter) return { title: 'Chapter Not Found' };

  return {
    title: `${chapter.title} -- ${chapter.bookTitle} -- The Arcanea Saga`,
    description: `Read "${chapter.title}" from ${chapter.bookTitle}. ${chapter.wordCount.toLocaleString()} words, ${chapter.readTime} min read. Part of the Arcanea Saga.`,
    openGraph: {
      title: `${chapter.title} -- ${chapter.bookTitle}`,
      description: `Chapter ${chapter.chapterNumber} of ${chapter.totalChapters}. ${chapter.wordCount.toLocaleString()} words.`,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function ChapterPage({ params }: PageProps) {
  const { bookId, chapterId } = await params;
  const chapter = await loadChapter(bookId, chapterId);
  if (!chapter) notFound();

  return (
    <ChapterReader
      bookId={bookId}
      bookTitle={chapter.bookTitle}
      chapterNumber={chapter.chapterNumber}
      totalChapters={chapter.totalChapters}
      title={chapter.title}
      content={chapter.content}
      wordCount={chapter.wordCount}
      readTime={chapter.readTime}
      prev={chapter.prev}
      next={chapter.next}
    />
  );
}
