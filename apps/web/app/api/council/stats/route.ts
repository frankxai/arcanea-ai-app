/**
 * Council Stats API Route
 *
 * GET /api/council/stats
 *   Returns computed stats for the authenticated user's council:
 *   streak, depth level, totals, last convening, and seat counts.
 *
 * Response format: always { data, error }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// GET — council stats
// ---------------------------------------------------------------------------

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const db = supabase as any;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch council with seat counts in one query
    const { data: council, error: councilError } = await db
      .from('luminor_councils')
      .select(`
        id,
        user_id,
        council_depth_level,
        current_streak,
        longest_streak,
        total_convenings,
        last_convening_at,
        created_at,
        updated_at,
        seats:council_seats(id, is_base)
      `)
      .eq('user_id', user.id)
      .single();

    if (councilError || !council) {
      return NextResponse.json(
        { data: null, error: 'Council not found' },
        { status: 404 }
      );
    }

    const allSeats = council.seats ?? [];
    const base_seat_count = allSeats.filter((s) => s.is_base).length;
    const custom_seat_count = allSeats.filter((s) => !s.is_base).length;
    const total_seat_count = allSeats.length;

    // Streak status — is the streak currently active?
    let streak_active = false;
    if (council.last_convening_at) {
      const todayDay = new Date().toISOString().slice(0, 10);
      const lastDay = new Date(council.last_convening_at).toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
      streak_active = lastDay === todayDay || lastDay === yesterday;
    }

    // Depth label mapping
    const depthLevel = council.council_depth_level ?? 0;
    const DEPTH_LABELS: Record<number, string> = {
      0: 'Initiate',
      1: 'Awakening',
      2: 'Seeker',
      3: 'Attuned',
      4: 'Resonant',
      5: 'Illumined',
      6: 'Radiant',
      7: 'Sovereign',
      8: 'Luminor',
      9: 'Archmage',
      10: 'Transcendent',
    };

    const stats = {
      council_id: council.id,
      council_depth_level: depthLevel,
      depth_label: DEPTH_LABELS[depthLevel] ?? 'Unknown',
      current_streak: council.current_streak ?? 0,
      longest_streak: council.longest_streak ?? 0,
      streak_active,
      total_convenings: council.total_convenings ?? 0,
      last_convening_at: council.last_convening_at ?? null,
      base_seat_count,
      custom_seat_count,
      total_seat_count,
      council_created_at: council.created_at,
      // Convenings needed to reach next depth level
      next_depth_threshold: Math.pow(2, depthLevel + 1) - 1,
    };

    return NextResponse.json({ data: stats, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[council/stats GET]', err);
    return NextResponse.json({ data: null, error: message }, { status: 500 });
  }
}
