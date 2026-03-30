'use client';

import { useRef, type MouseEvent, type TouchEvent, type ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string; // e.g. 'rgba(0,188,212,0.08)'
  borderGlowColor?: string; // e.g. 'rgba(0,188,212,0.5)'
}

/**
 * A card wrapper that renders a radial gradient glow following the pointer.
 * Uses CSS custom properties --glow-x and --glow-y set by pointer/touch events.
 * All rendering is CSS-only after the initial JS event — no state updates.
 */
export function GlowCard({
  children,
  className = '',
  glowColor = 'rgba(0,188,212,0.08)',
  borderGlowColor = 'rgba(0,188,212,0.4)',
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function applyGlow(clientX: number, clientY: number) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    el.style.setProperty('--glow-x', `${x}px`);
    el.style.setProperty('--glow-y', `${y}px`);
    el.style.setProperty('--glow-opacity', '1');
  }

  function clearGlow() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--glow-opacity', '0');
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    applyGlow(e.clientX, e.clientY);
  }

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    const touch = e.touches[0];
    if (touch) applyGlow(touch.clientX, touch.clientY);
  }

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={
        {
          '--glow-x': '50%',
          '--glow-y': '50%',
          '--glow-opacity': '0',
          '--glow-color': glowColor,
          '--border-glow-color': borderGlowColor,
        } as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={clearGlow}
      onTouchMove={handleTouchMove}
      onTouchEnd={clearGlow}
    >
      {/* Radial glow layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: 'var(--glow-opacity)',
          background: `radial-gradient(600px circle at var(--glow-x) var(--glow-y), var(--glow-color), transparent 40%)`,
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
