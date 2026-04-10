/**
 * Registry Queries — Server-side data loaders for the Arcanea Agent Registry.
 * Uses the admin client for read operations. Public data, no auth required.
 */

import { createRegistryAdminClient } from '@/lib/registry/supabase';

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
  total_deployments: number;
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
 * Falls back to empty array if Supabase is unreachable — page still renders.
 */
export async function searchAgents(params: SearchParams = {}): Promise<RegistryAgent[]> {
  try {
    const supabase = createRegistryAdminClient();
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
    const supabase = createRegistryAdminClient();
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
    const supabase = createRegistryAdminClient();

    const [agentsRes, deploymentsRes, platformsRes] = await Promise.all([
      supabase.from('marketplace_agents').select('category', { count: 'exact' }).eq('is_published', true),
      supabase.from('deployments').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('platforms').select('id', { count: 'exact', head: true }).eq('is_active', true),
    ]);

    const categories: Record<string, number> = {};
    for (const row of (agentsRes.data ?? []) as Array<{ category: string }>) {
      categories[row.category] = (categories[row.category] ?? 0) + 1;
    }

    return {
      total_agents: agentsRes.count ?? 0,
      total_deployments: deploymentsRes.count ?? 0,
      total_platforms: platformsRes.count ?? 0,
      categories,
    };
  } catch (err) {
    console.error('[registry/queries] getRegistryStats fatal:', err);
    return { total_agents: 0, total_deployments: 0, total_platforms: 0, categories: {} };
  }
}

/**
 * Get usage stats for a specific agent.
 */
export async function getAgentStats(agentId: string): Promise<{
  total_deploys: number;
  total_usages: number;
  platforms_reached: number;
}> {
  try {
    const supabase = createRegistryAdminClient();
    const [deploysRes, usagesRes] = await Promise.all([
      supabase.from('attribution_events').select('platform_id', { count: 'exact' }).eq('agent_id', agentId).eq('event_type', 'deploy'),
      supabase.from('usage_events').select('id', { count: 'exact', head: true }).eq('agent_id', agentId),
    ]);

    const platforms = new Set<string>();
    for (const row of (deploysRes.data ?? []) as Array<{ platform_id: string | null }>) {
      if (row.platform_id) platforms.add(row.platform_id);
    }

    return {
      total_deploys: deploysRes.count ?? 0,
      total_usages: usagesRes.count ?? 0,
      platforms_reached: platforms.size,
    };
  } catch {
    return { total_deploys: 0, total_usages: 0, platforms_reached: 0 };
  }
}

/**
 * Get related agents (same category or overlapping capabilities).
 */
export async function getRelatedAgents(agent: RegistryAgent, limit = 4): Promise<RegistryAgent[]> {
  try {
    const supabase = createRegistryAdminClient();
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
