import Link from 'next/link';
import { getSagaBooks, getAllSeries } from '@/lib/saga/loader';
import type { SagaBook, BookSeries } from '@/lib/saga/loader';
import { GlowCard } from '@/components/saga/glow-card';

// ============================================================
// STATIC DATA
// ============================================================

const FEATURED_PASSAGES = [
  {
    text: 'The sea remembered things the town had forgotten. Kael knew this the way you know anything you\'ve never been taught — in the soles of the feet, in the way the back of the neck prickles before lightning, in the way the tide sometimes came in speaking a language older than words.',
    chapter: 'Chapter One: The Storm That Remembered',
    book: 'The Three Academies',
    href: '/books/book1/the-storm-that-remembered',
  },
  {
    text: 'He had been building alone his entire life. He built walls. He reinforced structures. Foundation was not about building alone. He had thought it was. He had needed it to be, because building alone meant the damage was contained. But a foundation without walls above it was just a floor. And walls without a foundation were just collapse waiting.',
    chapter: 'Chapter Ten: Foundation',
    book: 'The Three Academies',
    href: '/books/book1/the-foundation-opens',
  },
  {
    text: 'Aurora light shifted, a column of gold moving across the table between them. She picked up her fork and ate with the focused efficiency of someone who had decided that conversation was over for now. He was nineteen years old and he was very tired of already knowing what he was.',
    chapter: 'Chapter Three: The Crystalpeak',
    book: 'The Three Academies',
    href: '/books/book1/the-triennium',
  },
  {
    text: 'What had endured, he had learned on the fourth floor of a Dungeon that had been trying to break them, was not what any one person built. It was what they built together, each piece doing the work only that piece could do. You can rebuild. Takes time. But you can.',
    chapter: 'Chapter Ten: Foundation',
    book: 'The Three Academies',
    href: '/books/book1/the-foundation-opens',
  },
];

interface ChronicleBook {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'complete' | 'in-progress' | 'outlined' | 'planned';
  chapterCount: number;
  wordCount: string;
  firstChapter: string;
  gateSymbol: string;
}

