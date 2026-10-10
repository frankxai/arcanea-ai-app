"use client";

import { FACTS } from "@/lib/facts";
import Image from "next/image";
import React, { useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
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
    desc: "Managed images use credits. BYOK images are planned.",
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
        setState({
          sku: null,
          error: data.error ?? "Checkout could not be started.",
        });
        return;
      }
      window.location.assign(data.url);
    } catch {
      setState({
        sku: null,
        error: "Something went wrong. Please check your connection.",
      });
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
          ? "border-[var(--arc-brand-arcanean-gold)]/40 bg-[var(--arc-brand-arcanean-gold)]/[0.02] shadow-[var(--arc-shadow-elevation-1)]"
          : "border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-surface)] hover:border-[var(--arc-cosmic-border-bright)]"
      }`}
    >
      {plan.featured && (
        <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-[var(--arc-brand-arcanean-gold)] text-[var(--arc-cosmic-void)] text-[9px] font-mono font-bold tracking-wider">
          Creator plan
        </span>
      )}
      <div>
        <h3 className="font-display text-lg font-bold text-[var(--arc-text-primary)]">
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-4 mb-2">
          <span className="text-4xl font-display font-bold text-[var(--arc-text-primary)]">
            {formatEuro(plan.priceCents)}
          </span>
          <span className="text-xs text-[var(--arc-text-secondary)] font-mono lowercase">
            {isFree ? "forever" : "per month, VAT included"}
          </span>
        </div>
        <p className="text-xs text-[var(--arc-text-secondary)] leading-relaxed font-body mb-6">
          {plan.tagline}
        </p>

        {!isFree && !live && (
          <p className="text-sm text-[var(--arc-text-secondary)] mb-3">
            Planned capabilities; checkout is closed.
          </p>
        )}
        <ul className="space-y-3 border-t border-[var(--arc-cosmic-border-bright)] pt-6 mb-8">
          {plan.features.map((feat) => (
            <li
              key={feat}
              className="flex items-start gap-2.5 text-xs text-[var(--arc-text-primary)]"
            >
              <Check className="w-4 h-4 text-[var(--arc-text-secondary)] shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {isFree ? (
        <Link
          href="/auth/signup"
          className="w-full min-h-11 flex items-center justify-center py-3 rounded-xl border border-[var(--arc-cosmic-border-bright)] text-xs font-semibold text-center text-[var(--arc-text-primary)] hover:bg-[var(--arc-cosmic-surface)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
        >
          Start free
        </Link>
      ) : canBuy ? (
        <button
          type="button"
          onClick={() => onBuy(plan.id)}
          disabled={busy}
          className={`w-full min-h-11 flex items-center justify-center py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--arc-brand-atlantean-teal)] motion-reduce:transition-none disabled:opacity-50 ${
            plan.featured
              ? "bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)] to-[var(--arc-brand-atlantean-teal)] text-[var(--arc-cosmic-void)] hover:shadow-[var(--arc-shadow-gold-glow)]"
              : "border border-[var(--arc-cosmic-border-bright)] text-[var(--arc-text-primary)] hover:bg-[var(--arc-cosmic-surface)]"
          }`}
        >
          {busy ? (
            <CircleNotch className="w-4 h-4 animate-spin" />
          ) : (
            <span>Choose {plan.name}</span>
          )}
        </button>
      ) : (
        <a
          href="#founding-circle"
          className="w-full min-h-11 flex items-center justify-center py-3 rounded-xl border border-dashed border-[var(--arc-cosmic-border-bright)] text-xs font-semibold text-center text-[var(--arc-text-secondary)] hover:bg-[var(--arc-cosmic-surface)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
        >
          Join the release list
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
          : "border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-surface)]"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <span className="font-display text-2xl font-bold text-[var(--arc-text-primary)]">
          {pack.credits.toLocaleString("en-US")}
        </span>
        <span className="text-[10px] font-mono text-[var(--arc-text-secondary)] tracking-widest">
          credits
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-display font-semibold text-[var(--arc-text-primary)]">
          {formatEuro(pack.priceCents)}
        </span>
        <span className="text-[10px] font-mono text-[var(--arc-text-secondary)]">
          {perCredit} ct per credit
        </span>
      </div>
      {ready ? (
        <button
          type="button"
          onClick={() => onBuy(pack.id)}
          disabled={busy}
          className="mt-auto min-h-11 py-2.5 rounded-xl border border-[var(--arc-cosmic-border-bright)] text-xs font-semibold text-[var(--arc-text-primary)] hover:bg-[var(--arc-cosmic-surface)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--arc-brand-atlantean-teal)] disabled:opacity-50"
        >
          {busy ? (
            <CircleNotch className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "Buy credits"
          )}
        </button>
      ) : (
        <span className="mt-auto min-h-11 py-2.5 rounded-xl border border-dashed border-[var(--arc-cosmic-border-bright)] text-[11px] text-center text-[var(--arc-text-secondary)]">
          Available with checkout
        </span>
      )}
    </div>
  );
}

export function PricingClient({ billing }: { billing: PricingBillingState }) {
  const reducedMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
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
      <div className="relative bg-[var(--arc-cosmic-void)] min-h-screen text-[var(--arc-text-primary)] pb-24">
        <main className="max-w-7xl mx-auto px-6 pt-20">
          <section className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/mascot/arcanea-crossed-arms.png"
                alt="Arcanea Mascot"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--arc-brand-atlantean-teal)]/20 bg-[var(--arc-brand-atlantean-teal)]/6 mb-6">
              <GitBranch
                size={12}
                className="text-[var(--arc-brand-atlantean-teal)]"
              />
              <span className="text-[10px] font-mono text-[var(--arc-brand-atlantean-teal)] tracking-widest">
                {billing.live
                  ? billing.sandbox
                    ? "Checkout in sandbox"
                    : "Checkout open"
                  : "Plans in preparation"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4">
              Your keys are free.
              <span className="block text-[var(--arc-brand-arcanean-gold)] mt-1">
                Continuity is what you pay for.
              </span>
            </h1>

            <p className="text-base md:text-lg text-[var(--arc-text-secondary)] max-w-2xl mx-auto leading-relaxed font-body">
              Use your own keys for chat and worlds, or credits for managed
              images. Hosted plans are in preparation.
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
            <p className="flex items-center justify-center gap-2 text-xs text-[var(--arc-fire)] mb-10">
              <Warning className="w-3.5 h-3.5" />
              {checkout.state.error}
            </p>
          )}

          <section className="max-w-5xl mx-auto mb-20 grid lg:grid-cols-[1.1fr_1fr] gap-8">
            <div>
              <h2 className="text-xl font-display font-semibold mb-1">
                Credits, when you want our keys
              </h2>
              <p className="text-xs text-[var(--arc-text-secondary)] font-body mb-5">
                Managed images use credits. The other metered actions and their
                rates are planned. Credits do not expire.
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
            <div className="rounded-2xl border border-[var(--arc-cosmic-border-bright)] bg-[var(--arc-cosmic-surface)] p-5">
              <h3 className="text-[10px] font-mono text-[var(--arc-text-secondary)] tracking-widest mb-4">
                Image costs and planned rates
              </h3>
              <ul className="divide-y divide-[var(--arc-cosmic-border-bright)]">
                {visibleCosts.map((cost) => (
                  <li
                    key={cost.id}
                    className="flex items-center justify-between py-2.5 text-xs"
                  >
                    <span className="text-[var(--arc-text-primary)]">
                      {cost.label}
                    </span>
                    <span className="font-mono text-[var(--arc-text-primary)]">
                      {cost.credits}{" "}
                      <span className="text-[var(--arc-text-secondary)]">
                        / {cost.unit}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            id="founding-circle"
            className="max-w-3xl mx-auto mb-20 scroll-mt-24"
          >
            <div className="relative rounded-3xl border border-[var(--arc-cosmic-border-bright)] bg-gradient-to-br from-[var(--arc-cosmic-deep)] to-[var(--arc-cosmic-void)] p-8 md:p-12 shadow-[var(--arc-shadow-elevation-3)] overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--arc-brand-arcanean-gold)]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--arc-brand-atlantean-teal)]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-md">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--arc-brand-arcanean-gold)]/10 border border-[var(--arc-brand-arcanean-gold)]/20 mb-4">
                    <Crown
                      size={12}
                      className="text-[var(--arc-brand-arcanean-gold)]"
                    />
                    <span className="text-[9px] font-mono text-[var(--arc-brand-arcanean-gold)] tracking-wider font-bold">
                      Founding Circle
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-3">
                    Follow the release
                  </h3>
                  <p className="text-xs text-[var(--arc-text-secondary)] leading-relaxed font-body mb-4">
                    Leave your email for release updates and confirmed plan
                    availability. Joining this list does not reserve a purchase
                    or a discount.
                  </p>
                  <ul className="space-y-2 text-[11px] text-[var(--arc-text-secondary)] font-mono">
                    <li className="flex items-center gap-2">
                      <span className="text-[var(--arc-brand-arcanean-gold)]">
                        <Check className="w-4 h-4" aria-hidden="true" />
                      </span>
                      Release updates
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[var(--arc-brand-arcanean-gold)]">
                        <Check className="w-4 h-4" aria-hidden="true" />
                      </span>
                      Confirmed pricing and availability
                    </li>
                  </ul>
                </div>

                <div className="w-full md:w-80 shrink-0">
                  <AnimatePresence mode="wait">
                    {status === "success" ? (
                      <m.div
                        role="status"
                        aria-live="polite"
                        initial={
                          reducedMotion ? false : { opacity: 0, scale: 0.95 }
                        }
                        animate={{ opacity: 1, scale: 1 }}
                        exit={reducedMotion ? undefined : { opacity: 0 }}
                        transition={{
                          duration: reducedMotion ? 0 : 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="rounded-2xl border border-[var(--arc-brand-atlantean-teal)]/25 bg-[var(--arc-brand-atlantean-teal)]/5 p-6 text-center flex flex-col items-center justify-center gap-3 backdrop-blur-sm"
                      >
                        <div className="w-12 h-12 rounded-full bg-[var(--arc-brand-atlantean-teal)]/20 flex items-center justify-center border border-[var(--arc-brand-atlantean-teal)]/30">
                          <Check className="w-6 h-6 text-[var(--arc-brand-atlantean-teal)]" />
                        </div>
                        <h4 className="font-semibold text-sm">
                          You are on the list.
                        </h4>
                        <p className="text-xs text-[var(--arc-text-secondary)] font-body">
                          We will email you when plans are available.
                        </p>
                      </m.div>
                    ) : (
                      <m.form
                        onSubmit={handleWaitlistSubmit}
                        initial={reducedMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: reducedMotion ? 0 : 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="space-y-3"
                      >
                        <div>
                          <label
                            htmlFor="release-email"
                            className="block text-sm font-mono text-[var(--arc-text-secondary)] mb-2"
                          >
                            Email for release updates
                          </label>
                          <input
                            id="release-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your creator email"
                            className="w-full bg-[var(--arc-cosmic-surface)] border border-[var(--arc-cosmic-border-bright)] rounded-xl p-3 text-xs focus:outline-none focus:border-[var(--arc-brand-arcanean-gold)]/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--arc-brand-atlantean-teal)] text-[var(--arc-text-primary)] placeholder-[var(--arc-text-secondary)] font-body"
                          />
                        </div>

                        {status === "error" && (
                          <div
                            role="alert"
                            className="flex gap-2 text-xs text-[var(--arc-fire)] items-start"
                          >
                            <Warning className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{errorMessage}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="w-full min-h-11 flex items-center justify-center py-3 rounded-xl bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)] to-[var(--arc-brand-atlantean-teal)] text-[var(--arc-cosmic-void)] font-semibold text-xs flex items-center justify-center gap-2 hover:shadow-[var(--arc-shadow-gold-glow)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--arc-brand-atlantean-teal)] motion-reduce:transition-none disabled:opacity-50"
                        >
                          {status === "loading" ? (
                            <CircleNotch className="w-4 h-4 animate-spin text-[var(--arc-cosmic-void)]" />
                          ) : (
                            <>
                              <Envelope className="w-4 h-4 text-[var(--arc-cosmic-void)]" />
                              <span>Join the release list</span>
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

          <section className="pb-20 border-t border-[var(--arc-cosmic-border-bright)] pt-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-display font-semibold mb-2">
                The creator workspace
              </h2>
              <p className="text-sm text-[var(--arc-text-secondary)] font-body">
                Every creation surface works with the API keys you already have.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {FREE_CAPABILITIES.map(({ Icon, name, desc, accent }) => (
                <div
                  key={name}
                  className="flex gap-3.5 p-5 rounded-2xl bg-[var(--arc-cosmic-surface)] border border-[var(--arc-cosmic-border-bright)] hover:border-[var(--arc-cosmic-border-bright)] transition-all hover:bg-[var(--arc-cosmic-surface)]"
                >
                  <Icon
                    size={20}
                    weight="duotone"
                    style={{ color: accent, flexShrink: 0, marginTop: 2 }}
                  />
                  <div>
                    <h3 className="font-semibold text-sm mb-1 text-[var(--arc-text-primary)]">
                      {name}
                    </h3>
                    <p className="text-[var(--arc-text-secondary)] text-xs leading-relaxed font-body">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="py-16 border-t border-[var(--arc-cosmic-border-bright)]">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-display font-semibold mb-2">
                Open where it matters
              </h2>
              <p className="text-sm text-[var(--arc-text-secondary)] max-w-lg mx-auto font-body">
                The MCP server, the skills, and the world engine are open
                source. Your worlds export as Markdown and JSON at any time.
                Your canon stays yours.
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
                  className="text-center p-6 rounded-2xl bg-[var(--arc-cosmic-surface)] border border-[var(--arc-cosmic-border-bright)]"
                >
                  <div className="text-3xl font-display font-bold text-[var(--arc-brand-atlantean-teal)] mb-1">
                    {num}
                  </div>
                  <div className="text-xs font-mono text-[var(--arc-text-secondary)] tracking-widest mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="https://github.com/frankxai/arcanea"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--arc-cosmic-border-bright)] text-xs font-semibold tracking-wider text-[var(--arc-text-primary)] hover:bg-[var(--arc-cosmic-surface)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
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
