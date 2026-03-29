'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAllLuminors, type LuminorConfig } from '@/lib/luminors/config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MentionItem {
  id: string;
  name: string;
  subtitle: string;
  avatar: string;
  type: 'luminor' | 'model';
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const MODEL_SHORTCUTS: MentionItem[] = [
  { id: 'arcanea-opus', name: 'Opus', subtitle: 'Frontier reasoning', avatar: '🔮', type: 'model' },
  { id: 'arcanea-sonnet', name: 'Sonnet', subtitle: 'Fast + capable', avatar: '✨', type: 'model' },
  { id: 'arcanea-gemini-pro', name: 'Gemini', subtitle: '1M context', avatar: '⚡', type: 'model' },
  { id: 'arcanea-grok', name: 'Grok', subtitle: 'Real-time knowledge', avatar: '🌐', type: 'model' },
  { id: 'arcanea-gpt5', name: 'GPT-5', subtitle: '#1 mathematics', avatar: '🧠', type: 'model' },
];

function buildLuminorItems(): MentionItem[] {
  return getAllLuminors().map((l: LuminorConfig) => ({
    id: l.id,
    name: l.name,
    subtitle: l.specialty,
    avatar: l.avatar,
    type: 'luminor' as const,
  }));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface MentionPopupProps {
  query: string;
  visible: boolean;
  onSelect: (item: MentionItem) => void;
  onDismiss: () => void;
}

export function MentionPopup({ query, visible, onSelect, onDismiss }: MentionPopupProps) {
  const [focusIndex, setFocusIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const luminorItems = useRef<MentionItem[]>(buildLuminorItems());

  // Detect mobile for positioning
  useEffect(() => {
    function check() { setIsMobileView(window.innerWidth < 768); }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Filter items based on query
  const normalizedQuery = query.toLowerCase();
  const filteredLuminors = luminorItems.current.filter(
    (item) =>
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.subtitle.toLowerCase().includes(normalizedQuery),
  );
  const filteredModels = MODEL_SHORTCUTS.filter(
    (item) =>
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.subtitle.toLowerCase().includes(normalizedQuery),
  );

  const allItems = [...filteredLuminors, ...filteredModels];

  // Reset focus when query changes
  useEffect(() => {
    setFocusIndex(0);
  }, [query]);

  // Scroll focused item into view
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-mention-item]');
    items[focusIndex]?.scrollIntoView({ block: 'nearest' });
  }, [focusIndex]);

  // Keyboard handler — attach to document so it works while textarea has focus
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!visible || allItems.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusIndex((i) => Math.min(i + 1, allItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
        case 'Tab':
          e.preventDefault();
          e.stopPropagation();
          if (allItems[focusIndex]) {
            onSelect(allItems[focusIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onDismiss();
          break;
      }
    },
    [visible, allItems, focusIndex, onSelect, onDismiss],
  );

  useEffect(() => {
    if (!visible) return;
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [visible, handleKeyDown]);

  if (!visible || allItems.length === 0) return null;

  const renderItem = (item: MentionItem, index: number) => {
    const isFocused = index === focusIndex;
    return (
      <button
        key={`${item.type}-${item.id}`}
        id={`mention-item-${item.type}-${item.id}`}
        type="button"
        role="option"
        aria-selected={isFocused}
        data-mention-item
        onMouseEnter={() => setFocusIndex(index)}
        onMouseDown={(e) => {
          e.preventDefault(); // Prevent textarea blur
          onSelect(item);
        }}
        className={`w-full text-left px-3 py-2.5 min-h-[44px] flex items-center gap-3 transition-all duration-150 ${
          isFocused
            ? 'bg-gradient-to-r from-[#00bcd4]/10 to-transparent text-white shadow-[inset_0_0_0_1px_rgba(0,188,212,0.1)]'
            : 'text-white/70 hover:bg-white/[0.03]'
        }`}
      >
        <span className="text-base w-6 text-center shrink-0">{item.avatar}</span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">{item.name}</div>
          <div className="text-[11px] text-white/30 truncate">{item.subtitle}</div>
        </div>
      </button>
    );
  };

  let globalIndex = 0;

  const focusedId = allItems[focusIndex] ? `mention-item-${allItems[focusIndex].type}-${allItems[focusIndex].id}` : undefined;

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label="Mention suggestions"
      aria-activedescendant={focusedId}
      className={`overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0d0d14]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 animate-scale-in ${
        isMobileView
          ? 'fixed bottom-[calc(env(safe-area-inset-bottom,0px)+70px)] left-2 right-2 max-h-[40vh]'
          : 'absolute bottom-full left-0 mb-2 w-72 max-h-[300px]'
      }`}
      style={{ scrollbarWidth: 'thin' }}
    >
      {/* Luminors section */}
      {filteredLuminors.length > 0 && (
        <>
          <div className="sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-sm px-3 py-1.5 border-b border-white/[0.06]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/25">
              Luminors
            </span>
          </div>
          {filteredLuminors.map((item) => {
            const idx = globalIndex;
            globalIndex++;
            return renderItem(item, idx);
          })}
        </>
      )}

      {/* Models section */}
      {filteredModels.length > 0 && (
        <>
          <div className="sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-sm px-3 py-1.5 border-b border-white/[0.06]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/25">
              Models
            </span>
          </div>
          {filteredModels.map((item) => {
            const idx = globalIndex;
            globalIndex++;
            return renderItem(item, idx);
          })}
        </>
      )}
    </div>
  );
}
