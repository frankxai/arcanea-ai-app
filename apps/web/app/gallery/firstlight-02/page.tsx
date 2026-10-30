import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  FIRSTLIGHT_CHARACTERS,
  FIRSTLIGHT_ASSETS,
  publishedFirstlightAsset,
} from "@/lib/visual-encyclopedia/firstlight-02";
import { FirstlightCollection } from "./collection";
import { CooperationTrial } from "./cooperation-trial";
import styles from "./firstlight-02.module.css";

const heroCharacter = FIRSTLIGHT_CHARACTERS.find((c) => c.slug === "seli");
const hero = heroCharacter && publishedFirstlightAsset(heroCharacter, "hero");

export const metadata: Metadata = {
  title: "Firstlight 02 — The Kindred Realms",
  description:
    "Meet ten new Arcanea character proposals: warm companions, protective giants and two formidable opponents. Explore their stories, reference sheets and a cooperation trial.",
  alternates: { canonical: "/gallery/firstlight-02" },
  openGraph: {
    title: "The Kindred Realms | Arcanea Firstlight 02",
    description: "Small acts of care. A world of extraordinary scale.",
    ...(hero?.url ? { images: [{ url: hero.url, alt: hero.alt }] } : {}),
  },
};

export default function FirstlightPage() {
  const imageCount = FIRSTLIGHT_ASSETS.filter(
    (asset) => asset.availability === "registered" && asset.url,
  ).length;
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="firstlight-title">
        {hero?.url && (
          <Image
            className={styles.heroImage}
            src={hero.url}
            alt={hero.alt}
            fill
            priority
            sizes="100vw"
          />
        )}
        <div className={styles.wrap}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Arcanea / Firstlight 02</p>
            <h1 id="firstlight-title" className={styles.title}>
              The Kindred Realms
            </h1>
            <p className={styles.lede}>
              Some become your companions. Some carry whole worlds. A few ask
              what your team is made of.
            </p>
            <div className={styles.actions}>
              <a className={styles.primary} href="#characters">
                Meet the cast
              </a>
              <a className={styles.secondary} href="#cooperation">
                Play the cooperation trial
              </a>
            </div>
            <p className={styles.heroNote}>
              Experimental character proposals · {FIRSTLIGHT_CHARACTERS.length}{" "}
              characters
              {imageCount > 0 && ` · ${imageCount} artworks`}
            </p>
          </div>
        </div>
      </section>

      <div className={styles.wrap}>
        <section className={styles.intro} aria-labelledby="firstlight-intro">
          <p className={styles.eyebrow}>Wonder begins with attachment</p>
          <div>
            <h2 id="firstlight-intro">
              Great worlds make room for small kindnesses.
            </h2>
            <p>
              Six companions with a reason to care. Two immense protectors with
              lives beyond the horizon. Two opponents whose pressure makes
              cooperation matter. Each has a vow, a limitation and a choice that
              changes the world around them.
            </p>
          </div>
        </section>

        <FirstlightCollection />

        <section
          className={styles.trialSection}
          id="cooperation"
          aria-labelledby="cooperation-title"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>A playable coordination experiment</p>
            <h2 id="cooperation-title">Bring the bridge home.</h2>
            <p>
              A bounded simulation of a team under pressure. Keep the conditions
              fixed, change one coordination rule, then compare the evidence.
              Character abilities explain roles; they grant no tool permissions.
            </p>
          </div>
          <CooperationTrial />
        </section>

        <section
          className={styles.reviewSection}
          aria-labelledby="review-title"
        >
          <div>
            <p className={styles.eyebrow}>Open for independent review</p>
            <h2 id="review-title">Every image has a story and a source.</h2>
            <p>
              Inspect the exact prompts, asset checksums, character
              relationships and review criteria. These are generated design
              proposals; exhibition does not promote them into accepted Arcanea
              canon. Reviews become durable through a GitHub pull request.
            </p>
          </div>
          <div className={styles.downloads}>
            <a href="/firstlight-02/catalog.json" download>
              Download collection metadata
            </a>
            <a href="/firstlight-02/review-queue.json" download>
              Download agent review queue
            </a>
            <a href="https://github.com/frankxai/arcanea-ai-app/tree/main/docs/worldbuilding/firstlight-02">
              Read the production record
            </a>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>Firstlight 02 / Experimental review exhibition</span>
          <Link href="/gallery">Return to the visual encyclopedia</Link>
        </footer>
      </div>
    </div>
  );
}
