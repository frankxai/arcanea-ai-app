import { z } from "zod";

/**
 * Arcanea Rights Manifest — v0 (draft)
 *
 * Machine-readable record of who made an asset, how it was made, what rights
 * are claimed, what is licensed to whom, and what evidence backs each claim.
 *
 * Non-claims (by design):
 * - A token is not copyright. On-chain registration is an optional pointer, not proof of
 *   originality or legal ownership.
 * - A licence to sell AI output is not copyright in that output. Purely AI-generated material
 *   is treated as having no copyright claim (US Copyright Office Part 2, Jan 2025; EU case law
 *   summarised by EPRS, Oct 2026). The schema forces this to be stated, not assumed.
 * - This package validates structure and internal consistency. It is not legal advice and does
 *   not replace counsel review, which is a required field for commercial activation.
 */

export const RIGHTS_MANIFEST_SCHEMA_ID = "arcanea.rights_manifest.v0" as const;

export const ONCHAIN_DISCLAIMER =
  "A token is a pointer to this manifest and to the benefits listed in it. It is not copyright, it is not proof of originality, and it does not by itself transfer or prove ownership of any underlying work." as const;

const isoDateTime = z.iso.datetime({ offset: true });
const sha256Hex = z
  .string()
  .regex(/^[a-f0-9]{64}$/i, "expected a 64-character hex SHA-256 digest");
const percent = z.number().min(0).max(100);
const uri = z.string().min(1);

export const AssetKind = z.enum([
  "image",
  "video",
  "audio",
  "music",
  "text",
  "3d",
  "game-asset",
  "interactive",
  "bundle",
  "collection",
  "other",
]);

/**
 * Canon status of the asset inside the Arcanea world.
 * - official-canon: ruled canon by a human with an approval receipt (RM012).
 * - proposed-canon: submitted for the canon ruling; not yet decided. Cannot ship as approved.
 * - community / experimental: outside canon by design.
 */
export const CanonStatus = z.enum([
  "official-canon",
  "proposed-canon",
  "community",
  "experimental",
  "not-applicable",
]);

export const ManifestStatus = z.enum([
  "draft",
  "review",
  "approved",
  "revoked",
  "disputed",
]);

export const ContentHash = z.object({
  algorithm: z.literal("sha256"),
  value: sha256Hex,
});

export const SourceFile = z.object({
  uri,
  role: z.enum([
    "master",
    "derivative",
    "preview",
    "source-material",
    "documentation",
  ]),
  mimeType: z.string().optional(),
  bytes: z.number().int().nonnegative().optional(),
  hash: ContentHash.optional(),
});

export const VersionEntry = z.object({
  version: z.string().min(1),
  at: isoDateTime,
  note: z.string().optional(),
  hash: ContentHash.optional(),
});

export const Asset = z.object({
  assetId: z.string().min(1),
  title: z.string().min(1),
  kind: AssetKind,
  description: z.string().optional(),
  contentHash: ContentHash.optional(),
  sourceFiles: z.array(SourceFile).default([]),
  versionHistory: z.array(VersionEntry).default([]),
  parentAssetIds: z.array(z.string().min(1)).default([]),
  canonStatus: CanonStatus.default("not-applicable"),
});

export const CreatorRole = z.enum([
  "author",
  "co-author",
  "commissioner",
  "performer",
  "curator",
  "editor",
  "prompt-author",
  "engineer",
  "other",
]);

export const Creator = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  role: CreatorRole,
  legalEntity: z.string().optional(),
  verified: z.boolean().default(false),
  /** Share of creator-side revenue, 0..100. Optional; when present, shares must sum to <= 100. */
  sharePercent: percent.optional(),
});

export const HumanContribution = z.enum([
  "none",
  "minimal",
  "substantial",
  "full",
]);
export const AiInvolvement = z.enum([
  "none",
  "assistive",
  "generative-with-human-direction",
  "fully-generated",
]);

export const TriState = z.union([z.boolean(), z.literal("unknown")]);

