import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tipCreator } from '@/lib/commerce/marketplace-service';

/** POST /api/commerce/tip — Send a Mana Offering */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { toUserId, amount } = body as { toUserId: string; amount: number };

    if (!toUserId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid tip parameters' }, { status: 400 });
    }

    await tipCreator(user.id, toUserId, amount);
    return NextResponse.json({ success: true, message: `Mana Offering of ${amount} sent.` });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send tip' },
      { status: 400 }
    );
  }
}
