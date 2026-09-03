"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { m, EASE, MotionProvider } from "@/lib/motion";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  PhArrowRight,
  PhBooks,
  PhBrain,
  PhCode,
  PhCompass,
  PhGameController,
  PhGlobe,
  PhMagicWand,
  PhShieldStar,
  PhSparkle,
  PhVideoCamera,
  type PhosphorIcon,
} from "@/lib/phosphor-icons";

type Beat = {
  eyebrow: string;
  title: string;
  body: string;
  output: string;
  icon: PhosphorIcon;
  accent: string;
  image: string;
};

const SCROLL_BEATS: Beat[] = [
  {
    eyebrow: "01 MAGIC SEED",
    title: "A single spark awakens a universe.",
    body: "Input a scene, a rule, or an entire physics protocol. Arcanea's creative intelligence engine anchors your vision from the first word.",
    output: "seed.magic",
    icon: PhMagicWand,
    accent: "var(--arc-brand-atlantean-teal)",
    image: "/brand/arcanea-dashboard-hero-premium.png",
  },
  {
    eyebrow: "02 LORE GRAPH",
    title: "Relational magic compiled instantly.",
    body: "Entity maps, character arcs, and world rules compile into an explicit stateful database. Zero drift, infinite continuity.",
    output: "world.graph",
    icon: PhGlobe,
    accent: "var(--arc-brand-arcanean-gold)",
    image: "/brand/arcanea-collectible-reliquary-premium.png",
  },
  {
    eyebrow: "03 MAGIC RULES",
    title: "Active guardians rule the system.",
    body: "Bind your canon rules as runtime constraints. Every agent, story scene, and visual output respects your world's laws.",
    output: "canon.constraints",
    icon: PhShieldStar,
    accent: "var(--arc-fire)",
    image: "/guardians/v4/draconia-hero-v4.webp",
  },
  {
    eyebrow: "04 CINEMATIC CANVASES",
    title: "Anime scale direct to media.",
    body: "Compile epic cinematic trailer briefs, GLSL animation nodes, and musical scores in a single click. Turn raw imagination into high-end media.",
    output: "media.brief",
    icon: PhVideoCamera,
    accent: "var(--arc-wind)",
    image: "/images/books/heart-of-pyrathis-cover-v2.png",
  },
  {
    eyebrow: "05 AGENT COUNCILS",
    title: "Orchestrate agent runtimes instantly.",
    body: "Deploy 16 hot-swappable agent specialists. They share a persistent local SQLite database, coordinating tasks with zero state decay.",
    output: "agent.runtime",
    icon: PhCode,
    accent: "var(--arc-brand-cosmic-blue)",
    image: "/images/forge/space/004-dreadnought-nebula.png",
  },
];

const GUARDIANS = [
  {
    gate: "Fire Gate · active engine",
    name: "Draconia + Draconis",
    body: "High-performance orchestration, raw cinematic force, and multi-format media generation.",
    image: "/guardians/v4/draconia-hero-v4.webp",
    accent: "var(--arc-fire)",
  },
  {
    gate: "Sight Gate · active engine",
    name: "Lyria + Yumiko",
    body: "Spatial pattern reasoning, narrative coherence, semantic routing, and structural verification.",
    image: "/guardians/v4/lyria-hero-v4.webp",
    accent: "var(--arc-void)",
  },
  {
    gate: "Source Gate · active engine",
    name: "Shinkami + Source",
    body: "Meta-cognitive oversight, multi-agent swarm orchestration, and global state harmony.",
    image: "/guardians/v4/shinkami-hero-v4.webp",
    accent: "var(--arc-brand-arcanean-gold)",
  },
];

