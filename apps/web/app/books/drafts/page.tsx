import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: 'Drafts — The Forge of Ruin',
  description:
    'Read the first draft of The Forge of Ruin — a dark epic fantasy about a berserker whose rage devours his memories. Written live, in the open.',
  openGraph: {
    title: 'The Forge of Ruin — Draft',
    description: 'A dark epic fantasy. Read the first chapters as they are forged.',
  },
};

/* ------------------------------------------------------------------ */
/*  Data loading                                                       */
/* ------------------------------------------------------------------ */

const CHAPTERS_DIR = join(process.cwd(), '..', '..', 'book', 'forge-of-ruin', 'chapters');

interface DraftChapter {
  slug: string;
  title: string;
  subtitle: string;
  wordCount: number;
  readTime: number;
  excerpt: string;
  number: number;
}

function extractChapterTitle(content: string, filename: string): { title: string; subtitle: string } {
  // Try "## Chapter One: The Forty-Seven Names" pattern
  const chapterHeading = content.match(/^##\s+(?:Chapter\s+\w+:\s+)?(.+)$/m);
  if (chapterHeading) {
    const full = chapterHeading[1].trim();
    return { title: full, subtitle: '' };
  }

  // Try "## Prologue:" pattern
  const prologueHeading = content.match(/^##\s+Prologue:\s*(.+)$/m);
  if (prologueHeading) {
    return { title: 'Prologue', subtitle: prologueHeading[1].trim() };
  }

  // Fallback from filename
  const name = filename
    .replace(/\.md$/, '')
    .replace(/^\d+-/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return { title: name, subtitle: '' };
}

function makeExcerpt(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('---') &&
      !trimmed.startsWith('*Recorded') &&
      !trimmed.startsWith('*Here') &&
      trimmed.length > 40
    ) {
      return trimmed.length > 200
        ? trimmed.slice(0, 200).replace(/\s+\S*$/, '') + '...'
        : trimmed;
    }
  }
  return '';
}

async function loadDraftChapters(): Promise<DraftChapter[]> {
  try {
    const files = await readdir(CHAPTERS_DIR);
    const mdFiles = files.filter((f) => f.endsWith('.md')).sort();
    const chapters: DraftChapter[] = [];

    for (let i = 0; i < mdFiles.length; i++) {
      const filename = mdFiles[i];
      const raw = await readFile(join(CHAPTERS_DIR, filename), 'utf-8');
      const { title, subtitle } = extractChapterTitle(raw, filename);
      const words = raw.split(/\s+/).filter(Boolean).length;

      chapters.push({
        slug: filename.replace(/\.md$/, '').replace(/^\d+-/, ''),
        title,
        subtitle,
        wordCount: words,
        readTime: Math.max(1, Math.ceil(words / 250)),
        excerpt: makeExcerpt(raw),
        number: i,
      });
    }

    return chapters;
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function DraftsPage() {
  const chapters = await loadDraftChapters();
  const totalWords = chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
  const totalReadTime = chapters.reduce((sum, ch) => sum + ch.readTime, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Cover art background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{ backgroundImage: 'url(/images/books/forge-of-ruin-cover.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/80 to-[#0a0a0f]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-900/[0.08] blur-[120px]" />

        <div className="relative max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
          <Link
            href="/books"
            className="inline-block text-xs text-white/30 hover:text-white/50 transition-colors mb-8"
          >
            &larr; All Books
          </Link>

          <p className="text-[10px] uppercase tracking-[0.3em] text-red-400/60 mb-4">
            Draft in Progress
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white/95 mb-4">
            The Forge of Ruin
          </h1>

          <p className="text-lg sm:text-xl text-white/40 font-serif italic max-w-xl mx-auto mb-8 leading-relaxed">
            A berserker whose rage devours his memories. A keeper who forges her
            own chains. A chronicler who falls inside the story she is telling.
          </p>

          <div className="flex items-center justify-center gap-6 text-xs text-white/25">
            <span>{chapters.length} chapters</span>
            <span className="w-px h-3 bg-white/10" />
            <span>{totalWords.toLocaleString()} words</span>
            <span className="w-px h-3 bg-white/10" />
            <span>{totalReadTime} min read</span>
            <span className="w-px h-3 bg-white/10" />
            <span>Dark Epic Fantasy</span>
          </div>

          {chapters.length > 0 && (
            <Link
              href={`/books/forge-of-ruin/${chapters[0].slug}`}
              className="inline-flex items-center gap-2 mt-10 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/15 hover:border-red-500/30 transition-all text-sm font-medium"
            >
              Begin Reading
              <span className="text-xs opacity-60">&rarr;</span>
            </Link>
          )}
        </div>
      </section>

      {/* Book Description */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 backdrop-blur-sm flex flex-col sm:flex-row gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/books/forge-of-ruin-cover.png"
            alt="The Forge of Ruin cover art"
            className="w-32 sm:w-40 flex-shrink-0 rounded-lg shadow-2xl shadow-red-950/30 self-start"
          />
          <div>
          <h2 className="text-sm font-display font-semibold text-white/60 uppercase tracking-wider mb-4">
            About This Draft
          </h2>
          <p className="text-white/50 leading-relaxed text-sm mb-4">
            Erivar Skaldson has been chained in a cellar for three years. Every
            night he recites the names of the forty-seven people the Fury killed
            while wearing his body. Tonight, he discovers three names are gone.
            The parasite has been eating while he believed it sleeping.
          </p>
          <p className="text-white/50 leading-relaxed text-sm mb-4">
            When the Wraith Armies breach the Thornwall, the Thane of Galdheim
            must unchain the weapon she kept caged. Erivar must choose: fight and
            risk losing himself, or stay chained and certainly die when the
            fortress falls.
          </p>
          <p className="text-white/35 leading-relaxed text-xs italic">
            This is a live draft. Chapters are published as they are forged.
            Joe Abercrombie meets dark Norse mythology. No clean victories.
          </p>

          {/* AI Transparency */}
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2">AI Transparency</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40">Claude Opus 4.6</span>
              <span className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40">Human: 30% direction</span>
              <span className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40">AI: 70% prose</span>
              <span className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40">Cover: Nano Banana Pro</span>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Characters */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-sm font-display font-semibold text-white/60 uppercase tracking-wider mb-6 text-center">
          The Cast
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'Erivar Skaldson', role: 'The Berserker', color: 'red', desc: 'Forty-seven names. Three missing.' },
            { name: 'Ashe Ceth', role: 'The Observer', color: 'amber', desc: 'Ashpriest. Private log. Uncertain.' },
            { name: 'Halla Ironjaw', role: 'The Thane', color: 'slate', desc: 'Iron hand on the blueprint.' },
            { name: 'Sable', role: 'The Deserter', color: 'cyan', desc: 'Wraith defector. Proof that monsters can choose.' },
            { name: 'Odre Flachmark', role: 'The Chronicler', color: 'purple', desc: 'Became part of the record.' },
            { name: 'Raskvorn', role: 'The Hollow', color: 'zinc', desc: 'A wooden fox. A daughter\'s voice.' },
          ].map((c) => (
            <div
              key={c.name}
              className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-colors"
            >
              <p className={`text-xs font-medium text-${c.color}-400/70 mb-1`}>{c.role}</p>
              <p className="text-sm font-display font-semibold text-white/80 mb-1">{c.name}</p>
              <p className="text-xs text-white/30 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chapters */}
      <section className="max-w-2xl mx-auto px-6 pb-32">
        <h2 className="text-sm font-display font-semibold text-white/60 uppercase tracking-wider mb-6 text-center">
          Chapters
        </h2>
        <div className="space-y-2">
          {chapters.map((ch, idx) => (
            <Link
              key={ch.slug}
              href={`/books/forge-of-ruin/${ch.slug}`}
              className="group flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/[0.07] border border-red-500/10 flex items-center justify-center text-xs text-red-400/50 font-mono mt-0.5">
                {idx === 0 ? 'P' : idx}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="text-sm font-display font-semibold text-white/80 group-hover:text-white/95 transition-colors truncate">
                    {ch.title}
                  </h3>
                  {ch.subtitle && (
                    <span className="text-xs text-white/25 hidden sm:inline">{ch.subtitle}</span>
                  )}
                </div>
                <p className="text-xs text-white/25 line-clamp-2 leading-relaxed mb-2">{ch.excerpt}</p>
                <div className="flex items-center gap-3 text-[10px] text-white/20">
                  <span>{ch.wordCount.toLocaleString()} words</span>
                  <span>{ch.readTime} min read</span>
                </div>
              </div>
              <span className="flex-shrink-0 text-white/10 group-hover:text-white/30 transition-colors text-sm mt-1">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
