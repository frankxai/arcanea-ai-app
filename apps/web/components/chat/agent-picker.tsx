/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import React, { useState, useMemo } from 'react';
import { PhX, PhMagnifyingGlass, PhPlus, PhSparkle } from '@/lib/phosphor-icons';
import { LUMINORS, type LuminorConfig, type Team } from '@/lib/luminors/config';

interface AgentPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (agent: { type: 'auto' | 'luminor'; id: string }) => void;
  currentAgentId?: string;
}

const TEAM_LABELS: Record<Team, { label: string; color: string }> = {
  orchestrator: { label: 'Orchestrator', color: 'var(--arc-brand-atlantean-teal)' },
  development: { label: 'Development', color: 'var(--arc-brand-cosmic-blue)' },
  creative: { label: 'Creative', color: 'var(--arc-brand-arcanean-gold)' },
  writing: { label: 'Writing', color: 'var(--arc-wind)' },
  research: { label: 'Research', color: 'var(--arc-void)' },
};

const TEAM_ORDER: Team[] = ['orchestrator', 'development', 'creative', 'writing', 'research'];

export function AgentPicker({ open, onClose, onSelect, currentAgentId }: AgentPickerProps) {
  const [search, setSearch] = useState('');

  const luminorList = useMemo(() => Object.values(LUMINORS), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return luminorList;
    const q = search.toLowerCase();
    return luminorList.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        (l.loreName ?? '').toLowerCase().includes(q) ||
        l.specialty.toLowerCase().includes(q) ||
        l.team.includes(q)
    );
  }, [search, luminorList]);

  const grouped = useMemo(() => {
    const groups: Record<Team, LuminorConfig[]> = {
      orchestrator: [], development: [], creative: [], writing: [], research: [],
    };
    for (const l of filtered) {
      if (groups[l.team]) {
        groups[l.team].push(l);
      }
    }
    return groups;
  }, [filtered]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-16 bottom-16 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-20 sm:w-[480px] sm:max-h-[70vh] rounded-2xl bg-[var(--arc-cosmic-void)] border border-white/[0.08] shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold text-white/80">Choose an Agent</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors">
            <PhX className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <PhMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/30 transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Agent list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
          {/* Auto mode */}
          <button
            onClick={() => { onSelect({ type: 'auto', id: 'arcanea-auto' }); onClose(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${
              !currentAgentId || currentAgentId === 'arcanea-auto'
                ? 'border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/5'
                : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/20 to-[var(--arc-brand-cosmic-blue)]/10 flex items-center justify-center border border-[var(--arc-brand-atlantean-teal)]/20">
              <PhSparkle className="w-4 h-4 text-[var(--arc-brand-atlantean-teal)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Arcanea Auto</p>
              <p className="text-[10px] text-white/30">Smart routing — all 13 specialists available</p>
            </div>
          </button>

          {/* Teams */}
          {TEAM_ORDER.map((team) => {
            const agents = grouped[team];
            if (agents.length === 0) return null;
            const { label, color } = TEAM_LABELS[team];

            return (
              <div key={team}>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-2 px-1" style={{ color }}>
                  {label}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {agents.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => { onSelect({ type: 'luminor', id: l.id }); onClose(); }}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                        currentAgentId === l.id
                          ? 'border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/5'
                          : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]'
                      }`}
                    >
                      <span className="text-lg">{l.avatar}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white/80 truncate">{l.name}</p>
                        <p className="text-[9px] text-white/25 truncate">{l.specialty}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Create new */}
          <a
            href="/forge/luminor"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-dashed border-white/[0.08] hover:border-[var(--arc-brand-arcanean-gold)]/30 hover:bg-[var(--arc-brand-arcanean-gold)]/5 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl border border-dashed border-white/[0.08] group-hover:border-[var(--arc-brand-arcanean-gold)]/30 flex items-center justify-center transition-colors">
              <PhPlus className="w-4 h-4 text-white/20 group-hover:text-[var(--arc-brand-arcanean-gold)] transition-colors" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/50 group-hover:text-[var(--arc-brand-arcanean-gold)] transition-colors">Create Custom Agent</p>
              <p className="text-[9px] text-white/20">Build your own AI specialist</p>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
