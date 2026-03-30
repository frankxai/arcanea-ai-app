import { strict as assert } from 'node:assert';
import { buildProjectCompletionSummary, buildProjectStepGuidance, deriveProjectProgress } from '../progress';
import type { ProjectWorkspaceSnapshot } from '../server';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed += 1;
    console.log(`PASS  ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${name}`);
    console.error(error);
  }
}

function createWorkspace(overrides?: Partial<ProjectWorkspaceSnapshot>): ProjectWorkspaceSnapshot {
  return {
    project: {
      id: 'project_1',
      title: 'Atlas',
      description: 'A floating-cities world',
      goal: 'Ship a worldbuilding package',
      createdAt: '2026-03-30T10:00:00.000Z',
      updatedAt: '2026-03-30T10:00:00.000Z',
    },
    sessions: [
      {
        id: 'session_1',
        title: 'Atlas planning',
        updatedAt: '2026-03-30T10:05:00.000Z',
        luminorId: 'alera',
        modelId: 'claude-sonnet-4',
      },
    ],
    creations: [
      {
        id: 'creation_1',
        title: 'Atlas brief',
        type: 'text',
        status: 'draft',
        thumbnailUrl: null,
        createdAt: '2026-03-30T10:10:00.000Z',
        sourceSessionId: 'session_1',
      },
    ],
    memories: [
      {
        id: 'memory_1',
        content: 'Atlas runs on harmonic engines.',
        createdAt: '2026-03-30T10:15:00.000Z',
      },
    ],
    stats: {
      sessionCount: 1,
      creationCount: 1,
      memoryCount: 1,
    },
    ...overrides,
  };
}

test('deriveProjectProgress reports a complete workspace when all continuity layers exist', () => {
  const progress = deriveProjectProgress(createWorkspace());
  assert.equal(progress.status, 'complete');
  assert.equal(progress.completionPercent, 100);
  assert.equal(progress.completedCount, 5);
});

test('deriveProjectProgress recommends the first missing continuity layer', () => {
  const progress = deriveProjectProgress(createWorkspace({
    creations: [],
    memories: [],
    stats: {
      sessionCount: 1,
      creationCount: 0,
      memoryCount: 0,
    },
  }));

  assert.equal(progress.status, 'in_progress');
  assert.equal(progress.currentStep, 3);
  assert.equal(progress.nextRecommendedAction, 'Save at least one creation into this project.');
});

test('buildProjectStepGuidance folds user input into the guidance message', () => {
  const guidance = buildProjectStepGuidance(createWorkspace({
    creations: [],
    memories: [],
    stats: {
      sessionCount: 1,
      creationCount: 0,
      memoryCount: 0,
    },
  }), 'prepare a launch pack');

  assert.equal(guidance.message.includes('prepare a launch pack'), true);
  assert.equal(guidance.currentStep, 3);
});

test('buildProjectCompletionSummary returns in_progress when provenance is missing', () => {
  const completion = buildProjectCompletionSummary(createWorkspace({
    creations: [
      {
        id: 'creation_1',
        title: 'Atlas brief',
        type: 'text',
        status: 'draft',
        thumbnailUrl: null,
        createdAt: '2026-03-30T10:10:00.000Z',
        sourceSessionId: null,
      },
    ],
  }));

  assert.equal(completion.ready, false);
  assert.equal(completion.status, 'in_progress');
  assert.equal(completion.summary.includes('link artifacts to source sessions'), true);
});

if (failed > 0) {
  console.error(`\n${failed} project progress test(s) failed`);
  process.exit(1);
}

console.log(`\n${passed} project progress test(s) passed`);
