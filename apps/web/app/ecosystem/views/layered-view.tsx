'use client';

import { NODES, type EcosystemNode } from '@/lib/ecosystem/derived';
import type { FilterState } from '../filter-bar';

interface Props {
  filter: FilterState;
  onSelectNode: (node: EcosystemNode) => void;
}

const LAYER_TITLES: Record<EcosystemNode['layer'], { title: string; subtitle: string }> = {
  surface: { title: 'Surfaces', subtitle: 'What users touch' },
  product: { title: 'Products', subtitle: 'What we ship' },
  substrate: { title: 'Substrate', subtitle: 'What we stand on' },
};

export function LayeredView({ filter, onSelectNode }: Props) {
  const filtered = NODES.filter((n) => {
    if (filter.status !== 'all' && n.status !== filter.status) return false;
    if (filter.hemisphere !== 'all' && n.hemisphere !== filter.hemisphere) return false;
    if (filter.gate !== 'all' && n.gate !== filter.gate) return false;
    return true;
  });

  const byLayer = {
    surface: filtered.filter((n) => n.layer === 'surface'),
    product: filtered.filter((n) => n.layer === 'product'),
    substrate: filtered.filter((n) => n.layer === 'substrate'),
  };

  return (
    <div className="space-y-12">
      {(['surface', 'product', 'substrate'] as const).map((layer) => (
        <section key={layer}>
          <header className="mb-4">
            <h2 className="text-2xl font-semibold text-white">{LAYER_TITLES[layer].title}</h2>
            <p className="text-sm text-zinc-400">{LAYER_TITLES[layer].subtitle}</p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {byLayer[layer].map((node) => (
              <NodeCard key={node.id} node={node} onClick={() => onSelectNode(node)} />
            ))}
            {byLayer[layer].length === 0 && (
              <p className="text-sm text-zinc-500 italic col-span-full">
                No nodes in this layer match current filters.
              </p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

const STATUS_DOT: Record<EcosystemNode['status'], string> = {
  shipped: 'bg-teal-400',
  built: 'bg-blue-400',
  wip: 'bg-amber-400',
  orphan: 'bg-orange-400',
  sunset: 'bg-red-400',
  external: 'bg-zinc-500',
};

function NodeCard({ node, onClick }: { node: EcosystemNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] backdrop-blur-sm rounded-xl transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-medium text-white">{node.name}</h3>
        <span
          className={`w-2 h-2 rounded-full ${STATUS_DOT[node.status]} mt-1.5`}
          title={node.status}
        />
      </div>
      <p className="text-xs text-zinc-400 line-clamp-2">{node.description}</p>
      <div className="mt-3 flex flex-wrap gap-1 text-[10px] text-zinc-500">
        <span>{node.gate}</span>
        <span>·</span>
        <span>{node.hemisphere}</span>
      </div>
    </button>
  );
}
