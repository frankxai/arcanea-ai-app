"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { captureMeridianEvent } from "../meridian-analytics";
import { chapterSections } from "./chapter-text";
import styles from "./reader.module.css";

type ChapterZeroReaderProps = {
  variant: "world" | "story";
};

export function ChapterZeroReader({ variant }: ChapterZeroReaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    captureMeridianEvent("meridian_chapter_started", {
      chapter: "00_the_sea_rose",
      variant,
    });
    let completed = false;

    function updateProgress() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const next = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0;
      setProgress(next);
      if (!completed && next >= 90) {
        completed = true;
        captureMeridianEvent("meridian_chapter_completed", {
          chapter: "00_the_sea_rose",
          variant,
        });
      }
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, [variant]);

  return (
    <article className={styles.reader}>
      <div className={styles.progressTrack} aria-hidden="true">
        <div className={styles.progressValue} style={{ width: progress + "%" }} />
      </div>

      <header className={styles.readerHero}>
        <Image
          src="/images/sagas/meridian/meridian-chapter-zero-panels.webp"
          alt="Five panels of Orison's rising sea, burning archive, Elyon Vale, the storm, and the void mirror"
          fill
          priority
          sizes="100vw"
          className={styles.desktopArt}
        />
        <Image
          src="/images/sagas/meridian/meridian-chapter-zero-mobile.webp"
          alt="A vertical webtoon composition of Elyon Vale surrounded by five elemental disasters"
          fill
          priority
          sizes="100vw"
          className={styles.mobileArt}
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <p>Arcanea: Meridian · The Concordant Cycle</p>
          <span>Chapter 00</span>
          <h1>The Sea Rose</h1>
          <blockquote>
            The elements do not obey him. They remember through him.
          </blockquote>
          <a href="#the-name-theft">Begin reading</a>
        </div>
        <div className={styles.chapterMarker} aria-hidden="true">
          <span>00</span>
          <span>The Sea Rose</span>
        </div>
      </header>

      <div className={styles.readerBody}>
        <nav className={styles.chapterNav} aria-label="Chapter sections">
          <Link href="/sagas/meridian">Meridian archive</Link>
          {chapterSections.map((section) => (
            <a key={section.id} href={"#" + section.id}>{section.label}</a>
          ))}
          <span>{progress}% read</span>
        </nav>

        <div className={styles.prose}>
          {chapterSections.map((section, sectionIndex) => (
            <section key={section.id} id={section.id} aria-labelledby={section.id + "-title"}>
              <p id={section.id + "-title"} className={styles.sectionLabel}>{section.label}</p>
              {section.paragraphs.map((paragraph, paragraphIndex) => {
                const isOpening = sectionIndex === 0 && paragraphIndex === 0;
                const isDialogue = paragraph.startsWith("'") || paragraph.endsWith("Yes.") || paragraph === "Yes." || paragraph === "Gladly.";
                return (
                  <p
                    key={section.id + "-" + paragraphIndex}
                    className={isOpening ? styles.opening : isDialogue ? styles.dialogue : undefined}
                  >
                    {paragraph}
                  </p>
                );
              })}
            </section>
          ))}
        </div>
      </div>

      <footer className={styles.readerFooter}>
        <p>End of Chapter Zero</p>
        <h2>He saved the city. He lost the face he came to recover.</h2>
        <div>
          <Link href="/sagas/meridian" className={styles.primaryAction}>Enter the Meridian archive</Link>
          <Link href="/sagas/meridian?entry=world" className={styles.secondaryAction}>Meet the five who remember</Link>
        </div>
      </footer>
    </article>
  );
}
