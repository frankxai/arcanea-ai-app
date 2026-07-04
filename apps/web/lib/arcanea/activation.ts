export type ArcaneaActivationStatus = "live" | "staged" | "draft" | "blocked";

export interface ArcaneaActivationLane {
  id: string;
  title: string;
  status: ArcaneaActivationStatus;
  route: string;
  action: string;
  description: string;
  outputs: string[];
  risks: string[];
}

export interface ArcaneaStoryCharacter {
  name: string;
  role: string;
  proofPressure: string;
}

export interface ArcaneaStorySeed {
  title: string;
  canonStatus: string;
  logline: string;
  characters: ArcaneaStoryCharacter[];
  firstScenes: string[];
  productPath: string[];
}

export interface ArcaneaForgeCandidate {
  target: string;
  source: string;
  reason: string;
  privateDataRisk: "low" | "medium" | "high";
  nextValidation: string;
}

export interface ArcaneaMarketplaceGate {
  title: string;
  state: "required" | "ready" | "blocked";
  detail: string;
}

export interface ArcaneaSwarmOperator {
  name: string;
  remit: string;
  evidence: string;
}

export interface ArcaneaProofCoreMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ArcaneaMaterialFoundation {
  title: string;
  material: string;
  state: ArcaneaActivationStatus;
  role: string;
  route: string;
  signal: string;
}

export const ARCANEA_ACTIVATION_PROMPT =
  "Activate Arcanea as a creator-owned living world: turn the Arion and Mamoru Confluence seed into a Genesis proof, storybook packet, world graph, author-team queue, visual canon review, and rights-gated marketplace plan.";

export function buildGenesisHref(prompt = ARCANEA_ACTIVATION_PROMPT) {
  return `/genesis?prompt=${encodeURIComponent(prompt)}`;
}

export const ACTIVATION_LANES: ArcaneaActivationLane[] = [
  {
    id: "genesis-proof",
    title: "Genesis Proof",
    status: "live",
    route: buildGenesisHref(),
    action: "Answer the call",
    description:
      "Convert the activation prompt into a Gift Object, world seed, first storybook page, visual canon brief, and repo export.",
    outputs: ["Gift Object", "world.arcanea.json", "storybook seed", "rights-aware collectible draft"],
    risks: ["Generated proof remains private until canon and source review are complete."],
  },
  {
    id: "world-graph",
    title: "World Graph",
    status: "staged",
    route: "/worlds",
    action: "Open worlds",
    description:
      "Route approved seeds into the existing Living Worlds system with clear laws, characters, visual DNA, and public/private boundaries.",
    outputs: ["Arcanea Prime anchor", "world template", "character graph", "realm routing"],
    risks: ["Persistence and promotion rules still need a dedicated creator approval step."],
  },
  {
    id: "author-team",
    title: "Author Team",
    status: "staged",
    route: "/studio/author",
    action: "Open author studio",
    description:
      "Use the author workspace as the human-facing editorial cockpit for chapters, storybook packets, and council review.",
    outputs: ["book queue", "chapter inventory", "author-council route", "storybook packet"],
    risks: ["Generated prose should remain draft until a canon guardian and human editor pass it."],
  },
  {
    id: "visual-forge",
    title: "Visual Forge",
    status: "staged",
    route: "/design-lab",
    action: "Open design lab",
    description:
      "Carry the proof relic and future Arion/Mamoru assets through art direction, visual QA, and export inspection.",
    outputs: ["visual brief", "asset ledger", "desktop QA", "mobile QA"],
    risks: ["No first-pass image or logo should ship without inspection and a scored quality gate."],
  },
  {
    id: "canon-guardian",
    title: "Canon Guardian",
    status: "draft",
    route: "/living-lore",
    action: "Open living lore",
    description:
      "Keep staged Confluence material aligned with locked truths: Lumina and Nero, the Ten Gates, Shinkami, Malachar, and the Drift.",
    outputs: ["canon status", "alias ledger", "continuity notes", "forbidden-pattern check"],
    risks: ["Locked canon changes require explicit approval before promotion."],
  },
  {
    id: "marketplace",
    title: "Marketplace Rights",
    status: "blocked",
    route: "/protocol",
    action: "Review protocol",
    description:
      "Prepare collectible metadata and Story Protocol intent only after source, model contribution, license, and cultural review.",
    outputs: ["metadata draft", "license terms", "media URI plan", "registration intent"],
    risks: ["Do not mint, list, or sell until rights review is complete."],
  },
];