const CHRONICLE_BOOKS: ChronicleBook[] = [
  {
    id: 'book1',
    title: 'The Three Academies',
    subtitle: 'Book One',
    description:
      'A stonemason\'s apprentice discovers they can channel all five elements — something unseen since the Dark Lord\'s fall ten thousand years ago. Recruited into an unprecedented joint session across all three Academies, Kael must navigate rivalries, ancient secrets, and the sealed darkness that seems to recognize them.',
    status: 'in-progress',
    chapterCount: 20,
    wordCount: '~75K',
    firstChapter: '/books/book1/the-storm-that-remembered',
    gateSymbol: '◈',
  },
  {
    id: 'book2',
    title: 'The Gate-Touched',
    subtitle: 'Book Two',
    description:
      'The Registry tracks every channeler in the realm — but not everyone wants to be found. As Gate-Touched manifest across Arcanea, Sable uncovers an Eldrian memory-vial that rewrites everything, Orin runs an underground railroad, and someone is erasing the evidence that Five-Fold channelers have existed before.',
    status: 'in-progress',
    chapterCount: 13,
    wordCount: '~50K',
    firstChapter: '/books/book2/chapter-01-the-registry',
    gateSymbol: '◇',
  },
  {
    id: 'book3',
    title: 'The Dragon War',
    subtitle: 'Book Three',
    description: 'A Dragon egg sings for the first time in a thousand years. Nations scramble to claim the hatching. Kael journeys to the Draconis Forge as Malachar\'s voice grows louder in the deep. What emerges from the egg is something no one predicted.',
    status: 'in-progress',
    chapterCount: 5,
    wordCount: '~20K',
    firstChapter: '/books/book3/chapter-01-embera',
    gateSymbol: '△',
  },
  {
    id: 'book4',
    title: 'The Heart of the Abyss',
    subtitle: 'Book Four',
    description: 'The Academy War erupts. Vesper discovers she is Malachar\'s descendant. Kael descends into the Shadowfen to confront what the Dark Lord left behind — and the Heart Gate demands the hardest thing: compassion for the unforgivable.',
    status: 'outlined',
    chapterCount: 0,
    wordCount: 'Outlined',
    firstChapter: '/books',
    gateSymbol: '♡',
  },
  {
    id: 'book5',
    title: 'The Voice Unheard',
    subtitle: 'Book Five',
    description: 'Darin reveals the Accord Conspiracy — the truth about the Ashwalker genocide that the Academies have hidden for ten thousand years. The Luminary falls. Kael gains the cursed gift of seeing across probability.',
    status: 'outlined',
    chapterCount: 0,
    wordCount: 'Outlined',
    firstChapter: '/books',
    gateSymbol: '◎',
  },
  {
    id: 'book6',
    title: 'The Sight Beyond',
    subtitle: 'Book Six',
    description: 'A seer dreams Malachar\'s memories. The prophecy beneath the Athenaeum surfaces. The cast must choose: know the future, or shape it blind.',
    status: 'planned',
    chapterCount: 0,
    wordCount: 'Planned',
    firstChapter: '/books',
    gateSymbol: '◐',
  },
  {
    id: 'book7',
    title: 'The Crown of Ashes',
    subtitle: 'Book Seven',
    description: 'The Throne of Shadows Dungeon offers Malachar\'s crown. In a refugee camp made from rubble, a child tugs Kael\'s sleeve and asks: "Can you fix it?" The Crown Gate opens. Not in glory. In exhaustion.',
    status: 'planned',
    chapterCount: 0,
    wordCount: 'Planned',
    firstChapter: '/books',
    gateSymbol: '♛',
  },
  {
    id: 'book8',
    title: 'The Starweave',
    subtitle: 'Book Eight',
    description: 'Malachar speaks his version of history. It is different. Terrifyingly plausible. The Gods\' greatest secret: what really happened at the Source Gate.',
    status: 'planned',
    chapterCount: 0,
    wordCount: 'Planned',
    firstChapter: '/books',
    gateSymbol: '✧',
  },
  {
    id: 'book9',
    title: 'The Unity War',
    subtitle: 'Book Nine',
    description: 'Malachar breaks free. The three Academies must unite for the first time in history. But it is not a war of armies — it is a war of ideas, and Malachar is the most eloquent being alive.',
    status: 'planned',
    chapterCount: 0,
    wordCount: 'Planned',
    firstChapter: '/books',
    gateSymbol: '⊕',
  },
  {
    id: 'book10',
    title: 'The Source',
    subtitle: 'Book Ten',
    description: 'At the end of all things, Kael stands before the Source Gate — the threshold that broke Malachar ten thousand years ago. Shinkami asks: "What do you seek?" The answer the entire series has been building toward.',
    status: 'planned',
    chapterCount: 0,
    wordCount: 'Planned',
    firstChapter: '/books',
    gateSymbol: '∞',
  },
];

interface AcademyCard {
  name: string;
  location: string;
  element: string;
  philosophy: string;
  colorClass: string;
  borderClass: string;
  glowClass: string;
  textAccent: string;
  symbol: string;
}

const ACADEMIES: AcademyCard[] = [
  {
    name: 'The Luminary',
    location: 'Crystalpeak',
    element: 'Light & Spirit',
    philosophy: '"Every soul carries a light that no darkness can extinguish — only dim."',
    colorClass: 'from-amber-900/30 via-yellow-900/20 to-transparent',
    borderClass: 'border-amber-500/20 hover:border-amber-400/40',
    glowClass: 'hover:shadow-[0_0_40px_rgba(251,191,36,0.12)]',
    textAccent: 'text-amber-400',
    symbol: '✦',
  },
  {
    name: 'The Draconis Forge',
    location: 'Mt. Pyralis',
    element: 'Fire & Earth',
    philosophy: '"Power without discipline is the flame that burns its own house. Master both."',
    colorClass: 'from-red-900/30 via-orange-900/20 to-transparent',
    borderClass: 'border-red-500/20 hover:border-red-400/40',
    glowClass: 'hover:shadow-[0_0_40px_rgba(239,68,68,0.12)]',
    textAccent: 'text-red-400',
    symbol: '◈',
  },
  {
    name: 'The Abyssal Athenaeum',
    location: "Thal'Maris",
    element: 'Water & Void',
    philosophy: '"Memory is the ocean. You do not own it — you are carried by it."',
    colorClass: 'from-blue-900/30 via-cyan-900/20 to-transparent',
    borderClass: 'border-cyan-500/20 hover:border-cyan-400/40',
    glowClass: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.12)]',
    textAccent: 'text-cyan-400',
    symbol: '〜',
  },
];

