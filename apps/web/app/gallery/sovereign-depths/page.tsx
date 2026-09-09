import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  SOVEREIGN_DEPTHS,
  SOVEREIGN_ENTRIES,
} from "@/lib/visual-encyclopedia/sovereign-depths";
import { CollectionGrid } from "./collection-grid";
import styles from "./sovereign-depths.module.css";

export const metadata: Metadata = {
  title: "The Sovereign Depths | Arcanea",
  description:
    "Worldbuilding concepts. Twenty-four bosses. Twelve extraordinary dungeons. Explore an original cinematic fantasy collection through art, histories and encounter designs.",
  alternates: { canonical: "/gallery/sovereign-depths" },
  openGraph: {
    title: "The Sovereign Depths | Arcanea",
    description:
      "Worldbuilding concepts: an original Arcanea collection of bosses, dungeons and the histories between them.",
    images: [{ url: "/images/sovereign-depths/d02.webp" }],
  },
};

export default function SovereignDepthsPage() {
  const hero = SOVEREIGN_DEPTHS.dungeons[1];
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="depths-title">
        <Image
          className={styles.heroImage}
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.wrap}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Arcanea / Worldbuilding concepts</p>
            <h1 id="depths-title" className={styles.title}>
              The Sovereign Depths
            </h1>
            <p className={styles.lede}>{SOVEREIGN_DEPTHS.subtitle}</p>
            <div className={styles.actions}>
              <a
                className={`${styles.action} ${styles.primary}`}
                href="#collection"
              >
                Explore the collection
              </a>
              <Link
                className={styles.action}
                href={`/gallery/sovereign-depths/${hero.slug}`}
              >
                Enter {hero.name}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className={styles.wrap}>
        <div className={styles.intro}>
          <div className={styles.eyebrow}>
            24 bosses / 12 dungeons
            <br />
            One connected world
          </div>
          <p>
            A stolen furnace feeds a coastal blockade. Divers chart a cathedral
            reclaimed by the sea. A court of light binds its champion to an
            inconvenient promise. Twelve places connect through people,
            materials and decisions that outlast a single encounter.
          </p>
        </div>
        <CollectionGrid entries={SOVEREIGN_ENTRIES} />
        <section className={styles.section} aria-labelledby="stories-title">
          <p className={styles.eyebrow}>
            Four proposed trilogies / Twelve books
          </p>
          <h2 id="stories-title" className={styles.sectionHeading}>
            Stories with something to lose.
          </h2>
          <div className={styles.stories}>
            {SOVEREIGN_DEPTHS.series.map((series) => (
              <article key={series.id} className={styles.prose}>
                <p className={styles.eyebrow}>
                  {series.canonStatus === "EXPERIMENTAL"
                    ? "Experimental narrative"
                    : "Book development"}
                </p>
                <h2>{series.title}</h2>
                <p>{series.premise}</p>
                <details>
                  <summary>Explore the trilogy</summary>
                  <p>{series.continuity}</p>
                  {series.books.map((book, index) => (
                    <div key={book.id}>
                      <h3>
                        {index + 1}. {book.title}
                      </h3>
                      <p>{book.premise}</p>
                      {book.canonStatus === "EXPERIMENTAL" && (
                        <p className={styles.eyebrow}>Experimental concept</p>
                      )}
                    </div>
                  ))}
                </details>
              </article>
            ))}
          </div>
        </section>
        <footer className={styles.footer}>
          <span>
            Original Arcanea worldbuilding concepts. Lore and encounters remain
            proposals.
          </span>
          <Link href="/gallery">Visual encyclopedia</Link>
          <a href="/api/lore/sovereign-depths?includeProposals=true&includeExperimental=true">
            Collection data
          </a>
        </footer>
      </div>
    </main>
  );
}
