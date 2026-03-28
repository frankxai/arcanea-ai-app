'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  PhChatCircle,
  PhPlus,
  PhClock,
  PhTag,
  PhMagnifyingGlass,
  PhArrowLeft,
  PhSparkle,
  PhX,
} from '@/lib/phosphor-icons';

// ── Types ──────────────────────────────────────────────────────────────────

interface DiscussionThread {
  id: string;
  title: string;
  body: string;
  author: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    magicRank?: string;
  };
  replyCount: number;
  lastActivityAt: string;
  tags: string[];
  createdAt: string;
}

// ── Rank colors ────────────────────────────────────────────────────────────

const RANK_COLORS: Record<string, string> = {
  Apprentice: '#94a3b8',
  Mage: '#3b82f6',
  Master: '#8b5cf6',
  Archmage: '#ffd700',
  Luminor: '#7fffd4',
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

// ── Main Page ──────────────────────────────────────────────────────────────

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<DiscussionThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchDiscussions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await fetch(`/api/community/discussions?${params}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setDiscussions(json.data);
          return;
        }
      }
      setDiscussions([]);
    } catch {
      setDiscussions([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/community"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-crystal transition-colors mb-6"
          >
            <PhArrowLeft className="w-3.5 h-3.5" />
            Back to Community
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-crystal/20 bg-crystal/8 mb-4">
                <PhChatCircle className="w-3 h-3 text-crystal" />
                <span className="text-xs font-mono tracking-widest uppercase text-crystal">
                  Discussions
                </span>
              </div>
              <h1 className="text-fluid-4xl font-display font-bold mb-2">
                The Forum of Creation
              </h1>
              <p className="text-text-secondary font-sans max-w-xl">
                Share ideas, ask questions about the lore, discuss techniques,
                and connect with fellow creators across the multiverse.
              </p>
            </div>

            <button
              onClick={() => setShowNewForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200 shrink-0"
            >
              <PhPlus className="w-4 h-4" />
              New Discussion
            </button>
          </div>
        </div>

        {/* New Discussion Form */}
        {showNewForm && (
          <NewDiscussionForm
            onClose={() => setShowNewForm(false)}
            onCreated={() => {
              setShowNewForm(false);
              fetchDiscussions();
            }}
          />
        )}

        {/* Search */}
        <div className="relative mb-8">
          <PhMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search discussions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl liquid-glass border border-white/[0.06] bg-white/[0.03] text-sm text-text-primary placeholder-text-muted font-sans focus:outline-none focus:ring-2 focus:ring-crystal/40 focus:border-crystal/30 transition-all"
            aria-label="Search discussions"
          />
        </div>

        {/* Discussion List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl liquid-glass border border-white/[0.04] animate-pulse"
              >
                <div className="h-5 bg-white/[0.06] rounded w-3/4 mb-3" />
                <div className="h-3 bg-white/[0.04] rounded w-full mb-2" />
                <div className="h-3 bg-white/[0.04] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-16">
            <PhChatCircle className="w-10 h-10 text-text-muted mx-auto mb-4" />
            <p className="text-sm text-text-muted font-sans mb-1">
              No discussions yet
            </p>
            <p className="text-xs text-text-muted/60 font-sans">
              Be the first to start a conversation
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {discussions.map((thread) => (
              <DiscussionCard key={thread.id} thread={thread} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Discussion Card ────────────────────────────────────────────────────────

function DiscussionCard({ thread }: { thread: DiscussionThread }) {
  const rankColor = RANK_COLORS[thread.author.magicRank || 'Apprentice'] || '#94a3b8';

  return (
    <div className="group relative p-5 rounded-2xl liquid-glass border border-white/[0.04] hover:border-white/[0.08] transition-all">
      {/* Title */}
      <h3 className="font-display font-semibold text-base mb-2 text-text-primary group-hover:text-crystal transition-colors">
        {thread.title}
      </h3>

      {/* Body preview */}
      <p className="text-sm text-text-secondary font-sans line-clamp-2 mb-4 leading-relaxed">
        {thread.body}
      </p>

      {/* Tags */}
      {thread.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {thread.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-text-muted"
            >
              <PhTag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: author + stats */}
      <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
        <div className="flex items-center gap-3">
          {/* Author */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold"
              style={{ backgroundColor: `${rankColor}18`, color: rankColor }}
            >
              {thread.author.displayName.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-text-secondary">{thread.author.displayName}</span>
            {thread.author.magicRank && (
              <span
                className="px-1.5 py-0.5 rounded text-[9px]"
                style={{ backgroundColor: `${rankColor}15`, color: rankColor }}
              >
                {thread.author.magicRank}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Reply count */}
          <span className="flex items-center gap-1">
            <PhChatCircle className="w-3 h-3" />
            {thread.replyCount}
          </span>
          {/* Last activity */}
          <span className="flex items-center gap-1">
            <PhClock className="w-3 h-3" />
            {relativeTime(thread.lastActivityAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── New Discussion Form ────────────────────────────────────────────────────

function NewDiscussionForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && tags.length < 5 && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/community/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), tags }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || 'Failed to create discussion. You may need to sign in.');
        return;
      }

      onCreated();
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-8 p-6 rounded-2xl liquid-glass border border-crystal/20 bg-crystal/[0.02]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-semibold text-lg flex items-center gap-2">
          <PhSparkle className="w-4 h-4 text-crystal" />
          Start a new discussion
        </h3>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors"
        >
          <PhX className="w-4 h-4 text-text-muted" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Discussion title..."
            maxLength={200}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-text-primary placeholder-text-muted font-sans focus:outline-none focus:ring-2 focus:ring-crystal/40 focus:border-crystal/30 transition-all"
            required
          />
          <p className="text-[10px] text-text-muted mt-1 font-mono text-right">
            {title.length}/200
          </p>
        </div>

        {/* Content */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, questions, or ideas..."
            maxLength={5000}
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-text-primary placeholder-text-muted font-sans focus:outline-none focus:ring-2 focus:ring-crystal/40 focus:border-crystal/30 transition-all resize-y"
            required
          />
          <p className="text-[10px] text-text-muted mt-1 font-mono text-right">
            {content.length}/5000
          </p>
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add tags (max 5)..."
              className="flex-1 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-text-primary placeholder-text-muted font-mono focus:outline-none focus:ring-2 focus:ring-crystal/40 transition-all"
            />
            <button
              type="button"
              onClick={addTag}
              disabled={tags.length >= 5}
              className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30"
            >
              <PhPlus className="w-3 h-3" />
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-crystal/10 border border-crystal/20 text-[10px] font-mono text-crystal"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-white transition-colors"
                  >
                    <PhX className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-400 font-sans">{error}</p>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-text-muted hover:text-text-secondary transition-colors font-sans"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !title.trim() || !content.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <PhSparkle className="w-4 h-4" />
            )}
            {submitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
}
