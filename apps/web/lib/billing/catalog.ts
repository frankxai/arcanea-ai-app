/**
 * Arcanea Billing Catalog — the single source of truth for commerce.
 *
 * Every price, plan, credit pack, action cost and entitlement that the product
 * shows or enforces comes from this file. The pricing page renders it, the API
 * enforces it, the webhook maps Polar products back to it, and the MCP server
 * will read the same numbers. Nothing else in the repo may hard-code a price.
 *
 * Model (decided 2026-10-05, see docs/strategy/ARCANEA_REVENUE_ARCHITECTURE_2026-10-05.md):
 *
 *   1. BYOK is free, forever. Reading the Library and the canon is free, forever.
 *   2. A plan buys continuity: hosted world graph, memory, publishing, seats, API.
 *   3. Credits buy compute on Arcanea-managed keys. 1 credit ≈ €0.01 of provider
 *      cost at list price. Credits never expire. Nothing paid is "unlimited".
 *
 * Currency is EUR because Polar (merchant of record) settles EU VAT for us and the
 * seller is Netherlands-based. Prices are tax-inclusive consumer prices.
 */

export type PlanId = "spark" | "creator" | "studio";

export type ActionId =
  | "chat.standard"
  | "chat.frontier"
  | "image.standard"
  | "image.premium"
  | "video.clip"
  | "music.track"
  | "voice.minute"
  | "world.export";

export interface Plan {
  id: PlanId;
  name: string;
  /** Monthly price in euro cents, tax inclusive. 0 for the free plan. */
  priceCents: number;
  /** Credits granted at the start of every billing cycle. */
  monthlyCredits: number;
  tagline: string;
  features: string[];
  /** Polar product id env var. Empty for the free plan. */
  polarProductEnv: "" | "POLAR_PRODUCT_CREATOR" | "POLAR_PRODUCT_STUDIO";
  featured?: boolean;
}

export interface CreditPack {
  id: "pack-500" | "pack-2500" | "pack-8000";
  credits: number;
  priceCents: number;
  polarProductEnv:
    | "POLAR_PRODUCT_PACK_500"
    | "POLAR_PRODUCT_PACK_2500"
    | "POLAR_PRODUCT_PACK_8000";
  popular?: boolean;
}

export interface ActionCost {
  id: ActionId;
  credits: number;
  label: string;
  unit: string;
}

export const WELCOME_CREDITS = 25;

export const PLANS: readonly Plan[] = [
  {
    id: "spark",
    name: "Spark",
    priceCents: 0,
    monthlyCredits: 0,
    tagline: "Bring your own keys. Read everything. Build locally.",
    features: [
      "Bring your own key for chat and worlds; BYOK images are planned",
      "The whole Library of Arcanea, open",
      "Arcanea MCP server and skills, open source",
      "Local Markdown and JSON exports",
      `${WELCOME_CREDITS} welcome credits to try managed generation`,
    ],
    polarProductEnv: "",
  },
  {
    id: "creator",
    name: "Creator",
    priceCents: 1900,
    monthlyCredits: 1500,
    tagline: "Your world keeps its memory. Publish it under your name.",
    features: [
      "Everything in Spark",
      "Hosted world graph with continuity memory across sessions",
      "One published world site with your canon, characters and chapters",
      "1,500 credits every month for managed image, voice and model runs",
      "Priority generation queue",
    ],
    polarProductEnv: "POLAR_PRODUCT_CREATOR",
    featured: true,
  },
  {
    id: "studio",
    name: "Studio",
    priceCents: 7900,
    monthlyCredits: 8000,
    tagline: "A team, an API key, and room for a franchise.",
    features: [
      "Everything in Creator",
      "Five seats with shared worlds and roles",
      "Unlimited published world sites",
      "8,000 credits every month, pooled across the team",
      "Arcanea API key and hosted MCP write tools",
    ],
    polarProductEnv: "POLAR_PRODUCT_STUDIO",
  },
] as const;

export const CREDIT_PACKS: readonly CreditPack[] = [
  {
    id: "pack-500",
    credits: 500,
    priceCents: 500,
    polarProductEnv: "POLAR_PRODUCT_PACK_500",
  },
  {
    id: "pack-2500",
    credits: 2500,
    priceCents: 1900,
    polarProductEnv: "POLAR_PRODUCT_PACK_2500",
    popular: true,
  },
  {
    id: "pack-8000",
    credits: 8000,
    priceCents: 4900,
    polarProductEnv: "POLAR_PRODUCT_PACK_8000",
  },
] as const;

/**
 * Credit cost per unit of work on Arcanea-managed keys. BYOK requests cost 0.
 * Costs are set from provider list prices with roughly 2x headroom, so the
 * contribution margin on credits stays above 50% even when the premium model
 * is chosen. Re-price here, never in a route.
 */
