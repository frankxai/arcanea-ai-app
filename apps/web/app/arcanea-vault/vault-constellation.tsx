'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import type { VaultEntry } from '@/lib/vault-data';
import { VAULT_CONFIG, type VaultCategory } from '@/lib/vault-data';

interface Star {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  entry: VaultEntry;
  region: VaultCategory;
}

// Vault regions positioned in a constellation pattern
const REGION_POSITIONS: Record<VaultCategory, { cx: number; cy: number }> = {
  strategic:   { cx: 0.20, cy: 0.30 },
  technical:   { cx: 0.50, cy: 0.20 },
  creative:    { cx: 0.80, cy: 0.30 },
  operational: { cx: 0.25, cy: 0.70 },
  wisdom:      { cx: 0.55, cy: 0.75 },
  horizon:     { cx: 0.80, cy: 0.70 },
};

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function buildStars(entries: VaultEntry[], w: number, h: number): Star[] {
  const stars: Star[] = [];
  const regionCounts: Record<string, number> = {};

  for (const entry of entries) {
    const cat = entry.vault as VaultCategory;
    const config = VAULT_CONFIG[cat];
    if (!config) continue;

    const pos = REGION_POSITIONS[cat];
    const idx = regionCounts[cat] ?? 0;
    regionCounts[cat] = idx + 1;

    // Scatter stars around region center with golden-angle distribution
    const angle = idx * 2.399963; // golden angle in radians
    const dist = 30 + Math.sqrt(idx) * 25;
    const jitterX = Math.sin(idx * 7.3) * 15;
    const jitterY = Math.cos(idx * 11.1) * 15;

    const confidence = entry.confidence === 'high' ? 1 : entry.confidence === 'medium' ? 0.7 : 0.4;

    stars.push({
      x: pos.cx * w + Math.cos(angle) * dist + jitterX,
      y: pos.cy * h + Math.sin(angle) * dist + jitterY,
      radius: 2 + confidence * 2.5,
      color: config.color,
      alpha: 0.4 + confidence * 0.5,
      entry,
      region: cat,
    });
  }

  return stars;
}

function drawConstellation(ctx: CanvasRenderingContext2D, stars: Star[], w: number, h: number, hoverIdx: number, animProgress: number) {
  ctx.clearRect(0, 0, w, h);

  // Draw region labels
  for (const [cat, pos] of Object.entries(REGION_POSITIONS)) {
    const config = VAULT_CONFIG[cat as VaultCategory];
    ctx.save();
    ctx.font = '10px "Space Grotesk", sans-serif';
    ctx.fillStyle = `${config.color}50`;
    ctx.textAlign = 'center';
    ctx.letterSpacing = '3px';
    ctx.fillText(config.label.toUpperCase(), pos.cx * w, pos.cy * h - 50);
    ctx.restore();
  }

  // Draw connections between stars in same region
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      if (stars[i].region !== stars[j].region) continue;
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 * animProgress * (1 - dist / 80)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  // Draw stars
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const isHovered = i === hoverIdx;
    const staggerDelay = i * 0.05;
    const starAlpha = Math.min(1, Math.max(0, (animProgress - staggerDelay) * 2));

    if (starAlpha <= 0) continue;

    const [r, g, b] = hexToRgb(s.color);
    const radius = isHovered ? s.radius * 1.8 : s.radius;

    // Glow
    const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius * 4);
    glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${(isHovered ? 0.3 : 0.12) * starAlpha})`);
    glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(s.x - radius * 4, s.y - radius * 4, radius * 8, radius * 8);

    // Core
    ctx.beginPath();
    ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.alpha * starAlpha})`;
    ctx.fill();

    // Bright center
    ctx.beginPath();
    ctx.arc(s.x, s.y, radius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * starAlpha})`;
    ctx.fill();
  }
}

export function VaultConstellation({ entries }: { entries: VaultEntry[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; entry: VaultEntry } | null>(null);
  const animRef = useRef(0);
  const rafRef = useRef(0);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    animRef.current = Math.min(1, animRef.current + 0.008);
    drawConstellation(ctx, starsRef.current, canvas.width, canvas.height, hoverIdx, animRef.current);

    if (animRef.current < 1) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [hoverIdx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      starsRef.current = buildStars(entries, rect.width, rect.height);
      animRef.current = 0;
      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [entries, animate]);

  useEffect(() => {
    if (animRef.current >= 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      drawConstellation(ctx, starsRef.current, canvas.width, canvas.height, hoverIdx, 1);
    }
  }, [hoverIdx]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let closest = -1;
    let closestDist = 20; // hit radius

    for (let i = 0; i < starsRef.current.length; i++) {
      const s = starsRef.current[i];
      const dx = mx - s.x;
      const dy = my - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestDist) {
        closest = i;
        closestDist = dist;
      }
    }

    setHoverIdx(closest);
    if (closest >= 0) {
      const star = starsRef.current[closest];
      setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, entry: star.entry });
    } else {
      setTooltip(null);
    }
  }, []);

  const handleClick = useCallback(() => {
    if (hoverIdx >= 0) {
      const star = starsRef.current[hoverIdx];
      const el = document.getElementById(`entry-${star.entry.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [hoverIdx]);

  if (entries.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-[#708094] text-lg font-display italic">
          The constellation is waiting for its first light.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[60vh] min-h-[400px]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setHoverIdx(-1); setTooltip(null); }}
        onClick={handleClick}
      />
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 max-w-xs px-3 py-2 rounded-lg bg-[#121826]/95 border border-white/[0.1] backdrop-blur-md text-xs text-[#e6eefc] leading-relaxed shadow-lg"
          style={{ left: Math.min(tooltip.x + 12, 300), top: tooltip.y - 8, transform: 'translateY(-100%)' }}
        >
          {tooltip.entry.content.slice(0, 120)}{tooltip.entry.content.length > 120 ? '...' : ''}
        </div>
      )}
    </div>
  );
}
