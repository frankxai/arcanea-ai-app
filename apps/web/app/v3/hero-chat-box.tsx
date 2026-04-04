"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    label: "Write a story",
    prompt: "Write a short story about a young mage discovering their first Gate",
  },
  {
    icon: PhMusicNote,
    label: "Compose music",
    prompt: "Compose a cinematic orchestral piece for a fantasy battle scene",
  },
  {
    icon: PhPaintBrush,
    label: "Design a world",
    prompt: "Design a floating island civilization with crystal-based technology",
    href: "/worlds/create",
  },
  {
    icon: PhCode,
    label: "Build with code",
    prompt: "Build a React component that displays a character card with stats and abilities",
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
            ? "shadow-[0_0_0_1px_rgba(0,188,212,0.3),0_8px_40px_rgba(0,0,0,0.4),0_0_80px_rgba(0,188,212,0.08)]"
            : "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_24px_rgba(0,0,0,0.4)]"
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
              ? 'linear-gradient(135deg, rgba(0,188,212,0.35), rgba(13,71,161,0.2), rgba(0,137,123,0.35))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03), rgba(255,255,255,0.06))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
          }}
        />

        <div className="relative flex items-end">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="What do you want to create?"
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
                  ? "bg-gradient-to-br from-[#00bcd4] via-[#0097a7] to-[#00897b] shadow-[0_2px_16px_rgba(0,188,212,0.35)] hover:shadow-[0_4px_24px_rgba(0,188,212,0.5)] hover:scale-105 active:scale-95"
                  : "bg-white/[0.04] cursor-default"
              }`}
              aria-label="Start creating"
            >
              <PhPaperPlane
                className={`w-4 h-4 transition-colors ${hasText ? "text-white" : "text-white/15"}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      {hasText && (
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-2 text-[10px] text-white/15"
        >
          Press <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-white/25 font-mono text-[9px]">Enter</kbd> to start
        </m.p>
      )}

      {/* Starter cards — 4 creation modes */}
      <m.div
        className="mt-5 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {STARTER_CARDS.map((card) => {
          const Icon = card.icon;
          const handleClick = () => {
            if ("href" in card && card.href) {
              const sep = card.href.includes('?') ? '&' : '?';
              router.push(`${card.href}${sep}prompt=${encodeURIComponent(card.prompt)}`);
            } else {
              goToChat(card.prompt);
            }
          };
          return (
            <button
              key={card.label}
              onClick={handleClick}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] text-white/30 hover:text-white/65 bg-white/[0.02] hover:bg-gradient-to-r hover:from-[#00bcd4]/[0.06] hover:to-transparent border border-white/[0.04] hover:border-[#00bcd4]/20 hover:shadow-[0_0_16px_rgba(0,188,212,0.06)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300"
            >
              <Icon className="w-3.5 h-3.5 text-white/20 group-hover:text-[#00bcd4]/70 transition-colors" />
              {card.label}
            </button>
          );
        })}
      </m.div>
    </div>
  );
}
