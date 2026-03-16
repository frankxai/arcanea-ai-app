import type { Metadata } from "next";
import Link from "next/link";
import {
  PhArrowRight,
  PhArrowUpRight,
  PhBooks,
  PhChatCircleDots,
  PhCode,
  PhCrown,
  PhDiamond,
  PhGearSix,
  PhGraduationCap,
  PhPaintBrush,
  PhScroll,
  PhSparkle,
  PhTree,
  PhUsers,
} from "@/lib/phosphor-icons";
import { EvolutionScene } from "./evolution-scene";
import { SplinePreview } from "./spline-preview";

export const metadata: Metadata = {
  title: "3D Evolution Lab",
  description:
    "A full-spectrum proposal for the next Arcanea experience: homepage architecture, key pages, motion system, and launch blueprint.",
  robots: { index: false },
};

const narrativePillars = [
  {
    title: "Build your Realm with Guardians and Luminors.",
    detail:
      "Orchestrate coding swarms, shape worlds, compose music, and write books through Arcanea's living canon.",
  },
  {
    title: "A mythology. A library. An academy.",
    detail: "Three foundations of a creative philosophy, designed as one connected product.",
  },
  {
    title: "Each one has a philosophy. Find yours.",
    detail: "Ten creative partners, each with a distinct cognitive style and lens.",
  },
];

const homepageArchitecture = [
  {
    block: "Hero Portal",
    intent: "Immediate value in under 3 seconds.",
    modules:
      "3D crystal core, canonical headline, contextual CTA pair, trust strip, and guided scroll entry.",
  },
  {
    block: "Creation Command Deck",
    intent: "Show how creation actually happens.",
    modules:
      "Prompt input, mode toggles (write/image/music/world), live guardian recommendation, and output preview.",
  },
  {
    block: "Three Pillars",
    intent: "Establish ecosystem depth without overwhelm.",
    modules: "Sixteen Intelligences, The Library, The Academy with quantified proof points.",
  },
  {
    block: "Guardian Gallery",
    intent: "Help creators self-select their cognitive partner.",
    modules: "Profile cards, philosophy snippets, and direct deep-link to guardian pages.",
  },
  {
    block: "Pathways",
    intent: "Map multiple creator goals to clear next actions.",
    modules:
      "Explore Arcanea, Create Your Arcanea, Imagine Worlds, Write Books, Compose Music, Build Games.",
  },
  {
    block: "Credibility + Conversion",
    intent: "Close with confidence and one primary action.",
    modules: "FAQ, policy confidence, creator testimonials, and strong CTA with pricing clarity.",
  },
];

const keyPages = [
  {
    href: "/chat",
    title: "Chat / Creation Studio",
    icon: PhChatCircleDots,
    purpose: "Daily command center for co-creation.",
    modules: "Thread memory, mode presets, canonical context injection, export to project artifacts.",
    cta: "Start with your first intent.",
  },
  {
    href: "/studio",
    title: "Studio",
    icon: PhPaintBrush,
    purpose: "Asset generation and iteration workspace.",
    modules: "Image/audio workflows, prompt chains, reference board, version compare.",
    cta: "Generate and refine.",
  },
  {
    href: "/library",
    title: "Library",
    icon: PhBooks,
    purpose: "Canonical knowledge and philosophy system.",
    modules: "Collection navigation, semantic search, related-text graph, quote extraction.",
    cta: "Study the codex.",
  },
  {
    href: "/academy",
    title: "Academy",
    icon: PhGraduationCap,
    purpose: "Skill progression through the Ten Gates.",
    modules: "Stage map, assignments, gate unlock criteria, creator progress tracking.",
    cta: "Advance your practice.",
  },
  {
    href: "/lore",
    title: "Lore",
    icon: PhScroll,
    purpose: "Mythic context that powers all interfaces.",
    modules: "Entities, timelines, relationships, and route-level canon references.",
    cta: "Enter the cosmology.",
  },
  {
    href: "/gallery",
    title: "Gallery",
    icon: PhDiamond,
    purpose: "Visual proof of output quality and identity.",
    modules: "Curated showcases, style filters, guardian attribution, remix into Studio.",
    cta: "See what is possible.",
  },
  {
    href: "/community",
    title: "Community",
    icon: PhUsers,
    purpose: "Social layer for creator momentum.",
    modules: "Challenges, collaborative rituals, featured builds, and peer feedback loops.",
    cta: "Create with others.",
  },
  {
    href: "/developers",
    title: "Developers",
    icon: PhCode,
    purpose: "Technical depth for builders integrating Arcanea.",
    modules: "API docs, SDK examples, deployment guides, integration patterns.",
    cta: "Build on Arcanea.",
  },
  {
    href: "/pricing",
    title: "Pricing",
    icon: PhCrown,
    purpose: "Monetization clarity without friction.",
    modules: "Free-to-start path, plan matrix, usage philosophy, upgrade moments.",
    cta: "Choose your growth path.",
  },
  {
    href: "/about",
    title: "About + Contact",
    icon: PhGearSix,
    purpose: "Trust, mission, and founder-level narrative.",
    modules: "Origin story, philosophy, roadmap posture, direct contact channel.",
    cta: "Connect with Arcanea.",
  },
];

