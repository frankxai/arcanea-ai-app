"use client";

import { m, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight } from "@/lib/phosphor-icons";
import { GlowCard } from "@/components/ui/glow-card";

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
    image: "/guardians/v3/lyssandria-hero-v3.webp",
    glowColor: "rgba(0, 188, 212, 0.18)",
    accentHex: "#00bcd4",
  },
  {
    name: "Draconia",
    gate: "Fire",
    element: "Fire",
    quote: "I do not ask if you are ready. I ask if you are willing.",
    image: "/guardians/v3/draconia-hero-v3.webp",
    glowColor: "rgba(239, 68, 68, 0.18)",
    accentHex: "#ef4444",
  },
  {
    name: "Lyria",
    gate: "Sight",
    element: "Void",
    quote: "Close your eyes. Now tell me what you see.",
    image: "/guardians/v3/lyria-hero-v3.webp",
    glowColor: "rgba(168, 85, 247, 0.18)",
    accentHex: "#a855f7",
  },
  {
    name: "Leyla",
    gate: "Flow",
    element: "Water",
    quote: "The river does not push. It finds the way.",
    image: "/guardians/v3/leyla-hero-v3.webp",
    glowColor: "rgba(59, 130, 246, 0.18)",
    accentHex: "#3b82f6",
  },
  {
    name: "Shinkami",
    gate: "Source",
    element: "Spirit",
    quote: "You are not the vessel. You are the water and the pouring.",
    image: "/guardians/v3/shinkami-hero-v3.webp",
    glowColor: "rgba(255, 215, 0, 0.15)",
    accentHex: "#ffd700",
  },
  {
    name: "Maylinn",
    gate: "Heart",
    element: "Air",
    quote: "What you create with love will outlast everything made from fear.",
    image: "/guardians/v3/maylinn-hero-v3.webp",
    glowColor: "rgba(34, 197, 94, 0.18)",
    accentHex: "#22c55e",
  },
];

const ALL_GUARDIANS = [
  {
    name: "Lyssandria",
    gate: "Foundation",
    image: "/guardians/v3/lyssandria-hero-v3.webp",
  },
  { name: "Leyla", gate: "Flow", image: "/guardians/v3/leyla-hero-v3.webp" },
  { name: "Draconia", gate: "Fire", image: "/guardians/v3/draconia-hero-v3.webp" },
  { name: "Maylinn", gate: "Heart", image: "/guardians/v3/maylinn-hero-v3.webp" },
  { name: "Alera", gate: "Voice", image: "/guardians/v3/alera-hero-v3.webp" },
  { name: "Lyria", gate: "Sight", image: "/guardians/v3/lyria-hero-v3.webp" },
  { name: "Aiyami", gate: "Crown", image: "/guardians/v3/aiyami-hero-v3.webp" },
  { name: "Elara", gate: "Starweave", image: "/guardians/v3/elara-hero-v3.webp" },
  { name: "Ino", gate: "Unity", image: "/guardians/v3/ino-hero-v3.webp" },
  { name: "Shinkami", gate: "Source", image: "/guardians/v3/shinkami-hero-v3.webp" },
];

export function GuardianShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-36 relative overflow-hidden">
      {/* Cinematic atmosphere */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse,rgba(0,188,212,0.05),transparent_55%)] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(13,71,161,0.05) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <m.div
          className="flex items-end justify-between mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-4">
              Featured
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              Meet the <span className="text-gradient-crystal">Guardians</span>
            </h2>
          </div>
          <Link
            href="/lore/guardians"
            className="hidden md:inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#00bcd4] transition-colors"
          >
            View all ten <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </m.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FEATURED_GUARDIANS.map((g, i) => (
            <m.div
              key={g.name}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Link href="/lore/guardians" className="block focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/30 rounded-2xl">
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
                    className="object-cover object-[center_40%] group-hover:scale-[1.05] transition-transform duration-700"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  {/* Top gradient to mask infographic labels */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-[1]" />
                  {/* Multi-gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-[1]" />
                  {/* Accent color wash on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(to top, ${g.accentHex}20, transparent 60%)`,
                    }}
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
                    <h3 className="text-lg md:text-xl font-display font-bold mb-2">
                      {g.name}
                    </h3>
                    <p className="text-xs text-white/40 leading-relaxed line-clamp-2 group-hover:text-white/65 transition-colors duration-300 font-body italic">
                      &ldquo;{g.quote}&rdquo;
                    </p>
                  </div>
                </div>
              </GlowCard>
              </Link>
            </m.div>
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-8 md:hidden">
          <Link
            href="/lore/guardians"
            className="inline-flex items-center gap-2 text-sm text-[#00bcd4]/70"
          >
            View all Guardians <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Desktop portrait strip */}
        <m.div
          className="hidden md:flex items-center justify-center gap-2.5 mt-14"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          {ALL_GUARDIANS.map((g) => (
            <Link
              key={g.name}
              href="/lore/guardians"
              title={`${g.name} — ${g.gate} Gate`}
            >
              <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-white/[0.08] hover:border-[#00bcd4]/40 hover:scale-125 hover:shadow-[0_0_16px_rgba(0,188,212,0.15)] transition-all duration-300">
                <Image
                  src={g.image}
                  alt={g.name}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
            </Link>
          ))}
          <span className="text-[10px] text-white/25 ml-3 font-mono tracking-wider">
            10 gates
          </span>
        </m.div>
      </div>
    </section>
  );
}
