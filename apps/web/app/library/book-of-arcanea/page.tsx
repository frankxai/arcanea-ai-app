import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { ReadingProgressBar, FloatingChapterNav } from "./reading-progress";
import { BOOK_OF_ARCANEA_CONTENT } from "@/lib/book-content";

export const metadata: Metadata = {
  title: "The Book of Arcanea",
  description:
    "Creation myth. Philosophical core. Practical map. Community invitation. 23 chapters across the full mythology, the Ten Gates, and the creative life.",
  openGraph: {
    title: "The Book of Arcanea",
    description:
      "A single text that contains the entire Arcanean universe — from the First Dawn to the Invitation.",
  },
};

/* Table of contents structure for navigation */
const TOC = [
  {
    part: "Part I: The Dreaming",
    chapters: [
      { num: 1, title: "Before the Light", id: "chapter-1-before-the-light" },
      { num: 2, title: "The First Dawn", id: "chapter-2-the-first-dawn" },
      { num: 3, title: "The Five Breaths", id: "chapter-3-the-five-breaths" },
      {
        num: 4,
        title: "The Fall and the Promise",
        id: "chapter-4-the-fall-and-the-promise",
      },
    ],
  },
  {
    part: "Part II: The Ten Gates",
    chapters: [
      {
        num: 5,
        title: "The Gate of Foundation",
        id: "chapter-5-the-gate-of-foundation",
      },
      { num: 6, title: "The Gate of Flow", id: "chapter-6-the-gate-of-flow" },
      { num: 7, title: "The Gate of Fire", id: "chapter-7-the-gate-of-fire" },
      {
        num: 8,
        title: "The Gate of Heart",
        id: "chapter-8-the-gate-of-heart",
      },
      {
        num: 9,
        title: "The Gate of Voice",
        id: "chapter-9-the-gate-of-voice",
      },
      {
        num: 10,
        title: "The Gate of Sight",
        id: "chapter-10-the-gate-of-sight",
      },
      {
        num: 11,
        title: "The Gate of Crown",
        id: "chapter-11-the-gate-of-crown",
      },
      {
        num: 12,
        title: "The Gate of Starweave",
        id: "chapter-12-the-gate-of-starweave",
      },
      {
        num: 13,
        title: "The Gate of Unity",
        id: "chapter-13-the-gate-of-unity",
      },
      {
        num: 14,
        title: "The Gate of Source",
        id: "chapter-14-the-gate-of-source",
      },
    ],
  },
  {
    part: "Part III: The Luminors",
    chapters: [
      {
        num: 15,
        title: "The Rank Beyond All Ranks",
        id: "chapter-15-the-rank-beyond-all-ranks",
      },
      { num: 16, title: "The Council", id: "chapter-16-the-council" },
    ],
  },
  {
    part: "Part IV: The Living World",
    chapters: [
      { num: 17, title: "The Academy", id: "chapter-17-the-academy" },
      { num: 18, title: "The Library", id: "chapter-18-the-library" },
      { num: 19, title: "The Forge", id: "chapter-19-the-forge" },
      { num: 20, title: "The Community", id: "chapter-20-the-community" },
    ],
  },
  {
    part: "Part V: The Arc",
    chapters: [
      {
        num: 21,
        title: "The Five Phases",
        id: "chapter-21-the-five-phases",
      },
      {
        num: 22,
        title: "The Abundance Protocol",
        id: "chapter-22-the-abundance-protocol",
      },
      { num: 23, title: "The Invitation", id: "chapter-23-the-invitation" },
    ],
  },
];

/* Pull quotes mapped by chapter number */
const PULL_QUOTES: Record<number, string> = {
  1: "You are not starting from nothing. You are starting from everything.",
  2: "Lumina and Nero are not opposites. They are partners.",
  3: "The path of mastery is not to specialize in one element but to access all five at will.",
  4: "Malachar\u2019s mistake was not ambition. It was impatience.",
  5: "Before you build anything, build the ground beneath your feet.",
  6: "Creation is not forcing. It is becoming the river.",
  7: "The Gate of Fire does not open for those who avoid the burn. It opens for those who walk into it.",
  8: "Creation without love produces artifacts. Creation with love produces art.",
  9: "The Gate opens not when you speak perfectly but when you speak honestly.",
  10: "To open the Gate of Sight is to develop the courage to follow vision before validation.",
  11: "The higher you go, the more grounded you become.",
  12: "Everything is connected. The Gate of Starweave is where you stop believing that and start perceiving it.",
  13: "Collaboration is not compromise. It is amplification.",
  14: "At the Source Gate, the distinction between creator and creation dissolves.",
  15: "A Luminor does not live in the Source Gate. A Luminor lives in all Gates simultaneously.",
  16: "The Council is not a committee that reaches consensus. It is a cabinet of perspectives you consult to illuminate what you cannot see alone.",
  17: "Failure is not punished. Failure is curriculum.",
  18: "These books are not entertainment. They are equipment for living.",
  19: "Thinking about creating is not creating. Planning to create is not creating. Only creating is creating.",
  20: "The most dangerous myth in the creative life is the myth of the solitary genius.",
  21: "You are not going in circles. You are ascending.",
  22: "Ideas are not consumed by sharing. Knowledge is not diminished by distribution.",
  23: "Enter seeking. Leave transformed. Return whenever needed.",
};

