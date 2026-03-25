/**
 * Living Lore Crew Bonds API
 *
 * GET: Fetch user's bond levels with all crew members
 * POST: Update bond after interaction (chat, encounter, lore reading)
 *
 * Note: Uses `as any` for table references until Supabase types are regenerated.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateBondIncrease } from '@/lib/living-lore/progression';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: bonds, error } = await (supabase as any)
      .from('crew_bonds')
      .select('*')
      .eq('user_id', user.id)
      .order('bond_level', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bonds: bonds ?? [] });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { crewMemberId, interactionType } = body;

    if (!crewMemberId || !interactionType) {
      return NextResponse.json(
        { error: 'Missing required fields: crewMemberId, interactionType' },
        { status: 400 }
      );
    }

    if (!['chat', 'encounter', 'lore_read'].includes(interactionType)) {
      return NextResponse.json(
        { error: 'interactionType must be "chat", "encounter", or "lore_read"' },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('crew_bonds')
      .select('*')
      .eq('user_id', user.id)
      .eq('crew_member_id', crewMemberId)
      .single();

    const currentLevel = existing?.bond_level ?? 0;
    const increase = calculateBondIncrease(interactionType, currentLevel);
    const newLevel = Math.min(100, currentLevel + increase);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {
      user_id: user.id,
      crew_member_id: crewMemberId,
      bond_level: newLevel,
      last_interaction: new Date().toISOString(),
    };

    if (interactionType === 'chat') {
      updateData.conversations = (existing?.conversations ?? 0) + 1;
    } else if (interactionType === 'encounter') {
      updateData.encounters_shared = (existing?.encounters_shared ?? 0) + 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('crew_bonds')
      .upsert(updateData, { onConflict: 'user_id,crew_member_id' })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bond: data, increase, newLevel });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
