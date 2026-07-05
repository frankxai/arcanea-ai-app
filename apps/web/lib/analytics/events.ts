/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { track } from "@vercel/analytics";

type AnalyticsPayload = Record<string, unknown>;
type VercelAnalyticsPayload = Record<string, string | number | boolean | null | undefined>;
type HomepageGenesisSource =
  | "hero_enter"
  | "hero_send"
  | "starter_card"
  | "final_cta";
type GenesisProofExportAction = "proof_id_created" | "brief_downloaded";
type StorePackageAction =
  | "buy_with_credits"
  | "mint_onchain"
  | "stripe_checkout"
  | "stripe_connect"
  | "withdraw_payout";

function promptLengthBucket(promptLength: number) {
  if (promptLength <= 0) return "empty";
  if (promptLength < 80) return "short";
  if (promptLength < 240) return "medium";
  return "long";
}

type PostHogLike = {
  capture: (event: string, properties?: AnalyticsPayload) => void;
  identify: (userId: string, traits?: AnalyticsPayload) => void;
};

function getPosthog(): PostHogLike | null {
  if (typeof window === 'undefined') return null;

  const candidate = (window as Window & { posthog?: PostHogLike }).posthog;
  if (!candidate) return null;

  return candidate;
}

function toVercelPayload(properties?: AnalyticsPayload): VercelAnalyticsPayload | undefined {
  if (!properties) return undefined;

  return Object.fromEntries(
    Object.entries(properties).filter((entry): entry is [string, string | number | boolean | null | undefined] => {
      const value = entry[1];
      return value === null || value === undefined || ["string", "number", "boolean"].includes(typeof value);
    }),
  );
}

function capture(event: string, properties?: AnalyticsPayload) {
  try {
    getPosthog()?.capture(event, properties);
  } catch {
    // Analytics must never break product flows.
  }

  try {
    track(event, toVercelPayload(properties));
  } catch {
    // Vercel Analytics throws in unsupported runtimes or invalid development states.
  }
}

function identifyUser(userId: string, traits?: AnalyticsPayload) {
  getPosthog()?.identify(userId, traits);
}

export const analytics = {
  // Chat events
  chatSent: (luminorId?: string) => capture("chat_sent", { luminor: luminorId }),
  chatCreationSaved: (type: string) => capture("creation_saved_from_chat", { type }),
  projectSelected: (projectId: string | null) => capture("project_selected", { projectId }),
  projectCreated: (projectId: string) => capture("project_created", { projectId }),
  projectSessionLinked: (projectId: string | null, sessionId: string) =>
    capture("project_session_linked", { projectId, sessionId }),

  // Imagine events
  imageGenerated: (model?: string) => capture("image_generated", { model }),
  imageSaved: () => capture("image_saved"),

  // Creation events
  creationSaved: (type: string) => capture("creation_saved", { type }),
  creationShared: (method: string) => capture("creation_shared", { method }),

  // Community events
  creatorFollowed: () => capture("creator_followed"),
  discussionCreated: () => capture("discussion_created"),

  // Academy events
  courseStarted: (courseSlug: string) => capture("course_started", { course: courseSlug }),
  gateUnlocked: (gate: string) => capture("gate_unlocked", { gate }),

  // Auth events
  signedUp: (method: string) => capture("signed_up", { method }),
  signedIn: (method: string) => capture("signed_in", { method }),

  // Credit events
  creditsPurchased: (amount: number) => capture("credits_purchased", { amount }),
  creditsSpent: (action: string, cost: number) => capture("credits_spent", { action, cost }),

  // Library events
  textRead: (collection: string, text: string) => capture("text_read", { collection, text }),

  // Engagement
  pageViewed: (page: string) => capture("page_viewed", { page }),
  featureUsed: (feature: string) => capture("feature_used", { feature }),

  // Arcanea activation funnel. Never send raw prompt, wallet, API key, or proof body content.
  homepageGenesisCtaClick: (
    source: HomepageGenesisSource,
    properties?: {
      promptLength?: number;
      starterLabel?: string;
      destination?: string;
    },
  ) =>
    capture("homepage_genesis_cta_click", {
      source,
      hasPrompt: Boolean(properties?.promptLength && properties.promptLength > 0),
      promptLengthBucket: promptLengthBucket(properties?.promptLength ?? 0),
      starterLabel: properties?.starterLabel,
      destination: properties?.destination ?? "/genesis",
    }),
  genesisPromptPrefillUsed: (properties: { source?: string | null; promptLength: number }) =>
    capture("genesis_prompt_prefill_used", {
      source: properties.source ?? "url",
      promptLengthBucket: promptLengthBucket(properties.promptLength),
    }),
  genesisProofExport: (
    action: GenesisProofExportAction,
    properties?: {
      driftFace?: string;
      missionLane?: string;
      repoFileCount?: number;
      status?: "success" | "error";
    },
  ) =>
    capture("genesis_proof_export", {
      action,
      driftFace: properties?.driftFace,
      missionLane: properties?.missionLane,
      repoFileCount: properties?.repoFileCount,
      status: properties?.status ?? "success",
    }),
  atlasCreaturePromptCopy: (properties: {
    slug: string;
    promptKind: "positive" | "negative";
    rightsTier?: string;
    generationPolicy?: string;
  }) => capture("atlas_creature_prompt_copy", properties),
  studioStorePackageClick: (
    action: StorePackageAction,
    properties?: {
      packageId?: string;
      packageType?: string;
      priceCredits?: number;
      priceUsd?: number;
      tab?: "marketplace" | "credits" | "developer";
    },
  ) =>
    capture("studio_store_package_click", {
      action,
      packageId: properties?.packageId,
      packageType: properties?.packageType,
      priceCredits: properties?.priceCredits,
      priceUsd: properties?.priceUsd,
      tab: properties?.tab,
    }),

  // User identification
  identify: (userId: string, traits?: Record<string, unknown>) => identifyUser(userId, traits),
};

export { promptLengthBucket };
