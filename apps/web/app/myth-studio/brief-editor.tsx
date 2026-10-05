"use client";
import { useState } from "react";
import atlas from "@arcanea/creator-starters/myth-atlas";
import type {
  MythBrief,
  MythDeliverable,
} from "@arcanea/creator-starters/myth-packets";
import styles from "./workbench.module.css";

export function BriefEditor({
  brief,
  busy,
  revise,
  onCompile,
  onDownload,
}: {
  brief: MythBrief;
  busy: string;
  revise(patch: Partial<MythBrief>): void;
  onCompile(): void;
  onDownload(): void;
}) {
  const [search, setSearch] = useState("");
  const sources = atlas.records.filter((row) =>
    `${row.label} ${row.tradition} ${row.source.work}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  function line(index: number, patch: Partial<MythDeliverable>) {
    revise({
      deliverables: brief.deliverables.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    });
  }
  return (
    <form
      className={styles.editor}
      onSubmit={(event) => {
        event.preventDefault();
        onCompile();
      }}
    >
      <fieldset disabled={Boolean(busy)}>
        <legend>01 / Shape the brief</legend>
        <label>
          Story title
          <input
            required
            maxLength={160}
            value={brief.title}
            onChange={(event) => revise({ title: event.target.value })}
          />
        </label>
        <label>
          Project reference
          <input
            required
            maxLength={80}
            pattern="[a-z][a-z0-9]*(-[a-z0-9]+)*"
            value={brief.projectId}
            onChange={(event) => revise({ projectId: event.target.value })}
          />
        </label>
        <p className={styles.hint}>
          Your own reference, such as harbor-story. This does not link to an
          Arcanea project.
        </p>
        <div className={styles.pair}>
          <label>
            Audience
            <select
              value={brief.audience}
              onChange={(event) =>
                revise({
                  audience: event.target.value as MythBrief["audience"],
                })
              }
            >
              <option value="ages-8-12">Ages 8–12</option>
              <option value="teens">Teens</option>
              <option value="adults">Adults</option>
              <option value="family">Family</option>
            </select>
          </label>
          <label>
            Estimate currency
            <select
              value={brief.currency}
              onChange={(event) =>
                revise({
                  currency: event.target.value as MythBrief["currency"],
                })
              }
            >
              <option>EUR</option>
              <option>USD</option>
              <option>GBP</option>
            </select>
          </label>
        </div>
        <label>
          Human-world setting
          <textarea
            required
            maxLength={600}
            rows={3}
            value={brief.setting}
            onChange={(event) =>
              revise({ setting: event.target.value.replace(/[\r\n]+/g, " ") })
            }
          />
        </label>
      </fieldset>
      <fieldset disabled={Boolean(busy)}>
        <legend>02 / Choose source references</legend>
        <label>
          Find a myth
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Hydra, islands, Mapuche…"
          />
        </label>
        <p className={styles.hint}>
          {brief.selectedMyths.length} of 8 selected. These records locate
          research; they do not supply a verified telling.
        </p>
        <div className={styles.sources}>
          {sources.length === 0 && (
            <p>No matching references. Clear the search to see all 12.</p>
          )}
          {sources.map((row) => (
            <label className={styles.source} key={row.id}>
              <input
                type="checkbox"
                checked={brief.selectedMyths.includes(row.id)}
                disabled={
                  !brief.selectedMyths.includes(row.id) &&
                  brief.selectedMyths.length >= 8
                }
                onChange={(event) =>
                  revise({
                    selectedMyths: event.target.checked
                      ? [...brief.selectedMyths, row.id]
                      : brief.selectedMyths.filter((id) => id !== row.id),
                  })
                }
              />
              <span>
                <strong>{row.label}</strong>
                <small>
                  {row.tradition}
                  {row.livingTradition
                    ? " · Living tradition: community review required"
                    : ""}
                </small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset disabled={Boolean(busy)}>
        <legend>03 / Estimate the production effort</legend>
        <div className={styles.pair}>
          <label>
            Budget ceiling ({brief.currency})
            <input
              required
              type="number"
              min="0"
              max="1000000"
              step="0.01"
              value={brief.maxProductionCostMicros / 1_000_000}
              onChange={(event) =>
                revise({
                  maxProductionCostMicros: Math.round(
                    Number(event.target.value) * 1_000_000,
                  ),
                })
              }
            />
          </label>
          <label>
            Review cost per hour ({brief.currency})
            <input
              required
              type="number"
              min="0"
              max="1000000"
              step="0.01"
              value={brief.reviewRateMicrosPerHour / 1_000_000}
              onChange={(event) =>
                revise({
                  reviewRateMicrosPerHour: Math.round(
                    Number(event.target.value) * 1_000_000,
                  ),
                })
              }
            />
          </label>
        </div>
        {brief.deliverables.map((item, index) => (
          <div className={styles.deliverable} key={index}>
            <label>
              Deliverable {index + 1}
              <input
                required
                maxLength={80}
                pattern="[a-z][a-z0-9]*(-[a-z0-9]+)*"
                value={item.id}
                onChange={(event) => line(index, { id: event.target.value })}
              />
            </label>
            <div className={styles.pair}>
              <label>
                Format
                <select
                  value={item.format}
                  onChange={(event) =>
                    line(index, {
                      format: event.target.value as MythDeliverable["format"],
                    })
                  }
                >
                  <option>text</option>
                  <option>image</option>
                  <option>audio</option>
                  <option>video</option>
                </select>
              </label>
              <label>
                Accepted units target
                <input
                  required
                  type="number"
                  min="1"
                  max="1000"
                  step="1"
                  value={item.acceptedUnits}
                  onChange={(event) =>
                    line(index, {
                      acceptedUnits: Number(event.target.value),
                    })
                  }
                />
              </label>
              <label>
                Attempts per unit
                <input
                  required
                  type="number"
                  min="1"
                  max="20"
                  step="1"
                  value={item.attemptsPerUnit}
                  onChange={(event) =>
                    line(index, {
                      attemptsPerUnit: Number(event.target.value),
                    })
                  }
                />
              </label>
              <label>
                Cost per attempt ({brief.currency})
                <input
                  required
                  type="number"
                  min="0"
                  max="1000000"
                  step="0.01"
                  value={item.unitCostMicros / 1_000_000}
                  onChange={(event) =>
                    line(index, {
                      unitCostMicros: Math.round(
                        Number(event.target.value) * 1_000_000,
                      ),
                    })
                  }
                />
              </label>
              <label>
                Review minutes per attempt
                <input
                  required
                  type="number"
                  min="0"
                  max="1440"
                  step="1"
                  value={item.reviewMinutesPerAttempt}
                  onChange={(event) =>
                    line(index, {
                      reviewMinutesPerAttempt: Number(event.target.value),
                    })
                  }
                />
              </label>
            </div>
            <button
              type="button"
              disabled={brief.deliverables.length === 1}
              onClick={() =>
                revise({
                  deliverables: brief.deliverables.filter(
                    (_, i) => i !== index,
                  ),
                })
              }
            >
              Remove deliverable {index + 1}
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={brief.deliverables.length >= 16}
          onClick={() => {
            let number = brief.deliverables.length + 1;
            while (
              brief.deliverables.some(
                (item) => item.id === `deliverable-${number}`,
              )
            )
              number++;
            revise({
              deliverables: [
                ...brief.deliverables,
                {
                  id: `deliverable-${number}`,
                  format: "text",
                  acceptedUnits: 1,
                  attemptsPerUnit: 2,
                  unitCostMicros: 500000,
                  reviewMinutesPerAttempt: 10,
                },
              ],
            });
          }}
        >
          Add deliverable
        </button>
        <p className={styles.hint}>
          All planned attempts incur generation and review cost. Rates are
          yours; taxes, checkout fees, hosting, authoring and distribution are
          excluded.
        </p>
      </fieldset>
      <div className={styles.actions}>
        <button
          className={styles.primary}
          type="submit"
          disabled={Boolean(busy)}
        >
          {busy === "compile" ? "Compiling…" : "Compile research packet"}
        </button>
        <button type="button" onClick={onDownload}>
          Download brief
        </button>
      </div>
      <p className={styles.hint}>
        Your unsaved edits live in this tab. Download the brief before leaving
        or signing in.
      </p>
    </form>
  );
}
