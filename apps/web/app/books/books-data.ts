import type { BookSeries } from '@/lib/saga/loader';

// ============================================================
// FEATURED PASSAGES
// ============================================================

export const FEATURED_PASSAGES = [
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

// ============================================================
// CHRONICLE BOOKS
// ============================================================

export interface ChronicleBook {
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

export const CHRONICLE_BOOKS: ChronicleBook[] = [
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

// ============================================================
// ACADEMIES
// ============================================================

export interface AcademyCard {
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

export const ACADEMIES: AcademyCard[] = [
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

// ============================================================
// REFERENCE DOCS
// ============================================================

export interface RefDoc {
  slug: string;
  title: string;
  category: string;
  description: string;
  wordCount: string;
  readTime: string;
}

export const REFERENCE_DOCS: RefDoc[] = [
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

// ============================================================
// READING PATHS
// ============================================================

export const READING_PATHS = [
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
// MULTIVERSE SERIES ACCENTS
// ============================================================

export interface SeriesAccent {
  border: string;
  hover: string;
  badge: string;
  badgeText: string;
  glow: string;
  symbol: string;
  topEdge: string;
}

export const SERIES_ACCENTS: Record<string, SeriesAccent> = {
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

export const DEFAULT_ACCENT: SeriesAccent = {
  border: 'border-white/8 hover:border-white/18',
  hover: '',
  badge: 'bg-white/5 border-white/15',
  badgeText: 'text-white/45',
  glow: '',
  symbol: '◈',
  topEdge: 'from-transparent via-white/20 to-transparent',
};

export const CONTENT_TYPE_LABELS: Record<BookSeries['contentType'], string> = {
  novel: 'Novel Series',
  novella: 'Novella Series',
  serial: 'Serial',
  anthology: 'Anthology',
  standalone: 'Standalones',
};

export const SERIES_STATUS_STYLES: Record<BookSeries['status'], { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-emerald-500/10 border border-emerald-500/25', text: 'text-emerald-400', label: 'Active' },
  'in-progress': { bg: 'bg-[#00bcd4]/10 border border-[#00bcd4]/25', text: 'text-[#00bcd4]', label: 'In Progress' },
  planned: { bg: 'bg-white/5 border border-white/10', text: 'text-white/60', label: 'Coming Soon' },
};

/**
 * Maps a series ID to the [bookId] route segment used in /books/[bookId]/[chapterId].
 * Only needed when the series id differs from the registered bookId, or when a
 * multi-book series needs to route to one canonical entry-point bookId.
 */
export const SERIES_BOOKID_MAP: Record<string, string> = {
  sagas: 'luminor-falling',
  'gate-touched-files': 'gate-touched',
};
