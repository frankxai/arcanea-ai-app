import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

// GET /api/forge — list user's agents + public agents
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const category = searchParams.get('category');
  const tab = searchParams.get('tab') ?? 'community'; // 'mine' | 'community'
  const limit = Math.min(Number(searchParams.get('limit') ?? 30), 100);

  let query = supabase
    .from('custom_agents')
    .select('id, name, slug, description, avatar_emoji, avatar_url, category, visibility, use_count, fork_count, base_luminor_id, preferred_tools, creator_id, created_at')
    .order('use_count', { ascending: false })
    .limit(limit);

  if (tab === 'mine' && userId) {
    query = query.eq('creator_id', userId);
  } else {
    query = query.eq('visibility', 'public');
  }

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ agents: data ?? [] });
}

// POST /api/forge — create custom agent
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, name, description, avatarEmoji, systemPrompt, personalityTags, baseLuminorId, preferredTools, category, visibility } = body;

  if (!userId || !name || !systemPrompt) {
    return NextResponse.json({ error: 'userId, name, and systemPrompt are required' }, { status: 400 });
  }
  if (name.length < 2 || name.length > 40) {
    return NextResponse.json({ error: 'Name must be 2-40 characters' }, { status: 400 });
  }
  if (systemPrompt.length < 10 || systemPrompt.length > 8000) {
    return NextResponse.json({ error: 'System prompt must be 10-8000 characters' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('custom_agents')
    .insert({
      creator_id: userId,
      name,
      slug: slugify(name),
      description: description?.slice(0, 200),
      avatar_emoji: avatarEmoji ?? '🤖',
      system_prompt: systemPrompt,
      personality_tags: personalityTags ?? [],
      base_luminor_id: baseLuminorId,
      preferred_tools: preferredTools ?? [],
      category: category ?? 'general',
      visibility: visibility ?? 'private',
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: `You already have an agent named "${name}"` }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ agent: data }, { status: 201 });
}
