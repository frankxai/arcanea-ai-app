/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * AI Models Data Layer — Worldbuilding & High Fantasy Intelligence
 *
 * Data source for arcanea.ai/models — The Premier Creative Model Arena
 * Evaluates models specifically for worldbuilding, fantasy novel writing,
 * canon continuity, magic system logic, and polyphonic character dialogue.
 *
 * Data Sources:
 * - Live OpenRouter API (real-time hourly sync)
 * - LMSYS Chatbot Arena Creative Writing Category (Human double-blind Elo)
 * - Hugging Face IFEval (Negative constraint & instruction adherence)
 * - Arcanea WorldCraft ratings (hand-assigned editorial scores; no automated test run backs them)
 * - Direct BYOK Provider APIs (Anthropic, OpenAI, Google, DeepSeek, Mistral, xAI)
 */

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface AIModelPricing {
  /** Price per million input tokens in USD, or "free" */
  input: number | "free";
  /** Price per million output tokens in USD, or "free" */
  output: number | "free";
}

export type ArcaneanGateName =
  | "Crown"
  | "Sight"
  | "Voice"
  | "Heart"
  | "Fire"
  | "Flow"
  | "Foundation"
  | "Starweave"
  | "Unity"
  | "Source";

export type CuratedAward =
  | "editors-choice"
  | "best-lore"
  | "best-prose"
  | "best-free"
  | "best-magic"
  | "best-dialogue"
  | "best-tactics";

export interface AIModelBenchmarks {
  creativeWritingElo?: number;
  ifEval?: number;
  loreRecallRuler?: number;
  sweBench?: number | null;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  /** Emoji representing the provider */
  providerLogo: string;
  version: string;
  /** Maximum context window in tokens */
  contextWindow: number;
  /** Maximum output tokens (0 = not publicly specified) */
  maxOutput: number;
  /** SWE-Bench Verified score as a percentage, or null if unavailable (backward compatibility) */
  sweBench: number | null;
  pricing: AIModelPricing;
  /** Estimated generation speed in tokens/sec */
  speed: number;
  /** ISO date string of public release / availability */
  releaseDate: string;
  strengths: string[];
  weaknesses: string[];
  category: "frontier" | "open-source" | "free-tier" | "specialized";
  tags: string[];

  // ── World Building & High Fantasy Intelligence ──
  /** Composite WorldCraft score (0-100) combining lore retention, prose lyricism, and logic */
  worldCraftScore: number;
  /** Lyrical prose quality, cadence, sensory depth & imagery (0-100) */
  proseQuality: number;
  /** Long-context canon retention & needle-in-haystack recall across 100K-1M tokens (0-100) */
  loreMemory: number;
  /** Hard magic system adherence and deductive world reasoning (0-100) */
  magicLogic: number;
  /** Character voice distinctiveness and polyphonic dialogue nuance (0-100) */
  characterVoice: number;
  /** Primary Arcanean Gate resonance */
  gateResonance: ArcaneanGateName;
  /** Extended Solfeggio frequency */
  gateFrequency: string;
  /** Bonded Guardian of the Gate */
  guardian: string;
  /** Specialized authoring role in worldbuilding */
  curatedRole: string;
  /** Arcanea Curated Award (if recognized as a category best) */
  curatedAward?: CuratedAward;
  /** Actionable guidance for fantasy authors on prompting & sweet spots */
  worldbuildingSweetSpot: string;
  /** Resistance to generic AI-tell phrases ('tapestry', 'delve', 'testament to') */
  slopResistance: "S" | "A" | "B" | "C";
  /** Multi-dimensional creative benchmark suite */
  benchmarks: AIModelBenchmarks;
}

export interface ArcaneanWorkflow {
  id: string;
  /** Display name of the workflow agent */
  name: string;
  /** Arcanean Guardian persona */
  guardian: string;
  /** Arcanean Gate this maps to */
  gate: string;
  /** Solfeggio frequency */
  frequency?: string;
  /** Primary model ID */
  model: string;
  /** Ordered fallback model IDs */
  fallbackModels: string[];
  /** Why this model was chosen for this workflow */
  rationale: string;
  /** Specific worldbuilding task domain */
  domain?: string;
  category:
    | "worldbuilding"
    | "prose"
    | "lore-vault"
    | "magic-systems"
    | "character"
    | "battles"
    | "sensory"
    | "folklore"
    | "councils"
    | "cosmology"
    // Legacy categories for backward compatibility
    | "orchestration"
    | "coding"
    | "review"
    | "research"
    | "coordination"
    | "quick";
}

export interface ImageModel {
  id: string;
  name: string;
  provider: string;
  providerLogo: string;
  version: string;
  maxResolution: string;
  defaultResolution: string;
  pricing: { perImage: number | "free"; unit: string };
  speed: number; // seconds per image
  strengths: string[];
  weaknesses: string[];
  category: "frontier" | "open-source" | "free-tier" | "specialized";
  tags: string[];
  textRendering: "excellent" | "good" | "poor" | "none";
  styleControl: "excellent" | "good" | "limited";
  apiAvailable: boolean;
}

export interface ModelWeeklyUpdate {
  /** ISO date string for the Monday of the week */
  weekOf: string;
  /** Model IDs that are free this week */
  models: string[];
  notes: string;
  newAdditions: string[];
  removals: string[];
}

// ---------------------------------------------------------------------------
// Models Roster — Calibrated for World Building & High Fantasy Writing
// ---------------------------------------------------------------------------

