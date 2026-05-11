/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BookChapterContent } from './chapter-content';
import grayMatter from 'gray-matter';

export const dynamic = 'force-dynamic';

const BOOK_DIR = join(
  process.cwd(),
  '..',
  '..',
  'book',
  'living-lore',
  'book-01-the-foundation',
);

interface ChapterFile {
  filename: string;
  slug: string;
}

function parseFrontmatter(source: string) {
  return grayMatter(source);
}

async function getChapterFiles(): Promise<ChapterFile[]> {
  const files = await readdir(BOOK_DIR);
  return files
    .filter((f) => f.endsWith('.md') && f !== '00-front-matter.md')
    .sort()
    .map((filename) => ({
      filename,
      slug: filename.replace(/\.md$/, '').replace(/^\d+-/, ''),
    }));
}

async function loadChapter(slug: string) {
  const chapterFiles = await getChapterFiles();
  const match = chapterFiles.find((cf) => cf.slug === slug);
  if (!match) return null;

  const raw = await readFile(join(BOOK_DIR, match.filename), 'utf-8');
  const { data, content } = parseFrontmatter(raw);
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 230));

  const idx = chapterFiles.indexOf(match);
  const prev = idx > 0 ? chapterFiles[idx - 1] : null;
  const next = idx < chapterFiles.length - 1 ? chapterFiles[idx + 1] : null;

  // Load prev/next titles
  let prevTitle: string | null = null;
  let nextTitle: string | null = null;

  if (prev) {
    const prevRaw = await readFile(join(BOOK_DIR, prev.filename), 'utf-8');
    const prevData = parseFrontmatter(prevRaw).data;
    prevTitle = prevData.title || prev.slug;
  }
  if (next) {
    const nextRaw = await readFile(join(BOOK_DIR, next.filename), 'utf-8');
    const nextData = parseFrontmatter(nextRaw).data;
    nextTitle = nextData.title || next.slug;
  }

  return {
    title: (data.title as string) || slug,
    chapter: data.chapter as number | string | undefined,
    content,
    wordCount: words,
    readingTime,
    prev: prev ? { slug: prev.slug, title: prevTitle! } : null,
    next: next ? { slug: next.slug, title: nextTitle! } : null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = await loadChapter(slug);
  if (!chapter) return { title: 'Chapter Not Found' };

  return {
    title: `${chapter.title} — The Foundation`,
    description: `Read ${chapter.title} from The Living Lore Volume 1. ${chapter.wordCount.toLocaleString()} words, ${chapter.readingTime} min read.`,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: slug } = await params;
  const chapter = await loadChapter(slug);
  if (!chapter) notFound();

  return (
    <BookChapterContent
      title={chapter.title}
      content={chapter.content}
      wordCount={chapter.wordCount}
      readingTime={chapter.readingTime}
      prev={chapter.prev}
      next={chapter.next}
    />
  );
}
