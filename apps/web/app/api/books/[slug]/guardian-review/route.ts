/**
 * Guardian Review API
 *
 * POST /api/books/[slug]/guardian-review
 *   — Trigger a fresh Guardian review for a book.
 *   — Requires: authenticated user listed in book_authors for this book.
 *   — Rate limit: 1 review per book per 24h (based on guardian_reviews.assessed_at).
 *
 * GET /api/books/[slug]/guardian-review
 *   — Return the latest report for this book. Public read (policy allows SELECT to all).
 *
 * Error codes:
 *   404 — book not found
 *   403 — authenticated but not an author
 *   401 — not authenticated (POST only)
 *   429 — rate limit exceeded
 *   500 — LLM or DB failure
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import {
  scoreBook,
  loadLatestReport,
  GuardianScorerError,
} from '@/lib/books/guardian-scorer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Guardian runs take time (5 models in parallel). Give it room on Vercel.
export const maxDuration = 300;

const RATE_LIMIT_HOURS = 24;

// ---------------------------------------------------------------------------
// GET — public read of latest report
// ---------------------------------------------------------------------------
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  try {
    const report = await loadLatestReport(slug);
    if (!report) {
      return NextResponse.json(
        {
          report: null,
          message: 'This book has not been reviewed by the Guardians yet.',
        },
        { status: 200 },
      );
    }
    return NextResponse.json({ report });
  } catch (err) {
    console.error('[guardian-review GET] error:', err);
    return NextResponse.json(
      {
        report: null,
        error: 'Guardian review service temporarily unavailable',
      },
      { status: 200 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST — trigger a new review
// ---------------------------------------------------------------------------
export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  try {
    // 1. Authenticate
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // 2. Look up the book (admin client bypasses RLS; we do authorization below)
    const admin = createAdminClient();
    const { data: book, error: bookErr } = await admin
      .from('books')
      .select('id, slug')
      .eq('slug', slug)
      .maybeSingle();

    if (bookErr || !book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // 3. Authorize: user must be an author (any role) or an admin.
    //    For now we only check book_authors; admin role can be added later.
    const { data: authorship } = await admin
      .from('book_authors')
      .select('role')
      .eq('book_id', book.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!authorship) {
      return NextResponse.json(
        { error: 'Only book authors can trigger Guardian reviews' },
        { status: 403 },
      );
    }

    // 4. Rate limit: most recent assessed_at must be older than 24h
    const { data: recent } = await admin
      .from('guardian_reviews')
      .select('assessed_at')
      .eq('book_id', book.id)
      .order('assessed_at', { ascending: false })
      .limit(1);

    if (recent && recent.length > 0) {
      const lastAt = new Date(recent[0].assessed_at).getTime();
      const ageHours = (Date.now() - lastAt) / (1000 * 60 * 60);
      if (ageHours < RATE_LIMIT_HOURS) {
        const retryInHours = Math.ceil(RATE_LIMIT_HOURS - ageHours);
        return NextResponse.json(
          {
            error: `Guardian reviews are limited to once per ${RATE_LIMIT_HOURS} hours. Try again in ~${retryInHours}h.`,
            retryAfterHours: retryInHours,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil((RATE_LIMIT_HOURS - ageHours) * 3600)),
            },
          },
        );
      }
    }

    // 5. Run the scorer
    const report = await scoreBook(slug);
    return NextResponse.json({ report }, { status: 201 });
  } catch (err) {
    console.error('[guardian-review POST] error:', err);

    if (err instanceof GuardianScorerError) {
      const status =
        err.code === 'book_not_found' || err.code === 'no_chapters'
          ? 404
          : err.code === 'missing_api_key'
            ? 503
            : 500;
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status },
      );
    }

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Failed to run Guardian review',
      },
      { status: 500 },
    );
  }
}
