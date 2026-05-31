'use client';

import { NODES, type EcosystemNode } from '@/lib/ecosystem/derived';
import type { FilterState } from '../filter-bar';

interface Props {
  filter: FilterState;
  onSelectNode: (node: EcosystemNode) => void;
}

const TONE: Record<string, string> = {
  pink: 'border-pink-500/30 bg-pink-500/5',
  gold: 'border-amber-500/30 bg-amber-500/5',
  teal: 'border-teal-500/30 bg-teal-500/5',
};

export function ArcNeaView({ filter, onSelectNode }: Props) {
  const filtered = NODES.filter((n) => {
    if (filter.status !== 'all' && n.status !== filter.status) return false;
    if (filter.hemisphere !== 'all' && n.hemisphere !== filter.hemisphere) return false;
    if (filter.gate !== 'all' && n.gate !== filter.gate) return false;
    return true;
  });

  const arc = filtered.filter((n) => n.hemisphere === 'arc');
  const nea = filtered.filter((n) => n.hemisphere === 'nea');
  const seam = filtered.filter((n) => n.hemisphere === 'seam');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6">
      <Hemisphere
        title="Arc"
        subtitle="Creation lifecycle"
        tone="pink"
        nodes={arc}
        onSelectNode={onSelectNode}
      />

      <div className="hidden lg:flex flex-col items-center justify-start pt-12 px-2">
        <div className="text-zinc-500 text-xs uppercase tracking-widest rotate-90 whitespace-nowrap">
          Seam
        </div>
        <ul className="mt-4 space-y-1">
          {seam.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => onSelectNode(n)}
                className="px-2 py-1 text-[11px] bg-teal-500/10 text-teal-200 border border-teal-500/20 rounded-full hover:bg-teal-500/20 whitespace-nowrap"
              >
                {n.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Hemisphere
        title="Nea"
        subtitle="Economic lifecycle"
        tone="gold"
        nodes={nea}
        onSelectNode={onSelectNode}
      />

      <div className="lg:hidden">
        <Hemisphere
          title="Seam"
          subtitle="Bridges Arc and Nea"
          tone="teal"
          nodes={seam}
          onSelectNode={onSelectNode}
        />
      </div>
    </div>
  );
}

function Hemisphere({
  title,
  subtitle,
  tone,
  nodes,
  onSelectNode,
}: {
  title: string;
  subtitle: string;
  tone: keyof typeof TONE;
  nodes: EcosystemNode[];
  onSelectNode: (node: EcosystemNode) => void;
}) {
  return (
    <section className={`p-6 rounded-2xl border ${TONE[tone] ?? TONE.teal} backdrop-blur-sm`}>
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-xs text-zinc-400">{subtitle}</p>
      </header>
      <div className="space-y-2">
        {nodes.map((n) => (
          <button
            key={n.id}
            onClick={() => onSelectNode(n)}
            className="w-full text-left p-3 bg-black/20 hover:bg-black/40 border border-white/[0.06] rounded-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">{n.name}</span>
              <span className="text-[10px] text-zinc-500 uppercase">{n.gate}</span>
            </div>
            <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{n.description}</p>
          </button>
        ))}
        {nodes.length === 0 && (
          <p className="text-xs text-zinc-500 italic">No nodes match current filters.</p>
        )}
      </div>
    </section>
  );
}
