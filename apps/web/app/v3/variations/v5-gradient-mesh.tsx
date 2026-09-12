/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import {
  Fire,
  Drop,
  Leaf,
  Wind,
  Spiral,
  ChatCircle,
  BookOpen,
  Code,
  ArrowRight,
} from "@phosphor-icons/react";

/* ------------------------------------------------------------------ */
/*  CSS Keyframes — injected once via <style> tag                      */
/* ------------------------------------------------------------------ */
const KEYFRAMES = `
@keyframes blob1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(12vw, -8vh) scale(1.15); }
  50% { transform: translate(-6vw, 14vh) scale(0.9); }
  75% { transform: translate(8vw, 6vh) scale(1.05); }
}
@keyframes blob2 {
  0%, 100% { transform: translate(0, 0) scale(1.1); }
  33% { transform: translate(-14vw, 10vh) scale(0.95); }
  66% { transform: translate(10vw, -12vh) scale(1.2); }
}
@keyframes blob3 {
  0%, 100% { transform: translate(0, 0) scale(0.95); }
  20% { transform: translate(6vw, 16vh) scale(1.1); }
  60% { transform: translate(-10vw, -6vh) scale(1); }
  80% { transform: translate(14vw, 4vh) scale(0.9); }
}
@keyframes blob4 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  40% { transform: translate(-8vw, -14vh) scale(1.15); }
  70% { transform: translate(12vw, 8vh) scale(0.85); }
}
@keyframes blob5 {
  0%, 100% { transform: translate(0, 0) scale(1.05); }
  30% { transform: translate(10vw, 10vh) scale(0.9); }
  60% { transform: translate(-12vw, -4vh) scale(1.15); }
}
@keyframes float-badge {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes pulse-fire { 0%, 100% { box-shadow: 0 0 12px var(--arc-fire); } 50% { box-shadow: 0 0 28px var(--arc-fire), 0 0 48px var(--arc-fire)66; } }
@keyframes ripple-water { 0%, 100% { box-shadow: 0 0 0 0 var(--arc-brand-cosmic-blue)80; } 50% { box-shadow: 0 0 0 10px var(--arc-brand-cosmic-blue)00; } }
@keyframes breathe-earth { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
@keyframes float-wind { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes phase-void { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
`;

/* ------------------------------------------------------------------ */
/*  Gradient Blob                                                      */
/* ------------------------------------------------------------------ */
interface BlobProps {
  color: string;
  size: string;
  top: string;
  left: string;
  animation: string;
  duration: string;
}

function Blob({ color, size, top, left, animation, duration }: BlobProps) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: size,
        height: size,
        top,
        left,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(100px)",
        mixBlendMode: "screen",
        opacity: 0.7,
        animation: `${animation} ${duration} ease-in-out infinite`,
        willChange: "transform",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Gradient Mesh Background (reusable)                                */
/* ------------------------------------------------------------------ */
const HERO_BLOBS: BlobProps[] = [
  {
    color: "var(--arc-void)",
    size: "55vw",
    top: "-10%",
    left: "-15%",
    animation: "blob1",
    duration: "20s",
  },
  {
    color: "var(--arc-brand-atlantean-teal)",
    size: "45vw",
    top: "20%",
    left: "50%",
    animation: "blob2",
    duration: "24s",
  },
  {
    color: "var(--arc-fire)",
    size: "50vw",
    top: "50%",
    left: "10%",
    animation: "blob3",
    duration: "22s",
  },
  {
    color: "var(--arc-wind)",
    size: "40vw",
    top: "-5%",
    left: "60%",
    animation: "blob4",
    duration: "26s",
  },
  {
    color: "var(--arc-void)80",
    size: "35vw",
    top: "60%",
    left: "55%",
    animation: "blob5",
    duration: "18s",
  },
];

function MeshBackground({
  blobs,
  overlay = "rgba(0,0,0,0.4)",
}: {
  blobs: BlobProps[];
  overlay?: string;
}) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <Blob key={i} {...b} />
      ))}
      <div className="absolute inset-0" style={{ background: overlay }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pillar Card                                                        */
/* ------------------------------------------------------------------ */
interface PillarCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  blobs: BlobProps[];
}

