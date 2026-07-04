export const DRIFT_FACE_IDS = ["synthetic-confusion", "creative-amnesia", "tool-dependency", "isolation"] as const;
export const MISSION_LANE_IDS = ["world", "publishing", "media", "game", "rights"] as const;

export type DriftFace = (typeof DRIFT_FACE_IDS)[number];
export type MissionLane = (typeof MISSION_LANE_IDS)[number];
export type GiftType = "Compass" | "Seed" | "Lens" | "Thread" | "Oath";

export interface GiftObject {
  name: string;
  type: GiftType;
  driftFace: DriftFace;
  missionLane: MissionLane;
  power: string;
  cost: string;
  rightUse: string;
  firstTrial: string;
}

export interface WorldSeed {
  name: string;
  premise: string;
  laws: string[];
  visualDna: string[];
  characters: Array<{ name: string; role: string }>;
  proof: string;
}

export interface StorybookPage {
  title: string;
  scene: string;
  narration: string;
  creatorAction: string;
}

export interface StorybookSeed {
  title: string;
  format: string;
  editorialRule: string;
  pages: StorybookPage[];
}

export interface VisualCanon {
  heroImagePath: string;
  heroAlt: string;
  imagePrompt: string;
  negativePrompt: string;
  palette: string[];
  qaStatus: string;
}

export interface CollectibleBlueprint {
  name: string;
  editionName: string;
  assetPath: string;
  listingCopy: string;
  rightsGate: string;
  mintReadiness: string;
  chainIntent: string;
  attributes: Array<{ trait_type: string; value: string }>;
  blockers: string[];
  nextActions: string[];
}

export interface GenesisProofDraft {
  schemaVersion: "arcanea.genesis-proof.v0.1";
  input: {
    intent: string;
    driftFace: DriftFace;
    missionLane: MissionLane;
  };
  gift: GiftObject;
  worldSeed: WorldSeed;
  storybook: StorybookSeed;
  visualCanon: VisualCanon;
  collectible: CollectibleBlueprint;
  stewardship: {
    canonStatus: string;
    rightsState: string;
    memoryState: string;
    rightUse: string;
  };
  forgePackage: {
    name: string;
    buyer: string;
    promise: string;
    pricingRung: string;
    deliverables: string[];
    exclusions: string[];
    checkoutPath: string;
    supportPath: string;
  };
}

export interface GenesisProofRecord {
  proofId: string;
  createdAt: string;
  contentHash: string;
  draft: GenesisProofDraft;
  repoExport: {
    files: Array<{ path: string; content: string }>;
  };
}

export const DRIFT_OPTIONS: Array<{ id: DriftFace; label: string; line: string }> = [
  { id: "synthetic-confusion", label: "Synthetic confusion", line: "Make signal, source, and intent visible." },
  { id: "creative-amnesia", label: "Creative amnesia", line: "Give memory and continuity back to the work." },
  { id: "tool-dependency", label: "Tool dependency", line: "Use agents as craft partners, not crutches." },
  { id: "isolation", label: "Isolation", line: "Turn private pressure into shareable proof." },
];

export const MISSION_LANES: Array<{ id: MissionLane; label: string }> = [
  { id: "world", label: "Living world" },
  { id: "publishing", label: "Publishing" },
  { id: "media", label: "Media kit" },
  { id: "game", label: "Game seed" },
  { id: "rights", label: "Rights proof" },
];

const GIFT_TYPES: GiftType[] = ["Compass", "Seed", "Lens", "Thread", "Oath"];

export const SAMPLE_CALL =
  "A city of creators is drowning in synthetic noise. I want to build a living world that teaches people to make source-grounded proof instead of more content.";

export function labelForDriftFace(id: DriftFace) {
  return DRIFT_OPTIONS.find((option) => option.id === id)?.label ?? "Synthetic confusion";
}

export function labelForMissionLane(id: MissionLane) {
  return MISSION_LANES.find((lane) => lane.id === id)?.label ?? "Living world";
}

export function titleFromIntent(intent: string, fallback: string) {
  const words = intent
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 3);

  if (words.length === 0) return fallback;
  return words.map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}

export function slugFromTitle(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || "genesis-proof";
}

