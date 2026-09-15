import type { AIModel } from "@/lib/models-data";

export interface LiveModelSummary {
  id: string;
  name: string;
  provider: string;
  context_length: number;
  pricing_prompt_per_mtok: number;
  pricing_completion_per_mtok: number;
  is_free: boolean;
  max_completion: number;
  modality: string;
  description: string;
}

/**
 * A model as the explorer shows it. Rating fields are null for every model that has not been
 * reviewed by hand: the page presents WorldCraft scores as editorial ratings, so nothing may
 * derive one from context length or price.
 */
export interface ExplorerModel {
  id: string;
  name: string;
  provider: string;
  providerLogo: string;
  contextWindow: number;
  inputPrice: number;
  outputPrice: number;
  isFree: boolean;
  speed: number | null;
  worldCraftScore: number | null;
  proseQuality: number | null;
  loreMemory: number | null;
  magicLogic: number | null;
  characterVoice: number | null;
  gateResonance: string | null;
  gateFrequency: string | null;
  guardian: string | null;
  curatedRole: string;
  curatedAward?: string;
  worldbuildingSweetSpot: string;
  slopResistance: "S" | "A" | "B" | "C" | null;
  category: string;
  tags: string[];
  description: string;
}

export function fromCurated(m: AIModel): ExplorerModel {
  return {
    id: m.id,
    name: m.name,
    provider: m.provider,
    providerLogo: m.providerLogo,
    contextWindow: m.contextWindow,
    inputPrice: typeof m.pricing.input === "number" ? m.pricing.input : 0,
    outputPrice: typeof m.pricing.output === "number" ? m.pricing.output : 0,
    isFree: m.pricing.input === "free",
    speed: m.speed,
    worldCraftScore: m.worldCraftScore,
    proseQuality: m.proseQuality,
    loreMemory: m.loreMemory,
    magicLogic: m.magicLogic,
    characterVoice: m.characterVoice,
    gateResonance: m.gateResonance,
    gateFrequency: m.gateFrequency,
    guardian: m.guardian,
    curatedRole: m.curatedRole,
    curatedAward: m.curatedAward,
    worldbuildingSweetSpot: m.worldbuildingSweetSpot,
    slopResistance: m.slopResistance,
    category: m.category,
    tags: m.tags,
    description: m.strengths[0] || "",
  };
}

export function fromLive(lm: LiveModelSummary): ExplorerModel {
  return {
    id: lm.id,
    name: lm.name,
    provider: lm.provider,
    providerLogo: "🌐",
    contextWindow: lm.context_length,
    inputPrice: lm.pricing_prompt_per_mtok,
    outputPrice: lm.pricing_completion_per_mtok,
    isFree: lm.is_free,
    speed: null,
    worldCraftScore: null,
    proseQuality: null,
    loreMemory: null,
    magicLogic: null,
    characterVoice: null,
    gateResonance: null,
    gateFrequency: null,
    guardian: null,
    curatedRole: `${lm.provider} · not yet reviewed`,
    worldbuildingSweetSpot:
      lm.description || "Available via the OpenRouter live catalog.",
    slopResistance: null,
    category: lm.is_free ? "free-tier" : "frontier",
    tags: ["openrouter", lm.modality],
    description: lm.description,
  };
}

function isTracked(lm: LiveModelSummary, known: ExplorerModel[]): boolean {
  return known.some(
    (r) =>
      r.id === lm.id ||
      lm.id.endsWith(`/${r.id}`) ||
      r.name.toLowerCase() === lm.name.toLowerCase(),
  );
}

export function mergeExplorerModels(
  curated: AIModel[],
  live: LiveModelSummary[],
): ExplorerModel[] {
  const result = curated.map(fromCurated);
  for (const lm of live) {
    if (lm.context_length >= 32_000 && !isTracked(lm, result)) {
      result.push(fromLive(lm));
    }
  }
  return result;
}

/** Descending by rating; unrated models always sort after rated ones. */
export function byRatingDesc(a: number | null, b: number | null): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return b - a;
}
