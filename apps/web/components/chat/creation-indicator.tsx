/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Creation Indicator — Subtle UI for arc auto-save
 *
 * Shows a small palette-colored dot when a creation is detected.
 * Clicking reveals what was saved. Minimal — does NOT disrupt chat flow.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { AutoSaveState } from '@/lib/arc/auto-save';

// ── Palette colors ───────────────────────────────────────────────────────────

const PALETTE_COLORS: Record<string, string> = {
  forge: 'var(--arc-fire)',
  tide: 'var(--arc-brand-atlantean-teal)',
  root: 'var(--arc-earth)',
  drift: 'var(--arc-text-primary)',
  void: 'var(--arc-void)',
};

const TYPE_ICONS: Record<string, string> = {
  character: '\u2726',   // sparkle
  world: '\u2609',       // sun
  location: '\u2302',    // house
  creature: '\u2620',    // skull (beast)
  image: '\u25A3',       // square with fill
  music: '\u266B',       // beamed notes
  scene: '\u2756',       // diamond
  story: '\u2710',       // pen
  code: '\u2318',        // command symbol
  system: '\u2699',      // gear
};

// ── Props ────────────────────────────────────────────────────────────────────

interface CreationIndicatorProps {
  autoSave: AutoSaveState;
}

// ── Component ────────────────────────────────────────────────────────────────

export function CreationIndicator({ autoSave }: CreationIndicatorProps) {
  const { savedArcs, lastSaved, lastDetection, notification } = autoSave;
  const [panelOpen, setPanelOpen] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    if (!panelOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [panelOpen]);

  // Animate notification in
  useEffect(() => {
    if (notification) {
      setNotifVisible(false);
      requestAnimationFrame(() => setNotifVisible(true));
    }
  }, [notification]);

  // Nothing to show
  if (savedArcs.length === 0 && !notification) return null;

  const dotColor = lastSaved?.apl?.palette
    ? PALETTE_COLORS[lastSaved.apl.palette] || 'var(--arc-brand-atlantean-teal)'
    : 'var(--arc-brand-atlantean-teal)';

  return (
    <div ref={panelRef} className="relative">
      {/* Notification toast — appears briefly after each save */}
      {notification && (
        <div
          className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap bg-[var(--arc-cosmic-void)] border border-white/[0.08] text-white/70 shadow-lg"
          style={{
            opacity: notifVisible ? 1 : 0,
            transform: notifVisible ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
            style={{ backgroundColor: dotColor }}
          />
          {notification}
        </div>
      )}

      {/* Dot indicator — click to expand */}
      <button
        type="button"
        onClick={() => setPanelOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
        title={`${savedArcs.length} creation${savedArcs.length !== 1 ? 's' : ''} saved`}
      >
        <span
          className="w-2 h-2 rounded-full transition-colors"
          style={{
            backgroundColor: dotColor,
            boxShadow: `0 0 6px ${dotColor}40`,
          }}
        />
        <span>{savedArcs.length}</span>
      </button>

      {/* Expanded panel */}
      {panelOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-72 rounded-xl overflow-hidden bg-[var(--arc-cosmic-void)] border border-white/[0.08] shadow-xl">
          <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-xs font-medium text-white/60">
              Saved Creations
            </span>
            <Link
              href="/arcs"
              className="text-[10px] text-[var(--arc-brand-atlantean-teal)] hover:text-[var(--arc-brand-atlantean-teal)]/80 transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="max-h-60 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {savedArcs.map((arc) => {
              const palette = arc.apl?.palette || 'void';
              const color = PALETTE_COLORS[palette] || 'var(--arc-void)';
              const icon = TYPE_ICONS[arc.type] || '\u2726';

              return (
                <div
                  key={arc.id}
                  className="px-3 py-2.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="text-sm mt-0.5 shrink-0"
                      style={{ color }}
                    >
                      {icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-white/80 truncate">
                        {arc.apl?.spark || `Untitled ${arc.type}`}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-md border"
                          style={{
                            color,
                            borderColor: `${color}30`,
                            backgroundColor: `${color}08`,
                          }}
                        >
                          {arc.type}
                        </span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-md border"
                          style={{
                            color,
                            borderColor: `${color}20`,
                          }}
                        >
                          {palette}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {savedArcs.length === 0 && (
            <div className="px-3 py-4 text-center text-xs text-white/25">
              No creations detected yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
