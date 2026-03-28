'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  PhHeart,
  PhUserPlus,
  PhSparkle,
  PhStar,
  PhImage,
  PhFileText,
  PhMusicNote,
  PhCode,
  PhArrowRight,
  PhFlame,
} from '@/lib/phosphor-icons';
import { useRealtimeActivity } from '@/hooks/use-realtime-activity';

// ── Types ──────────────────────────────────────────────────────────────────

interface ActivityItem {
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

// ── Demo data (used until API is live) ─────────────────────────────────────

const DEMO_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    type: 'creation',
    actor: { id: 'u1', username: 'Resonance Mage', element: 'Water' },
    target: { id: 'c1', title: 'The Sunken Hymnal', type: 'text' },
    metadata: { creationType: 'text', element: 'Water' },
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: '2',
    type: 'gate_unlock',
    actor: { id: 'u2', username: 'Archive Walker', element: 'Void' },
    metadata: { gateName: 'Sight' },
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: '3',
    type: 'follow',
    actor: { id: 'u3', username: 'Flame Weaver', element: 'Fire' },
    target: { id: 'u4', username: 'Solfeggio Wanderer' },
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '4',
    type: 'creation',
    actor: { id: 'u5', username: 'Terra Sculptor', element: 'Earth' },
    target: { id: 'c2', title: 'Godbeast Field Study: Kaelith', type: 'image' },
    metadata: { creationType: 'image', element: 'Earth' },
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: '5',
    type: 'like',
    actor: { id: 'u6', username: 'Wind Caller', element: 'Wind' },
    target: { id: 'c3', title: 'Frequency Composition: 528 Hz' },
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: '6',
    type: 'achievement',
    actor: { id: 'u7', username: 'Crystal Singer', element: 'Water' },
    metadata: { gateName: 'Voice' },
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: '7',
    type: 'creation',
    actor: { id: 'u8', username: 'Void Weaver', element: 'Void' },
    target: { id: 'c4', title: 'Malachar: The Fallen Symphony', type: 'audio' },
    metadata: { creationType: 'audio', element: 'Void' },
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: '8',
    type: 'creation',
    actor: { id: 'u9', username: 'Code Alchemist', element: 'Fire' },
    target: { id: 'c5', title: 'Guardian Invocation CLI', type: 'code' },
    metadata: { creationType: 'code', element: 'Fire' },
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
  },
];

// ── Element colors ─────────────────────────────────────────────────────────

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#ef4444',
  Water: '#3b82f6',
  Earth: '#22c55e',
  Wind: '#e2e8f0',
  Void: '#8b5cf6',
  Spirit: '#fbbf24',
};

// ── Helpers ────────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getTypeIcon(type?: string) {
  switch (type) {
    case 'image': return PhImage;
    case 'audio': return PhMusicNote;
    case 'code': return PhCode;
    default: return PhFileText;
  }
}

function getActivityIcon(type: ActivityItem['type']) {
  switch (type) {
    case 'creation': return PhSparkle;
    case 'follow': return PhUserPlus;
    case 'like': return PhHeart;
    case 'gate_unlock': return PhStar;
    case 'achievement': return PhFlame;
  }
}

function getActivityColor(type: ActivityItem['type']) {
  switch (type) {
    case 'creation': return '#7fffd4';
    case 'follow': return '#78a6ff';
    case 'like': return '#f472b6';
    case 'gate_unlock': return '#ffd700';
    case 'achievement': return '#ef4444';
  }
}

// ── Component ──────────────────────────────────────────────────────────────

interface ActivityFeedProps {
  maxItems?: number;
  compact?: boolean;
}

