import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";

import {
  SUPPORTED_OUTPUT_ASPECT_RATIOS,
  providerDimensionsForAspect,
} from "./lib/arcanea-image-output.mjs";

const ROOT = process.cwd();
const campaign = JSON.parse(
  readFileSync(
    join(ROOT, "apps/web/data/arcanea-visual-campaign.v1.json"),
    "utf8",
  ),
);

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const roundNumber = Number(arg("--round", "1"));
const requestedProvider = arg("--provider", "all");
if (!Number.isInteger(roundNumber) || roundNumber < 1 || roundNumber > 10) {
  throw new Error("--round must be an integer from 1 to 10.");
}

const roundId = String(roundNumber).padStart(2, "0");
const sourcePackPath = join(
  ROOT,
  `planning-with-files/arcanea-visual-campaign/round-${roundId}-prompt-pack.json`,
);
const sourcePack = JSON.parse(readFileSync(sourcePackPath, "utf8"));
if (
  sourcePack.campaignId !== campaign.meta.campaignId ||
  sourcePack.campaignVersion !== campaign.meta.version ||
  sourcePack.round !== roundNumber
) {
  throw new Error(`Round ${roundId} source prompt pack is stale.`);
}

const sha = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const unique = (values) => [...new Set(values.filter(Boolean))];
const allJobs = campaign.rounds.flatMap((round) => round.jobs);
const PROMPT_COMPILER_VERSION = "2.1.3";
const sourceContractSetHash = sha({
  schema: sourcePack.schema,
  campaignId: sourcePack.campaignId,
  campaignVersion: sourcePack.campaignVersion,
  round: sourcePack.round,
  purpose: sourcePack.purpose,
  adaptiveDecision: sourcePack.adaptiveDecision,
  selectedStyle: sourcePack.selectedStyle,
  selectedSecondaryMode: sourcePack.selectedSecondaryMode,
  styleAllocation: sourcePack.styleAllocation,
  jobs: sourcePack.jobs.map((job) => ({
    id: job.id,
    generationState: job.generationState,
    blockedReason: job.blockedReason,
    styleState: job.styleState,
    promptContractHash: job.promptContractHash,
    compiledPrompt: job.compiledPrompt,
  })),
});

function writeOnce(path, value, label) {
  const serialized = `${JSON.stringify(value, null, 2)}\n`;
  if (existsSync(path)) {
    if (readFileSync(path, "utf8") !== serialized) {
      throw new Error(
        `${label} already exists with different content: ${path}`,
      );
    }
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, serialized, "utf8");
}

const OFFICIAL_RESEARCH = {
  openai: {
    url: "https://developers.openai.com/api/docs/guides/image-generation",
    verifiedAt: "2026-08-25",
    basis:
      "GPT Image 2 supports generation and editing, automatic high-fidelity image inputs, and flexible sizes whose edges are multiples of 16, ratio is at most 3:1, and area is 655,360–8,294,400 pixels, plus quality, format, compression, and background controls.",
  },
  gemini: {
    url: "https://ai.google.dev/gemini-api/docs/image-generation",
    verifiedAt: "2026-08-25",
    basis:
      "Gemini 3 image models support 1K–4K output, multi-turn edits, multiple typed references, image-only response formats, and explicit ratios including 4:5, 16:9, and 21:9; reference and pixel dimensions vary by model.",
  },
  flux: {
    url: "https://docs.bfl.ai/guides/prompting_guide_flux2",
    verifiedAt: "2026-08-25",
    basis:
      "FLUX.2 prioritizes subject, action, style, then context; has no negative-prompt channel; requires dimensions divisible by 16; permits up to 4MP; and recommends up to approximately 2MP for most work. Multi-reference limits depend on output size.",
  },
  codexImagegen: {
    url: "local-skill:imagegen",
    verifiedAt: "2026-08-25",
    basis:
      "The installed imagegen skill accepts one execution prompt and either local reference paths or the smallest sufficient set of recent conversation images.",
  },
};

