'use client';

import { useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  color?: string;
  size?: number;
}

/**
 * GlowCard — cursor-following border glow, Linear/Vercel-tier.
 * Uses CSS conic-gradient with --x/--y custom properties driven by mouse position.
 * Content stays static — only the border glow moves. Premium without gimmick.
 */
export function GlowCard({
  children,
  className = '',
  color = '#00bcd4',
  size = 400,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [hovering, setHovering] = useState(false);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`group relative overflow-hidden ${className}`}
      style={
        {
          '--glow-x': `${pos.x}px`,
          '--glow-y': `${pos.y}px`,
          '--glow-size': `${size}px`,
          '--glow-color': color,
        } as React.CSSProperties
      }
    >
      {/* Border glow follower — radial gradient at cursor position */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-500"
        style={{
          opacity: hovering ? 1 : 0,
          background: `radial-gradient(var(--glow-size) circle at var(--glow-x) var(--glow-y), ${color}, transparent 40%)`,
        }}
      />
      {/* Inner mask creates the border effect */}
      <div className="relative h-full w-full rounded-[inherit] bg-inherit">
        {/* Subtle spotlight on content */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500"
          style={{
            opacity: hovering ? 0.4 : 0,
            background: `radial-gradient(var(--glow-size) circle at var(--glow-x) var(--glow-y), ${color}10, transparent 50%)`,
          }}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
