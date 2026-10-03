import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";

import { validateMachinePreflightReceipt } from "./lib/arcanea-machine-preflight.mjs";

const ROOT = process.cwd();

function argsToObject(values) {
  const result = {};
  for (let index = 2; index < values.length; index += 1) {
    const key = values[index];
    if (!key.startsWith("--")) throw new Error(`Unexpected argument: ${key}`);
    if (["--json", "--require-ready", "--template"].includes(key)) {
      result[key.slice(2)] = true;
      continue;
    }
    const value = values[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${key}`);
    }
    result[key.slice(2)] = value;
    index += 1;
  }
  return result;
}

const sha = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const normalize = (path) => relative(ROOT, path).replaceAll("\\", "/");
const sorted = (values) => [...values].sort();

function validateHashedRecord(record, hashKey, label) {
  const { [hashKey]: recordedHash, ...body } = record;
  if (!recordedHash || recordedHash !== sha(body)) {
    throw new Error(`${label} hash is invalid.`);
  }
  return recordedHash;
}

function parseCurrentInstant(value, label) {
  const instant = Date.parse(value);
  if (!Number.isFinite(instant))
    throw new Error(`${label} is not an ISO date.`);
  return instant;
}

function outputReceipts(round) {
  const root = join(ROOT, "planning-with-files/arcanea-visual-results");
  if (!existsSync(root)) return [];
  return readdirSync(root)
    .filter((name) => /^acv-\d{3}-r\d+\.json$/i.test(name))
    .sort()
    .map((name) => ({
      path: join(root, name),
      receipt: readJson(join(root, name)),
    }))
    .filter(({ receipt }) => receipt.round === round);
}

function validateReceipt({ path, receipt }, campaign, jobs, manifest) {
  validateHashedRecord(
    receipt,
    "receiptHash",
    `Output receipt ${basename(path)}`,
  );
  const manifestJob = manifest.jobs.find((job) => job.id === receipt.jobId);
  const campaignJob = jobs.find((job) => job.id === receipt.jobId);
  if (
    receipt.schema !== "arcanea.visual_output_receipt.v1" ||
    receipt.campaignId !== campaign.meta.campaignId ||
    receipt.campaignVersion !== campaign.meta.version ||
    !campaignJob ||
    !manifestJob ||
    receipt.promptContractHash !== campaignJob.promptContract.contractHash ||
    receipt.execution?.executionManifestHash !== manifest.manifestHash ||
    receipt.execution?.executionPromptHash !==
      manifestJob.executionPromptHash ||
    receipt.execution?.providerProfile !== manifest.profileId
  ) {
    throw new Error(
      `Output receipt ${basename(path)} is stale or lane-mismatched.`,
    );
  }
  const assetPath = resolve(ROOT, receipt.output.storagePath);
  if (!existsSync(assetPath)) {
    throw new Error(
      `Output receipt ${basename(path)} points to a missing asset.`,
    );
  }
}

function executionGrantTemplate({ campaign, round, pack, manifest, jobIds }) {
  return {
    schema: "arcanea.visual_execution_grant.v1",
    campaignId: campaign.meta.campaignId,
    campaignVersion: campaign.meta.version,
    round,
    providerProfile: pack.profileId,
    provider: pack.profile.provider,
    modelPolicy: pack.profile.modelPolicy,
    model: null,
    runtimeParameters: {},
    runtimeParametersHash: sha({}),
    executionManifestPath: pack.executionManifest.path,
    executionManifestHash: manifest.manifestHash,
    sourceContractSetHash: manifest.sourceContractSetHash,
    jobIds,
    maxCalls: jobIds.length,
    maxRevisionCalls: 0,
    spendApprovedBy: null,
    spendBoundary: null,
    machinePreflightReceiptPath: null,
    machinePreflightReceiptHash: null,
    rightsAndLikenessAttestedBy: null,
    specialistReviewEvidence: [],
    outputRoot: "planning-with-files/arcanea-visual-assets/v1",
    authorityEvidence: null,
    humanAttestation: false,
    stopAt: null,
    issuedAt: null,
    expiresAt: null,
    issuedBy: null,
    grantHash: null,
  };
}

function validatePreflight(path) {
  const receipt = readJson(path);
  validateMachinePreflightReceipt(receipt, { requireExecutable: true });
  return receipt;
}

function validateGrant({
  path,
  preflight,
  preflightPath,
  campaign,
  round,
  pack,
  manifest,
  missingIds,
  jobs,
}) {
  const grant = readJson(path);
  validateHashedRecord(grant, "grantHash", "Execution grant");
  const now = Date.now();
  const grantIds = grant.jobIds ?? [];
  const sensitiveIds = jobs
    .filter((job) => grantIds.includes(job.id) && job.sensitivityReviewRequired)
    .map((job) => job.id);
  const evidenceIds = new Set(
    (grant.specialistReviewEvidence ?? []).map((item) => item.jobId),
  );
  const issuedAt = parseCurrentInstant(grant.issuedAt, "Grant issuedAt");
  const expiresAt = parseCurrentInstant(grant.expiresAt, "Grant expiresAt");
  const stopAt = parseCurrentInstant(grant.stopAt, "Grant stopAt");
  const preflightCheckedAt = parseCurrentInstant(
    preflight.checkedAt,
    "Preflight checkedAt",
  );
  const preflightExpiresAt = parseCurrentInstant(
    preflight.expiresAt,
    "Preflight expiresAt",
  );
  if (
    grant.schema !== "arcanea.visual_execution_grant.v1" ||
    grant.campaignId !== campaign.meta.campaignId ||
    grant.campaignVersion !== campaign.meta.version ||
    grant.round !== round ||
    grant.providerProfile !== pack.profileId ||
    grant.provider !== pack.profile.provider ||
    grant.modelPolicy !== manifest.profile.modelPolicy ||
    (manifest.profile.modelPolicy !== "tool-managed-model-selection" &&
      (typeof grant.model !== "string" || grant.model.trim().length < 2)) ||
    (grant.model !== null && typeof grant.model !== "string") ||
    !grant.runtimeParameters ||
    typeof grant.runtimeParameters !== "object" ||
    Array.isArray(grant.runtimeParameters) ||
    grant.runtimeParametersHash !== sha(grant.runtimeParameters) ||
    grant.executionManifestPath !== pack.executionManifest.path ||
    grant.executionManifestHash !== manifest.manifestHash ||
    grant.sourceContractSetHash !== manifest.sourceContractSetHash ||
    !grantIds.length ||
    JSON.stringify(grantIds) !== JSON.stringify(sorted(grantIds)) ||
    grantIds.some((id) => !missingIds.includes(id)) ||
    !Number.isInteger(grant.maxCalls) ||
    !Number.isInteger(grant.maxRevisionCalls) ||
    grant.maxRevisionCalls < 0 ||
    grant.maxCalls < grantIds.length ||
    grant.maxCalls > grantIds.length + grant.maxRevisionCalls ||
    grant.maxCalls > 10 ||
    typeof grant.spendApprovedBy !== "string" ||
    grant.spendApprovedBy.trim().length < 2 ||
    typeof grant.spendBoundary !== "string" ||
    grant.spendBoundary.trim().length < 3 ||
    typeof grant.rightsAndLikenessAttestedBy !== "string" ||
    grant.rightsAndLikenessAttestedBy.trim().length < 2 ||
    typeof grant.issuedBy !== "string" ||
    grant.issuedBy.trim().length < 2 ||
    grant.machinePreflightReceiptHash !== preflight.receiptHash ||
    grant.machinePreflightReceiptPath !== normalize(preflightPath) ||
    grant.outputRoot !== "planning-with-files/arcanea-visual-assets/v1" ||
    typeof grant.authorityEvidence !== "string" ||
    grant.authorityEvidence.trim().length < 12 ||
    grant.humanAttestation !== true ||
    issuedAt > now ||
    issuedAt < preflightCheckedAt ||
    expiresAt <= now ||
    stopAt <= now ||
    stopAt > expiresAt ||
    expiresAt > preflightExpiresAt ||
    sensitiveIds.some((id) => !evidenceIds.has(id))
  ) {
    throw new Error(
      "Execution grant is stale, over-broad, lane-mismatched, missing human authority, or missing required specialist evidence.",
    );
  }
  return grant;
}

try {
  const args = argsToObject(process.argv);
  const round = Number(args.round ?? "1");
  const providerProfile = args.provider ?? "codex-imagegen";
  if (!Number.isInteger(round) || round < 1 || round > 10) {
    throw new Error("--round must be an integer from 1 through 10.");
  }
  const campaign = readJson(
    join(ROOT, "apps/web/data/arcanea-visual-campaign.v1.json"),
  );
  const roundRecord = campaign.rounds.find(
    (candidate) => candidate.round === round,
  );
  if (!roundRecord) throw new Error(`Campaign Round ${round} does not exist.`);
  const roundId = String(round).padStart(2, "0");
  const packPath = join(
    ROOT,
    `planning-with-files/arcanea-visual-campaign/round-${roundId}-${providerProfile}-provider-pack.json`,
  );
  if (!existsSync(packPath)) {
    throw new Error(
      `Provider packet is not compiled for Round ${roundId}: ${providerProfile}.`,
    );
  }
  const pack = readJson(packPath);
  validateHashedRecord(pack, "packetHash", "Provider packet");
  const manifestPath = resolve(ROOT, pack.executionManifest.path);
  if (!existsSync(manifestPath))
    throw new Error("Execution manifest is missing.");
  const manifest = readJson(manifestPath);
  validateHashedRecord(manifest, "manifestHash", "Execution manifest");
  const manifestIndex = readJson(
    join(
      ROOT,
      "planning-with-files/arcanea-visual-campaign/execution-manifests/index.json",
    ),
  );
  validateHashedRecord(manifestIndex, "indexHash", "Execution manifest index");
  const currentManifest = manifestIndex.current?.find(
    (entry) =>
      entry.manifestPath === pack.executionManifest.path &&
      entry.manifestHash === manifest.manifestHash &&
      entry.profileId === pack.profileId &&
      entry.round === round,
  );
  if (
    pack.executionManifest.hash !== manifest.manifestHash ||
    pack.profileId !== manifest.profileId ||
    pack.sourceContractSetHash !== manifest.sourceContractSetHash ||
    manifestIndex.schema !== "arcanea.provider_execution_manifest_index.v1" ||
    manifestIndex.campaignId !== campaign.meta.campaignId ||
    manifestIndex.currentCampaignVersion !== campaign.meta.version ||
    !currentManifest
  ) {
    throw new Error(
      "Provider packet, manifest index, and immutable execution manifest disagree.",
    );
  }

  const jobs = roundRecord.jobs;
  const executableIds = jobs
    .filter((job) => job.generationState !== "blocked")
    .map((job) => job.id);
  const receipts = outputReceipts(round);
  for (const receipt of receipts) {
    validateReceipt(receipt, campaign, jobs, manifest);
  }
  const recordedIds = [
    ...new Set(receipts.map(({ receipt }) => receipt.jobId)),
  ];
  const missingIds = executableIds.filter((id) => !recordedIds.includes(id));
  const blockedJobs = jobs
    .filter((job) => job.generationState === "blocked")
    .map((job) => ({ id: job.id, reason: job.blockedReason }));

  if (args.template) {
    console.log(
      JSON.stringify(
        executionGrantTemplate({
          campaign,
          round,
          pack,
          manifest,
          // The safe autonomous resume unit is one image. Broad grants remain
          // possible only when a human explicitly names a sorted --jobs set.
          jobIds: missingIds.slice(0, 1),
        }),
        null,
        2,
      ),
    );
    process.exit(0);
  }

  let preflight = null;
  let preflightPath = null;
  let grant = null;
  if (args.preflight) {
    preflightPath = resolve(args.preflight);
    preflight = validatePreflight(preflightPath);
  }
  if (args.grant && !preflight) {
    throw new Error("--preflight is required when --grant is supplied.");
  }
  if (args.grant) {
    grant = validateGrant({
      path: resolve(args.grant),
      preflight,
      preflightPath,
      campaign,
      round,
      pack,
      manifest,
      missingIds,
      jobs,
    });
  }

  const allExecutableRecorded = missingIds.length === 0;
  const readyForImageCalls = Boolean(
    grant && preflight && !allExecutableRecorded,
  );
  const state = allExecutableRecorded
    ? "review-frozen"
    : readyForImageCalls
      ? "round-running"
      : "execution-awaiting-authority";
  const blockers = [];
  if (!allExecutableRecorded && !preflight)
    blockers.push("fresh-machine-preflight-missing");
  if (!allExecutableRecorded && !grant)
    blockers.push("narrow-execution-grant-missing");
  const report = {
    schema: "arcanea.visual_execution_readiness.v1",
    campaignId: campaign.meta.campaignId,
    campaignVersion: campaign.meta.version,
    round,
    providerProfile,
    state,
    readyForImageCalls,
    executionManifest: pack.executionManifest,
    sourceContractSetHash: manifest.sourceContractSetHash,
    promptCompilerVersion: manifest.promptCompilerVersion,
    contractedJobs: jobs.length,
    executableJobs: executableIds.length,
    recordedJobs: recordedIds.length,
    missingJobIds: missingIds,
    blockedJobs,
    authorizedJobIds: grant?.jobIds ?? [],
    maximumCalls: grant?.maxCalls ?? 0,
    maximumParallelCalls: preflight?.maxParallelCalls ?? 0,
    authorizedModelPolicy: grant?.modelPolicy ?? null,
    authorizedModel: grant?.model ?? null,
    authorizedRuntimeParametersHash: grant?.runtimeParametersHash ?? null,
    blockers,
    nextAction: allExecutableRecorded
      ? `Freeze generation and run the opaque two-critic review for Round ${roundId}.`
      : readyForImageCalls
        ? `Resume at ${grant.jobIds[0]}; stop after the authorized ids or the first stop condition.`
        : `Capture a fresh allowed image-generation preflight and issue a hash-valid one-job grant${missingIds[0] ? ` for ${missingIds[0]}` : ""}.`,
  };

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(
      [
        `Arcanea visual readiness · Round ${roundId} · ${providerProfile}`,
        `State: ${state}`,
        `Manifest: ${pack.executionManifest.hash}`,
        `Recorded: ${recordedIds.length}/${executableIds.length} executable jobs`,
        `Authorized now: ${report.authorizedJobIds.length} jobs · max ${report.maximumCalls} calls · ${report.maximumParallelCalls} parallel`,
        `Blockers: ${blockers.length ? blockers.join(", ") : "none"}`,
        `Next: ${report.nextAction}`,
      ].join("\n"),
    );
  }
  if (args["require-ready"] && !readyForImageCalls) process.exit(2);
} catch (error) {
  console.error(`Readiness check failed: ${error.message}`);
  process.exit(2);
}
