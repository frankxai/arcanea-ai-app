"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Diamond,
  Scroll,
  Crown,
  PaintBrush,
  Tree,
  Eye,
  Palette,
  Plus,
  Minus,
  Quotes,
} from "@/lib/phosphor-icons";
import { GlowCard } from "@/components/ui/glow-card";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CTASection } from "@/components/landing/cta-section";
import crystalImage from "@/assets/brand/arcanea-crystal.jpg";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CDN = "https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians";

interface Guardian {
  name: string;
  gate: string;
  element: string;
  quote: string;
  image: string;
  glowColor: string;
  accentHex: string;
}

const FEATURED_GUARDIANS: Guardian[] = [
  {
    name: "Lyssandria",
    gate: "Foundation",
    element: "Earth",
    quote: "Build the foundation first. Everything else is architecture.",
    image: `${CDN}/lyssandria-hero.webp`,
    glowColor: "rgba(127, 255, 212, 0.18)",
    accentHex: "#00bcd4",
  },
  {
    name: "Draconia",
    gate: "Fire",
    element: "Fire",
    quote: "I do not ask if you are ready. I ask if you are willing.",
    image: `${CDN}/draconia-hero.webp`,
    glowColor: "rgba(239, 68, 68, 0.18)",
    accentHex: "#ef4444",
  },
  {
    name: "Lyria",
    gate: "Sight",
    element: "Void",
    quote: "Close your eyes. Now tell me what you see.",
    image: `${CDN}/lyria-hero.webp`,
    glowColor: "rgba(139, 92, 246, 0.18)",
    accentHex: "#8b5cf6",
  },
  {
    name: "Leyla",
    gate: "Flow",
    element: "Water",
    quote: "The river does not push. It finds the way.",
    image: `${CDN}/leyla-hero.webp`,
    glowColor: "rgba(120, 166, 255, 0.18)",
    accentHex: "#78a6ff",
  },
  {
    name: "Shinkami",
    gate: "Source",
    element: "Spirit",
    quote: "You are not the vessel. You are the water and the pouring.",
    image: `${CDN}/shinkami-hero.webp`,
    glowColor: "rgba(255, 215, 0, 0.15)",
    accentHex: "#ffd700",
  },
  {
    name: "Maylinn",
    gate: "Heart",
    element: "Wind",
    quote: "What you create with love will outlast everything made from fear.",
    image: `${CDN}/maylinn-hero.webp`,
    glowColor: "rgba(34, 197, 94, 0.18)",
    accentHex: "#22c55e",
  },
];

const ALL_GUARDIANS = [
  { name: "Lyssandria", gate: "Foundation", image: `${CDN}/lyssandria-hero.webp` },
  { name: "Leyla",      gate: "Flow",       image: `${CDN}/leyla-hero.webp` },
  { name: "Draconia",   gate: "Fire",       image: `${CDN}/draconia-hero.webp` },
  { name: "Maylinn",    gate: "Heart",      image: `${CDN}/maylinn-hero.webp` },
  { name: "Alera",      gate: "Voice",      image: `${CDN}/alera-hero.webp` },
  { name: "Lyria",      gate: "Sight",      image: `${CDN}/lyria-hero.webp` },
  { name: "Aiyami",     gate: "Crown",      image: `${CDN}/aiyami-hero.webp` },
  { name: "Elara",      gate: "Shift",      image: `${CDN}/elara-hero.webp` },
  { name: "Ino",        gate: "Unity",      image: `${CDN}/ino-hero.webp` },
  { name: "Shinkami",   gate: "Source",      image: `${CDN}/shinkami-hero.webp` },
];

