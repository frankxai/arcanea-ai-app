/**
 * Profile by Username API
 *
 * GET /api/profiles/[username] - Fetch a public profile by display_name
 *
 * Returns selected public fields from the profiles table.
 * Returns 404 if the profile does not exist.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('profiles')
      .select(
        'id, display_name, bio, avatar_url, magic_rank, gates_open, active_gate, guardian, academy_house, xp, level, streak_days, created_at'
      )
      .eq('display_name', username)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[profiles GET] unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
