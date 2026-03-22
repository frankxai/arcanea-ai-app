'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAllLuminors, TEAMS, type LuminorConfig, type Team } from '@/lib/luminors/config';
import {
  PhMagnifyingGlass,
  PhPlus,
  PhCaretLeft,
  PhCaretRight,
} from '@/lib/phosphor-icons';
import { ConversationList } from '@/components/chat/conversation-list';

const TEAM_ORDER: Team[] = ['development', 'creative', 'writing', 'research'];

interface LuminorSidebarProps {
  activeLuminorId: string | null;
  onSelectLuminor: (luminor: LuminorConfig) => void;
  collapsed: boolean;
  onToggle: () => void;
  onNewChat?: () => void;
}

export function LuminorSidebar({
  activeLuminorId,
  onSelectLuminor,
  collapsed,
  onToggle,
  onNewChat,
}: LuminorSidebarProps) {
  const [filter, setFilter] = useState('');

  const allLuminors = useMemo(() => getAllLuminors(), []);

  const filtered = useMemo(() => {
    if (!filter.trim()) return allLuminors;
    const q = filter.toLowerCase();
    return allLuminors.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.specialty.toLowerCase().includes(q) ||
        l.team.toLowerCase().includes(q)
    );
  }, [allLuminors, filter]);

  const grouped = useMemo(() => {
    const map = new Map<Team, LuminorConfig[]>();
    for (const team of TEAM_ORDER) {
      const items = filtered.filter((l) => l.team === team);
      if (items.length > 0) map.set(team, items);
    }
    return map;
  }, [filtered]);

  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        className="flex w-10 flex-shrink-0 flex-col items-center pt-4
          border-r border-white/[0.06] bg-[#09090b] hover:bg-white/[0.02] transition-colors
          max-md:hidden"
        aria-label="Open Luminor sidebar"
      >
        <PhCaretRight className="w-4 h-4 text-white/30" />
      </button>
    );
  }

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div
        className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onToggle}
        aria-hidden="true"
      />
    <aside className="md:relative md:z-auto fixed inset-y-0 left-0 z-50 w-[280px] flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-[#09090b]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-white/[0.06]">
        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
          Chat
        </span>
        <button
          onClick={onToggle}
          className="w-6 h-6 flex items-center justify-center rounded text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
          aria-label="Collapse sidebar"
        >
          <PhCaretLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recent Conversations */}
      {onNewChat && <ConversationList onNewChat={onNewChat} />}

      {/* Luminors section header */}
      <div className="px-3 pt-2 pb-0">
        <span className="text-[10px] font-medium text-white/35 uppercase tracking-wider">
          Luminors
        </span>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <PhMagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter luminors..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]
              text-xs text-white/80 placeholder-white/25 focus:outline-none focus:border-[#00bcd4]/30 transition-colors"
          />
        </div>
      </div>

      {/* Luminor list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2" style={{ scrollbarWidth: 'thin' }}>
        {TEAM_ORDER.map((team) => {
          const items = grouped.get(team);
          if (!items) return null;
          const meta = TEAMS[team];

          return (
            <div key={team} className="mt-2">
              <div className="flex items-center gap-1.5 px-2 py-1.5">
                <span className="text-[10px]">{meta.icon}</span>
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: meta.color }}>
                  {meta.name}
                </span>
              </div>

              {items.map((luminor) => {
                const isActive = activeLuminorId === luminor.id;
                return (
                  <button
                    key={luminor.id}
                    onClick={() => onSelectLuminor(luminor)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 group
                      ${isActive
                        ? 'bg-[#00bcd4]/10 border border-[#00bcd4]/20'
                        : 'border border-transparent hover:bg-white/[0.03] hover:border-white/[0.06]'
                      }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 transition-transform duration-150
                        ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}
                      style={{
                        background: `linear-gradient(135deg, ${luminor.color}, ${luminor.color}80)`,
                      }}
                    >
                      {luminor.avatar}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-medium truncate ${isActive ? 'text-[#00bcd4]' : 'text-white/80'}`}>
                          {luminor.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/30 truncate leading-tight mt-0.5">
                        {luminor.specialty}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-xs text-white/25 text-center py-6">No luminors match your search</p>
        )}
      </div>

      {/* Forge button */}
      <div className="px-3 py-3 border-t border-white/[0.06]">
        <Link
          href="/forge/luminor"
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium
            border border-white/[0.08] text-white/50
            hover:border-[#00bcd4]/30 hover:text-[#00bcd4] hover:bg-[#00bcd4]/5 transition-all duration-150"
        >
          <PhPlus className="w-3.5 h-3.5" />
          Forge New Luminor
        </Link>
      </div>
    </aside>
    </>
  );
}
