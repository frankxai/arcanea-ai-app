/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useCallback, useEffect, useState } from 'react';

interface BookHeaderProps {
  title: string;
  subtitle?: string;
  chapterCount: number;
  totalWords: number;
  currentChapter: string;
  bookSlug: string;
}

export function BookHeader({ title, subtitle, chapterCount, totalWords, currentChapter, bookSlug }: BookHeaderProps) {
  const [reviewing, setReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [draftCount, setDraftCount] = useState<number>(0);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<string | null>(null);

  const loadDraftCount = useCallback(async () => {
    try {
      const res = await fetch(`/api/author/${bookSlug}/drafts`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data?.count === 'number') setDraftCount(data.count);
    } catch {
      // Silent — draft count is a nice-to-have, not critical
    }
  }, [bookSlug]);

  useEffect(() => {
    loadDraftCount();
  }, [loadDraftCount]);

  const triggerReview = async () => {
    setReviewing(true);
    setReviewResult(null);
    try {
      const res = await fetch(`/api/books/${bookSlug}/guardian-review`, { method: 'POST' });
      const data = await res.json();
      if (data.report?.composite != null) {
        setReviewResult(`Guardian Score: ${Number(data.report.composite).toFixed(1)}/10`);
      } else if (data.error) {
        setReviewResult(data.error);
      } else {
        setReviewResult('Review queued');
      }
    } catch {
      setReviewResult('Review unavailable');
    } finally {
      setReviewing(false);
    }
  };

  const triggerPublish = async () => {
    if (publishing) return;
    if (draftCount === 0) {
      setPublishResult('No drafts to publish');
      return;
    }
    setPublishing(true);
    setPublishResult(null);
    try {
      const res = await fetch(`/api/author/${bookSlug}/publish`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        const failedNote = data.failed > 0 ? ` (${data.failed} failed)` : '';
        setPublishResult(`Published ${data.published} chapter${data.published === 1 ? '' : 's'}${failedNote}`);
        await loadDraftCount();
      } else {
        setPublishResult(data.error || 'Publish failed');
      }
    } catch {
      setPublishResult('Publish unavailable');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-[var(--arc-cosmic-void)]/90 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <a href="/studio/author" className="text-white/30 hover:text-white/50 text-xs transition-colors">&larr;</a>
        <div>
          <h1 className="font-display text-sm font-semibold text-white/80">{title}</h1>
          {subtitle && <p className="text-[10px] text-white/30">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4 text-[10px] text-white/25">
        <span>{chapterCount} chapters</span>
        <span className="w-px h-3 bg-white/10" />
        <span>{totalWords.toLocaleString()} words</span>
        <span className="w-px h-3 bg-white/10" />
        <span className="text-[var(--arc-brand-atlantean-teal)]/60">{currentChapter}</span>

        {reviewResult && (
          <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400">{reviewResult}</span>
        )}

        {publishResult && (
          <span className="px-2 py-1 rounded-md bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)]">{publishResult}</span>
        )}

        <button
          onClick={triggerReview}
          disabled={reviewing}
          className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 disabled:opacity-30 transition-all"
        >
          {reviewing ? 'Reviewing...' : 'Guardian Review'}
        </button>

        <button
          onClick={triggerPublish}
          disabled={publishing || draftCount === 0}
          className="px-2.5 py-1 rounded-md bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/20 text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title={draftCount === 0 ? 'No drafts to publish' : `Publish ${draftCount} draft${draftCount === 1 ? '' : 's'} to git`}
        >
          {publishing
            ? 'Publishing...'
            : draftCount > 0
              ? `Publish (${draftCount} draft${draftCount === 1 ? '' : 's'})`
              : 'Publish to Git'}
        </button>

        <a
          href={`/books/drafts/${bookSlug}`}
          target="_blank"
          className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/60 transition-colors"
        >
          View Published &rarr;
        </a>
      </div>
    </header>
  );
}
