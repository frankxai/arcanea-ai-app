import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const sb = await createClient();
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q') || '';
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') || 20)));

  const { data: { user } } = await sb.auth.getUser();

  let query = sb
    .from('worlds')
    .select('*', { count: 'exact' })
    .order('star_count', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (user) {
    query = query.or(`visibility.eq.public,creator_id.eq.${user.id}`);
  } else {
    query = query.eq('visibility', 'public');
  }

  if (q) {
    query = query.or(`name.ilike.%${q}%,tagline.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ worlds: data, total: count, page, pageSize });
}

export async function POST(req: NextRequest) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const body = await req.json();
  const { name, slug, tagline, description, elements, laws, systems, palette, mood, hero_image_url, visibility } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: 'name and slug are required' }, { status: 400 });
  }

  const { data, error } = await sb.from('worlds').insert({
    creator_id: user.id,
    name, slug, tagline, description,
    elements: elements || [],
    laws: laws || [],
    systems: systems || [],
    palette: palette || {},
    mood, hero_image_url,
    visibility: visibility || 'private',
  }).select().single();

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
