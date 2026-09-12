"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  MapPin,
  Users,
  Check,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import styles from "@/app/home.module.css";

const EXAMPLE =
  "A dying star holds the last library in the universe. Every book preserves a memory, and reading it costs one of your own.";
const VIEWS = ["World rule", "Characters", "Locations"] as const;

export function WorldWorkbench() {
  const router = useRouter();
  const input = useRef<HTMLTextAreaElement>(null);
  const [concept, setConcept] = useState("");
  const [view, setView] = useState<(typeof VIEWS)[number]>("World rule");
  const [changed, setChanged] = useState(false);
  const [message, setMessage] = useState("");

  function begin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const description = concept.trim();
    if (description.length < 5) {
      setMessage("Give your world a little more detail.");
      input.current?.focus();
      return;
    }
    try {
      sessionStorage.setItem("arcanea.world-concept", description);
      router.push("/worlds/create?new=1");
    } catch {
      setMessage(
        "Browser storage is unavailable. Copy your concept, then open the world creator below.",
      );
    }
  }

  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>
          <span aria-hidden="true" /> Your next world starts here
        </p>
        <h1 id="home-title">
          Build living worlds with <span>AI agents.</span>
        </h1>
        <p className={styles.lead}>
          Give an idea a place to grow. Create its characters, define its rules,
          and keep the world you build.
        </p>
        <form className={styles.composer} onSubmit={begin}>
          <label htmlFor="world-concept">
            What makes your world different?
          </label>
          <textarea
            ref={input}
            id="world-concept"
            name="concept"
            value={concept}
            onChange={(event) => {
              setConcept(event.target.value);
              setMessage("");
            }}
            maxLength={500}
            rows={3}
            placeholder="A city where every forgotten dream becomes a place…"
            aria-describedby="concept-help"
          />
          <div className={styles.composerFooter}>
            <span id="concept-help">Start with one idea.</span>
            <button type="submit" className={styles.primary}>
              Create a world <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </form>
        {message && (
          <p role="alert" className={styles.feedback}>
            {message} <Link href="/worlds/create">Open world creator</Link>
          </p>
        )}
        <div className={styles.secondaryActions}>
          <button
            type="button"
            onClick={() => {
              setConcept(EXAMPLE);
              setMessage("");
              input.current?.focus();
            }}
          >
            Use the library concept <ArrowRight size={15} aria-hidden="true" />
          </button>
          <Link href="/worlds">Explore worlds</Link>
        </div>
        <p className={styles.boundary}>
          Explore the example. Sign in to generate and save your own world.
        </p>
      </div>

      <div className={styles.dossier} aria-label="Interactive world example">
        <div className={styles.dossierBar}>
          <span>
            <BookOpen size={17} aria-hidden="true" /> World dossier
          </span>
          <span className={styles.exampleBadge}>Interactive example</span>
        </div>
        <div className={styles.dossierTitle}>
          <p>A world on the edge of forgetting</p>
          <h2>The last library</h2>
          <span>A dying star. A thousand borrowed lives.</span>
        </div>
        <div className={styles.viewSwitch} aria-label="Inspect the example">
          {VIEWS.map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={view === item}
              onClick={() => setView(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className={styles.dossierBody}>
          <div
            className={styles.viewPanel}
            aria-hidden={view !== "World rule"}
            inert={view !== "World rule"}
          >
            <div className={styles.ruleHeading}>
              <span className={styles.smallLabel}>The cost of reading</span>
              <span className={styles.ruleStatus}>
                {changed ? "Variation" : "Original rule"}
              </span>
            </div>
            <p className={styles.rule}>
              {changed
                ? "Every book you read takes a memory from someone you love."
                : "Every book you read takes one memory of your own."}
            </p>
            <p className={styles.ruleDescription}>
              Knowledge survives. The question is who pays for it.
            </p>
            <button
              type="button"
              className={styles.changeRule}
              onClick={() => setChanged(!changed)}
            >
              {changed ? (
                <ArrowCounterClockwise size={17} aria-hidden="true" />
              ) : (
                <ArrowRight size={17} aria-hidden="true" />
              )}
              {changed ? "Restore the original" : "Change who pays the price"}
            </button>
            <div
              className={styles.connections}
              aria-live="polite"
              aria-atomic="true"
            >
              <p className={styles.smallLabel}>
                {changed
                  ? "The story changes with the rule"
                  : "Follow the rule into the story"}
              </p>
              <div>
                <Users size={18} aria-hidden="true" />
                <span>
                  <strong>The archivist</strong>
                  {changed
                    ? "Must ask her sister's consent before opening a book."
                    : "Records her own life before each reading."}
                </span>
                <Check size={14} aria-hidden="true" />
              </div>
              <div>
                <MapPin size={18} aria-hidden="true" />
                <span>
                  <strong>The reading room</strong>
                  {changed
                    ? "Two chairs face every desk. Nobody reads alone."
                    : "Mirrors line the desks so readers remember their faces."}
                </span>
                <Check size={14} aria-hidden="true" />
              </div>
            </div>
          </div>
          <div
            className={`${styles.entries} ${styles.viewPanel}`}
            aria-hidden={view !== "Characters"}
            inert={view !== "Characters"}
          >
            <p className={styles.smallLabel}>People shaped by the rule</p>
            <article>
              <span>01</span>
              <div>
                <h3>Mara, the archivist</h3>
                <p>
                  {changed
                    ? "She needs a cure hidden in the stacks. Her sister would bear the cost of reading it."
                    : "She has saved hundreds of lives with borrowed knowledge. She can no longer remember her mother's voice."}
                </p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Ivo, the last courier</h3>
                <p>
                  He brings books from worlds that no longer exist. One volume
                  carries his own name.
                </p>
              </div>
            </article>
          </div>
          <div
            className={`${styles.entries} ${styles.viewPanel}`}
            aria-hidden={view !== "Locations"}
            inert={view !== "Locations"}
          >
            <p className={styles.smallLabel}>Places with a purpose</p>
            <article>
              <span>01</span>
              <div>
                <h3>The reading room</h3>
                <p>
                  {changed
                    ? "Paired chairs and written consent. Every act of discovery binds two lives."
                    : "A thousand mirrors, each etched with the name of a reader who forgot their own."}
                </p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>The ember docks</h3>
                <p>
                  Couriers moor their ships in the cooling corona. Each arrival
                  shortens the star&apos;s remaining life.
                </p>
              </div>
            </article>
          </div>
        </div>
        <div className={styles.dossierFoot}>
          Authored example · explore the connections, then create your own.
        </div>
      </div>
    </section>
  );
}
