import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  LICENSE_TEMPLATES,
  ONCHAIN_DISCLAIMER,
  assertRightsManifest,
  getLicenseTemplate,
  isReleaseReady,
  rightsManifestJsonSchema,
  summarizeRights,
  validateRightsManifest,
  withinCeiling,
  type RightsManifestInput,
} from "../src/index.ts";

const here = dirname(fileURLToPath(import.meta.url));
const examplesDir = join(here, "../examples");

const loadExample = (name: string): RightsManifestInput =>
  JSON.parse(
    readFileSync(join(examplesDir, name), "utf8"),
  ) as RightsManifestInput;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const codes = (
  findings: readonly { code: string; severity: string }[],
  severity?: string,
): string[] =>
  findings
    .filter((f) => (severity ? f.severity === severity : true))
    .map((f) => f.code);

const approvedFixture = (): RightsManifestInput =>
  loadExample("fixture-exclusive-commission.approved.json");

test("every example in ./examples parses and has no error findings", () => {
  const files = readdirSync(examplesDir).filter((file) =>
    file.endsWith(".json"),
  );
  assert.ok(files.length >= 3, "expected at least three examples");
  for (const file of files) {
    const result = validateRightsManifest(loadExample(file));
    assert.equal(
      result.ok,
      true,
      `${file}: ${JSON.stringify(result.findings, null, 2)}`,
    );
  }
});

test("the approved fixture is release-ready; the real draft edition is not", () => {
  const ready = isReleaseReady(approvedFixture());
  assert.equal(ready.ready, true, ready.reasons.join("\n"));

  const draft = isReleaseReady(
    loadExample("living-cosmos-first-edition.draft.json"),
  );
  assert.equal(draft.ready, false);
  assert.ok(
    draft.reasons.some((reason) => reason.includes('status is "draft"')),
  );
});

test("RM000: structural problems are reported per issue with paths", () => {
  const result = validateRightsManifest({
    schema: "arcanea.rights_manifest.v0",
  });
  assert.equal(result.ok, false);
  assert.ok(result.findings.every((finding) => finding.code === "RM000"));
  assert.ok(result.findings.some((finding) => finding.path === "manifestId"));
});

test("RM001: approved manifests with commercial grants require counsel review and a receipt", () => {
  const m = approvedFixture();
  m.review.counselReviewed = false;
  delete m.review.humanApprovalReceiptRef;
  const result = validateRightsManifest(m);
  assert.equal(result.ok, false);
  assert.equal(
    codes(result.findings, "error").filter((code) => code === "RM001").length,
    2,
  );
});

test("RM002: fully AI-generated material cannot carry a copyright claim", () => {
  const m = approvedFixture();
  m.authorship.aiInvolvement = "fully-generated";
  m.authorship.humanContribution = "none";
  m.ownership.copyrightClaim = "claimed";
  const result = validateRightsManifest(m);
  assert.ok(codes(result.findings, "error").includes("RM002"));

  m.ownership.copyrightClaim = "unclaimed";
  const fixed = validateRightsManifest(m);
  assert.ok(!codes(fixed.findings, "error").includes("RM002"));
});

test("RM003: AI involvement without disclosure is an error", () => {
  const m = approvedFixture();
  m.authorship.disclosure.required = false;
  delete m.authorship.disclosure.label;
  const result = validateRightsManifest(m);
  assert.equal(result.ok, false);
  assert.equal(
    codes(result.findings, "error").filter((code) => code === "RM003").length,
    2,
  );
});

test("RM004: a commercial grant with an unverified AI tool permission fails closed", () => {
  const m = approvedFixture();
  const tool = m.authorship.aiTools?.[0];
  assert.ok(tool);
  tool.commercialUseAllowed = "unknown";
  const result = validateRightsManifest(m);
  assert.equal(result.ok, false);
  assert.ok(codes(result.findings, "error").includes("RM004"));
});

test("RM004 is only a warning when no grant is commercial", () => {
  const m = loadExample("living-cosmos-first-edition.draft.json");
  const result = validateRightsManifest(m);
  assert.equal(result.ok, true);
  assert.ok(!codes(result.findings, "error").includes("RM004"));
  assert.ok(codes(result.findings, "warning").includes("RM004"));
});

