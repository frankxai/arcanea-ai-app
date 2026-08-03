"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { captureMeridianEvent } from "./meridian-analytics";
import { MeridianSections } from "./meridian-sections";
import { relics, type EntryVariant } from "./meridian-data";
import styles from "./meridian.module.css";

type MeridianExperienceProps = {
  variant: EntryVariant;
};

function WorldEntryHero({
  activeRelicId,
  onSelectRelic,
}: {
  activeRelicId: string;
  onSelectRelic: (id: string, source: string) => void;
}) {
  const activeRelic = relics.find((relic) => relic.id === activeRelicId) ?? relics[0];

  return (
    <section className={styles.hero} aria-labelledby="meridian-title">
      <Image
        src="/images/sagas/meridian/meridian-world-entry.webp"
        alt="Elyon Vale standing among five living elemental relics in a dark Arcanean gallery"
        fill
        priority
        sizes="100vw"
        className={styles.heroImage}
      />
      <div className={styles.heroShade} aria-hidden="true" />

      <div className={styles.worldHeroLayout}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>The Concordant Cycle · Book I</p>
          <h1 id="meridian-title" className={styles.title}>
            <span>Arcanea:</span>
            <span className={styles.titleGold}>Meridian</span>
          </h1>
          <p className={styles.heroThesis}>
            The elements do not obey him.
            <br />
            They remember through him.
          </p>
          <p className={styles.heroBody}>
            Elyon Vale was born without a Gate. Five living relics chose him anyway.
            Every convergence saves the world—and erases one of his memories.
          </p>
          <div className={styles.heroActions}>
            <Link
              href="/sagas/meridian/chapter-zero?entry=world"
              className={styles.primaryAction}
              onClick={() =>
                captureMeridianEvent("meridian_cta_clicked", {
                  variant: "world",
                  cta: "chapter_zero",
                })
              }
            >
              Read Chapter Zero
            </Link>
            <a
              href="#living-relics"
              className={styles.secondaryAction}
              onClick={() =>
                captureMeridianEvent("meridian_cta_clicked", {
                  variant: "world",
                  cta: "living_relics",
                })
              }
            >
              Meet the Living Relics
            </a>
          </div>
          <p className={styles.formatLine}>Novel · Webtoon · Anime development · Living world</p>
        </div>

        <aside className={styles.relicRail} aria-label="The five living relics">
          <div className={styles.relicRailHeading}>
            <span>Five voices</span>
            <span>Choose one</span>
          </div>
          <div className={styles.relicList}>
            {relics.map((relic) => {
              const isActive = activeRelic.id === relic.id;
              return (
                <button
                  type="button"
                  key={relic.id}
                  className={isActive ? styles.relicButtonActive : styles.relicButton}
                  aria-pressed={isActive}
                  onClick={() => onSelectRelic(relic.id, "hero_rail")}
                >
                  <span className={styles.relicIndex}>{relic.index}</span>
                  <span className={styles.relicLabel}>
                    <strong>{relic.form}</strong>
                    <small>Remembers {relic.remembers.toLowerCase()}</small>
                  </span>
                  <Image
                    src={relic.image}
                    alt=""
                    width={72}
                    height={72}
                    sizes="72px"
                    className={styles.relicThumb}
                  />
                </button>
              );
            })}
          </div>
          <div className={styles.railDisclosure} aria-live="polite">
            <span>{activeRelic.name} · {activeRelic.element}</span>
            <p>{activeRelic.law}</p>
            <a href="#living-relics">Open full record</a>
          </div>
        </aside>
      </div>

      <div className={styles.heroFooter}>
        <span>Book I · Chapter Zero</span>
        <span>World-entry variant</span>
      </div>
    </section>
  );
}

function StoryEntryHero() {
  return (
    <section className={styles.storyHero} aria-labelledby="meridian-story-title">
      <Image
        src="/images/sagas/meridian/meridian-chapter-zero-panels.webp"
        alt="Five cinematic panels showing Elyon Vale between a rising sea, a burning archive, a storm, and a void mirror"
        fill
        priority
        sizes="100vw"
        className={styles.storyDesktopImage}
      />
      <Image
        src="/images/sagas/meridian/meridian-chapter-zero-mobile.webp"
        alt="Elyon Vale inside a vertical sequence of elemental disasters"
        fill
        priority
        sizes="100vw"
        className={styles.storyMobileImage}
      />
      <div className={styles.storyShade} aria-hidden="true" />
      <div className={styles.storyCopy}>
        <p className={styles.eyebrow}>The Concordant Cycle · Book I</p>
        <h1 id="meridian-story-title" className={styles.storyTitle}>Arcanea: Meridian</h1>
        <p className={styles.storyThesis}>
          The elements do not obey him. They remember through him.
        </p>
        <p>
          Elyon Vale was born without a Gate. Five living relics chose him anyway.
          Every convergence saves the world—and erases one of his memories.
        </p>
      </div>
      <div className={styles.storyActionRail}>
        <Link
          href="/sagas/meridian/chapter-zero?entry=story"
          className={styles.primaryAction}
          onClick={() =>
            captureMeridianEvent("meridian_cta_clicked", {
              variant: "story",
              cta: "chapter_zero",
            })
          }
        >
          Read Chapter Zero
        </Link>
        <a
          href="#living-relics"
          className={styles.secondaryAction}
          onClick={() =>
            captureMeridianEvent("meridian_cta_clicked", {
              variant: "story",
              cta: "living_relics",
            })
          }
        >
          Meet the Living Relics
        </a>
        <span>Novel · Webtoon · Anime development</span>
      </div>
    </section>
  );
}

export function MeridianExperience({ variant }: MeridianExperienceProps) {
  const [activeRelicId, setActiveRelicId] = useState(relics[0].id);

  useEffect(() => {
    captureMeridianEvent("meridian_experiment_viewed", { variant });
  }, [variant]);

  function selectRelic(id: string, source: string) {
    setActiveRelicId(id);
    captureMeridianEvent("meridian_relic_opened", {
      variant,
      relic: id,
      source,
    });
  }

  return (
    <div className={styles.experience} data-entry-variant={variant}>
      {variant === "story" ? (
        <StoryEntryHero />
      ) : (
        <WorldEntryHero activeRelicId={activeRelicId} onSelectRelic={selectRelic} />
      )}
      <MeridianSections activeRelicId={activeRelicId} onSelectRelic={selectRelic} />
    </div>
  );
}
