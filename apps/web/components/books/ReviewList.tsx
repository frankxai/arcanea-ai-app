/**
 * ReviewList — server component that fetches ratings directly from Supabase
 * and renders the summary (average, distribution) + individual reviews.
 *
 * Interactive bits (expand long reviews, load more) are delegated to the
 * small ReviewListClient component.
 */

import { createClient } from '@/lib/supabase/server';
import { StarRating } from './StarRating';
import { ReviewListClient, type ReviewItem } from './ReviewListClient';

// The generated Database types haven't been regenerated since the
// 20260410000001_open_library migration. Cast the client as `any` at the
// table-access boundary — matches lib/books/cover-resolver.ts pattern.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

export interface ReviewListProps {
  bookSlug: string;
  limit?: number;
}

interface Summary {
  average: number;
  count: number;
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
}

interface FetchResult {
  summary: Summary;
  ratings: ReviewItem[];
  unavailable: boolean;
}

function emptySummary(): Summary {
  return { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
}

async function fetchRatings(bookSlug: string): Promise<FetchResult> {
  try {
    const supabase = (await createClient()) as DB;

    const { data: book } = await supabase
      .from('books')
      .select('id')
      .eq('slug', bookSlug)
      .maybeSingle();

    if (!book) {
      return { summary: emptySummary(), ratings: [], unavailable: false };
    }

    const bookId = (book as { id: string }).id;

    const { data: rows, error } = await supabase
      .from('book_ratings')
      .select('id, stars, review, user_id, created_at, updated_at')
      .eq('book_id', bookId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ReviewList] fetch error:', error);
      return { summary: emptySummary(), ratings: [], unavailable: true };
    }

    const ratings = ((rows ?? []) as unknown) as Array<{
      id: string;
      stars: number;
      review: string | null;
      user_id: string;
      created_at: string;
      updated_at: string;
    }>;

    const summary = emptySummary();
    for (const r of ratings) {
      summary.count += 1;
      summary.distribution[r.stars as 1 | 2 | 3 | 4 | 5] += 1;
    }
    if (summary.count > 0) {
      const total = ratings.reduce((acc, r) => acc + r.stars, 0);
      summary.average = Math.round((total / summary.count) * 100) / 100;
    }

    const userIds = Array.from(new Set(ratings.map((r) => r.user_id)));
    type ProfileRow = {
      id: string;
      username: string | null;
      display_name: string | null;
      avatar_url: string | null;
    };
    let profileMap = new Map<string, ProfileRow>();
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', userIds);
      profileMap = new Map(
        (((profilesData ?? []) as unknown) as ProfileRow[]).map((p) => [p.id, p]),
      );
    }

    const items: ReviewItem[] = ratings.map((r) => {
      const profile = profileMap.get(r.user_id);
      const displayName =
        profile?.display_name?.trim() ||
        profile?.username?.trim() ||
        'Anonymous Reader';
      return {
        id: r.id,
        stars: r.stars,
        review: r.review,
        displayName,
        avatarUrl: profile?.avatar_url ?? null,
        createdAt: r.created_at,
      };
    });

    return { summary, ratings: items, unavailable: false };
  } catch (err) {
    console.error('[ReviewList] unavailable:', err);
    return { summary: emptySummary(), ratings: [], unavailable: true };
  }
}

function DistributionBar({
  stars,
  count,
  total,
}: {
  stars: number;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-6 text-white/40 tabular-nums">{stars}</span>
      <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
        <div
          className="h-full bg-[#00bcd4]/70 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 text-right text-white/30 tabular-nums">{count}</span>
    </div>
  );
}

export async function ReviewList({ bookSlug, limit = 10 }: ReviewListProps) {
  const { summary, ratings, unavailable } = await fetchRatings(bookSlug);

  if (unavailable) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 backdrop-blur-sm text-center">
        <p className="text-sm text-white/50">
          Reviews are temporarily unavailable. Please check back shortly.
        </p>
      </div>
    );
  }

  if (summary.count === 0) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 backdrop-blur-sm text-center">
        <div className="mb-3 flex justify-center">
          <StarRating value={0} size="lg" />
        </div>
        <p className="text-sm text-white/60">Be the first to rate this book.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 backdrop-blur-sm">
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="text-center sm:text-left">
            <div className="text-5xl font-display font-bold text-white/95 tabular-nums leading-none">
              {summary.average.toFixed(1)}
            </div>
            <div className="mt-2 flex justify-center sm:justify-start">
              <StarRating value={summary.average} size="md" />
            </div>
            <div className="mt-1 text-xs text-white/40">
              {summary.count.toLocaleString()}{' '}
              {summary.count === 1 ? 'review' : 'reviews'}
            </div>
          </div>

          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((s) => (
              <DistributionBar
                key={s}
                stars={s}
                count={summary.distribution[s as 1 | 2 | 3 | 4 | 5]}
                total={summary.count}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Individual reviews */}
      <ReviewListClient ratings={ratings} limit={limit} />
    </div>
  );
}

export default ReviewList;
