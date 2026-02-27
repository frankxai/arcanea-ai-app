/**
 * Media Catalog API — Enriched gallery data from media_catalog table
 * Guardian: Lyria (Sight Gate, 639 Hz)
 *
 * GET /api/media/catalog
 *   Returns all analyzed media with full metadata, quality scores, and tags.
 *
 * Query params:
 *   ?guardian=draconia     — filter by Guardian
 *   ?tier=1               — filter by quality tier (1=hero, 2=gallery, 3=thumb, 4=reject)
 *   ?status=approved      — filter by curation status
 *   ?source=midjourney    — filter by source
 *   ?tag=content:godbeast — filter by tag
 *   ?limit=100            — max results (default 500)
 *   ?offset=0             — pagination offset
 */

import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export async function GET(request: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const url = new URL(request.url);
  const guardian = url.searchParams.get('guardian');
  const tier = url.searchParams.get('tier');
  const status = url.searchParams.get('status');
  const source = url.searchParams.get('source');
  const tag = url.searchParams.get('tag');
  const limit = Math.min(Number(url.searchParams.get('limit') || 500), 1000);
  const offset = Number(url.searchParams.get('offset') || 0);

  try {
    const params = new URLSearchParams();
    params.set('select', '*');
    params.set('order', 'quality_tier.asc,guardian.asc');
    params.set('limit', String(limit));
    params.set('offset', String(offset));

    if (guardian) params.set('guardian', `eq.${guardian}`);
    if (tier) params.set('quality_tier', `eq.${tier}`);
    if (status) params.set('status', `eq.${status}`);
    if (source) params.set('source', `eq.${source}`);
    if (tag) params.set('tags', `cs.{${tag}}`);

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/media_catalog?${params.toString()}`,
      {
        headers: {
          apikey: SUPABASE_ANON,
          Authorization: `Bearer ${SUPABASE_ANON}`,
          Prefer: 'count=exact',
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: 'Failed to fetch catalog', details: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    const totalCount = res.headers.get('content-range')?.split('/')[1];

    return NextResponse.json(
      {
        media: data,
        total: totalCount ? Number(totalCount) : data.length,
        limit,
        offset,
      },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err) {
    console.error('[media/catalog] error:', err);
    return NextResponse.json({ error: 'Catalog query failed' }, { status: 500 });
  }
}
