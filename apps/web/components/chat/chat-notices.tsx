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

      {/* World Builder: "Create this world" CTA */}
      {worldMode.isWorldMode &&
        worldMode.canCreateWorld &&
        !worldMode.createdSlug && (
          <div className="mx-4 mt-2 shrink-0">
            <div className="bg-[var(--arc-void)]/5 border border-[var(--arc-void)]/15 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--arc-text-primary)] font-medium">
                  Your world is taking shape.
                </p>
                <p className="text-[11px] text-white/30">
                  Generate a world from this conversation.
                </p>
              </div>
              <button
                disabled={worldMode.isCreating}
                onClick={() => {
                  worldMode.createWorld(
                    conversation.messages.map((m) => ({
                      role: m.role,
                      content: getMessageText(m),
                    })),
                  );
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[var(--arc-void)]/15 border border-[var(--arc-void)]/30 text-[var(--arc-text-primary)] hover:bg-[var(--arc-void)]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {worldMode.isCreating ? (
                  <>
                    <span className="w-3 h-3 border-2 border-[var(--arc-text-primary)]/30 border-t-[var(--arc-text-primary)] rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create this world"
                )}
              </button>
            </div>
          </div>
        )}
      {worldMode.createError && (
        <div className="mx-4 mt-2 shrink-0">
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
            <p className="text-sm text-red-300">{worldMode.createError}</p>
          </div>
        </div>
      )}
      {worldMode.createdSlug && (
        <div className="mx-4 mt-2 shrink-0">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3 flex items-center gap-3">
            <p className="text-sm text-emerald-300 flex-1">World created!</p>
            <Link
              href={`/worlds/${worldMode.createdSlug}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition-all"
            >
              View it &rarr;
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
