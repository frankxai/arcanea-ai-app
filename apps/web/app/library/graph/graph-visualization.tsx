'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { LazyMotion, domMax, m, AnimatePresence } from 'framer-motion';
import {
  PhArrowRight,
  PhMagnifyingGlassPlus,
  PhMagnifyingGlassMinus,
  PhArrowsOut,
  PhX,
} from '@/lib/phosphor-icons';
import type {
  ContentGraph,
  ContentNode,
  ContentEdge,
  Collection,
} from '../../../lib/content/types';

// ── Types ──────────────────────────────────────────────────────────────────
interface SimNode extends ContentNode {
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

interface Camera {
  x: number;
  y: number;
  scale: number;
}

interface Props {
  graph: ContentGraph;
  collections: Collection[];
}

// ── Collection Colors ──────────────────────────────────────────────────────
const COLLECTION_COLORS: Record<string, string> = {
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

// ── Edge Styles ────────────────────────────────────────────────────────────
const EDGE_STYLES: Record<
  string,
  { color: string; width: number; dash: number[]; opacity: number; hiOpacity: number }
> = {
  related: { color: '#00bcd4', width: 1, dash: [], opacity: 0.1, hiOpacity: 0.5 },
  prerequisite: { color: '#ffd700', width: 1.5, dash: [], opacity: 0.12, hiOpacity: 0.6 },
  next: { color: '#ef4444', width: 1.5, dash: [], opacity: 0.12, hiOpacity: 0.6 },
  'shared-tag': { color: '#a78bfa', width: 0.5, dash: [4, 4], opacity: 0.04, hiOpacity: 0.25 },
  'shared-situation': { color: '#3b82f6', width: 0.5, dash: [2, 4], opacity: 0.04, hiOpacity: 0.25 },
};

// ── Constants ──────────────────────────────────────────────────────────────
const K_REPULSE = 4000;
const K_ATTRACT = 0.006;
const K_CLUSTER = 0.002;
const K_CENTER = 0.0008;
const DAMPING = 0.88;
const ALPHA_DECAY = 0.997;
const MIN_ALPHA = 0.001;
const BG_COLOR = '#0b0e14';
const BASE_RADIUS = 5;
const MAX_RADIUS = 13;

// ── Helpers ────────────────────────────────────────────────────────────────
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function screenToWorld(sx: number, sy: number, cam: Camera): { x: number; y: number } {
  return { x: sx / cam.scale - cam.x, y: sy / cam.scale - cam.y };
}

// ── Component ──────────────────────────────────────────────────────────────
export function ContentGraphVisualization({ graph, collections }: Props) {
  // ── React state (triggers UI re-render) ──
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filterCollection, setFilterCollection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // ── Refs (no re-renders) ──
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const edgesRef = useRef<ContentEdge[]>([]);
  const alphaRef = useRef(1.0);
  const cameraRef = useRef<Camera>({ x: 0, y: 0, scale: 1 });
  const animRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const dragRef = useRef<{ nodeIdx: number; startX: number; startY: number } | null>(null);
  const panRef = useRef<{ startCamX: number; startCamY: number; startSX: number; startSY: number } | null>(null);
  const needsRenderRef = useRef(true);
  const selectedRef = useRef<string | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const filterRef = useRef<string | null>(null);

  // Keep refs in sync with state
  useEffect(() => { selectedRef.current = selectedId; needsRenderRef.current = true; }, [selectedId]);
  useEffect(() => { hoveredRef.current = hoveredId; needsRenderRef.current = true; }, [hoveredId]);
  useEffect(() => {
    filterRef.current = filterCollection;
    alphaRef.current = Math.max(alphaRef.current, 0.2);
    needsRenderRef.current = true;
  }, [filterCollection]);

  // ── Computed data ──
  const selectedNode = useMemo(
    () => (selectedId ? nodesRef.current.find((n) => n.id === selectedId) ?? null : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedId, graph],
  );

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

  // ── Initialize simulation ──
  const initSimulation = useCallback(
    (width: number, height: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const ringRadius = Math.min(width, height) * 0.32;

      // Compute cluster centers
      const collSlugs = [...new Set(graph.nodes.map((n) => n.collection))];
      const clusterCenters: Record<string, { x: number; y: number }> = {};
      collSlugs.forEach((slug, i) => {
        const angle = (i / collSlugs.length) * Math.PI * 2 - Math.PI / 2;
        clusterCenters[slug] = {
          x: cx + Math.cos(angle) * ringRadius,
          y: cy + Math.sin(angle) * ringRadius,
        };
      });

      // Compute node degrees
      const degrees: Record<string, number> = {};
      for (const e of graph.edges) {
        degrees[e.source] = (degrees[e.source] || 0) + 1;
        degrees[e.target] = (degrees[e.target] || 0) + 1;
      }
      const maxDegree = Math.max(...Object.values(degrees), 1);

      // Create sim nodes
      const nodes: SimNode[] = graph.nodes.map((n) => {
        const cluster = clusterCenters[n.collection] || { x: cx, y: cy };
        const deg = degrees[n.id] || 0;
        const radius = BASE_RADIUS + (deg / maxDegree) * (MAX_RADIUS - BASE_RADIUS);
        return {
          ...n,
          x: cluster.x + (Math.random() - 0.5) * 80,
          y: cluster.y + (Math.random() - 0.5) * 80,
          vx: 0,
          vy: 0,
          fx: null,
          fy: null,
          radius,
          color: COLLECTION_COLORS[n.collection] || '#666',
          clusterX: cluster.x,
          clusterY: cluster.y,
        };
      });

      nodesRef.current = nodes;
      edgesRef.current = graph.edges;
      alphaRef.current = 1.0;
      cameraRef.current = { x: 0, y: 0, scale: 1 };
    },
    [graph],
  );

  // ── Force tick ──
  const tick = useCallback(() => {
    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const alpha = alphaRef.current;
    if (alpha < MIN_ALPHA) return;

    const { w, h } = sizeRef.current;
    const cx = w / 2;
    const cy = h / 2;

    // Reset forces
    for (const n of nodes) {
      if (n.fx !== null) { n.x = n.fx; n.vx = 0; }
      if (n.fy !== null) { n.y = n.fy; n.vy = 0; }
    }

    // Repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 1) d2 = 1;
        const d = Math.sqrt(d2);
        const force = K_REPULSE / d2;
        const fx = (dx / d) * force;
        const fy = (dy / d) * force;
        if (a.fx === null) { a.vx -= fx; a.vy -= fy; }
        if (b.fx === null) { b.vx += fx; b.vy += fy; }
      }
    }

    // Attraction along edges
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    for (const e of edges) {
      const a = nodeMap.get(e.source);
      const b = nodeMap.get(e.target);
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const restLen = 60 / (e.weight || 0.3);
      const force = K_ATTRACT * (d - restLen);
      const fx = (dx / d) * force;
      const fy = (dy / d) * force;
      if (a.fx === null) { a.vx += fx; a.vy += fy; }
      if (b.fx === null) { b.vx -= fx; b.vy -= fy; }
    }

    // Clustering + centering
    for (const n of nodes) {
      if (n.fx !== null || n.fy !== null) continue;
      // Cluster pull
      n.vx += (n.clusterX - n.x) * K_CLUSTER;
      n.vy += (n.clusterY - n.y) * K_CLUSTER;
      // Center pull
      n.vx += (cx - n.x) * K_CENTER;
      n.vy += (cy - n.y) * K_CENTER;
    }

    // Integrate
    for (const n of nodes) {
      if (n.fx !== null || n.fy !== null) continue;
      n.vx *= DAMPING;
      n.vy *= DAMPING;
      n.x += n.vx * alpha;
      n.y += n.vy * alpha;
      // Soft bounds
      const pad = 30;
      if (n.x < pad) n.x = pad;
      if (n.x > w - pad) n.x = w - pad;
      if (n.y < pad) n.y = pad;
      if (n.y > h - pad) n.y = h - pad;
    }

    alphaRef.current *= ALPHA_DECAY;
    needsRenderRef.current = true;
  }, []);