export const AiTool = z.object({
  provider: z.string().min(1),
  model: z.string().optional(),
  version: z.string().optional(),
  /** Plan or licence under which the tool was used, e.g. "Pro (paid)". */
  planOrLicense: z.string().optional(),
  /** Whether the provider's terms permit commercial use of the output under that plan. */
  commercialUseAllowed: TriState,
  termsUrl: z.string().optional(),
  termsCheckedAt: isoDateTime.optional(),
  generation: z
    .object({
      promptHash: sha256Hex.optional(),
      seed: z.union([z.string(), z.number()]).optional(),
      parameters: z.record(z.string(), z.unknown()).optional(),
      jobRef: z.string().optional(),
    })
    .optional(),
});

export const MachineReadableMark = z.enum([
  "c2pa",
  "synthid",
  "both",
  "none",
  "other",
]);

export const Disclosure = z.object({
  /** Must be true whenever AI contributed to the expressive content. */
  required: z.boolean(),
  /** Plain-language label shown with the asset, e.g. "Made with AI image tools, directed and curated by Frank Riemer". */
  label: z.string().optional(),
  machineReadableMark: MachineReadableMark.default("none"),
  c2paManifestRef: z.string().optional(),
  /** Basis for the disclosure requirement, e.g. "EU AI Act Art. 50 (applies from 2026-08-02); estate AI-disclosure standard". */
  basis: z.string().optional(),
});

export const Authorship = z.object({
  humanContribution: HumanContribution,
  aiInvolvement: AiInvolvement,
  /** Human-authorship documentation: what humans decided, selected, arranged, wrote, edited. */
  description: z.string().min(1),
  aiTools: z.array(AiTool).default([]),
  disclosure: Disclosure,
});

export const SourceMaterialKind = z.enum([
  "own-work",
  "public-domain",
  "licensed",
  "cc-licensed",
  "fair-use-claim",
  "unknown",
]);

export const SourceMaterial = z.object({
  description: z.string().min(1),
  kind: SourceMaterialKind,
  licenseRef: z.string().optional(),
  permissionEvidenceRef: z.string().optional(),
  rightsHolder: z.string().optional(),
});

export const ThirdPartyPermission = z.object({
  party: z.string().min(1),
  scope: z.string().min(1),
  evidenceRef: z.string().min(1),
  grantedAt: isoDateTime.optional(),
  expiresAt: isoDateTime.optional(),
});

export const CopyrightClaim = z.enum([
  "claimed",
  "partial",
  "unclaimed",
  "uncertain",
]);

export const Trademark = z.object({
  mark: z.string().min(1),
  owner: z.string().min(1),
  status: z.enum(["unregistered", "applied", "registered", "unknown"]),
  registrationRef: z.string().optional(),
});

export const Ownership = z.object({
  copyrightClaim: CopyrightClaim,
  claimant: z.string().optional(),
  /** Why the claim is what it is, e.g. "human-authored text and arrangement; AI image elements unclaimed". */
  basis: z.string().optional(),
  jurisdictionNotes: z.string().optional(),
  trademarks: z.array(Trademark).default([]),
});

export const Permission = z.enum(["allowed", "conditional", "prohibited"]);

export const PermissionSet = z.object({
  personalUse: Permission,
  commercialUse: Permission,
  derivatives: Permission,
  redistribution: Permission,
  publicDisplay: Permission,
  interactiveUse: Permission,
  sync: Permission,
  sublicensing: Permission,
  /** Explicit by design: silence is not consent for AI training. */
  aiTraining: Permission,
});

export const LicenseeKind = z.enum([
  "public",
  "purchaser",
  "token-holder",
  "named-party",
  "platform",
]);

export const Exclusivity = z.enum(["non-exclusive", "sole", "exclusive"]);

export const Duration = z.discriminatedUnion("type", [
  z.object({ type: z.literal("perpetual") }),
  z.object({ type: z.literal("until-revoked") }),
  z.object({ type: z.literal("fixed"), endsAt: isoDateTime }),
]);

export const RevenueShare = z.object({
  partyId: z.string().min(1),
  percent,
  basis: z.enum(["gross", "net"]).default("net"),
});

export const AgreementText = z.object({
  uri,
  hash: ContentHash.optional(),
  language: z.string().default("en"),
  version: z.string().min(1),
});

export const Acceptance = z.object({
  acceptedBy: z.string().min(1),
  at: isoDateTime,
  method: z.enum([
    "click-through",
    "signature",
    "onchain-signature",
    "email",
    "other",
  ]),
  evidenceRef: z.string().min(1),
});

