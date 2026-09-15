import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = process.cwd();
const campaignPath = join(
  ROOT,
  "apps/web/data/arcanea-visual-campaign.v1.json",
);
const campaign = JSON.parse(readFileSync(campaignPath, "utf8"));
const roundArgIndex = process.argv.indexOf("--round");
const roundNumber =
  roundArgIndex >= 0 ? Number(process.argv[roundArgIndex + 1]) : 1;

if (!Number.isInteger(roundNumber) || roundNumber < 1 || roundNumber > 10) {
  console.error("--round must be an integer from 1 to 10.");
  process.exit(1);
}

const round = campaign.rounds.find(
  (candidate) => candidate.round === roundNumber,
);
if (!round) {
  console.error(`Round ${roundNumber} does not exist.`);
  process.exit(1);
}

const digest = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const asList = (values) => values.map((value) => `- ${value}`).join("\n");

let selectedStyle = null;
let selectedSecondaryMode = null;
let priorReflectionHash = null;
if (roundNumber > 1) {
  const priorId = String(roundNumber - 1).padStart(2, "0");
  const receiptPath = join(
    ROOT,
    `planning-with-files/arcanea-visual-reflections/round-${priorId}.json`,
  );
  if (!existsSync(receiptPath)) {
    console.error(
      `Round ${roundNumber} is adaptive. Missing prior reflection receipt: ${receiptPath}`,
    );
    process.exit(2);
  }
  const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
  const { receiptHash, ...receiptBody } = receipt;
  priorReflectionHash = receiptHash;
  const priorRound = campaign.rounds.find(
    (candidate) => candidate.round === roundNumber - 1,
  );
  const priorPackPath = join(
    ROOT,
    `planning-with-files/arcanea-visual-campaign/round-${priorId}-prompt-pack.json`,
  );
  if (!existsSync(priorPackPath)) {
    console.error(
      `Round ${roundNumber} is blocked because its prior prompt pack is missing: ${priorPackPath}`,
    );
    process.exit(2);
  }
  const priorPack = JSON.parse(readFileSync(priorPackPath, "utf8"));
  const expectedJobIds = priorRound.jobs.map((job) => job.id);
  const expectedGenerated = priorRound.jobs.filter(
    (job) => job.generationState !== "blocked",
  ).length;
  const expectedCandidates = priorRound.jobs
    .filter((job) => job.generationState !== "blocked")
    .map((job) => ({
      jobId: job.id,
      outputReceiptPath: job.output?.receiptPath,
    }));
  const candidateEvidenceMatches =
    receipt.candidates?.length === expectedCandidates.length &&
    expectedCandidates.every(({ jobId, outputReceiptPath }) => {
      const candidate = receipt.candidates.find((item) => item.jobId === jobId);
      return (
        typeof outputReceiptPath === "string" &&
        candidate?.outputReceiptPath === outputReceiptPath &&
        ["pass-candidate", "revise", "reject"].includes(candidate.verdict) &&
        ["approved", "revise", "rejected"].includes(candidate.humanVerdict)
      );
    });
  const benchmarkDecisionValid =
    roundNumber - 1 !== 1 ||
    (receipt.benchmarkReferenceState ===
      "text-conditioned-no-accepted-reference" &&
      receipt.benchmarkLimitationAcknowledged === true &&
      typeof receipt.identityComparabilityNotes === "string" &&
      receipt.identityComparabilityNotes.trim().length >= 80 &&
      typeof receipt.crossAnchorPortabilityNotes === "string" &&
      receipt.crossAnchorPortabilityNotes.trim().length >= 80);
  const blindReviewValid =
    receipt.blindReview?.mode === "style-blind-two-pass" &&
    typeof receipt.blindReview.criticPacketHash === "string" &&
    typeof receipt.blindReview.unblindingKeyHash === "string" &&
    typeof receipt.blindReview.sourceScorecards?.production?.hash ===
      "string" &&
    typeof receipt.blindReview.sourceScorecards?.independent?.hash === "string";
  if (
    receipt.schema !== "arcanea.visual_round_reflection.v1" ||
    receiptHash !== digest(receiptBody) ||
    receipt.campaignId !== campaign.meta.campaignId ||
    receipt.campaignVersion !== campaign.meta.version ||
    receipt.round !== roundNumber - 1 ||
    receipt.promptPackHash !== priorPack.packetHash ||
    JSON.stringify(receipt.jobIds) !== JSON.stringify(expectedJobIds) ||
    receipt.generated !== expectedGenerated ||
    receipt.validFiles !== expectedGenerated ||
    !candidateEvidenceMatches ||
    !benchmarkDecisionValid ||
    !blindReviewValid ||
    receipt.humanVerdict !== "accepted" ||
    receipt.nextRoundCompilationAllowed !== true ||
    !receipt.primaryStyleDecision ||
    receipt.primaryStyleDecision === "pending"
  ) {
    console.error(
      `Round ${roundNumber} is blocked until Round ${priorId} has a valid, complete, accepted reflection receipt.`,
    );
    process.exit(2);
  }
  selectedStyle = campaign.styles.find(
    (style) => style.id === receipt.primaryStyleDecision,
  );
  if (!selectedStyle) {
    console.error(
      `Unknown primary style in Round ${priorId} receipt: ${receipt.primaryStyleDecision}`,
    );
    process.exit(2);
  }
  selectedSecondaryMode = campaign.styles.find(
    (style) => style.id === receipt.secondaryModeDecision,
  );
  if (!selectedSecondaryMode || selectedSecondaryMode.id === selectedStyle.id) {
    console.error(
      `Round ${roundNumber} needs a distinct valid secondary mode in Round ${priorId}.`,
    );
    process.exit(2);
  }
}