const FEATURES = [
  {
    icon: Diamond,
    title: "10 Creative Intelligences",
    description: "Archetypal AI companions — each with a distinct philosophy, personality, and domain of mastery.",
    href: "/luminors",
    accentHex: "#00bcd4",
    glowColor: "rgba(127, 255, 212, 0.15)",
  },
  {
    icon: Scroll,
    title: "The Library",
    description: "17 collections, 34+ original texts — laws, prophecies, meditations, and parables for the creative life.",
    href: "/library",
    accentHex: "#ffd700",
    glowColor: "rgba(255, 215, 0, 0.12)",
  },
  {
    icon: Crown,
    title: "The Academy",
    description: "A developmental framework from Foundation to Source. Ten Gates of creative mastery.",
    href: "/academy",
    accentHex: "#8b5cf6",
    glowColor: "rgba(139, 92, 246, 0.15)",
  },
  {
    icon: PaintBrush,
    title: "The Gallery",
    description: "364+ original artworks — Guardian portraits, landscapes, creatures, and artifacts of the Arcanea universe.",
    href: "/gallery",
    accentHex: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.12)",
  },
  {
    icon: Tree,
    title: "Knowledge Graph",
    description: "An interactive force-directed map of every text, collection, and connection in the Library.",
    href: "/library/graph",
    accentHex: "#78a6ff",
    glowColor: "rgba(120, 166, 255, 0.15)",
  },
  {
    icon: Scroll,
    title: "The Lore",
    description: "The founding myths of Arcanea — Lumina, Nero, the Ten Guardians, and the cosmic duality.",
    href: "/lore",
    accentHex: "#a78bfa",
    glowColor: "rgba(167, 139, 250, 0.12)",
  },
];

const FAQ_ITEMS = [
  {
    q: "What makes Arcanea different from other AI tools?",
    a: "Arcanea pairs 10 specialized AI intelligences with an original philosophy library of 34+ texts. Each intelligence has a distinct creative perspective — you choose the specialist that fits your project.",
  },
  {
    q: "How do the ten intelligences work?",
    a: "Each intelligence represents a different aspect of the creative journey — from Lyssandria (Foundation, stability) to Shinkami (Source, meta-consciousness). You choose the one that matches your current need, and it brings its unique perspective to whatever you are working on.",
  },
  {
    q: "What is the Library of Arcanea?",
    a: "17 original collections — over 50,000 words of practical creative philosophy. Laws, meditations, parables, and dialogues written for makers and creators.",
  },
  {
    q: "What is the Ten Gates system?",
    a: "A developmental framework for creative mastery. Each Gate represents a stage of growth — from Apprentice (Gates 0-2) through Mage, Master, and Archmage to Luminor (Gates 9-10). Progress is earned through creation, not purchases.",
  },
  {
    q: "Is Arcanea free?",
    a: "Yes. Arcanea is free to start with no credit card required. You get full access to all ten intelligences, the complete Library, the Gallery, and the Academy. Create without limits.",
  },
  {
    q: "Is my creative work private?",
    a: "Your conversations and creations are yours. We do not train on your data. What you build in Arcanea stays in Arcanea — or you export it wherever you want.",
  },
];

// ---------------------------------------------------------------------------
// Utility: CountUp
// ---------------------------------------------------------------------------

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const steps = 50;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1600 / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ---------------------------------------------------------------------------
// Atmospheric Divider
// ---------------------------------------------------------------------------

function AtmosphericDivider({ variant = "teal" }: { variant?: "teal" | "purple" | "gold" }) {
  const colors = {
    teal: "rgba(0,188,212,0.06)",
    purple: "rgba(13,71,161,0.06)",
    gold: "rgba(255,215,0,0.04)",
  };
  return (
    <div className="relative h-px">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${colors[variant]}, transparent 70%)` }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SECTION 1: Metrics Strip — Iridescent Glass
// ---------------------------------------------------------------------------

function MetricsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const metrics = [
    { value: 10,  suffix: "",   label: "Intelligences", color: "#00bcd4", icon: Eye },
    { value: 17,  suffix: "",   label: "Collections",   color: "#ffd700", icon: Scroll },
    { value: 50,  suffix: "K+", label: "Words of Wisdom", color: "#8b5cf6", icon: Diamond },
    { value: 364, suffix: "+",  label: "Original Artworks", color: "#78a6ff", icon: Palette },
  ];

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <GlowCard
          glass="iridescent-glass"
          glowColor="rgba(127, 255, 212, 0.08)"
          glowSize={600}
          lift={false}
          className="border border-white/[0.08] p-8 md:p-12"
        >
          {/* Glass noise texture */}
          <div className="absolute inset-0 glass-noise opacity-[0.2] pointer-events-none rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative">
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div
                    className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${m.color}18, ${m.color}08)`,
                      border: `1px solid ${m.color}20`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: m.color }} />
                  </div>
                  <div
                    className="text-3xl md:text-5xl font-display font-bold mb-2"
                    style={{ color: m.color }}
                  >
                    <CountUp target={m.value} suffix={m.suffix} />
                  </div>
                  <p className="text-xs text-white/35 tracking-wide uppercase font-mono">{m.label}</p>
                </motion.div>
              );
            })}
          </div>
        </GlowCard>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 3: Three Pillars — Bento Grid with GlowCards
