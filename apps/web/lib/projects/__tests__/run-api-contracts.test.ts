import { strict as assert } from 'node:assert';
import { NextRequest } from 'next/server';
import {
  GET as getProjectRunsRoute,
  POST as postProjectRunsRoute,
  projectRunsRouteDeps,
} from '@/app/api/projects/[id]/runs/route';
import {
  GET as getProjectRunRoute,
  projectRunRouteDeps,
} from '@/app/api/projects/[id]/runs/[runId]/route';
import {
  POST as postProjectRunPreflightRoute,
  projectRunPreflightRouteDeps,
} from '@/app/api/projects/[id]/runs/preflight/route';
import type {
  ProjectRunEventRecord,
  ProjectRunRecord,
  ProjectRunUpsertInput,
} from '@/lib/projects/server';
import type { ProjectTraceInput } from '@/lib/projects/trace';

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void> | void) {
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

async function parseJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

type ErrorPayload = {
  success: false;
  error: { code: string };
};

type RunsPayload = {
  success: true;
  data: { runs: ProjectRunRecord[] };
};

type RunPayload = {
  success: true;
  data: { run: ProjectRunRecord; events: ProjectRunEventRecord[] };
};

type PreflightPayload = {
  success: true;
  data: {
    preflight: {
      billingMode: string;
      estimatedCredits: number | null;
      estimatedUsd: number | null;
      byokEligible: boolean;
    };
  };
};

function createRun(overrides: Partial<ProjectRunRecord> = {}): ProjectRunRecord {
  return {
    id: 'run_1',
    projectId: 'project_1',
    userId: 'user_1',
    traceRunId: 'trace_1',
    kind: 'arcanea-flow.ao-run',
    status: 'queued',
    runtime: 'arcanea-flow',
    provider: 'anthropic',
    repoId: 'arcanea',
    repoPath: 'C:/Users/frank/Arcanea',
    commandName: 'ao',
    commandPreview: 'arcanea-flow ao status',
    executionMode: 'delegated',
    billingMode: 'credits',
    estimatedCredits: 10,
    estimatedUsd: 0.2,
    byokEligible: true,
    sourceTracePath: '.arcanea/runtime/flow-runs.jsonl',
    sourceDocId: null,
    sourceCreationId: null,
    sourceCollectionId: null,
    sourcePromptId: null,
    sourcePromptCollectionId: null,
    metadata: {},
    startedAt: '2026-04-03T18:00:00.000Z',
    finishedAt: null,
    durationMs: null,
    createdAt: '2026-04-03T18:00:00.000Z',
    updatedAt: '2026-04-03T18:00:00.000Z',
    ...overrides,
  };
}

async function main() {
  const originalRunsDeps = { ...projectRunsRouteDeps };
  const originalRunDeps = { ...projectRunRouteDeps };
  const originalPreflightDeps = { ...projectRunPreflightRouteDeps };

  try {
    await test('GET /api/projects/[id]/runs returns unauthorized without user', async () => {
      projectRunsRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: null,
      });

      const response = await getProjectRunsRoute(
        new NextRequest('http://localhost/api/projects/project_1/runs'),
        { params: Promise.resolve({ id: 'project_1' }) },
      );
      const payload = await parseJson<ErrorPayload>(response);

      assert.equal(response.status, 401);
      assert.equal(payload.error.code, 'UNAUTHORIZED');
    });

    await test('GET /api/projects/[id]/runs returns run list contract', async () => {
      const traces: ProjectTraceInput[] = [];
      projectRunsRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: { id: 'user_1' } as never,
      });
      projectRunsRouteDeps.getProjectForCurrentUser = async () => ({
        id: 'project_1',
        title: 'Atlas Launch',
        description: null,
        goal: null,
        createdAt: '2026-04-03T18:00:00.000Z',
        updatedAt: '2026-04-03T18:00:00.000Z',
      });
      projectRunsRouteDeps.listProjectRunsForCurrentUser = async () => [createRun()];
      projectRunsRouteDeps.recordProjectTrace = async (_supabase, input) => {
        traces.push(input);
      };

      const response = await getProjectRunsRoute(
        new NextRequest('http://localhost/api/projects/project_1/runs'),
        { params: Promise.resolve({ id: 'project_1' }) },
      );
      const payload = await parseJson<RunsPayload>(response);

      assert.equal(response.status, 200);
      assert.equal(payload.data.runs.length, 1);
      assert.equal(payload.data.runs[0].traceRunId, 'trace_1');
      assert.equal(traces[0].action, 'project_run_list_viewed');
    });

    await test('POST /api/projects/[id]/runs persists a run and optional events', async () => {
      const traces: ProjectTraceInput[] = [];
      let capturedRun: ProjectRunUpsertInput | null = null;
      projectRunsRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: { id: 'user_1' } as never,
      });
      projectRunsRouteDeps.getProjectForCurrentUser = async () => ({
        id: 'project_1',
        title: 'Atlas Launch',
        description: null,
        goal: null,
        createdAt: '2026-04-03T18:00:00.000Z',
        updatedAt: '2026-04-03T18:00:00.000Z',
      });
      projectRunsRouteDeps.upsertProjectRunForCurrentUser = async (_projectId, run) => {
        capturedRun = run;
        return createRun({ id: 'run_ingested', traceRunId: run.traceRunId });
      };
      projectRunsRouteDeps.listProjectRunEventsForCurrentUser = async () => [{
        id: 'evt_1',
        runId: 'run_ingested',
        projectId: 'project_1',
        userId: 'user_1',
        eventType: 'queued',
        phase: 'dispatch',
        status: 'queued',
        message: 'Queued for execution',
        payload: {},
        createdAt: '2026-04-03T18:00:00.000Z',
      }];
      projectRunsRouteDeps.recordProjectTrace = async (_supabase, input) => {
        traces.push(input);
      };

      const response = await postProjectRunsRoute(
        new NextRequest('http://localhost/api/projects/project_1/runs', {
          method: 'POST',
          body: JSON.stringify({
            run: {
              traceRunId: 'trace_ingested',
              kind: 'arcanea-flow.ao-run',
              status: 'queued',
              runtime: 'arcanea-flow',
              provider: 'anthropic',
              repoId: 'arcanea',
              repoPath: 'C:/Users/frank/Arcanea',
              commandName: 'ao',
              commandPreview: 'arcanea-flow ao status',
              executionMode: 'delegated',
              startedAt: '2026-04-03T18:00:00.000Z',
              events: [{ eventType: 'queued' }],
            },
            includeEvents: true,
          }),
          headers: { 'Content-Type': 'application/json' },
        }),
        { params: Promise.resolve({ id: 'project_1' }) },
      );
      const payload = await parseJson<RunPayload>(response);

      assert.equal(response.status, 201);
      assert.equal(payload.data.run.id, 'run_ingested');
      assert.equal(payload.data.events.length, 1);
      assert.equal(capturedRun?.traceRunId, 'trace_ingested');
      assert.equal(traces[0].action, 'project_run_ingested');
    });

    await test('GET /api/projects/[id]/runs/[runId] returns run detail contract', async () => {
      const traces: ProjectTraceInput[] = [];
      projectRunRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: { id: 'user_1' } as never,
      });
      projectRunRouteDeps.getProjectForCurrentUser = async () => ({
        id: 'project_1',
        title: 'Atlas Launch',
        description: null,
        goal: null,
        createdAt: '2026-04-03T18:00:00.000Z',
        updatedAt: '2026-04-03T18:00:00.000Z',
      });
      projectRunRouteDeps.getProjectRunForCurrentUser = async () => createRun();
      projectRunRouteDeps.listProjectRunEventsForCurrentUser = async () => [];
      projectRunRouteDeps.recordProjectTrace = async (_supabase, input) => {
        traces.push(input);
      };

      const response = await getProjectRunRoute(
        new NextRequest('http://localhost/api/projects/project_1/runs/run_1'),
        { params: Promise.resolve({ id: 'project_1', runId: 'run_1' }) },
      );
      const payload = await parseJson<RunPayload>(response);

      assert.equal(response.status, 200);
      assert.equal(payload.data.run.id, 'run_1');
      assert.equal(traces[0].action, 'project_run_viewed');
    });

    await test('POST /api/projects/[id]/runs/preflight returns explicit cost preflight', async () => {
      const traces: ProjectTraceInput[] = [];
      projectRunPreflightRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: { id: 'user_1' } as never,
      });
      projectRunPreflightRouteDeps.getProjectForCurrentUser = async () => ({
        id: 'project_1',
        title: 'Atlas Launch',
        description: null,
        goal: null,
        createdAt: '2026-04-03T18:00:00.000Z',
        updatedAt: '2026-04-03T18:00:00.000Z',
      });
      projectRunPreflightRouteDeps.inferProjectRunCostPreflight = () => ({
        billingMode: 'credits',
        estimatedCredits: 24,
        estimatedUsd: 0.48,
        byokEligible: true,
      });
      projectRunPreflightRouteDeps.recordProjectTrace = async (_supabase, input) => {
        traces.push(input);
      };

      const response = await postProjectRunPreflightRoute(
        new NextRequest('http://localhost/api/projects/project_1/runs/preflight', {
          method: 'POST',
          body: JSON.stringify({
            traceRunId: 'trace_preflight',
            kind: 'arcanea-flow.swarm-run',
            repoId: 'arcanea',
            repoPath: 'C:/Users/frank/Arcanea',
            commandName: 'swarm',
            commandPreview: 'arcanea-flow swarm start',
          }),
          headers: { 'Content-Type': 'application/json' },
        }),
        { params: Promise.resolve({ id: 'project_1' }) },
      );
      const payload = await parseJson<PreflightPayload>(response);

      assert.equal(response.status, 200);
      assert.equal(payload.data.preflight.billingMode, 'credits');
      assert.equal(payload.data.preflight.estimatedCredits, 24);
      assert.equal(traces[0].action, 'project_run_cost_preflight');
    });
  } finally {
    Object.assign(projectRunsRouteDeps, originalRunsDeps);
    Object.assign(projectRunRouteDeps, originalRunDeps);
    Object.assign(projectRunPreflightRouteDeps, originalPreflightDeps);
  }

  if (failed > 0) {
    console.error(`\n${failed} project run API contract test(s) failed`);
    process.exit(1);
  }

  console.log(`\n${passed} project run API contract test(s) passed`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
