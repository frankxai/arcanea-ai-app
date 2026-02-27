/**
 * TASTE AI Vision Scoring — Phase 2 media intelligence
 * Guardian: Lyria (Sight Gate, 639 Hz)
 *
 * POST /api/media/taste
 *   Runs AI vision analysis on media_catalog entries using Haiku (~$0.0003/image).
 *   Updates taste_score with real visual evaluation and refines quality_tier.
 *
 * Body: { ids?: string[], guardian?: string, limit?: number, tier?: number }
 *
 * TASTE dimensions (weighted):
 *   Canon Alignment (25%), Design Compliance (25%), Emotional Impact (20%),
 *   Technical Fit (15%), Uniqueness (15%)
 *
 * Cost: ~$0.0003/image via Haiku 4.5 vision
 */

import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY ?? '';

interface CatalogEntry {
  id: string;
  storage_path: string;
  guardian: string | null;
  gate: string | null;
  element: string | null;
  scene: string;
  public_url: string;
}

export async function POST(request: NextRequest) {
  const writeKey = SERVICE_KEY || SUPABASE_ANON;
  if (!SUPABASE_URL || !writeKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }
  if (!ANTHROPIC_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY required for TASTE AI scoring' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { ids, guardian, tier, limit = 20 } = body;
    const maxLimit = Math.min(limit, 50);

    // Fetch entries to analyze
    const params = new URLSearchParams();
    params.set('select', 'id,storage_path,guardian,gate,element,scene,public_url');
    params.set('limit', String(maxLimit));
    params.set('order', 'created_at.asc');

    if (ids?.length) {
      params.set('id', `in.(${ids.join(',')})`);
    } else if (guardian) {
      params.set('guardian', `eq.${guardian}`);
    } else if (tier) {
      params.set('quality_tier', `eq.${tier}`);
    }

    const fetchRes = await fetch(
      `${SUPABASE_URL}/rest/v1/media_catalog?${params}`,
      { headers: { apikey: writeKey, Authorization: `Bearer ${writeKey}` } }
    );
    if (!fetchRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
    }

    const entries: CatalogEntry[] = await fetchRes.json();
    if (entries.length === 0) {
      return NextResponse.json({ analyzed: 0, message: 'No entries match criteria' });
    }

    // Analyze in batches of 5
    const results: Array<{ id: string; guardian: string | null; scores: Record<string, number>; tier: number; notes: string }> = [];

    for (let i = 0; i < entries.length; i += 5) {
      const batch = entries.slice(i, i + 5);
      const batchResults = await Promise.all(batch.map(e => analyzeImage(e)));
      for (const r of batchResults) {
        if (r) results.push(r);
      }
    }

    // Update catalog
    let updated = 0;
    for (const r of results) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/media_catalog?id=eq.${r.id}`,
        {
          method: 'PATCH',
          headers: {
            apikey: writeKey,
            Authorization: `Bearer ${writeKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            taste_score: r.scores,
            quality_tier: r.tier,
            analyzed_by: 'haiku-vision',
          }),
        }
      );
      if (res.ok) updated++;
    }

    return NextResponse.json({
      analyzed: results.length,
      updated,
      cost_estimate: `~$${(results.length * 0.0003).toFixed(4)}`,
      results: results.map(r => ({
        id: r.id, guardian: r.guardian, tier: r.tier,
        total: r.scores.total, notes: r.notes,
      })),
    });
  } catch (err) {
    console.error('[media/taste] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

async function analyzeImage(entry: CatalogEntry) {
  try {
    const guardianCtx = entry.guardian
      ? `This image represents ${entry.guardian} (${entry.gate} Gate, ${entry.element} element).`
      : 'No Guardian assigned yet.';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'url', url: entry.public_url } },
            {
              type: 'text',
              text: `TASTE evaluator for Arcanea fantasy universe. Score this image 0-100 on:
1. CANON (25%): Arcanea mythology fit? ${guardianCtx}
2. DESIGN (25%): Cosmic glass aesthetic, ethereal, detailed?
3. EMOTION (20%): Evokes wonder/power/transcendence?
4. TECHNICAL (15%): Good composition, web-ready?
5. UNIQUENESS (15%): Distinctive contribution?
Context: "${entry.scene}"
Reply ONLY with JSON: {"canon":N,"design":N,"emotion":N,"technical":N,"uniqueness":N,"notes":"one line"}`,
            },
          ],
        }],
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '';
    const match = text.match(/\{[^}]+\}/);
    if (!match) return null;

    const s = JSON.parse(match[0]);
    const total = Math.round(
      (s.canon ?? 50) * 0.25 + (s.design ?? 50) * 0.25 +
      (s.emotion ?? 50) * 0.20 + (s.technical ?? 50) * 0.15 +
      (s.uniqueness ?? 50) * 0.15
    );
    const tier = total >= 80 ? 1 : total >= 60 ? 2 : total >= 40 ? 3 : 4;

    return {
      id: entry.id,
      guardian: entry.guardian,
      scores: { canon: s.canon, design: s.design, emotion: s.emotion, technical: s.technical, uniqueness: s.uniqueness, total },
      tier,
      notes: s.notes ?? '',
    };
  } catch {
    return null;
  }
}
