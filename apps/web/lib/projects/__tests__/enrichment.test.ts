import { strict as assert } from 'node:assert';
import {
  buildProjectEnrichmentTask,
  buildProjectGraphView,
  enrichProjectGraph,
  evaluateProjectWorkspace,
} from '../enrichment';
import type { ProjectGraphSummaryRecord, ProjectWorkspaceSnapshot } from '../server';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed += 1;
    console.log(`PASS  ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${name}`);
    console.error(error);
  }
}

function createSnapshot(overrides?: Partial<ProjectWorkspaceSnapshot>): ProjectWorkspaceSnapshot {
  return {
    project: {
      id: 'project_1',
      title: 'Atlas Worldbuilding',
      description: 'A science-fantasy setting with floating cities and relic engines.',
      goal: 'Turn the Atlas setting into a playable story world.',
      createdAt: '2026-03-29T10:00:00.000Z',
      updatedAt: '2026-03-29T10:00:00.000Z',
    },
    sessions: [
      {
        id: 'session_1',
        title: 'Atlas lore session',
        updatedAt: '2026-03-29T10:10:00.000Z',
        luminorId: 'alera',
        modelId: 'claude-sonnet-4',
      },
      {
        id: 'session_2',
        title: 'Relic engine mechanics',
        updatedAt: '2026-03-29T10:20:00.000Z',
        luminorId: 'lyssandria',
        modelId: 'gpt-5',
      },
    ],
    creations: [
      {
        id: 'creation_1',
        title: 'Atlas city map',
        type: 'image',
        status: 'published',
        thumbnailUrl: null,
        createdAt: '2026-03-29T11:00:00.000Z',
        sourceSessionId: 'session_1',
      },
      {
        id: 'creation_2',
        title: 'Relic engine spec',
        type: 'text',
        status: 'draft',
        thumbnailUrl: null,
        createdAt: '2026-03-29T11:05:00.000Z',
        sourceSessionId: null,
      },
    ],
    docs: [
      {
        id: 'doc_1',
        title: 'Atlas canon brief',
        docType: 'brief',
        status: 'active',
        updatedAt: '2026-03-29T11:07:00.000Z',
        wordCount: 640,
        excerpt: 'Atlas canon brief covering floating cities and relic engine rules.',
      },
    ],
    memories: [
      {
        id: 'memory_1',
        content: 'Atlas uses relic engines powered by harmonic crystal cores.',
        createdAt: '2026-03-29T11:10:00.000Z',
      },
    ],
    stats: {
      sessionCount: 2,
      creationCount: 2,
      docCount: 1,
      memoryCount: 1,
    },
    ...overrides,
  };
}

class StubQuery {
  constructor(
    private readonly table: string,
    private readonly log: Array<{ table: string; operation: string; payload: unknown }>,
  ) {}

  update(payload: unknown) {
    this.log.push({ table: this.table, operation: 'update', payload });
    return this;
  }

  upsert(payload: unknown) {
    this.log.push({ table: this.table, operation: 'upsert', payload });
    return this;
  }

  eq() {
    return this;
  }
}

function createSupabaseStub(log: Array<{ table: string; operation: string; payload: unknown }>) {
  return {
    from(table: string) {
      return new StubQuery(table, log);
    },
  };
}

