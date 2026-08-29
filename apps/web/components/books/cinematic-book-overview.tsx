import Link from 'next/link';
import { BookPurchaseButton } from '@/components/books/book-purchase-button';
import type { BookAccessState } from '@/lib/books/polar-access';
import type { CinematicChapterSummary } from '@/lib/books/cinematic-edition';
import {
  CINEMATIC_BOOK_DESCRIPTION,
  CINEMATIC_BOOK_ID,
  CINEMATIC_BOOK_SERIES,
  CINEMATIC_BOOK_TITLE,
  CINEMATIC_EDITION_PRICE,
  FREE_CHAPTER_COUNT,
} from '@/lib/books/cinematic-edition';

interface CinematicBookOverviewProps {
  chapters: CinematicChapterSummary[];
  wordCount: number;
  readTime: number;
  openingContent: string;
  access: BookAccessState;
  checkoutConfigured: boolean;
  released: boolean;
}

function openingParagraphs(content: string): string[] {
  return content
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0 && !paragraph.startsWith('#'))
    .slice(0, 4);
}

function groupChapters(chapters: CinematicChapterSummary[]) {
  const groups = new Map<string, CinematicChapterSummary[]>();
  for (const chapter of chapters) {
    const movement = chapter.movement ?? 'The journey';
    const existing = groups.get(movement) ?? [];
    existing.push(chapter);
    groups.set(movement, existing);
  }
  return Array.from(groups.entries());
}

