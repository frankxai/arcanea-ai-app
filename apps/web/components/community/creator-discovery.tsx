'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  PhMagnifyingGlass,
  PhUsers,
  PhSparkle,
  PhStar,
  PhFlame,
  PhDrop,
  PhLeaf,
  PhWind,
  PhFunnel,
  PhCaretDown,
} from '@/lib/phosphor-icons';
import type { Creator } from './creator-data';
import { ELEMENT_COLORS, RANK_COLORS, DEMO_CREATORS } from './creator-data';

// ── Constants ──────────────────────────────────────────────────────────────

const ELEMENTS = ['All', 'Fire', 'Water', 'Earth', 'Wind', 'Void', 'Spirit'] as const;

const GATES = [
  'All',
  'Foundation', 'Flow', 'Fire', 'Heart', 'Voice',
  'Sight', 'Crown', 'Starweave', 'Unity', 'Source',
] as const;

const HOUSES = [
  'All', 'Lumina', 'Nero', 'Pyros', 'Aqualis', 'Terra', 'Ventus', 'Synthesis',
] as const;

const SORT_OPTIONS = [
  { value: 'trending', label: 'Trending' },
  { value: 'followers', label: 'Most followed' },
  { value: 'creations', label: 'Most active' },
  { value: 'newest', label: 'Newest' },
  { value: 'gate', label: 'Highest gate' },
] as const;

// Element colors and rank colors imported from creator-data.ts

const ELEMENT_ICONS: Record<string, typeof PhFlame> = {
  Fire: PhFlame,
  Water: PhDrop,
  Earth: PhLeaf,
  Wind: PhWind,
  Void: PhStar,
  Spirit: PhSparkle,
};

// Demo data imported from creator-data.ts

// ── Component ──────────────────────────────────────────────────────────────

interface CreatorDiscoveryProps {
  maxVisible?: number;
  showFilters?: boolean;
}

