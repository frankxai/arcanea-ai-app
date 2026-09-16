import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const failures = [];
const checks = [];

const readJson = (relativePath) =>
  JSON.parse(readFileSync(join(ROOT, relativePath), "utf8"));
const readText = (relativePath) =>
  readFileSync(join(ROOT, relativePath), "utf8");
const sha = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const check = (condition, message) => {
  if (!condition) failures.push(message);
  else checks.push(message);
};
const unique = (values) => new Set(values).size === values.length;
const visualSimilarityStopWords = new Set([
  "and",
  "between",
  "carries",
  "each",
  "every",
  "from",
  "into",
  "material",
  "only",
  "remains",
  "rather",
  "shows",
  "single",
  "than",
  "that",
  "the",
  "their",
  "this",
  "through",
  "until",
  "visible",
  "visibly",
  "with",
  "without",
]);
const meaningfulVisualTokens = (agent) =>
  new Set(
    [
      agent.instrument,
      agent.visualIdentity.silhouette,
      agent.visualIdentity.material,
      agent.visualIdentity.workingBehavior,
      agent.visualIdentity.spatialRhythm,
      agent.visualIdentity.motif,
    ]
      .join(" ")
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter(
        (token) => token.length > 2 && !visualSimilarityStopWords.has(token),
      ) ?? [],
  );
const visualJaccard = (left, right) => {
  const intersection = [...left].filter((token) => right.has(token)).length;
  const union = new Set([...left, ...right]).size;
  return union === 0 ? 1 : intersection / union;
};

const constellationPath = "apps/web/data/arcanea-constellation.v1.json";
const campaignPath = "apps/web/data/arcanea-visual-campaign.v1.json";
const guardianAtlasPath = "apps/web/data/arcanea-guardian-identities.v1.json";
const godbeastAtlasPath = "apps/web/data/arcanea-godbeast-identities.v1.json";
const characterAtlasPath = "apps/web/data/arcanea-character-identities.v1.json";
const worldAtlasPath = "apps/web/data/arcanea-world-identities.v1.json";
const roundOnePackPath =
  "planning-with-files/arcanea-visual-campaign/round-01-prompt-pack.json";
const providerProfileIds = [
  "openai-gpt-image",
  "gemini-native-image",
  "flux-2",
  "codex-imagegen",
];
const providerPackPaths = Object.fromEntries(
  providerProfileIds.map((profileId) => [
    profileId,
    `planning-with-files/arcanea-visual-campaign/round-01-${profileId}-provider-pack.json`,
  ]),
);
const roundOneReflectionPath =
  "planning-with-files/arcanea-visual-reflections/round-01.template.json";
const roundOneEvaluationPath =
  "planning-with-files/arcanea-visual-reflections/round-01.evaluation.template.json";
const workbenchPath = "planning-with-files/arcanea-visual-workbench/index.html";
const characterReadinessPath =
  "docs/design/ARCANEA_CHARACTER_IDENTITY_READINESS_V1.md";
const guardianReadinessPath =
  "docs/design/ARCANEA_GUARDIAN_IDENTITY_READINESS_V1.md";
const godbeastReadinessPath =
  "docs/design/ARCANEA_GODBEAST_IDENTITY_READINESS_V1.md";
const worldReadinessPath = "docs/design/ARCANEA_WORLD_IDENTITY_READINESS_V1.md";
const coverageMatrixPath = "docs/design/ARCANEA_VISUAL_COVERAGE_MATRIX_V1.md";
const executionManifestIndexPath =
  "planning-with-files/arcanea-visual-campaign/execution-manifests/index.json";
const holdPreflightPath =
  "planning-with-files/arcanea-visual-authority/round-01-preflight-corrected-storage-2026-08-25.json";
const storageEvidenceCorrectionPath =
  "planning-with-files/arcanea-visual-authority/STORAGE_EVIDENCE_CORRECTION_2026-08-25.md";
const publicPromptAtlasPath =
  "apps/web/public/downloads/arcanea-constellation/prompts/PROMPT_ATLAS.md";
const promptQualityAuditPath = "docs/design/ARCANEA_PROMPT_QUALITY_AUDIT_V1.md";
const publicPromptQualityAuditPath =
  "apps/web/public/downloads/arcanea-constellation/prompts/QUALITY_AUDIT.md";
const constellationBenchmarkPath =
  "docs/design/ARCANEA_CONSTELLATION_BENCHMARK_V1.md";
const visualOpenDecisionsPath =
  "docs/design/ARCANEA_VISUAL_OPEN_DECISIONS_V1.md";
const publicVisualOpenDecisionsPath =
  "apps/web/public/downloads/arcanea-constellation/prompts/OPEN_DECISIONS.md";
const visualContractSchemaFiles = [
  "arcanea.machine_preflight_receipt.v2.schema.json",
  "arcanea.visual_prompt_contract.v1.schema.json",
  "arcanea.visual_execution_grant.v1.schema.json",
  "arcanea.visual_output_receipt.v1.schema.json",
];
const visualDirectorSkillPath = "skills/arcanea-visual-director/SKILL.md";
const visualDirectorAgentPath = "docs/agents/arcanea-visual-director.md";
const visualDirectorRuntimeAgentPath =
  "skills/arcanea-visual-director/AGENT.md";
const autonomyContractPath =
  "skills/arcanea-visual-director/references/autonomy-contract.md";

check(existsSync(join(ROOT, constellationPath)), `${constellationPath} exists`);
check(existsSync(join(ROOT, campaignPath)), `${campaignPath} exists`);
check(existsSync(join(ROOT, guardianAtlasPath)), `${guardianAtlasPath} exists`);
check(existsSync(join(ROOT, godbeastAtlasPath)), `${godbeastAtlasPath} exists`);
check(existsSync(join(ROOT, worldAtlasPath)), `${worldAtlasPath} exists`);
check(
  existsSync(join(ROOT, characterAtlasPath)),
  `${characterAtlasPath} exists`,
);
check(existsSync(join(ROOT, roundOnePackPath)), `${roundOnePackPath} exists`);
for (const [profileId, providerPackPath] of Object.entries(providerPackPaths)) {
  check(
    existsSync(join(ROOT, providerPackPath)),
    `${profileId} provider packet exists`,
  );
}
check(
  existsSync(join(ROOT, roundOneReflectionPath)),
  `${roundOneReflectionPath} exists`,
);
check(
  existsSync(join(ROOT, roundOneEvaluationPath)),
  `${roundOneEvaluationPath} exists`,
);
check(existsSync(join(ROOT, workbenchPath)), `${workbenchPath} exists`);
check(
  existsSync(join(ROOT, characterReadinessPath)),
  `${characterReadinessPath} exists`,
);
check(
  existsSync(join(ROOT, guardianReadinessPath)),
  `${guardianReadinessPath} exists`,
);
check(
  existsSync(join(ROOT, godbeastReadinessPath)),
  `${godbeastReadinessPath} exists`,
);
check(
  existsSync(join(ROOT, coverageMatrixPath)),
  `${coverageMatrixPath} exists`,
);
check(
  existsSync(join(ROOT, worldReadinessPath)),
  `${worldReadinessPath} exists`,
);
check(
  existsSync(join(ROOT, visualDirectorSkillPath)),
  `${visualDirectorSkillPath} exists`,
);
check(
  existsSync(join(ROOT, visualDirectorAgentPath)),
  `${visualDirectorAgentPath} exists`,
);
check(
  existsSync(join(ROOT, visualDirectorRuntimeAgentPath)),
  `${visualDirectorRuntimeAgentPath} exists`,
);
check(
  existsSync(join(ROOT, autonomyContractPath)),
  `${autonomyContractPath} exists`,
);
check(
  existsSync(join(ROOT, executionManifestIndexPath)),
  `${executionManifestIndexPath} exists`,
);
check(existsSync(join(ROOT, holdPreflightPath)), `${holdPreflightPath} exists`);
check(
  existsSync(join(ROOT, storageEvidenceCorrectionPath)),
  `${storageEvidenceCorrectionPath} exists`,
);
check(
  existsSync(join(ROOT, publicPromptAtlasPath)),
  `${publicPromptAtlasPath} exists`,
);
check(
  existsSync(join(ROOT, promptQualityAuditPath)) &&
    existsSync(join(ROOT, publicPromptQualityAuditPath)),
  "source and public prompt quality audits exist",
);
check(
  existsSync(join(ROOT, constellationBenchmarkPath)),
  `${constellationBenchmarkPath} exists`,
);
check(
  existsSync(join(ROOT, visualOpenDecisionsPath)) &&
    existsSync(join(ROOT, publicVisualOpenDecisionsPath)),
  "source and public visual open-decision registers exist",
);
for (const schemaFile of visualContractSchemaFiles) {
  check(
    existsSync(join(ROOT, "schemas/arcanea-visual", schemaFile)),
    `schemas/arcanea-visual/${schemaFile} exists`,
  );
  check(
    existsSync(
      join(
        ROOT,
        "apps/web/public/downloads/arcanea-constellation/system",
        schemaFile,
      ),
    ),
    `public contract schema ${schemaFile} exists`,
  );
}
check(
  existsSync(
    join(
      ROOT,
      "apps/web/public/downloads/arcanea-constellation/system/CONTRACTS.md",
    ),
  ),
  "public visual contract guide exists",
);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

const constellation = readJson(constellationPath);
const campaign = readJson(campaignPath);
const guardianAtlas = readJson(guardianAtlasPath);
const godbeastAtlas = readJson(godbeastAtlasPath);
const characterAtlas = readJson(characterAtlasPath);
const worldAtlas = readJson(worldAtlasPath);
const roundOnePack = readJson(roundOnePackPath);
const providerPacks = Object.fromEntries(
  Object.entries(providerPackPaths).map(([profileId, providerPackPath]) => [
    profileId,
    readJson(providerPackPath),
  ]),
);
const roundOneReflection = readJson(roundOneReflectionPath);
const roundOneEvaluation = readJson(roundOneEvaluationPath);
const executionManifestIndex = readJson(executionManifestIndexPath);
const holdPreflight = readJson(holdPreflightPath);
const storageEvidenceCorrection = readText(storageEvidenceCorrectionPath);
const agents = constellation.agents;
const jobs = campaign.rounds.flatMap((round) => round.jobs);
const creatorPacketEvidence = campaign.meta.externalSourceEvidence?.find(
  (item) => item.id === "creator-supplied-tenfold-constitution-v1-0-level99",
);

check(
  creatorPacketEvidence?.authority === "proposal-evidence-not-repo-ssot" &&
    creatorPacketEvidence.sha256 ===
      "51ead4677134b87e35fd6ded6556dc67f9daa609313bcd9eccc74f6d94de998b" &&
    creatorPacketEvidence.bytes === 54406,
  "creator-supplied Tenfold proposal is content-addressed and authority-scoped",
);
const creatorPacketRefs = jobs
  .flatMap((job) => job.promptContract.references.sourceRefs)
  .filter((sourceRef) => sourceRef.includes("ARCANEA_TENFOLD_CONSTITUTION"));
check(
  creatorPacketRefs.length > 0 &&
    creatorPacketRefs.every((sourceRef) =>
      sourceRef.includes(`#sha256=${creatorPacketEvidence?.sha256}`),
    ),
  "every campaign use of the creator proposal binds its captured SHA-256",
);
check(
  jobs.every((job) =>
    job.promptContract.references.sourceRefs.every(
      (sourceRef) =>
        !sourceRef.includes("C:\\Users\\") && !sourceRef.includes("Downloads"),
    ),
  ),
  "public prompt lineage never leaks the creator's local filesystem path",
);
const localSourceEvidence = campaign.meta.localSourceEvidence ?? [];
const localSourceEvidenceByPath = new Map(
  localSourceEvidence.map((evidence) => [evidence.path, evidence]),
);
const localSourceRefs = jobs
  .flatMap((job) => job.promptContract.references.sourceRefs)
  .filter((sourceRef) => !sourceRef.startsWith("creator-supplied/"));
