'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface TocEntry {
  id: string;
  label: string;
}

interface EpisodeTocProps {
  content: string;
  crewColors?: Record<string, string>;
}

function parseHeadings(content: string): TocEntry[] {
  const lines = content.split('\n');
  const entries: TocEntry[] = [];

  for (const line of lines) {
    const match = line.match(/^## (.+)$/);
    if (match) {
      const label = match[1].trim();
      const id = label.toLowerCase().replace(/\s+/g, '-');
      entries.push({ id, label });
    }
  }

  return entries;
}

export function EpisodeToc({ content, crewColors = {} }: EpisodeTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const entries = parseHeadings(content);

  const handleIntersect = useCallback((observations: IntersectionObserverEntry[]) => {
    // Find the first heading that is intersecting (visible)
    for (const entry of observations) {
      if (entry.isIntersecting) {
        setActiveId(entry.target.id);
        break;
      }
    }
  }, []);

  useEffect(() => {
    if (entries.length === 0) return;

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    });

    for (const entry of entries) {
      const el = document.getElementById(entry.id);
      if (el) observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [entries, handleIntersect]);

  if (entries.length === 0) return null;

  const tocList = (
    <ul className="space-y-1.5">
      {entries.map((entry) => {
        const isActive = activeId === entry.id;
        const color = crewColors[entry.label.toLowerCase()];

        return (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className={`block rounded-lg px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? 'text-atlantean-teal-aqua font-semibold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
              style={isActive && color ? { color } : undefined}
            >
              {entry.label}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="hidden lg:block sticky top-20 self-start"
        aria-label="Table of contents"
      >
        <div className="glass-subtle rounded-xl p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-dim">
            In this episode
          </p>
          {tocList}
        </div>
      </nav>

      {/* Mobile collapsible */}
      <details className="lg:hidden mb-6 glass-subtle rounded-xl">
        <summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-text-muted">
          Table of Contents
        </summary>
        <div className="px-4 pb-4">{tocList}</div>
      </details>
    </>
  );
}
