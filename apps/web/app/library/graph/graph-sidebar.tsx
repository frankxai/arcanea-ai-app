'use client';

import Link from 'next/link';
import { PhArrowRight } from '@/lib/phosphor-icons';
import type { ContentNode, ContentEdge } from '../../../lib/content/types';
import { COLLECTION_COLORS, hexToRgba } from './graph-config';

export function SidebarContent({
  node,
  collection,
  connections,
  onSelectNode,
}: {
  node: ContentNode | null;
  collection: { icon?: string; name?: string } | null;
  connections: { outgoing: (ContentEdge & { node?: ContentNode })[]; incoming: (ContentEdge & { node?: ContentNode })[] };
  onSelectNode: (id: string) => void;
}) {
  if (!node) {
    return (
      <div className="liquid-glass rounded-3xl border border-white/[0.06] p-8 text-center">
        <p className="text-text-muted text-sm">
          Click a node to explore its connections
        </p>
      </div>
    );
  }

  const color = COLLECTION_COLORS[node.collection] || '#666';

  return (
    <div className="liquid-glass rounded-3xl border border-white/[0.06] overflow-hidden">
      <div className="h-1" style={{ backgroundColor: color }} />

      <div className="p-6 space-y-5">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color }}>
            Selected Text
          </p>
          <h3 className="font-display text-xl font-bold">{node.title}</h3>
          <p className="text-sm text-text-muted mt-1 capitalize">
            {collection?.icon} {collection?.name}
          </p>
        </div>

        <div>
          <span
            className="text-[10px] font-mono px-2 py-1 rounded-lg border capitalize"
            style={{
              color,
              backgroundColor: hexToRgba(color, 0.1),
              borderColor: hexToRgba(color, 0.2),
            }}
          >
            {node.format}
          </span>
        </div>

        {node.situations.length > 0 && (
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-bright/80 mb-2">
              Read when
            </p>
            <div className="flex flex-wrap gap-1.5">
              {node.situations.map((sit) => (
                <span
                  key={sit}
                  className="px-2 py-0.5 rounded-lg text-[10px] bg-gold-bright/10 text-gold-bright/80 border border-gold-bright/20 capitalize"
                >
                  {sit}
                </span>
              ))}
            </div>
          </div>
        )}

        <ConnectionList connections={connections} onSelect={onSelectNode} />

        <Link
          href={`/library/${node.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-atlantean-teal-aqua text-cosmic-deep font-semibold hover:bg-atlantean-teal-aqua/90 transition-colors"
        >
          Read This Text
          <PhArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export function ConnectionList({
  connections,
  onSelect,
}: {
  connections: { outgoing: (ContentEdge & { node?: ContentNode })[]; incoming: (ContentEdge & { node?: ContentNode })[] };
  onSelect: (id: string) => void;
}) {
  const directOut = connections.outgoing.filter(
    (c) => c.type === 'related' || c.type === 'prerequisite' || c.type === 'next',
  );
  const directIn = connections.incoming.filter(
    (c) => c.type === 'related' || c.type === 'prerequisite' || c.type === 'next',
  );
  const shared = [
    ...connections.outgoing.filter((c) => c.type === 'shared-tag' || c.type === 'shared-situation'),
    ...connections.incoming.filter((c) => c.type === 'shared-tag' || c.type === 'shared-situation'),
  ];

  const seenIds = new Set<string>();
  const uniqueShared = shared.filter((c) => {
    const id = c.node?.id;
    if (!id || seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });

  return (
    <>
      {directOut.length > 0 && (
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-atlantean-teal-aqua/80 mb-2">
            Leads to ({directOut.length})
          </p>
          <ul className="space-y-1">
            {directOut.slice(0, 6).map((c) => (
              <li key={`${c.source}-${c.target}`}>
                <button
                  onClick={() => c.node?.id && onSelect(c.node.id)}
                  className="text-sm text-text-secondary hover:text-atlantean-teal-aqua transition-colors text-left w-full truncate"
                >
                  {c.node?.title}
                  <span className="ml-1.5 text-[10px] text-text-muted">({c.type})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {directIn.length > 0 && (
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400/80 mb-2">
            Comes from ({directIn.length})
          </p>
          <ul className="space-y-1">
            {directIn.slice(0, 6).map((c) => (
              <li key={`${c.source}-${c.target}`}>
                <button
                  onClick={() => c.node?.id && onSelect(c.node.id)}
                  className="text-sm text-text-secondary hover:text-atlantean-teal-aqua transition-colors text-left w-full truncate"
                >
                  {c.node?.title}
                  <span className="ml-1.5 text-[10px] text-text-muted">({c.type})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {uniqueShared.length > 0 && (
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-purple-400/80 mb-2">
            Shared themes ({uniqueShared.length})
          </p>
          <ul className="space-y-1">
            {uniqueShared.slice(0, 5).map((c) => (
              <li key={c.node?.id}>
                <button
                  onClick={() => c.node?.id && onSelect(c.node.id)}
                  className="text-sm text-text-secondary hover:text-atlantean-teal-aqua transition-colors text-left w-full truncate"
                >
                  {c.node?.title}
                </button>
              </li>
            ))}
            {uniqueShared.length > 5 && (
              <li className="text-[10px] text-text-muted">
                +{uniqueShared.length - 5} more
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
