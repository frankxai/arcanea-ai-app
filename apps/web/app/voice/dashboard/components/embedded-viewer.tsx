/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { emit } from '../lib/intent-bus';

interface EmbedTab {
  id: string;
  label: string;
  url: string;
  icon: string;
}

const QUICK_TABS: EmbedTab[] = [
  { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/embed?listType=search&list=', icon: '▶' },
  { id: 'arcanea', label: 'Arcanea', url: 'https://www.arcanea.ai', icon: '◊' },
  { id: 'github', label: 'GitHub', url: 'https://github.com/frankxai/arcanea-ai-app', icon: '⌥' },
];

export function EmbeddedViewer({
  url,
  onUrlChange,
}: {
  url: string | null;
  onUrlChange: (url: string | null) => void;
}) {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (url) setInput(url);
  }, [url]);

  const submit = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      onUrlChange(null);
      return;
    }
    let nextUrl = trimmed;
    // YouTube search shorthand: "yt: query" or just "yt query"
    if (/^yt[:\s]/i.test(trimmed)) {
      const q = trimmed.replace(/^yt[:\s]+/i, '').trim();
      nextUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(q)}`;
    } else if (!/^https?:\/\//i.test(trimmed)) {
      // Bare query — google search.
      nextUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(trimmed)}`;
    }
    onUrlChange(nextUrl);
    emit({ kind: 'embed', url: nextUrl, surface: detectSurface(nextUrl), trigger: 'click', summary: `Embed → ${shortHost(nextUrl)}` });
  };

  return (
    <div className="rounded-2xl bg-black/30 border border-white/[0.06] backdrop-blur-md overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 flex-shrink-0">View</p>
        <div className="flex gap-1 flex-shrink-0">
          {QUICK_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'youtube') {
                  // Open input prompt-style: focus the search.
                  setInput('yt: ');
                } else {
                  submit(tab.url);
                }
              }}
              className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded transition-colors ${
                activeTab === tab.id
                  ? 'bg-[var(--arc-brand-atlantean-teal)]/20 text-[var(--arc-brand-atlantean-teal)]'
                  : 'bg-white/[0.03] text-white/45 hover:bg-white/[0.06]'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        <form
          className="flex-1 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='URL or "yt: my search"'
            className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-1 text-xs text-white/80 placeholder:text-white/25 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/40"
          />
          {url ? (
            <button
              type="button"
              onClick={() => {
                onUrlChange(null);
                setInput('');
                setActiveTab(null);
              }}
              className="text-[10px] uppercase tracking-widest text-white/35 hover:text-white/60"
            >
              clear
            </button>
          ) : null}
        </form>
      </div>

      <div className="relative h-[300px] bg-black/40">
        <AnimatePresence mode="wait">
          {url ? (
            <motion.iframe
              key={url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={url}
              title="Embedded viewer"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center text-center px-8"
            >
              <div>
                <p className="text-xs text-white/40 mb-1">
                  Drop a URL above, or type{' '}
                  <code className="text-[var(--arc-brand-atlantean-teal)]/70 bg-white/[0.04] px-1.5 py-0.5 rounded">yt: arcanea</code>{' '}
                  for a YouTube search.
                </p>
                <p className="text-[10px] text-white/25">
                  Some sites refuse to embed (X-Frame-Options) — those open in a new tab from workflows.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function detectSurface(url: string): 'youtube' | 'web' | 'docs' {
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/docs\.|\.io\/docs|developer\./.test(url)) return 'docs';
  return 'web';
}

function shortHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url.slice(0, 32);
  }
}
