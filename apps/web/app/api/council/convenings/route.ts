/**
 * Council Convenings API Route
 *
 * POST /api/council/convenings
 *   Log a new convening and update council streak / depth stats.
 *   Body: {
 *     seats_addressed: string[],
 *     imprint_notes: string,
 *     depth_rating: number (1–10),
 *     journal_entry?: string,
 *     duration_minutes?: number,
 *     started_at?: string (ISO),
 *     completed_at?: string (ISO)
 *   }
 *
 * GET  /api/council/convenings?limit=20&offset=0
 *   Paginated convening history for the authenticated user's council.
 *
 * Response format: always { data, error }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as _createClient } from '@/lib/supabase/server';

// Council tables not yet in generated Supabase types — cast to bypass strict checking
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createClient = async () => (await _createClient()) as any;

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Streak helpers
// ---------------------------------------------------------------------------

/**
 * Compares two ISO date strings by UTC calendar day only (YYYY-MM-DD).
 */
function toUTCDay(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function dayDiff(a: string, b: string): number {
  const msPerDay = 86_400_000;
  const da = new Date(toUTCDay(a)).getTime();
  const db = new Date(toUTCDay(b)).getTime();
  return Math.round((da - db) / msPerDay);
}

interface StreakUpdate {
  current_streak: number;
  longest_streak: number;
  total_convenings: number;
  council_depth_level: number;
  last_convening_at: string;
}

function computeStreakUpdate(
  current: {
    current_streak: number;
    longest_streak: number;
    total_convenings: number;
    last_convening_at: string | null;
  },
  now: string
): StreakUpdate {
  let { current_streak, longest_streak, total_convenings } = current;

  const lastDay = current.last_convening_at ? toUTCDay(current.last_convening_at) : null;
  const todayDay = toUTCDay(now);

  if (lastDay === null) {
    // First ever convening
    current_streak = 1;
  } else {
    const diff = dayDiff(todayDay, lastDay);
    if (diff === 0) {
      // Already convened today — streak unchanged
    } else if (diff === 1) {
      // Yesterday — extend streak
      current_streak = current_streak + 1;
    } else {
      // Gap of 2+ days — reset
      current_streak = 1;
    }
  }

  // Total convenings always increments (even same-day)
  total_convenings = total_convenings + 1;

  if (current_streak > longest_streak) {
    longest_streak = current_streak;
  }

  // Depth level: min(10, floor(log2(total_convenings + 1)))
  const council_depth_level = Math.min(10, Math.floor(Math.log2(total_convenings + 1)));

  return {
    current_streak,
    longest_streak,
    total_convenings,
    council_depth_level,
    last_convening_at: now,
  };
}

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

interface LogConveningBody {
  seats_addressed: string[];
  imprint_notes: Record<string, string>;
  depth_rating: number;
  journal_entry?: string;
  duration_minutes?: number;
  started_at?: string;
  completed_at?: string;
}

function validateLogConveningBody(
  body: unknown
): { valid: true; data: LogConveningBody } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  const b = body as Record<string, unknown>;

  if (!Array.isArray(b.seats_addressed) || b.seats_addressed.length === 0) {
    return { valid: false, error: 'seats_addressed must be a non-empty array' };
  }
  if (!b.seats_addressed.every((s) => typeof s === 'string')) {
    return { valid: false, error: 'seats_addressed must be an array of strings' };
  }

  if (!b.imprint_notes || typeof b.imprint_notes !== 'object' || Array.isArray(b.imprint_notes)) {
    return { valid: false, error: 'imprint_notes must be a JSON object (e.g. { "Lumira": "received clarity" })' };
  }

  const depth = Number(b.depth_rating);
  if (!Number.isFinite(depth) || depth < 1 || depth > 10) {
    return { valid: false, error: 'depth_rating must be a number between 1 and 10' };
  }

  const journal_entry =
    typeof b.journal_entry === 'string' && b.journal_entry.trim()
      ? b.journal_entry.trim()
      : undefined;

  let duration_minutes: number | undefined;
  if (b.duration_minutes !== undefined) {
    const d = Number(b.duration_minutes);
    if (!Number.isFinite(d) || d < 0) {
      return { valid: false, error: 'duration_minutes must be a non-negative number' };
    }
    duration_minutes = d;
  }

  const started_at =
    typeof b.started_at === 'string' && b.started_at.trim() ? b.started_at.trim() : undefined;
  const completed_at =
    typeof b.completed_at === 'string' && b.completed_at.trim() ? b.completed_at.trim() : undefined;

  return {
    valid: true,
    data: {
      seats_addressed: b.seats_addressed as string[],
      imprint_notes: b.imprint_notes as Record<string, string>,
      depth_rating: Math.round(depth),
      journal_entry,
      duration_minutes,
      started_at,
      completed_at,
    },
  };
}