const PROFILES = {
  "openai-gpt-image": {
    provider: "openai",
    lane: "primary-high-fidelity-reference-and-editing",
    modelPolicy: "discover-current-supported-model-at-runtime",
    research: OFFICIAL_RESEARCH.openai,
    supportsNegativeGuidance: true,
    maximumPlannedReferences: 8,
  },
  "gemini-native-image": {
    provider: "google",
    lane: "secondary-multi-reference-consistency-and-4k-production",
    modelPolicy:
      "discover-current-Gemini-3-image-model-and-reference-limits-at-runtime",
    research: OFFICIAL_RESEARCH.gemini,
    supportsNegativeGuidance: true,
    maximumPlannedReferences: 5,
  },
  "flux-2": {
    provider: "black-forest-labs",
    lane: "adversarial-interpretation-and-material-rendering",
    modelPolicy: "discover-current-FLUX-2-variant-at-runtime",
    research: OFFICIAL_RESEARCH.flux,
    supportsNegativeGuidance: false,
    maximumPlannedReferences: 7,
  },
  "codex-imagegen": {
    provider: "codex-imagegen-tool",
    lane: "available-governed-tool-lane",
    modelPolicy: "tool-managed-model-selection",
    research: OFFICIAL_RESEARCH.codexImagegen,
    supportsNegativeGuidance: true,
    maximumPlannedReferences: 5,
  },
};

if (requestedProvider !== "all" && !PROFILES[requestedProvider]) {
  throw new Error(
    `Unknown --provider ${requestedProvider}. Use all or one of: ${Object.keys(PROFILES).join(", ")}.`,
  );
}

function aspectRatio(contract) {
  const declared = contract.output?.aspectRatio;
  const compositionRatio = contract.composition.match(
    /\b(21:9|16:9|9:16|4:5|3:2|2:3|4:3|3:4|1:1)\b/,
  )?.[1];
  if (!declared || !SUPPORTED_OUTPUT_ASPECT_RATIOS.includes(declared)) {
    throw new Error(
      `${contract.subject.displayName} has no supported machine-readable output aspect ratio.`,
    );
  }
  if (compositionRatio !== declared) {
    throw new Error(
      `${contract.subject.displayName} output aspect ratio ${declared} conflicts with composition ratio ${compositionRatio ?? "missing"}.`,
    );
  }
  return declared;
}

const positiveAvoidanceRules = [
  [
    /generic fantasy concept art/i,
    "authored Arcanea-specific form and behavior",
  ],
  [
    /rainbow galaxy effects/i,
    "one localized functional phenomenon in a materially neutral world",
  ],
  [
    /permanent flame crystal or waterfall hair/i,
    "hair, fibers, fur, and surfaces obey gravity and material construction",
  ],
  [
    /style imitation/i,
    "an original visual language independent of living creators and franchises",
  ],
  [
    /appropriated sacred/i,
    "culturally neutral constructed dress unless a reviewed source contract specifies otherwise",
  ],
  [
    /pseudo-text/i,
    "a clean image field containing only intentional visual forms",
  ],
  [
    /sexualized or childlike/i,
    "adult premium nonsexualized proportions and presentation",
  ],
  [
    /color as the only identity signal/i,
    "identity readable through grayscale silhouette, material, and action",
  ],
  [
    /parchment cosplay/i,
    "restrained contemporary field-document surface treatment",
  ],
  [/trading-card clutter/i, "one clear hierarchy with generous negative space"],
  [/ornamental borders/i, "edge-to-edge undecorated composition"],
  [
    /sepia wash/i,
    "materially accurate neutral color with localized active accents",
  ],
  [
    /superhero/i,
    "bounded working presence with believable weight and an active task posture",
  ],
  [/robot/i, "purpose-built nonhumanoid instrument geometry"],
  [
    /holographic dashboard/i,
    "physical evidence objects and tactile decision surfaces",
  ],
  [
    /toy/i,
    "mature proportions, believable weight, and production-grade materials",
  ],
  [
    /oversized eyes/i,
    "anatomically proportionate eyes or non-facial instrument apertures",
  ],
  [
    /plastic/i,
    "tactile surfaces with construction, wear, and environmental response",
  ],
];

function positiveQualities(avoid) {
  return unique(
    avoid.map((item) => {
      const match = positiveAvoidanceRules.find(([pattern]) =>
        pattern.test(item),
      );
      return (
        match?.[1] ?? "specific authored form with physically legible materials"
      );
    }),
  );
}

