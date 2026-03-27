import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createBounty, getBounties, claimBounty, submitBounty, approveBounty } from '@/lib/commerce/bounty-service';
import type { CommissionType } from '@/lib/types/commerce';
import type { Element } from '@/lib/types/challenge';

/** GET /api/commerce/bounties — Browse quests */
export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const bounties = await getBounties({
      status: params.get('status') || 'open',
      type: params.get('type') as CommissionType | undefined,
      element: params.get('element') as Element | undefined,
      limit: parseInt(params.get('limit') || '20'),
    });
    return NextResponse.json({ bounties });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch quests' },
      { status: 500 }
    );
  }
}

/** POST /api/commerce/bounties — Post a new quest */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, description, type, reward, deadlineDays, element } = body as {
      title: string;
      description: string;
      type: CommissionType;
      reward: number;
      deadlineDays: number;
      element?: Element;
    };

    if (!title || !description || !type || !reward) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bounty = await createBounty(
      user.id,
      title,
      description,
      type,
      reward,
      deadlineDays || 7,
      element
    );

    return NextResponse.json({ bounty }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to post quest' },
      { status: 400 }
    );
  }
}

/** PATCH /api/commerce/bounties — Update bounty status (claim, submit, approve) */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { bountyId, action, submissionUrl } = body as {
      bountyId: string;
      action: 'claim' | 'submit' | 'approve';
      submissionUrl?: string;
    };

    let bounty;
    switch (action) {
      case 'claim':
        bounty = await claimBounty(bountyId, user.id);
        break;
      case 'submit':
        if (!submissionUrl) return NextResponse.json({ error: 'Submission URL required' }, { status: 400 });
        bounty = await submitBounty(bountyId, submissionUrl);
        break;
      case 'approve':
        bounty = await approveBounty(bountyId);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ bounty });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update quest' },
      { status: 400 }
    );
  }
}
