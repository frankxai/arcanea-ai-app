import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  PhArrowRight,
  PhBooks,
  PhCheckCircle,
  PhCompass,
  PhCopy,
  PhEye,
  PhImage,
  PhMusicNotes,
  PhPlay,
  PhShieldStar,
  PhSparkle,
  PhStack,
  PhTrendUp,
  PhVideoCamera,
} from "@/lib/phosphor-icons";

const IMAGE_BASE = "/images/arcanea-world-engine/god-run-2026-07-06";
const SOCIAL_BASE = `${IMAGE_BASE}/social-overlays`;

export const metadata: Metadata = {
  title: "Visual World Engine - Arcanea",
  description:
    "A canon-aware Arcanea portal for generated world frames, social campaign masters, lore lanes, Genesis proof, music, webtoon, and storybook seeds.",
  openGraph: {
    title: "Visual World Engine - Arcanea",
    description:
      "Explore Arcanea's approved visual world engine assets, social campaign masters, and proof-ready creative pathways.",
    images: [
      {
        url: `${IMAGE_BASE}/arc-visual-043-unity-kyuro-bridge-action.png`,
        width: 941,
        height: 1672,
        alt: "Arcanea Unity Kyuro bridge action",
      },
    ],
  },
  alternates: { canonical: "/visual-world-engine" },
};

const runStats = [
  { value: "38", label: "source frames", detail: "generated and inspected" },
  { value: "30", label: "gallery candidates", detail: "public masters and thumbnails" },
  { value: "36", label: "social masters", detail: "4 platform formats" },
  { value: "76", label: "VIS assets", detail: "last completed scan" },
  { value: "29/30", label: "peak score", detail: "premium gate pass" },
];

const portalLanes = [
  {
    title: "Gallery and Atlas",
    eyebrow: "Discover",
    description:
      "Approved worlds, Gate frames, proof artifacts, Guardians, Godbeasts, and scale studies for browsing and future manifest routing.",
    href: "/gallery",
    cta: "Open gallery",
    icon: PhImage,
  },
  {
    title: "Living Lore",
    eyebrow: "Story",
    description:
      "Story, webtoon, book, and Academy Gate-Descent seeds that explain why each image matters in the Arcanea journey.",
    href: "/living-lore",
    cta: "Enter lore",
    icon: PhBooks,
  },
  {
    title: "Genesis Proof",
    eyebrow: "Create",
    description:
      "Proof-ready prompts and artifacts that can become creator-owned packets once the registry lane is approved.",
    href: "/genesis",
    cta: "Start proof",
    icon: PhSparkle,
  },
  {
    title: "Social Launch Room",
    eyebrow: "Approve",
    description:
      "Platform-ready social masters, captions, first-cut scripts, blockers, and rights gates for human publishing review.",
    href: "/visual-world-engine/social",
    cta: "Open launch room",
    icon: PhCopy,
  },
  {
    title: "Music and Motion",
    eyebrow: "Perform",
    description:
      "Visual covers, stage worlds, and motion-source frames for songs, shorts, rituals, and proof-backed performance loops.",
    href: "/music-studio",
    cta: "Open music studio",
    icon: PhMusicNotes,
  },
];

