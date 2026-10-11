"use client";

import Link from "next/link";
import Image from "next/image";
import { PhWarningCircle, PhX } from "@/lib/phosphor-icons";
import { getErrorMessage } from "@/lib/chat/error-message";
import { getMessageText } from "@/hooks/use-conversation";
import type { useConversation } from "@/hooks/use-conversation";
import type { useWorldCharacterInit } from "@/hooks/use-world-character-init";
import type { useChatWorldMode } from "@/hooks/use-chat-world-mode";

type ChatNoticesProps = {
  conversation: Pick<
    ReturnType<typeof useConversation>,
    "chatError" | "handleRetry" | "setChatError" | "messages"
  >;
  worldCharInit: ReturnType<typeof useWorldCharacterInit>;
  worldMode: ReturnType<typeof useChatWorldMode>;
  handleNewChat: () => void;
  onEndCharacterChat: () => void;
};

export function ChatNotices({
  conversation,
  worldCharInit,
  worldMode,
  handleNewChat,
  onEndCharacterChat,
}: ChatNoticesProps) {
  return (
    <>
      {/* Error banner */}
      {conversation.chatError &&
        (() => {
          const errInfo = getErrorMessage(conversation.chatError);
          return (
            <div
              className="mx-4 mt-2 animate-slide-in-from-top shrink-0"
              role="alert"
            >
              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <PhWarningCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-red-300 font-medium">
                      {errInfo.title}
                    </p>
                    <p className="text-xs text-red-400/60 mt-1">
                      {errInfo.action}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={conversation.handleRetry}
                        className="px-3 py-1.5 text-xs rounded-lg bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)] border border-[var(--arc-brand-atlantean-teal)]/20 hover:bg-[var(--arc-brand-atlantean-teal)]/15 transition-colors"
                      >
                        Retry
                      </button>
                      <Link
                        href="/settings/providers"
                        className="px-3 py-1.5 text-xs rounded-lg text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleNewChat();
                          conversation.setChatError(null);
                        }}
                        className="ml-auto p-1 text-white/20 hover:text-white/40 transition-colors"
                        aria-label="Dismiss error"
                      >
                        <PhX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* World character banner */}
      {worldCharInit.isLoading && (
        <div className="mx-4 mt-2 shrink-0">
          <div className="bg-[var(--arc-brand-atlantean-teal)]/5 border border-[var(--arc-brand-atlantean-teal)]/10 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-[var(--arc-brand-atlantean-teal)]/40 border-t-[var(--arc-brand-atlantean-teal)] rounded-full animate-spin" />
            <span className="text-sm text-[var(--arc-text-primary)]">
              Loading character...
            </span>
          </div>
        </div>
      )}
      {worldCharInit.worldCharacter && (
        <div className="mx-4 mt-2 shrink-0">
          <div className="bg-[var(--arc-brand-atlantean-teal)]/5 border border-[var(--arc-brand-atlantean-teal)]/10 rounded-xl px-4 py-3 flex items-center gap-3">
            {worldCharInit.worldCharacter.characterPortrait && (
              <Image
                src={worldCharInit.worldCharacter.characterPortrait}
                alt={worldCharInit.worldCharacter.characterName}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[var(--arc-brand-atlantean-teal)]/30"
                unoptimized
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--arc-text-primary)] font-medium truncate">
                Chatting with {worldCharInit.worldCharacter.characterName}
              </p>
              <p className="text-[11px] text-white/30">
                from {worldCharInit.worldCharacter.worldName}
              </p>
            </div>
            <button
              onClick={() => {
                onEndCharacterChat();
              }}
              className="p-1.5 rounded-lg text-white/25 hover:text-white/50 hover:bg-white/[0.04] transition-colors"
              aria-label="End character chat"
              title="End character chat"
            >
              <PhX className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
      {worldCharInit.error && (
        <div className="mx-4 mt-2 shrink-0">
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
            <p className="text-sm text-red-300">
              Failed to load character: {worldCharInit.error}
            </p>
          </div>
        </div>
      )}

      {/* Conversation handoff into the editable world creator. */}
      {worldMode.isWorldMode &&
        worldMode.canCreateWorld &&
        !worldMode.draft && (
          <div className="mx-4 mt-2 shrink-0">
            <div className="bg-[var(--arc-cosmic-surface)] border border-[var(--arc-cosmic-border)] rounded-xl px-4 py-3 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--arc-text-primary)] font-medium">
                  Your world is taking shape.
                </p>
                <p className="text-sm text-[var(--arc-text-secondary)]">
                  Prepare an editable draft from this conversation using your
                  Gemini key and Google quota. Saving stays a separate action.
                </p>
                {worldMode.source && conversation.messages.length === 0 && (
                  <p className="mt-1 text-sm text-[var(--arc-text-secondary)]">
                    Your previous source conversation was recovered in this tab.
                    Download it before preparing another draft from that
                    context.
                  </p>
                )}
              </div>
              <button
                disabled={worldMode.isCreating || worldMode.uncertain}
                onClick={() => {
                  worldMode.createWorld(
                    conversation.messages.map((m) => ({
                      role: m.role,
                      content: getMessageText(m),
                    })),
                  );
                }}
                className="inline-flex min-h-11 items-center justify-center px-4 py-2 rounded-lg text-sm font-medium border border-[var(--arc-brand-atlantean-teal)] text-[var(--arc-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {worldMode.isCreating ? (
                  <>Preparing draft…</>
                ) : (
                  "Prepare world draft"
                )}
              </button>
              {worldMode.isCreating && (
                <button
                  onClick={worldMode.cancelGeneration}
                  className="min-h-11 rounded-lg px-4 py-2 text-sm text-[var(--arc-text-primary)] focus-visible:outline focus-visible:outline-2"
                >
                  Stop generation
                </button>
              )}
            </div>
          </div>
        )}
      {worldMode.createError && (
        <div className="mx-4 mt-2 shrink-0">
          <div
            role="alert"
            className="border border-[var(--arc-cosmic-border)] rounded-xl px-4 py-3 text-[var(--arc-text-primary)]"
          >
            <p className="text-sm">{worldMode.createError}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                href="/settings/providers"
                className="inline-flex min-h-11 items-center px-3 text-sm underline focus-visible:outline focus-visible:outline-2"
              >
                Provider settings
              </Link>
              <Link
                href="/worlds/create?resume=1"
                className="inline-flex min-h-11 items-center px-3 text-sm underline focus-visible:outline focus-visible:outline-2"
              >
                Open existing world draft
              </Link>
              {worldMode.uncertain && (
                <button
                  onClick={worldMode.allowAnotherAttempt}
                  className="min-h-11 rounded-lg border border-[var(--arc-cosmic-border)] px-3 text-sm focus-visible:outline focus-visible:outline-2"
                >
                  Allow another attempt
                </button>
              )}
              {worldMode.source && !worldMode.draft && (
                <button
                  onClick={worldMode.exportDraft}
                  className="min-h-11 rounded-lg border border-[var(--arc-cosmic-border)] px-3 text-sm focus-visible:outline focus-visible:outline-2"
                >
                  Download source conversation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {worldMode.draft && (
        <section
          aria-label="Prepared world draft"
          className="mx-4 mt-2 shrink-0 rounded-xl border border-[var(--arc-cosmic-border)] bg-[var(--arc-cosmic-surface)] px-4 py-3"
        >
          <p
            role="status"
            className="text-sm font-medium text-[var(--arc-text-primary)]"
          >
            {worldMode.draft.world.name} · Unsaved draft
          </p>
          <p className="mt-1 text-sm text-[var(--arc-text-secondary)]">
            Inspect and edit the world, then save privately. Download includes
            the complete draft and source conversation.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={worldMode.openDraft}
              className="min-h-11 rounded-lg border border-[var(--arc-brand-atlantean-teal)] px-4 py-2 text-sm text-[var(--arc-text-primary)] focus-visible:outline focus-visible:outline-2"
            >
              Edit world draft
            </button>
            <button
              onClick={worldMode.exportDraft}
              className="min-h-11 rounded-lg border border-[var(--arc-cosmic-border)] px-4 py-2 text-sm text-[var(--arc-text-primary)] focus-visible:outline focus-visible:outline-2"
            >
              Download world draft
            </button>
            {!worldMode.transferred && (
              <button
                onClick={worldMode.retryTransfer}
                className="min-h-11 rounded-lg border border-[var(--arc-cosmic-border)] px-4 py-2 text-sm text-[var(--arc-text-primary)] focus-visible:outline focus-visible:outline-2"
              >
                Retry transfer
              </button>
            )}
            <button
              onClick={() => {
                if (worldMode.startAnotherDraft()) handleNewChat();
              }}
              className="min-h-11 rounded-lg border border-[var(--arc-cosmic-border)] px-4 py-2 text-sm text-[var(--arc-text-primary)] focus-visible:outline focus-visible:outline-2"
            >
              Start another world draft
            </button>
          </div>
        </section>
      )}
    </>
  );
}
