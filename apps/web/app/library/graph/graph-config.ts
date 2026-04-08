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
  'laws-of-arcanea': '#0d47a1',
  'poesie-of-freedom': '#f472b6',
  'wisdom-scrolls': '#fbbf24',
  'legends-of-arcanea': '#ef4444',
  'chronicles-of-luminors': '#f97316',
  'parables-of-creation': '#22c55e',
  'tales-of-creators': '#00bcd4',
  'book-of-rituals': '#6366f1',
  'dialogues-of-masters': '#3b82f6',
  'prophecies': '#a78bfa',
  'bestiary-of-creation': '#fb7185',
  'songs-and-hymns': '#fcd34d',
  'meditations-on-elements': '#22d3ee',
  'academy-handbook': '#34d399',
  'book-of-shadows': '#94a3b8',
  'codex-of-collaboration': '#38bdf8',
  'atlas-of-territories': '#a3e635',
};

export const EDGE_STYLES: Record<
  string,
  { color: string; width: number; dash: number[]; opacity: number; hiOpacity: number }
> = {
  related: { color: '#00bcd4', width: 1, dash: [], opacity: 0.1, hiOpacity: 0.5 },
  prerequisite: { color: '#ffd700', width: 1.5, dash: [], opacity: 0.12, hiOpacity: 0.6 },
  next: { color: '#ef4444', width: 1.5, dash: [], opacity: 0.12, hiOpacity: 0.6 },
  'shared-tag': { color: '#a78bfa', width: 0.5, dash: [4, 4], opacity: 0.04, hiOpacity: 0.25 },
  'shared-situation': { color: '#3b82f6', width: 0.5, dash: [2, 4], opacity: 0.04, hiOpacity: 0.25 },
};

export const K_REPULSE = 4000;
export const K_ATTRACT = 0.006;
export const K_CLUSTER = 0.002;
export const K_CENTER = 0.0008;
export const DAMPING = 0.88;
export const ALPHA_DECAY = 0.997;
export const MIN_ALPHA = 0.001;
export const BG_COLOR = '#0b0e14';
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
