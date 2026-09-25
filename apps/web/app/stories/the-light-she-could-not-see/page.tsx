import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import ReactMarkdown from "react-markdown";
import styles from "./story.module.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "The Light She Could Not See | Arcanea Stories",
  description:
    "An illustrated story of Selene Velara, Brío, two worlds, and the difficult art of seeing without claiming to know.",
  openGraph: {
    title: "The Light She Could Not See",
    description:
      "An illustrated Arcanea story about the roads we choose and the people we let choose with us.",
    images: ["/stories/horsewoman/the-open-road-cover.webp"],
  },
  alternates: { canonical: "/stories/the-light-she-could-not-see" },
};

type Chapter = { number: number; title: string; text: string; id: string };

function chaptersFrom(file: string): Chapter[] {
  const raw = readFileSync(
    join(process.cwd(), "content/stories/the-light-she-could-not-see", file),
    "utf8",
  );
  return raw
    .split(/(?=^## (?:\d{2} · |(?:Thirteen|Fourteen|Fifteen|Sixteen) · ))/m)
    .filter((part) => /^## /m.test(part))
    .map((text) => {
      const heading = text.match(
        /^## (\d{2}|Thirteen|Fourteen|Fifteen|Sixteen) · (.+)$/m,
      );
      if (!heading) throw new Error(`Missing chapter heading in ${file}`);
      const number = /^\d+$/.test(heading[1])
        ? Number(heading[1])
        : (
            { Thirteen: 13, Fourteen: 14, Fifteen: 15, Sixteen: 16 } as Record<
              string,
              number
            >
          )[heading[1]];
      return { number, title: heading[2], text, id: `chapter-${number}` };
    });
}

const chapters = [
  ...chaptersFrom("THE_LIGHT_SHE_COULD_NOT_SEE.md"),
  ...chaptersFrom("THE_OPEN_ROAD.md"),
];

export default function HorsewomanStory() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/books" className={styles.brand}>
          ARCANEA <span>/ STORIES</span>
        </Link>
        <a href="#contents" className={styles.contentsLink}>
          Chapter index
        </a>
      </header>

      <section className={styles.hero} aria-labelledby="story-title">
        <Image
          src="/stories/horsewoman/chapter-12-2.webp"
          alt="Selene rides Brío along a high trail above a dawn-lit river and distant tepuis"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>
            An illustrated novella · Caracas to the eastern river
          </p>
          <h1 id="story-title">
            The Light
            <br />
            She Could Not See
          </h1>
          <p>
            She could see the light around everyone except herself. Then a horse
            taught her to ask before she followed.
          </p>
          <a href="#chapter-1" className={styles.readButton}>
            Begin reading <span aria-hidden="true">↓</span>
          </a>
        </div>
        <p className={styles.heroCredit}>16 chapters · 25 illustrations</p>
      </section>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Table of contents">
          <div className={styles.sidebarInner}>
            <p className={styles.smallLabel}>The story</p>
            <p className={styles.sidebarTitle}>
              Two homes. One road of her own.
            </p>
            <nav aria-label="Chapters" className={styles.desktopChapters}>
              <ol className={styles.chapterList}>
                {chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <a href={`#${chapter.id}`}>
                      <span>{String(chapter.number).padStart(2, "0")}</span>
                      {chapter.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <p className={styles.sidebarNote}>
              A complete first journey, followed by the opening of The Open
              Road.
            </p>
          </div>
        </aside>

        <article className={styles.reader}>
          <details id="contents" className={styles.mobileContents}>
            <summary>Browse the 16 chapters</summary>
            <nav aria-label="Mobile chapter index">
              <ol className={styles.chapterList}>
                {chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <a href={`#${chapter.id}`}>
                      <span>{String(chapter.number).padStart(2, "0")}</span>
                      {chapter.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </details>
          <div className={styles.intro}>
            <p className={styles.smallLabel}>Before the road</p>
            <p>
              There are extraordinary places here. They still have broken gates,
              late dinners, tired animals, people who disagree, and a future
              nobody gets to own alone.
            </p>
            <p className={styles.editionNote}>
              An independent story continuity. Its Selene is twenty-nine; she is
              distinct from the younger Selene of <em>Las Tierras de Luz</em>.
            </p>
          </div>
          {chapters.map((chapter) => (
            <section
              key={chapter.id}
              id={chapter.id}
              className={styles.chapter}
              aria-label={`Chapter ${chapter.number}: ${chapter.title}`}
            >
              {chapter.number === 13 && (
                <div className={styles.partBreak}>
                  <Image
                    src="/stories/horsewoman/the-open-road-cover.webp"
                    width={1024}
                    height={1536}
                    sizes="(max-width: 760px) 100vw, 650px"
                    alt="Selene and Brío examine a damaged river crossing while Cael waits with a lantern"
                  />
                  <div>
                    <span>THE OPEN ROAD · PART II</span>
                    <h2>Some bridges should wait for daylight.</h2>
                  </div>
                </div>
              )}
              <ReactMarkdown
                components={{
                  h2: ({ children }) => <h2>{children}</h2>,
                  img: ({ src, alt }) =>
                    typeof src === "string" ? (
                      <Image
                        src={src}
                        alt={alt || ""}
                        width={944}
                        height={1672}
                        sizes="(max-width: 760px) 100vw, 650px"
                      />
                    ) : null,
                }}
              >
                {chapter.text}
              </ReactMarkdown>
              <div className={styles.chapterEnd} aria-hidden="true" />
            </section>
          ))}
          <footer className={styles.endnote}>
            <p>
              End of the opening chapters of <em>The Open Road</em>. Selene,
              Brío, and Cael have more to learn; this story is an independent
              imagining, separate from the locked <em>Las Tierras de Luz</em>{" "}
              continuity.
            </p>
            <div className={styles.footerLinks}>
              <a href="#story-title">Return to the beginning</a>
              <Link href="/books">Explore other books</Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
