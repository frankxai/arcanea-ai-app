/**
 * Marketplace Agent Detail
 *
 * GET /api/marketplace/agents/:id
 *   Returns: MarketplaceAgent | 404
 *
 * Looks up the agent by ID in the static catalog first.
 * Falls back to the marketplace_agents Supabase table for
 * community-created agents.
 *
 * Public endpoint — no auth required.
 */

import { NextRequest, NextResponse } from 'next/server';
import { CATALOG_BY_ID } from '@/lib/agents/marketplace/catalog';

// ---------------------------------------------------------------------------
// GET — Fetch single marketplace agent
// ---------------------------------------------------------------------------

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 },
      );
    }

    // ── 1. Check static catalog (fastest path) ───────────────────────────────
    const catalogAgent = CATALOG_BY_ID[id];
    if (catalogAgent) {
      return NextResponse.json({ agent: catalogAgent });
    }

    // ── 2. Fall back to Supabase marketplace_agents table ────────────────────
    try {
      const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase
          .from('marketplace_agents')
          .select('*')
          .eq('id', id)
          .eq('is_published', true)
          .single();

        if (!error && data) {
          // Reshape Supabase row to MarketplaceAgent shape
          const agent = {
            id: data.id,
            name: data.spec?.name ?? id,
            title: data.spec?.title ?? '',
            category: data.category,
            description: data.spec?.tagline ?? '',
            longDescription: data.spec?.wisdom ?? '',
            priceCredits: data.price_credits ?? 10,
            element: data.spec?.element ?? 'Spirit',
            gateAlignment: (data.spec?.gateAlignment ?? [])[0] ?? 'Foundation',
            icon: data.spec?.avatar ?? '✨',
            color: data.spec?.color ?? '#7fffd4',
            gradient: data.spec?.gradient ?? 'from-teal-900/60 to-cyan-900/60',
            capabilities: [],
            inputPlaceholder: 'Describe your task...',
            examplePrompts: data.spec?.starters ?? [],
            spec: data.spec,
            rating: Number(data.rating) ?? 0,
            usageCount: data.usage_count ?? 0,
            isFeatured: data.is_featured ?? false,
            creatorId: data.creator_id ?? null,
          };

          return NextResponse.json({ agent });
        }
      }
    } catch {
      // Non-fatal: fall through to 404 if Supabase is unavailable
    }

    return NextResponse.json(
      { error: 'Agent not found' },
      { status: 404 },
    );
  } catch (err) {
    console.error('[GET /api/marketplace/agents/[id]] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 },
    );
  }
}
