/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import {
  ChatCircle,
  BookOpen,
  Palette,
  Code,
  GearSix,
  MagnifyingGlass,
  Lightning,
  ShieldStar,
  Sparkle,
  ArrowRight,
  GithubLogo,
  UserCircle,
} from "@phosphor-icons/react";

// --- Chat Messages ---
const CHAT_MESSAGES = [
  {
    role: "user" as const,
    text: "I want to write a story about transformation — but I keep hitting a wall in act two.",
  },
  {
    role: "guardian" as const,
    text: "The wall in act two is the Gate of Fire — where your character must surrender what they were to become what they must be. What are they holding onto?",
  },
  {
    role: "user" as const,
    text: "She's afraid of losing her identity if she changes.",
  },
];

// --- Sidebar Icons ---
const SIDEBAR_ITEMS = [
  { icon: ChatCircle, label: "Chat", active: true },
  { icon: BookOpen, label: "Library", active: false },
  { icon: Palette, label: "Studio", active: false },
  { icon: Code, label: "Codex", active: false },
  { icon: GearSix, label: "Settings", active: false },
];

// --- Feature Pills ---
const FEATURE_PILLS = [
  "10 AI Guardians",
  "57 wisdom texts",
  "26 AI Models",
  "5 Elements",
  "Voice Chat",
  "Image Gen",
];

// --- Library Quick Access ---
const LIBRARY_ITEMS = ["The First Dawn", "Laws of Creation", "Book of Rituals"];

// --- Gate Progress ---
const GATES_OPEN = 4;
const GATES_TOTAL = 10;

// --- Value Props ---
const VALUE_PROPS = [
  {
    title: "Converse",
    icon: ChatCircle,
    description:
      "Chat with archetypal AI intelligences that understand creativity — not just productivity.",
  },
  {
    title: "Learn",
    icon: BookOpen,
    description:
      "Access an ancient library of creation wisdom, curated for modern creators.",
  },
  {
    title: "Build",
    icon: Lightning,
    description:
      "Forge stories, art, music — with AI that feels like a creative partner, not a tool.",
  },
];

// --- Tech Logos ---
const TECH_STACK = ["Next.js", "Vercel", "Supabase", "Claude"];