function positiveRewrite(value) {
  const rewritten = value
    .replace(
      /This is an identity-discovery study, not an identity master\./gi,
      "This is a provisional comparative identity-discovery study.",
    )
    .replace(
      /without being treated as canon/gi,
      "as explicitly provisional candidates",
    )
    .replace(/may not drift/gi, "remain fixed")
    .replace(/must not drift/gi, "remain fixed")
    .replace(
      /must never be described as locked canon/gi,
      "remain explicitly provisional",
    )
    .replace(
      /must never be labeled an identity master/gi,
      "remains a provisional discovery plate",
    )
    .replace(/never a generic warrior queen/gi, "an exacting maker-sovereign")
    .replace(
      /without obeying or rescuing her/gi,
      "while retaining independent agency",
    )
    .replace(
      /never rider and mount/gi,
      "two self-directed sovereign counterparts at reciprocal distance",
    )
    .replace(
      /neither figure commands or mounts the other/gi,
      "both figures show equal independent agency at reciprocal distance",
    )
    .replace(
      /not armor, a crown, fire hair, domination, or invincible-warrior shorthand/gi,
      "through disciplined making, material truth, and the decision to stop",
    )
    .replace(
      /without becoming a rainbow portal/gi,
      "as a controlled optical transformation instrument",
    )
    .replace(
      /not a mythological deity, generic robot, humanoid mascot, or autonomous authority/gi,
      "a bounded public product identity and nonhumanoid operational instrument",
    )
    .replace(/no mascot energy/gi, "mature editorial gravity")
    .replace(/no glamour pose/gi, "an active working posture")
    .replace(
      /no fire-breath/gi,
      "material consequence through pressure and tempering",
    )
    .replace(/no generated labels/gi, "legibility through material action")
    .replace(/no text/gi, "purely visual communication");
  return rewritten
    .split(/(?<=[.!?])\s+/)
    .filter(
      (sentence) =>
        !/\b(no|not|never|without|avoid|banned|neither)\b/i.test(sentence),
    )
    .join(" ")
    .trim();
}

const governanceOnlyConstraintPatterns = [
  /must never be described as locked canon/i,
  /controlled proposal under evaluation/i,
  /canonical portrait or identity master/i,
  /story-bible evidence outranks/i,
  /compare against accepted identity reference hash/i,
  /stop if no accepted reference exists/i,
  /physical embodiment remains provisional/i,
  /release eligibility/i,
  /human approval/i,
];

const operationalPromptTerms = [
  ["canon", /\bcanon(?:ical)?\b/i],
  ["identity-master", /\bidentity master\b/i],
  ["approval", /\bapproval\b/i],
  ["release-governance", /\brelease eligibility\b/i],
  ["review-governance", /\breview requirements?\b/i],
  ["proposal-governance", /\bunder evaluation\b/i],
  ["creator-proposed", /\bcreator-proposed\b/i],
];

function imageFacingText(value) {
  return value
    .replace(
      /This internal study tests one named creator-proposed morphology candidate\./gi,
      "Use this morphology as the single controlled body proposal for this comparative plate.",
    )
    .replace(
      /This is an identity-discovery study, not an identity master\./gi,
      "Use one coherent provisional identity proposal for this comparative plate.",
    )
    .replace(
      /The held candidate is not canon and implies no acceptance\./gi,
      "",
    )
    .replace(
      /Locked Gate relation and locally grounded functional phenomena may not drift\./gi,
      "Keep the Gate relation and grounded functional phenomena fixed.",
    )
    .replace(
      /without being treated as canon/gi,
      "inside this comparative plate",
    )
    .replace(
      /its exact body remains canon-pending/gi,
      "use the described body as one coherent comparison candidate",
    )
    .replace(/creator-proposed/gi, "specified")
    .replace(/so the candidate can be evaluated/gi, "for a clean comparison")
    .replace(/canon-pending/gi, "provisional")
    .replace(/locked relation/gi, "stable relation")
    .replace(/may not drift/gi, "remain fixed")
    .replace(/must not drift/gi, "remain fixed")
    .replace(
      /adult premium editorial finish; no mascot energy/gi,
      "adult premium editorial finish with mature editorial gravity",
    )
    .replace(/no mascot energy/gi, "mature editorial gravity")
    .replace(/no glamour pose/gi, "an active working posture")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .trim();
}

