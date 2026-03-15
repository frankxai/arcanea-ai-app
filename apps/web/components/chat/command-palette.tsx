'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CHAT_MODELS, type ChatModel } from './model-selector';
import { FOCUS_MODES, type FocusMode } from './focus-modes';
import {
  PhMagnifyingGlass,
  PhArrowRight,
  PhBrain,
  PhCompass,
  PhRocket,
  PhPlus,
  PhLightning,
  PhCommand,
  PhHouse,
  PhBookOpen,
  PhPalette,
  PhGear,
  PhUsers,
} from '@/lib/phosphor-icons';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CommandItem {
  id: string;
  label: string;
  category: 'model' | 'focus' | 'action' | 'nav';
  shortcut?: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor?: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSelectModel: (modelId: string) => void;
  onSelectFocus: (modeId: string) => void;
  onNewChat: () => void;
  onBeamMode: () => void;
}

// ---------------------------------------------------------------------------
// Fuzzy match — simple substring on lowercased terms
// ---------------------------------------------------------------------------

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  // Match each query word independently
  return q.split(/\s+/).every((word) => t.includes(word));
}

// ---------------------------------------------------------------------------
// Category labels & order
// ---------------------------------------------------------------------------

const CATEGORY_META: Record<string, { label: string; order: number }> = {
  action: { label: 'Actions', order: 0 },
  model: { label: 'Models', order: 1 },
  focus: { label: 'Focus Modes', order: 2 },
  nav: { label: 'Navigation', order: 3 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CommandPalette({
  open,
  onClose,
  onSelectModel,
  onSelectFocus,
  onNewChat,
  onBeamMode,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [focusIndex, setFocusIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Build full item list
  const items = useMemo<CommandItem[]>(() => {
    const modelItems: CommandItem[] = CHAT_MODELS.map((m) => ({
      id: `model-${m.id}`,
      label: `${m.shortName}`,
      category: 'model' as const,
      icon: m.tier === 'frontier' ? PhBrain : m.tier === 'speed' ? PhLightning : PhRocket,
      iconColor: m.tier === 'frontier' ? '#00bcd4' : m.tier === 'speed' ? '#ffd700' : '#66bb6a',
      action: () => { onSelectModel(m.id); onClose(); },
    }));

    const focusItems: CommandItem[] = FOCUS_MODES.filter((f) => f.id !== 'auto').map((f) => ({
      id: `focus-${f.id}`,
      label: f.label,
      category: 'focus' as const,
      icon: PhCompass,
      iconColor: f.color,
      action: () => { onSelectFocus(f.id); onClose(); },
    }));

    const actionItems: CommandItem[] = [
      { id: 'action-new', label: 'New Chat', category: 'action', shortcut: 'Ctrl+Shift+N', icon: PhPlus, action: () => { onNewChat(); onClose(); } },
      { id: 'action-beam', label: 'Beam Mode — Compare Models', category: 'action', icon: PhLightning, action: () => { onBeamMode(); onClose(); } },
      { id: 'action-forge', label: 'Forge Luminor', category: 'action', icon: PhRocket, action: () => { router.push('/forge/luminor'); onClose(); } },
      { id: 'action-sanctum', label: 'Open Sanctum', category: 'action', icon: PhBrain, action: () => { router.push('/sanctum'); onClose(); } },
    ];

    const navItems: CommandItem[] = [
      { id: 'nav-home', label: 'Home', category: 'nav', icon: PhHouse, action: () => { router.push('/'); onClose(); } },
      { id: 'nav-library', label: 'Library', category: 'nav', icon: PhBookOpen, action: () => { router.push('/library'); onClose(); } },
      { id: 'nav-gallery', label: 'Gallery', category: 'nav', icon: PhPalette, action: () => { router.push('/gallery'); onClose(); } },
      { id: 'nav-community', label: 'Community', category: 'nav', icon: PhUsers, action: () => { router.push('/community'); onClose(); } },
      { id: 'nav-academy', label: 'Academy', category: 'nav', icon: PhBookOpen, action: () => { router.push('/academy'); onClose(); } },
      { id: 'nav-settings', label: 'Settings', category: 'nav', icon: PhGear, action: () => { router.push('/settings'); onClose(); } },
    ];

    return [...actionItems, ...modelItems, ...focusItems, ...navItems];
  }, [onSelectModel, onSelectFocus, onNewChat, onBeamMode, onClose, router]);

  // Filter by query
  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    return items.filter((item) =>
      fuzzyMatch(query, `${item.label} ${item.category}`)
    );
  }, [items, query]);

  // Group by category
  const grouped = useMemo(() => {
    const groups = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const list = groups.get(item.category) || [];
      list.push(item);
      groups.set(item.category, list);
    }
    return [...groups.entries()]
      .sort(([a], [b]) => (CATEGORY_META[a]?.order ?? 99) - (CATEGORY_META[b]?.order ?? 99));
  }, [filtered]);

  // Flat list for keyboard nav
  const flatFiltered = useMemo(() => grouped.flatMap(([, items]) => items), [grouped]);

  // Reset on open/query change
  useEffect(() => { setFocusIndex(0); }, [query]);
  useEffect(() => {
    if (open) {
      setQuery('');
      setFocusIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Scroll focused item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector('[data-focused="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [focusIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        flatFiltered[focusIndex]?.action();
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [flatFiltered, focusIndex, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl border border-white/[0.08] bg-[#111113]/95 backdrop-blur-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-label="Command palette"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
          <PhMagnifyingGlass className="w-4 h-4 text-white/30 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, models, modes..."
            className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/25 outline-none"
            aria-label="Search commands"
          />
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] text-white/20 border border-white/[0.06] font-mono">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-1" style={{ scrollbarWidth: 'thin' }}>
          {flatFiltered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-white/25">No results</p>
          ) : (
            grouped.map(([category, categoryItems]) => (
              <div key={category}>
                <div className="px-4 pt-3 pb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/20">
                    {CATEGORY_META[category]?.label ?? category}
                  </span>
                </div>
                {categoryItems.map((item) => {
                  const idx = flatFiltered.indexOf(item);
                  const isFocused = idx === focusIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-focused={isFocused}
                      onClick={item.action}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors outline-none ${
                        isFocused ? 'bg-white/[0.06] text-white' : 'text-white/60 hover:bg-white/[0.03] hover:text-white/80'
                      }`}
                    >
                      {Icon && <Icon className="w-4 h-4 shrink-0" style={{ color: item.iconColor }} />}
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.shortcut && (
                        <span className="text-[10px] text-white/15 font-mono shrink-0">{item.shortcut}</span>
                      )}
                      {isFocused && <PhArrowRight className="w-3 h-3 text-white/20 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/[0.04] text-[10px] text-white/15">
          <span>Arrow keys to navigate</span>
          <span>Enter to select</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
