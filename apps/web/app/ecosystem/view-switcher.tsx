'use client';

export type EcosystemView = 'layered' | 'gates' | 'arc-nea';

interface Props {
  value: EcosystemView;
  onChange: (next: EcosystemView) => void;
}

const TABS: Array<{ id: EcosystemView; label: string }> = [
  { id: 'layered', label: 'Layered' },
  { id: 'gates', label: 'Ten Gates' },
  { id: 'arc-nea', label: 'Arc ⊕ Nea' },
];

export function ViewSwitcher({ value, onChange }: Props) {
  return (
    <div
      className="inline-flex bg-white/[0.03] border border-white/[0.08] rounded-full p-1"
      role="tablist"
      aria-label="Ecosystem view"
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={value === tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
            value === tab.id
              ? 'bg-teal-500/20 text-teal-200 border border-teal-500/40'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
