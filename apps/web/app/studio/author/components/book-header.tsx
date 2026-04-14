'use client';

import { useState } from 'react';

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

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-[#09090b]/90 backdrop-blur-sm">
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
        <span className="text-[#00bcd4]/60">{currentChapter}</span>

        {reviewResult && (
          <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400">{reviewResult}</span>
        )}

        <button
          onClick={triggerReview}
          disabled={reviewing}
          className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 disabled:opacity-30 transition-all"
        >
          {reviewing ? 'Reviewing...' : 'Guardian Review'}
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
