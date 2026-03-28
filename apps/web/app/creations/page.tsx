'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import type { Creation } from '@/lib/database/types/api-responses';
import {
  Plus,
  Sparkle,
  Spinner,
  ChatCircleDots,
  ArrowRight,
} from '@/lib/phosphor-icons';
import { CreationCard } from './components/creation-card';
import { CreationFilters, type CreationFilterState } from './components/creation-filters';
import { EditCreationModal } from './components/edit-creation-modal';

// ── Constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

const DEFAULT_FILTERS: CreationFilterState = {
  type: 'all',
  element: 'all',
  gate: 'all',
  status: 'all',
  sort: 'recent',
  search: '',
};

// ── Page ────────────────────────────────────────────────────────────────────

export default function CreationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<CreationFilterState>(DEFAULT_FILTERS);
  const [editingCreation, setEditingCreation] = useState<Creation | null>(null);
  const [collections, setCollections] = useState<{ id: string; title: string }[]>([]);

  // ── Fetch creations ─────────────────────────────────────────────────────

  const fetchCreations = useCallback(
    async (pageNum: number, append = false) => {
      if (!user) return;

      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const params = new URLSearchParams();
        params.set('page', String(pageNum));
        params.set('pageSize', String(PAGE_SIZE));

        if (filters.type !== 'all') params.set('type', filters.type);
        if (filters.element !== 'all') params.set('element', filters.element);
        if (filters.gate !== 'all') params.set('gate', filters.gate);
        if (filters.status !== 'all') params.set('status', filters.status);

        if (filters.sort === 'recent') {
          params.set('sortBy', 'created_at');
          params.set('sortOrder', 'desc');
        } else if (filters.sort === 'oldest') {
          params.set('sortBy', 'created_at');
          params.set('sortOrder', 'asc');
        } else if (filters.sort === 'popular') {
          params.set('sortBy', 'view_count');
          params.set('sortOrder', 'desc');
        } else if (filters.sort === 'title') {
          params.set('sortBy', 'created_at');
          params.set('sortOrder', 'asc');
        }

        // User-scoped: pass visibility so we get all of our own
        params.set('visibility', 'private');

        const res = await fetch(`/api/creations?${params.toString()}`);
        if (!res.ok) return;

        const json = await res.json();
        if (!json.success) return;

        const items: Creation[] = Array.isArray(json.data) ? json.data : json.data?.creations || json.data || [];
        const total = json.meta?.total ?? json.data?.total ?? items.length;

        if (append) {
          setCreations((prev) => [...prev, ...items]);
        } else {
          setCreations(items);
        }

        setTotalCount(total);
        setHasMore(items.length >= PAGE_SIZE);
      } catch {
        // Silently fail — UI will show empty state
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [user, filters]
  );

  // ── Fetch collections ─────────────────────────────────────────────────

  useEffect(() => {
    if (!user) return;
    fetch(`/api/collections?userId=${user.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.collections) {
          setCollections(
            json.data.collections.map((c: { id: string; title: string }) => ({
              id: c.id,
              title: c.title,
            }))
          );
        }
      })
      .catch(() => {});
  }, [user]);

  // ── Refetch on filter change ──────────────────────────────────────────

  useEffect(() => {
    setPage(1);
    fetchCreations(1);
  }, [fetchCreations]);

  // ── Client-side search filter ─────────────────────────────────────────

  const filteredCreations = useMemo(() => {
    if (!filters.search.trim()) return creations;
    const q = filters.search.toLowerCase();
    return creations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [creations, filters.search]);

  // ── Client-side alpha sort ────────────────────────────────────────────

  const sortedCreations = useMemo(() => {
    if (filters.sort === 'title') {
      return [...filteredCreations].sort((a, b) => a.title.localeCompare(b.title));
    }
    return filteredCreations;
  }, [filteredCreations, filters.sort]);

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCreations(nextPage, true);
  };

  const handleSave = async (id: string, updates: Partial<Creation>) => {
    const res = await fetch(`/api/creations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to save');
    const json = await res.json();
    if (!json.success) throw new Error('Failed to save');

    // Update local state
    setCreations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/creations/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setCreations((prev) => prev.filter((c) => c.id !== id));
      setEditingCreation(null);
      setTotalCount((prev) => prev - 1);
    }
  };

  const handleTogglePublish = async (id: string, newStatus: 'draft' | 'published') => {
    await handleSave(id, { status: newStatus });
  };

  const handleAddToCollection = async (creationId: string, collectionId?: string) => {
    if (!collectionId) {
      // Open edit modal with collection focus
      const creation = creations.find((c) => c.id === creationId);
      if (creation) setEditingCreation(creation);
      return;
    }
    try {
      await fetch(`/api/collections/${collectionId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creationId }),
      });
    } catch {
      // Silent fail
    }
  };

  // ── Auth guard ────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size={32} className="text-[#00bcd4] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-teal-400/10 flex items-center justify-center">
            <Sparkle size={32} weight="duotone" className="text-teal-400" />
          </div>
          <h1 className="font-display text-2xl text-white">Sign in to view your creations</h1>
          <p className="text-sm text-white/40">
            Your saved worlds, characters, stories, and code live here.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] text-white font-medium text-sm transition-all hover:shadow-lg hover:shadow-[#00bcd4]/25"
          >
            Sign in
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl bg-gradient-to-r from-[#ffd700] via-amber-400 to-[#ffd700] bg-clip-text text-transparent">
            My Creations
          </h1>
          <p className="text-sm text-white/40 mt-1">Your universe of saved works</p>
        </div>
        <Link
          href="/chat"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-400/10 border border-teal-400/20 text-teal-400 text-sm font-medium hover:bg-teal-400/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New
        </Link>
      </div>

      {/* Filters */}
      <CreationFilters
        filters={filters}
        onChange={setFilters}
        totalCount={totalCount}
      />

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-[#0d0d14] p-4 space-y-3 animate-pulse">
              <div className="h-4 w-3/4 bg-white/[0.06] rounded" />
              <div className="h-3 w-full bg-white/[0.04] rounded" />
              <div className="h-3 w-1/2 bg-white/[0.04] rounded" />
              <div className="flex gap-1">
                <div className="h-4 w-12 bg-white/[0.04] rounded" />
                <div className="h-4 w-16 bg-white/[0.04] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedCreations.length === 0 ? (
        <EmptyState hasFilters={JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS)} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedCreations.map((creation) => (
              <CreationCard
                key={creation.id}
                creation={creation}
                onEdit={setEditingCreation}
                onDelete={handleDelete}
                onTogglePublish={handleTogglePublish}
                onAddToCollection={(id) => handleAddToCollection(id)}
              />
            ))}
          </div>

          {/* Footer: count + load more */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-white/25">
              Showing {sortedCreations.length} of {totalCount} creation{totalCount !== 1 ? 's' : ''}
            </span>
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-4 py-2 rounded-lg border border-white/[0.08] text-xs text-white/50 hover:text-white/70 hover:bg-white/[0.04] disabled:opacity-40 transition-colors"
              >
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            )}
          </div>
        </>
      )}

      {/* Edit modal */}
      {editingCreation && (
        <EditCreationModal
          creation={editingCreation}
          collections={collections}
          onClose={() => setEditingCreation(null)}
          onSave={handleSave}
          onDelete={handleDelete}
          onAddToCollection={(cId, colId) => handleAddToCollection(cId, colId)}
        />
      )}
    </div>
  );
}

// ── Empty state component ─────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  if (hasFilters) {
    return (
      <div className="py-16 text-center space-y-3">
        <p className="text-sm text-white/30">No creations match these filters.</p>
        <p className="text-xs text-white/20">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="py-20 text-center space-y-6">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-teal-400/10 flex items-center justify-center">
        <Sparkle size={32} weight="duotone" className="text-teal-400/50" />
      </div>
      <div className="space-y-2">
        <h2 className="font-display text-xl text-white/70">
          Your universe awaits its first creation
        </h2>
        <p className="text-sm text-white/30 max-w-md mx-auto">
          Start chatting to build worlds, characters, and stories. Everything you save will appear here.
        </p>
      </div>
      <Link
        href="/chat"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#00bcd4]/80 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-[#00bcd4]/20 hover:-translate-y-0.5"
      >
        <ChatCircleDots size={18} />
        Go to Chat
      </Link>
    </div>
  );
}
