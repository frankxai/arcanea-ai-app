'use client';

/**
 * ReviewForm — submit or update a star rating + review for a book.
 *
 * - Uses the browser Supabase client to check auth; redirects to /login when absent.
 * - POSTs (new) or PATCHes (update) /api/books/[slug]/ratings for upsert semantics.
 * - DELETEs the same endpoint to remove the caller's rating.
 * - Feedback via sonner toasts.
 */

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogIn, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from './StarRating';

const MAX_REVIEW_CHARS = 5000;

export interface ReviewFormProps {
  bookSlug: string;
  existingRating?: { stars: number; review: string | null } | null;
  onSubmit?: () => void;
}

export function ReviewForm({ bookSlug, existingRating, onSubmit }: ReviewFormProps) {
  const router = useRouter();
  const [stars, setStars] = useState<number>(existingRating?.stars ?? 0);
  const [review, setReview] = useState<string>(existingRating?.review ?? '');
  const [hasExisting, setHasExisting] = useState<boolean>(!!existingRating);
  const [loading, setLoading] = useState<boolean>(false);
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
        toast.error('Please select a star rating.');
        return;
      }

      if (review.length > MAX_REVIEW_CHARS) {
        toast.error(`Review is too long (max ${MAX_REVIEW_CHARS} characters).`);
        return;
      }

      setLoading(true);
      const method = hasExisting ? 'PATCH' : 'POST';

      try {
        const res = await fetch(`/api/books/${bookSlug}/ratings`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stars, review: review.trim() || null }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          toast.error(body?.error ?? 'Failed to save your rating.');
          return;
        }

        toast.success(hasExisting ? 'Rating updated.' : 'Thanks for your rating!');
        setHasExisting(true);
        onSubmit?.();
        router.refresh();
      } catch (err) {
        console.error('[ReviewForm] submit failed:', err);
        toast.error('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [authed, bookSlug, hasExisting, onSubmit, review, router, stars],
  );

  const handleDelete = useCallback(async () => {
    if (!authed || !hasExisting) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/books/${bookSlug}/ratings`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.error ?? 'Failed to delete your rating.');
        return;
      }
      setStars(0);
      setReview('');
      setHasExisting(false);
      toast.success('Your rating has been removed.');
      onSubmit?.();
      router.refresh();
    } catch (err) {
      console.error('[ReviewForm] delete failed:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
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
        <Button asChild variant="secondary">
          <a href={`/login?redirect=/books/drafts/${bookSlug}`}>
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Sign in to review
          </a>
        </Button>
      </div>
    );
  }

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
        <Textarea
          id={`review-${bookSlug}`}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          maxLength={MAX_REVIEW_CHARS}
          minRows={5}
          placeholder="Share what moved you about this book..."
        />
        <div className="mt-1 flex justify-between text-[10px] text-white/30">
          <span>Markdown is not rendered. Plain text only.</span>
          <span className={remaining < 100 ? 'text-[#00bcd4]/70' : ''}>
            {remaining.toLocaleString()} characters left
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button type="submit" disabled={loading || stars < 1} variant="default">
          {loading ? 'Saving...' : hasExisting ? 'Update Rating' : 'Submit Rating'}
        </Button>
        {hasExisting && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            className="text-white/50 hover:text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Delete my rating
          </Button>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;
