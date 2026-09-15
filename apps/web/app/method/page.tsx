import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Compass,
  Database,
  Eye,
  GitBranch,
  ImageSquare,
  Lock,
  MagicWand,
  MapTrifold,
  Scales,
  ShieldStar,
  Sparkle,
  Stack,
  Target,
  VideoCamera,
} from "@/lib/phosphor-icons";

type Readiness = "Live" | "Beta" | "Preview" | "Roadmap";

interface ProofStep {
  label: string;
  title: string;
  body: string;
  href: string;
  readiness: Readiness;
}

interface MarketExpectation {
  archetype: string;
  expectation: string;
  arcaneaAnswer: string;
  route: string;
  icon: typeof Sparkle;
}

interface MethodLane {
  title: string;
  body: string;
  surfaces: string[];
  icon: typeof Sparkle;
}

const readinessStyles: Record<Readiness, string> = {
  Live:
    "border-[var(--arc-brand-atlantean-teal)]/25 bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)]",
  Beta: "border-[var(--arc-wind)]/25 bg-[var(--arc-wind)]/10 text-[var(--arc-wind)]",
  Preview:
    "border-[var(--arc-brand-arcanean-gold)]/25 bg-[var(--arc-brand-arcanean-gold)]/10 text-[var(--arc-brand-arcanean-gold)]",
  Roadmap:
    "border-[var(--arc-brand-cosmic-blue)]/35 bg-[var(--arc-brand-cosmic-blue)]/15 text-[var(--arc-text-secondary)]",
};

const PROOF_STEPS: ProofStep[] = [
  {
    label: "01",
    title: "Name the Drift",
    body: "The session starts with a real creative pressure, not a blank chat box.",
    href: "/genesis",
    readiness: "Live",
  },
  {
    label: "02",
    title: "Issue the Gift",
    body: "Genesis converts the call into a proof-sized artifact with a bounded next move.",
    href: "/genesis",
    readiness: "Live",
  },
  {
    label: "03",
    title: "Set Right Use",
    body: "Rights, provenance, and intended use are part of the object before expansion.",
    href: "/atlas/creatures",
    readiness: "Live",
  },
  {
    label: "04",
    title: "Make the Proof",
    body: "Studio, Atlas, and Worlds turn the idea into reusable material.",
    href: "/studio/image",
    readiness: "Beta",
  },
  {
    label: "05",
    title: "Route the Workflow",
    body: "Agents, MCP, Store, and future durable runs carry the proof forward.",
    href: "/status",
    readiness: "Preview",
  },
];

const MARKET_EXPECTATIONS: MarketExpectation[] = [
  {
    archetype: "Editable workspace",
    expectation: "Users expect writing, coding, and revision to happen beside the AI without losing context.",
    arcaneaAnswer: "Genesis and project memory should make the first proof editable, exportable, and traceable.",
    route: "/genesis",
    icon: BookOpen,
  },
  {
    archetype: "Shareable artifact",
    expectation: "Modern AI outputs increasingly become standalone apps, pages, dashboards, or reusable objects.",
    arcaneaAnswer: "Arcanea treats every strong output as a Gift Object with proof ID, provenance, and next workflow.",
    route: "/genesis",
    icon: Stack,
  },
  {
    archetype: "Persistent project",
    expectation: "Users expect chat history, files, knowledge, and workspace state to survive across sessions.",
    arcaneaAnswer: "Project memory is the backbone, but public copy stays careful until durable persistence is fully wired.",
    route: "/projects",
    icon: Database,
  },
  {
    archetype: "Consistent media",
    expectation: "Creative teams expect reference continuity, prompt adherence, and controllable image/video iteration.",
    arcaneaAnswer: "Atlas, Studio, and Worlds become the continuity layer for creatures, references, scenes, and rights.",
    route: "/atlas/creatures",
    icon: ImageSquare,
  },
  {
    archetype: "World database",
    expectation: "Serious worldbuilders expect templates, maps, timelines, secrets, and long-term canon management.",
    arcaneaAnswer: "Arcanea turns worldbuilding into proof, canon pressure, and creative workflow instead of static lore storage.",
    route: "/worlds/create",
    icon: MapTrifold,
  },
  {
    archetype: "Production confidence",
    expectation: "Users want status, preview discipline, privacy-safe metrics, and no mystery claims.",
    arcaneaAnswer: "The public status map keeps live, beta, preview, and roadmap surfaces visibly separated.",
    route: "/status",
    icon: ShieldStar,
  },
];

