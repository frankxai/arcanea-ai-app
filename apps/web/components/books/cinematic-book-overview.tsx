import Image from "next/image";
import Link from "next/link";
import styles from "./cinematic-book-overview.module.css";
import { BookPurchaseButton } from "@/components/books/book-purchase-button";
import type { BookAccessState } from "@/lib/books/polar-access";
import type { CinematicChapterSummary } from "@/lib/books/cinematic-edition";
import {
  CINEMATIC_BOOK_DESCRIPTION,
  CINEMATIC_BOOK_ID,
  CINEMATIC_BOOK_SERIES,
  CINEMATIC_BOOK_TITLE,
  CINEMATIC_EDITION_PRICE,
  FREE_CHAPTER_COUNT,
} from "@/lib/books/cinematic-edition";

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
    .filter((paragraph) => paragraph.length > 0 && !paragraph.startsWith("#"))
    .slice(0, 4);
}

function groupChapters(chapters: CinematicChapterSummary[]) {
  const groups = new Map<string, CinematicChapterSummary[]>();
  for (const chapter of chapters) {
    const movement = chapter.movement ?? "The journey";
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
  const hasAccess = access.status === "granted";
  const opening = openingParagraphs(openingContent);
  const groupedChapters = groupChapters(chapters);
  const firstChapter = chapters[0];
  const firstPaidChapter = chapters.find(
    (chapter) => chapter.number === FREE_CHAPTER_COUNT + 1,
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--arc-cosmic-void)] text-[var(--arc-text-primary)] selection:bg-[var(--arc-gold-light)]/30">
      <section className="relative border-b border-white/10 px-5 pb-16 pt-8 sm:px-8 lg:px-12">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 text-sm text-[var(--arc-text-secondary)]">
          <Link href="/books" className="transition hover:text-white">
            Arcanea books
          </Link>
          <span>{CINEMATIC_BOOK_SERIES}</span>
        </div>

        <div className={styles.hero}>
          <div className={styles.title}>
            <p className="font-mono text-xs leading-5 text-[var(--arc-gold-light)]">
              {released
                ? "Book one · cinematic edition"
                : "Book one · private preview"}
            </p>
            <h1 className="mt-4 font-display font-semibold leading-[1.02] tracking-tight">
              {CINEMATIC_BOOK_TITLE}
            </h1>
          </div>

          <figure className={styles.cover}>
            <div className="relative aspect-[496/793] overflow-hidden border border-white/10 bg-[var(--arc-cosmic-deep)] shadow-elevation-3">
              <Image
                src="/images/books/the-last-free-path/cover-held-interval-preview.png"
                alt="Cover study showing Arion, Mera, and Emilia around a narrow dry path through stone and mineral water."
                fill
                priority
                sizes="(max-width: 639px) 38vw, (max-width: 1023px) 28vw, 22vw"
                className="object-cover"
              />
            </div>
            {!released ? (
              <figcaption className="mt-3 text-xs leading-5 text-[var(--arc-text-secondary)]">
                Cover study · approval pending
              </figcaption>
            ) : null}
          </figure>

          <div className={styles.invitation}>
            <p className="max-w-lg font-serif text-xl leading-8 text-[var(--arc-text-primary)]">
              Three young makers enter the Academies. The first lesson is who
              gets to own the person being taught.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {firstChapter ? (
                <Link
                  href={`/books/${CINEMATIC_BOOK_ID}/${firstChapter.id}`}
                  className={styles.primaryAction}
                >
                  Read Chapter 1 free
                </Link>
              ) : null}
              {hasAccess && firstPaidChapter ? (
                <Link
                  href={`/books/${CINEMATIC_BOOK_ID}/${firstPaidChapter.id}`}
                  className={styles.secondaryAction}
                >
                  Continue the edition
                </Link>
              ) : checkoutConfigured ? (
                <BookPurchaseButton
                  configured={checkoutConfigured}
                  label={`Get the complete edition · ${CINEMATIC_EDITION_PRICE}`}
                  className={styles.secondaryAction}
                />
              ) : (
                <a href="#edition" className={styles.secondaryAction}>
                  About this edition
                </a>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--arc-text-secondary)]">
              <span>{chapters.length} chapters</span>
              <span>{wordCount.toLocaleString("en-US")} words</span>
              <span>Arion · Mera · Emilia</span>
            </div>
            <p className="mt-4 max-w-lg text-xs leading-5 text-[var(--arc-text-secondary)]">
              {released
                ? "Chapter 1 is free. Purchase access is tied to your Arcanea account and verified by Polar."
                : "An in-revision preview. Title, art and publication approval remain pending. Sales are closed."}
            </p>
          </div>

          <article className={styles.excerpt}>
            <p className="font-mono text-xs leading-5 text-[var(--arc-gold-light)]">
              From Chapter 1 · The house that leaned
            </p>
            <div
              className={`${styles.opening} mt-6 space-y-5 font-serif text-lg leading-relaxed text-[var(--arc-text-primary)]`}
            >
              {opening.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {firstChapter ? (
              <Link
                href={`/books/${CINEMATIC_BOOK_ID}/${firstChapter.id}`}
                className="mt-7 inline-flex text-sm text-[var(--arc-text-secondary)] underline decoration-white/20 underline-offset-4 hover:text-white"
              >
                Continue Chapter 1
              </Link>
            ) : null}
          </article>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[0.72fr_1.28fr] lg:px-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-xs tracking-[0.12em] text-[var(--arc-gold-light)]">
            The story
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight">
            A school story about the cost of being measured.
          </h2>
          <p className="mt-6 text-base leading-8 text-white/60">
            {CINEMATIC_BOOK_DESCRIPTION}
          </p>
          <dl className="mt-9 grid grid-cols-2 gap-5 border-t border-white/10 pt-7 text-sm">
            <div>
              <dt className="text-white/35">Free opening</dt>
              <dd className="mt-1 text-white/80">Chapter 1</dd>
            </div>
            <div>
              <dt className="text-white/35">Estimated reading</dt>
              <dd className="mt-1 text-white/80">
                {Math.round(readTime / 60)} hours
              </dd>
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
                <span className="text-xs text-white/35">
                  {movementChapters.length} chapters
                </span>
              </div>
              <ol>
                {movementChapters.map((chapter) => {
                  const available = chapter.access === "free" || hasAccess;
                  return (
                    <li
                      key={chapter.id}
                      className="border-b border-white/[0.06]"
                    >
                      <Link
                        href={`/books/${CINEMATIC_BOOK_ID}/${chapter.id}`}
                        className="group grid grid-cols-[2.2rem_1fr_auto] items-center gap-3 py-4"
                      >
                        <span className="font-mono text-xs text-white/25">
                          {chapter.number.toString().padStart(2, "0")}
                        </span>
                        <span>
                          <span className="block text-[0.98rem] text-white/75 transition group-hover:text-white">
                            {chapter.title}
                          </span>
                          {chapter.pov ? (
                            <span className="mt-1 block text-xs text-white/30">
                              {chapter.pov} · {chapter.readTime} min
                            </span>
                          ) : null}
                        </span>
                        <span
                          className={`text-xs ${available ? "text-[var(--arc-text-secondary)]" : "text-white/28"}`}
                        >
                          {chapter.access === "free"
                            ? "Free"
                            : available
                              ? "Included"
                              : "Locked"}
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

      <section
        id="edition"
        className="border-y border-white/10 bg-[var(--arc-cosmic-deep)] px-6 py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs tracking-[0.12em] text-[var(--arc-gold-light)]">
              The complete edition
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight">
              {released
                ? "The story stays first."
                : "The planned release package."}
            </h2>
            <p className="mt-6 max-w-xl leading-8 text-white/60">
              {released
                ? "One purchase opens the complete novel in the adaptive reader. A separate Creator’s Ledger documents story decisions, sources, material model contributions, editorial changes, and art provenance without exposing private reasoning or interrupting the fiction."
                : "When the edition passes title, canon, art, file, accessibility, and commerce review, one purchase will open the novel, ownership files, artbook, and a separate public-safe Creator’s Ledger. Sales remain closed during revision."}
            </p>
          </div>
          <div className="border border-white/12 bg-white/[0.025] p-7 sm:p-9">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm text-white/45">
                  {released
                    ? "Founding cinematic edition"
                    : "Planned founding edition"}
                </p>
                <p className="mt-2 font-display text-4xl">
                  {CINEMATIC_EDITION_PRICE}
                </p>
              </div>
              <span className="text-sm text-white/35">
                {released ? "One-time" : "Target price"}
              </span>
            </div>
            <ul className="mt-7 space-y-3 border-t border-white/10 pt-7 text-sm leading-6 text-white/62">
              <li>Complete 32-chapter novel</li>
              <li>Responsive desktop and mobile reading modes</li>
              <li>Reflowable EPUB and typeset screen and print PDFs</li>
              <li>
                Cinematic artbook with rights-cleared narrative plates at
                release
              </li>
              <li>
                Buyer-only production ledger with verified release evidence
              </li>
              <li>Account-based access with refund-aware verification</li>
            </ul>
            <div className="mt-8">
              {hasAccess && firstPaidChapter ? (
                <Link
                  href={`/books/${CINEMATIC_BOOK_ID}/${firstPaidChapter.id}`}
                  className="inline-flex rounded-full bg-[var(--arc-gold-light)] px-6 py-3 text-sm font-semibold text-[var(--arc-cosmic-void)] transition hover:bg-[var(--arc-text-primary)]"
                >
                  Open the complete edition
                </Link>
              ) : (
                <BookPurchaseButton
                  configured={checkoutConfigured}
                  className="rounded-full bg-[var(--arc-gold-light)] px-6 py-3 text-sm font-semibold text-[var(--arc-cosmic-void)] transition hover:bg-[var(--arc-text-primary)]"
                />
              )}
            </div>
            {hasAccess ? (
              <Link
                href={`/books/${CINEMATIC_BOOK_ID}/ledger`}
                className="mt-5 inline-flex text-sm text-[var(--arc-text-secondary)] transition hover:text-white"
              >
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
