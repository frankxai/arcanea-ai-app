'use client';

import type { EcosystemNode } from '@/lib/ecosystem/derived';

const GATES: Array<EcosystemNode['gate']> = [
  'source',
  'form',
  'pattern',
  'voice',
  'vision',
  'story',
  'world',
  'soul',
  'unity',
  'mastery',
];
const HEMISPHERES: Array<EcosystemNode['hemisphere']> = ['arc', 'nea', 'seam'];
const STATUSES: Array<EcosystemNode['status']> = [
  'built',
  'shipped',
  'wip',
  'orphan',
  'sunset',
  'external',
];

export interface FilterState {
  status: 'all' | EcosystemNode['status'];
  hemisphere: 'all' | EcosystemNode['hemisphere'];
  gate: 'all' | EcosystemNode['gate'];
}

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

export function FilterBar({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select
        label="Status"
        value={value.status}
        options={['all', ...STATUSES]}
        onChange={(v) => onChange({ ...value, status: v as FilterState['status'] })}
      />
      <Select
        label="Hemisphere"
        value={value.hemisphere}
        options={['all', ...HEMISPHERES]}
        onChange={(v) => onChange({ ...value, hemisphere: v as FilterState['hemisphere'] })}
      />
      <Select
        label="Gate"
        value={value.gate}
        options={['all', ...GATES]}
        onChange={(v) => onChange({ ...value, gate: v as FilterState['gate'] })}
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-zinc-400">
      <span>{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/[0.03] border border-white/[0.08] rounded-md px-2.5 py-2 min-h-[44px] text-zinc-200"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
