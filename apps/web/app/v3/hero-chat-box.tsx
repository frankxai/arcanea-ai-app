"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  PhPaperPlane,
  PhSparkle,
  PhBookOpen,
  PhLightning,
  PhCompass,
  PhCircleNotch,
  PhArrowRight,
} from "@/lib/phosphor-icons";

// ---------------------------------------------------------------------------
// Suggested prompts — world-building & creation focused
// ---------------------------------------------------------------------------

interface SuggestedPrompt {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  prompt: string;
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    icon: PhSparkle,
    label: "Build a world",
    prompt:
      "Help me create a fantasy world with unique magic systems and cultures",
  },
  {
    icon: PhBookOpen,
    label: "Write a story",
    prompt:
      "I want to write an epic story with compelling characters and plot twists",
  },
  {
    icon: PhLightning,
    label: "Design a character",
    prompt:
      "Help me design a complex character with deep motivations and a compelling arc",
  },
  {
    icon: PhCompass,
    label: "Explore lore",
    prompt:
      "Tell me about the Arcanea universe — the Guardians, the Gates, and the Elements",
  },
];

// ---------------------------------------------------------------------------
// Inline streaming response
// ---------------------------------------------------------------------------

interface StreamState {
  isStreaming: boolean;
  content: string;
  isComplete: boolean;
}

// ---------------------------------------------------------------------------
// HeroChatBox
// ---------------------------------------------------------------------------

export function HeroChatBox() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [stream, setStream] = useState<StreamState>({
    isStreaming: false,
    content: "",
    isComplete: false,
  });
  const abortRef = useRef<AbortController | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Stream a single response inline on the hero
  const handleSubmit = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || stream.isStreaming) return;

      setStream({ isStreaming: true, content: "", isComplete: false });

      try {
        abortRef.current = new AbortController();

        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: trimmed }],
            systemPrompt:
              "You are Arcanea, a creative world-building intelligence. Give a short, inspiring response (2-3 sentences max) that sparks imagination. Be warm and inviting.",
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          // Fallback — redirect to chat
          router.push(`/chat/chronica?prompt=${encodeURIComponent(trimmed)}`);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          router.push(`/chat/chronica?prompt=${encodeURIComponent(trimmed)}`);
          return;
        }

        const decoder = new TextDecoder();
        let full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
          setStream({ isStreaming: true, content: full, isComplete: false });
        }

        setStream({ isStreaming: false, content: full, isComplete: true });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        // On error, redirect to chat with the prompt
        router.push(`/chat/chronica?prompt=${encodeURIComponent(trimmed)}`);
      }
    },
    [stream.isStreaming, router],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(message);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
    handleSubmit(prompt);
  };

  const handleContinue = () => {
    // Don't pass ?prompt= since the user already got an inline response.
    // The chat page would duplicate-send it. Just navigate to start fresh.
    router.push("/chat/chronica");
  };

  const handleReset = () => {
    if (abortRef.current) abortRef.current.abort();
    setStream({ isStreaming: false, content: "", isComplete: false });
    setMessage("");
    textareaRef.current?.focus();
  };

  const showInput = !stream.isStreaming && !stream.isComplete;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {showInput ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {/* Chat input card */}
            <div
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                isFocused
                  ? "ring-1 ring-[#00bcd4]/40 shadow-[0_0_40px_rgba(0,188,212,0.12)]"
                  : "ring-1 ring-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
              }`}
            >
              {/* Glass background */}
              <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl" />

              {/* Subtle gradient border glow */}
              <div
                className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${
                  isFocused ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,188,212,0.06) 0%, rgba(13,71,161,0.04) 50%, rgba(0,137,123,0.03) 100%)",
                }}
              />

              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="What world will you create today?"
                  rows={1}
                  className="w-full px-5 py-4 pr-14 bg-transparent text-white/90 placeholder-white/25 resize-none focus:outline-none font-body text-base leading-relaxed"
                  style={{ minHeight: "56px", maxHeight: "120px" }}
                />

                {/* Send button */}
                <button
                  onClick={() => handleSubmit(message)}
                  disabled={!message.trim()}
                  className="absolute right-3 bottom-3 p-2.5 rounded-xl transition-all duration-200 disabled:opacity-20 disabled:cursor-default"
                  style={{
                    backgroundColor: message.trim()
                      ? "#00bcd4"
                      : "transparent",
                    boxShadow: message.trim()
                      ? "0 0 20px rgba(0,188,212,0.3)"
                      : "none",
                  }}
                  aria-label="Send message"
                >
                  <PhPaperPlane
                    className={`w-4 h-4 ${message.trim() ? "text-white" : "text-white/20"}`}
                  />
                </button>
              </div>
            </div>

            {/* Suggested prompts */}
            <motion.div
              className="mt-4 flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {SUGGESTED_PROMPTS.map((sp) => {
                const Icon = sp.icon;
                return (
                  <button
                    key={sp.label}
                    onClick={() => handlePromptClick(sp.prompt)}
                    className="group flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-white/40 hover:text-white/70 border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-200"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#00bcd4]/50 group-hover:text-[#00bcd4]/80 transition-colors" />
                    {sp.label}
                  </button>
                );
              })}
            </motion.div>

            {/* Keyboard hint */}
            <motion.p
              className="mt-3 text-center text-[10px] text-white/15 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Press Enter to send
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="response"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md bg-[#00bcd4]/15 border border-[#00bcd4]/20 text-white/80 text-sm font-body leading-relaxed">
                {message}
              </div>
            </div>

            {/* AI response */}
            <div className="flex justify-start">
              <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.04] border border-white/[0.06] text-white/70 text-sm font-body leading-relaxed">
                {stream.content || (
                  <span className="flex items-center gap-2 text-white/30">
                    <PhCircleNotch className="w-4 h-4 animate-spin" />
                    Thinking...
                  </span>
                )}
                {stream.isStreaming && (
                  <motion.span
                    className="inline-block w-0.5 h-4 bg-[#00bcd4] ml-0.5 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </div>
            </div>

            {/* Action buttons */}
            {stream.isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex items-center justify-center gap-3 pt-2"
              >
                <button
                  onClick={handleContinue}
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white overflow-hidden relative transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,188,212,0.25)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00897b] via-[#1565c0] to-[#00bcd4]" />
                  <span className="relative z-10 flex items-center gap-2">
                    Continue creating
                    <PhArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-3 rounded-xl border border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04] text-white/50 hover:text-white/70 text-sm font-medium transition-all duration-200"
                >
                  New prompt
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