export const AI_MODELS: AIModel[] = [
  // ── Frontier ────────────────────────────────────────────────────────────

  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 3.7 / 4",
    provider: "Anthropic",
    providerLogo: "🟤",
    version: "3.7/4.0",
    contextWindow: 200_000,
    maxOutput: 64_000,
    sweBench: 79.6,
    pricing: { input: 3, output: 15 },
    speed: 80,
    releaseDate: "2025-05-22",
    strengths: [
      "Supreme prose lyricism — unmatched rhythm, sensory immersion, and stylistic flexibility",
      'Near-zero AI-tell repetition; naturally avoids "tapestry", "delve", and hollow enthusiasm',
      "Exceptional character voice distinction across ensemble fantasy casts",
      "Extended thinking mode unpacks intricate plot knots and magic consequences before drafting",
      "200K context holds full novella drafts with precise continuity",
    ],
    weaknesses: [
      "Premium pricing compared to open weights ($3/$15 per Mtok)",
      "Slightly lower raw context capacity than 1M-token models for multi-volume world bibles",
    ],
    category: "frontier",
    tags: [
      "prose",
      "high-fantasy",
      "character-voice",
      "editors-choice",
      "extended-thinking",
    ],
    worldCraftScore: 98,
    proseQuality: 99,
    loreMemory: 96,
    magicLogic: 95,
    characterVoice: 98,
    gateResonance: "Voice",
    gateFrequency: "528 Hz",
    guardian: "Alera",
    curatedRole: "The High Fantasy Novelist & Supreme Prose Craftsman",
    curatedAward: "editors-choice",
    worldbuildingSweetSpot:
      "Run at temperature 0.65 with explicit sensory focus prompts. Best-in-class for chapter manuscripts, lyrical scene descriptions, and razor-sharp dialogue with emotional subtext.",
    slopResistance: "S",
    benchmarks: {
      creativeWritingElo: 1378,
      ifEval: 88.5,
      loreRecallRuler: 97.4,
      sweBench: 79.6,
    },
  },
  {
    id: "claude-opus-4",
    name: "Claude Opus 4",
    provider: "Anthropic",
    providerLogo: "🟤",
    version: "4.0",
    contextWindow: 200_000,
    maxOutput: 32_000,
    sweBench: 90.0,
    pricing: { input: 15, output: 75 },
    speed: 40,
    releaseDate: "2025-05-22",
    strengths: [
      "Deepest mythic and philosophical weight — feels like an ancient chronicler of legends",
      "Flawless structural discipline over complex multi-threaded narrative arcs",
      "Highest benchmark scores for sustained reasoning and nuanced character interiority",
      "Extended chain-of-thought explores philosophical stakes of magic systems",
    ],
    weaknesses: [
      "High inference cost ($15/$75 per Mtok)",
      "Slower generation speed (40 tok/s)",
      "Overpowered for quick world item generation or simple scene snippets",
    ],
    category: "frontier",
    tags: [
      "mythic-prose",
      "cosmology",
      "crown-gate",
      "epic-sagas",
      "philosophy",
    ],
    worldCraftScore: 97,
    proseQuality: 98,
    loreMemory: 97,
    magicLogic: 96,
    characterVoice: 97,
    gateResonance: "Crown",
    gateFrequency: "741 Hz",
    guardian: "Aiyami",
    curatedRole: "The Arch-Sage of Epic Sagas & Genesis Cosmologies",
    curatedAward: "best-prose",
    worldbuildingSweetSpot:
      "Reserve for the core spine of your universe: creation myths, pantheon origin scriptures, epic climax chapters, and world-shattering magical confrontations.",
    slopResistance: "S",
    benchmarks: {
      creativeWritingElo: 1392,
      ifEval: 89.4,
      loreRecallRuler: 98.1,
      sweBench: 90.0,
    },
  },
  {
    id: "gemini-2.0-pro",
    name: "Gemini 2.0 Pro",
    provider: "Google",
    providerLogo: "🔵",
    version: "2.0-pro",
    contextWindow: 1_000_000,
    maxOutput: 65_536,
    sweBench: 48.0,
    pricing: { input: 1.25, output: 5 },
    speed: 70,
    releaseDate: "2025-03-25",
    strengths: [
      "1 Million token context window — ingests entire 500-page world bibles with zero chunking loss",
      "Perfect needle-in-a-haystack recall across ancestral genealogies, timelines, and geography",
      "Superior reasoning over massive multi-document lore archives",
      "Very competitive pricing ($1.25/$5.00 per Mtok) for a 1M frontier reasoner",
      "Native multimodal comprehension of fantasy realm maps and visual iconography",
    ],
    weaknesses: [
      "Prose can lean descriptive rather than poetic without precise style prompting",
      "Slower inference than Gemini Flash",
    ],
    category: "frontier",
    tags: ["long-context", "lore-vault", "1m-tokens", "canon-memory", "maps"],
    worldCraftScore: 95,
    proseQuality: 90,
    loreMemory: 99,
    magicLogic: 92,
    characterVoice: 89,
    gateResonance: "Starweave",
    gateFrequency: "852 Hz",
    guardian: "Elara",
    curatedRole: "The 1M-Token Living Lore Vault & Canon Sentinel",
    curatedAward: "best-lore",
    worldbuildingSweetSpot:
      "The ultimate lore brain. Drop in your full universe codex, timeline, and 50+ character sheets as system context, then query canon intersections and timeline paradoxes with 99% accuracy.",
    slopResistance: "A",
    benchmarks: {
      creativeWritingElo: 1325,
      ifEval: 84.8,
      loreRecallRuler: 99.5,
      sweBench: 48.0,
    },
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    providerLogo: "🐋",
    version: "r1",
    contextWindow: 128_000,
    maxOutput: 32_768,
    sweBench: 49.2,
    pricing: { input: 0.55, output: 2.19 },
    speed: 55,
    releaseDate: "2025-01-20",
    strengths: [
      "Transparent chain-of-thought reveals the full logical mechanics behind magic rules",
      "Unmatched at constructing hard magic systems with conservation of energy, costs, and limits",
      "Calculates military siege logistics, troop supply lines, and tactical battle math flawlessly",
      "Extremely affordable pricing ($0.55/$2.19 per Mtok)",
    ],
    weaknesses: [
      "Thinking phase takes longer before output starts",
      "Prose style needs guiding instructions to avoid analytical tone in descriptive scenes",
    ],
    category: "open-source",
    tags: ["hard-magic", "reasoning", "logic", "tactics", "consequence-trees"],
    worldCraftScore: 94,
    proseQuality: 86,
    loreMemory: 91,
    magicLogic: 99,
    characterVoice: 85,
    gateResonance: "Foundation",
    gateFrequency: "174 Hz",
    guardian: "Lyssandria",
    curatedRole: "The Grand Enchanter of Hard Magic & World Causality",
    curatedAward: "best-magic",
    worldbuildingSweetSpot:
      "Ask it to audit your magic system for loopholes, exploit balance issues, or simulate geopolitical fallout when an ancient kingdom collapses. Its step-by-step reasoning is extraordinary.",
    slopResistance: "A",
    benchmarks: {
      creativeWritingElo: 1295,
      ifEval: 86.8,
      loreRecallRuler: 91.2,
      sweBench: 49.2,
    },
  },
  {
    id: "qwen-3.6-plus-free",
    name: "Qwen 3.6 Plus",
    provider: "Alibaba",
    providerLogo: "🟠",
    version: "3.6-plus",
    contextWindow: 1_000_000,
    maxOutput: 16_384,
    sweBench: 78.8,
    pricing: { input: "free", output: "free" },
    speed: 85,
    releaseDate: "2025-06-01",
    strengths: [
      "100% Free via Zen routing — zero API key or credit card needed",
      "Massive 1M token context window for full world bible retention",
      "Exceptional multilingual world lore, mythology adaptation, and polyphonic naming conventions",
      "78.8% SWE-Bench with deep agentic persistence for automated lore generation pipelines",
    ],
    weaknesses: [
      "Rate limits on free public gateways during peak hours",
      "Occasionally defaults to Eastern fantasy mythological idioms without specific Western fantasy framing",
    ],
    category: "free-tier",
    tags: ["free", "1m-tokens", "worldbuilding", "multilingual", "best-free"],
    worldCraftScore: 93,
    proseQuality: 88,
    loreMemory: 98,
    magicLogic: 91,
    characterVoice: 87,
    gateResonance: "Unity",
    gateFrequency: "963 Hz",
    guardian: "Ino",
    curatedRole: "The Sovereign Free Worldbuilder & Bestiary Scribe",
    curatedAward: "best-free",
    worldbuildingSweetSpot:
      "The #1 choice for creators building large universes on zero budget. Use for generating hundreds of factions, settlements, creature bestiaries, and flora/fauna encyclopedias.",
    slopResistance: "A",
    benchmarks: {
      creativeWritingElo: 1308,
      ifEval: 82.5,
      loreRecallRuler: 98.0,
      sweBench: 78.8,
    },
  },
  {
    id: "mistral-large-2",
    name: "Mistral Large 2",
    provider: "Mistral AI",
    providerLogo: "🦅",
    version: "2411",
    contextWindow: 128_000,
    maxOutput: 16_384,
    sweBench: 44.0,
    pricing: { input: 2, output: 6 },
    speed: 75,
    releaseDate: "2024-11-18",
    strengths: [
      "Eloquent, stylish prose with a sophisticated European fantasy heritage",
      "Sharp, witty dialogue with exceptional understanding of court politics and deceit",
      "Strong multilingual capabilities across French, German, Spanish, and constructed tongues",
      "High resistance to generic corporate platitudes",
    ],
    weaknesses: [
      "128K context is smaller than 1M alternatives",
      "Moderately expensive for an open-weights derivative provider",
    ],
    category: "frontier",
    tags: ["dialogue", "court-intrigue", "character-voice", "literary-prose"],
    worldCraftScore: 94,
    proseQuality: 95,
    loreMemory: 90,
    magicLogic: 90,
    characterVoice: 97,
    gateResonance: "Voice",
    gateFrequency: "528 Hz",
    guardian: "Alera",
    curatedRole: "The Continental Bard of Polyphonic Dialogue & Court Intrigue",
    curatedAward: "best-dialogue",
    worldbuildingSweetSpot:
      "Ideal for writing noble house council arguments, witty bardic banter, espionage debriefs, and subtle power struggles where characters speak in riddles and double meanings.",
    slopResistance: "S",
    benchmarks: {
      creativeWritingElo: 1338,
      ifEval: 85.0,
      loreRecallRuler: 90.5,
      sweBench: 44.0,
    },
  },
  {
    id: "minimax-m2.5-free",
    name: "MiniMax M2.5",
    provider: "MiniMax",
    providerLogo: "🟣",
    version: "2.5",
    contextWindow: 200_000,
    maxOutput: 16_384,
    sweBench: 80.2,
    pricing: { input: "free", output: "free" },
    speed: 75,
    releaseDate: "2025-07-01",
    strengths: [
      "High kinetic momentum — writes combat, magic duels, and chase sequences with fierce velocity",
      "80.2% SWE-bench logic carries over to precise tactical action choreography",
      "200K context allows keeping the full surrounding battle terrain and squad statuses in mind",
      "100% Free via Zen routing",
    ],
    weaknesses: [
      "Slightly less nuanced at slow, contemplative literary reflection than Claude Opus",
    ],
    category: "free-tier",
    tags: ["battles", "action", "tactics", "free", "kinetic-prose"],
    worldCraftScore: 91,
    proseQuality: 89,
    loreMemory: 88,
    magicLogic: 94,
    characterVoice: 88,
    gateResonance: "Fire",
    gateFrequency: "396 Hz",
    guardian: "Draconia",
    curatedRole: "The Battle Choreographer & Godbeast Clash Director",
    curatedAward: "best-tactics",
    worldbuildingSweetSpot:
      "Drafting epic sword-fights, aerial dragon duels, elemental spell exchanges, and castle sieges. Paces action beats and physical impact with visceral clarity.",
    slopResistance: "A",
    benchmarks: {
      creativeWritingElo: 1288,
      ifEval: 81.2,
      loreRecallRuler: 88.0,
      sweBench: 80.2,
    },
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    providerLogo: "🐋",
    version: "v3",
    contextWindow: 64_000,
    maxOutput: 8_192,
    sweBench: 42.0,
    pricing: { input: 0.27, output: 1.1 },
    speed: 60,
    releaseDate: "2024-12-26",
    strengths: [
      "Unbelievable value at $0.27/$1.10 per Mtok for near-frontier output",
      "Solid prose and worldbuilding comprehension at 1/10th the cost of proprietary frontier models",
      "Open-weights architecture allows local or self-hosted deployment",
      "Strong structured JSON output for inventory items, stat blocks, and spell tables",
    ],
    weaknesses: [
      "64K context window requires chunking for massive world bibles",
      "Inference speed slower on high-concurrency public APIs",
    ],
    category: "open-source",
    tags: ["budget", "compendium", "open-weights", "item-tables"],
    worldCraftScore: 91,
    proseQuality: 88,
    loreMemory: 85,
    magicLogic: 92,
    characterVoice: 86,
    gateResonance: "Foundation",
    gateFrequency: "174 Hz",
    guardian: "Lyssandria",
    curatedRole: "The High-Efficiency World Compendium Scribe",
    worldbuildingSweetSpot:
      "Batch generation of massive world databases: item inventories, potion recipes, plant encyclopedias, minor faction lists, and historical battle tables on a modest budget.",
    slopResistance: "A",
    benchmarks: {
      creativeWritingElo: 1282,
      ifEval: 80.5,
      loreRecallRuler: 85.0,
      sweBench: 42.0,
    },
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    providerLogo: "🔵",
    version: "2.0-flash",
    contextWindow: 1_000_000,
    maxOutput: 8_192,
    sweBench: 33.0,
    pricing: { input: 0.075, output: 0.3 },
    speed: 160,
    releaseDate: "2025-02-05",
    strengths: [
      "Fastest 1M context model on earth (160 tok/s)",
      "Astonishingly cheap ($0.075/$0.30 per Mtok)",
      "Native multimodal: feed realm map images, coats of arms, or character art alongside text",
      "Ideal for interactive conversational worldbuilding brainstorming at near-instant speed",
    ],
    weaknesses: [
      "Prose style can be plain without detailed style instructions",
      "Smaller output token limit (8,192)",
    ],
    category: "frontier",
    tags: ["fast", "multimodal", "1m-tokens", "map-analysis", "affordable"],
    worldCraftScore: 90,
    proseQuality: 85,
    loreMemory: 97,
    magicLogic: 86,
    characterVoice: 84,
    gateResonance: "Sight",
    gateFrequency: "639 Hz",
    guardian: "Lyria",
    curatedRole: "Rapid Multimodal World Explorer & Map Inquisitor",
    worldbuildingSweetSpot:
      "Upload high-resolution hand-drawn fantasy maps and have it analyze geographical realism, suggest mountain pass trade routes, or design climate zones in seconds.",
    slopResistance: "B",
    benchmarks: {
      creativeWritingElo: 1262,
      ifEval: 79.8,
      loreRecallRuler: 97.2,
      sweBench: 33.0,
    },
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    providerLogo: "🟢",
    version: "4o",
    contextWindow: 128_000,
    maxOutput: 16_384,
    sweBench: 38.4,
    pricing: { input: 2.5, output: 10 },
    speed: 90,
    releaseDate: "2024-05-13",
    strengths: [
      "Broad general versatility and vast cultural reference library",
      "Strong multimodal capabilities for world art, creature reference images, and heraldry",
      "Reliable tool and function calling for custom worldbuilding extensions and graph databases",
    ],
    weaknesses: [
      "Prone to generic modern speech patterns in fantasy dialogue without strict system prompts",
      "Higher cost than open-source counterparts",
    ],
    category: "frontier",
    tags: ["multimodal", "general-purpose", "world-art", "vision"],
    worldCraftScore: 92,
    proseQuality: 89,
    loreMemory: 88,
    magicLogic: 89,
    characterVoice: 90,
    gateResonance: "Sight",
    gateFrequency: "639 Hz",
    guardian: "Lyria",
    curatedRole: "Multimodal World Visualizer & Scene Director",
    worldbuildingSweetSpot:
      "Translating textual lore into visual art prompts for image engines (FLUX/Midjourney), or examining visual artifacts and synthesizing lore descriptions.",
    slopResistance: "B",
    benchmarks: {
      creativeWritingElo: 1316,
      ifEval: 83.2,
      loreRecallRuler: 88.5,
      sweBench: 38.4,
    },
  },
  {
    id: "llama-4-maverick",
    name: "Llama 4 Maverick (3.3 70B)",
    provider: "Meta",
    providerLogo: "🦙",
    version: "4-maverick",
    contextWindow: 1_000_000,
    maxOutput: 16_384,
    sweBench: 50.0,
    pricing: { input: "free", output: "free" },
    speed: 70,
    releaseDate: "2025-04-05",
    strengths: [
      "Fully open-source — self-host for 100% offline data privacy for unpublished manuscripts",
      "Massive 1M token context capacity with open weights",
      "Thriving fine-tune community with dedicated fiction writing and roleplay LoRAs",
      "Uncensored creative freedom for dark fantasy, grimdark warfare, and horror elements",
    ],
    weaknesses: [
      "Requires substantial local GPU VRAM to run at full context self-hosted",
      "Base model requires fine-tuned system prompt for consistent high fantasy tone",
    ],
    category: "open-source",
    tags: [
      "open-weights",
      "self-host",
      "sovereign",
      "dark-fantasy",
      "1m-tokens",
    ],
    worldCraftScore: 89,
    proseQuality: 86,
    loreMemory: 95,
    magicLogic: 88,
    characterVoice: 85,
    gateResonance: "Flow",
    gateFrequency: "285 Hz",
    guardian: "Leyla",
    curatedRole: "Sovereign Self-Hosted World Archive & Dark Fantasy Scribe",
    worldbuildingSweetSpot:
      "When you cannot send proprietary book IP to cloud APIs. Excellent for dark fantasy, eldritch horror, and morally grey fiction where proprietary cloud filters cause false refusals.",
    slopResistance: "B",
    benchmarks: {
      creativeWritingElo: 1272,
      ifEval: 80.0,
      loreRecallRuler: 94.8,
      sweBench: 50.0,
    },
  },
  {
    id: "kimi-k2.5-free",
    name: "Kimi K2.5",
    provider: "Moonshot",
    providerLogo: "🌙",
    version: "k2.5",
    contextWindow: 260_000,
    maxOutput: 16_384,
    sweBench: 76.8,
    pricing: { input: "free", output: "free" },
    speed: 80,
    releaseDate: "2025-07-01",
    strengths: [
      "Free via Zen routing with 260K context",
      "1 Trillion MoE architecture with 100 internal sub-agents",
      "Superior cross-referencing of historical timeline anomalies and family tree lineages",
      "76.8% SWE-Bench indicates strong structural logic",
    ],
    weaknesses: ["Rate-limited on free gateway during peak traffic"],
    category: "free-tier",
    tags: ["free", "timeline-logic", "lineage", "research"],
    worldCraftScore: 88,
    proseQuality: 85,
    loreMemory: 92,
    magicLogic: 87,
    characterVoice: 84,
    gateResonance: "Starweave",
    gateFrequency: "852 Hz",
    guardian: "Elara",
    curatedRole: "The Chronology Sentinel & Historical Fact-Checker",
    worldbuildingSweetSpot:
      "Audit your historical timeline for anachronisms, calculate travel times across kingdom maps, and ensure multi-generational characters have logically consistent ages.",
    slopResistance: "B",
    benchmarks: {
      creativeWritingElo: 1252,
      ifEval: 78.4,
      loreRecallRuler: 92.0,
      sweBench: 76.8,
    },
  },
  {
    id: "glm-4.7-free",
    name: "GLM 4.7",
    provider: "Zhipu",
    providerLogo: "🟡",
    version: "4.7",
    contextWindow: 200_000,
    maxOutput: 8_192,
    sweBench: 73.8,
    pricing: { input: "free", output: "free" },
    speed: 70,
    releaseDate: "2025-08-01",
    strengths: [
      "Free via Zen routing",
      "Superb at in-universe folk ballads, tavern songs, tavern rumors, and provincial riddles",
      "Multilingual strength for inventing fictional tongues and regional dialect cadences",
      "Rich cultural nuance in ceremonial traditions and fantasy religious rites",
    ],
    weaknesses: ["Slightly slower than Flash models"],
    category: "free-tier",
    tags: ["free", "folklore", "ballads", "dialects", "rituals"],
    worldCraftScore: 87,
    proseQuality: 86,
    loreMemory: 88,
    magicLogic: 85,
    characterVoice: 86,
    gateResonance: "Flow",
    gateFrequency: "285 Hz",
    guardian: "Leyla",
    curatedRole: "The Wandering Folklorist & Ballad Composer",
    worldbuildingSweetSpot:
      "Writing folk songs sung by sailors in port taverns, ancient proverbs, nursery rhymes warning of forest monsters, and regional harvest festival rituals.",
    slopResistance: "B",
    benchmarks: {
      creativeWritingElo: 1248,
      ifEval: 77.0,
      loreRecallRuler: 88.0,
      sweBench: 73.8,
    },
  },
  {
    id: "claude-haiku-3.5",
    name: "Claude Haiku 3.5",
    provider: "Anthropic",
    providerLogo: "🟤",
    version: "3.5",
    contextWindow: 200_000,
    maxOutput: 8_192,
    sweBench: 40.6,
    pricing: { input: 0.25, output: 1.25 },
    speed: 150,
    releaseDate: "2024-10-29",
    strengths: [
      "Blazing fast response times (150 tok/s)",
      "Very affordable ($0.25/$1.25 per Mtok)",
      "Maintains Anthropic prose elegance even in concise outputs",
      "Perfect for procedural NPC creation, loot tables, and spell components on the fly",
    ],
    weaknesses: [
      "Less depth for multi-chapter novel plots or complex emotional character arcs",
    ],
    category: "frontier",
    tags: ["fast", "cheap", "npc-generator", "loot-tables"],
    worldCraftScore: 85,
    proseQuality: 82,
    loreMemory: 84,
    magicLogic: 82,
    characterVoice: 83,
    gateResonance: "Unity",
    gateFrequency: "963 Hz",
    guardian: "Ino",
    curatedRole: "Rapid World Indexer & Minor NPC Generator",
    worldbuildingSweetSpot:
      "Roll up 20 tavern patrons, city guards, shopkeeper quirks, minor curses, or flora descriptions in 3 seconds.",
    slopResistance: "B",
    benchmarks: {
      creativeWritingElo: 1225,
      ifEval: 75.0,
      loreRecallRuler: 84.0,
      sweBench: 40.6,
    },
  },
  {
    id: "nemotron-3-super-free",
    name: "Nemotron 3 Super",
    provider: "NVIDIA",
    providerLogo: "💚",
    version: "3-super",
    contextWindow: 1_000_000,
    maxOutput: 16_384,
    sweBench: null,
    pricing: { input: "free", output: "free" },
    speed: 90,
    releaseDate: "2025-06-01",
    strengths: [
      "Free via Zen routing with 1M context",
      "NVIDIA hardware-optimised structured analysis",
      "Handles large-scale kingdom demographics, economic trade flows, and natural resource maps",
    ],
    weaknesses: ["Prose style is analytical rather than lyrical"],
    category: "free-tier",
    tags: ["free", "1m-tokens", "world-simulation", "demographics"],
    worldCraftScore: 86,
    proseQuality: 82,
    loreMemory: 94,
    magicLogic: 88,
    characterVoice: 81,
    gateResonance: "Foundation",
    gateFrequency: "174 Hz",
    guardian: "Lyssandria",
    curatedRole: "The World Demographics & Trade Route Modeler",
    worldbuildingSweetSpot:
      "Designing kingdom economies: tax structures, trade guild monopolies, ore distribution across mountain ranges, and crop yields across river basins.",
    slopResistance: "B",
    benchmarks: {
      creativeWritingElo: 1215,
      ifEval: 76.5,
      loreRecallRuler: 94.0,
      sweBench: null,
    },
  },
  {
    id: "mimo-v2-pro-free",
    name: "MiMo V2 Pro",
    provider: "Xiaomi",
    providerLogo: "🔶",
    version: "v2-pro",
    contextWindow: 1_000_000,
    maxOutput: 16_384,
    sweBench: 78.0,
    pricing: { input: "free", output: "free" },
    speed: 80,
    releaseDate: "2025-08-01",
    strengths: [
      "Free via Zen routing with 1M context",
      "78% SWE-bench logic carries into sustained multi-chapter plot outlining",
      "Capable of holding entire manuscript chapters in context while proposing revisions",
    ],
    weaknesses: [
      "Newer model with less established documentation in English creative circles",
    ],
    category: "free-tier",
    tags: ["free", "1m-tokens", "outlines", "saga-planning"],
    worldCraftScore: 87,
    proseQuality: 85,
    loreMemory: 94,
    magicLogic: 86,
    characterVoice: 83,
    gateResonance: "Starweave",
    gateFrequency: "852 Hz",
    guardian: "Elara",
    curatedRole: "Free 1M Long-Context Saga Outliner",
    worldbuildingSweetSpot:
      "Plotting multi-volume fantasy trilogies where foreshadowing planted in Book 1 must pay off in Book 3.",
    slopResistance: "B",
    benchmarks: {
      creativeWritingElo: 1240,
      ifEval: 77.5,
      loreRecallRuler: 93.5,
      sweBench: 78.0,
    },
  },
  {
    id: "big-pickle-free",
    name: "Big Pickle (GLM-4.6)",
    provider: "Zhipu",
    providerLogo: "🟡",
    version: "4.6",
    contextWindow: 200_000,
    maxOutput: 8_192,
    sweBench: 70.0,
    pricing: { input: "free", output: "free" },
    speed: 65,
    releaseDate: "2025-05-01",
    strengths: [
      "Free via Zen routing",
      "Deliberate, slow reasoning over high-concept cosmological models",
      "Good at theological debates between fantasy religious orders and philosophical treatises",
    ],
    weaknesses: [
      "Slower output speed (65 tok/s)",
      "Not suited for fast real-time drafting",
    ],
    category: "free-tier",
    tags: ["free", "cosmology", "theology", "deliberate"],
    worldCraftScore: 86,
    proseQuality: 84,
    loreMemory: 89,
    magicLogic: 89,
    characterVoice: 83,
    gateResonance: "Crown",
    gateFrequency: "741 Hz",
    guardian: "Aiyami",
    curatedRole: "The Cosmological Thinker & High Priest of Lore",
    worldbuildingSweetSpot:
      "Writing monastic scrolls, theological schisms, and debates on the true nature of the Primordial Duality between Light and Dark.",
    slopResistance: "B",
    benchmarks: {
      creativeWritingElo: 1230,
      ifEval: 76.2,
      loreRecallRuler: 89.0,
      sweBench: 70.0,
    },
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    providerLogo: "🟢",
    version: "4o-mini",
    contextWindow: 128_000,
    maxOutput: 16_384,
    sweBench: 23.7,
    pricing: { input: 0.15, output: 0.6 },
    speed: 130,
    releaseDate: "2024-07-18",
    strengths: [
      "Very affordable entry price ($0.15/$0.60 per Mtok)",
      "Fast inference for high-volume world terminology tagging",
      "Good for keyword extraction from world building notes",
    ],
    weaknesses: [
      "Shallow emotional depth in character prose",
      "Prone to standard tropes and clichés without heavy prompting",
    ],
    category: "frontier",
    tags: ["cheap", "fast", "tagging", "glossary"],
    worldCraftScore: 82,
    proseQuality: 80,
    loreMemory: 83,
    magicLogic: 80,
    characterVoice: 81,
    gateResonance: "Unity",
    gateFrequency: "963 Hz",
    guardian: "Ino",
    curatedRole: "Lore Metadata Tagger & Glossary Classifier",
    worldbuildingSweetSpot:
      "Automated tagging of existing worldbuilding files, compiling alphabetical indexes, and checking glossary definitions.",
    slopResistance: "C",
    benchmarks: {
      creativeWritingElo: 1205,
      ifEval: 74.0,
      loreRecallRuler: 82.5,
      sweBench: 23.7,
    },
  },
  {
    id: "gpt-5-nano-free",
    name: "GPT-5 Nano",
    provider: "OpenAI",
    providerLogo: "🟢",
    version: "5-nano",
    contextWindow: 128_000,
    maxOutput: 8_192,
    sweBench: null,
    pricing: { input: "free", output: "free" },
    speed: 200,
    releaseDate: "2025-09-01",
    strengths: [
      "Fastest free model in the arena (200 tok/s)",
      "Instantaneous UI response for in-editor worldbuilding term popups",
      "Zero-latency name generation for minor locations and background extras",
    ],
    weaknesses: [
      "Minimal reasoning depth; not for plotting or complex narrative prose",
    ],
    category: "free-tier",
    tags: ["free", "ultra-fast", "name-generator", "in-editor"],
    worldCraftScore: 79,
    proseQuality: 76,
    loreMemory: 80,
    magicLogic: 77,
    characterVoice: 77,
    gateResonance: "Unity",
    gateFrequency: "963 Hz",
    guardian: "Ino",
    curatedRole: "Instant In-Editor Fantasy Term & Name Generator",
    worldbuildingSweetSpot:
      "Keep running in the background of your writing app for instant tooltip definitions, synonym generation, and random fantasy name rollups.",
    slopResistance: "C",
    benchmarks: {
      creativeWritingElo: 1190,
      ifEval: 71.0,
      loreRecallRuler: 79.0,
      sweBench: null,
    },
  },
];

