/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import navLogo from "@/assets/brand/arcanea-mark.jpg";
import { track } from "@vercel/analytics";
import {
  PhPaperPlane,
  PhPencil,
  PhFeather,
  PhCode,
  PhPaintBrush,
} from "@/lib/phosphor-icons";

// ---------------------------------------------------------------------------
// Starter cards — the 4 creation modes
// ---------------------------------------------------------------------------

const STARTER_CARDS = [
  {
    icon: PhPencil,
    label: "Map a world",
    prompt:
      "Create a world bible for a near-future mythic city: premise, factions, rules of magic, three conflicts, and the first scene.",
    href: "/worlds/create",
  },
  {
    icon: PhFeather,
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

// ---------------------------------------------------------------------------
// Component — Direct-to-chat, no preview intermediary
// ---------------------------------------------------------------------------

export function HeroChatBox() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const goToChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    // Next.js router for instant SPA navigation (no full page reload)
    router.push(`/chat?prompt=${encodeURIComponent(trimmed)}`);
  };

  // Typed prompts only. The event carries no properties: the prompt text is
  // the creator's and never leaves the page as analytics.
  const submit = () => {
    if (!message.trim()) return;
    track("home_hero_submit");
    goToChat(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const hasText = message.trim().length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input container */}
      <div
        className={`relative rounded-2xl transition-shadow duration-300 ${
          isFocused
            ? "shadow-[0_0_0_1px_color-mix(in_srgb,var(--arc-brand-atlantean-teal)_30%,transparent),0_8px_40px_color-mix(in_srgb,var(--arc-cosmic-void)_72%,transparent),0_0_80px_color-mix(in_srgb,var(--arc-brand-atlantean-teal)_8%,transparent)]"
            : "shadow-[0_0_0_1px_color-mix(in_srgb,var(--arc-text-primary)_6%,transparent),0_4px_24px_color-mix(in_srgb,var(--arc-cosmic-void)_72%,transparent)]"
        }`}
      >
        {/* Glass fill with gradient */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.035] via-white/[0.02] to-white/[0.025] backdrop-blur-2xl" />
        {/* Gradient border overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            padding: "1px",
            background: isFocused
              ? "linear-gradient(135deg, color-mix(in srgb, var(--arc-brand-atlantean-teal) 35%, transparent), color-mix(in srgb, var(--arc-brand-cosmic-blue) 20%, transparent), color-mix(in srgb, var(--arc-brand-atlantean-teal) 28%, transparent))"
              : "linear-gradient(135deg, color-mix(in srgb, var(--arc-text-primary) 8%, transparent), color-mix(in srgb, var(--arc-text-primary) 3%, transparent), color-mix(in srgb, var(--arc-text-primary) 6%, transparent))",
            mask: "linear-gradient(var(--arc-text-primary) 0 0) content-box, linear-gradient(var(--arc-text-primary) 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
          }}
        />

        <div className="relative flex items-end">
          <div className="hidden sm:flex pl-3 pr-1 pb-3" aria-hidden="true">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.035]">
              <Image
                src={navLogo}
                alt=""
                width={28}
                height={28}
                sizes="28px"
                className="rounded-md object-cover"
              />
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe the world, story, or creator system you want to build…"
            aria-label="Describe what you want to create"
            name="prompt"
            autoComplete="off"
            rows={1}
            className="flex-1 px-5 py-4 bg-transparent text-white/90 placeholder-white/50 resize-none focus:outline-none font-body text-[15px] leading-relaxed"
            style={{ minHeight: "56px", maxHeight: "120px" }}
          />

          {/* Send */}
          <div className="p-2.5 pr-3">
            <button
              type="button"
              onClick={submit}
              disabled={!hasText}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl transition-[box-shadow,transform,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--arc-cosmic-void)] ${
                hasText
                  ? "bg-[var(--arc-brand-atlantean-teal)] shadow-[0_2px_16px_color-mix(in_srgb,var(--arc-brand-atlantean-teal)_35%,transparent)] hover:shadow-[0_4px_24px_color-mix(in_srgb,var(--arc-brand-atlantean-teal)_50%,transparent)] active:scale-95"
                  : "bg-white/[0.04] cursor-default"
              }`}
              aria-label={
                hasText
                  ? "Start creating in chat"
                  : "Enter a prompt to start creating"
              }
            >
              <PhPaperPlane
                aria-hidden="true"
                weight={hasText ? "bold" : "regular"}
                className={`w-[18px] h-[18px] transition-colors ${hasText ? "text-[var(--arc-cosmic-void)]" : "text-white/45"}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Starter cards — 4 creation modes */}
      <div className="mt-5 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2">
        {STARTER_CARDS.map((card) => {
          const Icon = card.icon;
          const handleClick = () => {
            track("home_hero_chip", { chip: card.label });
            if ("href" in card && card.href) {
              const sep = card.href.includes("?") ? "&" : "?";
              router.push(
                `${card.href}${sep}prompt=${encodeURIComponent(card.prompt)}`,
              );
            } else {
              goToChat(card.prompt);
            }
          };
          return (
            <button
              key={card.label}
              type="button"
              onClick={handleClick}
              className="group flex min-h-[44px] items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-[12px] sm:text-[13px] text-white/70 hover:text-white/90 bg-white/[0.04] hover:bg-gradient-to-r hover:from-[var(--arc-brand-atlantean-teal)]/[0.06] hover:to-transparent border border-white/[0.08] hover:border-[var(--arc-brand-atlantean-teal)]/20 hover:shadow-[0_0_16px_color-mix(in_srgb,var(--arc-brand-atlantean-teal)_6%,transparent)] active:scale-[0.98] transition-[color,background-color,border-color,box-shadow,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
              aria-label={`${card.label}: ${card.prompt}`}
            >
              <Icon
                aria-hidden="true"
                className="w-3.5 h-3.5 text-white/55 group-hover:text-[var(--arc-brand-atlantean-teal)] transition-colors"
              />
              {card.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
