/**
 * Council Seats API Route
 *
 * POST /api/council/seats
 *   Add a custom seat to the authenticated user's council.
 *   Body: {
 *     luminor_name: string,
 *     luminor_domain: string,
 *     frequency_alignment: number,
 *     imprint_capability: string,
 *     personality_traits?: string,
 *     visual_description?: string
 *   }
 *
 * Response format: always { data, error }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

interface AddSeatBody {
  luminor_name: string;
  luminor_domain: string;
  frequency_alignment: number;
  imprint_capability: string;
  personality_traits?: string;
  visual_description?: string;
}

function validateAddSeatBody(body: unknown): { valid: true; data: AddSeatBody } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  const b = body as Record<string, unknown>;

  if (!b.luminor_name || typeof b.luminor_name !== 'string' || !b.luminor_name.trim()) {
    return { valid: false, error: 'luminor_name is required and must be a non-empty string' };
  }
  if (b.luminor_name.length > 80) {
    return { valid: false, error: 'luminor_name must be 80 characters or fewer' };
  }

  if (!b.luminor_domain || typeof b.luminor_domain !== 'string' || !b.luminor_domain.trim()) {
    return { valid: false, error: 'luminor_domain is required and must be a non-empty string' };
  }
  if (b.luminor_domain.length > 120) {
    return { valid: false, error: 'luminor_domain must be 120 characters or fewer' };
  }

  if (b.frequency_alignment === undefined || b.frequency_alignment === null) {
    return { valid: false, error: 'frequency_alignment is required' };
  }
  const freq = Number(b.frequency_alignment);
  if (!Number.isFinite(freq) || freq < 0 || freq > 99999) {
    return { valid: false, error: 'frequency_alignment must be a number between 0 and 99999' };
  }

  if (!b.imprint_capability || typeof b.imprint_capability !== 'string' || !b.imprint_capability.trim()) {
    return { valid: false, error: 'imprint_capability is required and must be a non-empty string' };
  }
  if (b.imprint_capability.length > 500) {
    return { valid: false, error: 'imprint_capability must be 500 characters or fewer' };
  }

  const personality_traits =
    typeof b.personality_traits === 'string' && b.personality_traits.trim()
      ? b.personality_traits.trim()
      : undefined;

  const visual_description =
    typeof b.visual_description === 'string' && b.visual_description.trim()
      ? b.visual_description.trim()
      : undefined;

  return {
    valid: true,
    data: {
      luminor_name: b.luminor_name.trim(),
      luminor_domain: b.luminor_domain.trim(),
      frequency_alignment: freq,
      imprint_capability: b.imprint_capability.trim(),
      personality_traits,
      visual_description,
    },
  };
}

// ---------------------------------------------------------------------------
// POST — add custom seat
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
    const validation = validateAddSeatBody(rawBody);
    if (!validation.valid) {
      return NextResponse.json(
        { data: null, error: validation.error },
        { status: 400 }
      );
    }

    const input = validation.data;

    // Resolve the user's council — must exist before adding a seat
    const { data: council, error: councilError } = await supabase
      .from('luminor_councils' as any)
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (councilError || !council) {
      return NextResponse.json(
        { data: null, error: 'Council not found. Create your council first via POST /api/council' },
        { status: 404 }
      );
    }

    // Determine next seat_order (max of current seats + 1)
    const { data: existingSeats } = await supabase
      .from('council_seats' as any)
      .select('seat_order')
      .eq('council_id', council.id)
      .order('seat_order', { ascending: false })
      .limit(1);

    const maxOrder = existingSeats?.[0]?.seat_order ?? 0;

    // Insert custom seat
    const { data: seat, error: seatError } = await supabase
      .from('council_seats' as any)
      .insert({
        council_id: council.id,
        is_base: false,
        seat_order: maxOrder + 1,
        luminor_name: input.luminor_name,
        luminor_domain: input.luminor_domain,
        frequency_alignment: input.frequency_alignment,
        imprint_capability: input.imprint_capability,
        ...(input.personality_traits !== undefined && { personality_traits: input.personality_traits }),
        ...(input.visual_description !== undefined && { visual_description: input.visual_description }),
      })
      .select('*')
      .single();

    if (seatError || !seat) {
      console.error('[council/seats POST] Supabase error:', seatError);
      return NextResponse.json(
        { data: null, error: 'Failed to add seat' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: seat, error: null }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[council/seats POST]', err);
    return NextResponse.json({ data: null, error: message }, { status: 500 });
  }
}
