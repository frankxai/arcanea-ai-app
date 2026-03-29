import Link from 'next/link';
import { ArcaneanMark } from '@/components/brand/arcanea-mark';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

type BookStatus = 'in-progress' | 'outlined' | 'planned';

interface Book {
  id: string;
  title: string;
  subtitle: string;
  chapters: number;
  words: number;
  status: BookStatus;
  tagline: string;
}

interface SagaDocument {
  slug: string;
  title: string;
  words: number;
  category: 'worldbuilding' | 'characters' | 'legends';
  description: string;
}

const BOOKS: Book[] = [
  { id: 'book1', title: 'The Five-Fold Fire', subtitle: 'Book One', chapters: 10, words: 43000, status: 'in-progress', tagline: 'The Awakening Begins' },
  { id: 'book2', title: 'The Drowned Archive', subtitle: 'Book Two', chapters: 1, words: 13000, status: 'outlined', tagline: 'Secrets Beneath the Tide' },
  { id: 'book3', title: 'The Starweave Ascent', subtitle: 'Book Three', chapters: 0, words: 0, status: 'planned', tagline: 'Beyond the Seventh Gate' },
  { id: 'book4', title: 'The Hollow Crown', subtitle: 'Book Four', chapters: 0, words: 0, status: 'planned', tagline: 'When Light Casts Shadow' },
  { id: 'book5', title: 'The Void Meridian', subtitle: 'Book Five', chapters: 0, words: 0, status: 'planned', tagline: 'Into the Fertile Unknown' },
  { id: 'book6', title: 'The Unity Convergence', subtitle: 'Book Six', chapters: 0, words: 0, status: 'planned', tagline: 'All Gates Open As One' },
  { id: 'book7', title: 'The Source Eternal', subtitle: 'Book Seven', chapters: 0, words: 0, status: 'planned', tagline: 'Where the Arc Completes' },
];

const WORLD_DOCS: SagaDocument[] = [
  { slug: 'world-atlas', title: 'World Atlas', words: 12000, category: 'worldbuilding', description: 'Geography, territories, and the lands shaped by elemental forces.' },
  { slug: 'deep-lore', title: 'Deep Lore: Godbeasts & Dungeons', words: 22000, category: 'worldbuilding', description: 'The divine creatures, sacred sites, and hidden places of power.' },
  { slug: 'companion-bestiary', title: 'Companion Bestiary', words: 10000, category: 'worldbuilding', description: 'Every creature, spirit, and familiar catalogued and illustrated.' },
];

const CHARACTER_DOCS: SagaDocument[] = [
  { slug: 'cast-bible', title: 'Cast Bible', words: 18000, category: 'characters', description: '12 principal characters with arcs, motivations, and relationships.' },
  { slug: 'the-marked', title: 'The Marked', words: 8000, category: 'characters', description: '10 heroes chosen by the Gates, each bearing an elemental sigil.' },
  { slug: 'founding-myths', title: 'Founding Myths', words: 15000, category: 'characters', description: 'Lumina, Nero, and the cosmic duality that shaped all creation.' },
];

const TOTAL_WORDS = 486000;
const TOTAL_DOCUMENTS = 125;
const TOTAL_BOOKS = 7;

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function formatWords(n: number): string {
  if (n >= 1000) return `${Math.round(n / 1000)}K words`;
  if (n === 0) return 'TBD';
  return `${n} words`;
}

