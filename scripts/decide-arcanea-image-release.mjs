import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

const ROOT = process.cwd();
const campaign = JSON.parse(
  readFileSync(
    join(ROOT, "apps/web/data/arcanea-visual-campaign.v1.json"),
    "utf8",
  ),
);

const sha = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const normalize = (path) => relative(ROOT, path).replaceAll("\\", "/");

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

function specialistReviewEvidence(args, job) {
  const evidence = required(args, "sensitivity-gate", 5);
  if (!job.sensitivityReviewRequired) return evidence;
  if (
    evidence.length < 24 ||
    /^(?:n\/?a|none|not[ -]required|not[ -]applicable)\b/i.test(evidence)
  ) {
    throw new Error(
      `${job.id} requires specific sensitivity-review evidence, not a generic not-applicable attestation.`,
    );
  }
  return evidence;
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

function readHashedReceipt(path, schema, label) {
  if (!existsSync(path)) throw new Error(`${label} does not exist: ${path}`);
  const receipt = JSON.parse(readFileSync(path, "utf8"));
  const { receiptHash, ...body } = receipt;
  if (receipt.schema !== schema || receiptHash !== sha(body)) {
    throw new Error(`${label} has an invalid schema or hash: ${path}`);
  }
  return receipt;
}

try {
  const args = argsToObject(process.argv);
  const jobId = required(args, "job").toUpperCase();
  const outputRevision = Number(required(args, "revision"));
  const decision = required(args, "decision").toLowerCase();
  const decidedBy = required(args, "decided-by", 3);
  if (!Number.isInteger(outputRevision) || outputRevision < 1) {
    throw new Error("--revision must be a positive integer.");
  }
  if (!["approved", "rejected", "published"].includes(decision)) {
    throw new Error("--decision must be approved, rejected, or published.");
  }
  if (required(args, "human-attestation") !== "confirmed") {
    throw new Error(
      '--human-attestation must be exactly "confirmed" after a human reviews the decision.',
    );
  }

  const job = campaign.rounds
    .flatMap((round) => round.jobs)
    .find((candidate) => candidate.id === jobId);
  if (!job) throw new Error(`Unknown campaign job: ${jobId}`);
  if (job.generationState === "blocked") {
    throw new Error(`${jobId} is blocked: ${job.blockedReason}`);
  }

  const outputReceiptPath = ensureInside(
    join(
      "planning-with-files/arcanea-visual-results",
      `${jobId.toLowerCase()}-r${outputRevision}.json`,
    ),
    "planning-with-files/arcanea-visual-results",
    "Output receipt",
  );
  const outputReceipt = readHashedReceipt(
    outputReceiptPath,
    "arcanea.visual_output_receipt.v1",
    "Output receipt",
  );
  const relativeOutputReceiptPath = normalize(outputReceiptPath);
  if (
    outputReceipt.campaignId !== campaign.meta.campaignId ||
    outputReceipt.campaignVersion !== campaign.meta.version ||
    outputReceipt.jobId !== jobId ||
    outputReceipt.round !== job.round ||
    outputReceipt.revision !== outputRevision ||
    outputReceipt.promptContractHash !== job.promptContract.contractHash ||
    outputReceipt.releaseState !== "internal-review"
  ) {
    throw new Error("Output receipt does not match the active campaign job.");
  }
  if (
    typeof outputReceipt.output?.storagePath !== "string" ||
    outputReceipt.output.publicUrl !== null
  ) {
    throw new Error(
      "Unapproved output receipts must reference internal storage and no public URL.",
    );
  }
  const imagePath = ensureInside(
    outputReceipt.output.storagePath,
    "planning-with-files/arcanea-visual-assets",
    "Internal output image",
  );
  if (!existsSync(imagePath)) {
    throw new Error(`Output image does not exist: ${imagePath}`);
  }
  const imageBytes = readFileSync(imagePath);
  const imageSha256 = createHash("sha256").update(imageBytes).digest("hex");
  if (
    imageSha256 !== outputReceipt.output.sha256 ||
    imageBytes.length !== outputReceipt.output.bytes
  ) {
    throw new Error("Output image bytes do not match the output receipt.");
  }

  const releaseRoot = join(ROOT, "planning-with-files/arcanea-visual-releases");
  const decisionPath = ensureInside(
    join(
      releaseRoot,
      `${jobId.toLowerCase()}-r${outputRevision}-${decision}.json`,
    ),
    releaseRoot,
    "Release decision",
  );
  const approvedPath = join(
    releaseRoot,
    `${jobId.toLowerCase()}-r${outputRevision}-approved.json`,
  );
  const rejectedPath = join(
    releaseRoot,
    `${jobId.toLowerCase()}-r${outputRevision}-rejected.json`,
  );
  const publicRoot = join(ROOT, "apps/web/public");
  const publicAssetRoot = join(publicRoot, "images/arcanea-campaign/v1");
  let stagedPath = null;
  if (decision === "approved" && existsSync(rejectedPath)) {
    throw new Error(
      "This output revision is rejected. Create a new image revision instead of reversing its append-only decision.",
    );
  }
  if (decision === "rejected" && existsSync(approvedPath)) {
    throw new Error(
      "This output revision is approved and cannot also be rejected.",
    );
  }

  let existingReceipt = null;
  if (existsSync(decisionPath)) {
    existingReceipt = readHashedReceipt(
      decisionPath,
      "arcanea.visual_release_decision.v1",
      "Existing release decision",
    );
  }

  const receiptBody = {
    schema: "arcanea.visual_release_decision.v1",
    campaignId: campaign.meta.campaignId,
    campaignVersion: campaign.meta.version,
    jobId,
    round: job.round,
    outputRevision,
    outputReceiptPath: relativeOutputReceiptPath,
    outputReceiptHash: outputReceipt.receiptHash,
    imageSha256,
    decision,
    decidedBy,
    humanAttestation: true,
    reason: null,
    gates: null,
    evaluationReflectionPath: null,
    evaluationReceiptHash: null,
    reconciledTotal: null,
    previousDecisionReceipt: null,
    previousDecisionHash: null,
    publicationEvidence: null,
    stagedPublicUrl: null,
    stagedPublicSha256: null,
    releaseEligibility: job.releaseEligibility ?? "candidate-after-human-gates",
    requiredReviews: job.reviewRequirements ?? [],
    createdAt: existingReceipt?.createdAt ?? new Date().toISOString(),
  };

  if (decision === "approved") {
    if (job.releaseEligibility === "internal-only-until-identity-lock") {
      throw new Error(
        `${jobId} is an identity-discovery study and cannot be approved or staged publicly until its open identity variables are resolved in a new versioned contract.`,
      );
    }
    const reflectionPath = ensureInside(
      required(args, "evaluation-reflection"),
      "planning-with-files/arcanea-visual-reflections",
      "Evaluation reflection",
    );
    const reflection = readHashedReceipt(
      reflectionPath,
      "arcanea.visual_round_reflection.v1",
      "Evaluation reflection",
    );
    const candidate = reflection.candidates?.find(
      (item) => item.jobId === jobId,
    );
    if (
      reflection.campaignId !== campaign.meta.campaignId ||
      reflection.campaignVersion !== campaign.meta.version ||
      reflection.round !== job.round ||
      candidate?.outputReceiptPath !== relativeOutputReceiptPath ||
      candidate?.verdict !== "pass-candidate" ||
      candidate?.humanVerdict !== "approved"
    ) {
      throw new Error(
        "Approval requires this exact output to pass independent evaluation and receive a human-approved candidate verdict.",
      );
    }
    receiptBody.gates = {
      canon: required(args, "canon-gate", 5),
      identity: required(args, "identity-gate", 5),
      rights: required(args, "rights-gate", 5),
      brand: required(args, "brand-gate", 5),
      sensitivity: specialistReviewEvidence(args, job),
    };
    receiptBody.evaluationReflectionPath = normalize(reflectionPath);
    receiptBody.evaluationReceiptHash = reflection.receiptHash;
    receiptBody.reconciledTotal = candidate.reconciledTotal;
    if (
      typeof outputReceipt.output.fileName !== "string" ||
      basename(outputReceipt.output.fileName) !== outputReceipt.output.fileName
    ) {
      throw new Error("Output receipt has an invalid file name.");
    }
    stagedPath = ensureInside(
      join(
        publicAssetRoot,
        `round-${String(job.round).padStart(2, "0")}`,
        outputReceipt.output.fileName,
      ),
      publicAssetRoot,
      "Staged public image",
    );
    receiptBody.stagedPublicUrl = stagedPath
      .slice(publicRoot.length)
      .replaceAll("\\", "/");
    receiptBody.stagedPublicSha256 = imageSha256;
  }

  if (decision === "rejected") {
    receiptBody.reason = required(args, "reason", 12);
  }

  if (decision === "published") {
    const approved = readHashedReceipt(
      approvedPath,
      "arcanea.visual_release_decision.v1",
      "Prior approval decision",
    );
    if (
      approved.decision !== "approved" ||
      approved.jobId !== jobId ||
      approved.outputRevision !== outputRevision ||
      approved.outputReceiptHash !== outputReceipt.receiptHash
    ) {
      throw new Error("Publication does not chain to this output's approval.");
    }
    const approvedStagedPath = ensureInside(
      join(publicRoot, (approved.stagedPublicUrl ?? "").replace(/^[/\\]+/, "")),
      publicAssetRoot,
      "Approved staged image",
    );
    if (
      !approved.stagedPublicUrl?.startsWith("/images/arcanea-campaign/") ||
      !existsSync(approvedStagedPath) ||
      createHash("sha256")
        .update(readFileSync(approvedStagedPath))
        .digest("hex") !== imageSha256
    ) {
      throw new Error(
        "Publication requires the exact approved bytes in the staged public asset tree.",
      );
    }
    receiptBody.previousDecisionReceipt = normalize(approvedPath);
    receiptBody.previousDecisionHash = approved.receiptHash;
    receiptBody.publicationEvidence = required(args, "publication-evidence", 8);
  }

  const receipt = { ...receiptBody, receiptHash: sha(receiptBody) };
  if (existingReceipt && existingReceipt.receiptHash !== receipt.receiptHash) {
    throw new Error(
      `Release decision already exists with different content: ${decisionPath}`,
    );
  }

  if (args.dryRun) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          jobId,
          outputRevision,
          decision,
          decisionPath,
          receiptHash: receipt.receiptHash,
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }

  if (stagedPath) {
    mkdirSync(dirname(stagedPath), { recursive: true });
    if (existsSync(stagedPath)) {
      const stagedHash = createHash("sha256")
        .update(readFileSync(stagedPath))
        .digest("hex");
      if (stagedHash !== imageSha256) {
        throw new Error(
          `Staged public path already contains different bytes: ${stagedPath}`,
        );
      }
    } else {
      copyFileSync(imagePath, stagedPath);
    }
  }
  mkdirSync(dirname(decisionPath), { recursive: true });
  if (!existingReceipt) {
    writeFileSync(
      decisionPath,
      `${JSON.stringify(receipt, null, 2)}\n`,
      "utf8",
    );
  }
  console.log(
    `Recorded ${decision} decision for ${jobId} r${outputRevision}: ${normalize(decisionPath)}`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
