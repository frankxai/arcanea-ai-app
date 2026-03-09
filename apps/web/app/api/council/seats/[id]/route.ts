/**
 * Council Seat [id] API Route
 *
 * DELETE /api/council/seats/[id]
 *   Remove a custom seat from the user's council.
 *   Base seats (is_base = true) cannot be deleted.
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
// DELETE — remove custom seat
// ---------------------------------------------------------------------------

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: seatId } = await params;

    if (!seatId || typeof seatId !== 'string') {
      return NextResponse.json(
        { data: null, error: 'Seat ID is required' },
        { status: 400 }
      );
    }

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

    // Fetch the seat to verify ownership and base status
    const { data: seat, error: fetchError } = await supabase
      .from('council_seats')
      .select('id, is_base, council_id, council:luminor_councils(user_id)')
      .eq('id', seatId)
      .single();

    if (fetchError || !seat) {
      return NextResponse.json(
        { data: null, error: 'Seat not found' },
        { status: 404 }
      );
    }

    // Verify the seat belongs to this user's council
    const council = Array.isArray(seat.council) ? seat.council[0] : seat.council;
    if (!council || (council as { user_id: string }).user_id !== user.id) {
      return NextResponse.json(
        { data: null, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Guard: base seats cannot be deleted
    if (seat.is_base) {
      return NextResponse.json(
        { data: null, error: 'Base seats cannot be removed from the council' },
        { status: 400 }
      );
    }

    // Delete the seat
    const { error: deleteError } = await supabase
      .from('council_seats')
      .delete()
      .eq('id', seatId);

    if (deleteError) {
      console.error('[council/seats/[id] DELETE] Supabase error:', deleteError);
      return NextResponse.json(
        { data: null, error: 'Failed to remove seat' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { id: seatId }, error: null }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[council/seats/[id] DELETE]', err);
    return NextResponse.json({ data: null, error: message }, { status: 500 });
  }
}
