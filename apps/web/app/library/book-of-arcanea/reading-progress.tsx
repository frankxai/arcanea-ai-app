'use client';

import { useState, useEffect, useCallback } from 'react';

const TOC_DATA = [
  { num: 1, title: 'Before the Light', id: 'chapter-1-before-the-light' },
  { num: 2, title: 'The First Dawn', id: 'chapter-2-the-first-dawn' },
  { num: 3, title: 'The Five Breaths', id: 'chapter-3-the-five-breaths' },
  { num: 4, title: 'The Fall and the Promise', id: 'chapter-4-the-fall-and-the-promise' },
  { num: 5, title: 'The Gate of Foundation', id: 'chapter-5-the-gate-of-foundation' },
  { num: 6, title: 'The Gate of Flow', id: 'chapter-6-the-gate-of-flow' },
  { num: 7, title: 'The Gate of Fire', id: 'chapter-7-the-gate-of-fire' },
  { num: 8, title: 'The Gate of Heart', id: 'chapter-8-the-gate-of-heart' },
  { num: 9, title: 'The Gate of Voice', id: 'chapter-9-the-gate-of-voice' },
  { num: 10, title: 'The Gate of Sight', id: 'chapter-10-the-gate-of-sight' },
  { num: 11, title: 'The Gate of Crown', id: 'chapter-11-the-gate-of-crown' },
  { num: 12, title: 'The Gate of Starweave', id: 'chapter-12-the-gate-of-starweave' },
  { num: 13, title: 'The Gate of Unity', id: 'chapter-13-the-gate-of-unity' },
  { num: 14, title: 'The Gate of Source', id: 'chapter-14-the-gate-of-source' },
  { num: 15, title: 'The Rank Beyond All Ranks', id: 'chapter-15-the-rank-beyond-all-ranks' },
  { num: 16, title: 'The Council', id: 'chapter-16-the-council' },
  { num: 17, title: 'The Academy', id: 'chapter-17-the-academy' },
  { num: 18, title: 'The Library', id: 'chapter-18-the-library' },
  { num: 19, title: 'The Forge', id: 'chapter-19-the-forge' },
  { num: 20, title: 'The Community', id: 'chapter-20-the-community' },
  { num: 21, title: 'The Five Phases', id: 'chapter-21-the-five-phases' },
  { num: 22, title: 'The Abundance Protocol', id: 'chapter-22-the-abundance-protocol' },
  { num: 23, title: 'The Invitation', id: 'chapter-23-the-invitation' },
];

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const main = document.getElementById('main-content');
      if (!main) return;
      const top = main.offsetTop;
      const height = main.scrollHeight;
      const scrolled = window.scrollY - top;
      const total = height - window.innerHeight;
      const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
      setProgress(pct);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress <= 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-white/[0.04]">
      <div
        className="h-full bg-gradient-to-r from-[#00bcd4] via-[#00bcd4] to-[#ffd700] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function FloatingChapterNav() {
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const scrollToChapter = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    TOC_DATA.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    });

    function handleScroll() {
      setShowNav(window.scrollY > 600);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!showNav) return null;

  const current = TOC_DATA.find((ch) => ch.id === activeChapter);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded chapter list */}
      {isOpen && (
        <div className="mb-3 max-h-[60vh] w-64 overflow-y-auto rounded-xl border border-white/[0.08] bg-[hsl(240,6%,6%)]/95 p-3 shadow-2xl backdrop-blur-md">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Chapters
          </p>
          <div className="space-y-0.5">
            {TOC_DATA.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => scrollToChapter(ch.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                  activeChapter === ch.id
                    ? 'bg-[#00bcd4]/15 text-[#00bcd4]'
                    : 'text-white/40 hover:bg-white/[0.04] hover:text-white/60'
                }`}
              >
                <span className="w-5 text-right text-[10px] text-white/25">
                  {ch.num}
                </span>
                <span className="truncate">{ch.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[hsl(240,6%,6%)]/90 px-4 py-2.5 shadow-lg backdrop-blur-md transition-all hover:border-white/[0.15] hover:bg-[hsl(240,6%,8%)]"
      >
        <span className="text-xs text-[#00bcd4]">
          {current ? `Ch ${current.num}` : 'Nav'}
        </span>
        <span className="max-w-[140px] truncate text-xs text-white/50">
          {current?.title ?? 'Table of Contents'}
        </span>
        <svg
          className={`h-3 w-3 text-white/30 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
