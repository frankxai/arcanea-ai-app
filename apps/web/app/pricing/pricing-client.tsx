"use client";

import { FACTS } from "@/lib/facts";
import Image from "next/image";
import React, { useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Chat,
  ImageSquare,
  PencilSimple,
  Globe,
  Code,
  GitBranch,
  BookOpen,
  Users,
  Lightning,
  Crown,
  Star,
  ArrowRight,
  Brain,
  Sparkle,
  MusicNote,
  Cat,
  Diamond,
  Coins,
  Envelope,
  Check,
  Warning,
  CircleNotch,
} from "@/lib/phosphor-icons";

const TIERS = [
  {
    id: "sovereign",
    name: "Sovereign Engine",
    price: "$0",
    period: "free open core",
    desc: "Your data stays yours. Run completely offline on local file trees.",
    accent: "var(--arc-brand-atlantean-teal)",
    features: [
      "Bring Your Own Key (BYOK)",
      "Local Markdown / JSONML storage",
      `Core AI chat with ${FACTS.luminors} Luminors`,
      "Standard local zip exports",
      "54 open-source CLI tools & skills",
    ],
  },
  {
    id: "creator",
    name: "Cloud Sync (Creator)",
    price: "$12",
    period: "per month",
    desc: "Convenience SaaS layer. Auto-sync, collab, and semantic search.",
    accent: "var(--arc-brand-arcanean-gold)",
    featured: true,
    features: [
      "Everything in Sovereign",
      "Encrypted cloud sync & backups",
      "Semantic search across your worlds",
      "Multiplayer Canvas collaboration",
      "500 monthly Cloud Bench credits",
    ],
  },
  {
    id: "studio",
    name: "Studio Bench",
    price: "$39",
    period: "per month",
    desc: "Advanced team workspaces, customization, and high-frequency runs.",
    accent: "var(--arc-brand-cosmic-blue)",
    features: [
      "Everything in Creator",
      "Shared team workspaces & roles",
      "Custom companion model tuning",
      "2,500 monthly Cloud Bench credits",
      "Dedicated API key access endpoint",
    ],
  },
];

const FREE_CAPABILITIES = [
  {
    Icon: Chat,
    name: "AI Chat with Lumina",
    desc: "Unlimited conversations with 13 specialist Luminors",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    Icon: Brain,
    name: "Luminor Forge",
    desc: "Shape custom AI intelligences — name, domain, voice, personality. Export as JSON.",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    Icon: BookOpen,
    name: "The Library",
    desc: "486,000+ words of mythology, philosophy, and creative frameworks",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    Icon: Globe,
    name: "World Building",
    desc: "Characters, locations, magic systems, entire universes",
    accent: "var(--arc-brand-cosmic-blue)",
  },
  {
    Icon: ImageSquare,
    name: "Image Generation",
    desc: "Original images from the Arcanean framework",
    accent: "var(--arc-void)",
  },
  {
    Icon: PencilSimple,
    name: "Story Writing",
    desc: "Chapters, lore entries, and narratives with AI",
    accent: "var(--arc-fire)",
  },
  {
    Icon: MusicNote,
    name: "Music Composition",
    desc: "AI-generated soundtracks and lo-fi for your worlds",
    accent: "var(--arc-brand-arcanean-gold)",
  },
  {
    Icon: Cat,
    name: "Companions",
    desc: "Summon creatures from the Five Elements. Collectible, evolvable.",
    accent: "var(--arc-void)",
  },
];

