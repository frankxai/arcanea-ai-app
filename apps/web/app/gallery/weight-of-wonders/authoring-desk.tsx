"use client";

import { useMemo, useState } from "react";
import type {
  WonderBoss,
  WonderEntry,
} from "@/lib/visual-encyclopedia/weight-of-wonders-schema";
import styles from "./weight-of-wonders.module.css";

function buildBrief(
  entry: WonderEntry,
  ending?: WonderBoss["encounter"]["endings"][number],
) {
  const lines = [
    `THE WEIGHT OF WONDERS — ${entry.name}`,
    "Status: EXPERIMENTAL Arcanea concept",
    "",
    entry.summary,
    "",
    "AUTHORING PROMPT",
    entry.sessionKit.prompt,
    "",
    "SCENE BEATS",
    ...entry.sessionKit.beats.map((beat, index) => `${index + 1}. ${beat}`),
  ];
  if (entry.kind === "boss") {
    lines.push(
      "",
      "ENCOUNTER OBJECTIVE",
      entry.encounter.objective,
      "",
      "PHASES",
      ...entry.encounter.phases.map(
        (phase, index) => `${index + 1}. ${phase.title}: ${phase.description}`,
      ),
    );
    if (entry.foodWeb) lines.push("", "ECOLOGY AND PRESSURE", ...entry.foodWeb);
  }
  if (ending)
    lines.push("", "SELECTED OUTCOME", ending.label, ending.consequence);
  if (entry.kind === "dungeon")
    lines.push("", "ROUTE CONSEQUENCE", entry.place.consequence);
  if (entry.growth)
    lines.push(
      "",
      "PRACTICE",
      entry.growth.practice,
      "",
      "MASTERY",
      entry.growth.mastery,
      "",
      "VICTORY REWARD",
      entry.growth.reward,
      "",
      "REMATCH",
      entry.growth.rematch,
    );
  return lines.join("\n");
}

function CopyBrief({ value }: { value: string }) {
  const [copyState, setCopyState] = useState<{
    kind: "ready" | "copied" | "error";
    value?: string;
  }>({ kind: "ready" });
  const status =
    copyState.value !== value || copyState.kind === "ready"
      ? "Ready to copy"
      : copyState.kind === "copied"
        ? "Copied to clipboard"
        : "Clipboard unavailable. Select the brief below and copy it manually.";

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState({ kind: "copied", value });
    } catch {
      setCopyState({ kind: "error", value });
    }
  }

  return (
    <div className={styles.copyArea}>
      <div className={styles.copyHeader}>
        <div>
          <p className={styles.eyebrow}>Writing prompt / Session brief</p>
          <p className={styles.copyStatus} role="status" aria-live="polite">
            {status}
          </p>
        </div>
        <button className={styles.action} type="button" onClick={copy}>
          Copy brief
        </button>
      </div>
      <label className={styles.manualLabel} htmlFor="manual-authoring-brief">
        Manual copy
      </label>
      <textarea
        className={styles.manualBrief}
        id="manual-authoring-brief"
        readOnly
        rows={12}
        value={value}
        onFocus={(event) => event.currentTarget.select()}
      />
    </div>
  );
}

export function AuthoringDesk({ entry }: { entry: WonderEntry }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [endingId, setEndingId] = useState(
    entry.kind === "boss" ? entry.encounter.endings[0].id : "",
  );
  const ending =
    entry.kind === "boss"
      ? entry.encounter.endings.find((option) => option.id === endingId)
      : undefined;
  const brief = useMemo(() => buildBrief(entry, ending), [entry, ending]);

  return (
    <section
      className={styles.desk}
      aria-labelledby="authoring-desk-title"
      data-type-specimen
    >
      <div className={styles.deskHeading}>
        <p className={styles.eyebrow}>Authoring desk</p>
        <h2 id="authoring-desk-title">
          {entry.kind === "boss" ? "Shape the encounter" : "Prepare the scene"}
        </h2>
        <p>
          {entry.kind === "boss"
            ? "Choose an outcome, then copy the brief into your story notes or tabletop session plan."
            : "Copy the scene brief, then decide which discovery your characters encounter first."}
        </p>
      </div>
      {entry.kind === "boss" && (
        <>
          <div className={styles.phaseNavigator}>
            <div className={styles.phaseTabs} aria-label="Encounter phases">
              {entry.encounter.phases.map((phase, index) => (
                <button
                  aria-pressed={phaseIndex === index}
                  className={styles.phaseButton}
                  key={phase.title}
                  onClick={() => setPhaseIndex(index)}
                  type="button"
                >
                  <span>Phase {index + 1}</span>
                  {phase.title}
                </button>
              ))}
            </div>
            <div className={styles.phasePanel} aria-live="polite">
              <p className={styles.eyebrow}>Current phase</p>
              <h3>{entry.encounter.phases[phaseIndex].title}</h3>
              <p>{entry.encounter.phases[phaseIndex].description}</p>
            </div>
          </div>
          <fieldset className={styles.outcomes}>
            <legend>Choose the consequence carried into the next scene</legend>
            {entry.encounter.endings.map((option) => (
              <label className={styles.outcome} key={option.id}>
                <input
                  checked={endingId === option.id}
                  name="encounter-ending"
                  onChange={() => setEndingId(option.id)}
                  type="radio"
                  value={option.id}
                />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.consequence}</small>
                </span>
              </label>
            ))}
          </fieldset>
        </>
      )}
      <CopyBrief value={brief} />
    </section>
  );
}