const executableJobIds = round.jobs
  .filter((job) => job.generationState !== "blocked")
  .map((job) => job.id);
const secondaryProbeCount =
  roundNumber > 1 ? Math.min(2, Math.max(0, executableJobIds.length - 1)) : 0;
const secondaryProbeJobIds =
  roundNumber > 1
    ? [...executableJobIds]
        .sort((left, right) =>
          digest(`${priorReflectionHash}:${roundNumber}:${left}`).localeCompare(
            digest(`${priorReflectionHash}:${roundNumber}:${right}`),
          ),
        )
        .slice(0, secondaryProbeCount)
        .sort()
    : [];
const styleForJob = (job) =>
  roundNumber === 1
    ? (campaign.styles.find((style) => style.id === job.styleState) ?? null)
    : secondaryProbeJobIds.includes(job.id)
      ? selectedSecondaryMode
      : selectedStyle;

function compilePrompt(job, appliedStyle) {
  const contract = job.promptContract;
  const styleDirection =
    appliedStyle?.direction ?? contract.designSystem.direction;
  const avoid = appliedStyle
    ? [...contract.avoid, ...appliedStyle.avoid]
    : contract.avoid;
  return [
    `Create exactly one ${contract.output.aspectRatio} image for an Arcanea ${job.subjectKind} identity study.`,
    "",
    "PURPOSE",
    contract.intent,
    "",
    "SUBJECT — KEEP THESE FACTS STABLE",
    `${contract.subject.displayName}: ${contract.subject.identityLock}`,
    `Allowed variation: ${contract.subject.allowedVariation}`,
    "",
    "EVIDENCE AND GOVERNANCE",
    `Evidence state: ${contract.subject.evidenceState}`,
    `Open identity variables: ${
      contract.subject.openIdentityVariables.length
        ? contract.subject.openIdentityVariables.join("; ")
        : "none recorded"
    }`,
    `Release eligibility: ${contract.governance.releaseEligibility}`,
    `Required specialist reviews: ${
      contract.governance.reviewRequirements.length
        ? contract.governance.reviewRequirements.join("; ")
        : "none beyond standard human gates"
    }`,
    "",
    "STORY MOMENT",
    contract.storyBeat,
    "",
    "COMPOSITION",
    contract.composition,
    "",
    "OUTPUT CONTRACT",
    `Asset count: ${contract.output.assetCount}`,
    `Aspect ratio: ${contract.output.aspectRatio}`,
    `Intended surface: ${contract.output.intendedSurface}`,
    `Delivery role: ${contract.output.deliveryRole}`,
    `Crop safety: ${contract.output.cropSafety}`,
    `Generated text policy: ${contract.output.generatedTextPolicy}`,
    "",
    "ARCANEA VISUAL SYSTEM",
    styleDirection,
    contract.designSystem.colorLaw,
    contract.designSystem.escalation,
    contract.designSystem.materialLaw,
    contract.designSystem.typography,
    "",
    "LIGHT",
    contract.light,
    "",
    "ACCEPTANCE CONDITIONS",
    asList(contract.constraints),
    "",
    "AVOID",
    asList([...new Set(avoid)]),
  ].join("\n");
}

