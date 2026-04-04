import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SEED_WORLDS } from '@/lib/worlds/seed-worlds';

/**
 * POST /api/worlds/seed
 *
 * Inserts all 10 seed worlds into Supabase, skipping any whose slug already
 * exists. Only works in development or with the SEED_SECRET_KEY header.
 */
export async function POST(req: NextRequest) {
  // Gate: development only, or require a secret key
  const isDev = process.env.NODE_ENV === 'development';
  const secretKey = process.env.SEED_SECRET_KEY;
  const headerKey = req.headers.get('x-seed-key');

  if (!isDev && (!secretKey || headerKey !== secretKey)) {
    return NextResponse.json(
      { error: 'Seed endpoint is only available in development or with a valid x-seed-key header' },
      { status: 403 },
    );
  }

  const sb = await createClient();

  // Get existing slugs to skip duplicates
  const { data: existing } = await sb
    .from('worlds')
    .select('slug')
    .in('slug', SEED_WORLDS.map((w) => w.slug));

  const existingSlugs = new Set((existing ?? []).map((r) => r.slug));

  const toInsert = SEED_WORLDS.filter((w) => !existingSlugs.has(w.slug));

  if (toInsert.length === 0) {
    return NextResponse.json({ inserted: 0, message: 'All seed worlds already exist' });
  }

  // We need a creator_id. Use a system/service account or the current user.
  // For seed data, we use a deterministic UUID as the "Arcanea" system creator.
  const SYSTEM_CREATOR_ID = '00000000-0000-0000-0000-000000000000';

  const rows = toInsert.map((w) => ({
    creator_id: SYSTEM_CREATOR_ID,
    name: w.name,
    slug: w.slug,
    tagline: w.tagline,
    description: w.description,
    elements: w.elements,
    laws: w.laws,
    systems: w.systems,
    mood: w.mood,
    palette: w.palette,
    visibility: w.visibility,
    star_count: w.star_count,
    fork_count: w.fork_count,
    character_count: w.character_count,
    creation_count: w.creation_count,
  }));

  const { data, error } = await sb.from('worlds').insert(rows).select('slug');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    inserted: data?.length ?? 0,
    skipped: existingSlugs.size,
    slugs: data?.map((r) => r.slug) ?? [],
  });
}
