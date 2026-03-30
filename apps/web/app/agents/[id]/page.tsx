"use client";

import { useState, useRef, useCallback, use } from "react";
import Link from "next/link";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { CreditBadge } from "@/components/agents/credit-badge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RunStatus = "idle" | "streaming" | "completed" | "error";

interface MarketplaceAgent {
  id: string;
  name: string;
  title: string;
  description: string;
  priceCredits: number;
  element: string;
  icon: string;
  color: string;
  gradient: string;
  rating: number;
  usageCount: number;
  isFeatured: boolean;
  capabilities: string[];
  examplePrompts: string[];
}

// ---------------------------------------------------------------------------
// Agent catalog (inline — mirrors marketplace page)
// ---------------------------------------------------------------------------

const AGENTS_CATALOG: MarketplaceAgent[] = [
  {
    id: "quillblade",
    name: "Quillblade",
    title: "Story Writer",
    description: "Crafts compelling narratives, chapters, and complete story arcs with rich character development and world-consistent prose.",
    priceCredits: 15,
    element: "Fire",
    icon: "🗡️",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #f97316)",
    rating: 4.8,
    usageCount: 3241,
    isFeatured: true,
    capabilities: ["Long-form narratives", "Chapter generation", "Dialogue writing", "Scene description"],
    examplePrompts: [
      "Write chapter 3 of my fantasy novel where the hero discovers their power",
      "Create a tense confrontation scene between two rivals",
      "Write a prologue that hooks readers from the first sentence",
    ],
  },
  {
    id: "soulforge",
    name: "Soulforge",
    title: "Character Designer",
    description: "Builds deep, memorable characters with backstory, motivations, voice, and personality that feel genuinely alive.",
    priceCredits: 10,
    element: "Spirit",
    icon: "🔥",
    color: "#fbbf24",
    gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    rating: 4.9,
    usageCount: 2876,
    isFeatured: true,
    capabilities: ["Character backstory", "Personality profiling", "Voice development", "Character sheets"],
    examplePrompts: [
      "Create a morally grey villain who believes they are the hero",
      "Design a side character who steals every scene they appear in",
      "Build a protagonist with a compelling inner conflict",
    ],
  },
  {
    id: "cosmograph",
    name: "Cosmograph",
    title: "World Builder",
    description: "Constructs entire fantasy worlds with geography, history, cultures, magic systems, and internal consistency.",
    priceCredits: 20,
    element: "Earth",
    icon: "🌍",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
    rating: 4.7,
    usageCount: 1654,
    isFeatured: false,
    capabilities: ["World geography", "History & lore", "Magic systems", "Cultural design"],
    examplePrompts: [
      "Create a world where magic is powered by music",
      "Design the political factions of a steampunk empire",
      "Build a pantheon of gods for my fantasy world",
    ],
  },
  {
    id: "inkwarden",
    name: "Inkwarden",
    title: "Editor",
    description: "Refines, polishes, and elevates your writing — fixing structure, voice, pacing, and clarity without losing your style.",
    priceCredits: 10,
    element: "Water",
    icon: "📝",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
    rating: 4.6,
    usageCount: 4102,
    isFeatured: false,
    capabilities: ["Line editing", "Structural feedback", "Pacing analysis", "Voice consistency"],
    examplePrompts: [
      "Edit this scene to improve the pacing and tension",
      "Strengthen the dialogue to feel more natural",
      "Rewrite this paragraph to match the chapter's tone",
    ],
  },
  {
    id: "codeweaver",
    name: "Codeweaver",
    title: "Code Builder",
    description: "Writes production-quality code for your creative tools, interactive stories, and web experiences.",
    priceCredits: 15,
    element: "Fire",
    icon: "⚡",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    rating: 4.5,
    usageCount: 987,
    isFeatured: false,
    capabilities: ["TypeScript & React", "API integration", "Interactive fiction engines", "Web components"],
    examplePrompts: [
      "Build a character generator component with randomization",
      "Create an interactive story branching system",
      "Write a REST API for my world-building database",
    ],
  },
  {
    id: "loreseeker",
    name: "Loreseeker",
    title: "Research Agent",
    description: "Digs deep into mythology, history, science, and culture to provide rich reference material for your world.",
    priceCredits: 10,
    element: "Wind",
    icon: "🔍",
    color: "#f8fafc",
    gradient: "linear-gradient(135deg, #94a3b8, #cbd5e1)",
    rating: 4.4,
    usageCount: 1234,
    isFeatured: false,
    capabilities: ["Mythology research", "Historical accuracy", "Scientific grounding", "Cultural context"],
    examplePrompts: [
      "Research real-world mythology that inspired Norse gods",
      "Find historical precedents for a matriarchal warrior society",
      "Explain how alchemy works to inform my magic system",
    ],
  },
  {
    id: "resonance",
    name: "Resonance",
    title: "Music Composer",
    description: "Creates original music concepts, lyrics, chord progressions, and full song structures for your creative universe.",
    priceCredits: 15,
    element: "Water",
    icon: "🎵",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    rating: 4.7,
    usageCount: 782,
    isFeatured: false,
    capabilities: ["Lyric writing", "Chord progressions", "Song structure", "Musical themes"],
    examplePrompts: [
      "Write a haunting ballad for my villain's backstory",
      "Create a battle hymn with epic orchestral feel",
      "Compose lyrics for a bard character in my fantasy world",
    ],
  },
  {
    id: "visioncraft",
    name: "Visioncraft",
    title: "Cover Artist Director",
    description: "Creates detailed visual art direction and prompts for stunning book covers, character art, and world illustrations.",
    priceCredits: 10,
    element: "Void",
    icon: "🎨",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    rating: 4.6,
    usageCount: 2341,
    isFeatured: false,
    capabilities: ["Art direction", "Image prompts", "Style guides", "Cover composition"],
    examplePrompts: [
      "Create an art direction brief for my novel's cover",
      "Write detailed prompts for character portrait illustrations",
      "Design a visual style guide for my fantasy world",
    ],
  },
  {
    id: "bindmaster",
    name: "Bindmaster",
    title: "Publisher",
    description: "Prepares your work for publication — formatting, metadata, blurbs, query letters, and distribution strategy.",
    priceCredits: 20,
    element: "Earth",
    icon: "📚",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #22c55e, #854d0e)",
    rating: 4.3,
    usageCount: 445,
    isFeatured: false,
    capabilities: ["Book formatting", "Blurb writing", "Query letters", "Distribution planning"],
    examplePrompts: [
      "Write a compelling back-cover blurb for my novel",
      "Create a query letter for literary agents",
      "Format my manuscript for Amazon KDP",
    ],
  },
  {
    id: "heraldspark",
    name: "Heraldspark",
    title: "Social Manager",
    description: "Builds your author platform with compelling social content, newsletters, and launch campaigns.",
    priceCredits: 10,
    element: "Wind",
    icon: "📣",
    color: "#f8fafc",
    gradient: "linear-gradient(135deg, #64748b, #94a3b8)",
    rating: 4.2,
    usageCount: 678,
    isFeatured: false,
    capabilities: ["Social content", "Newsletter writing", "Launch campaigns", "Audience building"],
    examplePrompts: [
      "Write a Twitter thread announcing my book launch",
      "Create a month of social content for a fantasy author",
      "Draft a newsletter for my readers about the next book",
    ],
  },
  {
    id: "tonguebridge",
    name: "Tonguebridge",
    title: "Translator",
    description: "Translates your creative works with cultural nuance and narrative faithfulness across 50+ languages.",
    priceCredits: 15,
    element: "Wind",
    icon: "🌐",
    color: "#f8fafc",
    gradient: "linear-gradient(135deg, #78a6ff, #7fffd4)",
    rating: 4.5,
    usageCount: 334,
    isFeatured: false,
    capabilities: ["Literary translation", "Cultural adaptation", "Localization", "50+ languages"],
    examplePrompts: [
      "Translate this chapter to Spanish, keeping the poetic tone",
      "Adapt the cultural references for a Japanese audience",
      "Localize the magic system terminology for French readers",
    ],
  },
  {
    id: "gatewarden",
    name: "Gatewarden",
    title: "Curriculum Designer",
    description: "Designs structured learning experiences, workshops, and courses that teach world-building and creative craft.",
    priceCredits: 20,
    element: "Spirit",
    icon: "🎓",
    color: "#fbbf24",
    gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    rating: 4.8,
    usageCount: 221,
    isFeatured: false,
    capabilities: ["Course design", "Workshop curricula", "Learning paths", "Craft exercises"],
    examplePrompts: [
      "Design a 6-week course on fantasy world-building",
      "Create a workshop on writing compelling villains",
      "Build a learning path from beginner to published author",
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatUsageCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
}

function StarRating({ rating }: { rating: number }) {
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

function StreamingCursor() {
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

function StreamingProgress({ isStreaming }: { isStreaming: boolean }) {
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

function CopyButton({ text }: { text: string }) {
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
// Page
// ---------------------------------------------------------------------------

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const agent = AGENTS_CATALOG.find((a) => a.id === id);

  const [status, setStatus] = useState<RunStatus>("idle");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  // Placeholder credit balance
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
          // Auto-scroll
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
              {/* Agent header card */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl overflow-hidden p-6"
              >
                {/* Gradient top strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: agent.gradient }}
                  aria-hidden="true"
                />
                {/* Background glow */}
                <div
                  className="absolute top-0 left-0 right-0 h-32 opacity-20 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 30% 0%, ${agent.color}, transparent 60%)` }}
                  aria-hidden="true"
                />

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
                          <h1
                            className="text-2xl font-display font-bold leading-tight"
                            style={{ color: agent.color }}
                          >
                            {agent.name}
                          </h1>
                          <p className="text-sm text-white/50 font-medium uppercase tracking-wide">
                            {agent.title}
                          </p>
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

                  {/* Stats */}
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

              {/* Task input */}
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

                {/* Cost preview */}
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

                {/* Run button */}
                <div className="mt-4">
                  <m.button
                    onClick={handleRun}
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

              {/* Output area */}
              <AnimatePresence>
                {(status === "streaming" || status === "completed" || status === "error") && (
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl overflow-hidden"
                  >
                    {/* Output header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            status === "streaming"
                              ? "bg-[#7fffd4] animate-pulse"
                              : status === "completed"
                              ? "bg-green-400"
                              : "bg-red-400"
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
                            onClick={handleReset}
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

                    {/* Progress bar */}
                    <StreamingProgress isStreaming={status === "streaming"} />

                    {/* Output text */}
                    <div
                      ref={outputRef}
                      className="px-5 py-5 max-h-[500px] overflow-y-auto"
                      aria-live="polite"
                      aria-label="Agent output"
                    >
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

                    {/* Save to creations button */}
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
                )}
              </AnimatePresence>
            </div>

            {/* ── Right column: sidebar ────────────────────────────── */}
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
                        onClick={() => handlePromptClick(prompt)}
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
          </div>
        </main>
      </div>
    </LazyMotion>
  );
}
