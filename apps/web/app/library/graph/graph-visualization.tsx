'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import {
  PhMagnifyingGlassPlus,
  PhMagnifyingGlassMinus,
  PhArrowsOut,
  PhX,
} from '@/lib/phosphor-icons';
import type {
  ContentGraph,
  Collection,
} from '../../../lib/content/types';
import { COLLECTION_COLORS } from './graph-config';
import { SidebarContent, ConnectionList } from './graph-sidebar';
import { useGraphSimulation } from './use-graph-simulation';

interface Props {
  graph: ContentGraph;
  collections: Collection[];
}

export function ContentGraphVisualization({ graph, collections }: Props) {
  const {
    selectedId,
    setSelectedId,
    filterCollection,
    setFilterCollection,
    isMobile,
    canvasRef,
    containerRef,
    selectConnection,
    handlers,
    controls,
  } = useGraphSimulation(graph);

  const selectedConnections = useMemo(() => {
    if (!selectedId) return { outgoing: [], incoming: [] };
    const outgoing = graph.edges
      .filter((e) => e.source === selectedId)
      .map((e) => ({ ...e, node: graph.nodes.find((n) => n.id === e.target) }));
    const incoming = graph.edges
      .filter((e) => e.target === selectedId)
      .map((e) => ({ ...e, node: graph.nodes.find((n) => n.id === e.source) }));
    return { outgoing, incoming };
  }, [selectedId, graph]);

  const selectedNodeData = useMemo(
    () => graph.nodes.find((n) => n.id === selectedId),
    [selectedId, graph.nodes],
  );
  const selCollection = selectedNodeData
    ? collections.find((c) => c.slug === selectedNodeData.collection)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setFilterCollection(null)}
          className={`flex-shrink-0 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-300 ${
            filterCollection === null
              ? 'bg-atlantean-teal-aqua text-cosmic-deep'
              : 'liquid-glass border border-white/[0.06] text-text-muted hover:text-white hover:border-white/[0.12]'
          }`}
        >
          All ({graph.nodes.length})
        </button>
        {collections.map((c) => {
          const isActive = filterCollection === c.slug;
          const count = graph.nodes.filter((n) => n.collection === c.slug).length;
          if (count === 0) return null;
          return (
            <button
              key={c.slug}
              onClick={() => setFilterCollection(isActive ? null : c.slug)}
              className={`flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300 ${
                isActive
                  ? 'text-cosmic-deep'
                  : 'liquid-glass border border-white/[0.06] text-text-muted hover:text-white hover:border-white/[0.12]'
              }`}
              style={isActive ? { backgroundColor: COLLECTION_COLORS[c.slug] } : {}}
            >
              <span>{c.icon}</span>
              <span className="hidden sm:inline">{c.name}</span>
              <span className="sm:hidden">{(c.name || '').split(' ').pop()}</span>
              <span className="opacity-50">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div
          ref={containerRef}
          className="relative rounded-3xl liquid-glass border border-white/[0.06] overflow-hidden"
          style={{ minHeight: isMobile ? 350 : 550 }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            onMouseMove={handlers.onMouseMove}
            onMouseDown={handlers.onMouseDown}
            onMouseUp={handlers.onMouseUp}
            onMouseLeave={handlers.onMouseLeave}
            onWheel={handlers.onWheel}
            onTouchStart={handlers.onTouchStart}
            onTouchMove={handlers.onTouchMove}
            onTouchEnd={handlers.onTouchEnd}
            style={{ touchAction: 'none' }}
          />

          <div className="absolute top-4 left-4 text-[10px] text-white/20 font-mono pointer-events-none">
            {graph.nodes.length} texts &middot; drag to explore &middot; scroll to zoom
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={controls.zoomIn}
              className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-text-muted hover:text-white transition-colors"
              aria-label="Zoom in"
            >
              <PhMagnifyingGlassPlus className="w-4 h-4" />
            </button>
            <button
              onClick={controls.zoomOut}
              className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-text-muted hover:text-white transition-colors"
              aria-label="Zoom out"
            >
              <PhMagnifyingGlassMinus className="w-4 h-4" />
            </button>
            <button
              onClick={controls.resetView}
              className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-text-muted hover:text-white transition-colors"
              aria-label="Reset view"
            >
              <PhArrowsOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <aside className="hidden lg:block">
          <SidebarContent
            node={selectedNodeData ?? null}
            collection={selCollection ?? null}
            connections={selectedConnections}
            onSelectNode={selectConnection}
          />
        </aside>
      </div>

      <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isMobile && selectedNodeData && (
          <m.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-3xl border-t border-white/[0.1] bg-cosmic-deep/95 backdrop-blur-xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-display text-xl font-bold">{selectedNodeData.title}</h3>
                <p className="text-sm text-text-muted capitalize mt-1">
                  {selCollection?.icon} {selCollection?.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-text-muted"
              >
                <PhX className="w-4 h-4" />
              </button>
            </div>
            <ConnectionList connections={selectedConnections} onSelect={selectConnection} />
            <Link
              href={`/library/${selectedNodeData.id}`}
              className="block w-full mt-4 py-3 rounded-2xl bg-atlantean-teal-aqua text-center font-semibold text-cosmic-deep hover:bg-atlantean-teal-aqua/90 transition-colors"
            >
              Read This Text
            </Link>
          </m.div>
        )}
      </AnimatePresence>
      </LazyMotion>
    </div>
  );
}
