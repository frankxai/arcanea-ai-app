// =====================================================================
// LUMINOR COUNCIL — Service Layer
// =====================================================================
// Uses the server-side Supabase client (respects RLS + user sessions).
// Import createClient lazily inside each method so the module can be
// safely imported in both Server Components and Server Actions without
// triggering cookies() before the request context is ready.
// =====================================================================

import { createClient } from '@/lib/supabase/server';
import {
  BASE_LUMINORS,
  type LuminorCouncil,
  type CouncilSeat,
  type CouncilConvening,
  type CouncilStats,
  type CouncilWithSeats,
  type CreateCouncilInput,
  type AddSeatInput,
  type LogConveningInput,
} from './types';

// -----------------------------------------------------------------------
// Internal helpers
// -----------------------------------------------------------------------

/**
 * Compute council depth level from total convenings.
 * depth = floor(log2(total + 1)), capped at 10.
 */
function computeDepthLevel(totalConvenings: number): number {
  if (totalConvenings <= 0) return 1;
  return Math.min(10, Math.floor(Math.log2(totalConvenings + 1)));
}

/**
 * Returns the ISO date string (YYYY-MM-DD) for a UTC timestamp string,
 * or for today if no argument supplied.
 */
function toDateString(iso?: string | null): string {
  const d = iso ? new Date(iso) : new Date();
  return d.toISOString().slice(0, 10);
}

/**
 * Computes the new streak value given the previous last_convening_at.
 * Rules:
 *  - If last convening was today  → streak unchanged (already counted today)
 *  - If last convening was yesterday → streak + 1
 *  - Anything older (or null)     → reset to 1
 */
function computeNewStreak(
  currentStreak: number,
  lastConveningAt: string | null,
): number {
  if (!lastConveningAt) return 1;

  const today = toDateString();
  const lastDay = toDateString(lastConveningAt);

  if (lastDay === today) {
    // Second convening today — don't re-increment
    return currentStreak;
  }

  const yesterday = toDateString(
    new Date(Date.now() - 86_400_000).toISOString(),
  );

  if (lastDay === yesterday) {
    return currentStreak + 1;
  }

  return 1;
}

// -----------------------------------------------------------------------
// createCouncil
// -----------------------------------------------------------------------

/**
 * Creates a new council for the given user and seeds the 9 base seats.
 * Throws if the user already has a council (unique constraint on user_id).
 */
export async function createCouncil(
  userId: string,
  input: CreateCouncilInput = {},
): Promise<CouncilWithSeats> {
  const supabase = await createClient();

  // Insert council row
  const { data: council, error: councilError } = await supabase
    .from('luminor_councils')
    .insert({
      user_id: userId,
      name: input.name ?? 'Council of Luminor',
    })
    .select()
    .single();

  if (councilError) throw councilError;

  // Seed the 9 base seats
  const baseSeats = BASE_LUMINORS.map((def) => ({
    council_id: council.id,
    luminor_name: def.luminor_name,
    luminor_domain: def.luminor_domain,
    frequency_alignment: def.frequency_alignment,
    imprint_capability: def.imprint_capability,
    is_base: true,
    seat_order: def.seat_order,
    personality_traits: def.personality_traits,
    visual_description: def.visual_description,
  }));

  const { data: seats, error: seatsError } = await supabase
    .from('council_seats')
    .insert(baseSeats)
    .select();

  if (seatsError) throw seatsError;

  return { ...council, seats: seats ?? [] };
}

// -----------------------------------------------------------------------
// getCouncil
// -----------------------------------------------------------------------

/**
 * Returns the user's council with all seats, or null if not yet created.
 */
export async function getCouncil(userId: string): Promise<CouncilWithSeats | null> {
  const supabase = await createClient();

  const { data: council, error: councilError } = await supabase
    .from('luminor_councils')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (councilError) {
    // PostgREST returns PGRST116 when no rows match
    if (councilError.code === 'PGRST116') return null;
    throw councilError;
  }

  const { data: seats, error: seatsError } = await supabase
    .from('council_seats')
    .select('*')
    .eq('council_id', council.id)
    .order('seat_order', { ascending: true });

  if (seatsError) throw seatsError;

  return { ...council, seats: seats ?? [] };
}

// -----------------------------------------------------------------------
// addSeat
// -----------------------------------------------------------------------

/**
 * Adds a custom (non-base) seat to the council.
 */
