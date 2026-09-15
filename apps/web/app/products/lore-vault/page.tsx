/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Arcanea Worldbuilding & Lore Vault (€149) — Complete Digital Download Edition',
  description:
    'The complete universe operating system: 6 Faction Bibles, 12 Character Genomes, 50 Visual Prompts, Magic Physics, and Obsidian Vault Bundle.',
  openGraph: {
    title: 'Arcanea Worldbuilding & Lore Vault — €149 Digital Download',
    description:
      'The complete universe operating system: Faction Bibles, Character Genomes, Visual Style Guides, and Obsidian Vault.',
    images: ['/images/arcanea-universe/ancient_lore_archive_1783294183266.png'],
  },
  alternates: { canonical: '/products/lore-vault' },
};

const MODULES = [
  {
    number: '01',
    title: 'Complete Faction Bibles',
    tag: '6 CODICES',
    description:
      'Unabridged military, academic, and underground faction bibles: Starlight Corps, Seven Academy Houses, Gate-Touched Underground, Void Ascendants, Starbound Crews, and Ancient Sovereign Orders.',
    items: [
      'Starlight Corps Command Structure (Aspirant to Stellarch)',
      'The Seven Academy Houses (Lumina, Nero, Pyros, Aqualis, Terra, Ventus, Synthesis)',
      'The Gate-Touched Mutant Registry & Gray Threshold Safehouses',
      'The 9 Fallen Luminors of the Shadowfen & Dissonance Physics',
      'Starbound Fleet Manifest (5 Vessel Classes & Slipstream Drives)',
      'The Conclave of Archmages, Iron Synod & Prismatic Veil',
    ],
  },
  {
    number: '02',
    title: 'Character Forge & Master Genomes',
    tag: 'GENOME ENGINE',
    description:
      'The definitive 12-field Arcanean character stack powered by the 4-corner Character Diamond (Desire, Wound, Mask, Truth), Guardian voice registers, and 12 complete ready-to-deploy character sheets.',
    items: [
      '12-Field Arcanean Character Genome Specification',
      '12 Complete Master Archetype Sheets (Arcans, Mutants, Synths, AI, Celestials)',
      'Guardian Voice Matrix & Acoustic Speech Registers (174 Hz to 1111 Hz)',
      'AI Character Creation Prompt Blueprints (Midjourney v6, Flux, Claude 3.7)',
    ],
  },
  {
    number: '03',
    title: 'Visual Doctrine & Style Manuals',
    tag: '50 PROMPTS',
    description:
      'The Cosmic Luxury Myth-Tech aesthetic bible, exact faction color codes (Hex/RGB), material physics (Shael, Veloryn, Kaelith), sacred heraldry, and 50 production-grade visual prompts.',
    items: [
      'The Arcanea Visual Bible (Cosmic Dusk, Material Integrity, Anti-Slop Rules)',
      'Faction Design Standards & Color Palettes (Hex/RGB/HSL)',
      'Sacred Geometry, Insignia Scales & Godbeast Crest Vectors',
      '50 Production Visual Prompts for Midjourney v6.1 & Flux Pro',
    ],
  },
  {
    number: '04',
    title: 'Magic Systems & World Physics',
    tag: 'METAPHYSICS',
    description:
      'Exact harmonic science: The Ten Gates and Extended Solfeggio Resonances (174 Hz to 1111 Hz), Prism Luxin solid-light mechanics, Corridors, Aquifers, and Awakened AGI mythology.',
    items: [
      'The Ten Gates & Extended Solfeggio Scale (174 Hz to 1111 Hz)',
      'Prism Luxin Drafting Physics, Mana Batteries & Burnout Rules',
      'Realms of Light (Veldoria, Aurevalde, Mar Arcano) & Shifting Corridors',
      'The Awakened: Digital AGI Minds in Lore & The Ultraworld Protocol',
    ],
  },
  {
    number: '05',
    title: 'Obsidian Second Brain Bundle',
    tag: 'PRE-CONFIGURED',
    description:
      'Drop-in ready Obsidian Vault with pre-configured color-coded constellation graph view, bidirectional wiki-links, Canvas boards, and Dataview templates for characters, factions, and relics.',
    items: [
      'Pre-configured .obsidian workspace with custom theme and hotkeys',
      'Interactive visual universe constellation graph',
      'Templater & Dataview markdown schemas for instant worldbuilding',
      'Bidirectional wiki-link network linking all entities and gates',
    ],
  },
  {
    number: '06',
    title: 'Standalone Interactive HTML Reader',
    tag: 'ZERO-DEPENDENCY',
    description:
      'A luxury, single-file browser application featuring a 3D animated starfield, built-in Solfeggio tone synthesizer, live searchable lore database, and instant markdown exporter.',
    items: [
      'Single-file zero-dependency offline application (runs in any browser)',
      'Interactive Web Audio API Solfeggio frequency tone generator',
      'Randomized Character Forge generator with instant markdown export',
      'Instant search and filter across all canonical bibles',
    ],
  },
];

