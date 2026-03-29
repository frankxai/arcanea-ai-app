'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  MagnifyingGlass,
  CaretUp,
  CaretDown,
  X,
} from '@/lib/phosphor-icons';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SearchOverlayProps {
  /** Whether the overlay is visible */
  open: boolean;
  /** Total number of matches across all messages */
  totalMatches: number;
  /** Current active match index (0-based) */
  currentMatchIndex: number;
  /** Called when user types (debounced internally) */
  onQueryChange: (query: string) => void;
  /** Navigate to next match */
  onNext: () => void;
  /** Navigate to previous match */
  onPrev: () => void;
  /** Close the search overlay */
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// SearchOverlay — floating search bar at top of chat area
// ---------------------------------------------------------------------------

export function SearchOverlay({
  open,
  totalMatches,
  currentMatchIndex,
  onQueryChange,
  onNext,
  onPrev,
  onClose,
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localQuery, setLocalQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (open) {
      // Small delay to allow the animation to start
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    } else {
      // Reset local query when closed
      setLocalQuery('');
    }
  }, [open]);

  // Debounced query propagation (300ms)
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalQuery(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onQueryChange(value);
      }, 300);
    },
    [onQueryChange],
  );

  // Clean up debounce timer
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Keyboard handling within the search input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          onPrev();
        } else {
          onNext();
        }
      }
    },
    [onClose, onNext, onPrev],
  );

  if (!open) return null;

  const hasQuery = localQuery.trim().length > 0;
  const matchLabel =
    totalMatches > 0
      ? `${currentMatchIndex + 1} of ${totalMatches}`
      : hasQuery
        ? 'No matches'
        : '';

  return (
    <div
      className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-[480px] animate-search-slide-in"
      role="search"
      aria-label="Search conversation"
    >
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#12121a]/95 border border-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_1px_rgba(255,255,255,0.05)]">
        {/* Search icon */}
        <MagnifyingGlass className="w-4 h-4 text-[#00bcd4]/60 shrink-0" />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search messages..."
          aria-label="Search messages"
          className="flex-1 bg-transparent text-sm text-white/90 placeholder:text-white/25 outline-none min-w-0"
        />

        {/* Match count */}
        {hasQuery && (
          <span className="text-[11px] text-white/30 tabular-nums whitespace-nowrap shrink-0">
            {matchLabel}
          </span>
        )}

        {/* Navigation buttons */}
        {totalMatches > 0 && (
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={onPrev}
              className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
              aria-label="Previous match"
              title="Previous (Shift+Enter)"
            >
              <CaretUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
              aria-label="Next match"
              title="Next (Enter)"
            >
              <CaretDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
          aria-label="Close search (Escape)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