export function CinematicBookOverview({
  chapters,
  wordCount,
  readTime,
  openingContent,
  access,
  checkoutConfigured,
  released,
}: CinematicBookOverviewProps) {
  const hasAccess = access.status === 'granted';
  const opening = openingParagraphs(openingContent);
  const groupedChapters = groupChapters(chapters);
  const firstChapter = chapters[0];
  const firstPaidChapter = chapters.find((chapter) => chapter.number === FREE_CHAPTER_COUNT + 1);

  return (
    <main className="min-h-screen overflow-hidden bg-[#06080d] text-[#f5f0e6] selection:bg-[#d4b875]/30">
      <section className="relative min-h-[92svh] border-b border-white/10 px-5 pb-16 pt-8 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(49,116,120,0.2),transparent_34%),radial-gradient(circle_at_78%_24%,rgba(194,139,74,0.17),transparent_31%),linear-gradient(130deg,transparent_35%,rgba(255,255,255,0.025)_35.2%,transparent_35.5%)]" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 text-sm text-white/55">
          <Link href="/" className="transition hover:text-white">Arcanea</Link>
          <span>{CINEMATIC_BOOK_SERIES}</span>
        </div>

        <div className="relative mx-auto grid min-h-[78svh] max-w-7xl items-center gap-14 pt-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
          <div>
            <p className="font-mono text-xs tracking-[0.13em] text-[#c8ad75]">
              {released ? 'Book one · founding cinematic edition' : 'Book one · private edition preview'}
            </p>
            <h1 className="mt-6 max-w-xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              {CINEMATIC_BOOK_TITLE}
            </h1>
            <p className="mt-7 max-w-lg font-serif text-xl leading-8 text-white/68">
              Three young makers enter the Academies. The first lesson is who gets to own the person being taught.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/45">
              <span>{chapters.length} chapters</span>
              <span>{wordCount.toLocaleString('en-US')} words</span>
              <span>Arion · Mera · Emilia</span>
            </div>
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              {firstChapter ? (
                <Link
                  href={`/books/${CINEMATIC_BOOK_ID}/${firstChapter.id}`}
                  className="rounded-full bg-[#e5c78a] px-6 py-3 text-sm font-semibold text-[#161108] transition hover:bg-[#f0d79f]"
                >
                  Read the opening free
                </Link>
              ) : null}
              {hasAccess && firstPaidChapter ? (
                <Link
                  href={`/books/${CINEMATIC_BOOK_ID}/${firstPaidChapter.id}`}
                  className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition hover:border-white/40 hover:text-white"
                >
                  Continue the complete edition
                </Link>
              ) : (
                <BookPurchaseButton
                  configured={checkoutConfigured}
                  label={`Get the complete edition — ${CINEMATIC_EDITION_PRICE}`}
                  className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition hover:border-white/40 hover:text-white"
                />
              )}
            </div>
            <p className="mt-5 text-xs leading-5 text-white/35">
              {released
                ? `Chapters 1–${FREE_CHAPTER_COUNT} are free. Purchase access is tied to your Arcanea account and verified by Polar.`
                : `Chapters 1–${FREE_CHAPTER_COUNT} are available for review. Title, art, publication, and sales approval remain pending.`}
            </p>
          </div>

          <article className="relative mx-auto w-full max-w-2xl border border-white/12 bg-[#0b1015]/88 p-7 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur sm:p-10 lg:rotate-[0.35deg]">
            <div className="absolute -left-3 top-12 h-24 w-px bg-[#e2c484]/70" aria-hidden="true" />
            <p className="font-mono text-[11px] tracking-[0.12em] text-[#bfa66f]">From Chapter 1 · The house that leaned</p>
            <div className="mt-7 space-y-5 font-serif text-[1.04rem] leading-[1.85] text-[#e9e2d5]/84 sm:text-lg">
              {opening.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {firstChapter ? (
              <Link href={`/books/${CINEMATIC_BOOK_ID}/${firstChapter.id}`} className="mt-8 inline-flex text-sm text-[#bed5d1] transition hover:text-white">
                Continue Chapter 1 →
              </Link>
            ) : null}
          </article>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[0.72fr_1.28fr] lg:px-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-xs tracking-[0.12em] text-[#bda46f]">The story</p>
          <h2 className="mt-4 font-display text-4xl leading-tight">A school story about the cost of being measured.</h2>
          <p className="mt-6 text-base leading-8 text-white/60">{CINEMATIC_BOOK_DESCRIPTION}</p>
          <dl className="mt-9 grid grid-cols-2 gap-5 border-t border-white/10 pt-7 text-sm">
            <div>
              <dt className="text-white/35">Free opening</dt>
              <dd className="mt-1 text-white/80">4 chapters</dd>
            </div>
            <div>
              <dt className="text-white/35">Estimated reading</dt>
              <dd className="mt-1 text-white/80">{Math.round(readTime / 60)} hours</dd>
            </div>
            <div>
              <dt className="text-white/35">Edition</dt>
              <dd className="mt-1 text-white/80">Responsive digital</dd>
            </div>
            <div>
              <dt className="text-white/35">Access</dt>
              <dd className="mt-1 text-white/80">One-time purchase</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-12">
          {groupedChapters.map(([movement, movementChapters]) => (
            <section key={movement}>
              <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
                <h3 className="font-display text-2xl">{movement}</h3>
                <span className="text-xs text-white/35">{movementChapters.length} chapters</span>
              </div>
              <ol>
                {movementChapters.map((chapter) => {
                  const available = chapter.access === 'free' || hasAccess;
                  return (
                    <li key={chapter.id} className="border-b border-white/[0.06]">
                      <Link
                        href={`/books/${CINEMATIC_BOOK_ID}/${chapter.id}`}
                        className="group grid grid-cols-[2.2rem_1fr_auto] items-center gap-3 py-4"
                      >
                        <span className="font-mono text-xs text-white/25">{chapter.number.toString().padStart(2, '0')}</span>
                        <span>
                          <span className="block text-[0.98rem] text-white/75 transition group-hover:text-white">{chapter.title}</span>
                          {chapter.pov ? <span className="mt-1 block text-xs text-white/30">{chapter.pov} · {chapter.readTime} min</span> : null}
                        </span>
                        <span className={`text-xs ${available ? 'text-[#aac9c4]' : 'text-white/28'}`}>
                          {chapter.access === 'free' ? 'Free' : available ? 'Included' : 'Locked'}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a0e13] px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs tracking-[0.12em] text-[#bda46f]">The complete edition</p>
            <h2 className="mt-4 font-display text-4xl leading-tight">{released ? 'The story stays first.' : 'The planned release package.'}</h2>
            <p className="mt-6 max-w-xl leading-8 text-white/60">
              {released
                ? 'One purchase opens the complete novel in the adaptive reader. A separate Creator’s Ledger documents story decisions, sources, material model contributions, editorial changes, and art provenance without exposing private reasoning or interrupting the fiction.'
                : 'When the edition passes title, canon, art, file, accessibility, and commerce review, one purchase will open the novel, ownership files, artbook, and a separate public-safe Creator’s Ledger. Sales remain closed during revision.'}
            </p>
          </div>
          <div className="border border-white/12 bg-white/[0.025] p-7 sm:p-9">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm text-white/45">{released ? 'Founding cinematic edition' : 'Planned founding edition'}</p>
                <p className="mt-2 font-display text-4xl">{CINEMATIC_EDITION_PRICE}</p>
              </div>
              <span className="text-sm text-white/35">{released ? 'One-time' : 'Target price'}</span>
            </div>
            <ul className="mt-7 space-y-3 border-t border-white/10 pt-7 text-sm leading-6 text-white/62">
              <li>Complete 32-chapter novel</li>
              <li>Responsive desktop and mobile reading modes</li>
              <li>Reflowable EPUB and typeset screen and print PDFs</li>
              <li>Cinematic artbook with rights-cleared narrative plates at release</li>
              <li>Buyer-only production ledger with verified release evidence</li>
              <li>Account-based access with refund-aware verification</li>
            </ul>
            <div className="mt-8">
              {hasAccess && firstPaidChapter ? (
                <Link href={`/books/${CINEMATIC_BOOK_ID}/${firstPaidChapter.id}`} className="inline-flex rounded-full bg-[#e5c78a] px-6 py-3 text-sm font-semibold text-[#161108] transition hover:bg-[#f0d79f]">
                  Open the complete edition
                </Link>
              ) : (
                <BookPurchaseButton
                  configured={checkoutConfigured}
                  className="rounded-full bg-[#e5c78a] px-6 py-3 text-sm font-semibold text-[#161108] transition hover:bg-[#f0d79f]"
                />
              )}
            </div>
            {hasAccess ? (
              <Link href={`/books/${CINEMATIC_BOOK_ID}/ledger`} className="mt-5 inline-flex text-sm text-[#b9d1cc] transition hover:text-white">
                Open the Creator’s Ledger →
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between lg:px-12">
        <span>Chronicles of Arcanea · Book one</span>
        <span>Story, craft, and provenance are versioned separately.</span>
      </footer>
    </main>
  );
}
