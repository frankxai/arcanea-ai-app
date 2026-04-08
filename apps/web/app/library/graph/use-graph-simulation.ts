'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ContentGraph, ContentEdge } from '../../../lib/content/types';
import {
  type SimNode,
  type Camera,
  COLLECTION_COLORS,
  EDGE_STYLES,
  K_REPULSE,
  K_ATTRACT,
  K_CLUSTER,
  K_CENTER,
  DAMPING,
  ALPHA_DECAY,
  MIN_ALPHA,
  BG_COLOR,
  BASE_RADIUS,
  MAX_RADIUS,
  hexToRgba,
  distance,
  screenToWorld,
} from './graph-config';

export function useGraphSimulation(graph: ContentGraph) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filterCollection, setFilterCollection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);

  useEffect(() => { selectedRef.current = selectedId; needsRenderRef.current = true; }, [selectedId]);
  useEffect(() => { hoveredRef.current = hoveredId; needsRenderRef.current = true; }, [hoveredId]);
  useEffect(() => {
    filterRef.current = filterCollection;
    alphaRef.current = Math.max(alphaRef.current, 0.2);
    needsRenderRef.current = true;
  }, [filterCollection]);

  const initSimulation = useCallback(
    (width: number, height: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const ringRadius = Math.min(width, height) * 0.32;

      const collSlugs = [...new Set(graph.nodes.map((n) => n.collection))];
      const clusterCenters: Record<string, { x: number; y: number }> = {};
      collSlugs.forEach((slug, i) => {
        const angle = (i / collSlugs.length) * Math.PI * 2 - Math.PI / 2;
        clusterCenters[slug] = {
          x: cx + Math.cos(angle) * ringRadius,
          y: cy + Math.sin(angle) * ringRadius,
        };
      });

      const degrees: Record<string, number> = {};
      for (const e of graph.edges) {
        degrees[e.source] = (degrees[e.source] || 0) + 1;
        degrees[e.target] = (degrees[e.target] || 0) + 1;
      }
      const maxDegree = Math.max(...Object.values(degrees), 1);

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

  const tick = useCallback(() => {
    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const alpha = alphaRef.current;
    if (alpha < MIN_ALPHA) return;

    const { w, h } = sizeRef.current;
    const cx = w / 2;
    const cy = h / 2;

    for (const n of nodes) {
      if (n.fx !== null) { n.x = n.fx; n.vx = 0; }
      if (n.fy !== null) { n.y = n.fy; n.vy = 0; }
    }

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

    for (const n of nodes) {
      if (n.fx !== null || n.fy !== null) continue;
      n.vx += (n.clusterX - n.x) * K_CLUSTER;
      n.vy += (n.clusterY - n.y) * K_CLUSTER;
      n.vx += (cx - n.x) * K_CENTER;
      n.vy += (cy - n.y) * K_CENTER;
    }

    for (const n of nodes) {
      if (n.fx !== null || n.fy !== null) continue;
      n.vx *= DAMPING;
      n.vy *= DAMPING;
      n.x += n.vx * alpha;
      n.y += n.vy * alpha;
      const pad = 30;
      if (n.x < pad) n.x = pad;
      if (n.x > w - pad) n.x = w - pad;
      if (n.y < pad) n.y = pad;
      if (n.y > h - pad) n.y = h - pad;
    }

    alphaRef.current *= ALPHA_DECAY;
    needsRenderRef.current = true;
  }, []);

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

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cam.x * cam.scale, cam.y * cam.scale);
    ctx.scale(cam.scale, cam.scale);

    const connectedIds = new Set<string>();
    if (sel) {
      connectedIds.add(sel);
      for (const e of edges) {
        if (e.source === sel) connectedIds.add(e.target);
        if (e.target === sel) connectedIds.add(e.source);
      }
    }

    const mobile = sizeRef.current.w < 640;
    for (const e of edges) {
      const style = EDGE_STYLES[e.type] || EDGE_STYLES.related;
      const srcNode = nodes.find((n) => n.id === e.source);
      const tgtNode = nodes.find((n) => n.id === e.target);
      if (!srcNode || !tgtNode) continue;

      if (mobile && (e.type === 'shared-tag' || e.type === 'shared-situation')) {
        if (!sel || (!connectedIds.has(e.source) && !connectedIds.has(e.target))) continue;
      }

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

    for (const n of nodes) {
      const isSel = n.id === sel;
      const isHov = n.id === hov;
      const isConn = connectedIds.has(n.id);
      const isFiltered = filter && n.collection !== filter;

      let nodeOpacity = 1;
      if (isFiltered) nodeOpacity = 0.1;

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

      ctx.fillStyle = hexToRgba(n.color, nodeOpacity);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fill();

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

        ctx.fillStyle = isMain ? '#ffffff' : 'rgba(255,255,255,0.7)';
        ctx.fillText(label, lx, ly);
      }
    }

    ctx.restore();
  }, []);

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

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

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

      if (panRef.current) {
        const dx = sx - panRef.current.startSX;
        const dy = sy - panRef.current.startSY;
        const cam = cameraRef.current;
        cam.x = panRef.current.startCamX + dx / cam.scale;
        cam.y = panRef.current.startCamY + dy / cam.scale;
        needsRenderRef.current = true;
        return;
      }

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

    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    cam.x -= mx / newScale - mx / cam.scale;
    cam.y -= my / newScale - my / cam.scale;
    cam.scale = newScale;
    needsRenderRef.current = true;
  }, []);

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

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
    if (dragRef.current) {
      const node = nodesRef.current[dragRef.current.nodeIdx];
      if (node) { node.fx = null; node.fy = null; }
      dragRef.current = null;
    }
    panRef.current = null;
  }, []);

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

  return {
    selectedId,
    setSelectedId,
    hoveredId,
    filterCollection,
    setFilterCollection,
    isMobile,
    canvasRef,
    containerRef,
    nodesRef,
    selectConnection,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onWheel: handleWheel,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    controls: {
      zoomIn,
      zoomOut,
      resetView,
    },
  };
}