const featuredAssets = [
  {
    title: "Unity Kyuro Bridge Action",
    gate: "Unity Gate",
    guardian: "Ino",
    score: "29/30",
    image: `${IMAGE_BASE}/arc-visual-043-unity-kyuro-bridge-action.png`,
    thumb: `${IMAGE_BASE}/arc-visual-043-unity-kyuro-bridge-action-thumb.jpg`,
    job: "Creators actively coordinate across Kyuro's living bridge infrastructure to stabilize a proof artifact.",
    lane: "action hook",
  },
  {
    title: "Gate Stays Open Consent Exit",
    gate: "Foundation Gate",
    guardian: "Lyssandria",
    score: "28/30",
    image: `${IMAGE_BASE}/arc-visual-044-gate-stays-open-consent-exit.png`,
    thumb: `${IMAGE_BASE}/arc-visual-044-gate-stays-open-consent-exit-thumb.jpg`,
    job: "A humane Gate-Descent story frame where witness, restraint, and consent open the exit.",
    lane: "story source",
  },
  {
    title: "World Tower Dragon Habitat Bridge",
    gate: "Foundation Gate",
    guardian: "Lyssandria",
    score: "27/30",
    image: `${IMAGE_BASE}/arc-visual-045-world-tower-dragon-habitat-bridge.png`,
    thumb: `${IMAGE_BASE}/arc-visual-045-world-tower-dragon-habitat-bridge-thumb.jpg`,
    job: "Healthy world-tower scale with a peaceful dragon habitat and vibrant fabric bridge, approved with crop caution.",
    lane: "scale world",
  },
  {
    title: "Unity Cooperation Lattice",
    gate: "Unity Gate",
    guardian: "Ino",
    score: "29/30",
    image: `${IMAGE_BASE}/arc-visual-040-unity-kyuro-cooperation-lattice.png`,
    thumb: `${IMAGE_BASE}/arc-visual-040-unity-kyuro-cooperation-lattice-thumb.jpg`,
    job: "The corrected Unity pass: Kyuro becomes cooperation infrastructure while creators actively stabilize, witness, release, and protect proof.",
    lane: "cooperation hook",
  },
  {
    title: "Webtoon Gate Choice",
    gate: "Foundation Gate",
    guardian: "Lyssandria",
    score: "28/30",
    image: `${IMAGE_BASE}/arc-visual-041-webtoon-gate-choice-blank-ledger.png`,
    thumb: `${IMAGE_BASE}/arc-visual-041-webtoon-gate-choice-blank-ledger-thumb.jpg`,
    job: "A story-portal frame for the Gate-Descent choice: blank ledger, consent exit, and friends holding the Gate open together.",
    lane: "webtoon source",
  },
  {
    title: "Music Resonance Proof Cover",
    gate: "Voice Gate",
    guardian: "Alera",
    score: "28/30",
    image: `${IMAGE_BASE}/arc-visual-042-music-resonance-proof-cover.png`,
    thumb: `${IMAGE_BASE}/arc-visual-042-music-resonance-proof-cover-thumb.jpg`,
    job: "A square cover source where live performance becomes a visible proof artifact inside a quiet Arcanea amphitheater.",
    lane: "cover source",
  },
  {
    title: "Veloura Membrane Corridor",
    gate: "Flow Gate",
    guardian: "Leyla",
    score: "29/30",
    image: `${IMAGE_BASE}/arc-visual-036-flow-gate-veloura-membrane-corridor.png`,
    thumb: `${IMAGE_BASE}/arc-visual-036-flow-gate-veloura-membrane-corridor-thumb.jpg`,
    job: "A corrected Flow Gate world where Veloura reads as aquifer membrane and living corridor weather.",
    lane: "world portal",
  },
  {
    title: "Starweave Perspective Loom",
    gate: "Starweave",
    guardian: "Elara",
    score: "28/30",
    image: `${IMAGE_BASE}/arc-visual-037-starweave-vaelith-perspective-loom.png`,
    thumb: `${IMAGE_BASE}/arc-visual-037-starweave-vaelith-perspective-loom-thumb.jpg`,
    job: "A perspective-engine observatory where Vaelith becomes architecture, not decoration.",
    lane: "story atlas",
  },
  {
    title: "Source Meta-Consciousness Atlas",
    gate: "Source Gate",
    guardian: "Shinkami",
    score: "28/30",
    image: `${IMAGE_BASE}/arc-visual-039-source-gate-shinkami-meta-consciousness-atlas.png`,
    thumb: `${IMAGE_BASE}/arc-visual-039-source-gate-shinkami-meta-consciousness-atlas-thumb.jpg`,
    job: "A proof chamber that keeps Source as meta-consciousness infrastructure and guide logic.",
    lane: "proof atlas",
  },
  {
    title: "Fire Gate Forge Titan",
    gate: "Fire Gate",
    guardian: "Draconia",
    score: "29/30",
    image: `${IMAGE_BASE}/arc-visual-033-fire-gate-draconis-healthy-forge-titan.png`,
    thumb: `${IMAGE_BASE}/arc-visual-033-fire-gate-draconis-healthy-forge-titan-thumb.jpg`,
    job: "Constructive scale: Draconis as a habitat-strength forge titan, not a boss-fight spectacle.",
    lane: "social hook",
  },
  {
    title: "Heart Realm Living Ark",
    gate: "Heart Gate",
    guardian: "Maylinn",
    score: "29/30",
    image: `${IMAGE_BASE}/arc-visual-028-heart-realm-living-ark-non-dragon.png`,
    thumb: `${IMAGE_BASE}/arc-visual-028-heart-realm-living-ark-non-dragon-thumb.jpg`,
    job: "A non-dragon megascale living ark with creator-scale bridges, fabric, water, and care.",
    lane: "world scale",
  },
  {
    title: "Music Portal Bloom",
    gate: "Voice Gate",
    guardian: "Alera",
    score: "29/30",
    image: `${IMAGE_BASE}/arc-visual-027-music-portal-bloom-clean.png`,
    thumb: `${IMAGE_BASE}/arc-visual-027-music-portal-bloom-clean-thumb.jpg`,
    job: "A clean music cover source frame where sound becomes an inspectable proof bloom.",
    lane: "music seed",
  },
];

