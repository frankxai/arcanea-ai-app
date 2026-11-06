import { getLicenseTemplate, withinCeiling } from "./licenses.ts";
import {
  ONCHAIN_DISCLAIMER,
  RightsManifest,
  type LicenseGrant,
} from "./schema.ts";

export type Severity = "error" | "warning";

export interface Finding {
  /** Stable rule code, e.g. "RM002". Tests and UIs key on this, never on the message. */
  readonly code: string;
  readonly severity: Severity;
  readonly path: string;
  readonly message: string;
}

export interface ValidationResult {
  /** True when the document parses and no error-severity finding exists. */
  readonly ok: boolean;
  readonly manifest?: RightsManifest;
  readonly findings: readonly Finding[];
}

const error = (code: string, path: string, message: string): Finding => ({
  code,
  severity: "error",
  path,
  message,
});
const warning = (code: string, path: string, message: string): Finding => ({
  code,
  severity: "warning",
  path,
  message,
});

const grantsCommercial = (grant: LicenseGrant): boolean =>
  grant.permissions.commercialUse !== "prohibited";
const isLive = (grant: LicenseGrant): boolean =>
  grant.status === "proposed" || grant.status === "active";

/**
 * Parse and cross-check a rights manifest.
 *
 * Structural problems come back as RM000 findings (one per Zod issue). Consistency rules are
 * RM001+. Rules are fail-closed: anything that would let an unverified claim reach a buyer is an
 * error, not a warning.
 */
