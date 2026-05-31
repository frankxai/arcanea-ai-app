'use client';

import { useState } from 'react';
import { ViewSwitcher, type EcosystemView } from './view-switcher';
import { FilterBar, type FilterState } from './filter-bar';
import { LayeredView } from './views/layered-view';
import { GatesView } from './views/gates-view';
import { ArcNeaView } from './views/arc-nea-view';
import { NodeDrawer } from './node-drawer';
import { NODES, type EcosystemNode } from '@/lib/ecosystem/derived';

const DEFAULT_FILTER: FilterState = { status: 'all', hemisphere: 'all', gate: 'all' };

export function EcosystemViews() {
  const [view, setView] = useState<EcosystemView>('layered');
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected: EcosystemNode | null = selectedId
    ? (NODES.find((n) => n.id === selectedId) ?? null)
    : null;

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <ViewSwitcher value={view} onChange={setView} />
        <FilterBar value={filter} onChange={setFilter} />
      </div>

      {view === 'layered' && (
        <LayeredView filter={filter} onSelectNode={(n) => setSelectedId(n.id)} />
      )}
      {view === 'gates' && (
        <GatesView filter={filter} onSelectNode={(n) => setSelectedId(n.id)} />
      )}
      {view === 'arc-nea' && (
        <ArcNeaView filter={filter} onSelectNode={(n) => setSelectedId(n.id)} />
      )}

      <NodeDrawer
        node={selected}
        onClose={() => setSelectedId(null)}
        onFocus={(id) => setSelectedId(id)}
      />
    </>
  );
}
