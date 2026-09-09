import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  WONDER_BY_SLUG,
  WONDER_ENTRIES,
} from "@/lib/visual-encyclopedia/weight-of-wonders";
import { AuthoringDesk } from "../authoring-desk";
import styles from "../weight-of-wonders.module.css";

type Props = { params: Promise<{ entry: string }> };

export function generateStaticParams() {
  return WONDER_ENTRIES.map((entry) => ({ entry: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const record = WONDER_BY_SLUG.get((await params).entry);
  if (!record) return { title: "Concept not found | Arcanea" };
  const description = `Experimental ${record.kind} concept. ${record.summary}`;
  return {
    title: `${record.name} | The Weight of Wonders`,
    description,
    alternates: { canonical: `/gallery/weight-of-wonders/${record.slug}` },
    openGraph: {
      title: `${record.name} | Arcanea`,
      description,
      images: [
        {
          url: record.image.src,
          width: record.image.width,
          height: record.image.height,
          alt: record.image.alt,
        },
      ],
    },
  };
}

function ConceptCard({ slug }: { slug: string }) {
  const entry = WONDER_BY_SLUG.get(slug);
  if (!entry) return null;
  return (
    <Link
      className={styles.relatedCard}
      href={`/gallery/weight-of-wonders/${entry.slug}`}
    >
      <div
        className={styles.relatedArt}
        style={{ aspectRatio: `${entry.image.width} / ${entry.image.height}` }}
      >
        <Image
          className={styles.cardImage}
          src={entry.image.src}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, 22rem"
        />
      </div>
      <span className={styles.eyebrow}>
        {entry.kind} / Experimental concept
      </span>
      <strong>{entry.name}</strong>
    </Link>
  );
}

export default async function WonderEntryPage({ params }: Props) {
  const record = WONDER_BY_SLUG.get((await params).entry);
  if (!record) notFound();
  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/gallery">Gallery</Link>
          <span>/</span>
          <Link href="/gallery/weight-of-wonders">The Weight of Wonders</Link>
          <span>/</span>
          <span aria-current="page">{record.name}</span>
        </nav>
        <div
          className={styles.detailArt}
          data-orientation={
            record.image.height > record.image.width ? "portrait" : "landscape"
          }
          style={{
            aspectRatio: `${record.image.width} / ${record.image.height}`,
          }}
        >
          <Image
            className={styles.detailImage}
            src={record.image.src}
            alt={record.image.alt}
            fill
            priority
            unoptimized
            sizes="(max-width: 1440px) 100vw, 1440px"
          />
        </div>
        <p className={styles.artNote}>{record.artNote}</p>
        <header className={styles.detailTitle}>
          <p className={styles.eyebrow}>
            EXPERIMENTAL /{" "}
            {record.kind === "boss" ? "Encounter concept" : "Place concept"} /{" "}
            {record.title}
          </p>
          <h1 className={styles.title}>{record.name}</h1>
          <p className={styles.lede}>{record.summary}</p>
        </header>

        <div className={styles.detailColumns}>
          <div className={styles.prose}>
            <section>
              <h2>The history</h2>
              {record.history.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
            {record.kind === "boss" ? (
              <>
                <section>
                  <h2>The first encounter</h2>
                  <p>{record.entrance}</p>
                  <h3>Objective</h3>
                  <p>{record.encounter.objective}</p>
                </section>
                {record.bodyMovement && (
                  <section>
                    <h2>Body and movement</h2>
                    {record.bodyMovement.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </section>
                )}
                {record.foodWeb && (
                  <section>
                    <h2>Ecology and pressure</h2>
                    <ul>
                      {record.foodWeb.map((relationship) => (
                        <li key={relationship}>{relationship}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            ) : (
              <>
                <section>
                  <h2>The place</h2>
                  <p>{record.place.spatialIdentity}</p>
                  <h3>Routes</h3>
                  <ul>
                    {record.place.routes.map((route) => (
                      <li key={route}>{route}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h2>Life and evidence</h2>
                  <ul>
                    {[...record.place.ecology, ...record.place.discoveries].map(
                      (item) => (
                        <li key={item}>{item}</li>
                      ),
                    )}
                  </ul>
                  <h3>Route consequence</h3>
                  <p>{record.place.consequence}</p>
                </section>
              </>
            )}
            {record.growth && (
              <section>
                <h2>Victory and mastery</h2>
                <h3>Practice</h3>
                <p>{record.growth.practice}</p>
                <h3>Mastery</h3>
                <p>{record.growth.mastery}</p>
                <h3>Reward</h3>
                <p>{record.growth.reward}</p>
                <h3>Rematch</h3>
                <p>{record.growth.rematch}</p>
              </section>
            )}
            <section>
              <h2>Story seeds</h2>
              <ul>
                {record.storySeeds.map((seed) => (
                  <li key={seed}>{seed}</li>
                ))}
              </ul>
            </section>
          </div>
          <aside className={styles.aside} aria-label="Concept connections">
            <section>
              <p className={styles.eyebrow}>Connected concept</p>
              <ConceptCard slug={record.relatedSlug} />
            </section>
            <section>
              <p className={styles.eyebrow}>Artwork</p>
              <a
                className={styles.action}
                href={record.image.src}
                target="_blank"
                rel="noreferrer"
              >
                View full artwork
              </a>
            </section>
          </aside>
        </div>

        <AuthoringDesk entry={record} />

        <footer className={styles.footer}>
          <span>
            EXPERIMENTAL concept artwork and authoring material. Game
            implementation and book publication are separate.
          </span>
          <Link href="/gallery/weight-of-wonders">
            Return to the collection
          </Link>
        </footer>
      </div>
    </div>
  );
}
