import type { Metadata } from "next";
import Link from "next/link";
import {
  WaitlistForm,
  type WaitlistCopy,
} from "@/lib/demand-capture/WaitlistForm";
import {
  findProduct,
  readWaitlistState,
  type WaitlistProductId,
} from "@/lib/waitlist/join";
import "./waitlist.css";

export const metadata: Metadata = {
  title: "Pricing — Waitlists, not checkouts",
  description:
    "Nothing on Arcanea is priced yet. Join the waitlist for Arcanea or Arcanea MCP Studio and tell us what you would expect to pay. The World MCP is free to install today.",
  openGraph: {
    title: "Arcanea pricing — no prices yet, on purpose",
    description:
      "Two waitlists and one free tool. Founding members keep the launch price for life.",
    type: "website",
  },
  alternates: { canonical: "/pricing" },
};

type Offer = {
  id: WaitlistProductId;
  anchor: string;
  name: string;
  status: string;
  forWho: string;
  founding: string[];
  tryNow: {
    title: string;
    body: string;
    link?: { href: string; label: string };
    example?: { caption: string; text: string };
  };
};

// Founding benefits mirror the `founding` field of each row in data/products.graph.json.
const OFFERS: Offer[] = [
  {
    id: "arcanea-subscription",
    anchor: "arcanea",
    name: "Arcanea",
    status: "In development",
    forWho:
      "The paid tier of arcanea.ai, for readers and worldbuilders who want the canon itself rather than another chat window. What it includes is still being decided, partly by the answers below.",
    founding: [
      "The launch price, locked for life",
      "Your name in the founder register inside the world",
      "A founding sigil",
    ],
    tryNow: {
      title: "Read the canon before you answer",
      body: "Chapter 1 of The Book of Arcanea is free in the Library. One chapter, no account. If it is not for you, the price question does not matter.",
      link: {
        href: "/library/book-of-arcanea#chapter-1-before-the-light",
        label: "Read Chapter 1",
      },
      example: {
        caption: "From Chapter 1, Before the Light",
        text: "Before the light, there is Nero.\n\nYou are not starting from nothing. You are starting from everything.",
      },
    },
  },
  {
    id: "arcanea-mcp",
    anchor: "mcp-studio",
    name: "Arcanea MCP Studio",
    status: "Not released",
    forWho:
      "For agent builders. Planned scope: image and media generation inside Claude Code, Cursor or Codex, with scoring that flags weak outputs before you use them.",
    founding: [
      "The launch price, locked for life",
      "Your name in CONTRIBUTORS.md of the published npm package",
      "A vote on which provider adapter ships first",
    ],
    tryNow: {
      title: "Nothing to try yet",
      body: "Studio's media generation and scoring are not built into anything you can install today. The closest thing that runs now is the free World MCP below, which uses the same install path.",
      link: { href: "#world-mcp", label: "See what runs today" },
    },
  },
];

const COPY: Partial<WaitlistCopy> = {
  join: "Join the waitlist",
  intro:
    "Three optional questions. The first matters most: no price is set, and your answer is part of how it gets set.",
  pricePrompt: "What would you expect to pay per month, in EUR?",
  roleLabel: "Which fits you best?",
  painPrompt: "What are you trying to do with it?",
  urgencyLabel: "How soon do you need it?",
  send: "Send answers",
  doneText: "We will email you when {product} opens, and not before.",
};

const STEPS = [
  {
    title: "Join with your email",
    body: "That is the whole signup, and it gives you a real place in line.",
  },
  {
    title: "Answer three questions, or skip them",
    body: "What you would pay, who you are, and what you are trying to do.",
  },
  {
    title: "A price is published at launch",
    body: "Not before the product is finished and tested. Founding members keep that price for life.",
  },
];

const INSTALL = "claude mcp add arcanea npx @arcanea/mcp-server";

// Verbatim output of generateName({ element: "fire", type: "place", count: 3 })
// from packages/arcanea-mcp/src/tools/generators.ts, run 2026-09-15.
const WORLD_MCP_EXAMPLE = `{
  "element": "fire",
  "type": "place",
  "names": ["Ardgarde", "Calhaven", "Flamvale"]
}`;

