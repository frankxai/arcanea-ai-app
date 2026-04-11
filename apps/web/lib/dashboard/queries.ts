/**
 * Dashboard Queries
 *
 * Shared data-fetching functions for the author dashboard.
 * All queries respect RLS and return graceful fallbacks on failure
 * so partial Supabase outages never crash the dashboard.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database/types/supabase';

type Supa = SupabaseClient<Database>;

// ─── Types ────────────────────────────────────────────────────────────────

export interface AuthorBook {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  status: 'draft' | 'in-progress' | 'complete' | 'archived';
  tier: 'community' | 'featured' | 'canon';
  star_average: number | null;
  rating_count: number | null;
  guardian_score: number | null;
  updated_at: string;
  cover_url: string | null;
  role: string;
}

export interface AuthorStats {
  bookCount: number;
  totalReviews: number;
  averageRating: number;
  guardianScore: number;
}

export type ActivityEventType =
  | 'rating'
  | 'review'
  | 'guardian_review'
  | 'tier_promoted'
  | 'chapter_published';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  bookSlug: string;
  bookTitle: string;
  createdAt: string;
  // type-specific fields
  stars?: number;
  reviewText?: string | null;
  guardian?: string;
  dimension?: string;
  score?: number;
  chapterTitle?: string;
  newTier?: string;
}

// ─── Queries ──────────────────────────────────────────────────────────────

/**
 * Fetch all books where the user is listed as an author.
 * Pulls cover URLs in a secondary query since there is no declared
 * FK relationship between books.cover_id and book_covers.id.
 */
export async function getAuthorBooks(
  supabase: Supa,
  userId: string
): Promise<AuthorBook[]> {
  try {
    // 1. Find book_ids where the user is an author
    const { data: authorRows, error: authorErr } = await supabase
      .from('book_authors')
      .select('book_id, role')
      .eq('user_id', userId);

    if (authorErr || !authorRows || authorRows.length === 0) return [];

    const bookIds = authorRows.map((r) => r.book_id);
    const roleByBook = new Map<string, string>(
      authorRows.map((r) => [r.book_id, r.role])
    );

    // 2. Fetch books
    const { data: books, error: bookErr } = await supabase
      .from('books')
      .select(
        'id, slug, title, subtitle, status, tier, star_average, rating_count, guardian_score, updated_at, cover_id'
      )
      .in('id', bookIds)
      .order('updated_at', { ascending: false });

    if (bookErr || !books) return [];

    // 3. Fetch active covers for those books
    const coverIds = books
      .map((b) => b.cover_id)
      .filter((id): id is string => !!id);

    let coverMap = new Map<string, string>();
    if (coverIds.length > 0) {
      const { data: covers } = await supabase
        .from('book_covers')
        .select('id, public_url')
        .in('id', coverIds);
      if (covers) {
        coverMap = new Map(covers.map((c) => [c.id, c.public_url]));
      }
    }

    return books.map((b) => ({
      id: b.id,
      slug: b.slug,
      title: b.title,
      subtitle: b.subtitle,
      status: b.status,
      tier: b.tier,
      star_average: b.star_average,
      rating_count: b.rating_count,
      guardian_score: b.guardian_score,
      updated_at: b.updated_at,
      cover_url: b.cover_id ? coverMap.get(b.cover_id) ?? null : null,
      role: roleByBook.get(b.id) ?? 'contributor',
    }));
  } catch (err) {
    console.error('[dashboard/queries] getAuthorBooks failed:', err);
    return [];
  }
}

/**
 * Aggregate author stats from the books list (avoids round-trips).
 * Weighted average rating is weighted by rating_count.
 */