check(
  localSourceEvidence.length === 31 &&
    new Set(localSourceRefs).size === 55 &&
    localSourceEvidence.every((evidence) => {
      if (
        typeof evidence.path !== "string" ||
        !Number.isSafeInteger(evidence.bytes) ||
        evidence.bytes < 1 ||
        !/^[a-f0-9]{64}$/.test(evidence.sha256) ||
        !existsSync(join(ROOT, evidence.path))
      ) {
        return false;
      }
      const bytes = readFileSync(join(ROOT, evidence.path));
      return (
        bytes.byteLength === evidence.bytes &&
        createHash("sha256").update(bytes).digest("hex") === evidence.sha256
      );
    }),
  "campaign carries a complete 31-file ledger for 55 section-addressed local sources",
);
check(
  localSourceRefs.every((sourceRef) => {
    const match = sourceRef.match(/^(.*?)(?:#.*?)? \[sha256:([a-f0-9]{64})\]$/);
    if (!match) return false;
    const evidence = localSourceEvidenceByPath.get(match[1]);
    return evidence?.sha256 === match[2];
  }),
  "every local prompt source reference binds the matching ledger SHA-256",
);

check(
  constellation.meta.schema === "arcanea.living_constellation.v1",
  "constellation schema is v1",
);
check(
  constellation.meta.status === "public-safe-blueprint",
  "constellation truth state is public-safe blueprint",
);
check(agents.length === 16, "exactly 16 public product identities");
check(unique(agents.map((agent) => agent.id)), "agent ids are unique");
check(unique(agents.map((agent) => agent.name)), "agent names are unique");
check(constellation.domains.length === 4, "exactly four operating domains");
for (const domain of constellation.domains) {
  check(domain.agentIds.length === 4, `${domain.name} has four agents`);
  check(
    domain.agentIds.every((id) => agents.some((agent) => agent.id === id)),
    `${domain.name} references known agents`,
  );
}

check(
  constellation.visualDirector.operationalId === "arcanea-visual-director",
  "visual director has a stable operational id",
);
check(
  constellation.visualDirector.publicFaceAgentId === "prismatic",
  "Prismatic is the public face of the Visual Director",
);
check(
  agents
    .find((agent) => agent.id === "prismatic")
    ?.skillRefs.includes("$arcanea-visual-director"),
  "Prismatic routes to the executable visual-director skill",
);

for (const agent of agents) {
  check(
    agent.authority.humanHoldsFinalAuthority === true,
    `${agent.id} preserves human final authority`,
  );
  check(
    agent.authority.canLockCanon === false &&
      agent.authority.canApproveIdentity === false &&
      agent.authority.canPublish === false,
    `${agent.id} cannot self-approve canon, identity, or release`,
  );
  check(agent.stopConditions.length >= 3, `${agent.id} has stop conditions`);
  check(agent.humanGates.length >= 5, `${agent.id} has explicit human gates`);
  check(agent.sourceRefs.length > 0, `${agent.id} has source references`);
  check(
    agent.visualIdentity.silhouette.length > 100 &&
      agent.visualIdentity.material.length > 80 &&
      agent.visualIdentity.workingBehavior.length > 90 &&
      agent.visualIdentity.spatialRhythm.length > 45,
    `${agent.id} has a substantial instrumental visual identity`,
  );
  const base = `apps/web/public/downloads/arcanea-constellation/${agent.id}`;
  for (const file of ["AGENT.md", "SKILL.md", "agent-card.json"]) {
    check(existsSync(join(ROOT, base, file)), `${agent.id}/${file} exists`);
  }
  const publicAgent = readFileSync(join(ROOT, base, "AGENT.md"), "utf8");
  check(
    publicAgent.includes(
      "cannot lock canon, approve identity, spend, or publish",
    ),
    `${agent.id} public AGENT states its authority boundary`,
  );
  check(
    publicAgent.includes("## Visual identity proposal") &&
      publicAgent.includes(agent.visualIdentity.workingBehavior),
    `${agent.id} public AGENT teaches its visual behavior`,
  );
  check(
    publicAgent.includes("## Invocation contract") &&
      publicAgent.includes("## Verification questions") &&
      !publicAgent.includes("task needs governs") &&
      agent.inputs.every((input) => publicAgent.includes(input)) &&
      agent.outputs.every((output) => publicAgent.includes(output)),
    `${agent.id} public AGENT teaches invocation, evidence, output, and verification`,
  );
  const publicSkill = readFileSync(join(ROOT, base, "SKILL.md"), "utf8");
  check(
    publicSkill.includes("description: >-\n  Use when") &&
      publicSkill.includes("## Input contract") &&
      publicSkill.includes("## Operating loop") &&
      publicSkill.includes("## Output contract") &&
      publicSkill.includes("## Verification") &&
      agent.routes.every((route) => publicSkill.includes(route)),
    `${agent.id} public SKILL is an executable educational contract rather than a slogan`,
  );
  const card = readJson(`${base}/agent-card.json`);
  check(
    card.authority.humanHoldsFinalAuthority === true,
    `${agent.id} public card preserves human authority`,
  );
  check(
    card.visualIdentity.workingBehavior ===
      agent.visualIdentity.workingBehavior,
    `${agent.id} public card preserves its visual contract`,
  );
}
check(
  unique(agents.map((agent) => agent.visualIdentity.silhouette)) &&
    unique(agents.map((agent) => agent.visualIdentity.workingBehavior)),
  "all sixteen agents have distinct silhouettes and working behaviors",
);
check(
  [
    "instrument",
    "silhouette",
    "material",
    "light",
    "workingBehavior",
    "spatialRhythm",
    "motif",
  ].every((field) =>
    unique(
      agents.map((agent) =>
        field === "instrument" ? agent.instrument : agent.visualIdentity[field],
      ),
    ),
  ),
  "all sixteen agents have distinct instrument, silhouette, material, light, behavior, rhythm, and motif fields",
);
const visualTokenSets = new Map(
  agents.map((agent) => [agent.id, meaningfulVisualTokens(agent)]),
);
const visualPairScores = agents
  .flatMap((leftAgent, leftIndex) =>
    agents.slice(leftIndex + 1).map((rightAgent) => ({
      left: leftAgent.id,
      right: rightAgent.id,
      score: visualJaccard(
        visualTokenSets.get(leftAgent.id),
        visualTokenSets.get(rightAgent.id),
      ),
    })),
  )
  .sort((left, right) => right.score - left.score);
const closestVisualPair = visualPairScores[0];
check(
  closestVisualPair.score < 0.18,
  `all 120 agent pairings stay below the 0.18 meaningful-vocabulary collision ceiling; closest is ${closestVisualPair.left}/${closestVisualPair.right} at ${closestVisualPair.score.toFixed(3)}`,
);
const publicPackRoot = join(
  ROOT,
  "apps/web/public/downloads/arcanea-constellation",
);
const publicPackIndex = readFileSync(join(publicPackRoot, "README.md"), "utf8");
const publicPackEntries = readdirSync(publicPackRoot, { withFileTypes: true });
check(
  publicPackEntries.filter((entry) => entry.isDirectory()).length === 18 &&
    publicPackEntries.filter((entry) => entry.isFile()).length === 1 &&
    publicPackEntries.some(
      (entry) => entry.isDirectory() && entry.name === "system",
    ) &&
    publicPackEntries.some(
      (entry) => entry.isDirectory() && entry.name === "prompts",
    ),
  "public pack contains sixteen identity folders, one contract suite, one Prompt Atlas, and one index",
);
check(
  publicPackIndex.includes("## Choose the right artifact") &&
    publicPackIndex.includes("## Human use") &&
    publicPackIndex.includes("## Agent use") &&
    publicPackIndex.includes("## Visual proof boundary") &&
    publicPackIndex.includes("eight distinct approved regression views") &&
    publicPackIndex.includes("prompts/PROMPT_ATLAS.md"),
  "public pack index teaches humans and agents how to invoke, verify, and respect visual proof",
);
const publicPromptAtlas = readText(publicPromptAtlasPath);
const promptQualityAudit = readText(promptQualityAuditPath);
const publicPromptQualityAudit = readText(publicPromptQualityAuditPath);
const constellationBenchmark = readText(constellationBenchmarkPath);
const visualOpenDecisions = readText(visualOpenDecisionsPath);
const publicVisualOpenDecisions = readText(publicVisualOpenDecisionsPath);
const publicPromptRoot = join(
  ROOT,
  "apps/web/public/downloads/arcanea-constellation/prompts",
);
check(
  readdirSync(publicPromptRoot).filter((name) =>
    /^acv-\d{3}\.json$/i.test(name),
  ).length === jobs.length &&
    jobs.every(
      (job) =>
        existsSync(join(publicPromptRoot, `${job.id.toLowerCase()}.json`)) &&
        publicPromptAtlas.includes(`./${job.id.toLowerCase()}.json`) &&
        publicPromptAtlas.includes(
          `/constellation/prompts/${job.id.toLowerCase()}`,
        ),
    ),
  "Prompt Atlas indexes one downloadable contract and teaching route for all 100 jobs",
);
check(
  promptQualityAudit === publicPromptQualityAudit &&
    promptQualityAudit.includes("Contracts audited: **100**") &&
    promptQualityAudit.includes(
      "Concrete consequential story beats: **100 / 100**",
    ) &&
    promptQualityAudit.includes("Structurally executable jobs: **91**") &&
    promptQualityAudit.includes("Truthfully gated jobs: **9**") &&
    campaign.rounds.every((round) =>
      promptQualityAudit.includes(
        `| ${String(round.round).padStart(2, "0")} |`,
      ),
    ),
  "prompt quality audit is public-copy identical and covers every round without output inflation",
);
check(
  visualOpenDecisions === publicVisualOpenDecisions &&
    visualOpenDecisions.includes("Structurally executable now: **91**") &&
    visualOpenDecisions.includes("Blocked jobs: **9**") &&
    visualOpenDecisions.includes("Decision or maturity gates: **6**") &&
    ["AVD-001", "AVD-002", "AVD-003", "AVD-004", "AVD-005", "AVD-006"].every(
      (decisionId) => visualOpenDecisions.includes(`## ${decisionId}`),
    ) &&
    jobs
      .filter((job) => job.generationState === "blocked")
      .every(
        (job) =>
          visualOpenDecisions.includes(`**${job.id}:**`) &&
          visualOpenDecisions.includes(
            `/constellation/prompts/${job.id.toLowerCase()}`,
          ),
      ) &&
    publicPromptAtlas.includes("[OPEN_DECISIONS.md](./OPEN_DECISIONS.md)"),
  "open-decision register is public-copy identical and covers each blocked job exactly once through six gates",
);
for (const agent of agents) {
  check(
    publicPackIndex.includes(`| ${agent.name}`) &&
      publicPackIndex.includes(`./${agent.id}/AGENT.md`),
    `${agent.id} is indexed in the public pack`,
  );
}

check(
  campaign.meta.schema === "arcanea.visual_campaign.v1",
  "campaign schema is v1",
);
check(campaign.meta.totalJobs === 100, "campaign declares 100 jobs");
check(campaign.rounds.length === 10, "campaign has ten rounds");
check(
  campaign.rounds.every((round) => round.jobs.length === 10),
  "every round contains ten jobs",
);
check(jobs.length === 100, "flattened campaign contains exactly 100 jobs");
check(unique(jobs.map((job) => job.id)), "job ids are unique");
check(
  unique(jobs.map((job) => `${job.round}:${job.slot}`)),
  "round slots are unique",
);
check(
  jobs.every(
    (job, index) => job.id === `ACV-${String(index + 1).padStart(3, "0")}`,
  ),
  "job ids are contiguous and ordered",
);

const guardians = guardianAtlas.guardians;
const guardianJobs = jobs.filter((job) => job.subjectKind === "guardian");
const guardianDyadJobs = jobs.filter(
  (job) =>
    job.subjectKind === "dyad" &&
    job.entityId.startsWith("dyad-") &&
    job.round === 4,
);
check(
  guardianAtlas.meta.schema === "arcanea.guardian_identity_atlas.v1",
  "Guardian identity atlas schema is v1",
);
check(guardians.length === 10, "Guardian atlas contains ten identities");
check(
  unique(guardians.map((guardian) => guardian.id)),
  "Guardian ids are unique",
);
check(guardianJobs.length === 10, "campaign contains ten Guardian studies");
check(
  guardianDyadJobs.length === 10,
  "campaign contains ten Guardian–Godbeast dyad studies",
);
check(
  guardians.every((guardian) => {
    const identityJob = guardianJobs.find(
      (job) => job.id === guardian.campaign.identityJobId,
    );
    const dyadJob = guardianDyadJobs.find(
      (job) => job.id === guardian.campaign.dyadJobId,
    );
    return (
      guardian.readiness === "discovery-only" &&
      guardian.openIdentityVariables.length >= 5 &&
      guardian.reviewRequirements.length >= 3 &&
      guardian.storyBeat.length > 120 &&
      guardian.discoveryFocus.length > 100 &&
      identityJob?.entityId === guardian.id &&
      identityJob.releaseEligibility === "internal-only-until-identity-lock" &&
      identityJob.deliverable.includes("discovery") &&
      !identityJob.deliverable.includes("master") &&
      dyadJob?.releaseEligibility === "internal-only-until-identity-lock" &&
      dyadJob.deliverable.includes("discovery") &&
      !dyadJob.deliverable.includes("master")
    );
  }),
  "every Guardian and dyad is a substantial internal discovery study, never an accidental identity master",
);
check(
  guardianJobs.every(
    (job) =>
      job.promptContract.storyBeat.length > 120 &&
      job.promptContract.constraints.some((constraint) =>
        constraint.includes("not a canonical portrait or identity master"),
      ) &&
      job.promptContract.subject.evidenceState.includes(
        "physical-identity-open",
      ),
  ),
  "Guardian prompt contracts preserve story evidence and the open physical-identity boundary",
);

const godbeasts = godbeastAtlas.godbeasts;
const godbeastJobs = jobs.filter(
  (job) => job.subjectKind === "godbeast" && job.round === 3,
);
check(
  godbeastAtlas.meta.schema === "arcanea.godbeast_identity_atlas.v1",
  "Godbeast identity atlas schema is v1",
);
check(godbeasts.length === 10, "Godbeast atlas contains ten identities");
check(
  unique(godbeasts.map((godbeast) => godbeast.id)),
  "Godbeast ids are unique",
);
check(godbeastJobs.length === 10, "campaign contains ten Godbeast studies");
for (const [state, count] of Object.entries({
  "discovery-only": 8,
  blocked: 2,
})) {
  check(
    godbeasts.filter((godbeast) => godbeast.readiness === state).length ===
      count,
    `Godbeast readiness ${state} has ${count} records`,
  );
}
check(
  godbeasts.every((godbeast) => {
    const morphologyJob = godbeastJobs.find(
      (job) => job.id === godbeast.campaign.morphologyJobId,
    );
    const dyadJob = guardianDyadJobs.find(
      (job) => job.id === godbeast.campaign.dyadJobId,
    );
    return (
      godbeast.morphologyCandidate.length > 120 &&
      godbeast.functionalTruth.length > 120 &&
      godbeast.storyBeat.length > 150 &&
      godbeast.openIdentityVariables.length >= 5 &&
      godbeast.reviewRequirements.length >= 3 &&
      godbeast.sourceRefs.some((source) =>
        source.startsWith(".arcanea/lore/godbeasts/"),
      ) &&
      morphologyJob?.entityId === godbeast.id &&
      morphologyJob.releaseEligibility ===
        "internal-only-until-identity-lock" &&
      morphologyJob.deliverable ===
        "Godbeast morphology proposal discovery plate" &&
      dyadJob?.releaseEligibility === "internal-only-until-identity-lock"
    );
  }),
  "every Godbeast separates substantial grounded function, proposed morphology, open variables, reviews, and internal campaign lineage",
);
check(
  godbeastJobs.every(
    (job) =>
      job.promptContract.storyBeat.length > 150 &&
      job.promptContract.subject.evidenceState.includes("local") &&
      !job.promptContract.subject.evidenceState.includes("source-defined") &&
      job.promptContract.subject.allowedVariation.includes(
        "held candidate is not canon",
      ) &&
      job.promptContract.constraints.some((constraint) =>
        constraint.includes("controlled proposal under evaluation"),
      ) &&
      job.promptContract.subject.openIdentityVariables.length >= 5,
  ),
  "Godbeast prompts use specific story actions and controlled proposal language instead of generic posing or false canon certainty",
);
check(
  godbeasts
    .filter((godbeast) => godbeast.readiness === "blocked")
    .every(
      (godbeast) =>
        ["sol", "source-convergence"].includes(godbeast.id) &&
        godbeast.campaign.generationState === "blocked" &&
        typeof godbeast.blockedReason === "string" &&
        godbeast.blockedReason.length > 80,
    ),
  "Sol and Source remain blocked by explicit morphology or ontology contradictions",
);
check(
  godbeasts
    .filter((godbeast) => godbeast.readiness === "discovery-only")
    .every(
      (godbeast) =>
        godbeast.campaign.generationState === "planned" &&
        godbeast.campaign.releaseEligibility ===
          "internal-only-until-identity-lock",
    ),
  "eight non-conflicted Godbeasts are internal discovery candidates, not approved identities",
);
check(
  guardianDyadJobs.every(
    (job) =>
      job.openIdentityVariables.filter((item) => item.startsWith("Guardian:"))
        .length >= 5 &&
      job.openIdentityVariables.filter((item) => item.startsWith("Godbeast:"))
        .length >= 5 &&
      job.reviewRequirements.length >= 6 &&
      job.promptContract.constraints.some((constraint) =>
        constraint.includes("both physical identities remain provisional"),
      ),
  ),
  "every Guardian–Godbeast dyad carries both open identity sets and both review gates",
);

const characters = characterAtlas.characters;
const characterJobs = jobs.filter(
  (job) => job.subjectKind === "book-character",
);
const characterIdentityJobs = characterJobs.filter((job) =>
  [7, 8].includes(job.round),
);
check(
  characterAtlas.meta.schema === "arcanea.character_identity_atlas.v1",
  "character identity atlas schema is v1",
);
check(characters.length === 20, "character atlas contains twenty identities");
check(
  unique(characters.map((character) => character.id)),
  "character ids are unique",
);
check(
  characterJobs.length === 25 && characterIdentityJobs.length === 20,
  "campaign contains twenty dedicated character studies plus five controlled Kael style benchmarks",
);
check(
  characters.every((character) =>
    characterIdentityJobs.some(
      (job) =>
        job.id === character.campaign.jobId &&
        job.entityId === character.id &&
        job.round === character.campaign.round,
    ),
  ),
  "every character identity maps to its exact campaign job",
);
for (const [state, count] of Object.entries({
  "source-complete": 5,
  "source-complete-review-required": 1,
  "discovery-only": 12,
  blocked: 2,
})) {
  check(
    characters.filter((character) => character.readiness === state).length ===
      count,
    `character readiness ${state} has ${count} records`,
  );
}
check(
  characters.every(
    (character) =>
      character.description.length > 250 && character.storyBeat.length > 120,
  ),
  "every character has substantial identity evidence and a story-bearing frame",
);
check(
  characters.every(
    (character) =>
      !/(?:distinct .* ensemble|from the series bible|whose visual identity must)/i.test(
        character.description,
      ),
  ),
  "character contracts contain no vague bible-placeholder language",
);
check(
  characters
    .filter((character) => character.readiness === "discovery-only")
    .every(
      (character) =>
        character.openIdentityVariables.length >= 3 &&
        character.campaign.releaseEligibility ===
          "internal-only-until-identity-lock",
    ),
  "every discovery-only character names open variables and remains internal",
);
check(
  characters
    .filter((character) => character.readiness.startsWith("source-complete"))
    .every(
      (character) =>
        character.openIdentityVariables.length === 0 &&
        character.campaign.releaseEligibility === "candidate-after-human-gates",
    ),
  "source-complete characters have no silent physical variables",
);
check(
  characters
    .filter((character) => character.sensitivityReviewRequired)
    .every((character) => character.reviewRequirements.length > 0),
  "every sensitivity-gated character names its human review requirement",
);
check(
  characters
    .filter((character) => character.readiness === "blocked")
    .every(
      (character) =>
        character.campaign.generationState === "blocked" &&
        typeof character.blockedReason === "string" &&
        character.blockedReason.length > 40,
    ),
  "blocked characters cannot generate and explain the gate",
);

const worlds = worldAtlas.worlds;
const worldJobs = jobs.filter(
  (job) => job.subjectKind === "world" && job.round === 9,
);
check(
  worldAtlas.meta.schema === "arcanea.world_identity_atlas.v1",
  "world identity atlas schema is v1",
);
check(worlds.length === 10, "world atlas contains ten identities");
check(unique(worlds.map((world) => world.id)), "world ids are unique");
check(worldJobs.length === 10, "campaign contains ten world-system studies");
for (const [state, count] of Object.entries({
  "source-complete": 5,
  "source-complete-review-required": 1,
  "discovery-only": 2,
  blocked: 2,
})) {
  check(
    worlds.filter((world) => world.readiness === state).length === count,
    `world readiness ${state} has ${count} records`,
  );
}
check(
  worlds.every((world) => {
    const job = worldJobs.find(
      (candidate) => candidate.id === world.campaign.jobId,
    );
    return (
      world.systemThesis.length > 280 &&
      world.storyBeat.length > 170 &&
      world.sourceRefs.length > 0 &&
      job?.entityId === world.id &&
      job.round === world.campaign.round &&
      job.promptContract.storyBeat === world.storyBeat &&
      job.promptContract.constraints.some((constraint) =>
        constraint.includes("foreground labor or maintained evidence"),
      ) &&
      job.promptContract.avoid.includes("empty skyline postcard")
    );
  }),
  "every world has a substantial source-bound system thesis, environmental action, and anti-postcard prompt contract",
);
check(
  worlds
    .filter((world) => world.readiness === "source-complete")
    .every(
      (world) =>
        world.openIdentityVariables.length === 0 &&
        world.campaign.generationState === "planned" &&
        world.campaign.releaseEligibility === "candidate-after-human-gates",
    ),
  "five source-complete bounded world plates contain no silent variables and still require human release gates",
);
check(
  worlds
    .filter((world) => world.readiness === "source-complete-review-required")
    .every(
      (world) =>
        world.openIdentityVariables.length === 0 &&
        world.sensitivityReviewRequired === true &&
        world.reviewRequirements.length >= 2 &&
        world.campaign.releaseEligibility === "candidate-after-human-gates",
    ),
  "Avilara is source-complete for one plate but requires named Venezuelan review evidence before approval",
);
check(
  worlds
    .filter((world) => world.readiness === "discovery-only")
    .every(
      (world) =>
        world.openIdentityVariables.length >= 5 &&
        world.reviewRequirements.length >= 2 &&
        world.campaign.generationState === "planned" &&
        world.campaign.releaseEligibility ===
          "internal-only-until-identity-lock",
    ),
  "Forge Realm and Ultraworld remain internal discovery studies with explicit open system variables",
);
check(
  worlds
    .filter((world) => world.readiness === "blocked")
    .every(
      (world) =>
        world.openIdentityVariables.length >= 5 &&
        world.reviewRequirements.length >= 2 &&
        world.campaign.generationState === "blocked" &&
        world.campaign.releaseEligibility ===
          "internal-only-until-identity-lock" &&
        typeof world.blockedReason === "string" &&
        world.blockedReason.length > 150,
    ),
  "blocked world records preserve the exact cultural or canon-resource prerequisite",
);
const vanLinhWorld = worlds.find((world) => world.id === "van-linh");
check(
  vanLinhWorld?.readiness === "blocked" &&
    vanLinhWorld.sensitivityReviewRequired === true &&
    vanLinhWorld.blockedReason.includes("two paid Vietnamese women"),
  "Van Linh generation remains closed behind its non-negotiable qualified reader protocol",
);
const aurevaldeWorld = worlds.find((world) => world.id === "aurevalde");
check(
  aurevaldeWorld?.readiness === "blocked" &&
    aurevaldeWorld.blockedReason.includes("pure-absence canon") &&
    aurevaldeWorld.reviewRequirements.some((requirement) =>
      requirement.includes("Creator explicitly authorizes"),
    ),
  "Aurevalde direct depiction is blocked until the creator chooses to spend its pure-absence canon resource",
);

check(campaign.styles.length === 5, "Round 01 compares five style families");
check(unique(campaign.styles.map((style) => style.id)), "style ids are unique");
const roundOne = campaign.rounds[0].jobs;
for (const style of campaign.styles) {
  check(
    roundOne.filter((job) => job.styleState === style.id).length === 2,
    `${style.name} uses both controlled anchors`,
  );
}
check(
  new Set(roundOne.map((job) => job.entityId)).size === 2,
  "Round 01 varies style across exactly two anchors",
);
check(
  JSON.stringify(
    campaign.adaptiveProtocol.benchmarkAnchors.map((anchor) => anchor.entityId),
  ) === JSON.stringify(["kael-thornfield", "draconis"]) &&
    campaign.adaptiveProtocol.benchmarkLimitation.includes(
      "without accepted image-reference hashes",
    ) &&
    campaign.adaptiveProtocol.benchmarkLimitation.includes(
      "cannot lock either identity",
    ),
  "Round 01 records its exact human/non-human anchors and text-conditioned likeness limitation",
);
check(
  roundOne.filter((job) => job.entityId === "draconis").length === 5,
  "Draconis is repeated across all five styles",
);
check(
  roundOne
    .filter((job) => job.entityId === "draconis")
    .every(
      (job) =>
        job.subjectKind === "godbeast" &&
        job.releaseEligibility === "internal-only-until-identity-lock" &&
        job.deliverable.includes("discovery") &&
        !job.deliverable.includes("master") &&
        job.promptContract.subject.allowedVariation.includes(
          "held candidate is not canon",
        ) &&
        job.promptContract.constraints.some((constraint) =>
          constraint.includes("exactly six limbs"),
        ),
    ),
  "Round 01 holds one countable Draconis morphology candidate without promoting it to canon",
);
check(
  roundOne.filter((job) => job.entityId === "kael-thornfield").length === 5,
  "Kael Thornfield is repeated across all five styles",
);
check(
  roundOne
    .filter((job) => job.entityId === "kael-thornfield")
    .every(
      (job) =>
        job.subjectKind === "book-character" &&
        job.evidenceState === "source-complete" &&
        job.openIdentityVariables.length === 0 &&
        job.releaseEligibility === "candidate-after-human-gates" &&
        job.promptContract.constraints.some((constraint) =>
          constraint.includes("small white scar"),
        ),
    ),
  "Round 01 holds Kael's source-complete human identity and exact evidence object across all five styles",
);
check(
  new Set(roundOne.map((job) => job.subjectKind)).size === 2 &&
    roundOne.some((job) => job.subjectKind === "book-character") &&
    roundOne.some((job) => job.subjectKind === "godbeast"),
  "Round 01 compares every style on one human and one countable non-human anchor",
);
const allBenchmarkStyleAvoid = new Set(
  campaign.styles.flatMap((style) => style.avoid),
);
const benchmarkInvariant = (job) => {
  const { contractHash: _contractHash, ...contract } = job.promptContract;
  const {
    styleMode: _styleMode,
    direction: _direction,
    ...designSystem
  } = contract.designSystem;
  const stableAvoid = contract.avoid.filter(
    (item) => !allBenchmarkStyleAvoid.has(item),
  );
  return {
    round: job.round,
    entityId: job.entityId,
    subjectKind: job.subjectKind,
    deliverable: job.deliverable,
    sourceRefs: job.sourceRefs,
    canonState: job.canonState,
    identityState: job.identityState,
    evidenceState: job.evidenceState,
    openIdentityVariables: job.openIdentityVariables,
    reviewRequirements: job.reviewRequirements,
    sensitivityReviewRequired: job.sensitivityReviewRequired,
    releaseEligibility: job.releaseEligibility,
    rightsState: job.rightsState,
    releaseState: job.releaseState,
    generationState: job.generationState,
    blockedReason: job.blockedReason,
    promptContract: {
      ...contract,
      designSystem,
      avoid: stableAvoid,
    },
  };
};
for (const entityId of ["kael-thornfield", "draconis"]) {
  const anchorJobs = roundOne.filter((job) => job.entityId === entityId);
  check(
    new Set(anchorJobs.map((job) => sha(benchmarkInvariant(job)))).size === 1,
    `${entityId} preserves one exact non-style contract across all five benchmark modes`,
  );
}
for (const job of roundOne) {
  const style = campaign.styles.find(
    (candidate) => candidate.id === job.styleState,
  );
  check(
    style !== undefined &&
      job.promptContract.designSystem.styleMode === style.id &&
      job.promptContract.designSystem.direction === style.direction &&
      style.avoid.every((item) => job.promptContract.avoid.includes(item)),
    `${job.id} varies only through its declared style direction and exclusions`,
  );
}
const agentVisualJobs = jobs.filter((job) => job.subjectKind === "agent");
check(
  agentVisualJobs.length === 16,
  "campaign contains one dedicated study for each of the sixteen agents",
);
for (const agent of agents) {
  const studies = agentVisualJobs.filter((job) => job.entityId === agent.id);
  check(studies.length > 0, `${agent.id} has a contracted visual study`);
  check(
    studies.every(
      (job) =>
        job.promptContract.storyBeat === agent.visualIdentity.workingBehavior &&
        job.promptContract.subject.identityLock.includes(
          agent.visualIdentity.silhouette,
        ) &&
        job.promptContract.subject.identityLock.includes(
          agent.visualIdentity.material,
        ) &&
        job.promptContract.subject.allowedVariation.includes(
          "instrument silhouette",
        ) &&
        !job.promptContract.constraints.includes(
          "face hands limbs and countable anatomy remain coherent",
        ),
    ),
    `${agent.id} prompts preserve its bespoke instrument, material, and behavior`,
  );
}

const prismaticRegressionJobs = jobs.filter(
  (job) => job.round === 10 && job.entityId.startsWith("prismatic-"),
);
check(
  prismaticRegressionJobs.length === 3 &&
    prismaticRegressionJobs.every(
      (job) =>
        job.promptContract.subject.identityLock.includes(
          agents.find((agent) => agent.id === "prismatic").visualIdentity
            .silhouette,
        ) &&
        job.promptContract.subject.identityLock.includes(
          agents.find((agent) => agent.id === "prismatic").visualIdentity
            .material,
        ) &&
        job.promptContract.constraints.some((constraint) =>
          constraint.includes("never introduce a humanoid face or body"),
        ),
    ),
  "Prismatic regressions preserve the full instrument identity and ban humanoid drift",
);
const draconiaRegression = jobs.find((job) => job.id === "ACV-094");
check(
  draconiaRegression?.releaseEligibility ===
    "internal-only-until-identity-lock" &&
    draconiaRegression.deliverable.includes("discovery") &&
    !draconiaRegression.deliverable.includes("master") &&
    draconiaRegression.promptContract.constraints.some((constraint) =>
      constraint.includes("grants no identity approval"),
    ),
  "Draconia regression tests a provisional study without implying identity approval",
);
const guardianEnsemble = jobs.find((job) => job.id === "ACV-099");
check(
  guardianEnsemble?.generationState === "blocked" &&
    guardianEnsemble.releaseEligibility ===
      "internal-only-until-identity-lock" &&
    guardianEnsemble.openIdentityVariables.length >= 5 &&
    guardianEnsemble.blockedReason?.includes(
      "ten versioned identity contracts and accepted reference hashes",
    ),
  "Guardian ensemble regression is blocked until all ten identities are locked",
);
const agentEnsemble = jobs.find((job) => job.id === "ACV-100");
check(
  agentEnsemble?.generationState === "planned" &&
    agents.every((agent) =>
      agentEnsemble.promptContract.subject.identityLock.includes(
        agent.visualIdentity.silhouette,
      ),
    ) &&
    agentEnsemble.promptContract.constraints.some((constraint) =>
      constraint.includes(
        "accepted reference hash for each earlier agent study",
      ),
    ) &&
    agentEnsemble.promptContract.constraints.some((constraint) =>
      constraint.includes("deterministic non-generative reference atlas"),
    ),
  "sixteen-agent ensemble carries every bespoke silhouette and requires every accepted reference",
);

const outputJobs = jobs.filter((job) => job.output !== null);
const approvedJobs = jobs.filter((job) =>
  ["approved", "published"].includes(job.releaseState),
);
const publishedJobs = jobs.filter((job) => job.releaseState === "published");
check(
  campaign.meta.generatedCount === outputJobs.length &&
    campaign.meta.approvedCount === approvedJobs.length &&
    campaign.meta.publishedCount === publishedJobs.length,
  "campaign counts match recorded output and release states",
);
const executableJobs = jobs.filter((job) => job.generationState !== "blocked");
const expectedCampaignStatus =
  publishedJobs.length === executableJobs.length && executableJobs.length > 0
    ? "published"
    : publishedJobs.length > 0
      ? "publication-in-progress"
      : approvedJobs.length > 0
        ? "approval-in-progress"
        : outputJobs.length > 0
          ? "generation-in-review"
          : "planned-machine-gated";
check(
  campaign.meta.status === expectedCampaignStatus,
  "campaign status is derived from receipt-backed progress",
);
check(
  jobs.every((job) =>
    job.output === null
      ? job.releaseState === "not-generated" &&
        job.receipts.length === 0 &&
        job.decisionReceipts.length === 0
      : job.generationState === "review" &&
        typeof job.output.receiptPath === "string" &&
        job.receipts.includes(job.output.receiptPath),
  ),
  "every job output state is backed by a receipt",
);
check(
  jobs.every(
    (job) =>
      Array.isArray(job.decisionReceipts) &&
      (job.releaseState === "approved"
        ? job.decisionReceipts.some((path) => path.endsWith("-approved.json"))
        : job.releaseState === "published"
          ? job.decisionReceipts.some((path) =>
              path.endsWith("-published.json"),
            ) &&
            job.decisionReceipts.some((path) => path.endsWith("-approved.json"))
          : job.releaseState === "rejected"
            ? job.decisionReceipts.some((path) =>
                path.endsWith("-rejected.json"),
              )
            : job.decisionReceipts.length === 0),
  ),
  "every approval, rejection, and publication claim has a hash-linked decision receipt",
);
check(
  jobs.every((job) =>
    job.output === null
      ? true
      : ["approved", "published"].includes(job.releaseState)
        ? job.output.publicUrl?.startsWith("/images/arcanea-campaign/")
        : job.output.publicUrl === null &&
          job.output.storagePath.startsWith(
            "planning-with-files/arcanea-visual-assets/",
          ),
  ),
  "unapproved outputs remain internal and only approved assets receive public URLs",
);
check(
  jobs.every(
    (job) => typeof job.rightsState === "string" && job.rightsState.length > 5,
  ),
  "every job carries an explicit rights state",
);
check(
  jobs.every((job) => job.sourceRefs.length > 0),
  "every job has source references",
);
check(
  jobs.every(
    (job) =>
      typeof job.evidenceState === "string" &&
      Array.isArray(job.openIdentityVariables) &&
      Array.isArray(job.reviewRequirements) &&
      typeof job.sensitivityReviewRequired === "boolean" &&
      [
        "candidate-after-human-gates",
        "internal-only-until-identity-lock",
      ].includes(job.releaseEligibility),
  ),
  "every job declares evidence, open variables, review needs, and release eligibility",
);
check(
  jobs.every((job) => job.promptContract.provider.model === null),
  "no provider model is frozen into the engine-neutral contract",
);
check(
  jobs.every(
    (job) => job.promptContract.provider.adapter === "runtime-discovered",
  ),
  "every provider adapter is runtime-discovered",
);
check(
  jobs.every(
    (job) => job.promptContract.verification.humanApprovalRequired === true,
  ),
  "every prompt requires human approval",
);

for (const job of jobs) {
  const { contractHash, ...contract } = job.promptContract;
  check(
    contractHash === sha(contract),
    `${job.id} prompt contract hash is valid`,
  );
  check(contract.constraints.length >= 4, `${job.id} has explicit constraints`);
  check(contract.avoid.length >= 8, `${job.id} has an avoid contract`);
  check(
    contract.intent.length >= 60,
    `${job.id} has a substantial bounded intent`,
  );
  check(
    contract.subject.identityLock.length >= 80,
    `${job.id} has a substantial identity evidence lock`,
  );
  check(
    contract.storyBeat.length >= 100 &&
      contract.storyBeat !==
        "A quiet working moment one beat before consequence; the subject is doing something specific rather than posing.",
    `${job.id} has a concrete consequential story beat rather than the generic fallback`,
  );
  check(
    /[0-9]+:[0-9]+/.test(contract.composition) &&
      contract.composition.length >= 50,
    `${job.id} has an explicit aspect ratio and compositional hierarchy`,
  );
  const compositionAspectRatio = contract.composition.match(
    /\b(21:9|16:9|9:16|4:5|3:2|2:3|4:3|3:4|1:1)\b/,
  )?.[1];
  check(
    contract.output.assetCount === 1 &&
      contract.output.aspectRatio === compositionAspectRatio &&
      contract.output.intendedSurface.length >= 20 &&
      contract.output.deliveryRole === job.deliverable &&
      contract.output.cropSafety.length >= 80 &&
      contract.output.generatedTextPolicy === "no-generated-text",
    `${job.id} has a one-asset machine-readable output, surface, crop, and text contract aligned with composition and delivery`,
  );
  check(
    contract.verification.deterministicChecks.includes(
      "declared aspect ratio within 1.5% provider-rounding tolerance",
    ),
    `${job.id} requires deterministic output-aspect verification`,
  );
  check(
    contract.references.sourceRefs.length >= 1 &&
      contract.references.sourceRefs.every(
        (source) =>
          !/^[a-z]:[\\/]/i.test(source) &&
          !source.startsWith("/") &&
          !source.includes("private_vault"),
      ),
    `${job.id} has portable public-safe source references`,
  );
  const positivePromptFields = [
    contract.intent,
    contract.subject.identityLock,
    contract.storyBeat,
    contract.composition,
    contract.designSystem.direction,
    contract.light,
  ].join("\n");
  check(
    !/\b(?:in the style of|imitate|copy the style|looks? exactly like)\b/i.test(
      positivePromptFields,
    ),
    `${job.id} positive prompt fields contain no imitation request`,
  );
  check(
    contract.subject.stableId === job.entityId,
    `${job.id} subject id matches campaign entity`,
  );
  check(
    contract.subject.evidenceState === job.evidenceState &&
      JSON.stringify(contract.subject.openIdentityVariables) ===
        JSON.stringify(job.openIdentityVariables),
    `${job.id} prompt subject preserves its evidence boundary`,
  );
  check(
    job.openIdentityVariables.length === 0 ||
      ((contract.subject.allowedVariation.includes(
        "every variable named as open above must remain visibly provisional",
      ) ||
        (contract.subject.allowedVariation.includes(
          "held candidate is not canon",
        ) &&
          contract.subject.allowedVariation.includes(
            "vary only the explicitly open detail variables",
          ))) &&
        !contract.subject.allowedVariation.includes("Age, role")),
    `${job.id} open-variable instructions contain no contradictory identity lock`,
  );
  check(
    contract.governance.releaseEligibility === job.releaseEligibility &&
      contract.governance.sensitivityReviewRequired ===
        job.sensitivityReviewRequired &&
      JSON.stringify(contract.governance.reviewRequirements) ===
        JSON.stringify(job.reviewRequirements),
    `${job.id} prompt governance matches the campaign ledger`,
  );
}

const blocked = jobs.filter((job) => job.generationState === "blocked");
check(
  blocked.length === campaign.meta.blockedCount,
  "blocked job count matches campaign metadata",
);
check(
  blocked.length === 9,
  "nine known canon, identity, cultural, or continuity gates are blocked",
);
for (const id of [
  "ACV-027",
  "ACV-030",
  "ACV-037",
  "ACV-040",
  "ACV-077",
  "ACV-080",
  "ACV-084",
  "ACV-089",
  "ACV-099",
]) {
  check(
    blocked.some((job) => job.id === id),
    `${id} remains blocked`,
  );
}
check(
  blocked.every(
    (job) =>
      typeof job.blockedReason === "string" && job.blockedReason.length > 20,
  ),
  "every blocked job names the reason",
);

check(
  campaign.rubric.dimensions.length === 10,
  "evaluation rubric has ten dimensions",
);
check(campaign.rubric.threshold === 42, "evaluation threshold is 42/50");
check(
  Object.keys(campaign.rubric.hardFloors).length === 3,
  "identity, canon, and anatomy have hard floors",
);
check(
  campaign.proofProtocol.stages.map((stage) => stage.id).join(",") ===
    "contracted,recorded,approved,published,identity-qualified" &&
    campaign.proofProtocol.stages[0].count === campaign.meta.totalJobs &&
    campaign.proofProtocol.stages[1].count === campaign.meta.generatedCount &&
    campaign.proofProtocol.stages[2].count === campaign.meta.approvedCount &&
    campaign.proofProtocol.stages[3].count === campaign.meta.publishedCount &&
    campaign.proofProtocol.stages[4].count === 0,
  "public proof ladder reports contract, receipt, approval, publication, and identity-qualification truth",
);
check(
  campaign.proofProtocol.reviewMethod.includes("Style-blind") &&
    campaign.proofProtocol.identityRule.includes(
      "eight distinct approved regression views",
    ) &&
    campaign.proofProtocol.identityRule.includes("5/5"),
  "public proof protocol teaches blind review and the eight-view identity ceiling",
);
check(
  campaign.rounds
    .slice(1)
    .every((round) =>
      round.adaptiveDecision.includes("previous ten-image round"),
    ),
  "rounds 02–10 require prior-round reflection",
);
const aspectRatioPortfolio = campaign.rounds.map((round) =>
  round.jobs.reduce((counts, job) => {
    const ratio = job.promptContract.output.aspectRatio;
    counts[ratio] = (counts[ratio] ?? 0) + 1;
    return counts;
  }, {}),
);
const hasRatioPortfolio = (roundIndex, expected) => {
  const actual = aspectRatioPortfolio[roundIndex];
  return (
    Object.keys(actual).length === Object.keys(expected).length &&
    Object.entries(expected).every(([ratio, count]) => actual[ratio] === count)
  );
};
check(
  [0, 1, 2, 3, 4, 6, 7].every((index) =>
    hasRatioPortfolio(index, { "4:5": 10 }),
  ) &&
    hasRatioPortfolio(5, { "4:5": 6, "16:9": 4 }) &&
    hasRatioPortfolio(8, { "16:9": 10 }) &&
    hasRatioPortfolio(9, {
      "4:5": 2,
      "16:9": 2,
      "1:1": 1,
      "3:2": 3,
      "21:9": 2,
    }),
  "campaign geometry holds Round 01 constant and preserves each later dossier, workflow, world, and regression surface",
);
check(
  campaign.adaptiveProtocol.laterAllocation.includes("eight executable jobs") &&
    campaign.adaptiveProtocol.laterAllocation.includes(
      "two deterministic portability probes",
    ) &&
    campaign.adaptiveProtocol.laterAllocation.includes("up to two probes") &&
    campaign.adaptiveProtocol.probeInterpretation.includes(
      "prior accepted reflection hash",
    ) &&
    campaign.adaptiveProtocol.probeInterpretation.includes(
      "never promote or retire",
    ),
  "public campaign data explains deterministic 8/2 allocation and its inference limit",
);

const { packetHash, ...roundOnePacketBody } = roundOnePack;
check(
  packetHash === sha(roundOnePacketBody),
  "Round 01 prompt pack hash is valid",
);
const roundOneGenerated = roundOne.filter((job) => job.output !== null).length;
check(
  roundOnePack.generatedCount === roundOneGenerated,
  "Round 01 prompt pack generation count matches campaign receipts",
);
check(roundOnePack.jobs.length === 10, "Round 01 pack contains ten jobs");
check(
  roundOnePack.styleAllocation?.policy ===
    "five-style-two-anchor-controlled-benchmark" &&
    roundOnePack.styleAllocation.primaryJobIds.length === 0 &&
    roundOnePack.styleAllocation.secondaryProbeJobIds.length === 0 &&
    roundOnePack.styleAllocation.selectionSeedHash === null,
  "Round 01 pack declares the controlled five-style benchmark allocation",
);
check(
  roundOnePack.jobs.every(
    (job) =>
      typeof job.compiledPrompt === "string" &&
      job.compiledPrompt.length > 500 &&
      job.compiledPrompt.includes("EVIDENCE AND GOVERNANCE") &&
      job.compiledPrompt.includes("Release eligibility:"),
  ),
  "Round 01 has ten substantial prompts with explicit evidence and release boundaries",
);
check(
  roundOnePack.jobs.every((job) =>
    job.outputReceipt === null
      ? job.providerExecution.model === null
      : typeof job.providerExecution.model === "string" &&
        existsSync(join(ROOT, job.outputReceipt)),
  ),
  "Round 01 provider claims are backed by output receipts",
);
for (const profileId of providerProfileIds) {
  const providerPack = providerPacks[profileId];
  const executionManifest = readJson(providerPack.executionManifest.path);
  const { packetHash: providerPacketHash, ...providerPacketBody } =
    providerPack;
  const { manifestHash, ...manifestBody } = executionManifest;
  check(
    providerPacketHash === sha(providerPacketBody),
    `${profileId} provider packet hash is valid`,
  );
  check(
    providerPack.schema === "arcanea.provider_execution_packet.v1" &&
      providerPack.campaignId === campaign.meta.campaignId &&
      providerPack.campaignVersion === campaign.meta.version &&
      providerPack.round === 1 &&
      providerPack.promptCompilerVersion === "2.1.3" &&
      providerPack.sourcePromptPackHash === roundOnePack.packetHash,
    `${profileId} packet is chained to the exact campaign and source prompt pack`,
  );
  check(
    executionManifest.schema === "arcanea.provider_execution_manifest.v1" &&
      manifestHash === sha(manifestBody) &&
      providerPack.executionManifest.hash === manifestHash &&
      executionManifest.sourceContractSetHash ===
        providerPack.sourceContractSetHash &&
      executionManifest.profileId === profileId &&
      executionManifest.jobs.length === providerPack.jobs.length &&
      executionManifest.jobs.every((manifestJob, index) => {
        const providerJob = providerPack.jobs[index];
        return (
          manifestJob.id === providerJob.id &&
          manifestJob.promptContractHash === providerJob.promptContractHash &&
          manifestJob.executionPromptHash === providerJob.executionPromptHash &&
          manifestJob.executionPrompt === providerJob.executionPrompt
        );
      }),
    `${profileId} has an immutable hash-valid execution manifest separate from live status`,
  );
  check(
    !Object.hasOwn(executionManifest, "generatedCount") &&
      !Object.hasOwn(executionManifest, "sourcePromptPackHash") &&
      !JSON.stringify(executionManifest).includes("outputReceipt"),
    `${profileId} execution-manifest identity is independent of mutable output status`,
  );
  check(
    providerPack.profileId === profileId &&
      (providerPack.profile.modelPolicy.includes("runtime") ||
        providerPack.profile.modelPolicy === "tool-managed-model-selection"),
    `${profileId} keeps model selection runtime-bound`,
  );
  check(
    providerPack.profile.research.verifiedAt === "2026-08-25" &&
      typeof providerPack.profile.research.url === "string" &&
      providerPack.profile.research.basis.length > 100,
    `${profileId} records dated first-party capability research`,
  );
  check(
    providerPack.jobs.length === 10 &&
      providerPack.jobs.every((providerJob) => {
        const sourceJob = roundOne.find(
          (candidate) => candidate.id === providerJob.id,
        );
        return (
          sourceJob &&
          providerJob.promptContractHash ===
            sourceJob.promptContract.contractHash &&
          providerJob.sourcePromptPackHash === roundOnePack.packetHash &&
          providerJob.executionState === "executable" &&
          typeof providerJob.executionPrompt === "string" &&
          providerJob.executionPrompt.length > 800 &&
          providerJob.executionPromptHash ===
            sha(providerJob.executionPrompt) &&
          providerJob.promptAudit.compilerVersion === "2.1.3" &&
          providerJob.promptAudit.characters ===
            providerJob.executionPrompt.length &&
          providerJob.promptAudit.words >= 300 &&
          providerJob.promptAudit.operationalTermsPresent.length === 0 &&
          providerJob.promptAudit.withheldGovernanceConstraintCount >= 1 &&
          providerJob.promptAudit.withheldGovernanceAvoidanceCount ===
            providerJob.governance.imageFacingAvoidanceWithheld.length &&
          providerJob.governance.imageFacingConstraintsWithheld.length >= 1 &&
          providerJob.referencePlan.qualifiedIdentityReferenceSet === null &&
          providerJob.referencePlan.acceptedReferences.length === 0 &&
          !providerJob.executionPrompt.includes("EVIDENCE AND GOVERNANCE") &&
          !providerJob.executionPrompt.includes("Release eligibility:") &&
          !/\bcanon(?:ical)?\b/i.test(providerJob.executionPrompt) &&
          !/\bidentity master\b/i.test(providerJob.executionPrompt) &&
          !/[.!?]{2,}/.test(providerJob.executionPrompt) &&
          providerJob.requestHints.assetCount ===
            sourceJob.promptContract.output.assetCount &&
          providerJob.requestHints.aspectRatio ===
            sourceJob.promptContract.output.aspectRatio &&
          providerJob.requestHints.intendedSurface ===
            sourceJob.promptContract.output.intendedSurface &&
          providerJob.requestHints.deliveryRole ===
            sourceJob.promptContract.output.deliveryRole &&
          providerJob.requestHints.cropSafety ===
            sourceJob.promptContract.output.cropSafety &&
          providerJob.requestHints.generatedTextPolicy ===
            sourceJob.promptContract.output.generatedTextPolicy &&
          providerJob.receiptRequirements.length >= 8 &&
          providerJob.receiptRequirements.some((requirement) =>
            requirement.includes("exact post-copy byte and geometry equality"),
          )
        );
      }),
    `${profileId} carries ten hash-bound visual-only execution prompts and complete receipt requirements`,
  );
  if (providerPack.profile.supportsNegativeGuidance) {
    check(
      providerPack.jobs.every((providerJob) => {
        const sourceJob = roundOne.find(
          (candidate) => candidate.id === providerJob.id,
        );
        const style = campaign.styles.find(
          (candidate) => candidate.id === sourceJob?.styleState,
        );
        return style?.avoid.every((rule) =>
          providerJob.executionPrompt.includes(rule),
        );
      }),
      `${profileId} preserves every job-specific Round 01 style exclusion`,
    );
  }
}
const { indexHash: executionManifestIndexHash, ...executionManifestIndexBody } =
  executionManifestIndex;
check(
  executionManifestIndex.schema ===
    "arcanea.provider_execution_manifest_index.v1" &&
    executionManifestIndexHash === sha(executionManifestIndexBody) &&
    executionManifestIndex.campaignId === campaign.meta.campaignId &&
    executionManifestIndex.currentCampaignVersion === campaign.meta.version &&
    executionManifestIndex.current.filter((entry) => entry.round === 1)
      .length === providerProfileIds.length &&
    providerProfileIds.every((profileId) => {
      const current = executionManifestIndex.current.find(
        (entry) => entry.profileId === profileId && entry.round === 1,
      );
      return (
        current?.manifestPath ===
          providerPacks[profileId].executionManifest.path &&
        current?.manifestHash ===
          providerPacks[profileId].executionManifest.hash &&
        current?.providerPacketHash === providerPacks[profileId].packetHash
      );
    }),
  "manifest index designates exactly the four current Round 01 provider manifests",
);
check(
  executionManifestIndex.lineage.length >=
    executionManifestIndex.current.length &&
    executionManifestIndex.lineage.every((entry) => {
      const manifest = readJson(entry.path);
      const { manifestHash, ...manifestBody } = manifest;
      const isCurrent = executionManifestIndex.current.some(
        (current) =>
          current.manifestPath === entry.path &&
          current.manifestHash === entry.manifestHash,
      );
      return (
        manifestHash === sha(manifestBody) &&
        manifestHash === entry.manifestHash &&
        entry.boundOutputReceipts.every((path) =>
          existsSync(join(ROOT, path)),
        ) &&
        entry.status ===
          (isCurrent
            ? "current-active"
            : entry.boundOutputReceipts.length
              ? "historical-bound"
              : "historical-unbound")
      );
    }),
  "manifest index preserves hash-valid current and historical execution lineage",
);
check(
  new Set(
    providerProfileIds.map((id) => providerPacks[id].sourceContractSetHash),
  ).size === 1,
  "all provider manifests bind the same stable engine-neutral contract set",
);
check(
  providerPacks["openai-gpt-image"].jobs.every((job, index) => {
    const prompt = job.executionPrompt;
    return (
      prompt ===
        providerPacks["gemini-native-image"].jobs[index].executionPrompt &&
      prompt === providerPacks["codex-imagegen"].jobs[index].executionPrompt
    );
  }),
  "OpenAI, Gemini, and Codex controlled lanes receive identical image-facing semantics",
);
check(
  providerPacks["openai-gpt-image"].jobs.every((job) => {
    const prompt = job.executionPrompt;
    const orderedMarkers = [
      "Action and story consequence:",
      "Composition:",
      "Visual direction:",
      "Light:",
      "Identity variation boundary:",
      "Required visible result:",
      "Keep the image free of:",
    ];
    return orderedMarkers.every(
      (marker, index) =>
        prompt.indexOf(marker) >= 0 &&
        (index === 0 ||
          prompt.indexOf(marker) > prompt.indexOf(orderedMarkers[index - 1])),
    );
  }),
  "provider prompts preserve subject-action-composition-style-light-control ordering",
);
const fluxProviderPack = providerPacks["flux-2"];
check(
  fluxProviderPack.profile.supportsNegativeGuidance === false &&
    fluxProviderPack.jobs.every(
      (job) =>
        job.requestHints.negativePrompt === null &&
        job.requestHints.promptUpsampling === false &&
        !job.executionPrompt.includes("AVOID") &&
        !/\b(no|not|never|without|avoid|banned|neither)\b/i.test(
          job.executionPrompt,
        ),
    ),
  "FLUX packet translates exclusions into positive controlled language",
);
check(
  fluxProviderPack.jobs.every(
    (job) =>
      job.requestHints.width === 1216 &&
      job.requestHints.height === 1520 &&
      job.requestHints.width % 16 === 0 &&
      job.requestHints.height % 16 === 0 &&
      job.requestHints.width * job.requestHints.height <= 2_000_000,
  ),
  "FLUX Round 01 uses exact 4:5 dimensions divisible by 16 inside the recommended two-megapixel working range",
);
check(
  providerPacks["openai-gpt-image"].jobs.every(
    (job) =>
      job.requestHints.size === "1536x1920" &&
      job.requestHints.format === "webp" &&
      job.requestHints.quality.includes("controlled-study"),
  ),
  "OpenAI Round 01 requests use exact 4:5 controlled-study output hints",
);
check(
  providerPacks["gemini-native-image"].jobs.every(
    (job) =>
      job.requestHints.aspectRatio === "4:5" &&
      job.requestHints.imageSize === "2K" &&
      job.requestHints.batchPolicy.includes("do-not-use-24h-batch-mode"),
  ),
  "Gemini Round 01 requests preserve 4:5, 2K, same-loop adaptive execution",
);
check(
  providerPacks["codex-imagegen"].jobs.every(
    (job) =>
      job.requestHints.callsPerJob === 1 &&
      job.requestHints.referencedImagePaths.includes("smallest-sufficient"),
  ),
  "Codex imagegen packet uses one call per contracted image and the smallest sufficient reference set",
);
check(
  roundOneReflection.generated === roundOneGenerated &&
    roundOneReflection.validFiles === roundOneGenerated,
  "Round 01 reflection template starts from the recorded file count",
);
check(
  roundOneReflection.nextRoundCompilationAllowed === false &&
    roundOneReflection.primaryStyleDecision === "pending",
  "Round 02 remains adaptively gated",
);
check(
  roundOneEvaluation.candidates.length === 10,
  "Round 01 evaluation template has ten candidates",
);
check(
  roundOneEvaluation.judges.independent.independentFromGeneration === true &&
    roundOneEvaluation.judges.independent.id === null,
  "Round 01 reserves an unassigned independent judge",
);
check(
  roundOneEvaluation.decision.reconciliationNotes === "",
  "Round 01 reserves explicit score-disagreement reconciliation notes",
);
check(
  roundOneEvaluation.reviewProtocol.mode === "style-blind-two-pass" &&
    roundOneEvaluation.reviewProtocol.blindReviewRequired === true &&
    roundOneEvaluation.reviewProtocol.blindReviewCompleted === false &&
    roundOneEvaluation.reviewProtocol.referenceMaturity ===
      "text-conditioned-no-accepted-reference" &&
    roundOneEvaluation.reviewProtocol.benchmarkLimitation ===
      campaign.adaptiveProtocol.benchmarkLimitation,
  "Round 01 evaluation starts behind a style-blind, no-reference review gate",
);
check(
  unique(roundOneEvaluation.candidates.map((candidate) => candidate.blindId)) &&
    roundOneEvaluation.candidates.every(
      (candidate) =>
        /^BR-01-[A-F0-9]{10}$/.test(candidate.blindId) &&
        candidate.referenceState === "text-conditioned-no-image-reference" &&
        candidate.identityContinuityCeiling === 4,
    ),
  "Round 01 candidates have opaque ids and a 4/5 text-conditioned identity ceiling",
);
check(
  roundOneEvaluation.decision.benchmarkReferenceState ===
    "text-conditioned-no-accepted-reference" &&
    roundOneEvaluation.decision.benchmarkLimitationAcknowledged === false &&
    roundOneEvaluation.decision.identityComparabilityNotes === "" &&
    roundOneEvaluation.decision.crossAnchorPortabilityNotes === "",
  "Round 01 cannot silently promote a style before documenting comparability and portability",
);
check(
  roundOneEvaluation.candidates.every((candidate) =>
    Object.values(candidate.production.scores).every((score) => score === null),
  ),
  "Round 01 evaluation does not fabricate scores",
);

const serializedPublicData = JSON.stringify({
  constellation,
  campaign,
  guardianAtlas,
  godbeastAtlas,
  characterAtlas,
  worldAtlas,
});
check(
  !serializedPublicData.includes("private_vault"),
  "public artifacts do not reference private_vault",
);
check(
  !serializedPublicData.includes("C:\\Users\\"),
  "public artifacts do not leak local absolute paths",
);
check(
  !serializedPublicData.includes("published-by-agent"),
  "public artifacts do not imply autonomous publication",
);

const constellationPage = readText("apps/web/app/constellation/page.tsx");
const dossierPage = readText("apps/web/app/constellation/[id]/page.tsx");
const characterPage = readText(
  "apps/web/app/constellation/characters/[id]/page.tsx",
);
const guardianPage = readText(
  "apps/web/app/constellation/guardians/[id]/page.tsx",
);
const godbeastPage = readText(
  "apps/web/app/constellation/godbeasts/[id]/page.tsx",
);
const worldPage = readText("apps/web/app/constellation/worlds/[id]/page.tsx");
const promptContractPage = readText(
  "apps/web/app/constellation/prompts/[jobId]/page.tsx",
);
const constellationCss = readText(
  "apps/web/app/constellation/constellation.module.css",
);
const designTokens = readText("packages/design-system/src/tokens.css");
const sitemap = readText("apps/web/app/sitemap.ts");
const navbar = readText("apps/web/components/navigation/navbar.tsx");
const commandPalette = readText("apps/web/components/command-palette.tsx");
const gallery = readText(
  "apps/web/components/visual-encyclopedia/visual-encyclopedia.tsx",
);
const gitignore = readText(".gitignore");
const repositoryAgentContract = readText("AGENTS.md");
const compiler = readText("scripts/compile-arcanea-visual-round.mjs");
const providerCompiler = readText(
  "scripts/compile-arcanea-provider-packets.mjs",
);
const recorder = readText("scripts/record-arcanea-image-result.mjs");
const preflightCapture = readText(
  "scripts/capture-arcanea-machine-preflight.mjs",
);
const preflightAuthority = readText(
  "scripts/lib/arcanea-machine-preflight.mjs",
);
const grantIssuer = readText(
  "scripts/issue-arcanea-visual-execution-grant.mjs",
);
const contractSchemaValidator = readText(
  "scripts/validate-arcanea-visual-contract-schemas.mjs",
);
const referenceRegistrar = readText(
  "scripts/register-arcanea-visual-reference.mjs",
);
const referenceQualifier = readText(
  "scripts/qualify-arcanea-identity-reference-set.mjs",
);
const referenceAssigner = readText(
  "scripts/assign-arcanea-identity-references.mjs",
);
const blindReviewer = readText("scripts/prepare-arcanea-blind-review.mjs");
const blindReconciler = readText("scripts/reconcile-arcanea-blind-review.mjs");
const scorer = readText("scripts/score-arcanea-visual-round.mjs");
const releaseDecider = readText("scripts/decide-arcanea-image-release.mjs");
const readinessReporter = readText(
  "scripts/report-arcanea-visual-readiness.mjs",
);
const workbench = readText(workbenchPath);
const characterReadiness = readText(characterReadinessPath);
const guardianReadiness = readText(guardianReadinessPath);
const godbeastReadiness = readText(godbeastReadinessPath);
const worldReadiness = readText(worldReadinessPath);
const coverageMatrix = readText(coverageMatrixPath);
const visualDirectorSkill = readText(visualDirectorSkillPath);
const visualDirectorAgent = readText(visualDirectorAgentPath);
const visualDirectorRuntimeAgent = readText(visualDirectorRuntimeAgentPath);
const autonomyContract = readText(autonomyContractPath);
const publicUi = `${constellationPage}\n${dossierPage}\n${guardianPage}\n${godbeastPage}\n${characterPage}\n${worldPage}\n${promptContractPage}`;
check(
  characters.every(
    (character) =>
      characterReadiness.includes(`## ${character.name}`) &&
      characterReadiness.includes(character.campaign.jobId),
  ),
  "generated character knowledge base indexes all twenty identities and jobs",
);
check(
  guardians.every(
    (guardian) =>
      guardianReadiness.includes(`## ${guardian.name}`) &&
      guardianReadiness.includes(guardian.campaign.identityJobId) &&
      guardianReadiness.includes(guardian.campaign.dyadJobId),
  ),
  "generated Guardian knowledge base indexes all ten identities and both study jobs",
);
check(
  godbeasts.every(
    (godbeast) =>
      godbeastReadiness.includes(`## ${godbeast.name}`) &&
      godbeastReadiness.includes(godbeast.campaign.morphologyJobId) &&
      godbeastReadiness.includes(godbeast.campaign.dyadJobId),
  ),
  "generated Godbeast knowledge base indexes all ten identities and both study jobs",
);
check(
  worlds.every(
    (world) =>
      worldReadiness.includes(`## ${world.name}`) &&
      worldReadiness.includes(world.campaign.jobId),
  ),
  "generated world knowledge base indexes all ten systems and campaign jobs",
);
check(
  agents.every((agent) => coverageMatrix.includes(`| ${agent.name} |`)) &&
    guardians.every(
      (guardian) =>
        coverageMatrix.includes(`| ${guardian.name} |`) &&
        coverageMatrix.includes(guardian.campaign.identityJobId) &&
        coverageMatrix.includes(guardian.campaign.dyadJobId),
    ) &&
    godbeasts.every(
      (godbeast) =>
        coverageMatrix.includes(`| ${godbeast.name} |`) &&
        coverageMatrix.includes(godbeast.campaign.morphologyJobId),
    ) &&
    characters.every(
      (character) =>
        coverageMatrix.includes(`| ${character.name} |`) &&
        coverageMatrix.includes(character.campaign.jobId),
    ) &&
    worlds.every(
      (world) =>
        coverageMatrix.includes(`| ${world.name} |`) &&
        coverageMatrix.includes(world.campaign.jobId),
    ),
  "master coverage matrix joins all sixty-six named entities to their exact visual studies",
);
check(
  !coverageMatrix.includes("undefined") &&
    jobs
      .filter((job) => ["workflow", "regression"].includes(job.subjectKind))
      .every((job) => coverageMatrix.includes(`| ${job.id} |`)) &&
    coverageMatrix.includes("100 contracted image jobs") &&
    coverageMatrix.includes("0 recorded outputs"),
  "master coverage matrix includes workflow, regression, campaign, and current-output truth",
);
check(
  visualDirectorSkill.includes(
    "[autonomy-contract.md](references/autonomy-contract.md)",
  ) &&
    visualDirectorSkill.includes("[AGENT.md](AGENT.md)") &&
    visualDirectorAgent.includes("## Governed autonomy"),
  "Visual Director skill and operational card bind to the governed autonomy contract",
);
check(
  [
    "## Default council",
    "## State reconstruction",
    "## Operating route",
    "## Stop conditions",
    "## Verification questions",
    "## Completion receipt",
  ].every((section) => visualDirectorRuntimeAgent.includes(section)) &&
    ["Prismatic", "Chronica", "Analytica", "Memoria"].every((name) =>
      visualDirectorRuntimeAgent.includes(name),
    ) &&
    visualDirectorRuntimeAgent.includes(
      "may not act as the independent critic, identity qualifier, spend approver, or release authority",
    ),
  "Visual Director AGENT defines council, resumable state, verification, and separation of duties",
);
check(
  repositoryAgentContract.includes("## Visual Intelligence Director") &&
    repositoryAgentContract.includes(
      "skills/arcanea-visual-director/AGENT.md",
    ) &&
    repositoryAgentContract.includes(
      "skills/arcanea-visual-director/SKILL.md",
    ) &&
    repositoryAgentContract.includes("fresh allowed PP preflight") &&
    repositoryAgentContract.includes("freezes after each ten-image round"),
  "repo-level agent entrypoint routes visual work to the governed Visual Director",
);
check(
  constellationBenchmark.includes("d0f389584eda482d9c96f27eeb7c6563a9ca83d3") &&
    constellationBenchmark.includes(
      "Arcanea should inherit Starlight's rigor, not its skin",
    ) &&
    constellationBenchmark.includes("## Media activation ladder") &&
    constellationBenchmark.includes("## What Arcanea must not copy"),
  "Starlight benchmark records the inspected implementation and an Arcanea-specific evolution boundary",
);
check(
  [
    "## State machine",
    "## Authority grants",
    "## Stop conditions",
    "## Retry and revision law",
    "## Interrupt and resume",
    "## Default council",
    "## Completion receipt",
  ].every((section) => autonomyContract.includes(section)) &&
    [
      "execution-awaiting-authority",
      "round-running",
      "review-frozen",
      "blind-review",
      "human-decision",
      "identity-qualified",
      "published-evidence",
    ].every((state) => autonomyContract.includes(`\`${state}\``)),
  "autonomy contract defines resumable execution, review, release, and identity states",
);
check(
  autonomyContract.includes(
    "cannot serve as both production and independent critic",
  ) &&
    autonomyContract.includes("cannot qualify its own identity set") &&
    autonomyContract.includes("cannot approve its own release") &&
    autonomyContract.includes("exact resume point"),
  "autonomy contract preserves separation of duties and an exact resumable handoff",
);
check(
  visualDirectorSkill.includes("explicitly transient failure") &&
    autonomyContract.includes("provider classifies the failure as transient") &&
    autonomyContract.includes("new immutable manifest") &&
    autonomyContract.includes("renew authority"),
  "provider retry law separates identical transient retries from governed contract revisions",
);
check(
  !publicUi.includes('"use client"') && !publicUi.includes("'use client'"),
  "Constellation routes render without client JavaScript",
);
check(
  constellationPage.includes('alternates: { canonical: "/constellation" }') &&
    [
      "constellation-title",
      "agent-atlas-title",
      "guardian-atlas-title",
      "godbeast-atlas-title",
      "character-atlas-title",
      "world-atlas-title",
      "visual-director-title",
      "campaign-title",
      "quality-contract-title",
      "teach-system-title",
    ].every((id) => constellationPage.includes(`aria-labelledby="${id}"`)),
  "Constellation entrypoint exposes canonical metadata and labelled page regions",
);
check(
  [
    dossierPage,
    guardianPage,
    godbeastPage,
    characterPage,
    worldPage,
    promptContractPage,
  ].every(
    (page) =>
      page.includes('aria-label="Breadcrumb"') && page.includes("alternates:"),
  ),
  "all dossier and Prompt Atlas routes expose canonical metadata and breadcrumb navigation",
);
check(
  promptContractPage.includes("generateStaticParams") &&
    promptContractPage.includes("contract.subject.identityLock") &&
    promptContractPage.includes("contract.output.aspectRatio") &&
    promptContractPage.includes("contract.output.intendedSurface") &&
    promptContractPage.includes("contract.output.cropSafety") &&
    promptContractPage.includes("contract.references.sourceRefs") &&
    promptContractPage.includes("contract.verification.deterministicChecks") &&
    promptContractPage.includes("A prompt contract cannot authorize itself") &&
    promptContractPage.includes("Download contract JSON") &&
    promptContractPage.includes("Inspect decision gate") &&
    constellationPage.includes(
      "/downloads/arcanea-constellation/prompts/QUALITY_AUDIT.md",
    ) &&
    constellationPage.includes(
      "/downloads/arcanea-constellation/prompts/OPEN_DECISIONS.md",
    ),
  "all 100 Prompt Atlas pages teach identity evidence, sources, verification, and authority boundaries",
);
check(
  constellationPage.includes("campaign.meta.totalJobs") &&
    constellationPage.includes("campaign.meta.generatedCount") &&
    constellationPage.includes("campaign.meta.status") &&
    constellationPage.includes("campaign.meta.releaseTruth"),
  "first viewport is bound to the real campaign ledger",
);
check(
  constellationPage.includes("adaptiveProtocol.benchmarkLimitation") &&
    constellationPage.includes("adaptiveProtocol.benchmarkAnchors") &&
    constellationPage.includes("adaptiveProtocol.laterAllocation") &&
    constellationPage.includes("adaptiveProtocol.probeInterpretation") &&
    constellationPage.includes("Benchmark boundary") &&
    constellationCss.includes(".benchmarkNote"),
  "the public campaign surface exposes the text-conditioned benchmark limitation and both anchor roles",
);
check(
  constellationPage.includes("campaign.proofProtocol.reviewMethod") &&
    constellationPage.includes("campaign.proofProtocol.identityRule") &&
    constellationPage.includes("campaign.proofProtocol.stages.map") &&
    constellationCss.includes(".proofLadder") &&
    constellationCss.includes(".proofIntro"),
  "the public quality surface teaches the real proof ladder and reference qualification boundary",
);
check(
  constellationPage.includes("campaign.meta.previousWave.name") &&
    constellationPage.includes("campaign.meta.previousWave.inspectedImages") &&
    constellationPage.includes("campaign.meta.previousWave.releaseBoundary") &&
    constellationPage.includes('href="/gallery"') &&
    constellationCss.includes(".downloadActions") &&
    campaign.meta.previousWave.campaignRelationship ===
      "historical-proposal-evidence-not-campaign-output" &&
    campaign.meta.previousWave.rightsState === "pending-human-clearance" &&
    campaign.meta.previousWave.publicationState === "not-authorized" &&
    campaign.meta.previousWave.legacyDossierPathRepairsRequired === 30,
  "the public pack handoff links prior evidence while exposing its campaign, rights, publication, and packet-repair boundary",
);
check(
  dossierPage.includes("generateStaticParams") &&
    dossierPage.includes("agent.downloads.agent"),
  "all agent dossiers are statically enumerable and expose their public contract",
);
check(
  characterPage.includes("generateStaticParams") &&
    characterPage.includes("openIdentityVariables") &&
    characterPage.includes("releaseEligibility") &&
    characterPage.includes("Discovery studies cannot"),
  "all character dossiers expose evidence, open variables, and release truth",
);
check(
  guardianPage.includes("generateStaticParams") &&
    guardianPage.includes("openIdentityVariables") &&
    guardianPage.includes("releaseEligibility") &&
    guardianPage.includes("Neither study may become"),
  "all Guardian dossiers expose locked relations, open physical identity, and release truth",
);
check(
  godbeastPage.includes("generateStaticParams") &&
    godbeastPage.includes("openIdentityVariables") &&
    godbeastPage.includes("releaseEligibility") &&
    godbeastPage.includes("Neither study may become") &&
    godbeastPage.includes("The contradiction must be resolved first"),
  "all Godbeast dossiers expose grounded function, proposed morphology, open variables, blockers, and release truth",
);
check(
  worldPage.includes("generateStaticParams") &&
    worldPage.includes("openIdentityVariables") &&
    worldPage.includes("releaseEligibility") &&
    worldPage.includes("The prerequisite protects the world") &&
    worldPage.includes("System before skyline"),
  "all world dossiers expose system evidence, open variables, blockers, and release truth",
);
check(
  constellationPage.includes("ARCANEAN_CHARACTER_IDENTITIES") &&
    constellationPage.includes('id="characters"') &&
    constellationPage.includes("Evidence before likeness"),
  "Living Constellation contains the twenty-character evidence atlas",
);
check(
  constellationPage.includes("ARCANEAN_GUARDIAN_IDENTITIES") &&
    constellationPage.includes('id="guardians"') &&
    constellationPage.includes("Mythic behavior is not a finished face"),
  "Living Constellation contains the ten-Guardian evidence atlas",
);
check(
  constellationPage.includes("ARCANEAN_GODBEAST_IDENTITIES") &&
    constellationPage.includes('id="godbeasts"') &&
    constellationPage.includes("A vivid candidate is still a candidate"),
  "Living Constellation contains the ten-Godbeast evidence atlas",
);
check(
  constellationPage.includes("ARCANEAN_WORLD_IDENTITIES") &&
    constellationPage.includes('id="worlds"') &&
    constellationPage.includes("System before skyline"),
  "Living Constellation contains the ten-world evidence atlas",
);
check(
  constellationCss.includes("@media (prefers-reduced-motion: reduce)"),
  "Constellation CSS includes a reduced-motion contract",
);
check(
  constellationCss.includes(".roundRow summary:focus-visible") &&
    constellationCss.includes(".characterCard:focus-visible") &&
    constellationCss.includes(".roundState::after") &&
    constellationCss.includes(".roundRow[open] .roundState::after"),
  "interactive atlas cards and adaptive rounds expose keyboard focus and visible state",
);
check(
  constellationCss.includes("@media (max-width: 40rem)") &&
    constellationCss.includes("@media (max-width: 58rem)"),
  "Constellation CSS includes phone and tablet adaptations",
);
check(
  !/#[0-9a-f]{3,8}\b/i.test(constellationCss) &&
    !/rgba?\(/i.test(constellationCss),
  "Constellation CSS contains no raw hex or rgb colors",
);
check(
  !/font-size:\s*0\.(?:[0-5]\d*|6[0-7])rem/.test(constellationCss),
  "Constellation microcopy never drops below 0.68rem",
);
check(
  constellationCss.includes("var(--arc-brand-atlantean-teal) 46%") &&
    constellationCss.includes(".blueprintDownloads {") &&
    constellationCss.includes("--signal: var(--arc-brand-atlantean-teal)"),
  "light surfaces use a darkened signal while dark surfaces restore bright teal",
);
const declaredVariables = new Set(
  [
    ...designTokens.matchAll(/(--arc-[a-z0-9-]+)\s*:/g),
    ...constellationCss.matchAll(/(--[a-z0-9-]+)\s*:/g),
  ].map((match) => match[1]),
);
const usedVariables = [
  ...constellationCss.matchAll(/var\((--[a-z0-9-]+)/g),
].map((match) => match[1]);
check(
  usedVariables.every((variable) => declaredVariables.has(variable)),
  "every Constellation CSS variable resolves to a design token or local semantic token",
);
check(
  !/\p{Extended_Pictographic}/u.test(publicUi),
  "new public UI contains no emoji pictographs",
);
check(
  publicUi.includes(
    'alt={`${job.name}. Campaign state: ${job.releaseState.replaceAll("-", " ")}.`}',
  ),
  "staged public candidates have release-state alt text",
);
check(
  sitemap.includes("/constellation") &&
    sitemap.includes("/constellation/guardians/") &&
    sitemap.includes("/constellation/godbeasts/") &&
    sitemap.includes("/constellation/worlds/") &&
    sitemap.includes("/constellation/characters/") &&
    sitemap.includes("/constellation/prompts/") &&
    navbar.includes("/constellation") &&
    commandPalette.includes("/constellation"),
  "agent, Guardian, Godbeast, world, character, and prompt-contract Constellation routes are discoverable",
);
check(
  gallery.includes('href="/constellation"') &&
    gallery.includes("Historical visual evidence") &&
    gallery.includes("separate from the current campaign") &&
    gallery.includes("aria-label={label}") &&
    gallery.includes("aria-pressed={active}"),
  "Visual encyclopedia links to the Living Constellation, distinguishes historical evidence, and names its mobile view controls",
);
check(
  compiler.includes("receiptHash !== digest(receiptBody)") &&
    compiler.includes("receipt.promptPackHash !== priorPack.packetHash") &&
    compiler.includes('receipt.humanVerdict !== "accepted"') &&
    compiler.includes("benchmarkDecisionValid") &&
    compiler.includes("blindReviewValid") &&
    compiler.includes(
      "adaptive-primary-with-two-deterministic-secondary-portability-probes",
    ) &&
    compiler.includes("priorReflectionHash") &&
    compiler.includes("secondaryProbeJobIds"),
  "adaptive compiler validates the prior reflection, benchmark limitation, blind review, and human verdict",
);
check(
  providerCompiler.includes("styleAllocation: sourcePack.styleAllocation") &&
    providerCompiler.includes("styleState: job.styleState") &&
    providerCompiler.includes("sourceJob?.styleState ?? job.styleState") &&
    providerCompiler.includes("...(selectedStyle?.avoid ?? [])"),
  "provider compiler binds each job's allocated style direction and avoidance rules",
);
check(
  recorder.includes('required(args, "execution-manifest")') &&
    recorder.includes('required(args, "execution-prompt-hash")') &&
    recorder.includes('required(args, "execution-grant")') &&
    recorder.includes("arcanea.provider_execution_manifest.v1") &&
    recorder.includes("arcanea.provider_execution_manifest_index.v1") &&
    recorder.includes("validateMachinePreflightReceipt") &&
    preflightAuthority.includes("arcanea.machine_preflight_receipt.v2") &&
    recorder.includes("arcanea.visual_execution_grant.v1") &&
    recorder.includes("executionGrant.runtimeParametersHash") &&
    recorder.includes("Execution grant call or revision budget is exhausted") &&
    recorder.includes("not current-active") &&
    recorder.includes("must exactly match the immutable execution manifest") &&
    recorder.includes("verifyImageAspectRatio") &&
    recorder.includes("aspectRatioMatchesContract"),
  "output recorder binds every binary to current authority, manifest, prompt, parameters, reference, geometry, and call-budget evidence",
);
check(
  readText("scripts/build-arcanea-living-constellation.mjs").includes(
    "does not match its execution authority chain",
  ) &&
    readText("scripts/build-arcanea-living-constellation.mjs").includes(
      "recordedAt > preflightExpiresAt",
    ) &&
    readText("scripts/build-arcanea-living-constellation.mjs").includes(
      "executionGrant.runtimeParametersHash",
    ),
  "campaign hydration revalidates grant, preflight, model-policy, parameter, and recorded-time evidence",
);
check(
  referenceRegistrar.includes("bounded-approved-reference") &&
    referenceRegistrar.includes("all five human gates") &&
    referenceRegistrar.includes("internal-only-until-identity-lock") &&
    referenceRegistrar.includes("Approved staged bytes do not match"),
  "bounded visual references require exact approved bytes and all human gates",
);
check(
  referenceQualifier.includes("identity-regression-qualified") &&
    referenceQualifier.includes("at least eight distinct") &&
    [
      "close-portrait",
      "full-body-action",
      "grayscale-silhouette",
      "small-avatar",
      "wide-environment",
      "object-or-anatomy-detail",
      "two-character-relation",
      "ensemble-stability",
    ].every((coverage) => referenceQualifier.includes(coverage)),
  "identity-reference qualification requires eight approved regression coverages",
);
check(
  referenceAssigner.includes("one to five views") &&
    referenceAssigner.includes("identity-regression-qualified") &&
    referenceAssigner.includes("smallest-sufficient set") &&
    scorer.includes("regression-qualified accepted reference set") &&
    scorer.includes("arcanea.visual_reference_assignment.v1"),
  "reference assignment is human-attested, smallest-sufficient, and required for 5/5 continuity",
);
check(
  blindReviewer.includes("linkSync(imagePath, blindedAsset)") &&
    blindReviewer.includes("styleLabelsWithheld: true") &&
    blindReviewer.includes("teamPreferenceWithheld: true") &&
    blindReviewer.includes("identityContinuityCeiling") &&
    !blindReviewer.includes("copyFileSync"),
  "blind-review builder anonymizes with hard links and publishes no duplicate image-copy path",
);
check(
  blindReviewer.includes("verifyImageAspectRatio") &&
    blindReviewer.includes("metadata.bytes !== receipt.output.bytes") &&
    blindReviewer.includes("aspectRatioMatchesContract") &&
    blindReviewer.includes("promptHashMatchesCampaign"),
  "blind-review admission revalidates binary size, declared geometry, and recorder deterministic checks before scoring",
);
check(
  blindReconciler.includes("completedBeforeUnblinding") &&
    blindReconciler.includes("different judge identities") &&
    blindReconciler.includes("scorecardHash") &&
    blindReconciler.includes("hasForbiddenKey"),
  "blind-review reconciler seals separate scorecards and rejects leaked unblinding fields",
);
check(
  scorer.includes("both controlled anchors pass") &&
    scorer.includes("explicit reconciliation notes") &&
    scorer.includes("scores or evidence changed after") &&
    scorer.includes("cannot claim 5/5 identity continuity") &&
    scorer.includes("cross-anchor portability"),
  "scorer enforces sealed blind evidence, reference maturity, controlled anchors, and disagreement reconciliation",
);
check(
  releaseDecider.includes("arcanea.visual_release_decision.v1") &&
    releaseDecider.includes('human-attestation must be exactly "confirmed"') &&
    releaseDecider.includes("pass independent evaluation") &&
    releaseDecider.includes("identity-discovery study") &&
    releaseDecider.includes("specific sensitivity-review evidence") &&
    releaseDecider.includes("planning-with-files/arcanea-visual-assets") &&
    releaseDecider.includes("Staged public image"),
  "release decisions require evaluation, human gates, identity readiness, specialist evidence, and public staging",
);
check(
  readinessReporter.includes("arcanea.visual_execution_readiness.v1") &&
    readinessReporter.includes("arcanea.visual_execution_grant.v1") &&
    readinessReporter.includes("validateMachinePreflightReceipt") &&
    preflightAuthority.includes("arcanea.machine_preflight_receipt.v2") &&
    readinessReporter.includes('"execution-awaiting-authority"') &&
    readinessReporter.includes('"round-running"') &&
    readinessReporter.includes('"review-frozen"'),
  "readiness reporter reconstructs governed execution state from manifests, authority, and receipts",
);
check(
  preflightCapture.includes('"pp.ps1"') &&
    preflightCapture.includes('"preflight"') &&
    preflightCapture.includes('"overnight"') &&
    preflightCapture.includes('"--json"') &&
    preflightCapture.includes("MACHINE_PREFLIGHT_SCHEMA") &&
    preflightCapture.includes("buildStorageEvidence") &&
    preflightCapture.includes("storage-input") &&
    preflightCapture.includes("ppPlanHash") &&
    preflightCapture.includes('receipt.posture === "hold"') &&
    preflightCapture.includes("ttlMinutes < 5") &&
    preflightCapture.includes("ttlMinutes > 30"),
  "preflight capture preserves real PP plus storage evidence, short expiry, and non-executable HOLD state",
);
check(
  grantIssuer.includes("arcanea.visual_execution_grant.v1") &&
    grantIssuer.includes('required(args, "human-attestation")') &&
    grantIssuer.includes('!== "confirmed"') &&
    grantIssuer.includes("Provider lane is stale or not current-active") &&
    grantIssuer.includes("validateMachinePreflightReceipt") &&
    grantIssuer.includes("requestedIds.length + revisionCalls > 10") &&
    grantIssuer.includes("Specialist-review evidence is missing") &&
    grantIssuer.includes("authorityEvidence") &&
    grantIssuer.includes("humanAttestation: true"),
  "grant issuer materializes only explicit, current, narrow, human-attested authority",
);
check(
  visualContractSchemaFiles.every((schemaFile) => {
    const source = readJson(`schemas/arcanea-visual/${schemaFile}`);
    const publicCopy = readJson(
      `apps/web/public/downloads/arcanea-constellation/system/${schemaFile}`,
    );
    return (
      JSON.stringify(source) === JSON.stringify(publicCopy) &&
      source.$schema === "https://json-schema.org/draft/2020-12/schema" &&
      source.$id.startsWith("https://arcanea.ai/schemas/") &&
      source.additionalProperties === false
    );
  }) &&
    contractSchemaValidator.includes("must match exactly one oneOf branch") &&
    contractSchemaValidator.includes("additional property") &&
    visualContractSchemaFiles.every((schemaFile) =>
      contractSchemaValidator.includes(schemaFile),
    ),
  "formal prompt, authority, and output schemas are strict, portable, and public-copy identical",
);
check(
  readText(
    "apps/web/public/downloads/arcanea-constellation/system/CONTRACTS.md",
  ).includes("provider's image-facing prompt smaller than the full contract") &&
    constellationPage.includes(
      "/downloads/arcanea-constellation/system/CONTRACTS.md",
    ),
  "public teaching surface exposes the machine contract suite and prompt/governance partition",
);
const { receiptHash: holdPreflightHash, ...holdPreflightBody } = holdPreflight;
const { evidenceHash: holdStorageEvidenceHash, ...holdStorageEvidenceBody } =
  holdPreflight.storageEvidence;
check(
  holdPreflight.schema === "arcanea.machine_preflight_receipt.v2" &&
    holdPreflightHash === sha(holdPreflightBody) &&
    holdPreflight.workload === "image-generation" &&
    holdPreflight.sourceWorkload === "overnight" &&
    holdPreflight.performancePosture === "hold" &&
    holdPreflight.posture === "hold" &&
    holdPreflight.ppPlanHash === sha(holdPreflight.ppPlan) &&
    holdPreflight.ppPlan.decision === holdPreflight.performancePosture &&
    holdStorageEvidenceHash === sha(holdStorageEvidenceBody) &&
    holdPreflight.storageEvidence.mediaGenerationAllowed === false &&
    holdPreflight.storageEvidence.freePercent === 8.3 &&
    holdPreflight.ppPlan.hardBlocks.some((blocker) =>
      blocker.includes("Codex task runtimes exceed"),
    ) &&
    holdPreflight.blockingConditions.some((blocker) =>
      blocker.includes("image generation requires at least 15%"),
    ),
  "captured live HOLD receipt is hash-valid and preserves performance plus storage blockers",
);
check(
  storageEvidenceCorrection.includes("0 / 11 targets present") &&
    storageEvidenceCorrection.includes("0 GiB of currently verified reclaim") &&
    storageEvidenceCorrection.includes("64.14 GiB gap") &&
    storageEvidenceCorrection.includes(
      "No storage candidate or user artifact was deleted, moved, dehydrated, uninstalled, pruned, or overwritten",
    ),
  "storage recovery guidance rejects the stale reclaim packet and preserves the no-mutation boundary",
);
check(
  preflightAuthority.includes("receipt.maxParallelCalls !== 1") &&
    preflightAuthority.includes("storageEvidence.mediaGenerationAllowed") &&
    preflightAuthority.includes("STORAGE_MEDIA_ADMISSION_PERCENT = 15") &&
    readinessReporter.includes("validateMachinePreflightReceipt") &&
    readinessReporter.includes("grant.maxCalls > 10") &&
    readinessReporter.includes(
      "grant.modelPolicy !== manifest.profile.modelPolicy",
    ) &&
    readinessReporter.includes("grant.runtimeParametersHash") &&
    readinessReporter.includes("stopAt > expiresAt") &&
    readinessReporter.includes("expiresAt > preflightExpiresAt") &&
    readinessReporter.includes("sensitiveIds.some"),
  "readiness reporter enforces bounded storage, concurrency, calls, time, and specialist evidence",
);
check(
  gitignore.includes("planning-with-files/arcanea-visual-assets/") &&
    gitignore.includes("planning-with-files/arcanea-visual-blind-review/"),
  "internal campaign and blind-review binaries are excluded from Git while receipts remain versionable",
);
check(
  gitignore.includes("planning-with-files/arcanea-visual-workbench/index.html"),
  "the unpublished-prompt workbench is excluded from Git and deployment",
);
check(
  workbench.includes("INTERNAL PRODUCTION INSTRUMENT · DO NOT DEPLOY") &&
    workbench.includes('name="robots" content="noindex,nofollow,noarchive"'),
  "internal workbench carries explicit non-deployment and indexing boundaries",
);
check(
  (workbench.match(/data-job-id="ACV-\d{3}"/g) ?? []).length === 100 &&
    (workbench.match(/data-round-section="\d+"/g) ?? []).length === 10,
  "internal workbench renders exactly 100 jobs across ten rounds",
);
check(
  workbench.includes("Open identity variables") &&
    workbench.includes("Required specialist reviews") &&
    workbench.includes("internal only until identity lock"),
  "internal workbench exposes identity readiness and specialist review gates",
);
check(
  (workbench.match(/<section class="provider-lane">/g) ?? []).length === 40 &&
    providerProfileIds.every((profileId) => workbench.includes(profileId)) &&
    workbench.includes("Visual-only execution prompt") &&
    workbench.includes("Provider routing"),
  "internal workbench exposes all forty Round 01 provider execution lanes and hashes",
);
check(
  workbench.includes("Immutable execution manifest") ||
    (workbench.includes("Manifest hash") &&
      workbench.includes("Contract set") &&
      workbench.includes("Manifest status") &&
      workbench.includes("Prompt audit") &&
      workbench.includes("Reference maturity") &&
      workbench.includes("governance constraints withheld beside the prompt") &&
      workbench.includes("immutable predecessors remain historical evidence")),
  "internal workbench exposes current manifest lineage, prompt partition, and reference-maturity evidence",
);
check(
  !workbench.includes("C:\\Users\\") &&
    workbench.includes(
      `Campaign ${campaign.meta.campaignId} · v${campaign.meta.version}`,
    ),
  "internal workbench is version-bound without leaking an absolute machine path",
);

if (failures.length) {
  console.error(
    `Arcanea Living Constellation validation failed (${failures.length}):`,
  );
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Arcanea Living Constellation validation passed: ${checks.length} checks, ${agents.length} agents, ${jobs.length} jobs, ${blocked.length} gated jobs.`,
);
console.log(
  `Agent visual differentiation passed: ${visualPairScores.length} pairings; closest ${closestVisualPair.left}/${closestVisualPair.right} at ${closestVisualPair.score.toFixed(3)} below the 0.180 ceiling.`,
);
