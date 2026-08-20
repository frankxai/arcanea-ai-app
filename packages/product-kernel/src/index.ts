/**
 * @arcanea/product-kernel
 *
 * Provider-neutral policy and evidence contracts for Arcanea product runs.
 * This package owns no model loop, database client, secret value, or UI.
 */

export const DATA_CLASSES = ['public', 'account', 'confidential', 'sensitive'] as const;
export const RISK_CLASSES = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5'] as const;
export const TOOL_EFFECTS = [
  'read',
  'compute',
  'private-write',
  'publish',
  'send',
  'delete',
  'deploy',
  'financial',
  'external-write',
] as const;

export type DataClass = (typeof DATA_CLASSES)[number];
export type RiskClass = (typeof RISK_CLASSES)[number];
export type ToolEffect = (typeof TOOL_EFFECTS)[number];
export type RegionPolicy = 'eu' | 'us' | 'global';
export type ReleaseStage = 'ga' | 'preview' | 'stealth';
export type CredentialMode = 'platform-managed' | 'tenant-byok';
export type Currency = 'EUR' | 'USD';

export interface RunBudget {
  readonly currency: Currency;
  readonly maxCostMicros: number;
  readonly maxInputTokens: number;
  readonly maxOutputTokens: number;
}

export interface ModelPolicy {
  readonly allowedProviders: readonly string[];
  readonly allowedModels?: readonly string[];
  readonly region: RegionPolicy;
  readonly requireZdr: boolean;
  readonly allowPreview: boolean;
  readonly credentialMode: CredentialMode;
}

export interface ToolPolicy {
  readonly allowedTools?: readonly string[];
  readonly deniedTools: readonly string[];
  readonly approvalEffects: readonly ToolEffect[];
  readonly maxCalls: number;
}

export interface RunEnvelope {
  readonly tenantId: string;
  readonly userId: string;
  readonly runId: string;
  readonly purpose: string;
  readonly dataClass: DataClass;
  readonly legalBasisRef?: string;
  readonly consentRef?: string;
  readonly budget: RunBudget;
  readonly modelPolicy: ModelPolicy;
  readonly toolPolicy: ToolPolicy;
  readonly traceparent?: string;
  readonly createdAt: string;
}

export interface ModelCandidate {
  readonly provider: string;
  readonly model: string;
  readonly region: RegionPolicy;
  readonly zdr: boolean;
  readonly releaseStage: ReleaseStage;
  readonly credentialModes: readonly CredentialMode[];
  readonly currency: Currency;
  readonly inputCostMicrosPerMillion: number;
  readonly outputCostMicrosPerMillion: number;
}

export interface ModelRejection {
  readonly provider: string;
  readonly model: string;
  readonly reasons: readonly string[];
}

export interface ModelDecision {
  readonly candidate: ModelCandidate;
  readonly projectedMaxCostMicros: number;
  readonly rejected: readonly ModelRejection[];
}

export interface ToolDescriptor {
  readonly name: string;
  readonly version: string;
  readonly effect: ToolEffect;
  readonly riskClass: RiskClass;
  readonly supportsIdempotency: boolean;
}

export interface ApprovalRecord {
  readonly approvalId: string;
  readonly tenantId: string;
  readonly runId: string;
  readonly toolName: string;
  readonly toolVersion: string;
  readonly scopeHash: string;
  readonly idempotencyKey: string;
  readonly approvedBy: string;
  readonly approvedAt: string;
  readonly expiresAt: string;
  readonly evidenceSignature: string;
}

export interface ToolAuthorizationInput {
  readonly envelope: RunEnvelope;
  readonly tool: ToolDescriptor;
  readonly scopeHash: string;
  readonly idempotencyKey?: string;
  readonly approval?: ApprovalRecord;
  readonly now?: string;
}

export interface ToolAuthorization {
  readonly decision: 'allow' | 'approval-required' | 'deny';
  readonly reason: string;
  readonly approvalId?: string;
}

export interface BaseLedgerEvent {
  readonly eventId: string;
  readonly dedupeKey: string;
  readonly tenantId: string;
  readonly runId: string;
  readonly occurredAt: string;
}

export interface UsageEvent extends BaseLedgerEvent {
  readonly type: 'usage';
  readonly provider: string;
  readonly model: string;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly toolCalls: number;
}

export interface CostEvent extends BaseLedgerEvent {
  readonly type: 'cost';
  readonly currency: Currency;
  readonly amountMicros: number;
  readonly estimated: boolean;
  readonly provider: string;
  readonly model: string;
}

export interface PolicyEvent extends BaseLedgerEvent {
  readonly type: 'policy';
  readonly policy: 'model' | 'tool' | 'budget' | 'data';
  readonly decision: 'allow' | 'deny' | 'approval-required';
  readonly reasonCode: string;
}

