import { VisualEncyclopedia } from "@/components/visual-encyclopedia/visual-encyclopedia";
import { getVisualEncyclopediaEntries } from "@/lib/visual-encyclopedia/publication";
import {
  CINEMA_USE_MAP,
  VISUAL_GRAPH_EDGES,
} from "@/lib/visual-encyclopedia/catalog";
import Link from "next/link";
import Image from "next/image";
import { SOVEREIGN_DEPTHS } from "@/lib/visual-encyclopedia/sovereign-depths";
import styles from "./sovereign-depths/sovereign-depths.module.css";

export const revalidate = 300;

export default async function GalleryPage() {
  const entries = await getVisualEncyclopediaEntries();

  return (
    <>
      <section
        className={`${styles.hero} ${styles.featured}`}
        aria-labelledby="featured-collection-title"
      >
        <Image
          className={styles.heroImage}
          src={SOVEREIGN_DEPTHS.dungeons[1].image.src}
          alt={SOVEREIGN_DEPTHS.dungeons[1].image.alt}
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.wrap}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>
              New collection / Worldbuilding concepts
            </p>
            <h2
              id="featured-collection-title"
              className={`${styles.title} ${styles.featuredTitle}`}
            >
              The Sovereign Depths
            </h2>
            <p className={styles.lede}>
              24 bosses. 12 extraordinary dungeons. Ancient power, living worlds
              and consequences that remain.
            </p>
            <div className={styles.actions}>
              <Link
                href="/gallery/sovereign-depths"
                className={`${styles.action} ${styles.primary}`}
              >
                Explore the cinematic collection
              </Link>
            </div>
          </div>
        </div>
      </section>
      <VisualEncyclopedia
        entries={entries}
        graphEdges={VISUAL_GRAPH_EDGES}
        cinema={CINEMA_USE_MAP}
      />
    </>
  );
}
