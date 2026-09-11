import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";
import assert from "node:assert/strict";
import { auditVisualToolingSurfaces } from "../lib/arcanea-visual-tooling-surfaces.mjs";

const TESTS_ROOT = dirname(fileURLToPath(import.meta.url));
const SCRIPTS_ROOT = dirname(TESTS_ROOT);
const REPO_ROOT = dirname(SCRIPTS_ROOT);
const TOOLING_REGISTRY = join(
  REPO_ROOT,
  "docs/design/arcanea-visual-tooling-surface-registry.v1.json",
);
const COMPILER = join(SCRIPTS_ROOT, "compile-arcanea-visual-round.mjs");
const BLIND_REVIEW = join(SCRIPTS_ROOT, "prepare-arcanea-blind-review.mjs");
const RECONCILE = join(SCRIPTS_ROOT, "reconcile-arcanea-blind-review.mjs");
const REGISTER_REFERENCE = join(
  SCRIPTS_ROOT,
  "register-arcanea-visual-reference.mjs",
);
const QUALIFY_REFERENCE_SET = join(
  SCRIPTS_ROOT,
  "qualify-arcanea-identity-reference-set.mjs",
);
const ASSIGN_REFERENCES = join(
  SCRIPTS_ROOT,
  "assign-arcanea-identity-references.mjs",
);
const CAPTURE_PREFLIGHT = join(
  SCRIPTS_ROOT,
  "capture-arcanea-machine-preflight.mjs",
);
const READINESS = join(SCRIPTS_ROOT, "report-arcanea-visual-readiness.mjs");
const RECORDER = join(SCRIPTS_ROOT, "record-arcanea-image-result.mjs");
const ISSUE_GRANT = join(
  SCRIPTS_ROOT,
  "issue-arcanea-visual-execution-grant.mjs",
);
const DECIDER = join(SCRIPTS_ROOT, "decide-arcanea-image-release.mjs");
const sha = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");

function writeJson(root, relativePath, value) {
  const target = join(root, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  return target;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function hashedReceipt(body) {
  return { ...body, receiptHash: sha(body) };
}

function run(script, args, cwd) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd,
    encoding: "utf8",
  });
}

test("visual tooling registry covers every provider-call surface and detects drift", (t) => {
  const report = auditVisualToolingSurfaces({
    root: REPO_ROOT,
    registryPath: TOOLING_REGISTRY,
  });

  assert.deepEqual(report.unregisteredDetectedPaths, []);
  assert.deepEqual(report.missingRegisteredPaths, []);
  assert.deepEqual(report.duplicateRegisteredPaths, []);
  assert.deepEqual(report.credentialInUrlPaths, []);
  assert.ok(report.detectedPaths.length >= 20);
  assert.equal(report.canonicalLaneCount, 1);

  const driftRoot = mkdtempSync(join(tmpdir(), "arcanea-tooling-drift-"));
  t.after(() => rmSync(driftRoot, { force: true, recursive: true }));
  writeFileSync(
    join(driftRoot, "rogue-image-call.mjs"),
    "const apiKey = 'fixture'; const url = new URL('https://api.openai.com/v1/images/generations'); url.searchParams.set(\"key\", apiKey); fetch(url);\n",
    "utf8",
  );
  const driftRegistry = writeJson(driftRoot, "registry.json", {
    schema: "arcanea.visual_tooling_surface_registry.v1",
    version: "1.0.0",
    canonicalLaneId: "canonical",
    surfaces: [
      {
        id: "canonical",
        classification: "governed-campaign-control-plane",
        paths: [],
      },
    ],
  });
  const drift = auditVisualToolingSurfaces({
    root: driftRoot,
    registryPath: driftRegistry,
    scanRoots: ["."],
    credentialScanRoots: ["."],
  });
  assert.deepEqual(drift.unregisteredDetectedPaths, ["rogue-image-call.mjs"]);
  assert.deepEqual(drift.credentialInUrlPaths, ["rogue-image-call.mjs"]);
});

