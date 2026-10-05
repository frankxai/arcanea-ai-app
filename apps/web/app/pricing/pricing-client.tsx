"use client";

import { FACTS } from "@/lib/facts";
import Image from "next/image";
import React, { useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Chat,
  ImageSquare,
  PencilSimple,
  Globe,
  GitBranch,
  BookOpen,
  Crown,
  Brain,
  MusicNote,
  Cat,
  Envelope,
  Check,
  Warning,
  CircleNotch,
} from "@/lib/phosphor-icons";
import {
  ACTION_COSTS,
  CREDIT_PACKS,
  PLANS,
  formatEuro,
  type CreditPack,
  type Plan,
} from "@/lib/billing/catalog";

export interface PricingBillingState {
  /** Checkout can be started for both paid plans. */
  live: boolean;
  /** Packs with a configured product id. */
  packsReady: string[];
  sandbox: boolean;
}

const FREE_CAPABILITIES = [
  {
    Icon: Chat,
    name: "AI Chat with Lumina",
    desc: `Unlimited conversations with ${FACTS.luminors} specialist Luminors on your own keys`,
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    Icon: Brain,
    name: "Luminor Forge",
    desc: "Shape custom AI intelligences: name, domain, voice, personality. Export as JSON.",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    Icon: BookOpen,
    name: "The Library",
    desc: "Twenty collections of mythology, philosophy, and creative frameworks",
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
    desc: "Original images in the Arcanean register, on your key or on credits",
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
    desc: "Soundtracks and lo-fi for your worlds",
    accent: "var(--arc-brand-arcanean-gold)",
  },
  {
    Icon: Cat,
    name: "Companions",
    desc: "Summon creatures from the Five Elements. Collectible, evolvable.",
    accent: "var(--arc-void)",
  },
];

type CheckoutState = { sku: string | null; error: string | null };

function useCheckout() {
  const router = useRouter();
  const [state, setState] = useState<CheckoutState>({ sku: null, error: null });

  const start = async (sku: string) => {
    setState({ sku, error: null });
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
        reason?: string;
      };
      if (res.status === 401) {
        router.push(`/auth/login?next=${encodeURIComponent("/pricing")}`);
        return;
      }
      if (!res.ok || !data.url) {
        setState({ sku: null, error: data.error ?? "Checkout could not be started." });
        return;
      }
      window.location.assign(data.url);
    } catch {
      setState({ sku: null, error: "Something went wrong. Please check your connection." });
    }
  };

  return { state, start };
}