export function validateRightsManifest(input: unknown): ValidationResult {
  const parsed = RightsManifest.safeParse(input);
  if (!parsed.success) {
    const findings = parsed.error.issues.map((issue) =>
      error(
        "RM000",
        issue.path.map(String).join(".") || "(root)",
        issue.message,
      ),
    );
    return { ok: false, findings };
  }

  const m = parsed.data;
  const findings: Finding[] = [];
  const liveGrants = m.licenses.filter(isLive);
  const commercialGrants = liveGrants.filter(grantsCommercial);

  // RM001 — commercial activation needs counsel review and a human approval receipt.
  if (m.status === "approved" && commercialGrants.length > 0) {
    if (!m.review.counselReviewed) {
      findings.push(
        error(
          "RM001",
          "review.counselReviewed",
          "Approved manifests with commercial grants require counsel review before activation.",
        ),
      );
    }
    if (!m.review.humanApprovalReceiptRef) {
      findings.push(
        error(
          "RM001",
          "review.humanApprovalReceiptRef",
          "Approved manifests with commercial grants require a human approval receipt reference.",
        ),
      );
    }
  }

  // RM002 — purely AI-generated material cannot carry a copyright claim.
  if (
    m.authorship.aiInvolvement === "fully-generated" &&
    (m.ownership.copyrightClaim === "claimed" ||
      m.ownership.copyrightClaim === "partial")
  ) {
    findings.push(
      error(
        "RM002",
        "ownership.copyrightClaim",
        'aiInvolvement is "fully-generated"; copyrightClaim must be "unclaimed" or "uncertain". A licence to sell AI output is not copyright in it.',
      ),
    );
  }
  if (
    m.authorship.humanContribution === "none" &&
    m.authorship.aiInvolvement !== "fully-generated"
  ) {
    findings.push(
      error(
        "RM002",
        "authorship",
        'humanContribution "none" is only consistent with aiInvolvement "fully-generated".',
      ),
    );
  }
  if (
    m.authorship.aiInvolvement === "none" &&
    m.authorship.aiTools.length > 0
  ) {
    findings.push(
      error(
        "RM002",
        "authorship.aiTools",
        'aiInvolvement is "none" but AI tools are listed.',
      ),
    );
  }

  // RM003 — any AI involvement requires disclosure.
  if (m.authorship.aiInvolvement !== "none") {
    if (!m.authorship.disclosure.required) {
      findings.push(
        error(
          "RM003",
          "authorship.disclosure.required",
          "AI contributed to this asset; disclosure.required must be true.",
        ),
      );
    }
    if (
      !m.authorship.disclosure.label ||
      m.authorship.disclosure.label.trim().length === 0
    ) {
      findings.push(
        error(
          "RM003",
          "authorship.disclosure.label",
          "AI contributed to this asset; a plain-language disclosure label is required.",
        ),
      );
    }
    if (m.authorship.aiTools.length === 0) {
      findings.push(
        error(
          "RM003",
          "authorship.aiTools",
          "AI contributed to this asset; list the tools used.",
        ),
      );
    }
    if (
      m.authorship.disclosure.machineReadableMark === "none" &&
      m.status !== "draft"
    ) {
      findings.push(
        warning(
          "RM003",
          "authorship.disclosure.machineReadableMark",
          "No machine-readable mark (C2PA/SynthID). Recommended for any published AI-assisted asset.",
        ),
      );
    }
  }

  // RM004 — commercial grants need every AI tool to permit commercial use under the plan actually used.
  if (commercialGrants.length > 0) {
    m.authorship.aiTools.forEach((tool, index) => {
      if (tool.commercialUseAllowed !== true) {
        findings.push(
          error(
            "RM004",
            `authorship.aiTools.${index}.commercialUseAllowed`,
            `Commercial grant present but ${tool.provider}${tool.model ? ` (${tool.model})` : ""} commercial permission is ${String(tool.commercialUseAllowed)}. Verify the provider terms for the plan used and record termsUrl/termsCheckedAt.`,
          ),
        );
      } else if (!tool.termsUrl || !tool.termsCheckedAt) {
        findings.push(
          warning(
            "RM004",
            `authorship.aiTools.${index}`,
            `${tool.provider}: record termsUrl and termsCheckedAt so the commercial permission is auditable.`,
          ),
        );
      }
    });
  } else {
    m.authorship.aiTools.forEach((tool, index) => {
      if (tool.commercialUseAllowed === "unknown") {
        findings.push(
          warning(
            "RM004",
            `authorship.aiTools.${index}.commercialUseAllowed`,
            `${tool.provider}: commercial permission is unverified. Even a personal-use edition is sold commercially by Arcanea; check the provider terms for the plan used and record termsUrl/termsCheckedAt before release.`,
          ),
        );
      }
    });
  }

  // RM005 — exclusivity conflicts.
  const exclusiveGrants = liveGrants.filter(
    (grant) => grant.exclusivity === "exclusive",
  );
  for (const exclusive of exclusiveGrants) {
    if (exclusive.licensee !== "named-party" || !exclusive.licenseeRef) {
      findings.push(
        error(
          "RM005",
          `licenses.${exclusive.licenseId}`,
          'Exclusive grants must name the licensee (licensee "named-party" with licenseeRef).',
        ),
      );
    }
    const conflicts = liveGrants.filter(
      (other) =>
        other.licenseId !== exclusive.licenseId && grantsCommercial(other),
    );
    if (conflicts.length > 0) {
      findings.push(
        error(
          "RM005",
          `licenses.${exclusive.licenseId}`,
          `Exclusive grant coexists with other live commercial grants: ${conflicts.map((grant) => grant.licenseId).join(", ")}.`,
        ),
      );
    }
  }

  // RM006 — shares must add up.
  const creatorShares = m.creators.filter(
    (creator) => creator.sharePercent !== undefined,
  );
  if (creatorShares.length > 0) {
    const sum = creatorShares.reduce(
      (total, creator) => total + (creator.sharePercent ?? 0),
      0,
    );
    if (sum > 100.000001) {
      findings.push(
        error(
          "RM006",
          "creators",
          `Creator sharePercent values sum to ${sum}, which exceeds 100.`,
        ),
      );
    }
    if (creatorShares.length !== m.creators.length) {
      findings.push(
        warning(
          "RM006",
          "creators",
          "Some creators have sharePercent and others do not; record a share for every creator or for none.",
        ),
      );
    }
  }
  for (const grant of m.licenses) {
    const sum = grant.revenueShare.reduce(
      (total, share) => total + share.percent,
      0,
    );
    if (sum > 100.000001) {
      findings.push(
        error(
          "RM006",
          `licenses.${grant.licenseId}.revenueShare`,
          `Revenue shares sum to ${sum}, which exceeds 100.`,
        ),
      );
    }
  }

  // RM007 — on-chain references never imply ownership; token-holder grants need a registration.
  const tokenGrants = liveGrants.filter(
    (grant) => grant.licensee === "token-holder",
  );
  if (tokenGrants.length > 0) {
    if (!m.onchain || m.onchain.registrations.length === 0) {
      findings.push(
        error(
          "RM007",
          "onchain.registrations",
          "Token-holder grants require at least one on-chain registration record.",
        ),
      );
    }
  }
  if (m.onchain) {
    if (m.onchain.disclaimer !== ONCHAIN_DISCLAIMER) {
      findings.push(
        error(
          "RM007",
          "onchain.disclaimer",
          "On-chain section must carry the canonical disclaimer verbatim.",
        ),
      );
    }
    m.onchain.registrations.forEach((registration, index) => {
      if (registration.deployment === "mainnet" && m.status !== "approved") {
        findings.push(
          error(
            "RM007",
            `onchain.registrations.${index}.deployment`,
            "Mainnet registration recorded on a manifest that is not approved.",
          ),
        );
      }
      if (
        registration.royaltyBps !== undefined &&
        registration.royaltyBps > 0 &&
        !registration.note
      ) {
        findings.push(
          warning(
            "RM007",
            `onchain.registrations.${index}.royaltyBps`,
            "Royalty hint set. Add a note that enforcement is venue-dependent (EIP-2981 signals intent only).",
          ),
        );
      }
    });
  }

  // RM008 — unresolved source material blocks commercial approval.
  m.sourceMaterial.forEach((source, index) => {
    if (
      (source.kind === "unknown" || source.kind === "fair-use-claim") &&
      m.status === "approved" &&
      commercialGrants.length > 0
    ) {
      findings.push(
        error(
          "RM008",
          `sourceMaterial.${index}.kind`,
          `Source material "${source.description}" is "${source.kind}"; resolve it before approving commercial grants.`,
        ),
      );
    }
    if (
      (source.kind === "licensed" || source.kind === "cc-licensed") &&
      !source.licenseRef &&
      !source.permissionEvidenceRef
    ) {
      findings.push(
        error(
          "RM008",
          `sourceMaterial.${index}`,
          "Licensed source material needs a licenseRef or permissionEvidenceRef.",
        ),
      );
    }
  });

  // RM009 — grants must sit within their template ceiling and template constraints.
  m.licenses.forEach((grant) => {
    const template = getLicenseTemplate(grant.templateId);
    const path = `licenses.${grant.licenseId}`;
    if (!template) {
      findings.push(
        error(
          "RM009",
          `${path}.templateId`,
          `Unknown licence template "${grant.templateId}".`,
        ),
      );
      return;
    }
    const exceeded = withinCeiling(grant.permissions, template.ceiling);
    if (exceeded.length > 0) {
      findings.push(
        error(
          "RM009",
          `${path}.permissions`,
          `Grant exceeds template ceiling on: ${exceeded.join(", ")}.`,
        ),
      );
    }
    if (!template.allowedLicensees.includes(grant.licensee)) {
      findings.push(
        error(
          "RM009",
          `${path}.licensee`,
          `Template ${template.id} does not allow licensee "${grant.licensee}".`,
        ),
      );
    }
    if (!template.allowedExclusivity.includes(grant.exclusivity)) {
      findings.push(
        error(
          "RM009",
          `${path}.exclusivity`,
          `Template ${template.id} does not allow exclusivity "${grant.exclusivity}".`,
        ),
      );
    }
    if (
      template.requires.includes("attributionText") &&
      (!grant.attribution.required || !grant.attribution.text)
    ) {
      findings.push(
        error(
          "RM009",
          `${path}.attribution`,
          `Template ${template.id} requires attribution text.`,
        ),
      );
    }
    if (
      template.requires.includes("namedLicensee") &&
      (grant.licensee !== "named-party" || !grant.licenseeRef)
    ) {
      findings.push(
        error(
          "RM009",
          `${path}.licensee`,
          `Template ${template.id} requires a named licensee.`,
        ),
      );
    }
    if (
      template.requires.includes("fixedDuration") &&
      grant.duration.type !== "fixed"
    ) {
      findings.push(
        error(
          "RM009",
          `${path}.duration`,
          `Template ${template.id} requires a fixed duration.`,
        ),
      );
    }
    if (
      template.requires.includes("onchainRegistration") &&
      (!m.onchain || m.onchain.registrations.length === 0)
    ) {
      findings.push(
        error(
          "RM009",
          `${path}`,
          `Template ${template.id} requires an on-chain registration record.`,
        ),
      );
    }
    const needsRevenueShare =
      template.requires.includes("revenueShare") ||
      (template.family === "derivative-remix" &&
        grant.permissions.commercialUse !== "prohibited");
    if (needsRevenueShare && grant.revenueShare.length === 0) {
      findings.push(
        error(
          "RM009",
          `${path}.revenueShare`,
          `Template ${template.id} requires a revenue share for this grant.`,
        ),
      );
    }
    if (
      template.status !== "counsel-reviewed" &&
      grant.status === "active" &&
      grantsCommercial(grant)
    ) {
      findings.push(
        error(
          "RM009",
          `${path}.status`,
          `Template ${template.id} is "${template.status}"; commercial grants cannot be active on it.`,
        ),
      );
    }
    if (template.status === "retired" && grant.status === "proposed") {
      findings.push(
        error(
          "RM009",
          `${path}.templateId`,
          `Template ${template.id} is retired.`,
        ),
      );
    }
  });

  // RM010 — time consistency.
  const created = Date.parse(m.createdAt);
  const updated = Date.parse(m.updatedAt);
  if (updated < created) {
    findings.push(
      error("RM010", "updatedAt", "updatedAt is earlier than createdAt."),
    );
  }
  m.licenses.forEach((grant) => {
    if (
      grant.duration.type === "fixed" &&
      Date.parse(grant.duration.endsAt) <= created
    ) {
      findings.push(
        error(
          "RM010",
          `licenses.${grant.licenseId}.duration.endsAt`,
          "Fixed-term licence ends before the manifest was created.",
        ),
      );
    }
  });

  // RM011 — anything beyond draft needs a content hash and at least one master file.
  if (m.status !== "draft") {
    if (!m.asset.contentHash) {
      findings.push(
        error(
          "RM011",
          "asset.contentHash",
          "A content hash is required once a manifest leaves draft.",
        ),
      );
    }
    if (!m.asset.sourceFiles.some((file) => file.role === "master")) {
      findings.push(
        error(
          "RM011",
          "asset.sourceFiles",
          'At least one source file with role "master" is required once a manifest leaves draft.',
        ),
      );
    }
  }

  // RM012 — canon promotion is a human decision with a receipt and a verified creator.
  if (m.asset.canonStatus === "official-canon") {
    if (!m.review.humanApprovalReceiptRef) {
      findings.push(
        error(
          "RM012",
          "review.humanApprovalReceiptRef",
          "official-canon assets require a human approval receipt reference.",
        ),
      );
    }
    if (!m.creators.some((creator) => creator.verified)) {
      findings.push(
        error(
          "RM012",
          "creators",
          "official-canon assets require at least one verified creator.",
        ),
      );
    }
  }
  if (m.asset.canonStatus === "proposed-canon" && m.status === "approved") {
    findings.push(
      error(
        "RM012",
        "asset.canonStatus",
        "proposed-canon must be ruled official-canon (with a receipt) or moved to community/experimental before approval.",
      ),
    );
  }

  // RM013 — AI training permission must be a deliberate choice.
  m.licenses.forEach((grant) => {
    if (grant.permissions.aiTraining === "allowed") {
      findings.push(
        warning(
          "RM013",
          `licenses.${grant.licenseId}.permissions.aiTraining`,
          'aiTraining is "allowed" outright. Prefer "conditional" with explicit terms unless this is intended.',
        ),
      );
    }
  });

  // RM014 — duplicate identifiers.
  const licenseIds = new Set<string>();
  for (const grant of m.licenses) {
    if (licenseIds.has(grant.licenseId)) {
      findings.push(
        error("RM014", `licenses.${grant.licenseId}`, "Duplicate licenseId."),
      );
    }
    licenseIds.add(grant.licenseId);
  }
  const creatorIds = new Set<string>();
  for (const creator of m.creators) {
    if (creatorIds.has(creator.id)) {
      findings.push(
        error("RM014", `creators.${creator.id}`, "Duplicate creator id."),
      );
    }
    creatorIds.add(creator.id);
  }

  // RM015 — open disputes block approval.
  if (
    m.status === "approved" &&
    m.disputes.some(
      (dispute) =>
        dispute.status === "open" || dispute.status === "under-review",
    )
  ) {
    findings.push(
      error(
        "RM015",
        "disputes",
        'An approved manifest cannot have open or under-review disputes; set status to "disputed".',
      ),
    );
  }

  const ok = !findings.some((finding) => finding.severity === "error");
  return { ok, manifest: m, findings };
}