export async function addSeat(
  councilId: string,
  input: AddSeatInput,
): Promise<CouncilSeat> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('council_seats')
    .insert({
      council_id: councilId,
      luminor_name: input.luminor_name,
      luminor_domain: input.luminor_domain,
      frequency_alignment: input.frequency_alignment,
      imprint_capability: input.imprint_capability,
      is_base: false,
      seat_order: input.seat_order ?? 0,
      personality_traits: input.personality_traits ?? null,
      visual_description: input.visual_description ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// -----------------------------------------------------------------------
// removeSeat
// -----------------------------------------------------------------------

/**
 * Removes a custom seat. Throws if the seat is a base seat (is_base=true)
 * because base seats are permanent.
 */
export async function removeSeat(seatId: string): Promise<void> {
  const supabase = await createClient();

  // Verify the seat is not a base seat before attempting delete.
  // The RLS policy also enforces this, but we give a clear error here.
  const { data: seat, error: fetchError } = await supabase
    .from('council_seats')
    .select('id, is_base')
    .eq('id', seatId)
    .single();

  if (fetchError) throw fetchError;
  if (!seat) throw new Error('Seat not found');
  if (seat.is_base) {
    throw new Error('Base seats cannot be removed from the council');
  }

  const { error } = await supabase
    .from('council_seats')
    .delete()
    .eq('id', seatId)
    .eq('is_base', false);

  if (error) throw error;
}

// -----------------------------------------------------------------------
// logConvening
// -----------------------------------------------------------------------

/**
 * Logs a completed convening session.
 * Updates: total_convenings, current_streak, longest_streak,
 *          council_depth_level, last_convening_at on the council row.
 */
export async function logConvening(
  councilId: string,
  data: LogConveningInput,
): Promise<CouncilConvening> {
  const supabase = await createClient();

  // Fetch current council state to compute streak/depth
  const { data: council, error: fetchError } = await supabase
    .from('luminor_councils')
    .select('total_convenings, current_streak, longest_streak, last_convening_at')
    .eq('id', councilId)
    .single();

  if (fetchError) throw fetchError;

  const now = new Date().toISOString();
  const newTotal = council.total_convenings + 1;
  const newStreak = computeNewStreak(
    council.current_streak,
    council.last_convening_at,
  );
  const newLongest = Math.max(
    council.longest_streak,
    newStreak,
  );
  const newDepth = computeDepthLevel(newTotal);

  // Insert convening log
  const { data: convening, error: conveningError } = await supabase
    .from('council_convenings')
    .insert({
      council_id: councilId,
      completed_at: now,
      duration_minutes: data.duration_minutes ?? null,
      seats_addressed: data.seats_addressed ?? [],
      imprint_notes: data.imprint_notes ?? {},
      depth_rating: data.depth_rating ?? null,
      journal_entry: data.journal_entry ?? null,
    })
    .select()
    .single();

  if (conveningError) throw conveningError;

  // Update council counters atomically
  const { error: updateError } = await supabase
    .from('luminor_councils')
    .update({
      total_convenings: newTotal,
      current_streak: newStreak,
      longest_streak: newLongest,
      council_depth_level: newDepth,
      last_convening_at: now,
    })
    .eq('id', councilId);

  if (updateError) throw updateError;

  return convening;
}

// -----------------------------------------------------------------------
// getConveningHistory
// -----------------------------------------------------------------------

/**
 * Returns paginated convening history for a council, newest first.
 */
export async function getConveningHistory(
  councilId: string,
  limit = 20,
  offset = 0,
): Promise<CouncilConvening[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('council_convenings')
    .select('*')
    .eq('council_id', councilId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data ?? [];
}

// -----------------------------------------------------------------------
// getCouncilStats
// -----------------------------------------------------------------------

/**
 * Returns computed statistics for a council, including rolling-window
 * counts and average depth rating.
 */
export async function getCouncilStats(councilId: string): Promise<CouncilStats> {
  const supabase = await createClient();

  // Fetch the council base fields
  const { data: council, error: councilError } = await supabase
    .from('luminor_councils')
    .select('total_convenings, current_streak, longest_streak, council_depth_level')
    .eq('id', councilId)
    .single();

  if (councilError) throw councilError;

  // Fetch all convenings (only completed ones for stats)
  const { data: convenings, error: conveningsError } = await supabase
    .from('council_convenings')
    .select('created_at, depth_rating, seats_addressed')
    .eq('council_id', councilId)
    .not('completed_at', 'is', null);

  if (conveningsError) throw conveningsError;

  const now = Date.now();
  const sevenDaysAgo = new Date(now - 7 * 86_400_000).toISOString();
  const thirtyDaysAgo = new Date(now - 30 * 86_400_000).toISOString();

  const rows = convenings ?? [];

  const last7 = rows.filter((r) => r.created_at >= sevenDaysAgo).length;
  const last30 = rows.filter((r) => r.created_at >= thirtyDaysAgo).length;

  const ratingsWithValue = rows.filter((r) => r.depth_rating !== null);
  const avgDepth =
    ratingsWithValue.length > 0
      ? ratingsWithValue.reduce((sum, r) => sum + (r.depth_rating ?? 0), 0) /
        ratingsWithValue.length
      : null;

  // Most active seat: flatten all seats_addressed arrays and find the mode
  const seatCounts = new Map<string, number>();
  for (const row of rows) {
    for (const seatId of row.seats_addressed ?? []) {
      seatCounts.set(seatId, (seatCounts.get(seatId) ?? 0) + 1);
    }
  }

  let mostActiveSeatId: string | null = null;
  let topCount = 0;
  for (const [seatId, count] of seatCounts.entries()) {
    if (count > topCount) {
      topCount = count;
      mostActiveSeatId = seatId;
    }
  }

  const c = council;

  return {
    council_id: councilId,
    total_convenings: c.total_convenings,
    current_streak: c.current_streak,
    longest_streak: c.longest_streak,
    council_depth_level: c.council_depth_level,
    convenings_last_7_days: last7,
    convenings_last_30_days: last30,
    avg_depth_rating: avgDepth !== null ? Math.round(avgDepth * 100) / 100 : null,
    most_active_seat_id: mostActiveSeatId,
  };
}