test("world image prompts use observable Arcanea art direction without named imitation", () => {
  const sources = [
    "apps/web/lib/worlds/image-gen.ts",
    "apps/web/app/api/worlds/generate-image/route.ts",
  ].map((path) => readFileSync(join(REPO_ROOT, path), "utf8"));
  const forbiddenNamedStyles = [
    "Studio Ghibli",
    "Yoshitaka Amano",
    "Berserk",
    "Final Fantasy",
    "Makoto Shinkai",
    "Avatar waterbending",
    "Nausicaa",
    "Lord of the Rings",
    "Evangelion",
    "Klimt",
  ];
  for (const source of sources) {
    for (const namedStyle of forbiddenNamedStyles) {
      assert.equal(
        source.includes(namedStyle),
        false,
        `world prompt source still contains named imitation target: ${namedStyle}`,
      );
    }
  }
  assert.match(sources[0], /observable rendering language/i);
  assert.match(sources[1], /Rendering language:/);
  assert.equal(sources[1].includes("?key=${apiKey}"), false);
  assert.match(sources[1], /["']x-goog-api-key["']:\s*apiKey/);
});

test("adaptive compiler rejects forgery and carries accepted style decisions forward", (t) => {
  const root = mkdtempSync(join(tmpdir(), "arcanea-compiler-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));

  const dimensions = Array.from(
    { length: 10 },
    (_, index) => `dimension-${index + 1}`,
  );
  const roundTwoJob = {
    id: "ACV-002",
    name: "Round two study",
    round: 2,
    generationState: "planned",
    blockedReason: null,
    canonState: "proposal",
    identityState: "candidate",
    evidenceState: "source-defined",
    openIdentityVariables: [],
    reviewRequirements: [],
    sensitivityReviewRequired: false,
    releaseEligibility: "candidate-after-human-gates",
    rightsState: "internal-review",
    releaseState: "not-generated",
    styleState: "adaptive-primary-pending",
    sourceRefs: ["fixture-source"],
    subjectKind: "agent",
    receipts: [],
    promptContract: {
      contractHash: "contract-002",
      intent: "Test the adaptive compiler with a complete fixture.",
      composition: "4:5 portrait, centered working instrument",
      output: {
        assetCount: 1,
        aspectRatio: "4:5",
        intendedSurface: "agent-dossier-and-identity-atlas",
        deliveryRole: "adaptive compiler fixture",
        cropSafety:
          "Keep the complete instrument and its decisive evidence object clear of every primary-frame edge.",
        generatedTextPolicy: "no-generated-text",
      },
      subject: {
        displayName: "Fixture Agent",
        identityLock: "Stable face, posture, and instrument.",
        evidenceState: "source-defined",
        openIdentityVariables: [],
        allowedVariation: "Lighting and background only.",
      },
      storyBeat: "The agent resolves one bounded problem.",
      designSystem: {
        direction: "fallback direction",
        colorLaw: "restrained neutral field",
        escalation: "resonant only",
        materialLaw: "tactile plausible surfaces",
        typography: "no embedded text",
      },
      light: "single shaped source",
      constraints: ["stable silhouette"],
      avoid: ["generic fantasy"],
      governance: {
        releaseEligibility: "candidate-after-human-gates",
        sensitivityReviewRequired: false,
        reviewRequirements: [],
      },
    },
  };
  const roundTwoJobs = Array.from({ length: 10 }, (_, index) => ({
    ...roundTwoJob,
    id: `ACV-${String(index + 2).padStart(3, "0")}`,
    name: `Round two study ${index + 1}`,
    promptContract: {
      ...roundTwoJob.promptContract,
      contractHash: `contract-${String(index + 2).padStart(3, "0")}`,
    },
  }));
  const campaign = {
    meta: {
      campaignId: "fixture-campaign",
      version: "1.0.0",
    },
    styles: [
      {
        id: "style-a",
        direction: "accepted primary direction",
        avoid: ["primary failure"],
      },
      {
        id: "style-b",
        direction: "accepted secondary direction",
        avoid: ["secondary failure"],
      },
    ],
    rubric: { id: "fixture-rubric", dimensions },
    rounds: [
      {
        round: 1,
        purpose: "Control",
        adaptiveDecision: "Reflect",
        jobs: [
          {
            id: "ACV-001",
            generationState: "review",
            output: {
              receiptPath:
                "planning-with-files/arcanea-visual-results/acv-001-r1.json",
            },
          },
        ],
      },
      {
        round: 2,
        purpose: "Apply",
        adaptiveDecision: "Use accepted style",
        jobs: roundTwoJobs,
      },
    ],
  };
  writeJson(root, "apps/web/data/arcanea-visual-campaign.v1.json", campaign);
  const priorPack = { packetHash: "prior-pack-hash" };
  writeJson(
    root,
    "planning-with-files/arcanea-visual-campaign/round-01-prompt-pack.json",
    priorPack,
  );
  const reflectionBody = {
    schema: "arcanea.visual_round_reflection.v1",
    campaignId: "fixture-campaign",
    campaignVersion: "1.0.0",
    round: 1,
    promptPackHash: priorPack.packetHash,
    jobIds: ["ACV-001"],
    generated: 1,
    validFiles: 1,
    candidates: [
      {
        jobId: "ACV-001",
        outputReceiptPath:
          "planning-with-files/arcanea-visual-results/acv-001-r1.json",
        verdict: "pass-candidate",
        humanVerdict: "approved",
      },
    ],
    blindReview: {
      mode: "style-blind-two-pass",
      criticPacketHash: "critic-packet-hash",
      unblindingKeyHash: "private-key-hash",
      sourceScorecards: {
        production: { hash: "production-scorecard-hash" },
        independent: { hash: "independent-scorecard-hash" },
      },
    },
    benchmarkReferenceState: "text-conditioned-no-accepted-reference",
    benchmarkLimitationAcknowledged: true,
    identityComparabilityNotes:
      "This fixture acknowledges that text-conditioned stability can compare source facts but cannot establish cross-style facial or bodily likeness without accepted reference images.",
    crossAnchorPortabilityNotes:
      "This fixture records that the selected system must succeed on both the human and countable non-human anchor before it can be treated as portable beyond one attractive image.",
    primaryStyleDecision: "style-a",
    secondaryModeDecision: "style-b",
    humanVerdict: "accepted",
    nextRoundCompilationAllowed: true,
  };
  const reflectionPath =
    "planning-with-files/arcanea-visual-reflections/round-01.json";
  writeJson(root, reflectionPath, {
    ...reflectionBody,
    receiptHash: "forged",
  });

  const forged = run(COMPILER, ["--round", "2"], root);
  assert.equal(forged.status, 2);
  assert.match(forged.stderr, /valid, complete, accepted reflection receipt/);

  writeJson(root, reflectionPath, hashedReceipt(reflectionBody));
  const accepted = run(COMPILER, ["--round", "2"], root);
  assert.equal(accepted.status, 0, accepted.stderr);
  const packet = JSON.parse(
    readFileSync(
      join(
        root,
        "planning-with-files/arcanea-visual-campaign/round-02-prompt-pack.json",
      ),
      "utf8",
    ),
  );
  assert.equal(packet.selectedStyle, "style-a");
  assert.equal(packet.selectedSecondaryMode, "style-b");
  assert.equal(
    packet.styleAllocation.policy,
    "adaptive-primary-with-two-deterministic-secondary-portability-probes",
  );
  assert.equal(packet.styleAllocation.primaryJobIds.length, 8);
  assert.equal(packet.styleAllocation.secondaryProbeJobIds.length, 2);
  assert.equal(
    new Set([
      ...packet.styleAllocation.primaryJobIds,
      ...packet.styleAllocation.secondaryProbeJobIds,
    ]).size,
    10,
  );
  for (const job of packet.jobs) {
    if (packet.styleAllocation.secondaryProbeJobIds.includes(job.id)) {
      assert.equal(job.styleState, "style-b");
      assert.match(job.compiledPrompt, /accepted secondary direction/);
      assert.match(job.compiledPrompt, /secondary failure/);
    } else {
      assert.equal(job.styleState, "style-a");
      assert.match(job.compiledPrompt, /accepted primary direction/);
      assert.match(job.compiledPrompt, /primary failure/);
    }
  }
  const firstPacketHash = packet.packetHash;
  const repeated = run(COMPILER, ["--round", "2"], root);
  assert.equal(repeated.status, 0, repeated.stderr);
  const repeatedPacket = readJson(
    join(
      root,
      "planning-with-files/arcanea-visual-campaign/round-02-prompt-pack.json",
    ),
  );
  assert.equal(repeatedPacket.packetHash, firstPacketHash);
  assert.deepEqual(repeatedPacket.styleAllocation, packet.styleAllocation);
  const evaluation = JSON.parse(
    readFileSync(
      join(
        root,
        "planning-with-files/arcanea-visual-reflections/round-02.evaluation.template.json",
      ),
      "utf8",
    ),
  );
  assert.equal(evaluation.decision.primaryStyleDecision, "style-a");
  assert.equal(evaluation.decision.secondaryModeDecision, "style-b");
  assert.equal(evaluation.reviewProtocol.mode, "style-blind-two-pass");
  assert.equal(evaluation.decision.benchmarkReferenceState, "not-applicable");
});

test("blind review rejects geometry drift, withholds style labels, and seals independent scorecards before unblinding", (t) => {
  const root = mkdtempSync(join(tmpdir(), "arcanea-blind-review-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));

  const dimensions = [
    "prompt adherence",
    "source and canon fidelity",
    "identity continuity",
    "silhouette legibility",
    "anatomy and count accuracy",
    "material specificity",
    "composition and hierarchy",
    "emotional story truth",
    "Arcanea distinctiveness",
    "release readiness",
  ];
  const receiptPath =
    "planning-with-files/arcanea-visual-results/acv-001-r1.json";
  const storagePath =
    "planning-with-files/arcanea-visual-assets/v1/round-01/acv-001-r1.png";
  const image = Buffer.alloc(24);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(image, 0);
  image.writeUInt32BE(64, 16);
  image.writeUInt32BE(64, 20);
  const imageSha256 = createHash("sha256").update(image).digest("hex");
  const imagePath = join(root, storagePath);
  mkdirSync(dirname(imagePath), { recursive: true });
  writeFileSync(imagePath, image);

  const promptContract = {
    contractHash: "fixture-contract-hash",
    intent: "Compare one rendering system without exposing its style label.",
    composition: "4:5 portrait, one visible evidence object",
    output: {
      assetCount: 1,
      aspectRatio: "4:5",
      intendedSurface: "book-character-dossier-and-identity-atlas",
      deliveryRole: "blind review fixture",
      cropSafety:
        "Keep the complete identity silhouette and marked evidence object clear of every primary-frame edge.",
      generatedTextPolicy: "no-generated-text",
    },
    subject: {
      displayName: "Fixture Identity",
      kind: "book-character",
      identityLock: "Adult human with a stable posture and one marked tool.",
      evidenceState: "source-complete",
      openIdentityVariables: [],
      allowedVariation: "Lighting and camera distance only.",
    },
    storyBeat: "The subject repairs the marked tool under visible pressure.",
    designSystem: {
      direction: "fixture style direction that critics must not receive",
      colorLaw: "restrained field",
      escalation: "resonant only",
      materialLaw: "plausible wear",
      typography: "no embedded text",
    },
    light: "single shaped source",
    constraints: ["stable anatomy", "one marked tool"],
    avoid: ["generic fantasy"],
    governance: {
      releaseEligibility: "candidate-after-human-gates",
      reviewRequirements: [],
    },
  };
  const job = {
    id: "ACV-001",
    name: "Fixture Identity — hidden style",
    round: 1,
    generationState: "review",
    blockedReason: null,
    canonState: "source-defined",
    identityState: "candidate",
    evidenceState: "source-complete",
    openIdentityVariables: [],
    reviewRequirements: [],
    sensitivityReviewRequired: false,
    releaseEligibility: "candidate-after-human-gates",
    rightsState: "internal-review",
    releaseState: "review",
    styleState: "style-a",
    sourceRefs: ["fixture-source"],
    subjectKind: "book-character",
    receipts: [receiptPath],
    output: { receiptPath },
    promptContract,
  };
  const campaign = {
    meta: { campaignId: "fixture-blind-campaign", version: "1.0.0" },
    adaptiveProtocol: {
      benchmarkLimitation:
        "No accepted image references exist; this fixture may compare rendering but cannot lock likeness.",
    },
    styles: [
      {
        id: "style-a",
        name: "Secret style label",
        direction: "secret style direction",
        avoid: [],
      },
    ],
    rubric: {
      id: "fixture-rubric",
      dimensions,
      hardFloors: {
        "source and canon fidelity": 4,
        "identity continuity": 4,
        "anatomy and count accuracy": 4,
      },
      threshold: 42,
    },
    rounds: [
      {
        round: 1,
        purpose: "Blind benchmark fixture",
        adaptiveDecision: "Reflect after blind review",
        jobs: [job],
      },
    ],
  };
  writeJson(root, "apps/web/data/arcanea-visual-campaign.v1.json", campaign);
  const receiptBody = {
    schema: "arcanea.visual_output_receipt.v1",
    campaignId: campaign.meta.campaignId,
    campaignVersion: campaign.meta.version,
    round: 1,
    jobId: job.id,
    promptContractHash: promptContract.contractHash,
    execution: {
      provider: "fixture-provider",
      model: "fixture-model",
      parameters: {},
      referenceHashes: [],
      spendApprovedBy: "human:test",
      machinePreflightReceipt: "fixture-preflight",
    },
    output: {
      storagePath,
      publicUrl: null,
      format: "png",
      width: 64,
      height: 64,
      bytes: image.length,
      sha256: imageSha256,
    },
    deterministicChecks: {
      decoded: true,
      dimensionsRecorded: true,
      declaredAspectRatio: "4:5",
      actualAspectRatio: 1,
      aspectRatioRelativeError: 0.25,
      aspectRatioTolerance: 0.015,
      aspectRatioMatchesContract: false,
      hashRecorded: true,
      promptHashMatchesCampaign: true,
    },
  };
  writeJson(root, receiptPath, hashedReceipt(receiptBody));

  const compiled = run(COMPILER, ["--round", "1"], root);
  assert.equal(compiled.status, 0, compiled.stderr);
  const rejectedGeometry = run(BLIND_REVIEW, ["--round", "1"], root);
  assert.equal(rejectedGeometry.status, 1);
  assert.match(rejectedGeometry.stderr, /aspect ratio/i);

  image.writeUInt32BE(80, 20);
  writeFileSync(imagePath, image);
  receiptBody.output.height = 80;
  receiptBody.output.sha256 = createHash("sha256").update(image).digest("hex");
  receiptBody.deterministicChecks = {
    decoded: true,
    dimensionsRecorded: true,
    declaredAspectRatio: "4:5",
    actualAspectRatio: 0.8,
    aspectRatioRelativeError: 0,
    aspectRatioTolerance: 0.015,
    aspectRatioMatchesContract: true,
    hashRecorded: true,
    promptHashMatchesCampaign: true,
  };
  writeJson(root, receiptPath, hashedReceipt(receiptBody));

  const prepared = run(BLIND_REVIEW, ["--round", "1"], root);
  assert.equal(prepared.status, 0, prepared.stderr);

  const reviewRoot = join(
    root,
    "planning-with-files/arcanea-visual-blind-review/round-01",
  );
  const criticPacket = JSON.parse(
    readFileSync(join(reviewRoot, "critic-packet.json"), "utf8"),
  );
  const criticPacketText = JSON.stringify(criticPacket);
  assert.equal(criticPacketText.includes("ACV-001"), false);
  assert.equal(criticPacketText.includes("style-a"), false);
  assert.equal(criticPacketText.includes("Secret style label"), false);
  assert.equal(criticPacket.candidates[0].identityContinuityCeiling, 4);

  const completeScorecard = (file, role, judgeId) => {
    const path = join(reviewRoot, file);
    const scorecard = JSON.parse(readFileSync(path, "utf8"));
    scorecard.judge.id = judgeId;
    scorecard.judge.role = role;
    scorecard.judge.independentFromGeneration = role === "independent";
    scorecard.completedBeforeUnblinding = true;
    for (const candidate of scorecard.candidates) {
      candidate.scores = Object.fromEntries(
        dimensions.map((dimension) => [dimension, 4]),
      );
      candidate.evidence = Object.fromEntries(
        dimensions.map((dimension) => [
          dimension,
          `Visible fixture evidence supports ${dimension}.`,
        ]),
      );
      candidate.verdict = "pass";
    }
    writeJson(root, relative(root, path), scorecard);
  };
  completeScorecard(
    "production-scorecard.json",
    "production",
    "critic-production",
  );
  completeScorecard(
    "independent-scorecard.json",
    "independent",
    "critic-production",
  );
  const sameJudge = run(RECONCILE, ["--round", "1"], root);
  assert.equal(sameJudge.status, 1);
  assert.match(sameJudge.stderr, /different judge identities/);

  completeScorecard(
    "independent-scorecard.json",
    "independent",
    "critic-independent",
  );
  const reconciled = run(RECONCILE, ["--round", "1"], root);
  assert.equal(reconciled.status, 0, reconciled.stderr);
  const evaluation = JSON.parse(
    readFileSync(
      join(
        root,
        "planning-with-files/arcanea-visual-reflections/round-01.evaluation.json",
      ),
      "utf8",
    ),
  );
  assert.equal(evaluation.reviewProtocol.blindReviewCompleted, true);
  assert.equal(
    evaluation.reviewProtocol.sourceScorecards.production.hash.length,
    64,
  );
  assert.equal(evaluation.candidates[0].jobId, "ACV-001");
  assert.equal(evaluation.candidates[0].production.scores[dimensions[0]], 4);
  assert.equal(evaluation.candidates[0].humanVerdict, "pending");
});

test("identity references require eight approved regression views before a job can receive a qualified set", (t) => {
  const root = mkdtempSync(join(tmpdir(), "arcanea-reference-set-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));

  const coverage = [
    "close-portrait",
    "full-body-action",
    "grayscale-silhouette",
    "small-avatar",
    "wide-environment",
    "object-or-anatomy-detail",
    "two-character-relation",
    "ensemble-stability",
  ];
  const jobs = Array.from({ length: 9 }, (_, index) => ({
    id: `ACV-${String(index + 1).padStart(3, "0")}`,
    round: 1,
    entityId: "fixture-identity",
    subjectKind: "book-character",
    generationState: "review",
    blockedReason: null,
    releaseEligibility: "candidate-after-human-gates",
    promptContract: { contractHash: `contract-${index + 1}` },
  }));
  const campaign = {
    meta: { campaignId: "fixture-reference-campaign", version: "1.0.0" },
    rounds: [{ round: 1, jobs }],
  };
  writeJson(root, "apps/web/data/arcanea-visual-campaign.v1.json", campaign);

  const referencePaths = [];
  for (let index = 0; index < 8; index += 1) {
    const job = jobs[index];
    const image = Buffer.from(`approved-reference-image-${index + 1}`);
    const imageSha256 = createHash("sha256").update(image).digest("hex");
    const fileName = `${job.id.toLowerCase()}-r1.webp`;
    const stagedPublicUrl = `/images/arcanea-campaign/v1/round-01/${fileName}`;
    const stagedPath = join(
      root,
      "apps/web/public",
      stagedPublicUrl.replace(/^\//, ""),
    );
    mkdirSync(dirname(stagedPath), { recursive: true });
    writeFileSync(stagedPath, image);

    const outputReceiptPath = `planning-with-files/arcanea-visual-results/${job.id.toLowerCase()}-r1.json`;
    const outputBody = {
      schema: "arcanea.visual_output_receipt.v1",
      campaignId: campaign.meta.campaignId,
      campaignVersion: campaign.meta.version,
      jobId: job.id,
      round: 1,
      revision: 1,
      promptContractHash: job.promptContract.contractHash,
      output: {
        sha256: imageSha256,
        width: 1536,
        height: 1920,
        format: "webp",
      },
    };
    const outputReceipt = hashedReceipt(outputBody);
    writeJson(root, outputReceiptPath, outputReceipt);

    const approvalPath = `planning-with-files/arcanea-visual-releases/${job.id.toLowerCase()}-r1-approved.json`;
    const approvalBody = {
      schema: "arcanea.visual_release_decision.v1",
      campaignId: campaign.meta.campaignId,
      campaignVersion: campaign.meta.version,
      jobId: job.id,
      round: 1,
      outputRevision: 1,
      outputReceiptPath,
      outputReceiptHash: outputReceipt.receiptHash,
      imageSha256,
      decision: "approved",
      humanAttestation: true,
      releaseEligibility: "candidate-after-human-gates",
      stagedPublicUrl,
      gates: {
        canon: "human canon approval",
        identity: "human identity approval",
        rights: "owned test bytes",
        brand: "human brand approval",
        sensitivity: "not required with human reason",
      },
      evaluationReflectionPath:
        "planning-with-files/arcanea-visual-reflections/fixture.json",
      evaluationReceiptHash: `evaluation-${index + 1}`,
    };
    writeJson(root, approvalPath, hashedReceipt(approvalBody));

    const registered = run(
      REGISTER_REFERENCE,
      [
        "--job",
        job.id,
        "--revision",
        "1",
        "--role",
        "identity",
        "--coverage",
        coverage[index],
        "--accepted-by",
        "human:test",
        "--human-attestation",
        "confirmed",
        "--reason",
        "Accepted as one bounded regression fixture view.",
      ],
      root,
    );
    assert.equal(registered.status, 0, registered.stderr);
    referencePaths.push(
      `planning-with-files/arcanea-visual-references/fixture-identity/${job.id.toLowerCase()}-r1-identity.json`,
    );
  }

  const incomplete = run(
    QUALIFY_REFERENCE_SET,
    [
      "--entity",
      "fixture-identity",
      "--references",
      referencePaths.slice(0, 7).join(","),
      "--identity-lock-version",
      "v1",
      "--identity-lock-evidence",
      "Human identity lock evidence fixture v1.",
      "--qualified-by",
      "human:test",
      "--human-attestation",
      "confirmed",
      "--reason",
      "Attempted fixture qualification without all views.",
    ],
    root,
  );
  assert.equal(incomplete.status, 1);
  assert.match(incomplete.stderr, /at least eight distinct/);

  const qualified = run(
    QUALIFY_REFERENCE_SET,
    [
      "--entity",
      "fixture-identity",
      "--references",
      referencePaths.join(","),
      "--identity-lock-version",
      "v1",
      "--identity-lock-evidence",
      "Human identity lock evidence fixture v1.",
      "--qualified-by",
      "human:test",
      "--human-attestation",
      "confirmed",
      "--reason",
      "All eight fixture regression views agree on identity.",
    ],
    root,
  );
  assert.equal(qualified.status, 0, qualified.stderr);
  const setPath =
    "planning-with-files/arcanea-visual-references/fixture-identity/identity-set-v1.json";
  const setReceipt = JSON.parse(readFileSync(join(root, setPath), "utf8"));
  assert.equal(setReceipt.qualification, "identity-regression-qualified");
  assert.equal(Object.keys(setReceipt.coverageMatrix).length, 8);

  const assigned = run(
    ASSIGN_REFERENCES,
    [
      "--job",
      jobs[8].id,
      "--identity-reference-set",
      setPath,
      "--use-coverages",
      "close-portrait,full-body-action,grayscale-silhouette",
      "--assigned-by",
      "human:test",
      "--human-attestation",
      "confirmed",
      "--purpose",
      "Use the smallest sufficient identity set for this fixture job.",
    ],
    root,
  );
  assert.equal(assigned.status, 0, assigned.stderr);
  const assignment = JSON.parse(
    readFileSync(
      join(
        root,
        "planning-with-files/arcanea-visual-reference-assignments/acv-009.json",
      ),
      "utf8",
    ),
  );
  assert.equal(assignment.selected.length, 3);
  assert.equal(assignment.identityReferenceSetHash, setReceipt.receiptHash);
  assert.equal(assignment.humanAttestation, true);
});

test("release decisions are write-once, idempotent, and publication chains to approval", (t) => {
  const root = mkdtempSync(join(tmpdir(), "arcanea-release-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));

  const campaignId = "fixture-campaign";
  const campaignVersion = "1.0.0";
  const jobId = "ACV-001";
  const promptContractHash = "fixture-contract-hash";
  const outputReceiptRelative =
    "planning-with-files/arcanea-visual-results/acv-001-r1.json";
  const storagePath =
    "planning-with-files/arcanea-visual-assets/v1/round-01/acv-001-r1.png";
  const image = Buffer.from("write-once-fixture-image-bytes");
  const imageSha256 = createHash("sha256").update(image).digest("hex");
  const imagePath = join(root, storagePath);
  mkdirSync(dirname(imagePath), { recursive: true });
  writeFileSync(imagePath, image);

  const job = {
    id: jobId,
    round: 1,
    generationState: "review",
    blockedReason: null,
    promptContract: { contractHash: promptContractHash },
  };
  writeJson(root, "apps/web/data/arcanea-visual-campaign.v1.json", {
    meta: { campaignId, version: campaignVersion },
    rounds: [{ round: 1, jobs: [job] }],
  });
  const outputReceiptBody = {
    schema: "arcanea.visual_output_receipt.v1",
    campaignId,
    campaignVersion,
    jobId,
    round: 1,
    revision: 1,
    promptContractHash,
    releaseState: "internal-review",
    output: {
      storagePath,
      publicUrl: null,
      fileName: "acv-001-r1.png",
      bytes: image.length,
      sha256: imageSha256,
    },
  };
  writeJson(root, outputReceiptRelative, hashedReceipt(outputReceiptBody));
  const reflectionRelative =
    "planning-with-files/arcanea-visual-reflections/round-01.json";
  const reflectionBody = {
    schema: "arcanea.visual_round_reflection.v1",
    campaignId,
    campaignVersion,
    round: 1,
    candidates: [
      {
        jobId,
        outputReceiptPath: outputReceiptRelative,
        verdict: "pass-candidate",
        humanVerdict: "approved",
        reconciledTotal: 47,
      },
    ],
  };
  writeJson(root, reflectionRelative, hashedReceipt(reflectionBody));

  const approvalArgs = [
    "--job",
    jobId,
    "--revision",
    "1",
    "--decision",
    "approved",
    "--decided-by",
    "human:test",
    "--human-attestation",
    "confirmed",
    "--evaluation-reflection",
    reflectionRelative,
    "--canon-gate",
    "fixture-canon-approved",
    "--identity-gate",
    "fixture-identity-approved",
    "--rights-gate",
    "fixture-rights-cleared",
    "--brand-gate",
    "fixture-brand-approved",
    "--sensitivity-gate",
    "not-required:fixture",
  ];
  const approved = run(DECIDER, approvalArgs, root);
  assert.equal(approved.status, 0, approved.stderr);
  const approvalPath = join(
    root,
    "planning-with-files/arcanea-visual-releases/acv-001-r1-approved.json",
  );
  assert.equal(existsSync(approvalPath), true);
  assert.equal(
    existsSync(
      join(
        root,
        "apps/web/public/images/arcanea-campaign/v1/round-01/acv-001-r1.png",
      ),
    ),
    true,
  );
  const firstApproval = readFileSync(approvalPath, "utf8");

  const repeated = run(DECIDER, approvalArgs, root);
  assert.equal(repeated.status, 0, repeated.stderr);
  assert.equal(readFileSync(approvalPath, "utf8"), firstApproval);

  const published = run(
    DECIDER,
    [
      "--job",
      jobId,
      "--revision",
      "1",
      "--decision",
      "published",
      "--decided-by",
      "human:test",
      "--human-attestation",
      "confirmed",
      "--publication-evidence",
      "https://example.test/canonical-asset",
    ],
    root,
  );
  assert.equal(published.status, 0, published.stderr);
  assert.equal(
    existsSync(
      join(
        root,
        "planning-with-files/arcanea-visual-releases/acv-001-r1-published.json",
      ),
    ),
    true,
  );

  const conflictingRejection = run(
    DECIDER,
    [
      "--job",
      jobId,
      "--revision",
      "1",
      "--decision",
      "rejected",
      "--decided-by",
      "human:test",
      "--human-attestation",
      "confirmed",
      "--reason",
      "This fixture should not reverse approval.",
    ],
    root,
  );
  assert.equal(conflictingRejection.status, 1);
  assert.match(conflictingRejection.stderr, /cannot also be rejected/);
});

test("preflight capture preserves PP and storage evidence and keeps HOLD non-executable", (t) => {
  const root = mkdtempSync(join(tmpdir(), "arcanea-preflight-capture-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  const timestamp = new Date().toISOString();
  const basePlan = {
    timestamp,
    hostname: "fixture-host",
    workload: "overnight",
    decision: "bounded",
    summary: "fixture bounded plan",
    posture: "constrain",
    swarmPosture: "pause-new",
    current: { codexTaskRuntimes: 5 },
    budget: { maxParallelism: 1, timeoutMinutes: 480 },
    requirements: { receiptRequired: true },
    hardBlocks: [],
    constraints: ["one bounded workload"],
    actions: ["stop after work"],
  };
  const inputPath = writeJson(root, "pp-bounded.json", basePlan);
  const storagePlan = {
    schemaVersion: "starlight.storage.plan.v1",
    planId: "storage-fixture-open",
    generatedAt: timestamp,
    mode: "quick",
    machine: {
      volume: "C:\\",
      freeGiB: 300,
      freePercent: 31.5,
    },
    posture: { storageState: "open" },
  };
  const storageInputPath = writeJson(root, "storage-open.json", storagePlan);
  const outputRelative =
    "planning-with-files/arcanea-visual-authority/round-01-preflight.json";
  const outputPath = join(root, outputRelative);
  const bounded = run(
    CAPTURE_PREFLIGHT,
    [
      "--input",
      inputPath,
      "--storage-input",
      storageInputPath,
      "--write",
      outputPath,
      "--ttl-minutes",
      "15",
    ],
    root,
  );
  assert.equal(bounded.status, 0, bounded.stderr);
  const receipt = readJson(outputPath);
  const { receiptHash, ...receiptBody } = receipt;
  assert.equal(receiptHash, sha(receiptBody));
  assert.equal(receipt.schema, "arcanea.machine_preflight_receipt.v2");
  assert.equal(receipt.workload, "image-generation");
  assert.equal(receipt.sourceWorkload, "overnight");
  assert.equal(receipt.ppPlanHash, sha(basePlan));
  assert.equal(receipt.performancePosture, "bounded");
  assert.equal(receipt.posture, "bounded");
  assert.equal(receipt.storageEvidence.freePercent, 31.5);
  assert.equal(receipt.storageEvidence.mediaGenerationAllowed, true);
  const { evidenceHash, ...storageEvidenceBody } = receipt.storageEvidence;
  assert.equal(evidenceHash, sha(storageEvidenceBody));

  const blockedStoragePlan = {
    ...storagePlan,
    planId: "storage-fixture-bounded",
    machine: {
      ...storagePlan.machine,
      freeGiB: 77.2,
      freePercent: 8.1,
    },
    posture: { storageState: "critical" },
  };
  const blockedStorageInput = writeJson(
    root,
    "storage-bounded.json",
    blockedStoragePlan,
  );
  const storageHoldOutput = join(
    root,
    "planning-with-files/arcanea-visual-authority/round-01-storage-hold.json",
  );
  const storageHeld = run(
    CAPTURE_PREFLIGHT,
    [
      "--input",
      inputPath,
      "--storage-input",
      blockedStorageInput,
      "--write",
      storageHoldOutput,
    ],
    root,
  );
  assert.equal(storageHeld.status, 2);
  const storageHoldReceipt = readJson(storageHoldOutput);
  assert.equal(storageHoldReceipt.performancePosture, "bounded");
  assert.equal(storageHoldReceipt.posture, "hold");
  assert.equal(
    storageHoldReceipt.storageEvidence.mediaGenerationAllowed,
    false,
  );

  const holdPlan = {
    ...basePlan,
    decision: "hold",
    summary: "fixture held plan",
    hardBlocks: ["task runtime budget exceeded"],
    constraints: [],
  };
  const holdInput = writeJson(root, "pp-hold.json", holdPlan);
  const holdOutput = join(
    root,
    "planning-with-files/arcanea-visual-authority/round-01-hold.json",
  );
  const held = run(
    CAPTURE_PREFLIGHT,
    [
      "--input",
      holdInput,
      "--storage-input",
      storageInputPath,
      "--write",
      holdOutput,
    ],
    root,
  );
  assert.equal(held.status, 2);
  assert.equal(readJson(holdOutput).posture, "hold");
});

test("readiness reconstructs the resume point and accepts only a current narrow grant", (t) => {
  const root = mkdtempSync(join(tmpdir(), "arcanea-execution-readiness-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  const campaignId = "readiness-campaign";
  const campaignVersion = "1.0.0";
  const providerProfile = "codex-imagegen";
  const provider = "codex-imagegen-tool";
  const modelPolicy = "tool-managed-model-selection";
  const sourceContractSetHash = "fixture-contract-set";
  const jobs = ["ACV-001", "ACV-002"].map((id) => ({
    id,
    round: 1,
    generationState: "planned",
    blockedReason: null,
    sensitivityReviewRequired: false,
    promptContract: { contractHash: `contract-${id.toLowerCase()}` },
  }));
  writeJson(root, "apps/web/data/arcanea-visual-campaign.v1.json", {
    meta: { campaignId, version: campaignVersion },
    rounds: [{ round: 1, jobs }],
  });
  const manifestBody = {
    schema: "arcanea.provider_execution_manifest.v1",
    campaignId,
    campaignVersion,
    round: 1,
    sourceContractSetHash,
    profileId: providerProfile,
    promptCompilerVersion: "2.0.0",
    profile: { provider, modelPolicy },
    jobs: jobs.map((job) => ({
      id: job.id,
      executionState: "executable",
      promptContractHash: job.promptContract.contractHash,
      executionPromptHash: `prompt-${job.id.toLowerCase()}`,
    })),
  };
  const manifest = { ...manifestBody, manifestHash: sha(manifestBody) };
  const manifestRelative =
    "planning-with-files/arcanea-visual-campaign/execution-manifests/round-01-codex-imagegen-fixture.json";
  writeJson(root, manifestRelative, manifest);
  const packetBody = {
    schema: "arcanea.provider_execution_packet.v1",
    campaignId,
    campaignVersion,
    round: 1,
    sourceContractSetHash,
    profileId: providerProfile,
    profile: { provider, modelPolicy },
    executionManifest: {
      path: manifestRelative,
      hash: manifest.manifestHash,
    },
    jobs: manifest.jobs,
  };
  const packet = { ...packetBody, packetHash: sha(packetBody) };
  const packetRelative =
    "planning-with-files/arcanea-visual-campaign/round-01-codex-imagegen-provider-pack.json";
  writeJson(root, packetRelative, packet);
  const indexBody = {
    schema: "arcanea.provider_execution_manifest_index.v1",
    campaignId,
    currentCampaignVersion: campaignVersion,
    promptCompilerVersion: "2.0.0",
    executionRule: "fixture current-only rule",
    current: [
      {
        round: 1,
        profileId: providerProfile,
        manifestPath: manifestRelative,
        manifestHash: manifest.manifestHash,
        sourceContractSetHash,
        providerPacketPath: packetRelative,
        providerPacketHash: packet.packetHash,
      },
    ],
    lineage: [
      {
        path: manifestRelative,
        manifestHash: manifest.manifestHash,
        campaignVersion,
        round: 1,
        profileId: providerProfile,
        promptCompilerVersion: "2.0.0",
        sourceContractSetHash,
        status: "current-active",
        boundOutputReceipts: [],
      },
    ],
  };
  const indexRelative =
    "planning-with-files/arcanea-visual-campaign/execution-manifests/index.json";
  writeJson(root, indexRelative, {
    ...indexBody,
    indexHash: sha(indexBody),
  });

  const waiting = run(
    READINESS,
    ["--round", "1", "--provider", providerProfile, "--json"],
    root,
  );
  assert.equal(waiting.status, 0, waiting.stderr);
  const waitingReport = JSON.parse(waiting.stdout);
  assert.equal(waitingReport.state, "execution-awaiting-authority");
  assert.deepEqual(waitingReport.missingJobIds, ["ACV-001", "ACV-002"]);
  assert.deepEqual(waitingReport.blockers, [
    "fresh-machine-preflight-missing",
    "narrow-execution-grant-missing",
  ]);
  assert.match(waitingReport.nextAction, /one-job grant for ACV-001/);

  const template = run(
    READINESS,
    ["--round", "1", "--provider", providerProfile, "--template"],
    root,
  );
  assert.equal(template.status, 0, template.stderr);
  const grantTemplate = JSON.parse(template.stdout);
  assert.deepEqual(grantTemplate.jobIds, ["ACV-001"]);
  assert.equal(grantTemplate.maxCalls, 1);
  assert.equal(grantTemplate.maxRevisionCalls, 0);

  const now = Date.now();
  const ppPlan = {
    timestamp: new Date(now - 60_000).toISOString(),
    workload: "overnight",
    decision: "bounded",
    summary: "fixture overnight work may run once with bounded limits",
    budget: { maxParallelism: 1 },
    hardBlocks: [],
    constraints: ["fixture one-workload limit"],
  };
  const storageEvidenceBody = {
    schema: "arcanea.storage_preflight_evidence.v1",
    policy: "starlight-machine-performance-contract-v1.1",
    planId: "storage-readiness-fixture",
    generatedAt: ppPlan.timestamp,
    mode: "quick",
    volume: "C:\\",
    freeGiB: 300,
    freePercent: 31.5,
    storageState: "open",
    hardFloorPercent: 8,
    mediaAdmissionPercent: 15,
    mediaGenerationAllowed: true,
    rawPlanHash: "a".repeat(64),
  };
  const storageEvidence = {
    ...storageEvidenceBody,
    evidenceHash: sha(storageEvidenceBody),
  };
  const preflightBody = {
    schema: "arcanea.machine_preflight_receipt.v2",
    workload: "image-generation",
    sourceWorkload: "overnight",
    performancePosture: "bounded",
    posture: "bounded",
    maxParallelCalls: 1,
    checkedAt: ppPlan.timestamp,
    expiresAt: new Date(now + 10 * 60_000).toISOString(),
    checkedBy: "pp-fixture",
    evidence: "fixture bounded preflight",
    ppPlan,
    ppPlanHash: sha(ppPlan),
    storageEvidence,
  };
  const preflight = hashedReceipt(preflightBody);
  const preflightRelative =
    "planning-with-files/arcanea-visual-authority/round-01-preflight.json";
  const preflightPath = writeJson(root, preflightRelative, preflight);
  const grantRelative =
    "planning-with-files/arcanea-visual-authority/round-01-grant.json";
  const grantPath = join(root, grantRelative);
  const issued = run(
    ISSUE_GRANT,
    [
      "--round",
      "1",
      "--provider",
      providerProfile,
      "--preflight",
      preflightPath,
      "--spend-approved-by",
      "human:test",
      "--spend-boundary",
      "one initial tool call only",
      "--rights-attested-by",
      "human:test",
      "--issued-by",
      "human:test",
      "--authority-evidence",
      "fixture user decision record",
      "--human-attestation",
      "confirmed",
      "--parameters",
      "{}",
      "--write",
      grantPath,
    ],
    root,
  );
  assert.equal(issued.status, 0, issued.stderr);
  const issuedGrant = readJson(grantPath);
  const { grantHash: issuedGrantHash, ...issuedGrantBody } = issuedGrant;
  assert.equal(issuedGrantHash, sha(issuedGrantBody));
  assert.equal(issuedGrant.humanAttestation, true);
  const ready = run(
    READINESS,
    [
      "--round",
      "1",
      "--provider",
      providerProfile,
      "--preflight",
      preflightPath,
      "--grant",
      grantPath,
      "--require-ready",
      "--json",
    ],
    root,
  );
  assert.equal(ready.status, 0, ready.stderr);
  const readyReport = JSON.parse(ready.stdout);
  assert.equal(readyReport.state, "round-running");
  assert.equal(readyReport.readyForImageCalls, true);
  assert.deepEqual(readyReport.authorizedJobIds, ["ACV-001"]);
  assert.equal(readyReport.maximumCalls, 1);

  const blockedStorageEvidenceBody = {
    ...storageEvidenceBody,
    planId: "storage-readiness-blocked-fixture",
    freeGiB: 77.2,
    freePercent: 8.1,
    storageState: "critical",
    mediaGenerationAllowed: false,
    rawPlanHash: "b".repeat(64),
  };
  const blockedStorageEvidence = {
    ...blockedStorageEvidenceBody,
    evidenceHash: sha(blockedStorageEvidenceBody),
  };
  const blockedPreflightBody = {
    ...preflightBody,
    posture: "hold",
    storageEvidence: blockedStorageEvidence,
  };
  const blockedPreflightPath = writeJson(
    root,
    "planning-with-files/arcanea-visual-authority/round-01-storage-hold.json",
    hashedReceipt(blockedPreflightBody),
  );
  const blockedGrantPath = join(
    root,
    "planning-with-files/arcanea-visual-authority/round-01-storage-held-grant.json",
  );
  const deniedByStorage = run(
    ISSUE_GRANT,
    [
      "--round",
      "1",
      "--provider",
      providerProfile,
      "--preflight",
      blockedPreflightPath,
      "--spend-approved-by",
      "human:test",
      "--spend-boundary",
      "two initial tool calls only",
      "--rights-attested-by",
      "human:test",
      "--issued-by",
      "human:test",
      "--authority-evidence",
      "fixture user decision record",
      "--human-attestation",
      "confirmed",
      "--parameters",
      "{}",
      "--write",
      blockedGrantPath,
    ],
    root,
  );
  assert.equal(deniedByStorage.status, 2);
  assert.match(deniedByStorage.stderr, /held by performance or storage policy/i);
  assert.equal(existsSync(blockedGrantPath), false);

  const historicalIndexBody = {
    ...indexBody,
    current: [],
    lineage: indexBody.lineage.map((entry) => ({
      ...entry,
      status: "historical-unbound",
    })),
  };
  writeJson(root, indexRelative, {
    ...historicalIndexBody,
    indexHash: sha(historicalIndexBody),
  });
  const deniedHistorical = run(
    READINESS,
    ["--round", "1", "--provider", providerProfile],
    root,
  );
  assert.equal(deniedHistorical.status, 2);
  assert.match(deniedHistorical.stderr, /manifest index.*disagree/i);
  const fakeImagePath = join(root, "candidate.png");
  writeFileSync(fakeImagePath, Buffer.from("not-decoded-because-gate-fails"));
  const deniedHistoricalRecord = run(
    RECORDER,
    [
      "--job",
      "ACV-001",
      "--source",
      fakeImagePath,
      "--provider",
      provider,
      "--model",
      "fixture-model",
      "--execution-manifest",
      join(root, manifestRelative),
      "--execution-prompt-hash",
      "prompt-acv-001",
      "--generation-receipt",
      "fixture-provider-receipt",
      "--preflight-receipt",
      preflightPath,
      "--execution-grant",
      grantPath,
      "--spend-approved-by",
      "human:test",
    ],
    root,
  );
  assert.equal(deniedHistoricalRecord.status, 1);
  assert.match(deniedHistoricalRecord.stderr, /not current-active/);
  writeJson(root, indexRelative, {
    ...indexBody,
    indexHash: sha(indexBody),
  });

  const tamperedGrant = readJson(grantPath);
  tamperedGrant.maxCalls = 3;
  writeJson(root, grantRelative, tamperedGrant);
  const denied = run(
    READINESS,
    [
      "--round",
      "1",
      "--provider",
      providerProfile,
      "--preflight",
      preflightPath,
      "--grant",
      grantPath,
      "--require-ready",
    ],
    root,
  );
  assert.equal(denied.status, 2);
  assert.match(denied.stderr, /Execution grant hash is invalid/);
});

test("release gate keeps discovery studies internal and requires named specialist evidence", (t) => {
  function fixture(jobId, jobOverrides = {}) {
    const root = mkdtempSync(join(tmpdir(), "arcanea-readiness-"));
    t.after(() => rmSync(root, { force: true, recursive: true }));
    const campaignId = "readiness-fixture";
    const campaignVersion = "1.2.0";
    const promptContractHash = "contract-" + jobId.toLowerCase();
    const stem = jobId.toLowerCase() + "-r1";
    const outputReceiptRelative =
      "planning-with-files/arcanea-visual-results/" + stem + ".json";
    const storagePath =
      "planning-with-files/arcanea-visual-assets/v1/round-07/" + stem + ".png";
    const image = Buffer.from("readiness-fixture-" + jobId);
    const imageSha256 = createHash("sha256").update(image).digest("hex");
    const imagePath = join(root, storagePath);
    mkdirSync(dirname(imagePath), { recursive: true });
    writeFileSync(imagePath, image);

    const job = {
      id: jobId,
      round: 7,
      generationState: "review",
      blockedReason: null,
      releaseEligibility: "candidate-after-human-gates",
      sensitivityReviewRequired: false,
      reviewRequirements: [],
      promptContract: { contractHash: promptContractHash },
      ...jobOverrides,
    };
    writeJson(root, "apps/web/data/arcanea-visual-campaign.v1.json", {
      meta: { campaignId, version: campaignVersion },
      rounds: [{ round: 7, jobs: [job] }],
    });
    writeJson(
      root,
      outputReceiptRelative,
      hashedReceipt({
        schema: "arcanea.visual_output_receipt.v1",
        campaignId,
        campaignVersion,
        jobId,
        round: 7,
        revision: 1,
        promptContractHash,
        releaseState: "internal-review",
        output: {
          storagePath,
          publicUrl: null,
          fileName: stem + ".png",
          bytes: image.length,
          sha256: imageSha256,
        },
      }),
    );
    const reflectionRelative =
      "planning-with-files/arcanea-visual-reflections/round-07.json";
    writeJson(
      root,
      reflectionRelative,
      hashedReceipt({
        schema: "arcanea.visual_round_reflection.v1",
        campaignId,
        campaignVersion,
        round: 7,
        candidates: [
          {
            jobId,
            outputReceiptPath: outputReceiptRelative,
            verdict: "pass-candidate",
            humanVerdict: "approved",
            reconciledTotal: 48,
          },
        ],
      }),
    );
    const args = [
      "--job",
      jobId,
      "--revision",
      "1",
      "--decision",
      "approved",
      "--decided-by",
      "human:test",
      "--human-attestation",
      "confirmed",
      "--evaluation-reflection",
      reflectionRelative,
      "--canon-gate",
      "fixture-canon-reviewed",
      "--identity-gate",
      "fixture-identity-reviewed",
      "--rights-gate",
      "fixture-rights-reviewed",
      "--brand-gate",
      "fixture-brand-reviewed",
      "--sensitivity-gate",
      "not-required:fixture",
    ];
    return { root, args };
  }

  const discovery = fixture("ACV-067", {
    releaseEligibility: "internal-only-until-identity-lock",
  });
  const deniedDiscovery = run(DECIDER, discovery.args, discovery.root);
  assert.equal(deniedDiscovery.status, 1);
  assert.match(deniedDiscovery.stderr, /identity-discovery study/);
  assert.equal(
    existsSync(
      join(
        discovery.root,
        "apps/web/public/images/arcanea-campaign/v1/round-07/acv-067-r1.png",
      ),
    ),
    false,
  );

  const sensitive = fixture("ACV-066", {
    sensitivityReviewRequired: true,
    reviewRequirements: [
      "A paid Venezuelan-Spanish woman reader reviews the visual.",
    ],
  });
  const deniedGenericEvidence = run(DECIDER, sensitive.args, sensitive.root);
  assert.equal(deniedGenericEvidence.status, 1);
  assert.match(
    deniedGenericEvidence.stderr,
    /specific sensitivity-review evidence/,
  );

  const evidenceIndex = sensitive.args.indexOf("--sensitivity-gate") + 1;
  sensitive.args[evidenceIndex] =
    "review-record:venezuelan-reader-2026-08-24-approved";
  const approvedWithEvidence = run(DECIDER, sensitive.args, sensitive.root);
  assert.equal(approvedWithEvidence.status, 0, approvedWithEvidence.stderr);
});