// ---------------------------------------------------------------------------
// Image Models — Visual Worldbuilding & Concept Art
// ---------------------------------------------------------------------------

export const IMAGE_MODELS: ImageModel[] = [
  {
    id: "flux-2-max",
    name: "FLUX.2 Max",
    provider: "Black Forest Labs",
    providerLogo: "⬛",
    version: "2.0-max",
    maxResolution: "2048x2048",
    defaultResolution: "1024x1024",
    pricing: { perImage: 0.04, unit: "per image" },
    speed: 8,
    strengths: [
      "Best text rendering for fantasy realm maps, city signage, and runic inscriptions",
      "Ultra-photorealistic cinematic environmental concept art",
      "Flawless adherence to intricate architectural and costume design prompts",
    ],
    weaknesses: [
      "Slower generation time (~8s)",
      "Premium pricing at $0.04/image",
    ],
    category: "frontier",
    tags: ["maps", "cinematic-art", "text-rendering", "architecture"],
    textRendering: "excellent",
    styleControl: "excellent",
    apiAvailable: true,
  },
  {
    id: "midjourney-v7",
    name: "Midjourney v7",
    provider: "Midjourney",
    providerLogo: "🎨",
    version: "7.0",
    maxResolution: "2048x2048",
    defaultResolution: "1024x1024",
    pricing: { perImage: 0.05, unit: "per image (est. from subscription)" },
    speed: 10,
    strengths: [
      "Unrivaled aesthetic quality — the gold standard for high fantasy book covers",
      "Rich painterly textures, ethereal atmospheric lighting, and epic creature designs",
      "Exceptional character costume, armour, and jewellery rendering",
    ],
    weaknesses: [
      "No standalone public API — web interface or Discord",
      "Poor in-image legible text rendering",
    ],
    category: "specialized",
    tags: ["book-covers", "aesthetic", "fantasy-art", "godbeasts"],
    textRendering: "poor",
    styleControl: "excellent",
    apiAvailable: false,
  },
  {
    id: "grok-2-image",
    name: "Grok 2 Image",
    provider: "xAI",
    providerLogo: "🤖",
    version: "2.0",
    maxResolution: "1024x1024",
    defaultResolution: "1024x1024",
    pricing: { perImage: 0.02, unit: "per image" },
    speed: 4,
    strengths: [
      "Fast generation at 4 seconds per image",
      "Good general-purpose fantasy landscape rendering at low cost",
      "Native xAI API with straightforward integration",
    ],
    weaknesses: ["Less fine-grained artistic style customization than FLUX"],
    category: "frontier",
    tags: ["fast", "affordable", "landscapes"],
    textRendering: "good",
    styleControl: "good",
    apiAvailable: true,
  },
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    provider: "OpenAI",
    providerLogo: "🟢",
    version: "3.0",
    maxResolution: "1024x1792",
    defaultResolution: "1024x1024",
    pricing: { perImage: 0.04, unit: "per image (1024x1024)" },
    speed: 6,
    strengths: [
      "Excellent creative prompt expansion from short world descriptions",
      "Good text rendering on badges, book covers, and scrolls",
      "Broad integration with ChatGPT and OpenAI API tools",
    ],
    weaknesses: [
      "Safety filters occasionally reject dark fantasy or combat scenes",
      "Less photorealistic than FLUX.2 for gritty fantasy worlds",
    ],
    category: "frontier",
    tags: ["creative", "reliable", "text-rendering"],
    textRendering: "excellent",
    styleControl: "good",
    apiAvailable: true,
  },
  {
    id: "sd-3.5-large",
    name: "Stable Diffusion 3.5 Large",
    provider: "Stability AI",
    providerLogo: "🟣",
    version: "3.5-large",
    maxResolution: "1024x1024",
    defaultResolution: "1024x1024",
    pricing: { perImage: 0.035, unit: "per image (API) / free self-hosted" },
    speed: 5,
    strengths: [
      "Fully open-source — zero per-image cost when self-hosted on a local GPU",
      "Thousands of fantasy LoRAs (elf armor, dragon scales, gothic cathedrals, map styles)",
      "Total offline data privacy for unpublished concept art",
    ],
    weaknesses: [
      "Requires 12GB+ GPU VRAM to run locally",
      "Base model requires fine-tuned LoRAs to match Midjourney aesthetics",
    ],
    category: "open-source",
    tags: ["open-source", "self-host", "custom-loras", "sovereign"],
    textRendering: "good",
    styleControl: "excellent",
    apiAvailable: true,
  },
  {
    id: "gemini-image",
    name: "Gemini Image",
    provider: "Google",
    providerLogo: "🔵",
    version: "2.0",
    maxResolution: "1024x1024",
    defaultResolution: "1024x1024",
    pricing: { perImage: 0.02, unit: "per image via API" },
    speed: 3,
    strengths: [
      "Fastest generation at ~3 seconds",
      "Very affordable at $0.02/image",
      "Directly paired with multimodal Gemini chat for conversational iteration",
    ],
    weaknesses: [
      "Less specialized fantasy painting style than Midjourney or FLUX",
    ],
    category: "frontier",
    tags: ["fast", "multimodal", "conversational"],
    textRendering: "good",
    styleControl: "good",
    apiAvailable: true,
  },
];

