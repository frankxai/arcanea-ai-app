'use client';

import { useState } from 'react';
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
    <aside className="w-64 flex-shrink-0 border-r border-white/[0.06] bg-[#09090b]/80 backdrop-blur-sm overflow-y-auto h-full">
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
                  ? 'bg-[#00bcd4]/10 border border-[#00bcd4]/20'
                  : 'hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <span className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono mt-0.5 ${
                isActive
                  ? 'bg-[#00bcd4]/20 text-[#00bcd4]'
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
    </aside>
  );
}
