import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requestCommission, getCommissions, estimatePrice } from '@/lib/commerce/commission-service';
import type { CommissionType, CommissionComplexity } from '@/lib/types/commerce';

/** GET /api/commerce/commissions — List user's commissions */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = request.nextUrl.searchParams.get('role') as 'client' | 'creator' || 'client';
    const commissions = await getCommissions(user.id, role);
    return NextResponse.json({ commissions });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch commissions' },
      { status: 500 }
    );
  }
}

/** POST /api/commerce/commissions — Request a new commission */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { luminorId, luminorCreatorId, type, complexity, brief } = body as {
      luminorId: string;
      luminorCreatorId: string;
      type: CommissionType;
      complexity: CommissionComplexity;
      brief: string;
    };

    if (!luminorId || !type || !brief) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const commission = await requestCommission(
      user.id,
      luminorId,
      luminorCreatorId,
      type,
      complexity || 'invocation',
      brief
    );

    return NextResponse.json({ commission }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create commission' },
      { status: 400 }
    );
  }
}
