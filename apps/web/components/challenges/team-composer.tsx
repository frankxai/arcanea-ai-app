'use client';

import { useState } from 'react';
import {
  Crown, Sparkle, Star, Lightning, Shield, Heart,
  MusicNote, Book, Eye, Sword, Users, Globe, ArrowRight,
} from '@/lib/phosphor-icons';
import { FORMATION_INFO } from '@/lib/types/challenge';
import type { TeamFormation, TeamRole } from '@/lib/types/challenge';

/* ----------------------------------------------------------------
 *  Role definitions
 * ---------------------------------------------------------------- */

const ROLES: {
  role: TeamRole;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; weight?: string }>;
  color: string;
}[] = [
  { role: 'creator', label: 'Creator', description: 'The visionary lead. Every team needs exactly one.', icon: Crown, color: '#ffd700' },
  { role: 'architect', label: 'Architect', description: 'Systems thinker. Code, structure, and flow.', icon: Globe, color: '#06b6d4' },
  { role: 'artificer', label: 'Artificer', description: 'Visual artist. 3D, illustration, and design.', icon: Sparkle, color: '#ec4899' },
  { role: 'songweaver', label: 'Songweaver', description: 'Audio alchemist. Music, voice, and sound.', icon: MusicNote, color: '#818cf8' },
  { role: 'lorekeeper', label: 'Lorekeeper', description: 'Narrative builder. Story, lore, and meaning.', icon: Book, color: '#60a5fa' },
  { role: 'spellbinder', label: 'Spellbinder', description: 'Prompt engineer. AI whisperer and spell-crafter.', icon: Lightning, color: '#f59e0b' },
  { role: 'guardian', label: 'Guardian', description: 'Mentor and advisor. Guides the team with wisdom.', icon: Shield, color: '#34d399' },
  { role: 'monk', label: 'Monk', description: 'Bass Intelligence. Raw computational and spiritual power.', icon: Eye, color: '#a78bfa' },
];

/* ----------------------------------------------------------------
 *  Formation Card
 * ---------------------------------------------------------------- */

