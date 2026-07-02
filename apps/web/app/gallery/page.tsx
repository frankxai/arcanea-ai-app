/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  PhGridFour,
  PhFileText,
  PhImage,
  PhVideo,
  PhMusicNote,
  PhCode,
  PhSparkle,
  PhFire,
  PhDrop,
  PhLeaf,
  PhWind,
  PhSpiral,
  PhHeart,
  PhEye,
  PhTrendUp,
  PhPlus,
} from "@/lib/phosphor-icons";
import type { Creation, CreationType, ElementName, GateName, GuardianName } from "@/lib/database/types/api-responses";
import { SHOWCASE_CREATIONS } from "./gallery-data";
import {
  HeroSection,
  FeaturedCompanions,
  FilterBar,
  CreationCard,
  EmptyState,
  ShowcaseNotice,
  FooterCTA,
  type CardItem,
  type FilterType,
  type ElementFilter,
  type SortOption,
} from "./gallery-components";

// ---------------------------------------------------------------------------
// Filter + sort constants
// ---------------------------------------------------------------------------

const FILTER_TABS: { key: FilterType; label: string; icon: typeof PhGridFour }[] = [
  { key: "all", label: "All", icon: PhGridFour },
  { key: "text", label: "Text", icon: PhFileText },
  { key: "image", label: "Image", icon: PhImage },
  { key: "video", label: "Video", icon: PhVideo },
  { key: "audio", label: "Audio", icon: PhMusicNote },
  { key: "code", label: "Code", icon: PhCode },
];

