'use client';

/**
 * ReadingTracker — client component for the text detail page.
 * - Marks a text as read when the user scrolls past 90% of the article.
 * - Provides a manual "Mark as read" button in the sidebar.
 * - Works gracefully when not logged in (no-op).
 */

import { useEffect, useRef, useCallback } from 'react';
import { CheckCircle } from '@/lib/phosphor-icons';
import { useAuth } from '@/lib/auth/context';
import { useReadingProgress } from '@/hooks/use-reading-progress';

interface ReadingTrackerProps {
  textSlug: string;
  collectionSlug: string;
}

export function ReadingTracker({ textSlug, collectionSlug }: ReadingTrackerProps) {
  const { user } = useAuth();
  const { markComplete, isComplete } = useReadingProgress(user?.id ?? null);
  const articleRef = useRef<HTMLElement | null>(null);
  const markedRef = useRef(false);

  const handleMarkComplete = useCallback(() => {
    markComplete(textSlug, collectionSlug);
  }, [markComplete, textSlug, collectionSlug]);

  // Scroll-based auto-mark: fires once when the user has read 90%+ of the article
  useEffect(() => {
    if (!user) return;

    const article = document.getElementById('main-content');
    if (!article) return;
    articleRef.current = article;

    const observer = new IntersectionObserver(
      (entries) => {
        if (markedRef.current) return;
        const entry = entries[0];
        if (entry && entry.intersectionRatio >= 0.9) {
          markedRef.current = true;
          markComplete(textSlug, collectionSlug);
        }
      },
      { threshold: 0.9 }
    );

    // Observe a sentinel at the bottom of the article
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    article.appendChild(sentinel);
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [user, textSlug, collectionSlug, markComplete]);

  const done = isComplete(textSlug);

  if (!user) return null;

  return (
    <div className="rounded-xl border border-cosmic-border bg-cosmic-surface p-4">
      {done ? (
        <div className="flex items-center gap-2 text-sm text-atlantean-teal">
          <CheckCircle weight="fill" className="h-4 w-4 flex-none" aria-hidden="true" />
          <span>Read</span>
        </div>
      ) : (
        <button
          onClick={handleMarkComplete}
          className="flex w-full items-center gap-2 rounded-lg border border-cosmic-border px-3 py-2 text-sm text-text-muted transition-all hover:border-atlantean-teal/50 hover:text-atlantean-teal"
        >
          <CheckCircle className="h-4 w-4 flex-none" aria-hidden="true" />
          <span>Mark as read</span>
        </button>
      )}
    </div>
  );
}

/**
 * ReadBadge — inline badge for collection/listing pages.
 * Rendered only when a text has been completed.
 */
interface ReadBadgeProps {
  textSlug: string;
  isComplete: boolean;
}

export function ReadBadge({ isComplete }: ReadBadgeProps) {
  if (!isComplete) return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-atlantean-teal/40 bg-atlantean-teal/10 px-2 py-0.5 text-xs text-atlantean-teal"
      aria-label="Read"
    >
      <CheckCircle weight="fill" className="h-3 w-3" aria-hidden="true" />
      Read
    </span>
  );
}
