/**
 * Living Lore Progress API
 *
 * Records episode/encounter completion and awards XP.
 * GET: Fetch user's Living Lore progress
 * POST: Record completion of an episode or encounter
 *
 * Note: Uses `as any` for table references until Supabase types are regenerated
 * after applying the living_lore migration.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { XP_AWARDS } from '@/lib/living-lore/progression';

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
    const { data: progress, error } = await (supabase as any)
      .from('living_lore_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ progress: progress ?? [] });
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
    const { contentType, contentSlug, actNumber, choices } = body;

    if (!contentType || !contentSlug || actNumber === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: contentType, contentSlug, actNumber' },
        { status: 400 }
      );
    }

    if (!['episode', 'encounter'].includes(contentType)) {
      return NextResponse.json({ error: 'contentType must be "episode" or "encounter"' }, { status: 400 });
    }

    const xp = contentType === 'episode' ? XP_AWARDS.READ_EPISODE : XP_AWARDS.COMPLETE_ENCOUNTER;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('living_lore_progress')
      .upsert(
        {
          user_id: user.id,
          content_type: contentType,
          content_slug: contentSlug,
          act_number: actNumber,
          completed_at: new Date().toISOString(),
          choices: choices ?? {},
          xp_awarded: xp,
        },
        { onConflict: 'user_id,content_slug' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Award XP to user profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc('increment_xp', { user_id_input: user.id, xp_amount: xp });

    return NextResponse.json({ progress: data, xpAwarded: xp });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
