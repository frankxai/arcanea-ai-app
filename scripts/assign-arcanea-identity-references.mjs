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

function readHashed(path, schema, label) {
  if (!existsSync(path)) throw new Error(`${label} does not exist: ${path}`);
  const value = JSON.parse(readFileSync(path, "utf8"));
  const { receiptHash, ...body } = value;
  if (value.schema !== schema || receiptHash !== digest(body)) {
    throw new Error(`${label} has an invalid schema or hash.`);
  }
  return value;
}

try {
  const args = argsToObject(process.argv);
  const jobId = required(args, "job").toUpperCase();
  const assignedBy = required(args, "assigned-by", 3);
  const purpose = required(args, "purpose", 24);
  if (required(args, "human-attestation") !== "confirmed") {
    throw new Error(
      '--human-attestation must be exactly "confirmed" after a human chooses the reference views for this job.',
    );
  }
  const job = campaign.rounds
    .flatMap((round) => round.jobs)
    .find((candidate) => candidate.id === jobId);
  if (!job) throw new Error(`Unknown campaign job: ${jobId}`);
  if (job.generationState === "blocked") {
    throw new Error(`${jobId} is blocked: ${job.blockedReason}`);
  }
  if (typeof job.entityId !== "string" || job.entityId.trim().length < 2) {
    throw new Error(
      `${jobId} has no stable entity id for identity references.`,
    );
  }

  const referenceRoot = join(
    ROOT,
    "planning-with-files/arcanea-visual-references",
  );
  const setPath = ensureInside(
    required(args, "identity-reference-set"),
    referenceRoot,
    "Identity reference set",
  );
  const setReceipt = readHashed(
    setPath,
    "arcanea.visual_identity_reference_set.v1",
    "Identity reference set",
  );
  if (
    setReceipt.entityId !== job.entityId ||
    setReceipt.qualification !== "identity-regression-qualified" ||
    setReceipt.humanAttestation !== true
  ) {
    throw new Error(
      `Identity reference set is not regression-qualified for ${job.entityId}.`,
    );
  }
  const requestedCoverage = [
    ...new Set(required(args, "use-coverages").split(",")),
  ]
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (requestedCoverage.length === 0 || requestedCoverage.length > 5) {
    throw new Error(
      "--use-coverages must choose one to five views so every configured provider lane can use the same smallest-sufficient set.",
    );
  }
  const selected = [];
  for (const coverage of requestedCoverage) {
    const referencePath = setReceipt.coverageMatrix?.[coverage];
    if (!referencePath) {
      throw new Error(`Identity reference set has no ${coverage} view.`);
    }
    const absoluteReferencePath = ensureInside(
      referencePath,
      referenceRoot,
      `${coverage} reference`,
    );
    const reference = readHashed(
      absoluteReferencePath,
      "arcanea.visual_reference_receipt.v1",
      `${coverage} reference`,
    );
    const setEntry = setReceipt.references.find(
      (entry) => entry.path === normalize(absoluteReferencePath),
    );
    if (
      reference.entityId !== job.entityId ||
      reference.role !== "identity" ||
      reference.receiptHash !== setEntry?.receiptHash ||
      reference.image.sha256 !== setEntry?.imageSha256
    ) {
      throw new Error(
        `${coverage} reference does not match the qualified set.`,
      );
    }
    if (
      !selected.some((entry) => entry.imageSha256 === reference.image.sha256)
    ) {
      selected.push({
        coverage,
        referenceReceiptPath: normalize(absoluteReferencePath),
        referenceReceiptHash: reference.receiptHash,
        imageSha256: reference.image.sha256,
        stagedPublicUrl: reference.image.stagedPublicUrl,
      });
    }
  }

  const assignmentRoot = join(
    ROOT,
    "planning-with-files/arcanea-visual-reference-assignments",
  );
  const outputPath = ensureInside(
    join(assignmentRoot, `${jobId.toLowerCase()}.json`),
    assignmentRoot,
    "Reference assignment",
  );
  let existing = null;
  if (existsSync(outputPath)) {
    existing = readHashed(
      outputPath,
      "arcanea.visual_reference_assignment.v1",
      "Existing reference assignment",
    );
  }
  const body = {
    schema: "arcanea.visual_reference_assignment.v1",
    campaignId: campaign.meta.campaignId,
    campaignVersion: campaign.meta.version,
    jobId,
    round: job.round,
    entityId: job.entityId,
    promptContractHash: job.promptContract.contractHash,
    identityReferenceSetPath: normalize(setPath),
    identityReferenceSetHash: setReceipt.receiptHash,
    identityLockVersion: setReceipt.identityLockVersion,
    selected,
    assignedBy,
    humanAttestation: true,
    purpose,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  const assignment = { ...body, receiptHash: digest(body) };
  if (existing && existing.receiptHash !== assignment.receiptHash) {
    throw new Error(
      `Reference assignment already exists with different content: ${outputPath}`,
    );
  }
  mkdirSync(dirname(outputPath), { recursive: true });
  if (!existing) {
    writeFileSync(
      outputPath,
      `${JSON.stringify(assignment, null, 2)}\n`,
      "utf8",
    );
  }
  console.log(
    `Assigned ${selected.length} qualified identity references to ${jobId}: ${normalize(outputPath)}.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