interface RefDoc {
  slug: string;
  title: string;
  category: string;
  description: string;
  wordCount: string;
  readTime: string;
}

const REFERENCE_DOCS: RefDoc[] = [
  {
    slug: 'world-atlas',
    title: 'World Atlas',
    category: 'The World',
    description: 'Geography, cities, and the physical structure of Arcanea.',
    wordCount: '~18K',
    readTime: '72 min',
  },
  {
    slug: 'deep-lore',
    title: 'Deep Lore',
    category: 'The World',
    description: 'Godbeasts, Dungeons, and the ancient forces beneath the surface.',
    wordCount: '~22K',
    readTime: '88 min',
  },
  {
    slug: 'companion-bestiary',
    title: 'Companion Bestiary',
    category: 'The World',
    description: 'Every creature, familiar, and bonded entity in the multiverse.',
    wordCount: '~14K',
    readTime: '56 min',
  },
  {
    slug: 'cast-bible',
    title: 'Cast of Characters',
    category: 'Characters',
    description: 'Full profiles for every named character across the series.',
    wordCount: '~31K',
    readTime: '124 min',
  },
  {
    slug: 'founding-myths',
    title: 'Founding Myths',
    category: 'Legends',
    description: 'The origin of Lumina, Nero, the Five Elements, and the Ten Gates.',
    wordCount: '~8K',
    readTime: '32 min',
  },
  {
    slug: 'series-bible',
    title: 'Series Bible',
    category: 'Reference',
    description: 'The complete series arc, themes, and narrative architecture.',
    wordCount: '~12K',
    readTime: '48 min',
  },
];

const READING_PATHS = [
  {
    label: 'Start the Journey',
    description: 'Begin from the very first page.',
    href: '/books/book1/the-storm-that-remembered',
    icon: '◈',
  },
  {
    label: 'Explore the Mythology',
    description: 'Lumina, Nero, and how the world was made.',
    href: '/books/docs/founding-myths',
    icon: '✦',
  },
  {
    label: 'Learn the Magic System',
    description: 'The Ten Gates, Five Elements, and Academy structure.',
    href: '/books/docs/student-guide',
    icon: '◇',
  },
  {
    label: 'Meet the Characters',
    description: 'Full profiles for the Five and everyone around them.',
    href: '/books/docs/cast-bible',
    icon: '◉',
  },
];

// ============================================================
// MULTIVERSE SERIES CONFIG (accent colors per series)
// ============================================================

interface SeriesAccent {
  border: string;
  hover: string;
  badge: string;
  badgeText: string;
  glow: string;
  symbol: string;
  topEdge: string;
}