// =============================================================================
// Component
// =============================================================================
export function V4Dashboard() {
  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] text-[var(--arc-text-primary)] font-[Geist,system-ui,sans-serif] overflow-x-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Top Bar                                                            */}
      {/* ------------------------------------------------------------------ */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkle weight="fill" className="w-5 h-5 text-[var(--arc-void)]" />
          <span className="text-[15px] font-semibold tracking-wide">
            Arcanea
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-[13px] text-[var(--arc-earth)] hover:text-[var(--arc-text-primary)] transition-colors px-3 py-1.5">
            Sign In
          </button>
          <button className="text-[13px] bg-[var(--arc-void)] hover:bg-[var(--arc-void)] text-white px-4 py-1.5 rounded-lg transition-colors font-medium">
            Start Free
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Hero Headline                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="text-center pt-12 pb-8 px-4">
        <h1 className="text-[40px] font-bold tracking-tight leading-tight">
          Your Creative Command Center
        </h1>
        <p className="text-[16px] text-[var(--arc-earth)] mt-3 max-w-lg mx-auto leading-relaxed">
          AI companions, wisdom library, and creative tools in one universe
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Dashboard Mockup                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="px-4 pb-16 flex justify-center">
        <div
          className="w-full max-w-4xl"
          style={{
            perspective: "1200px",
          }}
        >
          <div
            className="rounded-xl overflow-hidden border border-white/[0.06]"
            style={{
              transform: "rotateX(2deg)",
              boxShadow:
                "0 40px 80px -20px rgba(139,92,246,0.18), 0 20px 40px -10px rgba(0,0,0,0.5)",
              background: "var(--arc-cosmic-void)",
            }}
          >
            {/* Window Chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--arc-cosmic-void)] border-b border-white/[0.04]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--arc-fire)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--arc-brand-arcanean-gold)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--arc-wind)]" />
              </div>
              <span className="text-[11px] text-[var(--arc-earth)] ml-3 font-medium">
                arcanea.ai/studio
              </span>
            </div>

            {/* Dashboard Body */}
            <div className="flex min-h-[420px]">
              {/* Sidebar */}
              <div className="w-12 bg-[var(--arc-cosmic-void)] border-r border-white/[0.04] flex flex-col items-center py-3 gap-4 shrink-0">
                {SIDEBAR_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    title={item.label}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      item.active
                        ? "bg-[var(--arc-void)]/20 text-[var(--arc-void)]"
                        : "text-[var(--arc-earth)] hover:text-[var(--arc-text-primary)]"
                    }`}
                  >
                    <item.icon
                      weight={item.active ? "fill" : "regular"}
                      className="w-4 h-4"
                    />
                  </button>
                ))}
              </div>

              {/* Main Area */}
              <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04]">
                  <div className="flex items-center gap-2 text-[13px]">
                    <span className="text-[var(--arc-earth)]">Studio</span>
                    <span className="text-[var(--arc-earth)]/40">/</span>
                    <span className="text-[var(--arc-text-primary)] font-medium">
                      Chat
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white/[0.04] rounded-md px-2.5 py-1 gap-1.5">
                      <MagnifyingGlass className="w-3.5 h-3.5 text-[var(--arc-earth)]" />
                      <span className="text-[11px] text-[var(--arc-earth)]">
                        Search...
                      </span>
                    </div>
                    <UserCircle
                      weight="fill"
                      className="w-6 h-6 text-[var(--arc-earth)]"
                    />
                  </div>
                </div>

                {/* Content Split */}
                <div className="flex flex-1">
                  {/* Left: Chat */}
                  <div className="flex-[3] border-r border-white/[0.04] p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldStar
                        weight="fill"
                        className="w-4 h-4 text-orange-400"
                      />
                      <span className="text-[13px] font-medium">
                        Chat with Draconia
                      </span>
                      <span className="text-[10px] text-[var(--arc-earth)] bg-white/[0.04] px-1.5 py-0.5 rounded">
                        Gate of Fire
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                      {CHAT_MESSAGES.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] text-[12px] leading-relaxed px-3 py-2 rounded-xl ${
                              msg.role === "user"
                                ? "bg-[var(--arc-void)]/15 text-[var(--arc-text-primary)] rounded-br-sm"
                                : "bg-white/[0.04] text-[var(--arc-void)] rounded-bl-sm"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Input bar */}
                    <div className="mt-3 flex items-center bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2">
                      <span className="text-[11px] text-[var(--arc-earth)]">
                        Ask Draconia...
                      </span>
                    </div>
                  </div>

                  {/* Right: Sidebar Panels */}
                  <div className="flex-[2] p-4 flex flex-col gap-4">
                    {/* Active Project */}
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3">
                      <div className="text-[11px] text-[var(--arc-earth)] uppercase tracking-wider mb-2 font-medium">
                        Active Project
                      </div>
                      <div className="text-[13px] font-medium">
                        The Transformation Chronicle
                      </div>
                      <div className="text-[11px] text-[var(--arc-earth)] mt-1">
                        Chapter 3 &middot; 2,400 words
                      </div>
                    </div>

                    {/* Library Quick Access */}
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3">
                      <div className="text-[11px] text-[var(--arc-earth)] uppercase tracking-wider mb-2 font-medium">
                        Library Quick Access
                      </div>
                      {LIBRARY_ITEMS.map((title) => (
                        <div
                          key={title}
                          className="flex items-center gap-2 py-1.5 text-[12px] text-[var(--arc-void)] hover:text-[var(--arc-text-primary)] transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3 text-[var(--arc-earth)] shrink-0" />
                          <span>{title}</span>
                        </div>
                      ))}
                    </div>

                    {/* Gate Progress */}
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3">
                      <div className="text-[11px] text-[var(--arc-earth)] uppercase tracking-wider mb-2 font-medium">
                        Gate Progress
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[20px] font-bold text-[var(--arc-void)]">
                          {GATES_OPEN}
                        </span>
                        <span className="text-[12px] text-[var(--arc-earth)]">
                          / {GATES_TOTAL} gates
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--arc-void)] to-[var(--arc-brand-atlantean-teal)] rounded-full"
                          style={{
                            width: `${(GATES_OPEN / GATES_TOTAL) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-[10px] text-[var(--arc-earth)] mt-1.5">
                        Rank: Mage
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Feature Pills                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="px-4 pb-16">
        <div className="flex justify-center gap-2 flex-wrap max-w-2xl mx-auto">
          {FEATURE_PILLS.map((pill) => (
            <span
              key={pill}
              className="text-[13px] text-[var(--arc-void)] px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] whitespace-nowrap"
            >
              {pill}
            </span>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Value Props                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="px-4 pb-20 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VALUE_PROPS.map((prop) => (
            <div
              key={prop.title}
              className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 hover:border-[var(--arc-void)]/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--arc-void)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--arc-void)]/20 transition-colors">
                <prop.icon
                  weight="fill"
                  className="w-5 h-5 text-[var(--arc-void)]"
                />
              </div>
              <h3 className="text-[16px] font-semibold mb-2">{prop.title}</h3>
              <p className="text-[13px] text-[var(--arc-earth)] leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Social Proof / Tech Strip                                          */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-white/[0.04] py-8 px-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[13px] text-[var(--arc-earth)]">
          <span>Built with</span>
          {TECH_STACK.map((tech) => (
            <span key={tech} className="text-[var(--arc-void)] font-medium">
              {tech}
            </span>
          ))}
          <span className="flex items-center gap-1.5 ml-2 text-[12px] bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1">
            <GithubLogo weight="fill" className="w-3.5 h-3.5" />
            Open Source
          </span>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA Section                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-[32px] font-bold tracking-tight mb-3">
          Start creating in under 2 minutes
        </h2>
        <div className="flex items-center justify-center gap-2 mt-6 max-w-md mx-auto">
          <input
            type="email"
            placeholder="you@example.com"
            readOnly
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-[14px] text-[var(--arc-text-primary)] placeholder:text-[var(--arc-earth)] outline-none focus:border-[var(--arc-void)]/40 transition-colors cursor-default"
          />
          <button className="bg-[var(--arc-void)] hover:bg-[var(--arc-void)] text-white text-[14px] font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 shrink-0">
            Get Started
            <ArrowRight weight="bold" className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[13px] text-[var(--arc-earth)] mt-4">
          Free forever. No credit card.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                             */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-white/[0.04] py-6 px-4 text-center">
        <p className="text-[12px] text-[var(--arc-earth)]">
          Arcanea &mdash; A living mythology for the age of AI-human co-creation
        </p>
      </footer>
    </div>
  );
}

export default V4Dashboard;