  // ── Canvas render ──
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const cam = cameraRef.current;
    const sel = selectedRef.current;
    const hov = hoveredRef.current;
    const filter = filterRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { w, h } = sizeRef.current;

    // Size canvas
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, w, h);

    // Apply camera
    ctx.save();
    ctx.translate(cam.x * cam.scale, cam.y * cam.scale);
    ctx.scale(cam.scale, cam.scale);

    // Build connected set for selection
    const connectedIds = new Set<string>();
    if (sel) {
      connectedIds.add(sel);
      for (const e of edges) {
        if (e.source === sel) connectedIds.add(e.target);
        if (e.target === sel) connectedIds.add(e.source);
      }
    }

    // Draw edges
    const mobile = sizeRef.current.w < 640;
    for (const e of edges) {
      const style = EDGE_STYLES[e.type] || EDGE_STYLES.related;
      const srcNode = nodes.find((n) => n.id === e.source);
      const tgtNode = nodes.find((n) => n.id === e.target);
      if (!srcNode || !tgtNode) continue;

      // Skip weak edges on mobile unless connected to selection
      if (mobile && (e.type === 'shared-tag' || e.type === 'shared-situation')) {
        if (!sel || (!connectedIds.has(e.source) && !connectedIds.has(e.target))) continue;
      }

      // Filter opacity
      const isHighlighted =
        sel && (e.source === sel || e.target === sel) ||
        hov && (e.source === hov || e.target === hov);
      const isFiltered = filter && srcNode.collection !== filter && tgtNode.collection !== filter;

      let opacity = isHighlighted ? style.hiOpacity : style.opacity;
      if (isFiltered) opacity *= 0.15;

      ctx.strokeStyle = hexToRgba(style.color, opacity);
      ctx.lineWidth = style.width;
      ctx.setLineDash(style.dash);
      ctx.beginPath();
      ctx.moveTo(srcNode.x, srcNode.y);
      ctx.lineTo(tgtNode.x, tgtNode.y);
      ctx.stroke();

      // Arrowhead for "next" edges
      if (e.type === 'next' && opacity > 0.05) {
        const angle = Math.atan2(tgtNode.y - srcNode.y, tgtNode.x - srcNode.x);
        const arrowLen = 6;
        const ax = tgtNode.x - Math.cos(angle) * (tgtNode.radius + 3);
        const ay = tgtNode.y - Math.sin(angle) * (tgtNode.radius + 3);
        ctx.fillStyle = hexToRgba(style.color, opacity);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(
          ax - Math.cos(angle - 0.4) * arrowLen,
          ay - Math.sin(angle - 0.4) * arrowLen,
        );
        ctx.lineTo(
          ax - Math.cos(angle + 0.4) * arrowLen,
          ay - Math.sin(angle + 0.4) * arrowLen,
        );
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.setLineDash([]);

    // Draw nodes
    for (const n of nodes) {
      const isSel = n.id === sel;
      const isHov = n.id === hov;
      const isConn = connectedIds.has(n.id);
      const isFiltered = filter && n.collection !== filter;

      let nodeOpacity = 1;
      if (isFiltered) nodeOpacity = 0.1;

      // Outer glow
      if ((isSel || isHov || isConn) && !isFiltered) {
        const glowRadius = n.radius * (isSel ? 3.5 : isHov ? 3 : 2.2);
        const grad = ctx.createRadialGradient(n.x, n.y, n.radius * 0.5, n.x, n.y, glowRadius);
        grad.addColorStop(0, hexToRgba(n.color, isSel ? 0.35 : 0.2));
        grad.addColorStop(1, hexToRgba(n.color, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Node fill
      ctx.fillStyle = hexToRgba(n.color, nodeOpacity);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fill();

      // Selection ring
      if (isSel) {
        ctx.strokeStyle = hexToRgba('#ffffff', 0.8);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + 3, 0, Math.PI * 2);
        ctx.stroke();
      } else if (isConn && sel && !isFiltered) {
        ctx.strokeStyle = hexToRgba('#ffd700', 0.4);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Draw labels for selected + neighbors
    if (sel || hov) {
      const labelNodes = nodes.filter(
        (n) => n.id === sel || n.id === hov || (sel && connectedIds.has(n.id)),
      );
      ctx.font = '11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      for (const n of labelNodes) {
        if (filter && n.collection !== filter) continue;
        const isMain = n.id === sel || n.id === hov;
        const label = n.title.length > 28 ? n.title.slice(0, 26) + '...' : n.title;

        // Background
        const metrics = ctx.measureText(label);
        const pw = 6;
        const ph = 3;
        const lx = n.x;
        const ly = n.y - n.radius - 8;

        ctx.fillStyle = hexToRgba('#0b0e14', 0.85);
        ctx.beginPath();
        const rr = 4;
        const bx = lx - metrics.width / 2 - pw;
        const by = ly - 14 - ph;
        const bw = metrics.width + pw * 2;
        const bh = 14 + ph * 2;
        ctx.roundRect(bx, by, bw, bh, rr);
        ctx.fill();

        // Text
        ctx.fillStyle = isMain ? '#ffffff' : 'rgba(255,255,255,0.7)';
        ctx.fillText(label, lx, ly);
      }
    }

    ctx.restore();
  }, []);

  // ── Hit test ──
  const hitTest = useCallback(
    (sx: number, sy: number): SimNode | null => {
      const cam = cameraRef.current;
      const world = screenToWorld(sx, sy, cam);
      const tolerance = isMobile ? 18 : 8;

      let closest: SimNode | null = null;
      let minDist = Infinity;
      for (const n of nodesRef.current) {
        const d = distance(world, n);
        if (d < n.radius + tolerance && d < minDist) {
          minDist = d;
          closest = n;
        }
      }
      return closest;
    },
    [isMobile],
  );

  // ── Mouse handlers ──
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      // Dragging a node
      if (dragRef.current) {
        const world = screenToWorld(sx, sy, cameraRef.current);
        const node = nodesRef.current[dragRef.current.nodeIdx];
        if (node) {
          node.fx = world.x;
          node.fy = world.y;
          alphaRef.current = Math.max(alphaRef.current, 0.15);
          needsRenderRef.current = true;
        }
        return;
      }

      // Panning
      if (panRef.current) {
        const dx = sx - panRef.current.startSX;
        const dy = sy - panRef.current.startSY;
        const cam = cameraRef.current;
        cam.x = panRef.current.startCamX + dx / cam.scale;
        cam.y = panRef.current.startCamY + dy / cam.scale;
        needsRenderRef.current = true;
        return;
      }

      // Hover
      const hit = hitTest(sx, sy);
      const newHovId = hit?.id ?? null;
      if (newHovId !== hoveredRef.current) {
        setHoveredId(newHovId);
      }
      if (canvasRef.current) {
        canvasRef.current.style.cursor = hit ? 'pointer' : 'grab';
      }
    },
    [hitTest],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      const hit = hitTest(sx, sy);
      if (hit) {
        const idx = nodesRef.current.indexOf(hit);
        dragRef.current = { nodeIdx: idx, startX: sx, startY: sy };
        if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
      } else {
        panRef.current = {
          startCamX: cameraRef.current.x,
          startCamY: cameraRef.current.y,
          startSX: sx,
          startSY: sy,
        };
        if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
      }
    },
    [hitTest],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      if (dragRef.current) {
        const movedDist = Math.abs(sx - dragRef.current.startX) + Math.abs(sy - dragRef.current.startY);
        const node = nodesRef.current[dragRef.current.nodeIdx];
        if (node) {
          node.fx = null;
          node.fy = null;
        }
        // If barely moved, treat as click (select)
        if (movedDist < 5) {
          setSelectedId((prev) => (prev === node?.id ? null : node?.id ?? null));
        }
        dragRef.current = null;
      } else if (panRef.current) {
        const movedDist =
          Math.abs(sx - panRef.current.startSX) + Math.abs(sy - panRef.current.startSY);
        if (movedDist < 5) {
          setSelectedId(null);
        }
        panRef.current = null;
      }
      if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
    },
    [],
  );

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cam = cameraRef.current;
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    const newScale = Math.max(0.3, Math.min(3, cam.scale * factor));

    // Zoom toward mouse position
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    cam.x -= mx / newScale - mx / cam.scale;
    cam.y -= my / newScale - my / cam.scale;
    cam.scale = newScale;
    needsRenderRef.current = true;
  }, []);

  // ── Touch handlers ──
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchRef.current = { dist: Math.sqrt(dx * dx + dy * dy), scale: cameraRef.current.scale };
        return;
      }
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.touches[0].clientX - rect.left;
      const sy = e.touches[0].clientY - rect.top;
      touchStartRef.current = { x: sx, y: sy, time: Date.now() };

      const hit = hitTest(sx, sy);
      if (hit) {
        const idx = nodesRef.current.indexOf(hit);
        dragRef.current = { nodeIdx: idx, startX: sx, startY: sy };
      } else {
        panRef.current = {
          startCamX: cameraRef.current.x,
          startCamY: cameraRef.current.y,
          startSX: sx,
          startSY: sy,
        };
      }
    },
    [hitTest],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if (e.touches.length === 2 && pinchRef.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const newDist = Math.sqrt(dx * dx + dy * dy);
        const factor = newDist / pinchRef.current.dist;
        cameraRef.current.scale = Math.max(0.3, Math.min(3, pinchRef.current.scale * factor));
        needsRenderRef.current = true;
        return;
      }
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect || !e.touches[0]) return;
      const sx = e.touches[0].clientX - rect.left;
      const sy = e.touches[0].clientY - rect.top;

      if (dragRef.current) {
        const world = screenToWorld(sx, sy, cameraRef.current);
        const node = nodesRef.current[dragRef.current.nodeIdx];
        if (node) {
          node.fx = world.x;
          node.fy = world.y;
          alphaRef.current = Math.max(alphaRef.current, 0.15);
        }
        needsRenderRef.current = true;
      } else if (panRef.current) {
        const dx = sx - panRef.current.startSX;
        const dy = sy - panRef.current.startSY;
        cameraRef.current.x = panRef.current.startCamX + dx / cameraRef.current.scale;
        cameraRef.current.y = panRef.current.startCamY + dy / cameraRef.current.scale;
        needsRenderRef.current = true;
      }
    },
    [],
  );

  const handleTouchEnd = useCallback(() => {
    if (pinchRef.current) {
      pinchRef.current = null;
      return;
    }
    if (dragRef.current) {
      const node = nodesRef.current[dragRef.current.nodeIdx];
      if (node) {
        node.fx = null;
        node.fy = null;
      }
      // Detect tap
      if (touchStartRef.current && Date.now() - touchStartRef.current.time < 300) {
        setSelectedId((prev) => (prev === node?.id ? null : node?.id ?? null));
      }
      dragRef.current = null;
    } else if (panRef.current) {
      if (touchStartRef.current && Date.now() - touchStartRef.current.time < 200) {
        setSelectedId(null);
      }
      panRef.current = null;
    }
    touchStartRef.current = null;
  }, []);

  // ── Zoom controls ──
  const zoomIn = useCallback(() => {
    cameraRef.current.scale = Math.min(3, cameraRef.current.scale * 1.3);
    needsRenderRef.current = true;
  }, []);
  const zoomOut = useCallback(() => {
    cameraRef.current.scale = Math.max(0.3, cameraRef.current.scale * 0.7);
    needsRenderRef.current = true;
  }, []);
  const resetView = useCallback(() => {
    cameraRef.current = { x: 0, y: 0, scale: 1 };
    needsRenderRef.current = true;
  }, []);

  // ── Animation loop ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      sizeRef.current = { w: rect.width, h: rect.height };
      if (nodesRef.current.length === 0) {
        initSimulation(rect.width, rect.height);
      }
      needsRenderRef.current = true;
    };

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(container);
    updateSize();

    const loop = () => {
      tick();
      if (needsRenderRef.current || alphaRef.current > MIN_ALPHA) {
        render();
        needsRenderRef.current = false;
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animRef.current);
    };
  }, [initSimulation, tick, render]);

  // ── Select a connection (pan to it) ──
  const selectConnection = useCallback((id: string) => {
    setSelectedId(id);
    const node = nodesRef.current.find((n) => n.id === id);
    if (node) {
      const { w, h } = sizeRef.current;
      const cam = cameraRef.current;
      cam.x = w / 2 / cam.scale - node.x;
      cam.y = h / 2 / cam.scale - node.y;
      alphaRef.current = Math.max(alphaRef.current, 0.05);
      needsRenderRef.current = true;
    }
  }, []);

  // ── JSX ──
  const selectedNodeData = useMemo(
    () => graph.nodes.find((n) => n.id === selectedId),
    [selectedId, graph.nodes],
  );
  const selCollection = selectedNodeData
    ? collections.find((c) => c.slug === selectedNodeData.collection)
    : null;

  return (
    <div className="space-y-6">
      {/* ── Filter bar ── */}
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

      {/* ── Canvas + Sidebar ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Canvas container */}
        <div
          ref={containerRef}
          className="relative rounded-3xl liquid-glass border border-white/[0.06] overflow-hidden"
          style={{ minHeight: isMobile ? 350 : 550 }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              setHoveredId(null);
              if (dragRef.current) {
                const node = nodesRef.current[dragRef.current.nodeIdx];
                if (node) { node.fx = null; node.fy = null; }
                dragRef.current = null;
              }
              panRef.current = null;
            }}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'none' }}
          />

          {/* Instructions overlay */}
          <div className="absolute top-4 left-4 text-[10px] text-white/20 font-mono pointer-events-none">
            {graph.nodes.length} texts &middot; drag to explore &middot; scroll to zoom
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={zoomIn}
              className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-text-muted hover:text-white transition-colors"
              aria-label="Zoom in"
            >
              <PhMagnifyingGlassPlus className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-text-muted hover:text-white transition-colors"
              aria-label="Zoom out"
            >
              <PhMagnifyingGlassMinus className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-text-muted hover:text-white transition-colors"
              aria-label="Reset view"
            >
              <PhArrowsOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar — desktop */}
        <aside className="hidden lg:block">
          <SidebarContent
            node={selectedNodeData ?? null}
            collection={selCollection ?? null}
            connections={selectedConnections}
            onSelectNode={selectConnection}
          />
        </aside>
      </div>

      {/* ── Mobile bottom sheet ── */}
      <LazyMotion features={domMax}>
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

// ── Sidebar Content ────────────────────────────────────────────────────────
function SidebarContent({
  node,
  collection,
  connections,
  onSelectNode,
}: {
  node: ContentNode | null;
  collection: Collection | null;
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
      {/* Color accent */}
      <div className="h-1" style={{ backgroundColor: color }} />

      <div className="p-6 space-y-5">
        {/* Title */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color }}>
            Selected Text
          </p>
          <h3 className="font-display text-xl font-bold">{node.title}</h3>
          <p className="text-sm text-text-muted mt-1 capitalize">
            {collection?.icon} {collection?.name}
          </p>
        </div>

        {/* Format */}
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

        {/* Situations */}
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

        {/* Connections */}
        <ConnectionList connections={connections} onSelect={onSelectNode} />

        {/* CTA */}
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

// ── Connection List ────────────────────────────────────────────────────────
function ConnectionList({
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

  // Deduplicate shared
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
