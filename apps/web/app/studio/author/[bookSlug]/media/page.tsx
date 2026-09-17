/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';
import type { Metadata } from 'next';
import * as yaml from 'js-yaml';
import { MediaClient } from './media-client';
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
    title: `Visual & Media Studio — ${bookSlug} — Author Studio`,
    description: `Multi-modal image, character sheets, and cover art generator for ${bookSlug}`,
  };
}

export default async function MediaPage({ params }: PageProps) {
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

  let firstChapterSlug = '01-chapter';
  if (await exists(chaptersDir)) {
    const files = (await readdir(chaptersDir))
      .filter((f) => f.endsWith('.md') && f !== 'CLAUDE.md')
      .sort();
    if (files[0]) firstChapterSlug = files[0].replace(/\.md$/, '');
  }

  return (
    <MediaClient
      bookSlug={bookSlug}
      bookTitle={bookTitle}
      firstChapterSlug={firstChapterSlug}
    />
  );
}
