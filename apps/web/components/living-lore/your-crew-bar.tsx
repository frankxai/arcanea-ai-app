'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LazyMotion, domMax, m } from 'framer-motion';
import { transitions, springs } from '@/lib/design/motion';
import type { CrewBond } from '@/lib/living-lore/types';
import { getAllCrew } from '@/lib/living-lore/crew-data';

interface YourCrewBarProps {
  selectedCompanion?: string;
  bonds: CrewBond[];
  compact?: boolean;
}

export function YourCrewBar({ selectedCompanion, bonds, compact }: YourCrewBarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const allCrew = getAllCrew();

  const getBondLevel = (crewId: string): number => {
    const bond = bonds.find((b) => b.crewMemberId === crewId);
    return bond?.bondLevel ?? 0;
  };

  // Bond ring thickness: 1px at 0, up to 3px at 100
  const getRingWidth = (level: number): number => {
    return 1 + (level / 100) * 2;
  };

  return (
    <LazyMotion features={domMax}>
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.enter}
        className="glass-subtle rounded-xl border border-white/[0.06] px-4 py-3"
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest text-text-dim font-semibold">
            Your Crew
          </p>
          <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3'}`}>
            {allCrew.map((member) => {
              const bondLevel = getBondLevel(member.id);
              const ringWidth = getRingWidth(bondLevel);
              const isCompanion = member.id === selectedCompanion;
              const isHovered = hoveredId === member.id;
              const size = compact ? 'h-8 w-8' : 'h-10 w-10';
              const fontSize = compact ? 'text-sm' : 'text-base';

              return (
                <div key={member.id} className="relative">
                  <Link
                    href={`/living-lore/crew/${member.id.replace('crew-', '')}`}
                    onMouseEnter={() => setHoveredId(member.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <m.span
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      transition={springs.snappy}
                      className={`relative flex ${size} items-center justify-center rounded-full ${fontSize}`}
                      style={{
                        backgroundColor: `${member.color}15`,
                        boxShadow: `0 0 0 ${ringWidth}px ${member.color}${bondLevel > 0 ? '60' : '20'}`,
                      }}
                    >
                      {member.avatar}
                      {/* Companion star */}
                      {isCompanion && (
                        <span
                          className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] bg-gold-bright/90 text-[#09090b]"
                          title="Your companion"
                        >
                          *
                        </span>
                      )}
                    </m.span>
                  </Link>

                  {/* Tooltip */}
                  {isHovered && (
                    <m.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={transitions.snappy}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg glass-subtle border border-white/[0.08] whitespace-nowrap z-10"
                    >
                      <p className="text-xs font-semibold text-text-primary">
                        {member.name}
                      </p>
                      <p className="text-[10px] text-text-dim">
                        Bond: {bondLevel}/100
                      </p>
                    </m.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </m.div>
    </LazyMotion>
  );
}
