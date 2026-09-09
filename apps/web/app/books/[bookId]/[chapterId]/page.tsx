/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import matter from 'gray-matter';
import { ChapterReader } from '@/components/saga/chapter-reader';
import { CinematicPaywall } from '@/components/books/cinematic-paywall';
import { getBookRoot } from '@/lib/content/book-path';
import { countChapterWords, isChapterMarkdown } from '@/lib/saga/chapter-files';
import {
  CINEMATIC_BOOK_DESCRIPTION,
  CINEMATIC_BOOK_ID,
  CINEMATIC_BOOK_TITLE,
  getCinematicChapter,
  isCinematicEditionReleased,
} from '@/lib/books/cinematic-edition';
import {
  getCinematicBookAccess,
  isCinematicCheckoutConfigured,
} from '@/lib/books/polar-access';
import { canReadCinematicChapter } from '@/lib/books/cinematic-access-contract';
const BOOK_ROOT = getBookRoot();

export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------------ */
/*  Book metadata                                                      */
/* ------------------------------------------------------------------ */

const BOOK_META: Record<string, { title: string; dir: string }> = {
  book1: {
    title: 'The Three Academies',
    dir: join(BOOK_ROOT, 'chapters', 'book1'),
  },
  book2: {
    title: 'The Gate-Touched',
    dir: join(BOOK_ROOT, 'chronicles-of-arcanea', 'book-02-the-gate-touched'),
  },
  book3: {
    title: 'The Dragon War',
    dir: join(BOOK_ROOT, 'chronicles-of-arcanea', 'book-03-the-dragon-war'),
  },
  'chronicles-book1': {
    title: 'The Three Academies',
    dir: join(BOOK_ROOT, 'chronicles-of-arcanea', 'book-01-the-three-academies'),
  },
  'chronicles-book2': {
    title: 'The Gate-Touched',
    dir: join(BOOK_ROOT, 'chronicles-of-arcanea', 'book-02-the-gate-touched'),
  },
  starbound: {
    title: 'Starbound: Crew Velathos',
    dir: join(BOOK_ROOT, 'starbound', 'book-01-crew-velathos'),
  },
  dragonborne: {
    title: 'Dragonborne: The Last Clutch',
    dir: join(BOOK_ROOT, 'dragonborne', 'book-01-the-last-clutch'),
  },
  'gate-touched': {
    title: 'Gate-Touched Files',
    dir: join(BOOK_ROOT, 'gate-touched-files'),
  },
  'void-ascending': {
    title: 'Void Ascending: The Other Side',
    dir: join(BOOK_ROOT, 'void-ascending', 'book-01-the-other-side'),
  },
  'dungeon-scrolls': {
    title: 'The Dungeon Scrolls: The Hollow Root',
    dir: join(BOOK_ROOT, 'dungeon-scrolls', '01-the-hollow-root'),
  },
  companions: {
    title: 'Companions of Arcanea',
    dir: join(BOOK_ROOT, 'companions'),
  },
  'luminor-falling': {
    title: 'Luminor Falling',
    dir: join(BOOK_ROOT, 'chronicles-of-arcanea', 'sagas', 'luminor-falling'),
  },
  'luminor-rising-thalmaris': {
    title: "The Sinking of Thal'Maris",
    dir: join(BOOK_ROOT, 'luminor-rising', 'the-sinking-of-thalmaris'),
  },
  'luminor-rising-bonding': {
    title: 'The First Bonding',
    dir: join(BOOK_ROOT, 'luminor-rising', 'the-first-bonding'),
  },
  'luminor-rising-aiyami': {
    title: 'Aiyami Ascending',
    dir: join(BOOK_ROOT, 'luminor-rising', 'aiyami-ascending'),
  },
  'luminor-rising-nero': {
    title: 'The Night Nero Wept',
    dir: join(BOOK_ROOT, 'luminor-rising', 'the-night-nero-wept'),
  },
  'forge-of-ruin': {
    title: 'The Forge of Ruin',
    dir: join(BOOK_ROOT, 'forge-of-ruin', 'chapters'),
  },
  'tides-of-silence': {
    title: 'The Tides of Silence',
    dir: join(BOOK_ROOT, 'tides-of-silence', 'chapters'),
  },
  'heart-of-pyrathis': {
    title: 'The Heart of Pyrathis',
    dir: join(BOOK_ROOT, 'heart-of-pyrathis', 'chapters'),
  },
  'song-of-van-linh': {
    title: 'The Girl Who Heard the River',
    dir: join(BOOK_ROOT, 'song-of-van-linh', 'chapters'),
  },
  'las-tierras-de-luz': {
    title: 'Las Tierras de Luz',
    dir: join(BOOK_ROOT, 'las-tierras-de-luz', 'chapters'),
  },
  'das-maedchen-drei-sprachen': {
    title: 'Das Mädchen, das drei Sprachen hörte',
    dir: join(BOOK_ROOT, 'das-maedchen-drei-sprachen', 'chapters'),
  },
  'lumara-valle-de-los-destellos': {
    title: 'Lumara: Valle de los Destellos',
    dir: join(BOOK_ROOT, 'lumara-valle-de-los-destellos', 'chapters'),
  },
  'russian-from-tashkent': {
    title: 'The Russian-Speaker',
    dir: join(BOOK_ROOT, 'russian-from-tashkent', 'chapters'),
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
      .filter(isChapterMarkdown)
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
  // Most specific: ## Chapter / Kapitel / Capítulo with explicit prefix (multilingual)
  const h2WithPrefix = content.match(/^##\s+(?:Chapter\s+\w+:\s+|Kapitel\s+\d+:\s+|Capítulo\s+\d+:\s+)(.+)$/m);
  if (h2WithPrefix) return h2WithPrefix[1].trim();

  // Next: # Chapter X: pattern (single-hash chapter heading)
  const h1Chapter = content.match(/^#\s+Chapter\s+\w+:\s+(.+)$/m);
  if (h1Chapter) return h1Chapter[1].trim();

  // Next: any ## heading (chapter section header without explicit prefix)
  const h2 = content.match(/^##\s+(.+)$/m);
  if (h2) return h2[1].trim();

  // Fallback: # heading (often the book title, weakest signal)
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();

  // Final fallback: humanize the slug
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
  const { data: fm, content: body } = matter(raw);
  const title = (fm.title as string)?.trim() || extractTitle(body, match.id);
  const words = countChapterWords(raw);
  const readTime = Math.max(1, Math.ceil(words / 250));

  const idx = chapters.indexOf(match);
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  let prevNav: { id: string; title: string } | null = null;
  let nextNav: { id: string; title: string } | null = null;

  if (prev) {
    const prevRaw = await readFile(join(bookMeta.dir, prev.filename), 'utf-8');
    const { data: prevFm, content: prevBody } = matter(prevRaw);
    prevNav = { id: prev.id, title: (prevFm.title as string)?.trim() || extractTitle(prevBody, prev.id) };
  }
  if (next) {
    const nextRaw = await readFile(join(bookMeta.dir, next.filename), 'utf-8');
    const { data: nextFm, content: nextBody } = matter(nextRaw);
    nextNav = { id: next.id, title: (nextFm.title as string)?.trim() || extractTitle(nextBody, next.id) };
  }

  return {
    bookTitle: bookMeta.title,
    chapterNumber: match.number,
    totalChapters: chapters.length,
    title,
    content: body,
    wordCount: words,
    readTime,
    prev: prevNav,
    next: nextNav,
  };
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

interface PageProps {
  params: Promise<{ bookId: string; chapterId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { bookId, chapterId } = await params;

  if (bookId === CINEMATIC_BOOK_ID) {
    const chapter = await getCinematicChapter(chapterId, false);
    if (!chapter) return { title: 'Chapter Not Found' };
    const released = isCinematicEditionReleased();

    return {
      title: `${chapter.title} — ${CINEMATIC_BOOK_TITLE}`,
      description: chapter.access === 'free'
        ? `Read Chapter ${chapter.number}, “${chapter.title},” from ${CINEMATIC_BOOK_TITLE}.`
        : CINEMATIC_BOOK_DESCRIPTION,
      robots: released && chapter.access === 'free'
        ? { index: true, follow: true }
        : { index: false, follow: false, nocache: true },
      alternates: {
        canonical: `/books/${CINEMATIC_BOOK_ID}/${chapter.id}`,
      },
    };
  }

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

  if (bookId === 'book1' || bookId === 'chronicles-book1') {
    redirect(`/books/${CINEMATIC_BOOK_ID}`);
  }

  if (bookId === CINEMATIC_BOOK_ID) {
    const summary = await getCinematicChapter(chapterId, false);
    if (!summary) notFound();

    if (summary.access === 'paid') {
      const access = await getCinematicBookAccess();
      if (!canReadCinematicChapter(summary.access, access.status)) {
        return (
          <CinematicPaywall
            chapterNumber={summary.number}
            chapterTitle={summary.title}
            chapterId={summary.id}
            access={access}
            checkoutConfigured={await isCinematicCheckoutConfigured()}
          />
        );
      }
    }

    const chapter = await getCinematicChapter(chapterId, true);
    if (!chapter) notFound();

    return (
      <ChapterReader
        bookId={bookId}
        bookTitle={CINEMATIC_BOOK_TITLE}
        chapterNumber={chapter.number}
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
