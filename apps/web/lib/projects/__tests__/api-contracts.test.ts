import { strict as assert } from 'node:assert';
import { NextRequest } from 'next/server';
import {
  DELETE as deleteProjectRoute,
  GET as getProjectRoute,
  PATCH as patchProjectRoute,
  projectRouteDeps,
} from '@/app/api/projects/[id]/route';
import {
  GET as getProjectGraphRoute,
  projectGraphRouteDeps,
} from '@/app/api/projects/[id]/graph/route';
import type { ProjectWorkspaceSnapshot } from '@/lib/projects/server';
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

function createWorkspace(): ProjectWorkspaceSnapshot {
  return {
    project: {
      id: 'project_1',
      title: 'Atlas Launch',
      description: 'Atlas launch workspace',
      goal: 'Ship a complete launch story.',
      createdAt: '2026-03-30T10:00:00.000Z',
      updatedAt: '2026-03-30T10:10:00.000Z',
    },
    sessions: [
      {
        id: 'chat_1',
        title: 'Launch planning',
        updatedAt: '2026-03-30T10:05:00.000Z',
        luminorId: 'alera',
        modelId: 'claude-sonnet-4',
      },
    ],
    creations: [
      {
        id: 'creation_1',
        title: 'Atlas key visual',
        type: 'image',
        status: 'published',
        thumbnailUrl: null,
        createdAt: '2026-03-30T10:07:00.000Z',
        sourceSessionId: 'chat_1',
      },
    ],
    memories: [
      {
        id: 'memory_1',
        content: 'Atlas relies on harmonic engines.',
        createdAt: '2026-03-30T10:08:00.000Z',
      },
    ],
    stats: {
      sessionCount: 1,
      creationCount: 1,
      memoryCount: 1,
    },
  };
}

async function parseJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

type ErrorPayload = {
  success: false;
  error: { code: string };
};

type ProjectPayload = {
  success: true;
  data: { project: { title: string } };
};

type DeletePayload = {
  success: true;
  data: { deleted: boolean };
};

type GraphPayload = {
  success: true;
  data: {
    workspace: { project: { id: string } };
    graph: { summary: string };
  };
};

async function main() {
  const originalProjectDeps = { ...projectRouteDeps };
  const originalGraphDeps = { ...projectGraphRouteDeps };

  try {
    await test('GET /api/projects/[id] returns not found when project is missing', async () => {
      projectRouteDeps.getProjectForCurrentUser = async () => null;

      const response = await getProjectRoute(
        new NextRequest('http://localhost/api/projects/project_1'),
        { params: Promise.resolve({ id: 'project_1' }) },
      );
      const payload = await parseJson<ErrorPayload>(response);

      assert.equal(response.status, 404);
      assert.equal(payload.success, false);
      assert.equal(payload.error.code, 'NOT_FOUND');
    });

    await test('PATCH /api/projects/[id] rejects invalid patch payloads', async () => {
      const response = await patchProjectRoute(
        new NextRequest('http://localhost/api/projects/project_1', {
          method: 'PATCH',
          body: JSON.stringify({ title: '' }),
          headers: { 'Content-Type': 'application/json' },
        }),
        { params: Promise.resolve({ id: 'project_1' }) },
      );
      const payload = await parseJson<ErrorPayload>(response);

      assert.equal(response.status, 400);
      assert.equal(payload.success, false);
      assert.equal(payload.error.code, 'VALIDATION_ERROR');
    });

    await test('PATCH /api/projects/[id] returns updated project contract', async () => {
      const traces: ProjectTraceInput[] = [];
      projectRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: { id: 'user_1' } as never,
      });
      projectRouteDeps.updateProjectForCurrentUser = async (_id, patch) => ({
        id: 'project_1',
        title: patch.title ?? 'Atlas Launch',
        description: patch.description ?? null,
        goal: patch.goal ?? null,
        createdAt: '2026-03-30T10:00:00.000Z',
        updatedAt: '2026-03-30T10:20:00.000Z',
      });
      projectRouteDeps.recordProjectTrace = async (_supabase, input) => {
        traces.push(input);
      };

      const response = await patchProjectRoute(
        new NextRequest('http://localhost/api/projects/project_1', {
          method: 'PATCH',
          body: JSON.stringify({ title: 'Atlas Revised' }),
          headers: { 'Content-Type': 'application/json' },
        }),
        { params: Promise.resolve({ id: 'project_1' }) },
      );
      const payload = await parseJson<ProjectPayload>(response);

      assert.equal(response.status, 200);
      assert.equal(payload.success, true);
      assert.equal(payload.data.project.title, 'Atlas Revised');
      assert.equal(traces.length, 1);
      assert.equal(traces[0].action, 'project_updated');
    });

    await test('DELETE /api/projects/[id] returns deleted true', async () => {
      projectRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: { id: 'user_1' } as never,
      });
      projectRouteDeps.deleteProjectForCurrentUser = async () => true;
      projectRouteDeps.recordProjectTrace = async () => undefined;

      const response = await deleteProjectRoute(
        new NextRequest('http://localhost/api/projects/project_1', { method: 'DELETE' }),
        { params: Promise.resolve({ id: 'project_1' }) },
      );
      const payload = await parseJson<DeletePayload>(response);

      assert.equal(response.status, 200);
      assert.equal(payload.success, true);
      assert.equal(payload.data.deleted, true);
    });

    await test('GET /api/projects/[id]/graph returns workspace, evaluation, and graph', async () => {
      const workspace = createWorkspace();
      const traces: ProjectTraceInput[] = [];
      projectGraphRouteDeps.getProjectWorkspaceForCurrentUser = async () => workspace;
      projectGraphRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: { id: 'user_1' } as never,
      });
      projectGraphRouteDeps.getProjectGraphSummaryForCurrentUser = async () => null;
      projectGraphRouteDeps.evaluateProjectWorkspace = () => ({
        score: 100,
        checks: [
          { name: 'has_project', passed: true, detail: 'Workspace exists.' },
        ],
      });
      projectGraphRouteDeps.buildProjectGraphView = () => ({
        evaluation: {
          score: 100,
          checks: [{ name: 'has_project', passed: true, detail: 'Workspace exists.' }],
        },
        graph: {
          summary: 'Atlas Launch is an active workspace.',
          tags: ['atlas'],
          facts: ['Goal: Ship a complete launch story.'],
          score: 100,
          checks: [{ name: 'has_project', passed: true, detail: 'Workspace exists.' }],
          source: 'derived',
        },
      });
      projectGraphRouteDeps.recordProjectTrace = async (_supabase, input) => {
        traces.push(input);
      };

      const response = await getProjectGraphRoute(
        new NextRequest('http://localhost/api/projects/project_1/graph'),
        { params: Promise.resolve({ id: 'project_1' }) },
      );
      const payload = await parseJson<GraphPayload>(response);

      assert.equal(response.status, 200);
      assert.equal(payload.success, true);
      assert.equal(payload.data.workspace.project.id, 'project_1');
      assert.equal(payload.data.graph.summary, 'Atlas Launch is an active workspace.');
      assert.equal(traces[0].action, 'project_graph_viewed');
    });
  } finally {
    Object.assign(projectRouteDeps, originalProjectDeps);
    Object.assign(projectGraphRouteDeps, originalGraphDeps);
  }

  if (failed > 0) {
    console.error(`\n${failed} project API contract test(s) failed`);
    process.exit(1);
  }

  console.log(`\n${passed} project API contract test(s) passed`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
