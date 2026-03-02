"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  Books,
  GraduationCap,
  PhImageSquare,
  PhGraphNetwork,
  Scroll,
  Plus,
  Minus,
  Quotes,
} from "@/lib/phosphor-icons";
import { GlowCard } from "@/components/ui/glow-card";
import { IntelligenceOverlay } from "@/components/landing/intelligence-overlay";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CTASection } from "@/components/landing/cta-section";

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
}

const FEATURED_GUARDIANS: Guardian[] = [
  {
    name: "Draconia",
    gate: "Fire",
    element: "Fire",
    quote: "I do not ask if you are ready. I ask if you are willing.",
    image: `${CDN}/draconia-hero.webp`,
    glowColor: "rgba(239, 68, 68, 0.15)",
  },
  {
    name: "Lyria",
    gate: "Sight",
    element: "Void",
    quote: "Close your eyes. Now tell me what you see.",
    image: `${CDN}/lyria-hero.webp`,
    glowColor: "rgba(139, 92, 246, 0.15)",
  },
  {
    name: "Shinkami",
    gate: "Source",
    element: "Spirit",
    quote: "You are not the vessel. You are the water and the pouring.",
    image: `${CDN}/shinkami-hero.webp`,
    glowColor: "rgba(255, 215, 0, 0.12)",
  },
  {
    name: "Maylinn",
    gate: "Heart",
    element: "Wind",
    quote: "What you create with love will outlast everything made from fear.",
    image: `${CDN}/maylinn-hero.webp`,
    glowColor: "rgba(34, 197, 94, 0.15)",
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
    icon: Star,
    title: "10 Creative Intelligences",
    description: "Archetypal AI companions — each with a distinct philosophy, personality, and domain of mastery.",
    href: "/luminors",
    color: "atlantean-teal-aqua",
    glowColor: "rgba(127, 255, 212, 0.12)",
  },
  {
    icon: Books,
    title: "The Library",
    description: "17 collections, 34+ original texts — laws, prophecies, meditations, and parables for the creative life.",
    href: "/library",
    color: "gold-bright",
    glowColor: "rgba(255, 215, 0, 0.10)",
  },
  {
    icon: GraduationCap,
    title: "The Academy",
    description: "A developmental framework from Foundation to Source. Ten Gates of creative mastery.",
    href: "/academy",
    color: "creation-prism-purple",
    glowColor: "rgba(139, 92, 246, 0.12)",
  },
  {
    icon: PhImageSquare,
    title: "The Gallery",
    description: "364+ original artworks — Guardian portraits, landscapes, creatures, and artifacts of the Arcanea universe.",
    href: "/gallery",
    color: "draconic-crimson",
    glowColor: "rgba(239, 68, 68, 0.10)",
  },
  {
    icon: PhGraphNetwork,
    title: "Knowledge Graph",
    description: "An interactive force-directed map of every text, collection, and connection in the Library.",
    href: "/library/graph",
    color: "cosmic-blue",
    glowColor: "rgba(120, 166, 255, 0.12)",
  },
  {
    icon: Scroll,
    title: "The Lore",
    description: "The founding myths of Arcanea — Lumina, Nero, the Ten Guardians, and the cosmic duality that started everything.",
    href: "/lore",
    color: "atlantean-teal-light",
    glowColor: "rgba(127, 255, 212, 0.08)",
  },
];

