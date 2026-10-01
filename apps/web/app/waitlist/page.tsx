import type { Metadata } from "next";
import Link from "next/link";
import registry from "@/data/products.graph.json";
import {
  WaitlistForm,
  type WaitlistCopy,
} from "@/lib/demand-capture/WaitlistForm";
import { readWaitlistState, type WaitlistProductId } from "@/lib/waitlist/join";
import "./waitlist.css";

type Offer = {
  id: WaitlistProductId;
  name: string;
  status: string;
  lede: string;
  forWho: string;
  evaluate: {
    title: string;
    body: string;
    link?: { href: string; label: string };
    excerpt?: { caption: string; text: string };
  };
};

const OFFERS: Record<WaitlistProductId, Offer> = {
  "arcanea-subscription": {
    id: "arcanea-subscription",
    name: "Arcanea",
    status: "In development",
    lede: "The canon itself, not another chat window.",
    forWho:
      "The paid tier of arcanea.ai, for readers and worldbuilders. What it includes is still being decided, partly by the answers people give here.",
    evaluate: {
      title: "Read the canon before you answer",
      body: "Chapter 1 of The Book of Arcanea is free in the Library. One chapter, no account. If it is not for you, the price question does not matter.",
      link: { href: "/library/book-of-arcanea", label: "Read Chapter 1" },
      excerpt: {
        caption: "From Chapter 1, Before the Light",
        text: "Before the light, there is Nero.\n\nYou are not starting from nothing. You are starting from everything.",
      },
    },
  },
  "arcanea-mcp": {
    id: "arcanea-mcp",
    name: "Arcanea MCP",
    status: "Not released",
    lede: "Generation inside your agent, with a scorer that flags weak output.",
    forWho:
      "For agent builders working in Claude Code, Cursor or Codex. Planned scope: image and media generation from inside the harness, with scoring that tells you which outputs are weak before you use them.",
    evaluate: {
      title: "Nothing to install yet",
      body: "The paid server is not published. We would rather say that than show you a demo of something you cannot run. Joining gets you one email when it can be installed.",
    },
  },
};

const IDS = Object.keys(OFFERS) as WaitlistProductId[];

type RegistryRow = { id: string; founding?: string[] };
const foundingFor = (id: WaitlistProductId) =>
  (registry.products as RegistryRow[]).find((p) => p.id === id)?.founding ?? [];

function resolveOffer(raw: string | string[] | undefined): Offer | undefined {
  return typeof raw === "string" && (IDS as string[]).includes(raw)
    ? OFFERS[raw as WaitlistProductId]
    : undefined;
}

const COPY: Partial<WaitlistCopy> = {
  join: "Join the waitlist",
  intro:
    "A few optional questions. The first matters most: no price is set, and your answer is part of how it gets set.",
  pricePrompt: "What would you expect to pay per month, in EUR?",
  roleLabel: "Which fits you best?",
  painPrompt: "What are you trying to do with it?",
  urgencyLabel: "How soon do you need it?",
  send: "Send answers",
  doneText: "We will email you when {product} opens, and not before.",
};

const STEPS = [
  "Join with your email. That is the whole signup, and it is a real place in line.",
  "Answer a few questions, or skip them: what you would pay, who you are, what you are trying to do.",
  "A price is published only once the product is finished and tested. Founding members keep it for life.",
];

type Props = { searchParams: Promise<{ product?: string | string[] }> };

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const offer = resolveOffer((await searchParams).product);
  if (!offer)
    return {
      title: "Waitlists",
      description:
        "Nothing on Arcanea is on sale yet. Join the waitlist for the product you want and tell us what you would expect to pay.",
      alternates: { canonical: "/waitlist" },
    };
  return {
    title: `${offer.name} waitlist`,
    description: `${offer.lede} ${offer.status}, no launch date. Join the list and tell us what you would expect to pay.`,
    alternates: { canonical: `/waitlist?product=${offer.id}` },
  };
}

