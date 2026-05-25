/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// SectionShell — Premium section wrapper with ambient orbs, grid texture,
// and staggered reveal animation. The foundation for every revamped section.
// ---------------------------------------------------------------------------

interface SectionShellProps {
  children: ReactNode;
  className?: string;
  /** Ambient orb color preset */
  ambient?: "teal" | "purple" | "gold" | "fire" | "none";
  /** Show subtle dot grid texture */
  grid?: boolean;
  /** ID for anchor links */
  id?: string;
  /** Extra padding variant */
  size?: "default" | "hero" | "compact";
}

const AMBIENT_CONFIGS = {
  teal: [
    "bg-[var(--arc-brand-atlantean-teal)]/[0.06] left-[15%] top-[20%] w-[500px] h-[500px] blur-[160px]",
    "bg-[var(--arc-brand-cosmic-blue)]/[0.04] right-[10%] bottom-[15%] w-[400px] h-[400px] blur-[140px]",
  ],
  purple: [
    "bg-[var(--arc-void)]/[0.06] left-[20%] top-[15%] w-[450px] h-[450px] blur-[150px]",
    "bg-[var(--arc-brand-cosmic-blue)]/[0.04] right-[15%] bottom-[20%] w-[350px] h-[350px] blur-[130px]",
  ],
  gold: [
    "bg-[var(--arc-brand-arcanean-gold)]/[0.05] left-[25%] top-[20%] w-[400px] h-[400px] blur-[140px]",
    "bg-[var(--arc-brand-atlantean-teal)]/[0.03] right-[20%] bottom-[10%] w-[350px] h-[350px] blur-[120px]",
  ],
  fire: [
    "bg-[var(--arc-fire)]/[0.05] left-[15%] top-[25%] w-[450px] h-[450px] blur-[150px]",
    "bg-[var(--arc-fire)]/[0.03] right-[10%] bottom-[15%] w-[350px] h-[350px] blur-[130px]",
  ],
  none: [],
};

const SIZE_CLASSES = {
  default: "py-24 md:py-32 lg:py-40",
  hero: "min-h-[85vh] flex items-center py-20",
  compact: "py-16 md:py-24",
};

export function SectionShell({
  children,
  className = "",
  ambient = "teal",
  grid = true,
  id,
  size = "default",
}: SectionShellProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id={id}
      className={`relative overflow-hidden ${SIZE_CLASSES[size]} ${className}`}
    >
      {/* Ambient orbs */}
      {AMBIENT_CONFIGS[ambient].map((cls, i) => (
        <div
          key={i}
          className={`pointer-events-none absolute rounded-full -z-10 ${cls}`}
          aria-hidden
        />
      ))}

      {/* Dot grid texture */}
      {grid && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      )}

      {/* Content with stagger reveal */}
      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        {children}
      </m.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SectionHeader — Standardized section heading with label, title, subtitle
// ---------------------------------------------------------------------------

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  /** Gradient color for the title accent */
  accent?: "teal" | "purple" | "gold" | "white";
}

const ACCENT_GRADIENTS = {
  teal: "from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)]",
  purple: "from-[var(--arc-void)] via-[var(--arc-void)] to-[var(--arc-brand-cosmic-blue)]",
  gold: "from-[var(--arc-brand-arcanean-gold)] via-[var(--arc-brand-arcanean-gold)] to-[var(--arc-fire)]",
  white: "from-white via-white/80 to-white/60",
};

export function SectionHeader({
  label,
  title,
  subtitle,
  align = "center",
  accent = "teal",
}: SectionHeaderProps) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl mb-16 md:mb-20 ${alignCls}`}>
      {label && (
        <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/30 mb-4">
          {label}
        </p>
      )}
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-[-0.03em] leading-[1.08] mb-5">
        <span
          className={`bg-gradient-to-r ${ACCENT_GRADIENTS[accent]} bg-clip-text text-transparent`}
        >
          {title}
        </span>
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-white/40 leading-relaxed max-w-2xl font-body mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