export function CreatorDiscovery({ maxVisible = 8, showFilters = true }: CreatorDiscoveryProps) {
  const [search, setSearch] = useState('');
  const [elementFilter, setElementFilter] = useState('All');
  const [gateFilter, setGateFilter] = useState('All');
  const [houseFilter, setHouseFilter] = useState('All');
  const [sort, setSort] = useState('trending');
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [apiCreators, setApiCreators] = useState<Creator[] | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  // Debounced search value for API calls
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch from API when filters change
  const fetchCreators = useCallback(async () => {
    setApiLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (elementFilter !== 'All') params.set('element', elementFilter);
      if (gateFilter !== 'All') params.set('gate', gateFilter);
      if (houseFilter !== 'All') params.set('house', houseFilter);
      params.set('sort', sort);
      params.set('pageSize', String(maxVisible));

      const res = await fetch(`/api/community/creators?${params}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          // Map API response (snake_case) to Creator interface (camelCase)
          const mapped: Creator[] = json.data.map((p: Record<string, unknown>) => ({
            id: p.id as string,
            username: p.username as string,
            displayName: (p.display_name as string) || (p.username as string),
            avatarUrl: p.avatar_url as string | undefined,
            bio: p.bio as string | undefined,
            element: (p.element as string) || 'Spirit',
            gateLevel: (p.gate_level as number) || 0,
            gateName: (p.gate_name as string) || 'Foundation',
            house: p.house as string | undefined,
            creationCount: (p.creation_count as number) || 0,
            followerCount: (p.follower_count as number) || 0,
            rank: (p.rank as string) || 'Apprentice',
            featured: p.featured as boolean | undefined,
          }));
          setApiCreators(mapped);
          return;
        }
      }
      // API returned empty — will use demo fallback
      setApiCreators(null);
    } catch {
      setApiCreators(null);
    } finally {
      setApiLoading(false);
    }
  }, [debouncedSearch, elementFilter, gateFilter, houseFilter, sort, maxVisible]);

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  // Use API results when available, fall back to client-side filtered demo data
  const filtered = useMemo(() => {
    if (apiCreators !== null) return apiCreators;

    // Fallback: client-side filtering of demo data
    let result = [...DEMO_CREATORS];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.displayName.toLowerCase().includes(q) ||
          c.username.toLowerCase().includes(q) ||
          c.bio?.toLowerCase().includes(q)
      );
    }

    if (elementFilter !== 'All') {
      result = result.filter((c) => c.element === elementFilter);
    }

    if (gateFilter !== 'All') {
      result = result.filter((c) => c.gateName === gateFilter);
    }

    if (houseFilter !== 'All') {
      result = result.filter((c) => c.house === houseFilter);
    }

    switch (sort) {
      case 'followers':
        result.sort((a, b) => b.followerCount - a.followerCount);
        break;
      case 'creations':
        result.sort((a, b) => b.creationCount - a.creationCount);
        break;
      case 'gate':
        result.sort((a, b) => b.gateLevel - a.gateLevel);
        break;
      case 'newest':
        result.reverse();
        break;
      case 'trending':
      default:
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.followerCount + b.creationCount * 2) - (a.followerCount + a.creationCount * 2);
        });
        break;
    }

    return result.slice(0, maxVisible);
  }, [apiCreators, search, elementFilter, gateFilter, houseFilter, sort, maxVisible]);

  const activeFilterCount = [
    elementFilter !== 'All',
    gateFilter !== 'All',
    houseFilter !== 'All',
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Search + Filters */}
      {showFilters && (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <PhMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search creators by name, bio, or element..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl liquid-glass border border-white/[0.06] bg-white/[0.03] text-sm text-text-primary placeholder-text-muted font-sans focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary/30 transition-all"
                aria-label="Search creators"
              />
            </div>

            <button
              onClick={() => setShowAllFilters(!showAllFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                showAllFilters || activeFilterCount > 0
                  ? 'border-crystal/30 bg-crystal/8 text-crystal'
                  : 'border-white/[0.06] bg-white/[0.03] text-text-muted hover:text-text-secondary'
              }`}
            >
              <PhFunnel className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-crystal/20 text-crystal text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Expanded filters */}
          {showAllFilters && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl liquid-glass border border-white/[0.04]">
              {/* Element */}
              <FilterSelect
                label="Element"
                value={elementFilter}
                options={ELEMENTS as unknown as string[]}
                onChange={setElementFilter}
              />

              {/* Gate */}
              <FilterSelect
                label="Gate"
                value={gateFilter}
                options={GATES as unknown as string[]}
                onChange={setGateFilter}
              />

              {/* House */}
              <FilterSelect
                label="House"
                value={houseFilter}
                options={HOUSES as unknown as string[]}
                onChange={setHouseFilter}
              />

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-text-secondary focus:outline-none focus:border-crystal/30 transition-colors cursor-pointer"
                  aria-label="Sort by"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#16161e] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <PhCaretDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted pointer-events-none" />
              </div>

              {/* Clear filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setElementFilter('All');
                    setGateFilter('All');
                    setHouseFilter('All');
                  }}
                  className="text-xs text-crystal/70 hover:text-crystal transition-colors px-2 py-1 font-mono"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Creator Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <PhUsers className="w-8 h-8 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-muted font-sans">No creators match your search</p>
          <p className="text-xs text-text-muted/60 mt-1 font-sans">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Creator Card ───────────────────────────────────────────────────────────

function CreatorCard({ creator }: { creator: Creator }) {
  const elementColor = ELEMENT_COLORS[creator.element] || '#7fffd4';
  const rankColor = RANK_COLORS[creator.rank] || '#94a3b8';
  const ElementIcon = ELEMENT_ICONS[creator.element] || PhSparkle;

  return (
    <Link
      href={`/profile/${creator.username}`}
      className="group relative card-3d liquid-glass rounded-2xl p-5 overflow-hidden hover-lift transition-all"
    >
      {/* Featured indicator */}
      {creator.featured && (
        <div className="absolute top-0 right-0">
          <div className="w-16 h-16 overflow-hidden">
            <div className="absolute top-2 right-[-20px] w-[80px] text-center text-[8px] font-mono text-brand-gold bg-brand-gold/15 rotate-45 py-0.5">
              FEATURED
            </div>
          </div>
        </div>
      )}

      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${elementColor}12, transparent 70%)`,
        }}
      />

      <div className="relative">
        {/* Avatar + Element */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold font-display"
              style={{
                backgroundColor: `${elementColor}15`,
                color: elementColor,
              }}
            >
              {creator.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0a12]"
              style={{ backgroundColor: `${elementColor}25` }}
            >
              <ElementIcon className="w-2.5 h-2.5" style={{ color: elementColor }} />
            </div>
          </div>

          {/* Rank badge */}
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
            style={{
              backgroundColor: `${rankColor}12`,
              color: rankColor,
              borderColor: `${rankColor}25`,
            }}
          >
            {creator.rank}
          </span>
        </div>

        {/* Name + Username */}
        <h3 className="font-display font-semibold text-sm mb-0.5 truncate">
          {creator.displayName}
        </h3>
        <p className="text-[10px] text-text-muted font-mono mb-2 truncate">
          @{creator.username}
        </p>

        {/* Bio */}
        {creator.bio && (
          <p className="text-xs text-text-secondary leading-relaxed font-sans line-clamp-2 mb-3">
            {creator.bio}
          </p>
        )}

        {/* Gate + Stats */}
        <div className="flex items-center gap-3 text-[10px] text-text-muted font-mono">
          <span
            className="flex items-center gap-1 px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${elementColor}10`, color: elementColor }}
          >
            <PhStar className="w-2.5 h-2.5" />
            Gate {creator.gateLevel}
          </span>
          <span className="flex items-center gap-1">
            <PhUsers className="w-2.5 h-2.5" />
            {creator.followerCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <PhSparkle className="w-2.5 h-2.5" />
            {creator.creationCount}
          </span>
        </div>

        {/* Recent creation */}
        {creator.recentCreation && (
          <div className="mt-3 pt-3 border-t border-white/[0.04]">
            <p className="text-[10px] text-text-muted font-mono flex items-center gap-1">
              <PhSparkle className="w-2.5 h-2.5" style={{ color: elementColor }} />
              Latest: {creator.recentCreation}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

// ── Filter Select sub-component ────────────────────────────────────────────

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-7 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-text-secondary focus:outline-none focus:border-crystal/30 transition-colors cursor-pointer"
        aria-label={`Filter by ${label}`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#16161e] text-white">
            {opt === 'All' ? label : opt}
          </option>
        ))}
      </select>
      <PhCaretDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted pointer-events-none" />
    </div>
  );
}
