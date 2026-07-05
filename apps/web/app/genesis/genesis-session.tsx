"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analytics } from "@/lib/analytics/events";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Compass,
  Download,
  FloppyDisk,
  Globe,
  ImageSquare,
  MapTrifold,
  Scales,
  Scroll,
  ShieldStar,
  Sparkle,
  Tag,
  Target,
  WarningCircle,
} from "@/lib/phosphor-icons";
import {
  DRIFT_OPTIONS,
  MISSION_LANES,
  SAMPLE_CALL,
  generateCollectibleBlueprint,
  generateGift,
  generateStorybookSeed,
  generateVisualCanon,
  generateWorldSeed,
  renderGenesisBrief,
  slugFromTitle,
  type DriftFace,
  type GenesisProofRecord,
  type MissionLane,
} from "@/lib/genesis/proof";

type ProofStatus = "idle" | "saving" | "saved" | "error";
const GENESIS_PROMPT_KEY = "arcanea:genesis-prompt";

interface GenesisProofResponse {
  success: boolean;
  data?: {
    record: GenesisProofRecord;
  };
  error?: {
    message?: string;
  };
}

export function GenesisSession() {
  const [intent, setIntent] = useState(SAMPLE_CALL);
  const [driftFace, setDriftFace] = useState<DriftFace>("synthetic-confusion");
  const [missionLane, setMissionLane] = useState<MissionLane>("world");
  const [gift, setGift] = useState(() => generateGift(SAMPLE_CALL, "synthetic-confusion", "world"));
  const [savedProof, setSavedProof] = useState<GenesisProofRecord | null>(null);
  const [proofStatus, setProofStatus] = useState<ProofStatus>("idle");
  const [proofMessage, setProofMessage] = useState<string | null>(null);
  const worldSeed = useMemo(() => generateWorldSeed(intent, gift), [gift, intent]);
  const storybook = useMemo(() => generateStorybookSeed(intent, gift, worldSeed), [gift, intent, worldSeed]);
  const visualCanon = useMemo(() => generateVisualCanon(intent, gift, worldSeed), [gift, intent, worldSeed]);
  const collectible = useMemo(
    () => generateCollectibleBlueprint(gift, worldSeed, storybook, visualCanon),
    [gift, storybook, visualCanon, worldSeed],
  );

  const activeDrift = DRIFT_OPTIONS.find((option) => option.id === driftFace) ?? DRIFT_OPTIONS[0];

  function resetSavedProof() {
    setSavedProof(null);
    setProofStatus("idle");
    setProofMessage(null);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get("prompt") ?? window.sessionStorage.getItem(GENESIS_PROMPT_KEY);
    if (!prompt?.trim()) return;

    const trimmedPrompt = prompt.trim();
    analytics.genesisPromptPrefillUsed({
      source: params.get("source"),
      promptLength: trimmedPrompt.length,
    });
    setIntent(trimmedPrompt);
    setGift(generateGift(trimmedPrompt, driftFace, missionLane));
    window.sessionStorage.removeItem(GENESIS_PROMPT_KEY);
    if (params.has("prompt")) {
      const scrubbedParams = new URLSearchParams();
      const source = params.get("source");
      if (source) scrubbedParams.set("source", source);
      const scrubbedUrl = scrubbedParams.size > 0 ? `/genesis?${scrubbedParams.toString()}` : "/genesis";
      window.history.replaceState(null, "", scrubbedUrl);
    }
    // Run only on mount so later user edits do not get overwritten.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleGenerate() {
    setGift(generateGift(intent, driftFace, missionLane));
    resetSavedProof();
  }

  async function saveProofRecord() {
    const nextGift = generateGift(intent, driftFace, missionLane);
    setGift(nextGift);
    setProofStatus("saving");
    setProofMessage(null);

    try {
      const response = await fetch("/api/genesis/proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, driftFace, missionLane }),
      });
      const payload = (await response.json()) as GenesisProofResponse;

      if (!response.ok || !payload.success || !payload.data?.record) {
        throw new Error(payload.error?.message ?? "Genesis proof could not be saved.");
      }

      setSavedProof(payload.data.record);
      setProofStatus("saved");
      setProofMessage(`Saved ${payload.data.record.proofId}. Repo export contains ${payload.data.record.repoExport.files.length} files.`);
      analytics.genesisProofExport("proof_id_created", {
        driftFace,
        missionLane,
        repoFileCount: payload.data.record.repoExport.files.length,
      });
      return payload.data.record;
    } catch (error) {
      setProofStatus("error");
      setProofMessage(error instanceof Error ? error.message : "Genesis proof could not be saved.");
      analytics.genesisProofExport("proof_id_created", {
        driftFace,
        missionLane,
        status: "error",
      });
      return null;
    }
  }

  async function handleSaveProof() {
    await saveProofRecord();
  }

  function downloadBrief(record: GenesisProofRecord) {
    const blob = new Blob([renderGenesisBrief(record)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slugFromTitle(record.draft.worldSeed.name)}-genesis-proof.md`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  async function handleExportBrief() {
    const record = savedProof ?? (await saveProofRecord());
    if (!record) return;
    downloadBrief(record);
    analytics.genesisProofExport("brief_downloaded", {
      driftFace,
      missionLane,
      repoFileCount: record.repoExport.files.length,
    });
  }

  return (
    <section className="relative min-h-[calc(100svh-var(--nav-h,64px))] overflow-hidden bg-[var(--arc-cosmic-void)] text-white">
      <div className="absolute inset-0">
        <Image
          src="/brand/arcanea-dashboard-hero-premium.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--arc-cosmic-void)_0%,rgba(9,9,11,0.86)_42%,rgba(9,9,11,0.64)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.46)_0%,var(--arc-cosmic-void)_100%)]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-6 px-5 py-10 md:grid-cols-[0.92fr_1.08fr] md:px-8 md:py-14">
        <div className="flex min-h-[620px] flex-col justify-between rounded-lg border border-white/[0.08] bg-black/45 p-5 backdrop-blur-xl md:p-7">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <Badge variant="gold" icon={<Sparkle size={12} weight="duotone" />}>
                Genesis
              </Badge>
              <Badge variant="outline">Call to Gift to Proof</Badge>
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-white md:text-6xl">
              Turn the call into proof.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/58 md:text-lg">
              Name the pressure, receive a bounded Gift, seed the world, and leave with one artifact that can be remembered.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <Textarea
              label="The Call"
              value={intent}
              minRows={6}
              onChange={(event) => {
                setIntent(event.target.value);
                resetSavedProof();
              }}
              placeholder="Name the world, crisis, longing, or creator mission you want to answer."
              className="min-h-40 rounded-lg border-white/[0.1] bg-white/[0.04] text-base leading-7"
            />

            <div className="space-y-3">
              <div className="text-xs font-medium uppercase text-white/36">Drift face</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {DRIFT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setDriftFace(option.id);
                      resetSavedProof();
                    }}
                    className={`rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlantean-teal ${
                      option.id === driftFace
                        ? "border-brand-gold/55 bg-brand-gold/10 text-white"
                        : "border-white/[0.08] bg-white/[0.03] text-white/62 hover:border-white/[0.18]"
                    }`}
                  >
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="mt-1 text-xs leading-5 text-white/42">{option.line}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-medium uppercase text-white/36">Mission lane</div>
              <div className="flex flex-wrap gap-2">
                {MISSION_LANES.map((lane) => (
                  <button
                    key={lane.id}
                    type="button"
                    onClick={() => {
                      setMissionLane(lane.id);
                      resetSavedProof();
                    }}
                    className={`rounded-full border px-3 py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlantean-teal ${
                      lane.id === missionLane
                        ? "border-atlantean-teal/60 bg-atlantean-teal/12 text-atlantean-teal"
                        : "border-white/[0.08] bg-white/[0.03] text-white/48 hover:border-white/[0.18]"
                    }`}
                  >
                    {lane.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              size="xl"
              variant="premium"
              onClick={handleGenerate}
              iconRight={<ArrowRight size={16} weight="bold" />}
              className="w-full md:w-auto"
            >
              Generate proof packet
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { num: "01", label: "Call", Icon: CheckCircle },
              { num: "02", label: "Gift", Icon: Sparkle },
              { num: "03", label: "Seed", Icon: Globe },
              { num: "04", label: "Record", Icon: ShieldStar },
            ].map(({ num, label, Icon }) => (
              <div key={label} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs text-white/38">
                  <span>{num}</span>
                  <Icon size={15} weight="duotone" className="text-brand-gold" />
                </div>
                <div className="mt-3 text-sm font-medium text-white">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ArtifactPanel
              icon={<Compass size={18} weight="duotone" />}
              eyebrow="Gift Object"
              title={gift.name}
              rows={[
                ["Type", gift.type],
                ["Drift", activeDrift.label],
                ["Power", gift.power],
                ["Cost", gift.cost],
                ["Right use", gift.rightUse],
              ]}
            />

            <ArtifactPanel
              icon={<MapTrifold size={18} weight="duotone" />}
              eyebrow="World Seed"
              title={worldSeed.name}
              rows={[
                ["Premise", worldSeed.premise],
                ["Visual DNA", worldSeed.visualDna.join(", ")],
                ["First proof", worldSeed.proof],
              ]}
            />
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-white/[0.045] p-5 backdrop-blur-xl md:p-6">
            <div className="mb-4 flex items-center gap-2 text-brand-gold">
              <Target size={18} weight="duotone" />
              <span className="text-xs font-semibold uppercase text-white/42">First Trial</span>
            </div>
            <p className="text-lg leading-8 text-white md:text-xl">{gift.firstTrial}</p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {worldSeed.laws.map((law, index) => (
                <div key={law} className="rounded-lg border border-white/[0.07] bg-black/24 p-4">
                  <div className="mb-3 text-xs font-medium text-brand-gold">Law {index + 1}</div>
                  <p className="text-sm leading-6 text-white/62">{law}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/[0.08] bg-black/45 backdrop-blur-xl">
              <Image
                src={visualCanon.heroImagePath}
                alt={visualCanon.heroAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,15,0.05)_0%,rgba(5,7,15,0.72)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge variant="gold" icon={<ImageSquare size={12} weight="duotone" />}>
                    Generated proof relic
                  </Badge>
                  <Badge variant="outline">Visual QA required before marketplace</Badge>
                </div>
                <h2 className="max-w-xl text-2xl font-semibold leading-tight text-white md:text-3xl">
                  {collectible.name}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62">{collectible.listingCopy}</p>
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-brand-gold">
                <Tag size={18} weight="duotone" />
                <span className="text-xs font-semibold uppercase text-white/42">Collectible readiness</span>
              </div>
              <dl className="grid gap-4 text-sm">
                <RecordRow label="Edition" value={collectible.editionName} />
                <RecordRow label="Mint readiness" value={formatStatus(collectible.mintReadiness)} />
                <RecordRow label="Chain intent" value={collectible.chainIntent} />
                <RecordRow label="Rights gate" value={collectible.rightsGate} />
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                {collectible.attributes.map((attribute) => (
                  <span
                    key={`${attribute.trait_type}-${attribute.value}`}
                    className="rounded-full border border-white/[0.08] bg-black/24 px-3 py-1 text-xs text-white/52"
                  >
                    {attribute.trait_type}: <span className="text-white/74">{attribute.value}</span>
                  </span>
                ))}
              </div>
              <div className="mt-5 rounded-lg border border-brand-gold/16 bg-brand-gold/[0.055] p-4">
                <div className="mb-2 flex items-center gap-2 text-brand-gold">
                  <WarningCircle size={16} weight="duotone" />
                  <span className="text-xs font-semibold uppercase text-white/42">Review before sale</span>
                </div>
                <ul className="space-y-2 text-xs leading-5 text-white/54">
                  {collectible.blockers.slice(0, 3).map((blocker) => (
                    <li key={blocker}>{blocker}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-atlantean-teal">
              <Scroll size={18} weight="duotone" />
              <span className="text-xs font-semibold uppercase text-white/42">Storybook seed</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {storybook.pages.map((page, index) => (
                <div key={page.title} className="rounded-lg border border-white/[0.07] bg-black/24 p-4">
                  <div className="mb-3 text-xs font-medium text-brand-gold">Page {index + 1}</div>
                  <h3 className="text-sm font-semibold text-white">{page.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/58">{page.scene}</p>
                  <p className="mt-3 text-xs leading-5 text-atlantean-teal/80">{page.creatorAction}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-atlantean-teal">
                <BookOpen size={18} weight="duotone" />
                <span className="text-xs font-semibold uppercase text-white/42">Character pair</span>
              </div>
              <div className="space-y-3">
                {worldSeed.characters.map((character) => (
                  <div key={character.name} className="border-l border-brand-gold/35 pl-4">
                    <div className="text-sm font-semibold text-white">{character.name}</div>
                    <div className="mt-1 text-sm leading-6 text-white/52">{character.role}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-brand-gold/18 bg-brand-gold/[0.055] p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-brand-gold">
                <Scales size={18} weight="duotone" />
                <span className="text-xs font-semibold uppercase text-white/42">Stewardship record</span>
              </div>
              <dl className="grid gap-3 text-sm">
                <RecordRow label="Canon status" value="Private draft until creator promotes it." />
                <RecordRow label="Rights state" value="Creator-owned draft; source and model contribution still need review." />
                <RecordRow
                  label="SIS memory"
                  value={
                    savedProof
                      ? `Saved as ${savedProof.proofId}; world repo export contains ${savedProof.repoExport.files.map((file) => file.path).join(", ")}.`
                      : "Gift, Drift face, trial, laws, and proof are ready for export or persistence."
                  }
                />
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  loading={proofStatus === "saving"}
                  onClick={() => void handleSaveProof()}
                  iconLeft={<FloppyDisk size={14} weight="duotone" />}
                >
                  {proofStatus === "saved" ? "Proof ID created" : "Create proof ID"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={proofStatus === "saving"}
                  onClick={() => void handleExportBrief()}
                  iconLeft={<Download size={14} weight="duotone" />}
                >
                  Export brief
                </Button>
              </div>
              {proofMessage ? (
                <p
                  aria-live="polite"
                  className={`mt-4 text-xs leading-5 ${
                    proofStatus === "error" ? "text-red-300" : "text-white/46"
                  }`}
                >
                  {proofMessage}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatStatus(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ArtifactPanel({
  icon,
  eyebrow,
  title,
  rows,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  rows: Array<[string, string]>;
}) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.045] p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2 text-brand-gold">
        {icon}
        <span className="text-xs font-semibold uppercase text-white/42">{eyebrow}</span>
      </div>
      <h2 className="text-2xl font-semibold leading-tight text-white">{title}</h2>
      <dl className="mt-5 space-y-4">
        {rows.map(([label, value]) => (
          <RecordRow key={label} label={label} value={value} />
        ))}
      </dl>
    </div>
  );
}

function RecordRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-white/32">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-white/64">{value}</dd>
    </div>
  );
}
