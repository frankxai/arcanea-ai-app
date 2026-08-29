/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { CinematicBookOverview } from '@/components/books/cinematic-book-overview';
import { getBookRoot } from '@/lib/content/book-path';
import { countChapterWords, isChapterMarkdown } from '@/lib/saga/chapter-files';
import {
  CINEMATIC_BOOK_DESCRIPTION,
  CINEMATIC_BOOK_ID,
  CINEMATIC_BOOK_TITLE,
  CINEMATIC_CHAPTER_DIR,
  getCinematicBookStats,
  getCinematicChapter,
  isCinematicEditionReleased,
} from '@/lib/books/cinematic-edition';
import {
  getCinematicBookAccess,
  isCinematicCheckoutConfigured,
} from '@/lib/books/polar-access';
const BOOK_ROOT = getBookRoot();

export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------------ */
/*  Book registry                                                      */
/* ------------------------------------------------------------------ */

type BookStatus = 'in-progress' | 'outlined' | 'planned';

interface BookDef {
  title: string;
  subtitle: string;
  description: string;
  status: BookStatus;
  dir: string;
}

const BOOKS: Record<string, BookDef> = {
  [CINEMATIC_BOOK_ID]: {
    title: CINEMATIC_BOOK_TITLE,
    subtitle: 'Book One of the Chronicles of Arcanea',
    description: CINEMATIC_BOOK_DESCRIPTION,
    status: 'in-progress',
    dir: CINEMATIC_CHAPTER_DIR,
  },
  book1: {
    title: 'The Three Academies',
    subtitle: 'Book One of the Arcanea Saga',
    description:
      'In the coastal town of Ashenmere, a lighthouse keeper named Kael discovers they can channel all five elements — something no one has done since Malachar, the Dark Lord who fell ten thousand years ago. Recruited to an unprecedented joint session at all three Academies, Kael must navigate rivalries, ancient secrets, and the whisper of a sealed darkness that recognizes them.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'chapters', 'book1'),
  },
  book2: {
    title: 'The Gate-Touched',
    subtitle: 'Book Two of the Arcanea Saga',
    description:
      'The Registry tracks every channeler in the realm — but not everyone wants to be found. As Gate-Touched manifest across Arcanea, Sable uncovers an Eldrian memory-vial that rewrites everything, and Orin runs an underground railroad while someone erases the evidence that Five-Fold channelers have existed before.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'chronicles-of-arcanea', 'book-02-the-gate-touched'),
  },
  book3: {
    title: 'The Dragon War',
    subtitle: 'Book Three of the Arcanea Saga',
    description:
      'A Dragon egg sings for the first time in a thousand years. Nations scramble to claim the hatching. Kael journeys to the Draconis Forge as Malachar\'s voice grows louder in the deep. What emerges from the egg is something no one predicted.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'chronicles-of-arcanea', 'book-03-the-dragon-war'),
  },
  'chronicles-book1': {
    title: 'The Three Academies',
    subtitle: 'Book One — Chronicles of Arcanea',
    description:
      'A stonemason\'s apprentice discovers they can channel all five elements — something unseen since the Dark Lord\'s fall ten thousand years ago. The polished edition of Book One, with complete chapter set.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'chronicles-of-arcanea', 'book-01-the-three-academies'),
  },
  'chronicles-book2': {
    title: 'The Gate-Touched',
    subtitle: 'Book Two — Chronicles of Arcanea',
    description:
      'The Registry tracks every channeler in the realm — but not everyone wants to be found. Stories of those who manifested outside the Academies and the people who want them erased.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'chronicles-of-arcanea', 'book-02-the-gate-touched'),
  },
  starbound: {
    title: 'Starbound: Crew Velathos',
    subtitle: 'Book One — Starbound',
    description:
      'A specialist crew takes on missions across the Arcanean world — monster hunts, Dungeon dives, diplomatic escorts, and the strange cases that fall between Academy jurisdiction and everything else.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'starbound', 'book-01-crew-velathos'),
  },
  dragonborne: {
    title: 'Dragonborne: The Last Clutch',
    subtitle: 'Book One — Dragonborne',
    description:
      'Stories from inside the bond between a dragon and the person who earned their trust. The first novella follows a rider navigating loyalty, instinct, and the weight of being chosen by fire.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'dragonborne', 'book-01-the-last-clutch'),
  },
  'gate-touched': {
    title: 'Gate-Touched Files',
    subtitle: 'A Street-Level Serial',
    description:
      'A serial following Gate-Touched people — those whose channels manifested wrong, too early, or outside any Academy — as they navigate a world that does not have a category for what they are.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'gate-touched-files'),
  },
  'void-ascending': {
    title: 'Void Ascending: The Other Side',
    subtitle: 'Book One — Void Ascending',
    description:
      'Told entirely from the perspective of those who serve the Hungry Void — not as villains, but as believers. A literary counterpoint to the Chronicles that complicates every easy answer.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'void-ascending', 'book-01-the-other-side'),
  },
  'dungeon-scrolls': {
    title: 'The Dungeon Scrolls: The Hollow Root',
    subtitle: 'Volume One — The Dungeon Scrolls',
    description:
      'An anthology of stories set inside the Dungeons — ancient Gate temples warped by millennia of corrupted magic. Each story is a descent into a different ruin, a different kind of broken.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'dungeon-scrolls', '01-the-hollow-root'),
  },
  companions: {
    title: 'Companions of Arcanea',
    subtitle: 'Short Stories from the Bond',
    description:
      'Short stories told from the perspective of the bonded creatures — familiars, mounts, companions — who share the journey but rarely get to tell their side of it.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'companions'),
  },
  'luminor-falling': {
    title: 'Luminor Falling',
    subtitle: 'A Standalone Saga',
    description:
      'A standalone novella set in the Chronicles universe — complete in itself, illuminating a corner of Arcanea that the main series glimpses but never fully enters.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'chronicles-of-arcanea', 'sagas', 'luminor-falling'),
  },
  'luminor-rising-thalmaris': {
    title: 'The Sinking of Thal\'Maris',
    subtitle: 'Luminor Rising — Part One',
    description:
      'Before the Academies stood, before the Gates were mapped — the world that was lost. What went under the water and why it had to.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'luminor-rising', 'the-sinking-of-thalmaris'),
  },
  'luminor-rising-bonding': {
    title: 'The First Bonding',
    subtitle: 'Luminor Rising — Part Two',
    description:
      'The original accord between Luminors and Godbeasts. What it cost. What it created. What it broke.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'luminor-rising', 'the-first-bonding'),
  },
  'luminor-rising-aiyami': {
    title: 'Aiyami Ascending',
    subtitle: 'Luminor Rising — Part Three',
    description:
      'The Crown Gate opens for the first time. A Luminor who never wanted power stands at the threshold of the highest consecration in the world.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'luminor-rising', 'aiyami-ascending'),
  },
  'luminor-rising-nero': {
    title: 'The Night Nero Wept',
    subtitle: 'Luminor Rising — Part Four',
    description:
      'The night the Primordial Darkness grieved. Told from the inside. Not the mythology — the memory.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'luminor-rising', 'the-night-nero-wept'),
  },
  'forge-of-ruin': {
    title: 'The Forge of Ruin',
    subtitle: 'A Dark Epic Fantasy — Draft',
    description:
      'A berserker named Erivar Skaldson whose rage is a parasitic entity bonded to his bloodline. Each time he surrenders to the Fury, he loses a piece of who he was. The story asks whether destruction can be a path to salvation — or only annihilation.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'forge-of-ruin', 'chapters'),
  },
  'tides-of-silence': {
    title: 'The Tides of Silence',
    subtitle: 'A Water Magic World — Draft',
    description:
      'A world with no land. Sentient oceans going silent. A Tide-Speaker named Sael must descend into the deep to discover why someone is deliberately deafening the world — and whether the silence is death or metamorphosis.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'tides-of-silence', 'chapters'),
  },
  'heart-of-pyrathis': {
    title: 'The Heart of Pyrathis',
    subtitle: 'Alien Dragons on a Volcano Planet — Draft',
    description:
      'A Cinderfang who can\'t shift. A three-foot sage with a lightsaber. An exiled space elf. A dying dragon. They must descend to the planet\'s core to reignite a grieving world — but someone must become the fire.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'heart-of-pyrathis', 'chapters'),
  },
  'song-of-van-linh': {
    title: 'The Girl Who Heard the River',
    subtitle: 'Book One — The Song of Van Linh',
    description:
      'In modern Hanoi, a wildlife biologist named An discovers she can hear the voice of every living creature — a gift tied to an ancient Gate between Earth and the realm of Arcanea. As ecological destruction poisons Vietnam\'s rivers and silences its sacred animals, An must journey from the neon streets of Hanoi to the flooded temples of the Mekong Delta, guided by an ancient crystalline creature who chose her and drawn toward a man whose own gift is as dangerous as it is magnetic. Vietnamese mythology meets Ghibli warmth meets Arcanea canon.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'song-of-van-linh', 'chapters'),
  },
  'las-tierras-de-luz': {
    title: 'Las Tierras de Luz',
    subtitle: 'A Legend of the Kingdom of Light',
    description:
      'In the valley-Realm of Veldoria, an eleven-year-old girl named Mira wakes one morning to find a small prismatic light hovering above her chest — her destello, visible for the first time. Soon she discovers she can wake the sleeping lights in every being she passes. No one else can see them. Across the narrow street, behind a blue door, an old woman who has been waiting her whole adult life looks up from a bowl of green beans and sees. A magical-realism novel about the loneliness of the first witness and the quiet joy that lives beneath every ordinary day. A Legend of the Kingdom of Light.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'las-tierras-de-luz', 'chapters'),
  },
  'das-maedchen-drei-sprachen': {
    title: 'Das Mädchen, das drei Sprachen hörte',
    subtitle: 'Die Geschichte von Mila und der Blume, die niemals stirbt',
    description:
      'Ein zauberhaftes dreisprachiges Vorlesebuch (Deutsch primär, Kroatisch und Englisch eingewoben) für ein sechsjähriges Kind im Übergang von Deutschland nach Kroatien. Mila kommt mit ihrem dreijährigen Bruder Theo auf der Insel Mali Lošinj an. In zehn Kapiteln lernt sie, dass jede Pflanze, jedes Tier und jeder Ort drei geheime Namen hat — und dass Zuhause nicht ein Ort ist, sondern das, was man kennt. Mit einer schwarzen Hafenkatze namens Luna, einem jungen Delfin namens Val, einer kroatischen Nachbarin Nona Marica, einem kroatisch-britischen Freund Oli und einer Blume namens Smilje, die niemals ihre goldene Farbe verliert. Geschrieben in der Stimme von Janosch, Astrid Lindgren und Cornelia Funke, mit Studio-Ghibli-Wärme.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'das-maedchen-drei-sprachen', 'chapters'),
  },
  'russian-from-tashkent': {
    title: 'The Russian-Speaker',
    subtitle: 'A novel of Tashkent, Petersburg, Moscow — 1985–2010',
    description:
      'Biographical memoir-fiction based on the life of Ruslan — a friend of the writer (FrankX) — born 1985 in Yunusabad, Tashkent, who grew up through Perestroika and the collapse, was exiled to St. Petersburg and Moscow as a teenager after the 1999 Tashkent bombings, and returned to Uzbekistan to work a hotel lobby, then the Chirchiq Transformer Plant, then the US Embassy of a country that watched him from the day he was born. A novel of categorical homelessness — not Russian enough for Russia, not Uzbek enough for Uzbekistan, fluent in both and at home in neither. Comp shelf: Bezmozgis, Krasikov, Hemon, Ismailov, Matar, Alexievich.',
    status: 'in-progress',
    dir: join(BOOK_ROOT, 'russian-from-tashkent', 'chapters'),
  },
};

