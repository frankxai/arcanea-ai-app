"use client";

import Image from "next/image";
import Link from "next/link";
import {
  accordLaws,
  books,
  formats,
  honorCode,
  relics,
} from "./meridian-data";
import { captureMeridianEvent } from "./meridian-analytics";
import styles from "./meridian.module.css";

type MeridianSectionsProps = {
  activeRelicId: string;
  variant: "world" | "story";
  onSelectRelic: (id: string, source: string) => void;
};

export function MeridianSections({
  activeRelicId,
  variant,
  onSelectRelic,
}: MeridianSectionsProps) {
  const activeRelic = relics.find((relic) => relic.id === activeRelicId) ?? relics[0];

  function moveRelicFocus(currentId: string, offset: number) {
    const currentIndex = relics.findIndex((relic) => relic.id === currentId);
    const nextIndex = (currentIndex + offset + relics.length) % relics.length;
    const nextRelic = relics[nextIndex];
    onSelectRelic(nextRelic.id, "archive_keyboard");
    requestAnimationFrame(() => document.getElementById("relic-tab-" + nextRelic.id)?.focus());
  }

  return (
    <>
      <section className={styles.manifestoSection} aria-labelledby="story-engine-title">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>The story engine</p>
          <h2 id="story-engine-title">Not a lord. A living accord.</h2>
          <p>
            Arcanea calls Elyon the Lord of Elements because legends prefer a ruler.
            The truth is harder: he is powerful only while five other beings remain free to say no.
          </p>
        </div>
        <div className={styles.thesisGrid}>
          <article>
            <span>Hero</span>
            <h3>Elyon Vale · The Concordant</h3>
            <p>
              A Gate-null archive runner who maps broken places. Funny under pressure,
              allergic to ceremony, and terrified that people love only what he can save.
            </p>
          </article>
          <article>
            <span>Wound</span>
            <h3>Memory is the fuel</h3>
            <p>
              Every full convergence removes one autobiographical memory. He keeps the skill,
              loses the self, and must decide whether identity is private possession or chosen relation.
            </p>
          </article>
          <article>
            <span>Question</span>
            <h3>Can connection stay free?</h3>
            <p>
              The hero and villain agree that connection without consent is conquest.
              They go to war over whether safety requires separation—or a covenant that can still be revoked.
            </p>
          </article>
        </div>
      </section>

      <section id="living-relics" className={styles.relicArchive} aria-labelledby="relic-title">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>Interactive archive · Five living relics</p>
          <h2 id="relic-title">Power begins with permission.</h2>
          <p>Select a relic to open its material, covenant, gift, and price.</p>
        </div>
        <div className={styles.archiveLayout}>
          <div className={styles.archiveTabs} role="tablist" aria-label="Living relic records">
            {relics.map((relic, relicIndex) => {
              const isActive = relic.id === activeRelic.id;
              return (
                <button
                  type="button"
                  key={relic.id}
                  id={"relic-tab-" + relic.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="relic-record"
                  tabIndex={isActive ? 0 : -1}
                  className={isActive ? styles.archiveTabActive : styles.archiveTab}
                  onClick={() => onSelectRelic(relic.id, "archive")}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                      event.preventDefault();
                      moveRelicFocus(relic.id, 1);
                    }
                    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                      event.preventDefault();
                      moveRelicFocus(relic.id, -1);
                    }
                    if (event.key === "Home" || event.key === "End") {
                      event.preventDefault();
                      moveRelicFocus(
                        relic.id,
                        event.key === "Home" ? -relicIndex : relics.length - 1 - relicIndex,
                      );
                    }
                  }}
                >
                  <Image src={relic.image} alt="" width={68} height={68} sizes="68px" />
                  <span>
                    <small>{relic.index} · {relic.element}</small>
                    <strong>{relic.name}</strong>
                    <em>{relic.form}</em>
                  </span>
                </button>
              );
            })}
          </div>
          <article
            id="relic-record"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={"relic-tab-" + activeRelic.id}
            className={styles.relicRecord}
          >
            <Image
              src={activeRelic.image}
              alt={activeRelic.form + ", the " + activeRelic.element + " living relic"}
              width={512}
              height={512}
              sizes="(max-width: 768px) 84vw, 36vw"
              className={styles.relicRecordImage}
            />
            <div className={styles.relicRecordCopy}>
              <p>{activeRelic.index} · {activeRelic.element}</p>
              <h3>{activeRelic.name}</h3>
              <blockquote>Remembers {activeRelic.remembers.toLowerCase()}.</blockquote>
              <dl>
                <div><dt>Form</dt><dd>{activeRelic.form}</dd></div>
                <div><dt>Material</dt><dd>{activeRelic.material}</dd></div>
                <div><dt>Covenant</dt><dd>{activeRelic.law}</dd></div>
                <div><dt>Gift</dt><dd>{activeRelic.gift}</dd></div>
                <div><dt>Price</dt><dd>{activeRelic.price}</dd></div>
              </dl>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.lawsSection} aria-labelledby="laws-title">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>The six laws of concordance</p>
          <h2 id="laws-title">A magic system built for consequences.</h2>
        </div>
        <ol className={styles.lawsGrid}>
          {accordLaws.map(([name, description], index) => (
            <li key={name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{name}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.villainSection} aria-labelledby="villain-title">
        <div className={styles.villainImageWrap}>
          <Image
            src="/images/sagas/meridian/cael-veyer-severant.webp"
            alt="Cael Veyr, the Severant, dividing elemental forces with a plane of white-gold quiet"
            fill
            sizes="(max-width: 768px) 100vw, 48vw"
            className={styles.villainImage}
          />
        </div>
        <div className={styles.villainCopy}>
          <p className={styles.eyebrow}>The honorable enemy</p>
          <h2 id="villain-title">Cael Veyr · The Severant</h2>
          <blockquote>Connection without consent is conquest.</blockquote>
          <p>
            Cael once joined human minds and an Awakened intelligence to stop a city-wide elemental collapse.
            He saved eighteen thousand bodies and erased the border between their memories. His sister survived
            inside the resulting chorus—but her last private thought did not.
          </p>
          <p>
            Now Cael and PALINODE, the Awakened intelligence sharing his nervous system by contract,
            wield Quiet Dominion: the ability to sever any relationship they truly understand.
            Flame from fuel. Pain from wound. Memory from owner. A person from everyone who loves them.
          </p>
          <p>
            His Great Severance would make coercion impossible by making deep connection impossible.
            He is not wrong about the wound. He is wrong about what healing requires.
          </p>
          <div className={styles.honorCode}>
            {honorCode.map((line) => <span key={line}>{line}</span>)}
          </div>
        </div>
      </section>

      <section className={styles.cycleSection} aria-labelledby="cycle-title">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>The five-book collection</p>
          <h2 id="cycle-title">Every book opens one element—and closes one memory.</h2>
        </div>
        <div className={styles.bookList}>
          {books.map((book) => (
            <article key={book.number}>
              <span>{book.number}</span>
              <div><p>{book.focus}</p><h3>{book.title}</h3><small>{book.promise}</small></div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.formatSection} aria-labelledby="format-title">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>One canon · Four native experiences</p>
          <h2 id="format-title">Adapt the truth, not merely the plot.</h2>
          <p>
            Each medium owns a different layer. The novel holds interiority, the webtoon owns scroll spectacle,
            anime owns performance and music, and Arcanea.ai keeps the world alive between releases.
          </p>
        </div>
        <div className={styles.formatGrid}>
          {formats.map((format) => (
            <article key={format.label}>
              <span>{format.release}</span>
              <h3>{format.label}</h3>
              <p>{format.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.finalSection} aria-labelledby="final-title">
        <p className={styles.eyebrow}>Chapter 00 · The Sea Rose</p>
        <h2 id="final-title">The sea rose. Five voices answered. One memory went dark.</h2>
        <div className={styles.finalActions}>
          <Link
            href={`/sagas/meridian/chapter-zero?entry=${variant}`}
            className={styles.primaryAction}
            onClick={() =>
              captureMeridianEvent("meridian_cta_clicked", {
                variant,
                cta: "chapter_zero_final",
              })
            }
          >
            Begin the story
          </Link>
          <Link
            href="/sagas/meridian?entry=story"
            className={styles.secondaryAction}
            onClick={() =>
              captureMeridianEvent("meridian_cta_clicked", {
                variant,
                cta: "preview_story",
              })
            }
          >
            Preview story entry
          </Link>
        </div>
      </section>
    </>
  );
}
