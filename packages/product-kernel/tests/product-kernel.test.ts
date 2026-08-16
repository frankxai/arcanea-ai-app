import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  authorizeToolCall,
  createRunReceipt,
  selectModelForRun,
  validateLedgerEvents,
  validateRunEnvelope,
  type ApprovalRecord,
  type KernelLedgerEvent,
  type ModelCandidate,
  type RunEnvelope,
  type ToolDescriptor,
} from '../src/index.ts';

const baseEnvelope: RunEnvelope = {
  tenantId: 'tenant_arcanea',
  userId: 'user_01',
  runId: 'run_01',
  purpose: 'Generate an editable campaign draft',
  dataClass: 'confidential',
  legalBasisRef: 'contract:creator-workspace:v1',
  budget: {
    currency: 'EUR',
    maxCostMicros: 15_000_000,
    maxInputTokens: 20_000,
    maxOutputTokens: 5_000,
  },
  modelPolicy: {
    allowedProviders: ['anthropic', 'openai'],
    allowedModels: ['claude-sonnet', 'gpt-5'],
    region: 'eu',
    requireZdr: true,
    allowPreview: false,
    credentialMode: 'tenant-byok',
  },
  toolPolicy: {
    allowedTools: ['draft_campaign', 'publish_campaign'],
    deniedTools: ['delete_account'],
    approvalEffects: ['private-write'],
    maxCalls: 12,
  },
  createdAt: '2026-08-16T04:00:00.000Z',
};

const compliantModel: ModelCandidate = {
  provider: 'anthropic',
  model: 'claude-sonnet',
  region: 'eu',
  zdr: true,
  releaseStage: 'ga',
  credentialModes: ['tenant-byok', 'platform-managed'],
  currency: 'EUR',
  inputCostMicrosPerMillion: 3_000_000,
  outputCostMicrosPerMillion: 15_000_000,
};

test('validates the canonical tenant-scoped run envelope', () => {
  assert.deepEqual(validateRunEnvelope(baseEnvelope), []);
});

test('sensitive data fails closed without legal basis, EU routing and ZDR', () => {
  const { legalBasisRef: _omitted, ...withoutLegalBasis } = baseEnvelope;
  const envelope = {
    ...withoutLegalBasis,
    dataClass: 'sensitive',
    modelPolicy: { ...baseEnvelope.modelPolicy, region: 'global', requireZdr: false },
  };
  const errors = validateRunEnvelope(envelope);
  assert.ok(errors.some((error) => error.includes('legalBasisRef')));
  assert.ok(errors.some((error) => error.includes('EU regional policy')));
  assert.ok(errors.some((error) => error.includes('requires ZDR')));
});

test('model fallback cannot silently cross region, ZDR or release-stage policy', () => {
  const unsafeRegion = { ...compliantModel, provider: 'openai', model: 'gpt-5', region: 'us' as const };
  const preview = {
    ...compliantModel,
    provider: 'openai',
    model: 'gpt-5',
    releaseStage: 'preview' as const,
  };
  const decision = selectModelForRun(baseEnvelope, [unsafeRegion, preview, compliantModel]);
  assert.equal(decision.candidate.provider, 'anthropic');
  assert.deepEqual(decision.rejected[0]?.reasons, ['region-mismatch']);
  assert.deepEqual(decision.rejected[1]?.reasons, ['non-ga-model-forbidden']);
  assert.ok(decision.projectedMaxCostMicros <= baseEnvelope.budget.maxCostMicros);
});

test('model selection rejects every candidate over the hard run budget', () => {
  const expensive = {
    ...compliantModel,
    inputCostMicrosPerMillion: 1_000_000_000,
    outputCostMicrosPerMillion: 1_000_000_000,
  };
  assert.throws(() => selectModelForRun(baseEnvelope, [expensive]), /budget-exceeded/);
});

const publishTool: ToolDescriptor = {
  name: 'publish_campaign',
  version: '1.0.0',
  effect: 'publish',
  riskClass: 'R2',
  supportsIdempotency: true,
};

const approval: ApprovalRecord = {
  approvalId: 'approval_01',
  tenantId: baseEnvelope.tenantId,
  runId: baseEnvelope.runId,
  toolName: publishTool.name,
  toolVersion: publishTool.version,
  scopeHash: 'sha256:normalized-args',
  idempotencyKey: 'idem:publish:01',
  approvedBy: 'user_01',
  approvedAt: '2026-08-16T04:01:00.000Z',
  expiresAt: '2026-08-16T04:06:00.000Z',
  evidenceSignature: 'hmac:approval-receipt',
};