export function getAuthorStats(books: AuthorBook[]): AuthorStats {
  if (books.length === 0) {
    return { bookCount: 0, totalReviews: 0, averageRating: 0, guardianScore: 0 };
  }

  const totalReviews = books.reduce(
    (sum, b) => sum + (b.rating_count ?? 0),
    0
  );

  const weightedRatingSum = books.reduce(
    (sum, b) => sum + (b.star_average ?? 0) * (b.rating_count ?? 0),
    0
  );
  const averageRating = totalReviews > 0 ? weightedRatingSum / totalReviews : 0;

  const guardianEntries = books.filter(
    (b) => b.guardian_score !== null && b.guardian_score !== undefined
  );
  const guardianScore =
    guardianEntries.length > 0
      ? guardianEntries.reduce((sum, b) => sum + (b.guardian_score ?? 0), 0) /
        guardianEntries.length
      : 0;

  return {
    bookCount: books.length,
    totalReviews,
    averageRating,
    guardianScore,
  };
}

/**
 * Build a recent-activity feed from ratings + guardian reviews
 * for all books the user authors. Returns up to `limit` most recent events.
 */
export async function getRecentActivity(
  supabase: Supa,
  userId: string,
  limit = 10
): Promise<ActivityEvent[]> {
  try {
    const { data: authorRows } = await supabase
      .from('book_authors')
      .select('book_id')
      .eq('user_id', userId);

    if (!authorRows || authorRows.length === 0) return [];

    const bookIds = authorRows.map((r) => r.book_id);

    // Book metadata for labelling events
    const { data: books } = await supabase
      .from('books')
      .select('id, slug, title')
      .in('id', bookIds);

    const bookMeta = new Map<string, { slug: string; title: string }>();
    (books ?? []).forEach((b) =>
      bookMeta.set(b.id, { slug: b.slug, title: b.title })
    );

    const events: ActivityEvent[] = [];

    // Ratings (each row is a rating; if `review` is non-null treat as review)
    try {
      const { data: ratings } = await supabase
        .from('book_ratings')
        .select('id, book_id, stars, review, created_at')
        .in('book_id', bookIds)
        .order('created_at', { ascending: false })
        .limit(limit);

      (ratings ?? []).forEach((r) => {
        const meta = bookMeta.get(r.book_id);
        if (!meta) return;
        events.push({
          id: `rating-${r.id}`,
          type: r.review ? 'review' : 'rating',
          bookSlug: meta.slug,
          bookTitle: meta.title,
          createdAt: r.created_at,
          stars: r.stars,
          reviewText: r.review,
        });
      });
    } catch (err) {
      console.error('[dashboard/queries] ratings fetch failed:', err);
    }

    // Guardian reviews
    try {
      const { data: gReviews } = await supabase
        .from('guardian_reviews')
        .select('id, book_id, guardian, dimension, score, assessed_at')
        .in('book_id', bookIds)
        .order('assessed_at', { ascending: false })
        .limit(limit);

      (gReviews ?? []).forEach((g) => {
        const meta = bookMeta.get(g.book_id);
        if (!meta) return;
        events.push({
          id: `guardian-${g.id}`,
          type: 'guardian_review',
          bookSlug: meta.slug,
          bookTitle: meta.title,
          createdAt: g.assessed_at,
          guardian: g.guardian,
          dimension: g.dimension,
          score: g.score,
        });
      });
    } catch (err) {
      console.error('[dashboard/queries] guardian reviews fetch failed:', err);
    }

    // Chapters published
    try {
      const { data: chapters } = await supabase
        .from('book_chapters')
        .select('id, book_id, title, published_at, status')
        .in('book_id', bookIds)
        .eq('status', 'published')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(limit);

      (chapters ?? []).forEach((c) => {
        const meta = bookMeta.get(c.book_id);
        if (!meta || !c.published_at) return;
        events.push({
          id: `chapter-${c.id}`,
          type: 'chapter_published',
          bookSlug: meta.slug,
          bookTitle: meta.title,
          createdAt: c.published_at,
          chapterTitle: c.title,
        });
      });
    } catch (err) {
      console.error('[dashboard/queries] chapters fetch failed:', err);
    }

    // Sort merged list desc and trim
    events.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return events.slice(0, limit);
  } catch (err) {
    console.error('[dashboard/queries] getRecentActivity failed:', err);
    return [];
  }
}
