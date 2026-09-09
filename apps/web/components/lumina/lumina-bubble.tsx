/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

/**
 * Arcanea Companion Bubble — The Platform's Always-Present Intelligence
 *
 * Site-wide floating chat that gives creators access to Arcanea from any page.
 * Routes to the right Luminor, holds context, and speaks for the whole platform.
 *
 * Features:
 * - Fixed bottom-right bubble using the crystalline A mark
 * - Keyboard shortcut: Cmd+K (Mac) / Ctrl+K (others) to toggle
 * - Streaming responses from POST /api/ai/chat
 * - "Open full chat" link to /chat with history
 * - Glass-morphism panel matching Arcanea design
 */

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PhPaperPlane, PhX } from "@/lib/phosphor-icons";
import { isCinematicReaderPath } from "@/lib/books/cinematic-public-contract";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const GREETINGS = [
  "What are you creating?",
  "Describe a world. I'll build it.",
  "Ask me anything about Arcanea.",
  "What story wants to be told?",
];

const PROMPT_EXAMPLES = [
  "Build a world from one sentence",
  "Help me write an opening scene",
  "What can I create here?",
  "Generate a character for my story",
];

export function LuminaBubble() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [greeting] = useState(
    () => GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const isHomeRoute =
    normalizedPath === "/" || /^\/[a-z]{2}$/.test(normalizedPath);
  const suppressAssistant =
    isHomeRoute || isCinematicReaderPath(normalizedPath);

  // Keyboard shortcut: Cmd+K / Ctrl+K to toggle
  useEffect(() => {
    if (suppressAssistant) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, suppressAssistant]);

  // Focus input when panel opens
  useEffect(() => {
    if (open && !suppressAssistant) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timeout);
    }
  }, [open, suppressAssistant]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: text.trim(),
      };
      const assistantId = `a-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setInput("");
      setStreaming(true);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: text.trim() },
            ],
            model: "gemini-2.5-flash",
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`Arcanea unavailable (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          // Parse SSE data lines
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "text-delta" && parsed.delta) {
                accumulated += parsed.delta;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: accumulated } : m,
                  ),
                );
              }
            } catch {
              // skip non-JSON lines
            }
          }
        }
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    (err as Error).message ??
                    "Something went wrong. Try again.",
                }
              : m,
          ),
        );
      } finally {
        setStreaming(false);
      }
    },
    [streaming, messages],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (suppressAssistant) return null;

  return (
    <LazyMotion features={domAnimation}>
      {/* Floating bubble (collapsed state) */}
      <AnimatePresence>
        {!open && (
          <m.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-50 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[var(--arc-cosmic-void)]/80 shadow-[0_0_40px_rgba(127,255,212,0.15)] backdrop-blur-xl transition-all hover:scale-105 hover:border-[var(--arc-brand-atlantean-teal)]/30 hover:shadow-[0_0_60px_rgba(127,255,212,0.25)] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
            aria-label="Open Arcanea assistant"
          >
            <Image
              src="/images/mascot/arcanea-primary.png"
              alt="Arcanea"
              width={56}
              height={56}
              className="object-contain drop-shadow-[0_0_12px_rgba(127,255,212,0.3)]"
            />
          </m.button>
        )}
      </AnimatePresence>

      {/* Chat panel (expanded state) */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-50 flex h-[560px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[var(--arc-cosmic-void)]/90 shadow-[0_20px_80px_rgba(0,188,212,0.12)] backdrop-blur-2xl sm:bottom-6 sm:right-6"
            style={{ maxHeight: "calc(100vh - 2rem)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/mascot/arcanea-primary.png"
                  alt="Arcanea"
                  width={32}
                  height={32}
                  className="rounded-full object-contain"
                />
                <div>
                  <div className="font-display text-sm font-semibold text-white/90">
                    Arcanea
                  </div>
                  <div className="text-[10px] text-white/40">
                    Your creative intelligence
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href="/chat"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-1 text-[11px] text-white/40 transition hover:bg-white/[0.05] hover:text-[var(--arc-brand-atlantean-teal)]"
                  title="Open full chat"
                >
                  Full chat
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/[0.05] hover:text-white/80"
                  aria-label="Close Arcanea (Esc)"
                >
                  <PhX className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 && (
                <div className="space-y-5 py-2">
                  <p className="text-base font-medium text-white/70">
                    {greeting}
                  </p>
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase tracking-[0.15em] text-white/25">
                      Try
                    </div>
                    {PROMPT_EXAMPLES.map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => sendMessage(ex)}
                        className="block w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-left text-[13px] text-white/50 transition hover:border-[var(--arc-brand-atlantean-teal)]/20 hover:bg-white/[0.04] hover:text-white/80"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-white/[0.08] text-white/90"
                        : "border border-[var(--arc-brand-atlantean-teal)]/15 bg-[var(--arc-brand-atlantean-teal)]/[0.04] text-white/85"
                    }`}
                  >
                    {msg.content || (
                      <span className="inline-flex gap-1 text-white/30">
                        <span className="animate-pulse">.</span>
                        <span
                          className="animate-pulse"
                          style={{ animationDelay: "150ms" }}
                        >
                          .
                        </span>
                        <span
                          className="animate-pulse"
                          style={{ animationDelay: "300ms" }}
                        >
                          .
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-white/[0.06] p-3">
              <div className="flex items-end gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 focus-within:border-[var(--arc-brand-atlantean-teal)]/30 transition-colors">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Arcanea..."
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-[13px] text-white/90 placeholder-white/30 outline-none"
                  style={{ maxHeight: "100px" }}
                  disabled={streaming}
                />
                <button
                  type="button"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || streaming}
                  className="rounded-lg bg-[var(--arc-brand-atlantean-teal)]/15 px-3 py-1.5 text-xs font-medium text-[var(--arc-brand-atlantean-teal)] transition hover:bg-[var(--arc-brand-atlantean-teal)]/25 disabled:opacity-30"
                >
                  {streaming ? "..." : <PhPaperPlane className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-between px-1">
                <span aria-hidden="true" />
                <Link
                  href="/chat"
                  onClick={() => setOpen(false)}
                  className="text-[10px] text-white/25 hover:text-[var(--arc-brand-atlantean-teal)] transition-colors"
                >
                  Open full chat
                </Link>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
