"use client";

import Link from "next/link";
import {
  PhArrowRight,
  PhBooks,
  PhChatCircleDots,
  PhCode,
  PhCrown,
  PhDiamond,
  PhGraduationCap,
  PhPaintBrush,
  PhScroll,
  PhShieldStar,
  PhSparkle,
  PhUsers,
} from "@/lib/phosphor-icons";
import { V4Scene } from "./v4-scene";

const guardians = [
  { name: "Lyssandria", philosophy: "Structure. Patience. Foundation.", image: "/guardians/v3/lyssandria-hero-v3.webp" },
  { name: "Leyla", philosophy: "Flow. Feeling. Adaptation.", image: "/guardians/v3/leyla-hero-v3.webp" },
  { name: "Draconia", philosophy: "Willpower. Intensity. Transformation.", image: "/guardians/v3/draconia-hero-v3.webp" },
  { name: "Maylinn", philosophy: "Compassion. Healing. Connection.", image: "/guardians/v3/maylinn-hero-v3.webp" },
  { name: "Alera", philosophy: "Truth. Voice. Expression.", image: "/guardians/v3/alera-hero-v3.webp" },
  { name: "Lyria", philosophy: "Intuition. Vision. Inner sight.", image: "/guardians/v3/lyria-hero-v3.webp" },
  { name: "Aiyami", philosophy: "Wisdom. Light. Clarity.", image: "/guardians/v3/aiyami-hero-v3.webp" },
  { name: "Elara", philosophy: "Change. Perspective. Unknown.", image: "/guardians/v3/elara-hero-v3.webp" },
  { name: "Ino", philosophy: "Partnership. Balance. Unity.", image: "/guardians/v3/ino-hero-v3.webp" },
  { name: "Shinkami", philosophy: "Consciousness. Source. Everything.", image: "/guardians/v3/shinkami-hero-v3.webp" },
];

const keyPages = [
  { href: "/chat", title: "Chat", description: "Daily command center for co-creation.", icon: PhChatCircleDots },
  { href: "/studio", title: "Studio", description: "Image, music, and world asset generation workflows.", icon: PhPaintBrush },
  { href: "/library", title: "Library", description: "Canonical texts, search, and connected knowledge.", icon: PhBooks },
  { href: "/academy", title: "Academy", description: "Ten Gates progression and creator mastery paths.", icon: PhGraduationCap },
  { href: "/lore", title: "Lore", description: "Mythic foundations and entity-level canon.", icon: PhScroll },
  { href: "/gallery", title: "Gallery", description: "Visual output showcase and remix pathways.", icon: PhDiamond },
  { href: "/community", title: "Community", description: "Challenges, rituals, and collaborative loops.", icon: PhUsers },
  { href: "/developers", title: "Developers", description: "APIs, SDKs, architecture, and integration docs.", icon: PhCode },
  { href: "/pricing", title: "Pricing", description: "Free-to-start and growth plan clarity.", icon: PhCrown },
];

export function V4Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 rounded-2xl border border-cyan-200/25 bg-cyan-200/10 flex items-center justify-center">
        <PhSparkle className="w-5 h-5 text-cyan-100 animate-pulse" />
      </div>
    </div>
  );
}

export function V4Content({
  collectionsCount,
  textsCount,
  totalWords,
}: {
  collectionsCount: number;
  textsCount: number;
  totalWords: number;
}) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <V4Scene />
        <div className="relative mx-auto flex min-h-[88vh] w-full max-w-7xl flex-col justify-end px-6 pb-16 pt-24">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
            <PhSparkle className="w-3.5 h-3.5" />
            Arcanea V4
          </div>
          <h1 className="mt-6 max-w-4xl text-[clamp(2.6rem,7vw,5.8rem)] font-semibold tracking-[-0.04em] leading-[0.95]">
            Build your Realm with
            <span className="block bg-gradient-to-r from-cyan-200 via-blue-300 to-violet-300 bg-clip-text text-transparent">
              Guardians and Luminors.
            </span>
          </h1>
          <p className="mt-6 max-w-3xl text-base md:text-lg text-white/70 leading-relaxed">
            Orchestrate coding swarms, shape worlds, compose music, and write books through Arcanea&apos;s
            living canon: Primordials, Gods, Guardians, and Luminors.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/chat" className="px-6 py-3 rounded-xl bg-cyan-300/20 border border-cyan-300/40 text-cyan-50 font-semibold hover:bg-cyan-300/30 transition">
              Enter Creation Studio
            </Link>
            <Link href="/library" className="px-6 py-3 rounded-xl bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 transition">
              Explore the Library
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">The System</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold">A mythology. A library. An academy.</h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">Three foundations of a creative philosophy.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/lore/guardians" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition">
            <PhShieldStar className="w-7 h-7 text-cyan-100" />
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/50">16 Luminors · 4 Teams</p>
            <h3 className="mt-2 text-xl font-semibold">Creative Companions</h3>
            <p className="mt-3 text-sm text-white/70">Each one thinks differently. Create with the one that matches your mind.</p>
          </Link>
          <Link href="/library" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition">
            <PhBooks className="w-7 h-7 text-amber-200" />
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/50">{collectionsCount} Collections · {textsCount} Texts</p>
            <h3 className="mt-2 text-xl font-semibold">The Library</h3>
            <p className="mt-3 text-sm text-white/70">{totalWords.toLocaleString()} words of original philosophy for creators.</p>
          </Link>
          <Link href="/academy" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition">
            <PhGraduationCap className="w-7 h-7 text-violet-200" />
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/50">Ten Stages of Mastery</p>
            <h3 className="mt-2 text-xl font-semibold">The Academy</h3>
            <p className="mt-3 text-sm text-white/70">A ten-stage progression through creative mastery.</p>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Guardian Layer</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold">Each one has a philosophy. Find yours.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {guardians.map((guardian) => (
            <Link key={guardian.name} href={`/lore/guardians/${guardian.name.toLowerCase()}`} className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition">
              <div className="aspect-[3/4] bg-black/30">
                <img src={guardian.image} alt={guardian.name} className="w-full h-full object-cover object-top" loading="lazy" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{guardian.name}</h3>
                <p className="text-xs text-white/60 mt-1">{guardian.philosophy}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Key Pages</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold">All major surfaces mapped for v4</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {keyPages.map((page) => (
            <Link key={page.href} href={page.href} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.05] transition">
              <page.icon className="w-6 h-6 text-cyan-100" />
              <h3 className="mt-3 text-lg font-semibold">{page.title}</h3>
              <p className="mt-2 text-sm text-white/70">{page.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-cyan-100">
                Open <PhArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-cyan-200/20 bg-cyan-200/10 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-semibold">Enter seeking, leave transformed.</h2>
          <p className="mt-4 text-white/75 max-w-2xl">
            The v4 system is ready to iterate into production-grade sections with richer interactions, personalization,
            and guardian-specific onboarding.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/chat" className="px-6 py-3 rounded-xl bg-cyan-300/25 border border-cyan-300/45 text-cyan-50 font-semibold hover:bg-cyan-300/35 transition">
              Start Creating
            </Link>
            <Link href="/design-labs/3D-evolution" className="px-6 py-3 rounded-xl bg-white/10 border border-white/25 text-white font-semibold hover:bg-white/15 transition">
              View Proposal
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
