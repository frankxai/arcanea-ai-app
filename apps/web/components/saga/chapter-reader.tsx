'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ReadingToolbar } from './reading-toolbar';

const ChatMarkdown = dynamic(() => import('@/components/chat/chat-markdown'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-4 bg-white/[0.04] rounded w-3/4" />,
});

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type ReadingTheme = 'dark' | 'light' | 'sepia' | 'cosmic';
export type FontSize = 14 | 18 | 22 | 26 | 30;
export type FontFamily = 'serif' | 'sans';
export type LineHeight = 'compact' | 'normal' | 'relaxed';

const THEME_CYCLE: ReadingTheme[] = ['dark', 'light', 'sepia', 'cosmic'];
const FONT_SIZES: FontSize[] = [14, 18, 22, 26, 30];
const LINE_HEIGHT_CYCLE: LineHeight[] = ['compact', 'normal', 'relaxed'];

interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface ChapterReaderProps {
  bookId: string;
  bookTitle: string;
  chapterNumber: number;
  totalChapters: number;
  title: string;
  content: string;
  wordCount: number;
  readTime: number;
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}

/* ------------------------------------------------------------------ */
/*  Theme styles                                                        */
/* ------------------------------------------------------------------ */

function getThemeStyles(theme: ReadingTheme) {
  switch (theme) {
    case 'light':
      return {
        bg: 'bg-[#faf8f5]',
        text: 'text-gray-900',
        subtext: 'text-gray-500',
        border: 'border-gray-200',
        prose: 'prose prose-gray prose-lg max-w-none prose-p:text-gray-800 prose-p:leading-[1.8] prose-p:mb-6 prose-headings:text-gray-900 prose-headings:font-display prose-blockquote:border-l-gray-300 prose-blockquote:text-gray-500 prose-strong:text-gray-900 prose-em:text-gray-700 prose-hr:border-gray-200',
        linkColor: 'text-gray-400 hover:text-gray-600',
        backLinkColor: 'text-gray-300 hover:text-gray-500',
        noteBtn: 'text-gray-400 hover:text-gray-600 border border-gray-200 hover:bg-gray-50',
        noteArea: 'bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-300',
        progressBar: 'bg-[#00bcd4]/70',
        navNext: 'text-[#00968a] hover:text-[#00bcd4]',
      };
    case 'sepia':
      return {
        bg: 'bg-[#f4ecd8]',
        text: 'text-[#5c4b37]',
        subtext: 'text-[#9a8070]',
        border: 'border-[#e0ceb4]',
        prose: 'prose prose-stone prose-lg max-w-none prose-p:text-[#5c4b37] prose-p:leading-[1.8] prose-p:mb-6 prose-headings:text-[#3d2b1f] prose-headings:font-display prose-blockquote:border-l-[#c8a87a] prose-blockquote:text-[#8a7060] prose-strong:text-[#3d2b1f] prose-em:text-[#7a6555] prose-hr:border-[#e0ceb4]',
        linkColor: 'text-[#b8956a] hover:text-[#8a6a40]',
        backLinkColor: 'text-[#c8a87a] hover:text-[#8a6a40]',
        noteBtn: 'text-[#9a8070] hover:text-[#5c4b37] border border-[#e0ceb4] hover:bg-[#ede0ca]',
        noteArea: 'bg-[#ede0ca] border border-[#d8c4a0] text-[#5c4b37] placeholder-[#b8a090]',
        progressBar: 'bg-[#c8a87a]',
        navNext: 'text-[#8a6a40] hover:text-[#5c4b37]',
      };
    case 'cosmic':
      return {
        bg: 'bg-gradient-to-br from-[#050516] via-[#0a0628] to-[#0d0520]',
        text: 'text-gray-100',
        subtext: 'text-purple-300/60',
        border: 'border-purple-500/10',
        prose: 'prose prose-invert prose-lg max-w-none prose-p:text-gray-200/90 prose-p:leading-[1.8] prose-p:mb-6 prose-headings:text-purple-200 prose-headings:font-display prose-blockquote:border-l-purple-500/40 prose-blockquote:text-purple-300/60 prose-strong:text-white prose-em:text-purple-200/80 prose-hr:border-purple-500/10',
        linkColor: 'text-purple-400/60 hover:text-purple-300',
        backLinkColor: 'text-purple-400/40 hover:text-purple-300/60',
        noteBtn: 'text-purple-400/40 hover:text-purple-300/60 border border-purple-500/10 hover:bg-purple-500/5',
        noteArea: 'bg-purple-500/5 border border-purple-500/10 text-purple-200/70 placeholder-purple-400/30',
        progressBar: 'bg-gradient-to-r from-purple-500 to-[#00bcd4]',
        navNext: 'text-purple-400/60 hover:text-purple-300',
      };
    default: // dark
      return {
        bg: 'bg-[#0a0a0f]',
        text: 'text-white',
        subtext: 'text-white/20',
        border: 'border-white/[0.06]',
        prose: 'prose prose-invert prose-lg max-w-none prose-p:text-white/80 prose-p:leading-[1.8] prose-p:mb-6 prose-headings:text-white/90 prose-headings:font-display prose-blockquote:border-l-[#00bcd4]/30 prose-blockquote:text-white/60 prose-strong:text-white/90 prose-em:text-white/70 prose-hr:border-white/[0.06]',
        linkColor: 'text-white/40 hover:text-white/60',
        backLinkColor: 'text-white/30 hover:text-white/50',
        noteBtn: 'text-white/30 hover:text-white/50 border border-white/[0.06] hover:bg-white/[0.02]',
        noteArea: 'bg-white/[0.03] border border-white/[0.08] text-white/70 placeholder-white/20',
        progressBar: 'bg-[#00bcd4]/60',
        navNext: 'text-[#00bcd4]/60 hover:text-[#00bcd4]',
      };
  }
}