const ELEMENT_FILTER_TABS: { key: ElementFilter; label: string; icon: typeof PhFire; color: string; hex: string }[] = [
  { key: "all", label: "All Elements", icon: PhSparkle, color: "text-[var(--arc-brand-atlantean-teal)]", hex: "var(--arc-brand-atlantean-teal)" },
  { key: "Fire", label: "Fire", icon: PhFire, color: "text-red-400", hex: "var(--arc-fire)" },
  { key: "Water", label: "Water", icon: PhDrop, color: "text-blue-400", hex: "var(--arc-brand-cosmic-blue)" },
  { key: "Earth", label: "Earth", icon: PhLeaf, color: "text-green-400", hex: "var(--arc-wind)" },
  { key: "Wind", label: "Wind", icon: PhWind, color: "text-slate-300", hex: "var(--arc-text-primary)" },
  { key: "Void", label: "Void", icon: PhSpiral, color: "text-violet-400", hex: "var(--arc-void)" },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeElement, setActiveElement] = useState<ElementFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [liveCreations, setLiveCreations] = useState<Creation[] | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [trending, setTrending] = useState<CardItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    async function fetchCreations() {
      try {
        const res = await fetch(
          "/api/creations?visibility=public&status=published&sortBy=popular&limit=50",
          { signal: controller.signal }
        );
        if (!res.ok) {
          setFetchError(true);
          return;
        }
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setLiveCreations(json.data);
        }
      } catch {
        setFetchError(true);
      }
    }

    fetchCreations();
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    fetch('/api/trending?pageSize=8')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data?.creations) {
          setTrending(data.data.creations.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: '',
            type: c.type || 'text',
            element: c.element || 'Fire',
            gate: c.gate || 'Foundation',
            guardian: c.guardian || 'Lyssandria',
            creatorName: c.creator_name || 'Creator',
            likeCount: c.like_count || 0,
            viewCount: c.view_count || 0,
            tags: [],
            createdAt: c.created_at,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const isShowcaseMode = liveCreations === null;

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

  const filtered = useMemo(() => {
    let items = allItems;
    if (activeFilter !== "all") {
      items = items.filter((c) => c.type === activeFilter);
    }
    if (activeElement !== "all") {
      items = items.filter((c) => c.element === activeElement);
    }
    if (sortBy === "popular") {
      items = [...items].sort((a, b) => b.likeCount - a.likeCount);
    } else if (sortBy === "views") {
      items = [...items].sort((a, b) => b.viewCount - a.viewCount);
    }
    return items;
  }, [allItems, activeFilter, activeElement, sortBy]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allItems.length };
    allItems.forEach((c) => {
      counts[c.type] = (counts[c.type] || 0) + 1;
    });
    return counts;
  }, [allItems]);

  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)]">
      <HeroSection
        isShowcaseMode={isShowcaseMode}
        totalCount={allItems.length}
        mounted={mounted}
      />

      <FeaturedCompanions />

      {/* Trending Now */}
      {trending.length > 0 && (
        <TrendingSection trending={trending} />
      )}

      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        typeCounts={typeCounts}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onCloseFilters={() => setShowFilters(false)}
        filterTabs={FILTER_TABS}
      />

      {/* Element filter row */}
      <div className="max-w-7xl mx-auto px-6 pt-6" style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        transitionDelay: "0.3s",
      }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-white/[0.20] font-sans uppercase tracking-widest mr-1">Element</span>
          {ELEMENT_FILTER_TABS.map(({ key, label, icon: EIcon, color, hex }) => {
            const isActive = activeElement === key;
            return (
              <button
                key={key}
                onClick={() => setActiveElement(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all duration-200 ${
                  isActive
                    ? "text-white border"
                    : "text-white/[0.25] hover:text-white/[0.50] hover:bg-white/[0.04] border border-transparent"
                }`}
                style={isActive ? {
                  background: `linear-gradient(135deg, ${hex}20, ${hex}08)`,
                  borderColor: `${hex}40`,
                  boxShadow: `0 0 12px ${hex}15, inset 0 1px 0 ${hex}10`,
                } : undefined}
              >
                <EIcon size={14} weight={isActive ? "fill" : "regular"} className={isActive ? color : ""} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <EmptyState activeElement={activeElement} activeFilter={activeFilter} onReset={() => { setActiveFilter("all"); setActiveElement("all"); }} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item, idx) => (
              <CreationCard key={item.id} item={item} index={idx} mounted={mounted} />
            ))}
          </div>
        )}

        {isShowcaseMode && <ShowcaseNotice />}

        <FooterCTA
          shownCount={filtered.length}
          totalCount={allItems.length}
        />
      </div>

      {/* Floating Action Button */}
      <Link
        href="/studio"
        aria-label="Create new in Studio"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] text-white font-sans font-semibold shadow-lg shadow-[var(--arc-brand-atlantean-teal)]/25 hover:shadow-xl hover:shadow-[var(--arc-brand-atlantean-teal)]/30 hover:scale-105 transition-all duration-200 group"
      >
        <PhPlus size={20} weight="bold" className="group-hover:rotate-90 transition-transform duration-300" />
        <span className="hidden sm:inline">Create New</span>
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Trending section (small, kept inline)
// ---------------------------------------------------------------------------

function TrendingSection({ trending }: { trending: CardItem[] }) {
  return (
    <section className="border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-4">
          <PhTrendUp className="w-5 h-5 text-[var(--arc-brand-atlantean-teal)]" />
          <h2 className="text-lg font-semibold text-white">Trending Now</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
          {trending.map(item => (
            <div
              key={item.id}
              className="flex-shrink-0 w-56 bg-white/[0.04] border border-white/[0.08] rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)]">
                  {item.type}
                </span>
                {item.element && (
                  <span className="text-[10px] text-white/40">{item.element}</span>
                )}
              </div>
              <p className="text-sm font-medium text-white/90 truncate">{item.title}</p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-white/40">
                <span className="flex items-center gap-1"><PhHeart className="w-3 h-3" /> {item.likeCount}</span>
                <span className="flex items-center gap-1"><PhEye className="w-3 h-3" /> {item.viewCount}</span>
              </div>
              <p className="text-[11px] text-white/30 mt-1.5">{item.creatorName}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