export function assertRightsManifest(input: unknown): RightsManifest {
  const result = validateRightsManifest(input);
  if (!result.ok || !result.manifest) {
    const detail = result.findings
      .filter((finding) => finding.severity === "error")
      .map((finding) => `${finding.code} ${finding.path}: ${finding.message}`)
      .join("\n");
    throw new Error(`Invalid rights manifest:\n${detail}`);
  }
  return result.manifest;
}

/**
 * Release readiness for a storefront gate: the manifest validates, is approved, and every
 * live grant is at least proposed. Mirrors the `rightsApproved` flag in apps/web/lib/shop/catalog.ts
 * so the shop can derive that flag from evidence instead of a hand-set boolean.
 */
export function isReleaseReady(input: unknown): {
  ready: boolean;
  reasons: string[];
} {
  const result = validateRightsManifest(input);
  const reasons: string[] = [];
  if (!result.ok || !result.manifest) {
    reasons.push(
      ...result.findings
        .filter((f) => f.severity === "error")
        .map((f) => `${f.code} ${f.path}: ${f.message}`),
    );
    return { ready: false, reasons };
  }
  const m = result.manifest;
  if (m.status !== "approved") {
    reasons.push(`status is "${m.status}", expected "approved"`);
  }
  if (m.licenses.length === 0) {
    reasons.push("no licence grants recorded");
  }
  return { ready: reasons.length === 0, reasons };
}

