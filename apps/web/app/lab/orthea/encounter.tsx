"use client";

import { useRef, type ReactNode } from "react";
import {
  CISTERNS,
  HOLD_MS,
  actionBlocker,
  type EncounterAction,
  type EncounterState,
  type Position,
} from "@/lib/encounters/orthea-engine.mjs";
import { useEncounter } from "./use-encounter";
import styles from "./encounter.module.css";

const objectives = [
  "Move to two different causeways and open their sluices.",
  "Bring each cistern to 3–5 units. Open the family dock, then pin the weight at the refuge.",
  "Hold the family-dock wheel for twelve cumulative seconds. Leave a marked footprint before it lands.",
  "The encounter is complete. Keep this state or begin again.",
];
const phases = ["Reconnect", "Redistribute", "Set it down"];

function Action({
  action,
  children,
  id,
  state,
  perform,
}: {
  action: EncounterAction;
  children: ReactNode;
  id: string;
  state: EncounterState;
  perform: (action: EncounterAction) => void;
}) {
  const reason = actionBlocker(state, action);
  return (
    <div className={styles.actionRow}>
      <button
        type="button"
        disabled={Boolean(reason)}
        aria-describedby={`${id}-reason`}
        onClick={() => perform(action)}
      >
        {children}
      </button>
      <p className={styles.reason} id={`${id}-reason`}>
        {reason}
      </p>
    </div>
  );
}

