'use client';

import { MagnifyingGlass, CaretDown, Funnel } from '@/lib/phosphor-icons';
import type { CreationType, CreationStatus, ElementName, GateName } from '@/lib/database/types/api-responses';

// ── Constants ───────────────────────────────────────────────────────────────

const TYPE_TABS: { value: CreationType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'text', label: 'Stories' },
  { value: 'code', label: 'Code' },
  { value: 'image', label: 'Images' },
  { value: 'audio', label: 'Music' },
  { value: 'video', label: 'Video' },
  { value: 'mixed', label: 'Mixed' },
];

const ELEMENTS: ElementName[] = ['Fire', 'Water', 'Earth', 'Wind', 'Void', 'Spirit'];

const GATES: GateName[] = [
  'Foundation', 'Flow', 'Fire', 'Heart', 'Voice',
  'Sight', 'Crown', 'Starweave', 'Unity', 'Source',
];

const STATUSES: { value: CreationStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'popular', label: 'Most viewed' },
  { value: 'title', label: 'Alphabetical' },
];

// ── Props ───────────────────────────────────────────────────────────────────

export interface CreationFilterState {
  type: CreationType | 'all';
  element: ElementName | 'all';
  gate: GateName | 'all';
  status: CreationStatus | 'all';
  sort: string;
  search: string;
}

interface CreationFiltersProps {
  filters: CreationFilterState;
  onChange: (filters: CreationFilterState) => void;
  totalCount: number;
}

// ── Component ───────────────────────────────────────────────────────────────

export function CreationFilters({ filters, onChange, totalCount }: CreationFiltersProps) {
  const update = (partial: Partial<CreationFilterState>) => {
    onChange({ ...filters, ...partial });
  };

  const activeFilterCount = [
    filters.element !== 'all',
    filters.gate !== 'all',
    filters.status !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Type tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {TYPE_TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => update({ type: value })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filters.type === value
                ? 'bg-teal-400/10 text-teal-400 border border-teal-400/20'
                : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search + filters row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search creations..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/80 placeholder-white/25 focus:outline-none focus:border-teal-400/30 transition-colors"
          />
        </div>

        {/* Element filter */}
        <SelectFilter
          value={filters.element}
          onChange={(v) => update({ element: v as ElementName | 'all' })}
          options={[{ value: 'all', label: 'Element' }, ...ELEMENTS.map((e) => ({ value: e, label: e }))]}
        />

        {/* Gate filter */}
        <SelectFilter
          value={filters.gate}
          onChange={(v) => update({ gate: v as GateName | 'all' })}
          options={[{ value: 'all', label: 'Gate' }, ...GATES.map((g) => ({ value: g, label: g }))]}
        />

        {/* Status filter */}
        <SelectFilter
          value={filters.status}
          onChange={(v) => update({ status: v as CreationStatus | 'all' })}
          options={[{ value: 'all', label: 'Status' }, ...STATUSES]}
        />

        {/* Sort */}
        <SelectFilter
          value={filters.sort}
          onChange={(v) => update({ sort: v })}
          options={SORT_OPTIONS}
        />

        {/* Active filter indicator */}
        {activeFilterCount > 0 && (
          <button
            onClick={() => update({ element: 'all', gate: 'all', status: 'all' })}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-teal-400/70 hover:text-teal-400 hover:bg-teal-400/5 transition-colors"
          >
            <Funnel className="w-3 h-3" />
            Clear {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Select filter sub-component ─────────────────────────────────────────────

function SelectFilter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-7 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 focus:outline-none focus:border-teal-400/30 transition-colors cursor-pointer"
      >
        {options.map(({ value: v, label }) => (
          <option key={v} value={v} className="bg-[#16161e] text-white">
            {label}
          </option>
        ))}
      </select>
      <CaretDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
    </div>
  );
}
