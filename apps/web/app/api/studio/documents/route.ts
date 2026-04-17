/**
 * GET  /api/studio/documents        — list current user's ingested docs
 * DELETE /api/studio/documents?id=… — remove one
 *
 * Used by /studio/vault to render the user's growing library.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Sign in required', 401);

  const { searchParams } = request.nextUrl;
  const classification = searchParams.get('classification');
  const sourceType = searchParams.get('source_type');
  const worldId = searchParams.get('world_id');
  const limit = Math.min(Math.max(Number(searchParams.get('limit') ?? '50'), 1), 200);

  let query = supabase
    .from('ingested_documents')
    .select(
      'id, title, classification, classification_confidence, source_type, source_uri, world_id, tags, word_count, created_at, updated_at',
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (classification) query = query.eq('classification', classification);
  if (sourceType) query = query.eq('source_type', sourceType);
  if (worldId) query = query.eq('world_id', worldId);

  const { data, error } = await query;
  if (error) {
    if (error.code === '42P01') {
      return err('Not migrated yet. Run: supabase db push', 503);
    }
    return err(error.message, 500);
  }

  return NextResponse.json({ count: data?.length ?? 0, documents: data ?? [] });
}

export async function DELETE(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Sign in required', 401);

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return err('id query param required', 400);

  const { error } = await supabase
    .from('ingested_documents')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return err(error.message, 500);
  return NextResponse.json({ ok: true });
}
