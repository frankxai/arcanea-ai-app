/**
 * Media Analyze API — Intelligent processing pipeline
 * Guardian: Lyria (Sight Gate, 639 Hz)
 *
 * POST /api/media/analyze
 *   Scans all images in arcanea-gallery bucket, runs filename-based
 *   intelligence (Guardian detection, source parsing, TASTE heuristics),
 *   and upserts results into the media_catalog table.
 *
 * Query params:
 *   ?force=true  — re-analyze all files (default: skip existing)
 *   ?prefix=guardians/gallery/  — analyze specific prefix only
 *
 * Returns: { analyzed, skipped, errors, stats }
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeStorageBucket, type MediaAnalysis } from '@/lib/media/analyzer';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export async function POST(request: NextRequest) {
  const writeKey = SERVICE_KEY || SUPABASE_ANON;
  if (!SUPABASE_URL || !writeKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const url = new URL(request.url);
  const force = url.searchParams.get('force') === 'true';
  const prefixParam = url.searchParams.get('prefix');

  const prefixes = prefixParam
    ? [prefixParam]
    : ['guardians/', 'guardians/gallery/', 'community/'];

  try {
    // Phase 1: Scan and analyze all files (filename intelligence — $0)
    const analyses = await analyzeStorageBucket(
      SUPABASE_URL, SUPABASE_ANON, 'arcanea-gallery', prefixes
    );

    // Phase 2: Get existing entries to skip already-analyzed files
    let existingPaths = new Set<string>();
    if (!force) {
      const existRes = await fetch(
        `${SUPABASE_URL}/rest/v1/media_catalog?select=storage_path&limit=2000`,
        {
          headers: {
            apikey: writeKey,
            Authorization: `Bearer ${writeKey}`,
          },
        }
      );
      if (existRes.ok) {
        const existing: Array<{ storage_path: string }> = await existRes.json();
        existingPaths = new Set(existing.map(e => e.storage_path));
      }
    }

    // Phase 3: Upsert into media_catalog
    const toInsert = force
      ? analyses
      : analyses.filter(a => !existingPaths.has(a.storage_path));

    let analyzed = 0;
    let errors = 0;
    const BATCH_SIZE = 50;

    for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
      const batch = toInsert.slice(i, i + BATCH_SIZE).map(a => ({
        storage_path: a.storage_path,
        bucket: 'arcanea-gallery',
        filename: a.filename,
        guardian: a.guardian,
        gate: a.gate,
        element: a.element,
        frequency_hz: a.frequency_hz,
        godbeast: a.godbeast,
        source: a.source,
        scene: a.scene,
        tags: a.tags,
        media_type: a.media_type,
        quality_tier: a.quality_tier,
        taste_score: a.taste_score,
        status: 'review',
        analyzed_by: 'filename',
        public_url: a.public_url,
      }));

      const upsertHeaders: Record<string, string> = {
        apikey: writeKey,
        Authorization: `Bearer ${writeKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      };
      if (force) upsertHeaders['Prefer'] = 'resolution=merge-duplicates,return=minimal';

      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/media_catalog`,
        {
          method: 'POST',
          headers: upsertHeaders,
          body: JSON.stringify(batch),
        }
      );

      if (res.ok || res.status === 201) {
        analyzed += batch.length;
      } else {
        errors += batch.length;
        console.error(`[media/analyze] batch ${i} failed:`, await res.text());
      }
    }

    // Phase 4: Compute stats
    const stats = computeStats(analyses);

    return NextResponse.json({
      analyzed,
      skipped: analyses.length - toInsert.length,
      errors,
      total_scanned: analyses.length,
      stats,
    });
  } catch (err) {
    console.error('[media/analyze] error:', err);
    return NextResponse.json(
      { error: 'Analysis pipeline failed', details: String(err) },
      { status: 500 }
    );
  }
}

function computeStats(analyses: MediaAnalysis[]) {
  const byGuardian: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  const byTier: Record<number, number> = {};
  const byElement: Record<string, number> = {};
  let totalScore = 0;

  for (const a of analyses) {
    const g = a.guardian || 'unassigned';
    byGuardian[g] = (byGuardian[g] ?? 0) + 1;
    bySource[a.source] = (bySource[a.source] ?? 0) + 1;
    byTier[a.quality_tier] = (byTier[a.quality_tier] ?? 0) + 1;
    if (a.element) byElement[a.element] = (byElement[a.element] ?? 0) + 1;
    totalScore += a.taste_score.total;
  }

  return {
    total: analyses.length,
    avgTasteScore: analyses.length > 0 ? Math.round(totalScore / analyses.length) : 0,
    byGuardian,
    bySource,
    byTier: { hero: byTier[1] ?? 0, gallery: byTier[2] ?? 0, thumbnail: byTier[3] ?? 0, reject: byTier[4] ?? 0 },
    byElement,
  };
}