export const PROOF_CORE_METRICS: ArcaneaProofCoreMetric[] = [
  {
    label: "Core",
    value: "Genesis",
    detail: "Creator pressure becomes a proof object before expansion.",
  },
  {
    label: "Orbit",
    value: "6 lanes",
    detail: "World, author, visual, canon, plugin, and rights paths stay visible.",
  },
  {
    label: "Gate",
    value: "closed",
    detail: "Marketplace intent waits for source, license, and canon review.",
  },
];

export const MATERIAL_FOUNDATIONS: ArcaneaMaterialFoundation[] = [
  {
    title: "Glass Command Shell",
    material: "Dark glass, teal signal lines, live route state",
    state: "live",
    role: "Frames Genesis as the first accountable surface: the user sees proof state, not just lore theater.",
    route: buildGenesisHref(),
    signal: "Call, Gift, Trial, Proof",
  },
  {
    title: "Gold Provenance Seal",
    material: "Brushed gold, thin orbit bands, ledger accents",
    state: "staged",
    role: "Marks where human edits, source references, prompts, and model contribution need durable evidence.",
    route: "/design-lab",
    signal: "Visual QA and source ledger",
  },
  {
    title: "Codex Paper Layer",
    material: "Warm vellum, inked scene bands, restrained mythic texture",
    state: "draft",
    role: "Holds Arion, Mamoru, first scenes, and canon pressure as editorial material before public promotion.",
    route: "/living-lore",
    signal: "Story seed and canon boundary",
  },
  {
    title: "World Graph Lattice",
    material: "Dimensional nodes, calm blue depth, non-decorative motion",
    state: "staged",
    role: "Routes approved seeds into worlds, characters, laws, and author-team queues without losing ownership state.",
    route: "/worlds",
    signal: "World manifest and author queue",
  },
  {
    title: "Rights Review Vault",
    material: "Rose warning glass, locked metadata, sale-off switch",
    state: "blocked",
    role: "Keeps collectible metadata and Story Protocol intent private until licensing and cultural review are complete.",
    route: "/protocol",
    signal: "No mint, list, or sale",
  },
];

export const FLAGSHIP_STORY_SEED: ArcaneaStorySeed = {
  title: "Arion and Mamoru: Confluence Witness",
  canonStatus:
    "Staging seed. Uses Character Core plus locked Shinkami and Malachar anchors; details still need canon guardian review.",
  logline:
    "Arion, a Confluence Avatar candidate carrying the guilt of his first Gate event, is tested by a soulbond thread tied to Mamoru and the Shinkami lineage: power must become responsibility before it becomes destiny.",
  characters: [
    {
      name: "Arion",
      role: "Confluence Avatar candidate and primary emotional anchor.",
      proofPressure: "He must stop mistaking guilt for goodness while learning that power needs limits.",
    },
    {
      name: "Mamoru",
      role: "Shinkami-descended soulbond thread associated with Arion.",
      proofPressure: "The bond cannot be treated as a mascot or shortcut; it must test consent, trust, and right use.",
    },
    {
      name: "Mera",
      role: "Water-memory bender and truth witness.",
      proofPressure: "She can hear what history buried, but knowing is not the same as helping.",
    },
    {
      name: "Emilia",
      role: "Prism and Synthesis bridge between myth and creator tools.",
      proofPressure: "Her instruments reveal patterns, but they cannot do the moral work for the user.",
    },
    {
      name: "Headmaster Akamoto",
      role: "Bonded dragon-rider mentor and protector.",
      proofPressure: "His training may save Arion, but he refuses to make students into property.",
    },
    {
      name: "Malachar",
      role: "Fallen Luminor antagonist and mirror of compassionate control.",
      proofPressure: "He offers relief without trust, forcing Arion to choose freedom with consequences.",
    },
  ],
  firstScenes: [
    "Arion demonstrates harmless Foundation channeling and notices every adult flinch before he does.",
    "Mera hears an edited memory beneath a calm lesson pool and realizes the archive is not innocent.",
    "Emilia's Prisma instrument reveals Arion's Confluence pattern before she can decide who deserves to know.",
    "Akamoto orders a dragon to stand down so Arion can learn that fear answering fear is still fear.",
    "Malachar does not threaten Arion; he names the pain no one else has been willing to name.",
  ],
  productPath: [
    "Genesis proof packet",
    "three-page storybook seed",
    "world graph entry",
    "visual canon dossier",
    "rights-gated collectible draft",
  ],
};

