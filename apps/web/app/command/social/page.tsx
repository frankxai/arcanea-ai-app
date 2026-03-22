'use client';

import { useCallback, useState } from 'react';
import { useSocialQueue } from '@/lib/command-center/hooks';
import { createClient } from '@/lib/supabase/client';
import type {
  SocialPlatform,
  SocialQueueItem,
  SocialStatus,
} from '@/lib/command-center/types';

const PLATFORMS: SocialPlatform[] = [
  'instagram',
  'linkedin',
  'x',
  'youtube',
  'tiktok',
];

const STATUSES: SocialStatus[] = [
  'draft',
  'ready',
  'approved',
  'scheduled',
  'publishing',
  'published',
  'failed',
];

const PLATFORM_ICONS: Record<SocialPlatform, string> = {
  instagram: 'IG',
  linkedin: 'LI',
  x: 'X',
  youtube: 'YT',
  tiktok: 'TK',
};

const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  instagram: '#e1306c',
  linkedin: '#0077b5',
  x: '#ffffff',
  youtube: '#ff0000',
  tiktok: '#00f2ea',
};

const STATUS_BG: Record<SocialStatus, string> = {
  draft: 'bg-white/10 text-white/50',
  ready: 'bg-blue-500/15 text-blue-300',
  approved: 'bg-green-500/15 text-green-300',
  scheduled: 'bg-purple-500/15 text-purple-300',
  publishing: 'bg-yellow-500/15 text-yellow-300',
  published: 'bg-[#7fffd4]/15 text-[#7fffd4]',
  failed: 'bg-red-500/15 text-red-300',
};

