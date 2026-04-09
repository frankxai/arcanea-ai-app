import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import type { Metadata } from 'next';
import matter from 'gray-matter';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Drafts — Books in Progress',
  description: 'Read books as they are forged. Live drafts from the Arcanea Open Library.',
  openGraph: {
    title: 'Drafts — Arcanea Open Library',
    description: 'Books being written in the open. Read the first chapters as they land.',
  },
};

/* ------------------------------------------------------------------ */
/*  Data loading                                                       */
/* ------------------------------------------------------------------ */

const BOOK_ROOT = join(process.cwd(), '..', '..', 'book');

interface DraftBook {
  slug: string;
  title: string;
  description: string;
  authors: { name: string; role: string }[];
  tags: string[];
  status: string;
  chapterCount: number;
  wordCount: number;
  readTime: number;
  coverImage: string | null;
  accentColor: string;
}

const ACCENT_MAP: Record<string, string> = {
  'forge-of-ruin': 'red',
  'tides-of-silence': 'cyan',
  'heart-of-pyrathis': 'amber',
};

const COVER_MAP: Record<string, string> = {
  'forge-of-ruin': '/images/books/forge-of-ruin-cover-nb2.png',
  'tides-of-silence': '/images/books/tides-of-silence-cover.png',
  'heart-of-pyrathis': '/images/books/heart-of-pyrathis-cover.png',
};

async function exists(path: string): Promise<boolean> {
  try { await access(path); return true; } catch { return false; }
}

async function loadDraftBooks(): Promise<DraftBook[]> {
  const books: DraftBook[] = [];

  try {
    const entries = await readdir(BOOK_ROOT, { withFileTypes: true });
    const bookDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();

    for (const dir of bookDirs) {
      const yamlPath = join(BOOK_ROOT, dir, 'book.yaml');
      if (!(await exists(yamlPath))) continue;

      const raw = await readFile(yamlPath, 'utf-8');
      const { data: manifest } = matter(`---\n${raw}\n---`);

      // Count chapters
      const chaptersDir = join(BOOK_ROOT, dir, 'chapters');
      let chapterCount = 0;
      let totalWords = 0;

      if (await exists(chaptersDir)) {
        const files = await readdir(chaptersDir);
        const mdFiles = files.filter((f) => f.endsWith('.md'));
        chapterCount = mdFiles.length;

        for (const f of mdFiles) {
          const content = await readFile(join(chaptersDir, f), 'utf-8');
          totalWords += content.split(/\s+/).filter(Boolean).length;
        }
      }

      const authors = (manifest.authors as { name: string; role: string }[]) || [];

      books.push({
        slug: (manifest.slug as string) || dir,
        title: (manifest.title as string) || dir,
        description: (manifest.acknowledgments as string)?.split('\n')[0] || '',
        authors,
        tags: (manifest.tags as string[]) || [],
        status: (manifest.status as string) || 'draft',
        chapterCount,
        wordCount: totalWords,
        readTime: Math.max(1, Math.ceil(totalWords / 250)),
        coverImage: COVER_MAP[dir] || null,
        accentColor: ACCENT_MAP[dir] || 'white',
      });
    }
  } catch { /* silent */ }

  return books;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function DraftsHubPage() {
  const books = await loadDraftBooks();
  const totalWords = books.reduce((sum, b) => sum + b.wordCount, 0);
  const totalChapters = books.reduce((sum, b) => sum + b.chapterCount, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00bcd4]/[0.04] via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#00bcd4]/[0.03] blur-[120px]" />

        <div className="relative max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
          <Link
            href="/books"
            className="inline-block text-xs text-white/30 hover:text-white/50 transition-colors mb-8"
          >
            &larr; All Books
          </Link>

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#00bcd4]/60 mb-4">
            Arcanea Open Library
          </p>

          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white/95 mb-4">
            Drafts
          </h1>

          <p className="text-lg text-white/40 max-w-xl mx-auto mb-8 leading-relaxed">
            Books being written in the open. Read the first chapters as they land.
            Every draft includes full AI transparency.
          </p>

          <div className="flex items-center justify-center gap-6 text-xs text-white/25">
            <span>{books.length} {books.length === 1 ? 'book' : 'books'}</span>
            <span className="w-px h-3 bg-white/10" />
            <span>{totalChapters} chapters</span>
            <span className="w-px h-3 bg-white/10" />
            <span>{totalWords.toLocaleString()} words</span>
          </div>
        </div>
      </section>

      {/* Book Cards */}
      <section className="max-w-3xl mx-auto px-6 pb-32">
        <div className="space-y-6">
          {books.map((book) => (
            <Link
              key={book.slug}
              href={`/books/drafts/${book.slug}`}
              className={`group block rounded-2xl bg-white/[0.02] border border-${book.accentColor}-500/10 hover:border-${book.accentColor}-500/25 hover:bg-white/[0.03] transition-all overflow-hidden`}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Cover */}
                {book.coverImage && (
                  <div className="sm:w-48 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={book.coverImage}
                      alt={`${book.title} cover`}
                      className="w-full h-48 sm:h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className={`text-[10px] uppercase tracking-widest text-${book.accentColor}-400/60 mb-1`}>
                        {book.status === 'in-progress' ? 'Writing in Progress' : book.status}
                      </p>
                      <h2 className="text-xl sm:text-2xl font-display font-bold text-white/90 group-hover:text-white transition-colors">
                        {book.title}
                      </h2>
                    </div>
                    <span className="flex-shrink-0 text-white/10 group-hover:text-white/30 transition-colors text-lg mt-1">
                      &rarr;
                    </span>
                  </div>

                  {/* Authors */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {book.authors.map((a) => (
                      <span
                        key={a.name}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40"
                      >
                        {a.name} &middot; {a.role}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/40 leading-relaxed mb-4 line-clamp-2">
                    {book.description}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/20">
                    <span>{book.chapterCount} chapters</span>
                    <span>{book.wordCount.toLocaleString()} words</span>
                    <span>{book.readTime} min read</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {book.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className={`text-[9px] px-1.5 py-0.5 rounded bg-${book.accentColor}-500/[0.06] text-${book.accentColor}-400/40`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {books.length === 0 && (
            <div className="text-center py-16 text-white/20 text-sm">
              No drafts yet. Start writing with <code className="text-[#00bcd4]/40">/arcanea-author</code>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
