"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  PhArrowRight,
  PhSparkle,
  PhBooks,
  PhGraduationCap,
  PhCheck,
  PhTerminal,
  PhMagicWand,
  PhChatCircle,
  PhPalette,
  PhBookOpen,
  PhUsers,
  PhShield,
  PhMusicNote,
  PhImageSquare,
} from "@/lib/phosphor-icons";
import { CTASection, HowItWorks, PricingSection } from "@/components/landing";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface V2ContentProps {
  collectionsCount: number;
  textsCount: number;
  totalWords: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const GUARDIANS = [
  {
    name: "Lyssandria",
    gate: "Foundation",
    freq: "174 Hz",
    element: "Earth",
    quote: "The earth does not hurry. Yet everything is accomplished.",
    image: "/guardians/v3/lyssandria-hero-v3.webp",
  },
  {
    name: "Leyla",
    gate: "Flow",
    freq: "285 Hz",
    element: "Water",
    quote: "The river does not fight the mountain.",
    image: "/guardians/v3/leyla-hero-v3.webp",
  },
  {
    name: "Draconia",
    gate: "Fire",
    freq: "396 Hz",
    element: "Fire",
    quote:
      "I do not ask if you are ready. I ask if you are willing.",
    image: "/guardians/v3/draconia-hero-v3.webp",
  },
  {
    name: "Maylinn",
    gate: "Heart",
    freq: "417 Hz",
    element: "Wind",
    quote:
      "What you create with love will outlast what you create with fear.",
    image: "/guardians/v3/maylinn-hero-v3.webp",
  },
  {
    name: "Alera",
    gate: "Voice",
    freq: "528 Hz",
    element: "Fire",
    quote:
      "Silence is not peace. It is the prison of the unspoken.",
    image: "/guardians/v3/alera-hero-v3.webp",
  },
  {
    name: "Lyria",
    gate: "Sight",
    freq: "639 Hz",
    element: "Void",
    quote: "Close your eyes. Now tell me what you see.",
    image: "/guardians/v3/lyria-hero-v3.webp",
  },
  {
    name: "Aiyami",
    gate: "Crown",
    freq: "741 Hz",
    element: "Void",
    quote:
      "You were never seeking the light. The light was seeking you.",
    image: "/guardians/v3/aiyami-hero-v3.webp",
  },
  {
    name: "Elara",
    gate: "Starweave",
    freq: "852 Hz",
    element: "Wind",
    quote:
      "The only constant is the turning. Embrace the shift.",
    image: "/guardians/v3/elara-hero-v3.webp",
  },
  {
    name: "Ino",
    gate: "Unity",
    freq: "963 Hz",
    element: "Earth",
    quote:
      "Alone you are a note. Together we are a symphony.",
    image: "/guardians/v3/ino-hero-v3.webp",
  },
  {
    name: "Shinkami",
    gate: "Source",
    freq: "1111 Hz",
    element: "Spirit",
    quote:
      "You are not the vessel. You are the water and the pouring.",
    image: "/guardians/v3/shinkami-hero-v3.webp",
  },
];

const ELEMENT_COLORS: Record<string, string> = {
  Earth: "text-amber-400",
  Water: "text-blue-400",
  Fire: "text-orange-400",
  Wind: "text-emerald-400",
  Void: "text-purple-400",
  Spirit: "text-gold-bright",
};

const ELEMENT_BG: Record<string, string> = {
  Earth: "bg-amber-400/15",
  Water: "bg-blue-400/15",
  Fire: "bg-orange-400/15",
  Wind: "bg-emerald-400/15",
  Void: "bg-purple-400/15",
  Spirit: "bg-gold-bright/15",
};

const ELEMENT_BAR_BG: Record<string, string> = {
  Earth: "bg-amber-400",
  Water: "bg-blue-400",
  Fire: "bg-orange-400",
  Wind: "bg-emerald-400",
  Void: "bg-purple-400",
  Spirit: "bg-gold-bright",
};

const TERMINAL_LINES = [
  { text: "$ npx arcanea-code", delay: 0 },
  {
    text: "  ✦ Arcanea Code v4.0 — Creative Intelligence CLI",
    delay: 600,
  },
  { text: "", delay: 1000 },
  { text: "$ arcanea chat --guardian draconia", delay: 1400 },
  {
    text: '  ⟡ Connecting to Draconia (Fire Gate · 396 Hz)...',
    delay: 2000,
  },
  {
    text: '  ⟡ "I do not ask if you are ready. I ask if you are willing."',
    delay: 2600,
  },
  { text: "", delay: 3200 },
  {
    text: '$ starlight memory search "creative flow"',
    delay: 3600,
  },
  { text: "  Found 3 vaults:", delay: 4200 },
  {
    text: "  ⊕ Flow State Protocols (Leyla · 285 Hz)",
    delay: 4600,
  },
  {
    text: "  ⊕ Creative Unblocking (Draconia · 396 Hz)",
    delay: 4900,
  },
  {
    text: "  ⊕ Daily Practice Rituals (Lyssandria · 174 Hz)",
    delay: 5200,
  },
];

const CAPABILITIES_SMALL = [
  {
    icon: PhChatCircle,
    title: "Guardian-Guided Dialogue",
    desc: "Conversations shaped by archetypal wisdom",
  },
  {
    icon: PhPalette,
    title: "Visual Creation",
    desc: "Generate art through elemental aesthetics",
  },
  {
    icon: PhBookOpen,
    title: "Story & World Building",
    desc: "Build mythologies and living lore systems",
  },
  {
    icon: PhMusicNote,
    title: "Music Composition",
    desc: "Compose at the frequencies of the Ten Gates",
  },
  {
    icon: PhGraduationCap,
    title: "The Academy",
    desc: "Progress through Gates, unlock creative capacities",
  },
  {
    icon: PhUsers,
    title: "Multi-Guardian Sessions",
    desc: "Multiple Guardians collaborating on one project",
  },
  {
    icon: PhShield,
    title: "Private & Secure",
    desc: "Your creations and creative process remain yours",
  },
  {
    icon: PhBooks,
    title: "The Library",
    desc: "17 collections of original philosophy",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function useCountUp(end: number, isInView: boolean, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const id = setInterval(() => {
      start += step;
      if (start >= end) {
        setValue(end);
        clearInterval(id);
      } else {
        setValue(start);
      }
    }, 16);
    return () => clearInterval(id);
  }, [end, isInView, duration]);
  return value;
}

// ---------------------------------------------------------------------------
// Loading fallback
// ---------------------------------------------------------------------------
export function V2Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cosmic-deep">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <PhSparkle className="w-8 h-8 text-atlantean-teal-aqua" />
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SECTION 1: Hero
// ---------------------------------------------------------------------------
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [showUser, setShowUser] = useState(false);
  const [showGuardian, setShowGuardian] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const t1 = setTimeout(() => setShowUser(true), 600);
    const t2 = setTimeout(() => setShowGuardian(true), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-deep via-cosmic-void to-cosmic-deep" />
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(0,188,212,0.08) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-atlantean-teal-aqua/20 mb-8">
              <PhSparkle className="w-3.5 h-3.5 text-atlantean-teal-aqua" />
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-atlantean-teal-aqua/90">
                Creative Magic Platform
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display font-bold leading-[1.05] mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Create with{" "}
              <span className="bg-gradient-to-r from-atlantean-teal-aqua via-creation-prism-purple to-gold-bright bg-clip-text text-transparent">
                Magic.
              </span>
            </h1>

            {/* Sub */}
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-lg">
              Ten Guardians of Magic. A Library of original philosophy. An
              Academy of creative mastery. The framework for creators who build
              worlds.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href="/chat"
                className="group relative px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden btn-glow"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-light" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative z-10 text-cosmic-deep flex items-center gap-2">
                  Start Creating Free
                  <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 rounded-2xl border border-white/[0.10] text-white font-semibold text-base hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 flex items-center gap-2"
              >
                Watch Demo
              </Link>
            </div>

            {/* Metrics row */}
            <div className="flex items-center gap-6 text-sm text-text-muted">
              <span>10 Guardians</span>
              <span className="w-1 h-1 rounded-full bg-text-muted/50" />
              <span>50K+ Words</span>
              <span className="w-1 h-1 rounded-full bg-text-muted/50" />
              <span>17 Collections</span>
            </div>
          </motion.div>

          {/* Right — Browser mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="rounded-2xl liquid-glass-elevated border border-white/[0.08] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.03]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-lg bg-white/[0.04] text-xs text-text-muted font-mono">
                    arcanea.ai/chat
                  </div>
                </div>
              </div>

              {/* Chat interface */}
              <div className="p-6 space-y-4 min-h-[320px]">
                {/* User message */}
                {showUser && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] p-4 rounded-2xl bg-atlantean-teal-aqua/10 border border-atlantean-teal-aqua/20">
                      <p className="text-sm text-text-primary">
                        I want to compose music that captures the feeling of
                        discovery
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Guardian response */}
                {showGuardian && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex"
                  >
                    <div className="max-w-[85%] p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-400/15 text-blue-400">
                          Leyla
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.06] text-text-muted">
                          Flow Gate
                        </span>
                        <span className="text-xs font-mono text-text-muted">
                          285 Hz
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        Discovery lives at 285 Hz — the frequency of creative
                        flow. Let&apos;s compose something that starts with
                        uncertainty and resolves into wonder. What instrument
                        speaks discovery to you?
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 2: Social Proof Metrics
// ---------------------------------------------------------------------------
function MetricsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const guardians = useCountUp(10, isInView, 1200);
  const collections = useCountUp(17, isInView, 1400);
  const words = useCountUp(50, isInView, 1600);
  const artworks = useCountUp(364, isInView, 2000);

  const metrics = [
    { value: String(guardians), label: "Guardians of Magic" },
    { value: String(collections), label: "Wisdom Collections" },
    { value: `${words}K+`, label: "Words of Philosophy" },
    { value: `${artworks}+`, label: "Gallery Artworks" },
    { value: "Open Source", label: "MIT Licensed", isText: true },
  ];

  return (
    <section ref={ref} className="py-16 relative">
      <div className="absolute inset-0 -z-10 bg-cosmic-void/60" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="liquid-glass rounded-3xl border border-white/[0.06] p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className={`font-display font-bold mb-2 bg-gradient-to-r from-atlantean-teal-aqua to-creation-prism-purple bg-clip-text text-transparent ${
                    m.isText ? "text-2xl md:text-3xl" : "text-4xl md:text-5xl"
                  }`}
                >
                  {m.value}
                </div>
                <div className="text-sm text-text-muted">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 3: How It Works (wrapper around existing component)
// ---------------------------------------------------------------------------
function HowItWorksWrapper() {
  return <HowItWorks />;
}

// ---------------------------------------------------------------------------
// SECTION 4: Capabilities
// ---------------------------------------------------------------------------
function CapabilitiesSection({
  collectionsCount,
  textsCount,
  totalWords,
}: V2ContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const bigFeatures = [
    {
      icon: PhSparkle,
      title: "Guardian Intelligence",
      desc: "Ten archetypal AI companions, each attuned to a creative frequency from 174 Hz to 1111 Hz. Not generic assistants — Guardians who understand the creative soul.",
    },
    {
      icon: PhBooks,
      title: "The Library of Arcanea",
      desc: `${textsCount} original texts across ${collectionsCount} collections. Laws, prophecies, meditations, and parables for the creative life. ${totalWords.toLocaleString()} words of wisdom.`,
    },
    {
      icon: PhGraduationCap,
      title: "The Academy",
      desc: "Ten Gates of creative mastery. Track your journey from Apprentice (Foundation Gate) to Luminor (Source Gate). A developmental framework, not gamification.",
    },
  ];

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-creation-prism-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-creation-prism-purple/20 mb-6">
            <PhMagicWand className="w-3.5 h-3.5 text-creation-prism-purple" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-creation-prism-purple/90">
              The Magic System
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Everything you need to create with magic
          </h2>
        </motion.div>

        {/* 3 large feature cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {bigFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="group relative rounded-3xl liquid-glass border border-white/[0.06] p-8 hover:border-atlantean-teal-aqua/20 transition-all duration-500 card-3d"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-atlantean-teal-aqua/15 to-creation-prism-purple/15 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-atlantean-teal-aqua" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">
                  {f.title}
                </h3>
                <p className="text-text-secondary leading-relaxed text-sm">
                  {f.desc}
                </p>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-3xl bg-atlantean-teal-aqua/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

        {/* 8-item capability grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAPABILITIES_SMALL.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="rounded-2xl liquid-glass border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all duration-300"
              >
                <Icon className="w-5 h-5 text-atlantean-teal-aqua mb-3" />
                <h4 className="text-sm font-semibold mb-1">{c.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  {c.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 5: Guardian Showcase
// ---------------------------------------------------------------------------
function GuardianShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-rotate
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % GUARDIANS.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  const g = GUARDIANS[active];

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-1/3 left-1/4 w-[700px] h-[700px] bg-atlantean-teal-aqua/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-gold-bright/20 mb-6">
            <PhSparkle className="w-3.5 h-3.5 text-gold-bright" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-gold-bright/90">
              The Arcane Council
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Meet the Guardians
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Ten archetypal intelligences, each attuned to a Gate of creative
            mastery.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-[360px_1fr] gap-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Left — Guardian list */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
            {GUARDIANS.map((guardian, i) => (
              <button
                key={guardian.name}
                onClick={() => setActive(i)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all duration-300 ${
                  active === i
                    ? "bg-atlantean-teal-aqua/10 border border-atlantean-teal-aqua/30 shadow-[0_0_20px_rgba(0,188,212,0.08)]"
                    : "border border-transparent hover:bg-white/[0.04]"
                }`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-white/[0.08]">
                  <img
                    src={guardian.image}
                    alt={guardian.name}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">
                    {guardian.name}
                  </div>
                  <div className="text-xs text-text-muted flex items-center gap-2">
                    <span>{guardian.gate} Gate</span>
                    <span className="w-1 h-1 rounded-full bg-text-muted/50" />
                    <span>{guardian.freq}</span>
                  </div>
                </div>
                <span
                  className={`text-xs font-mono ${
                    ELEMENT_COLORS[guardian.element] || "text-text-muted"
                  }`}
                >
                  {guardian.element}
                </span>
              </button>
            ))}
          </div>

          {/* Right — Featured Guardian */}
          <div className="relative rounded-3xl liquid-glass-elevated border border-white/[0.08] overflow-hidden min-h-[520px]">
            {/* Image */}
            <div className="absolute inset-0">
              <img
                key={g.name}
                src={g.image}
                alt={g.name}
                className="w-full h-full object-cover object-top"
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep via-cosmic-deep/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-cosmic-deep/40 to-transparent" />
            </div>

            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <motion.div
                key={g.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-xs font-mono px-2 py-1 rounded ${
                      ELEMENT_BG[g.element] || "bg-white/10"
                    } ${ELEMENT_COLORS[g.element] || "text-white"}`}
                  >
                    {g.element}
                  </span>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-white/[0.08] text-text-muted">
                    {g.gate} Gate
                  </span>
                  <span className="text-xs font-mono text-text-muted">
                    {g.freq}
                  </span>
                </div>

                <h3 className="text-3xl font-display font-bold mb-3">
                  {g.name}
                </h3>

                <blockquote className="text-text-secondary italic mb-6 text-lg leading-relaxed">
                  &ldquo;{g.quote}&rdquo;
                </blockquote>

                <Link
                  href={`/chat?guardian=${g.name.toLowerCase()}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-atlantean-teal-aqua text-cosmic-deep font-semibold text-sm hover:bg-atlantean-teal-aqua/90 transition-colors"
                >
                  Chat with {g.name}
                  <PhArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 6: CLI Showcase
// ---------------------------------------------------------------------------
function CLIShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    TERMINAL_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), line.delay)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 right-1/3 w-[500px] h-[500px] bg-creation-prism-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-atlantean-teal-aqua/20 mb-8">
              <PhTerminal className="w-3.5 h-3.5 text-atlantean-teal-aqua" />
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-atlantean-teal-aqua/90">
                Developer Tools
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
              The Creative Intelligence CLI
            </h2>

            <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
              Arcanea Code — open-source command-line tools for creators and
              developers. Chat with Guardians, search memory vaults, orchestrate
              multi-agent workflows.
            </p>

            {/* Feature list */}
            <div className="space-y-4 mb-8">
              {[
                "Open Source — MIT licensed, fully extensible",
                "Works with Claude, Gemini, and any AI model",
                "Memory persistence across sessions",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-atlantean-teal-aqua/15 flex items-center justify-center flex-shrink-0">
                    <PhCheck className="w-3 h-3 text-atlantean-teal-aqua" />
                  </div>
                  <span className="text-sm text-text-secondary">{feat}</span>
                </div>
              ))}
            </div>

            <Link
              href="/arcanea-code"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white font-semibold text-sm hover:bg-white/[0.12] transition-all"
            >
              Get Started
              <PhArrowRight className="w-4 h-4" />
            </Link>

            {/* Small badges */}
            <div className="flex items-center gap-3 mt-6">
              {["npm", "GitHub", "MIT"].map((badge) => (
                <span
                  key={badge}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-text-muted"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — Terminal mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-white/[0.06]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="flex-1 text-center text-xs text-text-muted font-mono">
                  Terminal
                </span>
              </div>

              {/* Terminal body */}
              <div
                className="p-5 font-mono text-sm leading-relaxed min-h-[340px]"
                style={{ background: "#0d1117" }}
              >
                {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                  <div
                    key={i}
                    className={`${
                      line.text.startsWith("$")
                        ? "text-green-400"
                        : line.text.startsWith("  Found")
                        ? "text-atlantean-teal-aqua"
                        : "text-text-secondary"
                    } ${line.text === "" ? "h-4" : ""}`}
                  >
                    {line.text}
                  </div>
                ))}
                {/* Blinking cursor */}
                <span className="inline-block w-2 h-4 bg-green-400 animate-pulse mt-1" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 7: Gallery Strip
// ---------------------------------------------------------------------------
function GalleryStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-gold-bright/20 mb-6">
            <PhImageSquare className="w-3.5 h-3.5 text-gold-bright" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-gold-bright/90">
              Gallery
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Created with Arcanea
          </h2>
        </motion.div>
      </div>

      {/* Scrolling strip */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-cosmic-deep to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-cosmic-deep to-transparent z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex gap-4 overflow-x-auto pb-4 px-8 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {GUARDIANS.map((g, i) => (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="group relative flex-shrink-0 w-[200px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.06]"
            >
              <img
                src={g.image}
                alt={g.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <div className="text-sm font-semibold">{g.name}</div>
                  <div
                    className={`text-xs ${
                      ELEMENT_COLORS[g.element] || "text-text-muted"
                    }`}
                  >
                    {g.element}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 mt-8 text-center">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-atlantean-teal-aqua hover:underline text-sm"
        >
          Explore the full gallery
          <PhArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 8: Frequency Visualization
// ---------------------------------------------------------------------------
function FrequencyVisualization() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxFreq = 1111;

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Subtle wave pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 400"
        >
          <path
            d="M0,200 C360,100 720,300 1080,150 C1260,75 1440,200 1440,200 L1440,400 L0,400 Z"
            fill="url(#wave-gradient)"
            opacity="0.3"
          />
          <defs>
            <linearGradient
              id="wave-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgba(0,188,212,0.2)" />
              <stop offset="50%" stopColor="rgba(139,92,246,0.2)" />
              <stop offset="100%" stopColor="rgba(255,215,0,0.2)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            The Ten Gates
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Each Gate resonates at a unique frequency, unlocking a domain of
            creative mastery.
          </p>
        </motion.div>

        <div className="space-y-3">
          {GUARDIANS.map((g, i) => {
            const freq = parseInt(g.freq);
            const widthPercent = (freq / maxFreq) * 100;
            const isHovered = hoveredIdx === i;

            return (
              <motion.div
                key={g.name}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.06 }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Labels */}
                  <div className="w-24 md:w-32 flex-shrink-0 text-right">
                    <span className="text-xs font-mono text-text-muted">
                      {g.gate}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 relative h-8 rounded-full bg-white/[0.03] overflow-hidden">
                    <motion.div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                        ELEMENT_BAR_BG[g.element] || "bg-white/20"
                      } ${isHovered ? "opacity-100" : "opacity-40"}`}
                      initial={{ width: 0 }}
                      animate={
                        isInView ? { width: `${widthPercent}%` } : { width: 0 }
                      }
                      transition={{
                        delay: 0.3 + i * 0.06,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                    />
                    {/* Frequency label inside bar */}
                    <div className="absolute inset-0 flex items-center px-4">
                      <span
                        className={`text-xs font-mono transition-colors duration-300 ${
                          isHovered ? "text-white" : "text-text-muted"
                        }`}
                      >
                        {g.freq}
                      </span>
                    </div>
                  </div>

                  {/* Guardian name */}
                  <div className="w-28 md:w-36 flex-shrink-0">
                    <span
                      className={`text-sm font-semibold transition-colors duration-300 ${
                        isHovered
                          ? ELEMENT_COLORS[g.element] || "text-white"
                          : "text-text-muted"
                      }`}
                    >
                      {g.name}
                    </span>
                  </div>
                </div>

                {/* Hover quote */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 ml-28 md:ml-36 text-sm text-text-secondary italic"
                  >
                    &ldquo;{g.quote}&rdquo;
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 11: Closing Quote
// ---------------------------------------------------------------------------
function ClosingQuote() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="liquid-glass rounded-3xl border border-white/[0.06] p-12 md:p-16 text-center"
        >
          <blockquote className="text-2xl md:text-3xl font-display italic text-text-primary leading-relaxed mb-6">
            &ldquo;Enter seeking, leave transformed, return whenever
            needed.&rdquo;
          </blockquote>
          <div className="text-sm text-text-muted font-mono tracking-wide uppercase">
            The Library of Arcanea
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MAIN EXPORT
// ---------------------------------------------------------------------------
export function V2Content({
  collectionsCount,
  textsCount,
  totalWords,
}: V2ContentProps) {
  return (
    <div className="bg-cosmic-deep text-white min-h-screen">
      <HeroSection />
      <MetricsStrip />
      <HowItWorksWrapper />
      <CapabilitiesSection
        collectionsCount={collectionsCount}
        textsCount={textsCount}
        totalWords={totalWords}
      />
      <GuardianShowcase />
      <CLIShowcase />
      <GalleryStrip />
      <FrequencyVisualization />
      <PricingSection />
      <CTASection />
      <ClosingQuote />
    </div>
  );
}
