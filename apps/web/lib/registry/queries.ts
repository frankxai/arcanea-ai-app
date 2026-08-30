/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Registry Queries — Server-side data loaders for the Arcanea Agent Registry.
 * Uses the public Supabase client for read operations so RLS remains authoritative.
 */

import { createRegistryPublicClient } from '@/lib/registry/supabase';

export interface RegistryAgent {
  id: string;
  name: string;
  title: string;
  category: string;
  description: string;
  long_description: string | null;
  capabilities: string[];
  tags: string[];
  spec: Record<string, unknown>;
  creator_id: string | null;
  price_credits: number;
  is_open: boolean;
  is_featured: boolean;
  rating: number;
  rating_count: number;
  usage_count: number;
  version: string;
  license: string;
  source_url: string | null;
  mcp_endpoint: string | null;
  icon: string | null;
  color: string | null;
  gradient: string | null;
  element: string | null;
  gate_alignment: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegistryStats {
  total_agents: number;
  total_deployments: number | null;
  total_platforms: number;
  categories: Record<string, number>;
}

export interface SearchParams {
  query?: string;
  category?: string;
  capabilities?: string[];
  tags?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Search agents in the registry.
 * Missing configuration returns immediately without network I/O; unreachable configured services still fail closed.
 */
export async function searchAgents(params: SearchParams = {}): Promise<RegistryAgent[]> {
  try {
    const supabase = createRegistryPublicClient();
    if (!supabase) return [];
    let query = supabase
      .from('marketplace_agents')
      .select('*')
      .eq('is_published', true)
      .order('usage_count', { ascending: false })
      .limit(params.limit ?? 100);

    if (params.offset) query = query.range(params.offset, params.offset + (params.limit ?? 100) - 1);
    if (params.category && params.category !== 'all') query = query.eq('category', params.category);
    if (params.capabilities?.length) query = query.overlaps('capabilities', params.capabilities);
    if (params.tags?.length) query = query.overlaps('tags', params.tags);

    if (params.query) {
      const q = params.query.trim();
      query = query.or(`name.ilike.%${q}%,title.ilike.%${q}%,description.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[registry/queries] searchAgents error:', error.message);
      return [];
    }
    return (data as unknown as RegistryAgent[]) ?? [];
  } catch (err) {
    console.error('[registry/queries] searchAgents fatal:', err);
    return [];
  }
}

/**
 * Get a single agent by ID.
 */
export async function getAgent(id: string): Promise<RegistryAgent | null> {
  try {
    const supabase = createRegistryPublicClient();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('marketplace_agents')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      console.error('[registry/queries] getAgent error:', error.message);
      return null;
    }
    return data as unknown as RegistryAgent | null;
  } catch (err) {
    console.error('[registry/queries] getAgent fatal:', err);
    return null;
  }
}

/**
 * Aggregate registry stats for the header.
 */
export async function getRegistryStats(): Promise<RegistryStats> {
  try {
    const supabase = createRegistryPublicClient();
    if (!supabase) {
      return {
        total_agents: 0,
        total_deployments: null,
        total_platforms: 0,
        categories: {},
      };
    }

    // Only published agents and active platforms are public under RLS.
    // Deployment totals remain null until an explicitly approved aggregate
    // contract exists; querying owner-scoped rows would render a false zero.
    const [agentsRes, platformsRes] = await Promise.all([
      supabase
        .from('marketplace_agents')
        .select('category', { count: 'exact' })
        .eq('is_published', true),
      supabase
        .from('platforms')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),
    ]);

    const categories: Record<string, number> = {};
    for (const row of (agentsRes.data ?? []) as Array<{ category: string }>) {
      categories[row.category] = (categories[row.category] ?? 0) + 1;
    }

    return {
      total_agents: agentsRes.count ?? 0,
      total_deployments: null,
      total_platforms: platformsRes.count ?? 0,
      categories,
    };
  } catch (err) {
    console.error('[registry/queries] getRegistryStats fatal:', err);
    return {
      total_agents: 0,
      total_deployments: null,
      total_platforms: 0,
      categories: {},
    };
  }
}

/**
 * Get usage stats for a specific agent.
 */
export async function getAgentStats(agentId: string): Promise<{
  total_deploys: number | null;
  total_usages: number;
  platforms_reached: number | null;
}> {
  try {
    const supabase = createRegistryPublicClient();
    if (!supabase) {
      return {
        total_deploys: null,
        total_usages: 0,
        platforms_reached: null,
      };
    }

    // usage_count is part of the published marketplace row. Deployment and
    // reach aggregates are owner-scoped and therefore intentionally omitted.
    const { data, error } = await supabase
      .from('marketplace_agents')
      .select('usage_count')
      .eq('id', agentId)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      console.error('[registry/queries] getAgentStats error:', error.message);
    }

    return {
      total_deploys: null,
      total_usages:
        (data as { usage_count?: number } | null)?.usage_count ?? 0,
      platforms_reached: null,
    };
  } catch {
    return {
      total_deploys: null,
      total_usages: 0,
      platforms_reached: null,
    };
  }
}

/**
 * Get related agents (same category or overlapping capabilities).
 */
export async function getRelatedAgents(agent: RegistryAgent, limit = 4): Promise<RegistryAgent[]> {
  try {
    const supabase = createRegistryPublicClient();
    if (!supabase) return [];
    const { data } = await supabase
      .from('marketplace_agents')
      .select('*')
      .eq('is_published', true)
      .eq('category', agent.category)
      .neq('id', agent.id)
      .limit(limit);
    return (data as unknown as RegistryAgent[]) ?? [];
  } catch {
    return [];
  }
}
