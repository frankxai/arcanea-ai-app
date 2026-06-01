'use client';

import { NODES, type EcosystemNode } from '@/lib/ecosystem/derived';
import type { FilterState } from '../filter-bar';
import { useState } from 'react';

interface Props {
  filter: FilterState;
  onSelectNode: (node: EcosystemNode) => void;
}

const GATES: Array<EcosystemNode['gate']> = [
  'source',
  'form',
  'pattern',
  'voice',
  'vision',
  'story',
  'world',
  'soul',
  'unity',
  'mastery',
];

const GATE_DESCRIPTIONS: Record<EcosystemNode['gate'], string> = {
  source: 'Origin — substrates, intelligence, where it begins',
  form: 'Design — shape, tokens, the visual language',
  pattern: 'Architecture — orchestration, structure, data',
  voice: 'Communication — chat, voice, multilingual',
  vision: 'Imagery — generation, sight, visual creation',
  story: 'Narrative — books, lore, the writing',
  world: 'Worlds — realms, factions, settings',
  soul: 'Critique — Council, sensitivity, deep listening',
  unity: 'Coordination — orchestrators, cross-cutting',
  mastery: 'Publishing — deployment, release, mastery',
};

export function GatesView({ filter, onSelectNode }: Props) {
  const [selectedGate, setSelectedGate] = useState<EcosystemNode['gate'] | null>(null);
  const activeGate: EcosystemNode['gate'] | null =
    filter.gate !== 'all' ? (filter.gate as EcosystemNode['gate']) : selectedGate;

  const filtered = NODES.filter((n) => {
    if (filter.status !== 'all' && n.status !== filter.status) return false;
    if (filter.hemisphere !== 'all' && n.hemisphere !== filter.hemisphere) return false;
    if (filter.gate !== 'all' && n.gate !== filter.gate) return false;
    return true;
  });

  const byGate = new Map<EcosystemNode['gate'], EcosystemNode[]>();
  for (const gate of GATES) byGate.set(gate, []);
  for (const node of filtered) byGate.get(node.gate)?.push(node);

  const angleStep = 360 / GATES.length;
  const radius = 220;
  const center = 280;

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <div className="relative w-full" style={{ aspectRatio: '1 / 1', maxWidth: 560 }}>
        <svg viewBox="0 0 560 560" className="w-full h-full">
          <circle
            cx={center}
            cy={center}
            r={radius + 40}
            fill="none"
            stroke="currentColor"
            className="text-white/[0.04]"
          />
          {GATES.map((gate, i) => {
            const angleDeg = i * angleStep - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = center + radius * Math.cos(angleRad);
            const y = center + radius * Math.sin(angleRad);
            const count = byGate.get(gate)?.length ?? 0;
            const isSelected = activeGate === gate;
            return (
              <g
                key={gate}
                onClick={() => setSelectedGate(gate)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedGate(gate);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Gate ${gate}, ${count} nodes`}
                className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 32 : 24}
                  className={
                    isSelected
                      ? 'fill-teal-500/30 stroke-teal-400'
                      : 'fill-white/[0.04] stroke-white/[0.12] hover:fill-white/[0.08]'
                  }
                  strokeWidth={1.5}
                />
                <text
                  x={x}
                  y={y - 2}
                  textAnchor="middle"
                  className="fill-white text-[11px] uppercase tracking-wide pointer-events-none"
                >
                  {gate}
                </text>
                <text
                  x={x}
                  y={y + 12}
                  textAnchor="middle"
                  className="fill-zinc-400 text-[10px] pointer-events-none"
                >
                  {count}
                </text>
              </g>
            );
          })}
          <text
            x={center}
            y={center}
            textAnchor="middle"
            className="fill-white text-base font-semibold pointer-events-none"
          >
            Arcanea
          </text>
          <text
            x={center}
            y={center + 18}
            textAnchor="middle"
            className="fill-zinc-400 text-xs pointer-events-none"
          >
            Ten Gates
          </text>
        </svg>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm">
        {activeGate ? (
          <>
            <header className="mb-4">
              <h3 className="text-xl font-semibold text-white capitalize">{activeGate}</h3>
              <p className="text-sm text-zinc-400">{GATE_DESCRIPTIONS[activeGate]}</p>
            </header>
            <div className="space-y-2">
              {(byGate.get(activeGate) ?? []).map((node) => (
                <button
                  key={node.id}
                  onClick={() => onSelectNode(node)}
                  className="w-full text-left p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{node.name}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">{node.status}</span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{node.description}</p>
                </button>
              ))}
              {(byGate.get(activeGate) ?? []).length === 0 && (
                <p className="text-sm text-zinc-500 italic">
                  No nodes in this gate match current filters.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-zinc-400 py-12">
            <p className="text-sm">Click a gate to see what lives there.</p>
          </div>
        )}
      </div>
    </div>
  );
}
