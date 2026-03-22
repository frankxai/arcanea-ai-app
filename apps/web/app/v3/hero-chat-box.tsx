"use client";

import React, { useState, useRef, useEffect } from "react";
import { m } from "framer-motion";
import { useRouter } from "next/navigation";
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
    prompt: "Help me create a fantasy world with unique magic systems and cultures",
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
  const router = useRouter();
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
            ? "shadow-[0_0_0_1px_rgba(0,188,212,0.25),0_8px_40px_rgba(0,0,0,0.4),0_0_60px_rgba(0,188,212,0.06)]"
            : "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_24px_rgba(0,0,0,0.4)]"
        }`}
      >
        {/* Glass fill */}
        <div className="absolute inset-0 rounded-2xl bg-white/[0.025] backdrop-blur-2xl" />

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
              className={`p-2 rounded-lg transition-all duration-200 ${
                hasText
                  ? "bg-[#00bcd4] shadow-[0_2px_12px_rgba(0,188,212,0.3)] hover:shadow-[0_4px_20px_rgba(0,188,212,0.4)] hover:scale-105 active:scale-95"
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
          return (
            <button
              key={card.label}
              onClick={() => goToChat(card.prompt)}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] text-white/30 hover:text-white/60 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-white/[0.10] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
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
