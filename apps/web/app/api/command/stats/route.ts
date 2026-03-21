/**
 * Command Center — Stats API
 *
 * GET /api/command/stats — Aggregate dashboard statistics
 *
 * Queries asset_metadata, agent_registry, and social_queue to compute
 * CommandCenterStats. Uses lightweight column-selective queries
 * to minimize payload size.
 *
 * NOTE: Tables created by migration 20260317 — types will be generated
 * after `supabase gen types`. Until then we cast via `as any` to bypass
 * the generated Database type that doesn't yet include these tables.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type {
  AssetStatus,
  Guardian,
  Element,
  QualityTier,
  SocialStatus,
  CommandCenterStats,
} from '@/lib/command-center/types';

// ---------------------------------------------------------------------------
// GET — Aggregate stats
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    const supabase = await createClient();

    // Run all three queries in parallel for speed
    const sb = supabase as any;
    const [assetsResult, agentsResult, socialResult] = await Promise.all([
      sb
        .from('asset_metadata' as never)
        .select('status, guardian, element, quality_tier'),
      sb
        .from('agent_registry' as never)
        .select('status'),
      sb
        .from('social_queue' as never)
        .select('status'),
    ]);

    if (assetsResult.error) {
      console.error('[api/command/stats] Assets query error:', assetsResult.error);
      return NextResponse.json({ error: assetsResult.error.message }, { status: 500 });
    }
    if (agentsResult.error) {
      console.error('[api/command/stats] Agents query error:', agentsResult.error);
      return NextResponse.json({ error: agentsResult.error.message }, { status: 500 });
    }
    if (socialResult.error) {
      console.error('[api/command/stats] Social query error:', socialResult.error);
      return NextResponse.json({ error: socialResult.error.message }, { status: 500 });
    }

    const allAssets = (assetsResult.data ?? []) as Array<{
      status: AssetStatus;
      guardian: Guardian | null;
      element: Element | null;
      quality_tier: QualityTier;
    }>;

    // Compute guardian coverage
    const guardianCoverage: Record<string, number> = {};
    const elementDistribution: Record<string, number> = {};
    const tierBreakdown: Record<string, number> = {
      hero: 0,
      gallery: 0,
      thumbnail: 0,
      reject: 0,
      unscored: 0,
    };
    let classifiedCount = 0;

    for (const asset of allAssets) {
      if (asset.status !== 'new') {
        classifiedCount++;
      }
      if (asset.guardian) {
        guardianCoverage[asset.guardian] = (guardianCoverage[asset.guardian] ?? 0) + 1;
      }
      if (asset.element) {
        elementDistribution[asset.element] = (elementDistribution[asset.element] ?? 0) + 1;
      }
      if (asset.quality_tier) {
        tierBreakdown[asset.quality_tier] = (tierBreakdown[asset.quality_tier] ?? 0) + 1;
      }
    }

    // Agents online (online + busy)
    const agentsOnline = (agentsResult.data ?? []).filter(
      (a: { status: string }) => a.status === 'online' || a.status === 'busy',
    ).length;

    // Social queue stats
    const socialItems = (socialResult.data ?? []) as Array<{ status: SocialStatus }>;
    const socialQueued = socialItems.filter(
      (s) => s.status !== 'published' && s.status !== 'failed',
    ).length;
    const socialPublished = socialItems.filter(
      (s) => s.status === 'published',
    ).length;

    const stats: CommandCenterStats = {
      total_assets: allAssets.length,
      classified_count: classifiedCount,
      unclassified_count: allAssets.length - classifiedCount,
      guardian_coverage: guardianCoverage as Record<Guardian, number>,
      element_distribution: elementDistribution as Record<Element, number>,
      tier_breakdown: tierBreakdown as Record<QualityTier, number>,
      agents_online: agentsOnline,
      social_queued: socialQueued,
      social_published: socialPublished,
    };

    return NextResponse.json({ data: stats });
  } catch (err) {
    console.error('[api/command/stats] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