function constraintPartition(contract) {
  const withheld = contract.constraints.filter((constraint) =>
    governanceOnlyConstraintPatterns.some((pattern) =>
      pattern.test(constraint),
    ),
  );
  const visible = unique(
    contract.constraints
      .filter((constraint) => !withheld.includes(constraint))
      .filter(
        (constraint) =>
          !imageFacingText(contract.subject.identityLock)
            .toLowerCase()
            .includes(imageFacingText(constraint).toLowerCase()),
      )
      .map(imageFacingText)
      .map((constraint) => constraint.replace(/[.!?]+$/g, "").trim()),
  );
  return {
    visible: visible.map(
      (constraint) =>
        `${constraint.charAt(0).toUpperCase()}${constraint.slice(1)}`,
    ),
    withheld,
  };
}

function avoidancePartition(avoid) {
  const withheld = avoid.filter((item) =>
    operationalPromptTerms.some(([, pattern]) => pattern.test(item)),
  );
  return {
    visible: avoid.filter((item) => !withheld.includes(item)),
    withheld,
  };
}

function promptAudit(executionPrompt, constraintParts, avoidanceParts) {
  const operationalTermsPresent = operationalPromptTerms
    .filter(([, pattern]) => pattern.test(executionPrompt))
    .map(([label]) => label);
  return {
    compilerVersion: PROMPT_COMPILER_VERSION,
    characters: executionPrompt.length,
    words: executionPrompt.trim().split(/\s+/).length,
    imageFacingConstraintCount: constraintParts.visible.length,
    withheldGovernanceConstraintCount: constraintParts.withheld.length,
    withheldGovernanceConstraintsHash: sha(constraintParts.withheld),
    imageFacingAvoidanceCount: avoidanceParts.visible.length,
    withheldGovernanceAvoidanceCount: avoidanceParts.withheld.length,
    withheldGovernanceAvoidanceHash: sha(avoidanceParts.withheld),
    operationalTermsPresent,
  };
}

function selectedStyleFor(job) {
  const sourceJob = sourcePack.jobs.find(
    (candidate) => candidate.id === job.id,
  );
  const selectedId = sourceJob?.styleState ?? job.styleState;
  return campaign.styles.find((style) => style.id === selectedId) ?? null;
}

function visualSections(job) {
  const contract = job.promptContract;
  const selectedStyle = selectedStyleFor(job);
  const avoid = unique([...contract.avoid, ...(selectedStyle?.avoid ?? [])]);
  const direction = selectedStyle?.direction ?? contract.designSystem.direction;
  return { contract, avoid, direction };
}