const SERIES_ACCENTS: Record<string, SeriesAccent> = {
  starbound: {
    border: 'border-cyan-500/15 hover:border-cyan-400/30',
    hover: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.08)]',
    badge: 'bg-cyan-500/10 border-cyan-500/25',
    badgeText: 'text-cyan-400',
    glow: 'via-cyan-500/[0.03]',
    symbol: '✦',
    topEdge: 'from-transparent via-cyan-400/30 to-transparent',
  },
  dragonborne: {
    border: 'border-red-500/15 hover:border-red-400/30',
    hover: 'hover:shadow-[0_0_40px_rgba(239,68,68,0.08)]',
    badge: 'bg-red-500/10 border-red-500/25',
    badgeText: 'text-red-400',
    glow: 'via-red-900/[0.03]',
    symbol: '◈',
    topEdge: 'from-transparent via-red-400/30 to-transparent',
  },
  'dungeon-scrolls': {
    border: 'border-purple-500/15 hover:border-purple-400/30',
    hover: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.08)]',
    badge: 'bg-purple-500/10 border-purple-500/25',
    badgeText: 'text-purple-400',
    glow: 'via-purple-900/[0.03]',
    symbol: '◎',
    topEdge: 'from-transparent via-purple-400/30 to-transparent',
  },
  'gate-touched-files': {
    border: 'border-emerald-500/15 hover:border-emerald-400/30',
    hover: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.08)]',
    badge: 'bg-emerald-500/10 border-emerald-500/25',
    badgeText: 'text-emerald-400',
    glow: 'via-emerald-900/[0.03]',
    symbol: '◇',
    topEdge: 'from-transparent via-emerald-400/30 to-transparent',
  },
  'void-ascending': {
    border: 'border-violet-500/15 hover:border-violet-400/30',
    hover: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.08)]',
    badge: 'bg-violet-500/10 border-violet-500/25',
    badgeText: 'text-violet-400',
    glow: 'via-violet-900/[0.03]',
    symbol: '◐',
    topEdge: 'from-transparent via-violet-400/30 to-transparent',
  },
  companions: {
    border: 'border-amber-500/15 hover:border-amber-400/30',
    hover: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.08)]',
    badge: 'bg-amber-500/10 border-amber-500/25',
    badgeText: 'text-amber-400',
    glow: 'via-amber-900/[0.03]',
    symbol: '◉',
    topEdge: 'from-transparent via-amber-400/30 to-transparent',
  },
  sagas: {
    border: 'border-yellow-500/15 hover:border-yellow-400/30',
    hover: 'hover:shadow-[0_0_40px_rgba(234,179,8,0.08)]',
    badge: 'bg-yellow-500/10 border-yellow-500/25',
    badgeText: 'text-yellow-400',
    glow: 'via-yellow-900/[0.03]',
    symbol: '✧',
    topEdge: 'from-transparent via-yellow-400/30 to-transparent',
  },
};

const DEFAULT_ACCENT: SeriesAccent = {
  border: 'border-white/8 hover:border-white/18',
  hover: '',
  badge: 'bg-white/5 border-white/15',
  badgeText: 'text-white/45',
  glow: '',
  symbol: '◈',
  topEdge: 'from-transparent via-white/20 to-transparent',
};

const CONTENT_TYPE_LABELS: Record<BookSeries['contentType'], string> = {
  novel: 'Novel Series',
  novella: 'Novella Series',
  serial: 'Serial',
  anthology: 'Anthology',
  standalone: 'Standalones',
};

const SERIES_STATUS_STYLES: Record<BookSeries['status'], { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-emerald-500/10 border border-emerald-500/25', text: 'text-emerald-400', label: 'Active' },
  'in-progress': { bg: 'bg-[#00bcd4]/10 border border-[#00bcd4]/25', text: 'text-[#00bcd4]', label: 'In Progress' },
  planned: { bg: 'bg-white/5 border border-white/10', text: 'text-white/60', label: 'Coming Soon' },
};

/**
 * Maps a series ID to the [bookId] route segment used in /books/[bookId]/[chapterId].
 * Only needed when the series id differs from the registered bookId, or when a
 * multi-book series needs to route to one canonical entry-point bookId.
 */
const SERIES_BOOKID_MAP: Record<string, string> = {
  // 'sagas' series contains multiple standalone sagas; route to luminor-falling
  sagas: 'luminor-falling',
  // gate-touched-files loader uses 'gate-touched-files' as series id; bookId is 'gate-touched'
  'gate-touched-files': 'gate-touched',
};

