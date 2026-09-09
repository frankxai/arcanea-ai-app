/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { readFile, access } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import matter from 'gray-matter';
import ChatMarkdown from '@/components/chat/chat-markdown';
import { getBookRoot } from '@/lib/content/book-path';
import { isBookPublic } from '@/lib/content/book-visibility';
const BOOK_ROOT = getBookRoot();

export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------------ */
/*  Book root registry (mirrors BOOK_META in chapter page)             */
/* ------------------------------------------------------------------ */

const BOOK_ROOTS: Record<string, { title: string; root: string }> = {
  'forge-of-ruin': {
    title: 'The Forge of Ruin',
    root: join(BOOK_ROOT, 'forge-of-ruin'),
  },
  'tides-of-silence': {
    title: 'The Tides of Silence',
    root: join(BOOK_ROOT, 'tides-of-silence'),
  },
  'heart-of-pyrathis': {
    title: 'The Heart of Pyrathis',
    root: join(BOOK_ROOT, 'heart-of-pyrathis'),
  },
  'song-of-van-linh': {
    title: 'The Girl Who Heard the River',
    root: join(BOOK_ROOT, 'song-of-van-linh'),
  },
  'las-tierras-de-luz': {
    title: 'Las Tierras de Luz',
    root: join(BOOK_ROOT, 'las-tierras-de-luz'),
  },
};

async function exists(path: string): Promise<boolean> {
  try { await access(path); return true; } catch { return false; }
}

async function readIfExists(path: string): Promise<string | null> {
  if (!(await exists(path))) return null;
  const raw = await readFile(path, 'utf-8');
  const { content } = matter(raw);
  return content || raw;
}

interface PageProps {
  params: Promise<{ bookId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { bookId } = await params;
  const meta = BOOK_ROOTS[bookId];
  if (!meta) return { title: 'About — Not Found' };
  if (!(await isBookPublic(meta.root))) return { title: 'About — Not Found' };
  return {
    title: `About ${meta.title} — Author's Note & Glossary`,
    description: `The collaboration story behind ${meta.title}: how it was made, who made it, and the words it asks you to learn.`,
  };
}

export default async function BookAboutPage({ params }: PageProps) {
  const { bookId } = await params;
  const meta = BOOK_ROOTS[bookId];
  if (!meta) notFound();
  if (!(await isBookPublic(meta.root))) notFound();

  const [authorsNote, glossary] = await Promise.all([
    readIfExists(join(meta.root, 'AUTHORS_NOTE.md')),
    readIfExists(join(meta.root, 'GLOSSARY.md')),
  ]);

  if (!authorsNote && !glossary) notFound();

  const proseClass = 'prose prose-invert prose-lg max-w-none prose-p:text-white/80 prose-p:leading-[1.8] prose-p:mb-6 prose-headings:text-white/90 prose-headings:font-display prose-blockquote:border-l-[var(--arc-brand-atlantean-teal)]/30 prose-blockquote:text-white/60 prose-strong:text-white/90 prose-em:text-white/70 prose-hr:border-white/[0.06]';

  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/3 top-[8%] h-[400px] w-[400px] rounded-full bg-[var(--arc-brand-atlantean-teal)]/8 blur-[140px]" />
        <div className="absolute right-1/4 top-[40%] h-[300px] w-[300px] rounded-full bg-[var(--arc-brand-cosmic-blue)]/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-16">
        {/* Back link */}
        <Link
          href={`/books/${bookId}`}
          className="mb-12 inline-flex items-center gap-2 text-xs text-white/40 transition-colors hover:text-white/70"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to {meta.title}
        </Link>

        {/* Author's Note */}
        {authorsNote && (
          <section className="mb-20" id="authors-note">
            <header className="mb-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--arc-brand-atlantean-teal)]/50">
                Behind the book
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white/95 md:text-4xl leading-[1.1]">
                Author&apos;s Note
              </h1>
            </header>
            <article className={proseClass}>
              <ChatMarkdown content={authorsNote} />
            </article>
          </section>
        )}

        {/* Decorative divider between sections */}
        {authorsNote && glossary && (
          <div className="mb-20 flex items-center gap-3 text-[var(--arc-brand-atlantean-teal)]/15" aria-hidden="true">
            <span className="h-px flex-1 bg-current" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]/30">
              ·
            </span>
            <span className="h-px flex-1 bg-current" />
          </div>
        )}

        {/* Glossary */}
        {glossary && (
          <section id="glossary">
            <header className="mb-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--arc-brand-atlantean-teal)]/50">
                Companion vocabulary
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white/95 md:text-4xl leading-[1.1]">
                Glossary
              </h1>
            </header>
            <article className={proseClass}>
              <ChatMarkdown content={glossary} />
            </article>
          </section>
        )}

        {/* Back to book */}
        <div className="mt-16 text-center">
          <Link
            href={`/books/${bookId}`}
            className="text-xs text-white/30 transition-colors hover:text-white/60"
          >
            &larr; Back to {meta.title}
          </Link>
        </div>
      </main>
    </div>
  );
}
