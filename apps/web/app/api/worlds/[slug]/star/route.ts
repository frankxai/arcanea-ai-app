import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const sb = await createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 });

    const { data: world } = await sb.from('worlds').select('id, star_count').eq('slug', slug).single();
    if (!world) return NextResponse.json({ error: 'World not found' }, { status: 404 });

    const { data: existing } = await sb
      .from('world_stars')
      .select('user_id')
      .eq('user_id', user.id)
      .eq('world_id', world.id)
      .maybeSingle();

    if (existing) {
      await sb.from('world_stars').delete().eq('user_id', user.id).eq('world_id', world.id);
      await sb.from('worlds').update({ star_count: Math.max(0, (world.star_count || 0) - 1) }).eq('id', world.id);
      return NextResponse.json({ starred: false, star_count: Math.max(0, (world.star_count || 0) - 1) });
    } else {
      await sb.from('world_stars').insert({ user_id: user.id, world_id: world.id });
      await sb.from('worlds').update({ star_count: (world.star_count || 0) + 1 }).eq('id', world.id);
      return NextResponse.json({ starred: true, star_count: (world.star_count || 0) + 1 });
    }
  } catch (error) {
    console.error('[worlds [slug] star POST] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
