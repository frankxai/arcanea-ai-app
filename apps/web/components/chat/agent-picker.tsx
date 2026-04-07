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
  development: { label: 'Development', color: '#60a5fa' },
  creative: { label: 'Creative', color: '#fbbf24' },
  writing: { label: 'Writing', color: '#34d399' },
  research: { label: 'Research', color: '#a78bfa' },
};

const TEAM_ORDER: Team[] = ['development', 'creative', 'writing', 'research'];

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
      development: [], creative: [], writing: [], research: [],
    };
    for (const l of filtered) {
      groups[l.team].push(l);
    }
    return groups;
  }, [filtered]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-16 bottom-16 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-20 sm:w-[480px] sm:max-h-[70vh] rounded-2xl bg-[#0e0e16] border border-white/[0.08] shadow-2xl z-50 flex flex-col overflow-hidden">
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
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-[#00bcd4]/30 transition-colors"
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
                ? 'border-[#00bcd4]/30 bg-[#00bcd4]/5'
                : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00bcd4]/20 to-[#00897b]/10 flex items-center justify-center border border-[#00bcd4]/20">
              <PhSparkle className="w-4 h-4 text-[#00bcd4]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Arcanea Auto</p>
              <p className="text-[10px] text-white/30">Smart routing — all 16 specialists available</p>
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
                          ? 'border-[#00bcd4]/30 bg-[#00bcd4]/5'
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
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-dashed border-white/[0.08] hover:border-[#ffd700]/30 hover:bg-[#ffd700]/5 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl border border-dashed border-white/[0.08] group-hover:border-[#ffd700]/30 flex items-center justify-center transition-colors">
              <PhPlus className="w-4 h-4 text-white/20 group-hover:text-[#ffd700] transition-colors" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/50 group-hover:text-[#ffd700] transition-colors">Create Custom Agent</p>
              <p className="text-[9px] text-white/20">Build your own AI specialist</p>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
