'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllLuminors, TEAMS, type LuminorConfig, type Team } from '@/lib/luminors/config';
import {
  PhMagnifyingGlass,
  PhPlus,
  PhCaretLeft,
  PhCaretRight,
  PhCaretDown,
  PhCaretUp,
  PhChatCircleDots,
  PhSparkle,
} from '@/lib/phosphor-icons';
import { ConversationList } from '@/components/chat/conversation-list';

const TEAM_ORDER: Team[] = ['development', 'creative', 'writing', 'research'];
const MAX_VISIBLE_LUMINORS = 5;

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
  const [assistantsOpen, setAssistantsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

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

  // Flat list of filtered luminors (for collapsed max-items view)
  const flatFiltered = useMemo(() => {
    const result: LuminorConfig[] = [];
    for (const team of TEAM_ORDER) {
      const items = grouped.get(team);
      if (items) result.push(...items);
    }
    return result;
  }, [grouped]);

  const visibleLuminors = showAll ? flatFiltered : flatFiltered.slice(0, MAX_VISIBLE_LUMINORS);
  const hasMore = flatFiltered.length > MAX_VISIBLE_LUMINORS;

  // Collapsed state — icon strip (VS Code style)
  if (collapsed) {
    return (
      <div
        className="flex w-10 flex-shrink-0 flex-col items-center pt-3 gap-3
          border-r border-white/[0.06] bg-[#09090b]
          max-md:hidden"
      >
        <button
          onClick={onToggle}
          className="w-7 h-7 flex items-center justify-center rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
          aria-label="Open sidebar"
        >
          <PhCaretRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onToggle}
          className="w-7 h-7 flex items-center justify-center rounded-md text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
          aria-label="Conversations"
          title="Conversations"
        >
          <PhChatCircleDots className="w-4 h-4" />
        </button>
        <button
          onClick={() => { onToggle(); setTimeout(() => setAssistantsOpen(true), 100); }}
          className="w-7 h-7 flex items-center justify-center rounded-md text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
          aria-label="Assistants"
          title="Assistants"
        >
          <PhSparkle className="w-4 h-4" />
        </button>
      </div>
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
        <Link
          href="/chat"
          className="text-xs font-medium text-white/50 uppercase tracking-wider hover:text-white/80 transition-colors"
        >
          Chat
        </Link>
        <button
          onClick={onToggle}
          className="w-6 h-6 flex items-center justify-center rounded text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
          aria-label="Collapse sidebar"
        >
          <PhCaretLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recent Conversations — PRIMARY content, at the top */}
      {onNewChat && <ConversationList onNewChat={onNewChat} />}

      {/* Assistants accordion section */}
      <div className="flex flex-col border-t border-white/[0.06]">
        <button
          onClick={() => setAssistantsOpen((v) => !v)}
          className="flex items-center justify-between px-3 py-2.5 w-full text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <PhSparkle className="w-3 h-3 text-white/30" />
            <span className="text-[10px] font-medium text-white/35 uppercase tracking-wider">
              Assistants
            </span>
            <span className="text-[10px] text-white/20">
              {allLuminors.length}
            </span>
          </div>
          {assistantsOpen ? (
            <PhCaretUp className="w-3 h-3 text-white/25" />
          ) : (
            <PhCaretDown className="w-3 h-3 text-white/25" />
          )}
        </button>

        {assistantsOpen && (
          <div className="flex flex-col">
            {/* Search */}
            <div className="px-3 py-2">
              <div className="relative">
                <PhMagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => { setFilter(e.target.value); setShowAll(true); }}
                  placeholder="Filter assistants..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]
                    text-xs text-white/80 placeholder-white/25 focus:outline-none focus:border-[#00bcd4]/30 transition-colors"
                />
              </div>
            </div>

            {/* Luminor list */}
            <div className="overflow-y-auto px-2 pb-2" style={{ scrollbarWidth: 'thin', maxHeight: showAll ? '40vh' : undefined }}>
              {visibleLuminors.map((luminor) => {
                const isActive = activeLuminorId === luminor.id;
                const teamMeta = TEAMS[luminor.team];
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
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 transition-transform duration-150
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
                        {teamMeta && (
                          <span className="text-[8px] px-1 py-0.5 rounded" style={{ color: teamMeta.color, opacity: 0.5 }}>
                            {teamMeta.icon}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/30 truncate leading-tight mt-0.5">
                        {luminor.specialty}
                      </p>
                    </div>
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <p className="text-xs text-white/25 text-center py-4">No assistants match your search</p>
              )}

              {/* "See all" / "Show less" toggle */}
              {hasMore && !filter.trim() && (
                <button
                  onClick={() => setShowAll((v) => !v)}
                  className="w-full text-center text-[10px] text-white/30 hover:text-white/50 py-2 transition-colors"
                >
                  {showAll ? 'Show less' : `See all ${flatFiltered.length} assistants`}
                </button>
              )}
            </div>

            {/* Forge button — inside the accordion */}
            <div className="px-3 py-2">
              <Link
                href="/forge/luminor"
                className="flex items-center justify-center gap-2 w-full px-3 py-1.5 rounded-lg text-[10px] font-medium
                  border border-white/[0.08] text-white/40
                  hover:border-[#00bcd4]/30 hover:text-[#00bcd4] hover:bg-[#00bcd4]/5 transition-all duration-150"
              >
                <PhPlus className="w-3 h-3" />
                Create New Assistant
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}
