/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import Link from 'next/link';
import {
  CHRONICLE_BOOKS,
  ACADEMIES,
  READING_PATHS,
} from './books-data';
import { BookCard } from './components/book-card';

// ============================================================
// PAGE
// ============================================================

export default function BooksPage() {
  const [book1, book2, ...laterBooks] = CHRONICLE_BOOKS;

  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)] text-white">

      {/* ================================================================
          AMBIENT BACKGROUND
      ================================================================ */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[15%] top-[5%] h-[600px] w-[600px] rounded-full bg-[var(--arc-brand-atlantean-teal)]/4 blur-[160px]" />
        <div className="absolute right-[10%] top-[35%] h-[500px] w-[500px] rounded-full bg-[var(--arc-brand-cosmic-blue)]/6 blur-[140px]" />
        <div className="absolute bottom-[20%] left-[40%] h-[400px] w-[400px] rounded-full bg-[var(--arc-brand-cosmic-blue)]/4 blur-[120px]" />
      </div>

      {/* ================================================================
          HERO
      ================================================================ */}
      <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--arc-cosmic-void)] via-[var(--arc-cosmic-void)] to-[var(--arc-cosmic-void)]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,188,212,0.09)_0%,transparent_70%)]" aria-hidden="true" style={{ animation: 'water-flow 12s ease-in-out infinite' }} />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.35em] text-[var(--arc-brand-atlantean-teal)]/70">The Arcanea Universe</p>
          <h1 className="font-display text-5xl font-bold tracking-tight text-white/95 md:text-6xl lg:text-7xl leading-[1.05]">Books & Story Development</h1>
          <p className="mt-5 font-mono text-sm text-white/60 tracking-wide">One release at a time · every status evidence-backed</p>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">Enter through story. The codex deepens what the story earns.</p>

          <div className="mx-auto mt-10 flex w-48 items-center gap-3 text-[var(--arc-brand-atlantean-teal)]/20" aria-hidden="true">
            <span className="h-px flex-1 bg-current" />
            <span className="font-mono text-[10px] tracking-[0.3em]">&#9672;</span>
            <span className="h-px flex-1 bg-current" />
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#chronicles" className="inline-flex items-center gap-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 px-8 py-3.5 text-sm font-semibold text-[var(--arc-brand-atlantean-teal)] transition-all hover:border-[var(--arc-brand-atlantean-teal)]/50 hover:bg-[var(--arc-brand-atlantean-teal)]/18 hover:shadow-[0_0_32px_rgba(0,188,212,0.15)]">
              View Release Plan
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </a>
            <Link href="/lore" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white/65 transition-all hover:border-white/30 hover:text-white/85">
              Explore the Lore
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2" aria-hidden="true">
          <div className="flex flex-col items-center gap-1.5 text-white/20">
            <div className="h-6 w-px bg-gradient-to-b from-transparent to-current" style={{ animation: 'float 2s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ================================================================
          CHRONICLES
      ================================================================ */}
      <section id="chronicles" className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]/70">Flagship Release</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white/90 md:text-4xl">The Godbeast Covenant</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/65">
            ARC-REL-001 centers Arion, Mera, and Emilia. The Dragonborne creative lane is greenlit for development; title clearance and story lock still precede publication.
          </p>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <BookCard book={book1} isFeature />
          <BookCard book={book2} isFeature />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {laterBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">ARC-REL-001 greenlit for development · story lock pending</p>
      </section>

      {/* ================================================================
          READING PATHS
      ================================================================ */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]/70">Choose Your Entry</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white/90">Reading Paths</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/65">Choose a verified public surface or inspect the current release plan.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {READING_PATHS.map((path) => (
            <Link key={path.href} href={path.href} className="group relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] p-6 transition-all hover:border-[var(--arc-brand-atlantean-teal)]/25 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(0,188,212,0.06)]">
              <span className="mb-4 block font-mono text-2xl text-[var(--arc-brand-atlantean-teal)]/40 transition-colors group-hover:text-[var(--arc-brand-atlantean-teal)]/70" aria-hidden="true">{path.icon}</span>
              <h3 className="mb-2 text-sm font-semibold text-white/80 transition-colors group-hover:text-white/95">{path.label}</h3>
              <p className="text-xs leading-relaxed text-white/60">{path.description}</p>
              <svg className="absolute right-5 top-5 h-4 w-4 text-white/15 transition-all group-hover:translate-x-0.5 group-hover:text-[var(--arc-brand-atlantean-teal)]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* ================================================================
          THE THREE ACADEMIES
      ================================================================ */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]/70">The World</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white/90">The Three Academies</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/65">Three institutions, three philosophies, one fracture running through all of them.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {ACADEMIES.map((academy) => (
            <div key={academy.name} className={`group relative overflow-hidden rounded-xl border bg-white/[0.02] p-7 transition-all duration-300 ${academy.borderClass} ${academy.glowClass}`}>
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-300 group-hover:opacity-100 ${academy.colorClass}`} aria-hidden="true" />
              <div className="relative z-10">
                <span className={`mb-5 block font-mono text-3xl ${academy.textAccent}/60`} aria-hidden="true">{academy.symbol}</span>
                <h3 className="font-display text-xl font-bold text-white/90">{academy.name}</h3>
                <p className={`mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] ${academy.textAccent}/50`}>{academy.location}</p>
                <p className={`mt-1 text-xs font-medium ${academy.textAccent}/60`}>{academy.element}</p>
                <blockquote className="mt-5 border-l border-white/10 pl-3">
                  <p className="text-xs leading-relaxed italic text-white/65">{academy.philosophy}</p>
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          FOOTER CTA
      ================================================================ */}
      <section className="relative overflow-hidden py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,188,212,0.07)_0%,transparent_70%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <span className="mb-6 block font-mono text-4xl text-[var(--arc-brand-atlantean-teal)]/30" aria-hidden="true">&#9672;</span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white/92 md:text-5xl">The next gate is story lock</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/65 md:text-lg">
            ARC-REL-001 has a greenlight, a governed story center, and an evidence plan. It is not a released novel until the manuscript, editorial, rights, production, and launch gates pass.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="#chronicles" className="inline-flex items-center gap-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 px-8 py-4 text-sm font-semibold text-[var(--arc-brand-atlantean-teal)] transition-all hover:border-[var(--arc-brand-atlantean-teal)]/50 hover:bg-[var(--arc-brand-atlantean-teal)]/18 hover:shadow-[0_0_40px_rgba(0,188,212,0.18)]">
              View ARC-REL-001
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/lore" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-4 text-sm font-medium text-white/65 transition-all hover:border-white/20 hover:text-white/85">
              Explore the Lore
            </Link>
          </div>
          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
            Story first &nbsp;&middot;&nbsp; Canon governed &nbsp;&middot;&nbsp; Release only with evidence
          </p>
        </div>
      </section>
    </div>
  );
}
