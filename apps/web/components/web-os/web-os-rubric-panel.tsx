// Scene 3 — proof / system. The constraints made visible: the taste rubric
// axes and the gate sequence in a single glass panel. Static, server-rendered,
// diagrammatic (not a wall of text). Canonical glass recipe.

const AXES = [
  'Composition',
  'Hierarchy',
  'Typography',
  'Color / material',
  'Motion',
  '3D integration',
  'Brand specificity',
  'Originality',
  'Polish',
  'Performance',
];

const GATES = [
  { k: 'Plan', v: 'design review · AI-slop check' },
  { k: 'Build', v: 'taste rubric ≥ target' },
  { k: 'Ship', v: 'screens · Lighthouse · grep' },
];

export function WebOsRubricPanel() {
  return (
    <section className="relative w-full py-24 px-6">
      <div className="max-w-5xl mx-auto rounded-3xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-8 sm:p-12">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-aquamarine mb-4">
              The rubric
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-text-primary mb-8 leading-tight">
              Ten axes, scored 1&ndash;5. A flagship targets four everywhere, five on its focal axis.
            </h2>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              {AXES.map((a) => (
                <li key={a} className="flex items-center gap-3 font-body text-sm text-text-secondary">
                  <span className="h-1 w-1 rounded-full bg-aquamarine" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:border-l lg:border-white/[0.06] lg:pl-12">
            <p className="font-mono text-xs tracking-widest uppercase text-aquamarine mb-4">
              The gates
            </p>
            <ol className="flex flex-col gap-6">
              {GATES.map((g, i) => (
                <li key={g.k} className="flex gap-4">
                  <span className="font-mono text-sm text-text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="font-display text-base text-text-primary">{g.k}</div>
                    <div className="font-body text-sm text-text-secondary">{g.v}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