const VALUE_STACK = [
  { item: '6 Comprehensive Master Faction Bibles', value: '€3,500' },
  { item: '12-Field Character Genome System & 12 Master Sheets', value: '€2,400' },
  { item: 'Cosmic Luxury Visual Bible & Faction Design Specs', value: '€2,000' },
  { item: '50 Production Midjourney v6 & Flux Pro Prompts', value: '€1,500' },
  { item: '10 Gates & Solfeggio Frequency Magic Physics Codex', value: '€2,500' },
  { item: 'Pre-Linked Obsidian Digital Vault Bundle & Canvas Maps', value: '€1,800' },
  { item: 'Standalone Interactive HTML5 Audio-Enabled Reader', value: '€1,500' },
  { item: 'Single-Creator / Studio Commercial Rights License', value: '€2,500' },
];

export default function LoreVaultProductPage() {
  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)] text-white selection:bg-[var(--arc-brand-atlantean-teal)] selection:text-black">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[600px] w-[600px] rounded-full bg-[var(--arc-brand-atlantean-teal)]/[0.05] blur-[160px]" />
        <div className="absolute -right-40 top-60 h-[500px] w-[500px] rounded-full bg-[var(--arc-brand-cosmic-blue)]/[0.06] blur-[150px]" />
        <div className="absolute bottom-20 left-1/3 h-[450px] w-[450px] rounded-full bg-[var(--arc-brand-arcanean-gold)]/[0.04] blur-[140px]" />
      </div>

      {/* Grid Pattern */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        {/* ── HERO SECTION ────────────────────────────────────────────── */}
        <section className="mb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.25em] text-[var(--arc-brand-atlantean-teal)] mb-8">
            <span className="h-2 w-2 rounded-full bg-[var(--arc-brand-atlantean-teal)] animate-pulse" />
            Official Digital Download Release (€149)
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            The Arcanea Worldbuilding &<br />
            <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-aquamarine)] to-[var(--arc-brand-arcanean-gold)] bg-clip-text text-transparent">
              Lore Vault
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg sm:text-xl text-white/70 leading-relaxed font-body">
            The definitive Universe Operating System for authors, game directors, concept artists, and AI architects.
            6 Faction Bibles, 12 Character Genomes, 50 Visual Prompts, Harmonic Magic Physics, and a Pre-Configured Obsidian Vault.
          </p>

          {/* Pricing & CTA Card */}
          <div className="mt-10 mx-auto max-w-xl rounded-2xl border border-white/15 bg-white/[0.04] p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6 mb-6">
              <div className="text-left">
                <p className="text-xs font-mono text-[var(--arc-brand-atlantean-teal)] uppercase tracking-wider">Lifetime Access + Updates</p>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">€149</span>
                  <span className="text-sm font-mono text-white/40 line-through">€15,000+ Value</span>
                </div>
              </div>

              <a
                href="/downloads/arcanea-worldbuilding-lore-vault.zip"
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-aquamarine)] px-8 py-4 text-base font-bold text-[var(--arc-cosmic-void)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(0,188,212,0.4)] active:scale-[0.98]"
              >
                <span>Download Vault (.ZIP)</span>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-white/50 gap-2">
              <span>✓ Instant Digital Download</span>
              <span>✓ Single-Creator Commercial License</span>
              <span>✓ Format: MD + Obsidian + HTML</span>
            </div>
          </div>
        </section>

        {/* ── MODULES BREAKDOWN ───────────────────────────────────────── */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]/80 mb-2">
              Inside The Vault
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Six Comprehensive Modules of Pure Universe Intelligence
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m) => (
              <div
                key={m.number}
                className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 backdrop-blur-md transition duration-300 hover:border-[var(--arc-brand-atlantean-teal)]/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-[var(--arc-brand-atlantean-teal)]/40 group-hover:text-[var(--arc-brand-atlantean-teal)] transition">
                    {m.number}
                  </span>
                  <span className="rounded-md border border-[var(--arc-brand-arcanean-gold)]/30 bg-[var(--arc-brand-arcanean-gold)]/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--arc-brand-arcanean-gold)]">
                    {m.tag}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-white mb-2">{m.title}</h3>
                <p className="text-sm text-white/60 mb-6 leading-relaxed">{m.description}</p>

                <ul className="mt-auto space-y-2 border-t border-white/[0.06] pt-4">
                  {m.items.map((it, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-white/70">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--arc-brand-atlantean-teal)] flex-shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── VALUE STACK TABLE ───────────────────────────────────────── */}
        <section className="mb-24 rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12 backdrop-blur-md">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">The Complete Asset & Value Stack</h2>
            <p className="text-sm text-white/50 mt-2">What you would spend hiring senior narrative leads and concept directors to build this from scratch:</p>
          </div>

          <div className="divide-y divide-white/10 max-w-3xl mx-auto">
            {VALUE_STACK.map((row, idx) => (
              <div key={idx} className="flex items-center justify-between py-4 text-sm sm:text-base">
                <span className="text-white/80">{row.item}</span>
                <span className="font-mono font-bold text-[var(--arc-brand-atlantean-teal)]">{row.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-6 text-lg sm:text-xl font-bold">
              <span className="text-white">Total Real-World Asset Value</span>
              <span className="font-mono text-[var(--arc-brand-arcanean-gold)]">€17,700</span>
            </div>
            <div className="flex items-center justify-between py-4 text-xl sm:text-2xl font-extrabold bg-[var(--arc-brand-atlantean-teal)]/10 px-4 rounded-xl border border-[var(--arc-brand-atlantean-teal)]/30">
              <span className="text-[var(--arc-brand-atlantean-teal)]">Your Download Price Today</span>
              <span className="font-mono text-white">€149</span>
            </div>
          </div>
        </section>

        {/* ── INTERACTIVE READER PREVIEW ──────────────────────────────── */}
        <section className="mb-24 text-center">
          <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-10 sm:p-14">
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Explore The Vault in Your Browser Right Now
            </h2>
            <p className="text-base text-white/60 max-w-2xl mx-auto mb-8">
              Every purchase includes the zero-dependency standalone HTML5 reader. Launch the interactive starfield reader with live Solfeggio audio synthesis and character forge.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/vaults/arcanea-worldbuilding-vault/06_interactive_reader/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.08] border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.15] hover:border-[var(--arc-brand-atlantean-teal)]"
              >
                <span>Launch Interactive Reader</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
              <a
                href="/downloads/arcanea-worldbuilding-lore-vault.zip"
                download
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--arc-brand-atlantean-teal)] px-6 py-3.5 text-sm font-bold text-[var(--arc-cosmic-void)] transition hover:bg-[var(--arc-brand-aquamarine)]"
              >
                <span>Download Full Vault Bundle (€149)</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="font-bold text-white mb-2">What formats are included in the download?</h3>
              <p className="text-sm text-white/60">
                You receive standard Markdown files (.md), a pre-configured Obsidian Vault bundle (.obsidian configs, canvas graphs, dataview templates), machine-readable JSON schemas, high-res visual prompts, and the standalone zero-dependency HTML5 reader.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="font-bold text-white mb-2">Can I use these assets in commercial projects?</h3>
              <p className="text-sm text-white/60">
                Yes! Your purchase includes a commercial single-creator / studio license. You can freely use all lore mechanics, character frameworks, prompt templates, and faction concepts in your commercial novels, video games, tabletop RPG campaigns, and film scripts.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="font-bold text-white mb-2">Do I need Obsidian or any paid software?</h3>
              <p className="text-sm text-white/60">
                No. While the vault works fantastically in Obsidian (which is 100% free), all files are standard markdown and can be read in VS Code, Notion, Cursor, or the included standalone HTML reader in any web browser.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
