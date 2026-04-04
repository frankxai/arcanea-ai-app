"use client";

import React, { useState, useRef, useEffect } from "react";
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
    prompt: "I want to write an epic story with compelling characters and plot twists",
  },
  {
    icon: PhMusicNote,
    label: "Compose music",
    prompt: "Help me compose an original piece of music that feels cinematic and emotional",
  },
  {
    icon: PhPaintBrush,
    label: "Design a world",
    prompt: "Help me design a new world — I want to define its elements, magic system, factions, and founding mythology",
    href: "/worlds/create",
  },
  {
    icon: PhCode,
    label: "Build with code",
    prompt: "Help me build a web application with a modern tech stack",
  },
];

// ---------------------------------------------------------------------------
// Component — Direct-to-chat, no preview intermediary
// ---------------------------------------------------------------------------

export function HeroChatBox() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const goToChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    // Use plain navigation instead of useRouter to avoid pulling the
    // Next.js client router into the initial homepage bundle.
    window.location.href = `/chat?prompt=${encodeURIComponent(trimmed)}`;
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
            className="flex-1 px-5 py-4 bg-transparent text-white/90 placeholder-white/20 resize-none focus:outline-none focus:ring-1 focus:ring-[#00bcd4]/20 font-body text-[15px] leading-relaxed"
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
              window.location.href = `${card.href}${sep}prompt=${encodeURIComponent(card.prompt)}`;
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