export function PricingClient() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to join waitlist.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please check your connection.");
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative bg-[var(--arc-cosmic-void)] min-h-screen text-white pb-24">
        {/* Background mesh */}
        <div className="fixed inset-0 -z-10 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(167,139,250,0.06),transparent_50%)] pointer-events-none" />

        <main className="max-w-7xl mx-auto px-6 pt-20">
          {/* Hero */}
          <section className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/mascot/arcanea-crossed-arms.png"
                alt="Arcanea Mascot"
                width={120}
                height={120}
                className="object-contain drop-shadow-[0_0_30px_rgba(127,255,212,0.15)] animate-[mascot-float_3.5s_ease-in-out_infinite]"
              />
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--arc-brand-atlantean-teal)]/20 bg-[var(--arc-brand-atlantean-teal)]/6 mb-6">
              <GitBranch size={12} className="text-[var(--arc-brand-atlantean-teal)]" />
              <span className="text-[10px] font-mono text-[var(--arc-brand-atlantean-teal)] uppercase tracking-widest">
                Sovereign core · optional cloud
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4">
              Sovereign by default.
              <span className="block bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-arcanean-gold)] to-[var(--arc-brand-cosmic-blue)] bg-clip-text text-transparent mt-1">
                SaaS by choice.
              </span>
            </h1>

            <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed font-body">
              Your API keys remain in your browser. Your world graphs, lore bibles, and files remain on your disk. Free and open. Pay only when you want the convenience of encrypted cloud sync, semantic search, and multiplayer bench runs.
            </p>
          </section>

          {/* Pricing Tiers Grid */}
          <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-3xl border p-6 backdrop-blur-sm flex flex-col justify-between transition-all duration-300 ${
                  tier.featured
                    ? "border-[var(--arc-brand-arcanean-gold)]/40 bg-[var(--arc-brand-arcanean-gold)]/[0.02] shadow-[0_8px_30px_rgba(255,215,0,0.04)]"
                    : "border-white/[0.06] bg-white/[0.015] hover:border-white/[0.12]"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-[var(--arc-brand-arcanean-gold)] text-black text-[9px] font-mono uppercase font-bold tracking-wider">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="font-display text-lg font-bold text-white/90">{tier.name}</h3>
                  <div className="flex items-baseline gap-2 mt-4 mb-2">
                    <span className="text-4xl font-display font-bold text-white">{tier.price}</span>
                    <span className="text-xs text-white/40 font-mono lowercase">{tier.period}</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-body mb-6">{tier.desc}</p>
                  
                  <ul className="space-y-3 border-t border-white/[0.04] pt-6 mb-8">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-white/70">
                        <Check className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </section>

          {/* ─── Founding Circle Waitlist Card (SOTA Funnel) ─── */}
          <section className="max-w-3xl mx-auto mb-20">
            <div className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0c0d12]/90 to-[#050608]/95 p-8 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden">
              {/* Decorative glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--arc-brand-arcanean-gold)]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--arc-brand-atlantean-teal)]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-md">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--arc-brand-arcanean-gold)]/10 border border-[var(--arc-brand-arcanean-gold)]/20 mb-4">
                    <Crown size={12} className="text-[var(--arc-brand-arcanean-gold)]" />
                    <span className="text-[9px] font-mono text-[var(--arc-brand-arcanean-gold)] uppercase tracking-wider font-bold">
                      Limited Pre-Launch
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-3">
                    Join the Founding Circle
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed font-body mb-4">
                    The first 100 creators to join the waitlist secure a permanent **40% lifetime discount** on all sync plans, direct advisory access to the developer, and priority beta access.
                  </p>
                  <ul className="space-y-2 text-[11px] text-white/60 font-mono">
                    <li className="flex items-center gap-2">
                      <span className="text-[var(--arc-brand-arcanean-gold)]">✦</span>
                      Permanent lifetime discount
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[var(--arc-brand-arcanean-gold)]">✦</span>
                      Private Discord channels
                    </li>
                  </ul>
                </div>

                <div className="w-full md:w-80 shrink-0">
                  <AnimatePresence mode="wait">
                    {status === "success" ? (
                      <m.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-2xl border border-green-500/25 bg-green-500/5 p-6 text-center flex flex-col items-center justify-center gap-3 backdrop-blur-sm"
                      >
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                          <Check className="w-6 h-6 text-green-400" />
                        </div>
                        <h4 className="font-semibold text-sm">Welcome aboard!</h4>
                        <p className="text-[11px] text-green-300/70 font-body">
                          You are locked into the Founding waitlist. Watch your inbox for access details.
                        </p>
                      </m.div>
                    ) : (
                      <m.form
                        onSubmit={handleWaitlistSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                      >
                        <div>
                          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">
                            Secure your access
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your creator email..."
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs focus:outline-none focus:border-[var(--arc-brand-arcanean-gold)]/50 transition-colors text-white placeholder-white/30 font-body"
                          />
                        </div>

                        {status === "error" && (
                          <div className="flex gap-2 text-[10px] text-red-400 items-start">
                            <Warning className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{errorMessage}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)] to-[var(--arc-brand-atlantean-teal)] text-black font-semibold text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                          {status === "loading" ? (
                            <CircleNotch className="w-4 h-4 animate-spin text-black" />
                          ) : (
                            <>
                              <Envelope className="w-4 h-4 text-black" />
                              <span>Join waitlist</span>
                            </>
                          )}
                        </button>
                      </m.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Free Capabilities Grid ─── */}
          <section className="pb-20 border-t border-white/[0.04] pt-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-display font-semibold mb-2">
                Included in Free Open Core
              </h2>
              <p className="text-sm text-white/40 font-body">
                Full local creation power. No boundaries on your imagination.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {FREE_CAPABILITIES.map(({ Icon, name, desc, accent }) => (
                <div
                  key={name}
                  className="flex gap-3.5 p-5 rounded-2xl bg-white/[0.015] border border-white/[0.05] hover:border-white/[0.1] transition-all hover:bg-white/[0.03]"
                >
                  <Icon
                    size={20}
                    weight="duotone"
                    style={{ color: accent, flexShrink: 0, marginTop: 2 }}
                  />
                  <div>
                    <h3 className="font-semibold text-sm mb-1 text-white/90">{name}</h3>
                    <p className="text-white/40 text-xs leading-relaxed font-body">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Open Source Arsenal ─── */}
          <section className="py-16 border-t border-white/[0.04]">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-display font-semibold mb-2">
                Fully Open Source Foundation
              </h2>
              <p className="text-sm text-white/45 max-w-lg mx-auto font-body">
                Extend, modify, or run your own instance. Every layer is built on open standards.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
              {[
                { num: "27", label: "Repositories" },
                { num: "35", label: "npm Packages" },
                { num: "54", label: "Agent Skills" },
              ].map(({ num, label }) => (
                <div
                  key={label}
                  className="text-center p-6 rounded-2xl bg-white/[0.015] border border-white/[0.06]"
                >
                  <div className="text-3xl font-display font-bold text-[var(--arc-brand-atlantean-teal)] mb-1">{num}</div>
                  <div className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="https://github.com/frankxai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.12] text-xs font-semibold uppercase tracking-wider text-white/70 hover:bg-white/[0.04] transition-colors"
              >
                <GitBranch size={14} />
                <span>Browse GitHub</span>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </LazyMotion>
  );
}
