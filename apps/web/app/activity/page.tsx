'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';
import {
  Lightning,
  Heart,
  UserPlus,
  PencilSimple,
  Eye,
  Star,
  Clock,
  Sparkle,
} from '@/lib/phosphor-icons';

interface ActivityItem {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

const ACTION_ICONS: Record<string, typeof Lightning> = {
  like: Heart,
  follow: UserPlus,
  create: PencilSimple,
  view: Eye,
  favorite: Star,
  default: Lightning,
};

const ACTION_COLORS: Record<string, string> = {
  like: 'text-pink-400 bg-pink-400/10',
  follow: 'text-cyan-400 bg-cyan-400/10',
  create: 'text-violet-400 bg-violet-400/10',
  view: 'text-white/[0.40] bg-white/[0.04]',
  favorite: 'text-amber-400 bg-amber-400/10',
  default: 'text-violet-400 bg-violet-400/10',
};

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getActionDescription(item: ActivityItem): string {
  const entityType = item.entity_type || 'item';
  switch (item.action) {
    case 'like':
      return `Liked a ${entityType}`;
    case 'follow':
      return `Followed a creator`;
    case 'create':
      return `Created a new ${entityType}`;
    case 'view':
      return `Viewed a ${entityType}`;
    case 'favorite':
      return `Favorited a ${entityType}`;
    default:
      return item.action.charAt(0).toUpperCase() + item.action.slice(1);
  }
}

export default function ActivityPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/auth/login?next=/activity');
      return;
    }

    const fetchActivity = async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('activity_log')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setActivities((data as ActivityItem[]) || []);
        }
      } catch {
        setError('Failed to load activity');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 text-center max-w-md">
          <Lightning className="w-12 h-12 text-white/[0.25] mx-auto mb-4" weight="duotone" />
          <h1 className="text-2xl font-display font-bold text-white mb-2">Sign in Required</h1>
          <p className="text-white/[0.40] font-body mb-6">Sign in to view your activity feed.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-6 py-3 font-body transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Lightning className="w-8 h-8 text-violet-400" weight="duotone" />
            <h1 className="text-3xl font-display font-bold text-white">Activity</h1>
          </div>
          <p className="text-white/[0.40] font-body">Your recent actions and events.</p>
        </motion.div>

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6"
          >
            <p className="text-red-400 font-body text-sm">{error}</p>
          </motion.div>
        )}

        {/* Empty state */}
        {!error && activities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-12 text-center"
          >
            <Sparkle className="w-16 h-16 text-violet-400/40 mx-auto mb-4" weight="duotone" />
            <h2 className="text-xl font-display font-bold text-white mb-2">Your journey begins here</h2>
            <p className="text-white/[0.40] font-body mb-6 max-w-sm mx-auto">
              Create something to see your activity. Every creation, like, and follow will appear in your feed.
            </p>
            <button
              onClick={() => router.push('/studio')}
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-6 py-3 font-body transition-colors"
            >
              Open Studio
            </button>
          </motion.div>
        )}

        {/* Activity feed */}
        {activities.length > 0 && (
          <div className="space-y-3">
            {activities.map((item, index) => {
              const actionKey = item.action in ACTION_ICONS ? item.action : 'default';
              const Icon = ACTION_ICONS[actionKey];
              const colorClass = ACTION_COLORS[actionKey];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" weight="duotone" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-body truncate">
                      {getActionDescription(item)}
                    </p>
                    {item.entity_type && (
                      <p className="text-white/[0.25] font-body text-sm truncate">
                        {item.entity_type}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-white/[0.25] flex-shrink-0">
                    <Clock className="w-4 h-4" weight="duotone" />
                    <span className="text-sm font-body whitespace-nowrap">
                      {formatRelativeTime(item.created_at)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