export function normalizeIntent(intent: string) {
  return intent.trim().replace(/\s+/g, " ").slice(0, 1200) || SAMPLE_CALL;
}

export function generateGift(intent: string, driftFace: DriftFace, missionLane: MissionLane): GiftObject {
  const cleanIntent = normalizeIntent(intent);
  const giftType = GIFT_TYPES[cleanIntent.length % GIFT_TYPES.length];
  const title = titleFromIntent(cleanIntent, "First Proof");

  return {
    name: `The ${title} ${giftType}`,
    type: giftType,
    driftFace,
    missionLane,
    power: "Turns an urgent creative pressure into a bounded world artifact that can be inspected, revised, and carried forward.",
    cost: "Every claim needs a source, every power needs a limit, and every artifact must leave a usable record.",
    rightUse: "Use this Gift to create proof and orientation, not status, shame, or dependency.",
    firstTrial:
      "Create one world law, one character contradiction, and one proof artifact that answers the Drift without naming people as enemies.",
  };
}

export function generateWorldSeed(intent: string, gift: GiftObject): WorldSeed {
  const cleanIntent = normalizeIntent(intent);
  const title = titleFromIntent(cleanIntent, "Signal Harbor");

  return {
    name: `${title} World`,
    premise: `A living world where creators answer ${labelForDriftFace(gift.driftFace).toLowerCase()} with disciplined imagination, memory, and proof.`,
    laws: [
      "No artifact becomes canon until it changes a relationship, memory, duty, or material record.",
      "No tool may hide its source, cost, or contribution from the creator.",
      "No enemy is a people; the conflict is always a condition that can be repaired, resisted, or outgrown.",
    ],
    visualDna: ["dark glass studio", "luminous manuscript UI", "gold source seal", "memory graph threads"],
    characters: [
      { name: "The Steward", role: "Keeps provenance, consent, and canon boundaries intact." },
      { name: "The Witness", role: "Sees what the world is avoiding and asks for one proof-sized act." },
    ],
    proof: `A ${gift.missionLane} artifact: ${gift.firstTrial}`,
  };
}

export function generateStorybookSeed(intent: string, gift: GiftObject, worldSeed: WorldSeed): StorybookSeed {
  const callTitle = titleFromIntent(intent, "First Proof");

  return {
    title: `${worldSeed.name}: First Proof Storybook`,
    format: "Three-page starter storybook for a creator-owned world repo, public preview, or rights-reviewed collectible.",
    editorialRule:
      "Keep the mythic layer inside the artifact. Product instructions stay plain, sourced, and rights-aware.",
    pages: [
      {
        title: "The Call",
        scene: `A creator notices ${labelForDriftFace(gift.driftFace).toLowerCase()} inside their field of work and names it without blaming a people.`,
        narration: `The ${callTitle} call begins as pressure, then becomes a boundary: the work must leave proof, memory, and right use behind.`,
        creatorAction: "Write the one sentence this world is responsible for answering.",
      },
      {
        title: "The Gift",
        scene: `${gift.name} appears as a practical artifact: beautiful enough to keep, bounded enough to use.`,
        narration: `${gift.power} Its cost is part of its power: ${gift.cost}`,
        creatorAction: "Choose one source, one constraint, and one visible proof artifact.",
      },
      {
        title: "The First Trial",
        scene: `The Steward and the Witness enter ${worldSeed.name} to test whether the premise can become a record.`,
        narration: gift.firstTrial,
        creatorAction: "Finish the first trial before expanding the canon.",
      },
    ],
  };
}

export function generateVisualCanon(_intent: string, gift: GiftObject, worldSeed: WorldSeed): VisualCanon {
  const palette = ["#05070f", "#0a0f1f", "#c5a26f", "#f0e9d9", "#2a5c5c", "#6b2a2a"];

  return {
    heroImagePath: "/brand/arcanea-genesis-proof-relic.png",
    heroAlt: `Cinematic proof relic for ${worldSeed.name}, representing ${gift.name}.`,
    imagePrompt: [
      "Premium cinematic Arcanea Genesis proof relic, dark glass studio reliquary, luminous manuscript fragment",
      "gold source seal, subtle memory graph threads, smoked glass, brushed gold, starlight cream parchment",
      `world premise: ${worldSeed.premise}`,
      `gift object: ${gift.name}`,
      `visual DNA: ${worldSeed.visualDna.join(", ")}`,
      `palette: ${palette.join(", ")}`,
      "AI-lab premium, mythic creative intelligence, collectible but rights-gated, no readable text",
    ].join("; "),
    negativePrompt:
      "pixel art, fantasy game loot icon, purple-pink gradient, neon grid, readable text, fake UI, logo, watermark, character, weapon, skull, generic orb",
    palette,
    qaStatus: "Generated asset requires in-context desktop, mobile, and artifact QA before public marketplace use.",
  };
}

