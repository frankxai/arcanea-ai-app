/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { BookSeries } from '@/lib/saga/loader';

// ============================================================
// FEATURED PASSAGES
// ============================================================

export const FEATURED_PASSAGES = [
  {
    text: 'She did not mean it the way people usually mean it. She did not mean I understand your situation. She meant I know. I know what three days of silence sounds like. I know what it is to be left in the world after the heartbeat stops.',
    chapter: 'Chapter One: Subject 7',
    book: 'The Girl Who Heard the River — Development Draft',
    href: '/books',
  },
  {
    text: 'You\'ve been calling a river a problem for fifteen years. The river doesn\'t care what you call it. It goes where it goes.',
    chapter: 'Chapter Two: The Frequency of Starlings',
    book: 'The Girl Who Heard the River — Development Draft',
    href: '/books',
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
    id: 'arc-rel-001',
    title: 'The Unchosen Bond',
    subtitle: 'ARC-REL-001 · In development',
    description:
      'The first law of dragons is that they choose. When multiple Godbeasts answer Arion, Mera hears the memory removed from the ancient bond and Emilia discovers the Academies were built to contain it. Working title and story architecture; not yet a released book.',
    status: 'planned',
    chapterCount: 0,
    wordCount: 'Story lock pending',
    firstChapter: '/books',
    gateSymbol: '◈',
  },
  {
    id: 'last-clutch',
    title: 'Dragonborne: The Last Clutch',
    subtitle: 'Founding novella draft',
    description:
      'A seven-chapter, approximately 37.6K-word Theron and Kessa continuity draft. Preserved as a founding-era story seed; it is not the Arion-led flagship and has not passed editorial or release gates.',
    status: 'in-progress',
    chapterCount: 7,
    wordCount: '~37.6K draft',
    firstChapter: '/books',
    gateSymbol: '△',
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
    wordCount: 'Inventory',
    readTime: 'In review',
  },
  {
    slug: 'deep-lore',
    title: 'Deep Lore',
    category: 'The World',
    description: 'Godbeasts, Dungeons, and the ancient forces beneath the surface.',
    wordCount: 'Inventory',
    readTime: 'In review',
  },
  {
    slug: 'companion-bestiary',
    title: 'Companion Bestiary',
    category: 'The World',
    description: 'Every creature, familiar, and bonded entity in the multiverse.',
    wordCount: 'Inventory',
    readTime: 'In review',
  },
  {
    slug: 'cast-bible',
    title: 'Cast of Characters',
    category: 'Characters',
    description: 'Full profiles for every named character across the series.',
    wordCount: 'Inventory',
    readTime: 'In review',
  },
  {
    slug: 'founding-myths',
    title: 'Founding Myths',
    category: 'Legends',
    description: 'The origin of Lumina, Nero, the Five Elements, and the Ten Gates.',
    wordCount: 'Inventory',
    readTime: 'In review',
  },
  {
    slug: 'series-bible',
    title: 'Series Bible',
    category: 'Reference',
    description: 'The complete series arc, themes, and narrative architecture.',
    wordCount: 'Inventory',
    readTime: 'In review',
  },
];

// ============================================================
// READING PATHS
// ============================================================

export const READING_PATHS = [
  {
    label: 'View the Release Plan',
    description: 'See what is greenlit and what remains in development.',
    href: '#chronicles',
    icon: '◈',
  },
  {
    label: 'Meet the Guardians',
    description: 'Explore the public Guardian and Godbeast codex.',
    href: '/lore',
    icon: '✦',
  },
  {
    label: 'Browse the Library',
    description: 'Read the currently available public collections.',
    href: '/library',
    icon: '◇',
  },
  {
    label: 'Build Your World',
    description: 'Use the Connector without entering Arcanea canon.',
    href: '/worlds',
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
  'song-of-van-linh': {
    border: 'border-teal-500/15 hover:border-teal-400/30',
    hover: 'hover:shadow-[0_0_40px_rgba(20,184,166,0.08)]',
    badge: 'bg-teal-500/10 border-teal-500/25',
    badgeText: 'text-teal-400',
    glow: 'via-teal-900/[0.03]',
    symbol: '🐢',
    topEdge: 'from-transparent via-teal-400/30 to-transparent',
  },
  'las-tierras-de-luz': {
    border: 'border-amber-500/15 hover:border-amber-400/30',
    hover: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.08)]',
    badge: 'bg-amber-500/10 border-amber-500/25',
    badgeText: 'text-amber-400',
    glow: 'via-amber-900/[0.03]',
    symbol: '✦',
    topEdge: 'from-transparent via-amber-400/30 to-transparent',
  },
  'lumara-valle-de-los-destellos': {
    border: 'border-yellow-500/15 hover:border-yellow-400/30',
    hover: 'hover:shadow-[0_0_40px_rgba(234,179,8,0.08)]',
    badge: 'bg-yellow-500/10 border-yellow-500/25',
    badgeText: 'text-yellow-400',
    glow: 'via-yellow-900/[0.03]',
    symbol: '✨',
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
  'in-progress': { bg: 'bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/25', text: 'text-[var(--arc-brand-atlantean-teal)]', label: 'In Progress' },
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