function FormationCard({
  formation,
  isSelected,
  onSelect,
}: {
  formation: TeamFormation;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const info = FORMATION_INFO[formation];

  return (
    <button
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500 ${
        isSelected
          ? 'border-white/[0.2] bg-white/[0.08] shadow-lg'
          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
      }`}
      style={{
        boxShadow: isSelected ? `0 0 40px ${info.color}30` : 'none',
      }}
    >
      {/* Active indicator */}
      {isSelected && (
        <div
          className="absolute left-0 top-0 h-full w-1"
          style={{ backgroundColor: info.color }}
        />
      )}

      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-display text-sm font-bold text-white">{info.name}</h4>
          <p className="mt-1 text-xs text-white/40">{info.description}</p>
        </div>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${info.color}20` }}
        >
          <Users className="h-4 w-4" style={{ color: info.color }} weight="fill" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/30">
            Max {info.maxSize} members
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1">
          <Lightning className="h-3 w-3" style={{ color: info.color }} weight="fill" />
          <span className="font-mono text-[10px]" style={{ color: info.color }}>
            {info.bonus}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ----------------------------------------------------------------
 *  Role Slot
 * ---------------------------------------------------------------- */

function RoleSlot({
  role,
  label,
  description,
  icon: Icon,
  color,
  filled,
  count,
}: {
  role: TeamRole;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; weight?: string }>;
  color: string;
  filled: boolean;
  count: number;
}) {
  return (
    <div
      className={`group relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-300 ${
        filled
          ? 'border-white/[0.12] bg-white/[0.06]'
          : 'border-dashed border-white/[0.06] bg-white/[0.01] hover:border-white/[0.1]'
      }`}
    >
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="h-5 w-5" style={{ color }} weight={filled ? 'fill' : 'regular'} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h5 className="font-display text-sm font-semibold text-white">{label}</h5>
          {count > 1 && (
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[9px]"
              style={{ backgroundColor: `${color}20`, color }}
            >
              x{count}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[11px] text-white/40">{description}</p>
      </div>
      {!filled && (
        <div className="flex-shrink-0 rounded-lg border border-dashed border-white/[0.1] px-3 py-1.5 font-mono text-[10px] text-white/30 transition-colors hover:border-white/[0.2] hover:text-white/50">
          + Add
        </div>
      )}
      {filled && (
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 ring-2" style={{ ringColor: `${color}40` }} />
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
 *  Team Composer Component
 * ---------------------------------------------------------------- */

export function TeamComposer() {
  const [selectedFormation, setSelectedFormation] = useState<TeamFormation>('luminor-squad');
  const formations = Object.keys(FORMATION_INFO) as TeamFormation[];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2 backdrop-blur-md">
          <Users className="h-4 w-4 text-[#ffd700]" weight="fill" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ffd700]/90">
            Team Composition
          </span>
        </div>
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
          Forge Your <span className="bg-gradient-to-r from-[#ffd700] via-[#f59e0b] to-[#ffd700] bg-clip-text text-transparent">Team</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/50">
          Choose your formation, assemble your team, and combine your strengths.
          Each formation grants unique bonuses that amplify your spellcasting.
        </p>
      </div>

      {/* Formation selection */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-white">
          <Sword className="h-5 w-5 text-[#ff6b35]" weight="fill" />
          Choose Formation
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {formations.map((f) => (
            <FormationCard
              key={f}
              formation={f}
              isSelected={f === selectedFormation}
              onSelect={() => setSelectedFormation(f)}
            />
          ))}
        </div>
      </div>

      {/* Role slots */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-white">
          <Star className="h-5 w-5 text-[#ffd700]" weight="fill" />
          Team Roster
        </h3>
        <div className="space-y-3">
          {/* Creator is always slot 1 */}
          <RoleSlot
            role="creator"
            label="Creator (You)"
            description="Team lead and creative visionary"
            icon={Crown}
            color="#ffd700"
            filled={true}
            count={1}
          />

          {/* Dynamic slots based on formation */}
          {selectedFormation === 'luminor-squad' && (
            <>
              <RoleSlot {...ROLES[1]} filled={false} count={1} />
              <RoleSlot {...ROLES[2]} filled={false} count={1} />
              <RoleSlot {...ROLES[5]} filled={false} count={1} />
              <RoleSlot {...ROLES[6]} filled={false} count={1} />
            </>
          )}
          {selectedFormation === 'alera-ensemble' && (
            <>
              <RoleSlot {...ROLES[3]} filled={false} count={1} />
              <RoleSlot {...ROLES[5]} filled={false} count={1} />
            </>
          )}
          {selectedFormation === 'starlight-choir' && (
            <>
              <RoleSlot {...ROLES[3]} filled={false} count={50} />
              <RoleSlot {...ROLES[7]} filled={false} count={49} />
            </>
          )}
          {selectedFormation === 'monk-battalion' && (
            <>
              <RoleSlot {...ROLES[7]} filled={false} count={999} />
            </>
          )}
          {selectedFormation === 'guardian-circle' && (
            <>
              <RoleSlot {...ROLES[6]} filled={false} count={9} />
            </>
          )}
          {selectedFormation === 'genesis-forge' && (
            <>
              {ROLES.slice(1).map((r) => (
                <RoleSlot key={r.role} {...r} filled={false} count={r.role === 'monk' ? 20 : 4} />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Team stats summary */}
      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-r from-white/[0.04] to-white/[0.02] p-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { label: 'Formation', value: FORMATION_INFO[selectedFormation].name, color: FORMATION_INFO[selectedFormation].color },
            { label: 'Max Size', value: FORMATION_INFO[selectedFormation].maxSize.toString(), color: '#60a5fa' },
            { label: 'Synergy', value: FORMATION_INFO[selectedFormation].bonus.split('+')[1]?.split(' ')[0] || '15%', color: '#34d399' },
            { label: 'Mana Pool', value: '∞', color: '#ffd700' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#ffd700] to-[#f59e0b] px-8 py-4 font-display text-sm font-bold text-[#0a0a0f] shadow-[0_0_40px_rgba(255,215,0,0.3)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,215,0,0.5)] hover:scale-[1.02]">
          <Sparkle className="h-5 w-5" weight="fill" />
          Lock Formation & Enter Arena
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