/** Plain-language summary suitable for an edition page or collector dashboard. */
export function summarizeRights(manifest: RightsManifest): string[] {
  const lines: string[] = [];
  const a = manifest.authorship;
  const human = {
    none: "no",
    minimal: "minimal",
    substantial: "substantial",
    full: "full",
  }[a.humanContribution];
  const ai = {
    none: "no AI tools were used",
    assistive: "AI tools assisted with editing or production",
    "generative-with-human-direction":
      "AI generation under human direction and curation",
    "fully-generated": "fully AI-generated",
  }[a.aiInvolvement];
  lines.push(`Authorship: ${human} human creative contribution; ${ai}.`);
  if (a.aiTools.length > 0) {
    lines.push(
      `AI tools: ${a.aiTools.map((tool) => `${tool.provider}${tool.model ? ` ${tool.model}` : ""}`).join(", ")}.`,
    );
  }
  if (a.disclosure.required && a.disclosure.label) {
    lines.push(`Disclosure: ${a.disclosure.label}`);
  }
  const claim = {
    claimed: "Copyright is claimed by the creator(s).",
    partial: "Copyright is claimed in the human-authored elements only.",
    unclaimed: "No copyright is claimed in this work.",
    uncertain: "Copyright status is uncertain and is not warranted.",
  }[manifest.ownership.copyrightClaim];
  lines.push(claim);
  for (const grant of manifest.licenses) {
    const template = getLicenseTemplate(grant.templateId);
    lines.push(
      `Licence (${grant.status}): ${template?.name ?? grant.templateId} — ${template?.summary ?? ""}`.trim(),
    );
  }
  if (manifest.onchain && manifest.onchain.registrations.length > 0) {
    lines.push(manifest.onchain.disclaimer);
  }
  if (!manifest.review.counselReviewed) {
    lines.push(
      "Legal review: pending. Commercial terms are proposals until counsel has reviewed them.",
    );
  }
  return lines;
}
