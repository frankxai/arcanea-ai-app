import { createHash } from "node:crypto";
import {
  existsSync,
  linkSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";

import {
  inspectImageFile,
  verifyImageAspectRatio,
} from "./lib/arcanea-image-metadata.mjs";

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

function blindId(packetHash, roundId, jobId) {
  const opaque = createHash("sha256")
    .update(`${packetHash}:${jobId}`)
    .digest("hex")
    .slice(0, 10)
    .toUpperCase();
  return `BR-${roundId}-${opaque}`;
}

function scorecardTemplate({ campaign, packet, criticPacket, role }) {
  return {
    schema: "arcanea.visual_blind_scorecard.v1",
    campaignId: campaign.meta.campaignId,
    campaignVersion: campaign.meta.version,
    round: packet.round,
    promptPackHash: packet.packetHash,
    criticPacketHash: criticPacket.criticPacketHash,
    judge: {
      id: null,
      role,
      independentFromGeneration: role === "independent",
    },
    completedBeforeUnblinding: false,
    candidates: criticPacket.candidates.map((candidate) => ({
      blindId: candidate.blindId,
      scores: Object.fromEntries(
        campaign.rubric.dimensions.map((dimension) => [dimension, null]),
      ),
      evidence: Object.fromEntries(
        campaign.rubric.dimensions.map((dimension) => [dimension, ""]),
      ),
      verdict: "pending",
    })),
    scorecardHash: null,
  };
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
  const round = campaign.rounds.find(
    (candidate) => candidate.round === roundNumber,
  );
  if (!round) fail(`Campaign round ${roundNumber} does not exist.`);

  const packPath = join(
    ROOT,
    `planning-with-files/arcanea-visual-campaign/round-${roundId}-prompt-pack.json`,
  );
  if (!existsSync(packPath)) fail(`Prompt pack does not exist: ${packPath}`);
  const packet = JSON.parse(readFileSync(packPath, "utf8"));
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

  const executableJobs = round.jobs.filter(
    (job) => job.generationState !== "blocked",
  );
  const packJobs = new Map(packet.jobs.map((job) => [job.id, job]));
  if (
    executableJobs.length === 0 ||
    executableJobs.some((job) => !packJobs.has(job.id))
  ) {
    fail("Prompt pack does not contain the round's executable jobs.");
  }

  const reviewRoot = ensureInside(
    `planning-with-files/arcanea-visual-blind-review/round-${roundId}`,
    "planning-with-files/arcanea-visual-blind-review",
    "Blind review root",
  );
  const candidateRoot = join(reviewRoot, "candidates");
  mkdirSync(candidateRoot, { recursive: true });

  const privateCandidates = [];
  const criticCandidates = [];
  for (const job of executableJobs) {
    const packedJob = packJobs.get(job.id);
    if (!packedJob.outputReceipt) {
      fail(
        `${job.id} has no output receipt. Record every executable result and recompile the round before blinding.`,
      );
    }
    const receiptPath = ensureInside(
      packedJob.outputReceipt,
      "planning-with-files/arcanea-visual-results",
      `${job.id} output receipt`,
    );
    if (!existsSync(receiptPath)) fail(`${job.id} output receipt is missing.`);
    const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
    const { receiptHash, ...receiptBody } = receipt;
    if (
      receiptHash !== digest(receiptBody) ||
      receipt.jobId !== job.id ||
      receipt.promptContractHash !== job.promptContract.contractHash ||
      receipt.output?.publicUrl !== null
    ) {
      fail(`${job.id} output receipt is stale, mismatched, or already public.`);
    }
    const imagePath = ensureInside(
      receipt.output?.storagePath ?? "",
      "planning-with-files/arcanea-visual-assets",
      `${job.id} internal image`,
    );
    if (!existsSync(imagePath)) fail(`${job.id} image file is missing.`);
    const metadata = inspectImageFile(imagePath);
    const aspectRatioCheck = verifyImageAspectRatio(
      metadata.width,
      metadata.height,
      job.promptContract.output.aspectRatio,
    );
    if (
      metadata.sha256 !== receipt.output.sha256 ||
      metadata.bytes !== receipt.output.bytes ||
      metadata.width !== receipt.output.width ||
      metadata.height !== receipt.output.height ||
      receipt.deterministicChecks?.decoded !== true ||
      receipt.deterministicChecks?.dimensionsRecorded !== true ||
      receipt.deterministicChecks?.declaredAspectRatio !==
        aspectRatioCheck.declaredAspectRatio ||
      receipt.deterministicChecks?.actualAspectRatio !==
        aspectRatioCheck.actualAspectRatio ||
      receipt.deterministicChecks?.aspectRatioRelativeError !==
        aspectRatioCheck.aspectRatioRelativeError ||
      receipt.deterministicChecks?.aspectRatioTolerance !==
        aspectRatioCheck.aspectRatioTolerance ||
      receipt.deterministicChecks?.aspectRatioMatchesContract !== true ||
      receipt.deterministicChecks?.hashRecorded !== true ||
      receipt.deterministicChecks?.promptHashMatchesCampaign !== true
    ) {
      fail(
        `${job.id} image bytes, dimensions, aspect ratio, or deterministic checks do not match its receipt and prompt contract.`,
      );
    }

    const candidateBlindId = blindId(packet.packetHash, roundId, job.id);
    const extension = extname(imagePath).toLowerCase();
    const blindedAsset = join(candidateRoot, `${candidateBlindId}${extension}`);
    if (existsSync(blindedAsset)) {
      if (inspectImageFile(blindedAsset).sha256 !== metadata.sha256) {
        fail(`${candidateBlindId} already points to different image bytes.`);
      }
    } else {
      try {
        linkSync(imagePath, blindedAsset);
      } catch (error) {
        fail(
          `Could not create the storage-safe hard link for ${candidateBlindId}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    const referenceHashes = receipt.execution?.referenceHashes ?? [];
    const referenceState =
      receipt.execution?.qualifiedIdentityReferenceSet !== null &&
      receipt.execution?.qualifiedIdentityReferenceSet !== undefined
        ? "qualified-accepted-reference-set"
        : referenceHashes.length === 0
          ? "text-conditioned-no-image-reference"
          : "execution-reference-present-unverified";
    privateCandidates.push({
      blindId: candidateBlindId,
      jobId: job.id,
      styleState: job.styleState,
      outputReceiptPath: toRelative(receiptPath),
      imageSha256: metadata.sha256,
      referenceState,
      referenceHashes,
    });
    criticCandidates.push({
      blindId: candidateBlindId,
      assetPath: toRelative(blindedAsset),
      image: {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        sha256: metadata.sha256,
      },
      sourceBrief: {
        displayName: job.promptContract.subject.displayName,
        subjectKind: job.promptContract.subject.kind,
        identityEvidence: job.promptContract.subject.identityLock,
        evidenceState: job.promptContract.subject.evidenceState,
        openIdentityVariables:
          job.promptContract.subject.openIdentityVariables ?? [],
        allowedVariation: job.promptContract.subject.allowedVariation,
        storyBeat: job.promptContract.storyBeat,
        composition: job.promptContract.composition,
        visibleChecks: job.promptContract.constraints,
        releaseEligibility: job.promptContract.governance.releaseEligibility,
      },
      referenceState,
      identityContinuityCeiling:
        referenceState === "qualified-accepted-reference-set" ? 5 : 4,
    });
  }

  privateCandidates.sort((left, right) =>
    left.blindId.localeCompare(right.blindId),
  );
  criticCandidates.sort((left, right) =>
    left.blindId.localeCompare(right.blindId),
  );

  const criticPacketBody = {
    schema: "arcanea.visual_blind_critic_packet.v1",
    campaignId: campaign.meta.campaignId,
    campaignVersion: campaign.meta.version,
    round: roundNumber,
    promptPackHash: packet.packetHash,
    rubricId: campaign.rubric.id,
    protocol: {
      mode: "style-blind-two-pass",
      candidateOrder: "opaque-hash-order",
      styleLabelsWithheld: true,
      teamPreferenceWithheld: true,
      completeScorecardBeforeUnblinding: true,
      evidenceRule: "Name visible image evidence, not taste adjectives.",
      identityRule:
        "Without a verified accepted image reference, identity continuity measures source-fact stability only and cannot score above 4/5.",
    },
    rubric: {
      dimensions: campaign.rubric.dimensions,
      hardFloors: campaign.rubric.hardFloors,
      threshold: campaign.rubric.threshold,
    },
    candidates: criticCandidates,
  };
  const criticPacket = {
    ...criticPacketBody,
    criticPacketHash: digest(criticPacketBody),
  };
  const privateKeyBody = {
    schema: "arcanea.visual_blind_review_key.v1",
    campaignId: campaign.meta.campaignId,
    campaignVersion: campaign.meta.version,
    round: roundNumber,
    promptPackHash: packet.packetHash,
    criticPacketHash: criticPacket.criticPacketHash,
    candidates: privateCandidates,
  };
  const privateKey = {
    ...privateKeyBody,
    privateKeyHash: digest(privateKeyBody),
  };

  writeOnce(
    join(reviewRoot, "critic-packet.json"),
    criticPacket,
    "Blind critic packet",
  );
  writeOnce(
    join(reviewRoot, "private-key.json"),
    privateKey,
    "Blind review private key",
  );
  writeOnce(
    join(reviewRoot, "production-scorecard.json"),
    scorecardTemplate({ campaign, packet, criticPacket, role: "production" }),
    "Production scorecard",
  );
  writeOnce(
    join(reviewRoot, "independent-scorecard.json"),
    scorecardTemplate({ campaign, packet, criticPacket, role: "independent" }),
    "Independent scorecard",
  );

  console.log(
    `Prepared style-blind Round ${roundId}: ${criticCandidates.length} opaque candidates, hard-linked with zero duplicate image bytes.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