function SeriesCard({ series }: { series: BookSeries }) {
  const accent = SERIES_ACCENTS[series.id] ?? DEFAULT_ACCENT;
  const statusStyle = SERIES_STATUS_STYLES[series.status];
  const hasContent = series.totalChapters > 0;

  // Build first-chapter href using the registered [bookId] for this series.
  // Single-book series: /books/<bookId>/<firstChapterSlug>
  // Multi-book or remapped series: use SERIES_BOOKID_MAP to find the correct bookId.
  let firstChapterHref: string | null = null;
  const bookId = SERIES_BOOKID_MAP[series.id] ?? series.id;
  for (const book of series.books) {
    if (book.firstChapterSlug) {
      firstChapterHref = `/books/${bookId}/${book.firstChapterSlug}`;
      break;
    }
  }

  return (
    <GlowCard
      className={`group overflow-hidden rounded-xl border bg-white/[0.025] transition-all duration-300 ${accent.border} ${accent.hover}`}
    >
      {/* Top edge glow */}
      {hasContent && (
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accent.topEdge}`}
          aria-hidden="true"
        />
      )}

      <div className="p-6">
        {/* Header row */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className={`font-mono text-2xl ${accent.badgeText}/40`} aria-hidden="true">
            {accent.symbol}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.label}
          </span>
        </div>

        {/* Content type */}
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
          {CONTENT_TYPE_LABELS[series.contentType]}
        </p>

        {/* Title */}
        <h3 className="font-display text-lg font-bold tracking-tight text-white/90">
          {series.title}
        </h3>
        <p className={`mt-0.5 text-[11px] ${accent.badgeText}/60`}>
          {series.subtitle}
        </p>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          {series.description}
        </p>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/50">
          {hasContent ? (
            <>
              <span>{series.totalChapters} chapter{series.totalChapters !== 1 ? 's' : ''}</span>
              <span className="text-white/20" aria-hidden="true">|</span>
              <span>~{Math.round(series.totalWordCount / 1000)}K words</span>
            </>
          ) : (
            <span>Coming soon</span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-5">
          {hasContent && firstChapterHref ? (
            <Link
              href={firstChapterHref}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all ${accent.badge} ${accent.badgeText} hover:opacity-80`}
            >
              Read Now
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/25">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </GlowCard>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

type BookStatus = 'complete' | 'in-progress' | 'outlined' | 'planned';

function StatusBadge({ status }: { status: BookStatus }) {
  const styles: Record<BookStatus, { bg: string; text: string; label: string }> = {
    complete: {
      bg: 'bg-emerald-500/15 border border-emerald-500/30',
      text: 'text-emerald-400',
      label: 'Complete',
    },
    'in-progress': {
      bg: 'bg-[#00bcd4]/10 border border-[#00bcd4]/25',
      text: 'text-[#00bcd4]',
      label: 'In Progress',
    },
    outlined: {
      bg: 'bg-amber-500/10 border border-amber-500/25',
      text: 'text-amber-400',
      label: 'Outlined',
    },
    planned: {
      bg: 'bg-white/5 border border-white/10',
      text: 'text-white/60',
      label: 'Coming Soon',
    },
  };

  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${s.bg} ${s.text}`}
    >
      {s.label}
    </span>
  );
}

// ============================================================
// BOOK CARD
// ============================================================

function BookCard({ book, isFeature = false }: { book: ChronicleBook; isFeature?: boolean }) {
  const isAvailable = book.status === 'complete' || book.status === 'in-progress';
  const isPartial = book.status === 'outlined';

  if (!isFeature && book.status === 'planned') {
    return (
      <GlowCard className="group overflow-hidden rounded-xl border border-white/6 bg-white/[0.02] p-5 transition-all">
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className="font-mono text-2xl text-white/10" aria-hidden="true">
            {book.gateSymbol}
          </span>
          <StatusBadge status={book.status} />
        </div>
        <h3 className="mb-1 text-sm font-semibold text-white/60">{book.title}</h3>
        <p className="text-[11px] text-white/50">{book.subtitle}</p>
        <p className="mt-3 text-xs leading-relaxed text-white/50">{book.description}</p>
      </GlowCard>
    );
  }

  return (
    <GlowCard
      className={`group overflow-hidden rounded-xl border bg-white/[0.03] transition-all duration-300 ${
        isFeature
          ? 'border-[#00bcd4]/15 hover:border-[#00bcd4]/30 hover:bg-white/[0.05] hover:shadow-[0_0_50px_rgba(0,188,212,0.08)]'
          : 'border-white/8 hover:border-white/15 hover:bg-white/[0.05]'
      }`}
    >
      {/* Subtle top edge glow for active books */}
      {isAvailable && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00bcd4]/40 to-transparent"
          aria-hidden="true"
        />
      )}

      <div className={`p-6 ${isFeature ? 'md:p-8' : ''}`}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <span
            className={`font-mono ${isFeature ? 'text-3xl text-[#00bcd4]/40' : 'text-xl text-[#00bcd4]/30'}`}
            aria-hidden="true"
          >
            {book.gateSymbol}
          </span>
          <StatusBadge status={book.status} />
        </div>

        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
          {book.subtitle}
        </p>
        <h3
          className={`font-display font-bold tracking-tight text-white/90 ${
            isFeature ? 'text-2xl md:text-3xl' : 'text-lg'
          }`}
        >
          {book.title}
        </h3>

        <p
          className={`mt-3 leading-relaxed text-white/65 ${isFeature ? 'text-sm md:text-base' : 'text-sm'}`}
        >
          {book.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/50">
          {book.chapterCount > 0 && <span>{book.chapterCount} chapters</span>}
          <span>{book.wordCount} words</span>
        </div>

        {(isAvailable || isPartial) && (
          <div className="mt-6">
            {isAvailable ? (
              <Link
                href={book.firstChapter}
                className="inline-flex items-center gap-2 rounded-full border border-[#00bcd4]/25 bg-[#00bcd4]/8 px-5 py-2.5 text-sm font-medium text-[#00bcd4] transition-all hover:border-[#00bcd4]/45 hover:bg-[#00bcd4]/15 hover:shadow-[0_0_24px_rgba(0,188,212,0.12)]"
              >
                {book.chapterCount >= 10 ? 'Read Now' : 'Continue Reading'}
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/8 px-5 py-2.5 text-sm font-medium text-amber-400/70">
                Outlined — Coming Soon
              </span>
            )}
          </div>
        )}
      </div>
    </GlowCard>
  );
}

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
          AMBIENT BACKGROUND — static CSS glows, no JS required
      ================================================================ */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[15%] top-[5%] h-[600px] w-[600px] rounded-full bg-[#00bcd4]/4 blur-[160px]" />
        <div className="absolute right-[10%] top-[35%] h-[500px] w-[500px] rounded-full bg-[#0d47a1]/6 blur-[140px]" />
        <div className="absolute bottom-[20%] left-[40%] h-[400px] w-[400px] rounded-full bg-[#7b1fa2]/4 blur-[120px]" />
      </div>

      {/* ================================================================
          HERO — Full viewport cinematic intro
      ================================================================ */}
      <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-24">
        {/* Animated gradient background */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#06101a] to-[#0a0a0f]"
          aria-hidden="true"
        />

        {/* Subtle animated top aurora */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,188,212,0.09)_0%,transparent_70%)]"
          aria-hidden="true"
          style={{ animation: 'water-flow 12s ease-in-out infinite' }}
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Eyebrow label */}
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.35em] text-[#00bcd4]/70">
            The Arcanea Universe
          </p>

          {/* Main title */}
          <h1 className="font-display text-5xl font-bold tracking-tight text-white/95 md:text-6xl lg:text-7xl leading-[1.05]">
            The Library of Arcanea
          </h1>

          {/* Word count subtitle */}
          <p className="mt-5 font-mono text-sm text-white/60 tracking-wide">
            486,000+ words across the Arcanean multiverse
          </p>

          {/* Tagline */}
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
            Enter seeking. Leave transformed. Return whenever needed.
          </p>

          {/* Decorative rule */}
          <div className="mx-auto mt-10 flex w-48 items-center gap-3 text-[#00bcd4]/20" aria-hidden="true">
            <span className="h-px flex-1 bg-current" />
            <span className="font-mono text-[10px] tracking-[0.3em]">◈</span>
            <span className="h-px flex-1 bg-current" />
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#chronicles"
              className="inline-flex items-center gap-2 rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 px-8 py-3.5 text-sm font-semibold text-[#00bcd4] transition-all hover:border-[#00bcd4]/50 hover:bg-[#00bcd4]/18 hover:shadow-[0_0_32px_rgba(0,188,212,0.15)]"
            >
              Begin Reading
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <Link
              href="/books/docs/founding-myths"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white/65 transition-all hover:border-white/30 hover:text-white/85"
            >
              Read the Myths
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2" aria-hidden="true">
          <div className="flex flex-col items-center gap-1.5 text-white/20">
            <div
              className="h-6 w-px bg-gradient-to-b from-transparent to-current"
              style={{ animation: 'float 2s ease-in-out infinite' }}
            />
          </div>
        </div>
      </section>

      {/* ================================================================
          CHRONICLES — Main series section
      ================================================================ */}
      <section id="chronicles" className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#00bcd4]/70">
            Main Series
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white/90 md:text-4xl">
            Chronicles of Arcanea
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/65">
            A ten-book epic following Kael and the Five-Fold Five as they navigate the politics, magic,
            and ancient darkness of the Arcanean world.
          </p>
        </div>

        {/* Books 1 & 2 — featured row */}
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <BookCard book={book1} isFeature />
          <BookCard book={book2} isFeature />
        </div>

        {/* Books 3–5 — teaser row */}
        <div className="grid gap-4 sm:grid-cols-3">
          {laterBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {/* Series promise */}
        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
          Books 6–10 in development
        </p>
      </section>

      {/* ================================================================
          THE ARCANEA MULTIVERSE — all other series
      ================================================================ */}
      {multiverseSeries.length > 0 && (
        <section id="multiverse" className="relative mx-auto max-w-6xl px-6 py-24">
          {/* Subtle section divider */}
          <div className="mb-16 flex items-center gap-4" aria-hidden="true">
            <span className="h-px flex-1 bg-white/6" />
            <div className="text-center">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#00bcd4]/70">
                Expanded Universe
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white/90 md:text-4xl">
                The Arcanea Multiverse
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/65">
                Beyond the Chronicles, the world keeps expanding. Crews, dragon-riders, Dungeon divers,
                Gate-Touched survivors, and the voices of those the main story calls enemies.
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
          FEATURED PASSAGE — rotating quotes
      ================================================================ */}
      <section className="relative overflow-hidden py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#00bcd4]/[0.03] to-transparent"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-6">
          <div className="mb-12 flex items-center gap-4">
            <span className="h-px flex-1 bg-white/8" aria-hidden="true" />
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/50">
              From the Pages
            </p>
            <span className="h-px flex-1 bg-white/8" aria-hidden="true" />
          </div>

          {/* Stacked passages — all visible, staggered opacity for scroll effect */}
          <div className="space-y-16">
            {FEATURED_PASSAGES.map((passage, i) => (
              <blockquote
                key={i}
                className="group relative pl-6"
              >
                <div
                  className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[#00bcd4]/40 via-[#00bcd4]/20 to-transparent"
                  aria-hidden="true"
                />
                <p className="font-serif text-lg leading-[1.85] text-white/60 transition-colors duration-500 group-hover:text-white/80 md:text-xl">
                  &ldquo;{passage.text}&rdquo;
                </p>
                <footer className="mt-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/60">{passage.chapter}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
                      {passage.book}
                    </p>
                  </div>
                  <Link
                    href={passage.href}
                    className="shrink-0 rounded-full border border-[#00bcd4]/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#00bcd4]/70 transition-all hover:border-[#00bcd4]/50 hover:text-[#00bcd4]"
                  >
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
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#00bcd4]/70">
            Choose Your Entry
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white/90">
            Reading Paths
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/65">
            Every gate into the world is the right one. Follow the thread that calls to you.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {READING_PATHS.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="group relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] p-6 transition-all hover:border-[#00bcd4]/25 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(0,188,212,0.06)]"
            >
              <span
                className="mb-4 block font-mono text-2xl text-[#00bcd4]/40 transition-colors group-hover:text-[#00bcd4]/70"
                aria-hidden="true"
              >
                {path.icon}
              </span>
              <h3 className="mb-2 text-sm font-semibold text-white/80 transition-colors group-hover:text-white/95">
                {path.label}
              </h3>
              <p className="text-xs leading-relaxed text-white/60">{path.description}</p>
              <svg
                className="absolute right-5 top-5 h-4 w-4 text-white/15 transition-all group-hover:translate-x-0.5 group-hover:text-[#00bcd4]/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* ================================================================
          THE THREE ACADEMIES — visual showcase
      ================================================================ */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#00bcd4]/70">
            The World
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white/90">
            The Three Academies
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/65">
            Three institutions, three philosophies, one fracture running through all of them.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {ACADEMIES.map((academy) => (
            <div
              key={academy.name}
              className={`group relative overflow-hidden rounded-xl border bg-white/[0.02] p-7 transition-all duration-300 ${academy.borderClass} ${academy.glowClass}`}
            >
              {/* Element gradient overlay */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-300 group-hover:opacity-100 ${academy.colorClass}`}
                aria-hidden="true"
              />

              <div className="relative z-10">
                <span className={`mb-5 block font-mono text-3xl ${academy.textAccent}/60`} aria-hidden="true">
                  {academy.symbol}
                </span>

                <h3 className="font-display text-xl font-bold text-white/90">{academy.name}</h3>
                <p className={`mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] ${academy.textAccent}/50`}>
                  {academy.location}
                </p>
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
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#00bcd4]/70">
            Deep Reference
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white/90">
            The Reference Library
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/65">
            Everything that exists beyond the novels. The bones of the world made visible.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REFERENCE_DOCS.map((doc) => (
            <Link
              key={doc.slug}
              href={`/books/docs/${doc.slug}`}
              className="group flex flex-col rounded-xl border border-white/7 bg-white/[0.02] p-5 transition-all hover:border-white/14 hover:bg-white/[0.04]"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/25">
                  {doc.category}
                </span>
                <span className="font-mono text-[10px] text-white/20">{doc.readTime} read</span>
              </div>
              <h3 className="mb-2 text-sm font-semibold text-white/75 transition-colors group-hover:text-white/95">
                {doc.title}
              </h3>
              <p className="flex-1 text-xs leading-relaxed text-white/60">{doc.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-[10px] text-white/20">{doc.wordCount}</span>
                <svg
                  className="h-3.5 w-3.5 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:text-[#00bcd4]/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================================================================
          FOOTER CTA — "Your Gate Awaits"
      ================================================================ */}
      <section className="relative overflow-hidden py-32">
        {/* Radial glow behind content */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,188,212,0.07)_0%,transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <span className="mb-6 block font-mono text-4xl text-[#00bcd4]/30" aria-hidden="true">
            ◈
          </span>

          <h2 className="font-display text-4xl font-bold tracking-tight text-white/92 md:text-5xl">
            Your Gate Awaits
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/65 md:text-lg">
            Every element, every Academy, every Gate — they all begin with a single story about a
            lighthouse keeper who watched a strange storm.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/books/book1/chapter-01-the-first-spark"
              className="inline-flex items-center gap-2 rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 px-8 py-4 text-sm font-semibold text-[#00bcd4] transition-all hover:border-[#00bcd4]/50 hover:bg-[#00bcd4]/18 hover:shadow-[0_0_40px_rgba(0,188,212,0.18)]"
            >
              Read Chapter One
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/books/book1"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-4 text-sm font-medium text-white/65 transition-all hover:border-white/20 hover:text-white/85"
            >
              Browse Book One
            </Link>
          </div>

          {/* Tagline */}
          <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
            Enter seeking &nbsp;·&nbsp; Leave transformed &nbsp;·&nbsp; Return whenever needed
          </p>
        </div>
      </section>
    </div>
  );
}
