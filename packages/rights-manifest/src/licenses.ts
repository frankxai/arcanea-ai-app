import type { Permission, PermissionSet } from "./schema.ts";

/**
 * Licence template registry — v0 (draft).
 *
 * Every template is a ceiling: a licence grant that uses the template may be *more* restrictive
 * than the template on any permission, never more permissive. Human-readable agreement text is
 * authored separately and referenced by URI + hash from each grant. All templates carry
 * `status: 'draft-requires-counsel-review'` until counsel signs them off; the validator refuses
 * to approve commercial grants on templates that have not been reviewed.
 */

export const LICENSE_TEMPLATE_STATUS = [
  "draft-requires-counsel-review",
  "counsel-reviewed",
  "retired",
] as const;
export type LicenseTemplateStatus = (typeof LICENSE_TEMPLATE_STATUS)[number];

export interface LicenseTemplate {
  readonly id: string;
  readonly version: string;
  readonly name: string;
  readonly family:
    | "personal"
    | "commercial"
    | "game-interactive"
    | "music-sync"
    | "derivative-remix"
    | "collaborative-ip"
    | "exclusive-commission"
    | "marketplace-distribution"
    | "token-holder-benefits";
  readonly status: LicenseTemplateStatus;
  /** Plain-language summary a creator or buyer can read in 20 seconds. */
  readonly summary: string;
  /** Maximum permission each grant on this template may carry. */
  readonly ceiling: PermissionSet;
  /** Who this template is designed to be granted to. */
  readonly allowedLicensees: ReadonlyArray<
    "public" | "purchaser" | "token-holder" | "named-party" | "platform"
  >;
  readonly allowedExclusivity: ReadonlyArray<
    "non-exclusive" | "sole" | "exclusive"
  >;
  /** Grant-level fields that must be present for this template. */
  readonly requires: ReadonlyArray<
    | "attributionText"
    | "revenueShare"
    | "namedLicensee"
    | "onchainRegistration"
    | "fixedDuration"
  >;
  /** Things the template deliberately does not do. Shown to buyers. */
  readonly nonClaims: readonly string[];
  readonly notes?: string;
}

const P = {
  allowed: "allowed",
  conditional: "conditional",
  prohibited: "prohibited",
} as const satisfies Record<Permission, Permission>;

const ceiling = (overrides: Partial<PermissionSet>): PermissionSet => ({
  personalUse: P.allowed,
  commercialUse: P.prohibited,
  derivatives: P.prohibited,
  redistribution: P.prohibited,
  publicDisplay: P.conditional,
  interactiveUse: P.prohibited,
  sync: P.prohibited,
  sublicensing: P.prohibited,
  aiTraining: P.prohibited,
  ...overrides,
});

const COMMON_NON_CLAIMS = [
  "Does not transfer copyright in the work.",
  "Does not grant rights in official Arcanea names, marks, characters or canon beyond what the grant lists.",
  "Does not permit use of the work to train or fine-tune AI models unless aiTraining is explicitly allowed.",
] as const;