const METHOD_LANES: MethodLane[] = [
  {
    title: "Proof before scale",
    body: "The first session must produce a named object small enough to finish and strong enough to reuse.",
    surfaces: ["Genesis", "Proof export", "Activation metrics"],
    icon: Target,
  },
  {
    title: "Continuity before spectacle",
    body: "Creatures, worlds, and references need memory, rights, and provenance before higher-fidelity media expansion.",
    surfaces: ["Creature Atlas", "World Builder", "Studio"],
    icon: GitBranch,
  },
  {
    title: "Rights before commerce",
    body: "Store and collectible surfaces stay preview until source, license, model, payout, and cultural review are explicit.",
    surfaces: ["Claw Store", "Protocol", "Status"],
    icon: Scales,
  },
  {
    title: "Runtime before claims",
    body: "Eve and durable workflows remain roadmap until package docs, implementation, and production evidence exist.",
    surfaces: ["MCP", "Agents", "Workflow brief"],
    icon: Lock,
  },
];

export const metadata: Metadata = {
  title: "The Arcanea Method - Proof Before Scale",
  description:
    "How Arcanea turns a creative call into proof, memory, provenance, rights boundaries, and a next workflow.",
  alternates: { canonical: "/method" },
  openGraph: {
    title: "The Arcanea Method",
    description:
      "Arcanea's creator-owned method for proof, memory, provenance, and workflow.",
    url: "/method",
  },
};

