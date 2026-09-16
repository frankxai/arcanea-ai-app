import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import { validateMachinePreflightReceipt } from "./lib/arcanea-machine-preflight.mjs";

const ROOT = process.cwd();
const AUTHORITY_ROOT = join(
  ROOT,
  "planning-with-files/arcanea-visual-authority",
);

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

function required(args, key) {
  const value = args[key];
  if (!value) throw new Error(`--${key} is required.`);
  return value;
}

const sha = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const normalize = (path) => relative(ROOT, path).replaceAll("\\", "/");

function ensureInside(path, parent, label) {
  const absolute = resolve(path);
  const absoluteParent = resolve(parent);
  if (
    absolute !== absoluteParent &&
    !absolute.startsWith(`${absoluteParent}\\`) &&
    !absolute.startsWith(`${absoluteParent}/`)
  ) {
    throw new Error(`${label} must remain inside ${absoluteParent}.`);
  }
  return absolute;
}

function safeJson(value, label, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    throw new Error(`${label} must be valid JSON: ${error.message}`);
  }
}

function validateHashedRecord(record, hashKey, label) {
  const { [hashKey]: recordedHash, ...body } = record;
  if (!recordedHash || recordedHash !== sha(body)) {
    throw new Error(`${label} hash is invalid.`);
  }
  return recordedHash;
}

