/**
 * Book Ratings API
 *
 * GET    /api/books/[slug]/ratings — list ratings + summary (public, non-hidden only)
 * POST   /api/books/[slug]/ratings — submit a new rating (auth required, 1 per user per book)
 * PATCH  /api/books/[slug]/ratings — update the caller's existing rating
 * DELETE /api/books/[slug]/ratings — delete the caller's rating
 *
 * RLS policies in 20260410000001_open_library.sql enforce:
 *   - Public read of non-hidden ratings
 *   - Users can only insert/update/delete rows where user_id = auth.uid()
 *   - Users cannot rate books they are listed as authors of
 *
 * We still perform explicit validation server-side for clearer error messages.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_REVIEW_CHARS = 5000;

// The generated Database types haven't been regenerated since the
// 20260410000001_open_library migration. Cast the client as `any` at
// the table-access boundary — this matches the existing pattern used in
// lib/books/cover-resolver.ts and app/api/books/covers/route.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

type RatingRow = {
  id: string;
  stars: number;
  review: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

interface RatingSummary {
  average: number;
  count: number;
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
}

interface RatingResponse {
  id: string;
  stars: number;
  review: string | null;
  user: { id: string; displayName: string; avatarUrl: string | null };
  createdAt: string;
  updatedAt: string;
}

interface RatingsPayload {
  ratings: RatingResponse[];
  summary: RatingSummary;
  myRating: { stars: number; review: string | null } | null;
}

function emptySummary(): RatingSummary {
  return { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
}

function unavailable(): NextResponse {
  return NextResponse.json(
    {
      ratings: [],
      summary: emptySummary(),
      myRating: null,
      unavailable: true,
    },
    { status: 200 },
  );
}

function validateStars(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  const n = Math.trunc(value);
  if (n < 1 || n > 5) return null;
  return n;
}

function validateReview(value: unknown): string | null | 'invalid' {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string') return 'invalid';
  if (value.length > MAX_REVIEW_CHARS) return 'invalid';
  return value;
}

async function resolveBookId(
  supabase: DB,
  slug: string,
): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('books')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) return null;
  return data as { id: string };
}

async function loadPayload(
  supabase: DB,
  bookId: string,
  currentUserId: string | null,
): Promise<RatingsPayload> {
  const { data: ratingsData } = await supabase
    .from('book_ratings')
    .select('id, stars, review, user_id, created_at, updated_at')
    .eq('book_id', bookId)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false });

  const rows = ((ratingsData ?? []) as unknown) as RatingRow[];

  // Summary
  const summary = emptySummary();
  for (const r of rows) {
    summary.count += 1;
    summary.distribution[r.stars as 1 | 2 | 3 | 4 | 5] += 1;
  }
  if (summary.count > 0) {
    const total = rows.reduce((acc, r) => acc + r.stars, 0);
    summary.average = Math.round((total / summary.count) * 100) / 100;
  }

  // Profiles (batch lookup)
  const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
  let profileMap = new Map<string, ProfileRow>();
  if (userIds.length > 0) {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', userIds);
    const profiles = ((profilesData ?? []) as unknown) as ProfileRow[];
    profileMap = new Map(profiles.map((p) => [p.id, p]));
  }

  const ratings: RatingResponse[] = rows.map((r) => {
    const profile = profileMap.get(r.user_id);
    const displayName =
      profile?.display_name?.trim() ||
      profile?.username?.trim() ||
      'Anonymous Reader';
    return {
      id: r.id,
      stars: r.stars,
      review: r.review,
      user: {
        id: r.user_id,
        displayName,
        avatarUrl: profile?.avatar_url ?? null,
      },
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  });

  const mine = currentUserId
    ? rows.find((r) => r.user_id === currentUserId) ?? null
    : null;
  const myRating = mine ? { stars: mine.stars, review: mine.review } : null;

  return { ratings, summary, myRating };
}

// ------------------------------------------------------------------
// GET
// ------------------------------------------------------------------
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  try {
    const supabase = (await createClient()) as DB;
    const book = await resolveBookId(supabase, slug);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    const payload = await loadPayload(supabase, book.id, user?.id ?? null);
    return NextResponse.json(payload);
  } catch (err) {
    console.error('[ratings GET] unavailable:', err);
    return unavailable();
  }
}

// ------------------------------------------------------------------
// POST — create (or upsert) rating
// ------------------------------------------------------------------
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  let body: { stars?: unknown; review?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const stars = validateStars(body.stars);
  if (stars === null) {
    return NextResponse.json(
      { error: 'stars must be an integer between 1 and 5' },
      { status: 400 },
    );
  }
  const review = validateReview(body.review);
  if (review === 'invalid') {
    return NextResponse.json(
      { error: `review must be a string up to ${MAX_REVIEW_CHARS} characters` },
      { status: 400 },
    );
  }

  try {
    const supabase = (await createClient()) as DB;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const book = await resolveBookId(supabase, slug);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Block authors from rating their own book
    const { data: authorship } = await supabase
      .from('book_authors')
      .select('role')
      .eq('book_id', book.id)
      .eq('user_id', user.id)
      .maybeSingle();
    if (authorship) {
      return NextResponse.json(
        { error: 'Authors cannot rate their own books' },
        { status: 403 },
      );
    }

    // Upsert so POST is idempotent per (book_id, user_id)
    const { error: upsertError } = await supabase
      .from('book_ratings')
      .upsert(
        {
          book_id: book.id,
          user_id: user.id,
          stars,
          review,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'book_id,user_id' },
      );

    if (upsertError) {
      console.error('[ratings POST] upsert failed:', upsertError);
      return NextResponse.json(
        { error: 'Failed to save rating' },
        { status: 500 },
      );
    }

    const payload = await loadPayload(supabase, book.id, user.id);
    return NextResponse.json(payload, { status: 201 });
  } catch (err) {
    console.error('[ratings POST] error:', err);
    return NextResponse.json(
      { error: 'Ratings service temporarily unavailable' },
      { status: 503 },
    );
  }
}

// ------------------------------------------------------------------
// PATCH — update caller's rating
// ------------------------------------------------------------------
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  let body: { stars?: unknown; review?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const updates: { stars?: number; review?: string | null; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };

  if (body.stars !== undefined) {
    const stars = validateStars(body.stars);
    if (stars === null) {
      return NextResponse.json(
        { error: 'stars must be an integer between 1 and 5' },
        { status: 400 },
      );
    }
    updates.stars = stars;
  }

  if (body.review !== undefined) {
    const review = validateReview(body.review);
    if (review === 'invalid') {
      return NextResponse.json(
        { error: `review must be a string up to ${MAX_REVIEW_CHARS} characters` },
        { status: 400 },
      );
    }
    updates.review = review;
  }

  if (updates.stars === undefined && updates.review === undefined) {
    return NextResponse.json(
      { error: 'No updatable fields provided' },
      { status: 400 },
    );
  }

  try {
    const supabase = (await createClient()) as DB;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const book = await resolveBookId(supabase, slug);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const { data: existing } = await supabase
      .from('book_ratings')
      .select('id')
      .eq('book_id', book.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json(
        { error: 'No existing rating to update — use POST instead' },
        { status: 404 },
      );
    }

    const { error: updateError } = await supabase
      .from('book_ratings')
      .update(updates)
      .eq('book_id', book.id)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('[ratings PATCH] update failed:', updateError);
      return NextResponse.json(
        { error: 'Failed to update rating' },
        { status: 500 },
      );
    }

    const payload = await loadPayload(supabase, book.id, user.id);
    return NextResponse.json(payload);
  } catch (err) {
    console.error('[ratings PATCH] error:', err);
    return NextResponse.json(
      { error: 'Ratings service temporarily unavailable' },
      { status: 503 },
    );
  }
}

// ------------------------------------------------------------------
// DELETE — remove caller's rating
// ------------------------------------------------------------------
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  try {
    const supabase = (await createClient()) as DB;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const book = await resolveBookId(supabase, slug);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from('book_ratings')
      .delete()
      .eq('book_id', book.id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('[ratings DELETE] failed:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete rating' },
        { status: 500 },
      );
    }

    const payload = await loadPayload(supabase, book.id, user.id);
    return NextResponse.json(payload);
  } catch (err) {
    console.error('[ratings DELETE] error:', err);
    return NextResponse.json(
      { error: 'Ratings service temporarily unavailable' },
      { status: 503 },
    );
  }
}