function getFontSizeClass(size: FontSize): string {
  switch (size) {
    case 14: return 'text-sm';
    case 18: return 'text-lg';
    case 22: return 'text-xl';
    case 26: return 'text-2xl';
    case 30: return 'text-3xl';
  }
}

function getLineHeightClass(lh: LineHeight): string {
  switch (lh) {
    case 'compact': return 'leading-snug';
    case 'relaxed': return 'leading-loose';
    default: return 'leading-relaxed';
  }
}

/* ------------------------------------------------------------------ */
/*  Extract TOC headings from markdown                                  */
/* ------------------------------------------------------------------ */

function extractHeadings(content: string): TocHeading[] {
  const lines = content.split('\n');
  const headings: TocHeading[] = [];
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2) {
      const text = h2[1].trim();
      headings.push({ id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), text, level: 2 });
    } else if (h3) {
      const text = h3[1].trim();
      headings.push({ id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), text, level: 3 });
    }
  }
  return headings;
}

/* ------------------------------------------------------------------ */
/*  Storage helpers                                                     */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'arcanea-reader-prefs';

interface ReaderPrefs {
  theme: ReadingTheme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  lineHeight: LineHeight;
}

function loadPrefs(): ReaderPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ReaderPrefs;
  } catch { /* ignore */ }
  return { theme: 'dark', fontSize: 18, fontFamily: 'serif', lineHeight: 'normal' };
}

