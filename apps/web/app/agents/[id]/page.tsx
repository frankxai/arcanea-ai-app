"use client";

import { useState, useRef, useCallback, use } from "react";
import Link from "next/link";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { CreditBadge } from "@/components/agents/credit-badge";
import { AGENTS_CATALOG, formatUsageCount, type RunStatus } from "./agent-data";
import { StarRating, StreamingCursor, StreamingProgress, CopyButton, AgentSidebar } from "./agent-components";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const agent = AGENTS_CATALOG.find((a) => a.id === id);

  const [status, setStatus] = useState<RunStatus>("idle");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  const creditBalance = 100;

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    document.getElementById("task-input")?.focus();
  };

  const handleRun = useCallback(async () => {
    if (!input.trim() || !agent) return;
    setStatus("streaming");
    setOutput("");

    try {
      const response = await fetch(`/api/agents/${agent.id}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setStatus("error");
        return;
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setOutput((prev) => {
          const updated = prev + text;
          requestAnimationFrame(() => {
            outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: "smooth" });
          });
          return updated;
        });
      }

      setStatus("completed");
    } catch {
      setStatus("error");
    }
  }, [input, agent]);

  const handleReset = () => {
    setStatus("idle");
    setOutput("");
    setInput("");
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 text-lg mb-4">Agent not found.</p>
          <Link href="/agents" className="text-[#7fffd4] hover:underline">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const canRun = input.trim().length > 0 && status !== "streaming" && creditBalance >= agent.priceCredits;
  const remainingAfterRun = creditBalance - agent.priceCredits;

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* ── Header ──────────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-gray-950/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60 rounded"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Agents Marketplace
            </Link>
            <CreditBadge balance={creditBalance} size="sm" />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
            {/* ── Left column: Agent info + runner ─────────────────── */}
            <div className="space-y-6">
              <AgentHeaderCard agent={agent} />
              <TaskInputCard
                agent={agent}
                input={input}
                setInput={setInput}
                status={status}
                canRun={canRun}
                remainingAfterRun={remainingAfterRun}
                creditBalance={creditBalance}
                onRun={handleRun}
              />

              {/* Output area */}
              <AnimatePresence>
                {(status === "streaming" || status === "completed" || status === "error") && (
                  <OutputArea
                    status={status}
                    output={output}
                    outputRef={outputRef}
                    onReset={handleReset}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* ── Right column: sidebar ────────────────────────────── */}
            <AgentSidebar
              agent={agent}
              creditBalance={creditBalance}
              onPromptClick={handlePromptClick}
            />
          </div>
        </main>
      </div>
    </LazyMotion>
  );
}

// ---------------------------------------------------------------------------
// Agent header card
// ---------------------------------------------------------------------------

function AgentHeaderCard({ agent }: { agent: (typeof AGENTS_CATALOG)[number] }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl overflow-hidden p-6"
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: agent.gradient }} aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 h-32 opacity-20 pointer-events-none" style={{ background: `radial-gradient(ellipse at 30% 0%, ${agent.color}, transparent 60%)` }} aria-hidden="true" />

      <div className="relative z-10">
        <div className="flex items-start gap-5 mb-5">
          <div
            className="w-16 h-16 rounded-2xl text-3xl flex items-center justify-center flex-shrink-0"
            style={{ background: agent.gradient, boxShadow: `0 8px 24px ${agent.color}40` }}
            aria-hidden="true"
          >
            {agent.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
              <div>
                <h1 className="text-2xl font-display font-bold leading-tight" style={{ color: agent.color }}>
                  {agent.name}
                </h1>
                <p className="text-sm text-white/50 font-medium uppercase tracking-wide">{agent.title}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {agent.isFeatured && (
                  <span className="text-[10px] font-bold tracking-widest text-[#ffd700]/80 uppercase border border-[#ffd700]/20 bg-[#ffd700]/10 px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold border border-[#ffd700]/30 bg-[#ffd700]/10 text-[#ffd700]">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {agent.priceCredits} credits / run
                </span>
              </div>
            </div>
            <StarRating rating={agent.rating} />
          </div>
        </div>

        <p className="text-white/70 leading-relaxed mb-5">{agent.description}</p>

        <div className="flex items-center gap-6 text-sm text-white/40">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {formatUsageCount(agent.usageCount)} runs
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {agent.element} element
          </span>
        </div>
      </div>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Task input card
// ---------------------------------------------------------------------------

function TaskInputCard({
  agent,
  input,
  setInput,
  status,
  canRun,
  remainingAfterRun,
  creditBalance,
  onRun,
}: {
  agent: (typeof AGENTS_CATALOG)[number];
  input: string;
  setInput: (v: string) => void;
  status: RunStatus;
  canRun: boolean;
  remainingAfterRun: number;
  creditBalance: number;
  onRun: () => void;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6"
    >
      <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-[#7fffd4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Describe your task
      </h2>
      <textarea
        id="task-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Tell ${agent.name} what you want to create...`}
        rows={5}
        disabled={status === "streaming"}
        className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:border-[#7fffd4]/50 focus:ring-1 focus:ring-[#7fffd4]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Task description"
      />

      <div className="mt-3 flex items-center justify-between text-xs text-white/40">
        <span>
          This run costs{" "}
          <span className="text-[#ffd700] font-medium">{agent.priceCredits} credits</span>.
          Balance after:{" "}
          <span className={remainingAfterRun < 0 ? "text-red-400" : "text-white/60"}>
            {remainingAfterRun} credits
          </span>
        </span>
        <span>{input.length} chars</span>
      </div>

      <div className="mt-4">
        <m.button
          onClick={onRun}
          disabled={!canRun}
          whileHover={canRun ? { scale: 1.02 } : {}}
          whileTap={canRun ? { scale: 0.98 } : {}}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/60 ${
            canRun
              ? "bg-gradient-to-r from-[#ffd700] to-[#f59e0b] text-gray-950 shadow-lg shadow-[#ffd700]/25 hover:shadow-[#ffd700]/40"
              : "bg-white/[0.06] text-white/30 cursor-not-allowed"
          }`}
          aria-label={`Run ${agent.name} for ${agent.priceCredits} credits`}
        >
          {status === "streaming" ? (
            <>
              <span aria-hidden="true">
                <m.div
                  className="w-4 h-4 rounded-full border-2 border-gray-950/30 border-t-gray-950"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              </span>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Run {agent.name} ({agent.priceCredits} credits)
            </>
          )}
        </m.button>

        {creditBalance < agent.priceCredits && status === "idle" && (
          <p className="mt-2 text-center text-xs text-red-400">
            Insufficient credits.{" "}
            <Link href="/pricing" className="underline hover:text-red-300">
              Get more credits
            </Link>
          </p>
        )}
      </div>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Output area
// ---------------------------------------------------------------------------

function OutputArea({
  status,
  output,
  outputRef,
  onReset,
}: {
  status: RunStatus;
  output: string;
  outputRef: React.RefObject<HTMLDivElement | null>;
  onReset: () => void;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              status === "streaming" ? "bg-[#7fffd4] animate-pulse" : status === "completed" ? "bg-green-400" : "bg-red-400"
            }`}
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-white/70">
            {status === "streaming" ? "Generating..." : status === "completed" ? "Output" : "Error"}
          </span>
        </div>
        {status === "completed" && output && (
          <div className="flex items-center gap-2">
            <CopyButton text={output} />
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-xs text-white/60 hover:text-white hover:border-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60"
              aria-label="Start over with new input"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              New Task
            </button>
          </div>
        )}
      </div>

      <StreamingProgress isStreaming={status === "streaming"} />

      <div ref={outputRef} className="px-5 py-5 max-h-[500px] overflow-y-auto" aria-live="polite" aria-label="Agent output">
        {status === "error" ? (
          <div className="flex items-center gap-3 text-red-400">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">Something went wrong. Please try again.</p>
          </div>
        ) : (
          <div className="font-mono text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
            {output}
            {status === "streaming" && <StreamingCursor />}
          </div>
        )}
      </div>

      {status === "completed" && output && (
        <div className="px-5 pb-5">
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#7fffd4]/30 bg-[#7fffd4]/10 text-[#7fffd4] text-sm font-medium hover:bg-[#7fffd4]/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60"
            aria-label="Save output to your creations"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Save to Creations
          </button>
        </div>
      )}
    </m.div>
  );
}

