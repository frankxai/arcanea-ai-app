/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import matter from 'gray-matter';
import { createClient } from '@/lib/supabase/server';
import { StarRating } from '@/components/books/StarRating';
import { ReviewList } from '@/components/books/ReviewList';
import { ReviewForm } from '@/components/books/ReviewForm';
import GuardianReport from '@/components/books/GuardianReport';
import { LiquidGlass } from '@/components/ui/liquid-glass';

export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BookManifest {
  title: string;
  slug: string;
  status: string;
  authors: { name: string; role: string; github?: string }[];
  ai_transparency: {
    models_used: { id: string; provider: string; role: string }[] | string[];
    human_contribution: string | number;
    ai_contribution: string | number;
    method: string;
  };
  tags: string[];
  content_rating: string;
  license: string;
  acknowledgments: string;
}

interface DraftChapter {
  slug: string;
  title: string;
  subtitle: string;
  wordCount: number;
  readTime: number;
  excerpt: string;
  number: number;
}

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const BOOK_ROOT = join(process.cwd(), '..', '..', 'book');

const COVER_MAP: Record<string, string> = {
  'forge-of-ruin': '/images/books/forge-of-ruin-cover-nb2.png',
  'tides-of-silence': '/images/books/tides-of-silence-cover-v2.png',
  'heart-of-pyrathis': '/images/books/heart-of-pyrathis-cover-v2.png',
  'song-of-van-linh': '/images/books/song-of-van-linh-cover.png',
  'das-maedchen-drei-sprachen': '/images/books/das-maedchen-drei-sprachen-cover-v2.png',
  'las-tierras-de-luz': '/images/books/las-tierras-de-luz-cover-v2.png',
  'russian-from-tashkent': '/images/books/russian-from-tashkent-cover-nb2.png',
};

const ACCENT_MAP: Record<string, { primary: string; bg: string; border: string; glow: string }> = {
  'forge-of-ruin': {
    primary: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    glow: 'bg-red-900/[0.08]',
  },
  'tides-of-silence': {
    primary: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    glow: 'bg-cyan-900/[0.08]',
  },
  'heart-of-pyrathis': {
    primary: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    glow: 'bg-amber-900/[0.08]',
  },
  'song-of-van-linh': {
    primary: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    glow: 'bg-teal-900/[0.08]',
  },
  'das-maedchen-drei-sprachen': {
    primary: 'text-amber-300',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    glow: 'bg-amber-900/[0.08]',
  },
  'las-tierras-de-luz': {
    primary: 'text-amber-200',
    bg: 'bg-amber-300/10',
    border: 'border-amber-300/20',
    glow: 'bg-amber-800/[0.10]',
  },
  'russian-from-tashkent': {
    primary: 'text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    glow: 'bg-amber-900/[0.10]',
  },
};

const DEFAULT_ACCENT = {
  primary: 'text-white/60',
  bg: 'bg-white/[0.06]',
  border: 'border-white/[0.08]',
  glow: 'bg-white/[0.03]',
};