const campaignQueue = [
  {
    title: "Proof Needs People",
    asset: "arc-social-040-unity-cooperation-lattice",
    gate: "Unity Gate",
    platforms: "TikTok, Reels, Shorts",
    score: "29/30",
    image: `${SOCIAL_BASE}/vertical-9x16/arc-social-040-unity-cooperation-lattice-vertical-9x16.png`,
  },
  {
    title: "Hold The Gate Open",
    asset: "arc-social-041-webtoon-gate-choice",
    gate: "Foundation Gate",
    platforms: "Reels, Webtoon, Shorts",
    score: "28/30",
    image: `${SOCIAL_BASE}/vertical-9x16/arc-social-041-webtoon-gate-choice-vertical-9x16.png`,
  },
  {
    title: "The Song Leaves Proof",
    asset: "arc-social-042-music-resonance-proof",
    gate: "Voice Gate",
    platforms: "Shorts, YouTube, music",
    score: "28/30",
    image: `${SOCIAL_BASE}/vertical-9x16/arc-social-042-music-resonance-proof-vertical-9x16.png`,
  },
  {
    title: "Power That Builds",
    asset: "arc-social-033-fire-gate-forge-titan",
    gate: "Fire Gate",
    platforms: "TikTok, Reels, Shorts",
    score: "29/30",
    image: `${SOCIAL_BASE}/vertical-9x16/arc-social-033-fire-gate-forge-titan-vertical-9x16.png`,
  },
  {
    title: "Scale Is A Responsibility",
    asset: "arc-social-028-heart-realm-living-ark",
    gate: "Heart Gate",
    platforms: "Instagram Feed, X",
    score: "29/30",
    image: `${SOCIAL_BASE}/vertical-9x16/arc-social-028-heart-realm-living-ark-vertical-9x16.png`,
  },
  {
    title: "A World Big Enough To Practice In",
    asset: "arc-social-025-world-tower-practice",
    gate: "Heart Gate",
    platforms: "Reels, TikTok, carousel",
    score: "29/30",
    image: `${SOCIAL_BASE}/vertical-9x16/arc-social-025-world-tower-practice-vertical-9x16.png`,
  },
  {
    title: "Make The Song Visible",
    asset: "arc-social-027-music-portal-bloom",
    gate: "Voice Gate",
    platforms: "Shorts, YouTube, music",
    score: "29/30",
    image: `${SOCIAL_BASE}/vertical-9x16/arc-social-027-music-portal-bloom-vertical-9x16.png`,
  },
  {
    title: "Luminor Is Earned",
    asset: "arc-social-031-luminor-rank-proof",
    gate: "Source Gate",
    platforms: "X, Instagram, lore",
    score: "28/30",
    image: `${SOCIAL_BASE}/vertical-9x16/arc-social-031-luminor-rank-proof-vertical-9x16.png`,
  },
  {
    title: "Turn Performance Into Proof",
    asset: "arc-social-035-music-proof-stage",
    gate: "Voice Gate",
    platforms: "Shorts, Reels, stage",
    score: "27/30",
    image: `${SOCIAL_BASE}/vertical-9x16/arc-social-035-music-proof-stage-vertical-9x16.png`,
  },
];

const productionSteps = [
  "Canon and provenance sidecars before registry writes",
  "Exact copy rendered in code overlays, never baked into generated pixels",
  "Human approval before external publishing or scheduling",
  "DB, registry, and web3 readiness prepared but not minted",
];

type ArcIcon = typeof PhImage;

const routeLinks: { href: string; label: string; icon: ArcIcon }[] = [
  { href: "/gallery", label: "Approved gallery candidates", icon: PhImage },
  { href: "/living-lore", label: "Story and webtoon context", icon: PhBooks },
  { href: "/genesis", label: "Proof artifact creation", icon: PhSparkle },
  { href: "/visual-world-engine/social", label: "Social launch approval room", icon: PhCopy },
  { href: "/music-studio", label: "Music and performance seeds", icon: PhMusicNotes },
  { href: "/worlds", label: "Living world templates", icon: PhStack },
];

