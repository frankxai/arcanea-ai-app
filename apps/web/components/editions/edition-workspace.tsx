"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import type { ProjectWorkspaceSnapshot } from "@/lib/projects/server";
import {
  editionKey,
  emptyEdition,
  parseEdition,
  persistEdition,
  editionDigest,
  exportEdition,
  importEdition,
  readEditionSource,
  SECTION_LIMIT,
  EDITION_LIMIT,
  type EditionDraft,
} from "@/lib/editions/edition";
import styles from "./edition-workspace.module.css";
import { EditionManuscript } from "./edition-manuscript";

type Props = {
  owner: string;
  project: ProjectWorkspaceSnapshot["project"];
  docs: ProjectWorkspaceSnapshot["docs"];
};
const subscribeHydration = () => () => {};

export function EditionWorkspace(props: Props) {
  const { credentialScope } = useAuth();
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
  const token = credentialScope.get();
  if (!hydrated || token.actor === null)
    return (
      <p role="status" className={styles.notice}>
        Opening your edition…
      </p>
    );
  if (token.actor !== `user:${props.owner}`)
    return (
      <p role="alert" className={styles.notice}>
        Your account changed. <Link href="/projects">Reopen your projects</Link>
        .
      </p>
    );
  return (
    <Composer
      key={`${token.actor}:${token.revision}:${props.project.id}`}
      {...props}
    />
  );
}

