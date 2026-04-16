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
    { color: "rgba(0,188,212,0.08)", size: 600, x: "30%", y: "20%", delay: 0, blur: 180 },
    { color: "rgba(13,71,161,0.06)", size: 500, x: "70%", y: "60%", delay: 2, blur: 160 },
    { color: "rgba(127,255,212,0.04)", size: 400, x: "50%", y: "80%", delay: 4, blur: 140 },
    { color: "rgba(255,215,0,0.03)", size: 300, x: "15%", y: "70%", delay: 6, blur: 120 },
  ],
  cosmic: [
    { color: "rgba(124,58,237,0.08)", size: 550, x: "25%", y: "25%", delay: 0, blur: 170 },
    { color: "rgba(0,188,212,0.06)", size: 450, x: "65%", y: "55%", delay: 3, blur: 150 },
    { color: "rgba(192,132,252,0.05)", size: 350, x: "80%", y: "20%", delay: 1, blur: 130 },
  ],
  fire: [
    { color: "rgba(239,68,68,0.07)", size: 500, x: "35%", y: "30%", delay: 0, blur: 160 },
    { color: "rgba(249,115,22,0.05)", size: 400, x: "60%", y: "65%", delay: 2, blur: 140 },
    { color: "rgba(255,215,0,0.04)", size: 350, x: "20%", y: "60%", delay: 4, blur: 130 },
  ],
  ocean: [
    { color: "rgba(59,130,246,0.08)", size: 550, x: "30%", y: "25%", delay: 0, blur: 170 },
    { color: "rgba(0,188,212,0.06)", size: 450, x: "70%", y: "50%", delay: 2, blur: 150 },
    { color: "rgba(6,182,212,0.04)", size: 350, x: "45%", y: "75%", delay: 4, blur: 130 },
  ],
  aurora: [
    { color: "rgba(127,255,212,0.06)", size: 600, x: "50%", y: "10%", delay: 0, blur: 200 },
    { color: "rgba(0,188,212,0.05)", size: 500, x: "30%", y: "40%", delay: 2, blur: 180 },
    { color: "rgba(13,71,161,0.04)", size: 400, x: "70%", y: "60%", delay: 4, blur: 160 },
    { color: "rgba(124,58,237,0.03)", size: 350, x: "20%", y: "80%", delay: 6, blur: 140 },
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
        "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
    },
    lines: {
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
    },
    crosshatch: {
      backgroundImage:
        "linear-gradient(45deg, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(-45deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
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
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,188,212,0.08) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 50% at 40% 0%, rgba(127,255,212,0.06) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 50% at 60% 0%, rgba(13,71,161,0.07) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.05) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,188,212,0.08) 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#09090b] to-transparent" />
    </div>
  );
}
