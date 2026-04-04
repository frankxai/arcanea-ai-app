/**
 * Research Hub — Type Definitions
 *
 * Matches the YAML frontmatter schema used in docs/research/ markdown files.
 */

export type ResearchType = 'paper' | 'repo' | 'book' | 'benchmark' | 'synthesis' | 'research-synthesis';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ResearchItem {
  slug: string;
  category: string;
  title: string;
  date: string;
  type: ResearchType;
  domain: string[];
  gateConnections: string[];
  guardianConnections: string[];
  relevanceScore: number;
  confidence: ConfidenceLevel;
  sourceUrl: string;
  author: string;
  content: string;
}

export interface ResearchCategory {
  name: string;
  slug: string;
  count: number;
  description: string;
}

/** Gate name to badge variant mapping for the UI */
export const GATE_COLORS: Record<string, string> = {
  Foundation: 'bg-amber-900/20 border-amber-700/30 text-amber-400',
  Flow: 'bg-blue-900/20 border-blue-500/30 text-blue-400',
  Fire: 'bg-red-900/20 border-red-600/30 text-red-400',
  Heart: 'bg-pink-900/20 border-pink-500/30 text-pink-400',
  Voice: 'bg-teal-900/20 border-teal-500/30 text-teal-400',
  Sight: 'bg-violet-900/20 border-violet-500/30 text-violet-400',
  Crown: 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400',
  Starweave: 'bg-fuchsia-900/20 border-fuchsia-500/30 text-fuchsia-400',
  Unity: 'bg-slate-800/20 border-slate-400/30 text-slate-300',
  Source: 'bg-neutral-900/20 border-yellow-600/30 text-yellow-300',
};

/** Category metadata for display */
export const CATEGORY_META: Record<string, { label: string; description: string }> = {
  papers: { label: 'Papers', description: 'Academic papers and surveys from CVPR, ICLR, NeurIPS, and arxiv' },
  github: { label: 'Tools', description: 'Open-source tools and repository evaluations' },
  benchmarks: { label: 'Benchmarks', description: 'Hardware and software benchmark reports' },
  synthesis: { label: 'Synthesis', description: 'Cross-domain synthesis connecting research to the Ten Gates' },
  books: { label: 'Books', description: 'Book insights and character design pattern analysis' },
};
