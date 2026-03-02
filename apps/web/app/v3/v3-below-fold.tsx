"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, ArrowUpRight } from "@/lib/phosphor-icons";
import { LogosSection } from "@/components/landing/logos-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { TestimonialsV2 } from "@/components/landing/testimonials-v2";
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
  accent: string;
}

const FEATURED_GUARDIANS: Guardian[] = [
  {
    name: "Draconia",
    gate: "Fire",
    element: "Fire",
    quote: "I do not ask if you are ready. I ask if you are willing.",
    image: `${CDN}/draconia-hero.webp`,
    accent: "from-red-500/20 to-orange-500/10",
  },
  {
    name: "Lyria",
    gate: "Sight",
    element: "Void",
    quote: "Close your eyes. Now tell me what you see.",
    image: `${CDN}/lyria-hero.webp`,
    accent: "from-purple-500/20 to-violet-500/10",
  },
  {
    name: "Shinkami",
    gate: "Source",
    element: "Spirit",
    quote: "You are not the vessel. You are the water and the pouring.",
    image: `${CDN}/shinkami-hero.webp`,
    accent: "from-amber-500/15 to-yellow-500/10",
  },
  {
    name: "Maylinn",
    gate: "Heart",
    element: "Wind",
    quote: "What you create with love will outlast everything made from fear.",
    image: `${CDN}/maylinn-hero.webp`,
    accent: "from-emerald-500/20 to-teal-500/10",
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

// ---------------------------------------------------------------------------
// Utility
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
              <div className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
                <CountUp target={m.value} suffix={m.suffix} />
              </div>
              <p className="text-xs text-white/30 tracking-wide uppercase">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 2: Three Pillars — Bento Grid
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
          {/* Guardians */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link
              href="/lore/guardians"
              className="group block h-full rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 overflow-hidden relative min-h-[400px]"
            >
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-30 group-hover:opacity-40 transition-opacity duration-500">
                {[ALL_GUARDIANS[0], ALL_GUARDIANS[2], ALL_GUARDIANS[5], ALL_GUARDIANS[9]].map((g) => (
                  <div key={g.name} className="relative overflow-hidden">
                    <Image src={g.image} alt="" fill className="object-cover" sizes="300px" />
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep via-cosmic-deep/80 to-cosmic-deep/40" />
              <div className="relative h-full flex flex-col justify-end p-8">
                <p className="text-xs font-mono text-atlantean-teal-aqua/70 tracking-wide uppercase mb-3">
                  10 Archetypes
                </p>
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-3">The Guardians</h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
                  Ten archetypal intelligences — each opens a Gate on the creative journey.
                  From Foundation to Source, they guide the path to mastery.
                </p>
                <span className="inline-flex items-center gap-2 text-sm text-white/60 group-hover:text-atlantean-teal-aqua group-hover:gap-3 transition-all">
                  Meet them <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Right column: Library + Academy stacked */}
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href="/library"
                className="group block rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 p-8 relative overflow-hidden"
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
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                href="/academy"
                className="group block rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 p-8 relative overflow-hidden"
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
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION 5: Guardian Showcase — Cinematic Cards
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
              Meet the Guardians
            </h2>
          </div>
          <Link
            href="/lore/guardians"
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
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500">
                <Image
                  src={g.image}
                  alt={g.name}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-br ${g.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
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
            </motion.div>
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-8 md:hidden">
          <Link
            href="/lore/guardians"
            className="inline-flex items-center gap-2 text-sm text-white/40"
          >
            View all ten Guardians <ArrowRight className="w-4 h-4" />
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
              href="/lore/guardians"
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

          <div className="rounded-2xl border border-white/[0.06] p-8 md:p-12 lg:p-16">
            <div className="w-8 h-[2px] bg-gradient-to-r from-atlantean-teal-aqua to-creation-prism-purple mb-8 rounded-full" />

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

          <p className="text-center mt-6 text-xs text-white/20 font-mono">
            {collectionsCount} collections &middot; {textsCount} texts &middot; {totalWords.toLocaleString()} words
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Exported below-fold composition — 10 sections for depth & SEO
// ---------------------------------------------------------------------------

export interface V3BelowFoldProps {
  collectionsCount: number;
  textsCount: number;
  totalWords: number;
}

export function V3BelowFold({ collectionsCount, textsCount, totalWords }: V3BelowFoldProps) {
  return (
    <>
      {/* 1. Social proof: tech ecosystem */}
      <LogosSection />

      {/* 2. Metrics strip */}
      <MetricsStrip />

      {/* 3. Three pillars bento: Guardians, Library, Academy */}
      <ThreePillars collectionsCount={collectionsCount} textsCount={textsCount} totalWords={totalWords} />

      {/* 4. Features grid: 6 core capabilities */}
      <FeaturesSection />

      {/* 5. Guardian showcase: cinematic cards */}
      <GuardianShowcase />

      {/* 6. How it works: 4-step workflow */}
      <HowItWorks />

      {/* 7. Library quote: canonical first law */}
      <LibraryQuote collectionsCount={collectionsCount} textsCount={textsCount} totalWords={totalWords} />

      {/* 8. Wisdom carousel from the Library */}
      <TestimonialsV2 />

      {/* 9. Pricing tiers */}
      <PricingSection />

      {/* 10. FAQ — excellent for SEO/AEO */}
      <FAQSection />

      {/* 11. Final CTA with Guardian orbit */}
      <CTASection />
    </>
  );
}