async function main() {
  await test('evaluateProjectWorkspace scores a fully linked workspace', () => {
    const snapshot = createSnapshot();
    const evaluation = evaluateProjectWorkspace(snapshot);

    assert.equal(evaluation.score, 100);
    assert.equal(evaluation.checks.every((check) => check.passed), true);
  });

  await test('evaluateProjectWorkspace highlights missing source links and memories', () => {
    const snapshot = createSnapshot({
      creations: [
        {
          id: 'creation_2',
          title: 'Relic engine spec',
          type: 'text',
          status: 'draft',
          thumbnailUrl: null,
          createdAt: '2026-03-29T11:05:00.000Z',
          sourceSessionId: null,
        },
      ],
      docs: [],
      memories: [],
      stats: {
        sessionCount: 2,
        creationCount: 1,
        docCount: 0,
        memoryCount: 0,
      },
    });

    const evaluation = evaluateProjectWorkspace(snapshot);
    const missingDocs = evaluation.checks.find((check) => check.name === 'has_doc_layer');
    const missingMemory = evaluation.checks.find((check) => check.name === 'has_memory_layer');
    const missingSourceLink = evaluation.checks.find((check) => check.name === 'has_source_links');

    assert.equal(missingDocs?.passed, false);
    assert.equal(missingMemory?.passed, false);
    assert.equal(missingSourceLink?.passed, false);
    assert.equal(evaluation.score, 50);
  });

  await test('enrichProjectGraph derives tags, summaries, and edges from the workspace snapshot', async () => {
    const snapshot = createSnapshot();
    const writes: Array<{ table: string; operation: string; payload: unknown }> = [];
    const supabase = createSupabaseStub(writes);

    const result = await enrichProjectGraph(supabase as never, 'user_1', snapshot);

    assert.equal(result.evaluation.score, 100);
    assert.equal(result.factCount >= 5, true);
    assert.equal(result.edgeCount, 7);
    assert.equal(result.tags.includes('atlas'), true);
    assert.equal(result.summary.includes('Atlas Worldbuilding is an active Arcanea project workspace.'), true);

    const touchedTables = writes.map((entry) => entry.table).sort();
    assert.deepEqual(touchedTables, ['chat_projects', 'project_graph_edges', 'project_graph_summaries']);

    const edgeWrite = writes.find((entry) => entry.table === 'project_graph_edges');
    assert.ok(edgeWrite);
    const edgePayload = edgeWrite?.payload as Array<{ relation: string }>;
    assert.equal(edgePayload.some((edge) => edge.relation === 'derived_from'), true);
    assert.equal(edgePayload.some((edge) => edge.relation === 'documents'), true);
    assert.equal(edgePayload.some((edge) => edge.relation === 'relevant_to'), true);
  });

  await test('buildProjectGraphView prefers persisted graph summaries when available', () => {
    const snapshot = createSnapshot();
    const persisted: ProjectGraphSummaryRecord = {
      summary: 'Stored graph summary for Atlas Worldbuilding.',
      tags: ['atlas', 'worldbuilding'],
      facts: ['Goal: Turn the Atlas setting into a playable story world.'],
      score: 88,
      checks: [
        {
          name: 'has_project',
          passed: true,
          detail: 'Workspace resolves to a concrete project record.',
        },
      ],
      updatedAt: '2026-03-30T12:00:00.000Z',
    };

    const { graph, evaluation } = buildProjectGraphView(snapshot, persisted, 'stored');

    assert.equal(graph.summary, persisted.summary);
    assert.deepEqual(graph.tags, persisted.tags);
    assert.deepEqual(graph.facts, persisted.facts);
    assert.equal(graph.score, persisted.score);
    assert.deepEqual(graph.checks, persisted.checks);
    assert.equal(graph.source, 'stored');
    assert.equal(evaluation.score, 100);
  });

  await test('buildProjectGraphView derives a usable graph summary when nothing is persisted', () => {
    const snapshot = createSnapshot({
      project: {
        id: 'project_2',
        title: 'Lumen Archive',
        description: null,
        goal: null,
        createdAt: '2026-03-30T10:00:00.000Z',
        updatedAt: '2026-03-30T10:00:00.000Z',
      },
    });

    const { graph } = buildProjectGraphView(snapshot);

    assert.equal(graph.source, 'derived');
    assert.equal(graph.summary.includes('Lumen Archive is an active Arcanea project workspace.'), true);
    assert.equal(graph.score, 100);
    assert.equal(graph.tags.length > 0, true);
  });

  await test('buildProjectEnrichmentTask creates a deterministic async enrichment payload', () => {
    const snapshot = createSnapshot();
    const task = buildProjectEnrichmentTask('user_1', snapshot);

    assert.equal(task.projectId, 'project_1');
    assert.equal(task.userId, 'user_1');
    assert.equal(task.summarySeed.includes('Atlas Worldbuilding is an active Arcanea project workspace.'), true);
    assert.equal(task.summarySeed.includes('2 linked chat sessions'), true);
    assert.deepEqual(task.sessionIds, ['session_1', 'session_2']);
    assert.deepEqual(task.creationIds, ['creation_1', 'creation_2']);
    assert.deepEqual(task.docIds, ['doc_1']);
    assert.equal(task.summarySeed.includes('1 project docs'), true);
    assert.deepEqual(task.memoryIds, ['memory_1']);
    assert.deepEqual(task.counts, {
      sessionCount: 2,
      creationCount: 2,
      docCount: 1,
      memoryCount: 1,
    });
  });

  if (failed > 0) {
    console.error(`\n${failed} project enrichment test(s) failed`);
    process.exit(1);
  }

  console.log(`\n${passed} project enrichment test(s) passed`);
}

void main();
