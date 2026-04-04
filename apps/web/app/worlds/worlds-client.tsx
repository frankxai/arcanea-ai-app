"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { CosmicParticles } from "@/components/magic/particles";
import { MagnifyingGlass, Star, GitBranch, Users, ArrowRight, Plus } from "@/lib/phosphor-icons";
import { WorldsOnboarding } from "@/components/worlds/WorldsOnboarding";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type WorldMood = "all" | "fantasy" | "sci-fi" | "horror" | "steampunk" | "mythological";
type SortOption = "stars" | "recent" | "forks";

interface WorldElement {
  name: string;
  color: string;
}

export interface WorldCard {
  id: string;
  name: string;
  tagline: string;
  creator: string;
  stars: number;
  forks: number;
  characters: number;
  mood: Exclude<WorldMood, "all">;
  elements: WorldElement[];
  gradient: string;
  isTemplate?: boolean;
  slug?: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const MOOD_PILLS: { key: WorldMood; label: string }[] = [
  { key: "all", label: "All" },
  { key: "fantasy", label: "Fantasy" },
  { key: "sci-fi", label: "Sci-Fi" },
  { key: "horror", label: "Horror" },
  { key: "steampunk", label: "Steampunk" },
  { key: "mythological", label: "Mythological" },
];

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "stars", label: "Most Stars" },
  { key: "recent", label: "Recently Created" },
  { key: "forks", label: "Most Forked" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative max-w-lg mx-auto">
      <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search worlds by name, creator, or mood..."
        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/30 focus:outline-none focus:border-[#00bcd4]/50 focus:ring-1 focus:ring-[#00bcd4]/20 transition-all backdrop-blur-sm"
        aria-label="Search worlds"
      />
    </div>
  );
}

// Icons now imported from @/lib/phosphor-icons: Star, GitBranch, Users

