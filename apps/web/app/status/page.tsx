import type { Metadata } from "next";
import Link from "next/link";

type StatusLevel = "live" | "beta" | "preview" | "private" | "roadmap" | "blocked";

interface ProductSurface {
  name: string;
  href: string;
  status: StatusLevel;
  lane: string;
  proof: string;
  next: string;
}

interface MarketPressure {
  pressure: string;
  userExpectation: string;
  arcaneaResponse: string;
}

interface ReleaseGate {
  name: string;
  status: StatusLevel;
  signal: string;
}

const UPDATED_AT = "July 5, 2026";

const STATUS_COPY: Record<StatusLevel, { label: string; className: string }> = {
  live: {
    label: "Live",
    className:
      "border-[var(--arc-brand-atlantean-teal)]/25 bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)]",
  },
  beta: {
    label: "Beta",
    className:
      "border-[var(--arc-wind)]/25 bg-[var(--arc-wind)]/10 text-[var(--arc-wind)]",
  },
  preview: {
    label: "Preview",
    className:
      "border-[var(--arc-brand-arcanean-gold)]/25 bg-[var(--arc-brand-arcanean-gold)]/10 text-[var(--arc-brand-arcanean-gold)]",
  },
  private: {
    label: "Private beta",
    className:
      "border-[var(--arc-void)]/25 bg-[var(--arc-void)]/10 text-[var(--arc-void)]",
  },
  roadmap: {
    label: "Roadmap",
    className:
      "border-[var(--arc-brand-cosmic-blue)]/35 bg-[var(--arc-brand-cosmic-blue)]/15 text-[var(--arc-text-secondary)]",
  },
  blocked: {
    label: "Blocked",
    className:
      "border-[var(--arc-fire)]/30 bg-[var(--arc-fire)]/10 text-[var(--arc-fire)]",
  },
};

const PRODUCT_SURFACES: ProductSurface[] = [
  {
    name: "Genesis Proof",
    href: "/genesis",
    status: "live",
    lane: "Activation",
    proof: "Prompt handoff, proof packet export, and persistence-safe copy verified locally.",
    next: "Make proof save and project memory durable after runtime selection.",
  },
  {
    name: "Creature Atlas",
    href: "/atlas/creatures",
    status: "live",
    lane: "Continuity",
    proof: "Rights-aware creature prompts, detail routes, copy action, and mobile width checks pass.",
    next: "Add collection save, provenance export, and model comparison metadata.",
  },
  {
    name: "Image Studio Handoff",
    href: "/studio/image",
    status: "beta",
    lane: "Creation",
    proof: "Homepage starter prompts arrive through local handoff storage without leaking raw prompt URLs.",
    next: "Unify generation history with project memory and asset provenance.",
  },
  {
    name: "Claw Store",
    href: "/studio/store",
    status: "preview",
    lane: "Commerce",
    proof: "Package intent tracking is wired and verified without payment or wallet claims.",
    next: "Decide commerce provider, fulfillment flow, and creator payout policy.",
  },
  {
    name: "Apps and Integrations",
    href: "/integrations",
    status: "beta",
    lane: "Ecosystem",
    proof: "Integration states are labeled live, beta, or planned across the public stack map.",
    next: "Turn the highest-demand connectors into account-level install flows.",
  },
  {
    name: "Agents and MCP",
    href: "/mcp",
    status: "beta",
    lane: "AI engineering",
    proof: "MCP and agent entry points are visible from product navigation.",
    next: "Connect task orchestration to durable workflow runs with explicit package docs.",
  },
  {
    name: "World Builder",
    href: "/worlds/create",
    status: "preview",
    lane: "World continuity",
    proof: "Creation route is part of the first-session product graph.",
    next: "Bind worlds to Genesis proof, Atlas material, and exportable lore records.",
  },
  {
    name: "Eve Durable Runs",
    href: "/roadmap",
    status: "roadmap",
    lane: "Workflow runtime",
    proof: "Release brief exists; Eve docs and package runtime were not present during this pass.",
    next: "Install or expose the runtime in a separate, docs-backed implementation PR.",
  },
];

const MARKET_PRESSURES: MarketPressure[] = [
  {
    pressure: "Generation speed and prompt adherence",
    userExpectation: "Fast defaults, clean controls, and outputs that follow small details.",
    arcaneaResponse: "Keep Genesis instant, then route deeper image/video work through Studio with saved prompt context.",
  },
  {
    pressure: "One workspace with model choice",
    userExpectation: "Compare tools, switch models, and keep assets in one organized place.",
    arcaneaResponse: "Use Apps and Integrations as a status-labeled connector map instead of implying every provider is wired.",
  },
  {
    pressure: "Character, object, and world continuity",
    userExpectation: "Reuse the same characters, creatures, references, and worlds across sessions.",
    arcaneaResponse: "Make Atlas and Worlds the continuity layer, then attach provenance and rights boundaries to each asset.",
  },
  {
    pressure: "Production confidence",
    userExpectation: "Clear status, stable previews, transparent limitations, and no mystery beta claims.",
    arcaneaResponse: "Ship visible status labels, privacy-safe metrics, and Vercel preview checks before production promotion.",
  },
];

const RELEASE_GATES: ReleaseGate[] = [
  {
    name: "Local product gates",
    status: "live",
    signal: "Project tests, type-check, build, browser QA, mobile width checks, and evidence validation passed for the current slice.",
  },
  {
    name: "Vercel preview promotion",
    status: "private",
    signal: "Use one coherent preview deploy after deciding release scope; production waits for domain/runtime verification.",
  },
  {
    name: "Durable workflow runtime",
    status: "roadmap",
    signal: "Eve and Vercel Workflow are not public app claims until package docs and implementation are present.",
  },
  {
    name: "Payments and ownership flows",
    status: "preview",
    signal: "Store intent is visible; payment, fulfillment, and payout flows remain unshipped.",
  },
];

