'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ReadingProgressBar } from '@/components/living-lore/reading-progress-bar';

interface ChapterNav {
  slug: string;
  title: string;
}

interface BookChapterContentProps {
  title: string;
  content: string;
  wordCount: number;
  readingTime: number;
  prev: ChapterNav | null;
  next: ChapterNav | null;
}

export function BookChapterContent({
  title,
  content,
  wordCount,
  readingTime,
  prev,
  next,
}: BookChapterContentProps) {
  return (
    <>
      <ReadingProgressBar />

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-8 flex-wrap">
          <Link
            href="/living-lore"
            className="hover:text-text-primary transition-colors"
          >
            Living Lore
          </Link>
          <span className="text-white/20">/</span>
          <Link
            href="/living-lore/book"
            className="hover:text-text-primary transition-colors"
          >
            Book
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-text-primary truncate max-w-[200px]">
            {title}
          </span>
        </nav>

        {/* Reading meta */}
        <div className="flex items-center gap-4 text-xs text-text-muted mb-8">
          <span>{wordCount.toLocaleString()} words</span>
          <span className="text-white/20">|</span>
          <span>{readingTime} min read</span>
        </div>

        {/* Chapter content */}
        <article className="prose-arcanea">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>

        {/* Chapter navigation */}
        <nav className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
          {prev ? (
            <Link
              href={`/living-lore/book/${prev.slug}`}
              className="group liquid-glass rounded-xl p-4 hover:border-atlantean-teal-aqua/20 transition-all"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-1">
                Previous
              </p>
              <p className="text-sm text-text-primary group-hover:text-atlantean-teal-aqua transition-colors line-clamp-2">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/living-lore/book/${next.slug}`}
              className="group liquid-glass rounded-xl p-4 hover:border-atlantean-teal-aqua/20 transition-all text-right"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-1">
                Next
              </p>
              <p className="text-sm text-text-primary group-hover:text-atlantean-teal-aqua transition-colors line-clamp-2">
                {next.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </nav>

        {/* Back to book */}
        <div className="mt-8 text-center">
          <Link
            href="/living-lore/book"
            className="text-sm text-text-muted hover:text-atlantean-teal-aqua transition-colors"
          >
            &larr; Back to Table of Contents
          </Link>
        </div>
      </main>
    </>
  );
}
