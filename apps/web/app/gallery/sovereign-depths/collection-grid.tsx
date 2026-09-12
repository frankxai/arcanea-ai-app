"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  filterSovereignEntries,
  containsExperimental,
  type SovereignEntry,
} from "@/lib/visual-encyclopedia/sovereign-depths-schema";
import styles from "./sovereign-depths.module.css";

export function CollectionCard({ entry }: { entry: SovereignEntry }) {
  return (
    <Link
      className={styles.card}
      href={`/gallery/sovereign-depths/${entry.slug}`}
    >
      <div
        className={styles.cardArt}
        data-kind={entry.kind}
        style={{ aspectRatio: `${entry.image.width} / ${entry.image.height}` }}
      >
        <Image
          className={styles.cardImage}
          src={entry.image.src}
          alt={entry.image.alt}
          fill
          sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 48vw, 32vw"
        />
      </div>
      <span className={styles.eyebrow}>
        {entry.kind === "boss" ? "Boss" : "Dungeon"} / {entry.title}
        {containsExperimental(entry) && " / Experimental concept"}
      </span>
      <h3>{entry.name}</h3>
      <p>{entry.summary}</p>
    </Link>
  );
}

export function CollectionGrid({ entries }: { entries: SovereignEntry[] }) {
  const [kind, setKind] = useState("all");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => filterSovereignEntries(entries, query, kind),
    [entries, query, kind],
  );
  return (
    <section
      id="collection"
      className={styles.section}
      aria-labelledby="collection-title"
    >
      <h2 id="collection-title" className={styles.sectionHeading}>
        The inhabitants. The places they changed.
      </h2>
      <div className={styles.toolbar}>
        <div className={styles.filters} aria-label="Filter collection">
          {(["all", "boss", "dungeon"] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={styles.filter}
              aria-pressed={kind === value}
              onClick={() => setKind(value)}
            >
              {value === "all"
                ? "All works"
                : value === "boss"
                  ? "Bosses"
                  : "Dungeons"}
            </button>
          ))}
        </div>
        <label className={styles.searchLabel}>
          <span className={styles.srOnly}>
            Search names, regions, factions and books
          </span>
          <input
            type="search"
            className={styles.search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search names, regions, factions…"
            maxLength={160}
          />
        </label>
      </div>
      <p className={styles.count} role="status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "work" : "works"}
      </p>
      {filtered.length ? (
        <div className={styles.grid}>
          {filtered.map((entry) => (
            <CollectionCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No works match this search.</p>
          <button
            type="button"
            className={styles.action}
            onClick={() => {
              setQuery("");
              setKind("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
