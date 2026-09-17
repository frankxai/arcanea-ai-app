/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Sparkle, CaretDown, CaretUp, Compass } from '@/lib/phosphor-icons';
import { NARRATIVE_STRUCTURES } from '@/lib/author/beat-templates';
import type { NarrativeStructure } from '@/lib/author/types';

interface BeatSheetViewProps {
  structureId?: NarrativeStructure['id'];
  completedBeatIds?: string[];
  onToggleBeat?: (beatId: string) => void;
}

export function BeatSheetView({
  structureId = 'save-the-cat',
  completedBeatIds = ['stc-1', 'stc-2'],
  onToggleBeat,
}: BeatSheetViewProps) {
  const [selectedStructure, setSelectedStructure] = useState<string>(structureId);
  const [activeBeatId, setActiveBeatId] = useState<string | null>(null);

  const structure = NARRATIVE_STRUCTURES[selectedStructure] || NARRATIVE_STRUCTURES['save-the-cat'];

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-4">
      {/* Header & Framework Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass size={16} className="text-[var(--arc-brand-atlantean-teal)]" />
          <h3 className="font-display text-xs font-semibold text-white/90">
            Beat Sheet Navigator
          </h3>
        </div>
        <select
          value={selectedStructure}
          onChange={(e) => setSelectedStructure(e.target.value)}
          className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] text-white/70 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/40"
        >
          <option value="save-the-cat">Save the Cat (15 Beats)</option>
          <option value="ten-gates">The Ten Gates (Arcanean)</option>
        </select>
      </div>

      <p className="text-[11px] text-white/40 leading-relaxed">
        {structure.description}
      </p>

      {/* Beat List */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {structure.beats.map((beat) => {
          const isDone = completedBeatIds.includes(beat.id);
          const isExpanded = activeBeatId === beat.id;

          return (
            <div
              key={beat.id}
              className={`rounded-lg border transition-all ${
                isDone
                  ? 'bg-emerald-500/[0.02] border-emerald-500/20'
                  : 'bg-white/[0.01] border-white/[0.04] hover:border-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between p-2.5">
                <button
                  type="button"
                  onClick={() => onToggleBeat?.(beat.id)}
                  className="flex items-center gap-2 text-left min-w-0 flex-1"
                >
                  {isDone ? (
                    <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle size={14} className="text-white/30 flex-shrink-0" />
                  )}
                  <div className="truncate">
                    <span className="text-xs font-medium text-white/80">{beat.beatName}</span>
                    <span className="text-[10px] text-white/30 ml-2 font-mono">
                      ~{beat.targetPercent}%
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveBeatId(isExpanded ? null : beat.id)}
                  className="p-1 text-white/30 hover:text-white/60 ml-2"
                >
                  {isExpanded ? <CaretUp size={12} /> : <CaretDown size={12} />}
                </button>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 pt-1 text-[11px] space-y-2 border-t border-white/[0.04] text-white/60">
                  <p>{beat.description}</p>
                  <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04] space-y-1">
                    <span className="text-[9px] uppercase font-semibold text-[var(--arc-brand-atlantean-teal)]">
                      Guiding Question:
                    </span>
                    <p className="text-[10px] text-white/70 italic">{beat.guidingQuestion}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
