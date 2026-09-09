/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import type {
  ReadingTheme,
  FontSize,
  LineHeight,
  FontFamily,
} from "./reader-preferences";

export interface ToolbarProps {
  theme: ReadingTheme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  lineHeight: LineHeight;
  isBookmarked: boolean;
  reactionCount: number;
  showToc: boolean;
  hasToc: boolean;
  toolbarVisible: boolean;
  bookId: string;
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
  onThemeCycle: () => void;
  onFontSizeUp: () => void;
  onFontSizeDown: () => void;
  onFontFamilyToggle: () => void;
  onLineHeightCycle: () => void;
  onBookmarkToggle: () => void;
  onTocToggle: () => void;
}

export function ReadingToolbar({
  theme,
  fontSize,
  fontFamily,
  lineHeight,
  isBookmarked,
  reactionCount,
  showToc,
  hasToc,
  toolbarVisible,
  bookId,
  prev,
  next,
  onThemeCycle,
  onFontSizeUp,
  onFontSizeDown,
  onFontFamilyToggle,
  onLineHeightCycle,
  onBookmarkToggle,
  onTocToggle,
}: ToolbarProps) {
  const isLight = theme === "light" || theme === "sepia";

  const btnBase = `flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-all duration-150 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none sm:h-9 sm:w-9 ${
    isLight
      ? "text-gray-600 hover:bg-black/10 hover:text-gray-900"
      : "text-white/50 hover:bg-white/10 hover:text-white/90"
  }`;

  const divider = isLight
    ? "w-px h-5 bg-black/15 mx-0.5"
    : "w-px h-5 bg-white/10 mx-0.5";

  return (
    <div
      className={`fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100vw-2rem)] max-w-[calc(100vw-1rem)] -translate-x-1/2 transition-all duration-300 focus-within:opacity-100 focus-within:translate-y-0 motion-reduce:transition-none sm:bottom-6 sm:w-auto ${
        toolbarVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div
        role="toolbar"
        aria-label="Reading controls"
        className={`flex max-w-full flex-wrap items-center justify-center gap-x-1 gap-y-1 rounded-2xl border px-2 py-2 shadow-elevation-3 backdrop-blur-xl sm:flex-nowrap sm:px-3 ${
          isLight
            ? "bg-white/80 border-black/10"
            : "bg-black/60 border-white/10"
        }`}
      >
        <div
          role="group"
          aria-label="Text preferences"
          className="flex items-center gap-0.5"
        >
          {/* Theme toggle */}
          <button
            type="button"
            onClick={onThemeCycle}
            className={btnBase}
            title={`Theme: ${theme}`}
            aria-label="Cycle reading theme"
          >
            {theme === "dark" && (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            )}
            {theme === "light" && (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
            )}
            {theme === "sepia" && (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
            )}
            {theme === "cosmic" && (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
            )}
          </button>

          <div className={divider} />

          {/* Font size controls */}
          <button
            type="button"
            onClick={onFontSizeDown}
            disabled={fontSize === 14}
            className={`${btnBase} disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold`}
            aria-label="Decrease font size"
          >
            A<sup>-</sup>
          </button>
          <output
            aria-label="Font size"
            aria-live="polite"
            className={`text-xs w-6 text-center tabular-nums ${isLight ? "text-gray-600" : "text-white/70"}`}
          >
            {fontSize}
          </output>
          <button
            type="button"
            onClick={onFontSizeUp}
            disabled={fontSize === 30}
            className={`${btnBase} disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold`}
            aria-label="Increase font size"
          >
            A<sup>+</sup>
          </button>

          <div className="flex items-center">
            <div className={divider} />

            {/* Font family toggle */}
            <button
              type="button"
              onClick={onFontFamilyToggle}
              className={`${btnBase} text-xs font-medium`}
              aria-label={`Font: ${fontFamily}`}
              title={
                fontFamily === "serif"
                  ? "Switch to sans-serif"
                  : "Switch to serif"
              }
            >
              Aa
              <span className="sr-only">{fontFamily}</span>
            </button>

            {/* Line height cycle */}
            <button
              type="button"
              onClick={onLineHeightCycle}
              className={`${btnBase} flex-col gap-[2px]`}
              aria-label={`Line spacing: ${lineHeight}`}
              title={`Line spacing: ${lineHeight}`}
            >
              {lineHeight === "compact" && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" d="M3 7h18M3 12h18M3 17h18" />
                </svg>
              )}
              {lineHeight === "normal" && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    d="M3 6h18M3 11h18M3 16h18M3 21h18"
                    strokeOpacity={0}
                  />
                  <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              )}
              {lineHeight === "relaxed" && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" d="M3 5h18M3 12h18M3 19h18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className={`hidden sm:block ${divider}`} aria-hidden="true" />
        <div
          role="group"
          aria-label="Chapter navigation"
          className="flex items-center gap-0.5"
        >
          {/* Bookmark / reaction */}
          <button
            type="button"
            onClick={onBookmarkToggle}
            className={`${btnBase} ${isBookmarked ? "text-[var(--arc-brand-atlantean-teal)]" : ""} relative`}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark chapter"}
            title="Bookmark"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-150 ${isBookmarked ? "scale-110" : ""}`}
              fill={isBookmarked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
            {reactionCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[9px] bg-[var(--arc-brand-atlantean-teal)] text-black rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {reactionCount > 99 ? "99" : reactionCount}
              </span>
            )}
          </button>

          <div className={divider} />

          {/* Prev chapter */}
          <a
            href={prev ? `/books/${bookId}/${prev.id}` : undefined}
            aria-disabled={!prev}
            aria-label={
              prev ? `Previous: ${prev.title}` : "No previous chapter"
            }
            className={`${btnBase} ${!prev ? "opacity-25 pointer-events-none" : ""}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </a>

          {/* Next chapter */}
          <a
            href={next ? `/books/${bookId}/${next.id}` : undefined}
            aria-disabled={!next}
            aria-label={next ? `Next: ${next.title}` : "No next chapter"}
            className={`${btnBase} ${!next ? "opacity-25 pointer-events-none" : ""}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </a>

          {/* TOC toggle */}
          {hasToc && (
            <>
              <div className={divider} />
              <button
                type="button"
                onClick={onTocToggle}
                className={`${btnBase} ${showToc ? (isLight ? "bg-black/10 text-gray-900" : "bg-white/15 text-white") : ""}`}
                aria-label="Toggle table of contents"
                title="Table of contents"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
