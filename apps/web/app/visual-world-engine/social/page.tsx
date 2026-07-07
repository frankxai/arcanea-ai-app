import { basename } from "node:path";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import manifestSnapshot from "./data/social-overlay-manifest.json";
import queueSnapshot from "./data/publishing-approval-queue.json";
import specSnapshot from "./data/social-overlay-spec.json";
import {
  PhArrowRight,
  PhCheckCircle,
  PhClock,
  PhCopy,
  PhFileText,
  PhImage,
  PhLock,
  PhMusicNotes,
  PhPlay,
  PhShieldStar,
  PhSparkle,
  PhTarget,
  PhTwitterLogo,
  PhVideoCamera,
  PhWarning,
  PhYoutubeLogo,
} from "@/lib/phosphor-icons";

const IMAGE_BASE = "/images/arcanea-world-engine/god-run-2026-07-06";
const SOCIAL_BASE = `${IMAGE_BASE}/social-overlays`;

type QueueCampaign = {
  priority: "P0" | "P1" | "P2";
  campaign_id: string;
  gate: string;
  primary_platforms: string[];
  vertical_asset: string;
  hook_3s: string;
  instagram_caption: string;
  tiktok_short_script: string;
  youtube_shorts_angle: string;
  x_post: string;
  approval_status: string;
  blockers: string[];
};

type QueueData = {
  version: string;
  status: string;
  rights_status: string;
  platform_guidance: Record<string, { source: string; rule: string }>;
  approval_rules: string[];
  campaigns: QueueCampaign[];
};

type SpecCampaign = {
  id: string;
  sourceAssetId: string;
  headline: string;
  subhead: string;
  proof: string;
  cta: string;
  gate: string;
  guardian: string;
  score30: number;
};

type ManifestCampaign = {
  id: string;
  sourceAssetId: string;
  sourceImage: string;
  score30: number;
  headline: string;
  gate: string;
  guardian: string;
};

type ManifestExport = {
  id: string;
  campaignId: string;
  sourceAssetId: string;
  channelKey: string;
  platforms: string[];
  ratio: string;
  width: number;
  height: number;
  sizeBytes: number;
  sha256: string;
  headline: string;
  sourceImage: string;
  outputPath: string;
  rightsStatus: string;
  approvalGate: string;
};

type ContactSheet = {
  id: string;
  channelKey: string;
  path: string;
  width: number;
  height: number;
  sizeBytes: number;
  sha256: string;
};

type ManifestData = {
  totalExports: number;
  totalContactSheets: number;
  campaigns: ManifestCampaign[];
  exports: ManifestExport[];
  contactSheets: ContactSheet[];
};

type SpecData = { campaigns: SpecCampaign[] };

const queueData = queueSnapshot as QueueData;
const specData = specSnapshot as SpecData;
const manifestData = manifestSnapshot as ManifestData;

export const metadata: Metadata = {
  title: "Social Launch Room - Arcanea",
  description:
    "A human approval room for Arcanea social campaign masters, platform hooks, captions, blockers, rights gates, hashes, and public asset paths.",
  openGraph: {
    title: "Social Launch Room - Arcanea",
    description:
      "Inspect Arcanea's TikTok, Instagram, YouTube Shorts, and X-ready campaign queue before external publishing.",
    images: [
      {
        url: `${SOCIAL_BASE}/vertical-9x16/arc-social-040-unity-cooperation-lattice-vertical-9x16.png`,
        width: 1080,
        height: 1920,
        alt: "Arcanea Unity Cooperation Lattice social campaign master",
      },
    ],
  },
  alternates: { canonical: "/visual-world-engine/social" },
};

const campaigns = queueData.campaigns.map((queue) => {
  const manifest = manifestData.campaigns.find((campaign) => campaign.id === queue.campaign_id);
  const spec = specData.campaigns.find((campaign) => campaign.id === queue.campaign_id);
  const exports = manifestData.exports.filter((item) => item.campaignId === queue.campaign_id);
  const vertical = exports.find((item) => item.channelKey === "vertical-9x16") ?? exports[0];

  return {
    queue,
    manifest,
    spec,
    exports,
    vertical,
    publicSourcePath: manifest?.sourceImage ? `${IMAGE_BASE}/${basename(manifest.sourceImage)}` : "",
  };
});

const p0Campaigns = campaigns.filter(({ queue }) => queue.priority === "P0");

const launchStats = [
  { value: String(queueData.campaigns.length), label: "campaigns", detail: "ready for review" },
  { value: String(p0Campaigns.length), label: "P0 launches", detail: "first wave candidates" },
  { value: String(manifestData.totalExports), label: "masters", detail: "four formats each" },
  { value: "0", label: "published", detail: "human gate closed" },
];

