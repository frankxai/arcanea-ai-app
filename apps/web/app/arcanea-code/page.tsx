"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  Sparkles: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    </svg>
  ),
  Code: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Terminal: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Brackets: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
    </svg>
  ),
  GitBranch: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  ),
  Box: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Cpu: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  Wrench: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Zap: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-6 h-6 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Bug: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-6 h-6 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect width="8" height="14" x="8" y="6" rx="4" />
      <path d="m19 7-3 2" />
      <path d="m5 7 3 2" />
      <path d="m19 19-3-2" />
      <path d="m5 19 3-2" />
      <path d="M20 13h-4" />
      <path d="M4 13h4" />
      <path d="m10 4 1 2" />
    </svg>
  ),
  Rocket: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-6 h-6 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2l-3 2" />
      <path d="M12 15v6" />
      <path d="M12 21a2 2 0 0 0 2-2c0-1.5-2-3-2-3h-2" />
    </svg>
  ),
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface CodeFeature {
  title: string;
  description: string;
  icon: keyof typeof Icons;
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES: CodeFeature[] = [
  {
    title: "CLI Tools",
    description:
      "Powerful command-line tools for managing your Arcanea projects.",
    icon: "Terminal",
    color: "#8b5cf6",
  },
  {
    title: "MCP Server",
    description: "Model Context Protocol server with 30+ specialized tools.",
    icon: "Box",
    color: "#7fffd4",
  },
  {
    title: "TypeScript SDK",
    description:
      "Fully typed SDK for building with the Arcanea intelligence layer.",
    icon: "Brackets",
    color: "#ffd700",
  },
  {
    title: "Git Integration",
    description: "Seamless version control with Arcanea-specific workflows.",
    icon: "GitBranch",
    color: "#ef4444",
  },
  {
    title: "Intelligence Packages",
    description: "9 packages for council, evolution, memory, and more.",
    icon: "Cpu",
    color: "#3b82f6",
  },
  {
    title: "Developer Tools",
    description: "Debug, test, and deploy your Arcanea applications.",
    icon: "Wrench",
    color: "#ec4899",
  },
];

const QUICK_START = [
  { step: "1", title: "Install CLI", code: "npm install -g arcanea-cli" },
  { step: "2", title: "Initialize Project", code: "arcanea init my-app" },
  { step: "3", title: "Start Creating", code: "arcanea create" },
];

// ─── Loading Component ──────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-brand-primary/20 rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Icons.Sparkles />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ArcaneaCodePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        {/* Draconia — Fire Gate, the forge of code and will */}
        <img
          src="/guardians/gallery/draconia-gallery-4.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none"
        />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(127,255,212,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Hero Section */}
            <section className="mb-16">
              <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-12 sm:px-12 sm:py-16">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-crystal/10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-crystal/6 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 mb-6">
                    <Icons.Code />
                    <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                      Developer Platform
                    </span>
                  </div>

                  <h1 className="text-fluid-3xl font-display font-bold mb-4">
                    Build with
                    <span className="block text-gradient-brand">
                      Arcanea Code
                    </span>
                  </h1>

                  <p className="text-text-secondary font-body text-lg leading-relaxed mb-8 max-w-2xl">
                    A complete developer platform for building AI-powered
                    applications with the Arcanea intelligence layer. TypeScript
                    SDK, MCP tools, and intelligent agents at your fingertips.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/developers"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                    >
                      Start Building
                      <Icons.ArrowRight />
                    </Link>
                    <Link
                      href="/docs"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                    >
                      Read Docs
                      <Icons.ChevronRight />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Start */}
            <section className="mb-16">
              <div className="glass rounded-2xl p-8">
                <h2 className="font-display text-2xl font-semibold text-text-primary mb-6 text-center">
                  Quick Start
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {QUICK_START.map((item) => (
                    <div key={item.step} className="relative">
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-sm">
                        {item.step}
                      </div>
                      <div className="pt-4">
                        <h3 className="font-semibold text-text-primary mb-2">
                          {item.title}
                        </h3>
                        <code className="block bg-cosmic-void/50 rounded-lg p-3 text-sm text-brand-primary font-mono overflow-x-auto">
                          {item.code}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="mb-16" aria-labelledby="features-heading">
              <div className="mb-8">
                <h2
                  id="features-heading"
                  className="text-xs font-mono tracking-[0.35em] uppercase text-crystal mb-2"
                >
                  Developer Tools
                </h2>
                <h3 className="text-fluid-2xl font-display font-bold">
                  Everything You Need to Build
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((feature) => {
                  const FeatureIcon = Icons[feature.icon];
                  return (
                    <div
                      key={feature.title}
                      className="group relative glass rounded-2xl p-6 overflow-hidden glow-card hover-lift transition-all"
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                        style={{
                          background: `radial-gradient(ellipse at 30% 30%, ${feature.color}15, transparent 65%)`,
                        }}
                      />

                      <div className="relative">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${feature.color}18` }}
                        >
                          <FeatureIcon />
                        </div>

                        <h4
                          className="font-display text-xl font-semibold text-text-primary mb-2 group-hover:text-crystal transition-colors"
                          style={{ color: feature.color }}
                        >
                          {feature.title}
                        </h4>

                        <p className="text-text-secondary text-sm leading-relaxed font-sans">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Dev Highlights */}
            <section className="mb-16">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Icons.Zap className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                    Lightning Fast
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Build and deploy in seconds, not minutes.
                  </p>
                </div>
                <div className="glass rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-crystal/20 flex items-center justify-center mx-auto mb-4">
                    <Icons.Bug className="w-6 h-6 text-crystal" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                    Type Safe
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Full TypeScript support with zero `any` types.
                  </p>
                </div>
                <div className="glass rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-brand-gold/20 flex items-center justify-center mx-auto mb-4">
                    <Icons.Rocket className="w-6 h-6 text-brand-gold" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                    Production Ready
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Tested with 3000+ tests passing.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section>
              <div className="relative liquid-glass rounded-3xl overflow-hidden p-8 sm:p-12 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-crystal/8 pointer-events-none" />
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-primary/6 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-2xl mx-auto">
                  <h2 className="text-fluid-2xl font-display font-bold mb-4">
                    Start Building Today
                  </h2>
                  <p className="text-text-secondary font-body leading-relaxed mb-8">
                    Join thousands of developers building the future of creative
                    AI with Arcanea Code.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/developers"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                    >
                      <Icons.Code />
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