/** Split book markdown into chapters for interleaved quote rendering */
function splitIntoChapters(content: string): { chapterNum: number; markdown: string }[] {
  // Match "## Chapter N" headings (the book uses ## for chapters)
  const chapterRegex = /^(## Chapter \d+)/gm;
  const parts: { chapterNum: number; markdown: string }[] = [];
  let lastIndex = 0;
  let lastChapterNum = 0;
  let match: RegExpExecArray | null;

  while ((match = chapterRegex.exec(content)) !== null) {
    if (lastIndex > 0 || match.index > 0) {
      parts.push({
        chapterNum: lastChapterNum,
        markdown: content.slice(lastIndex, match.index),
      });
    }
    const numMatch = match[1].match(/\d+/);
    lastChapterNum = numMatch ? parseInt(numMatch[0], 10) : 0;
    lastIndex = match.index;
  }

  // Push the remaining content
  if (lastIndex < content.length) {
    parts.push({
      chapterNum: lastChapterNum,
      markdown: content.slice(lastIndex),
    });
  }

  return parts;
}

/* Shared markdown component config */
const markdownComponents = {
  h1: ({ children, ...props }: React.ComponentPropsWithoutRef<"h2"> & { children?: React.ReactNode }) => {
    const id = String(children)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return (
      <h2
        id={id}
        className="mb-6 mt-24 scroll-mt-24 border-b border-white/[0.06] pb-4 font-display text-3xl font-bold tracking-tight text-white first:mt-0 sm:text-4xl"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h2: ({ children, ...props }: React.ComponentPropsWithoutRef<"h3"> & { children?: React.ReactNode }) => {
    const text = String(children);
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return (
      <h3
        id={id}
        className="mb-4 mt-16 scroll-mt-24 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl"
        {...props}
      >
        {children}
      </h3>
    );
  },
  h3: ({ children, ...props }: React.ComponentPropsWithoutRef<"h4"> & { children?: React.ReactNode }) => {
    const id = String(children)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return (
      <h4
        id={id}
        className="mb-3 mt-12 scroll-mt-24 text-xl font-semibold text-white/90"
        {...props}
      >
        {children}
      </h4>
    );
  },
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-6 text-lg leading-[1.85] text-white/70">{children}</p>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="text-white/85 not-italic font-medium">{children}</em>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-white/95">{children}</strong>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-8 border-l-2 border-[#00bcd4]/40 pl-6 text-lg italic text-white/60">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-16 border-0 border-t border-white/[0.06]" />,
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-6 space-y-2 pl-6 text-lg text-white/70">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-6 list-decimal space-y-2 pl-6 text-lg text-white/70">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-[1.8]">{children}</li>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-white/[0.06]">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="border-b border-white/[0.06] bg-white/[0.03]">
      {children}
    </thead>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/60">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-4 py-3 text-white/70">{children}</td>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className="border-b border-white/[0.04] last:border-0">{children}</tr>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a
      href={href}
      className="text-[#00bcd4] underline underline-offset-2 transition-colors hover:text-[#00bcd4]/80"
    >
      {children}
    </a>
  ),
};

function PullQuoteCard({ quote, chapter }: { quote: string; chapter: number }) {
  return (
    <div className="relative my-16 mx-auto max-w-xl">
      <div className="absolute -left-3 -top-3 text-5xl font-display text-[#00bcd4]/15 select-none">
        &ldquo;
      </div>
      <div className="rounded-2xl border border-[#00bcd4]/10 bg-gradient-to-br from-[#00bcd4]/[0.04] to-transparent px-8 py-8 backdrop-blur-sm">
        <p className="text-center text-lg font-medium italic leading-relaxed text-white/80">
          &ldquo;{quote}&rdquo;
        </p>
        <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-[#00bcd4]/50">
          Chapter {chapter}
        </p>
      </div>
    </div>
  );
}

export default function BookOfArcaneaPage() {
  const rawContent = BOOK_OF_ARCANEA_CONTENT;

  // Strip the top-level title and subtitle (already shown in hero)
  const content = rawContent
    .replace(/^# The Book of Arcanea\n/, "")
    .replace(/^>.*\n\n---\n/m, "");

  const chapters = splitIntoChapters(content);

  return (
    <div className="min-h-screen bg-[hsl(240,6%,4%)]">
      {/* Reading progress bar */}
      <ReadingProgressBar />

      {/* Floating chapter navigation */}
      <FloatingChapterNav />

      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#00bcd4] focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>

      {/* Hero / Cover */}
      <header className="relative overflow-hidden">
        {/* Cover image */}
        <div className="absolute inset-0">
          <Image
            src="/images/luminors/book-cover.jpg"
            alt="The Book of Arcanea — World Tree Yggdrasil with the Ten Gates"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(240,6%,4%)]/40 via-[hsl(240,6%,4%)]/60 to-[hsl(240,6%,4%)]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-32 text-center sm:pt-40 md:pt-48">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#00bcd4]/80">
            The Library of Arcanea
          </p>
          <h1 className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
            The Book of Arcanea
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/70 sm:text-xl">
            A creation myth. A philosophical core. A practical map.
            <br className="hidden sm:block" />
            A community invitation. A complete world.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/50">
            <span>23 chapters</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>~60 min read</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>5 parts</span>
          </div>
          <a
            href="#main-content"
            className="mt-10 inline-block rounded-xl border border-[#00bcd4]/40 bg-[#00bcd4]/10 px-8 py-3 text-sm font-medium text-[#00bcd4] backdrop-blur transition-all hover:bg-[#00bcd4]/20 hover:border-[#00bcd4]/60"
          >
            Begin Reading
          </a>
        </div>
      </header>

      {/* Table of Contents */}
      <nav className="border-y border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h2 className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-white/40">
            Table of Contents
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TOC.map((part) => (
              <div key={part.part}>
                <h3 className="mb-3 text-sm font-semibold text-[#00bcd4]">
                  {part.part}
                </h3>
                <ol className="space-y-1.5">
                  {part.chapters.map((ch) => (
                    <li key={ch.num}>
                      <a
                        href={`#${ch.id}`}
                        className="group flex items-baseline gap-2 text-sm text-white/50 transition-colors hover:text-white/90"
                      >
                        <span className="w-5 text-right text-xs text-white/30 group-hover:text-[#00bcd4]">
                          {ch.num}
                        </span>
                        <span>{ch.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content — chapters interleaved with pull quotes */}
      <main id="main-content" className="mx-auto max-w-3xl px-6 py-16">
        <article className="book-prose">
          {chapters.length > 1 ? (
            chapters.map((part, i) => (
              <div key={i}>
                {/* Pull quote card before each chapter (except prologue) */}
                {part.chapterNum > 0 && PULL_QUOTES[part.chapterNum] && (
                  <PullQuoteCard
                    quote={PULL_QUOTES[part.chapterNum]}
                    chapter={part.chapterNum}
                  />
                )}
                {/* @ts-expect-error -- ReactMarkdown component types are permissive */}
                <ReactMarkdown components={markdownComponents}>
                  {part.markdown}
                </ReactMarkdown>
              </div>
            ))
          ) : (
            /* Fallback: render as single block if chapter splitting fails */
            // @ts-expect-error -- ReactMarkdown component types are permissive
            <ReactMarkdown components={markdownComponents}>
              {content}
            </ReactMarkdown>
          )}
        </article>

        {/* End mark */}
        <div className="mt-24 flex flex-col items-center gap-6 border-t border-white/[0.06] pt-16 text-center">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#00bcd4]/40 to-transparent" />
          <p className="text-sm italic text-white/40">
            Enter seeking. Leave transformed. Return whenever needed.
          </p>
          <div className="flex gap-4">
            <Link
              href="/library"
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm text-white/60 transition-all hover:bg-white/[0.06] hover:text-white/80"
            >
              Explore the Library
            </Link>
            <Link
              href="/council"
              className="rounded-lg border border-[#00bcd4]/30 bg-[#00bcd4]/10 px-5 py-2.5 text-sm text-[#00bcd4] transition-all hover:bg-[#00bcd4]/20"
            >
              Meet the Council
            </Link>
          </div>
        </div>
      </main>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            name: "The Book of Arcanea",
            description:
              "A creation myth, philosophical core, practical map, and community invitation for the Arcanean universe.",
            url: "https://arcanea.ai/library/book-of-arcanea",
            author: { "@type": "Organization", name: "Arcanea" },
            publisher: {
              "@type": "Organization",
              name: "Arcanea",
              url: "https://arcanea.ai",
            },
            numberOfPages: 23,
            inLanguage: "en",
          }),
        }}
      />
    </div>
  );
}
