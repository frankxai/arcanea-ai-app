'use client';

import dynamic from 'next/dynamic';
import type { ContentGraph, Collection } from '@/lib/content/types';

const ContentGraphVisualization = dynamic(
  () => import('./graph-visualization').then((mod) => mod.ContentGraphVisualization),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-3xl liquid-glass border border-white/[0.06] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-atlantean-teal-aqua/40 border-t-atlantean-teal-aqua rounded-full animate-spin" />
          <span className="text-sm text-text-muted">Loading graph...</span>
        </div>
      </div>
    ),
  }
);

interface GraphLoaderProps {
  graph: ContentGraph;
  collections: Collection[];
}

export function GraphLoader({ graph, collections }: GraphLoaderProps) {
  return <ContentGraphVisualization graph={graph} collections={collections} />;
}
