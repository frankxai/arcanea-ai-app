/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m } from "framer-motion";

// ---------------------------------------------------------------------------
// FloatingOrbs — Animated ambient orbs with breathing animation.
// Pure CSS — no canvas overhead. Premium atmospheric effect.
// ---------------------------------------------------------------------------

interface OrbConfig {
  color: string;
  size: number;
  x: string;
  y: string;
  delay: number;
  blur: number;
}

interface FloatingOrbsProps {
  preset?: "hero" | "cosmic" | "fire" | "ocean" | "aurora";
  className?: string;
}

const PRESETS: Record<string, OrbConfig[]> = {
  hero: [
    { color: "color-mix(in srgb, var(--arc-brand-atlantean-teal) 8%, transparent)", size: 600, x: "30%", y: "20%", delay: 0, blur: 180 },
    { color: "color-mix(in srgb, var(--arc-brand-cosmic-blue) 6%, transparent)", size: 500, x: "70%", y: "60%", delay: 2, blur: 160 },
    { color: "color-mix(in srgb, var(--arc-brand-atlantean-teal) 4%, transparent)", size: 400, x: "50%", y: "80%", delay: 4, blur: 140 },
    { color: "color-mix(in srgb, var(--arc-brand-arcanean-gold) 3%, transparent)", size: 300, x: "15%", y: "70%", delay: 6, blur: 120 },
  ],
  cosmic: [
    { color: "color-mix(in srgb, var(--arc-brand-cosmic-blue) 8%, transparent)", size: 550, x: "25%", y: "25%", delay: 0, blur: 170 },
    { color: "color-mix(in srgb, var(--arc-brand-atlantean-teal) 6%, transparent)", size: 450, x: "65%", y: "55%", delay: 3, blur: 150 },
    { color: "color-mix(in srgb, var(--arc-void) 5%, transparent)", size: 350, x: "80%", y: "20%", delay: 1, blur: 130 },
  ],
  fire: [
    { color: "color-mix(in srgb, var(--arc-fire) 7%, transparent)", size: 500, x: "35%", y: "30%", delay: 0, blur: 160 },
    { color: "color-mix(in srgb, var(--arc-fire) 5%, transparent)", size: 400, x: "60%", y: "65%", delay: 2, blur: 140 },
    { color: "color-mix(in srgb, var(--arc-brand-arcanean-gold) 4%, transparent)", size: 350, x: "20%", y: "60%", delay: 4, blur: 130 },
  ],
  ocean: [
    { color: "color-mix(in srgb, var(--arc-water) 8%, transparent)", size: 550, x: "30%", y: "25%", delay: 0, blur: 170 },
    { color: "color-mix(in srgb, var(--arc-brand-atlantean-teal) 6%, transparent)", size: 450, x: "70%", y: "50%", delay: 2, blur: 150 },
    { color: "color-mix(in srgb, var(--arc-brand-atlantean-teal) 4%, transparent)", size: 350, x: "45%", y: "75%", delay: 4, blur: 130 },
  ],
  aurora: [
    { color: "color-mix(in srgb, var(--arc-brand-atlantean-teal) 6%, transparent)", size: 600, x: "50%", y: "10%", delay: 0, blur: 200 },
    { color: "color-mix(in srgb, var(--arc-brand-atlantean-teal) 5%, transparent)", size: 500, x: "30%", y: "40%", delay: 2, blur: 180 },
    { color: "color-mix(in srgb, var(--arc-brand-cosmic-blue) 4%, transparent)", size: 400, x: "70%", y: "60%", delay: 4, blur: 160 },
    { color: "color-mix(in srgb, var(--arc-void) 3%, transparent)", size: 350, x: "20%", y: "80%", delay: 6, blur: 140 },
  ],
};

export function FloatingOrbs({
  preset = "hero",
  className = "",
}: FloatingOrbsProps) {
  const orbs = PRESETS[preset] || PRESETS.hero;

  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden
    >
      {orbs.map((orb, i) => (
        <m.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            transform: "translate(-50%, -50%)",
            background: orb.color,
            filter: `blur(${orb.blur}px)`,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 8,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// GridTexture — Subtle dot or line grid overlay
// ---------------------------------------------------------------------------

interface GridTextureProps {
  variant?: "dots" | "lines" | "crosshatch";
  opacity?: number;
  className?: string;
}

export function GridTexture({
  variant = "dots",
  opacity = 0.025,
  className = "",
}: GridTextureProps) {
  const styles: Record<string, React.CSSProperties> = {
    dots: {
      backgroundImage:
        "radial-gradient(circle, color-mix(in srgb, var(--arc-text-primary) 50%, transparent) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
    },
    lines: {
      backgroundImage:
        "linear-gradient(color-mix(in srgb, var(--arc-text-primary) 30%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--arc-text-primary) 30%, transparent) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
    },
    crosshatch: {
      backgroundImage:
        "linear-gradient(45deg, color-mix(in srgb, var(--arc-text-primary) 15%, transparent) 1px, transparent 1px), linear-gradient(-45deg, color-mix(in srgb, var(--arc-text-primary) 15%, transparent) 1px, transparent 1px)",
      backgroundSize: "24px 24px",
    },
  };

  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
      aria-hidden
      style={{ ...styles[variant], opacity }}
    />
  );
}

// ---------------------------------------------------------------------------
// AuroraGradient — Animated aurora borealis background effect
// ---------------------------------------------------------------------------

export function AuroraGradient({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-20 overflow-hidden ${className}`}
      aria-hidden
    >
      <m.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--arc-brand-atlantean-teal) 8%, transparent) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 50% at 40% 0%, color-mix(in srgb, var(--arc-brand-atlantean-teal) 6%, transparent) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 50% at 60% 0%, color-mix(in srgb, var(--arc-brand-cosmic-blue) 7%, transparent) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--arc-void) 5%, transparent) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--arc-brand-atlantean-teal) 8%, transparent) 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[var(--arc-cosmic-void)] to-transparent" />
    </div>
  );
}