export default function SocialPage() {
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | null>(null);
  const [statusFilter, setStatusFilter] = useState<SocialStatus | null>(null);
  const [selectedPost, setSelectedPost] = useState<SocialQueueItem | null>(null);

  const { items, loading } = useSocialQueue({
    platform: platformFilter,
    status: statusFilter,
  });

  const handleApprove = useCallback(async (id: string) => {
    const supabase = createClient();
    await (supabase
      .from('social_queue' as never)
      .update({ status: 'approved', updated_at: new Date().toISOString() } as never) as never as { eq: (col: string, val: string) => Promise<unknown> })
      .eq('id', id);
  }, []);

  const handleSchedule = useCallback(async (id: string) => {
    const supabase = createClient();
    const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await (supabase
      .from('social_queue' as never)
      .update({ status: 'scheduled', scheduled_at: scheduledAt, updated_at: new Date().toISOString() } as never) as never as { eq: (col: string, val: string) => Promise<unknown> })
      .eq('id', id);
  }, []);

  // Group items by day for calendar view
  const weekDays = getWeekDays();
  const itemsByDay = groupByDay(items);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Social
        </h1>
        <p className="text-sm text-white/50 mt-0.5">
          Content calendar and social queue management
        </p>
      </div>

      {/* Week calendar */}
      <section>
        <h2
          className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          This Week
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dayItems = itemsByDay[day.key] ?? [];
            const isToday = day.isToday;
            return (
              <div
                key={day.key}
                className={`
                  bg-white/5 backdrop-blur-sm border rounded-xl p-3 min-h-[120px]
                  ${isToday ? 'border-[#7fffd4]/30' : 'border-white/10'}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] uppercase tracking-wider ${
                      isToday ? 'text-[#7fffd4]' : 'text-white/40'
                    }`}
                  >
                    {day.label}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      isToday ? 'text-[#7fffd4]' : 'text-white/30'
                    }`}
                  >
                    {day.date}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayItems.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedPost(item)}
                      className="w-full text-left"
                    >
                      <div
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <span
                          className="text-[9px] font-bold"
                          style={{
                            color: PLATFORM_COLORS[item.platform],
                          }}
                        >
                          {PLATFORM_ICONS[item.platform]}
                        </span>
                        <span className="text-[10px] text-white/50 truncate">
                          {item.caption.slice(0, 30)}
                        </span>
                      </div>
                    </button>
                  ))}
                  {dayItems.length > 3 && (
                    <p className="text-[10px] text-white/30 pl-2">
                      +{dayItems.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={platformFilter ?? ''}
          onChange={(e) =>
            setPlatformFilter(
              (e.target.value as SocialPlatform) || null
            )
          }
          className="px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white/70 focus:outline-none focus:border-[#7fffd4]/40"
        >
          <option value="">All Platforms</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={statusFilter ?? ''}
          onChange={(e) =>
            setStatusFilter(
              (e.target.value as SocialStatus) || null
            )
          }
          className="px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white/70 focus:outline-none focus:border-[#7fffd4]/40"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Queue list */}
      <section>
        <h2
          className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Queue ({items.length})
        </h2>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse h-16"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
            <p className="text-white/40 text-sm">
              No posts in the queue matching these filters.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-[#7fffd4]/20 transition-all cursor-pointer flex items-center gap-4"
                onClick={() => setSelectedPost(item)}
              >
                {/* Platform badge */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    backgroundColor: `${PLATFORM_COLORS[item.platform]}15`,
                    color: PLATFORM_COLORS[item.platform],
                  }}
                >
                  {PLATFORM_ICONS[item.platform]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 truncate">
                    {item.caption}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${STATUS_BG[item.status]}`}
                    >
                      {item.status}
                    </span>
                    {item.scheduled_at && (
                      <span className="text-[10px] text-white/30">
                        {new Date(item.scheduled_at).toLocaleDateString()} at{' '}
                        {new Date(item.scheduled_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                    {item.hashtags.length > 0 && (
                      <span className="text-[10px] text-white/20">
                        {item.hashtags.slice(0, 3).join(' ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  {(item.status === 'draft' || item.status === 'ready') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(item.id);
                      }}
                      className="px-3 py-1.5 text-[10px] font-medium rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {item.status === 'approved' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSchedule(item.id);
                      }}
                      className="px-3 py-1.5 text-[10px] font-medium rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                    >
                      Schedule
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Post preview modal */}
      {selectedPost && (
        <PostPreviewModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onApprove={() => {
            handleApprove(selectedPost.id);
            setSelectedPost(null);
          }}
          onSchedule={() => {
            handleSchedule(selectedPost.id);
            setSelectedPost(null);
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Post preview modal with platform mockup frames
// ---------------------------------------------------------------------------

function PostPreviewModal({
  post,
  onClose,
  onApprove,
  onSchedule,
}: {
  post: SocialQueueItem;
  onClose: () => void;
  onApprove: () => void;
  onSchedule: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1117] border border-white/10 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-bold"
                style={{ color: PLATFORM_COLORS[post.platform] }}
              >
                {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${STATUS_BG[post.status]}`}
              >
                {post.status}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Platform mockup frame */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7fffd4] to-[#3b82f6]" />
              <div>
                <p className="text-xs font-medium text-white/80">Arcanea</p>
                <p className="text-[10px] text-white/30">@arcanea_ai</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
              {post.caption}
            </p>
            {post.hashtags.length > 0 && (
              <p className="text-xs text-[#7fffd4]/60 mt-2">
                {post.hashtags.join(' ')}
              </p>
            )}
          </div>

          {/* Scheduling info */}
          {post.scheduled_at && (
            <div className="text-xs text-white/40">
              Scheduled for{' '}
              {new Date(post.scheduled_at).toLocaleDateString()} at{' '}
              {new Date(post.scheduled_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {(post.status === 'draft' || post.status === 'ready') && (
              <button
                onClick={onApprove}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
              >
                Approve
              </button>
            )}
            {(post.status === 'approved' || post.status === 'draft' || post.status === 'ready') && (
              <button
                onClick={onSchedule}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
              >
                Schedule
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const days = [];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: dayLabels[i],
      date: d.getDate().toString(),
      isToday: d.toDateString() === today.toDateString(),
    });
  }

  return days;
}

function groupByDay(
  items: SocialQueueItem[]
): Record<string, SocialQueueItem[]> {
  const map: Record<string, SocialQueueItem[]> = {};
  for (const item of items) {
    const dateStr = item.scheduled_at
      ? item.scheduled_at.slice(0, 10)
      : item.created_at.slice(0, 10);
    if (!map[dateStr]) map[dateStr] = [];
    map[dateStr].push(item);
  }
  return map;
}
