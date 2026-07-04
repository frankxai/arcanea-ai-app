/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { m } from "framer-motion";
import {
  PhPaperPlane,
  PhPencil,
  PhMusicNote,
  PhCode,
  PhPaintBrush,
} from "@/lib/phosphor-icons";

// ---------------------------------------------------------------------------
// Starter cards — the 4 creation modes
// ---------------------------------------------------------------------------

const STARTER_CARDS = [
  {
    icon: PhPencil,
    label: "Answer the call",
    prompt: "Help me name the part of The Drift I want to answer, then create one Gift Object with power, cost, right use, and a proof-sized first trial.",
    href: "/genesis",
  },
  {
    icon: PhMusicNote,
    label: "Create proof",
    prompt: "Turn my concern about misinformation, isolation, ecology, or creator rights into one useful artifact I can publish this week.",
  },
  {
    icon: PhPaintBrush,
    label: "Design a mission",
    prompt: "Create a visual and product direction for a mission pack that helps creators fight The Drift without fear, shame, or dark patterns.",
  },
  {
    icon: PhCode,
    label: "Plan agents",
    prompt: "Plan an accountable agent workflow: source scout, world builder, right-use reviewer, editor, publisher, and SIS proof ledger.",
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      goToChat(message);
    }
  };

  const hasText = message.trim().length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input container */}
      <div
        className={`relative rounded-2xl transition-all duration-300 ${
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
            padding: '1px',
            background: isFocused
              ? 'linear-gradient(135deg, color-mix(in srgb, var(--arc-brand-atlantean-teal) 35%, transparent), color-mix(in srgb, var(--arc-brand-cosmic-blue) 20%, transparent), color-mix(in srgb, var(--arc-brand-atlantean-teal) 28%, transparent))'
              : 'linear-gradient(135deg, color-mix(in srgb, var(--arc-text-primary) 8%, transparent), color-mix(in srgb, var(--arc-text-primary) 3%, transparent), color-mix(in srgb, var(--arc-text-primary) 6%, transparent))',
            mask: 'linear-gradient(var(--arc-text-primary) 0 0) content-box, linear-gradient(var(--arc-text-primary) 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
          }}
        />

        <div className="relative flex items-end">
          <div className="hidden sm:flex pl-3 pr-1 pb-3" aria-hidden="true">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.035]">
              <Image
                src="/images/mascot/arcanea-welcoming.png"
                alt=""
                width={28}
                height={28}
                sizes="28px"
                className="object-contain"
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
            placeholder="Name the crisis, world, or creator mission you want to answer..."
            aria-label="Describe what you want to create"
            rows={1}
            className="flex-1 px-5 py-4 bg-transparent text-white/90 placeholder-white/20 resize-none focus:outline-none font-body text-[15px] leading-relaxed"
            style={{ minHeight: "56px", maxHeight: "120px" }}
          />

          {/* Send */}
          <div className="p-2.5 pr-3">
            <button
              onClick={() => goToChat(message)}
              disabled={!hasText}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                hasText
                  ? "bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] shadow-[0_2px_16px_color-mix(in_srgb,var(--arc-brand-atlantean-teal)_35%,transparent)] hover:shadow-[0_4px_24px_color-mix(in_srgb,var(--arc-brand-atlantean-teal)_50%,transparent)] hover:scale-105 active:scale-95"
                  : "bg-white/[0.04] cursor-default"
              }`}
              aria-label={hasText ? "Start creating in chat" : "Enter a prompt to start creating"}
            >
              <PhPaperPlane
                className={`w-4 h-4 transition-colors ${hasText ? "text-white" : "text-white/15"}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Starter cards — 4 creation modes */}
      <m.div
        className="mt-5 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {STARTER_CARDS.map((card) => {
          const Icon = card.icon;
          const className =
            "group flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-[12px] sm:text-[13px] text-white/35 hover:text-white/70 bg-white/[0.025] hover:bg-gradient-to-r hover:from-[var(--arc-brand-atlantean-teal)]/[0.06] hover:to-transparent border border-white/[0.05] hover:border-[var(--arc-brand-atlantean-teal)]/20 hover:shadow-[0_0_16px_color-mix(in_srgb,var(--arc-brand-atlantean-teal)_6%,transparent)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300";
          if ("href" in card && card.href) {
            const sep = card.href.includes('?') ? '&' : '?';
            const href = `${card.href}${sep}prompt=${encodeURIComponent(card.prompt)}`;

            return (
              <Link
                key={card.label}
                href={href}
                className={className}
                aria-label={`${card.label}: ${card.prompt}`}
              >
                <Icon className="w-3.5 h-3.5 text-white/20 group-hover:text-[var(--arc-brand-atlantean-teal)]/70 transition-colors" />
                {card.label}
              </Link>
            );
          }

          const handleClick = () => {
            goToChat(card.prompt);
          };

          return (
            <button
              key={card.label}
              onClick={handleClick}
              className={className}
              aria-label={`${card.label}: ${card.prompt}`}
            >
              <Icon className="w-3.5 h-3.5 text-white/20 group-hover:text-[var(--arc-brand-atlantean-teal)]/70 transition-colors" />
              {card.label}
            </button>
          );
        })}
      </m.div>
    </div>
  );
}
