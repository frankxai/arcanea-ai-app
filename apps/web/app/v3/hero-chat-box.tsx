"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
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
// Suggested prompts
// ---------------------------------------------------------------------------

const SUGGESTED_PROMPTS = [
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
    label: "Map a quest",
    prompt:
      "Help me design an adventure with meaningful choices and surprising twists",
  },
];

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface StreamState {
  isStreaming: boolean;
  content: string;
  isComplete: boolean;
}

// ---------------------------------------------------------------------------
// Component
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

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
              "You are Arcanea, a creative intelligence for world-builders, storytellers, and game designers. This is a quick preview — the creator can continue in the full chat for deeper collaboration. Respond in 3-4 sentences max. Be specific and generative: if they mention a world, start naming places; if they mention a character, give them a trait or secret they did not expect. End with one vivid question that pulls them deeper into the idea. Never say 'great idea' — just start building.",
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
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
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Parse Vercel AI SDK text stream format: 0:"chunk"\n
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const match = line.match(/^0:"((?:[^"\\]|\\.)*)"/);
            if (match) {
              full += match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
            } else if (!line.startsWith("e:") && !line.startsWith("d:") && line.trim()) {
              // Plain text fallback (no API key configured returns plain text)
              full += line;
            }
          }
          setStream({ isStreaming: true, content: full, isComplete: false });
        }
        // Process remaining buffer
        if (buffer.trim()) {
          const match = buffer.match(/^0:"((?:[^"\\]|\\.)*)"/);
          if (match) {
            full += match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
          }
        }

        setStream({ isStreaming: false, content: full, isComplete: true });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
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
    router.push(`/chat/chronica${message ? `?prompt=${encodeURIComponent(message.trim())}` : ""}`);
  };

  const handleReset = () => {
    if (abortRef.current) abortRef.current.abort();
    setStream({ isStreaming: false, content: "", isComplete: false });
    setMessage("");
    textareaRef.current?.focus();
  };

  const showInput = !stream.isStreaming && !stream.isComplete;
  const hasText = message.trim().length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {showInput ? (
          <m.div
            key="input"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.35 }}
          >
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
                  placeholder="Describe what you want to create..."
                  rows={1}
                  className="flex-1 px-5 py-4 bg-transparent text-white/90 placeholder-white/20 resize-none focus:outline-none focus:ring-1 focus:ring-[#00bcd4]/20 font-body text-[15px] leading-relaxed"
                  style={{ minHeight: "56px", maxHeight: "120px" }}
                />

                {/* Send */}
                <div className="p-2.5 pr-3">
                  <button
                    onClick={() => handleSubmit(message)}
                    disabled={!hasText}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      hasText
                        ? "bg-[#00bcd4] shadow-[0_2px_12px_rgba(0,188,212,0.3)] hover:shadow-[0_4px_20px_rgba(0,188,212,0.4)] hover:scale-105 active:scale-95"
                        : "bg-white/[0.04] cursor-default"
                    }`}
                    aria-label="Send"
                  >
                    <PhPaperPlane
                      className={`w-4 h-4 transition-colors ${hasText ? "text-white" : "text-white/15"}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Suggested prompts */}
            <m.div
              className="mt-5 flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {SUGGESTED_PROMPTS.map((sp) => {
                const Icon = sp.icon;
                return (
                  <button
                    key={sp.label}
                    onClick={() => handlePromptClick(sp.prompt)}
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] text-white/30 hover:text-white/60 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-white/[0.10] transition-all duration-200"
                  >
                    <Icon className="w-3.5 h-3.5 text-white/20 group-hover:text-[#00bcd4]/70 transition-colors" />
                    {sp.label}
                  </button>
                );
              })}
            </m.div>
          </m.div>
        ) : (
          <m.div
            key="response"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Conversation card */}
            <div className="rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_40px_rgba(0,0,0,0.4)] overflow-hidden">
              <div className="bg-white/[0.02] backdrop-blur-2xl p-5 space-y-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-[#00bcd4]/10 border border-[#00bcd4]/15 text-white/75 text-[14px] font-body leading-relaxed">
                    {message}
                  </div>
                </div>

                {/* AI response */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00bcd4]/20 to-[#00897b]/20 border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                    <PhSparkle className="w-3 h-3 text-[#00bcd4]/70" />
                  </div>
                  <div className="text-white/60 text-[14px] font-body leading-relaxed">
                    {stream.content || (
                      <span className="flex items-center gap-2 text-white/25">
                        <PhCircleNotch className="w-3.5 h-3.5 animate-spin" />
                        <span className="text-[13px]">Thinking...</span>
                      </span>
                    )}
                    {stream.isStreaming && stream.content && (
                      <m.span
                        className="inline-block w-[2px] h-[14px] bg-[#00bcd4]/60 ml-0.5 align-middle rounded-full"
                        animate={{ opacity: [1, 0.2] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Action bar */}
              {stream.isComplete && (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="border-t border-white/[0.04] bg-white/[0.015] px-5 py-3 flex items-center justify-between"
                >
                  <button
                    onClick={handleReset}
                    className="text-[13px] text-white/25 hover:text-white/50 transition-colors font-body"
                  >
                    Start over
                  </button>
                  <button
                    onClick={handleContinue}
                    className="group flex items-center gap-1.5 text-[13px] font-semibold text-[#00bcd4]/80 hover:text-[#00bcd4] transition-colors"
                  >
                    Continue in chat
                    <PhArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </m.div>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
