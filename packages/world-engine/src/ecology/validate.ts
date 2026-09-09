import {
  ECOLOGY_ELEMENTS,
  ECOLOGY_GATES,
  ECOLOGY_KINDS,
  ECOLOGY_SCHEMA_VERSION,
  type EcologyEntry,
  type EcologyProposalInput,
  type EcologyValidationIssue,
  type EcologyValidationMode,
  type EcologyValidationResult,
  type EcosystemGraphReport,
  type TrophicRole,
} from "./types.js";

const ENTRY_ID = /^ECO-[A-Z0-9][A-Z0-9-]{2,31}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOCK_APPROVERS = new Set(["Frank Riemer", "FrankX"]);
const SOURCE_TYPES = new Set(["locked-canon", "staging-lore", "creator-approval", "research", "inspiration", "generated"]);
const CLAIM_SOURCE_TYPES = new Set(["locked-canon", "staging-lore", "creator-approval", "research"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function push(
  list: EcologyValidationIssue[],
  path: string,
  code: string,
  message: string,
  severity: EcologyValidationIssue["severity"] = "error",
): void {
  list.push({ path, code, message, severity });
}

function text(value: unknown): value is string {
  return typeof value === "string" && value.trim().length >= 3;
}

function asRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function validateRequiredText(
  record: Record<string, unknown>,
  keys: string[],
  basePath: string,
  errors: EcologyValidationIssue[],
): void {
  for (const key of keys) {
    if (!text(record[key])) {
      push(errors, `${basePath}.${key}`, "required_text", `${key} must be concrete, non-empty text.`);
    }
  }
}

/**
 * Semantic validator for the Ecology contract.
 *
 * JSON Schema remains the structural interchange authority. This zero-dependency
 * validator protects the Arcanea-specific invariants that JSON Schema cannot
 * express cleanly and can run in both browser and server consumers.
 */
export function validateEcologyEntry(
  input: unknown,
  mode: EcologyValidationMode = "draft",
): EcologyValidationResult {
  const errors: EcologyValidationIssue[] = [];
  const warnings: EcologyValidationIssue[] = [];

  if (!isRecord(input)) {
    push(errors, "$", "not_object", "EcologyEntry must be an object.");
    return { valid: false, errors, warnings };
  }

  if (input.schemaVersion !== ECOLOGY_SCHEMA_VERSION) {
    push(errors, "$.schemaVersion", "schema_version", `schemaVersion must be ${ECOLOGY_SCHEMA_VERSION}.`);
  }
  if (typeof input.id !== "string" || !ENTRY_ID.test(input.id)) {
    push(errors, "$.id", "entry_id", "id must match ECO-[A-Z0-9-], for example ECO-CHOIRHEART-ROSE.");
  }
  if (typeof input.slug !== "string" || !SLUG.test(input.slug)) {
    push(errors, "$.slug", "slug", "slug must be lowercase kebab-case.");
  }
  if (!text(input.name)) push(errors, "$.name", "name", "name is required.");
  if (!ECOLOGY_KINDS.includes(input.kind as never)) {
    push(errors, "$.kind", "kind", `kind must be one of ${ECOLOGY_KINDS.join(", ")}.`);
  }
  if (!ECOLOGY_GATES.includes(input.gate as never)) {
    push(errors, "$.gate", "gate", "gate must use the canonical Ten Gates vocabulary.");
  }

  const elements = asArray(input.elementAffinity);
  if (elements.length < 1 || elements.length > 2) {
    push(errors, "$.elementAffinity", "element_count", "Use one or two of the five canonical elements.");
  }
  for (const [index, element] of elements.entries()) {
    if (!ECOLOGY_ELEMENTS.includes(element as never)) {
      push(errors, `$.elementAffinity[${index}]`, "element", `${String(element)} is not a canonical ecology element.`);
    }
  }
  if (new Set(elements).size !== elements.length) {
    push(errors, "$.elementAffinity", "duplicate_element", "elementAffinity cannot contain duplicates.");
  }

  const origin = asRecord(input.origin);
  validateRequiredText(origin, ["worldId", "worldName", "biome"], "$.origin", errors);

  const taxonomy = asRecord(input.taxonomy);
  validateRequiredText(
    taxonomy,
    ["morphology", "bodySubstrate", "silhouetteThesis", "scaleClass"],
    "$.taxonomy",
    errors,
  );
  const dimensions = asRecord(taxonomy.dimensions);
  const numericDimensions = [dimensions.heightM, dimensions.spanM, dimensions.massKg].filter(
    (value) => typeof value === "number" && value > 0,
  );
  if (numericDimensions.length === 0 && !text(dimensions.description)) {
    push(errors, "$.taxonomy.dimensions", "dimensions", "Provide a positive physical dimension or concrete qualitative scale evidence.");
  }
  const adaptations = asArray(taxonomy.structuralAdaptations).filter(text);
  if (adaptations.length === 0) {
    push(errors, "$.taxonomy.structuralAdaptations", "structure", "Name at least one load-bearing or survival adaptation.");
  }
  const maximumLinearDimension = Math.max(
    typeof dimensions.heightM === "number" ? dimensions.heightM : 0,
    typeof dimensions.spanM === "number" ? dimensions.spanM : 0,
  );
  if (maximumLinearDimension >= 10 && adaptations.length < 2) {
    push(
      mode === "publish" ? errors : warnings,
      "$.taxonomy.structuralAdaptations",
      "giant_structure",
      "Organisms ten metres or larger need at least two explicit structural adaptations.",
      mode === "publish" ? "error" : "warning",
    );
  }
  if (asArray(taxonomy.sensesOrTropisms).filter(text).length === 0) {
    push(errors, "$.taxonomy.sensesOrTropisms", "sensing", "Define at least one sense or tropism.");
  }

  const lifeCycle = asRecord(input.lifeCycle);
  validateRequiredText(
    lifeCycle,
    ["origin", "reproduction", "growth", "maturity", "senescence", "deathAndReturn"],
    "$.lifeCycle",
    errors,
  );

  const energy = asRecord(input.energy);
  validateRequiredText(
    energy,
    ["primarySource", "intake", "storage", "expenditure", "recovery", "failureMode"],
    "$.energy",
    errors,
  );
  if (typeof energy.primarySource === "string" && /^(magic|energy|essence)$/i.test(energy.primarySource.trim())) {
    push(
      warnings,
      "$.energy.primarySource",
      "vague_energy",
      "Name a specific input and conversion mechanism; generic magic or energy is not causal enough.",
      "warning",
    );
  }

  if (input.radiance !== undefined) {
    const radiance = asRecord(input.radiance);
    validateRequiredText(
      radiance,
      ["mechanism", "carrier", "trigger", "appearance", "information", "cost", "failureMode"],
      "$.radiance",
      errors,
    );
    if (radiance.cost === radiance.information) {
      push(warnings, "$.radiance.cost", "radiance_cost", "Radiance cost should be an expenditure, not a restatement of its signal.", "warning");
    }
  }

  const ecology = asRecord(input.ecology);
  validateRequiredText(ecology, ["niche", "trophicRole", "habitatFunction"], "$.ecology", errors);
  if (typeof ecology.keystone !== "boolean") {
    push(errors, "$.ecology.keystone", "keystone", "keystone must be true or false.");
  }
  const relationships = asArray(ecology.relationships);
  if (relationships.length < 3) {
    push(
      mode === "publish" ? errors : warnings,
      "$.ecology.relationships",
      "relationship_count",
      "Review-ready entries need at least three consequential ecological relationships.",
      mode === "publish" ? "error" : "warning",
    );
  }
  const targetIds = new Set<string>();
  for (const [index, rawRelationship] of relationships.entries()) {
    const relationship = asRecord(rawRelationship);
    const path = `$.ecology.relationships[${index}]`;
    validateRequiredText(relationship, ["targetId", "type", "direction", "effect", "description", "ifBroken"], path, errors);
    if (typeof relationship.targetId === "string") {
      if (!ENTRY_ID.test(relationship.targetId)) {
        push(errors, `${path}.targetId`, "relationship_target", "Relationship targetId must be a valid EcologyEntry id.");
      }
      if (relationship.targetId === input.id) {
        push(errors, `${path}.targetId`, "self_relationship", "An entry cannot satisfy its own ecology relationship.");
      }
      if (targetIds.has(relationship.targetId)) {
        push(warnings, `${path}.targetId`, "duplicate_target", "Multiple edges to one target need a clear, distinct ecological function.", "warning");
      }
      targetIds.add(relationship.targetId);
    }
  }
  const removal = asRecord(ecology.removalConsequence);
  validateRequiredText(removal, ["firstOrder", "secondOrder", "cultural"], "$.ecology.removalConsequence", errors);

  const covenant = asRecord(input.covenant);
  validateRequiredText(covenant, ["gift", "cost", "balance", "taboo", "breachConsequence"], "$.covenant", errors);
  if (covenant.gift === covenant.cost) {
    push(warnings, "$.covenant", "covenant_distinction", "Gift and cost should describe different sides of the exchange.", "warning");
  }

  const narrative = asRecord(input.narrative);
  validateRequiredText(
    narrative,
    ["signatureBehavior", "sensorySignature", "encounter", "choicePressure"],
    "$.narrative",
    errors,
  );
  if (asArray(narrative.storyUses).filter(text).length < 2) {
    push(errors, "$.narrative.storyUses", "story_uses", "Provide at least two distinct story uses.");
  }

  const visual = asRecord(input.visual);
  validateRequiredText(
    visual,
    ["spark", "visualDNA", "silhouetteTest", "lightBehavior", "scaleEvidence", "camera", "renderIntent"],
    "$.visual",
    errors,
  );
  if (asArray(visual.shapePalettes).length < 1 || asArray(visual.shapePalettes).length > 2) {
    push(errors, "$.visual.shapePalettes", "shape_palette", "Choose one or two APL Shape palettes.");
  }
  if (asArray(visual.sharpen).filter(text).length < 3) {
    push(errors, "$.visual.sharpen", "sharpen", "Name at least three visual defaults to remove.");
  }
  if (asArray(visual.materialLanguage).filter(text).length < 2) {
    push(errors, "$.visual.materialLanguage", "material_language", "Define at least two tactile materials or living surfaces.");
  }

  const provenance = asRecord(input.provenance);
  const sources = asArray(provenance.sources).map(asRecord);
  if (sources.length < 1) {
    push(errors, "$.provenance.sources", "provenance", "At least one canon, research, inspiration, or generated source is required.");
  }
  const sourcesById = new Map<string, Record<string, unknown>>();
  for (const [index, source] of sources.entries()) {
    validateRequiredText(source, ["id", "type", "reference", "note"], `$.provenance.sources[${index}]`, errors);
    if (typeof source.type !== "string" || !SOURCE_TYPES.has(source.type)) {
      push(errors, `$.provenance.sources[${index}].type`, "source_type", "Source type must use the Ecology provenance vocabulary.");
    }
    if (typeof source.id === "string") {
      if (sourcesById.has(source.id)) {
        push(errors, `$.provenance.sources[${index}].id`, "duplicate_source", "Source ids must be unique within an entry.");
      }
      sourcesById.set(source.id, source);
    }
  }

  const sourceClaims = asArray(provenance.sourceClaims).map(asRecord);
  const declaredCanonState = asRecord(input.canon).state;
  if (sourceClaims.length < 1 && declaredCanonState !== "proposal") {
    push(
      errors,
      "$.provenance.sourceClaims",
      "source_claims",
      "Staging and locked entries require at least one explicit, non-generated source claim. Fully original proposals may use an empty sourceClaims array.",
    );
  }
  const claimIds = new Set<string>();
  for (const [index, claim] of sourceClaims.entries()) {
    const path = `$.provenance.sourceClaims[${index}]`;
    validateRequiredText(claim, ["id", "claim"], path, errors);
    if (typeof claim.id === "string") {
      if (claimIds.has(claim.id)) {
        push(errors, `${path}.id`, "duplicate_claim", "Source claim ids must be unique within an entry.");
      }
      claimIds.add(claim.id);
    }
    const sourceIds = asArray(claim.sourceIds);
    if (sourceIds.length < 1) {
      push(errors, `${path}.sourceIds`, "claim_source", "Every source claim must cite at least one source id.");
    }
    for (const [sourceIndex, sourceId] of sourceIds.entries()) {
      const source = typeof sourceId === "string" ? sourcesById.get(sourceId) : undefined;
      if (!source) {
        push(errors, `${path}.sourceIds[${sourceIndex}]`, "unknown_source", `Source claim cites unknown source ${String(sourceId)}.`);
      } else if (typeof source.type !== "string" || !CLAIM_SOURCE_TYPES.has(source.type)) {
        push(errors, `${path}.sourceIds[${sourceIndex}]`, "generated_claim_source", "Only canon, staging, research, or explicit creator-approval sources may substantiate source claims; inspiration and generated material remain contextual only.");
      }
    }
    const fieldPaths = asArray(claim.fieldPaths);
    if (fieldPaths.length < 1 || fieldPaths.some((fieldPath) => typeof fieldPath !== "string" || !fieldPath.startsWith("/"))) {
      push(errors, `${path}.fieldPaths`, "claim_field_paths", "Every source claim must identify one or more entry fields with slash-prefixed paths.");
    }
  }

  const proposalMechanics = asArray(provenance.proposalMechanics).map(asRecord);
  const mechanicIds = new Set<string>();
  for (const [index, mechanic] of proposalMechanics.entries()) {
    const path = `$.provenance.proposalMechanics[${index}]`;
    validateRequiredText(mechanic, ["id", "mechanic", "rationale"], path, errors);
    if (typeof mechanic.id === "string") {
      if (mechanicIds.has(mechanic.id)) {
        push(errors, `${path}.id`, "duplicate_mechanic", "Proposal mechanic ids must be unique within an entry.");
      }
      mechanicIds.add(mechanic.id);
    }
    if (mechanic.state !== "proposal") {
      push(errors, `${path}.state`, "mechanic_state", "Invented or inferred mechanisms must remain proposal-state.");
    }
    const fieldPaths = asArray(mechanic.fieldPaths);
    if (fieldPaths.length < 1 || fieldPaths.some((fieldPath) => typeof fieldPath !== "string" || !fieldPath.startsWith("/"))) {
      push(errors, `${path}.fieldPaths`, "mechanic_field_paths", "Every proposal mechanic must identify the entry fields it introduces or changes.");
    }
    for (const [claimIndex, claimId] of asArray(mechanic.supportedByClaimIds).entries()) {
      if (typeof claimId !== "string" || !claimIds.has(claimId)) {
        push(errors, `${path}.supportedByClaimIds[${claimIndex}]`, "unknown_claim", `Proposal mechanic cites unknown source claim ${String(claimId)}.`);
      }
    }
  }
  if (sources.some((source) => source.type === "generated") && proposalMechanics.length === 0) {
    push(errors, "$.provenance.proposalMechanics", "generated_without_proposal", "Generated material is present, but no proposal mechanics record what it introduced.");
  }
  if (asArray(provenance.originalityNotes).filter(text).length < 1) {
    push(errors, "$.provenance.originalityNotes", "originality", "Explain what makes the organism original rather than derivative.");
  }

  const canon = asRecord(input.canon);
  if (!(["proposal", "staging", "locked"] as unknown[]).includes(canon.state)) {
    push(errors, "$.canon.state", "canon_state", "canon.state must be proposal, staging, or locked.");
  }
  if (asArray(canon.anchors).filter(text).length < 1) {
    push(errors, "$.canon.anchors", "canon_anchor", "At least one canon or staging anchor is required.");
  }
  if (!text(canon.note)) push(errors, "$.canon.note", "canon_note", "Explain how this entry relates to its anchors.");
  if (proposalMechanics.length > 0 && canon.state !== "proposal") {
    push(
      errors,
      "$.canon.state",
      "proposal_mechanics_not_promoted",
      "An entry containing proposalMechanics must remain proposal-state. Record an explicit human approval artifact as a source before reclassifying accepted mechanics as source claims.",
    );
  }
  if (canon.state === "locked") {
    if (typeof canon.approvedBy !== "string" || !LOCK_APPROVERS.has(canon.approvedBy)) {
      push(errors, "$.canon.approvedBy", "lock_authority", "Only an explicit Frank Riemer / FrankX decision may lock new Arcanea canon.");
    }
    if (typeof canon.approvedAt !== "string" || Number.isNaN(Date.parse(canon.approvedAt))) {
      push(errors, "$.canon.approvedAt", "lock_timestamp", "Locked canon requires a valid approval timestamp.");
    }
    const approvalSourceIds = new Set(
      sources.filter((source) => source.type === "creator-approval" && typeof source.id === "string").map((source) => source.id as string),
    );
    const approvalClaim = sourceClaims.some((claim) =>
      asArray(claim.sourceIds).some((sourceId) => typeof sourceId === "string" && approvalSourceIds.has(sourceId)),
    );
    if (approvalSourceIds.size === 0 || !approvalClaim) {
      push(errors, "$.provenance", "lock_receipt", "Locked canon requires a creator-approval source and a source claim citing that approval receipt.");
    }
  } else if (canon.approvedBy !== undefined || canon.approvedAt !== undefined) {
    push(errors, "$.canon", "premature_approval", "Proposal and staging entries cannot carry locked-canon approval fields.");
  }

  const review = asRecord(input.review);
  const reviewStates = ["draft", "planned", "generating", "review", "approved", "revise", "rejected", "published"];
  if (typeof review.state !== "string" || !reviewStates.includes(review.state)) {
    push(errors, "$.review.state", "review_state", "review.state must use the Ecology review vocabulary.");
  }
  if (!Array.isArray(review.notes)) push(errors, "$.review.notes", "review_notes", "review.notes must be an array.");
  if (review.score !== null && review.score !== undefined) {
    const score = asRecord(review.score);
    const scoreKeys = [
      "biologicalCoherence",
      "ecologicalClosure",
      "covenantLogic",
      "originality",
      "canonAlignment",
      "visualReadiness",
    ];
    let computedTotal = 0;
    for (const key of scoreKeys) {
      const value = score[key];
      if (!Number.isInteger(value) || (value as number) < 0 || (value as number) > 5) {
        push(errors, `$.review.score.${key}`, "quality_score", `${key} must be an integer from 0 to 5.`);
      } else {
        computedTotal += value as number;
      }
    }
    if (score.total !== computedTotal) {
      push(errors, "$.review.score.total", "quality_total", `Review total must equal its six dimensions (${computedTotal}).`);
    }
    const expectedVerdict = computedTotal >= 26 ? "ship" : computedTotal >= 22 ? "iterate" : "restart";
    if (score.verdict !== expectedVerdict) {
      push(errors, "$.review.score.verdict", "quality_verdict", `A total of ${computedTotal} requires verdict ${expectedVerdict}.`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function assertValidEcologyEntry(
  input: unknown,
  mode: EcologyValidationMode = "publish",
): asserts input is EcologyEntry {
  const result = validateEcologyEntry(input, mode);
  if (!result.valid) {
    const detail = result.errors.map((issue) => `${issue.path} [${issue.code}]: ${issue.message}`).join("\n");
    throw new Error(`Invalid Arcanea EcologyEntry:\n${detail}`);
  }
}

export function createEcologyProposal(input: EcologyProposalInput): EcologyEntry {
  const { canonAnchors, canonNote, media, ...entry } = input;
  return {
    ...entry,
    schemaVersion: ECOLOGY_SCHEMA_VERSION,
    canon: {
      state: "proposal",
      anchors: canonAnchors,
      note: canonNote ?? "Original ecology proposal. It is not locked canon until explicit human acceptance.",
    },
    review: {
      state: "draft",
      score: null,
      notes: [],
    },
    media: media ?? [],
  };
}

export function analyzeEcosystem(entries: EcologyEntry[]): EcosystemGraphReport {
  const entryIds = new Set(entries.map((entry) => entry.id));
  const incoming = new Map(entries.map((entry) => [entry.id, 0]));
  const danglingTargetIds = new Set<string>();
  const roles = new Set<TrophicRole>();
  let edgeCount = 0;

  for (const entry of entries) {
    roles.add(entry.ecology.trophicRole);
    for (const relationship of entry.ecology.relationships) {
      edgeCount += 1;
      if (entryIds.has(relationship.targetId)) {
        incoming.set(relationship.targetId, (incoming.get(relationship.targetId) ?? 0) + 1);
      } else {
        danglingTargetIds.add(relationship.targetId);
      }
    }
  }

  const isolatedEntryIds = entries
    .filter((entry) => entry.ecology.relationships.length === 0 && (incoming.get(entry.id) ?? 0) === 0)
    .map((entry) => entry.id);
  const missingFunctions: string[] = [];
  if (!["primary-producer", "mixed"].some((role) => roles.has(role as TrophicRole))) {
    missingFunctions.push("primary energy producer");
  }
  if (!["decomposer", "detritivore", "mixed"].some((role) => roles.has(role as TrophicRole))) {
    missingFunctions.push("matter-return path");
  }
  if (!["consumer", "apex-consumer", "parasite", "mixed"].some((role) => roles.has(role as TrophicRole))) {
    missingFunctions.push("population control");
  }

  return {
    entryIds: [...entryIds],
    edgeCount,
    danglingTargetIds: [...danglingTargetIds],
    isolatedEntryIds,
    keystoneEntryIds: entries.filter((entry) => entry.ecology.keystone).map((entry) => entry.id),
    trophicRolesPresent: [...roles],
    missingFunctions,
  };
}