export function OrtheaEncounter() {
  const game = useEncounter();
  const { state } = game;
  const fileInput = useRef<HTMLInputElement>(null);
  const complete = Boolean(state.outcome);
  const windup = state.attack.stage === "windup" && !complete;
  const location = state.position === "refuge" ? null : Number(state.position);
  const threat = complete
    ? "Orthea is still"
    : windup
      ? `Footfall on ${CISTERNS[state.attack.target as number]}`
      : "Recovery window";
  const windowMs = windup
    ? state.extendedCues
      ? 2600
      : 1700
    : state.attack.sequence
      ? 2100
      : 3000;

  return (
    <section
      className={styles.encounter}
      aria-label="Playable load-transfer encounter"
    >
      <div className={styles.toolbar}>
        <div className={styles.clockControls}>
          <button
            type="button"
            className={styles.primary}
            disabled={complete}
            onClick={game.toggleLive}
          >
            {complete
              ? "Encounter complete"
              : game.live
                ? "Pause live play"
                : state.elapsedMs
                  ? "Resume live play"
                  : "Start live play"}
          </button>
          <button type="button" disabled={complete} onClick={game.step}>
            Advance 1 second
          </button>
        </div>
        <span className={styles.clockState}>
          {complete
            ? "Encounter complete"
            : game.live
              ? "Live · time is moving"
              : "Paused · plan, act or advance time"}
        </span>
        <label className={styles.cueOption}>
          <input
            type="checkbox"
            checked={state.extendedCues}
            disabled={windup || complete}
            onChange={(event) => game.setExtendedCues(event.target.checked)}
          />
          Longer footfall cues
        </label>
        {!complete && (
          <div className={styles.mobileSafety} data-danger={windup}>
            <span>
              {threat} · {(state.attack.remainingMs / 1000).toFixed(1)}s
            </span>
            <button
              type="button"
              disabled={state.position === "refuge"}
              onClick={() => game.perform({ type: "move", position: "refuge" })}
            >
              To refuge
            </button>
            {state.phase === 3 && (
              <button
                type="button"
                disabled={state.position === "2"}
                onClick={() => game.perform({ type: "move", position: "2" })}
              >
                To dock wheel
              </button>
            )}
          </div>
        )}
      </div>

      <div className={styles.playLayout}>
        <div className={styles.board}>
          <ol className={styles.phases} aria-label="Encounter progress">
            {phases.map((phase, index) => (
              <li
                key={phase}
                aria-current={state.phase === index + 1 ? "step" : undefined}
                data-done={state.phase > index + 1}
              >
                <span>{index + 1}</span>
                {phase}
              </li>
            ))}
          </ol>
          <div className={styles.boardHeading}>
            <h2>The reservoir network</h2>
            <p>
              <strong data-testid="reserve">
                {state.water.reduce((sum, amount) => sum + amount, 0)}
              </strong>{" "}
              units in reserve
              {state.lostWater > 0 && (
                <span> · {state.lostWater} drained to sea</span>
              )}
            </p>
          </div>
          <figure className={styles.mechanism}>
            <svg viewBox="0 0 750 250" aria-hidden="true" focusable="false">
              {[
                "M150 125V217H375V125",
                "M375 125V232H600V125",
                "M600 80V22H150V80",
              ].map((path, index) => (
                <path
                  key={path}
                  className={styles.pipe}
                  data-open={state.opened[index]}
                  d={path}
                />
              ))}
              {state.water.map((level, index) => (
                <g
                  key={CISTERNS[index]}
                  className={styles.tank}
                  data-safe={level >= 3 && level <= 5}
                  data-target={windup && state.attack.target === index}
                  transform={`translate(${80 + index * 225} 45)`}
                >
                  <rect
                    className={styles.tankWall}
                    width="140"
                    height="140"
                    rx="4"
                  />
                  <rect
                    className={styles.water}
                    x="6"
                    y={134 - level * 12.8}
                    width="128"
                    height={level * 12.8}
                  />
                  <path
                    className={styles.safeBand}
                    d="M-8 70H148M-8 95.6H148"
                  />
                  <text x="70" y="118">
                    {level}
                  </text>
                </g>
              ))}
            </svg>
            <figcaption>
              Dashed lines mark the safe band:{" "}
              <strong>3–5 units in each cistern.</strong> Open pipes transfer
              water; they never create it.
            </figcaption>
          </figure>
          <div
            className={styles.causeways}
            role="group"
            aria-label="Move to a causeway"
          >
            {CISTERNS.map((name, index) => (
              <button
                key={name}
                type="button"
                disabled={complete}
                aria-pressed={state.position === String(index)}
                data-target={windup && state.attack.target === index}
                onClick={() =>
                  game.perform({
                    type: "move",
                    position: String(index) as Position,
                  })
                }
              >
                <span>{name}</span>
                <span>{state.water[index]} / 10 units</span>
                <span>
                  {state.opened[index]
                    ? "Sluice open"
                    : index === 2
                      ? "Private passage"
                      : "Sluice closed"}
                </span>
              </button>
            ))}
          </div>
          <button
            className={styles.refuge}
            type="button"
            disabled={complete}
            aria-pressed={state.position === "refuge"}
            onClick={() => game.perform({ type: "move", position: "refuge" })}
          >
            <span>Perimeter refuge</span>
            <span>Always safe · counterweight capstan</span>
          </button>
          <div className={styles.threat} data-danger={windup}>
            <div>
              <strong>{threat}</strong>
              {!complete && (
                <span aria-hidden="true">
                  {(state.attack.remainingMs / 1000).toFixed(1)}s
                </span>
              )}
            </div>
            <p>
              {complete
                ? "The choice remains in your world state."
                : windup
                  ? "The footprint is committed. Move to another causeway or the perimeter refuge."
                  : "Read the network. A marked outline announces the next footfall."}
            </p>
            <div className={styles.threatTrack} aria-hidden="true">
              <span
                style={{
                  width: complete
                    ? "0%"
                    : `${(state.attack.remainingMs / windowMs) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <aside
          className={styles.operations}
          aria-labelledby="orthea-operations"
        >
          <p className={styles.eyebrow}>
            {complete
              ? "Encounter complete"
              : `Phase ${state.phase} · ${phases[state.phase - 1].toLowerCase()}`}
          </p>
          <h2 id="orthea-operations">
            {location === null
              ? "At the refuge"
              : `At the ${CISTERNS[location].toLowerCase()} wheel`}
          </h2>
          <p>{objectives[state.phase - 1]}</p>
          {state.phase === 2 && !state.opened[2] && (
            <p className={styles.passage}>
              This route crosses Mara’s family dock. Opening its sluice makes
              the private passage available to everyone, including after the
              rescue.
            </p>
          )}
          {state.phase < 3 && (
            <div className={styles.actionArea}>
              <Action
                state={state}
                perform={game.perform}
                action={{ type: "open" }}
                id="orthea-open"
              >
                {location === 2 && !state.opened[2]
                  ? "Open the family dock"
                  : "Open this sluice"}
              </Action>
              {location !== null && (
                <div>
                  <p className={styles.controlLabel}>Move one unit from here</p>
                  {[0, 1, 2]
                    .filter((index) => index !== location)
                    .map((to) => (
                      <Action
                        key={to}
                        state={state}
                        perform={game.perform}
                        action={{ type: "transfer", from: location, to }}
                        id={`orthea-transfer-${to}`}
                      >
                        Send 1 unit to {CISTERNS[to].toLowerCase()}
                      </Action>
                    ))}
                </div>
              )}
              <Action
                state={state}
                perform={game.perform}
                action={{ type: "pin" }}
                id="orthea-pin"
              >
                Pin the counterweight
              </Action>
            </div>
          )}
          {state.phase >= 3 && state.outcome !== "reserve-lost" && (
            <div className={styles.lowering}>
              <div>
                <label htmlFor="orthea-progress">Lowering progress</label>
                <strong>
                  {(state.progressMs / 1000).toFixed(1)} / {HOLD_MS / 1000}s
                </strong>
              </div>
              <progress
                id="orthea-progress"
                max={HOLD_MS}
                value={state.progressMs}
              >
                {state.progressMs / 1000} of 12 seconds
              </progress>
              <p>
                Stay at the family-dock wheel. Retreat from its marked footfall,
                then return. Earned time is kept.
              </p>
            </div>
          )}
          <p
            className={styles.status}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.message}
          </p>
          <p className={styles.recoveryCount}>
            {state.falls} recoverable falls ·{" "}
            <span data-testid="elapsed">
              {(state.elapsedMs / 1000).toFixed(1)}
            </span>
            s simulated
          </p>
          {!complete && (
            <details className={styles.emergency}>
              <summary>The costly way out</summary>
              <p>
                Breaking the seal stops Orthea and drains all twelve units into
                the sea. The settlement survives; rationing begins. This ends
                this playthrough.
              </p>
              <Action
                state={state}
                perform={game.perform}
                action={{ type: "break-seal" }}
                id="orthea-break"
              >
                Drain the clean reserve
              </Action>
            </details>
          )}
        </aside>
      </div>

      {complete && (
        <section className={styles.ending} aria-labelledby="orthea-ending">
          <p className={styles.eyebrow}>An ending, and an obligation</p>
          <h2 id="orthea-ending">
            {state.outcome === "supply-saved"
              ? "The supply survives."
              : "The harbor survives. The reserve does not."}
          </h2>
          <p>
            {state.outcome === "supply-saved"
              ? "Orthea lowers its weight into the old cradle. All twelve units remain clean. Mara has opened the family dock; now she has to ask her brother to help keep its gate clear."
              : "The water is gone, and the enormous feet are still. The settlement has time to rebuild. Until then, every household must decide how to share a ration."}
          </p>
        </section>
      )}
      <div className={styles.snapshotBar}>
        <div>
          <h2>Keep this world state</h2>
          <p>
            Download or reopen a local snapshot. No account or automatic
            storage.
          </p>
        </div>
        <div className={styles.snapshotActions}>
          <button type="button" onClick={game.download}>
            Download snapshot
          </button>
          <button type="button" onClick={() => fileInput.current?.click()}>
            Open snapshot
          </button>
          <button type="button" onClick={game.restart}>
            Begin again
          </button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void game.openSnapshot(file);
          }}
        />
        <p className={styles.fileStatus} role="status" aria-live="polite">
          {game.fileStatus}
        </p>
      </div>
    </section>
  );
}