const platformRules = [
  {
    platform: "TikTok",
    job: queueData.platform_guidance.tiktok.rule,
    format: "9:16 proof ritual",
    icon: PhPlay,
  },
  {
    platform: "Instagram",
    job: queueData.platform_guidance.instagram.rule,
    format: "4:5, 9:16, 1:1",
    icon: PhImage,
  },
  {
    platform: "YouTube",
    job: queueData.platform_guidance.youtube_shorts.rule,
    format: "9:16 or 1:1",
    icon: PhYoutubeLogo,
  },
  {
    platform: "X",
    job: queueData.platform_guidance.x.rule,
    format: "1:1 or 16:9",
    icon: PhTwitterLogo,
  },
];

const proofChecklist: { icon: typeof PhImage; label: string }[] = [
  { icon: PhCheckCircle, label: "Campaign assets exist in public route paths" },
  { icon: PhCopy, label: "Captions and first-cut scripts are drafted" },
  { icon: PhClock, label: "Scheduling is intentionally paused" },
  { icon: PhMusicNotes, label: "Audio is blocked until rights-cleared" },
  { icon: PhSparkle, label: "Genesis and web3 remain review-gated" },
];

function formatBlocker(blocker: string) {
  return blocker.replace(/_/g, " ");
}

function publicExportPath(item: ManifestExport) {
  return `${SOCIAL_BASE}/${item.channelKey}/${basename(item.outputPath)}`;
}

function publicSidecarPath(item: ManifestExport) {
  return `${SOCIAL_BASE}/${item.channelKey}/${basename(item.outputPath).replace(/\.png$/, ".social.provenance.json")}`;
}

function publicContactSheetPath(sheet: ContactSheet) {
  return `${SOCIAL_BASE}/contact-sheets/${basename(sheet.path)}`;
}

function nextActions(blockers: string[]) {
  const actions = ["Approve or revise platform copy"];

  if (blockers.includes("rights_unknown")) actions.push("Send to VIS rights ingestion");
  if (blockers.includes("no_audio_selected") || blockers.includes("audio_pairing_needed")) {
    actions.push("Select rights-cleared audio or silent-first motion");
  }
  if (blockers.includes("story_spoiler_review")) actions.push("Review story spoilers and webtoon framing");
  if (blockers.includes("lore_accuracy_review")) actions.push("Run canon/lore accuracy review");
  if (blockers.includes("carousel_breakdown_needed")) actions.push("Create carousel breakdown");
  if (blockers.includes("titan_language_review")) actions.push("Approve Titan scale language");
  if (blockers.includes("caption_review")) actions.push("Approve caption and CTA tone");

  return Array.from(new Set(actions));
}

function shortHash(hash: string) {
  return hash.slice(0, 10);
}

