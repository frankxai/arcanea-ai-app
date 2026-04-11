'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Command } from 'cmdk';
import { Search, X } from 'lucide-react';

import type { Skill } from '@/lib/skills/loader';
import SkillCard from './SkillCard';

interface SkillSearchProps {
  skills: Skill[];
  categories: string[];
}

/**
 * Raycast-style command palette search for the skill marketplace.
 *
 * - Uses cmdk for fuzzy search, grouping, and keyboard navigation
 * - Cmd/Ctrl+K focuses the input from anywhere on the page
 * - Category chips filter the underlying dataset
 * - Results render as a grid of SkillCards wrapped in CommandItem so
 *   cmdk still controls visibility, ordering, and empty state
 */
export default function SkillSearch({ skills, categories }: SkillSearchProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cmd/Ctrl+K to focus the search input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Pre-filter by category — cmdk handles the fuzzy text search.
  const visibleSkills = useMemo(() => {
    if (!activeCategory) return skills;
    return skills.filter((s) => (s.category || '') === activeCategory);
  }, [skills, activeCategory]);

  // Group visible skills by category for rendering in CommandGroups.
  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const skill of visibleSkills) {
      const key = skill.category || 'Uncategorized';
      const arr = map.get(key) ?? [];
      arr.push(skill);
      map.set(key, arr);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [visibleSkills]);

  return (
    <Command
      className="w-full"
      // Custom filter that searches across name, description, tags, and triggers.
      filter={(value, search) => {
        if (!search) return 1;
        const haystack = value.toLowerCase();
        const needle = search.toLowerCase().trim();
        if (!needle) return 1;
        // Simple substring + token match scoring.
        if (haystack.includes(needle)) return 1;
        const tokens = needle.split(/\s+/).filter(Boolean);
        if (tokens.every((t) => haystack.includes(t))) return 0.6;
        return 0;
      }}
      shouldFilter
      label="Search skills"
    >
      {/* Search input */}
      <div className="relative mb-6">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
          aria-hidden="true"
        />
        <Command.Input
          ref={inputRef}
          value={query}
          onValueChange={setQuery}
          placeholder="Search skills by name, description, or tag..."
          className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm px-11 py-3 text-sm text-white/90 placeholder:text-white/30 focus:border-[#00bcd4]/40 focus:outline-none transition-colors"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/70"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/40 sm:inline-flex">
            <span className="text-[11px]">⌘</span>K
          </kbd>
        )}
      </div>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
              activeCategory === null
                ? 'border-[#00bcd4]/40 bg-[#00bcd4]/15 text-[#00bcd4]'
                : 'border-white/[0.06] bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/80'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCategory(c)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                activeCategory === c
                  ? 'border-[#00bcd4]/40 bg-[#00bcd4]/15 text-[#00bcd4]'
                  : 'border-white/[0.06] bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/80'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Result list — rendered as grid cells, cmdk controls visibility */}
      <Command.List className="block">
        <Command.Empty className="py-16 text-center text-sm text-white/30">
          No skills match your search.
        </Command.Empty>

        {grouped.map(([category, items]) => (
          <Command.Group
            key={category}
            heading={category}
            className="mb-8 [&_[cmdk-group-heading]]:mb-3 [&_[cmdk-group-heading]]:mt-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-white/30"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <Command.Item
                  key={s.slug}
                  value={[
                    s.name,
                    s.description,
                    s.category || '',
                    ...(s.tags || []),
                    ...(s.triggers || []),
                  ].join(' ')}
                  className="!block !p-0 !bg-transparent data-[selected=true]:!bg-transparent"
                  onSelect={() => {
                    // no-op: navigation handled by the SkillCard's Link
                  }}
                >
                  <SkillCard skill={s} />
                </Command.Item>
              ))}
            </div>
          </Command.Group>
        ))}
      </Command.List>
    </Command>
  );
}