export function ActivityFeed({ maxItems = 8, compact = false }: ActivityFeedProps) {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to realtime activity inserts
  const { newItems: realtimeItems } = useRealtimeActivity({ maxItems: 5, enabled: !compact });

  // Merge realtime items with fetched items (realtime first, deduped)
  const mergedItems = (() => {
    if (realtimeItems.length === 0) return items;
    const existingIds = new Set(items.map((i) => i.id));
    const fresh = realtimeItems.filter((ri) => !existingIds.has(ri.id)) as ActivityItem[];
    return [...fresh, ...items].slice(0, maxItems);
  })();

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch(`/api/community/activity?limit=${maxItems}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setItems(json.data.slice(0, maxItems));
          return;
        }
      }
      // Fallback to demo data when API returns empty or error
      setItems(DEMO_ACTIVITY.slice(0, maxItems));
    } catch {
      setItems(DEMO_ACTIVITY.slice(0, maxItems));
    } finally {
      setLoading(false);
    }
  }, [maxItems]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: compact ? 4 : 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl animate-pulse">
            <div className="w-8 h-8 rounded-full bg-white/[0.06]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-white/[0.06] rounded w-3/4" />
              <div className="h-2 bg-white/[0.04] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderActivityText(item: ActivityItem) {
    switch (item.type) {
      case 'creation':
        return (
          <span className="text-sm text-text-secondary font-sans">
            <span className="text-text-primary font-medium">{item.actor.username}</span>
            {' '}created{' '}
            <span className="text-text-primary font-medium">{item.target?.title}</span>
          </span>
        );
      case 'follow':
        return (
          <span className="text-sm text-text-secondary font-sans">
            <span className="text-text-primary font-medium">{item.actor.username}</span>
            {' '}followed{' '}
            <span className="text-text-primary font-medium">{item.target?.username}</span>
          </span>
        );
      case 'like':
        return (
          <span className="text-sm text-text-secondary font-sans">
            <span className="text-text-primary font-medium">{item.actor.username}</span>
            {' '}appreciated{' '}
            <span className="text-text-primary font-medium">{item.target?.title}</span>
          </span>
        );
      case 'gate_unlock':
        return (
          <span className="text-sm text-text-secondary font-sans">
            <span className="text-text-primary font-medium">{item.actor.username}</span>
            {' '}unlocked the{' '}
            <span className="text-brand-gold font-medium">{item.metadata?.gateName} Gate</span>
          </span>
        );
      case 'achievement':
        return (
          <span className="text-sm text-text-secondary font-sans">
            <span className="text-text-primary font-medium">{item.actor.username}</span>
            {' '}earned{' '}
            <span className="text-fire font-medium">{item.metadata?.gateName} Mastery</span>
          </span>
        );
    }
  }

  return (
    <div className="space-y-1">
      {mergedItems.map((item) => {
        const ActivityIcon = getActivityIcon(item.type);
        const activityColor = getActivityColor(item.type);
        const elementColor = item.actor.element
          ? ELEMENT_COLORS[item.actor.element] || '#7fffd4'
          : '#7fffd4';

        return (
          <div
            key={item.id}
            className="group flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.02] transition-colors"
          >
            {/* Avatar with activity indicator */}
            <div className="relative shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: `${elementColor}18`,
                  color: elementColor,
                }}
              >
                {item.actor.username.slice(0, 2).toUpperCase()}
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0a0a12]"
                style={{ backgroundColor: `${activityColor}25` }}
              >
                <ActivityIcon
                  className="w-2 h-2"
                  style={{ color: activityColor }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {renderActivityText(item)}
              <p className="text-[10px] text-text-muted mt-0.5 font-mono">
                {relativeTime(item.createdAt)}
              </p>
            </div>

            {/* Creation type indicator */}
            {item.type === 'creation' && item.metadata?.creationType && (
              <div
                className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: `${elementColor}12` }}
              >
                {(() => {
                  const TypeIcon = getTypeIcon(item.metadata?.creationType);
                  return (
                    <TypeIcon
                      className="w-3 h-3"
                      style={{ color: elementColor }}
                    />
                  );
                })()}
              </div>
            )}
          </div>
        );
      })}

      {!compact && (
        <div className="pt-3 border-t border-white/[0.04]">
          <Link
            href="/community"
            className="flex items-center gap-2 text-xs text-crystal hover:text-crystal-bright transition-colors font-mono px-3 py-1"
          >
            View all activity
            <PhArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
