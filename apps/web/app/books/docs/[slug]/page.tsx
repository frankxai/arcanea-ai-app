/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { readFile } from 'fs/promises';
import { join } from 'path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SagaDocReader, type TocHeading } from '@/components/saga/doc-reader';
import { getBookRoot } from '@/lib/content/book-path';

export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------------ */
/*  Document registry                                                  */
/* ------------------------------------------------------------------ */

interface DocDef {
  title: string;
  category: string;
  file: string;
}

const BOOK_ROOT = getBookRoot();

const DOCS: Record<string, DocDef> = {
  'world-atlas': {
    title: 'World Atlas',
    category: 'The World',
    file: join(BOOK_ROOT, 'worldbuilding', 'world-atlas.md'),
  },
  'deep-lore': {
    title: 'Deep Lore: Godbeasts & Dungeons',
    category: 'The World',
    file: join(BOOK_ROOT, 'worldbuilding', 'deep-lore.md'),
  },
  'companion-bestiary': {
    title: 'Companion Bestiary',
    category: 'The World',
    file: join(BOOK_ROOT, 'worldbuilding', 'companion-bestiary.md'),
  },
  'cast-bible': {
    title: 'Cast of Characters',
    category: 'Characters',
    file: join(BOOK_ROOT, 'characters', 'cast-bible.md'),
  },
  'the-marked': {
    title: 'The Marked',
    category: 'Characters',
    file: join(BOOK_ROOT, 'characters', 'the-marked.md'),
  },
  'founding-myths': {
    title: 'Founding Myths',
    category: 'Legends',
    file: join(BOOK_ROOT, 'legends-of-arcanea', 'founding-myths.md'),
  },
  'series-bible': {
    title: 'Series Bible',
    category: 'Reference',
    file: join(BOOK_ROOT, 'series-bible.md'),
  },
  'student-guide': {
    title: 'Academy Handbook',
    category: 'Academy',
    file: join(BOOK_ROOT, 'academy-handbook', 'student-guide.md'),
  },
};

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) return { title: 'Document Not Found' };

  return {
    title: `${doc.title} -- The Arcanea Saga`,
    description: `Read ${doc.title} from the Arcanea universe. ${doc.category} reference document.`,
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) notFound();

  let content: string;
  try {
    content = await readFile(doc.file, 'utf-8');
  } catch {
    notFound();
  }

  const words = content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 250));

  // Extract headings for table of contents
  const headings: TocHeading[] = (content.match(/^#{2,3}\s+.+$/gm) || []).map((h) => ({
    level: h.startsWith('###') ? (3 as const) : (2 as const),
    text: h.replace(/^#{2,3}\s+/, ''),
    id: h
      .replace(/^#{2,3}\s+/, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-'),
  }));

  return (
    <SagaDocReader
      title={doc.title}
      category={doc.category}
      content={content}
      wordCount={words}
      readTime={readTime}
      headings={headings}
    />
  );
}
