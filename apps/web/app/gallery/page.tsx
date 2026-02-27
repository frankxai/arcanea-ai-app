"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  PhHeart,
  PhEye,
  PhFunnel,
  PhGridFour,
  PhSparkle,
  PhCode,
  PhImage,
  PhVideo,
  PhMusicNote,
  PhFileText,
  PhArrowRight,
  PhStack,
  PhCrown,
  PhTrendUp,
} from "@/lib/phosphor-icons";
import type { Creation, CreationType, ElementName, GateName, GuardianName } from "@/lib/database/types/api-responses";
import {
  SHOWCASE_CREATIONS,
  ELEMENT_COLORS,
  ELEMENT_ICONS,
  TYPE_ICONS,
  TYPE_LABELS,
} from "./gallery-data";

// ---------------------------------------------------------------------------
// Filter + sort types
// ---------------------------------------------------------------------------

type FilterType = "all" | CreationType;
type SortOption = "popular" | "recent" | "views";

const FILTER_TABS: { key: FilterType; label: string; icon: typeof PhGridFour }[] = [
  { key: "all", label: "All", icon: PhGridFour },
  { key: "text", label: "Text", icon: PhFileText },
  { key: "image", label: "Image", icon: PhImage },
  { key: "video", label: "Video", icon: PhVideo },
  { key: "audio", label: "Audio", icon: PhMusicNote },
  { key: "code", label: "Code", icon: PhCode },
];

// ---------------------------------------------------------------------------
// Normalized card item shared between live + showcase data
// ---------------------------------------------------------------------------

interface CardItem {
  id: string;
  title: string;
  description: string;
  type: CreationType;
  element: ElementName;
  gate: GateName;
  guardian: GuardianName;
  creatorName: string;
  likeCount: number;
  viewCount: number;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [liveCreations, setLiveCreations] = useState<Creation[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Try fetching real creations from Supabase; fall back to showcase data
  useEffect(() => {
    let cancelled = false;

    async function fetchCreations() {
      try {
        const res = await fetch(
          "/api/creations?visibility=public&status=published&sortBy=popular&limit=50"
        );
        if (!res.ok) throw new Error("API unavailable");
        const json = await res.json();
        if (!cancelled && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setLiveCreations(json.data);
        }
      } catch {
        // Supabase not configured or no data -- showcase mode
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCreations();
    return () => {
      cancelled = true;
    };
  }, []);

  const isShowcaseMode = liveCreations === null;

  // Normalize both sources into CardItem[]
  const allItems: CardItem[] = useMemo(() => {
    if (!isShowcaseMode && liveCreations) {
      return liveCreations.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description || "",
        type: c.type,
        element: c.element || ("Void" as ElementName),
        gate: c.gate || ("Source" as GateName),
        guardian: c.guardian || ("Shinkami" as GuardianName),
        creatorName: "Creator",
        likeCount: c.likeCount,
        viewCount: c.viewCount,
        tags: c.tags,
      }));
    }
    return SHOWCASE_CREATIONS;
  }, [isShowcaseMode, liveCreations]);

  // Filter + sort
  const filtered = useMemo(() => {
    let items =
      activeFilter === "all"
        ? allItems
        : allItems.filter((c) => c.type === activeFilter);

    if (sortBy === "popular") {
      items = [...items].sort((a, b) => b.likeCount - a.likeCount);
    } else if (sortBy === "views") {
      items = [...items].sort((a, b) => b.viewCount - a.viewCount);
    }
    return items;
  }, [allItems, activeFilter, sortBy]);