export const ACTION_COSTS: readonly ActionCost[] = [
  {
    id: "chat.standard",
    credits: 1,
    label: "Chat message, standard model",
    unit: "message",
  },
  {
    id: "chat.frontier",
    credits: 5,
    label: "Chat message, frontier model",
    unit: "message",
  },
  {
    id: "image.standard",
    credits: 10,
    label: "Image, standard model",
    unit: "image",
  },
  {
    id: "image.premium",
    credits: 25,
    label: "Image, premium model",
    unit: "image",
  },
  {
    id: "video.clip",
    credits: 150,
    label: "Video clip, up to 5 seconds",
    unit: "clip",
  },
  {
    id: "music.track",
    credits: 60,
    label: "Music track, up to 3 minutes",
    unit: "track",
  },
  { id: "voice.minute", credits: 2, label: "Voice synthesis", unit: "minute" },
  {
    id: "world.export",
    credits: 0,
    label: "World export, any format",
    unit: "export",
  },
] as const;

export type SkuId = PlanId | CreditPack["id"];

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function getPack(id: string): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.id === id);
}

export function getActionCost(id: ActionId): number {
  const cost = ACTION_COSTS.find((a) => a.id === id);
  if (!cost) throw new Error(`Unknown billing action: ${id}`);
  return cost.credits;
}

/** Total credits for `count` units of an action. Rejects non-positive counts. */
export function costFor(action: ActionId, count = 1): number {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`Invalid unit count for ${action}: ${count}`);
  }
  return getActionCost(action) * count;
}

export function formatEuro(cents: number): string {
  if (cents === 0) return "€0";
  const euros = cents / 100;
  return Number.isInteger(euros) ? `€${euros}` : `€${euros.toFixed(2)}`;
}

export function isPaidSku(sku: string): sku is Exclude<SkuId, "spark"> {
  return (
    sku !== "spark" &&
    (getPlan(sku) !== undefined || getPack(sku) !== undefined)
  );
}

/** Resolve a Polar product id back to the SKU it represents using the env mapping. */
export function skuForPolarProduct(
  productId: string | null | undefined,
  env: Record<string, string | undefined> = process.env,
): SkuId | null {
  if (!productId) return null;
  for (const plan of PLANS) {
    if (plan.polarProductEnv && env[plan.polarProductEnv] === productId)
      return plan.id;
  }
  for (const pack of CREDIT_PACKS) {
    if (env[pack.polarProductEnv] === productId) return pack.id;
  }
  return null;
}

/** Resolve a SKU to its Polar product id, or null when the env is not configured. */
export function polarProductForSku(
  sku: string,
  env: Record<string, string | undefined> = process.env,
): string | null {
  const plan = getPlan(sku);
  if (plan)
    return plan.polarProductEnv ? (env[plan.polarProductEnv] ?? null) : null;
  const pack = getPack(sku);
  if (pack) return env[pack.polarProductEnv] ?? null;
  return null;
}

/**
 * Billing is live only when Polar can be called and both paid plans have
 * product ids. Packs may lag behind plans; the pricing page hides what is
 * not configured instead of showing a button that cannot work.
 */
export function billingReadiness(
  env: Record<string, string | undefined> = process.env,
) {
  const hasToken = Boolean(env.POLAR_ACCESS_TOKEN?.trim());
  const enabled = env.ARCANEA_BILLING_ENABLED === "true";
  const hasWebhook = Boolean(env.POLAR_WEBHOOK_SECRET?.trim());
  const plansReady = PLANS.filter((p) => p.polarProductEnv).every((p) =>
    Boolean(env[p.polarProductEnv]?.trim()),
  );
  const packsReady = CREDIT_PACKS.filter((p) =>
    Boolean(env[p.polarProductEnv]?.trim()),
  ).map((p) => p.id);
  return {
    live: enabled && hasToken && hasWebhook && plansReady,
    enabled,
    hasToken,
    hasWebhook,
    plansReady,
    packsReady,
    sandbox: env.POLAR_SERVER === "sandbox",
  };
}

/** Feature entitlements by plan. The UI and API both read from here. */
export const ENTITLEMENTS: Record<
  PlanId,
  {
    hostedWorlds: number | "unlimited";
    publishedSites: number | "unlimited";
    seats: number;
    apiKeys: boolean;
    hostedMcpWrite: boolean;
    priorityQueue: boolean;
  }
> = {
  spark: {
    hostedWorlds: 1,
    publishedSites: 0,
    seats: 1,
    apiKeys: false,
    hostedMcpWrite: false,
    priorityQueue: false,
  },
  creator: {
    hostedWorlds: "unlimited",
    publishedSites: 1,
    seats: 1,
    apiKeys: false,
    hostedMcpWrite: false,
    priorityQueue: true,
  },
  studio: {
    hostedWorlds: "unlimited",
    publishedSites: "unlimited",
    seats: 5,
    apiKeys: true,
    hostedMcpWrite: true,
    priorityQueue: true,
  },
};