export default async function PricingPage() {
  const states = await Promise.all(
    OFFERS.map((offer) => readWaitlistState(offer.id)),
  );

  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top_left,rgba(0,188,212,0.09),transparent_60%)]"
      />

      <main className="mx-auto max-w-6xl px-5 pb-28 pt-20 sm:px-8 md:pt-28">
        <header className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">
            Pricing
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-6xl">
            No prices yet.{" "}
            <span className="font-editorial font-normal italic text-white/60">
              On purpose.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            Arcanea and Arcanea MCP Studio are not on sale. Each opens only once
            it is finished and tested. Join the list for the one you want and
            tell us what you would pay.
          </p>

          <nav
            aria-label="On this page"
            className="mt-8 flex flex-wrap gap-2 text-sm"
          >
            {[
              ["#arcanea", "Arcanea"],
              ["#mcp-studio", "MCP Studio"],
              ["#world-mcp", "World MCP, free"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-white/[0.08] px-3.5 py-1.5 text-white/70 transition-colors hover:border-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
              >
                {label}
              </a>
            ))}
          </nav>
        </header>

        <section
          id="waitlist"
          aria-label="Waitlists"
          className="mt-16 grid scroll-mt-24 gap-6 lg:grid-cols-2"
        >
          {OFFERS.map((offer, i) => {
            const cohort = findProduct(offer.id)?.waitlist.foundingCohort;
            return (
              <article
                key={offer.id}
                id={offer.anchor}
                aria-labelledby={offer.anchor + "-title"}
                className="flex scroll-mt-24 flex-col rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8"
              >
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-[var(--arc-brand-atlantean-teal)]"
                  />
                  {offer.status} · no launch date
                </p>
                <h2
                  id={offer.anchor + "-title"}
                  className="mt-4 font-display text-2xl font-semibold tracking-[-0.01em] sm:text-3xl"
                >
                  {offer.name}
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/60">
                  {offer.forWho}
                </p>

                <div className="mt-7 border-t border-white/[0.06] pt-6">
                  <h3 className="text-sm font-medium text-white/85">
                    Founding members{cohort ? `, first ${cohort}` : ""}
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {offer.founding.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex gap-3 text-sm text-white/65"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.6rem] h-px w-3 shrink-0 bg-[var(--arc-brand-atlantean-teal)]"
                        />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 border-t border-white/[0.06] pt-6">
                  <h3 className="text-sm font-medium text-white/85">
                    {offer.tryNow.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {offer.tryNow.body}
                  </p>
                  {offer.tryNow.example ? (
                    <figure className="mt-4 rounded-2xl border border-white/[0.06] bg-black/30 p-4">
                      <blockquote className="whitespace-pre-line font-editorial text-lg leading-snug text-white/85">
                        {offer.tryNow.example.text}
                      </blockquote>
                      <figcaption className="mt-3 font-mono text-[11px] text-white/40">
                        {offer.tryNow.example.caption}
                      </figcaption>
                    </figure>
                  ) : null}
                  {offer.tryNow.link ? (
                    <a
                      href={offer.tryNow.link.href}
                      className="mt-4 inline-flex rounded-lg text-sm font-medium text-[var(--arc-brand-atlantean-teal)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
                    >
                      {offer.tryNow.link.label}
                    </a>
                  ) : null}
                </div>

                <div className="mt-8 border-t border-white/[0.06] pt-6">
                  <WaitlistForm
                    productId={offer.id}
                    productName={offer.name}
                    foundingBenefit="Founding places close at launch and do not reopen."
                    initialState={states[i]}
                    placeholder="you@example.com"
                    copy={COPY}
                  />
                </div>
              </article>
            );
          })}
        </section>

        <section
          id="world-mcp"
          aria-labelledby="world-mcp-title"
          className="mt-6 grid scroll-mt-24 gap-8 rounded-3xl border border-white/[0.06] p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:items-center"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--arc-brand-arcanean-gold)]">
              Free · available now
            </p>
            <h2
              id="world-mcp-title"
              className="mt-4 font-display text-2xl font-semibold tracking-[-0.01em]"
            >
              Arcanea World MCP
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/60">
              Worldbuilding tools for Claude Code, Cursor, Codex and other MCP
              clients. No waitlist. It installs in one command.
            </p>
            <Link
              href="/docs/mcp"
              className="mt-5 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-[var(--arc-brand-atlantean-teal)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
            >
              Install guide for every client
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-black/40 p-4">
            <p className="mb-2 font-mono text-[11px] text-white/40">
              Claude Code
            </p>
            <pre className="font-mono text-sm text-white/85">
              <code>{INSTALL}</code>
            </pre>
            <p className="mb-2 mt-5 font-mono text-[11px] text-white/40">
              Then ask your client to run generate_name with element fire, type
              place, count 3
            </p>
            <pre className="font-mono text-sm text-white/70">
              <code>{WORLD_MCP_EXAMPLE}</code>
            </pre>
            <p className="mt-2 font-mono text-[11px] text-white/35">
              One real run. Names change on every call.
            </p>
          </div>
        </section>

        <section aria-labelledby="how-title" className="mt-24">
          <h2
            id="how-title"
            className="font-display text-2xl font-semibold tracking-[-0.01em]"
          >
            How the price gets set
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="border-t border-white/[0.08] pt-5"
              >
                <span className="font-mono text-xs text-white/40">
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-medium text-white/90">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}