const FUNNEL_METRICS = [
  "homepage_genesis_cta_click",
  "genesis_prompt_prefill_used",
  "genesis_proof_export",
  "atlas_creature_prompt_copy",
  "studio_store_package_click",
];

export const metadata: Metadata = {
  title: "Status - Arcanea",
  description:
    "Arcanea product status map across live, beta, preview, private beta, and roadmap surfaces.",
  alternates: { canonical: "/status" },
  openGraph: {
    title: "Arcanea Status",
    description:
      "A transparent map of Arcanea's shipped surfaces, beta lanes, roadmap work, and release readiness.",
    url: "/status",
  },
};

function StatusPill({ status }: { status: StatusLevel }) {
  const meta = STATUS_COPY[status];

  return (
    <span
      className={`inline-flex min-h-7 items-center gap-2 rounded-md border px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] ${meta.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}

function MetricTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
      <p className="font-mono text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs leading-relaxed text-white/48">{label}</p>
    </div>
  );
}

export default function StatusPage() {
  const liveCount = PRODUCT_SURFACES.filter((surface) => surface.status === "live").length;
  const betaCount = PRODUCT_SURFACES.filter((surface) => surface.status === "beta").length;
  const previewCount = PRODUCT_SURFACES.filter((surface) => surface.status === "preview").length;

  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] text-white">
      <section className="border-b border-white/[0.06] px-4 py-12 sm:px-6 lg:pl-8 lg:pr-24 xl:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--arc-brand-atlantean-teal)]">
              Product status
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-normal text-white sm:text-5xl">
              Arcanea Status
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              A plain map of what users can try now, what is beta, what is only
              previewed, and what stays on the roadmap until it is backed by runtime
              evidence.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <StatusPill status="live" />
              <StatusPill status="beta" />
              <StatusPill status="preview" />
              <StatusPill status="private" />
              <StatusPill status="roadmap" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricTile value={String(liveCount)} label="Live product surfaces" />
            <MetricTile value={String(betaCount)} label="Beta product lanes" />
            <MetricTile value={String(previewCount)} label="Preview experiences" />
            <MetricTile value="5" label="Privacy-safe activation events" />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:pl-8 lg:pr-24 xl:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/32">
                Updated {UPDATED_AT}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white">
                Experience Map
              </h2>
            </div>
            <Link
              href="/genesis"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--arc-brand-atlantean-teal)]/25 bg-[var(--arc-brand-atlantean-teal)]/10 px-4 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] transition hover:bg-[var(--arc-brand-atlantean-teal)]/16"
            >
              Start Genesis
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {PRODUCT_SURFACES.map((surface) => (
              <article
                key={surface.name}
                className="flex min-h-[280px] flex-col rounded-lg border border-white/[0.08] bg-white/[0.025] p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/32">
                      {surface.lane}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold leading-tight text-white">
                      {surface.name}
                    </h3>
                  </div>
                  <StatusPill status={surface.status} />
                </div>
                <p className="mt-5 text-sm leading-6 text-white/52">{surface.proof}</p>
                <p className="mt-4 text-sm leading-6 text-white/38">{surface.next}</p>
                <Link
                  href={surface.href}
                  className="mt-auto pt-6 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] hover:text-white"
                >
                  Open surface
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-[var(--arc-cosmic-deep)]/35 px-4 py-12 sm:px-6 lg:pl-8 lg:pr-24 xl:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/32">
              Market pressure
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-white">
              What modern users now expect
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/52">
              The creative AI bar has moved toward speed, control, continuity,
              model choice, asset organization, and transparent limitations.
              Arcanea should win by making every session produce proof, memory,
              provenance, and a next workflow.
            </p>
            <Link
              href="/method"
              className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--arc-brand-atlantean-teal)]/24 bg-[var(--arc-brand-atlantean-teal)]/10 px-4 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/16"
            >
              Open the method
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {MARKET_PRESSURES.map((item) => (
              <article
                key={item.pressure}
                className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-5"
              >
                <h3 className="text-base font-semibold text-white">{item.pressure}</h3>
                <p className="mt-3 text-sm leading-6 text-white/46">
                  {item.userExpectation}
                </p>
                <p className="mt-4 text-sm leading-6 text-[var(--arc-brand-atlantean-teal)]/86">
                  {item.arcaneaResponse}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:pl-8 lg:pr-24 xl:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/32">
              Success metrics
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-white">
              Activation Signals
            </h2>
            <div className="mt-6 grid gap-2">
              {FUNNEL_METRICS.map((metric) => (
                <div
                  key={metric}
                  className="flex min-h-12 items-center justify-between gap-4 rounded-lg border border-white/[0.08] bg-white/[0.025] px-4 py-3"
                >
                  <code className="min-w-0 break-words font-mono text-xs text-white/58">
                    {metric}
                  </code>
                  <span className="shrink-0 rounded-md border border-[var(--arc-brand-atlantean-teal)]/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--arc-brand-atlantean-teal)]">
                    Wired
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/32">
              Release gates
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-white">
              Promotion Readiness
            </h2>
            <div className="mt-6 grid gap-3">
              {RELEASE_GATES.map((gate) => (
                <article
                  key={gate.name}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-white">{gate.name}</h3>
                    <StatusPill status={gate.status} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/48">{gate.signal}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
