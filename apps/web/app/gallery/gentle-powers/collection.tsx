"use client";

import Image from "next/image";
import { useState } from "react";
import {
  filterGentleEntries,
  type GentleEntry,
} from "@/lib/visual-encyclopedia/gentle-powers";
import styles from "./gentle-powers.module.css";

function Prompt({ entry }: { entry: GentleEntry }) {
  const [message, setMessage] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(entry.prompt);
      setMessage("Prompt copied.");
    } catch {
      setMessage("Select the prompt below and use your device’s Copy command.");
    }
  }
  return (
    <details className={styles.details}>
      <summary>Read and copy the prompt</summary>
      <textarea
        readOnly
        value={entry.prompt}
        aria-label={`Prompt for ${entry.title}`}
        onFocus={(event) => event.currentTarget.select()}
      />
      <button type="button" onClick={copy}>
        Copy prompt
      </button>
      <span role="status">{message}</span>
    </details>
  );
}

export function GentlePowersCollection({
  entries,
}: {
  entries: GentleEntry[];
}) {
  const [query, setQuery] = useState("");
  const [generatedOnly, setGeneratedOnly] = useState(false);
  const visible = filterGentleEntries(entries, query, generatedOnly);
  function download() {
    // Export authored creative fields only, never private master locations.
    const body = entries.map(
      ({ id, title, prompt, camera, gameMechanic, generationState }) => ({
        id,
        title,
        prompt,
        camera,
        gameMechanic,
        generationState,
      }),
    );
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(body, null, 2)], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "arcanea-gentle-powers-prompts.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className={styles.wrap}>
      <section className={styles.controls} aria-label="Collection filters">
        <label>
          Find a feeling, scene or angle
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try reciprocity or rain"
          />
        </label>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={generatedOnly}
            onChange={(event) => setGeneratedOnly(event.target.checked)}
          />
          Generated artwork only
        </label>
        <button type="button" onClick={download}>
          Export all prompts
        </button>
      </section>
      <p role="status">
        {visible.length} of {entries.length} directions
      </p>
      {visible.length === 0 && (
        <p>
          No matching directions. Clear the search or include prompt studies.
        </p>
      )}
      {visible.map((entry, index) => (
        <article key={entry.id} className={styles.entry}>
          {entry.asset?.url && (
            <Image
              src={entry.asset.url}
              alt={entry.alt}
              width={entry.asset.width}
              height={entry.asset.height}
              sizes="(max-width: 768px) 100vw, 1200px"
              priority={index === 0}
              className={styles.art}
            />
          )}
          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              {entry.id} / {entry.emotion} /{" "}
              {entry.generationState === "generated"
                ? "Generated study"
                : "Prompt study — not yet generated"}
            </p>
            <h2>{entry.title}</h2>
            <p>{entry.story}</p>
            <dl>
              <dt>Camera</dt>
              <dd>{entry.camera}</dd>
              <dt>What it costs</dt>
              <dd>{entry.cost}</dd>
              <dt>Playable idea</dt>
              <dd>{entry.gameMechanic}</dd>
            </dl>
            <Prompt entry={entry} />
            <details className={styles.details}>
              <summary>Art direction review</summary>
              <p>{entry.review}</p>
              <p>Next iteration: {entry.nextIteration}</p>
            </details>
          </div>
        </article>
      ))}
    </div>
  );
}
