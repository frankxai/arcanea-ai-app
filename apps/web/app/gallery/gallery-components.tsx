"use client";

import Link from "next/link";
import Image from "next/image";
import { getFeaturedLuminors } from "@/lib/luminor-images";
import {
  PhHeart,
  PhEye,
  PhFunnel,
  PhSparkle,
  PhImage,
  PhArrowRight,
  PhStack,
  PhCrown,
  PhTrendUp,
} from "@/lib/phosphor-icons";
import type { CreationType, ElementName } from "@/lib/database/types/api-responses";
import { ELEMENT_COLORS, ELEMENT_ICONS, TYPE_ICONS, TYPE_LABELS } from "./gallery-data";
import { SplitText } from "@/components/motion/split-text";
import { TiltCard } from "@/components/motion/tilt-card";
import { LiquidGlass } from "@/components/motion/liquid-glass";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface CardItem {
  id: string;
  title: string;
  description: string;
  type: CreationType;
  element: ElementName;
  gate: string;
  guardian: string;
  creatorName: string;
  likeCount: number;
  viewCount: number;
  tags: string[];
}

export type FilterType = "all" | CreationType;
export type ElementFilter = "all" | ElementName;
export type SortOption = "popular" | "recent" | "views";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------

export function HeroSection({
  isShowcaseMode,
  totalCount,
  mounted,
}: {
  isShowcaseMode: boolean;
  totalCount: number;
  mounted: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.04]">
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#0d47a1]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-400/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-sans text-white/[0.25] uppercase tracking-widest mb-6" style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}>
          <Link href="/" className="hover:text-white/[0.40] transition-colors">
            Arcanea
          </Link>
          <span>/</span>
          <span className="text-white/[0.40]">Gallery</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight tracking-tight">
              <SplitText as="span" text="Gallery of " className="text-white" delay={0.1} stagger={0.03} />
              <span className="bg-gradient-to-r from-[#00bcd4] via-[#78a6ff] to-[#ffd700] bg-clip-text text-transparent bg-[length:200%_100%] animate-[shimmer_6s_ease-in-out_infinite]">
                Creation
              </span>
            </h1>
            <p className="text-lg text-white/[0.30] max-w-2xl font-sans leading-relaxed" style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
              transitionDelay: "0.2s",
            }}>
              {isShowcaseMode
                ? "Canonical works from across the Ten Gates. Visions channeled through the Five Elements by creators of every rank."
                : `${totalCount} creations from the Arcanea community, channeled through the Ten Gates and Five Elements.`}
            </p>
            <div className="flex flex-wrap gap-3 mt-4" style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
              transitionDelay: "0.3s",
            }}>
              <Link
                href="/gallery/guardians"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
              >
                Guardians
                <PhArrowRight size={14} />
              </Link>
              <Link
                href="/gallery/luminors"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ffd700]/10 text-[#ffd700] text-sm font-medium border border-[#ffd700]/20 hover:bg-[#ffd700]/20 transition-colors"
              >
                The Twenty
                <PhArrowRight size={14} />
              </Link>
              <Link
                href="/companions"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
              >
                Companions
                <PhArrowRight size={14} />
              </Link>
              <Link
                href="/gallery/forge"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] text-white/40 text-sm font-medium border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
              >
                The Forge
                <PhArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex items-center gap-6 text-sm text-white/[0.25] font-sans flex-shrink-0" style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            transitionDelay: "0.4s",
          }}>
            <div className="flex items-center gap-1.5">
              <PhSparkle size={16} weight="fill" className="text-[#00bcd4]" />
              <span>{totalCount} creations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PhCrown size={16} weight="fill" className="text-[#ffd700]" />
              <span>10 Gates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PhStack size={16} weight="fill" className="text-[#00bcd4]" />
              <span>5 Elements</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Featured companions showcase
// ---------------------------------------------------------------------------

