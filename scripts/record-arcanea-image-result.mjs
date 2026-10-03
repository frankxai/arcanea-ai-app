import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

import {
  inspectImageFileDecoded,
  verifyImageAspectRatio,
  verifyStoredImageMatchesSource,
} from "./lib/arcanea-image-metadata.mjs";
import { validateMachinePreflightReceipt } from "./lib/arcanea-machine-preflight.mjs";

const ROOT = process.cwd();
const campaign = JSON.parse(
  readFileSync(
    join(ROOT, "apps/web/data/arcanea-visual-campaign.v1.json"),
    "utf8",
  ),
);

function argsToObject(values) {
  const result = {};
  for (let index = 2; index < values.length; index += 1) {
    const key = values[index];
    if (!key.startsWith("--")) throw new Error(`Unexpected argument: ${key}`);
    if (key === "--dry-run") {
      result.dryRun = true;
      continue;
    }
    const value = values[index + 1];
    if (!value || value.startsWith("--"))
      throw new Error(`Missing value for ${key}`);
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

function safeJson(value, label) {
  try {
    return value ? JSON.parse(value) : {};
  } catch (error) {
    throw new Error(`${label} must be valid JSON: ${error.message}`);
  }
}

function sha(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function normalize(path) {
  return relative(ROOT, path).replaceAll("\\", "/");
}

try {
  const args = argsToObject(process.argv);
  const jobId = required(args, "job").toUpperCase();
  const sourceInput = resolve(required(args, "source"));
  const provider = required(args, "provider");
  const model = args.model ?? null;
  const providerParameters = safeJson(args.parameters, "--parameters");
  const generationReceipt = required(args, "generation-receipt");
  const preflightReceiptInput = required(args, "preflight-receipt");
  const executionGrantInput = required(args, "execution-grant");
  const spendApprovedBy = required(args, "spend-approved-by");
  const executionPromptHash = required(args, "execution-prompt-hash");
  const revision = Number(args.revision ?? "1");
  if (!Number.isInteger(revision) || revision < 1)
    throw new Error("--revision must be a positive integer.");
  if (!existsSync(sourceInput))
    throw new Error(`Source image does not exist: ${sourceInput}`);

  const job = campaign.rounds
    .flatMap((round) => round.jobs)
    .find((candidate) => candidate.id === jobId);
  if (!job) throw new Error(`Unknown campaign job: ${jobId}`);
  if (job.generationState === "blocked")
    throw new Error(`${jobId} is blocked: ${job.blockedReason}`);

  const executionManifestPath = ensureInside(
    required(args, "execution-manifest"),
    join(
      ROOT,
      "planning-with-files/arcanea-visual-campaign/execution-manifests",
    ),
    "Execution manifest",
  );
  if (!existsSync(executionManifestPath)) {
    throw new Error(
      `Execution manifest does not exist: ${executionManifestPath}`,
    );
  }
  const executionManifest = JSON.parse(
    readFileSync(executionManifestPath, "utf8"),
  );
  const { manifestHash, ...manifestBody } = executionManifest;
  const manifestIndexPath = join(
    ROOT,
    "planning-with-files/arcanea-visual-campaign/execution-manifests/index.json",
  );
  if (!existsSync(manifestIndexPath)) {
    throw new Error(
      "Execution manifest index is missing; recompile the provider packets.",
    );
  }
  const manifestIndex = JSON.parse(readFileSync(manifestIndexPath, "utf8"));
  const { indexHash, ...indexBody } = manifestIndex;
  const manifestIsCurrent = manifestIndex.current?.some(
    (entry) =>
      entry.manifestPath === normalize(executionManifestPath) &&
      entry.manifestHash === executionManifest.manifestHash &&
      entry.profileId === executionManifest.profileId &&
      entry.round === executionManifest.round,
  );
  const manifestJob = executionManifest.jobs?.find(
    (candidate) => candidate.id === job.id,
  );
  if (
    manifestIndex.schema !== "arcanea.provider_execution_manifest_index.v1" ||
    indexHash !== sha(indexBody) ||
    manifestIndex.campaignId !== campaign.meta.campaignId ||
    manifestIndex.currentCampaignVersion !== campaign.meta.version ||
    !manifestIsCurrent ||
    executionManifest.schema !== "arcanea.provider_execution_manifest.v1" ||
    manifestHash !== sha(manifestBody) ||
    executionManifest.campaignId !== campaign.meta.campaignId ||
    executionManifest.campaignVersion !== campaign.meta.version ||
    executionManifest.round !== job.round ||
    executionManifest.profile?.provider !== provider ||
    manifestJob?.executionState !== "executable" ||
    manifestJob.promptContractHash !== job.promptContract.contractHash ||
    manifestJob.executionPromptHash !== executionPromptHash
  ) {
    throw new Error(
      "Execution manifest is not current-active, or its provider, job contract, or execution-prompt hash is stale or mismatched.",
    );
  }
  const authorityRoot = join(
    ROOT,
    "planning-with-files/arcanea-visual-authority",
  );
  const preflightReceiptPath = ensureInside(
    preflightReceiptInput,
    authorityRoot,
    "Machine preflight receipt",
  );
  const executionGrantPath = ensureInside(
    executionGrantInput,
    authorityRoot,
    "Execution grant",
  );
  if (!existsSync(preflightReceiptPath) || !existsSync(executionGrantPath)) {
    throw new Error(
      "Machine preflight receipt and execution grant must exist.",
    );
  }
  const preflightReceipt = JSON.parse(
    readFileSync(preflightReceiptPath, "utf8"),
  );
  validateMachinePreflightReceipt(preflightReceipt, {
    requireExecutable: true,
  });
  const preflightReceiptHash = preflightReceipt.receiptHash;
  const executionGrant = JSON.parse(readFileSync(executionGrantPath, "utf8"));
  const { grantHash, ...grantBody } = executionGrant;
  const now = Date.now();
  const checkedAt = Date.parse(preflightReceipt.checkedAt);
  const preflightExpiresAt = Date.parse(preflightReceipt.expiresAt);
  const issuedAt = Date.parse(executionGrant.issuedAt);
  const grantExpiresAt = Date.parse(executionGrant.expiresAt);
  const stopAt = Date.parse(executionGrant.stopAt);
  const specialistEvidenceIds = new Set(
    (executionGrant.specialistReviewEvidence ?? []).map((item) => item.jobId),
  );
  if (
    executionGrant.schema !== "arcanea.visual_execution_grant.v1" ||
    grantHash !== sha(grantBody) ||
    executionGrant.campaignId !== campaign.meta.campaignId ||
    executionGrant.campaignVersion !== campaign.meta.version ||
    executionGrant.round !== job.round ||
    executionGrant.providerProfile !== executionManifest.profileId ||
    executionGrant.provider !== provider ||
    executionGrant.modelPolicy !== executionManifest.profile.modelPolicy ||
    (executionManifest.profile.modelPolicy !== "tool-managed-model-selection" &&
      (!model || executionGrant.model !== model)) ||
    (executionManifest.profile.modelPolicy === "tool-managed-model-selection" &&
      executionGrant.model !== model) ||
    executionGrant.runtimeParametersHash !==
      sha(executionGrant.runtimeParameters) ||
    JSON.stringify(executionGrant.runtimeParameters) !==
      JSON.stringify(providerParameters) ||
    executionGrant.executionManifestPath !== normalize(executionManifestPath) ||
    executionGrant.executionManifestHash !== executionManifest.manifestHash ||
    executionGrant.sourceContractSetHash !==
      executionManifest.sourceContractSetHash ||
    !Array.isArray(executionGrant.jobIds) ||
    !executionGrant.jobIds.includes(job.id) ||
    !Number.isInteger(executionGrant.maxCalls) ||
    executionGrant.maxCalls < executionGrant.jobIds.length ||
    executionGrant.maxCalls > 10 ||
    !Number.isInteger(executionGrant.maxRevisionCalls) ||
    executionGrant.maxRevisionCalls < 0 ||
    executionGrant.maxCalls >
      executionGrant.jobIds.length + executionGrant.maxRevisionCalls ||
    executionGrant.spendApprovedBy !== spendApprovedBy ||
    typeof executionGrant.rightsAndLikenessAttestedBy !== "string" ||
    executionGrant.rightsAndLikenessAttestedBy.trim().length < 2 ||
    executionGrant.machinePreflightReceiptPath !==
      normalize(preflightReceiptPath) ||
    executionGrant.machinePreflightReceiptHash !== preflightReceiptHash ||
    executionGrant.outputRoot !==
      "planning-with-files/arcanea-visual-assets/v1" ||
    typeof executionGrant.authorityEvidence !== "string" ||
    executionGrant.authorityEvidence.trim().length < 12 ||
    executionGrant.humanAttestation !== true ||
    !Number.isFinite(issuedAt) ||
    !Number.isFinite(grantExpiresAt) ||
    !Number.isFinite(stopAt) ||
    issuedAt < checkedAt ||
    issuedAt > now ||
    stopAt <= now ||
    stopAt > grantExpiresAt ||
    grantExpiresAt > preflightExpiresAt ||
    (job.sensitivityReviewRequired && !specialistEvidenceIds.has(job.id))
  ) {
    throw new Error(
      "Machine preflight or execution grant is stale, mismatched, over-broad, or missing required human authority.",
    );
  }
  const referenceHashes = (args["reference-hashes"] ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const plannedReferenceHashes =
    manifestJob.referencePlan?.currentReferenceHashes ?? [];
  if (
    JSON.stringify([...referenceHashes].sort()) !==
    JSON.stringify([...plannedReferenceHashes].sort())
  ) {
    throw new Error(
      "Recorded reference hashes must exactly match the immutable execution manifest.",
    );
  }

  const roundId = String(job.round).padStart(2, "0");
  const receiptRoot = join(ROOT, "planning-with-files/arcanea-visual-results");
  const receiptPath = ensureInside(
    join(receiptRoot, `${job.id.toLowerCase()}-r${revision}.json`),
    receiptRoot,
    "Receipt path",
  );
  const priorGrantReceipts = existsSync(receiptRoot)
    ? readdirSync(receiptRoot)
        .filter((name) => /^acv-\d{3}-r\d+\.json$/i.test(name))
        .map((name) =>
          JSON.parse(readFileSync(join(receiptRoot, name), "utf8")),
        )
        .filter(
          (receipt) => receipt.execution?.executionGrantHash === grantHash,
        )
    : [];
  const existingTargetUsesGrant = priorGrantReceipts.some(
    (receipt) => receipt.jobId === job.id && receipt.revision === revision,
  );
  if (
    !existingTargetUsesGrant &&
    (priorGrantReceipts.length >= executionGrant.maxCalls ||
      (revision > 1 &&
        priorGrantReceipts.filter((receipt) => receipt.revision > 1).length >=
          executionGrant.maxRevisionCalls))
  ) {
    throw new Error("Execution grant call or revision budget is exhausted.");
  }
  const duplicateGenerationReceipt = priorGrantReceipts.find(
    (receipt) =>
      receipt.execution?.generationReceipt === generationReceipt &&
      (receipt.jobId !== job.id || receipt.revision !== revision),
  );
  if (duplicateGenerationReceipt) {
    throw new Error(
      "Provider generation receipt is already bound to another output.",
    );
  }

  const source = realpathSync(sourceInput);
  const metadata = await inspectImageFileDecoded(source);
  const aspectRatioCheck = verifyImageAspectRatio(
    metadata.width,
    metadata.height,
    job.promptContract.output.aspectRatio,
  );
  const extension = metadata.format === "jpeg" ? ".jpg" : `.${metadata.format}`;
  const assetRoot = join(ROOT, "planning-with-files/arcanea-visual-assets/v1");
  const destination = ensureInside(
    join(
      assetRoot,
      `round-${roundId}`,
      `${job.id.toLowerCase()}-r${revision}${extension}`,
    ),
    assetRoot,
    "Destination",
  );
  const storagePath = relative(ROOT, destination).replaceAll("\\", "/");
  let existingReceipt = null;
  if (existsSync(receiptPath)) {
    existingReceipt = JSON.parse(readFileSync(receiptPath, "utf8"));
    const { receiptHash, ...existingBody } = existingReceipt;
    if (
      existingReceipt.schema !== "arcanea.visual_output_receipt.v1" ||
      receiptHash !== sha(existingBody)
    ) {
      throw new Error(`Existing receipt is invalid: ${receiptPath}`);
    }
  }

  const receiptBody = {
    schema: "arcanea.visual_output_receipt.v1",
    campaignId: campaign.meta.campaignId,
    campaignVersion: campaign.meta.version,
    jobId: job.id,
    round: job.round,
    revision,
    promptContractHash: job.promptContract.contractHash,
    sourceRefs: job.sourceRefs,
    canonState: job.canonState,
    identityState: job.identityState,
    rightsState:
      args["rights-state"] ?? "internal-draft-source-review-required",
    releaseState: "internal-review",
    execution: {
      provider,
      providerProfile: executionManifest.profileId,
      modelPolicy: executionManifest.profile.modelPolicy,
      model,
      parameters: providerParameters,
      generationReceipt,
      machinePreflightReceipt: normalize(preflightReceiptPath),
      machinePreflightReceiptHash: preflightReceiptHash,
      executionGrantPath: normalize(executionGrantPath),
      executionGrantHash: grantHash,
      spendApprovedBy,
      rightsAndLikenessAttestedBy: executionGrant.rightsAndLikenessAttestedBy,
      authorityEvidence: executionGrant.authorityEvidence,
      humanAttestation: executionGrant.humanAttestation,
      specialistReviewEvidence: executionGrant.specialistReviewEvidence,
      executionManifestPath: normalize(executionManifestPath),
      executionManifestHash: executionManifest.manifestHash,
      sourceContractSetHash: executionManifest.sourceContractSetHash,
      promptCompilerVersion: executionManifest.promptCompilerVersion,
      executionPromptHash,
      referenceHashes,
      qualifiedIdentityReferenceSet:
        manifestJob.referencePlan?.qualifiedIdentityReferenceSet ?? null,
      acceptedReferences: manifestJob.referencePlan?.acceptedReferences ?? [],
    },
    output: {
      storagePath,
      publicUrl: null,
      fileName: basename(destination),
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      bytes: metadata.bytes,
      sha256: metadata.sha256,
      ingestSourceName: basename(source),
    },
    deterministicChecks: {
      decoded: metadata.decoded,
      dimensionsRecorded: true,
      declaredAspectRatio: aspectRatioCheck.declaredAspectRatio,
      actualAspectRatio: aspectRatioCheck.actualAspectRatio,
      aspectRatioRelativeError: aspectRatioCheck.aspectRatioRelativeError,
      aspectRatioTolerance: aspectRatioCheck.aspectRatioTolerance,
      aspectRatioMatchesContract: aspectRatioCheck.aspectRatioMatchesContract,
      storedCopyDecoded: true,
      storedBytesMatchSource: true,
      storedDimensionsMatchSource: true,
      hashRecorded: true,
      promptHashMatchesCampaign: true,
    },
    createdAt: existingReceipt?.createdAt ?? new Date().toISOString(),
  };
  const receipt = { ...receiptBody, receiptHash: sha(receiptBody) };

  if (args.dryRun) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          jobId: job.id,
          source,
          internalDestination: destination,
          metadata,
          aspectRatioCheck,
          receiptSchema: receipt.schema,
          receiptWriteAllowed: false,
          pendingChecks: [
            "copy source into internal storage",
            "fully decode stored copy",
            "prove stored format, dimensions, byte count, and SHA-256 match the ingest source",
          ],
          executionGrantHash: grantHash,
          machinePreflightReceiptHash: preflightReceiptHash,
          executionManifestHash: executionManifest.manifestHash,
          executionPromptHash,
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }

  mkdirSync(dirname(destination), { recursive: true });
  if (!existsSync(destination)) {
    copyFileSync(source, destination);
  }
  const storedMetadata = await inspectImageFileDecoded(destination);
  verifyStoredImageMatchesSource(
    metadata,
    storedMetadata,
    job.promptContract.output.aspectRatio,
  );

  mkdirSync(dirname(receiptPath), { recursive: true });
  if (existingReceipt) {
    if (existingReceipt.receiptHash !== receipt.receiptHash) {
      throw new Error(
        `Receipt already exists with different content: ${receiptPath}`,
      );
    }
  } else {
    writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  }

  console.log(
    `Recorded ${job.id} r${revision}: ${metadata.width}x${metadata.height}, ${metadata.sha256.slice(0, 12)}, ${storagePath}`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
