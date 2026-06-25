/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// FeatureCard — Premium glass card with cursor-tracking glow, hover lift,
// and optional icon/badge. Apple-tier glassmorphism.
// ---------------------------------------------------------------------------

interface FeatureCardProps {
  children: ReactNode;
  className?: string;
  /** Glow color on hover */
  glowColor?: string;
  /** Animation delay for stagger */
  delay?: number;
  /** Make it clickable */
  href?: string;
  /** Compact variant for grid layouts */
  compact?: boolean;
}

export function FeatureCard({
  children,
  className = "",
  glowColor = "var(--arc-brand-atlantean-teal)",
  delay = 0,
  compact = false,
}: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <m.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className={`
        group relative overflow-hidden rounded-2xl
        bg-white/[0.025] border border-white/[0.06]
        backdrop-blur-sm
        hover:border-white/[0.12] hover:bg-white/[0.04]
        transition-colors duration-500
        ${compact ? "p-5" : "p-6 md:p-8"}
        ${className}
      `}
    >
      {/* Cursor-following glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: hovering ? 1 : 0,
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, ${glowColor}15, transparent 40%)`,
        }}
      />

      {/* Inner spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: hovering ? 0.6 : 0,
          background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, ${glowColor}08, transparent 50%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// FeatureIcon — Consistent icon container for feature cards
// ---------------------------------------------------------------------------

interface FeatureIconProps {
  children: ReactNode;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export function FeatureIcon({
  children,
  color = "var(--arc-brand-atlantean-teal)",
  size = "md",
}: FeatureIconProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl ${sizeClasses[size]} mb-4`}
      style={{
        background: `${color}12`,
        border: `1px solid ${color}20`,
        color,
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// StatCard — Animated stat display for metrics sections
// ---------------------------------------------------------------------------

interface StatCardProps {
  value: string;
  label: string;
  color?: string;
  delay?: number;
}

export function StatCard({
  value,
  label,
  color = "var(--arc-brand-atlantean-teal)",
  delay = 0,
}: StatCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <p
        className="text-3xl md:text-4xl font-display font-bold"
        style={{
          background: `linear-gradient(to bottom, ${color}, ${color}80)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {value}
      </p>
      <p className="mt-2 text-xs font-body leading-snug text-white/35">
        {label}
      </p>
    </m.div>
  );
}