export function generateCollectibleBlueprint(
  gift: GiftObject,
  worldSeed: WorldSeed,
  storybook: StorybookSeed,
  visualCanon: VisualCanon,
): CollectibleBlueprint {
  return {
    name: `${worldSeed.name} Genesis Proof Relic`,
    editionName: "Genesis Proof Relic / Private Draft Edition",
    assetPath: visualCanon.heroImagePath,
    listingCopy:
      "A creator-owned Genesis proof package: visual relic, storybook seed, world manifest, first trial, and rights review path.",
    rightsGate:
      "Draft collectible only. Do not mint, list, or sell until source, model contribution, cultural safety, and canon boundaries are reviewed.",
    mintReadiness: "rights_review_required",
    chainIntent: "Portable metadata for future Story Protocol, NFT, or marketplace registration after review.",
    attributes: [
      { trait_type: "Gift Type", value: gift.type },
      { trait_type: "Mission Lane", value: labelForMissionLane(gift.missionLane) },
      { trait_type: "Drift Face", value: labelForDriftFace(gift.driftFace) },
      { trait_type: "Canon Status", value: "Private draft" },
      { trait_type: "Storybook Pages", value: String(storybook.pages.length) },
      { trait_type: "Right Use", value: "Proof before expansion" },
    ],
    blockers: [
      "Rights review not complete.",
      "No public canon promotion approved.",
      "No marketplace license terms selected.",
      "No permanent media URI or IPFS pin assigned.",
    ],
    nextActions: [
      "Run source and model contribution review.",
      "Choose license terms and attribution rules.",
      "Pin approved media and metadata to durable storage.",
      "Register only after the creator approves the canon boundary.",
    ],
  };
}

export function buildGenesisProofDraft(input: {
  intent: string;
  driftFace: DriftFace;
  missionLane: MissionLane;
}): GenesisProofDraft {
  const intent = normalizeIntent(input.intent);
  const gift = generateGift(intent, input.driftFace, input.missionLane);
  const worldSeed = generateWorldSeed(intent, gift);
  const storybook = generateStorybookSeed(intent, gift, worldSeed);
  const visualCanon = generateVisualCanon(intent, gift, worldSeed);
  const collectible = generateCollectibleBlueprint(gift, worldSeed, storybook, visualCanon);

  return {
    schemaVersion: "arcanea.genesis-proof.v0.1",
    input: {
      intent,
      driftFace: input.driftFace,
      missionLane: input.missionLane,
    },
    gift,
    worldSeed,
    storybook,
    visualCanon,
    collectible,
    stewardship: {
      canonStatus: "Private draft until creator promotes it.",
      rightsState: "Creator-owned draft; source and model contribution still need review.",
      memoryState: "Gift, Drift face, trial, laws, and proof are ready for SIS or repo persistence.",
      rightUse: gift.rightUse,
    },
    forgePackage: {
      name: `${worldSeed.name} Starter Proof Kit`,
      buyer: "Creator or small studio turning a world idea into an inspectable first artifact.",
      promise: "Leave Genesis with a portable brief, world seed, canon laws, and one proof-sized action.",
      pricingRung: "Free to Starter",
      deliverables: [
        "Genesis proof brief",
        "world.arcanea.json manifest",
        "canon seed markdown",
        "first-trial proof task",
      ],
      exclusions: [
        "No public canon promotion without creator review.",
        "No licensing or marketplace listing until rights are checked.",
        "No automated dependency on any single model provider.",
      ],
      checkoutPath: "/pricing",
      supportPath: "/learn",
    },
  };
}