export const FeeModel = z.enum([
  "free",
  "one-time",
  "subscription",
  "royalty",
  "revenue-share",
  "other",
]);

export const LicenseGrant = z.object({
  licenseId: z.string().min(1),
  /** Template id from the licence registry, e.g. "arcanea.personal.v0". */
  templateId: z.string().min(1),
  templateVersion: z.string().min(1),
  licensee: LicenseeKind,
  licenseeRef: z.string().optional(),
  permissions: PermissionSet,
  exclusivity: Exclusivity,
  /** ISO 3166-1 alpha-2 codes, or ["WW"] for worldwide. */
  territories: z.array(z.string().regex(/^[A-Z]{2}$/)).min(1),
  duration: Duration,
  attribution: z.object({
    required: z.boolean(),
    text: z.string().optional(),
  }),
  feeModel: FeeModel,
  revenueShare: z.array(RevenueShare).default([]),
  revocation: z.object({
    revocable: z.boolean(),
    conditions: z.array(z.string()).default([]),
  }),
  status: z
    .enum(["proposed", "active", "expired", "revoked"])
    .default("proposed"),
  agreementText: AgreementText,
  acceptance: z.array(Acceptance).default([]),
  conditions: z.array(z.string()).default([]),
});

export const OnchainStandard = z.enum([
  "ERC-721",
  "ERC-1155",
  "ERC-721C",
  "ERC-1155C",
  "other",
]);

export const OnchainRegistration = z.object({
  chainId: z.number().int().positive(),
  network: z.string().min(1),
  standard: OnchainStandard,
  contract: z.string().min(1),
  tokenId: z.string().optional(),
  /** EIP-2981 royalty hint in basis points. Signals intent only; enforcement depends on the venue. */
  royaltyBps: z.number().int().min(0).max(10000).optional(),
  /** Where the licence terms live for this token (contract-level or token-level URI). */
  licenseUri: z.string().optional(),
  deployment: z.enum(["none", "testnet", "mainnet"]).default("none"),
  note: z.string().optional(),
});

export const Onchain = z.object({
  registrations: z.array(OnchainRegistration).default([]),
  disclaimer: z.literal(ONCHAIN_DISCLAIMER),
});

export const Dispute = z.object({
  id: z.string().min(1),
  type: z.enum([
    "takedown",
    "infringement-claim",
    "ownership-dispute",
    "licence-breach",
    "other",
  ]),
  status: z.enum(["open", "under-review", "resolved", "rejected"]),
  openedAt: isoDateTime,
  resolvedAt: isoDateTime.optional(),
  evidenceRef: z.string().min(1),
  summary: z.string().optional(),
});

export const Review = z.object({
  /** Qualified legal counsel has reviewed the commercial agreements referenced by this manifest. */
  counselReviewed: z.boolean(),
  counselRef: z.string().optional(),
  reviewedAt: isoDateTime.optional(),
  /** Reference to the human approval receipt (see arcanea-ai-app issue #277). */
  humanApprovalReceiptRef: z.string().optional(),
  notes: z.string().optional(),
});

export const RightsManifest = z.object({
  schema: z.literal(RIGHTS_MANIFEST_SCHEMA_ID),
  manifestId: z.string().min(1),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
  status: ManifestStatus,
  asset: Asset,
  creators: z.array(Creator).min(1),
  authorship: Authorship,
  sourceMaterial: z.array(SourceMaterial).default([]),
  thirdPartyPermissions: z.array(ThirdPartyPermission).default([]),
  ownership: Ownership,
  licenses: z.array(LicenseGrant).default([]),
  onchain: Onchain.optional(),
  disputes: z.array(Dispute).default([]),
  review: Review,
  /** Free-form, non-normative notes. Never used for validation. */
  notes: z.string().optional(),
});

export type RightsManifest = z.infer<typeof RightsManifest>;
export type RightsManifestInput = z.input<typeof RightsManifest>;
export type LicenseGrant = z.infer<typeof LicenseGrant>;
export type PermissionSet = z.infer<typeof PermissionSet>;
export type Permission = z.infer<typeof Permission>;
export type AiTool = z.infer<typeof AiTool>;
export type Creator = z.infer<typeof Creator>;
export type Asset = z.infer<typeof Asset>;
export type OnchainRegistration = z.infer<typeof OnchainRegistration>;