try {
  const args = argsToObject(process.argv);
  if (required(args, "human-attestation") !== "confirmed") {
    throw new Error('--human-attestation must be exactly "confirmed".');
  }
  const authorityEvidence = required(args, "authority-evidence");
  if (authorityEvidence.trim().length < 12) {
    throw new Error(
      "--authority-evidence must identify the human decision record.",
    );
  }
  const spendApprovedBy = required(args, "spend-approved-by");
  const spendBoundary = required(args, "spend-boundary");
  const rightsAttestedBy = required(args, "rights-attested-by");
  const issuedBy = required(args, "issued-by");
  if (
    spendApprovedBy.trim().length < 2 ||
    spendBoundary.trim().length < 3 ||
    rightsAttestedBy.trim().length < 2 ||
    issuedBy.trim().length < 2
  ) {
    throw new Error("Human authority fields are too short to be auditable.");
  }
  const round = Number(args.round ?? "1");
  const providerProfile = args.provider ?? "codex-imagegen";
  const revisionCalls = Number(args["max-revision-calls"] ?? "0");
  const ttlMinutes = Number(args["ttl-minutes"] ?? "15");
  const stopMinutes = Number(args["stop-minutes"] ?? String(ttlMinutes));
  if (
    !Number.isInteger(round) ||
    round < 1 ||
    round > 10 ||
    !Number.isInteger(revisionCalls) ||
    revisionCalls < 0 ||
    !Number.isInteger(ttlMinutes) ||
    ttlMinutes < 5 ||
    ttlMinutes > 30 ||
    !Number.isInteger(stopMinutes) ||
    stopMinutes < 5 ||
    stopMinutes > ttlMinutes
  ) {
    throw new Error(
      "Round, revision, TTL, or stop values are outside their bounded ranges.",
    );
  }
  const campaign = readJson(
    join(ROOT, "apps/web/data/arcanea-visual-campaign.v1.json"),
  );
  const roundRecord = campaign.rounds.find((entry) => entry.round === round);
  if (!roundRecord) throw new Error(`Campaign Round ${round} does not exist.`);
  const roundId = String(round).padStart(2, "0");
  const packPath = join(
    ROOT,
    `planning-with-files/arcanea-visual-campaign/round-${roundId}-${providerProfile}-provider-pack.json`,
  );
  const pack = readJson(packPath);
  validateHashedRecord(pack, "packetHash", "Provider packet");
  const manifestPath = resolve(ROOT, pack.executionManifest.path);
  const manifest = readJson(manifestPath);
  validateHashedRecord(manifest, "manifestHash", "Execution manifest");
  const manifestIndex = readJson(
    join(
      ROOT,
      "planning-with-files/arcanea-visual-campaign/execution-manifests/index.json",
    ),
  );
  validateHashedRecord(manifestIndex, "indexHash", "Execution manifest index");
  if (
    pack.campaignId !== campaign.meta.campaignId ||
    pack.campaignVersion !== campaign.meta.version ||
    pack.round !== round ||
    pack.executionManifest.hash !== manifest.manifestHash ||
    !manifestIndex.current.some(
      (entry) =>
        entry.round === round &&
        entry.profileId === providerProfile &&
        entry.manifestPath === pack.executionManifest.path &&
        entry.manifestHash === manifest.manifestHash,
    )
  ) {
    throw new Error("Provider lane is stale or not current-active.");
  }

  const preflightPath = ensureInside(
    required(args, "preflight"),
    AUTHORITY_ROOT,
    "Machine preflight receipt",
  );
  const preflight = readJson(preflightPath);
  validateMachinePreflightReceipt(preflight, { requireExecutable: true });
  const preflightHash = preflight.receiptHash;
  const preflightExpiresAt = Date.parse(preflight.expiresAt);

  const resultsRoot = join(ROOT, "planning-with-files/arcanea-visual-results");
  const recordedIds = existsSync(resultsRoot)
    ? readdirSync(resultsRoot)
        .filter((name) => /^acv-\d{3}-r\d+\.json$/i.test(name))
        .map((name) => readJson(join(resultsRoot, name)).jobId)
    : [];
  const missingIds = roundRecord.jobs
    .filter(
      (job) =>
        job.generationState !== "blocked" && !recordedIds.includes(job.id),
    )
    .map((job) => job.id);
  // Default to the next missing job only. A multi-job grant is still available
  // through an explicit sorted --jobs list, but it is intentionally opt-in:
  // recording any authorized job changes the missing-job set and makes a
  // subsequent readiness reconstruction reject the older broad grant.
  const requestedIds = (args.jobs ?? missingIds.slice(0, 1).join(","))
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);
  if (
    !requestedIds.length ||
    JSON.stringify(requestedIds) !==
      JSON.stringify([...new Set(requestedIds)].sort()) ||
    requestedIds.some((id) => !missingIds.includes(id)) ||
    requestedIds.length + revisionCalls > 10
  ) {
    throw new Error(
      "--jobs must be a sorted unique subset of currently missing executable ids, with at most ten total calls.",
    );
  }
  const specialistReviewEvidence = safeJson(
    args["specialist-evidence"],
    "--specialist-evidence",
    [],
  );
  if (!Array.isArray(specialistReviewEvidence)) {
    throw new Error("--specialist-evidence must be a JSON array.");
  }
  const specialistIds = new Set(
    specialistReviewEvidence.map((item) => item.jobId),
  );
  const missingSpecialistEvidence = roundRecord.jobs
    .filter(
      (job) =>
        requestedIds.includes(job.id) &&
        job.sensitivityReviewRequired &&
        !specialistIds.has(job.id),
    )
    .map((job) => job.id);
  if (missingSpecialistEvidence.length) {
    throw new Error(
      `Specialist-review evidence is missing for: ${missingSpecialistEvidence.join(", ")}.`,
    );
  }
  const runtimeParameters = safeJson(args.parameters, "--parameters", {});
  if (
    !runtimeParameters ||
    typeof runtimeParameters !== "object" ||
    Array.isArray(runtimeParameters)
  ) {
    throw new Error("--parameters must be a JSON object.");
  }
  const model = args.model ?? null;
  if (
    (pack.profile.modelPolicy !== "tool-managed-model-selection" && !model) ||
    (model !== null && model.trim().length < 2)
  ) {
    throw new Error(
      "--model is required when the current provider lane does not manage model selection.",
    );
  }
  const issuedAt = new Date();
  const expiresAt = new Date(
    Math.min(issuedAt.getTime() + ttlMinutes * 60 * 1000, preflightExpiresAt),
  );
  const stopAt = new Date(
    Math.min(issuedAt.getTime() + stopMinutes * 60 * 1000, expiresAt.getTime()),
  );
  if (stopAt.getTime() - issuedAt.getTime() < 60_000) {
    throw new Error(
      "Machine preflight is too close to expiry; capture a fresh one.",
    );
  }
  const grantBody = {
    schema: "arcanea.visual_execution_grant.v1",
    campaignId: campaign.meta.campaignId,
    campaignVersion: campaign.meta.version,
    round,
    providerProfile,
    provider: pack.profile.provider,
    modelPolicy: pack.profile.modelPolicy,
    model,
    runtimeParameters,
    runtimeParametersHash: sha(runtimeParameters),
    executionManifestPath: pack.executionManifest.path,
    executionManifestHash: manifest.manifestHash,
    sourceContractSetHash: manifest.sourceContractSetHash,
    jobIds: requestedIds,
    maxCalls: requestedIds.length + revisionCalls,
    maxRevisionCalls: revisionCalls,
    spendApprovedBy,
    spendBoundary,
    machinePreflightReceiptPath: normalize(preflightPath),
    machinePreflightReceiptHash: preflightHash,
    rightsAndLikenessAttestedBy: rightsAttestedBy,
    specialistReviewEvidence,
    outputRoot: "planning-with-files/arcanea-visual-assets/v1",
    authorityEvidence,
    humanAttestation: true,
    stopAt: stopAt.toISOString(),
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    issuedBy,
  };
  const grant = { ...grantBody, grantHash: sha(grantBody) };
  const outputPath = ensureInside(
    required(args, "write"),
    AUTHORITY_ROOT,
    "Execution grant path",
  );
  const serialized = `${JSON.stringify(grant, null, 2)}\n`;
  if (existsSync(outputPath)) {
    if (readFileSync(outputPath, "utf8") !== serialized) {
      throw new Error(`Execution grant already exists: ${outputPath}`);
    }
  } else {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, serialized, "utf8");
  }
  console.log(
    `Issued bounded Round ${roundId} grant for ${requestedIds.length} jobs and ${grant.maxCalls} calls: ${normalize(outputPath)} · ${grant.grantHash}`,
  );
} catch (error) {
  console.error(`Grant issuance failed: ${error.message}`);
  process.exit(2);
}