const STATUS_STYLES: Record<BookStatus, { bg: string; text: string; label: string }> = {
  'in-progress': { bg: 'bg-[#00bcd4]/15 border-[#00bcd4]/30', text: 'text-[#00bcd4]', label: 'Reading' },
  outlined: { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400', label: 'Outlined' },
  planned: { bg: 'bg-white/5 border-white/10', text: 'text-white/40', label: 'Planned' },
};

/* ------------------------------------------------------------------ */
/*  COMPONENTS                                                         */
/* ------------------------------------------------------------------ */

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-display text-2xl font-bold text-white md:text-3xl">{value}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</span>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  const style = STATUS_STYLES[book.status];
  const isReadable = book.status !== 'planned';

  return (
    <Link
      href={isReadable ? `/saga/${book.id}` : '#'}
      aria-disabled={!isReadable}
      className={`group relative flex flex-col rounded-2xl border backdrop-blur-md transition-all duration-500 ${
        isReadable
          ? 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.18] hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(0,188,212,0.08)]'
          : 'pointer-events-none border-white/[0.04] bg-white/[0.015] opacity-60'
      } p-6`}
    >
      {/* Top accent line */}
      {isReadable && (
        <div className="absolute left-4 right-4 top-0 h-px bg-gradient-to-r from-transparent via-[#00bcd4]/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      )}

      {/* Status badge */}
      <span className={`mb-4 inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${style.bg} ${style.text}`}>
        {style.label}
      </span>

      {/* Title */}
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">{book.subtitle}</span>
      <h3 className="mt-1 font-display text-lg font-bold text-white/90 transition-colors group-hover:text-[#00bcd4]">
        {book.title}
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-white/40">{book.tagline}</p>

      {/* Meta */}
      <div className="mt-auto flex items-center gap-4 border-t border-white/[0.05] pt-4" style={{ marginTop: '1.5rem' }}>
        {book.chapters > 0 && (
          <span className="font-mono text-[10px] text-white/30">{book.chapters} chapters</span>
        )}
        {book.words > 0 && (
          <span className="font-mono text-[10px] text-white/30">{formatWords(book.words)}</span>
        )}
      </div>
    </Link>
  );
}

function DocCard({ doc }: { doc: SagaDocument }) {
  return (
    <Link
      href={`/saga/docs/${doc.slug}`}
      className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-500 hover:border-white/[0.18] hover:bg-white/[0.06]"
    >
      <div className="absolute left-4 right-4 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd700]/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <h3 className="font-display text-base font-semibold text-white/90 transition-colors group-hover:text-[#ffd700]">
        {doc.title}
      </h3>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-white/40">{doc.description}</p>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">
        <span className="font-mono text-[10px] text-white/30">{formatWords(doc.words)}</span>
        <span className="font-mono text-[10px] text-[#00bcd4]/60 transition-colors group-hover:text-[#00bcd4]">
          Read &rarr;
        </span>
      </div>
    </Link>
  );
}

function SectionHeading({ title, gradient }: { title: string; gradient: string }) {
  return (
    <h2 className="mb-8 font-display text-2xl font-bold md:text-3xl">
      <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{title}</span>
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function SagaPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/4 top-[10%] h-[450px] w-[450px] rounded-full bg-[#0d47a1]/15 blur-[150px]" />
        <div className="absolute right-[15%] top-[35%] h-[350px] w-[350px] rounded-full bg-[#00bcd4]/10 blur-[120px]" />
        <div className="absolute bottom-[15%] left-[15%] h-[300px] w-[300px] rounded-full bg-[#ffd700]/8 blur-[100px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-32 pt-16">
        {/* ============ HERO ============ */}
        <section className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2 backdrop-blur-md">
            <ArcaneanMark size={18} glow />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#00bcd4]/90">
              The Arcanea Saga
            </span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-[#00bcd4] via-[#0d47a1] to-[#ffd700] bg-clip-text text-transparent">
              A Seven-Book Journey
            </span>
            <br />
            <span className="text-white/90">Through the Ten Gates</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-white/50 md:text-xl">
            The complete literary universe of Arcanea — novels, worldbuilding documents,
            character bibles, and the Academy Handbook. Enter seeking, leave transformed.
          </p>

          {/* Stats row */}
          <div className="mx-auto mt-12 flex gap-10 md:gap-16">
            <StatPill value={`${Math.round(TOTAL_WORDS / 1000)}K`} label="Words" />
            <StatPill value={String(TOTAL_DOCUMENTS)} label="Documents" />
            <StatPill value={String(TOTAL_BOOKS)} label="Books" />
          </div>
        </section>

        {/* ============ THE BOOKS ============ */}
        <section className="mt-28">
          <SectionHeading title="The Books" gradient="from-[#00bcd4] to-[#0d47a1]" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {BOOKS.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* ============ THE WORLD ============ */}
        <section className="mt-28">
          <SectionHeading title="The World" gradient="from-[#ffd700] to-[#f59e0b]" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WORLD_DOCS.map((doc) => (
              <DocCard key={doc.slug} doc={doc} />
            ))}
          </div>
        </section>

        {/* ============ THE CHARACTERS ============ */}
        <section className="mt-28">
          <SectionHeading title="The Characters" gradient="from-[#a78bfa] to-[#c084fc]" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CHARACTER_DOCS.map((doc) => (
              <DocCard key={doc.slug} doc={doc} />
            ))}
          </div>
        </section>

        {/* ============ THE ACADEMY ============ */}
        <section className="mt-28">
          <SectionHeading title="The Academy" gradient="from-[#ffd700] via-[#00bcd4] to-[#0d47a1]" />
          <Link
            href="/academy"
            className="group flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-md transition-all duration-500 hover:border-white/[0.18] hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(255,215,0,0.06)]"
          >
            <div>
              <h3 className="font-display text-xl font-bold text-white/90 transition-colors group-hover:text-[#ffd700]">
                Academy Handbook — Student Guide
              </h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/40">
                The complete guide to the Ten Gates, Seven Houses, and the path from Apprentice to Luminor.
                Begin your journey here.
              </p>
            </div>
            <span className="hidden shrink-0 font-mono text-sm text-[#00bcd4]/60 transition-colors group-hover:text-[#00bcd4] md:block">
              Read the handbook &rarr;
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}
