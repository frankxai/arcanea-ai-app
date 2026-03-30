/**
 * Marketplace Agents — List
 *
 * GET /api/marketplace/agents
 *   Query params:
 *     category?  — filter by AgentCategory
 *     featured?  — "true" to return only featured agents
 *     limit?     — max results (default 20, max 100)
 *     offset?    — pagination offset (default 0)
 *
 * Returns: { agents: MarketplaceAgent[], total: number }
 *
 * Public endpoint — no auth required.
 * Results come from the static catalog first; later this route will
 * also merge community-created agents from the marketplace_agents table.
 */

import { NextRequest, NextResponse } from 'next/server';
import { MARKETPLACE_CATALOG } from '@/lib/agents/marketplace/catalog';
import type { AgentCategory } from '@/lib/agents/marketplace/types';

// ---------------------------------------------------------------------------
// GET — List marketplace agents
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const categoryParam = searchParams.get('category') as AgentCategory | null;
    const featuredParam = searchParams.get('featured');
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    const limit = Math.min(Math.max(parseInt(limitParam ?? '20', 10), 1), 100);
    const offset = Math.max(parseInt(offsetParam ?? '0', 10), 0);
    const onlyFeatured = featuredParam === 'true';

    // ── Filter ──────────────────────────────────────────────────────────────
    let filtered = MARKETPLACE_CATALOG;

    if (categoryParam) {
      filtered = filtered.filter((a) => a.category === categoryParam);
    }

    if (onlyFeatured) {
      filtered = filtered.filter((a) => a.isFeatured);
    }

    const total = filtered.length;

    // ── Paginate ─────────────────────────────────────────────────────────────
    const agents = filtered.slice(offset, offset + limit);

    return NextResponse.json({ agents, total });
  } catch (err) {
    console.error('[GET /api/marketplace/agents] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch marketplace agents' },
      { status: 500 },
    );
  }
}
