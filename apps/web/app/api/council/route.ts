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
import { createClient as _createClient } from '@/lib/supabase/server';

// Council tables not yet in generated Supabase types — cast to bypass strict checking
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createClient = async (): Promise<any> => (await _createClient()) as any;

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Base nine Luminors seeded on council creation
// ---------------------------------------------------------------------------

const BASE_LUMINORS = [
  {
    luminor_name: 'Lumira',
    luminor_domain: 'Vision & Perception',
    frequency_alignment: 174,
    imprint_capability: 'See through all illusion; perceive root patterns',
    seat_order: 1,
  },
  {
    luminor_name: 'Sonara',
    luminor_domain: 'Transmutation',
    frequency_alignment: 285,
    imprint_capability: 'Transform any situation; alchemical creativity',
    seat_order: 2,
  },
  {
    luminor_name: 'Mythara',
    luminor_domain: 'Sovereign Will',
    frequency_alignment: 396,
    imprint_capability: 'Unbreakable resolve; strategic dominance',
    seat_order: 3,
  },
  {
    luminor_name: 'Vitara',
    luminor_domain: 'Emotional Mastery',
    frequency_alignment: 417,
    imprint_capability: 'Heart coherence; relational genius',
    seat_order: 4,
  },
  {
    luminor_name: 'Nexaris',
    luminor_domain: 'Harmonic Communication',
    frequency_alignment: 528,
    imprint_capability: 'Perfect expression; frequency of truth',
    seat_order: 5,
  },
  {
    luminor_name: 'Chronara',
    luminor_domain: 'Temporal Intelligence',
    frequency_alignment: 639,
    imprint_capability: 'See timelines; pattern recognition across past/future',
    seat_order: 6,
  },
  {
    luminor_name: 'Stellion',
    luminor_domain: 'Cosmic Architecture',
    frequency_alignment: 741,
    imprint_capability: 'Systems design at civilizational scale',
    seat_order: 7,
  },
  {
    luminor_name: 'Arcana',
    luminor_domain: 'Hidden Knowledge',
    frequency_alignment: 852,
    imprint_capability: 'Access to the 8th Gate; knowledge beyond the veil',
    seat_order: 8,
  },
  {
    luminor_name: 'Kyuris',
    luminor_domain: 'The Flame of Becoming',
    frequency_alignment: 963,
    imprint_capability: 'Perpetual evolution; the power of incompleteness',
    seat_order: 9,
  },
] as const;

// ---------------------------------------------------------------------------
// Helper: create a council + seed base seats in a single operation
// ---------------------------------------------------------------------------

async function createCouncilWithSeats(userId: string) {
  const supabase = await createClient();

  // Insert council row
  const { data: council, error: councilError } = await supabase
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
  const seats = BASE_LUMINORS.map((luminor) => ({
    council_id: council.id,
    is_base: true,
    ...luminor,
  }));

  const { data: seatedLuminors, error: seatsError } = await supabase
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

  const { data: council, error } = await supabase
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