// ---------------------------------------------------------------------------
// Arcanean Workflows — The 10 Gates of Worldbuilding & Fantasy Creation
// ---------------------------------------------------------------------------

export const ARCANEAN_WORKFLOWS: ArcaneanWorkflow[] = [
  {
    id: "world-architect",
    name: "The World Architect",
    guardian: "Lyssandria",
    gate: "Foundation",
    frequency: "174 Hz",
    model: "claude-sonnet-4",
    fallbackModels: ["deepseek-r1", "qwen-3.6-plus-free"],
    domain: "Physical Geography, Continental Tectonics, Climate & Settlements",
    rationale:
      "Grounds the world in concrete reality. Coordinates landmasses, mountain aquifers, climate belts, trade routes, and settlement eras so the physical world feels ancient and coherent.",
    category: "worldbuilding",
  },
  {
    id: "fantasy-chronicler",
    name: "The High Fantasy Chronicler",
    guardian: "Alera",
    gate: "Voice",
    frequency: "528 Hz",
    model: "claude-sonnet-4",
    fallbackModels: ["claude-opus-4", "mistral-large-2"],
    domain: "Manuscript Chapters, Lyrical Narrative Prose, Pacing & Anti-Slop",
    rationale:
      'Master of the poetic line, rhythmic cadence, and sensory immersion. Crafts full chapters without generic AI-tell verbal tics ("tapestry", "delve"), delivering authentic literary voice.',
    category: "prose",
  },
  {
    id: "lore-vault-keeper",
    name: "The Lore Vault Keeper",
    guardian: "Elara",
    gate: "Starweave",
    frequency: "852 Hz",
    model: "gemini-2.0-pro",
    fallbackModels: ["qwen-3.6-plus-free", "gemini-2.0-flash"],
    domain: "1M-Token Universe Bibles, Lineages, Timelines & Canon Sentinel",
    rationale:
      "Ingests entire 500-page world compendiums in a single 1M context prompt. Instantly cross-checks multi-generational timelines, family lineages, and prevents canonical contradictions.",
    category: "lore-vault",
  },
  {
    id: "magic-engineer",
    name: "The Magic System Engineer",
    guardian: "Aiyami",
    gate: "Crown",
    frequency: "741 Hz",
    model: "deepseek-r1",
    fallbackModels: ["claude-sonnet-4", "minimax-m2.5-free"],
    domain: "Hard Magic Laws, Solfeggio Frequencies, Energy Costs & Runes",
    rationale:
      "Applies rigorous deductive reasoning to spellcraft. Computes energy conservation, consequences, divine oaths, and spell limits so magic feels earned, consistent, and dangerous.",
    category: "magic-systems",
  },
  {
    id: "character-psychologist",
    name: "The Character Psychologist",
    guardian: "Maylinn",
    gate: "Heart",
    frequency: "417 Hz",
    model: "claude-sonnet-4",
    fallbackModels: ["mistral-large-2", "claude-opus-4"],
    domain: "Emotional Interiority, Tragic Flaws, Moral Conflict & Voice",
    rationale:
      "Examines character wounds, hidden yearnings, relationship tensions, and tragic character arcs. Ensures dialogue carries subtext and distinct emotional weight.",
    category: "character",
  },
  {
    id: "battle-choreographer",
    name: "The Battle Choreographer",
    guardian: "Draconia",
    gate: "Fire",
    frequency: "396 Hz",
    model: "minimax-m2.5-free",
    fallbackModels: ["claude-sonnet-4", "deepseek-v3"],
    domain: "Kinetic Magic Battles, Swordplay, Army Sieges & Climactic Duels",
    rationale:
      "Brings intense kinetic velocity, weapon mechanics, tactical terrain advantage, and adrenaline pacing to magical duels, godbeast confrontations, and kingdom-level clashes.",
    category: "battles",
  },
  {
    id: "sensory-painter",
    name: "The Sensory World Painter",
    guardian: "Lyria",
    gate: "Sight",
    frequency: "639 Hz",
    model: "claude-sonnet-4",
    fallbackModels: ["gpt-4o", "gemini-2.0-flash"],
    domain: "Visual Scene Setting, Citadel Architecture, Atmospheric Weather",
    rationale:
      "Translates raw world ideas into vivid, camera-ready scenes: light filtering through cathedral stained glass, the scent of ozone before a storm, ancient obsidian architecture.",
    category: "sensory",
  },
  {
    id: "folklorist-mythmaker",
    name: "The Folklorist & Mythmaker",
    guardian: "Leyla",
    gate: "Flow",
    frequency: "285 Hz",
    model: "glm-4.7-free",
    fallbackModels: ["qwen-3.6-plus-free", "mistral-large-2"],
    domain: "Folktales, Tavern Ballads, Cultural Superstitions & Idioms",
    rationale:
      "Weaves organic world atmosphere through folk songs, regional superstitions, campfire legends, nursery rhymes, and idiomatic expressions across distinct cultures.",
    category: "folklore",
  },
  {
    id: "council-scribe",
    name: "The Polyphonic Council Scribe",
    guardian: "Ino",
    gate: "Unity",
    frequency: "963 Hz",
    model: "qwen-3.6-plus-free",
    fallbackModels: ["claude-sonnet-4", "kimi-k2.5-free"],
    domain: "Faction Summits, Peace Treaties, Council Debates & Ensemble Casts",
    rationale:
      "Coordinates multi-faction summits and diplomatic arguments. Balances divergent political agendas so every high-table lord speaks with clear ideological distinctiveness.",
    category: "councils",
  },
  {
    id: "genesis-oracle",
    name: "The Primordial Genesis Oracle",
    guardian: "Shinkami",
    gate: "Source",
    frequency: "1111 Hz",
    model: "claude-opus-4",
    fallbackModels: ["deepseek-r1", "gemini-2.0-pro"],
    domain: "Primordial Cosmology, Lumina and Nero Duality, Metaphysics",
    rationale:
      "Explores the highest metaphysical layer of existence: the primordial dance of First Light (Lumina) and the Deep Unknown (Nero), divine covenants, and origin of reality.",
    category: "cosmology",
  },
];