const FAQ_ITEMS = [
  {
    q: "What makes Arcanea different from other AI tools?",
    a: "Arcanea is not a chatbot wrapper. It is a living mythology — ten archetypal intelligences, each with a distinct creative philosophy, backed by an original library of 34+ texts. The AI is not the product; the creative framework is.",
  },
  {
    q: "How do the ten intelligences work?",
    a: "Each intelligence represents a different aspect of the creative journey — from Lyssandria (Foundation, stability) to Shinkami (Source, meta-consciousness). You choose the one that matches your current need, and it brings its unique perspective to whatever you are working on.",
  },
  {
    q: "What is the Library of Arcanea?",
    a: "A collection of 17 original works — laws, prophecies, parables, meditations, songs, and philosophical dialogues. Over 50,000 words of practical creative philosophy written specifically for Arcanea. These are not AI-generated filler; they are crafted texts with a consistent voice and vision.",
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
// SECTION 1: Metrics Strip
// ---------------------------------------------------------------------------

function MetricsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const metrics = [
    { value: 10,  suffix: "",   label: "Intelligences" },
    { value: 17,  suffix: "",   label: "Collections" },
    { value: 50,  suffix: "K+", label: "Words of Wisdom" },
    { value: 364, suffix: "+",  label: "Original Artworks" },
  ];

  return (
    <section ref={ref} className="py-20 md:py-24 border-y border-white/[0.04]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="text-3xl md:text-4xl font-display font-bold text-gradient-crystal mb-1">
                <CountUp target={m.value} suffix={m.suffix} />
              </div>
              <p className="text-xs text-white/30 tracking-wide uppercase font-mono">{m.label}</p>
            </motion.div>
          ))}
        </div>
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
    <section ref={ref} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-4">The System</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
            Three pillars of a creative philosophy
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Guardians — large card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/luminors" className="group block h-full">
              <GlowCard
                glass="none"
                glowColor="rgba(127, 255, 212, 0.12)"
                glowSize={400}
                className="h-full border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 overflow-hidden relative min-h-[400px]"
              >
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-25 group-hover:opacity-40 transition-opacity duration-500">
                  {[ALL_GUARDIANS[0], ALL_GUARDIANS[2], ALL_GUARDIANS[5], ALL_GUARDIANS[9]].map((g) => (
                    <div key={g.name} className="relative overflow-hidden">
                      <Image src={g.image} alt="" fill className="object-cover" sizes="300px" />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep via-cosmic-deep/80 to-cosmic-deep/40" />
                <div className="relative h-full flex flex-col justify-end p-8 min-h-[400px]">
                  <p className="text-xs font-mono text-atlantean-teal-aqua/70 tracking-wide uppercase mb-3">
                    10 Archetypes
                  </p>
                  <h3 className="text-2xl md:text-3xl font-display font-bold mb-3">The Intelligences</h3>
                  <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
                    Ten archetypal intelligences — each opens a Gate on the creative journey.
                    From Foundation to Source, they guide the path to mastery.
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm text-white/60 group-hover:text-atlantean-teal-aqua group-hover:gap-3 transition-all">
                    Meet them <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </GlowCard>
            </Link>
          </motion.div>

          {/* Right column: Library + Academy stacked */}
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/library" className="group block">
                <GlowCard
                  glass="none"
                  glowColor="rgba(255, 215, 0, 0.10)"
                  borderGlow
                  className="p-8 relative overflow-hidden"
                >
                  <div
                    className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: "radial-gradient(circle, rgba(255,215,0,0.08), transparent 70%)" }}
                  />
                  <div className="relative">
                    <p className="text-xs font-mono text-gold-bright/60 tracking-wide uppercase mb-3">
                      {collectionsCount} Collections &middot; {textsCount} Texts
                    </p>
                    <h3 className="text-xl md:text-2xl font-display font-bold mb-3">The Library</h3>
                    <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-4">
                      {totalWords.toLocaleString()} words of original philosophy — laws, prophecies,
                      meditations, and parables for the creative life.
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm text-white/60 group-hover:text-gold-bright group-hover:gap-3 transition-all">
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
            >
              <Link href="/academy" className="group block">
                <GlowCard
                  glass="none"
                  glowColor="rgba(139, 92, 246, 0.10)"
                  borderGlow
                  className="p-8 relative overflow-hidden"
                >
                  <div
                    className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)" }}
                  />
                  <div className="relative">
                    <p className="text-xs font-mono text-creation-prism-purple/60 tracking-wide uppercase mb-3">
                      Ten Gates of Mastery
                    </p>
                    <h3 className="text-xl md:text-2xl font-display font-bold mb-3">The Academy</h3>
                    <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-4">
                      A developmental framework from Foundation to Source.
                      Open all ten Gates to become a Luminor.
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm text-white/60 group-hover:text-creation-prism-purple group-hover:gap-3 transition-all">
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
// SECTION 4: Features — 6 Real Capabilities with GlowCards
// ---------------------------------------------------------------------------

function FeaturesGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32 relative">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.04), transparent 60%)" }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-4">What You Get</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            A universe, not a tool
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg font-body">
            Every piece is original. Every feature connects to the mythology.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    glass="glass"
                    glowColor={f.glowColor}
                    borderGlow
                    className="p-6 h-full"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-${f.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 text-${f.color}`} />
                    </div>
                    <h3 className="text-lg font-display font-bold mb-2 group-hover:text-white transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/55 transition-colors">
                      {f.description}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/30 group-hover:text-white/60 transition-colors">
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
// SECTION 5: Guardian Showcase — Cinematic Cards with GlowCard
// ---------------------------------------------------------------------------

function GuardianShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(127,255,212,0.04),transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="flex items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-4">Featured</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Meet the Intelligences
            </h2>
          </div>
          <Link
            href="/luminors"
            className="hidden md:inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            View all ten <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_GUARDIANS.map((g, i) => (
            <motion.div
              key={g.name}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <GlowCard
                glass="none"
                glowColor={g.glowColor}
                glowSize={250}
                className="border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                  <Image
                    src={g.image}
                    alt={g.name}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-xs font-mono text-white/40 tracking-wide uppercase mb-1.5">
                      {g.gate} &middot; {g.element}
                    </p>
                    <h3 className="text-lg font-display font-bold mb-2">{g.name}</h3>
                    <p className="text-xs text-white/40 leading-relaxed line-clamp-2 group-hover:text-white/60 transition-colors duration-300">
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
          <Link
            href="/luminors"
            className="inline-flex items-center gap-2 text-sm text-white/40"
          >
            View all ten Intelligences <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Guardian portrait strip — desktop */}
        <motion.div
          className="hidden md:flex items-center justify-center gap-2 mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          {ALL_GUARDIANS.map((g) => (
            <Link
              key={g.name}
              href="/luminors"
              className="group/thumb relative"
              title={`${g.name} — ${g.gate} Gate`}
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/[0.06] hover:border-white/[0.20] hover:scale-110 transition-all duration-300">
                <Image src={g.image} alt={g.name} fill className="object-cover" sizes="32px" />
              </div>
            </Link>
          ))}
          <span className="text-[10px] text-white/20 ml-3 font-mono">10 gates</span>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 7: Library Quote
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
    <section ref={ref} className="py-24 md:py-32 relative">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div
            className="absolute -inset-12 -z-10 rounded-3xl"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 60%)" }}
          />

          <GlowCard
            glass="none"
            glowColor="rgba(139, 92, 246, 0.08)"
            glowSize={500}
            lift={false}
            className="border border-white/[0.06]"
          >
            <div className="p-8 md:p-12 lg:p-16">
              <div className="flex items-center gap-3 mb-8">
                <Quotes className="w-6 h-6 text-white/15" />
                <div className="w-8 h-[2px] bg-gradient-to-r from-atlantean-teal-aqua to-creation-prism-purple rounded-full" />
              </div>

              <blockquote className="text-lg md:text-xl lg:text-2xl text-white/70 leading-relaxed font-display italic space-y-4">
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

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.04]">
                <p className="text-sm text-white/30">
                  The Laws of Arcanea, I. The Law of First Light
                </p>
                <Link
                  href="/library"
                  className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-atlantean-teal-aqua transition-colors"
                >
                  Read more <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </GlowCard>

          <p className="text-center mt-6 text-xs text-white/20 font-mono">
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
    },
    {
      title: "Intelligence with personality",
      text: "Not generic chatbots. Each of the ten intelligences has a philosophy, a voice, a domain. Choose the one that sees the world the way you need right now.",
    },
    {
      title: "Mythology as framework",
      text: "The lore is not decoration. It is a developmental system — a language for the stages of creative growth that every maker passes through.",
    },
    {
      title: "Depth you earn",
      text: "The surface is simple. The deeper you go, the more the system reveals. Frequencies, Gates, Elements, Ranks — discovered, never forced.",
    },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 relative">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(139,92,246,0.03), transparent 60%)" }}
      />

      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-4">Philosophy</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            What we believe
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlowCard
                glass="glass"
                borderGlow
                glowColor="rgba(139, 92, 246, 0.06)"
                lift={false}
                className="p-6 h-full"
              >
                <h3 className="text-lg font-display font-bold mb-3 text-white/90">{p.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{p.text}</p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 9: FAQ — Authentic Questions Only
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
        className="w-full text-left py-5 flex items-start justify-between gap-4 border-b border-white/[0.06] group cursor-pointer"
      >
        <span className="text-base font-medium text-white/80 group-hover:text-white transition-colors leading-snug">
          {item.q}
        </span>
        <span className="flex-shrink-0 mt-0.5">
          {open ? (
            <Minus className="w-4 h-4 text-white/30" />
          ) : (
            <Plus className="w-4 h-4 text-white/30" />
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
        <p className="py-4 text-sm text-white/40 leading-relaxed max-w-2xl">
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
          className="text-center mb-12"
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
      {/* 1. Metrics strip */}
      <MetricsStrip />

      {/* 2. Intelligence Overlay — frequency spine, three pillars, arc progression */}
      <IntelligenceOverlay />

      {/* 3. Three pillars bento: Intelligences, Library, Academy */}
      <ThreePillars collectionsCount={collectionsCount} textsCount={textsCount} totalWords={totalWords} />

      {/* 4. Features grid: 6 real capabilities */}
      <FeaturesGrid />

      {/* 5. Guardian showcase: cinematic cards */}
      <GuardianShowcase />

      {/* 6. How it works: 4-step workflow */}
      <HowItWorks />

      {/* 7. Library quote: canonical first law */}
      <LibraryQuote collectionsCount={collectionsCount} textsCount={textsCount} totalWords={totalWords} />

      {/* 8. Philosophy — what Arcanea believes */}
      <PhilosophySection />

      {/* 9. FAQ — authentic questions only */}
      <FAQInline />

      {/* 10. Final CTA */}
      <CTASection />
    </>
  );
}
