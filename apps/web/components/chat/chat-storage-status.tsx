"use client";

import type { ChatSaveStatus } from "@/hooks/use-chat-sessions";

export function ChatStorageStatus({
  status,
  onRetry,
  onSaveCopy,
  onExport,
  deletionFailed,
  pendingDeletionCount,
  isRetryingDeletion,
  onRetryDeletion,
}: {
  status: ChatSaveStatus;
  onRetry: () => void;
  onSaveCopy: () => void;
  onExport: () => void;
  deletionFailed: boolean;
  pendingDeletionCount: number;
  isRetryingDeletion: boolean;
  onRetryDeletion: () => void;
}) {
  if (status === "idle" && !deletionFailed && pendingDeletionCount === 0)
    return null;
  const labels: Record<Exclude<ChatSaveStatus, "idle">, string> = {
    local: "Saved on this device",
    saving: "Saving to your account…",
    synced: "Saved to your account",
    conflict:
      "Another saved version exists. Export this conversation or save a separate copy.",
    unavailable: "Account saving is unavailable. Export a backup.",
    failed: "Account save failed. Your conversation is still open.",
    volatile:
      "This browser could not save your conversation. Export a backup before leaving.",
  };
  const needsRecovery = [
    "conflict",
    "unavailable",
    "failed",
    "volatile",
  ].includes(status);
  const actionClass =
    "min-h-11 rounded-lg px-3 text-sm text-[var(--arc-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]";
  return (
    <div
      data-chat-storage-status
      className="flex shrink-0 flex-wrap items-center gap-x-3 px-4 text-sm text-[var(--arc-text-secondary)]"
    >
      {status !== "idle" && (
        <span role="status" aria-live="polite">
          {labels[status]}
        </span>
      )}
      {deletionFailed && (
        <span role="alert">Couldn’t remove a conversation. Try again.</span>
      )}
      {pendingDeletionCount > 0 && (
        <span role="status" aria-live="polite">
          {pendingDeletionCount === 1
            ? "1 conversation removal is waiting to sync."
            : `${pendingDeletionCount} conversation removals are waiting to sync.`}
        </span>
      )}
      {(deletionFailed || pendingDeletionCount > 0) && (
        <button
          className={actionClass}
          onClick={onRetryDeletion}
          disabled={isRetryingDeletion}
          aria-busy={isRetryingDeletion}
        >
          {isRetryingDeletion
            ? "Retrying removals…"
            : deletionFailed
              ? "Retry removal"
              : "Retry removal sync"}
        </button>
      )}
      {(status === "failed" || status === "volatile") && (
        <button className={actionClass} onClick={onRetry}>
          Retry account save
        </button>
      )}
      {status === "conflict" && (
        <button className={actionClass} onClick={onSaveCopy}>
          Save a separate copy
        </button>
      )}
      {needsRecovery && (
        <button className={actionClass} onClick={onExport}>
          Export conversation
        </button>
      )}
    </div>
  );
}
