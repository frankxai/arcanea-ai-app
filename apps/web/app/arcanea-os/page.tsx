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
  Layers: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Shield: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Zap: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Brain: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  ),
  Globe: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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
  ChevronRight: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-5 h-5 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Router: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 10h16" />
      <path d="M4 14h16" />
      <rect x="4" y="6" width="16" height="8" rx="1" />
      <circle cx="8" cy="10" r="1" fill="currentColor" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
      <circle cx="16" cy="10" r="1" fill="currentColor" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface OSFeature {
  title: string;
  description: string;
  icon: keyof typeof Icons;
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES: OSFeature[] = [
  {
    title: "Guardian Router",
    description:
      "Intelligent routing of requests to the optimal Guardian for your task.",
    icon: "Router",
    color: "#8b5cf6",
  },
  {
    title: "Voice Enforcer",
    description:
      "Ensures all interactions maintain Arcanea's brand voice and terminology.",
    icon: "ShieldCheck",
    color: "#7fffd4",
  },
  {
    title: "Context Manager",
    description:
      "Sophisticated context handling across sessions and conversations.",
    icon: "Brain",
    color: "#ffd700",
  },
  {
    title: "Event Bus",
    description: "Powerful event-driven architecture for reactive workflows.",
    icon: "Zap",
    color: "#ef4444",
  },
  {
    title: "Multi-Model Support",
    description: "Seamlessly switch between different AI models and providers.",
    icon: "Layers",
    color: "#3b82f6",
  },
  {
    title: "Global CDN",
    description: "Lightning-fast access from anywhere in the world.",
    icon: "Globe",
    color: "#ec4899",
  },
];

const CAPABILITIES = [
  {
    category: "Core",
    items: [
      "Request Routing",
      "Context Management",
      "Session Handling",
      "Error Recovery",
    ],
    color: "#8b5cf6",
  },
  {
    category: "Intelligence",
    items: [
      "Model Selection",
      "Token Optimization",
      "ReasoningBank",
      "Memory Fusion",
    ],
    color: "#7fffd4",
  },
  {
    category: "Security",
    items: [
      "Voice Enforcement",
      "Input Validation",
      "Rate Limiting",
      "Audit Logging",
    ],
    color: "#ffd700",
  },
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
export default function ArcaneaOSPage() {
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
                    <Icons.Cpu />
                    <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                      Operating System
                    </span>
                  </div>

                  <h1 className="text-fluid-3xl font-display font-bold mb-4">
                    The Arcanea
                    <span className="block text-gradient-brand">
                      Operating System
                    </span>
                  </h1>

                  <p className="text-text-secondary font-body text-lg leading-relaxed mb-8 max-w-2xl">
                    A sophisticated AI operating system that orchestrates
                    Guardians, manages context, and delivers intelligent
                    responses. The backbone of all Arcanea experiences.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/platform"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                    >
                      Explore Platform
                      <Icons.ArrowRight />
                    </Link>
                    <Link
                      href="/developers"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                    >
                      Developer Docs
                      <Icons.ChevronRight />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="mb-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: "10M+", label: "Requests/day" },
                  { value: "99.9%", label: "Uptime" },
                  { value: "<50ms", label: "Response Time" },
                  { value: "150+", label: "Countries" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="liquid-glass rounded-2xl p-6 text-center"
                  >
                    <div className="text-3xl font-display font-bold text-brand-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-text-muted font-sans">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Features Grid */}
            <section className="mb-16" aria-labelledby="features-heading">
              <div className="mb-8">
                <h2
                  id="features-heading"
                  className="text-xs font-mono tracking-[0.35em] uppercase text-crystal mb-2"
                >
                  OS Features
                </h2>
                <h3 className="text-fluid-2xl font-display font-bold">
                  Intelligent Orchestration
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((feature) => {
                  const FeatureIcon = Icons[feature.icon];
                  return (
                    <div
                      key={feature.title}
                      className="group relative card-3d liquid-glass rounded-2xl p-6 overflow-hidden glow-card hover-lift transition-all"
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

            {/* Capabilities */}
            <section className="mb-16">
              <div className="liquid-glass rounded-2xl p-8">
                <h2 className="font-display text-2xl font-semibold text-text-primary mb-6 text-center">
                  System Capabilities
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {CAPABILITIES.map((category) => (
                    <div key={category.category}>
                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <h3 className="font-display font-semibold text-text-primary">
                          {category.category}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {category.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2 text-sm text-text-secondary"
                          >
                            <Icons.ChevronRight className="w-4 h-4" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Architecture Diagram */}
            <section className="mb-16">
              <div className="liquid-glass rounded-2xl p-8">
                <h2 className="font-display text-2xl font-semibold text-text-primary mb-6 text-center">
                  System Architecture
                </h2>

                <div className="relative">
                  <div className="flex flex-wrap justify-center gap-4">
                    <div className="px-6 py-4 rounded-xl bg-brand-primary/20 border border-brand-primary/30 text-center">
                      <div className="text-sm font-semibold text-brand-primary">
                        User Request
                      </div>
                    </div>
                    <div className="flex items-center text-text-muted">
                      <Icons.ArrowRight />
                    </div>
                    <div className="px-6 py-4 rounded-xl bg-crystal/20 border border-crystal/30 text-center">
                      <div className="text-sm font-semibold text-crystal">
                        Guardian Router
                      </div>
                    </div>
                    <div className="flex items-center text-text-muted">
                      <Icons.ArrowRight />
                    </div>
                    <div className="px-6 py-4 rounded-xl bg-brand-gold/20 border border-brand-gold/30 text-center">
                      <div className="text-sm font-semibold text-brand-gold">
                        AI Processing
                      </div>
                    </div>
                    <div className="flex items-center text-text-muted">
                      <Icons.ArrowRight />
                    </div>
                    <div className="px-6 py-4 rounded-xl bg-brand-primary/20 border border-brand-primary/30 text-center">
                      <div className="text-sm font-semibold text-brand-primary">
                        Response
                      </div>
                    </div>
                  </div>
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
                    Experience the OS
                  </h2>
                  <p className="text-text-secondary font-body leading-relaxed mb-8">
                    See the Arcanea Operating System in action. Join the
                    platform and let the Guardians guide your creative journey.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                    >
                      <Icons.Cpu />
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