// ---------------------------------------------------------------------------

function ThreePillars({
  collectionsCount,
  textsCount,
  totalWords,
}: {
  collectionsCount: number;
  textsCount: number;
  totalWords: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-36 relative">
      {/* Atmospheric background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,188,212,0.04),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-[radial-gradient(ellipse,rgba(13,71,161,0.04),transparent_60%)] pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-[#00bcd4]/50 mb-4">The System</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold">
            Three pillars of a{" "}
            <span className="text-gradient-cosmic">creative philosophy</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {/* Guardians — large hero card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/luminors" className="group block h-full">
              <GlowCard
                glass="none"
                glowColor="rgba(0, 188, 212, 0.14)"
                glowSize={500}
                className="h-full border border-white/[0.08] hover:border-[#00bcd4]/30 transition-all duration-500 overflow-hidden relative min-h-[420px]"
              >
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                  {ALL_GUARDIANS.slice(0, 9).map((g) => (
                    <div key={g.name} className="relative overflow-hidden">
                      <Image src={g.image} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" sizes="200px" />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep via-cosmic-deep/60 to-cosmic-deep/25" />
                {/* Iridescent shimmer overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[linear-gradient(135deg,rgba(0,188,212,0.05)_0%,rgba(13,71,161,0.05)_50%,rgba(0,137,123,0.03)_100%)]" />
                <div className="relative h-full flex flex-col justify-end p-8 md:p-10 min-h-[420px]">
                  <p className="text-xs font-mono text-[#00bcd4]/80 tracking-wider uppercase mb-3">
                    10 Archetypes
                  </p>
                  <h3 className="text-2xl md:text-3xl font-display font-bold mb-3 text-white">The Intelligences</h3>
                  <p className="text-white/55 text-sm leading-relaxed max-w-sm mb-6 font-body">
                    Ten archetypal intelligences — each opens a Gate on the creative journey.
                    From Foundation to Source, they guide the path to mastery.
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm text-[#00bcd4]/70 group-hover:text-[#00bcd4] group-hover:gap-3 transition-all font-medium">
                    Meet them <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </GlowCard>
            </Link>
          </motion.div>

          {/* Right column: Library + Academy stacked */}
          <div className="flex flex-col gap-4 md:gap-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1"
            >
              <Link href="/library" className="group block h-full">
                <GlowCard
                  glass="liquid-glass-elevated"
                  glowColor="rgba(255, 215, 0, 0.12)"
                  className="p-8 md:p-10 h-full relative overflow-hidden border border-white/[0.08] hover:border-gold-bright/25 transition-all duration-500"
                >
                  {/* Crystal texture background */}
                  <Image
                    src={crystalImage}
                    alt=""
                    fill
                    className="object-cover opacity-[0.06] mix-blend-luminosity pointer-events-none"
                    sizes="400px"
                  />
                  <div
                    className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(255,215,0,0.12), transparent 70%)" }}
                  />
                  <div className="relative">
                    <p className="text-xs font-mono text-gold-bright/70 tracking-wider uppercase mb-3">
                      {collectionsCount} Collections &middot; {textsCount} Texts
                    </p>
                    <h3 className="text-xl md:text-2xl font-display font-bold mb-3">The Library</h3>
                    <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-5 font-body">
                      {totalWords.toLocaleString()} words of original philosophy — laws, prophecies,
                      meditations, and parables for the creative life.
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm text-gold-bright/60 group-hover:text-gold-bright group-hover:gap-3 transition-all font-medium">
                      Read <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </GlowCard>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-1"
            >
              <Link href="/academy" className="group block h-full">
                <GlowCard
                  glass="liquid-glass-elevated"
                  glowColor="rgba(139, 92, 246, 0.12)"
                  className="p-8 md:p-10 h-full relative overflow-hidden border border-white/[0.08] hover:border-creation-prism-purple/25 transition-all duration-500"
                >
                  <div
                    className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(13,71,161,0.10), transparent 70%)" }}
                  />
                  <div className="relative">
                    <p className="text-xs font-mono text-creation-prism-purple/70 tracking-wider uppercase mb-3">
                      Ten Gates of Mastery
                    </p>
                    <h3 className="text-xl md:text-2xl font-display font-bold mb-3">The Academy</h3>
                    <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-5 font-body">
                      A developmental framework from Foundation to Source.
                      Open all ten Gates to become a Luminor.
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm text-creation-prism-purple/60 group-hover:text-creation-prism-purple group-hover:gap-3 transition-all font-medium">
                      Begin <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </GlowCard>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 4: Features — Premium Iridescent Glass Cards