function PillarCard({ title, description, icon, blobs }: PillarCardProps) {
  return (
    <div
      className="relative flex-1 overflow-hidden rounded-3xl border border-white/10"
      style={{ aspectRatio: "1 / 1.5", minHeight: 360 }}
    >
      <MeshBackground blobs={blobs} overlay="rgba(0,0,0,0.55)" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
          {icon}
        </div>
        <h3
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl font-bold text-white"
        >
          {title}
        </h3>
        <p
          className="text-base leading-relaxed text-white/70"
          style={{ fontFamily: "Geist, sans-serif" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Element Circle                                                     */
/* ------------------------------------------------------------------ */
const ELEMENTS = [
  {
    name: "Fire",
    color: "var(--arc-fire)",
    animation: "pulse-fire 2s ease-in-out infinite",
    icon: Fire,
  },
  {
    name: "Water",
    color: "var(--arc-brand-cosmic-blue)",
    animation: "ripple-water 2.5s ease-in-out infinite",
    icon: Drop,
  },
  {
    name: "Earth",
    color: "var(--arc-wind)",
    animation: "breathe-earth 3s ease-in-out infinite",
    icon: Leaf,
  },
  {
    name: "Wind",
    color: "var(--arc-text-primary)",
    animation: "float-wind 2.8s ease-in-out infinite",
    icon: Wind,
  },
  {
    name: "Void",
    color: "var(--arc-void)",
    animation: "phase-void 3.5s ease-in-out infinite",
    icon: Spiral,
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Stats                                                              */
/* ------------------------------------------------------------------ */
const STATS = [
  { number: "10", label: "Guardians" },
  { number: "62", label: "Library Texts" },
  { number: "26", label: "AI Models" },
  { number: "5", label: "Elements" },
  { number: "1,111", label: "Hz" },
];

/* ------------------------------------------------------------------ */
/*  V5 Gradient Mesh — Main Component                                  */
/* ------------------------------------------------------------------ */
export function V5GradientMesh() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <div
        className="min-h-screen bg-[var(--arc-cosmic-void)] text-white"
        style={{ fontFamily: "Geist, sans-serif" }}
      >
        {/* ========== HERO ========== */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
          <MeshBackground blobs={HERO_BLOBS} />

          {/* Floating badge */}
          <div
            className="relative z-10 mb-8 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm text-white/90 backdrop-blur-md"
            style={{ animation: "float-badge 3s ease-in-out infinite" }}
          >
            Now with 26 AI models via Gateway API{" "}
            <ArrowRight size={14} className="ml-1 inline" weight="bold" />
          </div>

          {/* Brand mark */}
          <p
            className="relative z-10 mb-4 text-xl tracking-[0.25em] text-white/60 uppercase"
            style={{ fontFamily: "var(--font-display)", fontSize: 20 }}
          >
            Arcanea
          </p>

          {/* Headline */}
          <h1
            className="relative z-10 mx-auto max-w-4xl text-center font-bold leading-[1.1] text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 6vw, 72px)",
            }}
          >
            The Universe That Creates With You
          </h1>

          {/* Sub */}
          <p className="relative z-10 mt-6 max-w-xl text-center text-lg text-white/80 md:text-xl">
            AI intelligences. Ancient wisdom. Modern tools.
          </p>

          {/* CTA */}
          <button
            className="relative z-10 mt-10 rounded-2xl border border-white/20 bg-white/10 px-10 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
            style={{ fontFamily: "Geist, sans-serif" }}
          >
            Enter Arcanea
          </button>
        </section>

        {/* ========== THREE PILLARS ========== */}
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-28">
          <div className="flex flex-col gap-6 md:flex-row">
            <PillarCard
              title="Converse"
              description="Chat with 10 archetypal AI intelligences"
              icon={
                <ChatCircle
                  size={28}
                  weight="duotone"
                  className="text-violet-400"
                />
              }
              blobs={[
                {
                  color: "var(--arc-void)",
                  size: "30vw",
                  top: "10%",
                  left: "-20%",
                  animation: "blob1",
                  duration: "18s",
                },
                {
                  color: "var(--arc-void)",
                  size: "25vw",
                  top: "50%",
                  left: "40%",
                  animation: "blob2",
                  duration: "22s",
                },
              ]}
            />
            <PillarCard
              title="Discover"
              description="Explore 57 texts of creation wisdom"
              icon={
                <BookOpen
                  size={28}
                  weight="duotone"
                  className="text-cyan-400"
                />
              }
              blobs={[
                {
                  color: "var(--arc-brand-atlantean-teal)",
                  size: "30vw",
                  top: "5%",
                  left: "30%",
                  animation: "blob3",
                  duration: "20s",
                },
                {
                  color: "var(--arc-brand-atlantean-teal)",
                  size: "20vw",
                  top: "60%",
                  left: "-10%",
                  animation: "blob4",
                  duration: "24s",
                },
              ]}
            />
            <PillarCard
              title="Create"
              description="Build with 26 AI models through one API"
              icon={
                <Code size={28} weight="duotone" className="text-orange-400" />
              }
              blobs={[
                {
                  color: "var(--arc-fire)",
                  size: "28vw",
                  top: "15%",
                  left: "-15%",
                  animation: "blob5",
                  duration: "19s",
                },
                {
                  color: "var(--arc-fire)",
                  size: "22vw",
                  top: "55%",
                  left: "50%",
                  animation: "blob1",
                  duration: "23s",
                },
              ]}
            />
          </div>
        </section>

        {/* ========== STATS BAR ========== */}
        <section className="relative mx-auto max-w-5xl px-6 py-16">
          <div className="flex flex-wrap items-center justify-between gap-8 rounded-3xl border border-white/10 bg-white/5 px-10 py-10 backdrop-blur-xl">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 text-center"
              >
                <span
                  className="text-5xl font-bold text-white"
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.number}
                </span>
                <span
                  className="text-sm tracking-wide text-white/50 uppercase"
                  style={{ fontFamily: "Geist, sans-serif" }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========== QUOTE ========== */}
        <section className="relative overflow-hidden px-6 py-32">
          <MeshBackground
            blobs={[
              {
                color: "var(--arc-void)",
                size: "50vw",
                top: "0%",
                left: "10%",
                animation: "blob2",
                duration: "25s",
              },
              {
                color: "var(--arc-brand-atlantean-teal)",
                size: "40vw",
                top: "30%",
                left: "50%",
                animation: "blob4",
                duration: "20s",
              },
              {
                color: "var(--arc-wind)",
                size: "35vw",
                top: "50%",
                left: "-10%",
                animation: "blob1",
                duration: "28s",
              },
            ]}
            overlay="rgba(0,0,0,0.5)"
          />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <blockquote
              className="text-3xl leading-relaxed text-white/90 italic md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              &ldquo;Enter seeking, leave transformed, return whenever
              needed.&rdquo;
            </blockquote>
            <p
              className="mt-8 text-base tracking-widest text-white/40 uppercase"
              style={{ fontFamily: "Geist, sans-serif" }}
            >
              — The First Law of Arcanea
            </p>
          </div>
        </section>

        {/* ========== ELEMENT SHOWCASE ========== */}
        <section className="relative z-10 mx-auto max-w-3xl px-6 py-24">
          <h2
            className="mb-14 text-center text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Five Elements
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {ELEMENTS.map((el) => {
              const Icon = el.icon;
              return (
                <div key={el.name} className="flex flex-col items-center gap-3">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${el.color}40 0%, ${el.color}10 70%)`,
                      border: `2px solid ${el.color}60`,
                      animation: el.animation,
                    }}
                  >
                    <Icon
                      size={32}
                      weight="duotone"
                      style={{ color: el.color }}
                    />
                  </div>
                  <span
                    className="text-xs tracking-widest text-white/50 uppercase"
                    style={{ fontFamily: "Geist, sans-serif" }}
                  >
                    {el.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========== FINAL CTA ========== */}
        <section className="relative overflow-hidden px-6 py-32">
          <MeshBackground blobs={HERO_BLOBS} overlay="rgba(0,0,0,0.45)" />
          <div className="relative z-10 flex flex-col items-center gap-8 text-center">
            <h2
              className="text-4xl font-bold text-white md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Build Your Universe
            </h2>
            <p className="max-w-md text-lg text-white/70">
              Imagine a Good Future. Build It Here.
            </p>
            <button
              className="rounded-2xl px-12 py-4 text-lg font-semibold text-white transition-all hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
              style={{
                background:
                  "linear-gradient(135deg, var(--arc-void), var(--arc-brand-atlantean-teal), var(--arc-brand-arcanean-gold))",
                border: "2px solid transparent",
                backgroundClip: "padding-box",
              }}
            >
              Enter Arcanea
            </button>
          </div>
        </section>

        {/* ========== FOOTER ========== */}
        <footer className="border-t border-white/5 py-10 text-center text-sm text-white/30">
          <p style={{ fontFamily: "Geist, sans-serif" }}>
            Arcanea &mdash; A Living Intelligence
          </p>
        </footer>
      </div>
    </>
  );
}

export default V5GradientMesh;
