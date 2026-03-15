'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PhCompass } from '@/lib/phosphor-icons';

// ---------------------------------------------------------------------------
// Focus modes map to Arcanea's MoE Guardian domains
// The user sees "Creative" — the system activates the Leyla+Aiyami+Alera blend
// Progressive disclosure: newcomer sees domain names, power users learn Gates
// ---------------------------------------------------------------------------

export interface FocusMode {
  id: string;
  label: string;
  description: string;
  /** System prompt prefix that guides the MoE router */
  promptHint: string;
  color: string;
}

export const FOCUS_MODES: FocusMode[] = [
  {
    id: 'auto',
    label: 'Auto',
    description: 'Arcanea detects your intent automatically',
    promptHint: '',
    color: '#00bcd4',
  },
  {
    id: 'creative',
    label: 'Creative',
    description: 'Stories, worlds, characters, narratives',
    promptHint: 'Focus on creative writing, world-building, storytelling, and narrative design.',
    color: '#ab47bc',
  },
  {
    id: 'code',
    label: 'Code',
    description: 'Build, debug, architect, deploy',
    promptHint: 'Focus on software engineering, code architecture, debugging, and technical implementation.',
    color: '#6b8e23',
  },
  {
    id: 'design',
    label: 'Design',
    description: 'Visual, UI/UX, art direction',
    promptHint: 'Focus on visual design, UI/UX, art direction, color theory, and layout composition.',
    color: '#7e57c2',
  },
  {
    id: 'music',
    label: 'Music',
    description: 'Compose, produce, arrange',
    promptHint: 'Focus on music composition, production, arrangement, lyrics, and sonic texture.',
    color: '#4fc3f7',
  },
  {
    id: 'research',
    label: 'Research',
    description: 'Analyze, synthesize, discover',
    promptHint: 'Focus on deep research, cross-domain synthesis, finding connections, and rigorous analysis.',
    color: '#26c6da',
  },
  {
    id: 'strategy',
    label: 'Strategy',
    description: 'Plan, decide, see the whole board',
    promptHint: 'Focus on strategic thinking, decision-making, trade-off analysis, and long-term planning.',
    color: '#ffd700',
  },
  {
    id: 'heart',
    label: 'Heart',
    description: 'Feel, heal, connect, reflect',
    promptHint: 'Focus on emotional intelligence, personal reflection, relationships, and compassionate guidance.',
    color: '#e91e63',
  },
];

export function getFocusModeById(id: string): FocusMode {
  return FOCUS_MODES.find((m) => m.id === id) || FOCUS_MODES[0];
}

// ---------------------------------------------------------------------------
// Component — horizontal pill selector (like Perplexity focus modes)
// ---------------------------------------------------------------------------

interface FocusModeSelectorProps {
  value: string;
  onChange: (modeId: string) => void;
}

export const FocusModeSelector = React.memo(function FocusModeSelector({ value, onChange }: FocusModeSelectorProps) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setExpanded(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [expanded]);

  const selected = getFocusModeById(value);

  // Show compact mode (just the active mode + expand button) when not expanded
  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex items-center gap-1.5 px-2.5 py-2 sm:py-1 rounded-lg text-[11px] font-medium transition-all min-h-[44px] sm:min-h-0
          border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]
          focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/50"
        title="Change focus mode"
        aria-label={`Focus: ${selected.label}. Click to change.`}
      >
        <PhCompass className="w-3 h-3" style={{ color: selected.color }} />
        <span style={{ color: selected.color }}>{selected.label}</span>
      </button>
    );
  }

  return (
    <div ref={ref} className="flex items-center gap-1 overflow-x-auto sm:flex-wrap sm:overflow-visible -mx-1 px-1 scrollbar-none">
      {FOCUS_MODES.map((mode) => {
        const isActive = mode.id === value;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => { onChange(mode.id); setExpanded(false); }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border whitespace-nowrap shrink-0 sm:shrink
              focus:outline-none focus:ring-1 focus:ring-[#00bcd4]/40 ${
              isActive
                ? 'border-white/[0.15] bg-white/[0.06]'
                : 'border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.02]'
            }`}
            style={{ color: isActive ? mode.color : 'rgba(255,255,255,0.4)' }}
            title={mode.description}
            aria-pressed={isActive}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
});
