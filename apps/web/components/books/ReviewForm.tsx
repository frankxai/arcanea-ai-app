'use client';

/**
 * ReviewForm — submit or update a star rating + review for a book.
 *
 * - Uses the browser Supabase client to check auth; redirects to /login when absent.
 * - POSTs to /api/books/[slug]/ratings for create + update (upsert semantics).
 * - DELETEs the same endpoint to remove the caller's rating.
 */

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { StarRating } from './StarRating';

const MAX_REVIEW_CHARS = 5000;

export interface ReviewFormProps {
  bookSlug: string;
  existingRating?: { stars: number; review: string | null } | null;
  onSubmit?: () => void;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string };

export function ReviewForm({ bookSlug, existingRating, onSubmit }: ReviewFormProps) {
  const router = useRouter();
  const [stars, setStars] = useState<number>(existingRating?.stars ?? 0);
  const [review, setReview] = useState<string>(existingRating?.review ?? '');
  const [hasExisting, setHasExisting] = useState<boolean>(!!existingRating);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [authed, setAuthed] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      setAuthed(!!data.user);
      setAuthChecked(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setStars(existingRating?.stars ?? 0);
    setReview(existingRating?.review ?? '');
    setHasExisting(!!existingRating);
  }, [existingRating]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!authed) {
        router.push(`/login?redirect=/books/drafts/${bookSlug}`);
        return;
      }

      if (stars < 1 || stars > 5) {
        setStatus({ kind: 'error', message: 'Please select a star rating.' });
        return;
      }

      if (review.length > MAX_REVIEW_CHARS) {
        setStatus({
          kind: 'error',
          message: `Review is too long (max ${MAX_REVIEW_CHARS} characters).`,
        });
        return;
      }

      setStatus({ kind: 'loading' });

      const method = hasExisting ? 'PATCH' : 'POST';

      try {
        const res = await fetch(`/api/books/${bookSlug}/ratings`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stars, review: review.trim() || null }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setStatus({
            kind: 'error',
            message: body?.error ?? 'Failed to save your rating.',
          });
          return;
        }

        setHasExisting(true);
        setStatus({
          kind: 'success',
          message: hasExisting ? 'Rating updated.' : 'Thanks for your rating!',
        });
        onSubmit?.();
        router.refresh();
      } catch (err) {
        console.error('[ReviewForm] submit failed:', err);
        setStatus({
          kind: 'error',
          message: 'Network error. Please try again.',
        });
      }
    },
    [authed, bookSlug, hasExisting, onSubmit, review, router, stars],
  );

  const handleDelete = useCallback(async () => {
    if (!authed || !hasExisting) return;
    setStatus({ kind: 'loading' });
    try {
      const res = await fetch(`/api/books/${bookSlug}/ratings`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setStatus({
          kind: 'error',
          message: body?.error ?? 'Failed to delete your rating.',
        });
        return;
      }
      setStars(0);
      setReview('');
      setHasExisting(false);
      setStatus({ kind: 'success', message: 'Your rating has been removed.' });
      onSubmit?.();
      router.refresh();
    } catch (err) {
      console.error('[ReviewForm] delete failed:', err);
      setStatus({ kind: 'error', message: 'Network error. Please try again.' });
    }
  }, [authed, bookSlug, hasExisting, onSubmit, router]);

  if (!authChecked) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 backdrop-blur-sm">
        <div className="h-5 w-32 rounded bg-white/10 animate-pulse" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 backdrop-blur-sm text-center">
        <p className="text-sm text-white/60 mb-3">
          Sign in to rate this book and leave a review.
        </p>
        <a
          href={`/login?redirect=/books/drafts/${bookSlug}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#00bcd4] bg-[#00bcd4]/10 border border-[#00bcd4]/30 rounded-lg hover:bg-[#00bcd4]/20 transition-colors"
        >
          Sign in to review
        </a>
      </div>
    );
  }

  const isLoading = status.kind === 'loading';
  const remaining = MAX_REVIEW_CHARS - review.length;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 backdrop-blur-sm space-y-5"
    >
      <div>
        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
          Your Rating
        </label>
        <StarRating
          value={stars}
          onChange={setStars}
          size="lg"
          showLabel
          ariaLabel="Your rating for this book"
        />
      </div>

      <div>
        <label
          htmlFor={`review-${bookSlug}`}
          className="block text-xs uppercase tracking-widest text-white/40 mb-2"
        >
          Review <span className="text-white/25 normal-case">(optional)</span>
        </label>
        <textarea
          id={`review-${bookSlug}`}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          maxLength={MAX_REVIEW_CHARS}
          rows={5}
          placeholder="Share what moved you about this book..."
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/90 placeholder:text-white/25 focus:outline-none focus:border-[#00bcd4]/50 focus:ring-1 focus:ring-[#00bcd4]/30 resize-y"
        />
        <div className="mt-1 flex justify-between text-[10px] text-white/30">
          <span>Markdown is not rendered. Plain text only.</span>
          <span className={remaining < 100 ? 'text-[#00bcd4]/70' : ''}>
            {remaining.toLocaleString()} characters left
          </span>
        </div>
      </div>

      {status.kind === 'error' && (
        <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
          {status.message}
        </div>
      )}
      {status.kind === 'success' && (
        <div className="text-xs text-[#00bcd4] bg-[#00bcd4]/10 border border-[#00bcd4]/20 rounded-md px-3 py-2">
          {status.message}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={isLoading || stars < 1}
          className="px-5 py-2 text-sm font-medium text-[#00bcd4] bg-[#00bcd4]/10 border border-[#00bcd4]/30 rounded-lg hover:bg-[#00bcd4]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading
            ? 'Saving...'
            : hasExisting
              ? 'Update Rating'
              : 'Submit Rating'}
        </button>
        {hasExisting && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 text-xs text-white/50 border border-white/[0.08] rounded-lg hover:text-red-300 hover:border-red-500/30 disabled:opacity-40 transition-colors"
          >
            Delete my rating
          </button>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;