const jobs = round.jobs.map((job) => {
  const appliedStyle = styleForJob(job);
  const outputReceipt = job.receipts?.at(-1) ?? null;
  const receipt = outputReceipt
    ? JSON.parse(readFileSync(join(ROOT, outputReceipt), "utf8"))
    : null;
  return {
    id: job.id,
    name: job.name,
    generationState: job.generationState,
    blockedReason: job.blockedReason,
    canonState: job.canonState,
    identityState: job.identityState,
    evidenceState: job.evidenceState,
    openIdentityVariables: job.openIdentityVariables,
    reviewRequirements: job.reviewRequirements,
    sensitivityReviewRequired: job.sensitivityReviewRequired,
    releaseEligibility: job.releaseEligibility,
    rightsState: job.rightsState,
    releaseState: job.releaseState,
    styleState: appliedStyle?.id ?? job.styleState,
    sourceRefs: job.sourceRefs,
    promptContractHash: job.promptContract.contractHash,
    compiledPrompt:
      job.generationState === "blocked"
        ? null
        : compilePrompt(job, appliedStyle),
    providerExecution: receipt
      ? {
          adapter: receipt.execution.provider,
          model: receipt.execution.model,
          parameters: receipt.execution.parameters,
          referenceImages: receipt.execution.referenceHashes,
          qualifiedIdentityReferenceSet:
            receipt.execution.qualifiedIdentityReferenceSet ?? null,
          spendApprovedBy: receipt.execution.spendApprovedBy,
          machinePreflightReceipt: receipt.execution.machinePreflightReceipt,
        }
      : {
          adapter: "runtime-discovered",
          model: null,
          parameters: {},
          referenceImages: [],
          qualifiedIdentityReferenceSet: null,
          spendApprovedBy: null,
          machinePreflightReceipt: null,
        },
    outputReceipt,
  };
});

const generatedCount = jobs.filter((job) => job.outputReceipt !== null).length;

const packet = {
  schema: "arcanea.visual_round_prompt_pack.v1",
  campaignId: campaign.meta.campaignId,
  campaignVersion: campaign.meta.version,
  round: roundNumber,
  purpose: round.purpose,
  adaptiveDecision: round.adaptiveDecision,
  selectedStyle: selectedStyle?.id ?? null,
  selectedSecondaryMode: selectedSecondaryMode?.id ?? null,
  styleAllocation:
    roundNumber === 1
      ? {
          policy: "five-style-two-anchor-controlled-benchmark",
          primaryJobIds: [],
          secondaryProbeJobIds: [],
          selectionSeedHash: null,
        }
      : {
          policy:
            "adaptive-primary-with-two-deterministic-secondary-portability-probes",
          primaryJobIds: executableJobIds.filter(
            (id) => !secondaryProbeJobIds.includes(id),
          ),
          secondaryProbeJobIds,
          selectionSeedHash: digest({
            priorReflectionHash,
            round: roundNumber,
            executableJobIds,
          }),
        },
  status:
    generatedCount === 0
      ? "compiled-not-generated"
      : generatedCount ===
          jobs.filter((job) => job.generationState !== "blocked").length
        ? "generated-awaiting-evaluation"
        : "partially-generated",
  generatedCount,
  jobs,
};
packet.packetHash = digest(packet);

const roundId = String(roundNumber).padStart(2, "0");
const blindIdFor = (jobId) =>
  `BR-${roundId}-${createHash("sha256")
    .update(`${packet.packetHash}:${jobId}`)
    .digest("hex")
    .slice(0, 10)
    .toUpperCase()}`;
const jsonPath = `planning-with-files/arcanea-visual-campaign/round-${roundId}-prompt-pack.json`;
const markdownPath = `planning-with-files/arcanea-visual-campaign/round-${roundId}-prompt-pack.md`;
const reflectionPath = `planning-with-files/arcanea-visual-reflections/round-${roundId}.template.json`;
const evaluationPath = `planning-with-files/arcanea-visual-reflections/round-${roundId}.evaluation.template.json`;

const write = (relativePath, value) => {
  const target = join(ROOT, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, value.endsWith("\n") ? value : `${value}\n`, "utf8");
};

write(jsonPath, JSON.stringify(packet, null, 2));
write(
  markdownPath,
  [
    `# Arcanea visual campaign — Round ${roundId}`,
    "",
    `> Status: ${packet.status.replaceAll("-", " ")} · ${generatedCount} recorded outputs · ${jobs.filter((job) => job.generationState === "blocked").length} gated jobs · packet ${packet.packetHash.slice(0, 12)}`,
    "",
    round.purpose,
    "",
    ...jobs.flatMap((job) => [
      `## ${job.id} — ${job.name}`,
      "",
      `- State: ${job.generationState}`,
      `- Canon: ${job.canonState}`,
      `- Identity: ${job.identityState}`,
      `- Evidence: ${job.evidenceState}`,
      `- Release eligibility: ${job.releaseEligibility}`,
      `- Rights: ${job.rightsState}`,
      `- Style: ${job.styleState}`,
      ...(job.openIdentityVariables.length
        ? [`- Open identity variables: ${job.openIdentityVariables.join("; ")}`]
        : []),
      ...(job.reviewRequirements.length
        ? [`- Required reviews: ${job.reviewRequirements.join("; ")}`]
        : []),
      ...(job.blockedReason ? [`- Blocker: ${job.blockedReason}`] : []),
      "",
      ...(job.compiledPrompt ? ["```text", job.compiledPrompt, "```", ""] : []),
    ]),
  ].join("\n"),
);

