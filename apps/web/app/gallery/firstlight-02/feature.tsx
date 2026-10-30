import Image from "next/image";
import Link from "next/link";
import {
  FIRSTLIGHT_CHARACTERS,
  publishedFirstlightAsset,
} from "@/lib/visual-encyclopedia/firstlight-02";
import styles from "./firstlight-02.module.css";

export function FirstlightFeature() {
  const character = FIRSTLIGHT_CHARACTERS.find(
    (entry) => entry.slug === "seli",
  );
  const image = character && publishedFirstlightAsset(character, "hero");
  if (!image?.url) return null;
  return (
    <section
      className={styles.galleryFeature}
      aria-labelledby="kindred-feature-title"
    >
      <div className={styles.featureArt}>
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className={styles.featureCopy}>
        <p className={styles.eyebrow}>
          Firstlight 02 / Experimental character collection
        </p>
        <h2 id="kindred-feature-title">The Kindred Realms</h2>
        <p>
          Six companions to love. Two giants to trust. Two opponents to face
          together. Meet a new cast through twenty scenes and reference sheets.
        </p>
        <Link className={styles.primary} href="/gallery/firstlight-02">
          Meet the cast and play the trial
        </Link>
      </div>
    </section>
  );
}
