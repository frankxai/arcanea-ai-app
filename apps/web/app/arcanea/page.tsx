import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArcaneaProofCore } from "@/components/visuals/arcanea-proof-core";
import {
  ArrowRight,
  Atom,
  BookOpen,
  Compass,
  Command,
  Database,
  Diamond,
  Eye,
  GitBranch,
  Globe,
  ImageSquare,
  Lock,
  MagicWand,
  MapTrifold,
  Planet,
  Scales,
  Scroll,
  ShieldStar,
  Sparkle,
  Stack,
  WarningCircle,
} from "@/lib/phosphor-icons";
import {
  ACTIVATION_LANES,
  FLAGSHIP_STORY_SEED,
  FORGE_CANDIDATES,
  MATERIAL_FOUNDATIONS,
  MARKETPLACE_GATES,
  PROOF_CORE_METRICS,
  SWARM_OPERATORS,
  buildGenesisHref,
  type ArcaneaActivationLane,
  type ArcaneaActivationStatus,
} from "@/lib/arcanea/activation";

export const metadata: Metadata = {
  title: "Arcanea Activation Console | Arcanea",
  description:
    "A live Arcanea operating surface for Genesis proof, living worlds, author-team packets, visual QA, plugin forge candidates, and rights-gated marketplace review.",
  alternates: { canonical: "/arcanea" },
};

const statusStyles: Record<ArcaneaActivationStatus, string> = {
  live: "border-emerald-300/28 bg-emerald-300/10 text-emerald-100",
  staged: "border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)]",
  draft: "border-[var(--arc-brand-arcanean-gold)]/32 bg-[var(--arc-brand-arcanean-gold)]/10 text-[var(--arc-brand-arcanean-gold)]",
  blocked: "border-rose-300/28 bg-rose-300/10 text-rose-100",
};

const laneIcons = {
  "genesis-proof": Sparkle,
  "world-graph": Globe,
  "author-team": BookOpen,
  "visual-forge": ImageSquare,
  "canon-guardian": ShieldStar,
  marketplace: Scales,
};

const foundationIcons = {
  "Glass Command Shell": Command,
  "Gold Provenance Seal": Diamond,
  "Codex Paper Layer": Scroll,
  "World Graph Lattice": Planet,
  "Rights Review Vault": Lock,
};

function StatusBadge({ status }: { status: ArcaneaActivationStatus }) {
  return (
    <span
      className={`inline-flex min-w-[4rem] items-center justify-center rounded-md border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function LaneCard({ lane }: { lane: ArcaneaActivationLane }) {
  const LaneIcon = laneIcons[lane.id as keyof typeof laneIcons] ?? Compass;

  return (
    <article className="group flex h-full flex-col justify-between rounded-lg border border-white/[0.08] bg-black/38 p-4 backdrop-blur-xl transition-colors hover:border-white/[0.18]">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.05] text-white/74">
            <LaneIcon size={19} weight="duotone" />
          </div>
          <StatusBadge status={lane.status} />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">{lane.title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/58">{lane.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {lane.outputs.map((output) => (
            <span
              key={output}
              className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs text-white/50"
            >
              {output}
            </span>
          ))}
        </div>

        <p className="border-l border-[var(--arc-brand-arcanean-gold)]/36 pl-3 text-xs leading-5 text-white/42">
          {lane.risks[0]}
        </p>
      </div>

      <Link
        href={lane.route}
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] transition-colors hover:text-white"
      >
        {lane.action}
        <ArrowRight size={14} weight="bold" />
      </Link>
    </article>
  );
}

function MarketplaceState({ state }: { state: "required" | "ready" | "blocked" }) {
  const styles = {
    required: "border-[var(--arc-brand-arcanean-gold)]/32 text-[var(--arc-brand-arcanean-gold)]",
    ready: "border-emerald-300/28 text-emerald-100",
    blocked: "border-rose-300/28 text-rose-100",
  };

  return (
    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] ${styles[state]}`}>
      {state}
    </span>
  );
}

