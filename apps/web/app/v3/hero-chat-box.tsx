"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import navLogo from "@/assets/brand/arcanea-mark.jpg";
import { useAuth } from "@/lib/auth/context";
import {
  ENTRY_DRAFT_MAX_CHARS,
  isCompositionKey,
  stageEntryDraft,
} from "@/lib/chat/entry-draft";
import styles from "@arcanea/design-system/entry-handoff.module.css";
import {
  PhPaperPlane,
  PhPencil,
  PhMusicNote,
  PhCode,
  PhPaintBrush,
} from "@/lib/phosphor-icons";

const STARTER_CARDS = [
  {
    icon: PhPencil,
    label: "Map a world",
    prompt:
      "Create a world bible for a near-future mythic city: premise, factions, rules of magic, three conflicts, and the first scene.",
    href: "/worlds/create",
  },
  {
    icon: PhMusicNote,
    label: "Write a scene",
    prompt:
      "Write an opening scene for a creator-owned fantasy series with a strong hook, sensory detail, and a clear character choice.",
  },
  {
    icon: PhPaintBrush,
    label: "Design visuals",
    prompt:
      "Create a visual direction for a new world: palette, locations, character silhouettes, mood-board prompts, and a hero image brief.",
  },
  {
    icon: PhCode,
    label: "Plan agents",
    prompt:
      "Plan an agent workflow for a world creator: research, story editing, art direction, release planning, and weekly publishing tasks.",
  },
];

export function HeroChatBox() {
  const { user, isLoading } = useAuth();
  const owner = user?.id ?? null;
  return (
    <HeroDraft key={owner ?? "guest"} owner={owner} isLoading={isLoading} />
  );
}

function HeroDraft({
  owner,
  isLoading,
}: {
  owner: string | null;
  isLoading: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composing = useRef(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const goToChat = (text: string) => {
    if (isLoading || composing.current || !text.trim()) return;
    try {
      const id = crypto.randomUUID();
      if (!stageEntryDraft(window.sessionStorage, text, owner, id))
        throw new Error("storage");
      router.push(`/chat?draft=${id}`);
    } catch {
      setError(
        "Your browser could not carry this draft into chat. Your text is still here. Select it, open chat, and paste it there.",
      );
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isCompositionKey(event.nativeEvent, composing.current)) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      goToChat(message);
    }
  };

  return (
    <section
      className={styles.entry}
      aria-label="Start creating"
      data-testid="home-chat-entry"
    >
      <div className={styles.composer}>
        <Image
          src={navLogo}
          alt=""
          width={28}
          height={28}
          sizes="28px"
          className={styles.mark}
        />
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => {
            composing.current = true;
          }}
          onCompositionEnd={() => {
            composing.current = false;
          }}
          placeholder="Describe the world, story, or creator system you want to build…"
          aria-label="Describe what you want to create"
          aria-describedby="home-chat-hint"
          maxLength={ENTRY_DRAFT_MAX_CHARS}
          disabled={isLoading}
          rows={2}
          className={styles.input}
        />
        <button
          type="button"
          onClick={() => goToChat(message)}
          disabled={!message.trim() || isLoading}
          className={styles.open}
          aria-label="Open draft in chat"
        >
          <PhPaperPlane aria-hidden="true" />
        </button>
      </div>
      <p id="home-chat-hint" className={styles.hint}>
        Review your draft in chat before sending. Shift + Enter adds a line.
      </p>
      {error && (
        <div className={styles.notice} role="alert">
          <p>{error}</p>
          <div className={styles.recovery}>
            <button
              type="button"
              onClick={() => {
                textareaRef.current?.focus();
                textareaRef.current?.select();
              }}
            >
              Select draft
            </button>
            <a href="/chat" target="_blank" rel="noopener noreferrer">
              Open chat in a new tab
            </a>
          </div>
        </div>
      )}
      <div className={styles.starters}>
        {STARTER_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              type="button"
              disabled={isLoading}
              onClick={() => {
                if ("href" in card && card.href)
                  router.push(
                    `${card.href}?prompt=${encodeURIComponent(card.prompt)}`,
                  );
                else goToChat(card.prompt);
              }}
            >
              <Icon aria-hidden="true" />
              {card.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
