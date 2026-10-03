import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const ROOT = process.cwd();
const digest = (value) =>
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

function toRelative(path) {
  return relative(ROOT, path).replaceAll("\\", "/");
}

function writeOnce(path, value, label) {
  const serialized = `${JSON.stringify(value, null, 2)}\n`;
  if (existsSync(path)) {
    if (readFileSync(path, "utf8") !== serialized) {
      fail(`${label} already exists with different content: ${path}`);
    }
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, serialized, "utf8");
}

function hasForbiddenKey(value) {
  if (Array.isArray(value)) return value.some(hasForbiddenKey);
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, child]) =>
      ["jobId", "styleState", "primaryStyleDecision"].includes(key) ||
      hasForbiddenKey(child),
  );
}

function validateScorecard({
  scorecard,
  role,
  campaign,
  packet,
  criticPacket,
  expectedBlindIds,
}) {
  if (
    scorecard.schema !== "arcanea.visual_blind_scorecard.v1" ||
    scorecard.campaignId !== campaign.meta.campaignId ||
    scorecard.campaignVersion !== campaign.meta.version ||
    scorecard.round !== packet.round ||
    scorecard.promptPackHash !== packet.packetHash ||
    scorecard.criticPacketHash !== criticPacket.criticPacketHash
  ) {
    fail(`${role} scorecard is stale or belongs to another review packet.`);
  }
  if (
    scorecard.judge?.role !== role ||
    typeof scorecard.judge.id !== "string" ||
    scorecard.judge.id.trim().length < 3 ||
    scorecard.judge.independentFromGeneration !== (role === "independent") ||
    scorecard.completedBeforeUnblinding !== true
  ) {
    fail(
      `${role} scorecard needs a named judge and a truthful pre-unblinding completion attestation.`,
    );
  }
  const ids = scorecard.candidates?.map((candidate) => candidate.blindId) ?? [];
  if (
    ids.length !== expectedBlindIds.length ||
    new Set(ids).size !== ids.length ||
    !expectedBlindIds.every((blindId) => ids.includes(blindId))
  ) {
    fail(`${role} scorecard must cover the exact opaque candidate set.`);
  }
  for (const candidate of scorecard.candidates) {
    const scoreKeys = Object.keys(candidate.scores ?? {});
    const evidenceKeys = Object.keys(candidate.evidence ?? {});
    if (
      scoreKeys.length !== campaign.rubric.dimensions.length ||
      evidenceKeys.length !== campaign.rubric.dimensions.length ||
      !campaign.rubric.dimensions.every(
        (dimension) =>
          scoreKeys.includes(dimension) && evidenceKeys.includes(dimension),
      )
    ) {
      fail(
        `${role} ${candidate.blindId} must use the exact ten rubric dimensions.`,
      );
    }
    for (const dimension of campaign.rubric.dimensions) {
      const score = candidate.scores[dimension];
      const evidence = candidate.evidence[dimension];
      if (!Number.isInteger(score) || score < 1 || score > 5) {
        fail(`${role} ${candidate.blindId} has an invalid ${dimension} score.`);
      }
      if (typeof evidence !== "string" || evidence.trim().length < 12) {
        fail(
          `${role} ${candidate.blindId} needs visible evidence for ${dimension}.`,
        );
      }
    }
    if (!["pass", "revise", "reject"].includes(candidate.verdict)) {
      fail(`${role} ${candidate.blindId} has an invalid verdict.`);
    }
    const criticCandidate = criticPacket.candidates.find(
      (item) => item.blindId === candidate.blindId,
    );
    const identityScore = candidate.scores["identity continuity"];
    if (identityScore > criticCandidate.identityContinuityCeiling) {
      fail(
        `${role} ${candidate.blindId} exceeds its ${criticCandidate.identityContinuityCeiling}/5 identity ceiling without a verified accepted reference.`,
      );
    }
  }
  const { scorecardHash, ...scorecardBody } = scorecard;
  const expectedHash = digest(scorecardBody);
  if (scorecardHash !== null && scorecardHash !== expectedHash) {
    fail(`${role} scorecard hash is invalid.`);
  }
  return { ...scorecardBody, scorecardHash: expectedHash };
}

