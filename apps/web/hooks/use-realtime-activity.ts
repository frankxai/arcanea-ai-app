'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface RealtimeActivityItem {
  id: string;
  type: 'creation' | 'follow' | 'like' | 'gate_unlock' | 'achievement';
  actor: {
    id: string;
    username: string;
    avatarUrl?: string;
    element?: string;
  };
  target?: {
    id: string;
    title?: string;
    username?: string;
    type?: string;
  };
  metadata?: {
    gateName?: string;
    creationType?: string;
    element?: string;
  };
  createdAt: string;
}

function mapActionToType(action: string): RealtimeActivityItem['type'] {
  switch (action) {
    case 'create':
    case 'publish':
    case 'creation':
      return 'creation';
    case 'follow':
      return 'follow';
    case 'like':
    case 'appreciate':
      return 'like';
    case 'gate_unlock':
    case 'unlock_gate':
      return 'gate_unlock';
    case 'achievement':
    case 'milestone':
      return 'achievement';
    default:
      return 'creation';
  }
}

interface UseRealtimeActivityOptions {
  /** Maximum items to keep in the buffer */
  maxItems?: number;
  /** Whether to enable the subscription */
  enabled?: boolean;
}

/**
 * Hook that subscribes to real-time activity inserts via Supabase Realtime.
 * Returns new activity items as they arrive.
 *
 * Usage:
 * ```tsx
 * const { newItems, isConnected } = useRealtimeActivity({ maxItems: 20 });
 * ```
 */
export function useRealtimeActivity(options: UseRealtimeActivityOptions = {}) {
  const { maxItems = 20, enabled = true } = options;
  const [newItems, setNewItems] = useState<RealtimeActivityItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const prependItem = useCallback(
    (item: RealtimeActivityItem) => {
      setNewItems((prev) => {
        const updated = [item, ...prev];
        return updated.slice(0, maxItems);
      });
    },
    [maxItems]
  );

  useEffect(() => {
    if (!enabled) return;

    let supabase: ReturnType<typeof createClient>;

    try {
      supabase = createClient();
    } catch {
      // Supabase not configured — silently skip
      return;
    }

    const channel = supabase
      .channel('community-activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_log',
        },
        async (payload) => {
          const row = payload.new as Record<string, unknown>;
          const meta = row.metadata as Record<string, unknown> | null;

          // Try to fetch the profile for this user
          let username = 'Creator';
          let avatarUrl: string | undefined;
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name, avatar_url')
              .eq('id', row.user_id as string)
              .maybeSingle();

            if (profile) {
              username = profile.display_name || username;
              avatarUrl = profile.avatar_url || undefined;
            }
          } catch {
            // Profile fetch failed — use defaults
          }

          const item: RealtimeActivityItem = {
            id: row.id as string,
            type: mapActionToType(row.action as string),
            actor: {
              id: row.user_id as string,
              username,
              avatarUrl,
              element: meta?.element as string | undefined,
            },
            createdAt: row.created_at as string,
          };

          if (row.entity_id) {
            item.target = {
              id: row.entity_id as string,
              title: meta?.title as string | undefined,
              username: meta?.target_username as string | undefined,
              type: row.entity_type as string | undefined,
            };
          }

          if (meta) {
            item.metadata = {
              gateName: meta.gate_name as string | undefined,
              creationType: (row.entity_type as string) || undefined,
              element: meta.element as string | undefined,
            };
          }

          prependItem(item);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setIsConnected(false);
    };
  }, [enabled, prependItem]);

  const clearItems = useCallback(() => {
    setNewItems([]);
  }, []);

  return { newItems, isConnected, clearItems };
}
