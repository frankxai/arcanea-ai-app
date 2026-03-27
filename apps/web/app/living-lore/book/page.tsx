import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';

const BOOK_DIR = join(
  process.cwd(),
  '..',
  '..',
  'book',
  'living-lore',
  'book-01-the-foundation',
);

interface ChapterInfo {
  slug: string;
  title: string;
  chapter: number | string;
  wordCount: number;
  readingTime: number;
  filename: string;
}

async function getChapters(): Promise<ChapterInfo[]> {
  const grayMatter = require('gray-matter') as typeof import('gray-matter');
  const files = await readdir(BOOK_DIR);
  const mdFiles = files
    .filter((f) => f.endsWith('.md') && f !== '00-front-matter.md')
    .sort();

  const chapters: ChapterInfo[] = [];

  for (const file of mdFiles) {
    const raw = await readFile(join(BOOK_DIR, file), 'utf-8');
    const { data, content } = grayMatter(raw);
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(words / 230));

    // Build slug from filename: "01-chapter-one-the-academy-smelled-of-sage.md" -> "chapter-one-the-academy-smelled-of-sage"
    const slug = file
      .replace(/\.md$/, '')
      .replace(/^\d+-/, '');

    chapters.push({
      slug,
      title: data.title || slug,
      chapter: data.chapter ?? slug,
      wordCount: words,
      readingTime,
      filename: file,
    });
  }

  return chapters;
}

async function getBookMeta() {
  const grayMatter = require('gray-matter') as typeof import('gray-matter');
  const raw = await readFile(
    join(BOOK_DIR, '00-front-matter.md'),
    'utf-8',
  );
  const { data } = grayMatter(raw);
  return {
    title: (data.title as string) || 'The Foundation',
    series: (data.series as string) || 'The Living Lore',
    volume: (data.volume as number) || 1,
    author: (data.author as string) || 'FrankX & The Arcanea Intelligence',
    tagline:
      (data.tagline as string) ||
      'Seven strangers. One broken Gate. A journey that will change everything.',
  };
}

function ChapterIcon({ chapter }: { chapter: number | string }) {
  if (typeof chapter === 'number') {
    return (
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-atlantean-teal-aqua/10 text-atlantean-teal-aqua text-sm font-semibold shrink-0">
        {chapter}
      </span>
    );
  }
  // Interlude / appendix
  return (
    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold shrink-0 uppercase">
      {String(chapter).slice(0, 3)}
    </span>
  );
}

export default async function BookPage() {
  const [meta, chapters] = await Promise.all([getBookMeta(), getChapters()]);
  const totalWords = chapters.reduce((sum, c) => sum + c.wordCount, 0);
  const totalTime = chapters.reduce((sum, c) => sum + c.readingTime, 0);

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
        <Link href="/living-lore" className="hover:text-text-primary transition-colors">
          Living Lore
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-text-primary">Book</span>
      </nav>

      {/* Book Cover Card */}
      <section className="liquid-glass-elevated rounded-2xl p-8 md:p-12 relative overflow-hidden mb-12">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(127,255,212,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle,rgba(147,112,219,0.05)_0%,transparent_70%)] blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted mb-4">
            {meta.series} &mdash; Volume {meta.volume}
          </p>

          <h1 className="font-cinzel text-3xl md:text-5xl text-gradient-cosmic mb-4">
            {meta.title}
          </h1>

          <p className="text-sm text-text-muted mb-2">{meta.author}</p>

          <p className="text-text-muted text-sm italic max-w-md mx-auto mb-8">
            &ldquo;{meta.tagline}&rdquo;
          </p>

          <div className="flex items-center justify-center gap-6 text-xs text-text-muted mb-8">
            <span>{chapters.length} chapters</span>
            <span className="text-white/20">|</span>
            <span>{totalWords.toLocaleString()} words</span>
            <span className="text-white/20">|</span>
            <span>{totalTime} min read</span>
          </div>

          {chapters.length > 0 && (
            <Link
              href={`/living-lore/book/${chapters[0].slug}`}
              className="inline-flex items-center gap-2 liquid-glass-elevated rounded-xl px-6 py-3 text-sm font-semibold text-atlantean-teal-aqua hover:brightness-110 transition-all duration-200 glow-soft"
            >
              Begin Reading
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          )}
        </div>
      </section>

      {/* Chapter List */}
      <section>
        <h2 className="font-cinzel text-xl text-text-primary mb-6">
          Chapters
        </h2>

        <div className="space-y-3">
          {chapters.map((ch) => (
            <Link
              key={ch.slug}
              href={`/living-lore/book/${ch.slug}`}
              className="group block liquid-glass rounded-xl p-5 hover:border-atlantean-teal-aqua/20 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <ChapterIcon chapter={ch.chapter} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-atlantean-teal-aqua transition-colors truncate">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    {ch.wordCount.toLocaleString()} words &middot;{' '}
                    {ch.readingTime} min read
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-text-muted group-hover:text-atlantean-teal-aqua group-hover:translate-x-0.5 transition-all shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Back link */}
      <div className="mt-12 text-center">
        <Link
          href="/living-lore"
          className="text-sm text-text-muted hover:text-atlantean-teal-aqua transition-colors"
        >
          &larr; Back to Living Lore
        </Link>
      </div>
    </main>
  );
}
