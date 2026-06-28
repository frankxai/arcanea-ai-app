// Scene 4 — one OS, three worlds. Demonstrates reuse-vs-unique: the same
// system, bound to three brand token sources. Color/border hover only
// (no scale-spam). Server-rendered.

const WORLDS = [
  {
    name: 'Starlight',
    line: 'Nocturnal intelligence lab. Sovereign, orbital, quiet power.',
    accent: '#8ab4ff',
  },
  {
    name: 'Arcanea',
    line: 'Mythic creative OS. AI-lab premium, mythology in the words.',
    accent: '#00bcd4',
  },
  {
    name: 'FrankX',
    line: 'Executive command layer. Sharp, decisive, tactical.',
    accent: '#ffd700',
  },
];

export function WebOsWorlds() {
  return (
    <section className="relative w-full py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-xs tracking-widest uppercase text-aquamarine mb-4">
          One OS, three worlds
        </p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary max-w-2xl leading-[1.1] mb-16">
          Shared grammar. Unmistakable identities.
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {WORLDS.map((w) => (
            <div
              key={w.name}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 transition-colors duration-300 hover:bg-white/[0.05] hover:border-white/[0.12]"
            >
              <span
                className="mb-6 block h-8 w-8 rounded-full transition-transform duration-300"
                style={{ background: `radial-gradient(circle at 30% 30%, ${w.accent}, transparent 70%)` }}
                aria-hidden="true"
              />
              <h3 className="font-display text-xl text-text-primary mb-2">{w.name}</h3>
              <p className="font-body text-sm text-text-secondary leading-relaxed">{w.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
