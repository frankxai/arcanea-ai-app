'use client';

/**
 * CollectionTexts — client wrapper for the text listing in a collection page.
 * Adds "Read" badges and collection-level progress bar for authenticated users.
 */

import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { useReadingProgress } from '@/hooks/use-reading-progress';
import { ReadBadge } from './reading-tracker';

interface TextSummary {
  slug: string;
  frontmatter: {
    title: string;
    excerpt: string;
    format: string;
    readingTime: number;
    wordCount?: number;
    situations: string[];
  };
}

interface CollectionTextsProps {
  collectionSlug: string;
  texts: TextSummary[];
}

export function CollectionTexts({ collectionSlug, texts }: CollectionTextsProps) {
  const { user } = useAuth();
  const { isComplete, getCollectionProgress } = useReadingProgress(user?.id ?? null);

  const progress = user ? getCollectionProgress(collectionSlug, texts.length) : null;

  return (
    <section aria-labelledby="texts-heading">
      <div className="mb-8 flex items-center justify-between">
        <h2
          id="texts-heading"
          className="text-xs uppercase tracking-[0.35em] text-atlantean-teal"
        >
          Texts in this collection
        </h2>

        {progress && progress.total > 0 && (
          <div className="flex items-center gap-3">
            <div
              className="h-1.5 w-32 overflow-hidden rounded-full bg-cosmic-raised"
              role="progressbar"
              aria-valuenow={progress.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${progress.completed} of ${progress.total} texts read`}
            >
              <div
                className="h-full rounded-full bg-atlantean-teal transition-all duration-500"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <span className="text-xs text-text-muted">
              {progress.completed}/{progress.total}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {texts.map((text, index) => (
          <Link
            key={text.slug}
            href={`/library/${text.slug}`}
            className="group block rounded-2xl border border-cosmic-border bg-cosmic-surface p-6 transition-all hover:border-atlantean-teal/50 hover:shadow-[0_0_40px_rgba(0,188,212,0.15)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cosmic-border-bright bg-cosmic-raised text-sm font-semibold text-text-muted">
                    {index + 1}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-text-muted">
                    {text.frontmatter.format}
                  </span>
                  {user && (
                    <ReadBadge
                      textSlug={text.slug}
                      isComplete={isComplete(text.slug)}
                    />
                  )}
                </div>

                <h3 className="font-display text-xl font-semibold text-text-primary group-hover:text-atlantean-teal transition-colors">
                  {text.frontmatter.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
                  {text.frontmatter.excerpt}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                  <span>{text.frontmatter.readingTime} min read</span>
                  <span className="h-3 w-px bg-cosmic-border" aria-hidden="true" />
                  <span>{text.frontmatter.wordCount?.toLocaleString()} words</span>

                  {text.frontmatter.situations.length > 0 && (
                    <>
                      <span className="h-3 w-px bg-cosmic-border" aria-hidden="true" />
                      <span className="text-atlantean-teal/80">
                        For: {text.frontmatter.situations.slice(0, 2).join(', ')}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full border border-cosmic-border-bright bg-cosmic-raised text-atlantean-teal group-hover:bg-atlantean-teal group-hover:text-cosmic-deep transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
