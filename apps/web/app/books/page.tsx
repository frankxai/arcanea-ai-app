import Link from 'next/link';
import { getSagaBooks, getAllSeries } from '@/lib/saga/loader';
import type { SagaBook, BookSeries } from '@/lib/saga/loader';
import {
  FEATURED_PASSAGES,
  CHRONICLE_BOOKS,
  ACADEMIES,
  REFERENCE_DOCS,
  READING_PATHS,
} from './books-data';
import { SeriesCard } from './components/series-card';
import { BookCard } from './components/book-card';

// ============================================================
// PAGE
// ============================================================

export default async function BooksPage() {
  // Load real book data server-side (falls back gracefully if files absent)
  let realBooks: SagaBook[] = [];
  try {
    realBooks = await getSagaBooks();
  } catch {
    // Filesystem may not be available in all environments
  }

  // Load all series for the multiverse section
  let allSeries: BookSeries[] = [];
  try {
    allSeries = await getAllSeries();
  } catch {
    // Filesystem may not be available in all environments
  }

  // Exclude the main Chronicles series from the multiverse grid (it has its own section)
  const multiverseSeries = allSeries.filter(s => s.id !== 'chronicles');

  // Merge real word counts into CHRONICLE_BOOKS if available
  const enrichedBooks = CHRONICLE_BOOKS.map((cb) => {
    const real = realBooks.find((r) => r.id === cb.id);
    if (real && real.wordCount > 0) {
      return {
        ...cb,
        wordCount: `~${Math.round(real.wordCount / 1000)}K`,
        chapterCount: real.chapterCount > 0 ? real.chapterCount : cb.chapterCount,
      };
    }
    return cb;
  });

  const [book1, book2, ...laterBooks] = enrichedBooks;

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white">

      {/* ================================================================
          AMBIENT BACKGROUND
      ================================================================ */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[15%] top-[5%] h-[600px] w-[600px] rounded-full bg-[#00bcd4]/4 blur-[160px]" />
        <div className="absolute right-[10%] top-[35%] h-[500px] w-[500px] rounded-full bg-[#0d47a1]/6 blur-[140px]" />
        <div className="absolute bottom-[20%] left-[40%] h-[400px] w-[400px] rounded-full bg-[#7b1fa2]/4 blur-[120px]" />
      </div>

      {/* ================================================================
          HERO
      ================================================================ */}
      <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#06101a] to-[#0a0a0f]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,188,212,0.09)_0%,transparent_70%)]" aria-hidden="true" style={{ animation: 'water-flow 12s ease-in-out infinite' }} />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.35em] text-[#00bcd4]/70">The Arcanea Universe</p>
          <h1 className="font-display text-5xl font-bold tracking-tight text-white/95 md:text-6xl lg:text-7xl leading-[1.05]">The Library of Arcanea</h1>
          <p className="mt-5 font-mono text-sm text-white/60 tracking-wide">486,000+ words across the Arcanean multiverse</p>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">Enter seeking. Leave transformed. Return whenever needed.</p>

          <div className="mx-auto mt-10 flex w-48 items-center gap-3 text-[#00bcd4]/20" aria-hidden="true">
            <span className="h-px flex-1 bg-current" />
            <span className="font-mono text-[10px] tracking-[0.3em]">&#9672;</span>
            <span className="h-px flex-1 bg-current" />
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#chronicles" className="inline-flex items-center gap-2 rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 px-8 py-3.5 text-sm font-semibold text-[#00bcd4] transition-all hover:border-[#00bcd4]/50 hover:bg-[#00bcd4]/18 hover:shadow-[0_0_32px_rgba(0,188,212,0.15)]">
              Begin Reading
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </a>
            <Link href="/books/docs/founding-myths" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white/65 transition-all hover:border-white/30 hover:text-white/85">
              Read the Myths
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
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#00bcd4]/70">Main Series</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white/90 md:text-4xl">Chronicles of Arcanea</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/65">
            A ten-book epic following Kael and the Five-Fold Five as they navigate the politics, magic, and ancient darkness of the Arcanean world.
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

        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">Books 6-10 in development</p>
      </section>

      {/* ================================================================
          THE ARCANEA MULTIVERSE
      ================================================================ */}
      {multiverseSeries.length > 0 && (
        <section id="multiverse" className="relative mx-auto max-w-6xl px-6 py-24">
          <div className="mb-16 flex items-center gap-4" aria-hidden="true">
            <span className="h-px flex-1 bg-white/6" />
            <div className="text-center">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#00bcd4]/70">Expanded Universe</p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white/90 md:text-4xl">The Arcanea Multiverse</h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/65">
                Beyond the Chronicles, the world keeps expanding. Crews, dragon-riders, Dungeon divers, Gate-Touched survivors, and the voices of those the main story calls enemies.
              </p>
            </div>
            <span className="h-px flex-1 bg-white/6" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {multiverseSeries.map(series => (
              <SeriesCard key={series.id} series={series} />
            ))}
          </div>
        </section>
      )}

      {/* ================================================================
          FEATURED PASSAGES
      ================================================================ */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#00bcd4]/[0.03] to-transparent" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-6">
          <div className="mb-12 flex items-center gap-4">
            <span className="h-px flex-1 bg-white/8" aria-hidden="true" />
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/50">From the Pages</p>
            <span className="h-px flex-1 bg-white/8" aria-hidden="true" />
          </div>

          <div className="space-y-16">
            {FEATURED_PASSAGES.map((passage, i) => (
              <blockquote key={i} className="group relative pl-6">
                <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[#00bcd4]/40 via-[#00bcd4]/20 to-transparent" aria-hidden="true" />
                <p className="font-serif text-lg leading-[1.85] text-white/60 transition-colors duration-500 group-hover:text-white/80 md:text-xl">
                  &ldquo;{passage.text}&rdquo;
                </p>
                <footer className="mt-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/60">{passage.chapter}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">{passage.book}</p>
                  </div>
                  <Link href={passage.href} className="shrink-0 rounded-full border border-[#00bcd4]/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#00bcd4]/70 transition-all hover:border-[#00bcd4]/50 hover:text-[#00bcd4]">
                    Read chapter
                  </Link>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          READING PATHS
      ================================================================ */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#00bcd4]/70">Choose Your Entry</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white/90">Reading Paths</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/65">Every gate into the world is the right one. Follow the thread that calls to you.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {READING_PATHS.map((path) => (
            <Link key={path.href} href={path.href} className="group relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] p-6 transition-all hover:border-[#00bcd4]/25 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(0,188,212,0.06)]">
              <span className="mb-4 block font-mono text-2xl text-[#00bcd4]/40 transition-colors group-hover:text-[#00bcd4]/70" aria-hidden="true">{path.icon}</span>
              <h3 className="mb-2 text-sm font-semibold text-white/80 transition-colors group-hover:text-white/95">{path.label}</h3>
              <p className="text-xs leading-relaxed text-white/60">{path.description}</p>
              <svg className="absolute right-5 top-5 h-4 w-4 text-white/15 transition-all group-hover:translate-x-0.5 group-hover:text-[#00bcd4]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
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
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#00bcd4]/70">The World</p>
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
          REFERENCE LIBRARY
      ================================================================ */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#00bcd4]/70">Deep Reference</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white/90">The Reference Library</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/65">Everything that exists beyond the novels. The bones of the world made visible.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REFERENCE_DOCS.map((doc) => (
            <Link key={doc.slug} href={`/books/docs/${doc.slug}`} className="group flex flex-col rounded-xl border border-white/7 bg-white/[0.02] p-5 transition-all hover:border-white/14 hover:bg-white/[0.04]">
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/25">{doc.category}</span>
                <span className="font-mono text-[10px] text-white/20">{doc.readTime} read</span>
              </div>
              <h3 className="mb-2 text-sm font-semibold text-white/75 transition-colors group-hover:text-white/95">{doc.title}</h3>
              <p className="flex-1 text-xs leading-relaxed text-white/60">{doc.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-[10px] text-white/20">{doc.wordCount}</span>
                <svg className="h-3.5 w-3.5 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:text-[#00bcd4]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================================================================
          FOOTER CTA
      ================================================================ */}
      <section className="relative overflow-hidden py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,188,212,0.07)_0%,transparent_70%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <span className="mb-6 block font-mono text-4xl text-[#00bcd4]/30" aria-hidden="true">&#9672;</span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white/92 md:text-5xl">Your Gate Awaits</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/65 md:text-lg">
            Every element, every Academy, every Gate — they all begin with a single story about a lighthouse keeper who watched a strange storm.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/books/book1/chapter-01-the-first-spark" className="inline-flex items-center gap-2 rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 px-8 py-4 text-sm font-semibold text-[#00bcd4] transition-all hover:border-[#00bcd4]/50 hover:bg-[#00bcd4]/18 hover:shadow-[0_0_40px_rgba(0,188,212,0.18)]">
              Read Chapter One
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/books/book1" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-4 text-sm font-medium text-white/65 transition-all hover:border-white/20 hover:text-white/85">
              Browse Book One
            </Link>
          </div>
          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
            Enter seeking &nbsp;&middot;&nbsp; Leave transformed &nbsp;&middot;&nbsp; Return whenever needed
          </p>
        </div>
      </section>
    </div>
  );
}
