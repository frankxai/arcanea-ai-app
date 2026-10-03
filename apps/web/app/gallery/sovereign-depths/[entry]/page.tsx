import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SOVEREIGN_BY_ID,
  SOVEREIGN_BY_SLUG,
  SOVEREIGN_ENTRIES,
} from "@/lib/visual-encyclopedia/sovereign-depths";
import { containsExperimental } from "@/lib/visual-encyclopedia/sovereign-depths-schema";
import { CollectionCard } from "../collection-grid";
import styles from "../sovereign-depths.module.css";

type Props = { params: Promise<{ entry: string }> };
export function generateStaticParams() {
  return SOVEREIGN_ENTRIES.map((entry) => ({ entry: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const record = SOVEREIGN_BY_SLUG.get((await params).entry);
  if (!record) return { title: "Work not found | Arcanea" };
  const description = `${containsExperimental(record) ? "Experimental concept" : "Worldbuilding concept"}. ${record.summary}`;
  return {
    title: `${record.name} | The Sovereign Depths`,
    description,
    alternates: { canonical: `/gallery/sovereign-depths/${record.slug}` },
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

export default async function SovereignEntryPage({ params }: Props) {
  const record = SOVEREIGN_BY_SLUG.get((await params).entry);
  if (!record) notFound();
  const relatedIds =
    record.kind === "boss" ? [record.dungeonId] : record.bossIds;
  const related = relatedIds.flatMap((id) => {
    const entry = SOVEREIGN_BY_ID.get(id);
    return entry ? [entry] : [];
  });
  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/gallery">Gallery</Link>
          <span>/</span>
          <Link href="/gallery/sovereign-depths">The Sovereign Depths</Link>
          <span>/</span>
          <span aria-current="page">{record.name}</span>
        </nav>
        <div
          className={styles.detailArt}
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
            sizes="(max-width: 1440px) 100vw, 1440px"
          />
        </div>
        <header className={styles.detailTitle}>
          <p className={styles.eyebrow}>
            {record.kind} / {record.title} /{" "}
            {containsExperimental(record)
              ? "Experimental concept"
              : "Worldbuilding concept"}
          </p>
          <h1 className={styles.title}>{record.name}</h1>
          <p className={styles.lede}>{record.summary}</p>
        </header>
        <div className={styles.detailColumns}>
          <div className={styles.prose}>
            <section>
              <h2>The history</h2>
              <p>{record.history}</p>
            </section>
            {record.kind === "boss" ? (
              <>
                <section>
                  <h2>A presence in the world</h2>
                  <p>{record.ecology}</p>
                  <h3>Allegiance</h3>
                  <p>{record.faction}</p>
                  <h3>Rivalry</h3>
                  <p>{record.rivalry}</p>
                </section>
                <section>
                  <h2>The first encounter</h2>
                  <p>{record.entrance}</p>
                  <h3>Body and movement</h3>
                  <p>{record.anatomy}</p>
                  <p>{record.materials}</p>
                  <p>{record.movement}</p>
                </section>
                <section>
                  <h2>Encounter design</h2>
                  <p>{record.encounter.objective}</p>
                  <h3>The arena</h3>
                  <p>{record.encounter.arena}</p>
                  {record.encounter.phases.map((phase, index) => (
                    <article className={styles.phase} key={phase.name}>
                      <p className={styles.eyebrow}>Phase {index + 1}</p>
                      <h3>{phase.name}</h3>
                      <dl>
                        <dt>Trigger</dt>
                        <dd>{phase.trigger}</dd>
                        <dt>Action</dt>
                        <dd>{phase.action}</dd>
                        <dt>Counterplay</dt>
                        <dd>{phase.counterplay}</dd>
                      </dl>
                    </article>
                  ))}
                  <h3>The cost of failure</h3>
                  <p>{record.encounter.failure}</p>
                  <h3>What remains</h3>
                  <p>{record.encounter.aftermath}</p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h2>The architecture</h2>
                  <p>{record.spatialIdentity}</p>
                  <h3>Finding a passage</h3>
                  <p>{record.traversal}</p>
                </section>
                <section>
                  <h2>Those who live here</h2>
                  <ul>
                    {record.inhabitants.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h2>What the place conceals</h2>
                  <ul>
                    {record.discoveries.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              </>
            )}
            {record.kind === "dungeon" && record.mythology && (
              <section>
                <h2>What people believe</h2>
                <p>{record.mythology.publicStory}</p>
                <h3>The competing account</h3>
                <p>{record.mythology.counterStory}</p>
                <h3>What survives as evidence</h3>
                <p>{record.mythology.observableEvidence}</p>
                <p>{record.mythology.unresolved}</p>
              </section>
            )}
          </div>
          <aside className={styles.aside} aria-label="Story connections">
            <section>
              <p className={styles.eyebrow}>Book development</p>
              <h2>{record.story.series}</h2>
              {record.story.canonStatus === "EXPERIMENTAL" && (
                <p>Experimental narrative proposal</p>
              )}
              <p>{record.story.book}</p>
              <p>{record.story.role}</p>
            </section>
            <section>
              <h2>{record.kind === "boss" ? "The dungeon" : "The bosses"}</h2>
              <div className={styles.related}>
                {related.map((entry) => (
                  <CollectionCard key={entry.id} entry={entry} />
                ))}
              </div>
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
        <footer className={styles.footer}>
          <span>
            Original concept artwork and authored encounter design. Proposed
            lore; game implementation is separate.
          </span>
          <Link href="/gallery/sovereign-depths">Return to the collection</Link>
        </footer>
      </div>
    </main>
  );
}