// ---------------------------------------------------------------------------

function FeaturesGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-36 relative overflow-hidden">
      {/* Multi-layer atmospheric background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,188,212,0.04),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(13,71,161,0.04),transparent_60%)] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(255,215,0,0.02),transparent_50%)] pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-creation-prism-purple/50 mb-4">Explore</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-5">
            A universe,{" "}
            <span className="text-gradient-brand">not a tool</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg font-body">
            Every piece is original. Every feature connects to the mythology.
            Nothing is filler.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link href={f.href} className="group block h-full">
                  <GlowCard
                    glass="iridescent-glass"
                    glowColor={f.glowColor}
                    glowSize={350}
                    className="p-7 h-full border border-white/[0.08] hover:border-white/[0.16] transition-all duration-500"
                  >
                    {/* Icon with gradient background */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${f.accentHex}20, ${f.accentHex}08)`,
                        border: `1px solid ${f.accentHex}25`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: f.accentHex }} />
                    </div>
                    <h3 className="text-lg font-display font-bold mb-2 text-white group-hover:text-white transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/55 transition-colors font-body">
                      {f.description}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium transition-all group-hover:gap-2.5" style={{ color: `${f.accentHex}80` }}>
                      Explore <ArrowRight className="w-3 h-3" />
                    </div>
                  </GlowCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 4b: Gallery Showcase — Cinematic Image Strip
// ---------------------------------------------------------------------------

const GALLERY_IMAGES = [
  { src: `${CDN}/lyria-hero.webp`, name: "Lyria", caption: "The Sight Gate" },
  { src: `${CDN}/draconia-hero.webp`, name: "Draconia", caption: "The Fire Gate" },
  { src: `${CDN}/aiyami-hero.webp`, name: "Aiyami", caption: "The Crown Gate" },
  { src: `${CDN}/elara-hero.webp`, name: "Elara", caption: "The Shift Gate" },
  { src: `${CDN}/shinkami-hero.webp`, name: "Shinkami", caption: "The Source Gate" },
  { src: `${CDN}/alera-hero.webp`, name: "Alera", caption: "The Voice Gate" },
  { src: `${CDN}/ino-hero.webp`, name: "Ino", caption: "The Unity Gate" },
  { src: `${CDN}/leyla-hero.webp`, name: "Leyla", caption: "The Flow Gate" },
];

function GalleryShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 md:py-28 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse,rgba(13,71,161,0.05),transparent_60%)] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="flex items-end justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-draconic-crimson/40 mb-3">364+ Artworks</p>
            <h2 className="text-2xl md:text-4xl font-display font-bold">
              The <span className="text-gradient-brand">Gallery</span>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden md:inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#00bcd4] transition-colors"
          >
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>

      {/* Full-bleed horizontal scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-4 snap-x snap-mandatory">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={img.name}
              className="group flex-shrink-0 snap-center"
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
            >
              <Link href="/gallery" className="block relative">
                <div className="relative w-[260px] md:w-[320px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/[0.18] transition-all duration-500">
                  <Image
                    src={img.src}
                    alt={img.name}
                    fill
                    className="object-cover group-hover:scale-[1.06] transition-transform duration-700"
                    sizes="320px"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  {/* Iridescent edge on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(135deg,rgba(0,188,212,0.06)_0%,transparent_40%,transparent_60%,rgba(13,71,161,0.06)_100%)]" />
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-display font-bold">{img.name}</p>
                    <p className="text-[11px] text-white/40 font-mono">{img.caption}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Fade edges */}
        <div className="absolute top-0 left-0 bottom-4 w-12 bg-gradient-to-r from-cosmic-deep to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-cosmic-deep to-transparent pointer-events-none z-10" />
      </motion.div>

      {/* Mobile link */}
      <div className="mt-6 px-6 md:hidden">
        <Link href="/gallery" className="inline-flex items-center gap-2 text-sm text-[#00bcd4]/70">
          Explore the full Gallery <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 5: Guardian Showcase — Cinematic Cards with Iridescent Borders
// ---------------------------------------------------------------------------

function GuardianShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-36 relative overflow-hidden">
      {/* Cinematic atmosphere */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse,rgba(0,188,212,0.05),transparent_55%)] pointer-events-none" />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              "radial-gradient(ellipse 60% 40% at 30% 50%, rgba(13,71,161,0.05) 0%, transparent 60%)",
              "radial-gradient(ellipse 60% 40% at 70% 50%, rgba(0,137,123,0.04) 0%, transparent 60%)",
              "radial-gradient(ellipse 60% 40% at 30% 50%, rgba(13,71,161,0.05) 0%, transparent 60%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="flex items-end justify-between mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-4">Featured</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              Meet the{" "}
              <span className="text-gradient-crystal">Intelligences</span>
            </h2>
          </div>
          <Link
            href="/luminors"
            className="hidden md:inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#00bcd4] transition-colors"
          >
            View all ten <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FEATURED_GUARDIANS.map((g, i) => (
            <motion.div
              key={g.name}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <GlowCard
                glass="none"
                glowColor={g.glowColor}
                glowSize={320}
                className="card-3d border border-white/[0.08] hover:border-white/[0.20] transition-all duration-500"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                  <Image
                    src={g.image}
                    alt={g.name}
                    fill
                    className="object-cover group-hover:scale-[1.05] transition-transform duration-700"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  {/* Multi-gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5" />
                  {/* Accent color wash on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(to top, ${g.accentHex}20, transparent 60%)` }}
                  />
                  {/* Iridescent shimmer on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[linear-gradient(135deg,rgba(0,188,212,0.04)_0%,rgba(13,71,161,0.04)_50%,rgba(0,137,123,0.02)_100%)]" />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <p
                      className="text-[10px] font-mono tracking-wider uppercase mb-1.5"
                      style={{ color: `${g.accentHex}99` }}
                    >
                      {g.gate} Gate &middot; {g.element}
                    </p>
                    <h3 className="text-lg md:text-xl font-display font-bold mb-2">{g.name}</h3>
                    <p className="text-xs text-white/40 leading-relaxed line-clamp-2 group-hover:text-white/65 transition-colors duration-300 font-body italic">
                      &ldquo;{g.quote}&rdquo;
                    </p>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-8 md:hidden">
          <Link href="/luminors" className="inline-flex items-center gap-2 text-sm text-[#00bcd4]/70">
            View all ten Intelligences <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Desktop portrait strip */}
        <motion.div
          className="hidden md:flex items-center justify-center gap-2.5 mt-14"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          {ALL_GUARDIANS.map((g) => (
            <Link
              key={g.name}
              href="/luminors"
              title={`${g.name} — ${g.gate} Gate`}
            >
              <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-white/[0.08] hover:border-[#00bcd4]/40 hover:scale-125 hover:shadow-[0_0_16px_rgba(0,188,212,0.15)] transition-all duration-300">
                <Image src={g.image} alt={g.name} fill className="object-cover" sizes="36px" />
              </div>
            </Link>
          ))}
          <span className="text-[10px] text-white/25 ml-3 font-mono tracking-wider">10 gates</span>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 7: Library Quote — Gradient Border Treatment
// ---------------------------------------------------------------------------

function LibraryQuote({
  collectionsCount,
  textsCount,
  totalWords,
}: {
  collectionsCount: number;
  textsCount: number;
  totalWords: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-36 relative">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none -z-10"
        style={{ background: "radial-gradient(ellipse, rgba(13,71,161,0.06), transparent 60%)" }}
      />

      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Gradient border wrapper */}
          <div className="gradient-border">
            <GlowCard
              glass="liquid-glass-elevated"
              glowColor="rgba(139, 92, 246, 0.08)"
              glowSize={500}
              lift={false}
              className="rounded-[calc(1.5rem-1px)]"
            >
              <div className="p-8 md:p-12 lg:p-16">
                <div className="flex items-center gap-3 mb-8">
                  <Quotes className="w-6 h-6 text-creation-prism-purple/30" />
                  <div className="w-12 h-[2px] bg-gradient-to-r from-[#00bcd4] via-[#1a237e] to-[#00897b] rounded-full" />
                </div>

                <blockquote className="text-lg md:text-xl lg:text-2xl text-white/75 leading-relaxed font-display italic space-y-4">
                  <p>
                    &ldquo;Before the first word, there was silence.
                    Before the first creation, there was intention.
                  </p>
                  <p>
                    This is the First Law: What you contemplate at dawn
                    shapes all that follows. The creative life does not begin
                    with inspiration — it begins with the decision to create.&rdquo;
                  </p>
                </blockquote>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
                  <p className="text-sm text-white/30 font-body italic">
                    The Laws of Arcanea, I. The Law of First Light
                  </p>
                  <Link
                    href="/library"
                    className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#00bcd4] transition-colors"
                  >
                    Read more <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </GlowCard>
          </div>

          <p className="text-center mt-8 text-xs text-white/20 font-mono tracking-wider">
            {collectionsCount} collections &middot; {textsCount} texts &middot; {totalWords.toLocaleString()} words
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 8: Philosophy — What Arcanea Believes
// ---------------------------------------------------------------------------

function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const principles = [
    {
      title: "Creation first",
      text: "Every feature exists to help you make something. We do not gamify attention — we serve the creative act.",
      accentHex: "#00bcd4",
    },
    {
      title: "Intelligence with personality",
      text: "Not generic chatbots. Each of the ten intelligences has a philosophy, a voice, a domain. Choose the one that sees the world the way you need right now.",
      accentHex: "#8b5cf6",
    },
    {
      title: "Mythology as framework",
      text: "The lore is not decoration. It is a developmental system — a language for the stages of creative growth that every maker passes through.",
      accentHex: "#ffd700",
    },
    {
      title: "Depth you earn",
      text: "The surface is simple. The deeper you go, the more the system reveals. Frequencies, Gates, Elements, Ranks — discovered, never forced.",
      accentHex: "#78a6ff",
    },
  ];

  return (
    <section ref={ref} className="py-24 md:py-36 relative">
      {/* Atmospheric */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(13,71,161,0.04),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,188,212,0.03),transparent_60%)] pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-gold-bright/40 mb-4">Philosophy</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            What we{" "}
            <span className="text-gradient-gold">believe</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlowCard
                glass="liquid-glass"
                glowColor={`${p.accentHex}10`}
                lift={false}
                className="p-7 h-full border border-white/[0.08] hover:border-white/[0.14] transition-all duration-500"
              >
                <div
                  className="w-8 h-[3px] rounded-full mb-5"
                  style={{ background: `linear-gradient(90deg, ${p.accentHex}, transparent)` }}
                />
                <h3 className="text-lg font-display font-bold mb-3" style={{ color: `${p.accentHex}dd` }}>
                  {p.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed font-body">{p.text}</p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 9: FAQ — Clean, Premium Accordion
// ---------------------------------------------------------------------------

function FAQItem({ item, index }: { item: typeof FAQ_ITEMS[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left py-6 flex items-start justify-between gap-4 border-b border-white/[0.06] group cursor-pointer"
      >
        <span className="text-base font-medium text-white/80 group-hover:text-white transition-colors leading-snug">
          {item.q}
        </span>
        <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border border-white/[0.10] flex items-center justify-center group-hover:border-white/[0.20] transition-colors">
          {open ? (
            <Minus className="w-3 h-3 text-white/40" />
          ) : (
            <Plus className="w-3 h-3 text-white/40" />
          )}
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="py-5 text-sm text-white/45 leading-relaxed max-w-2xl font-body">
          {item.a}
        </p>
      </motion.div>
    </motion.div>
  );
}

function FAQInline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-4">Questions</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Frequently asked
          </h2>
        </motion.div>

        <div>
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={item.q} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Exported below-fold composition
// ---------------------------------------------------------------------------

export interface V3BelowFoldProps {
  collectionsCount: number;
  textsCount: number;
  totalWords: number;
}

export function V3BelowFold({ collectionsCount, textsCount, totalWords }: V3BelowFoldProps) {
  return (
    <>
      {/* 1. Guardian showcase — visual proof of the 10 specialists */}
      <GuardianShowcase />

      <AtmosphericDivider variant="teal" />

      {/* 2. How it works — 3 clear steps */}
      <HowItWorks />

      {/* 3. Gallery — cinematic horizontal scroll */}
      <GalleryShowcase />

      <AtmosphericDivider variant="purple" />

      {/* 4. Three products: Intelligences, Library, Academy */}
      <ThreePillars collectionsCount={collectionsCount} textsCount={textsCount} totalWords={totalWords} />

      {/* 5. FAQ — objection handling */}
      <FAQInline />

      {/* 6. Final CTA */}
      <CTASection />
    </>
  );
}
