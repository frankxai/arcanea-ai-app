/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Chapter {
  slug: string;
  title: string;
  wordCount: number;
  order: number;
}

interface ChapterNavProps {
  bookSlug: string;
  chapters: Chapter[];
  currentSlug: string;
  totalWords: number;
}

export function ChapterNav({ bookSlug, chapters, currentSlug, totalWords }: ChapterNavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creatingChapter, setCreatingChapter] = useState(false);
  const router = useRouter();

  const handleCreateChapter = async () => {
    if (!newTitle.trim()) return;
    setCreatingChapter(true);
    try {
      const res = await fetch(`/api/author/${bookSlug}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      const data = await res.json();
      if (data.slug) {
        router.push(`/studio/author/${bookSlug}/${data.slug}`);
        setNewTitle('');
      }
    } finally {
      setCreatingChapter(false);
    }
  };

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-30 px-2 py-4 bg-white/[0.03] border border-white/[0.06] rounded-r-lg text-white/40 hover:text-white/60 transition-colors"
        title="Show chapters"
      >
        <span className="text-xs writing-mode-vertical">Chapters</span>
      </button>
    );
  }

  return (
    <aside className="w-64 flex-shrink-0 border-r border-white/[0.06] bg-[var(--arc-cosmic-void)]/80 backdrop-blur-sm overflow-y-auto h-full">
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-sm font-semibold text-white/70 uppercase tracking-wider">Chapters</h2>
          <button
            onClick={() => setCollapsed(true)}
            className="text-white/30 hover:text-white/50 text-xs"
            title="Collapse"
          >
            &larr;
          </button>
        </div>
        <p className="text-[10px] text-white/25">
          {chapters.length} chapters &middot; {totalWords.toLocaleString()} words
        </p>
      </div>

      <nav className="p-2 space-y-0.5">
        {chapters.map((ch, idx) => {
          const isActive = ch.slug === currentSlug;
          return (
            <Link
              key={ch.slug}
              href={`/studio/author/${bookSlug}/${ch.slug}`}
              className={`group flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/20'
                  : 'hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <span className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono mt-0.5 ${
                isActive
                  ? 'bg-[var(--arc-brand-atlantean-teal)]/20 text-[var(--arc-brand-atlantean-teal)]'
                  : 'bg-white/[0.04] text-white/30'
              }`}>
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-medium truncate ${isActive ? 'text-white/90' : 'text-white/60'}`}>
                  {ch.title}
                </p>
                <p className="text-[10px] text-white/20 mt-0.5">
                  {ch.wordCount.toLocaleString()} words
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* New Chapter */}
      <div className="p-3 border-t border-white/[0.06]">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreateChapter()}
          placeholder="New chapter title..."
          className="w-full px-2 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-[10px] text-white/60 placeholder:text-white/15 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/30 mb-2"
        />
        <button
          onClick={handleCreateChapter}
          disabled={!newTitle.trim() || creatingChapter}
          className="w-full px-2 py-1.5 rounded-md bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/20 text-[10px] text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/20 disabled:opacity-30 transition-all"
        >
          {creatingChapter ? 'Creating...' : '+ New Chapter'}
        </button>
      </div>
    </aside>
  );
}
