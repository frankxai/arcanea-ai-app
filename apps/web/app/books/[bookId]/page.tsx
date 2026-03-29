import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

/* ------------------------------------------------------------------ */
/*  Book registry                                                      */
/* ------------------------------------------------------------------ */

type BookStatus = 'in-progress' | 'outlined' | 'planned';

interface BookDef {
  title: string;
  subtitle: string;
  description: string;
  status: BookStatus;
  dir: string;
}

const BOOKS: Record<string, BookDef> = {
  book1: {
    title: 'The Five-Fold Fire',
    subtitle: 'Book One of the Arcanea Saga',
    description:
      'In the coastal town of Ashenmere, a lighthouse keeper named Kael discovers they can channel all five elements — something no one has done since Malachar, the Dark Lord who fell ten thousand years ago. Recruited to an unprecedented joint session at all three Academies, Kael must navigate rivalries, ancient secrets, and the whisper of a sealed darkness that recognizes them.',
    status: 'in-progress',
    dir: join(process.cwd(), '..', '..', 'book', 'chapters', 'book1'),
  },
  book2: {
    title: 'The Drowned Archive',
    subtitle: 'Book Two of the Arcanea Saga',
    description:
      'The Atlantean Depths hold secrets that predate the Academies. As Kael descends into the crystalline city beneath the ocean, they discover that multi-element channelers have existed throughout history — and that someone deliberately erased the evidence.',
    status: 'outlined',
    dir: join(process.cwd(), '..', '..', 'book', 'chapters', 'book2'),
  },
};

const STATUS_STYLES: Record<BookStatus, { bg: string; text: string; label: string }> = {
  'in-progress': { bg: 'bg-[#00bcd4]/15 border-[#00bcd4]/30', text: 'text-[#00bcd4]', label: 'In Progress' },
  outlined: { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400', label: 'Outlined' },
  planned: { bg: 'bg-white/5 border-white/10', text: 'text-white/40', label: 'Planned' },
};

/* ------------------------------------------------------------------ */
/*  Data loading                                                       */
/* ------------------------------------------------------------------ */

interface ChapterInfo {
  id: string;
  number: number;
  title: string;
  wordCount: number;
  readTime: number;
}

function extractTitle(content: string, fallbackId: string): string {
  const chapterHeading = content.match(/^#\s+Chapter\s+\w+:\s+(.+)$/m);
  if (chapterHeading) return chapterHeading[1].trim();

  const heading = content.match(/^#\s+(.+)$/m);
  if (heading) return heading[1].trim();

  return fallbackId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

async function getChapters(bookDir: string): Promise<ChapterInfo[]> {
  try {
    const files = await readdir(bookDir);
    const mdFiles = files
      .filter((f) => f.endsWith('.md') && !f.startsWith('00-'))
      .sort();

    const chapters: ChapterInfo[] = [];

    for (let i = 0; i < mdFiles.length; i++) {
      const raw = await readFile(join(bookDir, mdFiles[i]), 'utf-8');
      const id = mdFiles[i].replace(/\.md$/, '').replace(/^\d+-/, '');
      const words = raw.split(/\s+/).length;

      chapters.push({
        id,
        number: i + 1,
        title: extractTitle(raw, id),
        wordCount: words,
        readTime: Math.max(1, Math.ceil(words / 250)),
      });
    }

    return chapters;
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

interface PageProps {
  params: Promise<{ bookId: string }>;
}

export async function generateStaticParams() {
  return Object.keys(BOOKS).map((bookId) => ({ bookId }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { bookId } = await params;
  const book = BOOKS[bookId];
  if (!book) return { title: 'Book Not Found' };

  return {
    title: `${book.title} -- The Arcanea Saga`,
    description: book.description,
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function BookOverviewPage({ params }: PageProps) {
  const { bookId } = await params;
  const book = BOOKS[bookId];
  if (!book) notFound();

  const chapters = await getChapters(book.dir);
  const totalWords = chapters.reduce((sum, c) => sum + c.wordCount, 0);
  const totalTime = chapters.reduce((sum, c) => sum + c.readTime, 0);
  const status = STATUS_STYLES[book.status];

  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/3 top-[8%] h-[400px] w-[400px] rounded-full bg-[#00bcd4]/8 blur-[140px]" />
        <div className="absolute right-1/4 top-[40%] h-[300px] w-[300px] rounded-full bg-[#0d47a1]/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-16">
        {/* Back link */}
        <Link
          href="/saga"
          className="mb-12 inline-flex items-center gap-2 text-xs text-white/40 transition-colors hover:text-white/70"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Saga
        </Link>

        {/* Book header */}
        <header className="mb-16">
          <span
            className={`mb-5 inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${status.bg} ${status.text}`}
          >
            {status.label}
          </span>

          <h1 className="font-display text-4xl font-bold tracking-tight text-white/95 md:text-5xl leading-[1.1]">
            {book.title}
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[#00bcd4]/50">
            {book.subtitle}
          </p>

          <p className="mt-6 text-base leading-[1.8] text-white/50">
            {book.description}
          </p>

          <div className="mt-6 flex items-center gap-4 text-xs text-white/30">
            <span>{chapters.length} chapters</span>
            <span className="text-white/10">|</span>
            <span>~{totalWords.toLocaleString()} words</span>
            <span className="text-white/10">|</span>
            <span>{totalTime} min read</span>
          </div>

          {chapters.length > 0 && (
            <Link
              href={`/books/${bookId}/${chapters[0].id}`}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 px-6 py-3 text-sm font-medium text-[#00bcd4] transition-all hover:border-[#00bcd4]/50 hover:bg-[#00bcd4]/20 hover:shadow-[0_0_30px_rgba(0,188,212,0.15)]"
            >
              Start reading Chapter 1
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </header>

        {/* Decorative divider */}
        <div className="mb-10 flex items-center gap-3 text-[#00bcd4]/20" aria-hidden="true">
          <span className="h-px flex-1 bg-current" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#00bcd4]/30">
            Chapters
          </span>
          <span className="h-px flex-1 bg-current" />
        </div>

        {/* Chapter list */}
        {chapters.length > 0 ? (
          <ol className="space-y-1">
            {chapters.map((ch) => (
              <li key={ch.id}>
                <Link
                  href={`/books/${bookId}/${ch.id}`}
                  className="group flex items-center gap-4 rounded-lg border-l-2 border-transparent px-4 py-3.5 transition-all hover:border-[#00bcd4] hover:bg-white/[0.02]"
                >
                  <span className="w-6 shrink-0 text-right font-mono text-xs text-white/20 group-hover:text-[#00bcd4]/60">
                    {ch.number}
                  </span>
                  <span className="flex-1 text-[15px] text-white/70 transition-colors group-hover:text-white/95">
                    {ch.title}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-white/15 group-hover:text-white/30">
                    {(ch.wordCount / 1000).toFixed(1)}K
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="py-12 text-center text-sm text-white/30">
            Chapters coming soon. This book is currently being outlined.
          </p>
        )}

        {/* Back to saga */}
        <div className="mt-12 text-center">
          <Link
            href="/saga"
            className="text-xs text-white/30 transition-colors hover:text-white/60"
          >
            &larr; Back to The Arcanea Saga
          </Link>
        </div>
      </main>
    </div>
  );
}
