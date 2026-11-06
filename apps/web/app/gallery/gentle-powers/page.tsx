import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GENTLE_POWERS,
  isGentlePowersPublished,
} from "@/lib/visual-encyclopedia/gentle-powers";
import { GentlePowersCollection } from "./collection";
import styles from "./gentle-powers.module.css";

export const metadata: Metadata = {
  title: "The Gentle Powers | Arcanea",
  description:
    "Original visual studies, exact prompts and cooperative worldbuilding ideas.",
  alternates: { canonical: "/gallery/gentle-powers" },
};

export default function GentlePowersPage() {
  // A source-only proposal must never masquerade as a delivered exhibition.
  if (!isGentlePowersPublished(GENTLE_POWERS)) notFound();
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/gallery">Visual encyclopedia</Link>
        <p className={styles.eyebrow}>
          Visual studies / Original fictional proposals
        </p>
        <h1>The Gentle Powers</h1>
        <p className={styles.lede}>Great power, expressed through care.</p>
        <p>
          Three generated frames. Twelve directions for stories, images and
          cooperative worlds. Study the choices, take a prompt, and follow what
          changes.
        </p>
      </header>
      <GentlePowersCollection entries={GENTLE_POWERS.entries} />
      <footer className={styles.footer}>
        <h2>Research, interpreted.</h2>
        <p>
          These are original proposals, not accepted Arcanea canon. Game
          mechanics are concepts. External traditions remain distinct from
          Arcanea fiction.
        </p>
        <ul>
          {GENTLE_POWERS.sources.map((source) => (
            <li key={source.id}>
              <a href={source.url}>{source.title}</a>
              <p>{source.takeaway}</p>
            </li>
          ))}
        </ul>
        <p>{GENTLE_POWERS.rights}</p>
        <Link href="/gallery">Explore the visual encyclopedia</Link>
      </footer>
    </div>
  );
}
