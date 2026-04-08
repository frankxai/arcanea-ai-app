'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  DemoArc,
  GraphNode,
  GraphEdge,
  Palette,
  PALETTE_COLORS,
  PALETTE_EDGE_COLORS,
  TYPE_ICONS,
  STAGE_COLORS,
  DEMO_ARCS,
  NODE_WIDTH,
  NODE_HEIGHT,
  getPalette,
  getSecondaryPalette,
  initNodes,
  extractEdges,
  simulate,
  roundRect,
} from './arcs-data';
import { SidePanel, HoverTooltip } from './arcs-components';

export default function ArcsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const animRef = useRef<number>(0);
  const draggingRef = useRef<string | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const sizeRef = useRef({ w: 0, h: 0 });

  const [selectedArc, setSelectedArc] = useState<DemoArc | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const initSimulation = useCallback((w: number, h: number) => {
    nodesRef.current = initNodes(DEMO_ARCS, w, h);
    edgesRef.current = extractEdges(DEMO_ARCS);
    sizeRef.current = { w, h };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, w * dpr, h * dpr);
    ctx.save();
    ctx.scale(dpr, dpr);

    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const hovered = hoveredRef.current;

    for (const edge of edges) {
      const a = nodeMap.get(edge.source);
      const b = nodeMap.get(edge.target);
      if (!a || !b) continue;

      const ax = a.x + NODE_WIDTH / 2;
      const ay = a.y + NODE_HEIGHT / 2;
      const bx = b.x + NODE_WIDTH / 2;
      const by = b.y + NODE_HEIGHT / 2;

      const isHighlighted = hovered === edge.source || hovered === edge.target;
      const palette = getPalette(a.arc);

      ctx.beginPath();
      ctx.moveTo(ax, ay);

      const mx = (ax + bx) / 2 + (ay - by) * 0.08;
      const my = (ay + by) / 2 + (bx - ax) * 0.08;
      ctx.quadraticCurveTo(mx, my, bx, by);

      ctx.strokeStyle = isHighlighted ? PALETTE_COLORS[palette].text + '60' : PALETTE_EDGE_COLORS[palette];
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.stroke();

      if (isHighlighted) {
        const lx = (ax + bx) / 2 + (ay - by) * 0.04;
        const ly = (ay + by) / 2 + (bx - ax) * 0.04;
        ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.textAlign = 'center';
        ctx.fillText(edge.relation, lx, ly - 4);
      }
    }

    for (const node of nodes) {
      const palette = getPalette(node.arc);
      const colors = PALETTE_COLORS[palette];
      const isHovered = hovered === node.id;
      const isSelected = selectedArc?.id === node.id;

      if (isHovered || isSelected) {
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 24;
      }

      ctx.beginPath();
      roundRect(ctx, node.x, node.y, NODE_WIDTH, NODE_HEIGHT, 12);
      ctx.fillStyle = isHovered || isSelected ? colors.bg.replace('0.12', '0.22') : colors.bg;
      ctx.fill();

      ctx.strokeStyle = isHovered || isSelected ? colors.text + '80' : colors.border;
      ctx.lineWidth = isHovered || isSelected ? 1.5 : 1;
      ctx.stroke();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      ctx.save();
      ctx.translate(node.x + 14, node.y + 16);
      ctx.scale(0.62, 0.62);
      const iconPath = new Path2D(TYPE_ICONS[node.arc.type]);
      ctx.fillStyle = colors.text;
      ctx.fill(iconPath);
      ctx.restore();

      const title = node.arc.apl?.spark
        ? node.arc.apl.spark.length > 36
          ? node.arc.apl.spark.slice(0, 36) + '...'
          : node.arc.apl.spark
        : node.arc.type;

      ctx.font = '500 11px ui-sans-serif, system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';

      const maxTextW = NODE_WIDTH - 40;
      const words = title.split(' ');
      let line1 = '';
      let line2 = '';
      let onLine2 = false;

      for (const word of words) {
        const test = onLine2 ? line2 + (line2 ? ' ' : '') + word : line1 + (line1 ? ' ' : '') + word;
        const measured = ctx.measureText(test).width;
        if (!onLine2 && measured > maxTextW) {
          onLine2 = true;
          line2 = word;
        } else if (onLine2 && measured > maxTextW) {
          line2 = line2.slice(0, -3) + '...';
          break;
        } else if (onLine2) {
          line2 += (line2 ? ' ' : '') + word;
        } else {
          line1 = test;
        }
      }

      ctx.fillText(line1, node.x + 30, node.y + 14);
      if (line2) {
        ctx.fillText(line2, node.x + 30, node.y + 28);
      }

      const stageColors = STAGE_COLORS[node.arc.stage];
      const stageText = node.arc.stage.slice(0, 3).toUpperCase();
      const badgeX = node.x + 10;
      const badgeY = node.y + NODE_HEIGHT - 22;

      ctx.beginPath();
      roundRect(ctx, badgeX, badgeY, 32, 14, 4);
      ctx.fillStyle = stageColors.bg;
      ctx.fill();
      ctx.font = '600 8px ui-monospace, SFMono-Regular, monospace';
      ctx.fillStyle = stageColors.text;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(stageText, badgeX + 16, badgeY + 7);

      ctx.beginPath();
      ctx.arc(node.x + NODE_WIDTH - 16, node.y + NODE_HEIGHT - 15, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors.text;
      ctx.fill();

      const secondary = getSecondaryPalette(node.arc);
      if (secondary) {
        ctx.beginPath();
        ctx.arc(node.x + NODE_WIDTH - 28, node.y + NODE_HEIGHT - 15, 4, 0, Math.PI * 2);
        ctx.fillStyle = PALETTE_COLORS[secondary].text;
        ctx.fill();
      }
    }

    ctx.restore();
  }, [selectedArc]);

  const tick = useCallback(() => {
    const { w, h } = sizeRef.current;
    simulate(nodesRef.current, edgesRef.current, w, h);
    draw();
    animRef.current = requestAnimationFrame(tick);
  }, [draw]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      if (nodesRef.current.length === 0) {
        initSimulation(rect.width, rect.height);
      }
      sizeRef.current = { w: rect.width, h: rect.height };
    };

    resize();
    window.addEventListener('resize', resize);
    animRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [initSimulation, tick]);

  const hitTest = useCallback((clientX: number, clientY: number): GraphNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if (x >= n.x && x <= n.x + NODE_WIDTH && y >= n.y && y <= n.y + NODE_HEIGHT) {
        return n;
      }
    }
    return null;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const node = hitTest(e.clientX, e.clientY);
    if (node) {
      draggingRef.current = node.id;
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        offsetRef.current = { x: e.clientX - rect.left - node.x, y: e.clientY - rect.top - node.y };
      }
      node.fx = node.x;
      node.fy = node.y;
    }
  }, [hitTest]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (draggingRef.current) {
      const node = nodesRef.current.find(n => n.id === draggingRef.current);
      if (node) {
        node.fx = mx - offsetRef.current.x;
        node.fy = my - offsetRef.current.y;
        node.x = node.fx;
        node.y = node.fy;
      }
      return;
    }

    const node = hitTest(e.clientX, e.clientY);
    const newHovered = node ? node.id : null;
    if (newHovered !== hoveredRef.current) {
      hoveredRef.current = newHovered;
      setHoveredId(newHovered);
      canvas.style.cursor = newHovered ? 'grab' : 'default';
    }
  }, [hitTest]);

  const handleMouseUp = useCallback(() => {
    if (draggingRef.current) {
      const node = nodesRef.current.find(n => n.id === draggingRef.current);
      if (node) {
        node.fx = null;
        node.fy = null;
      }
      draggingRef.current = null;
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const node = hitTest(e.clientX, e.clientY);
    if (node) {
      setSelectedArc(prev => prev?.id === node.id ? null : node.arc);
    } else {
      setSelectedArc(null);
    }
  }, [hitTest]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const node = hitTest(touch.clientX, touch.clientY);
    if (node) {
      draggingRef.current = node.id;
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        offsetRef.current = { x: touch.clientX - rect.left - node.x, y: touch.clientY - rect.top - node.y };
      }
      node.fx = node.x;
      node.fy = node.y;
    }
  }, [hitTest]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1 || !draggingRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const node = nodesRef.current.find(n => n.id === draggingRef.current);
    if (node) {
      node.fx = touch.clientX - rect.left - offsetRef.current.x;
      node.fy = touch.clientY - rect.top - offsetRef.current.y;
      node.x = node.fx;
      node.y = node.fy;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (draggingRef.current) {
      if (e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        const node = hitTest(touch.clientX, touch.clientY);
        if (node && node.id === draggingRef.current) {
          setSelectedArc(prev => prev?.id === node.id ? null : node.arc);
        }
      }
      const node = nodesRef.current.find(n => n.id === draggingRef.current);
      if (node) {
        node.fx = null;
        node.fy = null;
      }
      draggingRef.current = null;
    }
  }, [hitTest]);

  const legendPalettes: { name: Palette; label: string }[] = [
    { name: 'forge', label: 'Forge' },
    { name: 'tide', label: 'Tide' },
    { name: 'root', label: 'Root' },
    { name: 'drift', label: 'Drift' },
    { name: 'void', label: 'Void' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#09090b' }}>
      <div className="relative z-10 px-6 pt-8 pb-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-100">
            The Weave
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Every creation is a node. Every bond is a thread. This is the living graph of arcs.
          </p>
        </div>
      </div>

      <div className="relative z-10 px-6 pb-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          {legendPalettes.map(p => (
            <div key={p.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: PALETTE_COLORS[p.name].text }} />
              <span className="text-[11px] text-neutral-500 font-mono">{p.label}</span>
            </div>
          ))}
          <div className="w-px h-3 bg-neutral-800 mx-1" />
          <span className="text-[11px] text-neutral-600">{DEMO_ARCS.length} arcs &middot; {extractEdges(DEMO_ARCS).length} bonds</span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative mx-4 sm:mx-6 rounded-xl overflow-hidden"
        style={{
          height: 'calc(100vh - 160px)',
          background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.04) 0%, transparent 70%)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="absolute inset-0"
        />

        {hoveredId && !selectedArc && (
          <HoverTooltip nodeId={hoveredId} nodes={nodesRef.current} />
        )}
      </div>

      {selectedArc && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedArc(null)}
          />
          <SidePanel arc={selectedArc} onClose={() => setSelectedArc(null)} />
        </>
      )}
    </div>
  );
}
