import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  WEIGHT_OF_WONDERS,
  WONDER_BY_SLUG,
  WONDER_ENTRIES,
} from "@/lib/visual-encyclopedia/weight-of-wonders";
import styles from "./weight-of-wonders.module.css";

export const metadata: Metadata = {
  title: "The Weight of Wonders",
  description:
    "Six experimental Arcanea concepts connecting living infrastructure, borrowed identity and a cultivated storm ecology.",
  alternates: { canonical: "/gallery/weight-of-wonders" },
  openGraph: {
    title: "The Weight of Wonders | Arcanea",
    description:
      "Three connected boss and place pairs with encounter concepts and story tools.",
    images: [{ url: "/images/weight-of-wonders/storm-orchard.webp" }],
  },
};

export default function WeightOfWondersPage() {
  const hero = WONDER_BY_SLUG.get("storm-orchard") ?? WONDER_ENTRIES[0];
  const bosses = WONDER_ENTRIES.filter((entry) => entry.kind === "boss");
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="wonders-title">
        <Image
          className={styles.heroImage}
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          unoptimized
          sizes="100vw"
        />
        <div className={styles.wrap}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>
              Experimental collection / Encounter and story concepts
            </p>
            <h1 className={styles.title} id="wonders-title">
              {WEIGHT_OF_WONDERS.collection.title}
            </h1>
            <p className={styles.lede}>
              {WEIGHT_OF_WONDERS.collection.subtitle}
            </p>
            <div className={styles.actions}>
              <a className={`${styles.action} ${styles.primary}`} href="#atlas">
                Explore the six concepts
              </a>
              <Link
                className={styles.action}
                href="/gallery/weight-of-wonders/orvess"
              >
                Open the first encounter
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.wrap}>
        <section className={styles.intro} aria-labelledby="atlas-intro-title">
          <p className={styles.eyebrow}>
            Three linked pairs / One river system
          </p>
          <div>
            <h2 id="atlas-intro-title">Follow what a wonder costs to keep.</h2>
            <p>
              Each boss depends on a place, and each place depends on people.
              See the complete artwork, follow the conflict and take a scene
              brief into your own writing.
            </p>
          </div>
        </section>

        <section
          className={styles.atlas}
          id="atlas"
          aria-labelledby="atlas-title"
        >
          <p className={styles.eyebrow}>Connected atlas</p>
          <h2 className={styles.sectionTitle} id="atlas-title">
            The inhabitants and the places they protect.
          </h2>
          <div className={styles.pairs}>
            {bosses.map((boss, index) => {
              const place = WONDER_BY_SLUG.get(boss.relatedSlug);
              if (!place) return null;
              return (
                <article className={styles.pair} key={boss.id}>
                  <header className={styles.pairHeader}>
                    <p className={styles.eyebrow}>
                      {["Water", "Identity", "Territory"][index]}
                    </p>
                    <h3>{boss.encounter.objective}</h3>
                  </header>
                  <div className={styles.pairCards}>
                    {[boss, place].map((entry) => (
                      <Link
                        className={styles.card}
                        href={`/gallery/weight-of-wonders/${entry.slug}`}
                        key={entry.id}
                      >
                        <div
                          className={styles.cardArt}
                          data-kind={entry.kind}
                          style={{
                            aspectRatio: `${entry.image.width} / ${entry.image.height}`,
                          }}
                        >
                          <Image
                            className={styles.cardImage}
                            src={entry.image.src}
                            alt={entry.image.alt}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 100vw, 45vw"
                          />
                        </div>
                        <span className={styles.eyebrow}>
                          {entry.kind} / Experimental concept
                        </span>
                        <h3>{entry.name}</h3>
                        <p>{entry.summary}</p>
                      </Link>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section
          className={styles.storySection}
          aria-labelledby="trilogy-title"
        >
          <p className={styles.eyebrow}>EXPERIMENTAL / Proposed trilogy</p>
          <h2 className={styles.sectionTitle} id="trilogy-title">
            The river carries the consequences forward.
          </h2>
          <div className={styles.trilogy}>
            {WEIGHT_OF_WONDERS.collection.trilogy.map((book, index) => (
              <article key={book.title}>
                <p className={styles.eyebrow}>Outline {index + 1}</p>
                <h3>{book.title}</h3>
                <p>{book.premise}</p>
              </article>
            ))}
          </div>
          <details className={styles.opening}>
            <summary>Read the opening fragment</summary>
            {WEIGHT_OF_WONDERS.collection.opening
              .split(/\n\n/u)
              .map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
          </details>
        </section>

        <footer className={styles.footer}>
          <span>
            EXPERIMENTAL Arcanea proposals. Encounters are authored concepts;
            the trilogy is an outline.
          </span>
          <Link href="/gallery">Visual encyclopedia</Link>
          <a
            download="weight-of-wonders.json"
            href="/api/lore/weight-of-wonders?includeProposals=true&includeExperimental=true"
          >
            Collection data
          </a>
        </footer>
      </div>
    </div>
  );
}