const ELEMENT_BADGE_STYLES: Record<string, string> = {
  Fire: "bg-red-500/10 text-red-400 border-red-500/20",
  Water: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Earth: "bg-green-500/10 text-green-400 border-green-500/20",
  Wind: "bg-white/[0.06] text-white/50 border-white/[0.10]",
  Void: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Spirit: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export function FeaturedCompanions() {
  const featured = getFeaturedLuminors(4);

  return (
    <section className="border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-sans font-semibold text-white">
              Featured Companions
            </h2>
            <p className="text-sm text-white/[0.30] font-sans mt-1">
              Portraits from the Twenty — AI-generated companion artworks
            </p>
          </div>
          <Link
            href="/gallery/luminors"
            className="flex items-center gap-1.5 text-sm font-sans text-white/[0.30] hover:text-[#00bcd4] transition-colors"
          >
            View all
            <PhArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((companion) => {
            const badgeStyle =
              ELEMENT_BADGE_STYLES[companion.element] ??
              ELEMENT_BADGE_STYLES.Spirit;

            return (
              <Link
                key={companion.id}
                href="/gallery/luminors"
                className="group relative rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] bg-[#09090b] transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="relative aspect-square bg-[#0a0a0c]">
                  <Image
                    src={companion.image}
                    alt={`${companion.name} — ${companion.title}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  {/* Bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#09090b] to-transparent" />
                </div>

                <div className="relative -mt-8 px-3 pb-3 z-10">
                  <p className="text-sm font-sans font-semibold text-white group-hover:text-[#00bcd4] transition-colors">
                    {companion.name}
                  </p>
                  <p className="text-xs text-white/[0.30] font-sans mt-0.5">
                    {companion.title}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-sans border ${badgeStyle}`}
                  >
                    {companion.element}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Filter bar
// ---------------------------------------------------------------------------

export function FilterBar({
  activeFilter,
  onFilterChange,
  typeCounts,
  sortBy,
  onSortChange,
  showFilters,
  onToggleFilters,
  onCloseFilters,
  filterTabs,
}: {
  activeFilter: FilterType;
  onFilterChange: (f: FilterType) => void;
  typeCounts: Record<string, number>;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onCloseFilters: () => void;
  filterTabs: { key: FilterType; label: string; icon: React.ComponentType<any> }[];
}) {
  return (
    <div className="sticky top-16 z-30 border-b border-white/[0.08]" style={{
      background: "rgba(9, 9, 11, 0.75)",
      backdropFilter: "blur(20px) saturate(1.4)",
      WebkitBackdropFilter: "blur(20px) saturate(1.4)",
    }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Type filter tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide" role="tablist" aria-label="Filter by creation type">
            {filterTabs.map(({ key, label, icon: Icon }) => {
              const count = typeCounts[key] ?? 0;
              const isActive = activeFilter === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onFilterChange(key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-sans transition-all duration-200 ${
                    isActive
                      ? "text-white border"
                      : "text-white/[0.25] hover:text-white/[0.50] hover:bg-white/[0.04] border border-transparent"
                  }`}
                  style={isActive ? {
                    background: "linear-gradient(135deg, rgba(0,188,212,0.18), rgba(13,71,161,0.10))",
                    borderColor: "rgba(0,188,212,0.35)",
                    boxShadow: "0 0 16px rgba(0,188,212,0.12), inset 0 1px 0 rgba(0,188,212,0.08)",
                  } : undefined}
                >
                  <Icon size={16} weight={isActive ? "fill" : "regular"} className={isActive ? "text-[#00bcd4]" : ""} />
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
              aria-label="Sort creations"
              aria-expanded={showFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-sans text-white/[0.25] hover:text-white/[0.50] hover:bg-white/[0.04] border border-white/[0.06] transition-all"
            >
              <PhFunnel size={16} />
              <span className="hidden sm:inline">Sort</span>
            </button>

            {showFilters && (
              <>
                <div className="fixed inset-0 z-40" onClick={onCloseFilters} />
                <div role="menu" aria-label="Sort options" className="absolute right-0 top-full mt-2 w-48 rounded-xl liquid-glass-elevated border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.4)] z-50 overflow-hidden">
                  {(
                    [
                      { key: "popular", label: "Most Popular", icon: PhHeart },
                      { key: "views", label: "Most Viewed", icon: PhEye },
                      { key: "recent", label: "Recent", icon: PhTrendUp },
                    ] as const
                  ).map(({ key, label, icon: SortIcon }) => (
                    <button
                      key={key}
                      role="menuitem"
                      onClick={() => {
                        onSortChange(key);
                        onCloseFilters();
                      }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-sans transition-colors ${
                        sortBy === key
                          ? "text-[#00bcd4] bg-[#00bcd4]/10"
                          : "text-white/[0.30] hover:text-white hover:bg-white/[0.04]"
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

export function CreationCard({ item, index = 0, mounted = true }: { item: CardItem; index?: number; mounted?: boolean }) {
  const elementStyle = ELEMENT_COLORS[item.element];
  const ElementIcon = ELEMENT_ICONS[item.element];
  const TypeIcon = TYPE_ICONS[item.type];

  // Stagger delay: cap at 0.6s so cards further down don't wait forever
  const staggerDelay = Math.min(index * 0.05, 0.6);

  return (
    <TiltCard intensity={4}>
    <LiquidGlass
      intensity="subtle"
      tint={elementStyle.accent ?? '#00bcd4'}
      className="group relative rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-colors duration-300"
      noise={false}
    ><div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${staggerDelay}s, transform 0.5s ease ${staggerDelay}s`,
      }}
    >
      {/* Gradient thumbnail area */}
      <div
        className={`relative h-44 bg-gradient-to-br ${elementStyle.gradient} flex items-center justify-center overflow-hidden`}
      >
        {/* Gradient hover shimmer */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#00bcd4]/8 via-transparent to-[#ffd700]/5 pointer-events-none" />

        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full border border-white/[0.12]" />
          <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full border border-white/[0.06]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/[0.10]" />
        </div>

        {/* Center icon */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.06] flex items-center justify-center group-hover:border-white/[0.12] group-hover:bg-white/[0.10] transition-all duration-300">
            <TypeIcon size={28} weight="duotone" className="text-white/[0.50] group-hover:text-white/[0.70] transition-colors duration-300" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/[0.20] font-sans">
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
        <h3 className="text-sm font-sans font-semibold text-white mb-1.5 line-clamp-2 group-hover:text-[#00bcd4] transition-colors duration-200">
          {item.title}
        </h3>

        <p className="text-xs text-white/[0.22] font-sans line-clamp-2 mb-3 leading-relaxed">
          {item.description}
        </p>

        {/* Guardian + Gate badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-sans bg-white/[0.04] text-white/[0.30] border border-white/[0.04] group-hover:border-white/[0.08] transition-colors">
            {item.guardian}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-sans bg-white/[0.04] text-white/[0.30] border border-white/[0.04] group-hover:border-white/[0.08] transition-colors">
            {item.gate} Gate
          </span>
        </div>

        {/* Footer: creator + stats */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
          <span className="text-xs text-white/[0.20] font-sans truncate max-w-[120px]">
            {item.creatorName}
          </span>
          <div className="flex items-center gap-3 text-white/[0.15]">
            <span className="flex items-center gap-1 text-xs font-sans group-hover:text-red-400/80 transition-colors">
              <PhHeart size={13} weight="fill" className="text-red-400/60 group-hover:text-red-400 transition-colors" />
              {formatCount(item.likeCount)}
            </span>
            <span className="flex items-center gap-1 text-xs font-sans">
              <PhEye size={13} className="text-white/[0.20]" />
              {formatCount(item.viewCount)}
            </span>
          </div>
        </div>
      </div>
    </div>
    </LiquidGlass>
    </TiltCard>
  );
}

// ---------------------------------------------------------------------------
// Utility sub-components
// ---------------------------------------------------------------------------

export function EmptyState({
  activeElement,
  activeFilter,
  onReset,
}: {
  activeElement: ElementFilter;
  activeFilter: FilterType;
  onReset: () => void;
}) {
  const elementMessages: Record<string, string> = {
    Fire: "The flames await new fuel. No Fire creations match this filter.",
    Water: "The currents are still. No Water creations found.",
    Earth: "The roots run deep, but nothing surfaces here.",
    Wind: "The wind carries no whispers for this search.",
    Void: "The Void holds infinite potential, but nothing manifests yet.",
  };

  const message = activeElement !== "all" ? elementMessages[activeElement] : undefined;
  const hasFilters = activeElement !== "all" || activeFilter !== "all";

  return (
    <div className="text-center py-24 px-4">
      <div className="relative inline-block mb-6">
        <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto">
          <PhImage size={36} className="text-white/[0.12]" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00bcd4]/20 border border-[#00bcd4]/30 flex items-center justify-center">
          <PhSparkle size={10} className="text-[#00bcd4]" />
        </div>
      </div>
      <p className="text-lg text-white/[0.30] font-sans mb-2">
        {message || "No creations found"}
      </p>
      <p className="text-sm text-white/[0.18] font-sans mb-6 max-w-sm mx-auto">
        {hasFilters
          ? "Adjust your filters to discover more visions from the Gallery."
          : "The Gallery awaits its first creation. Begin in the Studio."}
      </p>
      {hasFilters && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans text-[#00bcd4] bg-[#00bcd4]/8 border border-[#00bcd4]/20 hover:bg-[#00bcd4]/15 transition-all"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

export function ShowcaseNotice() {
  return (
    <div className="mt-12 rounded-2xl liquid-glass border border-white/[0.06] p-8 text-center">
      <PhSparkle
        size={32}
        className="mx-auto mb-3 text-[#00bcd4]/60"
        weight="fill"
      />
      <p className="text-white/[0.30] font-sans text-sm mb-1">
        Viewing curated showcase. Sign in to see community creations.
      </p>
      <p className="text-white/[0.20] font-sans text-xs">
        Every creator who joins Arcanea adds their visions to this gallery.
      </p>
    </div>
  );
}

export function FooterCTA({
  shownCount,
  totalCount,
}: {
  shownCount: number;
  totalCount: number;
}) {
  return (
    <div className="mt-16 text-center py-12 border-t border-white/[0.04]">
      <p className="text-white/[0.20] font-sans mb-1 text-sm">
        Showing {shownCount} of {totalCount} creations
      </p>
      <p className="text-white/[0.30] font-sans mb-8 max-w-md mx-auto">
        Every vision channels the Elements, resonates through the Gates, and
        becomes part of the living mythology.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/imagine?prompt=A+luminous+portal+between+worlds%2C+surrounded+by+the+Five+Elements+in+perfect+harmony"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00bcd4]/15 to-[#0d47a1]/10 border border-[#00bcd4]/25 text-[#00bcd4] font-sans text-sm hover:from-[#00bcd4]/25 hover:to-[#0d47a1]/20 hover:border-[#00bcd4]/40 transition-all duration-200 group shadow-[0_0_24px_rgba(0,188,212,0.08)] hover:shadow-[0_0_32px_rgba(0,188,212,0.15)]"
        >
          <PhImage size={16} weight="duotone" />
          Generate an Image
          <PhArrowRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
        <Link
          href="/chat?message=Help+me+create+something+for+the+Gallery%2C+channeled+through+the+Five+Elements"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 font-sans text-sm hover:bg-white/[0.07] hover:border-white/[0.14] hover:text-white/80 transition-all duration-200 group"
        >
          <PhSparkle size={16} weight="duotone" />
          Ask the Guardian
          <PhArrowRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>
    </div>
  );
}
