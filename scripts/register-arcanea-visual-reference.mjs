import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const ROOT = process.cwd();
const campaign = JSON.parse(
  readFileSync(
    join(ROOT, "apps/web/data/arcanea-visual-campaign.v1.json"),
    "utf8",
  ),
);
const digest = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const normalize = (path) => relative(ROOT, path).replaceAll("\\", "/");
const allowedRoles = new Set([
  "identity",
  "composition",
  "material",
  "lighting",
  "environment",
]);
const allowedCoverage = new Set([
  "close-portrait",
  "full-body-action",
  "grayscale-silhouette",
  "small-avatar",
  "wide-environment",
  "object-or-anatomy-detail",
  "two-character-relation",
  "ensemble-stability",
]);

function argsToObject(values) {
  const result = {};
  for (let index = 2; index < values.length; index += 1) {
    const key = values[index];
    if (!key.startsWith("--")) throw new Error(`Unexpected argument: ${key}`);
    const value = values[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${key}`);
    }
    result[key.slice(2)] = value;
    index += 1;
  }
  return result;
}

function required(args, key, minimum = 1) {
  const value = args[key];
  if (typeof value !== "string" || value.trim().length < minimum) {
    throw new Error(`--${key} is required.`);
  }
  return value.trim();
}

function ensureInside(relativeOrAbsolute, parent, label) {
  const absolute = resolve(ROOT, relativeOrAbsolute);
  const absoluteParent = resolve(ROOT, parent);
  if (
    absolute !== absoluteParent &&
    !absolute.startsWith(`${absoluteParent}\\`) &&
    !absolute.startsWith(`${absoluteParent}/`)
  ) {
    throw new Error(`${label} must remain inside ${absoluteParent}.`);
  }
  return absolute;
}

function readHashed(path, schema, hashField, label) {
  if (!existsSync(path)) throw new Error(`${label} does not exist: ${path}`);
  const value = JSON.parse(readFileSync(path, "utf8"));
  const { [hashField]: recordedHash, ...body } = value;
  if (value.schema !== schema || recordedHash !== digest(body)) {
    throw new Error(`${label} has an invalid schema or hash.`);
  }
  return value;
}

try {
  const args = argsToObject(process.argv);
  const jobId = required(args, "job").toUpperCase();
  const revision = Number(required(args, "revision"));
  const role = required(args, "role").toLowerCase();
  const acceptedBy = required(args, "accepted-by", 3);
  const reason = required(args, "reason", 24);
  if (!Number.isInteger(revision) || revision < 1) {
    throw new Error("--revision must be a positive integer.");
  }
  if (!allowedRoles.has(role)) {
    throw new Error(`--role must be one of: ${[...allowedRoles].join(", ")}.`);
  }
  if (required(args, "human-attestation") !== "confirmed") {
    throw new Error(
      '--human-attestation must be exactly "confirmed" after a human accepts this bounded reference use.',
    );
  }
  const coverage = [...new Set(required(args, "coverage").split(","))]
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (
    coverage.length === 0 ||
    coverage.some((value) => !allowedCoverage.has(value))
  ) {
    throw new Error(`--coverage must use: ${[...allowedCoverage].join(", ")}.`);
  }

  const job = campaign.rounds
    .flatMap((round) => round.jobs)
    .find((candidate) => candidate.id === jobId);
  if (!job) throw new Error(`Unknown campaign job: ${jobId}`);
  if (job.generationState === "blocked") {
    throw new Error(`${jobId} is blocked: ${job.blockedReason}`);
  }
  if (
    typeof job.entityId !== "string" ||
    job.entityId.trim().length < 2 ||
    job.releaseEligibility === "internal-only-until-identity-lock"
  ) {
    throw new Error(
      `${jobId} cannot create an accepted visual reference from an open or non-entity contract.`,
    );
  }

  const releasePath = ensureInside(
    `planning-with-files/arcanea-visual-releases/${jobId.toLowerCase()}-r${revision}-approved.json`,
    "planning-with-files/arcanea-visual-releases",
    "Approval decision",
  );
  const approval = readHashed(
    releasePath,
    "arcanea.visual_release_decision.v1",
    "receiptHash",
    "Approval decision",
  );
  if (
    approval.decision !== "approved" ||
    approval.jobId !== jobId ||
    approval.outputRevision !== revision ||
    approval.humanAttestation !== true ||
    approval.releaseEligibility === "internal-only-until-identity-lock" ||
    !approval.stagedPublicUrl?.startsWith("/images/arcanea-campaign/") ||
    !approval.gates ||
    Object.values(approval.gates).some(
      (gate) => typeof gate !== "string" || gate.trim().length < 5,
    )
  ) {
    throw new Error(
      "Bounded references require the exact approved output and all five human gates.",
    );
  }
  const outputPath = ensureInside(
    approval.outputReceiptPath,
    "planning-with-files/arcanea-visual-results",
    "Output receipt",
  );
  const output = readHashed(
    outputPath,
    "arcanea.visual_output_receipt.v1",
    "receiptHash",
    "Output receipt",
  );
  if (
    output.receiptHash !== approval.outputReceiptHash ||
    output.jobId !== jobId ||
    output.revision !== revision ||
    output.output?.sha256 !== approval.imageSha256 ||
    output.promptContractHash !== job.promptContract.contractHash
  ) {
    throw new Error("Output receipt does not match the approval decision.");
  }
  const stagedPath = ensureInside(
    join(
      ROOT,
      "apps/web/public",
      approval.stagedPublicUrl.replace(/^[/\\]+/, ""),
    ),
    "apps/web/public/images/arcanea-campaign",
    "Staged approved image",
  );
  if (!existsSync(stagedPath)) {
    throw new Error(`Approved staged image does not exist: ${stagedPath}`);
  }
  const stagedSha = createHash("sha256")
    .update(readFileSync(stagedPath))
    .digest("hex");
  if (stagedSha !== approval.imageSha256) {
    throw new Error("Approved staged bytes do not match the approval receipt.");
  }

  const referenceRoot = join(
    ROOT,
    "planning-with-files/arcanea-visual-references",
    job.entityId,
  );
  const referencePath = ensureInside(
    join(referenceRoot, `${jobId.toLowerCase()}-r${revision}-${role}.json`),
    referenceRoot,
    "Visual reference receipt",
  );
  let existing = null;
  if (existsSync(referencePath)) {
    existing = readHashed(
      referencePath,
      "arcanea.visual_reference_receipt.v1",
      "receiptHash",
      "Existing visual reference receipt",
    );
  }
  const body = {
    schema: "arcanea.visual_reference_receipt.v1",
    campaignId: campaign.meta.campaignId,
    campaignVersion: campaign.meta.version,
    entityId: job.entityId,
    subjectKind: job.subjectKind,
    jobId,
    outputRevision: revision,
    role,
    coverage,
    qualification: "bounded-approved-reference",
    image: {
      sha256: approval.imageSha256,
      width: output.output.width,
      height: output.output.height,
      format: output.output.format,
      stagedPublicUrl: approval.stagedPublicUrl,
    },
    source: {
      outputReceiptPath: normalize(outputPath),
      outputReceiptHash: output.receiptHash,
      approvalDecisionPath: normalize(releasePath),
      approvalDecisionHash: approval.receiptHash,
      evaluationReflectionPath: approval.evaluationReflectionPath,
      evaluationReceiptHash: approval.evaluationReceiptHash,
    },
    acceptedBy,
    humanAttestation: true,
    reason,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  const receipt = { ...body, receiptHash: digest(body) };
  if (existing && existing.receiptHash !== receipt.receiptHash) {
    throw new Error(
      `Visual reference receipt already exists with different content: ${referencePath}`,
    );
  }
  mkdirSync(dirname(referencePath), { recursive: true });
  if (!existing) {
    writeFileSync(
      referencePath,
      `${JSON.stringify(receipt, null, 2)}\n`,
      "utf8",
    );
  }
  console.log(
    `Registered bounded ${role} reference for ${job.entityId}: ${normalize(referencePath)}. This is not yet a regression-qualified identity set.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
