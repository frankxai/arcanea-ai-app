"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  FIRSTLIGHT_CHARACTERS,
  firstlightAsset,
  publishedFirstlightAsset,
  type FirstlightCharacter,
  type FirstlightCategory,
  type FirstlightAssetKind,
} from "@/lib/visual-encyclopedia/firstlight-02";
import styles from "./firstlight-02.module.css";
import detailStyles from "./character-detail.module.css";

const LOCATION_EVENT = "firstlight-location-change";
function subscribeToLocation(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(LOCATION_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(LOCATION_EVENT, callback);
  };
}
function updateLocation(patch: Record<string, string | null>) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(patch)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event(LOCATION_EVENT));
}
const locationSnapshot = () => window.location.search;
const serverLocationSnapshot = () => "";

function CharacterDetail({
  character,
  kind,
  onKindChange,
  onClose,
}: {
  character: FirstlightCharacter;
  kind: FirstlightAssetKind;
  onKindChange: (kind: FirstlightAssetKind) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const image = publishedFirstlightAsset(character, kind);
  const record = firstlightAsset(character, kind);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    element?.showModal();
    return () => {
      element?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={detailStyles.dialog}
      aria-labelledby="firstlight-detail-name"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={detailStyles.dialogInner}>
        <header className={detailStyles.dialogHeader}>
          <div>
            <p className={styles.eyebrow}>
              {character.category} / Proposed character
            </p>
            <h2 id="firstlight-detail-name">{character.name}</h2>
            <p>{character.title}</p>
          </div>
          <button className={styles.secondary} onClick={onClose} type="button">
            Close
          </button>
        </header>
        <div
          className={detailStyles.imageTabs}
          aria-label="Choose artwork view"
        >
          {(["hero", "sheet"] as const).map((value) => (
            <button
              className={styles.filter}
              type="button"
              key={value}
              aria-pressed={kind === value}
              onClick={() => onKindChange(value)}
            >
              {value === "hero" ? "Cinematic scene" : "Multi-angle reference"}
            </button>
          ))}
        </div>
        {image?.url && (
          <div
            className={detailStyles.detailArt}
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 94vw, 85vw"
            />
          </div>
        )}
        <div className={detailStyles.detailContent}>
          <section>
            <p className={styles.eyebrow}>The person behind the power</p>
            <h3>{character.tagline}</h3>
            <p>{character.description}</p>
            <p className={detailStyles.affection}>
              {character.story.affection_detail}
            </p>
            <dl className={detailStyles.storyFacts}>
              <div>
                <dt>Vow</dt>
                <dd>{character.story.vow}</dd>
              </div>
              <div>
                <dt>What it costs</dt>
                <dd>{character.story.cost}</dd>
              </div>
              <div>
                <dt>Limit</dt>
                <dd>{character.story.limitation}</dd>
              </div>
              <div>
                <dt>Story opening</dt>
                <dd>{character.story.hook}</dd>
              </div>
            </dl>
          </section>
          <aside className={detailStyles.teamwork}>
            <p className={styles.eyebrow}>A useful team role</p>
            <h3>{character.teamwork.role}</h3>
            <p>{character.teamwork.metaphor}</p>
            <h4>Evidence of a good handoff</h4>
            <p>{character.teamwork.acceptance_criterion}</p>
            <p className={detailStyles.boundary}>
              A fictional analogy. Real agent permissions, budgets and
              acceptance remain explicit runtime contracts.
            </p>
          </aside>
        </div>
        {record && (
          <details className={detailStyles.provenance}>
            <summary>Inspect this image&apos;s prompt and provenance</summary>
            <dl className={detailStyles.storyFacts}>
              <div>
                <dt>Asset</dt>
                <dd>
                  <code>{record.id}</code>
                </dd>
              </div>
              <div>
                <dt>Generation</dt>
                <dd>
                  OpenAI native image generation / exact model ID unavailable
                </dd>
              </div>
              <div>
                <dt>State</dt>
                <dd>Generated concept / character canon proposal</dd>
              </div>
              <div>
                <dt>SHA-256</dt>
                <dd>
                  <code>{record.sha256}</code>
                </dd>
              </div>
            </dl>
            {record.continuity_notes && record.continuity_notes.length > 0 && (
              <div>
                <h3>Continuity notes for the next revision</h3>
                {record.continuity_notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            )}
            <label htmlFor="firstlight-prompt">Exact production prompt</label>
            <textarea
              id="firstlight-prompt"
              readOnly
              rows={9}
              value={record.prompt}
            />
            {image?.url && (
              <a
                className={styles.secondary}
                href={image.url}
                target="_blank"
                rel="noreferrer"
              >
                Open full image
              </a>
            )}
          </details>
        )}
      </div>
    </dialog>
  );
}

function Comparison({ characters }: { characters: FirstlightCharacter[] }) {
  return (
    <section className={styles.comparison} aria-labelledby="comparison-title">
      <p className={styles.eyebrow}>
        Your party / {characters.length} of 2 selected
      </p>
      <h3 id="comparison-title">Compare how they contribute.</h3>
      <div className={styles.tableScroll}>
        <table>
          <caption className={styles.srOnly}>
            Selected character roles, limits and evidence requirements
          </caption>
          <thead>
            <tr>
              <th scope="col">Character</th>
              <th scope="col">Contribution</th>
              <th scope="col">Limit</th>
              <th scope="col">Accepted handoff</th>
            </tr>
          </thead>
          <tbody>
            {characters.map((character) => (
              <tr key={character.id}>
                <th scope="row">{character.name}</th>
                <td>{character.teamwork.role}</td>
                <td>{character.story.limitation}</td>
                <td>{character.teamwork.acceptance_criterion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function FirstlightCollection() {
  const search = useSyncExternalStore(
    subscribeToLocation,
    locationSnapshot,
    serverLocationSnapshot,
  );
  const params = new URLSearchParams(search);
  const rawFilter = params.get("category");
  const filter: FirstlightCategory | "all" =
    rawFilter === "companion" ||
    rawFilter === "guardian" ||
    rawFilter === "opponent"
      ? rawFilter
      : "all";
  const query = (params.get("q") ?? "").slice(0, 160);
  const selected =
    FIRSTLIGHT_CHARACTERS.find(
      (character) => character.slug === params.get("character"),
    ) ?? null;
  const kind: FirstlightAssetKind =
    params.get("view") === "sheet" ? "sheet" : "hero";
  const [comparison, setComparison] = useState<string[]>([]);
  const filtered = useMemo(
    () =>
      FIRSTLIGHT_CHARACTERS.filter(
        (character) =>
          (filter === "all" || character.category === filter) &&
          `${character.name} ${character.title} ${character.description} ${character.teamwork.role}`
            .toLowerCase()
            .includes(query.toLowerCase().trim()),
      ),
    [filter, query],
  );
  return (
    <section
      className={styles.collection}
      id="characters"
      aria-labelledby="cast-title"
    >
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>The new cast</p>
        <h2 id="cast-title">Find your kindred.</h2>
        <p>
          Open a character to see the scene, the reference sheet and the story
          beneath it. Select two to compare their team roles.
        </p>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.filters} aria-label="Filter characters">
          {(["all", "companion", "guardian", "opponent"] as const).map(
            (value) => (
              <button
                className={styles.filter}
                type="button"
                key={value}
                aria-pressed={filter === value}
                onClick={() =>
                  updateLocation({ category: value === "all" ? null : value })
                }
              >
                {value === "all"
                  ? "All characters"
                  : value === "guardian"
                    ? "Protectors"
                    : `${value.charAt(0).toUpperCase()}${value.slice(1)}s`}
              </button>
            ),
          )}
        </div>
        <label className={styles.searchLabel}>
          <span className={styles.srOnly}>
            Search characters and team roles
          </span>
          <input
            type="search"
            name="q"
            autoComplete="off"
            maxLength={160}
            placeholder="Search the cast…"
            value={query}
            onChange={(event) =>
              updateLocation({ q: event.target.value || null })
            }
          />
        </label>
      </div>
      <p className={styles.resultCount} role="status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "character" : "characters"}
      </p>
      {filtered.length ? (
        <div className={styles.grid}>
          {filtered.map((character) => {
            const image = publishedFirstlightAsset(character, "hero");
            const checked = comparison.includes(character.id);
            return (
              <article
                className={styles.card}
                key={character.id}
                data-category={character.category}
              >
                <a
                  href={`?character=${encodeURIComponent(character.slug)}`}
                  className={styles.cardButton}
                  onClick={(event) => {
                    if (
                      event.button !== 0 ||
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return;
                    event.preventDefault();
                    updateLocation({ character: character.slug, view: null });
                  }}
                  aria-label={`Explore ${character.name}, ${character.title}`}
                >
                  {image?.url && (
                    <div className={styles.cardArt}>
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 640px) 94vw, (max-width: 1000px) 47vw, 44vw"
                      />
                    </div>
                  )}
                  <div className={styles.cardCopy}>
                    <p className={styles.eyebrow}>{character.category}</p>
                    <h3>
                      {character.name}
                      <span>{character.title}</span>
                    </h3>
                    <p>{character.tagline}</p>
                    <span className={styles.openLabel}>
                      Explore the character
                    </span>
                  </div>
                </a>
                <label className={styles.compareLabel}>
                  <input
                    type="checkbox"
                    name={`compare-${character.slug}`}
                    checked={checked}
                    disabled={!checked && comparison.length === 2}
                    onChange={() =>
                      setComparison((current) =>
                        checked
                          ? current.filter((id) => id !== character.id)
                          : [...current, character.id],
                      )
                    }
                  />
                  Compare {character.name}
                </label>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No characters match this search.</p>
          <button
            className={styles.secondary}
            onClick={() => {
              updateLocation({ category: null, q: null });
            }}
            type="button"
          >
            Clear filters
          </button>
        </div>
      )}
      {comparison.length > 0 && (
        <Comparison
          characters={FIRSTLIGHT_CHARACTERS.filter((character) =>
            comparison.includes(character.id),
          )}
        />
      )}
      {selected && (
        <CharacterDetail
          key={selected.id}
          character={selected}
          kind={kind}
          onKindChange={(view) =>
            updateLocation({ view: view === "hero" ? null : view })
          }
          onClose={() => updateLocation({ character: null, view: null })}
        />
      )}
    </section>
  );
}
