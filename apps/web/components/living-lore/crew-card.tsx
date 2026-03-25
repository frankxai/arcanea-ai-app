'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CrewMember } from '@/lib/living-lore/types';

interface CrewCardProps {
  member: CrewMember;
  /** Show the full backstory hook instead of just the tagline */
  expanded?: boolean;
}

export function CrewCard({ member, expanded = false }: CrewCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/living-lore/crew/${member.id}`}
      className="group block liquid-glass rounded-2xl p-6 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered ? `0 0 24px ${member.color}18` : 'none',
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${member.gradient} text-xl animate-float-slow`}
        >
          {member.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-cinzel text-lg font-semibold text-text-primary group-hover:text-atlantean-teal-aqua transition-colors">
            {member.name}
          </h3>
          <p className="text-xs text-text-muted">{member.title}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
        <span
          className="inline-block h-2 w-2 rounded-full animate-pulse-glow"
          style={{ backgroundColor: member.color }}
        />
        <span>{member.element}</span>
        <span className="text-white/20">|</span>
        <span>{member.species.split(',')[0]}</span>
      </div>

      <p className="mt-3 text-sm text-text-muted leading-relaxed line-clamp-3">
        {expanded ? member.backstoryHook : member.tagline}
      </p>
    </Link>
  );
}
