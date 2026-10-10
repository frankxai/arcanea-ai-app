"use client";
import type { RefObject } from "react";
import { costFor } from "@/lib/billing/catalog";
import { OPENROUTER_IMAGE_MODELS } from "@/lib/imagine/generate";
import { imageSource, MAX_BRIEF_LENGTH } from "@/lib/reading-scene/brief";
import type { SceneSession } from "@/lib/reading-scene/session";
import styles from "./scene-visualizer.module.css";
interface Props {
  scene: SceneSession | null;
  open: boolean;
  busy: boolean;
  message: string;
  selection: string;
  authenticated: boolean;
  isLoading: boolean;
  bookId: string;
  chapterTitle: string;
  workspaceRef: RefObject<HTMLElement | null>;
  briefRef: RefObject<HTMLTextAreaElement | null>;
  selectPassage: () => Promise<void>;
  generate: () => Promise<void>;
  save: () => Promise<void>;
  download: () => void;
  stopWaiting: () => void;
  setOpen: (open: boolean) => void;
  retain: (scene: SceneSession) => boolean;
}
export function SceneWorkspaceView({
  scene,
  open,
  busy,
  message,
  selection,
  authenticated,
  isLoading,
  bookId,
  chapterTitle,
  workspaceRef,
  briefRef,
  selectPassage,
  generate,
  save,
  download,
  stopWaiting,
  setOpen,
  retain,
}: Props) {
  const selectedModel = OPENROUTER_IMAGE_MODELS.find(
    (m) => m.id === scene?.model,
  );
  const credits = costFor(
    selectedModel?.tier === "premium" || selectedModel?.tier === "quality"
      ? "image.premium"
      : "image.standard",
    1,
  );
  const image = scene?.result ? imageSource(scene.result.images[0]) : null;
  const pending = Boolean(scene?.requestKey && !scene.result);
  const button = styles.button;

  return (
    <section
      ref={workspaceRef}
      className={styles.workspace}
      aria-label="Passage visualization"
      onClick={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
      onTouchEnd={(event) => event.stopPropagation()}
    >
      {selection.length >= 12 && !open && (
        <button
          type="button"
          className={`${button} ${styles.primary} ${styles.selectionAction}`}
          onClick={selectPassage}
        >
          Visualize selection
        </button>
      )}
      <div className={styles.actions}>
        <button
          type="button"
          className={button}
          onClick={selectPassage}
          disabled={busy}
        >
          Visualize a passage
        </button>
        {scene && (
          <button
            type="button"
            className={button}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? "Return to reading" : "Reopen scene"}
          </button>
        )}
      </div>
      {!open && (
        <p className={styles.hint}>
          Select a sentence in the chapter to make a personal visual
          interpretation.
        </p>
      )}
      {open && (
        <>
          <h2 className={styles.heading}>Your scene interpretation</h2>
          {scene && (
            <>
              <blockquote className={styles.passage}>
                {scene.source.passage}
              </blockquote>
              <label className={styles.label} htmlFor="reading-scene-brief">
                Visual brief
              </label>
              <textarea
                id="reading-scene-brief"
                ref={briefRef}
                className={styles.field}
                value={scene.brief}
                maxLength={MAX_BRIEF_LENGTH}
                disabled={busy || pending || Boolean(scene.result)}
                onChange={(event) =>
                  retain({ ...scene, brief: event.target.value })
                }
              />
              {!scene.result && (
                <>
                  <label className={styles.label} htmlFor="reading-scene-model">
                    Image model
                  </label>
                  <select
                    id="reading-scene-model"
                    className={styles.select}
                    value={scene.model}
                    disabled={busy || pending}
                    onChange={(event) =>
                      retain({ ...scene, model: event.target.value })
                    }
                  >
                    {OPENROUTER_IMAGE_MODELS.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                  <p className={styles.hint}>
                    One image · {credits} credits. Reading and editing the brief
                    are free.
                  </p>
                  <div className={styles.actions}>
                    {authenticated ? (
                      <button
                        type="button"
                        className={`${button} ${styles.primary}`}
                        disabled={
                          busy || isLoading || scene.brief.trim().length < 12
                        }
                        onClick={generate}
                      >
                        {pending ? "Recover request" : "Generate scene"}
                      </button>
                    ) : (
                      <a
                        className={`${button} ${styles.primary}`}
                        href={`/auth/login?next=${encodeURIComponent(scene.source.path)}`}
                      >
                        Sign in to generate
                      </a>
                    )}
                    {busy && (
                      <button
                        type="button"
                        className={button}
                        onClick={() => stopWaiting()}
                      >
                        Stop waiting
                      </button>
                    )}
                  </div>
                </>
              )}
              {image && (
                <>
                  {/* Raster data and provider HTTPS URLs are validated by imageSource. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.preview}
                    src={image}
                    alt={`Personal visual interpretation of a passage from ${chapterTitle}`}
                  />
                  <p className={styles.hint}>
                    {scene.result?.model} · Personal interpretation; publication
                    rights have not been reviewed.
                  </p>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={`${button} ${styles.primary}`}
                      disabled={
                        busy ||
                        Boolean(scene.creationId) ||
                        !authenticated ||
                        !scene.result?.images[0].data
                      }
                      onClick={save}
                    >
                      {scene.creationId
                        ? "Saved privately"
                        : "Save private creation"}
                    </button>
                    <a
                      className={button}
                      href={image}
                      download={`${bookId}-scene.png`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download image
                    </a>
                  </div>
                </>
              )}
              <div className={styles.actions}>
                <button type="button" className={button} onClick={download}>
                  Download scene and source
                </button>
              </div>
              <p className={styles.hint}>
                Recovery stays in this browser tab. Private saves belong to your
                account.
              </p>
            </>
          )}
          {message && (
            <p className={styles.status} role="status" aria-live="polite">
              {message}
            </p>
          )}
        </>
      )}
    </section>
  );
}