const proofSignals: { label: string; icon: ArcIcon }[] = [
  { icon: PhEye, label: "Actual exports inspected" },
  { icon: PhTrendUp, label: "Social hooks scored" },
  { icon: PhVideoCamera, label: "Motion-ready sources selected" },
  { icon: PhShieldStar, label: "Registry route gated" },
];

export default function VisualWorldEnginePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050608] text-white">
      <section className="relative min-h-[88vh] overflow-hidden border-b border-white/[0.08]">
        <Image
          src={`${IMAGE_BASE}/arc-visual-036-flow-gate-veloura-membrane-corridor.png`}
          alt="Arcanea Flow Gate Veloura membrane corridor"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050608_0%,rgba(5,6,8,0.82)_36%,rgba(5,6,8,0.32)_72%,rgba(5,6,8,0.18)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6">
          <div className="w-full max-w-[calc(100vw-2rem)] pb-8 sm:max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/[0.14] bg-black/35 px-3 py-2 text-sm text-white/70">
              <PhShieldStar size={16} weight="fill" className="text-[#f3c969]" />
              Arcanea god-mode visual run - approval portal
            </div>
            <h1 className="font-display text-4xl font-semibold leading-[0.98] text-white sm:text-5xl md:text-7xl">
              <span className="block sm:inline">Visual World</span>{" "}
              <span className="block sm:inline">Engine</span>
            </h1>
            <p className="mt-5 max-w-[20.5rem] text-base leading-7 text-white/72 sm:max-w-2xl md:text-xl md:leading-8">
              <span className="sm:hidden">
                Canon-safe frames, social masters, story lanes, and music seeds from the 2026-07-06 image loop.
              </span>
              <span className="hidden sm:inline">
                Canon-aware source frames, social campaign masters, story lanes, music seeds, and Genesis proof routes from the 2026-07-06 Arcanea image loop.
              </span>
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/visual-world-engine/social"
                className="inline-flex w-full max-w-[20.5rem] items-center justify-center gap-2 rounded-lg bg-[#f3c969] px-5 py-3 text-sm font-semibold text-[#090806] transition hover:bg-[#ffd978] sm:w-auto sm:max-w-none"
              >
                <PhPlay size={16} weight="fill" />
                Open launch room
              </Link>
              <Link
                href="/gallery"
                className="inline-flex w-full max-w-[20.5rem] items-center justify-center gap-2 rounded-lg border border-white/[0.16] bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/[0.28] hover:bg-white/[0.10] sm:w-auto sm:max-w-none"
              >
                <PhImage size={16} weight="fill" />
                Open gallery
              </Link>
              <Link
                href="/genesis"
                className="inline-flex w-full max-w-[20.5rem] items-center justify-center gap-2 rounded-lg border border-white/[0.16] bg-black/25 px-5 py-3 text-sm font-semibold text-white/82 transition hover:border-[#6fe8d3]/40 hover:text-white sm:w-auto sm:max-w-none"
              >
                <PhSparkle size={16} weight="fill" className="text-[#6fe8d3]" />
                Start proof
              </Link>
            </div>
          </div>

          <div className="grid gap-3 border-t border-white/[0.10] pt-6 sm:grid-cols-2 lg:grid-cols-5">
            {runStats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-white/[0.10] bg-black/36 p-4">
                <div className="text-3xl font-semibold text-white">{stat.value}</div>
                <div className="mt-1 text-sm font-medium text-white/72">{stat.label}</div>
                <div className="mt-2 text-xs leading-5 text-white/45">{stat.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.08] bg-[#070a0d] px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-5">
          {portalLanes.map((lane) => {
            const Icon = lane.icon;
            return (
              <Link
                key={lane.title}
                href={lane.href}
                className="group rounded-lg border border-white/[0.10] bg-white/[0.035] p-5 transition hover:border-[#6fe8d3]/35 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold uppercase text-[#6fe8d3]">{lane.eyebrow}</span>
                  <Icon size={20} weight="fill" className="text-[#f3c969]" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">{lane.title}</h2>
                <p className="mt-3 min-h-[96px] text-sm leading-6 text-white/58">{lane.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white/82 group-hover:text-white">
                  {lane.cta}
                  <PhArrowRight size={15} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-[#6fe8d3]">Approved visual lanes</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-5xl">
                Source frames with a job
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/58">
              Each frame is scored, canon-checked, crop-aware, and mapped to a product route. The strongest work has one first read, one emotional hook, and one next action.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredAssets.map((asset) => (
              <article key={asset.title} className="overflow-hidden rounded-lg border border-white/[0.10] bg-white/[0.035]">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={asset.thumb}
                    alt={asset.title}
                    fill
                    unoptimized
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute left-3 top-3 rounded-lg border border-black/25 bg-black/62 px-3 py-2 text-xs font-semibold text-white">
                    {asset.score}
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-lg border border-white/[0.14] bg-black/62 px-3 py-2 text-xs text-white/82">
                    {asset.lane}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/46">
                    <span>{asset.gate}</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>{asset.guardian}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-white">{asset.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/58">{asset.job}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="campaign-queue" className="border-y border-white/[0.08] bg-[#080b0f] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.45fr]">
            <div>
              <p className="text-sm font-semibold uppercase text-[#f3c969]">Social campaign queue</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-5xl">
                Built for the first second
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/60">
                Nine campaign seeds now have deterministic platform masters. Vertical frames carry TikTok, Reels, Stories, and Shorts; square and wide exports support X, YouTube, and editorial surfaces.
              </p>
              <Link
                href="/visual-world-engine/social"
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#f3c969]/24 bg-[#f3c969]/10 px-4 py-3 text-sm font-semibold text-[#f3c969] transition hover:border-[#f3c969]/42 hover:bg-[#f3c969]/14"
              >
                Open full approval room
                <PhArrowRight size={15} />
              </Link>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  ["4:5", "Instagram feed and carousel"],
                  ["9:16", "TikTok, Reels, Stories, Shorts"],
                  ["1:1", "X, Instagram, Threads"],
                  ["16:9", "YouTube, X link, editorial"],
                ].map(([ratio, label]) => (
                  <div key={ratio} className="rounded-lg border border-white/[0.10] bg-black/28 p-4">
                    <div className="text-2xl font-semibold text-white">{ratio}</div>
                    <div className="mt-1 text-xs leading-5 text-white/50">{label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                {productionSteps.map((step) => (
                  <div key={step} className="flex items-start gap-3 text-sm leading-6 text-white/62">
                    <PhCheckCircle size={17} weight="fill" className="mt-1 shrink-0 text-[#6fe8d3]" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {campaignQueue.map((campaign) => (
                <article key={campaign.asset} className="overflow-hidden rounded-lg border border-white/[0.10] bg-black/32">
                  <div className="relative aspect-[9/16]">
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      fill
                      unoptimized
                      loading="eager"
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3 text-xs text-white/48">
                      <span>{campaign.gate}</span>
                      <span className="text-[#f3c969]">{campaign.score}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-white">{campaign.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-white/50">{campaign.platforms}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[#6fe8d3]">Operating model</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-5xl">
              From image to proof packet
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                ["01", "Discover", "The viewer gets scale, emotion, and a clean first read."],
                ["02", "Understand", "The portal explains the Gate, story lane, and creation job."],
                ["03", "Create", "Genesis turns the seed into a proof artifact and prompt packet."],
                ["04", "Approve", "VIS, canon, rights, and social checks decide the public route."],
              ].map(([number, title, detail]) => (
                <div key={number} className="rounded-lg border border-white/[0.10] bg-white/[0.035] p-5">
                  <div className="text-sm font-semibold text-[#f3c969]">{number}</div>
                  <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/56">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.10] bg-[#0b0f14] p-6">
            <div className="flex items-center gap-3">
              <PhCompass size={22} weight="fill" className="text-[#f3c969]" />
              <h3 className="text-xl font-semibold text-white">Route map</h3>
            </div>
            <div className="mt-6 space-y-3">
              {routeLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.08] bg-black/28 px-4 py-3 text-sm text-white/70 transition hover:border-[#6fe8d3]/35 hover:text-white"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={17} weight="fill" className="text-[#6fe8d3]" />
                    {label}
                  </span>
                  <PhArrowRight size={15} />
                </Link>
              ))}
            </div>

            <div className="mt-8 grid gap-3">
              {proofSignals.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm text-white/55">
                  <Icon size={17} weight="fill" className="text-[#f3c969]" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
