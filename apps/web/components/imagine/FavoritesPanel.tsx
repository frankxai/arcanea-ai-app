"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useRef, useState, type RefObject } from "react";
import { Download, Heart, X } from "@/lib/phosphor-icons";
import { removeFavorite, type FavoriteImage } from "@/lib/imagine-favorites";
import {
  generatedImageBlob,
  type GenerationAuthority,
} from "@/lib/imagine/request";

interface FavoritesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authority: GenerationAuthority;
  images: FavoriteImage[];
  loading: boolean;
  error: string | null;
  warning: string | null;
  hasMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onRemoved: (image: FavoriteImage, warning: string | null) => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}

const actionClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-3 text-sm text-[var(--arc-text-primary)] hover:bg-[var(--arc-cosmic-raised)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)] disabled:opacity-50";

export function FavoritesPanel({
  open,
  onOpenChange,
  authority,
  images,
  loading,
  error,
  warning,
  hasMore,
  onRefresh,
  onLoadMore,
  onRemoved,
  returnFocusRef,
}: FavoritesPanelProps) {
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const actionInFlight = useRef(false);
  const current = () => authority.scope.isCurrent(authority.token);

  async function act(image: FavoriteImage, operation: "download" | "remove") {
    if (!current() || actionInFlight.current) return;
    actionInFlight.current = true;
    setBusy(image.assetId ?? image.id);
    setActionError(null);
    try {
      if (operation === "remove") {
        const result = await removeFavorite(image, authority);
        if (current()) onRemoved(image, result.cacheWarning);
      } else {
        const blob = await generatedImageBlob(image.blobUrl, authority);
        if (!current()) return;
        const url = URL.createObjectURL(blob);
        try {
          const anchor = document.createElement("a");
          anchor.href = url;
          const extension =
            blob.type === "image/jpeg"
              ? "jpg"
              : blob.type === "image/webp"
                ? "webp"
                : "png";
          anchor.download = `arcanea-${(image.assetId ?? image.id).replace(/[^a-z0-9_-]/gi, "_")}.${extension}`;
          document.body.appendChild(anchor);
          try {
            anchor.click();
          } finally {
            anchor.remove();
          }
        } finally {
          // Keep the object alive until the browser starts its download.
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
      }
    } catch (failure) {
      if (current())
        setActionError(
          failure instanceof Error
            ? failure.message
            : "The action could not be completed. Retry to recover it.",
        );
    } finally {
      actionInFlight.current = false;
      if (current()) setBusy(null);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[var(--arc-cosmic-void)]/80" />
        <Dialog.Content
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocusRef.current?.focus();
          }}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-void)] text-[var(--arc-text-primary)] shadow-xl"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[var(--arc-cosmic-border)] px-5 py-4">
            <div>
              <Dialog.Title className="flex items-center gap-2 text-lg font-semibold">
                <Heart size={20} aria-hidden />
                Favorites
              </Dialog.Title>
              <Dialog.Description className="mt-2 max-w-sm text-sm text-[var(--arc-text-secondary)]">
                Account favorites reopen across devices. Removing a favorite
                keeps its saved image.
              </Dialog.Description>
            </div>
            <Dialog.Close className={actionClass} aria-label="Close favorites">
              <X size={20} aria-hidden />
            </Dialog.Close>
          </div>
          <div className="flex items-center justify-between gap-3 px-5 py-2">
            <p className="text-sm text-[var(--arc-text-secondary)]">
              {images.length} loaded{hasMore ? "; more available" : ""}
            </p>
            <button
              type="button"
              className={actionClass}
              disabled={loading || busy !== null}
              onClick={() => {
                setActionError(null);
                onRefresh();
              }}
            >
              Sync favorites
            </button>
          </div>
          <div
            className="min-h-0 flex-1 overflow-y-auto px-5 pb-5"
            aria-busy={loading}
          >
            {loading && (
              <p
                role="status"
                className="py-3 text-sm text-[var(--arc-text-secondary)]"
              >
                Loading account favorites…
              </p>
            )}
            {(error || actionError) && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-[var(--arc-cosmic-border-bright)] p-3 text-sm"
              >
                <p>{actionError ?? error}</p>
                <button
                  type="button"
                  className={`${actionClass} mt-2`}
                  disabled={loading || busy !== null}
                  onClick={() => {
                    setActionError(null);
                    onRefresh();
                  }}
                >
                  Refresh favorites
                </button>
              </div>
            )}
            {warning && (
              <p
                role="status"
                className="mb-4 text-sm text-[var(--arc-text-secondary)]"
              >
                {warning}
              </p>
            )}
            {!loading && !error && images.length === 0 && (
              <div className="py-12">
                <h3 className="font-medium">No favorites yet</h3>
                <p className="mt-2 text-sm text-[var(--arc-text-secondary)]">
                  Save an image with its heart button to return to it here.
                </p>
              </div>
            )}
            <ul className="grid grid-cols-2 gap-4">
              {images.map((image) => (
                <li
                  key={image.assetId ?? image.id}
                  className="min-w-0 overflow-hidden rounded-xl border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-surface)]"
                >
                  <Image
                    src={image.blobUrl}
                    unoptimized
                    alt={(image.alt ?? image.prompt) || "Saved creator image"}
                    width={240}
                    height={240}
                    sizes="(max-width: 512px) 45vw, 220px"
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="text-xs text-[var(--arc-text-secondary)]">
                      {image.assetId
                        ? "Private · Saved to account"
                        : "Browser bookmark"}
                    </p>
                    <p
                      className="mt-2 line-clamp-3 text-sm"
                      title={image.prompt}
                    >
                      {image.prompt || "Saved creator image"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      <button
                        type="button"
                        className={actionClass}
                        disabled={busy !== null || loading}
                        aria-label={`Download ${image.prompt || "saved image"}`}
                        onClick={() => void act(image, "download")}
                      >
                        <Download size={18} aria-hidden />
                        <span className="sr-only">Download</span>
                      </button>
                      <button
                        type="button"
                        className={actionClass}
                        disabled={busy !== null || loading}
                        aria-label={`Remove favorite: ${image.prompt || "saved image"}`}
                        onClick={() => void act(image, "remove")}
                      >
                        <Heart size={18} aria-hidden />
                        <span className="sr-only">Remove favorite</span>
                      </button>
                    </div>
                    {busy === (image.assetId ?? image.id) && (
                      <p
                        role="status"
                        className="mt-2 text-xs text-[var(--arc-text-secondary)]"
                      >
                        Working…
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {hasMore && (
              <button
                type="button"
                className={`${actionClass} mt-5 w-full border border-[var(--arc-cosmic-border)]`}
                disabled={loading || busy !== null}
                onClick={onLoadMore}
              >
                Load more favorites
              </button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
