/**
 * Council API Route
 *
 * GET  /api/council
 *   Returns the authenticated user's council with all seats.
 *   Auto-creates council + seeds 9 base seats if none exists.
 *
 * POST /api/council
 *   Idempotent create. Returns existing council or creates a new one.
 *
 * Response format: always { data, error }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Base nine advisors seeded on council creation
// ---------------------------------------------------------------------------

import { COUNCIL_ADVISORS } from '@/lib/council/types';

const BASE_ADVISORS = COUNCIL_ADVISORS.map((a) => ({
  luminor_name: a.luminor_name,
  luminor_domain: a.luminor_domain,
  frequency_alignment: a.frequency_alignment,
  imprint_capability: a.imprint_capability,
  seat_order: a.seat_order,
}));

// ---------------------------------------------------------------------------
// Helper: create a council + seed base seats in a single operation
// ---------------------------------------------------------------------------

async function createCouncilWithSeats(userId: string) {
  const supabase = await createClient();
  const db = supabase as any;

  // Insert council row
  const { data: council, error: councilError } = await db
    .from('luminor_councils')
    .insert({
      user_id: userId,
      council_depth_level: 1,
      current_streak: 0,
      longest_streak: 0,
      total_convenings: 0,
    })
    .select('*')
    .single();

  if (councilError || !council) {
    throw new Error(councilError?.message ?? 'Failed to create council');
  }

  // Seed base seats
  const seats = BASE_ADVISORS.map((luminor) => ({
    council_id: council.id,
    is_base: true,
    ...luminor,
  }));

  const { data: seatedLuminors, error: seatsError } = await db
    .from('council_seats')
    .insert(seats)
    .select('*');

  if (seatsError) {
    // Council created but seats failed — still return council, frontend can retry
    console.error('[council] Failed to seed base seats:', seatsError);
    return { ...council, seats: [] };
  }

  return { ...council, seats: seatedLuminors ?? [] };
}

// ---------------------------------------------------------------------------
// Helper: fetch full council (council row + all seats)
// ---------------------------------------------------------------------------

async function fetchCouncilWithSeats(userId: string) {
  const supabase = await createClient();
  const db = supabase as any;

  const { data: council, error } = await db
    .from('luminor_councils')
    .select('*, seats:council_seats(*)')
    .eq('user_id', userId)
    .order('seat_order', { referencedTable: 'council_seats', ascending: true })
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return council;
}

// ---------------------------------------------------------------------------
// GET — return council, auto-creating if absent
// ---------------------------------------------------------------------------

export async function GET(_request: NextRequest) {
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

    let council = await fetchCouncilWithSeats(user.id);

    if (!council) {
      council = await createCouncilWithSeats(user.id);
    }

    return NextResponse.json({ data: council, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[council GET]', err);
    return NextResponse.json({ data: null, error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST — idempotent create
// ---------------------------------------------------------------------------

export async function POST(_request: NextRequest) {
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

    // Return existing council if present
    let council = await fetchCouncilWithSeats(user.id);

    if (council) {
      return NextResponse.json({ data: council, error: null }, { status: 200 });
    }

    // Create new council
    council = await createCouncilWithSeats(user.id);

    return NextResponse.json({ data: council, error: null }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[council POST]', err);
    return NextResponse.json({ data: null, error: message }, { status: 500 });
  }
}
