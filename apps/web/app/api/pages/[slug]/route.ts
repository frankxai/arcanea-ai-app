/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Single Page API.
 *
 *   GET    /api/pages/:slug   → read (public/unlisted for anyone; private = owner only)
 *   PATCH  /api/pages/:slug   → owner edit (title, summary, sections, cover, visibility)
 *   DELETE /api/pages/:slug   → owner delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { pagesServiceClient, PAGES_TABLE } from '@/lib/pages/db';
import { rowToView, type PageRow, type PageSection } from '@/lib/pages/types';

export const runtime = 'nodejs';

type Ctx = { params: Promise<{ slug: string }> };

async function currentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function sanitizeSections(input: any): PageSection[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((s: any) => s && (s.heading || s.markdown))
    .slice(0, 12)
    .map((s: any) => ({
      id: typeof s.id === 'string' && s.id ? s.id : Math.random().toString(36).slice(2, 10),
      heading: String(s.heading || '').slice(0, 200),
      markdown: String(s.markdown || '').slice(0, 12000),
      imageUrl: typeof s.imageUrl === 'string' ? s.imageUrl : null,
    }));
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { slug } = await params;
  const db = pagesServiceClient();
  const { data, error } = await db.from(PAGES_TABLE).select('*').eq('slug', slug).maybeSingle();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const row = data as PageRow;
  const uid = row.owner_id ? await currentUserId() : null;
  const isOwner = !!uid && uid === row.owner_id;

  if (row.visibility === 'private' && !isOwner) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Count a view for non-owner reads (atomic; fire-and-forget).
  if (!isOwner) {
    void db.rpc('increment_page_views', { p_slug: slug }).then(
      () => {},
      () => {},
    );
  }

  return NextResponse.json({ page: rowToView(row, isOwner) });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { slug } = await params;
  const uid = await currentUserId();
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = pagesServiceClient();
  const { data: existing } = await db
    .from(PAGES_TABLE)
    .select('owner_id')
    .eq('slug', slug)
    .maybeSingle();
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if ((existing as any).owner_id !== uid) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.title === 'string') patch.title = body.title.slice(0, 200);
  if (typeof body.summary === 'string') patch.summary = body.summary.slice(0, 600);
  if (typeof body.coverImageUrl === 'string') {
    // Only http(s) cover URLs — blocks javascript:/data: and keeps next/image happy.
    if (!/^https?:\/\//i.test(body.coverImageUrl)) {
      return NextResponse.json({ error: 'Cover URL must be http(s).' }, { status: 400 });
    }
    patch.cover_image_url = body.coverImageUrl.slice(0, 2000);
  }
  if (body.coverImageUrl === null) patch.cover_image_url = null;
  if (Array.isArray(body.sections)) patch.sections = sanitizeSections(body.sections);
  if (['public', 'unlisted', 'private'].includes(body.visibility)) patch.visibility = body.visibility;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  const { error } = await db.from(PAGES_TABLE).update(patch).eq('slug', slug);
  if (error) {
    console.error('[pages] update failed:', error.message);
    return NextResponse.json({ error: 'Failed to update Page' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { slug } = await params;
  const uid = await currentUserId();
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = pagesServiceClient();
  const { data: existing } = await db
    .from(PAGES_TABLE)
    .select('owner_id')
    .eq('slug', slug)
    .maybeSingle();
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if ((existing as any).owner_id !== uid) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { error } = await db.from(PAGES_TABLE).delete().eq('slug', slug);
  if (error) {
    console.error('[pages] delete failed:', error.message);
    return NextResponse.json({ error: 'Failed to delete Page' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