const launchPhases = [
  {
    phase: "Phase 1",
    title: "Core Experience",
    points: "Homepage 3D hero, command deck, pillars, guardian gallery, and hard conversion CTA.",
  },
  {
    phase: "Phase 2",
    title: "Page System",
    points: "Chat, Studio, Library, Academy, Lore, Gallery with shared motion and glass primitives.",
  },
  {
    phase: "Phase 3",
    title: "Growth Layer",
    points: "Community and Developers expansion, case studies, social proof, and pricing experiments.",
  },
  {
    phase: "Phase 4",
    title: "Polish + Intelligence",
    points: "Adaptive onboarding, guardian-driven personalization, and behavior-informed page ordering.",
  },
];

export default function ThreeDEvolutionPage() {
  return (
    <main className="min-h-screen bg-[#070b16] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <EvolutionScene />
        <div className="relative mx-auto flex min-h-[88vh] w-full max-w-7xl flex-col justify-end px-6 pb-14 pt-24 md:pb-20">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
            <PhSparkle className="h-3.5 w-3.5" />
            Design Labs / 3D Evolution
          </div>

          <h1 className="mt-6 max-w-4xl text-[clamp(2.5rem,7vw,5.8rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
            Arcanea 3D Evolution
            <span className="block bg-gradient-to-r from-cyan-200 via-blue-300 to-violet-300 bg-clip-text text-transparent">
              A complete homepage + key pages proposal.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
            Ground-up redesign direction that preserves current narrative language while upgrading spatial depth,
            product clarity, and conversion architecture. This is meant to be built, not admired.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/v3"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/15 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/25"
            >
              Compare with current v3
              <PhArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href="#blueprint"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              View end-to-end blueprint
              <PhArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <p className="mb-6 text-xs uppercase tracking-[0.24em] text-cyan-100/80">Preserved Narrative</p>
        <div className="grid gap-4 md:grid-cols-3">
          {narrativePillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-semibold leading-tight text-white">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{pillar.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Homepage System</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Proposed architecture</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {homepageArchitecture.map((item) => (
            <article
              key={item.block}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-100/70">{item.intent}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{item.block}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{item.modules}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">3D Layer Strategy</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Spline-ready integration</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70">
            The route ships with two 3D layers: a native React Three Fiber atmosphere and an optional Spline scene slot
            for high-fidelity hero objects, camera paths, and polished interaction.
          </p>
        </div>
        <SplinePreview />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Key Pages</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Full information architecture with page-level depth
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {keyPages.map((page) => (
            <article key={page.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-cyan-200/25 bg-cyan-200/10 p-2.5 text-cyan-100">
                    <page.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{page.title}</h3>
                    <p className="text-sm text-white/65">{page.purpose}</p>
                  </div>
                </div>
                <Link
                  href={page.href}
                  className="text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                >
                  Open
                </Link>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-white/70">{page.modules}</p>
              <p className="mt-3 text-sm text-cyan-100/90">{page.cta}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="blueprint" className="mx-auto max-w-7xl px-6 py-10 pb-24 md:py-14 md:pb-28">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Delivery Blueprint</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">End-to-end implementation path</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {launchPhases.map((phase) => (
            <article key={phase.phase} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-100/70">{phase.phase}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{phase.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{phase.points}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-cyan-200/25 bg-cyan-200/10 p-6">
          <p className="text-sm leading-relaxed text-cyan-50">
            Recommended next action: synthesize this proposal into a production route at
            <span className="mx-1 font-semibold">`/app/v4`</span>
            using the same narrative backbone as v3, with this page as the implementation contract.
          </p>
        </div>
      </section>
    </main>
  );
}
