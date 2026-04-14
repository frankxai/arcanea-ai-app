import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import { ArrowRight } from '@/lib/phosphor-icons';
import { NewBookDialog } from './components/new-book-dialog';

const BOOK_ROOT = join(process.cwd(), '..', '..', 'book');

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

interface BookInfo {
  slug: string;
  title: string;
  status: string;
  tier: string;
  tags: string[];
  chapterCount: number;
  totalWords: number;
  firstChapterSlug: string | null;
}

async function loadBooks(): Promise<BookInfo[]> {
  const entries = await readdir(BOOK_ROOT, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  const books: BookInfo[] = [];

  await Promise.all(
    dirs.map(async (slug) => {
      const chaptersDir = join(BOOK_ROOT, slug, 'chapters');
      if (!(await exists(chaptersDir))) return;

      // Only include directories that have markdown chapters
      let files: string[];
      try {
        files = (await readdir(chaptersDir))
          .filter((f) => f.endsWith('.md') && f !== 'CLAUDE.md')
          .sort();
      } catch {
        return;
      }
      if (files.length === 0) return;

      // Load manifest if available
      let title = slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      let status = 'draft';
      let tier = 'community';
      let tags: string[] = [];

      const yamlPath = join(BOOK_ROOT, slug, 'book.yaml');
      if (await exists(yamlPath)) {
        try {
          const yaml = await import('js-yaml');
          const raw = await readFile(yamlPath, 'utf-8');
          const data = yaml.load(raw) as Record<string, unknown> | null;
          if (data?.title) title = data.title as string;
          if (data?.status) status = data.status as string;
          if (data?.tier) tier = data.tier as string;
          if (Array.isArray(data?.tags)) tags = data.tags as string[];
        } catch {
          // Use defaults
        }
      }

      // Count words across all chapters
      const wordCounts = await Promise.all(
        files.map(async (f) => {
          const raw = await readFile(join(chaptersDir, f), 'utf-8');
          return raw.split(/\s+/).filter(Boolean).length;
        }),
      );
      const totalWords = wordCounts.reduce((sum, w) => sum + w, 0);

      books.push({
        slug,
        title,
        status,
        tier,
        tags,
        chapterCount: files.length,
        totalWords,
        firstChapterSlug: files[0]?.replace(/\.md$/, '') ?? null,
      });
    }),
  );

  // Sort: featured first, then by word count
  return books.sort((a, b) => {
    if (a.tier === 'featured' && b.tier !== 'featured') return -1;
    if (b.tier === 'featured' && a.tier !== 'featured') return 1;
    return b.totalWords - a.totalWords;
  });
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'in-progress': 'bg-[#00bcd4]/10 text-[#00bcd4] border-[#00bcd4]/20',
    complete: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    draft: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  };
  const cls = colors[status] || colors.draft;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-sans font-medium border ${cls}`}
    >
      {status.replace(/-/g, ' ')}
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  if (tier !== 'featured') return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-sans font-medium bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/20">
      featured
    </span>
  );
}

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#00bcd4] to-[#00bcd4]/60 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default async function AuthorStudioPage() {
  const books = await loadBooks();
  const totalWords = books.reduce((sum, b) => sum + b.totalWords, 0);
  const totalChapters = books.reduce((sum, b) => sum + b.chapterCount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-white/30">
          <Link
            href="/studio"
            className="font-sans text-sm hover:text-white/50 transition-colors"
          >
            Studio
          </Link>
          <ArrowRight size={12} />
          <span className="font-sans text-sm text-white/50">Author</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl">
          <span className="bg-gradient-to-r from-[#00bcd4] via-[#00bcd4]/80 to-[#0d47a1] bg-clip-text text-transparent">
            Author Studio
          </span>
        </h1>
        <p className="font-sans text-white/50 text-lg">
          {totalWords.toLocaleString()} words across {books.length} books &middot;{' '}
          {totalChapters} chapters
        </p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Books',
            value: books.length.toString(),
            accent: 'text-[#00bcd4]',
          },
          {
            label: 'Chapters',
            value: totalChapters.toString(),
            accent: 'text-[#00bcd4]',
          },
          {
            label: 'Total Words',
            value: totalWords.toLocaleString(),
            accent: 'text-[#00bcd4]',
          },
          {
            label: 'Featured',
            value: books.filter((b) => b.tier === 'featured').length.toString(),
            accent: 'text-[#ffd700]',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-5"
          >
            <p className={`font-sans text-2xl font-semibold ${stat.accent}`}>
              {stat.value}
            </p>
            <p className="font-sans text-xs text-white/40 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Book grid */}
      <section className="space-y-4">
        <h2 className="font-display text-sm text-white/60 uppercase tracking-wider">
          Your Books
        </h2>
        <div className="grid gap-4">
          {books.map((book) => {
            // Estimate a rough progress: words per chapter baseline
            const avgWordsPerChapter =
              book.chapterCount > 0
                ? Math.round(book.totalWords / book.chapterCount)
                : 0;
            // Rough completion heuristic: assume ~5000 words/chapter target
            const estimatedCompletion = Math.min(
              100,
              Math.round((avgWordsPerChapter / 5000) * 100),
            );

            return (
              <div
                key={book.slug}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-base text-white truncate">
                      {book.title}
                    </h3>
                    <p className="font-sans text-xs text-white/40 mt-0.5">
                      {book.chapterCount} chapter{book.chapterCount !== 1 ? 's' : ''}{' '}
                      &middot; {book.totalWords.toLocaleString()} words
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <TierBadge tier={book.tier} />
                    <StatusBadge status={book.status} />
                  </div>
                </div>

                {/* Tags */}
                {book.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {book.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-sans text-white/30 bg-white/[0.03] border border-white/[0.04]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Progress bar */}
                <Bar value={estimatedCompletion} max={100} />

                {/* Actions */}
                {book.firstChapterSlug && (
                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/studio/author/${book.slug}/${book.firstChapterSlug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00bcd4]/20 text-[#00bcd4] text-xs font-sans font-medium hover:bg-[#00bcd4]/5 transition-colors"
                    >
                      Continue Writing
                    </Link>
                    <Link
                      href={`/books/drafts/${book.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] text-white/50 text-xs font-sans font-medium hover:bg-white/[0.04] transition-colors"
                    >
                      View Draft
                    </Link>
                  </div>
                )}
              </div>
            );
          })}

          {/* New Book creation card */}
          <NewBookDialog />

          {books.length === 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-10 text-center">
              <p className="font-sans text-white/40">
                No books found in <code className="font-mono text-white/25">book/</code>.
                Use the button above to create your first book.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Writing Workflow */}
      <section className="space-y-4">
        <h2 className="font-display text-sm text-white/60 uppercase tracking-wider">
          Writing Workflow
        </h2>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 sm:p-8">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-[#00bcd4]/10 border border-[#00bcd4]/20 flex items-center justify-center text-xs text-[#00bcd4] font-mono">1</span>
                <h3 className="font-display text-sm text-white/80">Draft in Claude Code</h3>
              </div>
              <p className="font-sans text-xs text-white/35 leading-relaxed">
                Use <code className="text-[#00bcd4]/50 font-mono text-[10px]">/arcanea-author</code> for deep writing — full chapters, world-building, character development with parallel agent swarms.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center text-xs text-[#ffd700] font-mono">2</span>
                <h3 className="font-display text-sm text-white/80">Refine in Author Studio</h3>
              </div>
              <p className="font-sans text-xs text-white/35 leading-relaxed">
                Open any chapter above. Edit with the Notion-style rich editor. AI companion gives feedback that knows your characters and world. Mark content as curated.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs text-emerald-400 font-mono">3</span>
                <h3 className="font-display text-sm text-white/80">Publish to Web</h3>
              </div>
              <p className="font-sans text-xs text-white/35 leading-relaxed">
                Push changes to deploy. Your book goes live at <code className="text-emerald-400/50 font-mono text-[10px]">/books/drafts/[slug]</code> with cover art, Guardian reviews, and reader ratings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid sm:grid-cols-3 gap-4">
        {[
          {
            title: 'AI Companion',
            description: 'Canon-aware chat that reads your characters, world bible, and current chapter. BYOK for Sonnet/Opus.',
            status: 'live',
          },
          {
            title: 'Guardian Review',
            description: 'One-click quality gate: 5 specialized agents score prose, voice, continuity, pacing, and canon alignment.',
            status: 'live',
          },
          {
            title: 'Publishing Pipeline',
            description: 'Export to EPUB, PDF, Kindle. Automatic deployment to arcanea.ai with cover art and reader reviews.',
            status: 'coming-soon',
          },
        ].map((chamber) => (
          <div
            key={chamber.title}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-5 space-y-2"
          >
            <h3 className="font-display text-sm text-white/60 uppercase tracking-wider">
              {chamber.title}
            </h3>
            <p className="font-sans text-xs text-white/30 leading-relaxed">
              {chamber.description}
            </p>
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-sans border ${
              chamber.status === 'live'
                ? 'text-emerald-400/60 bg-emerald-500/[0.06] border-emerald-500/10'
                : 'text-white/20 bg-white/[0.02] border-white/[0.04]'
            }`}>
              {chamber.status === 'live' ? 'Live' : 'Coming Soon'}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