// ---------------------------------------------------------------------------
// Weekly Updates
// ---------------------------------------------------------------------------

export const MODEL_WEEKLY_UPDATES: ModelWeeklyUpdate[] = [
  {
    weekOf: "2026-04-14",
    models: [
      "qwen-3.6-plus-free",
      "minimax-m2.5-free",
      "glm-4.7-free",
      "kimi-k2.5-free",
      "big-pickle-free",
      "gpt-5-nano-free",
      "nemotron-3-super-free",
      "mimo-v2-pro-free",
    ],
    notes:
      "Arcanea Model Arena evolved to full Worldbuilding & High Fantasy Intelligence. Claude Sonnet 3.7 / 4 awarded the Editor’s Choice for supreme prose lyricism (99) and anti-slop mastery. Gemini 2.0 Pro awarded Best Lore Vault for 1M-token context retention (99). DeepSeek R1 recognized as Grand Enchanter for hard magic logic (99). 8 models continue running 100% free on Zen routing, led by Qwen 3.6 Plus (1M context) and MiniMax M2.5 (kinetic combat choreography).",
    newAdditions: ["claude-sonnet-4", "deepseek-r1", "mistral-large-2"],
    removals: [],
  },
];

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/** Look up a model by its unique ID. Returns undefined if not found. */
export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((m) => m.id === id);
}