export default async function WaitlistPage({ searchParams }: Props) {
  const offer = resolveOffer((await searchParams).product);

  return (
    <div className="relative min-h-[100dvh] bg-[var(--arc-cosmic-void)] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top_left,rgba(0,188,212,0.09),transparent_60%)]"
      />
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-16 sm:px-8 md:pt-24">
        <ProductSwitcher active={offer?.id} />
        {offer ? <OfferView offer={offer} /> : <Chooser />}
      </div>
    </div>
  );
}

function ProductSwitcher({ active }: { active?: WaitlistProductId }) {
  return (
    <nav aria-label="Waitlists" className="flex flex-wrap gap-2 text-sm">
      {IDS.map((id) => {
        const current = id === active;
        return (
          <Link
            key={id}
            href={`/waitlist?product=${id}`}
            aria-current={current ? "page" : undefined}
            className={
              "rounded-full border px-3.5 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)] " +
              (current
                ? "border-[var(--arc-brand-atlantean-teal)]/60 bg-[var(--arc-brand-atlantean-teal)]/10 text-white"
                : "border-white/[0.08] text-white/70 hover:border-white/20 hover:text-white")
            }
          >
            {OFFERS[id].name}
          </Link>
        );
      })}
    </nav>
  );
}

function Chooser() {
  return (
    <>
      <header className="mt-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">
          Waitlists
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
          Nothing here is on sale yet.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/60 sm:text-lg">
          Each product opens only once it is finished and tested. Pick the one
          you want, join its list, and tell us what you would pay.
        </p>
      </header>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {IDS.map((id) => {
          const offer = OFFERS[id];
          return (
            <li key={id}>
              <Link
                href={`/waitlist?product=${id}`}
                className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-colors hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                  {offer.status}
                </span>
                <span className="mt-3 font-display text-2xl font-semibold">
                  {offer.name}
                </span>
                <span className="mt-2 text-sm leading-relaxed text-white/60">
                  {offer.lede}
                </span>
                <span className="mt-5 text-sm font-medium text-[var(--arc-brand-atlantean-teal)]">
                  Join this list
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

async function OfferView({ offer }: { offer: Offer }) {
  const state = await readWaitlistState(offer.id);
  const founding = foundingFor(offer.id);

  return (
    <>
      <header className="mt-10">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-[var(--arc-brand-atlantean-teal)]"
          />
          {offer.status} · no launch date
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
          {offer.name}
        </h1>
        <p className="mt-4 font-editorial text-xl italic text-white/70">
          {offer.lede}
        </p>
        <p className="mt-5 text-base leading-relaxed text-white/60">
          {offer.forWho}
        </p>
      </header>

      <section
        aria-label={`Join the ${offer.name} waitlist`}
        className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.03] p-5 sm:p-8"
      >
        <WaitlistForm
          productId={offer.id}
          productName={offer.name}
          foundingBenefit="Founding members keep the launch price for life."
          initialState={state}
          placeholder="you@example.com"
          copy={COPY}
        />
      </section>

      {founding.length ? (
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold">
            What founding members get
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/65">
            {founding.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--arc-brand-atlantean-teal)]"
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-white/40">
            The founding window closes at launch and does not reopen. No
            discount is offered, because no price exists yet to discount.
          </p>
        </section>
      ) : null}

      <section className="mt-10 rounded-2xl border border-white/[0.06] p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">
          {offer.evaluate.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          {offer.evaluate.body}
        </p>
        {offer.evaluate.excerpt ? (
          <figure className="mt-5 border-l-2 border-white/[0.12] pl-5">
            <blockquote className="whitespace-pre-line font-editorial text-lg italic leading-relaxed text-white/80">
              {offer.evaluate.excerpt.text}
            </blockquote>
            <figcaption className="mt-2 text-xs text-white/40">
              {offer.evaluate.excerpt.caption}
            </figcaption>
          </figure>
        ) : null}
        {offer.evaluate.link ? (
          <Link
            href={offer.evaluate.link.href}
            className="mt-5 inline-block text-sm font-medium text-[var(--arc-brand-atlantean-teal)] underline-offset-4 hover:underline"
          >
            {offer.evaluate.link.label}
          </Link>
        ) : null}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold">How this works</h2>
        <ol className="mt-3 space-y-3 text-sm leading-relaxed text-white/60">
          {STEPS.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="font-mono text-xs text-white/35">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