// ---------------------------------------------------------------------------
// POST — log a convening
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse body
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { data: null, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Validate
    const validation = validateLogConveningBody(rawBody);
    if (!validation.valid) {
      return NextResponse.json(
        { data: null, error: validation.error },
        { status: 400 }
      );
    }

    const input = validation.data;

    // Fetch council
    const { data: council, error: councilError } = await supabase
      .from('luminor_councils')
      .select('id, current_streak, longest_streak, total_convenings, last_convening_at')
      .eq('user_id', user.id)
      .single();

    if (councilError || !council) {
      return NextResponse.json(
        { data: null, error: 'Council not found. Create your council first via POST /api/council' },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    // Compute updated streak/stats
    const streakUpdate = computeStreakUpdate(
      {
        current_streak: council.current_streak ?? 0,
        longest_streak: council.longest_streak ?? 0,
        total_convenings: council.total_convenings ?? 0,
        last_convening_at: council.last_convening_at ?? null,
      },
      now
    );

    // Insert convening record
    const { data: convening, error: conveningError } = await supabase
      .from('council_convenings')
      .insert({
        council_id: council.id,
        seats_addressed: input.seats_addressed,
        imprint_notes: input.imprint_notes,
        depth_rating: input.depth_rating,
        ...(input.journal_entry !== undefined && { journal_entry: input.journal_entry }),
        ...(input.duration_minutes !== undefined && { duration_minutes: input.duration_minutes }),
        ...(input.started_at !== undefined && { started_at: input.started_at }),
        ...(input.completed_at !== undefined && { completed_at: input.completed_at }),
        created_at: now,
      })
      .select('*')
      .single();

    if (conveningError || !convening) {
      console.error('[council/convenings POST] Insert error:', conveningError);
      return NextResponse.json(
        { data: null, error: 'Failed to log convening' },
        { status: 500 }
      );
    }

    // Update council stats
    const { error: updateError } = await supabase
      .from('luminor_councils')
      .update(streakUpdate)
      .eq('id', council.id);

    if (updateError) {
      // Non-fatal — convening is logged, stats will catch up on next request
      console.error('[council/convenings POST] Council stats update error:', updateError);
    }

    return NextResponse.json(
      {
        data: {
          convening,
          council_stats: streakUpdate,
        },
        error: null,
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[council/convenings POST]', err);
    return NextResponse.json({ data: null, error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// GET — paginated convening history
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse pagination params
    const { searchParams } = new URL(request.url);
    const rawLimit = searchParams.get('limit');
    const rawOffset = searchParams.get('offset');

    const limit = Math.min(100, Math.max(1, parseInt(rawLimit ?? '20', 10) || 20));
    const offset = Math.max(0, parseInt(rawOffset ?? '0', 10) || 0);

    // Resolve council
    const { data: council, error: councilError } = await supabase
      .from('luminor_councils')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (councilError || !council) {
      return NextResponse.json(
        { data: null, error: 'Council not found' },
        { status: 404 }
      );
    }

    // Fetch convenings
    const { data: convenings, error: fetchError, count } = await supabase
      .from('council_convenings')
      .select('*', { count: 'exact' })
      .eq('council_id', council.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (fetchError) {
      console.error('[council/convenings GET] Supabase error:', fetchError);
      return NextResponse.json(
        { data: null, error: 'Failed to fetch convenings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        convenings: convenings ?? [],
        pagination: {
          total: count ?? 0,
          limit,
          offset,
          has_more: (count ?? 0) > offset + limit,
        },
      },
      error: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[council/convenings GET]', err);
    return NextResponse.json({ data: null, error: message }, { status: 500 });
  }
}