function Composer({ owner, project, docs }: Props) {
  const { credentialScope } = useAuth();
  const [token] = useState(() => credentialScope.get());
  const current = () => credentialScope.isCurrent(token);
  const [initial] = useState(() => {
    const scope = { owner, project: project.id };
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(editionKey(scope));
      return {
        raw,
        draft: raw
          ? parseEdition(raw, scope)
          : emptyEdition(scope, project.title),
        error: "",
      };
    } catch {
      return {
        raw,
        draft: emptyEdition(scope, project.title),
        error:
          "Your saved draft could not be opened. It has been preserved. Download its recovery file before investigating storage.",
      };
    }
  });
  const [draft, setDraft] = useState(initial.draft);
  const liveDraft = useRef(draft);
  const savedRaw = useRef(initial.raw);
  const [error, setError] = useState(initial.error);
  const saveFailed = useRef(!!initial.error);
  const [volatile, setVolatile] = useState(false);
  const [message, setMessage] = useState(
    initial.raw && !initial.error
      ? "Recovered from this browser."
      : "Draft stays in this browser. Export a copy to keep it elsewhere.",
  );
  const [loading, setLoading] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [paper, setPaper] = useState(true);
  const previous = useRef<EditionDraft | null>(null);
  const abort = useRef<AbortController | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if (
        event.key === null ||
        event.key === editionKey({ owner, project: project.id })
      ) {
        saveFailed.current = true;
        setError(
          "Another tab changed this draft. Export your current copy before reloading.",
        );
      }
    };
    window.addEventListener("storage", changed);
    return () => window.removeEventListener("storage", changed);
  }, [owner, project.id]);
  useEffect(() => {
    if ((!error && !volatile) || initial.error) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [error, volatile, initial.error]);

  function update(next: EditionDraft) {
    if (!current() || error || saveFailed.current) return;
    try {
      parseEdition(JSON.stringify(next), next.scope);
    } catch (reason) {
      setMessage(
        reason instanceof Error
          ? reason.message
          : "This edit exceeds the draft limit.",
      );
      return;
    }
    previous.current = liveDraft.current;
    liveDraft.current = next;
    setDraft(next);
    if (!navigator.locks) {
      setVolatile(true);
      setMessage(
        "This browser cannot coordinate draft saves. Export your writing before leaving; changes are held in memory only.",
      );
      return;
    }
    void navigator.locks
      .request(editionKey(next.scope), () => {
        if (!current() || saveFailed.current) return;
        savedRaw.current = persistEdition(
          localStorage,
          next,
          savedRaw.current,
          current,
        );
        setMessage("Saved in this browser.");
      })
      .catch((reason) => {
        if (!current()) return;
        saveFailed.current = true;
        setError(
          reason instanceof Error
            ? reason.message
            : "Browser storage is unavailable. Export your current copy before leaving.",
        );
      });
  }
  function download(content: string, name: string, type: string) {
    if (!current()) throw new Error("Your account changed. Download stopped.");
    const url = URL.createObjectURL(new Blob([content], { type }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function exportFile(format: "json" | "markdown") {
    if (exporting || initial.error) return;
    setExporting(true);
    try {
      const output = await exportEdition(liveDraft.current, current);
      download(
        format === "json" ? output.json : output.markdown,
        `${output.filename}.${format === "json" ? "edition.json" : "md"}`,
        format === "json" ? "application/json" : "text/markdown;charset=utf-8",
      );
      if (current())
        setMessage("Export prepared. Confirm the file in your downloads.");
    } catch (reason) {
      if (current())
        setMessage(
          reason instanceof Error
            ? reason.message
            : "Export failed. Your draft is unchanged.",
        );
    } finally {
      setExporting(false);
    }
  }
  async function addDocument(id: string) {
    if (
      loading ||
      error ||
      !current() ||
      liveDraft.current.sections.length >= SECTION_LIMIT
    )
      return;
    setLoading(id);
    const controller = new AbortController();
    abort.current = controller;
    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(project.id)}/docs/${encodeURIComponent(id)}`,
        {
          cache: "no-store",
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(15000),
          ]),
        },
      );
      if (!response.ok)
        throw new Error(
          "The source could not be loaded. Your edition is unchanged; retry when access is available.",
        );
      const raw = await response.text();
      if (!current() || controller.signal.aborted) return;
      const doc = readEditionSource(raw, { owner, project: project.id }, id);
      const text = doc.text;
      const sha256 = await editionDigest(text);
      if (!current() || controller.signal.aborted) return;
      const value = liveDraft.current;
      if (value.sections.some((section) => section.source?.docId === id))
        return;
      update({
        ...value,
        sections: [
          ...value.sections,
          {
            id: crypto.randomUUID(),
            title: doc.title,
            text,
            source: { docId: id, revision: doc.revision, sha256 },
          },
        ],
      });
    } catch (reason) {
      if (current())
        setMessage(
          reason instanceof Error
            ? reason.message
            : "Source import failed. Retry without losing your draft.",
        );
    } finally {
      setLoading(null);
    }
  }
  async function restoreFile(file: File) {
    if (error || loading || !current()) return;
    setLoading("restore");
    const before = liveDraft.current;
    try {
      if (file.size > EDITION_LIMIT)
        throw new Error("This edition exceeds the 1 MB import limit.");
      const restored = await importEdition(
        await file.text(),
        before.scope,
        current,
      );
      if (!current()) return;
      if (liveDraft.current !== before)
        throw new Error(
          "Your draft changed while the file was opening. Retry when you have finished editing.",
        );
      update(restored);
    } catch (reason) {
      if (current())
        setMessage(
          reason instanceof Error
            ? reason.message
            : "The source record could not be restored.",
        );
    } finally {
      setLoading(null);
    }
  }

  const words = draft.sections.reduce(
    (sum, section) => sum + (section.text.trim().match(/\S+/g)?.length ?? 0),
    0,
  );
  return (
    <main className={styles.workspace}>
      <header className={styles.heading}>
        <div>
          <Link href={`/projects/${project.id}`} className={styles.back}>
            Back to {project.title}
          </Link>
          <h1>Make an edition.</h1>
          <p>
            Bring your project writing together. Shape it into something you can
            keep.
          </p>
        </div>
        <span className={styles.counter}>
          {draft.sections.length} sections · {words.toLocaleString()} words
        </span>
      </header>
      <div
        className={`${styles.toolbar} liquid-surface liquid-tier-floating`}
        aria-label="Edition controls"
      >
        <div className={styles.actions}>
          <button
            type="button"
            aria-pressed={!preview}
            onClick={() => setPreview(false)}
          >
            Edit
          </button>
          <button
            type="button"
            aria-pressed={preview}
            onClick={() => setPreview(true)}
          >
            Read
          </button>
        </div>
        <div className={styles.actions} aria-label="Reading appearance">
          <button
            type="button"
            aria-pressed={paper}
            onClick={() => setPaper(true)}
          >
            Paper
          </button>
          <button
            type="button"
            aria-pressed={!paper}
            onClick={() => setPaper(false)}
          >
            Obsidian
          </button>
        </div>
        <div className={styles.actions}>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            aria-label="Edition source record file"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void restoreFile(file);
            }}
          />
          <button
            type="button"
            disabled={!!error || !!loading}
            onClick={() => fileInput.current?.click()}
          >
            Restore source record
          </button>
          <button
            type="button"
            disabled={exporting || !!initial.error}
            onClick={() => void exportFile("markdown")}
          >
            Export Markdown
          </button>
          <button
            type="button"
            disabled={exporting || !!initial.error}
            onClick={() => void exportFile("json")}
          >
            Export source record
          </button>
        </div>
      </div>
      <p role="status" aria-live="polite" className={styles.status}>
        {message}
      </p>
      {error && (
        <div role="alert" className={styles.warning}>
          {error}
          {initial.raw && initial.error && (
            <button
              type="button"
              onClick={() => {
                try {
                  download(initial.raw!, "edition-recovery.txt", "text/plain");
                } catch {
                  setMessage(
                    "Your account changed. Reopen the project to recover its draft.",
                  );
                }
              }}
            >
              Download preserved recovery file
            </button>
          )}
        </div>
      )}
      <div className={styles.layout}>
        <aside className={styles.sources} aria-label="Project sources">
          <h2>Your sources</h2>
          <p>Import a text snapshot. Originals stay in your project.</p>
          {docs.length === 0 && (
            <p>
              <Link href={`/projects/${project.id}/docs/new`}>
                Write your first project document
              </Link>
            </p>
          )}
          <ul>
            {docs.map((doc) => {
              const included = draft.sections.some(
                (section) => section.source?.docId === doc.id,
              );
              return (
                <li key={doc.id}>
                  <Link href={`/projects/${project.id}/docs/${doc.id}`}>
                    {doc.title}
                  </Link>
                  <span>{doc.wordCount.toLocaleString()} words</span>
                  <button
                    type="button"
                    disabled={
                      !!loading ||
                      !!error ||
                      included ||
                      draft.sections.length >= SECTION_LIMIT
                    }
                    onClick={() => void addDocument(doc.id)}
                    aria-label={`Add ${doc.title} to edition`}
                  >
                    {loading === doc.id
                      ? "Loading…"
                      : included
                        ? "Included"
                        : "Add to edition"}
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            disabled={!!error || draft.sections.length >= SECTION_LIMIT}
            onClick={() =>
              update({
                ...draft,
                sections: [
                  ...draft.sections,
                  {
                    id: crypto.randomUUID(),
                    title: "New section",
                    text: "",
                    source: null,
                  },
                ],
              })
            }
          >
            Write a section
          </button>
          <button
            type="button"
            disabled={!!error || !previous.current}
            onClick={() => {
              if (previous.current) update(previous.current);
            }}
          >
            Undo last edit
          </button>
          <p className={styles.note}>
            Text edition · up to {SECTION_LIMIT} sections. Images and music
            remain in their source records.
          </p>
        </aside>
        <EditionManuscript
          draft={draft}
          paper={paper}
          preview={preview}
          disabled={!!error}
          onChange={update}
        />
      </div>
    </main>
  );
}
