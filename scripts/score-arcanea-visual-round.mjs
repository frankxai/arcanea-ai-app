import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { inspectImageFileDecoded } from "./lib/arcanea-image-metadata.mjs";

const ROOT = process.cwd();
const campaign = JSON.parse(
  readFileSync(
    join(ROOT, "apps/web/data/arcanea-visual-campaign.v1.json"),
    "utf8",
  ),
);
const sha = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");

function getArg(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function fail(message) {
  throw new Error(message);
}

function ensureInside(relativeOrAbsolute, parent, label) {
  const absolute = resolve(ROOT, relativeOrAbsolute);
  const absoluteParent = resolve(ROOT, parent);
  if (
    absolute !== absoluteParent &&
    !absolute.startsWith(`${absoluteParent}\\`) &&
    !absolute.startsWith(`${absoluteParent}/`)
  ) {
    fail(`${label} must remain inside ${absoluteParent}.`);
  }
  return absolute;
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function scoreReview(review, jobId, judgeName) {
  const dimensions = campaign.rubric.dimensions;
  if (!review || typeof review !== "object")
    fail(`${jobId} is missing ${judgeName} review.`);
  const keys = Object.keys(review.scores ?? {});
  if (
    keys.length !== dimensions.length ||
    !dimensions.every((dimension) => keys.includes(dimension))
  ) {
    fail(
      `${jobId} ${judgeName} scores must contain the exact ten rubric dimensions.`,
    );
  }
  const scores = dimensions.map((dimension) => {
    const score = review.scores[dimension];
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      fail(
        `${jobId} ${judgeName} score for "${dimension}" must be an integer from 1–5.`,
      );
    }
    const evidence = review.evidence?.[dimension];
    if (typeof evidence !== "string" || evidence.trim().length < 12) {
      fail(`${jobId} ${judgeName} needs visible evidence for "${dimension}".`);
    }
    return score;
  });
  if (!["pass", "revise", "reject"].includes(review.verdict)) {
    fail(`${jobId} ${judgeName} verdict must be pass, revise, or reject.`);
  }
  return {
    total: scores.reduce((sum, score) => sum + score, 0),
    scores: review.scores,
    verdict: review.verdict,
  };
}

function loadSealedScorecard({ source, role, roundNumber, evaluation, pack }) {
  if (
    !source ||
    typeof source.path !== "string" ||
    typeof source.hash !== "string"
  ) {
    fail(`reviewProtocol.sourceScorecards.${role} is required.`);
  }
  const path = ensureInside(
    source.path,
    "planning-with-files/arcanea-visual-reflections",
    `${role} sealed scorecard`,
  );
  if (!existsSync(path)) fail(`${role} sealed scorecard does not exist.`);
  const scorecard = JSON.parse(readFileSync(path, "utf8"));
  const { scorecardHash, ...scorecardBody } = scorecard;
  if (
    scorecard.schema !== "arcanea.visual_blind_scorecard.v1" ||
    scorecard.campaignId !== campaign.meta.campaignId ||
    scorecard.campaignVersion !== campaign.meta.version ||
    scorecard.round !== roundNumber ||
    scorecard.promptPackHash !== pack.packetHash ||
    scorecard.completedBeforeUnblinding !== true ||
    scorecard.judge?.role !== role ||
    scorecard.judge.independentFromGeneration !== (role === "independent") ||
    scorecardHash !== sha(scorecardBody) ||
    source.hash !== scorecardHash ||
    scorecard.criticPacketHash !== evaluation.reviewProtocol.criticPacketHash
  ) {
    fail(`${role} sealed scorecard is stale, unsealed, or mismatched.`);
  }
  return scorecard;
}

function reviewMatchesScorecard(review, sealedCandidate) {
  return (
    review?.verdict === sealedCandidate?.verdict &&
    campaign.rubric.dimensions.every(
      (dimension) =>
        review?.scores?.[dimension] === sealedCandidate?.scores?.[dimension] &&
        review?.evidence?.[dimension] ===
          sealedCandidate?.evidence?.[dimension],
    )
  );
}

function hasQualifiedIdentityReferenceSet(receipt, job) {
  const qualified = receipt.execution?.qualifiedIdentityReferenceSet;
  if (!qualified) return false;
  const setPath = ensureInside(
    qualified.setPath ?? "",
    "planning-with-files/arcanea-visual-references",
    `${job.id} identity reference set`,
  );
  const assignmentPath = ensureInside(
    qualified.assignmentPath ?? "",
    "planning-with-files/arcanea-visual-reference-assignments",
    `${job.id} reference assignment`,
  );
  if (!existsSync(setPath) || !existsSync(assignmentPath)) {
    fail(`${job.id} qualified reference evidence is missing.`);
  }
  const setReceipt = JSON.parse(readFileSync(setPath, "utf8"));
  const { receiptHash: setHash, ...setBody } = setReceipt;
  const assignment = JSON.parse(readFileSync(assignmentPath, "utf8"));
  const { receiptHash: assignmentHash, ...assignmentBody } = assignment;
  if (
    setReceipt.schema !== "arcanea.visual_identity_reference_set.v1" ||
    setHash !== sha(setBody) ||
    setHash !== qualified.setHash ||
    setReceipt.entityId !== job.entityId ||
    setReceipt.qualification !== "identity-regression-qualified" ||
    assignment.schema !== "arcanea.visual_reference_assignment.v1" ||
    assignmentHash !== sha(assignmentBody) ||
    assignmentHash !== qualified.assignmentHash ||
    assignment.jobId !== job.id ||
    assignment.entityId !== job.entityId ||
    assignment.identityReferenceSetHash !== setHash ||
    assignment.promptContractHash !== job.promptContract.contractHash ||
    JSON.stringify(
      [...assignment.selected.map((reference) => reference.imageSha256)].sort(),
    ) !== JSON.stringify([...(receipt.execution.referenceHashes ?? [])].sort())
  ) {
    fail(`${job.id} qualified reference set or assignment is invalid.`);
  }
  return true;
}

try {
  const roundNumber = Number(getArg("round", "1"));
  if (!Number.isInteger(roundNumber) || roundNumber < 1 || roundNumber > 10) {
    fail("--round must be an integer from 1–10.");
  }
  const roundId = String(roundNumber).padStart(2, "0");
  const inputPath = ensureInside(
    getArg(
      "input",
      `planning-with-files/arcanea-visual-reflections/round-${roundId}.evaluation.json`,
    ),
    "planning-with-files/arcanea-visual-reflections",
    "Evaluation input",
  );
  if (!existsSync(inputPath))
    fail(`Evaluation input does not exist: ${inputPath}`);
  const evaluation = JSON.parse(readFileSync(inputPath, "utf8"));
  const round = campaign.rounds.find(
    (candidate) => candidate.round === roundNumber,
  );
  if (!round) fail(`Campaign round ${roundNumber} does not exist.`);
  const packPath = join(
    ROOT,
    `planning-with-files/arcanea-visual-campaign/round-${roundId}-prompt-pack.json`,
  );
  if (!existsSync(packPath)) fail(`Prompt pack does not exist: ${packPath}`);
  const pack = JSON.parse(readFileSync(packPath, "utf8"));

  if (evaluation.schema !== "arcanea.visual_round_evaluation.v1")
    fail("Wrong evaluation schema.");
  if (
    evaluation.campaignId !== campaign.meta.campaignId ||
    evaluation.round !== roundNumber
  ) {
    fail("Evaluation campaign or round does not match the active campaign.");
  }
  if (evaluation.promptPackHash !== pack.packetHash)
    fail("Evaluation prompt-pack hash is stale.");
  if (evaluation.rubricId !== campaign.rubric.id)
    fail("Evaluation rubric is stale.");
  if (
    !evaluation.judges?.production?.id ||
    !evaluation.judges?.independent?.id
  ) {
    fail("Both production and independent judge ids are required.");
  }
  if (evaluation.judges.production.id === evaluation.judges.independent.id) {
    fail("Independent review requires a different judge identity.");
  }
  if (evaluation.judges.independent.independentFromGeneration !== true) {
    fail("The independent judge must attest independence from generation.");
  }
  if (
    evaluation.reviewProtocol?.mode !== "style-blind-two-pass" ||
    evaluation.reviewProtocol.blindReviewRequired !== true ||
    evaluation.reviewProtocol.blindReviewCompleted !== true ||
    evaluation.reviewProtocol.completeSeparateScorecardsBeforeUnblinding !==
      true ||
    typeof evaluation.reviewProtocol.criticPacketHash !== "string" ||
    typeof evaluation.reviewProtocol.unblindingKeyHash !== "string"
  ) {
    fail(
      "Evaluation requires a completed style-blind two-pass review before unblinding.",
    );
  }
  const productionScorecard = loadSealedScorecard({
    source: evaluation.reviewProtocol.sourceScorecards?.production,
    role: "production",
    roundNumber,
    evaluation,
    pack,
  });
  const independentScorecard = loadSealedScorecard({
    source: evaluation.reviewProtocol.sourceScorecards?.independent,
    role: "independent",
    roundNumber,
    evaluation,
    pack,
  });
  if (
    productionScorecard.judge.id !== evaluation.judges.production.id ||
    independentScorecard.judge.id !== evaluation.judges.independent.id ||
    productionScorecard.judge.id === independentScorecard.judge.id
  ) {
    fail("Evaluation judge identities do not match the sealed scorecards.");
  }

  const expectedJobs = round.jobs.filter(
    (job) => job.generationState !== "blocked",
  );
  const candidateIds =
    evaluation.candidates?.map((candidate) => candidate.jobId) ?? [];
  if (
    candidateIds.length !== expectedJobs.length ||
    new Set(candidateIds).size !== candidateIds.length ||
    !expectedJobs.every((job) => candidateIds.includes(job.id))
  ) {
    fail(
      "Evaluation candidates must exactly match the round's non-blocked jobs.",
    );
  }
  const expectedBlindIds = expectedJobs.map(
    (job) =>
      `BR-${roundId}-${createHash("sha256")
        .update(`${pack.packetHash}:${job.id}`)
        .digest("hex")
        .slice(0, 10)
        .toUpperCase()}`,
  );
  for (const [role, scorecard] of [
    ["production", productionScorecard],
    ["independent", independentScorecard],
  ]) {
    const ids =
      scorecard.candidates?.map((candidate) => candidate.blindId) ?? [];
    if (
      ids.length !== expectedBlindIds.length ||
      new Set(ids).size !== ids.length ||
      !expectedBlindIds.every((blindId) => ids.includes(blindId))
    ) {
      fail(`${role} sealed scorecard does not cover the exact blind set.`);
    }
  }

  const hardFloorDimensions = Object.keys(campaign.rubric.hardFloors);
  const scored = [];
  const hardFloorFailures = [];
  const disagreements = [];

  for (const candidate of evaluation.candidates) {
    const job = expectedJobs.find((item) => item.id === candidate.jobId);
    const expectedBlindId = `BR-${roundId}-${createHash("sha256")
      .update(`${pack.packetHash}:${candidate.jobId}`)
      .digest("hex")
      .slice(0, 10)
      .toUpperCase()}`;
    if (candidate.blindId !== expectedBlindId) {
      fail(`${candidate.jobId} has an invalid blind-review id.`);
    }
    const sealedProduction = productionScorecard.candidates.find(
      (item) => item.blindId === candidate.blindId,
    );
    const sealedIndependent = independentScorecard.candidates.find(
      (item) => item.blindId === candidate.blindId,
    );
    if (
      !reviewMatchesScorecard(candidate.production, sealedProduction) ||
      !reviewMatchesScorecard(candidate.independent, sealedIndependent)
    ) {
      fail(
        `${candidate.jobId} scores or evidence changed after the blind scorecards were sealed.`,
      );
    }
    const receiptPath = ensureInside(
      candidate.outputReceiptPath ?? "",
      "planning-with-files/arcanea-visual-results",
      `${candidate.jobId} output receipt`,
    );
    if (!candidate.outputReceiptPath || !existsSync(receiptPath)) {
      fail(`${candidate.jobId} has no output receipt.`);
    }
    const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
    const { receiptHash, ...receiptBody } = receipt;
    if (receiptHash !== sha(receiptBody))
      fail(`${candidate.jobId} output receipt hash is invalid.`);
    if (
      receipt.jobId !== candidate.jobId ||
      receipt.promptContractHash !== job.promptContract.contractHash
    ) {
      fail(
        `${candidate.jobId} output receipt does not match the campaign contract.`,
      );
    }
    const qualifiedReferenceSet = hasQualifiedIdentityReferenceSet(
      receipt,
      job,
    );
    const expectedReferenceState = qualifiedReferenceSet
      ? "qualified-accepted-reference-set"
      : (receipt.execution?.referenceHashes ?? []).length === 0
        ? "text-conditioned-no-image-reference"
        : "execution-reference-present-unverified";
    if (candidate.referenceState !== expectedReferenceState) {
      fail(`${candidate.jobId} reference maturity does not match its receipt.`);
    }
    if (
      typeof receipt.output?.storagePath !== "string" ||
      receipt.output.publicUrl !== null
    ) {
      fail(
        `${candidate.jobId} output must remain internal until it is approved.`,
      );
    }
    const imagePath = ensureInside(
      receipt.output.storagePath,
      "planning-with-files/arcanea-visual-assets",
      `${candidate.jobId} internal image`,
    );
    if (!existsSync(imagePath))
      fail(`${candidate.jobId} image file is missing.`);
    const metadata = await inspectImageFileDecoded(imagePath);
    if (
      metadata.sha256 !== receipt.output.sha256 ||
      metadata.width !== receipt.output.width ||
      metadata.height !== receipt.output.height
    ) {
      fail(`${candidate.jobId} image bytes do not match its receipt.`);
    }

    const production = scoreReview(
      candidate.production,
      candidate.jobId,
      "production",
    );
    const independent = scoreReview(
      candidate.independent,
      candidate.jobId,
      "independent",
    );
    const identityContinuityCeiling = qualifiedReferenceSet ? 5 : 4;
    if (
      production.scores["identity continuity"] > identityContinuityCeiling ||
      independent.scores["identity continuity"] > identityContinuityCeiling
    ) {
      fail(
        `${candidate.jobId} cannot claim 5/5 identity continuity without a regression-qualified accepted reference set.`,
      );
    }
    if (!["approved", "revise", "rejected"].includes(candidate.humanVerdict)) {
      fail(
        `${candidate.jobId} human verdict must be approved, revise, or rejected.`,
      );
    }

    for (const dimension of campaign.rubric.dimensions) {
      const difference = Math.abs(
        production.scores[dimension] - independent.scores[dimension],
      );
      if (difference >= 2) {
        disagreements.push({ jobId: candidate.jobId, dimension, difference });
      }
    }
    for (const dimension of hardFloorDimensions) {
      const floor = campaign.rubric.hardFloors[dimension];
      if (
        production.scores[dimension] < floor ||
        independent.scores[dimension] < floor
      ) {
        hardFloorFailures.push({
          jobId: candidate.jobId,
          dimension,
          floor,
          production: production.scores[dimension],
          independent: independent.scores[dimension],
        });
      }
    }

    const reconciledTotal = Number(
      ((production.total + independent.total) / 2).toFixed(1),
    );
    const hasFloorFailure = hardFloorFailures.some(
      (failure) => failure.jobId === candidate.jobId,
    );
    const verdict = hasFloorFailure
      ? "revise"
      : reconciledTotal >= campaign.rubric.threshold
        ? "pass-candidate"
        : reconciledTotal >= 36
          ? "revise"
          : "reject";
    if (candidate.humanVerdict === "approved" && verdict !== "pass-candidate") {
      fail(
        `${candidate.jobId} cannot be human-approved while its reconciled quality or hard-floor verdict is ${verdict}.`,
      );
    }
    scored.push({
      jobId: candidate.jobId,
      styleState: job.styleState,
      outputReceiptPath: candidate.outputReceiptPath,
      productionTotal: production.total,
      independentTotal: independent.total,
      reconciledTotal,
      verdict,
      humanVerdict: candidate.humanVerdict,
    });
  }

  const decision = evaluation.decision;
  for (const key of [
    "failurePatterns",
    "retainRules",
    "reviseRules",
    "retireRules",
  ]) {
    if (!Array.isArray(decision?.[key]))
      fail(`decision.${key} must be an array.`);
  }
  if (decision.retainRules.length === 0 && decision.reviseRules.length === 0) {
    fail("The round decision must retain or revise at least one rule.");
  }
  if (
    scored.some((candidate) => candidate.verdict !== "pass-candidate") &&
    decision.failurePatterns.length === 0
  ) {
    fail(
      "Non-passing candidates require at least one recorded failure pattern.",
    );
  }
  if (
    disagreements.length > 0 &&
    (typeof decision.reconciliationNotes !== "string" ||
      decision.reconciliationNotes.trim().length < 30)
  ) {
    fail(
      "Score disagreements of two or more points require explicit reconciliation notes.",
    );
  }
  if (!["accepted", "revise"].includes(decision.humanVerdict)) {
    fail("decision.humanVerdict must be accepted or revise.");
  }
  const styleIds = campaign.styles.map((style) => style.id);
  if (decision.nextRoundCompilationAllowed === true) {
    if (!styleIds.includes(decision.primaryStyleDecision))
      fail("An unlocked round needs a valid primary style.");
    if (!styleIds.includes(decision.secondaryModeDecision))
      fail("An unlocked round needs a valid secondary mode.");
    if (decision.primaryStyleDecision === decision.secondaryModeDecision) {
      fail("Primary style and secondary mode must differ.");
    }
  }
  if (roundNumber === 1 && decision.nextRoundCompilationAllowed === true) {
    if (
      decision.benchmarkReferenceState !==
        "text-conditioned-no-accepted-reference" ||
      decision.benchmarkLimitationAcknowledged !== true ||
      typeof decision.identityComparabilityNotes !== "string" ||
      decision.identityComparabilityNotes.trim().length < 80 ||
      typeof decision.crossAnchorPortabilityNotes !== "string" ||
      decision.crossAnchorPortabilityNotes.trim().length < 80
    ) {
      fail(
        "Round 01 cannot select styles until the text-conditioned identity limitation and cross-anchor portability are explicitly documented.",
      );
    }
    if (
      evaluation.reviewProtocol.referenceMaturity !==
        "text-conditioned-no-accepted-reference" ||
      evaluation.candidates.some(
        (candidate) =>
          candidate.referenceState !== "text-conditioned-no-image-reference",
      )
    ) {
      fail(
        "Round 01 benchmark reference state must match its no-reference execution receipts.",
      );
    }
    for (const styleId of [
      decision.primaryStyleDecision,
      decision.secondaryModeDecision,
    ]) {
      const controlledPair = scored.filter(
        (candidate) => candidate.styleState === styleId,
      );
      if (
        controlledPair.length !== 2 ||
        controlledPair.some(
          (candidate) =>
            candidate.verdict !== "pass-candidate" ||
            candidate.humanVerdict !== "approved",
        )
      ) {
        fail(
          `${styleId} cannot be selected until both controlled anchors pass and receive human approval.`,
        );
      }
    }
  }
  if (roundNumber > 1 && decision.nextRoundCompilationAllowed === true) {
    if (
      decision.primaryStyleDecision !== pack.selectedStyle ||
      decision.secondaryModeDecision !== pack.selectedSecondaryMode
    ) {
      fail(
        "Later rounds must carry the controlled style decisions forward; changing them requires a new controlled benchmark.",
      );
    }
  }
  if (
    decision.nextRoundCompilationAllowed === true &&
    decision.humanVerdict !== "accepted"
  ) {
    fail("The next round cannot unlock without an accepted human verdict.");
  }

  const totals = scored.map((candidate) => candidate.reconciledTotal);
  const reflectionBody = {
    schema: "arcanea.visual_round_reflection.v1",
    campaignId: campaign.meta.campaignId,
    campaignVersion: campaign.meta.version,
    round: roundNumber,
    promptPackHash: pack.packetHash,
    jobIds: round.jobs.map((job) => job.id),
    generated: scored.length,
    validFiles: scored.length,
    blocked: round.jobs.filter((job) => job.generationState === "blocked")
      .length,
    scoreSummary: {
      median: median(totals),
      range: [Math.min(...totals), Math.max(...totals)],
      hardFloorFailures,
    },
    reviewDisagreements: disagreements,
    blindReview: {
      mode: evaluation.reviewProtocol.mode,
      criticPacketHash: evaluation.reviewProtocol.criticPacketHash,
      unblindingKeyHash: evaluation.reviewProtocol.unblindingKeyHash,
      sourceScorecards: evaluation.reviewProtocol.sourceScorecards,
    },
    reconciliationNotes: decision.reconciliationNotes ?? "",
    candidates: scored,
    topCandidates: scored
      .filter((candidate) => candidate.verdict === "pass-candidate")
      .sort((left, right) => right.reconciledTotal - left.reconciledTotal)
      .slice(0, 3)
      .map((candidate) => candidate.jobId),
    failurePatterns: decision.failurePatterns,
    retainRules: decision.retainRules,
    reviseRules: decision.reviseRules,
    retireRules: decision.retireRules,
    benchmarkReferenceState: decision.benchmarkReferenceState,
    benchmarkLimitationAcknowledged:
      decision.benchmarkLimitationAcknowledged === true,
    identityComparabilityNotes: decision.identityComparabilityNotes ?? "",
    crossAnchorPortabilityNotes: decision.crossAnchorPortabilityNotes ?? "",
    primaryStyleDecision: decision.primaryStyleDecision,
    secondaryModeDecision: decision.secondaryModeDecision,
    humanVerdict: decision.humanVerdict,
    nextRoundCompilationAllowed: decision.nextRoundCompilationAllowed === true,
    createdAt: new Date().toISOString(),
  };
  const reflection = { ...reflectionBody, receiptHash: sha(reflectionBody) };
  const outputPath = join(
    ROOT,
    `planning-with-files/arcanea-visual-reflections/round-${roundId}.json`,
  );
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(reflection, null, 2)}\n`, "utf8");
  console.log(
    `Scored Round ${roundId}: ${scored.length} files, median ${reflection.scoreSummary.median}/50, ${hardFloorFailures.length} hard-floor failures, next round ${reflection.nextRoundCompilationAllowed ? "unlocked" : "held"}.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