export function renderWorldManifest(record: Pick<GenesisProofRecord, "proofId" | "createdAt" | "contentHash" | "draft">) {
  return {
    schema: "arcanea.world-repo.v0.1",
    proof: {
      id: record.proofId,
      createdAt: record.createdAt,
      contentHash: record.contentHash,
    },
    source: {
      intent: record.draft.input.intent,
      driftFace: record.draft.input.driftFace,
      missionLane: record.draft.input.missionLane,
    },
    gift: record.draft.gift,
    world: record.draft.worldSeed,
    storybook: record.draft.storybook,
    visualCanon: record.draft.visualCanon,
    collectible: record.draft.collectible,
    stewardship: record.draft.stewardship,
    forgePackage: record.draft.forgePackage,
  };
}

export function renderCollectibleMetadata(record: Pick<GenesisProofRecord, "proofId" | "createdAt" | "contentHash" | "draft">) {
  const { collectible, worldSeed } = record.draft;

  return {
    schema: "arcanea.collectible-metadata.v0.1",
    name: collectible.name,
    description: collectible.listingCopy,
    image: collectible.assetPath,
    external_url: `https://arcanea.ai/genesis?proof=${record.proofId}`,
    attributes: collectible.attributes,
    properties: {
      category: "Genesis proof relic",
      editionName: collectible.editionName,
      worldName: worldSeed.name,
      proofId: record.proofId,
      contentHash: record.contentHash,
      createdAt: record.createdAt,
      chainIntent: collectible.chainIntent,
      mintReadiness: collectible.mintReadiness,
      rightsGate: collectible.rightsGate,
      blockers: collectible.blockers,
      nextActions: collectible.nextActions,
      files: [
        { uri: "world.arcanea.json", type: "application/json" },
        { uri: "README.md", type: "text/markdown" },
        { uri: "storybook/first-page.md", type: "text/markdown" },
        { uri: "visual/genesis-proof-relic.prompt.md", type: "text/markdown" },
      ],
    },
  };
}

export function renderGenesisBrief(record: Pick<GenesisProofRecord, "proofId" | "createdAt" | "contentHash" | "draft">) {
  const { draft } = record;

  return `# ${draft.worldSeed.name} Genesis Proof

Proof ID: ${record.proofId}
Created: ${record.createdAt}
Content hash: ${record.contentHash}

## Call

${draft.input.intent}

## Gift Object

- Name: ${draft.gift.name}
- Type: ${draft.gift.type}
- Drift face: ${labelForDriftFace(draft.input.driftFace)}
- Mission lane: ${labelForMissionLane(draft.input.missionLane)}
- Power: ${draft.gift.power}
- Cost: ${draft.gift.cost}
- Right use: ${draft.gift.rightUse}

## World Seed

Premise: ${draft.worldSeed.premise}

### Laws

${draft.worldSeed.laws.map((law, index) => `${index + 1}. ${law}`).join("\n")}

### Character Pair

${draft.worldSeed.characters.map((character) => `- ${character.name}: ${character.role}`).join("\n")}

### Visual DNA

${draft.worldSeed.visualDna.map((item) => `- ${item}`).join("\n")}

## Storybook Seed

Title: ${draft.storybook.title}
Format: ${draft.storybook.format}
Editorial rule: ${draft.storybook.editorialRule}

${draft.storybook.pages
  .map(
    (page, index) => `### Page ${index + 1}: ${page.title}

Scene: ${page.scene}

Narration: ${page.narration}

Creator action: ${page.creatorAction}`,
  )
  .join("\n\n")}

## Visual Canon

- Hero asset: ${draft.visualCanon.heroImagePath}
- QA status: ${draft.visualCanon.qaStatus}
- Palette: ${draft.visualCanon.palette.join(", ")}

## Collectible Blueprint

- Name: ${draft.collectible.name}
- Edition: ${draft.collectible.editionName}
- Mint readiness: ${draft.collectible.mintReadiness}
- Rights gate: ${draft.collectible.rightsGate}
- Chain intent: ${draft.collectible.chainIntent}

## First Trial

${draft.gift.firstTrial}

## Stewardship

- Canon status: ${draft.stewardship.canonStatus}
- Rights state: ${draft.stewardship.rightsState}
- Memory state: ${draft.stewardship.memoryState}

## Forge Package

- Name: ${draft.forgePackage.name}
- Buyer: ${draft.forgePackage.buyer}
- Promise: ${draft.forgePackage.promise}
- Pricing rung: ${draft.forgePackage.pricingRung}
- Checkout path: ${draft.forgePackage.checkoutPath}
- Support path: ${draft.forgePackage.supportPath}

### Deliverables

${draft.forgePackage.deliverables.map((item) => `- ${item}`).join("\n")}

### Exclusions

${draft.forgePackage.exclusions.map((item) => `- ${item}`).join("\n")}
`;
}