const BOOK_DESCRIPTIONS: Record<string, { tagline: string; paragraphs: string[] }> = {
  'forge-of-ruin': {
    tagline: 'A berserker whose rage devours his memories. A keeper who forges her own chains. A chronicler who falls inside the story she is telling.',
    paragraphs: [
      'Erivar Skaldson has been chained in a cellar for three years. Every night he recites the names of the forty-seven people the Fury killed while wearing his body. Tonight, he discovers three names are gone. The parasite has been eating while he believed it sleeping.',
      'When the Wraith Armies breach the Thornwall, the Thane of Galdheim must unchain the weapon she kept caged. Erivar must choose: fight and risk losing himself, or stay chained and certainly die when the fortress falls.',
    ],
  },
  'heart-of-pyrathis': {
    tagline: 'A cursed wolf, a tiny sage, a fallen star-wanderer, and a scared little dragon walk into a volcano. They carry the fire.',
    paragraphs: [
      'Korvash has never shifted. Born during a cold season on a volcanic planet, the Cinderfang who should run as a fire-wolf instead stands still while the world burns around them. The pack calls them cursed. The dragons call them something else entirely.',
      'Pyrathis is dying. The volcanoes that are the planet\'s heartbeat are going cold. The dragons — volcanic intelligences that ARE fire given form — are fading. And one ancient dragon, Ignara, has called specifically to the one person on the planet who has never been able to burn.',
    ],
  },
  'tides-of-silence': {
    tagline: 'A world with no land. Sentient oceans going silent. A Tide-Speaker who must dive deeper than anyone has gone to find out why.',
    paragraphs: [
      'The Great Gyre has carried Pelagis for four hundred years. The ocean speaks through currents, temperature, bioluminescent light — and Tide-Speakers translate. But the voice is fading. Dead zones appear where the water goes flat and grey.',
      'Sael hears the dissonance first. A wrong note in the Gyre\'s ancient song. The instruments show nothing. The Council files the reading. And beneath the silence, something enormous is changing.',
    ],
  },
  'song-of-van-linh': {
    tagline: 'A wildlife biologist who built a wall around her gift. An ancient turtle who remembers when gods walked the earth. A river that is dying because the world stopped listening.',
    paragraphs: [
      'Nguyen Thuy An has not named an animal since she was nine. The night her dog died in her arms, she felt every last thing he felt — the confusion, the fading, the looking for her. She built a wall. She became a biologist. She learned to care from a distance, with data, through protocols.',
      'Then a traumatized clouded leopard cub refuses to eat, and An breaks her own rule. The wall collapses. The voices come through — every creature in Hanoi, speaking in frequencies she cannot unhear. Her grandmother dies and leaves a journal in a script that shifts between Vietnamese and something older. The turtle in Hoan Kiem Lake surfaces at midnight and speaks her name.',
      'Vietnamese mythology meets Studio Ghibli warmth meets Arcanea canon. A four-book series about ecological grief, ancestral memory, and the cost of listening — set in a modern Vietnam where the ancient never left, it just learned to wear different clothes.',
    ],
  },
  'das-maedchen-drei-sprachen': {
    tagline: 'Ein sechsjähriges Mädchen zieht von Deutschland nach Kroatien. Eine alte Nona, eine Hafenkatze mit einem Mond auf dem Auge, ein junger Delfin und eine Blume, die niemals stirbt, lehren sie, dass Zuhause kein Ort ist — sondern was man kennt.',
    paragraphs: [
      'Mila ist sechs. Sie kommt mit dem Auto auf einer Insel im Kvarner an, mit ihrem dreijährigen Bruder Theo, einem zerdrückten Bärchen und einem Magen voller Heimweh. Das Meer riecht anders als alles in Deutschland. Eine Möwe schreit. Eine alte Frau in einer blauen Schürze sagt ein Wort: galeb. Mila wiederholt es leise. Es ist das erste Wort einer neuen Sprache.',
      'In zehn Kapiteln, ein Kapitel pro Abend, lernt Mila eine Welt zu sehen: die Strohblume Smilje, die ihre goldene Farbe nie verliert; eine schwarze Hafenkatze namens Luna mit einem weißen Mond über dem Auge; einen jungen Delfin namens Val aus dem Adriatischen Pod; ein kroatisches Mädchen namens Rela; einen kroatisch-britischen Jungen namens Oli, der zwei Häuser hat — wie sie jetzt auch.',
      'Geschrieben in Deutsch für ein echtes sechsjähriges Kind im Übergang. Kroatisch und Englisch sind eingewoben — du lernst sie nicht durch Vokabellisten, sondern weil die Personen sie sprechen. Mit der gentlen Lehrtechnik von Studio Ghibli (Stille als Lehre, Tier ohne Sprache, Natur als Person) und der Stimme von Janosch, Lindgren und Funke. Ein Buch über zwei Zuhause.',
    ],
  },
  'las-tierras-de-luz': {
    tagline: 'An eleven-year-old in a quiet Realm of the Kingdom of Light wakes to a small prismatic light hovering above her chest — and discovers no one else can see it. Across the narrow street, behind a blue door, an old woman who has been waiting her whole adult life looks up from a bowl of green beans and sees.',
    paragraphs: [
      'Mira lives in Veldoria, a Realm of the Second Settling — a valley of piedra viva and slow rivers, where the old stones still hold yesterday\'s heat against your palm and the great sombraluz tree in the schoolyard has been called La Abuela for longer than anyone remembers. On an ordinary morning in la hora de Nero, the warmth above her heart resolves into something visible. She names her, very quietly, in the chamber of her own mouth: Chispa.',
      'In the days that follow, Mira learns that every being in her pueblo carries a small light — the baker who has hummed three notes for forty years, the dog who has been walking her to school for four, the silver cat who decides things about people, the carpenter whose oscuro is so deep it does not glow, it receives. But her mother sees something and not the something. Her best certainty becomes her loneliest knowing.',
      'Then, across the narrow street, Señora Bela — who came to Veldoria from Aurevalde sixty years ago through a transit corridor that has since shifted course — looks up from a bowl of green beans and lets her gaze settle three fingers above Mira\'s shoulder. A magical-realism novel of the Kingdom of Light. Of inherited longing. Of the three notes that crossed a lost Realm-corridor to find their child. Written in Spanish in the Veldarín tradition, in the open, with a woman who heard the song first.',
    ],
  },
  'russian-from-tashkent': {
    tagline: 'Born in Tashkent in 1985 to a Russian-speaking family. Exiled to Russia at fourteen. Returned to work the hotel lobbies, the transformer plant, and finally the American embassy of a country that watched him from the day he was born.',
    paragraphs: [
      'Ruslan was four years old in the courtyard between blocks twelve and fourteen in Yunusabad, watching ants carry a grain of bread into a crack in the asphalt, on the afternoon his country had two years and seven days left. He did not know this. The adults on the fifth floor where his mother was wrapping bread for dinner did not know it either. This is what before means. It is the word for the time when you do not know.',
      'In 1991 the country disappeared. In 1999 the bombs went off in Tashkent and the city closed its hands. At fourteen Ruslan went to St. Petersburg, then to Moscow, where the police looked at his face and asked him where he was really from. He came back. He worked a hotel desk in Tashkent. He worked the floor of the Chirchiq Transformer Plant. He walked into the American embassy on a morning in 2007 and had his photograph taken for a badge.',
      'A novel of categorical homelessness — not Russian enough for Russia, not Uzbek enough for Uzbekistan, fluent in both and at home in neither. Based on the life of Ruslan, written by his friend Frank, with his permission and care. Comp shelf: Bezmozgis, Krasikov, Hemon, Ismailov, Matar, Alexievich. Scaffolded in a single parallel dispatch via /arcanea-author — the proof that this command holds worlds outside its own canon.',
    ],
  },
};