function ReadinessPill({ readiness }: { readiness: Readiness }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${readinessStyles[readiness]}`}
    >
      {readiness}
    </span>
  );
}

export default function MethodPage() {
  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] text-white">
      <section className="border-b border-white/[0.06] px-4 py-12 sm:px-6 lg:pl-8 lg:pr-24 xl:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--arc-brand-arcanean-gold)]">
              Arcanea method
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-normal text-white sm:text-5xl">
              Proof before scale.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              Arcanea is built for creators who need more than chat, generation,
              or lore storage. A session should produce proof, memory,
              provenance, rights boundaries, and the next workflow.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/genesis"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--arc-brand-arcanean-gold)] px-4 text-sm font-semibold text-black transition hover:bg-white"
              >
                Start Genesis
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link
                href="/status"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.04] px-4 text-sm font-semibold text-white/72 transition hover:border-white/[0.22] hover:text-white"
              >
                View status
                <Eye size={16} weight="duotone" />
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
            <div className="grid gap-3 md:grid-cols-5">
              {PROOF_STEPS.map((step) => (
                <Link
                  key={step.label}
                  href={step.href}
                  className="group flex min-h-[210px] flex-col rounded-lg border border-white/[0.08] bg-black/30 p-4 transition hover:border-[var(--arc-brand-atlantean-teal)]/32"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/32">
                      {step.label}
                    </span>
                    <ReadinessPill readiness={step.readiness} />
                  </div>
                  <h2 className="mt-5 text-base font-semibold leading-tight text-white">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/48">{step.body}</p>
                  <span className="mt-auto pt-5 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] group-hover:text-white">
                    Open
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:pl-8 lg:pr-24 xl:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 grid gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/32">
                Market pressure
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                What modern users compare against
              </h2>
            </div>
            <p className="text-sm leading-7 text-white/52">
              The public language stays category-based. Internally, this is the
              bar set by editable AI workspaces, shareable AI artifacts, project
              memory, cinematic media systems, and mature worldbuilding tools.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {MARKET_EXPECTATIONS.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.archetype}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.04] text-[var(--arc-brand-atlantean-teal)]">
                      <Icon size={18} weight="duotone" />
                    </div>
                    <Link
                      href={item.route}
                      className="text-sm font-medium text-[var(--arc-brand-atlantean-teal)] hover:text-white"
                    >
                      Open
                    </Link>
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-white">
                    {item.archetype}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/46">
                    {item.expectation}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-[var(--arc-brand-arcanean-gold)]/82">
                    {item.arcaneaAnswer}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-[var(--arc-cosmic-deep)]/35 px-4 py-12 sm:px-6 lg:pl-8 lg:pr-24 xl:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/32">
              Operating doctrine
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-white">
              The rules that keep Arcanea honest
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/52">
              Arcanea can be mythic only if the product remains inspectable.
              Every public claim should point to a route, a status, or a blocked
              gate.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {METHOD_LANES.map((lane) => {
              const Icon = lane.icon;

              return (
                <article
                  key={lane.title}
                  className="rounded-lg border border-white/[0.08] bg-black/30 p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.04] text-white/68">
                      <Icon size={18} weight="duotone" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{lane.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/48">{lane.body}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {lane.surfaces.map((surface) => (
                      <span
                        key={surface}
                        className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs text-white/48"
                      >
                        {surface}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:pl-8 lg:pr-24 xl:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/32">
              Demonstration path
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-white">
              From call to proof to workflow
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Call", "A creator names the pressure, audience, and useful outcome."],
                ["Gift", "Genesis creates the first object and its proof boundary."],
                ["Material", "Atlas or Studio turns the object into reusable creative material."],
                ["Memory", "Project context and provenance keep the thread from dissolving."],
                ["Route", "MCP, agents, and Store surfaces carry the work into operations."],
                ["Status", "The public map keeps claims synchronized with shipped evidence."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-lg border border-white/[0.08] bg-black/30 p-4">
                  <h3 className="text-sm font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/48">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-[var(--arc-brand-arcanean-gold)]/18 bg-[var(--arc-brand-arcanean-gold)]/5 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-[var(--arc-brand-arcanean-gold)]">
              <MagicWand size={18} weight="duotone" />
              <p className="font-mono text-[11px] uppercase tracking-[0.24em]">
                Proof object
              </p>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              A method is stronger than a feature list.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/52">
              The competitive answer is not to copy every workspace, artifact,
              media, or worldbuilding feature. Arcanea wins when the same proof
              object can become a story seed, image prompt, world record, agent
              task, rights review, and marketplace candidate.
            </p>
            <div className="mt-6 grid gap-2">
              {[
                ["Evidence", "Local gates and screenshots, not vibes."],
                ["Boundary", "Rights and use before commerce."],
                ["Next move", "A route from creation into execution."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-md border border-white/[0.08] bg-black/24 p-3">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-white/44">{body}</p>
                </div>
              ))}
            </div>
            <Link
              href="/status"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[var(--arc-brand-atlantean-teal)]/24 bg-[var(--arc-brand-atlantean-teal)]/10 px-4 text-sm font-semibold text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/16"
            >
              Check readiness
              <Compass size={16} weight="duotone" />
            </Link>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:pl-8 lg:pr-24 xl:px-8">
        <div className="mx-auto max-w-7xl rounded-lg border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/32">
                Next action
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                Run the first proof loop.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href="/genesis"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--arc-brand-atlantean-teal)] px-4 text-sm font-semibold text-black transition hover:bg-white"
              >
                Start Genesis
                <Sparkle size={16} weight="duotone" />
              </Link>
              <Link
                href="/studio/image"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.04] px-4 text-sm font-semibold text-white/72 transition hover:border-white/[0.22] hover:text-white"
              >
                Open Studio
                <VideoCamera size={16} weight="duotone" />
              </Link>
              <Link
                href="/mcp"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.04] px-4 text-sm font-semibold text-white/72 transition hover:border-white/[0.22] hover:text-white"
              >
                Route agents
                <Brain size={16} weight="duotone" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