export default function ArcaneaActivationPage() {
  const genesisHref = buildGenesisHref();
  const heroStats = PROOF_CORE_METRICS.map((metric, index) => ({
    ...metric,
    icon: [Atom, GitBranch, Lock][index] ?? Sparkle,
  }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--arc-cosmic-void)] text-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/brand/arcanea-dashboard-hero-premium.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-24"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--arc-cosmic-void)_0%,rgba(9,9,11,0.92)_48%,rgba(9,9,11,0.74)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.14)_0%,var(--arc-cosmic-void)_92%)]" />
      </div>

      <section className="mx-auto grid min-h-[780px] w-full max-w-7xl gap-6 px-5 py-10 md:min-h-[840px] md:grid-cols-[0.82fr_1.18fr] md:px-8 md:py-12">
        <div className="flex flex-col justify-center">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-md border border-[var(--arc-brand-arcanean-gold)]/28 bg-[var(--arc-brand-arcanean-gold)]/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--arc-brand-arcanean-gold)]">
              <Compass size={14} weight="duotone" />
              Arcanea
            </span>
            <span className="rounded-md border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/54">
              Activation Console
            </span>
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-normal text-white sm:text-5xl lg:text-7xl">
            Arcanea, operating as a living proof engine.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/62 md:text-lg">
            A working material system for Genesis proofs, Arion and Mamoru canon pressure, world graph routing,
            author-team packets, visual QA, private plugin forge candidates, and rights-gated marketplace review.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={genesisHref}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--arc-brand-arcanean-gold)] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-white"
            >
              Answer the call
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link
              href="/worlds"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/[0.28] hover:bg-white/[0.08]"
            >
              Open worlds
              <MapTrifold size={16} weight="duotone" />
            </Link>
            <Link
              href="/studio/author"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/[0.28] hover:bg-white/[0.08]"
            >
              Author studio
              <BookOpen size={16} weight="duotone" />
            </Link>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => {
              const StatIcon = stat.icon;
              return (
                <div key={stat.label} className="rounded-lg border border-white/[0.08] bg-black/34 p-4 backdrop-blur-lg">
                  <div className="flex items-center justify-between gap-3 text-white/42">
                    <span className="text-xs uppercase tracking-[0.16em]">{stat.label}</span>
                    <StatIcon size={16} weight="duotone" />
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-white">{stat.value}</div>
                  <p className="mt-2 text-xs leading-5 text-white/42">{stat.detail}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex min-h-[560px] items-center">
          <ArcaneaProofCore />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-16 md:grid-cols-[0.78fr_1.22fr] md:px-8 md:pb-24">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--arc-brand-arcanean-gold)]">
            Material Foundations
          </p>
          <h2 className="mt-2 max-w-xl text-2xl font-semibold leading-tight text-white md:text-4xl">
            The interface now has materials with jobs.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/54">
            Arcanea needs a foundation that can carry product state, mythology, provenance, and rights boundaries at once.
            These layers become the visual grammar for the app, not decoration.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[var(--arc-brand-atlantean-teal)]/24 bg-[var(--arc-brand-atlantean-teal)]/10 px-3 py-2 text-xs text-[var(--arc-brand-atlantean-teal)]">
            <Eye size={14} weight="duotone" />
            Visual QA required before promotion
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {MATERIAL_FOUNDATIONS.map((foundation) => {
            const FoundationIcon =
              foundationIcons[foundation.title as keyof typeof foundationIcons] ?? Compass;

            return (
              <article
                key={foundation.title}
                className="rounded-lg border border-white/[0.08] bg-black/34 p-4 backdrop-blur-xl transition-colors hover:border-white/[0.18]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-white/64">
                    <FoundationIcon size={19} weight="duotone" />
                  </div>
                  <StatusBadge status={foundation.state} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{foundation.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/38">{foundation.material}</p>
                <p className="mt-3 text-sm leading-6 text-white/54">{foundation.role}</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs text-white/40">{foundation.signal}</span>
                  <Link
                    href={foundation.route}
                    className="inline-flex items-center gap-2 text-xs font-medium text-[var(--arc-brand-atlantean-teal)] hover:text-white"
                  >
                    Open surface
                    <ArrowRight size={13} weight="bold" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">
              Activation Lanes
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">The working route map</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-white/50">
            Each lane points to an existing app surface or an explicit blocked gate. Drafts stay drafts until review promotes them.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ACTIVATION_LANES.map((lane) => (
            <LaneCard key={lane.id} lane={lane} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-16 md:grid-cols-[0.84fr_1.16fr] md:px-8 md:pb-24">
        <div className="rounded-lg border border-white/[0.08] bg-black/38 p-5 backdrop-blur-xl md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--arc-brand-arcanean-gold)]">
                Flagship Seed
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{FLAGSHIP_STORY_SEED.title}</h2>
            </div>
            <MagicWand size={22} weight="duotone" className="text-[var(--arc-brand-arcanean-gold)]" />
          </div>
          <p className="text-sm leading-6 text-white/58">{FLAGSHIP_STORY_SEED.logline}</p>
          <p className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 text-xs leading-5 text-white/46">
            {FLAGSHIP_STORY_SEED.canonStatus}
          </p>

          <div className="mt-6 space-y-3">
            {FLAGSHIP_STORY_SEED.productPath.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.04] text-xs text-white/46">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-white/62">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {FLAGSHIP_STORY_SEED.characters.map((character) => (
            <article key={character.name} className="rounded-lg border border-white/[0.08] bg-black/34 p-4 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white">{character.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/36">{character.role}</p>
                </div>
                <Stack size={16} weight="duotone" className="text-white/42" />
              </div>
              <p className="mt-4 text-sm leading-6 text-white/54">{character.proofPressure}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">
              First Scenes
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Proof-sized story starts</h2>
          </div>
          <Link
            href="/living-lore"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] hover:text-white"
          >
            Open living lore
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {FLAGSHIP_STORY_SEED.firstScenes.map((scene, index) => (
            <article key={scene} className="rounded-lg border border-white/[0.08] bg-black/34 p-4 backdrop-blur-xl">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--arc-brand-arcanean-gold)]">
                Scene {index + 1}
              </div>
              <p className="mt-3 text-sm leading-6 text-white/56">{scene}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-16 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:pb-24">
        <div>
          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--arc-brand-arcanean-gold)]">
              Skill To Plugin Forge
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Private plugin candidates</h2>
          </div>

          <div className="space-y-3">
            {FORGE_CANDIDATES.map((candidate) => (
              <article key={candidate.target} className="rounded-lg border border-white/[0.08] bg-black/34 p-4 backdrop-blur-xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">{candidate.target}</h3>
                    <p className="mt-1 font-mono text-xs text-white/36">{candidate.source}</p>
                  </div>
                  <span className="rounded-md border border-white/[0.1] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white/46">
                    {candidate.privateDataRisk} risk
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/56">{candidate.reason}</p>
                <p className="mt-3 border-l border-[var(--arc-brand-atlantean-teal)]/34 pl-3 text-xs leading-5 text-white/42">
                  {candidate.nextValidation}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">
              Swarm Operators
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Council lanes</h2>
          </div>

          <div className="space-y-3">
            {SWARM_OPERATORS.map((operator) => (
              <article key={operator.name} className="rounded-lg border border-white/[0.08] bg-black/34 p-4 backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-white/56">
                    <Database size={17} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{operator.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/54">{operator.remit}</p>
                    <p className="mt-2 text-xs text-white/36">Evidence: {operator.evidence}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8 md:pb-28">
        <div className="rounded-lg border border-rose-300/16 bg-[linear-gradient(135deg,rgba(120,20,38,0.22),rgba(0,0,0,0.46)_46%,rgba(197,162,111,0.09))] p-5 backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-rose-100">
                <WarningCircle size={20} weight="duotone" />
                <p className="text-xs font-medium uppercase tracking-[0.2em]">Marketplace gate closed</p>
              </div>
              <h2 className="text-2xl font-semibold text-white md:text-3xl">Collectible intent is not mint readiness.</h2>
              <p className="mt-3 text-sm leading-6 text-white/58">
                Arcanea can prepare metadata, visual assets, and Story Protocol registration intent. Public sale,
                NFT minting, or marketplace listing waits for explicit source, model, canon, license, and cultural review.
              </p>
            </div>
            <Link
              href="/protocol"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.14] bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-white/[0.28] hover:bg-white/[0.08]"
            >
              Review protocol
              <Scales size={16} weight="duotone" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {MARKETPLACE_GATES.map((gate) => (
              <article key={gate.title} className="rounded-lg border border-white/[0.08] bg-black/32 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">{gate.title}</h3>
                  <MarketplaceState state={gate.state} />
                </div>
                <p className="mt-3 text-xs leading-5 text-white/46">{gate.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
