import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getListings, listItem, purchaseItem, delistItem } from '@/lib/commerce/marketplace-service';
import type { ListingType } from '@/lib/types/commerce';

/** GET /api/commerce/marketplace — Browse the Bazaar */
export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const listings = await getListings({
      type: params.get('type') as ListingType | undefined,
      status: params.get('status') || 'active',
      limit: parseInt(params.get('limit') || '20'),
    });
    return NextResponse.json({ listings });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to browse Bazaar' },
      { status: 500 }
    );
  }
}

/** POST /api/commerce/marketplace — List an item */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { type, itemId, title, description, price } = body as {
      type: ListingType;
      itemId: string;
      title: string;
      description: string;
      price: number;
    };

    if (!type || !itemId || !title || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const listing = await listItem(user.id, type, itemId, title, description || '', price);
    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list item' },
      { status: 400 }
    );
  }
}

/** PATCH /api/commerce/marketplace — Buy or delist */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { listingId, action } = body as { listingId: string; action: 'buy' | 'delist' };

    if (action === 'buy') {
      const listing = await purchaseItem(user.id, listingId);
      return NextResponse.json({ listing });
    } else if (action === 'delist') {
      await delistItem(user.id, listingId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process' },
      { status: 400 }
    );
  }
}