try {
  const roundNumber = Number(getArg("round", "1"));
  if (!Number.isInteger(roundNumber) || roundNumber < 1 || roundNumber > 10) {
    fail("--round must be an integer from 1–10.");
  }
  const roundId = String(roundNumber).padStart(2, "0");
  const campaign = JSON.parse(
    readFileSync(
      join(ROOT, "apps/web/data/arcanea-visual-campaign.v1.json"),
      "utf8",
    ),
  );
  const packetPath = join(
    ROOT,
    `planning-with-files/arcanea-visual-campaign/round-${roundId}-prompt-pack.json`,
  );
  if (!existsSync(packetPath))
    fail(`Prompt pack does not exist: ${packetPath}`);
  const packet = JSON.parse(readFileSync(packetPath, "utf8"));
  const { packetHash, ...packetBody } = packet;
  if (
    packet.schema !== "arcanea.visual_round_prompt_pack.v1" ||
    packet.campaignId !== campaign.meta.campaignId ||
    packet.campaignVersion !== campaign.meta.version ||
    packet.round !== roundNumber ||
    packetHash !== digest(packetBody)
  ) {
    fail("Prompt pack is stale or has an invalid hash.");
  }

  const reviewRoot = ensureInside(
    `planning-with-files/arcanea-visual-blind-review/round-${roundId}`,
    "planning-with-files/arcanea-visual-blind-review",
    "Blind review root",
  );
  const criticPacketPath = join(reviewRoot, "critic-packet.json");
  const privateKeyPath = join(reviewRoot, "private-key.json");
  for (const [label, path] of [
    ["Critic packet", criticPacketPath],
    ["Private key", privateKeyPath],
  ]) {
    if (!existsSync(path)) fail(`${label} does not exist: ${path}`);
  }
  const criticPacket = JSON.parse(readFileSync(criticPacketPath, "utf8"));
  const { criticPacketHash, ...criticPacketBody } = criticPacket;
  if (
    criticPacket.schema !== "arcanea.visual_blind_critic_packet.v1" ||
    criticPacket.campaignId !== campaign.meta.campaignId ||
    criticPacket.round !== roundNumber ||
    criticPacket.promptPackHash !== packet.packetHash ||
    criticPacketHash !== digest(criticPacketBody) ||
    hasForbiddenKey(criticPacket)
  ) {
    fail("Critic packet is invalid or leaks an unblinding field.");
  }
  const privateKey = JSON.parse(readFileSync(privateKeyPath, "utf8"));
  const { privateKeyHash, ...privateKeyBody } = privateKey;
  if (
    privateKey.schema !== "arcanea.visual_blind_review_key.v1" ||
    privateKey.campaignId !== campaign.meta.campaignId ||
    privateKey.round !== roundNumber ||
    privateKey.promptPackHash !== packet.packetHash ||
    privateKey.criticPacketHash !== criticPacket.criticPacketHash ||
    privateKeyHash !== digest(privateKeyBody)
  ) {
    fail("Blind review private key is stale or invalid.");
  }
  const expectedBlindIds = criticPacket.candidates.map(
    (candidate) => candidate.blindId,
  );
  if (
    expectedBlindIds.length === 0 ||
    new Set(expectedBlindIds).size !== expectedBlindIds.length ||
    privateKey.candidates.length !== expectedBlindIds.length ||
    !privateKey.candidates.every((candidate) =>
      expectedBlindIds.includes(candidate.blindId),
    )
  ) {
    fail("Blind packet and private key candidate sets do not match.");
  }

  const productionInput = ensureInside(
    getArg("production", join(reviewRoot, "production-scorecard.json")),
    "planning-with-files/arcanea-visual-blind-review",
    "Production scorecard",
  );
  const independentInput = ensureInside(
    getArg("independent", join(reviewRoot, "independent-scorecard.json")),
    "planning-with-files/arcanea-visual-blind-review",
    "Independent scorecard",
  );
  if (!existsSync(productionInput) || !existsSync(independentInput)) {
    fail("Both completed blind scorecards are required.");
  }
  const production = validateScorecard({
    scorecard: JSON.parse(readFileSync(productionInput, "utf8")),
    role: "production",
    campaign,
    packet,
    criticPacket,
    expectedBlindIds,
  });
  const independent = validateScorecard({
    scorecard: JSON.parse(readFileSync(independentInput, "utf8")),
    role: "independent",
    campaign,
    packet,
    criticPacket,
    expectedBlindIds,
  });
  if (production.judge.id === independent.judge.id) {
    fail(
      "Production and independent scorecards need different judge identities.",
    );
  }

  const reflectionRoot = join(
    ROOT,
    "planning-with-files/arcanea-visual-reflections",
  );
  const productionReceiptPath = join(
    reflectionRoot,
    `round-${roundId}.production-scorecard.json`,
  );
  const independentReceiptPath = join(
    reflectionRoot,
    `round-${roundId}.independent-scorecard.json`,
  );
  writeOnce(productionReceiptPath, production, "Sealed production scorecard");
  writeOnce(
    independentReceiptPath,
    independent,
    "Sealed independent scorecard",
  );

  const evaluationTemplatePath = join(
    reflectionRoot,
    `round-${roundId}.evaluation.template.json`,
  );
  if (!existsSync(evaluationTemplatePath)) {
    fail(`Evaluation template does not exist: ${evaluationTemplatePath}`);
  }
  const evaluationTemplate = JSON.parse(
    readFileSync(evaluationTemplatePath, "utf8"),
  );
  if (
    evaluationTemplate.campaignId !== campaign.meta.campaignId ||
    evaluationTemplate.round !== roundNumber ||
    evaluationTemplate.promptPackHash !== packet.packetHash
  ) {
    fail("Evaluation template is stale.");
  }

  const evaluation = {
    ...evaluationTemplate,
    judges: {
      production: production.judge,
      independent: independent.judge,
    },
    reviewProtocol: {
      ...evaluationTemplate.reviewProtocol,
      blindReviewCompleted: true,
      criticPacketHash: criticPacket.criticPacketHash,
      unblindingKeyHash: privateKey.privateKeyHash,
      sourceScorecards: {
        production: {
          path: toRelative(productionReceiptPath),
          hash: production.scorecardHash,
        },
        independent: {
          path: toRelative(independentReceiptPath),
          hash: independent.scorecardHash,
        },
      },
    },
    candidates: privateKey.candidates.map((keyCandidate) => {
      const productionCandidate = production.candidates.find(
        (candidate) => candidate.blindId === keyCandidate.blindId,
      );
      const independentCandidate = independent.candidates.find(
        (candidate) => candidate.blindId === keyCandidate.blindId,
      );
      return {
        blindId: keyCandidate.blindId,
        jobId: keyCandidate.jobId,
        referenceState: keyCandidate.referenceState,
        outputReceiptPath: keyCandidate.outputReceiptPath,
        production: {
          scores: productionCandidate.scores,
          evidence: productionCandidate.evidence,
          verdict: productionCandidate.verdict,
        },
        independent: {
          scores: independentCandidate.scores,
          evidence: independentCandidate.evidence,
          verdict: independentCandidate.verdict,
        },
        humanVerdict: "pending",
      };
    }),
  };
  const outputPath = join(reflectionRoot, `round-${roundId}.evaluation.json`);
  writeOnce(outputPath, evaluation, "Unblinded evaluation draft");
  console.log(
    `Reconciled Round ${roundId}: two sealed blind scorecards mapped to ${evaluation.candidates.length} candidates. Human verdicts and the round decision remain pending.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
