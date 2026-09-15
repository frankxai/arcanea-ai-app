/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';
import type { Metadata } from 'next';
import * as yaml from 'js-yaml';
import { PublishClient } from './publish-client';
import { getBookRoot } from '@/lib/content/book-path';

export const dynamic = 'force-dynamic';

const BOOK_ROOT = getBookRoot();

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

interface PageProps {
  params: Promise<{ bookSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { bookSlug } = await params;
  return {
    title: `Publishing House — ${bookSlug} — Author Studio`,
    description: `Export and compilation center for ${bookSlug}`,
  };
}

export default async function PublishPage({ params }: PageProps) {
  const { bookSlug } = await params;
  const bookDir = join(BOOK_ROOT, bookSlug);
  const chaptersDir = join(bookDir, 'chapters');

  let bookTitle = bookSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const yamlPath = join(bookDir, 'book.yaml');
  if (await exists(yamlPath)) {
    try {
      const raw = await readFile(yamlPath, 'utf-8');
      const data = yaml.load(raw) as any;
      if (data?.title) bookTitle = data.title;
    } catch {
      // fallback
    }
  }

  let files: string[] = [];
  if (await exists(chaptersDir)) {
    files = (await readdir(chaptersDir))
      .filter((f) => f.endsWith('.md') && f !== 'CLAUDE.md')
      .sort();
  }

  const wordCounts = await Promise.all(
    files.map(async (f) => {
      const raw = await readFile(join(chaptersDir, f), 'utf-8');
      return raw.split(/\s+/).filter(Boolean).length;
    }),
  );
  const totalWords = wordCounts.reduce((sum, w) => sum + w, 0);
  const firstChapterSlug = files[0]?.replace(/\.md$/, '') || '01-chapter';

  return (
    <PublishClient
      bookSlug={bookSlug}
      bookTitle={bookTitle}
      totalWords={totalWords}
      chapterCount={files.length}
      firstChapterSlug={firstChapterSlug}
    />
  );
}
