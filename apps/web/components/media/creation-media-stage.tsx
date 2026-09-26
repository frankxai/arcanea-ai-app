"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  FilmStrip,
  ImageSquare,
  MusicNote,
} from "@/lib/phosphor-icons";
import styles from "./creation-media-stage.module.css";

export interface MediaStageCreation {
  id: string;
  title: string;
  type: string;
  status: string;
  fileUrl?: string | null;
  thumbnailUrl?: string | null;
  sourceSessionId?: string | null;
}

type MediaKind = "image" | "video" | "music";

function mediaKind(type: string): MediaKind | null {
  if (type === "image" || type === "video") return type;
  if (type === "music" || type === "audio") return "music";
  return null;
}

function safeMediaUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\")
  )
    return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function previewableUrl(value: string | null | undefined): string | null {
  const safeUrl = safeMediaUrl(value);
  if (!safeUrl || safeUrl.startsWith("/")) return safeUrl;
  const hostname = new URL(safeUrl).hostname;
  return hostname.endsWith(".supabase.co") ||
    hostname.endsWith(".public.blob.vercel-storage.com") ||
    hostname === "media.starlightintelligence.org"
    ? safeUrl
    : null;
}

function mediaLabel(kind: MediaKind): string {
  return kind === "image" ? "Image" : kind === "video" ? "Film" : "Music";
}

function MediaPreview({
  creation,
  kind,
}: {
  creation: MediaStageCreation;
  kind: MediaKind;
}) {
  const originalUrl = safeMediaUrl(creation.fileUrl);
  const fileUrl = previewableUrl(creation.fileUrl);
  const thumbnailUrl = previewableUrl(creation.thumbnailUrl);
  const imageUrl = fileUrl ?? thumbnailUrl;

  if (kind === "video" && fileUrl) {
    return (
      <video
        key={creation.id}
        className={styles.video}
        controls
        playsInline
        preload="none"
        poster={thumbnailUrl ?? undefined}
        aria-label={"Play " + creation.title}
      >
        <source src={fileUrl} />
        Your browser cannot play this film.
      </video>
    );
  }

  if (kind === "music") {
    return (
      <div className={styles.audioStage}>
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt=""
            fill
            sizes="(max-width: 760px) 100vw, 60vw"
            className={styles.audioArtwork}
          />
        ) : (
          <MusicNote
            className={styles.audioIcon}
            size={72}
            weight="thin"
            aria-hidden="true"
          />
        )}
        <div className={styles.audioControls}>
          <span>Listen to this take</span>
          {fileUrl ? (
            <audio
              key={creation.id}
              controls
              preload="none"
              src={fileUrl}
              aria-label={"Play " + creation.title}
            >
              Your browser cannot play this track.
            </audio>
          ) : (
            <p>
              Audio preview is unavailable.
              {originalUrl && (
                <a href={originalUrl} target="_blank" rel="noopener noreferrer">
                  Open original
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (kind === "image" && imageUrl) {
    return (
      <Image
        key={creation.id}
        src={imageUrl}
        alt={creation.title}
        fill
        sizes="(max-width: 760px) 100vw, (max-width: 1200px) 70vw, 58vw"
        className={styles.image}
        loading="eager"
        fetchPriority="high"
      />
    );
  }

  return (
    <div className={styles.noPreview}>
      <span>{mediaLabel(kind)} preview unavailable</span>
      {originalUrl && (
        <a href={originalUrl} target="_blank" rel="noopener noreferrer">
          Open original <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

export function CreationMediaStage({
  creations,
  scope,
}: {
  creations: MediaStageCreation[];
  scope: "project" | "library";
}) {
  const media = creations.flatMap((creation) => {
    const kind = mediaKind(creation.type);
    return kind ? [{ creation, kind }] : [];
  });
  const [selectedId, setSelectedId] = useState<string | null>(
    media[0]?.creation.id ?? null,
  );
  const selected =
    media.find(({ creation }) => creation.id === selectedId) ?? media[0];
  const selectedOriginalUrl = selected
    ? safeMediaUrl(selected.creation.fileUrl)
    : null;

  return (
    <section className={styles.stage} aria-labelledby="project-media-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.kicker}>
            {scope === "project" ? "Project studio" : "Media library"}
          </p>
          <h2 id="project-media-title">
            {scope === "project"
              ? "See the work take shape"
              : "Your work, in focus"}
          </h2>
          <p className={styles.intro}>
            {scope === "project"
              ? "Linked images, film and music in one place."
              : "Your latest images, film and music, ready to revisit."}
          </p>
        </div>
        <span className={styles.count}>
          {media.length} {media.length === 1 ? "recent piece" : "recent pieces"}
        </span>
      </div>

      {selected ? (
        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.preview}>
              <MediaPreview creation={selected.creation} kind={selected.kind} />
            </div>
            <div className={styles.caption}>
              <div>
                <span className={styles.type}>{mediaLabel(selected.kind)}</span>
                <h3 aria-live="polite">{selected.creation.title}</h3>
              </div>
              <div className={styles.details}>
                <p>
                  {scope === "project" && (
                    <>
                      {selected.creation.sourceSessionId
                        ? "Source chat linked"
                        : "Source chat not linked"}
                      <span aria-hidden="true"> · </span>
                    </>
                  )}
                  {selected.creation.status.replaceAll("_", " ")}
                </p>
                {selectedOriginalUrl && (
                  <a
                    href={selectedOriginalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open original <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className={styles.collection}>
            <h3>Recent media</h3>
            <div
              className={styles.items}
              role="group"
              aria-label="Choose a media preview"
            >
              {media.map(({ creation, kind }) => {
                const thumbnailUrl = previewableUrl(creation.thumbnailUrl);
                return (
                  <button
                    key={creation.id}
                    type="button"
                    className={styles.item}
                    aria-pressed={selected.creation.id === creation.id}
                    onClick={() => setSelectedId(creation.id)}
                  >
                    <span className={styles.thumb}>
                      {thumbnailUrl ? (
                        <Image
                          src={thumbnailUrl}
                          alt=""
                          fill
                          sizes="80px"
                          className={styles.thumbImage}
                        />
                      ) : kind === "video" ? (
                        <FilmStrip size={24} aria-hidden="true" />
                      ) : kind === "music" ? (
                        <MusicNote size={24} aria-hidden="true" />
                      ) : (
                        <ImageSquare size={24} aria-hidden="true" />
                      )}
                    </span>
                    <span className={styles.itemText}>
                      <strong>{creation.title}</strong>
                      <small>{mediaLabel(kind)}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyFrame} aria-hidden="true">
            <ImageSquare size={48} weight="thin" />
            <FilmStrip size={48} weight="thin" />
            <MusicNote size={48} weight="thin" />
          </div>
          <div>
            <h3>
              {scope === "project"
                ? "Your project starts here"
                : "A place for your media"}
            </h3>
            <p>
              {scope === "project"
                ? "Create an image, film or track, then attach it to this project below. Recent linked media will appear here."
                : "Images, films and music you save will appear here."}
            </p>
          </div>
        </div>
      )}

      {scope === "project" && (
        <nav className={styles.actions} aria-label="Media actions">
          <a href="#project-creations">
            <ImageSquare size={19} aria-hidden="true" />
            Attach a creation
          </a>
          <Link href="/creations">
            Browse your creations
            <ArrowUpRight
              size={16}
              className={styles.trailingIcon}
              aria-hidden="true"
            />
          </Link>
        </nav>
      )}
    </section>
  );
}