const STATUS_STYLES: Record<BookStatus, { bg: string; text: string; label: string }> = {
  'in-progress': { bg: 'bg-[var(--arc-brand-atlantean-teal)]/15 border-[var(--arc-brand-atlantean-teal)]/30', text: 'text-[var(--arc-brand-atlantean-teal)]', label: 'In Progress' },
  outlined: { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400', label: 'Outlined' },
  planned: { bg: 'bg-white/5 border-white/10', text: 'text-white/40', label: 'Planned' },
};

/* ------------------------------------------------------------------ */
/*  Data loading                                                       */
/* ------------------------------------------------------------------ */

interface ChapterInfo {
  id: string;
  number: number;
  title: string;
  wordCount: number;
  readTime: number;
}

function extractTitle(content: string, fallbackId: string): string {
  const chapterHeading = content.match(/^#\s+Chapter\s+\w+:\s+(.+)$/m);
  if (chapterHeading) return chapterHeading[1].trim();

  const heading = content.match(/^#\s+(.+)$/m);
  if (heading) return heading[1].trim();

  return fallbackId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

async function getChapters(bookDir: string): Promise<ChapterInfo[]> {
  try {
    const files = await readdir(bookDir);
    const mdFiles = files
      .filter(isChapterMarkdown)
      .sort();

    const chapters: ChapterInfo[] = [];

    for (let i = 0; i < mdFiles.length; i++) {
      const raw = await readFile(join(bookDir, mdFiles[i]), 'utf-8');
      const id = mdFiles[i].replace(/\.md$/, '').replace(/^\d+-/, '');
      const words = countChapterWords(raw);

      chapters.push({
        id,
        number: i + 1,
        title: extractTitle(raw, id),
        wordCount: words,
        readTime: Math.max(1, Math.ceil(words / 250)),
      });
    }

    return chapters;
  } catch {
    return [];
  }
}

async function fileExists(path: string): Promise<boolean> {
  try { await access(path); return true; } catch { return false; }
}

async function getCompanionFlags(bookDir: string): Promise<{ hasAuthorsNote: boolean; hasGlossary: boolean }> {
  // Book root is one level up from chapters/ — fall back to bookDir if no /chapters suffix
  const root = bookDir.endsWith('chapters') || bookDir.endsWith('chapters/') || bookDir.endsWith('chapters\\')
    ? join(bookDir, '..')
    : bookDir;
  const [hasAuthorsNote, hasGlossary] = await Promise.all([
    fileExists(join(root, 'AUTHORS_NOTE.md')),
    fileExists(join(root, 'GLOSSARY.md')),
  ]);
  return { hasAuthorsNote, hasGlossary };
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

interface PageProps {
  params: Promise<{ bookId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { bookId } = await params;
  const book = BOOKS[bookId];
  if (!book) return { title: 'Book Not Found' };

  if (bookId === CINEMATIC_BOOK_ID) {
    const released = isCinematicEditionReleased();
    return {
      title: `${CINEMATIC_BOOK_TITLE} — Chronicles of Arcanea`,
      description: released
        ? CINEMATIC_BOOK_DESCRIPTION
        : `An in-revision preview of ${CINEMATIC_BOOK_TITLE}.`,
      robots: released
        ? { index: true, follow: true }
        : { index: false, follow: false, nocache: true },
      alternates: { canonical: `/books/${CINEMATIC_BOOK_ID}` },
    };
  }

  return {
    title: `${book.title} -- The Arcanea Saga`,
    description: book.description,
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function BookOverviewPage({ params }: PageProps) {
  const { bookId } = await params;

  if (bookId === 'book1' || bookId === 'chronicles-book1') {
    redirect(`/books/${CINEMATIC_BOOK_ID}`);
  }

  if (bookId === CINEMATIC_BOOK_ID) {
    const stats = await getCinematicBookStats();
    const firstChapter = stats.chapters[0]
      ? await getCinematicChapter(stats.chapters[0].id, true)
      : null;
    const access = await getCinematicBookAccess();

    return (
      <CinematicBookOverview
        chapters={stats.chapters}
        wordCount={stats.wordCount}
        readTime={stats.readTime}
        openingContent={firstChapter?.content ?? ''}
        access={access}
        checkoutConfigured={isCinematicCheckoutConfigured()}
        released={isCinematicEditionReleased()}
      />
    );
  }

  const book = BOOKS[bookId];
  if (!book) notFound();

  const chapters = await getChapters(book.dir);
  const { hasAuthorsNote, hasGlossary } = await getCompanionFlags(book.dir);
  const hasCompanion = hasAuthorsNote || hasGlossary;
  const totalWords = chapters.reduce((sum, c) => sum + c.wordCount, 0);
  const totalTime = chapters.reduce((sum, c) => sum + c.readTime, 0);
  const status = STATUS_STYLES[book.status];

  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/3 top-[8%] h-[400px] w-[400px] rounded-full bg-[var(--arc-brand-atlantean-teal)]/8 blur-[140px]" />
        <div className="absolute right-1/4 top-[40%] h-[300px] w-[300px] rounded-full bg-[var(--arc-brand-cosmic-blue)]/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-16">
        {/* Back link */}
        <Link
          href="/saga"
          className="mb-12 inline-flex items-center gap-2 text-xs text-white/40 transition-colors hover:text-white/70"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Saga
        </Link>

        {/* Book header */}
        <header className="mb-16">
          <span
            className={`mb-5 inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${status.bg} ${status.text}`}
          >
            {status.label}
          </span>

          <h1 className="font-display text-4xl font-bold tracking-tight text-white/95 md:text-5xl leading-[1.1]">
            {book.title}
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--arc-brand-atlantean-teal)]/50">
            {book.subtitle}
          </p>

          <p className="mt-6 text-base leading-[1.8] text-white/50">
            {book.description}
          </p>

          <div className="mt-6 flex items-center gap-4 text-xs text-white/30">
            <span>{chapters.length} chapters</span>
            <span className="text-white/10">|</span>
            <span>~{totalWords.toLocaleString()} words</span>
            <span className="text-white/10">|</span>
            <span>{totalTime} min read</span>
          </div>

          {chapters.length > 0 && (
            <Link
              href={`/books/${bookId}/${chapters[0].id}`}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 px-6 py-3 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] transition-all hover:border-[var(--arc-brand-atlantean-teal)]/50 hover:bg-[var(--arc-brand-atlantean-teal)]/20 hover:shadow-[0_0_30px_rgba(0,188,212,0.15)]"
            >
              Start reading Chapter 1
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </header>

        {/* Decorative divider */}
        <div className="mb-10 flex items-center gap-3 text-[var(--arc-brand-atlantean-teal)]/20" aria-hidden="true">
          <span className="h-px flex-1 bg-current" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--arc-brand-atlantean-teal)]/30">
            Chapters
          </span>
          <span className="h-px flex-1 bg-current" />
        </div>

        {/* Chapter list */}
        {chapters.length > 0 ? (
          <ol className="space-y-1">
            {chapters.map((ch) => (
              <li key={ch.id}>
                <Link
                  href={`/books/${bookId}/${ch.id}`}
                  className="group flex items-center gap-4 rounded-lg border-l-2 border-transparent px-4 py-3.5 transition-all hover:border-[var(--arc-brand-atlantean-teal)] hover:bg-white/[0.02]"
                >
                  <span className="w-6 shrink-0 text-right font-mono text-xs text-white/20 group-hover:text-[var(--arc-brand-atlantean-teal)]/60">
                    {ch.number}
                  </span>
                  <span className="flex-1 text-[15px] text-white/70 transition-colors group-hover:text-white/95">
                    {ch.title}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-white/15 group-hover:text-white/30">
                    {(ch.wordCount / 1000).toFixed(1)}K
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="py-12 text-center text-sm text-white/30">
            Chapters coming soon. This book is currently being outlined.
          </p>
        )}

        {/* Companion materials — Author's Note + Glossary */}
        {hasCompanion && (
          <div className="mt-16 border-t border-white/[0.06] pt-10">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--arc-brand-atlantean-teal)]/50">
              Behind the book
            </p>
            <Link
              href={`/books/${bookId}/about`}
              className="group inline-flex items-center gap-3 text-base text-white/70 transition-colors hover:text-white/95"
            >
              <span>
                {hasAuthorsNote && hasGlossary
                  ? "Author's Note & Glossary"
                  : hasAuthorsNote
                  ? "Author's Note"
                  : 'Glossary'}
              </span>
              <svg className="h-4 w-4 text-[var(--arc-brand-atlantean-teal)]/50 transition-colors group-hover:text-[var(--arc-brand-atlantean-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}

        {/* Back to saga */}
        <div className="mt-12 text-center">
          <Link
            href="/saga"
            className="text-xs text-white/30 transition-colors hover:text-white/60"
          >
            &larr; Back to The Arcanea Saga
          </Link>
        </div>
      </main>
    </div>
  );
}