const BOOK_CHARACTERS: Record<string, { name: string; role: string; desc: string }[]> = {
  'forge-of-ruin': [
    { name: 'Erivar Skaldson', role: 'The Berserker', desc: 'Forty-seven names. Three missing.' },
    { name: 'Ashe Ceth', role: 'The Observer', desc: 'Ashpriest. Private log. Uncertain.' },
    { name: 'Halla Ironjaw', role: 'The Thane', desc: 'Iron hand on the blueprint.' },
    { name: 'Sable', role: 'The Deserter', desc: 'Wraith defector. Proof that monsters can choose.' },
    { name: 'Odre Flachmark', role: 'The Chronicler', desc: 'Became part of the record.' },
    { name: 'Raskvorn', role: 'The Hollow', desc: "A wooden fox. A daughter's voice." },
  ],
  'heart-of-pyrathis': [
    { name: 'Korvash', role: 'The Cold-Born', desc: 'Twenty years. Never shifted. The fire was building.' },
    { name: 'Thresh', role: 'The Ashborn Sage', desc: '3 feet tall. 2,000 years old. Terrifying with a shard-blade.' },
    { name: 'Vaelith', role: 'The Celestine Exile', desc: '8,000 years. Aging for the first time. Terrified.' },
    { name: 'Ignara', role: 'The Dragon', desc: '400 feet. IS fire. Dying. Chose Korvash.' },
    { name: 'Renn', role: 'The Pack-Brother', desc: 'Big. Warm. Loud. Packed a bag before being asked.' },
    { name: 'The Ashen King', role: 'The One Who Remembers', desc: 'Was the fire once. Escaped. Knows the cost.' },
  ],
  'tides-of-silence': [
    { name: 'Sael', role: 'The Tide-Speaker', desc: 'Hears what others dismiss. Always slightly damp.' },
    { name: 'Chart', role: 'The Navigator', desc: 'If it can\'t be measured, it cannot be trusted.' },
    { name: 'Vel', role: 'The Deep Diver', desc: 'Has seen the bottom. Came back changed.' },
    { name: 'Kael Drast', role: 'The Current-Cutter', desc: 'Freedom he imposes is the same as control.' },
    { name: 'The Ancient', role: 'The Ocean', desc: 'It has no name. It is the naming.' },
  ],
  'song-of-van-linh': [
    { name: 'Nguyen Thuy An', role: 'The Listener', desc: 'Built a wall at nine. The cub broke it at twenty-four.' },
    { name: 'Tran Minh Quan', role: 'The Seer', desc: 'Saw what she was. Walked away. Could not stay away.' },
    { name: 'Linh Chi', role: 'The Ancient Companion', desc: 'Not a pet. A recognition. Centuries of waiting.' },
    { name: 'Ba Noi', role: 'The Last Listener', desc: 'Held the Gate for thirty years. Alone.' },
    { name: 'Rua', role: 'The Sacred Turtle', desc: 'The lake\'s memory of itself. Still breathing.' },
    { name: 'Hoang Van Phuc', role: 'The Pragmatist', desc: 'Right about the wrong things. That is what makes him dangerous.' },
  ],
  'das-maedchen-drei-sprachen': [
    { name: 'Mila', role: 'Die Heldin (6)', desc: 'Aus Deutschland. Vermisst Oma. Lernt Croatian eine Blume nach der anderen.' },
    { name: 'Theo', role: 'Kleiner Bruder (3)', desc: 'Mit Stoffhase Hops. Sagt "Mau!" zu allem mit vier Beinen.' },
    { name: 'Nona Marica', role: 'Die Nachbarin', desc: 'Blaue Schürze. Schneidet Smilje. Wartet, ohne zu fragen.' },
    { name: 'Rela / Mirela', role: 'Die kroatische Freundin (6)', desc: 'Gelbes Kleid, keine Schuhe. Lehrt Mila zu warten.' },
    { name: 'Oli / Oliver', role: 'Der englische Junge (7)', desc: 'Zwei Häuser. Wie Mila jetzt auch. Kommt jeden Sommer.' },
    { name: 'Luna', role: 'Die Hafenkatze', desc: 'Schwarz wie eine kleine Nacht. Weißer Mond über dem Auge.' },
    { name: 'Val', role: 'Der junge Delfin', desc: 'Großer Tümmler. Riss in der Rückenflosse. Liebt Wellen.' },
  ],
  'las-tierras-de-luz': [
    { name: 'Mira', role: 'The First Witness (11)', desc: 'Prismatic destello she has named Chispa. Hears the valley\'s zumbido no one else admits to.' },
    { name: 'Señora Bela', role: 'The Believer (78)', desc: 'Came from Aurevalde sixty years ago. Opalescent destello, held the way a hand cups a candle.' },
    { name: 'Remedios', role: 'The Mother', desc: 'Twenty-six years at the bread shop. Wears a piedra viva pendant she has stopped noticing.' },
    { name: 'Tomás', role: 'The Brother (6)', desc: 'Azul-claro destello so bright it erupts. Mira does not sing near him often.' },
    { name: 'Don Emilio', role: 'The Baker', desc: 'Hummed three notes every morning for forty years. Earned his sweetness after a quiet grief.' },
    { name: 'Marisol', role: 'The Witness-Dog', desc: 'Has walked Mira to school for four years at six feet distance. Sees, cannot wake.' },
    { name: 'Señor Vidal', role: 'The Sealed One', desc: 'Oscuro destello — Nero\'s natural mystery. Trusts nothing he cannot measure twice.' },
    { name: 'La Abuela', role: 'The Old Sombraluz', desc: 'The schoolyard tree. Older than any living person. Verde light moves slow inside her trunk.' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

async function fileExists(path: string): Promise<boolean> {
  try { await access(path); return true; } catch { return false; }
}

function extractChapterTitle(content: string, filename: string): { title: string; subtitle: string } {
  const chapterHeading = content.match(/^##\s+(?:Chapter\s+\w+:\s+|Kapitel\s+\d+:\s+|Capítulo\s+\d+:\s+)?(.+)$/m);
  if (chapterHeading) return { title: chapterHeading[1].trim(), subtitle: '' };

  const prologueHeading = content.match(/^##\s+Prologue:\s*(.+)$/m);
  if (prologueHeading) return { title: 'Prologue', subtitle: prologueHeading[1].trim() };

  const name = filename.replace(/\.md$/, '').replace(/^\d+-/, '')
    .split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return { title: name, subtitle: '' };
}

function makeExcerpt(content: string): string {
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (t && !t.startsWith('#') && !t.startsWith('---') && !t.startsWith('*') && t.length > 40) {
      return t.length > 180 ? t.slice(0, 180).replace(/\s+\S*$/, '') + '...' : t;
    }
  }
  return '';
}

/* ------------------------------------------------------------------ */
/*  Data loading                                                       */
/* ------------------------------------------------------------------ */

async function loadBook(slug: string) {
  const bookDir = join(BOOK_ROOT, slug);
  const yamlPath = join(bookDir, 'book.yaml');
  if (!(await fileExists(yamlPath))) return null;

  const { data: manifest } = matter(`---\n${await readFile(yamlPath, 'utf-8')}\n---`) as unknown as { data: BookManifest };
  const chaptersDir = join(bookDir, 'chapters');
  const chapters: DraftChapter[] = [];

  if (await fileExists(chaptersDir)) {
    const files = (await readdir(chaptersDir)).filter((f) => f.endsWith('.md')).sort();
    for (let i = 0; i < files.length; i++) {
      const raw = await readFile(join(chaptersDir, files[i]), 'utf-8');
      const { title, subtitle } = extractChapterTitle(raw, files[i]);
      const words = raw.split(/\s+/).filter(Boolean).length;
      chapters.push({
        slug: files[i].replace(/\.md$/, '').replace(/^\d+-/, ''),
        title, subtitle,
        wordCount: words,
        readTime: Math.max(1, Math.ceil(words / 250)),
        excerpt: makeExcerpt(raw),
        number: i,
      });
    }
  }

  return { manifest, chapters };
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadBook(slug);
  if (!data) return { title: 'Draft Not Found' };
  return {
    title: `${data.manifest.title} — Draft`,
    description: BOOK_DESCRIPTIONS[slug]?.tagline || data.manifest.acknowledgments?.split('\n')[0] || '',
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function DraftBookPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await loadBook(slug);
  if (!data) notFound();

  const { manifest, chapters } = data;
  const totalWords = chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
  const totalReadTime = chapters.reduce((sum, ch) => sum + ch.readTime, 0);
  const accent = ACCENT_MAP[slug] || DEFAULT_ACCENT;
  const cover = COVER_MAP[slug];
  const desc = BOOK_DESCRIPTIONS[slug];
  const characters = BOOK_CHARACTERS[slug] || [];

  const aiModels = manifest.ai_transparency?.models_used || [];
  const humanPct = manifest.ai_transparency?.human_contribution || '?';
  const aiPct = manifest.ai_transparency?.ai_contribution || '?';

  // Tint the Liquid Glass hero based on the book's accent
  const bookTint: 'fire' | 'crystal' | 'gold' | 'neutral' =
    slug === 'forge-of-ruin'
      ? 'fire'
      : slug === 'tides-of-silence' || slug === 'song-of-van-linh'
      ? 'crystal'
      : slug === 'heart-of-pyrathis' || slug === 'las-tierras-de-luz' || slug === 'das-maedchen-drei-sprachen'
      ? 'gold'
      : 'neutral';

  // ---------- Ratings context (server-side, RLS-respecting) ----------
  let heroRating: { average: number; count: number } = { average: 0, count: 0 };
  let currentUserId: string | null = null;
  let isAuthor = false;
  let existingRating: { stars: number; review: string | null } | null = null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    const { data: bookRow } = await supabase
      .from('books')
      .select('id, star_average, rating_count')
      .eq('slug', slug)
      .maybeSingle();

    if (bookRow) {
      const row = bookRow as { id: string; star_average: number | null; rating_count: number | null };
      heroRating = {
        average: Number(row.star_average ?? 0),
        count: Number(row.rating_count ?? 0),
      };

      const { data: userResp } = await supabase.auth.getUser();
      const user = userResp?.user ?? null;
      if (user) {
        currentUserId = user.id;

        const { data: authorRow } = await supabase
          .from('book_authors')
          .select('role')
          .eq('book_id', row.id)
          .eq('user_id', user.id)
          .maybeSingle();
        isAuthor = !!authorRow;

        if (!isAuthor) {
          const { data: myRatingRow } = await supabase
            .from('book_ratings')
            .select('stars, review')
            .eq('book_id', row.id)
            .eq('user_id', user.id)
            .maybeSingle();
          if (myRatingRow) {
            const r = myRatingRow as { stars: number; review: string | null };
            existingRating = { stars: r.stars, review: r.review };
          }
        }
      }
    }
  } catch (err) {
    console.error('[DraftBookPage] ratings context unavailable:', err);
  }

  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {cover && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
            style={{ backgroundImage: `url(${cover})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--arc-cosmic-void)]/60 via-[var(--arc-cosmic-void)]/80 to-[var(--arc-cosmic-void)]" />
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full ${accent.glow} blur-[120px]`} />

        <div className="relative max-w-3xl mx-auto px-6 pt-24 pb-16">
          <Link href="/books/drafts" className="inline-block text-xs text-white/30 hover:text-white/50 transition-colors mb-8">
            &larr; All Drafts
          </Link>

          <LiquidGlass intensity="strong" tint={bookTint} glow="medium" className="p-8 sm:p-12 text-center">
          <p className={`text-[10px] uppercase tracking-[0.3em] ${accent.primary}/60 mb-4`}>
            Draft in Progress
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white/95 mb-4">
            {manifest.title}
          </h1>

          {desc && (
            <p className="text-lg sm:text-xl text-white/40 font-serif italic max-w-xl mx-auto mb-8 leading-relaxed">
              {desc.tagline}
            </p>
          )}

          <div className="flex items-center justify-center gap-6 text-xs text-white/25">
            <span>{chapters.length} chapters</span>
            <span className="w-px h-3 bg-white/10" />
            <span>{totalWords.toLocaleString()} words</span>
            <span className="w-px h-3 bg-white/10" />
            <span>{totalReadTime} min read</span>
            {manifest.tags?.[0] && (
              <>
                <span className="w-px h-3 bg-white/10" />
                <span className="capitalize">{manifest.tags[0].replace(/-/g, ' ')}</span>
              </>
            )}
          </div>

          {heroRating.count > 0 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <StarRating value={heroRating.average} size="md" />
              <span className="text-xs text-white/40 tabular-nums">
                {heroRating.average.toFixed(1)} &middot; {heroRating.count.toLocaleString()}{' '}
                {heroRating.count === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}

          {chapters.length > 0 && (
            <Link
              href={`/books/${slug}/${chapters[0].slug}`}
              className={`inline-flex items-center gap-2 mt-10 px-6 py-3 ${accent.bg} border ${accent.border} ${accent.primary} rounded-xl hover:opacity-80 transition-all text-sm font-medium`}
            >
              Begin Reading <span className="text-xs opacity-60">&rarr;</span>
            </Link>
          )}
          </LiquidGlass>
        </div>
      </section>

      {/* Book Description + Cover */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <LiquidGlass intensity="medium" tint={bookTint} glow="soft" className="p-8 flex flex-col sm:flex-row gap-6">
          {cover && (
            <Image
              src={cover}
              alt={`${manifest.title} cover`}
              width={160}
              height={240}
              sizes="(min-width: 640px) 10rem, 8rem"
              style={{ height: 'auto' }}
              className="w-32 sm:w-40 flex-shrink-0 rounded-lg shadow-2xl self-start"
            />
          )}
          <div>
            <h2 className="text-sm font-display font-semibold text-white/60 uppercase tracking-wider mb-4">About This Draft</h2>
            {desc?.paragraphs.map((p, i) => (
              <p key={i} className="text-white/50 leading-relaxed text-sm mb-4">{p}</p>
            ))}

            {/* Authors */}
            <div className="flex flex-wrap gap-2 mb-4">
              {manifest.authors.map((a) => (
                <span key={a.name} className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40">
                  {a.name} &middot; {a.role.replace(/_/g, ' ')}
                </span>
              ))}
            </div>

            <p className="text-white/35 leading-relaxed text-xs italic">
              This is a live draft. Chapters are published as they are forged.
            </p>

            {/* AI Transparency */}
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2">AI Transparency</p>
              <div className="flex flex-wrap gap-2">
                {aiModels.map((m, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40">
                    {typeof m === 'string' ? m : m.id}
                  </span>
                ))}
                <span className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40">
                  Human: {humanPct}%
                </span>
                <span className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40">
                  AI: {aiPct}%
                </span>
              </div>
            </div>
          </div>
        </LiquidGlass>
      </section>

      {/* Characters */}
      {characters.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <h2 className="text-sm font-display font-semibold text-white/60 uppercase tracking-wider mb-6 text-center">The Cast</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {characters.map((c) => (
              <LiquidGlass key={c.name} intensity="subtle" tint="neutral" glow="none" className="p-4">
                <p className={`text-xs font-medium ${accent.primary}/70 mb-1`}>{c.role}</p>
                <p className="text-sm font-display font-semibold text-white/80 mb-1">{c.name}</p>
                <p className="text-xs text-white/30 leading-relaxed">{c.desc}</p>
              </LiquidGlass>
            ))}
          </div>
        </section>
      )}

      {/* Guardian Intelligence Rating */}
      <GuardianReport bookSlug={slug} />

      {/* Ratings & Reviews */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <h2 className="text-sm font-display font-semibold text-white/60 uppercase tracking-wider mb-6 text-center">
          Ratings & Reviews
        </h2>

        {currentUserId && !isAuthor && (
          <div className="mb-6">
            <ReviewForm bookSlug={slug} existingRating={existingRating} />
          </div>
        )}

        {isAuthor && (
          <div className="mb-6 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm text-center">
            <p className="text-xs text-white/40">
              Authors cannot rate their own books. Thanks for forging this one.
            </p>
          </div>
        )}

        {!currentUserId && (
          <div className="mb-6">
            <ReviewForm bookSlug={slug} existingRating={null} />
          </div>
        )}

        <ReviewList bookSlug={slug} />
      </section>

      {/* Chapters */}
      <section className="max-w-2xl mx-auto px-6 pb-32">
        <h2 className="text-sm font-display font-semibold text-white/60 uppercase tracking-wider mb-6 text-center">Chapters</h2>
        <div className="space-y-2">
          {chapters.map((ch, idx) => (
            <Link
              key={ch.slug}
              href={`/books/${slug}/${ch.slug}`}
              className="group flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all"
            >
              <span className={`flex-shrink-0 w-8 h-8 rounded-lg ${accent.bg} border ${accent.border} flex items-center justify-center text-xs ${accent.primary}/50 font-mono mt-0.5`}>
                {idx === 0 && slug === 'forge-of-ruin' ? 'P' : idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="text-sm font-display font-semibold text-white/80 group-hover:text-white/95 transition-colors truncate">{ch.title}</h3>
                  {ch.subtitle && <span className="text-xs text-white/25 hidden sm:inline">{ch.subtitle}</span>}
                </div>
                <p className="text-xs text-white/25 line-clamp-2 leading-relaxed mb-2">{ch.excerpt}</p>
                <div className="flex items-center gap-3 text-[10px] text-white/20">
                  <span>{ch.wordCount.toLocaleString()} words</span>
                  <span>{ch.readTime} min read</span>
                </div>
              </div>
              <span className="flex-shrink-0 text-white/10 group-hover:text-white/30 transition-colors text-sm mt-1">&rarr;</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