function PlanCard({
  plan,
  live,
  busy,
  onBuy,
}: {
  plan: Plan;
  live: boolean;
  busy: boolean;
  onBuy: (sku: string) => void;
}) {
  const isFree = plan.priceCents === 0;
  const canBuy = !isFree && live;

  return (
    <div
      className={`relative rounded-3xl border p-6 backdrop-blur-sm flex flex-col justify-between transition-all duration-300 ${
        plan.featured
          ? "border-[var(--arc-brand-arcanean-gold)]/40 bg-[var(--arc-brand-arcanean-gold)]/[0.02] shadow-[0_8px_30px_rgba(255,215,0,0.04)]"
          : "border-white/[0.06] bg-white/[0.015] hover:border-white/[0.12]"
      }`}
    >
      {plan.featured && (
        <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-[var(--arc-brand-arcanean-gold)] text-black text-[9px] font-mono uppercase font-bold tracking-wider">
          Most creators
        </span>
      )}
      <div>
        <h3 className="font-display text-lg font-bold text-white/90">{plan.name}</h3>
        <div className="flex items-baseline gap-2 mt-4 mb-2">
          <span className="text-4xl font-display font-bold text-white">
            {formatEuro(plan.priceCents)}
          </span>
          <span className="text-xs text-white/40 font-mono lowercase">
            {isFree ? "forever" : "per month, VAT included"}
          </span>
        </div>
        <p className="text-xs text-white/50 leading-relaxed font-body mb-6">{plan.tagline}</p>

        <ul className="space-y-3 border-t border-white/[0.04] pt-6 mb-8">
          {plan.features.map((feat) => (
            <li key={feat} className="flex items-start gap-2.5 text-xs text-white/70">
              <Check className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {isFree ? (
        <Link
          href="/auth/signup"
          className="w-full py-3 rounded-xl border border-white/[0.12] text-xs font-semibold text-center text-white/80 hover:bg-white/[0.04] transition-colors"
        >
          Start free
        </Link>
      ) : canBuy ? (
        <button
          type="button"
          onClick={() => onBuy(plan.id)}
          disabled={busy}
          className={`w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 ${
            plan.featured
              ? "bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)] to-[var(--arc-brand-atlantean-teal)] text-black hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]"
              : "border border-white/[0.12] text-white/80 hover:bg-white/[0.04]"
          }`}
        >
          {busy ? <CircleNotch className="w-4 h-4 animate-spin" /> : <span>Choose {plan.name}</span>}
        </button>
      ) : (
        <a
          href="#founding-circle"
          className="w-full py-3 rounded-xl border border-dashed border-white/[0.14] text-xs font-semibold text-center text-white/60 hover:bg-white/[0.04] transition-colors"
        >
          Checkout opens soon. Reserve founding pricing
        </a>
      )}
    </div>
  );
}

function PackCard({
  pack,
  ready,
  busy,
  onBuy,
}: {
  pack: CreditPack;
  ready: boolean;
  busy: boolean;
  onBuy: (sku: string) => void;
}) {
  const perCredit = (pack.priceCents / pack.credits).toFixed(2);
  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col gap-3 ${
        pack.popular
          ? "border-[var(--arc-brand-atlantean-teal)]/40 bg-[var(--arc-brand-atlantean-teal)]/[0.03]"
          : "border-white/[0.06] bg-white/[0.015]"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <span className="font-display text-2xl font-bold text-white">
          {pack.credits.toLocaleString("en-US")}
        </span>
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">credits</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-display font-semibold text-white/90">{formatEuro(pack.priceCents)}</span>
        <span className="text-[10px] font-mono text-white/40">{perCredit} ct per credit</span>
      </div>
      {ready ? (
        <button
          type="button"
          onClick={() => onBuy(pack.id)}
          disabled={busy}
          className="mt-auto py-2.5 rounded-xl border border-white/[0.12] text-xs font-semibold text-white/80 hover:bg-white/[0.04] transition-colors disabled:opacity-50"
        >
          {busy ? <CircleNotch className="w-4 h-4 animate-spin mx-auto" /> : "Buy credits"}
        </button>
      ) : (
        <span className="mt-auto py-2.5 rounded-xl border border-dashed border-white/[0.1] text-[11px] text-center text-white/40">
          Available with checkout
        </span>
      )}
    </div>
  );
}

export function PricingClient({ billing }: { billing: PricingBillingState }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const checkout = useCheckout();

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
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please check your connection.");
    }
  };

  const visibleCosts = ACTION_COSTS.filter((a) => a.credits > 0);

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative bg-[var(--arc-cosmic-void)] min-h-screen text-white pb-24">
        <div className="fixed inset-0 -z-10 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(167,139,250,0.06),transparent_50%)] pointer-events-none" />

        <main className="max-w-7xl mx-auto px-6 pt-20">
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
                {billing.live
                  ? billing.sandbox
                    ? "Checkout in sandbox"
                    : "Checkout open"
                  : "Founding pricing, checkout opening"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4">
              Your keys are free.
              <span className="block bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-arcanean-gold)] to-[var(--arc-brand-cosmic-blue)] bg-clip-text text-transparent mt-1">
                Continuity is what you pay for.
              </span>
            </h1>

            <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed font-body">
              Bring your own API keys and build for nothing, forever. A plan keeps the memory of
              your world alive across sessions and publishes it under your name. Credits buy
              generation on our keys when you would rather not manage your own.
            </p>
          </section>

          <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                live={billing.live}
                busy={checkout.state.sku === plan.id}
                onBuy={checkout.start}
              />
            ))}
          </section>

          {checkout.state.error && (
            <p className="flex items-center justify-center gap-2 text-xs text-red-400 mb-10">
              <Warning className="w-3.5 h-3.5" />
              {checkout.state.error}
            </p>
          )}

          <section className="max-w-5xl mx-auto mb-20 grid lg:grid-cols-[1.1fr_1fr] gap-8">
            <div>
              <h2 className="text-xl font-display font-semibold mb-1">Credits, when you want our keys</h2>
              <p className="text-xs text-white/45 font-body mb-5">
                One credit is about one cent of provider cost. Credits never expire. Bring your own
                key and every action below costs nothing.
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                {CREDIT_PACKS.map((pack) => (
                  <PackCard
                    key={pack.id}
                    pack={pack}
                    ready={billing.live && billing.packsReady.includes(pack.id)}
                    busy={checkout.state.sku === pack.id}
                    onBuy={checkout.start}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
              <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">
                What a credit buys
              </h3>
              <ul className="divide-y divide-white/[0.05]">
                {visibleCosts.map((cost) => (
                  <li key={cost.id} className="flex items-center justify-between py-2.5 text-xs">
                    <span className="text-white/70">{cost.label}</span>
                    <span className="font-mono text-white/90">
                      {cost.credits} <span className="text-white/35">/ {cost.unit}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="founding-circle" className="max-w-3xl mx-auto mb-20 scroll-mt-24">
            <div className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0c0d12]/90 to-[#050608]/95 p-8 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--arc-brand-arcanean-gold)]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--arc-brand-atlantean-teal)]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-md">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--arc-brand-arcanean-gold)]/10 border border-[var(--arc-brand-arcanean-gold)]/20 mb-4">
                    <Crown size={12} className="text-[var(--arc-brand-arcanean-gold)]" />
                    <span className="text-[9px] font-mono text-[var(--arc-brand-arcanean-gold)] uppercase tracking-wider font-bold">
                      Founding Circle
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-3">
                    First hundred creators
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed font-body mb-4">
                    The first hundred paying creators keep a permanent 40% discount on Creator and
                    Studio, a direct line to the developer, and early access to every new
                    generation surface.
                    {!billing.live && " Leave your email and we open checkout to you first."}
                  </p>
                  <ul className="space-y-2 text-[11px] text-white/60 font-mono">
                    <li className="flex items-center gap-2">
                      <span className="text-[var(--arc-brand-arcanean-gold)]">✦</span>
                      Permanent lifetime discount
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[var(--arc-brand-arcanean-gold)]">✦</span>
                      Private founder channel
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
                        <h4 className="font-semibold text-sm">You are on the list.</h4>
                        <p className="text-[11px] text-green-300/70 font-body">
                          Watch your inbox. Founding pricing is yours when checkout opens.
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
                            Reserve founding pricing
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your creator email"
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
                              <span>Reserve my place</span>
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

          <section className="pb-20 border-t border-white/[0.04] pt-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-display font-semibold mb-2">Free on your own keys</h2>
              <p className="text-sm text-white/40 font-body">
                Every creation surface works with the API keys you already have.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {FREE_CAPABILITIES.map(({ Icon, name, desc, accent }) => (
                <div
                  key={name}
                  className="flex gap-3.5 p-5 rounded-2xl bg-white/[0.015] border border-white/[0.05] hover:border-white/[0.1] transition-all hover:bg-white/[0.03]"
                >
                  <Icon size={20} weight="duotone" style={{ color: accent, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h3 className="font-semibold text-sm mb-1 text-white/90">{name}</h3>
                    <p className="text-white/40 text-xs leading-relaxed font-body">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="py-16 border-t border-white/[0.04]">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-display font-semibold mb-2">Open where it matters</h2>
              <p className="text-sm text-white/45 max-w-lg mx-auto font-body">
                The MCP server, the skills, and the world engine are open source. Your worlds export
                as Markdown and JSON at any time. Your canon stays yours.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
              {[
                { num: String(FACTS.mcpTools), label: "MCP tools" },
                { num: String(FACTS.skills), label: "Creator skills" },
                { num: String(FACTS.luminors), label: "Luminors" },
              ].map(({ num, label }) => (
                <div
                  key={label}
                  className="text-center p-6 rounded-2xl bg-white/[0.015] border border-white/[0.06]"
                >
                  <div className="text-3xl font-display font-bold text-[var(--arc-brand-atlantean-teal)] mb-1">
                    {num}
                  </div>
                  <div className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="https://github.com/frankxai/arcanea"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.12] text-xs font-semibold uppercase tracking-wider text-white/70 hover:bg-white/[0.04] transition-colors"
              >
                <GitBranch size={14} />
                <span>Browse the source</span>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </LazyMotion>
  );
}
