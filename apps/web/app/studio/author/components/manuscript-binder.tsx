/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  FolderOpen,
  FileText,
  Plus,
  MagnifyingGlass,
  CheckCircle,
  Clock,
  Sparkle,
  TreeStructure,
  CaretDown,
  CaretRight,
  ChartBar,
} from '@/lib/phosphor-icons';
import type { ChapterMetadata, ChapterStatus } from '@/lib/author/types';

interface ManuscriptBinderProps {
  bookSlug: string;
  bookTitle: string;
  currentSlug: string;
  chapters: Array<{
    slug: string;
    title: string;
    wordCount: number;
    order: number;
    status?: ChapterStatus;
    act?: string;
  }>;
  totalWords: number;
  wordCountTarget?: number;
}

function StatusDot({ status }: { status?: ChapterStatus }) {
  switch (status) {
    case 'canon-verified':
    case 'polished':
      return <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" title="Polished / Verified" />;
    case 'review':
      return <span className="w-1.5 h-1.5 rounded-full bg-[var(--arc-brand-arcanean-gold)] shadow-[0_0_6px_rgba(251,191,36,0.6)]" title="In Review" />;
    case 'drafting':
      return <span className="w-1.5 h-1.5 rounded-full bg-[var(--arc-brand-atlantean-teal)] shadow-[0_0_6px_rgba(45,212,191,0.6)]" title="Drafting" />;
    default:
      return <span className="w-1.5 h-1.5 rounded-full bg-white/20" title="Outlined" />;
  }
}

export function ManuscriptBinder({
  bookSlug,
  bookTitle,
  currentSlug,
  chapters,
  totalWords,
  wordCountTarget = 80000,
}: ManuscriptBinderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedActs, setCollapsedActs] = useState<Record<string, boolean>>({});
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // Group chapters by Act if available, or default to single group
  const groupedChapters = useMemo(() => {
    const filtered = chapters.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: Record<string, typeof chapters> = {};
    for (const ch of filtered) {
      const act = ch.act || 'Act I: The Beginning';
      if (!groups[act]) groups[act] = [];
      groups[act].push(ch);
    }
    return groups;
  }, [chapters, searchQuery]);

  const toggleAct = (act: string) => {
    setCollapsedActs((prev) => ({ ...prev, [act]: !prev[act] }));
  };

  const progressPercent = Math.min(100, Math.round((totalWords / wordCountTarget) * 100));

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    try {
      const res = await fetch(`/api/author/${bookSlug}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, slug }),
      });
      if (res.ok) {
        setIsAddingChapter(false);
        setNewTitle('');
        router.push(`/studio/author/${bookSlug}/${slug}`);
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to create chapter:', err);
    }
  };

  return (
    <aside className="w-72 flex-shrink-0 border-r border-white/[0.06] bg-[var(--arc-cosmic-void)]/90 backdrop-blur-md flex flex-col h-full select-none">
      {/* Binder Header */}
      <div className="p-3.5 border-b border-white/[0.06] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen size={16} className="text-[var(--arc-brand-atlantean-teal)] flex-shrink-0" />
            <h2 className="font-display text-xs font-semibold text-white/80 truncate">
              {bookTitle}
            </h2>
          </div>
          <button
            onClick={() => setIsAddingChapter(true)}
            className="p-1 rounded-md text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-colors"
            title="Add Chapter"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Search Filter */}
        <div className="relative">
          <MagnifyingGlass
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter binder..."
            className="w-full pl-7 pr-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[11px] text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/30"
          />
        </div>

        {/* Word Count Metric */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[10px] text-white/40">
            <span>Manuscript Progress</span>
            <span className="font-mono text-white/60">
              {totalWords.toLocaleString()} / {wordCountTarget.toLocaleString()} w
            </span>
          </div>
          <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-arcanean-gold)] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="px-3 py-2 border-b border-white/[0.04] flex items-center justify-between text-[11px] text-white/40">
        <Link
          href={`/studio/author/${bookSlug}/graph`}
          className="flex items-center gap-1.5 hover:text-[var(--arc-brand-atlantean-teal)] transition-colors"
        >
          <TreeStructure size={13} />
          <span>Entity Graph</span>
        </Link>
        <Link
          href={`/studio/author/${bookSlug}/publish`}
          className="flex items-center gap-1.5 hover:text-[var(--arc-brand-arcanean-gold)] transition-colors"
        >
          <Sparkle size={13} />
          <span>Publish Hub</span>
        </Link>
      </div>

      {/* Chapter Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {Object.entries(groupedChapters).map(([actName, actChapters]) => {
          const isCollapsed = collapsedActs[actName];
          const actWords = actChapters.reduce((sum, c) => sum + c.wordCount, 0);

          return (
            <div key={actName} className="space-y-1">
              {/* Act Header */}
              <button
                onClick={() => toggleAct(actName)}
                className="w-full flex items-center justify-between px-2 py-1 rounded text-[10px] font-sans uppercase tracking-wider text-white/40 hover:text-white/70 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-1.5 truncate">
                  {isCollapsed ? <CaretRight size={10} /> : <CaretDown size={10} />}
                  <span className="truncate">{actName}</span>
                </div>
                <span className="font-mono text-[9px] text-white/25">
                  {actWords.toLocaleString()} w
                </span>
              </button>

              {/* Chapters */}
              {!isCollapsed && (
                <div className="space-y-0.5 pl-2">
                  {actChapters.map((ch) => {
                    const isActive = ch.slug === currentSlug;
                    return (
                      <Link
                        key={ch.slug}
                        href={`/studio/author/${bookSlug}/${ch.slug}`}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans transition-all group ${
                          isActive
                            ? 'bg-[var(--arc-brand-atlantean-teal)]/15 border border-[var(--arc-brand-atlantean-teal)]/25 text-white font-medium shadow-[0_0_12px_rgba(45,212,191,0.08)]'
                            : 'text-white/50 hover:text-white/80 hover:bg-white/[0.03] border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <StatusDot status={ch.status} />
                          <span className="truncate">{ch.title}</span>
                        </div>
                        <span className="font-mono text-[10px] text-white/25 group-hover:text-white/40 flex-shrink-0">
                          {ch.wordCount.toLocaleString()}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {chapters.length === 0 && (
          <div className="p-4 text-center text-xs text-white/30">
            No chapters found. Click + to begin writing.
          </div>
        )}
      </div>

      {/* New Chapter Modal Inline */}
      {isAddingChapter && (
        <form onSubmit={handleCreateChapter} className="p-3 border-t border-white/[0.06] bg-white/[0.02]">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Chapter Title..."
            autoFocus
            className="w-full px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/40 mb-2"
          />
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setIsAddingChapter(false)}
              className="px-2 py-0.5 rounded text-[10px] text-white/40 hover:text-white/70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="px-2 py-0.5 rounded bg-[var(--arc-brand-atlantean-teal)]/20 text-[var(--arc-brand-atlantean-teal)] text-[10px] font-medium hover:bg-[var(--arc-brand-atlantean-teal)]/30 disabled:opacity-40"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Status Footer */}
      <div className="p-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-white/30">
        <span className="flex items-center gap-1">
          <Clock size={11} /> {chapters.length} chapters
        </span>
        <span className="font-mono text-[var(--arc-brand-atlantean-teal)]/60">
          ~{Math.ceil(totalWords / 250)} min read
        </span>
      </div>
    </aside>
  );
}