  // Per-type counts for tab badges
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allItems.length };
    allItems.forEach((c) => {
      counts[c.type] = (counts[c.type] || 0) + 1;
    });
    return counts;
  }, [allItems]);

  return (
    <div className="min-h-screen bg-cosmic-deep">
      {/* Hero */}
      <HeroSection
        isShowcaseMode={isShowcaseMode}
        totalCount={allItems.length}
      />

      {/* Filter bar */}
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        typeCounts={typeCounts}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onCloseFilters={() => setShowFilters(false)}
      />

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <CreationCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Showcase notice */}
        {isShowcaseMode && !loading && <ShowcaseNotice />}

        {/* Footer CTA */}
        {!loading && (
          <FooterCTA
            shownCount={filtered.length}
            totalCount={allItems.length}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------

function HeroSection({
  isShowcaseMode,
  totalCount,
}: {
  isShowcaseMode: boolean;
  totalCount: number;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-400/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-sans text-white/40 uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-white/60 transition-colors">
            Arcanea
          </Link>
          <span>/</span>
          <span className="text-white/60">Gallery</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
              Gallery of{" "}
              <span className="bg-gradient-to-r from-[#7fffd4] via-[#78a6ff] to-[#ffd700] bg-clip-text text-transparent">
                Creation
              </span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl font-sans leading-relaxed">
              {isShowcaseMode
                ? "Canonical works from across the Ten Gates. Visions channeled through the Five Elements by creators of every rank."
                : `${totalCount} creations from the Arcanea community, channeled through the Ten Gates and Five Elements.`}
            </p>
          </div>

          {/* Stats strip */}
          <div className="flex items-center gap-6 text-sm text-white/40 font-sans flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <PhSparkle size={16} weight="fill" className="text-[#7fffd4]" />
              <span>{totalCount} creations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PhCrown size={16} weight="fill" className="text-[#ffd700]" />
              <span>10 Gates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PhStack size={16} weight="fill" className="text-[#78a6ff]" />
              <span>5 Elements</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Filter bar
// ---------------------------------------------------------------------------

function FilterBar({
  activeFilter,
  onFilterChange,
  typeCounts,
  sortBy,
  onSortChange,
  showFilters,
  onToggleFilters,
  onCloseFilters,
}: {
  activeFilter: FilterType;
  onFilterChange: (f: FilterType) => void;
  typeCounts: Record<string, number>;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onCloseFilters: () => void;
}) {
  return (
    <div className="sticky top-0 z-30 bg-cosmic-deep/80 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Type filter tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {FILTER_TABS.map(({ key, label, icon: Icon }) => {
              const count = typeCounts[key] ?? 0;
              const isActive = activeFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => onFilterChange(key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-sans transition-all ${
                    isActive
                      ? "bg-[#7fffd4]/15 text-[#7fffd4] border border-[#7fffd4]/30"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon size={16} weight={isActive ? "fill" : "regular"} />
                  <span>{label}</span>
                  <span className="text-xs opacity-50">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Sort dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={onToggleFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-sans text-white/40 hover:text-white/70 hover:bg-white/5 border border-white/10 transition-all"
            >
              <PhFunnel size={16} />
              <span className="hidden sm:inline">Sort</span>
            </button>

            {showFilters && (
              <>
                <div className="fixed inset-0 z-40" onClick={onCloseFilters} />
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#0d0f1a] border border-white/10 shadow-2xl shadow-black/50 z-50 overflow-hidden">
                  {(
                    [
                      { key: "popular", label: "Most Popular", icon: PhHeart },
                      { key: "views", label: "Most Viewed", icon: PhEye },
                      { key: "recent", label: "Recent", icon: PhTrendUp },
                    ] as const
                  ).map(({ key, label, icon: SortIcon }) => (
                    <button
                      key={key}
                      onClick={() => {
                        onSortChange(key);
                        onCloseFilters();
                      }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-sans transition-colors ${
                        sortBy === key
                          ? "text-[#7fffd4] bg-[#7fffd4]/10"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <SortIcon
                        size={16}
                        weight={sortBy === key ? "fill" : "regular"}
                      />
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Creation card
// ---------------------------------------------------------------------------

function CreationCard({ item }: { item: CardItem }) {
  const elementStyle = ELEMENT_COLORS[item.element];
  const ElementIcon = ELEMENT_ICONS[item.element];
  const TypeIcon = TYPE_ICONS[item.type];

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
      {/* Gradient thumbnail area */}
      <div
        className={`relative h-44 bg-gradient-to-br ${elementStyle.gradient} flex items-center justify-center overflow-hidden`}
      >
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full border border-white/20" />
          <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/15" />
        </div>

        {/* Center icon */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <TypeIcon size={28} weight="duotone" className="text-white/70" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-sans">
            {TYPE_LABELS[item.type]}
          </span>
        </div>

        {/* Top-right element badge */}
        <div
          className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-sans border ${elementStyle.badge}`}
        >
          <ElementIcon size={12} weight="fill" />
          {item.element}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a14] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-sans font-semibold text-white mb-1.5 line-clamp-2 group-hover:text-[#7fffd4] transition-colors">
          {item.title}
        </h3>

        <p className="text-xs text-white/35 font-sans line-clamp-2 mb-3 leading-relaxed">
          {item.description}
        </p>

        {/* Guardian + Gate badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-sans bg-white/5 text-white/50 border border-white/5">
            {item.guardian}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-sans bg-white/5 text-white/50 border border-white/5">
            {item.gate} Gate
          </span>
        </div>

        {/* Footer: creator + stats */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-xs text-white/30 font-sans truncate max-w-[120px]">
            {item.creatorName}
          </span>
          <div className="flex items-center gap-3 text-white/25">
            <span className="flex items-center gap-1 text-xs font-sans">
              <PhHeart size={13} weight="fill" className="text-red-400/60" />
              {formatCount(item.likeCount)}
            </span>
            <span className="flex items-center gap-1 text-xs font-sans">
              <PhEye size={13} className="text-white/30" />
              {formatCount(item.viewCount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Utility sub-components
// ---------------------------------------------------------------------------

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse"
          style={{ height: `${240 + (i % 3) * 40}px` }}
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24">
      <PhImage size={48} className="mx-auto mb-4 text-white/20" />
      <p className="text-lg text-white/40 font-sans mb-2">
        No creations found
      </p>
      <p className="text-sm text-white/25 font-sans">
        Try a different filter or check back later.
      </p>
    </div>
  );
}

function ShowcaseNotice() {
  return (
    <div className="mt-12 rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
      <PhSparkle
        size={32}
        className="mx-auto mb-3 text-[#7fffd4]/60"
        weight="fill"
      />
      <p className="text-white/50 font-sans text-sm mb-1">
        Viewing curated showcase. Sign in to see community creations.
      </p>
      <p className="text-white/30 font-sans text-xs">
        Every creator who joins Arcanea adds their visions to this gallery.
      </p>
    </div>
  );
}

function FooterCTA({
  shownCount,
  totalCount,
}: {
  shownCount: number;
  totalCount: number;
}) {
  return (
    <div className="mt-16 text-center py-12 border-t border-white/5">
      <p className="text-white/30 font-sans mb-1 text-sm">
        Showing {shownCount} of {totalCount} creations
      </p>
      <p className="text-white/50 font-sans mb-6 max-w-md mx-auto">
        Every vision channels the Elements, resonates through the Gates, and
        becomes part of the living mythology.
      </p>
      <Link
        href="/studio"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7fffd4]/10 border border-[#7fffd4]/20 text-[#7fffd4] font-sans text-sm hover:bg-[#7fffd4]/20 transition-all group"
      >
        Create in Studio
        <PhArrowRight
          size={16}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