export const LICENSE_TEMPLATES: readonly LicenseTemplate[] = [
  {
    id: "arcanea.personal.v0",
    version: "0.1.0",
    name: "Personal Use Licence",
    family: "personal",
    status: "draft-requires-counsel-review",
    summary:
      "Download, display and enjoy the work privately. No resale, no commercial use, no derivatives, no redistribution.",
    ceiling: ceiling({ personalUse: P.allowed, publicDisplay: P.conditional }),
    allowedLicensees: ["purchaser", "public"],
    allowedExclusivity: ["non-exclusive"],
    requires: [],
    nonClaims: [...COMMON_NON_CLAIMS],
  },
  {
    id: "arcanea.commercial.v0",
    version: "0.1.0",
    name: "Commercial Use Licence (non-exclusive)",
    family: "commercial",
    status: "draft-requires-counsel-review",
    summary:
      "Use the work in your own commercial projects (print, web, marketing, products) worldwide, non-exclusively. Resale of the file itself and sublicensing stay prohibited.",
    ceiling: ceiling({
      commercialUse: P.allowed,
      derivatives: P.conditional,
      publicDisplay: P.allowed,
      redistribution: P.prohibited,
    }),
    allowedLicensees: ["purchaser", "named-party"],
    allowedExclusivity: ["non-exclusive"],
    requires: [],
    nonClaims: [
      ...COMMON_NON_CLAIMS,
      "Does not warrant that AI-generated elements are protected by copyright anywhere.",
    ],
    notes:
      "Requires every AI tool in the manifest to permit commercial use under the plan actually used.",
  },
  {
    id: "arcanea.game-interactive.v0",
    version: "0.1.0",
    name: "Game & Interactive Media Licence",
    family: "game-interactive",
    status: "draft-requires-counsel-review",
    summary:
      "Embed the asset in games, apps and interactive experiences you publish, including necessary technical adaptations. Standalone redistribution of the asset is prohibited.",
    ceiling: ceiling({
      commercialUse: P.allowed,
      derivatives: P.conditional,
      interactiveUse: P.allowed,
      publicDisplay: P.allowed,
      redistribution: P.prohibited,
    }),
    allowedLicensees: ["purchaser", "named-party"],
    allowedExclusivity: ["non-exclusive", "sole"],
    requires: [],
    nonClaims: [
      ...COMMON_NON_CLAIMS,
      "Does not permit extraction and resale of the asset as a standalone pack.",
    ],
  },
  {
    id: "arcanea.music-sync.v0",
    version: "0.1.0",
    name: "Music Synchronisation Licence",
    family: "music-sync",
    status: "draft-requires-counsel-review",
    summary:
      "Synchronise the recording with picture, games or interactive media for a defined term and territory. Covers the master and composition rights the licensor actually controls.",
    ceiling: ceiling({
      commercialUse: P.allowed,
      sync: P.allowed,
      publicDisplay: P.allowed,
      derivatives: P.conditional,
    }),
    allowedLicensees: ["named-party", "purchaser"],
    allowedExclusivity: ["non-exclusive", "sole", "exclusive"],
    requires: ["fixedDuration"],
    nonClaims: [
      ...COMMON_NON_CLAIMS,
      "Does not cover rights the licensor does not control (e.g. samples, co-writers, performing-rights-society shares).",
      "For AI-generated music, the licensor warrants only the provider-plan rights actually held, not copyright.",
    ],
  },
  {
    id: "arcanea.derivative-remix.v0",
    version: "0.1.0",
    name: "Derivative & Remix Licence",
    family: "derivative-remix",
    status: "draft-requires-counsel-review",
    summary:
      "Create and publish derivative works with attribution. Commercial use of derivatives is conditional on the revenue share recorded in the grant.",
    ceiling: ceiling({
      derivatives: P.allowed,
      commercialUse: P.conditional,
      publicDisplay: P.allowed,
      redistribution: P.conditional,
    }),
    allowedLicensees: ["public", "purchaser", "named-party"],
    allowedExclusivity: ["non-exclusive"],
    requires: ["attributionText"],
    nonClaims: [
      ...COMMON_NON_CLAIMS,
      "Does not make derivative works part of official canon.",
    ],
    notes:
      "Revenue share is required when commercialUse is allowed or conditional.",
  },
  {
    id: "arcanea.collaborative-ip.v0",
    version: "0.1.0",
    name: "Collaborative IP Agreement",
    family: "collaborative-ip",
    status: "draft-requires-counsel-review",
    summary:
      "Named contributors co-create a work and agree contribution shares, decision rights and how the joint work may be licensed onward.",
    ceiling: ceiling({
      commercialUse: P.allowed,
      derivatives: P.allowed,
      publicDisplay: P.allowed,
      redistribution: P.conditional,
      sublicensing: P.conditional,
      interactiveUse: P.allowed,
      sync: P.conditional,
    }),
    allowedLicensees: ["named-party"],
    allowedExclusivity: ["non-exclusive", "sole", "exclusive"],
    requires: ["namedLicensee", "revenueShare"],
    nonClaims: [
      ...COMMON_NON_CLAIMS,
      "Does not decide canon status; canon promotion is a separate, human-approved step.",
    ],
  },
  {
    id: "arcanea.exclusive-commission.v0",
    version: "0.1.0",
    name: "Exclusive Commission",
    family: "exclusive-commission",
    status: "draft-requires-counsel-review",
    summary:
      "A named client commissions a new work and receives exclusive rights for the agreed scope, term and territory. The creator keeps moral rights and portfolio display.",
    ceiling: ceiling({
      commercialUse: P.allowed,
      derivatives: P.allowed,
      publicDisplay: P.allowed,
      redistribution: P.conditional,
      sublicensing: P.conditional,
      interactiveUse: P.allowed,
      sync: P.conditional,
    }),
    allowedLicensees: ["named-party"],
    allowedExclusivity: ["exclusive", "sole"],
    requires: ["namedLicensee"],
    nonClaims: [
      ...COMMON_NON_CLAIMS,
      "Exclusivity covers the commissioned work only, not the creator's style or prior work.",
    ],
  },
  {
    id: "arcanea.marketplace-distribution.v0",
    version: "0.1.0",
    name: "Marketplace Distribution Agreement",
    family: "marketplace-distribution",
    status: "draft-requires-counsel-review",
    summary:
      "The platform may list, preview, deliver and promote the work and issue end-user licences on the creator's behalf. Fees, payouts and takedown terms are recorded in the grant.",
    ceiling: ceiling({
      commercialUse: P.conditional,
      publicDisplay: P.allowed,
      redistribution: P.conditional,
      sublicensing: P.conditional,
    }),
    allowedLicensees: ["platform"],
    allowedExclusivity: ["non-exclusive", "sole"],
    requires: ["revenueShare"],
    nonClaims: [
      ...COMMON_NON_CLAIMS,
      "The platform acquires no ownership and no right to train models on listed works.",
    ],
  },
  {
    id: "arcanea.token-holder-benefits.v0",
    version: "0.1.0",
    name: "Token-Holder Benefits",
    family: "token-holder-benefits",
    status: "draft-requires-counsel-review",
    summary:
      "Holding the token entitles the current holder to the listed benefits (display, access, events, downloads). Benefits travel with the token; copyright does not.",
    ceiling: ceiling({
      personalUse: P.allowed,
      publicDisplay: P.conditional,
      commercialUse: P.prohibited,
    }),
    allowedLicensees: ["token-holder"],
    allowedExclusivity: ["non-exclusive"],
    requires: ["onchainRegistration"],
    nonClaims: [
      ...COMMON_NON_CLAIMS,
      "The token is not an investment, a security, or a share of revenue.",
      "Royalty hints (EIP-2981) signal intent only; most venues treat creator earnings as optional unless enforced at contract level.",
    ],
  },
];

export function getLicenseTemplate(id: string): LicenseTemplate | undefined {
  return LICENSE_TEMPLATES.find((template) => template.id === id);
}

export function listLicenseTemplates(): readonly LicenseTemplate[] {
  return LICENSE_TEMPLATES;
}

const PERMISSION_RANK: Record<Permission, number> = {
  prohibited: 0,
  conditional: 1,
  allowed: 2,
};

/** True when `granted` is at or below `ceiling` for every permission. */
export function withinCeiling(
  granted: PermissionSet,
  ceilingSet: PermissionSet,
): string[] {
  const exceeded: string[] = [];
  for (const key of Object.keys(ceilingSet) as Array<keyof PermissionSet>) {
    if (PERMISSION_RANK[granted[key]] > PERMISSION_RANK[ceilingSet[key]]) {
      exceeded.push(key);
    }
  }
  return exceeded;
}
