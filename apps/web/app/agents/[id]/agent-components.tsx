"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import type { MarketplaceAgent } from "./agent-data";

// ---------------------------------------------------------------------------
// Star rating
// ---------------------------------------------------------------------------

export function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < full ? "text-[#ffd700]" : i === full && half ? "text-[#ffd700]/60" : "text-white/15"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-sm text-white/50 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Streaming cursor animation
// ---------------------------------------------------------------------------

export function StreamingCursor() {
  return (
    <span aria-hidden="true">
      <m.span
        className="inline-block w-0.5 h-4 bg-[#7fffd4] ml-0.5 align-middle"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" }}
      />
    </span>
  );
}

// ---------------------------------------------------------------------------
// Progress indicator
// ---------------------------------------------------------------------------

export function StreamingProgress({ isStreaming }: { isStreaming: boolean }) {
  if (!isStreaming) return null;
  return (
    <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden" role="progressbar" aria-label="Generating...">
      <m.div
        className="h-full rounded-full"
        style={{ background: "linear-gradient(90deg, #7fffd4, #78a6ff, #ffd700, #7fffd4)", backgroundSize: "200% 100%" }}
        animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Copy button
// ---------------------------------------------------------------------------

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-xs text-white/60 hover:text-white hover:border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60"
      aria-label="Copy output to clipboard"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Agent sidebar
// ---------------------------------------------------------------------------

export function AgentSidebar({
  agent,
  creditBalance,
  onPromptClick,
}: {
  agent: MarketplaceAgent;
  creditBalance: number;
  onPromptClick: (prompt: string) => void;
}) {
  return (
    <div className="space-y-5 lg:sticky lg:top-24">
      {/* Capabilities */}
      <m.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-5"
      >
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#7fffd4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Capabilities
        </h3>
        <ul className="space-y-2">
          {agent.capabilities.map((cap) => (
            <li key={cap} className="flex items-center gap-2.5 text-sm text-white/60">
              <svg className="w-3.5 h-3.5 text-[#7fffd4] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {cap}
            </li>
          ))}
        </ul>
      </m.div>

      {/* Example prompts */}
      <m.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-5"
      >
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#78a6ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Example Prompts
        </h3>
        <ul className="space-y-2">
          {agent.examplePrompts.map((prompt, i) => (
            <li key={i}>
              <button
                onClick={() => onPromptClick(prompt)}
                className="w-full text-left text-sm text-white/50 hover:text-white/90 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-3 py-2.5 transition-all leading-snug focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60"
                aria-label={`Use example prompt: ${prompt}`}
              >
                {prompt}
              </button>
            </li>
          ))}
        </ul>
      </m.div>

      {/* Credit info */}
      <m.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="rounded-2xl border border-[#ffd700]/15 bg-[#ffd700]/5 backdrop-blur-xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-[#ffd700]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <h3 className="text-sm font-semibold text-[#ffd700]">Credits</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-white/50">
            <span>Your balance</span>
            <span className="text-white/80 font-medium">{creditBalance} credits</span>
          </div>
          <div className="flex justify-between text-white/50">
            <span>Cost per run</span>
            <span className="text-[#ffd700] font-medium">{agent.priceCredits} credits</span>
          </div>
          <div className="h-px bg-white/[0.06] my-2" aria-hidden="true" />
          <div className="flex justify-between text-white/50">
            <span>Runs available</span>
            <span className="text-white/80 font-medium">
              {Math.floor(creditBalance / agent.priceCredits)}
            </span>
          </div>
        </div>
        <Link
          href="/pricing"
          className="mt-4 block text-center text-xs text-[#ffd700]/70 hover:text-[#ffd700] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/60 rounded"
        >
          Get more credits
        </Link>
      </m.div>
    </div>
  );
}
