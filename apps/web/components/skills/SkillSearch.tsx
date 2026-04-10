'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Skill } from '@/lib/skills/loader';
import SkillCard from './SkillCard';

interface SkillSearchProps {
  skills: Skill[];
  categories: string[];
}

const DEBOUNCE_MS = 300;

export default function SkillSearch({ skills, categories }: SkillSearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Debounce the query
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return skills.filter((s) => {
      if (activeCategory && (s.category || '') !== activeCategory) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        s.name,
        s.description,
        s.category || '',
        ...(s.tags || []),
        ...(s.triggers || []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [skills, debouncedQuery, activeCategory]);

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills by name, description, or tag..."
          className="w-full rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm pl-11 pr-4 py-3 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#00bcd4]/40 transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
            aria-label="Clear search"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              activeCategory === null
                ? 'bg-[#00bcd4]/15 border-[#00bcd4]/40 text-[#00bcd4]'
                : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:text-white/80 hover:border-white/20'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCategory(c)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                activeCategory === c
                  ? 'bg-[#00bcd4]/15 border-[#00bcd4]/40 text-[#00bcd4]'
                  : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:text-white/80 hover:border-white/20'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="mb-4 text-xs text-white/30">
        {filtered.length} {filtered.length === 1 ? 'skill' : 'skills'}
        {debouncedQuery && ` matching "${debouncedQuery}"`}
        {activeCategory && ` in ${activeCategory}`}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <SkillCard key={s.slug} skill={s} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-white/30 text-sm">
          No skills match your search.
        </div>
      )}
    </div>
  );
}