export const FORGE_CANDIDATES: ArcaneaForgeCandidate[] = [
  {
    target: "arcanea-visual-forge",
    source: "arcanea-agent-skills/skills/arcanean-art-director",
    reason: "Packages art direction, prompt patterns, quality bar, and social asset templates.",
    privateDataRisk: "medium",
    nextValidation: "Run skill validation, secret scan, sample prompt smoke test, and visual QA fixture.",
  },
  {
    target: "arcanea-world-forge",
    source: "arcanea-agent-skills/skills/arcanean-worldbuilder",
    reason: "Bundles lore, worldbuilding, canon boundaries, character sheets, and scene sheets.",
    privateDataRisk: "medium",
    nextValidation: "Validate references and fixtures before packaging as a private plugin.",
  },
  {
    target: "arcanea-canon-guardian",
    source: "arcanea-agent-skills/skills/canon-guardian",
    reason: "Small high-leverage review layer for lore consistency and forbidden-pattern checks.",
    privateDataRisk: "medium",
    nextValidation: "Run canon-review fixtures against locked truths and staging aliases.",
  },
  {
    target: "arcanea-swarm-router",
    source: ".codex/skills/starlight-swarm-orchestration",
    reason: "Routes world architect, story weaver, visual forge, critic, and plugin packager work.",
    privateDataRisk: "high",
    nextValidation: "Redact local paths and private queue protocol before any public release.",
  },
  {
    target: "arcanea-nft-forge",
    source: "AnimeLegends/vendor/arcanea-nft-forge",
    reason: "Concrete collectible and metadata workflow for future rights-reviewed releases.",
    privateDataRisk: "high",
    nextValidation: "Keep private until strategy docs, provider keys, license terms, and cost paths are sanitized.",
  },
];

export const MARKETPLACE_GATES: ArcaneaMarketplaceGate[] = [
  {
    title: "Source and Model Ledger",
    state: "required",
    detail: "Record prompts, assets, model contribution, human edits, and source references before publication.",
  },
  {
    title: "Canon Boundary",
    state: "required",
    detail: "Mark whether the artifact is private draft, staged canon, public canon, or non-canon application.",
  },
  {
    title: "License Terms",
    state: "blocked",
    detail: "Choose usage rights, attribution requirements, resale rules, and takedown policy before listing.",
  },
  {
    title: "Durable Media URI",
    state: "blocked",
    detail: "Pin approved media and metadata only after the inspected export passes visual QA.",
  },
  {
    title: "Story Protocol Intent",
    state: "blocked",
    detail: "Treat registration as a later rights action, not proof that a draft is ready to mint or sell.",
  },
];

export const SWARM_OPERATORS: ArcaneaSwarmOperator[] = [
  {
    name: "World Architect",
    remit: "Turns creator pressure into laws, realms, constraints, and character load-bearing structure.",
    evidence: "World seed plus manifest export.",
  },
  {
    name: "Story Weaver",
    remit: "Creates first scenes, storybook pages, and author-team briefs without overwriting locked canon.",
    evidence: "Three-page storybook packet.",
  },
  {
    name: "Visual Forge",
    remit: "Builds visual briefs, generated assets, critique passes, and QA evidence.",
    evidence: "Relic image, screenshots, and design-loop evidence.",
  },
  {
    name: "Canon Guardian",
    remit: "Checks staged material against locked truths, aliases, forbidden patterns, and rights state.",
    evidence: "Canon review notes and promotion status.",
  },
  {
    name: "Plugin Packager",
    remit: "Converts stable skills into private plugins using skill-to-plugin-forge and plugin-creator.",
    evidence: "Validated plugin candidate manifest.",
  },
];
