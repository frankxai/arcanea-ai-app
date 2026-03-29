'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ThinkingSectionProps {
  /** The reasoning/thinking content text */
  content: string;
  /** Whether the thinking content is still being streamed */
  isStreaming: boolean;
  /** Duration of thinking in seconds (shown after completion) */
  duration: number;
  /** Whether to default to expanded state */
  defaultExpanded?: boolean;
}

// ---------------------------------------------------------------------------
// ThinkingSection — collapsible reasoning display for AI messages
// ---------------------------------------------------------------------------

export const ThinkingSection = React.memo(function ThinkingSection({
  content,
  isStreaming,
  duration,
  defaultExpanded,
}: ThinkingSectionProps) {
  // Expand by default while streaming, collapse when done (unless overridden)
  const [isExpanded, setIsExpanded] = useState(defaultExpanded ?? isStreaming);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const hasAutoCollapsed = useRef(false);

  // Auto-collapse when streaming finishes (only once)
  useEffect(() => {
    if (!isStreaming && !hasAutoCollapsed.current && defaultExpanded === undefined) {
      hasAutoCollapsed.current = true;
      setIsExpanded(false);
    }
  }, [isStreaming, defaultExpanded]);

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [content, isExpanded]);

  // Observe resize changes in content during streaming
  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver(() => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Format duration nicely
  const durationLabel = duration < 1
    ? '<1s'
    : duration < 60
      ? `${Math.round(duration)}s`
      : `${Math.floor(duration / 60)}m ${Math.round(duration % 60)}s`;

  return (
    <div className="mb-3 rounded-lg overflow-hidden border border-white/[0.06] bg-[#0d0d14]/60 backdrop-blur-sm">
      {/* Left accent border via a pseudo-like wrapper */}
      <div className="flex">
        {/* Gradient left border */}
        <div
          className="w-[2px] shrink-0"
          style={{
            background: 'linear-gradient(180deg, #00bcd4, #78a6ff)',
          }}
        />

        <div className="flex-1 min-w-0">
          {/* Header — clickable disclosure toggle */}
          <button
            type="button"
            onClick={toggle}
            className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-white/[0.02] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00bcd4]/40 focus-visible:ring-inset"
            aria-expanded={isExpanded}
            aria-controls="thinking-content"
          >
            {/* Disclosure triangle */}
            <svg
              className="w-3 h-3 text-white/30 shrink-0 transition-transform duration-200"
              style={{
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
              viewBox="0 0 12 12"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M4 2l5 4-5 4V2z" />
            </svg>

            {/* Label */}
            {isStreaming ? (
              <span className="text-xs font-medium thinking-gradient-text select-none">
                Thinking...
              </span>
            ) : (
              <span className="text-xs text-white/40 select-none">
                Thought for {durationLabel}
              </span>
            )}

            {/* Streaming dot indicator */}
            {isStreaming && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] shrink-0"
                style={{
                  animation: 'thinkingPulse 1.5s ease-in-out infinite',
                }}
                aria-hidden="true"
              />
            )}
          </button>

          {/* Collapsible content area */}
          <div
            className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
            style={{
              maxHeight: isExpanded ? `${contentHeight + 24}px` : '0px',
            }}
          >
            <div
              ref={contentRef}
              id="thinking-content"
              className="px-3 pb-3 pt-1"
            >
              <div className="text-[13px] leading-relaxed text-white/50 font-mono whitespace-pre-wrap break-words">
                {content}
                {isStreaming && (
                  <span
                    className="inline-block w-[2px] h-[1em] bg-[#00bcd4]/60 ml-0.5 align-text-bottom"
                    style={{ animation: 'cursorBlink 1s steps(2) infinite' }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ThinkingSection.displayName = 'ThinkingSection';
export default ThinkingSection;