function structuredVisualPrompt(job, providerProfileId) {
  const { contract, avoid, direction } = visualSections(job);
  const avoidanceParts = avoidancePartition(avoid);
  const positive = positiveQualities(avoidanceParts.visible);
  const partition = constraintPartition(contract);
  const header = `${contract.subject.displayName}. ${imageFacingText(contract.subject.identityLock)}`;
  const common = [
    header,
    `Action and story consequence: ${imageFacingText(contract.storyBeat)}`,
    `Composition: ${imageFacingText(contract.composition)}`,
    `Intended surface: ${contract.output.intendedSurface.replaceAll("-", " ")}. Crop safety: ${imageFacingText(contract.output.cropSafety)}`,
    `Visual direction: ${direction}. ${contract.designSystem.colorLaw} ${contract.designSystem.materialLaw}`,
    `Light: ${imageFacingText(contract.light)}`,
    `Identity variation boundary: ${imageFacingText(contract.subject.allowedVariation)}`,
    `Required visible result: ${partition.visible.join(". ")}.`,
  ];

  if (providerProfileId === "flux-2") {
    return [
      positiveRewrite(header),
      `Action and story consequence: ${positiveRewrite(imageFacingText(contract.storyBeat))}`,
      `Composition: ${positiveRewrite(imageFacingText(contract.composition))}`,
      `Intended surface: ${positiveRewrite(contract.output.intendedSurface.replaceAll("-", " "))}. Crop safety: ${positiveRewrite(imageFacingText(contract.output.cropSafety))}`,
      `Visual direction: ${positiveRewrite(`${direction}. ${contract.designSystem.colorLaw} ${contract.designSystem.materialLaw}`)}`,
      `Light: ${positiveRewrite(imageFacingText(contract.light))}`,
      `Identity variation boundary: ${positiveRewrite(imageFacingText(contract.subject.allowedVariation))}`,
      `Required visible result: ${partition.visible.map(positiveRewrite).filter(Boolean).join(". ")}.`,
      `Desired qualities: ${positive.join(". ")}.`,
      "Image surface: clean, caption-free, logo-free, and watermark-free, with only intentional visual forms.",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    `Create exactly one ${aspectRatio(contract)} Arcanea visual study.`,
    ...common,
    `Keep the image free of: ${avoidanceParts.visible.join("; ")}.`,
    "Return image content only. Do not place captions, labels, logos, borders, watermarks, or pseudo-glyphs inside the image.",
  ].join("\n\n");
}

function requestHints(providerProfileId, job) {
  const ratio = aspectRatio(job.promptContract);
  const outputContract = {
    assetCount: job.promptContract.output.assetCount,
    aspectRatio: ratio,
    intendedSurface: job.promptContract.output.intendedSurface,
    deliveryRole: job.promptContract.output.deliveryRole,
    cropSafety: job.promptContract.output.cropSafety,
    generatedTextPolicy: job.promptContract.output.generatedTextPolicy,
  };
  if (providerProfileId === "openai-gpt-image") {
    const dimensions = providerDimensionsForAspect(providerProfileId, ratio);
    return {
      ...outputContract,
      apiSurface: "Responses image-generation tool or Images API",
      action: "generate-first-then-edit-with-accepted-reference",
      size: `${dimensions.width}x${dimensions.height}`,
      quality: "medium-for-controlled-study-high-for-approved-refinement",
      format: "webp",
      background: "opaque",
    };
  }
  if (providerProfileId === "gemini-native-image") {
    return {
      ...outputContract,
      apiSurface: "Gemini Interactions image generation",
      responseFormat: "image-only",
      imageSize: "2K",
      thinkingLevel: "high-when-current-model-supports-it",
      batchPolicy:
        "do-not-use-24h-batch-mode-inside-the-ten-image-adaptive-loop",
    };
  }
  if (providerProfileId === "flux-2") {
    const dimensions = providerDimensionsForAspect(providerProfileId, ratio);
    return {
      ...outputContract,
      apiSurface: "FLUX.2 image generation or multi-reference editing",
      width: dimensions.width,
      height: dimensions.height,
      promptUpsampling: false,
      negativePrompt: null,
      reason:
        "controlled comparisons require authored prompt stability, positive exclusion translation, dimensions divisible by 16, and the first-party recommended approximately two-megapixel working range",
    };
  }
  return {
    ...outputContract,
    apiSurface: "Codex imagegen tool",
    referencedImagePaths: "smallest-sufficient-approved-local-reference-set",
    numLastImagesToInclude:
      "use-only-when-a-required-reference-has-no-local-path",
    callsPerJob: 1,
  };
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

function referenceAssignment(job) {
  const assignmentPath = join(
    ROOT,
    "planning-with-files/arcanea-visual-reference-assignments",
    `${job.id.toLowerCase()}.json`,
  );
  if (!existsSync(assignmentPath)) return null;
  const assignment = JSON.parse(readFileSync(assignmentPath, "utf8"));
  const { receiptHash, ...assignmentBody } = assignment;
  if (
    assignment.schema !== "arcanea.visual_reference_assignment.v1" ||
    receiptHash !== sha(assignmentBody) ||
    assignment.campaignId !== campaign.meta.campaignId ||
    assignment.campaignVersion !== campaign.meta.version ||
    assignment.jobId !== job.id ||
    assignment.round !== job.round ||
    assignment.entityId !== job.entityId ||
    assignment.promptContractHash !== job.promptContract.contractHash ||
    assignment.humanAttestation !== true ||
    !Array.isArray(assignment.selected) ||
    assignment.selected.length < 1 ||
    assignment.selected.length > 5
  ) {
    throw new Error(`Reference assignment for ${job.id} is stale or invalid.`);
  }
  const setPath = ensureInside(
    assignment.identityReferenceSetPath,
    "planning-with-files/arcanea-visual-references",
    `${job.id} identity reference set`,
  );
  if (!existsSync(setPath)) {
    throw new Error(`Identity reference set for ${job.id} is missing.`);
  }
  const setReceipt = JSON.parse(readFileSync(setPath, "utf8"));
  const { receiptHash: setHash, ...setBody } = setReceipt;
  if (
    setReceipt.schema !== "arcanea.visual_identity_reference_set.v1" ||
    setHash !== sha(setBody) ||
    setHash !== assignment.identityReferenceSetHash ||
    setReceipt.entityId !== job.entityId ||
    setReceipt.qualification !== "identity-regression-qualified"
  ) {
    throw new Error(`Identity reference set for ${job.id} is invalid.`);
  }
  return {
    path: assignmentPath.slice(ROOT.length + 1).replaceAll("\\", "/"),
    receiptHash,
    setPath: assignment.identityReferenceSetPath,
    setHash,
    identityLockVersion: assignment.identityLockVersion,
    selected: assignment.selected,
  };
}

function referencePlan(profile, job) {
  const requiresAcceptedReference = job.promptContract.constraints.some(
    (constraint) => constraint.includes("reference hash"),
  );
  const requiresIdentityAtlas = job.entityId === "agents-ensemble";
  const assignment = referenceAssignment(job);
  const currentReferenceHashes = unique([
    ...job.promptContract.references.imageRefs
      .map((reference) =>
        typeof reference === "string" ? null : (reference.hash ?? null),
      )
      .filter(Boolean),
    ...(assignment?.selected.map((reference) => reference.imageSha256) ?? []),
  ]);
  if (currentReferenceHashes.length > profile.maximumPlannedReferences) {
    throw new Error(
      `${job.id} assigns ${currentReferenceHashes.length} references but ${profile.provider} allows only ${profile.maximumPlannedReferences} in this lane.`,
    );
  }
  const requiredMinimum = requiresIdentityAtlas
    ? 1
    : requiresAcceptedReference
      ? 1
      : 0;
  return {
    maximumPlannedReferences: profile.maximumPlannedReferences,
    currentReferenceHashes,
    qualifiedIdentityReferenceSet: assignment
      ? {
          assignmentPath: assignment.path,
          assignmentHash: assignment.receiptHash,
          setPath: assignment.setPath,
          setHash: assignment.setHash,
          identityLockVersion: assignment.identityLockVersion,
        }
      : null,
    acceptedReferences: assignment?.selected ?? [],
    requiredMinimum,
    requiredRoles: requiresIdentityAtlas
      ? ["accepted-identity-atlas", "tile-to-source-hash-manifest"]
      : requiresAcceptedReference
        ? ["accepted-identity-reference"]
        : [],
    missingRequiredReference: currentReferenceHashes.length < requiredMinimum,
    policy:
      "Every image reference must be owned or licensed and recorded by SHA-256 with one role: identity, composition, material, or lighting. A style reference never grants permission to imitate its creator.",
    stopCondition: requiresIdentityAtlas
      ? "stop unless a deterministic sixteen-tile identity atlas and its tile-to-source-hash manifest are both recorded"
      : requiresAcceptedReference
        ? "stop if the accepted reference receipt or hash is absent"
        : "proceed text-only unless an approved reference is intentionally assigned",
  };
}

function buildPacket(providerProfileId) {
  const profile = PROFILES[providerProfileId];
  const jobs = sourcePack.jobs.map((sourceJob) => {
    const job = allJobs.find((candidate) => candidate.id === sourceJob.id);
    if (!job) throw new Error(`Unknown campaign job ${sourceJob.id}.`);
    const plannedReferences = referencePlan(profile, job);
    const executionState =
      job.generationState === "blocked"
        ? "blocked"
        : plannedReferences.missingRequiredReference
          ? "gated-missing-reference"
          : "executable";
    const executionPrompt =
      executionState !== "executable"
        ? null
        : structuredVisualPrompt(job, providerProfileId);
    const partition = constraintPartition(job.promptContract);
    const avoidanceParts = avoidancePartition(visualSections(job).avoid);
    const executionPromptAudit = executionPrompt
      ? promptAudit(executionPrompt, partition, avoidanceParts)
      : null;
    if (executionPromptAudit?.operationalTermsPresent.length) {
      throw new Error(
        `${job.id} ${providerProfileId} image-facing prompt leaks governance terms: ${executionPromptAudit.operationalTermsPresent.join(", ")}.`,
      );
    }
    return {
      id: job.id,
      name: job.name,
      generationState: job.generationState,
      executionState,
      blockedReason: job.blockedReason,
      promptContractHash: job.promptContract.contractHash,
      sourcePromptPackHash: sourcePack.packetHash,
      executionPrompt,
      executionPromptHash: executionPrompt ? sha(executionPrompt) : null,
      promptAudit: executionPromptAudit,
      requestHints: requestHints(providerProfileId, job),
      referencePlan: plannedReferences,
      governance: {
        releaseEligibility: job.releaseEligibility,
        rightsState: job.rightsState,
        sensitivityReviewRequired: job.sensitivityReviewRequired,
        reviewRequirements: job.reviewRequirements,
        imageFacingConstraintsWithheld: partition.withheld,
        imageFacingAvoidanceWithheld: avoidanceParts.withheld,
      },
      receiptRequirements: [
        "provider, provider-exposed model, and declared model policy",
        "effective runtime parameters matching the execution grant",
        "immutable execution manifest path and hash",
        "exact execution prompt hash",
        "all reference hashes and roles",
        "provider generation receipt or request id",
        "machine preflight receipt path and hash",
        "narrow execution grant path and hash",
        "spend approval identity",
        "fully decoded ingest and stored-copy metadata, declared and measured aspect ratio within tolerance, byte count, and SHA-256, with exact post-copy byte and geometry equality",
      ],
    };
  });
  const manifestBody = {
    schema: "arcanea.provider_execution_manifest.v1",
    campaignId: campaign.meta.campaignId,
    campaignVersion: campaign.meta.version,
    round: roundNumber,
    sourceContractSetHash,
    profileId: providerProfileId,
    promptCompilerVersion: PROMPT_COMPILER_VERSION,
    profile,
    jobs: jobs.map((job) => ({
      id: job.id,
      name: job.name,
      generationState: job.generationState,
      executionState: job.executionState,
      blockedReason: job.blockedReason,
      promptContractHash: job.promptContractHash,
      executionPrompt: job.executionPrompt,
      executionPromptHash: job.executionPromptHash,
      promptAudit: job.promptAudit,
      requestHints: job.requestHints,
      referencePlan: job.referencePlan,
      governance: job.governance,
      receiptRequirements: job.receiptRequirements,
    })),
  };
  const manifest = {
    ...manifestBody,
    manifestHash: sha(manifestBody),
  };
  const manifestPath = `planning-with-files/arcanea-visual-campaign/execution-manifests/round-${roundId}-${providerProfileId}-${manifest.manifestHash.slice(0, 16)}.json`;
  const packet = {
    schema: "arcanea.provider_execution_packet.v1",
    campaignId: campaign.meta.campaignId,
    campaignVersion: campaign.meta.version,
    round: roundNumber,
    sourcePromptPackHash: sourcePack.packetHash,
    sourceContractSetHash,
    profileId: providerProfileId,
    promptCompilerVersion: PROMPT_COMPILER_VERSION,
    profile,
    status: "compiled-not-executed",
    generatedCount: sourcePack.generatedCount,
    executionManifest: {
      path: manifestPath,
      hash: manifest.manifestHash,
    },
    jobs,
  };
  packet.packetHash = sha(packet);
  return { packet, manifest, manifestPath };
}

const providerIds =
  requestedProvider === "all" ? Object.keys(PROFILES) : [requestedProvider];
for (const providerId of providerIds) {
  const { packet, manifest, manifestPath } = buildPacket(providerId);
  const relativePath = `planning-with-files/arcanea-visual-campaign/round-${roundId}-${providerId}-provider-pack.json`;
  const outputPath = join(ROOT, relativePath);
  writeOnce(
    join(ROOT, manifestPath),
    manifest,
    `${providerId} immutable execution manifest`,
  );
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(packet, null, 2)}\n`, "utf8");
  console.log(
    `Compiled ${providerId} Round ${roundId}: ${packet.jobs.filter((job) => job.executionPrompt).length} executable, ${packet.jobs.filter((job) => !job.executionPrompt).length} gated, manifest ${manifest.manifestHash.slice(0, 12)}.`,
  );
}

function buildManifestIndex() {
  const campaignRoot = join(
    ROOT,
    "planning-with-files/arcanea-visual-campaign",
  );
  const manifestRoot = join(campaignRoot, "execution-manifests");
  const current = readdirSync(campaignRoot)
    .filter((name) => /^round-\d{2}-.+-provider-pack\.json$/.test(name))
    .sort()
    .map((name) => {
      const path = join(campaignRoot, name);
      const packet = JSON.parse(readFileSync(path, "utf8"));
      const { packetHash, ...packetBody } = packet;
      if (
        packetHash !== sha(packetBody) ||
        packet.campaignId !== campaign.meta.campaignId ||
        packet.campaignVersion !== campaign.meta.version ||
        !PROFILES[packet.profileId]
      ) {
        throw new Error(`Current provider packet is stale or invalid: ${name}`);
      }
      return {
        round: packet.round,
        profileId: packet.profileId,
        manifestPath: packet.executionManifest.path,
        manifestHash: packet.executionManifest.hash,
        sourceContractSetHash: packet.sourceContractSetHash,
        providerPacketPath: `planning-with-files/arcanea-visual-campaign/${name}`,
        providerPacketHash: packet.packetHash,
      };
    });
  const currentKeys = new Set(
    current.map((entry) => `${entry.manifestPath}:${entry.manifestHash}`),
  );
  const resultRoot = join(ROOT, "planning-with-files/arcanea-visual-results");
  const outputReceipts = existsSync(resultRoot)
    ? readdirSync(resultRoot)
        .filter((name) => /^acv-\d{3}-r\d+\.json$/i.test(name))
        .sort()
        .map((name) => {
          const path = join(resultRoot, name);
          const receipt = JSON.parse(readFileSync(path, "utf8"));
          const { receiptHash, ...receiptBody } = receipt;
          if (receiptHash !== sha(receiptBody)) {
            throw new Error(`Output receipt hash is invalid: ${name}`);
          }
          return {
            path: `planning-with-files/arcanea-visual-results/${name}`,
            manifestHash: receipt.execution?.executionManifestHash ?? null,
          };
        })
    : [];
  const lineage = readdirSync(manifestRoot)
    .filter((name) => /^round-\d{2}-.+-[a-f0-9]{16}\.json$/.test(name))
    .sort()
    .map((name) => {
      const manifestPath = `planning-with-files/arcanea-visual-campaign/execution-manifests/${name}`;
      const manifest = JSON.parse(
        readFileSync(join(manifestRoot, name), "utf8"),
      );
      const { manifestHash, ...manifestBody } = manifest;
      if (
        manifest.schema !== "arcanea.provider_execution_manifest.v1" ||
        manifestHash !== sha(manifestBody) ||
        !name.endsWith(`${manifestHash.slice(0, 16)}.json`)
      ) {
        throw new Error(`Immutable execution manifest is invalid: ${name}`);
      }
      const boundOutputReceipts = outputReceipts
        .filter((receipt) => receipt.manifestHash === manifestHash)
        .map((receipt) => receipt.path);
      const isCurrent = currentKeys.has(`${manifestPath}:${manifestHash}`);
      return {
        path: manifestPath,
        manifestHash,
        campaignVersion: manifest.campaignVersion,
        round: manifest.round,
        profileId: manifest.profileId,
        promptCompilerVersion: manifest.promptCompilerVersion,
        sourceContractSetHash: manifest.sourceContractSetHash,
        status: isCurrent
          ? "current-active"
          : boundOutputReceipts.length
            ? "historical-bound"
            : "historical-unbound",
        boundOutputReceipts,
      };
    });
  if (
    !current.every((entry) =>
      lineage.some(
        (manifest) =>
          manifest.path === entry.manifestPath &&
          manifest.manifestHash === entry.manifestHash &&
          manifest.status === "current-active",
      ),
    )
  ) {
    throw new Error(
      "A current provider packet does not resolve to its manifest.",
    );
  }
  const indexBody = {
    schema: "arcanea.provider_execution_manifest_index.v1",
    campaignId: campaign.meta.campaignId,
    currentCampaignVersion: campaign.meta.version,
    promptCompilerVersion: PROMPT_COMPILER_VERSION,
    executionRule:
      "Only a manifest listed as current-active and named by a fresh narrow authority grant may be executed. Historical manifests remain immutable lineage, never implicit authority.",
    current,
    lineage,
  };
  const index = { ...indexBody, indexHash: sha(indexBody) };
  writeFileSync(
    join(manifestRoot, "index.json"),
    `${JSON.stringify(index, null, 2)}\n`,
    "utf8",
  );
  console.log(
    `Indexed ${lineage.length} immutable execution manifests: ${lineage.filter((entry) => entry.status === "current-active").length} current, ${lineage.filter((entry) => entry.status !== "current-active").length} historical.`,
  );
}

buildManifestIndex();
