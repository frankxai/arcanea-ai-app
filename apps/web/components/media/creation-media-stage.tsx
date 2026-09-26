"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  FilmStrip,
  ImageSquare,
  MusicNote,
} from "@/lib/phosphor-icons";
import {
  safeCreationUrl as safeMediaUrl,
  previewableCreationUrl as previewableUrl,
} from "@/lib/media/creation-url";
import styles from "./creation-media-stage.module.css";

export interface MediaStageCreation {
  id: string;
  title: string;
  type: string;
  status: string;
  fileUrl?: string | null;
  thumbnailUrl?: string | null;
  aiGenerated?: boolean;
  captionsUrl?: string | null;
  captionsLanguage?: string | null;
  transcript?: string | null;
  transcriptUrl?: string | null;
}

type MediaKind = "image" | "video" | "music" | "audio";

const subscribeToOrigin = () => () => {};

function mediaKind(type: string): MediaKind | null {
  if (
    type === "image" ||
    type === "video" ||
    type === "music" ||
    type === "audio"
  )
    return type;
  return null;
}

function mediaLabel(kind: MediaKind): string {
  if (kind === "image") return "Image";
  if (kind === "video") return "Film";
  return kind === "audio" ? "Audio" : "Music";
}

function UnavailablePreview({
  kind,
  originalUrl,
}: {
  kind: MediaKind;
  originalUrl: string | null;
}) {
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

function MediaThumbnail({
  creation,
  kind,
  origin,
}: {
  creation: MediaStageCreation;
  kind: MediaKind;
  origin: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const thumbnailUrl =
    previewableUrl(creation.thumbnailUrl, origin) ??
    (kind === "image" ? previewableUrl(creation.fileUrl, origin) : null);
  return (
    <span className={styles.thumb}>
      {thumbnailUrl && !failed ? (
        <Image
          src={thumbnailUrl}
          alt=""
          fill
          sizes="80px"
          className={styles.thumbImage}
          onError={() => setFailed(true)}
        />
      ) : kind === "video" ? (
        <FilmStrip size={24} aria-hidden="true" />
      ) : kind === "music" || kind === "audio" ? (
        <MusicNote size={24} aria-hidden="true" />
      ) : (
        <ImageSquare size={24} aria-hidden="true" />
      )}
    </span>
  );
}

function MediaPreview({
  creation,
  kind,
  origin,
}: {
  creation: MediaStageCreation;
  kind: MediaKind;
  origin: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const [artFailed, setArtFailed] = useState(false);
  const originalUrl =
    safeMediaUrl(creation.fileUrl) ??
    (kind === "image" ? safeMediaUrl(creation.thumbnailUrl) : null);
  const fileUrl = previewableUrl(creation.fileUrl, origin);
  const thumbnailUrl = previewableUrl(creation.thumbnailUrl, origin);
  const captionsUrl = previewableUrl(creation.captionsUrl, origin);
  const imageUrl = fileUrl ?? thumbnailUrl;

  if (
    failed ||
    (kind === "video" && !fileUrl) ||
    (kind === "image" && !imageUrl) ||
    ((kind === "music" || kind === "audio") && !fileUrl)
  ) {
    return <UnavailablePreview kind={kind} originalUrl={originalUrl} />;
  }

  if (kind === "video" && fileUrl) {
    return (
      <video
        key={creation.id}
        className={styles.video}
        controls
        playsInline
        crossOrigin={captionsUrl ? "anonymous" : undefined}
        preload="none"
        poster={thumbnailUrl ?? undefined}
        aria-label={"Play " + creation.title}
        onError={() => setFailed(true)}
      >
        <source src={fileUrl} />
        {captionsUrl && (
          <track
            kind="captions"
            src={captionsUrl}
            srcLang={creation.captionsLanguage || "und"}
            label="Captions"
            default
          />
        )}
        Your browser cannot play this film.
      </video>
    );
  }

  if (kind === "music" || kind === "audio") {
    return (
      <div className={styles.audioStage}>
        {thumbnailUrl && !artFailed ? (
          <Image
            src={thumbnailUrl}
            alt=""
            fill
            sizes="(max-width: 760px) 100vw, 60vw"
            className={styles.audioArtwork}
            onError={() => setArtFailed(true)}
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
          <span>Listen to this piece</span>
          <audio
            key={creation.id}
            controls
            preload="none"
            src={fileUrl ?? undefined}
            aria-label={"Play " + creation.title}
            onError={() => setFailed(true)}
          >
            Your browser cannot play this audio.
          </audio>
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
        onError={() => setFailed(true)}
      />
    );
  }

  return <UnavailablePreview kind={kind} originalUrl={originalUrl} />;
}

export function CreationMediaStage({
  creations,
}: {
  creations: MediaStageCreation[];
}) {
  const origin = useSyncExternalStore(
    subscribeToOrigin,
    () => window.location.origin,
    () => null,
  );
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
    ? (safeMediaUrl(selected.creation.fileUrl) ??
      (selected.kind === "image"
        ? safeMediaUrl(selected.creation.thumbnailUrl)
        : null))
    : null;
  const selectedCaptionsUrl = selected
    ? safeMediaUrl(selected.creation.captionsUrl)
    : null;
  const selectedTranscriptUrl = selected
    ? safeMediaUrl(selected.creation.transcriptUrl)
    : null;

  return (
    <section className={styles.stage} aria-labelledby="creation-media-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.kicker}>Media library</p>
          <h2 id="creation-media-title">Your work, in focus</h2>
          <p className={styles.intro}>
            Your latest images, film and audio, ready to revisit.
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
              <MediaPreview
                key={selected.creation.id}
                creation={selected.creation}
                kind={selected.kind}
                origin={origin}
              />
            </div>
            <div className={styles.caption}>
              <div>
                <span className={styles.type}>{mediaLabel(selected.kind)}</span>
                <h3 aria-live="polite">{selected.creation.title}</h3>
                {selected.creation.aiGenerated && (
                  <p data-ai-generated="true" className={styles.disclosure}>
                    AI-generated
                  </p>
                )}
              </div>
              <div className={styles.details}>
                <p>{selected.creation.status.replaceAll("_", " ")}</p>
                {selectedOriginalUrl && (
                  <a
                    href={selectedOriginalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open original <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
                {selectedCaptionsUrl && selected.kind === "video" && (
                  <a
                    href={selectedCaptionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Captions file <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
            {(selected.creation.transcript || selectedTranscriptUrl) && (
              <div className={styles.transcript}>
                {selected.creation.transcript ? (
                  <details>
                    <summary>Read transcript</summary>
                    <p>{selected.creation.transcript}</p>
                  </details>
                ) : (
                  <a
                    href={selectedTranscriptUrl ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read transcript{" "}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className={styles.collection}>
            <h3>Recent media</h3>
            <div
              className={styles.items}
              role="group"
              aria-label="Choose a media preview"
            >
              {media.map(({ creation, kind }) => {
                return (
                  <button
                    key={creation.id}
                    type="button"
                    className={styles.item}
                    aria-pressed={selected.creation.id === creation.id}
                    onClick={() => setSelectedId(creation.id)}
                  >
                    <MediaThumbnail
                      creation={creation}
                      kind={kind}
                      origin={origin}
                    />
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
            <h3>A place for your media</h3>
            <p>Images, films and audio you save will appear here.</p>
          </div>
        </div>
      )}
    </section>
  );
}
