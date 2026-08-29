import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ARTBOOK,
  CANON,
  LIVE_LINKS,
  PASSAGE,
  STILLS,
} from "./story-content";
import styles from "./story.module.css";

export const metadata: Metadata = {
  title: "The First Light",
  description:
    "Cinematic reading of Arcanea's origin: Lumina as form, Nero as fertile dark, then into The Three Academies.",
  alternates: { canonical: "/story" },
  openGraph: {
    title: "The First Light | Arcanea",
    description:
      "A cinematic gateway into the Arcanea library — origin cosmology, then live chapters.",
    url: "/story",
    images: [
      {
        url: STILLS[0].src,
        width: STILLS[0].width,
        height: STILLS[0].height,
        alt: STILLS[0].alt,
      },
    ],
  },
};

export default function StoryPage() {
  const hero = STILLS[0];
  const valley = STILLS[1];

  return (
    <main className={styles.page}>
      <a className={styles.skip} href="#story-read">
        Skip to reading
      </a>
      <p className={styles.spine} aria-hidden="true">
        Arcanea · The First Light
      </p>

      <section className={styles.hero} aria-labelledby="story-title">
        <div className={styles.frame}>
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>{CANON.kicker}</p>
          <h1 id="story-title" className={styles.title}>
            {CANON.title}
          </h1>
          <p className={styles.lede}>{CANON.lede}</p>
          <div className={styles.ctaRow}>
            <Link className={styles.cta} href={PASSAGE.href}>
              {LIVE_LINKS[1].label}
            </Link>
            <Link className={`${styles.cta} ${styles.ctaGhost}`} href="/books">
              {LIVE_LINKS[0].label}
            </Link>
          </div>
        </div>
      </section>

      <section id="story-read" className={`${styles.chapter} ${styles.dual}`}>
        <article className={styles.panel}>
          <p className={styles.mark}>I · Form</p>
          <h2 className={`${styles.entity} ${styles.gold}`}>{CANON.luminaName}</h2>
          <p className={styles.aspect}>{CANON.luminaTitle}</p>
          <p className={styles.body}>{CANON.lumina}</p>
        </article>
        <article className={styles.panel}>
          <p className={styles.mark}>II · Potential</p>
          <h2 className={`${styles.entity} ${styles.teal}`}>{CANON.neroName}</h2>
          <p className={styles.aspect}>{CANON.neroTitle}</p>
          <p className={styles.body}>{CANON.nero}</p>
        </article>
      </section>

      <section className={styles.stillChapter} aria-labelledby="story-passage">
        <div className={styles.frame}>
          <Image
            src={valley.src}
            alt={valley.alt}
            fill
            sizes="100vw"
          />
        </div>
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />
        <div className={styles.quoteWrap}>
          <p className={styles.mark}>III · The storm that remembered</p>
          <blockquote id="story-passage" className={styles.quote}>
            <p>{PASSAGE.text}</p>
            <cite className={styles.cite}>
              {PASSAGE.chapter} · {PASSAGE.book} ·{" "}
              <Link href={PASSAGE.href}>Continue the chapter</Link>
            </cite>
          </blockquote>
        </div>
      </section>

      <section className={styles.artbook} aria-labelledby="story-artbook">
        <p className={styles.mark}>Artbook · live catalog</p>
        <h2 id="story-artbook" className={styles.entity}>
          Still in the library
        </h2>
        <p className={styles.body}>
          These covers already ship. The stills above are the origin sequence;
          the books below are readable now.
        </p>
        <div className={styles.strip}>
          {ARTBOOK.map((item) => (
            <Link key={item.src} className={styles.tile} href={item.href}>
              <div className={styles.tileCover}>
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(min-width: 900px) 30vw, 100vw"
                />
              </div>
              <p className={styles.tileTitle}>{item.title}</p>
            </Link>
          ))}
        </div>
        <div className={`${styles.ctaRow} ${styles.endCard}`}>
          {LIVE_LINKS.map((link) => (
            <Link
              key={link.href}
              className={`${styles.cta} ${link.href === "/gallery" ? styles.ctaGhost : ""}`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
