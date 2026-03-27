import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSpellbookProducts, purchaseSpellbook, getUserSpellbooks } from '@/lib/commerce/spellbook-store';

/** GET /api/commerce/spellbooks — Get spellbook catalog + ownership */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const products = getSpellbookProducts();
    const owned = user ? await getUserSpellbooks(user.id) : [];

    return NextResponse.json({
      products,
      ownedIds: owned.map((o) => o.spellbookProductId),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch spellbooks' },
      { status: 500 }
    );
  }
}

/** POST /api/commerce/spellbooks — Purchase a spellbook */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { spellbookId } = body as { spellbookId: string };

    if (!spellbookId) {
      return NextResponse.json({ error: 'spellbookId is required' }, { status: 400 });
    }

    const ownership = await purchaseSpellbook(user.id, spellbookId);
    return NextResponse.json({ ownership }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to bind grimoire' },
      { status: 400 }
    );
  }
}
