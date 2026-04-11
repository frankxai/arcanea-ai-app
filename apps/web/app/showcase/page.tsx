import { Metadata } from "next";
import Link from "next/link";
import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";
import { LiquidGlass } from "@/components/motion/liquid-glass";
import { Magnetic } from "@/components/motion/magnetic";

// Static page — all data is hardcoded constants, no async fetch needed

export const metadata: Metadata = {
  title: "Showcase — Arcanea",
  description:
    "See what the Arcanea Creative Intelligence Platform can build. Live demos of 42 MCP tools, world-building engine, quest generation, and more.",
  openGraph: {
    title: "Showcase — Arcanea Creative Intelligence",
    description:
      "42 AI tools. One connected world. See what happens when you give creators a universe engine.",
  },
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DemoOutput {
  tool: string;
  label: string;
  category: "character" | "location" | "creature" | "quest" | "artifact" | "magic" | "system";
  accent: string;
  icon: string;
  input: Record<string, string | number>;
  output: Record<string, unknown>;
  highlight: string;
}

/* ------------------------------------------------------------------ */
/*  Real MCP Output Data (captured live April 4 2026)                  */
/* ------------------------------------------------------------------ */

const DEMOS: DemoOutput[] = [
  {
    tool: "generate_character",
    label: "Character",
    category: "character",
    accent: "#ef4444",
    icon: "👤",
    input: { element: "Fire", house: "Pyros", gatesOpen: 5, archetype: "rebel strategist" },
    output: {
      name: "Pyrlyn",
      rank: "Master",
      element: "Fire / Earth",
      house: "Pyros",
      patron: "Alera (Voice Gate)",
      godbeast: "Otome — Thunderbird of Truth",
      flaw: "Fears losing control of their power",
      desire: "To reform the institution that failed them",
      secret: "Was rejected by another house first",
      magic: "Channels Fire through Voice attunement, with Earth undertones",
      nextGate: "Sight — but the cost may be a memory they treasure",
    },
    highlight: "One prompt → a character with psychology, history, magic system, and narrative hooks",
  },
  {
    tool: "generate_location",
    label: "Location",
    category: "location",
    accent: "#3b82f6",
    icon: "🏛️",
    input: { element: "Water", type: "underwater temple", alignment: "balanced" },
    output: {
      name: "The Tidal Place",
      guardian: "Leyla (Flow Gate)",
      atmosphere: "Water energy shifts between light and shadow like breathing",
      sound: "Distant rumbling from deep below",
      history: "Once a stronghold of Malachar, reclaimed and purified",
      secret: "The founding stone is a fragment of Nero's original darkness — not corrupted, but fertile",
      hook: "This place heals wounds that magic cannot — but it takes something in return",
    },
    highlight: "Locations have secrets, sensory detail, and narrative hooks built in",
  },
  {
    tool: "generate_creature",
    label: "Creature",
    category: "creature",
    accent: "#a855f7",
    icon: "🦊",
    input: { element: "Void", size: "small", temperament: "friendly" },
    output: {
      name: "ShadeFox",
      species: "Shade fox",
      body: "Semi-transparent body revealing inner void energy",
      eyes: "Reflective silver, seeing more than the visible spectrum",
      distinct: "Its shadow moves independently",
      behavior: "Protective of the weak — will adopt lost travelers",
      lore: "Scholars debate whether ShadeFox species are distant descendants of Yumiko (Dream Fox with Nine Tails)",
      controversy: "Hunters prize its core for alchemical uses — ethically controversial",
    },
    highlight: "Creatures come with ecology, lore connections, and moral complexity",
  },
  {
    tool: "generate_quest",
    label: "Quest",
    category: "quest",
    accent: "#f59e0b",
    icon: "⚔️",
    input: { context: "auto-linked from session" },
    output: {
      title: "Safe Passage for ShadeFox",
      type: "Escort",
      hook: "ShadeFox must reach The Tidal Place alive. Simple — except for everything trying to stop them.",
      stakes: "A secret that could shatter the Academy will be revealed",
      complication1: "The route changes — elemental storms reroute the path",
      complication2: "The protectee has a secret they're not sharing",
      complication3: "An ambush was planned by someone who knew the route",
      linked: "Pyrlyn + ShadeFox + The Tidal Place",
      difficulty: "Master",
    },
    highlight: "Quest gen auto-links ALL creations in your session into a coherent adventure",
  },
  {
    tool: "generate_artifact",
    label: "Artifact",
    category: "artifact",
    accent: "#ffd700",
    icon: "👑",
    input: { element: "Spirit", type: "crown", power: "legendary" },
    output: {
      name: "Maylinn's Sacred Crown",
      material: "Living crystal that grows imperceptibly",
      telltale: "Hums at a specific frequency when danger approaches",
      primary: "Can temporarily open the Heart Gate for the unworthy — at a cost",
      secondary: "Stores memories that can be replayed",
      cost: "Attracts attention from entities that should not be disturbed",
      legend: "Said to be one piece of a set — the others are lost",
      wielders: "Three known wielders — all died differently, all at the peak of their power",
    },
    highlight: "Artifacts have cost, consequence, and history. They change their wielder.",
  },
  {
    tool: "generate_magic",
    label: "Magic Ability",
    category: "magic",
    accent: "#8b5cf6",
    icon: "✨",
    input: { element: "Void", gateLevel: 8, purpose: "seeing through time to find lost memories" },
    output: {
      name: "Shadow Sight",
      gate: "Starweave (Gate 8)",
      guardian: "Elara",
      godbeast: "Vaelith",
      mana: 84,
      anima: 4,
      mastery: "Archmage",
      visual: "Void erupts from the caster's hands in spiraling patterns",
      sensation: "Feels like holding lightning in your veins",
      sideEffect: "Nearby plants grow or wilt depending on the caster's intent",
    },
    highlight: "Magic has cost, sensation, visual spectacle, and unintended consequences",
  },
  {
    tool: "analyze_factions",
    label: "Faction Analysis",
    category: "system",
    accent: "#00bcd4",
    icon: "⚖️",
    input: { context: "auto-analyze session state" },
    output: {
      factions: "Fire Coalition (Pyrlyn) — 100% power share",
      balance: "Dominant imbalance will drive conflict",
      prediction: "Stable but boring. Introduce a disruption.",
      insight: "The engine tracks power dynamics across everything you create",
    },
    highlight: "Real-time faction analysis across your entire world state",
  },
];

/* ------------------------------------------------------------------ */
/*  Stats                                                              */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: "42", label: "MCP Tools", detail: "World-building AI functions" },
  { value: "195", label: "Pages", detail: "Full platform surface" },
  { value: "144", label: "API Routes", detail: "Backend intelligence" },
  { value: "49", label: "Packages", detail: "Open source npm packages" },
  { value: "286", label: "Components", detail: "React UI library" },
  { value: "1,353", label: "Commits", detail: "Engineering depth" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ShowcasePage() {
  return (
    <div className="relative min-h-screen bg-[#09090b]">
      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(127,255,212,0.04),transparent_50%)]" />
      </div>

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* ---- Hero ---- */}
        <section className="pb-12 pt-20 text-center sm:pb-20 sm:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ffd700]/30 bg-[#ffd700]/10 px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ffd700]" />
            <span className="font-mono text-xs tracking-widest text-[#ffd700]">
              LIVE SHOWCASE
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold text-white sm:text-6xl tracking-tight">
            <SplitText as="span" text="One Prompt. " className="text-white" delay={0.1} stagger={0.03} />
            <span className="bg-gradient-to-r from-[#00bcd4] via-[#7fffd4] to-[#ffd700] bg-clip-text text-transparent">
              A Connected World.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Every creation below flowed from the Arc in real time — characters
            with psychology, locations with secrets, quests woven from the threads
            of your world. This is what happens when you give the Luminors room
            to think.
          </p>

          {/* Stats bar */}
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-3 gap-4 sm:grid-cols-6">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center"
              >
                <div className="font-display text-2xl font-bold text-[#00bcd4]">
                  {s.value}
                </div>
                <div className="mt-0.5 text-xs font-medium text-white">
                  {s.label}
                </div>
                <div className="mt-0.5 text-[10px] text-zinc-500">
                  {s.detail}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Platform Scale ---- */}
        <section className="pb-16">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-white">
            What We Built
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "World Engine",
                items: ["Character gen with psychology", "Location gen with secrets", "Creature gen with ecology", "Quest gen with auto-linking", "Artifact gen with consequences", "Magic system with costs", "Faction analysis", "World state tracking"],
                accent: "#00bcd4",
              },
              {
                title: "Creative Intelligence",
                items: ["16 Luminor AI personas", "Multi-provider routing", "Image generation (5 models)", "Voice synthesis", "Research agent", "Canon validation", "Prompt engineering tools", "Story generation"],
                accent: "#ffd700",
              },
              {
                title: "Platform",
                items: ["195 pages", "144 API routes", "286 React components", "Real-time chat", "Gallery & social feed", "Credits & payments", "Academy progression", "Community features"],
                accent: "#a855f7",
              },
              {
                title: "Open Source",
                items: ["49 npm packages", "103 skills", "112 commands", "1,353 commits", "MCP server + bridge", "Agent orchestration", "World engine SDK", "Design system"],
                accent: "#22c55e",
              },
            ].map((col) => (
              <div
                key={col.title}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
              >
                <h3
                  className="mb-3 font-display text-sm font-semibold"
                  style={{ color: col.accent }}
                >
                  {col.title}
                </h3>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-zinc-400"
                    >
                      <span
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: col.accent }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ---- How It Works ---- */}
        <section className="pb-16">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#00bcd4]/20 bg-[#00bcd4]/[0.03] p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-white">
              How the World Engine Works
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Create Anything",
                  desc: "Generate characters, locations, creatures, artifacts, or magic with a single prompt",
                },
                {
                  step: "2",
                  title: "Auto-Link",
                  desc: "The engine tracks everything in your session and connects creations into relationships",
                },
                {
                  step: "3",
                  title: "Generate Stories",
                  desc: "Quest gen weaves your creations into adventures. Faction analysis reveals power dynamics",
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00bcd4]/20 font-mono text-sm font-bold text-[#00bcd4]">
                    {s.step}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {s.title}
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-zinc-400">
                      {s.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Demo Cards ---- */}
        <section className="pb-20">
          <h2 className="mb-2 text-center font-display text-2xl font-bold text-white sm:text-3xl">
            Live Engine Output
          </h2>
          <p className="mb-12 text-center text-sm text-zinc-500">
            Every card below is a real MCP tool response — captured April 4, 2026
          </p>

          <div className="space-y-8">
            {DEMOS.map((demo) => (
              <div
                key={demo.tool}
                className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]"
              >
                {/* Card header */}
                <div
                  className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-3"
                  style={{ borderLeftColor: demo.accent, borderLeftWidth: 3 }}
                >
                  <span className="text-xl">{demo.icon}</span>
                  <div className="flex-1">
                    <span className="font-display text-sm font-semibold text-white">
                      {demo.label}
                    </span>
                    <span className="ml-3 rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                      {demo.tool}
                    </span>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: `${demo.accent}15`,
                      color: demo.accent,
                    }}
                  >
                    {demo.category}
                  </span>
                </div>

                <div className="grid gap-0 sm:grid-cols-2">
                  {/* Input panel */}
                  <div className="border-b border-white/[0.06] bg-black/20 p-5 sm:border-b-0 sm:border-r">
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                      Input
                    </div>
                    <pre className="text-xs leading-relaxed text-zinc-400">
                      {JSON.stringify(demo.input, null, 2)}
                    </pre>
                  </div>

                  {/* Output panel */}
                  <div className="p-5">
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                      Output
                    </div>
                    <dl className="space-y-1.5">
                      {Object.entries(demo.output).map(([key, val]) => (
                        <div key={key} className="flex gap-2 text-xs">
                          <dt className="shrink-0 font-medium text-zinc-500 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </dt>
                          <dd className="text-zinc-300">{String(val)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                {/* Highlight bar */}
                <div
                  className="border-t border-white/[0.06] px-5 py-3"
                  style={{ backgroundColor: `${demo.accent}08` }}
                >
                  <p className="text-xs text-zinc-400">
                    <span style={{ color: demo.accent }} className="font-medium">
                      Why this matters:
                    </span>{" "}
                    {demo.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- The Connection Story ---- */}
        <section className="pb-20">
          <div className="rounded-2xl border border-[#ffd700]/20 bg-[#ffd700]/[0.02] p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-white">
              The Magic: Auto-Linked Narrative
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              We generated 4 things independently — a character, a location, a creature, and a quest.
              The engine automatically linked them into a story:
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-4">
              {[
                { name: "Pyrlyn", role: "Fire Master protagonist", color: "#ef4444" },
                { name: "ShadeFox", role: "Void creature to protect", color: "#a855f7" },
                { name: "The Tidal Place", role: "Destination temple", color: "#3b82f6" },
                { name: "Safe Passage", role: "Quest binding all three", color: "#f59e0b" },
              ].map((n) => (
                <div
                  key={n.name}
                  className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-center"
                >
                  <div
                    className="font-display text-sm font-bold"
                    style={{ color: n.color }}
                  >
                    {n.name}
                  </div>
                  <div className="mt-1 text-[11px] text-zinc-500">{n.role}</div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-zinc-500 italic">
              &quot;ShadeFox must reach The Tidal Place alive. Simple — except for everything trying to stop them.&quot;
              — Auto-generated quest hook
            </p>
          </div>
        </section>

        {/* ---- CTA ---- */}
        <section className="pb-24 text-center">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Build Your World
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-400">
            42 tools. 10 Gates. Infinite worlds. Start creating now.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/chat"
              className="rounded-xl bg-[#00bcd4] px-6 py-3 text-sm font-medium text-black transition hover:bg-[#00bcd4]/80"
            >
              Create Your World
            </Link>
            <Link
              href="/changelog"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition hover:bg-white/[0.08]"
            >
              View Changelog
            </Link>
            <Link
              href="/library"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition hover:bg-white/[0.08]"
            >
              Read the Canon
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
