import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOrCreateWallet, getTransactionHistory } from '@/lib/commerce/wallet-service';

/** GET /api/commerce/wallet — Fetch wallet balance */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const wallet = await getOrCreateWallet(user.id);
    return NextResponse.json({ wallet });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch wallet' },
      { status: 500 }
    );
  }
}
