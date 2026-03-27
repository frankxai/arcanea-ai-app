import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { claimDailyWell } from '@/lib/commerce/wallet-service';

/** POST /api/commerce/wallet/daily — Claim daily Mana from The Well */
export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await claimDailyWell(user.id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to claim from The Well' },
      { status: 400 }
    );
  }
}
