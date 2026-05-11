/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type {
  ContentNode,
} from '../../../lib/content/types';

export interface SimNode extends ContentNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null;
  fy: number | null;
  radius: number;
  color: string;
  clusterX: number;
  clusterY: number;
}

export interface Camera {
  x: number;
  y: number;
  scale: number;
}

export const COLLECTION_COLORS: Record<string, string> = {
  'laws-of-arcanea': 'var(--arc-brand-cosmic-blue)',
  'poesie-of-freedom': 'var(--arc-void)',
  'wisdom-scrolls': 'var(--arc-brand-arcanean-gold)',
  'legends-of-arcanea': 'var(--arc-fire)',
  'chronicles-of-luminors': 'var(--arc-fire)',
  'parables-of-creation': 'var(--arc-wind)',
  'tales-of-creators': 'var(--arc-brand-atlantean-teal)',
  'book-of-rituals': 'var(--arc-void)',
  'dialogues-of-masters': 'var(--arc-brand-cosmic-blue)',
  'prophecies': 'var(--arc-void)',
  'bestiary-of-creation': 'var(--arc-fire)',
  'songs-and-hymns': 'var(--arc-brand-arcanean-gold)',
  'meditations-on-elements': 'var(--arc-brand-atlantean-teal)',
  'academy-handbook': 'var(--arc-wind)',
  'book-of-shadows': 'var(--arc-void)',
  'codex-of-collaboration': 'var(--arc-brand-atlantean-teal)',
  'atlas-of-territories': 'var(--arc-brand-arcanean-gold)',
};

export const EDGE_STYLES: Record<
  string,
  { color: string; width: number; dash: number[]; opacity: number; hiOpacity: number }
> = {
  related: { color: 'var(--arc-brand-atlantean-teal)', width: 1, dash: [], opacity: 0.1, hiOpacity: 0.5 },
  prerequisite: { color: 'var(--arc-brand-arcanean-gold)', width: 1.5, dash: [], opacity: 0.12, hiOpacity: 0.6 },
  next: { color: 'var(--arc-fire)', width: 1.5, dash: [], opacity: 0.12, hiOpacity: 0.6 },
  'shared-tag': { color: 'var(--arc-void)', width: 0.5, dash: [4, 4], opacity: 0.04, hiOpacity: 0.25 },
  'shared-situation': { color: 'var(--arc-brand-cosmic-blue)', width: 0.5, dash: [2, 4], opacity: 0.04, hiOpacity: 0.25 },
};

export const K_REPULSE = 4000;
export const K_ATTRACT = 0.006;
export const K_CLUSTER = 0.002;
export const K_CENTER = 0.0008;
export const DAMPING = 0.88;
export const ALPHA_DECAY = 0.997;
export const MIN_ALPHA = 0.001;
export const BG_COLOR = 'var(--arc-cosmic-void)';
export const BASE_RADIUS = 5;
export const MAX_RADIUS = 13;

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function screenToWorld(sx: number, sy: number, cam: Camera): { x: number; y: number } {
  return { x: sx / cam.scale - cam.x, y: sy / cam.scale - cam.y };
}
