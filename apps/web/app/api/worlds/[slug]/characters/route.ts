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

    const { data: world } = await sb.from('worlds').select('id, visibility, creator_id').eq('slug', slug).single();
    if (!world) return NextResponse.json({ error: 'World not found' }, { status: 404 });
    if (world.visibility !== 'public' && world.creator_id !== user?.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { data, error } = await sb.from('world_characters').select('*').eq('world_id', world.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (error) {
    console.error('[worlds [slug] characters GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const sb = await createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 });

    const { data: world } = await sb.from('worlds').select('id, creator_id, character_count').eq('slug', slug).single();
    if (!world || world.creator_id !== user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    if (!body.name) return NextResponse.json({ error: 'name is required' }, { status: 400 });

    const { data, error } = await sb.from('world_characters').insert({
      world_id: world.id,
      name: body.name,
      title: body.title,
      origin_class: body.origin_class,
      personality: body.personality || {},
      backstory: body.backstory,
      motivation: body.motivation,
      element: body.element,
      gate: body.gate,
      portrait_url: body.portrait_url,
      is_agent: body.is_agent || false,
      agent_model: body.agent_model,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await sb.from('worlds').update({ character_count: (world.character_count || 0) + 1 }).eq('id', world.id);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[worlds [slug] characters POST] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