function savePrefs(prefs: ReaderPrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch { /* ignore */ }
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */

export function ChapterReader({
  bookId, bookTitle, chapterNumber, totalChapters,
  title, content, wordCount, readTime, prev, next,
}: ChapterReaderProps) {
  // Reading preferences
  const [theme, setTheme] = useState<ReadingTheme>('dark');
  const [fontSize, setFontSize] = useState<FontSize>(18);
  const [fontFamily, setFontFamily] = useState<FontFamily>('serif');
  const [lineHeight, setLineHeight] = useState<LineHeight>('normal');

  // Progress & scroll
  const [progress, setProgress] = useState(0);
  const [toolbarVisible, setToolbarVisible] = useState(true);

  // TOC
  const [showToc, setShowToc] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const tocHeadings = extractHeadings(content);

  // Notes (existing functionality preserved)
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Reactions / bookmark
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reactionCount, setReactionCount] = useState(0);

  // Touch gesture refs
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const scrollYRef = useRef(0);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const chapterSlug = title.toLowerCase().replace(/\s+/g, '-');

  /* ---------------------------------------------------------------- */
  /*  Load prefs from localStorage                                     */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const prefs = loadPrefs();
    setTheme(prefs.theme);
    setFontSize(prefs.fontSize);
    setFontFamily(prefs.fontFamily);
    setLineHeight(prefs.lineHeight);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Scroll progress + toolbar auto-hide                              */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const handler = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);

      // Auto-hide toolbar while scrolling
      const delta = Math.abs(scrolled - scrollYRef.current);
      scrollYRef.current = scrolled;

      if (delta > 5) {
        setToolbarVisible(false);
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = setTimeout(() => setToolbarVisible(true), 800);
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => {
      window.removeEventListener('scroll', handler);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Keyboard navigation                                              */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowLeft' && prev) window.location.href = `/books/${bookId}/${prev.id}`;
      if (e.key === 'ArrowRight' && next) window.location.href = `/books/${bookId}/${next.id}`;
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [bookId, prev, next]);

  /* ---------------------------------------------------------------- */
  /*  TOC IntersectionObserver                                         */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (tocHeadings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveHeading(entry.target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    for (const h of tocHeadings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [tocHeadings]);

  /* ---------------------------------------------------------------- */
  /*  Fetch reactions                                                  */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const res = await fetch(`/api/saga/reactions?bookId=${bookId}&chapterSlug=${chapterSlug}`);
        if (!res.ok) return;
        const data = await res.json() as { count?: number; bookmarked?: boolean };
        if (typeof data.count === 'number') setReactionCount(data.count);
        if (typeof data.bookmarked === 'boolean') setIsBookmarked(data.bookmarked);
      } catch { /* silent */ }
    };
    fetchReactions();
  }, [bookId, chapterSlug]);

  /* ---------------------------------------------------------------- */
  /*  Touch gesture handlers (swipe nav + edge taps)                  */
  /* ---------------------------------------------------------------- */

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    // Only treat as horizontal swipe if horizontal movement dominates
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    if (dx < -60 && next) window.location.href = `/books/${bookId}/${next.id}`;
    if (dx > 60 && prev) window.location.href = `/books/${bookId}/${prev.id}`;
  }, [bookId, prev, next]);

  const handleTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only process clicks directly on the overlay div, not bubbled events from interactive elements
    if ((e.target as HTMLElement).closest('a,button,textarea,input')) return;
    const x = e.clientX;
    const width = window.innerWidth;
    if (x < width * 0.2 && prev) window.location.href = `/books/${bookId}/${prev.id}`;
    if (x > width * 0.8 && next) window.location.href = `/books/${bookId}/${next.id}`;
  }, [bookId, prev, next]);

  /* ---------------------------------------------------------------- */
  /*  Preference mutations                                             */
  /* ---------------------------------------------------------------- */

  const handleThemeCycle = useCallback(() => {
    setTheme((t) => {
      const idx = THEME_CYCLE.indexOf(t);
      const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
      savePrefs({ theme: next, fontSize, fontFamily, lineHeight });
      return next;
    });
  }, [fontSize, fontFamily, lineHeight]);

  const handleFontSizeUp = useCallback(() => {
    setFontSize((s) => {
      const idx = FONT_SIZES.indexOf(s);
      const next = idx < FONT_SIZES.length - 1 ? FONT_SIZES[idx + 1] : s;
      savePrefs({ theme, fontSize: next, fontFamily, lineHeight });
      return next;
    });
  }, [theme, fontFamily, lineHeight]);

  const handleFontSizeDown = useCallback(() => {
    setFontSize((s) => {
      const idx = FONT_SIZES.indexOf(s);
      const next = idx > 0 ? FONT_SIZES[idx - 1] : s;
      savePrefs({ theme, fontSize: next, fontFamily, lineHeight });
      return next;
    });
  }, [theme, fontFamily, lineHeight]);

  const handleFontFamilyToggle = useCallback(() => {
    setFontFamily((f) => {
      const next: FontFamily = f === 'serif' ? 'sans' : 'serif';
      savePrefs({ theme, fontSize, fontFamily: next, lineHeight });
      return next;
    });
  }, [theme, fontSize, lineHeight]);

  const handleLineHeightCycle = useCallback(() => {
    setLineHeight((lh) => {
      const idx = LINE_HEIGHT_CYCLE.indexOf(lh);
      const next = LINE_HEIGHT_CYCLE[(idx + 1) % LINE_HEIGHT_CYCLE.length];
      savePrefs({ theme, fontSize, fontFamily, lineHeight: next });
      return next;
    });
  }, [theme, fontSize, fontFamily]);

  const handleBookmarkToggle = useCallback(async () => {
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    try {
      await fetch('/api/saga/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, chapterSlug, type: 'bookmark', value: newState }),
      });
      if (newState) setReactionCount((c) => c + 1);
      else setReactionCount((c) => Math.max(0, c - 1));
    } catch { /* silent */ }
  }, [bookId, chapterSlug, isBookmarked]);

  /* ---------------------------------------------------------------- */
  /*  Notes (existing)                                                 */
  /* ---------------------------------------------------------------- */

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    try {
      await fetch('/api/saga/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, chapterSlug, content: noteText }),
      });
      setNoteText('');
      setShowNotes(false);
    } catch { /* silent */ }
  };

  /* ---------------------------------------------------------------- */
  /*  Derived values                                                   */
  /* ---------------------------------------------------------------- */

  const s = getThemeStyles(theme);
  const fontSizeClass = getFontSizeClass(fontSize);
  const lineHeightClass = getLineHeightClass(lineHeight);
  const fontFamilyClass = fontFamily === 'serif' ? 'font-serif' : 'font-sans';
  const wordsRead = Math.round((progress / 100) * wordCount);
  const minutesLeft = Math.max(0, Math.ceil(((wordCount - wordsRead) / 250)));
  const isLight = theme === 'light' || theme === 'sepia';

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div
      className={`min-h-screen ${s.bg} ${s.text} transition-colors duration-300`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleTap}
    >
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50">
        <div
          className={`h-full ${s.progressBar} transition-[width] duration-150`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header / breadcrumb */}
      <div className="max-w-[680px] mx-auto px-6 pt-8 pb-4">
        <Link href={`/books/${bookId}`} className={`text-xs ${s.backLinkColor} transition-colors`}>
          &larr; {bookTitle}
        </Link>
        <div className={`flex flex-wrap items-center justify-between mt-1 text-xs ${s.subtext} gap-2`}>
          <span>
            Chapter {chapterNumber} of {totalChapters}
            {progress > 0 && (
              <span className="ml-2 opacity-70">
                &middot; {Math.round(progress)}% complete
                {minutesLeft > 0 ? ` · ${minutesLeft} min left` : ' · Finished'}
              </span>
            )}
          </span>
          <span>{wordCount.toLocaleString()} words &middot; {readTime} min read</span>
        </div>
      </div>

      {/* Chapter title */}
      <header className={`max-w-[680px] mx-auto px-6 pb-8 border-b ${s.border}`}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">{title}</h1>
      </header>

      {/* Content area with optional TOC sidebar */}
      <div className="max-w-[680px] mx-auto flex gap-0">
        <article className="flex-1 px-6 py-10 min-w-0">
          <div
            className={`${s.prose} ${fontSizeClass} ${lineHeightClass} ${fontFamilyClass}`}
          >
            <ChatMarkdown content={content} />
          </div>
        </article>
      </div>

      {/* TOC slide-in panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 z-30 transition-transform duration-300 ${
          showToc ? 'translate-x-0' : 'translate-x-full'
        } ${isLight ? 'bg-white/95 border-l border-gray-200' : 'bg-[#0d0d14]/95 border-l border-white/[0.07]'} backdrop-blur-xl pt-20 pb-24 overflow-y-auto`}
        aria-hidden={!showToc}
      >
        <div className="px-5">
          <p className={`text-[10px] uppercase tracking-widest mb-4 ${isLight ? 'text-gray-400' : 'text-white/25'}`}>
            In this chapter
          </p>
          <nav className="space-y-0.5">
            {tocHeadings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={() => setShowToc(false)}
                className={`block text-[12px] py-1 transition-colors truncate ${
                  h.level === 3 ? 'pl-3' : ''
                } ${
                  activeHeading === h.id
                    ? 'text-[#00bcd4] font-medium'
                    : isLight
                    ? 'text-gray-400 hover:text-gray-700'
                    : 'text-white/25 hover:text-white/50'
                }`}
              >
                {h.text}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* TOC backdrop */}
      {showToc && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowToc(false)}
          aria-label="Close table of contents"
        />
      )}

      {/* Chapter navigation */}
      <nav className={`max-w-[680px] mx-auto px-6 py-8 border-t ${s.border} flex justify-between gap-4`}>
        {prev ? (
          <Link href={`/books/${bookId}/${prev.id}`} className={`text-sm ${s.linkColor} transition-colors`}>
            &larr; {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/books/${bookId}/${next.id}`} className={`text-sm ${s.navNext} transition-colors text-right`}>
            {next.title} &rarr;
          </Link>
        ) : (
          <span />
        )}
      </nav>

      {/* Notes section */}
      <div className="max-w-[680px] mx-auto px-6 pb-24">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className={`w-full py-3 text-sm ${s.noteBtn} rounded-xl transition-all`}
        >
          Leave a note about this chapter
        </button>
        {showNotes && (
          <div className="mt-3 space-y-3">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Your thoughts, suggestions, corrections..."
              className={`w-full h-24 ${s.noteArea} rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#00bcd4]/30`}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNotes(false)}
                className={`px-3 py-1.5 text-xs ${s.linkColor}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-3 py-1.5 text-xs bg-[#00bcd4]/10 text-[#00bcd4] rounded-lg hover:bg-[#00bcd4]/15 border border-[#00bcd4]/20"
              >
                Save Note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating reading toolbar */}
      <ReadingToolbar
        theme={theme}
        fontSize={fontSize}
        fontFamily={fontFamily}
        lineHeight={lineHeight}
        isBookmarked={isBookmarked}
        reactionCount={reactionCount}
        showToc={showToc}
        hasToc={tocHeadings.length > 0}
        toolbarVisible={toolbarVisible}
        bookId={bookId}
        prev={prev}
        next={next}
        onThemeCycle={handleThemeCycle}
        onFontSizeUp={handleFontSizeUp}
        onFontSizeDown={handleFontSizeDown}
        onFontFamilyToggle={handleFontFamilyToggle}
        onLineHeightCycle={handleLineHeightCycle}
        onBookmarkToggle={handleBookmarkToggle}
        onTocToggle={() => setShowToc((v) => !v)}
      />
    </div>
  );
}
