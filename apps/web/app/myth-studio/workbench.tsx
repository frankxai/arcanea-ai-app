"use client";

import { useState } from "react";
import Link from "next/link";
import { BriefEditor } from "./brief-editor";
import example from "@arcanea/creator-starters/myth-example";
import type { MythBrief } from "@arcanea/creator-starters/myth-packets";
import type {
  SnapshotReceipt,
  WorkbenchResult,
} from "@arcanea/creator-starters/myth-workbench";
import styles from "./workbench.module.css";

type Saved = SnapshotReceipt & { title: string };
const initialBrief = example as MythBrief;
const money = (value: number, currency: string) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value / 1_000_000);

function download(name: string, value: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([value], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function request<T>(path: string, body?: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(path, {
      method: body ? "POST" : "GET",
      cache: "no-store",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(
        typeof result.error === "string"
          ? result.error
          : "Request failed. Your brief remains here.",
      );
    return result as T;
  } catch (failure) {
    if (failure instanceof Error && failure.name === "AbortError")
      throw new Error(
        "The request timed out. Your brief remains here. Retry the same save safely.",
      );
    throw failure;
  } finally {
    clearTimeout(timeout);
  }
}

export function MythWorkbench() {
  const [brief, setBrief] = useState<MythBrief>(structuredClone(initialBrief));
  const [result, setResult] = useState<WorkbenchResult | null>(null);
  const [saved, setSaved] = useState<Saved[] | null>(null);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  function revise(patch: Partial<MythBrief>) {
    setBrief((current) => ({ ...current, ...patch }));
    setResult(null);
    setNotice(
      "Brief changed. Compile again to refresh the packet and exports.",
    );
    setError("");
  }
  async function run(action: "compile" | "save") {
    setBusy(action);
    setError("");
    setNotice("");
    try {
      const next = await request<WorkbenchResult>("/api/myth-studio", {
        action,
        brief,
      });
      setResult(next);
      setNotice(
        next.receipt
          ? `${next.receipt.disposition === "created" ? "Saved a new private snapshot" : "Recovered the existing private snapshot"}. Receipt: ${next.receipt.creationId}.`
          : "Research packet compiled. Read the sources and unresolved decisions before writing.",
      );
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Request failed. Your brief remains here.",
      );
    } finally {
      setBusy("");
    }
  }
  async function open(id?: string) {
    setBusy("open");
    setError("");
    setNotice("");
    try {
      if (id) {
        const next = await request<WorkbenchResult>(
          `/api/myth-studio?id=${encodeURIComponent(id)}`,
        );
        setBrief(next.brief);
        setResult(next);
        setNotice(
          `Opened private snapshot ${next.receipt?.creationId}. Source and packet fingerprints checked.`,
        );
      } else {
        const next = await request<{
          snapshots: Saved[];
          unreadableCount: number;
        }>("/api/myth-studio");
        setSaved(next.snapshots);
        setNotice(
          next.unreadableCount
            ? `${next.unreadableCount} altered or unreadable snapshots were omitted. Contact support.`
            : "Private snapshots loaded.",
        );
      }
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Could not open snapshots. Your brief remains here.",
      );
    } finally {
      setBusy("");
    }
  }
  async function importBrief(file?: File) {
    if (!file) return;
    setBusy("import");
    setError("");
    setNotice("");
    try {
      if (file.size > 16384)
        throw new Error(
          "Brief exceeds 16 KiB. Your current brief remains here.",
        );
      let value: unknown;
      try {
        value = JSON.parse(await file.text());
      } catch {
        throw new Error(
          "That file is not valid JSON. Your current brief remains here.",
        );
      }
      const next = await request<WorkbenchResult>("/api/myth-studio", {
        action: "compile",
        brief: value,
      });
      setBrief(next.brief);
      setResult(next);
      setNotice(
        "Imported and compiled the brief against the current source atlas. Your file grants no execution or release permission.",
      );
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Import failed. Your current brief remains here.",
      );
    } finally {
      setBusy("");
    }
  }
  return (
    <main className={styles.workbench}>
      <header className={styles.header}>
        <Link href="/studio">Arcanea / Studio</Link>
        <span>Research workspace · Preview</span>
      </header>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Myth Studio</p>
        <h1>
          Give your story a source.
          <br />
          <em>Then make it your own.</em>
        </h1>
        <p>
          Select myth references, choose an audience and setting, and plan the
          work your story needs. Export a research packet with sources, costs
          and unresolved decisions.
        </p>
        <p className={styles.boundary}>
          12 starting references. Source reading and edition rights remain
          unresolved. Compilation uses no AI model and spends no provider
          credits.
        </p>
      </div>
      <div className={styles.layout}>
        <BriefEditor
          brief={brief}
          busy={busy}
          revise={revise}
          onCompile={() => void run("compile")}
          onDownload={() =>
            download("myth-brief.json", JSON.stringify(brief, null, 2))
          }
        />
        <section className={styles.preview} aria-label="Research packet">
          <div className={styles.status} role="status" aria-live="polite">
            {busy
              ? "Working…"
              : notice || "Ready to shape your first research packet."}
          </div>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          {!result ? (
            <div className={styles.empty}>
              <p className={styles.eyebrow}>Your research packet</p>
              <h2>
                The source, the idea,
                <br />
                and the work ahead.
              </h2>
              <p>
                Compile your brief to see source anchors, original direction
                prompts, production estimates and the decisions an editor still
                needs to make.
              </p>
              <dl>
                <dt>Evidence</dt>
                <dd>Keep source uncertainty visible.</dd>
                <dt>Direction</dt>
                <dd>Create new characters, places and institutions.</dd>
                <dt>Production</dt>
                <dd>Budget for rejected attempts and human review.</dd>
              </dl>
            </div>
          ) : (
            <>
              <div className={styles.packetHeader}>
                <p className={styles.eyebrow}>
                  Research stage · Rights unresolved
                </p>
                <h2>{result.packet.project.title}</h2>
                <p>{result.packet.project.setting}</p>
              </div>
              <div className={styles.cost}>
                <span>Estimated production and review</span>
                <strong>
                  {money(
                    result.packet.budget.totalCostMicros,
                    result.packet.budget.currency,
                  )}
                </strong>
                <p>
                  {result.packet.budget.withinBudget
                    ? "Within your planning ceiling"
                    : "Over your planning ceiling"}{" "}
                  of{" "}
                  {money(
                    result.packet.budget.maxProductionCostMicros,
                    result.packet.budget.currency,
                  )}
                  . No spending authorized.
                </p>
              </div>
              <div className={styles.section}>
                <h3>Source evidence & original direction</h3>
                {result.packet.research.map((row) => (
                  <article className={styles.evidence} key={row.id}>
                    <h4>{row.label}</h4>
                    <p>
                      {row.source.work} · {row.source.anchor}
                    </p>
                    <a
                      href={row.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read source reference
                    </a>
                    <p className={styles.hint}>
                      {row.source.evidenceStatus} · Edition rights unresolved
                    </p>
                    <p>
                      <strong>Geography:</strong> {row.geography.place} (
                      {row.geography.status})
                    </p>
                    <p>
                      <strong>Creative proposal:</strong> {row.adaptationPrompt}
                    </p>
                    {row.livingTradition && (
                      <p className={styles.warning}>
                        A reader from this living tradition is required before
                        commercial adaptation.
                      </p>
                    )}
                  </article>
                ))}
              </div>
              <div className={styles.section}>
                <h3>Planned deliverables</h3>
                {result.packet.budget.estimates.map((item) => (
                  <p key={item.id}>
                    <strong>{item.id}</strong>
                    <br />
                    {item.acceptedUnits} accepted units target ·{" "}
                    {item.plannedAttempts} planned attempts ·{" "}
                    {item.reviewMinutes} review minutes ·{" "}
                    {money(item.totalCostMicros, result.packet.budget.currency)}
                  </p>
                ))}
              </div>
              <div className={styles.section}>
                <h3>Before writing and release</h3>
                <ul>
                  {result.packet.review.questions.map((item, index) => (
                    <li key={index}>{item.question}</li>
                  ))}
                </ul>
                <ul>
                  {result.packet.review.requiredDecisions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.section}>
                <h3>Save and hand off</h3>
                <p>
                  Each save creates a private version or recovers the identical
                  saved version. Export tasks for an editor; paid jobs and
                  publishing require separate authorization.
                </p>
                <div className={styles.actions}>
                  <button
                    className={styles.primary}
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => void run("save")}
                  >
                    {busy === "save" ? "Saving…" : "Save private snapshot"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      download(
                        "myth-research.md",
                        result.markdown,
                        "text/markdown",
                      )
                    }
                  >
                    Export research
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      download(
                        "myth-packet.json",
                        JSON.stringify(result.packet, null, 2),
                      )
                    }
                  >
                    Export packet
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      download(
                        "myth-handoff.json",
                        JSON.stringify(result.handoff, null, 2),
                      )
                    }
                  >
                    Export workflow handoff
                  </button>
                </div>
                {result.receipt && (
                  <p className={styles.receipt}>
                    Private snapshot
                    <br />
                    {result.receipt.creationId}
                    <br />
                    Saved {new Date(result.receipt.createdAt).toLocaleString()}
                  </p>
                )}
                <details>
                  <summary>Reproducibility fingerprints</summary>
                  <p className={styles.receipt}>
                    {result.packet.packetId}
                    <br />
                    Brief: {result.packet.provenance.briefDigest}
                    <br />
                    Atlas: {result.packet.provenance.atlasDigest}
                  </p>
                  <p className={styles.hint}>
                    These fingerprints detect changes; they do not establish
                    authenticity or rights clearance.
                  </p>
                </details>
              </div>
            </>
          )}
          <div className={styles.section}>
            <h3>Your private snapshots</h3>
            <p>
              Sign in to save and reopen versions. Reopening replaces the
              current editor contents; download your brief first to keep unsaved
              work.
            </p>
            <Link href="/auth/login">Sign in</Link>
            <label className={styles.importLabel}>
              Import a brief JSON file
              <input
                type="file"
                accept="application/json,.json"
                disabled={Boolean(busy)}
                onChange={(event) => {
                  void importBrief(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
            <p className={styles.hint}>
              Import replaces the editor after validation. Download your current
              brief first to keep unsaved work.
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                disabled={Boolean(busy)}
                onClick={() => void open()}
              >
                Open saved snapshots
              </button>
            </div>
            {saved?.length === 0 && (
              <p>
                No private snapshots yet. Compile a brief and save the first
                version.
              </p>
            )}
            {saved?.map((item) => (
              <button
                className={styles.saved}
                key={item.creationId}
                type="button"
                disabled={Boolean(busy)}
                onClick={() => void open(item.creationId)}
              >
                {item.title}
                <small>{new Date(item.createdAt).toLocaleString()}</small>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
