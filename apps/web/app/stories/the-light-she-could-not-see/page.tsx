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
    "At twenty-nine, Selene can see the light around everyone but herself. Ride with her from Caracas into the mountains, the dragon roost, and the depths of Mar Arcano.",
  openGraph: {
    title: "The Light She Could Not See",
    description:
      "A rider, three friends, a wounded dragon, and a sea that carries a dangerous secret.",
    images: ["/stories/horsewoman/open-road-hero.webp"],
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
    .split(/(?=^## \d{2} · )/m)
    .filter((part) => /^## /m.test(part))
    .map((text) => {
      const heading = text.match(/^## (\d{2}) · (.+)$/m);
      if (!heading) throw new Error(`Missing chapter heading in ${file}`);
      const number = Number(heading[1]);
      return { number, title: heading[2], text, id: `chapter-${number}` };
    });
}

const chapters = [
  ...chaptersFrom("THE_LIGHT_SHE_COULD_NOT_SEE.md"),
  ...chaptersFrom("THE_RIDER_CIRCLE.md"),
  ...chaptersFrom("THE_OPEN_ROAD.md"),
];

const movements = [
  { number: 1, title: "The first crossing", chapter: 1 },
  { number: 2, title: "The rider circle", chapter: 13 },
  { number: 3, title: "The eastern crossing", chapter: 18 },
];

function ChapterIndex() {
  return (
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
  );
}

export default function HorsewomanStory() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/books" className={styles.brand}>
          ARCANEA <span>/ STORIES</span>
        </Link>
        <a href="#desktop-contents" className={styles.contentsLinkDesktop}>
          Chapter index
        </a>
        <a href="#contents" className={styles.contentsLinkMobile}>
          Chapter index
        </a>
      </header>

      <section className={styles.hero} aria-labelledby="story-title">
        <Image
          src="/stories/horsewoman/open-road-hero.webp"
          alt="Selene rides Brío above a winding dawn-lit river, with misty tepuis and orchids beyond"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>
            An illustrated serial · Caracas to Mar Arcano
          </p>
          <h1 id="story-title">
            The Light
            <br />
            She Could Not See
          </h1>
          <p>
            At twenty-nine, she could see the light around everyone but herself.
            Then the mountain began to sound beneath the water.
          </p>
          <a href="#chapter-1" className={styles.readButton}>
            Begin reading <span aria-hidden="true">↓</span>
          </a>
        </div>
        <p className={styles.heroCredit}>
          {chapters.length} chapters · Three crossings · Illustrated
        </p>
      </section>

      <div className={styles.layout}>
        <aside
          className={styles.sidebar}
          id="desktop-contents"
          aria-label="Table of contents"
        >
          <div className={styles.sidebarInner}>
            <p className={styles.smallLabel}>The story</p>
            <p className={styles.sidebarTitle}>The Light She Could Not See</p>
            <nav aria-label="Story movements" className={styles.movements}>
              {movements.map((movement) => (
                <a key={movement.number} href={`#chapter-${movement.chapter}`}>
                  <span>Part {movement.number}</span> {movement.title}
                </a>
              ))}
            </nav>
            <nav aria-label="Chapters" className={styles.desktopChapters}>
              <ChapterIndex />
            </nav>
            <p className={styles.sidebarNote}>
              A complete first journey and the opening of The Open Road.
            </p>
          </div>
        </aside>

        <article className={styles.reader}>
          <details id="contents" className={styles.mobileContents}>
            <summary>Browse the {chapters.length} chapters</summary>
            <nav aria-label="Mobile chapter index">
              <ChapterIndex />
            </nav>
          </details>
          <div className={styles.intro}>
            <p className={styles.smallLabel}>Part I · The first crossing</p>
            <p>
              Caracas. A mountain passage. A woman who has spent her life
              reading everybody else, and a horse who makes her wait.
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
                <div className={`${styles.partBreak} ${styles.riderBreak}`}>
                  <Image
                    src="/stories/horsewoman/rider-circle.webp"
                    width={941}
                    height={1672}
                    sizes="(max-width: 760px) 100vw, 650px"
                    alt="Selene and Brío ride alongside Iva, Luz, and Tami above a flooded watershed"
                  />
                  <div>
                    <span>PART II · THE RIDER CIRCLE</span>
                    <h2>Four riders. One sound beneath the mountain.</h2>
                  </div>
                </div>
              )}
              {chapter.number === 18 && (
                <div className={styles.partBreak}>
                  <Image
                    src="/stories/horsewoman/the-open-road-cover.webp"
                    width={1024}
                    height={1536}
                    sizes="(max-width: 760px) 100vw, 650px"
                    alt="Selene and Brío examine a damaged river crossing while Cael waits with a lantern"
                  />
                  <div>
                    <span>THE EASTERN CROSSING</span>
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
              {chapter.number < chapters.length && (
                <a
                  className={styles.nextChapter}
                  href={`#chapter-${chapter.number + 1}`}
                >
                  <span>
                    Next chapter <span aria-hidden="true">→</span>
                  </span>
                  <strong>{chapters[chapter.number].title}</strong>
                </a>
              )}
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