write(
  evaluationPath,
  JSON.stringify(
    {
      schema: "arcanea.visual_round_evaluation.v1",
      campaignId: campaign.meta.campaignId,
      campaignVersion: campaign.meta.version,
      round: roundNumber,
      promptPackHash: packet.packetHash,
      rubricId: campaign.rubric.id,
      reviewProtocol: {
        mode: "style-blind-two-pass",
        blindReviewRequired: true,
        blindReviewCompleted: false,
        completeSeparateScorecardsBeforeUnblinding: true,
        referenceMaturity:
          roundNumber === 1
            ? "text-conditioned-no-accepted-reference"
            : "per-candidate-output-receipt",
        identityContinuityRule:
          "Without a verified accepted image reference, score source-fact stability only and cap identity continuity at 4/5.",
        benchmarkLimitation:
          roundNumber === 1
            ? campaign.adaptiveProtocol.benchmarkLimitation
            : null,
        criticPacketHash: null,
        unblindingKeyHash: null,
        sourceScorecards: {
          production: null,
          independent: null,
        },
      },
      judges: {
        production: {
          id: "arcanea-visual-director-critic",
          independentFromGeneration: false,
        },
        independent: { id: null, independentFromGeneration: true },
      },
      candidates: jobs
        .filter((job) => job.generationState !== "blocked")
        .map((job) => {
          const referenceState =
            job.providerExecution.qualifiedIdentityReferenceSet !== null
              ? "qualified-accepted-reference-set"
              : job.providerExecution.referenceImages.length === 0
                ? "text-conditioned-no-image-reference"
                : "execution-reference-present-unverified";
          return {
            blindId: blindIdFor(job.id),
            jobId: job.id,
            referenceState,
            identityContinuityCeiling:
              referenceState === "qualified-accepted-reference-set" ? 5 : 4,
            outputReceiptPath: job.outputReceipt,
            production: {
              scores: Object.fromEntries(
                campaign.rubric.dimensions.map((dimension) => [
                  dimension,
                  null,
                ]),
              ),
              evidence: Object.fromEntries(
                campaign.rubric.dimensions.map((dimension) => [dimension, ""]),
              ),
              verdict: "pending",
            },
            independent: {
              scores: Object.fromEntries(
                campaign.rubric.dimensions.map((dimension) => [
                  dimension,
                  null,
                ]),
              ),
              evidence: Object.fromEntries(
                campaign.rubric.dimensions.map((dimension) => [dimension, ""]),
              ),
              verdict: "pending",
            },
            humanVerdict: "pending",
          };
        }),
      decision: {
        failurePatterns: [],
        retainRules: [],
        reviseRules: [],
        retireRules: [],
        reconciliationNotes: "",
        benchmarkReferenceState:
          roundNumber === 1
            ? "text-conditioned-no-accepted-reference"
            : "not-applicable",
        benchmarkLimitationAcknowledged: roundNumber !== 1,
        identityComparabilityNotes: "",
        crossAnchorPortabilityNotes: "",
        primaryStyleDecision: selectedStyle?.id ?? "pending",
        secondaryModeDecision: selectedSecondaryMode?.id ?? "pending",
        humanVerdict: "pending",
        nextRoundCompilationAllowed: false,
      },
    },
    null,
    2,
  ),
);

write(
  reflectionPath,
  JSON.stringify(
    {
      schema: "arcanea.visual_round_reflection.v1",
      campaignId: campaign.meta.campaignId,
      campaignVersion: campaign.meta.version,
      round: roundNumber,
      promptPackHash: packet.packetHash,
      jobIds: jobs.map((job) => job.id),
      generated: generatedCount,
      validFiles: generatedCount,
      blocked: jobs.filter((job) => job.generationState === "blocked").length,
      scoreSummary: { median: null, range: null, hardFloorFailures: [] },
      topCandidates: [],
      failurePatterns: [],
      retainRules: [],
      reviseRules: [],
      retireRules: [],
      reconciliationNotes: "",
      benchmarkReferenceState:
        roundNumber === 1
          ? "text-conditioned-no-accepted-reference"
          : "not-applicable",
      benchmarkLimitationAcknowledged: roundNumber !== 1,
      identityComparabilityNotes: "",
      crossAnchorPortabilityNotes: "",
      primaryStyleDecision: selectedStyle?.id ?? "pending",
      secondaryModeDecision: selectedSecondaryMode?.id ?? "pending",
      humanVerdict: "pending",
      nextRoundCompilationAllowed: false,
      receiptHash: null,
    },
    null,
    2,
  ),
);

console.log(
  `Compiled Round ${roundId}: ${jobs.length} jobs, ${jobs.filter((job) => job.compiledPrompt).length} executable prompts, ${jobs.filter((job) => job.generationState === "blocked").length} gated.`,
);
