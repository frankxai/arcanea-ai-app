"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { submitWaitlist } from "@/lib/waitlist/submit";

const TIERS = [
  {
    id: "sovereign",
    name: "Sovereign engine",
    price: "$0",
    period: "proposed free tier",
    description: "For individual creators working on their own worlds.",
    features: ["Bring your own model key", "Local files and exports"],
  },
  {
    id: "creator",
    name: "Cloud sync (Creator)",
    price: "$12",
    period: "proposed monthly price",
    description: "For creators who want to continue work across devices.",
    features: ["Cloud sync and backups", "Search across world material"],
  },
  {
    id: "studio",
    name: "Studio bench",
    price: "$39",
    period: "proposed monthly price",
    description: "For teams developing a shared world or story.",
    features: ["Shared workspaces and roles", "Team creation workflows"],
  },
];

const linkStyle =
  "inline-flex rounded-xl border border-white/20 px-5 py-3 text-sm text-white hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--arc-brand-atlantean-teal)]";

export function PricingClient() {
  const emailId = useId();
  const statusId = useId();
  const pending = useRef(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleWaitlistSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || !email.trim()) return;
    pending.current = true;
    setStatus("loading");
    setMessage("Saving your interest…");
    try {
      const result = await submitWaitlist(email, "pricing_founding_circle");
      if (result.success) {
        setEmail("");
        setStatus("success");
        setMessage("Your email is on the Arcanea interest list.");
      } else {
        setStatus("error");
        setMessage(result.error);
      }
    } finally {
      pending.current = false;
    }
  }

  return (
    <main className="min-h-screen bg-[var(--arc-cosmic-void)] px-6 pb-24 pt-20 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 max-w-2xl">
          <p className="mb-4 font-mono text-sm text-[var(--arc-brand-atlantean-teal)]">
            Plans under consideration
          </p>
          <h1 className="mb-5 font-display text-4xl font-semibold tracking-tight md:text-6xl">
            Help shape Arcanea’s creator plans
          </h1>
          <p className="text-base leading-relaxed text-white/70">
            These prices and features are proposals. Paid plans are not open for
            purchase. Register your interest while Arcanea works through release
            and pricing decisions.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#plan-interest" className={linkStyle}>
              Register interest
            </a>
            <Link href="/worlds" className={linkStyle}>
              Explore worlds
            </Link>
          </div>
        </header>

        <section aria-labelledby="plan-options" className="mb-16">
          <h2 id="plan-options" className="mb-6 font-display text-2xl">
            Proposed plans
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {TIERS.map((tier) => (
              <article
                key={tier.id}
                className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm"
              >
                <h3 className="font-display text-lg font-semibold">
                  {tier.name}
                </h3>
                <p className="mb-1 mt-5 font-display text-4xl">{tier.price}</p>
                <p className="mb-5 text-sm text-white/70">{tier.period}</p>
                <p className="mb-6 text-sm leading-relaxed text-white/70">
                  {tier.description}
                </p>
                <p className="mb-3 text-sm font-semibold">
                  Under consideration
                </p>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/70">
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/70">
            Final availability, features and terms will be published with each
            released plan. Signup does not reserve a price, discount or access.
          </p>
        </section>

        <section
          id="plan-interest"
          aria-labelledby="interest-heading"
          className="mb-16 scroll-mt-24 rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm md:p-10"
        >
          <div className="grid items-start gap-8 md:grid-cols-2">
            <div>
              <h2 id="interest-heading" className="mb-4 font-display text-2xl">
                Register interest in creator plans
              </h2>
              <p className="text-sm leading-relaxed text-white/70">
                Add your email to Arcanea’s shared interest list. This form
                saves your interest; it does not create an account or start a
                paid plan.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Read the{" "}
                <Link href="/privacy" className="underline underline-offset-4">
                  privacy policy
                </Link>{" "}
                before submitting.
              </p>
            </div>
            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
              <label htmlFor={emailId} className="block text-sm font-medium">
                Email address
              </label>
              <input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={320}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                readOnly={status === "loading"}
                aria-describedby={statusId}
                className="w-full rounded-xl border border-white/20 bg-white/[0.03] p-3 text-base text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-xl bg-[var(--arc-brand-atlantean-teal)] px-5 py-3 text-sm font-semibold text-[var(--arc-cosmic-void)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--arc-brand-atlantean-teal)] disabled:opacity-50"
              >
                {status === "loading" ? "Saving…" : "Register interest"}
              </button>
              <p
                id={statusId}
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="min-h-6 text-sm leading-relaxed text-white/80"
              >
                {message}
              </p>
            </form>
          </div>
        </section>

        <section aria-labelledby="explore-heading" className="max-w-2xl">
          <h2 id="explore-heading" className="mb-4 font-display text-2xl">
            Explore Arcanea
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-white/70">
            Browse the worlds and library, or inspect the app’s source. Hosted
            creation uses online services; check the relevant workflow before
            sharing private material. Reuse of source, lore and media depends on
            their specific terms and provenance.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/library" className={linkStyle}>
              Read the library
            </Link>
            <Link
              href="https://github.com/frankxai/arcanea-ai-app"
              className={linkStyle}
            >
              Inspect the app source
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