test('public effects require idempotency and a fresh, exact, signed approval', () => {
  assert.deepEqual(
    authorizeToolCall({ envelope: baseEnvelope, tool: publishTool, scopeHash: approval.scopeHash }),
    { decision: 'deny', reason: 'idempotency-key-required' },
  );
  assert.deepEqual(
    authorizeToolCall({
      envelope: baseEnvelope,
      tool: publishTool,
      scopeHash: approval.scopeHash,
      idempotencyKey: approval.idempotencyKey,
    }),
    { decision: 'approval-required', reason: 'scoped-approval-missing' },
  );
  assert.deepEqual(
    authorizeToolCall({
      envelope: baseEnvelope,
      tool: publishTool,
      scopeHash: approval.scopeHash,
      idempotencyKey: approval.idempotencyKey,
      approval,
      now: '2026-08-16T04:02:00.000Z',
    }),
    { decision: 'allow', reason: 'scoped-approval-valid', approvalId: 'approval_01' },
  );
});

test('an approval cannot be replayed across arguments, versions, runs or expiry', () => {
  const expired = authorizeToolCall({
    envelope: baseEnvelope,
    tool: { ...publishTool, version: '1.0.1' },
    scopeHash: 'sha256:different-args',
    idempotencyKey: approval.idempotencyKey,
    approval,
    now: '2026-08-16T04:07:00.000Z',
  });
  assert.deepEqual(expired, { decision: 'deny', reason: 'approval-invalid-expired-or-out-of-scope' });
});

test('R5 tools are denied even when an approval is supplied', () => {
  const decision = authorizeToolCall({
    envelope: baseEnvelope,
    tool: { ...publishTool, riskClass: 'R5' },
    scopeHash: approval.scopeHash,
    idempotencyKey: approval.idempotencyKey,
    approval,
    now: '2026-08-16T04:02:00.000Z',
  });
  assert.deepEqual(decision, { decision: 'deny', reason: 'r5-forbidden' });
});

const events: KernelLedgerEvent[] = [
  {
    type: 'usage',
    eventId: 'event_usage_01',
    dedupeKey: 'run_01:usage:anthropic:claude-sonnet:1',
    tenantId: baseEnvelope.tenantId,
    runId: baseEnvelope.runId,
    occurredAt: '2026-08-16T04:03:00.000Z',
    provider: 'anthropic',
    model: 'claude-sonnet',
    inputTokens: 1200,
    outputTokens: 450,
    toolCalls: 2,
  },
  {
    type: 'cost',
    eventId: 'event_cost_01',
    dedupeKey: 'run_01:cost:anthropic:claude-sonnet:1',
    tenantId: baseEnvelope.tenantId,
    runId: baseEnvelope.runId,
    occurredAt: '2026-08-16T04:03:01.000Z',
    currency: 'EUR',
    amountMicros: 10_350,
    estimated: false,
    provider: 'anthropic',
    model: 'claude-sonnet',
  },
  {
    type: 'provenance',
    eventId: 'event_provenance_01',
    dedupeKey: 'run_01:artifact:campaign_01',
    tenantId: baseEnvelope.tenantId,
    runId: baseEnvelope.runId,
    occurredAt: '2026-08-16T04:03:02.000Z',
    artifactId: 'campaign_01',
    outputHash: 'sha256:output',
    promptHash: 'sha256:prompt',
    sourceRefs: ['brief:01'],
    syntheticContentMark: 'applied',
  },
];

test('append-only events produce a deterministic usage, cost and provenance receipt', () => {
  assert.deepEqual(validateLedgerEvents(events), []);
  assert.deepEqual(createRunReceipt(events), {
    tenantId: baseEnvelope.tenantId,
    runId: baseEnvelope.runId,
    eventCount: 3,
    inputTokens: 1200,
    outputTokens: 450,
    toolCalls: 2,
    costMicrosByCurrency: { EUR: 10_350 },
    artifactIds: ['campaign_01'],
  });
});

test('the ledger rejects cross-tenant and duplicate evidence', () => {
  const broken = events.map((event, index) =>
    index === 1
      ? { ...event, tenantId: 'tenant_other', dedupeKey: events[0]?.dedupeKey ?? '' }
      : event,
  );
  const errors = validateLedgerEvents(broken);
  assert.ok(errors.some((error) => error.includes('crosses the tenant or run boundary')));
  assert.ok(errors.some((error) => error.includes('duplicates dedupeKey')));
});