export default function SocialLaunchRoomPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050608] text-white">
      <section className="relative overflow-hidden border-b border-white/[0.08] px-4 py-16 sm:px-6 lg:py-20">
        <Image
          src={`${IMAGE_BASE}/arc-visual-040-unity-kyuro-cooperation-lattice.png`}
          alt="Arcanea Unity Cooperation Lattice"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center opacity-36"
        />
        <div className="absolute inset-0 bg-[#050608]/72" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050608_0%,rgba(5,6,8,0.92)_42%,rgba(5,6,8,0.66)_100%)]" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div className="min-w-0 max-w-3xl">
            <Link
              href="/visual-world-engine"
              className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/[0.14] bg-black/36 px-3 py-2 text-sm text-white/70 transition hover:border-[#6fe8d3]/35 hover:text-white"
            >
              <PhArrowRight size={15} className="rotate-180" />
              Visual World Engine
            </Link>
            <p className="text-sm font-semibold uppercase text-[#f3c969]">Read-only approval cockpit</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[0.98] text-white sm:text-5xl md:text-7xl">
              Social Launch Room
            </h1>
            <p className="mt-5 max-w-2xl break-words text-base leading-7 text-white/70 md:text-xl md:leading-8">
              Ready for review, not approved, not scheduled, not published, not minted. Nine campaign packages are inspectable before any external action.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#p0-wave"
                className="inline-flex w-full max-w-[21rem] items-center justify-center gap-2 rounded-lg bg-[#f3c969] px-5 py-3 text-sm font-semibold text-[#090806] transition hover:bg-[#ffd978] sm:w-auto sm:max-w-none"
              >
                <PhTarget size={16} weight="fill" />
                Inspect P0 wave
              </a>
              <a
                href="#all-campaigns"
                className="inline-flex w-full max-w-[21rem] items-center justify-center gap-2 rounded-lg border border-white/[0.16] bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/[0.28] hover:bg-white/[0.10] sm:w-auto sm:max-w-none"
              >
                <PhFileText size={16} weight="fill" />
                Review all copy
              </a>
            </div>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            {launchStats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-white/[0.10] bg-black/42 p-5">
                <div className="text-3xl font-semibold text-white">{stat.value}</div>
                <div className="mt-1 text-sm font-medium text-white/74">{stat.label}</div>
                <div className="mt-2 text-xs leading-5 text-white/45">{stat.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.08] bg-[#070a0d] px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-4">
          {platformRules.map((rule) => {
            const Icon = rule.icon;
            return (
              <article key={rule.platform} className="rounded-lg border border-white/[0.10] bg-white/[0.035] p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold uppercase text-[#6fe8d3]">{rule.format}</span>
                  <Icon size={20} weight="fill" className="text-[#f3c969]" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">{rule.platform}</h2>
                <p className="mt-3 text-sm leading-6 text-white/58">{rule.job}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="p0-wave" className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-[#f3c969]">First wave</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-5xl">
                P0 posts worth human attention
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/58">
              The first wave covers the three strongest audience doors: cooperation, story choice, and music proof. It is ready for review, not automatic scheduling.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {p0Campaigns.map(({ queue, manifest, vertical }) => (
              <article key={queue.campaign_id} className="overflow-hidden rounded-lg border border-white/[0.10] bg-white/[0.035]">
                {vertical ? (
                  <div className="relative aspect-[9/16] bg-[#101318]">
                    <Image
                      src={publicExportPath(vertical)}
                      alt={manifest?.headline ?? queue.campaign_id}
                      fill
                      unoptimized
                      priority
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover object-top brightness-110 contrast-105"
                    />
                    <div className="absolute left-3 top-3 rounded-lg border border-black/25 bg-black/68 px-3 py-2 text-xs font-semibold text-[#f3c969]">
                      {queue.priority}
                    </div>
                    <div className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] rounded-lg border border-white/[0.14] bg-black/68 px-3 py-2 text-xs text-white/82">
                      {queue.hook_3s}
                    </div>
                  </div>
                ) : null}
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/48">
                    <span>{manifest?.gate ?? queue.gate}</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>{manifest?.guardian ?? "Guardian review"}</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>{manifest?.score30 ?? "?"}/30</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-white">{manifest?.headline ?? queue.campaign_id}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/58">{queue.instagram_caption}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="all-campaigns" className="border-y border-white/[0.08] bg-[#080b0f] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-sm font-semibold uppercase text-[#6fe8d3]">Approval gates</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-5xl">
                Nothing leaves the room automatically
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/60">
                Queue rights are still `{queueData.rights_status}`. Sidecars identify generated-owned-derived assets, but that is not the same as cleared public publishing.
              </p>

              <div className="mt-8 space-y-3">
                {queueData.approval_rules.map((gate) => (
                  <div key={gate} className="flex items-start gap-3 text-sm leading-6 text-white/62">
                    <PhLock size={17} weight="fill" className="mt-1 shrink-0 text-[#f3c969]" />
                    <span>{gate}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-lg border border-[#f3c969]/22 bg-[#f3c969]/8 p-5">
                <div className="flex items-center gap-3">
                  <PhWarning size={19} weight="fill" className="text-[#f3c969]" />
                  <h3 className="text-base font-semibold text-white">Current publication state</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/62">
                  {queueData.status}. Approval-ready here means ready for a human to decide, not approved for schedule, DB write, export, or mint.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {campaigns.map(({ queue, manifest, spec, exports, vertical, publicSourcePath }) => (
                <article key={queue.campaign_id} className="grid gap-4 rounded-lg border border-white/[0.10] bg-black/30 p-4 md:grid-cols-[8.5rem_1fr]">
                  {vertical ? (
                    <div className="relative aspect-[9/16] overflow-hidden rounded-lg border border-white/[0.10]">
                      <Image
                        src={publicExportPath(vertical)}
                        alt={manifest?.headline ?? queue.campaign_id}
                        fill
                        unoptimized
                        loading="lazy"
                        sizes="136px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg border border-[#f3c969]/28 bg-[#f3c969]/10 px-2.5 py-1 text-xs font-semibold text-[#f3c969]">
                        {queue.priority}
                      </span>
                      <span className="rounded-lg border border-white/[0.10] bg-white/[0.05] px-2.5 py-1 text-xs text-white/62">
                        {manifest?.gate ?? queue.gate}
                      </span>
                      <span className="rounded-lg border border-white/[0.10] bg-white/[0.05] px-2.5 py-1 text-xs text-white/62">
                        {manifest?.guardian ?? "Guardian"}
                      </span>
                      <span className="rounded-lg border border-white/[0.10] bg-white/[0.05] px-2.5 py-1 text-xs text-white/62">
                        {queue.approval_status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <h3 className="mt-3 text-xl font-semibold text-white">{manifest?.headline ?? queue.campaign_id}</h3>
                    <p className="mt-2 text-sm font-semibold text-[#6fe8d3]">{queue.hook_3s}</p>

                    <div className="mt-4 grid gap-3 xl:grid-cols-2">
                      <CopyBlock icon={PhImage} label="Instagram / Reels" text={queue.instagram_caption} />
                      <CopyBlock icon={PhVideoCamera} label="TikTok first cut" text={queue.tiktok_short_script} />
                      <CopyBlock icon={PhYoutubeLogo} label="YouTube Shorts" text={queue.youtube_shorts_angle} />
                      <CopyBlock icon={PhTwitterLogo} label="X post" text={queue.x_post} />
                    </div>

                    <div className="mt-4 grid gap-3 xl:grid-cols-2">
                      <MetaBlock label="Source asset" value={`${manifest?.sourceAssetId ?? "unknown"} / ${publicSourcePath}`} />
                      <MetaBlock label="Proof line" value={spec?.proof ?? "Pending proof line"} />
                      <MetaBlock label="CTA" value={spec?.cta ?? "Pending CTA"} />
                      <MetaBlock label="Queue platforms" value={queue.primary_platforms.join(", ")} />
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase text-white/40">Format exports and provenance</p>
                      <div className="mt-3 grid gap-2 xl:grid-cols-2">
                        {exports.map((item) => (
                          <div key={item.id} className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-3">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="font-semibold text-white">{item.ratio}</span>
                              <span className="text-white/42">{item.width}x{item.height}</span>
                              <span className="text-[#f3c969]">{shortHash(item.sha256)}</span>
                            </div>
                            <p className="mt-2 break-all text-xs leading-5 text-white/42">{publicExportPath(item)}</p>
                            <p className="mt-1 break-all text-xs leading-5 text-white/34">{publicSidecarPath(item)}</p>
                            <p className="mt-1 text-xs text-white/42">Sidecar rights: {item.rightsStatus}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {queue.blockers.map((blocker) => (
                        <span key={blocker} className="rounded-lg border border-[#f3c969]/16 bg-[#f3c969]/7 px-2.5 py-1 text-xs text-[#f6d98b]">
                          {formatBlocker(blocker)}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {nextActions(queue.blockers).map((action) => (
                        <div key={action} className="flex items-start gap-2 text-sm leading-6 text-white/58">
                          <PhCheckCircle size={15} weight="fill" className="mt-1 shrink-0 text-[#6fe8d3]" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-[#f3c969]">Contact sheets</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-5xl">
                Inspect the complete set
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/58">
              Contact sheets are proof aids, not publishable campaign posts. Use them to compare composition, copy density, and platform crops.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {manifestData.contactSheets.map((sheet) => (
              <article key={sheet.id} className="overflow-hidden rounded-lg border border-white/[0.10] bg-white/[0.035]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={publicContactSheetPath(sheet)}
                    alt={sheet.id}
                    fill
                    unoptimized
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-white">{sheet.channelKey}</h3>
                  <p className="mt-2 text-xs text-white/46">
                    {sheet.width}x{sheet.height} / {shortHash(sheet.sha256)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.08] px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[#f3c969]">Next operator action</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-5xl">
              Approve one wave, then produce motion
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60">
              The next real progress step is not more automatic posting. It is a human-approved P0 wave, then rights-cleared audio or silent-first motion treatments for the selected vertical masters.
            </p>
          </div>

          <div className="rounded-lg border border-white/[0.10] bg-[#0b0f14] p-6">
            <div className="flex items-center gap-3">
              <PhShieldStar size={22} weight="fill" className="text-[#f3c969]" />
              <h3 className="text-xl font-semibold text-white">Proof checklist</h3>
            </div>
            <div className="mt-6 space-y-3">
              {proofChecklist.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-start gap-3 text-sm leading-6 text-white/62">
                  <Icon size={17} weight="fill" className="mt-1 shrink-0 text-[#6fe8d3]" />
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

type CopyBlockProps = {
  icon: typeof PhImage;
  label: string;
  text: string;
};

function CopyBlock({ icon: Icon, label, text }: CopyBlockProps) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-white/42">
        <Icon size={14} weight="fill" className="text-[#6fe8d3]" />
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-white/62">{text}</p>
    </div>
  );
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-3">
      <p className="text-xs font-semibold uppercase text-white/38">{label}</p>
      <p className="mt-2 break-words text-sm leading-6 text-white/58">{value}</p>
    </div>
  );
}
