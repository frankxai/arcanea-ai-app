/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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

import { NextRequest, NextResponse } from "next/server";
import { analyzeStorageBucket, type MediaAnalysis } from "@/lib/media/analyzer";
import { requireMediaOperator } from "@/lib/media/require-operator";

export async function POST(request: NextRequest) {
  const denial = await requireMediaOperator();
  if (denial) return denial;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const readKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const writeKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !readKey || !writeKey) {
    return NextResponse.json(
      { error: "Media catalog unavailable." },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "true";
  const prefixParam = url.searchParams.get("prefix");

  const prefixes = prefixParam
    ? [prefixParam]
    : ["guardians/", "guardians/gallery/", "community/"];

  try {
    // Phase 1: Scan and analyze all files (filename intelligence — $0)
    const analyses = await analyzeStorageBucket(
      supabaseUrl,
      readKey,
      "arcanea-gallery",
      prefixes,
    );

    // Phase 2: Get existing entries to skip already-analyzed files
    let existingPaths = new Set<string>();
    if (!force) {
      const existRes = await fetch(
        `${supabaseUrl}/rest/v1/media_catalog?select=storage_path&limit=2000`,
        {
          headers: {
            apikey: writeKey,
            Authorization: `Bearer ${writeKey}`,
          },
        },
      );
      if (!existRes.ok) {
        return NextResponse.json(
          { error: "Existing catalog could not be read." },
          { status: 502 },
        );
      }
      const existing: Array<{ storage_path: string }> = await existRes.json();
      existingPaths = new Set(existing.map((e) => e.storage_path));
    }

    // Phase 3: Upsert into media_catalog
    const toInsert = force
      ? analyses
      : analyses.filter((a) => !existingPaths.has(a.storage_path));

    let analyzed = 0;
    let errors = 0;
    const BATCH_SIZE = 50;

    for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
      const batch = toInsert.slice(i, i + BATCH_SIZE).map((a) => ({
        storage_path: a.storage_path,
        bucket: "arcanea-gallery",
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
        status: "review",
        analyzed_by: "filename",
        public_url: a.public_url,
      }));

      const upsertHeaders: Record<string, string> = {
        apikey: writeKey,
        Authorization: `Bearer ${writeKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      };
      if (force)
        upsertHeaders["Prefer"] = "resolution=merge-duplicates,return=minimal";

      const res = await fetch(`${supabaseUrl}/rest/v1/media_catalog`, {
        method: "POST",
        headers: upsertHeaders,
        body: JSON.stringify(batch),
      });

      if (res.ok || res.status === 201) {
        analyzed += batch.length;
      } else {
        errors += batch.length;
        console.error(
          `[media/analyze] batch ${i} failed with status ${res.status}`,
        );
      }
    }

    // Phase 4: Compute stats
    const stats = computeStats(analyses);

    return NextResponse.json(
      {
        analyzed,
        skipped: analyses.length - toInsert.length,
        errors,
        total_scanned: analyses.length,
        stats,
      },
      { status: errors > 0 ? 502 : 200 },
    );
  } catch {
    console.error("[media/analyze] processing failed");
    return NextResponse.json(
      { error: "Analysis pipeline failed" },
      { status: 502 },
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
    const g = a.guardian || "unassigned";
    byGuardian[g] = (byGuardian[g] ?? 0) + 1;
    bySource[a.source] = (bySource[a.source] ?? 0) + 1;
    byTier[a.quality_tier] = (byTier[a.quality_tier] ?? 0) + 1;
    if (a.element) byElement[a.element] = (byElement[a.element] ?? 0) + 1;
    totalScore += a.taste_score.total;
  }

  return {
    total: analyses.length,
    avgTasteScore:
      analyses.length > 0 ? Math.round(totalScore / analyses.length) : 0,
    byGuardian,
    bySource,
    byTier: {
      hero: byTier[1] ?? 0,
      gallery: byTier[2] ?? 0,
      thumbnail: byTier[3] ?? 0,
      reject: byTier[4] ?? 0,
    },
    byElement,
  };
}
