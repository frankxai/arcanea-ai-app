'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';
import { getCreations, getUserCreations, deleteCreation } from '@/lib/database/services/creation-service';
import type { Creation, CreationType } from '@/lib/database/types/api-responses';
import {
  PhPlus,
  PhFunnel,
  PhImage,
  PhFileText,
  PhMusicNote,
  PhCode,
  PhTrash,
  PhEye,
  PhHeart,
  PhGridFour,
  PhArrowRight,
} from '@/lib/phosphor-icons';

const TYPE_FILTERS: { key: CreationType | 'all'; label: string; icon: typeof PhGridFour }[] = [
  { key: 'all', label: 'All', icon: PhGridFour },
  { key: 'text', label: 'Text', icon: PhFileText },
  { key: 'image', label: 'Image', icon: PhImage },
  { key: 'audio', label: 'Music', icon: PhMusicNote },
  { key: 'code', label: 'Code', icon: PhCode },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function CreationsPage() {
  const { user } = useAuth();
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CreationType | 'all'>('all');

  const loadCreations = useCallback(async () => {
    setLoading(true);
    try {
      const client = createClient();
      const data = user
        ? await getUserCreations(client, user.id, filter === 'all' ? undefined : { type: filter })
        : await getCreations(client, { limit: 50, ...(filter !== 'all' ? { type: filter } : {}) });
      setCreations(data);
    } catch (err) {
      console.warn('Failed to load creations:', err);
    } finally {
      setLoading(false);
    }
  }, [user, filter]);

  useEffect(() => { loadCreations(); }, [loadCreations]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this creation?')) return;
    try {
      await deleteCreation(createClient(), id, user?.id ?? '');
      setCreations((prev) => prev.filter((c) => c.id !== id));
    } catch {
      console.warn('Delete failed');
    }
  };

  const filtered = filter === 'all' ? creations : creations.filter((c) => c.type === filter);

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Your Creations
            </h1>
            <p className="text-sm text-white/60 mt-1">
              {creations.length} creation{creations.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <Link
            href="/chat"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00bcd4]/15 to-[#00897b]/10 text-[#00bcd4] text-sm font-medium border border-[#00bcd4]/20 hover:border-[#00bcd4]/30 hover:shadow-[0_0_16px_rgba(0,188,212,0.1)] transition-all"
          >
            <PhPlus className="w-4 h-4" aria-hidden="true" />
            Create New
          </Link>
        </div>

        {/* Filter tabs */}
        <div
          className="flex items-center gap-1.5 mb-8 p-1 rounded-xl bg-white/[0.03] border border-white/[0.05] w-fit"
          role="group"
          aria-label="Filter creations by type"
        >
          {TYPE_FILTERS.map((f) => {
            const Icon = f.icon;
            const isActive = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={isActive}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00bcd4]/15 to-transparent text-[#00bcd4] shadow-[inset_0_0_0_1px_rgba(0,188,212,0.2)]'
                    : 'text-white/65 hover:text-white/85'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] flex items-center justify-center" aria-hidden="true">
              <PhFunnel className="w-6 h-6 text-white/40" />
            </div>
            <p className="text-white/70 text-sm mb-2">
              {filter === 'all' ? 'No creations yet' : `No ${filter} creations yet`}
            </p>
            <Link href="/chat" className="text-[#00bcd4] text-sm hover:underline">
              Start creating
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((creation) => (
              <div
                key={creation.id}
                className="group relative rounded-xl bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/[0.06] hover:border-[#00bcd4]/20 hover:shadow-[0_0_20px_rgba(0,188,212,0.06)] transition-all duration-300 overflow-hidden"
              >
                {/* Preview */}
                {creation.thumbnailUrl ? (
                  <div className="aspect-video bg-white/[0.02]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={creation.thumbnailUrl}
                      alt={creation.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex items-center justify-center">
                    {creation.type === 'image' && <PhImage className="w-8 h-8 text-white/10" />}
                    {creation.type === 'text' && <PhFileText className="w-8 h-8 text-white/10" />}
                    {creation.type === 'audio' && <PhMusicNote className="w-8 h-8 text-white/10" />}
                    {creation.type === 'code' && <PhCode className="w-8 h-8 text-white/10" />}
                  </div>
                )}

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-white/90 truncate">{creation.title}</h3>
                  <p className="text-[11px] text-white/60 mt-1">{formatDate(creation.createdAt)}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-3">
                    <span className="flex items-center gap-1 text-[11px] text-white/60">
                      <PhEye className="w-3 h-3" aria-hidden="true" />
                      <span className="sr-only">Views:</span>
                      {creation.viewCount ?? 0}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-white/60">
                      <PhHeart className="w-3 h-3" aria-hidden="true" />
                      <span className="sr-only">Likes:</span>
                      {creation.likeCount ?? 0}
                    </span>
                    <span className="text-[10px] text-white/65 px-1.5 py-0.5 rounded bg-white/[0.06]">
                      {creation.type}
                    </span>
                  </div>
                </div>

                {/* Hover actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(creation.id)}
                    className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/40 hover:text-red-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                    aria-label={`Delete ${creation.title}`}
                  >
                    <PhTrash className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