test("RM005: an exclusive grant cannot coexist with another live commercial grant", () => {
  const m = approvedFixture();
  const extra = clone(m.licenses![0]!);
  extra.licenseId = "lic:fixture:second";
  extra.templateId = "arcanea.commercial.v0";
  extra.exclusivity = "non-exclusive";
  extra.licensee = "purchaser";
  delete extra.licenseeRef;
  extra.permissions = {
    personalUse: "allowed",
    commercialUse: "allowed",
    derivatives: "conditional",
    redistribution: "prohibited",
    publicDisplay: "allowed",
    interactiveUse: "prohibited",
    sync: "prohibited",
    sublicensing: "prohibited",
    aiTraining: "prohibited",
  };
  extra.attribution = { required: false };
  m.licenses!.push(extra);
  const result = validateRightsManifest(m);
  assert.ok(codes(result.findings, "error").includes("RM005"));
});

test("RM006: creator shares and revenue shares cannot exceed 100", () => {
  const m = approvedFixture();
  m.creators.push({
    id: "creator:fixture-second",
    displayName: "Second",
    role: "co-author",
    verified: true,
    sharePercent: 40,
  });
  m.licenses![0]!.revenueShare = [
    { partyId: "a", percent: 60, basis: "net" },
    { partyId: "b", percent: 60, basis: "net" },
  ];
  const result = validateRightsManifest(m);
  assert.equal(
    codes(result.findings, "error").filter((code) => code === "RM006").length,
    2,
  );
});

test("RM007: token-holder grants need an on-chain registration and the canonical disclaimer", () => {
  const m = approvedFixture();
  m.licenses![0] = {
    ...m.licenses![0]!,
    templateId: "arcanea.token-holder-benefits.v0",
    licensee: "token-holder",
    exclusivity: "non-exclusive",
    permissions: {
      personalUse: "allowed",
      commercialUse: "prohibited",
      derivatives: "prohibited",
      redistribution: "prohibited",
      publicDisplay: "conditional",
      interactiveUse: "prohibited",
      sync: "prohibited",
      sublicensing: "prohibited",
      aiTraining: "prohibited",
    },
    attribution: { required: false },
  };
  delete m.licenses![0]!.licenseeRef;
  const missing = validateRightsManifest(m);
  assert.ok(codes(missing.findings, "error").includes("RM007"));

  m.onchain = {
    disclaimer: ONCHAIN_DISCLAIMER,
    registrations: [
      {
        chainId: 8453,
        network: "base",
        standard: "ERC-721C",
        contract: "0xfixture",
        deployment: "testnet",
        royaltyBps: 500,
        note: "EIP-2981 hint only",
      },
    ],
  };
  const present = validateRightsManifest(m);
  assert.ok(
    !codes(present.findings, "error").includes("RM007"),
    JSON.stringify(present.findings),
  );

  const tampered = clone(m) as Record<string, unknown>;
  (tampered.onchain as Record<string, unknown>).disclaimer =
    "A token is ownership.";
  const result = validateRightsManifest(tampered);
  assert.equal(result.ok, false);
  assert.ok(
    result.findings.some((finding) => finding.path === "onchain.disclaimer"),
  );
});

test("RM008: unresolved source material blocks approval of commercial grants", () => {
  const m = approvedFixture();
  m.sourceMaterial = [
    { description: "Reference photo of unknown origin", kind: "unknown" },
  ];
  const result = validateRightsManifest(m);
  assert.ok(codes(result.findings, "error").includes("RM008"));
});