const OUTPUTS = [
  {
    title: "Living World-Graph",
    body: "Stateful databases compiling maps, characters, and rules with absolute continuity.",
    icon: PhGlobe,
    href: "/worlds",
  },
  {
    title: "Cinematic Renders",
    body: "Compile production briefs, GLSL animation scripts, and AI-video prompts.",
    icon: PhVideoCamera,
    href: "/cinema-studio",
  },
  {
    title: "Interactive Schemas",
    body: "Generate structured game configurations, quest lines, and mechanics as raw code.",
    icon: PhGameController,
    href: "/games",
  },
  {
    title: "Agent Swarms",
    body: "Deploy specialized agent runtimes equipped with local memory and custom tools.",
    icon: PhBrain,
    href: "/mcp",
  },
];

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.62, delay, ease: EASE.smooth }}
      className={className}
    >
      {children}
    </m.div>
  );
}

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [0, 92],
  );
  const mediaScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [1.04, 1.14],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [0, -48],
  );
  const contentOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0]);

  return (
    <section
      id="v1-hero"
      ref={ref}
      className="relative min-h-[92svh] overflow-hidden"
    >
      <m.div
        aria-hidden
        className="absolute inset-0 bg-[var(--arc-cosmic-void)]"
        style={{ y: mediaY, scale: mediaScale }}
      >
        <Image
          src="/brand/arcanea-dashboard-hero-premium.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_42%] opacity-95"
        />
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/brand/arcanea-dashboard-hero-premium.png"
          className="absolute inset-0 hidden h-full w-full object-cover object-[50%_42%] opacity-95 motion-safe:block"
        >
          <source
            src="/brand/arcanea-dashboard-hero-premium.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--arc-cosmic-void)]/22 via-[var(--arc-cosmic-void)]/36 to-[var(--arc-cosmic-void)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--arc-cosmic-void)]/88 via-transparent to-[var(--arc-cosmic-void)]/78" />
      </m.div>

      <m.div
        className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-6 pb-14 pt-28 md:pb-20"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-5xl">
          <FadeIn>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-xs text-white/58 backdrop-blur-md">
              <PhSparkle
                size={14}
                weight="duotone"
                color="var(--arc-brand-atlantean-teal)"
              />
              Sovereign World Engine
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="font-display text-5xl font-semibold leading-[0.96] text-white md:text-7xl lg:text-8xl">
              Arcanea
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/64 md:text-2xl">
              Compile persistent universes with magical intelligence. Scaffold
              living world-graphs, orchestrate cinematic score briefs, and
              deploy agent swarms that share a single memory. Magic engineered
              like code.
            </p>
          </FadeIn>
          <FadeIn delay={0.24}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/worlds/create"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--arc-brand-atlantean-teal)] px-5 py-3 text-sm font-semibold text-[var(--arc-cosmic-void)] transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--arc-brand-atlantean-teal)]/35"
              >
                <PhMagicWand size={18} weight="duotone" />
                Initialize world
              </Link>
              <Link
                href="/agents"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/78 backdrop-blur-md transition-colors hover:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <PhCode
                  size={18}
                  weight="duotone"
                  color="var(--arc-brand-cosmic-blue)"
                />
                Deploy agents
              </Link>
            </div>
          </FadeIn>
        </div>
      </m.div>

      <div className="absolute inset-x-6 bottom-0 z-10 mx-auto max-w-7xl translate-y-1/2">
        <div className="grid overflow-hidden rounded-2xl border border-white/[0.08] bg-[var(--arc-cosmic-void)]/88 backdrop-blur-xl md:grid-cols-4">
          {[
            ["Prompt", "magic seed"],
            ["Graph", "stateful SQLite database"],
            ["Canon", "magic rules engine"],
            ["Runtime", "16 agent specialists"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border-white/[0.06] px-5 py-4 md:border-r md:last:border-r-0"
            >
              <p className="text-xs font-mono uppercase text-white/28">
                {label}
              </p>
              <p className="mt-1 text-sm text-white/72">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScrollRitual() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 88,
    damping: 28,
    mass: 0.7,
  });
  const portalScale = useTransform(
    smooth,
    [0, 0.5, 1],
    reduce ? [1, 1, 1] : [0.96, 1.03, 0.98],
  );
  const portalRotate = useTransform(smooth, [0, 1], reduce ? [0, 0] : [-2, 2]);
  const traceHeight = useTransform(smooth, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(smooth, "change", (latest) => {
    const index = Math.min(
      SCROLL_BEATS.length - 1,
      Math.max(0, Math.floor(latest * SCROLL_BEATS.length)),
    );
    setActive(index);
  });

  const beat = SCROLL_BEATS[active];
  const Icon = beat.icon;

  return (
    <section
      id="v1-scroll-ritual"
      ref={ref}
      className="relative bg-[var(--arc-cosmic-void)] py-20 md:py-24 lg:min-h-[520svh] lg:py-0"
    >
      <div className="flex min-h-screen items-center overflow-hidden lg:sticky lg:top-0 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-mono uppercase text-[var(--arc-brand-atlantean-teal)]/76">
              Magic Compilation
            </p>
            <h2 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-[1.02] text-white md:text-6xl">
              From magic seed to living world.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/52 md:text-lg">
              The system runs like computed magic: your initial prompt compiles
              into a persistent world-graph, and autonomous agent councils run
              the generation.
            </p>

            <div className="mt-10 hidden gap-3 lg:grid">
              {SCROLL_BEATS.map((item, i) => {
                const ItemIcon = item.icon;
                const isActive = i === active;
                return (
                  <div
                    key={item.title}
                    className={`grid grid-cols-[40px_1fr] gap-4 rounded-2xl border p-4 transition-colors duration-300 ${
                      isActive
                        ? "border-white/[0.16] bg-white/[0.07]"
                        : "border-white/[0.06] bg-white/[0.025]"
                    }`}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]"
                      style={{ color: item.accent }}
                    >
                      <ItemIcon size={18} weight="duotone" />
                    </div>
                    <div>
                      <p className="text-xs font-mono uppercase text-white/32">
                        {item.eyebrow}
                      </p>
                      <p className="mt-1 text-base font-semibold text-white/88">
                        {item.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[520px] md:min-h-[600px] lg:min-h-[640px]">
            <div className="absolute left-6 top-6 bottom-6 hidden w-px bg-white/[0.08] md:block">
              <m.div
                className="w-px origin-top bg-[var(--arc-brand-atlantean-teal)]"
                style={{ height: traceHeight }}
              />
            </div>

            <m.div
              className="relative h-[520px] overflow-hidden rounded-[2rem] border border-white/[0.09] bg-white/[0.025] shadow-2xl shadow-black/50 md:h-[600px] lg:h-[640px]"
              style={{ scale: portalScale, rotate: portalRotate }}
            >
              <Image
                key={beat.image}
                src={beat.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 54vw"
                className="object-cover opacity-72"
                priority={active === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--arc-cosmic-void)] via-[var(--arc-cosmic-void)]/56 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--arc-cosmic-void)]/55 via-transparent to-[var(--arc-cosmic-void)]/42" />

              <div className="absolute inset-x-6 bottom-6 md:inset-x-9 md:bottom-9">
                <m.div
                  key={beat.title}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE.smooth }}
                  className="max-w-xl"
                >
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-black/35 px-3 py-1.5 backdrop-blur-md">
                    <Icon size={15} weight="duotone" color={beat.accent} />
                    <span className="text-xs font-mono uppercase text-white/46">
                      {beat.output}
                    </span>
                  </div>
                  <h3 className="font-display text-3xl font-semibold leading-[1.05] text-white md:text-5xl">
                    {beat.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-white/58 md:text-lg">
                    {beat.body}
                  </p>
                </m.div>
              </div>
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GuardianCouncil() {
  return (
    <section
      id="v1-guardians"
      className="relative overflow-hidden bg-[var(--arc-cosmic-void)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-mono uppercase text-[var(--arc-brand-arcanean-gold)]/72">
                Magical Runtimes
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] text-white md:text-6xl">
                Magical intelligence compiled as a runtime.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-white/52 md:text-lg">
              Each module represents a unique creative capacity, each guardian
              acts as an active validation node, and every execution loop
              refines your world-graph.
            </p>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {GUARDIANS.map((item, i) => (
            <FadeIn key={item.name} delay={i * 0.08}>
              <Link
                href="/agents"
                className="group block overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] transition-colors hover:border-white/[0.18]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.02]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover object-top opacity-86 transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--arc-cosmic-void)] via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <p
                    className="text-xs font-mono uppercase"
                    style={{ color: item.accent }}
                  >
                    {item.gate}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">
                    {item.body}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function DragonRiderSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [-52, 52],
  );

  return (
    <section
      id="v1-dragon-rider"
      ref={ref}
      className="relative overflow-hidden bg-[var(--arc-cosmic-void)] py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <FadeIn>
          <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025]">
            <m.div className="absolute inset-[-7%]" style={{ y: imageY }}>
              <Image
                src="/images/books/heart-of-pyrathis-cover-v2.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover object-[50%_38%] opacity-88"
              />
            </m.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--arc-cosmic-void)] via-[var(--arc-cosmic-void)]/34 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/[0.08] bg-black/40 p-5 backdrop-blur-md">
              <p className="text-xs font-mono uppercase text-[var(--arc-fire)]">
                Dragon Rider Proof
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                The magic has to compile.
              </p>
            </div>
          </div>
        </FadeIn>

        <div>
          <FadeIn>
            <p className="text-sm font-mono uppercase text-[var(--arc-fire)]/78">
              Epic Scale · Magical Engineering
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] text-white md:text-6xl">
              World-building at anime scale, direct to runtime.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/54 md:text-lg">
              Arcanea compiles complex media assets—world bibles, character
              schemas, audio-reactive sequences, and developer environments—into
              a single, stateful workspace.
            </p>
          </FadeIn>

          <div className="mt-10 grid gap-4">
            {[
              [
                "Magic Graph",
                "Your relational magic system and world schemas remain the immutable source of truth.",
              ],
              [
                "Cinematic Engine",
                "Direct camera angles, pacing, and visual style via structured code parameters.",
              ],
              [
                "Agent Swarms",
                "Coordinate 16 agent runtimes that share a single, unified SQLite memory state.",
              ],
            ].map(([label, body], i) => (
              <FadeIn key={label} delay={0.1 + i * 0.07}>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="mt-1 text-sm text-white/46">{body}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/cinema-studio"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--arc-fire)]/25 bg-[var(--arc-fire)]/10 px-5 py-3 text-sm font-semibold text-[var(--arc-fire)] transition-colors hover:bg-[var(--arc-fire)]/16"
              >
                <PhVideoCamera size={18} weight="duotone" />
                Launch Cinema Studio
              </Link>
              <Link
                href="/books"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/72 transition-colors hover:bg-white/[0.08]"
              >
                <PhBooks size={18} weight="duotone" />
                Explore creations
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function OutputGrid() {
  return (
    <section
      id="v1-outputs"
      className="bg-[var(--arc-cosmic-void)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <div className="max-w-3xl">
            <p className="text-sm font-mono uppercase text-[var(--arc-brand-atlantean-teal)]/76">
              Creative Intelligence
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] text-white md:text-6xl">
              One world graph. Unlimited media formats.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/52 md:text-lg">
              Compile your central world graph into game schemas,
              publication-ready markdown, cinematic audio scripts, or custom
              agent templates.
            </p>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {OUTPUTS.map((item, i) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={i * 0.06}>
                <Link
                  href={item.href}
                  className="group flex min-h-[260px] flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition-colors hover:border-white/[0.18] hover:bg-white/[0.045]"
                >
                  <Icon
                    size={26}
                    weight="duotone"
                    color="var(--arc-brand-atlantean-teal)"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/48">
                      {item.body}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--arc-brand-atlantean-teal)]">
                      Open
                      <PhArrowRight
                        size={16}
                        weight="bold"
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section
      id="v1-cta"
      className="relative overflow-hidden bg-[var(--arc-cosmic-void)] px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl text-center">
        <FadeIn>
          <p className="text-sm font-mono uppercase text-[var(--arc-brand-arcanean-gold)]/72">
            Compute the Magic
          </p>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.04] text-white md:text-7xl">
            The world is the interface.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/54 md:text-lg">
            Arcanea is an operating system for world architects: cinematic at
            the surface, stateful and compiled underneath.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/worlds/create"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--arc-brand-arcanean-gold)] px-5 py-3 text-sm font-semibold text-[var(--arc-cosmic-void)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <PhSparkle size={18} weight="duotone" />
              Create world
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/78 transition-colors hover:bg-white/[0.09]"
            >
              <PhCompass size={18} weight="duotone" />
              Read the docs
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function V1Landing() {
  return (
    <MotionProvider>
      <div className="overflow-x-clip bg-[var(--arc-cosmic-void)] text-white">
        <HeroSection />
        <ScrollRitual />
        <GuardianCouncil />
        <DragonRiderSection />
        <OutputGrid />
        <FinalCta />
      </div>
    </MotionProvider>
  );
}