export interface ProvenanceEvent extends BaseLedgerEvent {
  readonly type: 'provenance';
  readonly artifactId: string;
  readonly outputHash: string;
  readonly promptHash: string;
  readonly sourceRefs: readonly string[];
  readonly syntheticContentMark: 'applied' | 'not-applicable' | 'failed';
}

export type KernelLedgerEvent = UsageEvent | CostEvent | PolicyEvent | ProvenanceEvent;

export interface RunReceipt {
  readonly tenantId: string;
  readonly runId: string;
  readonly eventCount: number;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly toolCalls: number;
  readonly costMicrosByCurrency: Readonly<Record<string, number>>;
  readonly artifactIds: readonly string[];
}

const riskRank: Readonly<Record<RiskClass, number>> = {
  R0: 0,
  R1: 1,
  R2: 2,
  R3: 3,
  R4: 4,
  R5: 5,
};

const irreversibleEffects = new Set<ToolEffect>([
  'publish',
  'send',
  'delete',
  'deploy',
  'financial',
  'external-write',
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isNonNegativeInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isNonEmptyString);

const isIsoTimestamp = (value: unknown): value is string =>
  isNonEmptyString(value) && Number.isFinite(Date.parse(value));

function requireString(
  record: Record<string, unknown>,
  key: string,
  prefix: string,
  errors: string[],
): void {
  if (!isNonEmptyString(record[key])) errors.push(`${prefix}.${key} must be a non-empty string`);
}

/** Validate an untrusted run envelope at an HTTP, queue, or MCP boundary. */
export function validateRunEnvelope(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ['run envelope must be an object'];

  for (const key of ['tenantId', 'userId', 'runId', 'purpose']) requireString(value, key, 'run', errors);
  if (!DATA_CLASSES.includes(value.dataClass as DataClass)) errors.push('run.dataClass is invalid');
  if (!isIsoTimestamp(value.createdAt)) errors.push('run.createdAt must be an ISO timestamp');

  const budget = value.budget;
  if (!isRecord(budget)) {
    errors.push('run.budget must be an object');
  } else {
    if (!['EUR', 'USD'].includes(String(budget.currency))) errors.push('run.budget.currency is invalid');
    for (const key of ['maxCostMicros', 'maxInputTokens', 'maxOutputTokens']) {
      if (!isNonNegativeInteger(budget[key])) errors.push(`run.budget.${key} must be a non-negative integer`);
    }
    if (budget.maxCostMicros === 0) errors.push('run.budget.maxCostMicros must be greater than zero');
  }

  const modelPolicy = value.modelPolicy;
  if (!isRecord(modelPolicy)) {
    errors.push('run.modelPolicy must be an object');
  } else {
    if (!isStringArray(modelPolicy.allowedProviders) || modelPolicy.allowedProviders.length === 0) {
      errors.push('run.modelPolicy.allowedProviders must be non-empty');
    }
    if (modelPolicy.allowedModels !== undefined && !isStringArray(modelPolicy.allowedModels)) {
      errors.push('run.modelPolicy.allowedModels must be a string array');
    }
    if (!['eu', 'us', 'global'].includes(String(modelPolicy.region))) {
      errors.push('run.modelPolicy.region is invalid');
    }
    if (typeof modelPolicy.requireZdr !== 'boolean') errors.push('run.modelPolicy.requireZdr must be boolean');
    if (typeof modelPolicy.allowPreview !== 'boolean') errors.push('run.modelPolicy.allowPreview must be boolean');
    if (!['platform-managed', 'tenant-byok'].includes(String(modelPolicy.credentialMode))) {
      errors.push('run.modelPolicy.credentialMode is invalid');
    }
  }

  const toolPolicy = value.toolPolicy;
  if (!isRecord(toolPolicy)) {
    errors.push('run.toolPolicy must be an object');
  } else {
    if (toolPolicy.allowedTools !== undefined && !isStringArray(toolPolicy.allowedTools)) {
      errors.push('run.toolPolicy.allowedTools must be a string array');
    }
    if (!isStringArray(toolPolicy.deniedTools)) errors.push('run.toolPolicy.deniedTools must be a string array');
    if (
      !Array.isArray(toolPolicy.approvalEffects) ||
      !toolPolicy.approvalEffects.every((effect) => TOOL_EFFECTS.includes(effect as ToolEffect))
    ) {
      errors.push('run.toolPolicy.approvalEffects contains an invalid effect');
    }
    if (!isNonNegativeInteger(toolPolicy.maxCalls) || toolPolicy.maxCalls === 0) {
      errors.push('run.toolPolicy.maxCalls must be a positive integer');
    }
  }

  if (value.dataClass !== 'public' && !isNonEmptyString(value.legalBasisRef)) {
    errors.push('run.legalBasisRef is required for non-public data');
  }
  if (value.dataClass === 'sensitive') {
    if (!isRecord(modelPolicy) || modelPolicy.region !== 'eu') {
      errors.push('sensitive data requires EU regional policy');
    }
    if (!isRecord(modelPolicy) || modelPolicy.requireZdr !== true) {
      errors.push('sensitive data requires ZDR');
    }
  }

  return errors;
}

export function assertRunEnvelope(value: unknown): asserts value is RunEnvelope {
  const errors = validateRunEnvelope(value);
  if (errors.length > 0) throw new Error(`Invalid run envelope: ${errors.join('; ')}`);
}

function projectedCost(envelope: RunEnvelope, candidate: ModelCandidate): number {
  const input = (envelope.budget.maxInputTokens * candidate.inputCostMicrosPerMillion) / 1_000_000;
  const output = (envelope.budget.maxOutputTokens * candidate.outputCostMicrosPerMillion) / 1_000_000;
  return Math.ceil(input + output);
}

/** Preserve candidate order while proving every fallback obeys the same data policy. */
export function selectModelForRun(
  envelope: RunEnvelope,
  candidates: readonly ModelCandidate[],
): ModelDecision {
  assertRunEnvelope(envelope);
  const rejected: ModelRejection[] = [];

  for (const candidate of candidates) {
    const reasons: string[] = [];
    const projectedMaxCostMicros = projectedCost(envelope, candidate);
    if (!envelope.modelPolicy.allowedProviders.includes(candidate.provider)) reasons.push('provider-not-allowed');
    if (
      envelope.modelPolicy.allowedModels &&
      envelope.modelPolicy.allowedModels.length > 0 &&
      !envelope.modelPolicy.allowedModels.includes(candidate.model)
    ) {
      reasons.push('model-not-allowed');
    }
    if (envelope.modelPolicy.region !== 'global' && candidate.region !== envelope.modelPolicy.region) {
      reasons.push('region-mismatch');
    }
    if (envelope.modelPolicy.requireZdr && !candidate.zdr) reasons.push('zdr-required');
    if (!envelope.modelPolicy.allowPreview && candidate.releaseStage !== 'ga') {
      reasons.push('non-ga-model-forbidden');
    }
    if (!candidate.credentialModes.includes(envelope.modelPolicy.credentialMode)) {
      reasons.push('credential-mode-unsupported');
    }
    if (candidate.currency !== envelope.budget.currency) reasons.push('budget-currency-mismatch');
    if (projectedMaxCostMicros > envelope.budget.maxCostMicros) reasons.push('budget-exceeded');

    if (reasons.length === 0) {
      return Object.freeze({ candidate, projectedMaxCostMicros, rejected: Object.freeze(rejected) });
    }
    rejected.push(Object.freeze({ provider: candidate.provider, model: candidate.model, reasons }));
  }

  const summary = rejected.map((item) => `${item.provider}/${item.model}:${item.reasons.join(',')}`).join('|');
  throw new Error(`MODEL_POLICY_NO_MATCH:${summary || 'no-candidates'}`);
}

function approvalMatches(input: ToolAuthorizationInput, approval: ApprovalRecord, now: string): boolean {
  return (
    approval.tenantId === input.envelope.tenantId &&
    approval.runId === input.envelope.runId &&
    approval.toolName === input.tool.name &&
    approval.toolVersion === input.tool.version &&
    approval.scopeHash === input.scopeHash &&
    approval.idempotencyKey === input.idempotencyKey &&
    isNonEmptyString(approval.approvedBy) &&
    isNonEmptyString(approval.evidenceSignature) &&
    isIsoTimestamp(approval.approvedAt) &&
    isIsoTimestamp(approval.expiresAt) &&
    Date.parse(approval.approvedAt) <= Date.parse(now) &&
    Date.parse(approval.expiresAt) >= Date.parse(now)
  );
}

/** Authorize a typed tool effect. Prompts may guide; this function enforces. */
export function authorizeToolCall(input: ToolAuthorizationInput): ToolAuthorization {
  assertRunEnvelope(input.envelope);
  const { tool, envelope } = input;
  if (envelope.toolPolicy.deniedTools.includes(tool.name)) {
    return { decision: 'deny', reason: 'tool-explicitly-denied' };
  }
  if (
    envelope.toolPolicy.allowedTools &&
    envelope.toolPolicy.allowedTools.length > 0 &&
    !envelope.toolPolicy.allowedTools.includes(tool.name)
  ) {
    return { decision: 'deny', reason: 'tool-not-allowlisted' };
  }
  if (tool.riskClass === 'R5') return { decision: 'deny', reason: 'r5-forbidden' };

  const isExternalEffect = irreversibleEffects.has(tool.effect);
  if (isExternalEffect && !tool.supportsIdempotency) {
    return { decision: 'deny', reason: 'external-effect-must-support-idempotency' };
  }
  if (isExternalEffect && !isNonEmptyString(input.idempotencyKey)) {
    return { decision: 'deny', reason: 'idempotency-key-required' };
  }

  const needsApproval =
    isExternalEffect ||
    riskRank[tool.riskClass] >= 3 ||
    envelope.toolPolicy.approvalEffects.includes(tool.effect);
  if (!needsApproval) return { decision: 'allow', reason: 'policy-allows-bounded-effect' };
  if (!input.approval) return { decision: 'approval-required', reason: 'scoped-approval-missing' };

  const now = input.now ?? new Date().toISOString();
  if (!isIsoTimestamp(now) || !approvalMatches(input, input.approval, now)) {
    return { decision: 'deny', reason: 'approval-invalid-expired-or-out-of-scope' };
  }
  return { decision: 'allow', reason: 'scoped-approval-valid', approvalId: input.approval.approvalId };
}

/** Validate append-only ledger events before a Postgres/event-store adapter accepts them. */
export function validateLedgerEvents(events: readonly KernelLedgerEvent[]): string[] {
  const errors: string[] = [];
  const eventIds = new Set<string>();
  const dedupeKeys = new Set<string>();
  const first = events[0];
  if (!first) return ['ledger batch must be non-empty'];

  for (const [index, event] of events.entries()) {
    const label = `event[${index}]`;
    for (const key of ['eventId', 'dedupeKey', 'tenantId', 'runId'] as const) {
      if (!isNonEmptyString(event[key])) errors.push(`${label}.${key} must be non-empty`);
    }
    if (!isIsoTimestamp(event.occurredAt)) errors.push(`${label}.occurredAt must be an ISO timestamp`);
    if (event.tenantId !== first.tenantId || event.runId !== first.runId) {
      errors.push(`${label} crosses the tenant or run boundary`);
    }
    if (eventIds.has(event.eventId)) errors.push(`${label} duplicates eventId ${event.eventId}`);
    if (dedupeKeys.has(event.dedupeKey)) errors.push(`${label} duplicates dedupeKey ${event.dedupeKey}`);
    eventIds.add(event.eventId);
    dedupeKeys.add(event.dedupeKey);

    if (event.type === 'usage') {
      for (const key of ['inputTokens', 'outputTokens', 'toolCalls'] as const) {
        if (!isNonNegativeInteger(event[key])) errors.push(`${label}.${key} must be a non-negative integer`);
      }
    } else if (event.type === 'cost') {
      if (!isNonNegativeInteger(event.amountMicros)) errors.push(`${label}.amountMicros must be non-negative`);
    } else if (event.type === 'provenance') {
      if (!isNonEmptyString(event.outputHash) || !isNonEmptyString(event.promptHash)) {
        errors.push(`${label} requires outputHash and promptHash`);
      }
    }
  }
  return errors;
}

export function createRunReceipt(events: readonly KernelLedgerEvent[]): RunReceipt {
  const errors = validateLedgerEvents(events);
  if (errors.length > 0) throw new Error(`Invalid ledger batch: ${errors.join('; ')}`);
  const first = events[0];
  if (!first) throw new Error('Invalid ledger batch: ledger batch must be non-empty');

  let inputTokens = 0;
  let outputTokens = 0;
  let toolCalls = 0;
  const costMicrosByCurrency: Record<string, number> = {};
  const artifactIds: string[] = [];
  for (const event of events) {
    if (event.type === 'usage') {
      inputTokens += event.inputTokens;
      outputTokens += event.outputTokens;
      toolCalls += event.toolCalls;
    } else if (event.type === 'cost') {
      costMicrosByCurrency[event.currency] = (costMicrosByCurrency[event.currency] ?? 0) + event.amountMicros;
    } else if (event.type === 'provenance') {
      artifactIds.push(event.artifactId);
    }
  }

  return Object.freeze({
    tenantId: first.tenantId,
    runId: first.runId,
    eventCount: events.length,
    inputTokens,
    outputTokens,
    toolCalls,
    costMicrosByCurrency: Object.freeze(costMicrosByCurrency),
    artifactIds: Object.freeze(artifactIds),
  });
}

/** @deprecated Prefer a RunEnvelope plus an explicit runtime adapter. */
export type AIConfig = { apiKey: string; model: string };

/** @deprecated Compatibility shim for the original placeholder export. */
export const aiClient = (): void => {
  console.log('AI Core initialized');
};