function WorldCardComponent({ world }: { world: WorldCard }) {
  const href = world.isTemplate
    ? "/lore"
    : `/worlds/${world.slug || world.id}`;

  return (
    <div className="group relative rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all duration-300 hover:shadow-lg hover:shadow-[#00bcd4]/5 hover:-translate-y-1">
      {/* Hero image / gradient */}
      <div
        className="relative overflow-hidden"
        style={{ background: world.gradient, height: 160 }}
      >
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0.08) 55%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2s infinite",
          }}
        />
        {/* Noise overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 60%)",
          }}
        />
        {world.isTemplate && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider text-[#ffd700] border border-[#ffd700]/20">
            Template
          </div>
        )}
        {/* Active indicator for template worlds */}
        {world.isTemplate && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[10px] text-emerald-300 font-medium">Active</span>
          </div>
        )}
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-60 group-hover:opacity-50 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title + tagline */}
        <h3 className="text-lg font-display font-semibold text-white group-hover:text-[#00bcd4] transition-colors mb-1 truncate">
          {world.name}
        </h3>
        <p className="text-sm text-white/45 line-clamp-2 mb-3 leading-relaxed">
          {world.tagline}
        </p>

        {/* Element orbs */}
        <div className="flex items-center gap-2 mb-4">
          {world.elements.map((el) => (
            <span
              key={el.name}
              className="w-3.5 h-3.5 rounded-full ring-1 ring-white/10 relative"
              style={{ backgroundColor: el.color, boxShadow: `0 0 8px ${el.color}60, 0 0 16px ${el.color}25` }}
              title={el.name}
            />
          ))}
          <span className="text-[11px] text-white/25 ml-1">
            {world.elements.map((e) => e.name).join(" / ")}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-white/35 mb-4">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-[#ffd700]/70" weight="fill" />
            {world.stars.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5" />
            {world.forks}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {world.characters}
          </span>
        </div>

        {/* Creator + actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <span className="flex items-center gap-2 text-xs text-white/40">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white/80 shrink-0"
              style={{ backgroundColor: world.elements[0]?.color ?? "#00bcd4" }}
            >
              {world.creator.charAt(0).toUpperCase()}
            </span>
            by{" "}
            <span className="text-white/60 font-medium">{world.creator}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] text-white/50 hover:text-[#ffd700] hover:border-[#ffd700]/30 hover:bg-[#ffd700]/5 transition-all"
              aria-label={`Star ${world.name}`}
            >
              <Star className="w-3.5 h-3.5" weight="fill" />
              Star
            </button>
            <Link
              href={href}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-[#00bcd4] hover:bg-[#00bcd4]/20 transition-all"
            >
              Explore
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Client Component
// ---------------------------------------------------------------------------

function MultiverseStats({ worlds }: { worlds: WorldCard[] }) {
  const totalWorlds = worlds.length;
  const totalCharacters = worlds.reduce((s, w) => s + w.characters, 0);
  const totalForks = worlds.reduce((s, w) => s + w.forks, 0);
  const totalStars = worlds.reduce((s, w) => s + w.stars, 0);
  const stats = [
    { value: totalWorlds, label: "Worlds" },
    { value: totalCharacters, label: "Characters" },
    { value: totalForks, label: "Forks" },
    { value: totalStars.toLocaleString(), label: "Stars" },
  ];
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap py-6">
      {stats.map(({ value, label }, i) => (
        <span key={label} className="flex items-center gap-1.5 text-sm">
          <span className="font-display font-bold text-white" style={{ textShadow: "0 0 12px rgba(0,188,212,0.4)" }}>{value}</span>
          <span className="text-white/35">{label}</span>
          {i < stats.length - 1 && <span className="text-white/10 ml-2">·</span>}
        </span>
      ))}
    </div>
  );
}

export function WorldsClient({ worlds }: { worlds: WorldCard[] }) {
  const [activeMood, setActiveMood] = useState<WorldMood>("all");
  const [sortBy, setSortBy] = useState<SortOption>("stars");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorlds = useMemo(() => {
    let results = [...worlds];

    if (activeMood !== "all") {
      results = results.filter((w) => w.mood === activeMood);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.tagline.toLowerCase().includes(q) ||
          w.creator.toLowerCase().includes(q) ||
          w.mood.toLowerCase().includes(q)
      );
    }

    results.sort((a, b) => {
      if (sortBy === "stars") return b.stars - a.stars;
      if (sortBy === "forks") return b.forks - a.forks;
      return 0; // "recent" — keep default order
    });

    return results;
  }, [worlds, activeMood, sortBy, searchQuery]);

  return (
    <LazyMotion features={domAnimation}>
      {/* Shimmer keyframe for card hover */}
      <style dangerouslySetInnerHTML={{ __html: `@keyframes shimmer{0%{background-position:200% 0}to{background-position:-200% 0}}` }} />
      <main className="min-h-screen bg-[#09090b] text-white">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <CosmicParticles />

          {/* Background orbs */}
          <div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00bcd4]/5 rounded-full blur-3xl animate-pulse pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#7c3aed]/5 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
            {/* Eyebrow */}
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#00bcd4]/60" />
              <span className="text-[#00bcd4] font-mono text-xs tracking-widest uppercase">
                Multiverse
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#00bcd4]/60" />
            </m.div>

            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
            >
              <span className="text-white">Explore </span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #00bcd4, #7c3aed, #ffd700)",
                }}
              >
                Worlds
              </span>
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10"
            >
              Discover living universes built by creators. Fork, star, and build
              on each other&apos;s worlds.
            </m.p>

            {/* Search */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mb-8"
            >
              <SearchInput value={searchQuery} onChange={setSearchQuery} />
            </m.div>

            {/* Filter pills + sort */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {/* Mood pills */}
              <div
                className="flex flex-wrap justify-center gap-2"
                role="tablist"
                aria-label="Filter by mood"
              >
                {MOOD_PILLS.map((pill) => {
                  const isActive = activeMood === pill.key;
                  return (
                    <button
                      key={pill.key}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveMood(pill.key)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]/60 ${
                        isActive
                          ? "bg-[#00bcd4]/15 border-[#00bcd4]/40 text-[#00bcd4] shadow-lg shadow-[#00bcd4]/10"
                          : "border-white/[0.08] text-white/50 hover:text-white/80 hover:border-white/[0.15] hover:bg-white/[0.03]"
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-white/60 focus:outline-none focus:border-[#00bcd4]/40 transition-all appearance-none cursor-pointer"
                  aria-label="Sort worlds"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option
                      key={opt.key}
                      value={opt.key}
                      className="bg-[#09090b] text-white"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </m.div>
          </div>
        </section>

        {/* ── Pulse of the Multiverse ──────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6">
          <MultiverseStats worlds={filteredWorlds.length > 0 ? filteredWorlds : worlds} />
        </section>

        {/* ── World Grid ────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 pb-12">
          {filteredWorlds.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorlds.map((world, i) => (
                <m.div
                  key={world.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.3) }}
                  className="h-full"
                >
                  <WorldCardComponent world={world} />
                </m.div>
              ))}
            </div>
          ) : (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-white/40 text-lg mb-4">No worlds match your search.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveMood("all");
                }}
                className="text-sm text-[#00bcd4] hover:underline"
              >
                Clear filters
              </button>
            </m.div>
          )}
        </section>

        {/* ── Empty state CTA ───────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,188,212,0.04) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-block rounded-2xl px-10 py-12 w-full"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <p className="text-[#00bcd4] font-mono text-xs tracking-widest uppercase mb-4">
                  The Multiverse Awaits
                </p>
                <h2
                  className="text-3xl md:text-4xl font-display font-bold mb-4 text-white"
                >
                  {worlds.length > 0
                    ? "Your world is next."
                    : "Be the first to create a world in the multiverse."}
                </h2>
                <p className="text-white/45 max-w-xl mx-auto mb-8 leading-relaxed">
                  Every universe begins with a single idea. Create yours with
                  intelligent world-building — define elements, characters, gates,
                  and lore. Then share it for others to explore and fork.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <m.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/worlds/create"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00bcd4] to-[#7c3aed] text-white font-bold rounded-xl shadow-lg shadow-[#00bcd4]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]/60"
                    >
                      Create a World
                      <Plus className="w-4 h-4" />
                    </Link>
                  </m.div>
                  <m.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/lore"
                      className="inline-flex items-center gap-2 px-8 py-4 border border-white/[0.1] text-white/70 font-bold rounded-xl hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]/60"
                    >
                      Explore Arcanea Lore
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </m.div>
                </div>
              </div>
            </m.div>
          </div>
        </section>
      </main>

      {/* First-visit onboarding overlay */}
      <WorldsOnboarding />
    </LazyMotion>
  );
}
