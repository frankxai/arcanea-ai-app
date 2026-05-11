/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
