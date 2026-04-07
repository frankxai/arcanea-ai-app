import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const sb = await createClient();
    const { data: { user } } = await sb.auth.getUser();

    const { data: world, error } = await sb
      .from('worlds')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !world) return NextResponse.json({ error: 'World not found' }, { status: 404 });

    if (world.visibility !== 'public' && world.creator_id !== user?.id) {
      return NextResponse.json({ error: 'World not found' }, { status: 404 });
    }

    const [characters, factions, locations, events] = await Promise.all([
      sb.from('world_characters').select('*').eq('world_id', world.id),
      sb.from('world_factions').select('*').eq('world_id', world.id),
      sb.from('world_locations').select('*').eq('world_id', world.id),
      sb.from('world_events').select('*').eq('world_id', world.id).order('sort_order'),
    ]);

    return NextResponse.json({
      ...world,
      characters: characters.data || [],
      factions: factions.data || [],
      locations: locations.data || [],
      events: events.data || [],
    });
  } catch (error) {
    console.error('[worlds [slug] GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const sb = await createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 });

    const { data: world } = await sb.from('worlds').select('id, creator_id').eq('slug', slug).single();
    if (!world || world.creator_id !== user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const { data, error } = await sb.from('worlds').update(body).eq('id', world.id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (error) {
    console.error('[worlds [slug] PATCH] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const sb = await createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 });

    const { data: world } = await sb.from('worlds').select('id, creator_id').eq('slug', slug).single();
    if (!world || world.creator_id !== user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { error } = await sb.from('worlds').delete().eq('id', world.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('[worlds [slug] DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
