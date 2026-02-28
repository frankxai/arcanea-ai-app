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
  Vault: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
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
  Lock: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Key: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
  Database: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Cloud: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
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
  Check: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-5 h-5 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Gem: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Crown: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 17l3-7 5 4 2-6 2 6 5-4 3 7H2z" />
      <path d="M2 17v6h20v-6" />
    </svg>
  ),
  Heart: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface VaultFeature {
  title: string;
  description: string;
  icon: keyof typeof Icons;
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES: VaultFeature[] = [
  {
    title: "Encrypted Storage",
    description:
      "Your creative assets are protected with military-grade encryption.",
    icon: "Lock",
    color: "#8b5cf6",
  },
  {
    title: "Guardian Protection",
    description: "AI Guardians watch over your vault with vigilant care.",
    icon: "Shield",
    color: "#7fffd4",
  },
  {
    title: "Secure Keys",
    description: "Manage access with sophisticated key management systems.",
    icon: "Key",
    color: "#ffd700",
  },
  {
    title: "Cloud Sync",
    description: "Access your vault from anywhere in the realm.",
    icon: "Cloud",
    color: "#ef4444",
  },
  {
    title: "Memory Database",
    description: "Store infinite memories with vector-powered recall.",
    icon: "Database",
    color: "#3b82f6",
  },
  {
    title: "Gem Quality",
    description: "Your treasures are precious gems in the Arcanean crown.",
    icon: "Gem",
    color: "#ec4899",
  },
];

const BENEFITS = [
  "End-to-end encryption for all assets",
  "Guardian-backed security protocols",
  "Automatic versioning and backup",
  "Cross-device synchronization",
  "Advanced search with vector embeddings",
  "Collaborative sharing with permissions",
  "Premium support from Luminors",
  "Early access to new features",
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
export default function ArcaneaVaultPage() {
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
                    <Icons.Vault />
                    <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                      Secure Storage
                    </span>
                  </div>

                  <h1 className="text-fluid-3xl font-display font-bold mb-4">
                    Your Creative
                    <span className="block text-gradient-brand">
                      Arcanea Vault
                    </span>
                  </h1>

                  <p className="text-text-secondary font-body text-lg leading-relaxed mb-8 max-w-2xl">
                    A sanctuary for your most precious creative assets.
                    Protected by Guardians, encrypted with ancient magic, and
                    synced across all your devices.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                    >
                      Open Your Vault
                      <Icons.ArrowRight />
                    </Link>
                    <Link
                      href="/studio"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                    >
                      Explore Features
                      <Icons.ChevronRight />
                    </Link>
                  </div>
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
                  Vault Features
                </h2>
                <h3 className="text-fluid-2xl font-display font-bold">
                  Protected by Ancient Magic
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

            {/* Benefits */}
            <section className="mb-16">
              <div className="liquid-glass rounded-2xl p-8">
                <h2 className="font-display text-2xl font-semibold text-text-primary mb-6 text-center">
                  Vault Benefits
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {BENEFITS.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center shrink-0">
                        <Icons.Check className="w-4 h-4 text-brand-primary" />
                      </div>
                      <span className="text-text-secondary text-sm">
                        {benefit}
                      </span>
                    </div>
                  ))}
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
                    Secure Your Treasures
                  </h2>
                  <p className="text-text-secondary font-body leading-relaxed mb-8">
                    Your creative assets deserve the best protection. Open your
                    Arcanea Vault today and let the Guardians keep watch.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                    >
                      <Icons.Vault />
                      Open Vault
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