/** Get all models in a given category. */
export function getModelsByCategory(category: AIModel["category"]): AIModel[] {
  return AI_MODELS.filter((m) => m.category === category);
}

/** Get all models that are free (both input and output pricing is "free"). */
export function getFreeModels(): AIModel[] {
  return AI_MODELS.filter(
    (m) => m.pricing.input === "free" && m.pricing.output === "free",
  );
}

/** Get all curated best models that have an active Arcanea award. */
export function getCuratedBestModels(): AIModel[] {
  return AI_MODELS.filter((m) => m.curatedAward !== undefined);
}

/** Get all models resonating with a specific Arcanean Gate. */
export function getModelsByGate(gate: ArcaneanGateName): AIModel[] {
  return AI_MODELS.filter((m) => m.gateResonance === gate);
}

/** Get all models sorted by composite WorldCraft score descending. */
export function getModelsSortedByWorldCraft(): AIModel[] {
  return [...AI_MODELS].sort((a, b) => b.worldCraftScore - a.worldCraftScore);
}

/** Get all image generation models. */
export function getImageModels(): ImageModel[] {
  return IMAGE_MODELS;
}

/** Look up an image model by its unique ID. */
export function getImageModelById(id: string): ImageModel | undefined {
  return IMAGE_MODELS.find((m) => m.id === id);
}

/** Get all Arcanean workflows that use a given model (primary or fallback). */
export function getWorkflowsForModel(modelId: string): ArcaneanWorkflow[] {
  return ARCANEAN_WORKFLOWS.filter(
    (w) => w.model === modelId || w.fallbackModels.includes(modelId),
  );
}
