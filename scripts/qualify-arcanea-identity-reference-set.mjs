import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const ROOT = process.cwd();
const digest = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const normalize = (path) => relative(ROOT, path).replaceAll("\\", "/");
const requiredCoverage = [
  "close-portrait",
  "full-body-action",
  "grayscale-silhouette",
  "small-avatar",
  "wide-environment",
  "object-or-anatomy-detail",
  "two-character-relation",
  "ensemble-stability",
];

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
  const entityId = required(args, "entity").toLowerCase();
  const identityLockVersion = required(args, "identity-lock-version");
  const identityLockEvidence = required(args, "identity-lock-evidence", 20);
  const qualifiedBy = required(args, "qualified-by", 3);
  const reason = required(args, "reason", 24);
  if (!/^[a-z0-9][a-z0-9._-]{1,63}$/i.test(entityId)) {
    throw new Error("--entity must be a safe stable id.");
  }
  if (!/^[a-z0-9][a-z0-9._-]{1,63}$/i.test(identityLockVersion)) {
    throw new Error("--identity-lock-version must be a safe version id.");
  }
  if (required(args, "human-attestation") !== "confirmed") {
    throw new Error(
      '--human-attestation must be exactly "confirmed" after a human reviews all eight regression views.',
    );
  }
  const paths = [...new Set(required(args, "references").split(","))]
    .map((value) => value.trim())
    .filter(Boolean);
  if (paths.length < 8) {
    throw new Error(
      "A regression-qualified identity set requires at least eight distinct bounded reference receipts.",
    );
  }

  const referenceRoot = join(
    ROOT,
    "planning-with-files/arcanea-visual-references",
  );
  const references = paths.map((path, index) => {
    const absolutePath = ensureInside(
      path,
      referenceRoot,
      `Reference ${index + 1}`,
    );
    const receipt = readHashed(
      absolutePath,
      "arcanea.visual_reference_receipt.v1",
      "receiptHash",
      `Reference ${index + 1}`,
    );
    if (
      receipt.entityId !== entityId ||
      receipt.role !== "identity" ||
      receipt.qualification !== "bounded-approved-reference" ||
      receipt.humanAttestation !== true ||
      typeof receipt.image?.sha256 !== "string"
    ) {
      throw new Error(
        `Reference ${index + 1} is not an accepted bounded identity reference for ${entityId}.`,
      );
    }
    const approvalPath = ensureInside(
      receipt.source.approvalDecisionPath,
      "planning-with-files/arcanea-visual-releases",
      `Reference ${index + 1} approval`,
    );
    const approval = readHashed(
      approvalPath,
      "arcanea.visual_release_decision.v1",
      "receiptHash",
      `Reference ${index + 1} approval`,
    );
    if (
      approval.receiptHash !== receipt.source.approvalDecisionHash ||
      approval.decision !== "approved" ||
      approval.imageSha256 !== receipt.image.sha256
    ) {
      throw new Error(`Reference ${index + 1} approval chain is invalid.`);
    }
    return { path: normalize(absolutePath), receipt };
  });
  if (
    new Set(references.map((entry) => entry.receipt.receiptHash)).size !==
      references.length ||
    new Set(references.map((entry) => entry.receipt.image.sha256)).size < 8
  ) {
    throw new Error(
      "A regression-qualified identity set requires eight unique receipts and image hashes.",
    );
  }
  const coverageMatrix = Object.fromEntries(
    requiredCoverage.map((coverage) => {
      const entry = references.find((candidate) =>
        candidate.receipt.coverage.includes(coverage),
      );
      if (!entry) {
        throw new Error(`Identity set is missing ${coverage} coverage.`);
      }
      return [coverage, entry.path];
    }),
  );

  const entityRoot = join(referenceRoot, entityId);
  const outputPath = ensureInside(
    join(entityRoot, `identity-set-${identityLockVersion}.json`),
    entityRoot,
    "Identity reference set",
  );
  let existing = null;
  if (existsSync(outputPath)) {
    existing = readHashed(
      outputPath,
      "arcanea.visual_identity_reference_set.v1",
      "receiptHash",
      "Existing identity reference set",
    );
  }
  const body = {
    schema: "arcanea.visual_identity_reference_set.v1",
    entityId,
    identityLockVersion,
    identityLockEvidence,
    qualification: "identity-regression-qualified",
    requiredCoverage,
    coverageMatrix,
    references: references.map(({ path, receipt }) => ({
      path,
      receiptHash: receipt.receiptHash,
      imageSha256: receipt.image.sha256,
      coverage: receipt.coverage,
    })),
    qualifiedBy,
    humanAttestation: true,
    reason,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  const setReceipt = { ...body, receiptHash: digest(body) };
  if (existing && existing.receiptHash !== setReceipt.receiptHash) {
    throw new Error(
      `Identity reference set already exists with different content: ${outputPath}`,
    );
  }
  mkdirSync(dirname(outputPath), { recursive: true });
  if (!existing) {
    writeFileSync(
      outputPath,
      `${JSON.stringify(setReceipt, null, 2)}\n`,
      "utf8",
    );
  }
  console.log(
    `Qualified ${entityId} identity set ${identityLockVersion}: eight regression coverages, ${references.length} accepted references, ${normalize(outputPath)}.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
