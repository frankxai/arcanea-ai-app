'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type {
  AssetMetadata,
  AssetStatus,
  AgentRegistry,
  CommandCenterStats,
  InboxFilter,
  SocialQueueItem,
  SocialStatus,
  SocialPlatform,
  Guardian,
  Element,
  QualityTier,
} from '@/lib/command-center/types';

// ---------------------------------------------------------------------------
// Supabase singleton (browser)
// ---------------------------------------------------------------------------

function getSupabase() {
  return createClient();
}

// ---------------------------------------------------------------------------
// useAssets — fetch + realtime subscribe to assets
// ---------------------------------------------------------------------------

export function useAssets(filter: InboxFilter) {
  const [assets, setAssets] = useState<AssetMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    const supabase = getSupabase();

    let query = supabase
      .from('assets')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (filter.status) {
      query = query.eq('status', filter.status);
    }
    if (filter.guardian) {
      query = query.eq('guardian', filter.guardian);
    }
    if (filter.element) {
      query = query.eq('element', filter.element);
    }
    if (filter.quality_tier) {
      query = query.eq('quality_tier', filter.quality_tier);
    }
    if (filter.search) {
      query = query.or(
        `filename.ilike.%${filter.search}%,ai_description.ilike.%${filter.search}%`
      );
    }

    const { data, count, error } = await query.limit(48);

    if (!error && data) {
      setAssets(data as AssetMetadata[]);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Realtime subscription
  useEffect(() => {
    const supabase = getSupabase();
    const channel = supabase
      .channel('assets-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assets' },
        () => {
          fetchAssets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAssets]);

  return { assets, loading, total, refetch: fetchAssets };
}

// ---------------------------------------------------------------------------
// useAgents — fetch + realtime subscribe to agent_registry
// ---------------------------------------------------------------------------

export function useAgents() {
  const [agents, setAgents] = useState<AgentRegistry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('agent_registry' as never)
      .select('*')
      .order('registered_at', { ascending: false });

    if (!error && data) {
      setAgents(data as AgentRegistry[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  useEffect(() => {
    const supabase = getSupabase();
    const channel = supabase
      .channel('agents-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agent_registry' },
        () => {
          fetchAgents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAgents]);

  return { agents, loading, refetch: fetchAgents };
}

// ---------------------------------------------------------------------------
// useSocialQueue — fetch social_queue items
// ---------------------------------------------------------------------------

export function useSocialQueue(filter?: {
  platform?: SocialPlatform | null;
  status?: SocialStatus | null;
}) {
  const [items, setItems] = useState<SocialQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    const supabase = getSupabase();

    let query = supabase
      .from('social_queue' as never)
      .select('*')
      .order('created_at', { ascending: false });

    if (filter?.platform) {
      query = query.eq('platform', filter.platform);
    }
    if (filter?.status) {
      query = query.eq('status', filter.status);
    }

    const { data, error } = await query.limit(100);

    if (!error && data) {
      setItems(data as SocialQueueItem[]);
    }
    setLoading(false);
  }, [filter?.platform, filter?.status]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  useEffect(() => {
    const supabase = getSupabase();
    const channel = supabase
      .channel('social-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'social_queue' },
        () => {
          fetchQueue();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchQueue]);

  return { items, loading, refetch: fetchQueue };
}

// ---------------------------------------------------------------------------
// useCommandStats — aggregated stats from assets
// ---------------------------------------------------------------------------

export function useCommandStats() {
  const [stats, setStats] = useState<CommandCenterStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const supabase = getSupabase();

    // Fetch all assets (lightweight — only the columns we need for stats)
    const { data: assets, error: assetsError } = await supabase
      .from('assets')
      .select('status, guardian, element, quality_tier');

    const { data: agents, error: agentsError } = await supabase
      .from('agent_registry' as never)
      .select('status');

    const { data: social, error: socialError } = await supabase
      .from('social_queue' as never)
      .select('status');

    if (assetsError || agentsError || socialError) {
      setLoading(false);
      return;
    }

    const allAssets = (assets ?? []) as Array<{
      status: AssetStatus;
      guardian: Guardian | null;
      element: Element | null;
      quality_tier: QualityTier;
    }>;

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

    for (const a of allAssets) {
      if (a.status !== 'new') classifiedCount++;
      if (a.guardian) {
        guardianCoverage[a.guardian] = (guardianCoverage[a.guardian] ?? 0) + 1;
      }
      if (a.element) {
        elementDistribution[a.element] =
          (elementDistribution[a.element] ?? 0) + 1;
      }
      if (a.quality_tier) {
        tierBreakdown[a.quality_tier] =
          (tierBreakdown[a.quality_tier] ?? 0) + 1;
      }
    }

    const agentsOnline = (agents ?? []).filter(
      (a: { status: string }) => a.status === 'online' || a.status === 'busy'
    ).length;

    const socialItems = (social ?? []) as Array<{ status: SocialStatus }>;
    const socialQueued = socialItems.filter(
      (s) => s.status !== 'published' && s.status !== 'failed'
    ).length;
    const socialPublished = socialItems.filter(
      (s) => s.status === 'published'
    ).length;

    setStats({
      total_assets: allAssets.length,
      classified_count: classifiedCount,
      unclassified_count: allAssets.length - classifiedCount,
      guardian_coverage: guardianCoverage as Record<Guardian, number>,
      element_distribution: elementDistribution as Record<Element, number>,
      tier_breakdown: tierBreakdown as Record<QualityTier, number>,
      agents_online: agentsOnline,
      social_queued: socialQueued,
      social_published: socialPublished,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Realtime refresh on asset changes
  useEffect(() => {
    const supabase = getSupabase();
    const channel = supabase
      .channel('stats-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assets' },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agent_registry' },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useApproveAsset() {
  const [loading, setLoading] = useState(false);

  const approve = useCallback(async (id: string) => {
    setLoading(true);
    const supabase = getSupabase();
    const { error } = await supabase
      .from('assets')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', id);
    setLoading(false);
    return { error };
  }, []);

  return { approve, loading };
}

export function useRejectAsset() {
  const [loading, setLoading] = useState(false);

  const reject = useCallback(async (id: string) => {
    setLoading(true);
    const supabase = getSupabase();
    const { error } = await supabase
      .from('assets')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', id);
    setLoading(false);
    return { error };
  }, []);

  return { reject, loading };
}

export function useBulkApprove() {
  const [loading, setLoading] = useState(false);

  const bulkApprove = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return { error: null };
    setLoading(true);
    const supabase = getSupabase();
    const { error } = await supabase
      .from('assets')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .in('id', ids);
    setLoading(false);
    return { error };
  }, []);

  return { bulkApprove, loading };
}