export function renderCanonSeed(record: Pick<GenesisProofRecord, "proofId" | "createdAt" | "contentHash" | "draft">) {
  const { draft } = record;

  return `# Canon Seed

World: ${draft.worldSeed.name}
Proof ID: ${record.proofId}

## Premise

${draft.worldSeed.premise}

## Laws

${draft.worldSeed.laws.map((law, index) => `${index + 1}. ${law}`).join("\n")}

## Characters

${draft.worldSeed.characters.map((character) => `- ${character.name}: ${character.role}`).join("\n")}

## Visual DNA

${draft.worldSeed.visualDna.join(", ")}
`;
}

export function renderStorybookFirstPage(record: Pick<GenesisProofRecord, "proofId" | "createdAt" | "contentHash" | "draft">) {
  const { storybook } = record.draft;

  return `# ${storybook.title}

Proof ID: ${record.proofId}
Format: ${storybook.format}

## Editorial Rule

${storybook.editorialRule}

${storybook.pages
  .map(
    (page, index) => `## Page ${index + 1}: ${page.title}

Scene: ${page.scene}

Narration: ${page.narration}

Creator action: ${page.creatorAction}`,
  )
  .join("\n\n")}
`;
}

export function renderVisualPrompt(record: Pick<GenesisProofRecord, "proofId" | "createdAt" | "contentHash" | "draft">) {
  const { visualCanon } = record.draft;

  return `# Genesis Proof Relic Visual Prompt

Proof ID: ${record.proofId}
Asset path: ${visualCanon.heroImagePath}
QA status: ${visualCanon.qaStatus}

## Prompt

${visualCanon.imagePrompt}

## Negative Prompt

${visualCanon.negativePrompt}

## Palette

${visualCanon.palette.map((color) => `- ${color}`).join("\n")}
`;
}

export function renderRightsReviewChecklist(record: Pick<GenesisProofRecord, "proofId" | "createdAt" | "contentHash" | "draft">) {
  const { collectible } = record.draft;

  return `# Rights Review Checklist

Proof ID: ${record.proofId}
Collectible: ${collectible.name}
Mint readiness: ${collectible.mintReadiness}

## Rights Gate

${collectible.rightsGate}

## Blockers

${collectible.blockers.map((blocker) => `- ${blocker}`).join("\n")}

## Next Actions

${collectible.nextActions.map((action) => `- ${action}`).join("\n")}
`;
}

export function renderFirstTrial(record: Pick<GenesisProofRecord, "proofId" | "createdAt" | "contentHash" | "draft">) {
  return `# First Trial

Proof ID: ${record.proofId}

${record.draft.gift.firstTrial}

## Acceptance

- One world law is written.
- One character contradiction is written.
- One proof artifact answers the Drift condition without naming people as enemies.
`;
}

export function buildRepoExport(record: Pick<GenesisProofRecord, "proofId" | "createdAt" | "contentHash" | "draft">) {
  return {
    files: [
      {
        path: "world.arcanea.json",
        content: `${JSON.stringify(renderWorldManifest(record), null, 2)}\n`,
      },
      {
        path: "README.md",
        content: renderGenesisBrief(record),
      },
      {
        path: "canon/seed.md",
        content: renderCanonSeed(record),
      },
      {
        path: "proof/first-trial.md",
        content: renderFirstTrial(record),
      },
      {
        path: "storybook/first-page.md",
        content: renderStorybookFirstPage(record),
      },
      {
        path: "visual/genesis-proof-relic.prompt.md",
        content: renderVisualPrompt(record),
      },
      {
        path: "marketplace/collectible-metadata.json",
        content: `${JSON.stringify(renderCollectibleMetadata(record), null, 2)}\n`,
      },
      {
        path: "rights/review-checklist.md",
        content: renderRightsReviewChecklist(record),
      },
    ],
  };
}