test("RM009: grants may not exceed the template ceiling or template constraints", () => {
  const personal = getLicenseTemplate("arcanea.personal.v0");
  assert.ok(personal);
  const exceeded = withinCeiling(
    {
      ...personal.ceiling,
      commercialUse: "allowed",
      derivatives: "conditional",
    },
    personal.ceiling,
  );
  assert.deepEqual(exceeded.sort(), ["commercialUse", "derivatives"]);

  const m = loadExample("living-cosmos-first-edition.draft.json");
  m.licenses![0]!.permissions.commercialUse = "allowed";
  const result = validateRightsManifest(m);
  assert.ok(codes(result.findings, "error").includes("RM009"));

  const unknownTemplate = loadExample("living-cosmos-first-edition.draft.json");
  unknownTemplate.licenses![0]!.templateId = "arcanea.does-not-exist.v9";
  assert.ok(
    codes(validateRightsManifest(unknownTemplate).findings, "error").includes(
      "RM009",
    ),
  );
});

test("RM009: commercial grants cannot be active on a template that counsel has not reviewed", () => {
  const m = approvedFixture();
  m.licenses![0]!.status = "active";
  const result = validateRightsManifest(m);
  assert.ok(codes(result.findings, "error").includes("RM009"));
});

test("RM011: leaving draft requires a content hash and a master file", () => {
  const m = loadExample("living-cosmos-first-edition.draft.json");
  m.status = "review";
  const result = validateRightsManifest(m);
  assert.equal(
    codes(result.findings, "error").filter((code) => code === "RM011").length,
    2,
  );
});

test("RM012: official canon needs a verified creator and a human approval receipt", () => {
  const m = loadExample("living-cosmos-first-edition.draft.json");
  m.asset.canonStatus = "official-canon";
  m.creators[0]!.verified = false;
  const result = validateRightsManifest(m);
  assert.equal(
    codes(result.findings, "error").filter((code) => code === "RM012").length,
    2,
  );
});

test("RM012: proposed-canon cannot be approved until the canon ruling exists", () => {
  const m = approvedFixture();
  m.asset.canonStatus = "proposed-canon";
  const result = validateRightsManifest(m);
  assert.ok(codes(result.findings, "error").includes("RM012"));
});

test("RM015: open disputes block approval", () => {
  const m = approvedFixture();
  m.disputes = [
    {
      id: "d1",
      type: "infringement-claim",
      status: "open",
      openedAt: "2026-10-21T10:00:00+02:00",
      evidenceRef: "fixture:evidence",
    },
  ];
  const result = validateRightsManifest(m);
  assert.ok(codes(result.findings, "error").includes("RM015"));
});

test("assertRightsManifest throws with the error list", () => {
  assert.throws(() => assertRightsManifest({}), /Invalid rights manifest/);
});

test("licence registry: nine draft templates, each with a ceiling and non-claims", () => {
  assert.equal(LICENSE_TEMPLATES.length, 9);
  for (const template of LICENSE_TEMPLATES) {
    assert.equal(template.status, "draft-requires-counsel-review");
    assert.ok(template.nonClaims.length >= 3, template.id);
    assert.ok(template.summary.length > 20, template.id);
  }
  assert.equal(
    getLicenseTemplate("arcanea.token-holder-benefits.v0")?.ceiling
      .commercialUse,
    "prohibited",
  );
});

test("summarizeRights produces plain-language lines and repeats the on-chain disclaimer", () => {
  const m = assertRightsManifest({
    ...approvedFixture(),
    onchain: { disclaimer: ONCHAIN_DISCLAIMER, registrations: [] },
  });
  const lines = summarizeRights(m);
  assert.ok(lines[0]?.startsWith("Authorship:"));
  assert.ok(
    lines.some((line) =>
      line.includes(
        "Copyright is claimed in the human-authored elements only.",
      ),
    ),
  );
  // No registrations → disclaimer not repeated; with registrations it is.
  assert.ok(!lines.includes(ONCHAIN_DISCLAIMER));
});

test("JSON Schema export carries the $id and the top-level required fields", () => {
  const schema = rightsManifestJsonSchema() as {
    $id: string;
    required?: string[];
    properties?: Record<string, unknown>;
  };
  assert.equal(
    schema.$id,
    "https://arcanea.ai/schemas/arcanea.rights_manifest.v0.schema.json",
  );
  assert.ok(schema.required?.includes("authorship"));
  assert.ok(schema.properties && "licenses" in schema.properties);
});
