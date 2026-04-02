import { strict as assert } from 'node:assert';
import { NextRequest } from 'next/server';
import {
  GET as getProjectsRoute,
  POST as postProjectsRoute,
  projectsRouteDeps,
} from '@/app/api/projects/route';
import {
  DELETE as deleteProjectCreationRoute,
  PATCH as patchProjectCreationRoute,
  projectCreationRouteDeps,
} from '@/app/api/projects/[id]/creations/[creationId]/route';
import {
  DELETE as deleteProjectSessionRoute,
  PATCH as patchProjectSessionRoute,
  projectSessionRouteDeps,
} from '@/app/api/projects/[id]/sessions/[sessionId]/route';
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

type ProjectListPayload = {
  success: true;
  data: { projects: Array<{ id: string; title: string }> };
};

type ProjectCreatedPayload = {
  success: true;
  data: { project: { id: string; title: string } };
};

type SessionPayload = {
  success: true;
  data: { session: { id: string; projectId?: string | null } };
};

type CreationPayload = {
  success: true;
  data: { creation: { id: string; sourceSessionId?: string | null } };
};

type DeletePayload = {
  success: true;
  data: { deleted: boolean };
};

async function main() {
  const originalProjectsDeps = { ...projectsRouteDeps };
  const originalSessionDeps = { ...projectSessionRouteDeps };
  const originalCreationDeps = { ...projectCreationRouteDeps };

  try {
    await test('GET /api/projects returns unauthorized without a user', async () => {
      projectsRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: null,
      });

      const response = await getProjectsRoute();
      const payload = await parseJson<ErrorPayload>(response);

      assert.equal(response.status, 401);
      assert.equal(payload.error.code, 'UNAUTHORIZED');
    });

    await test('GET /api/projects returns the project list', async () => {
      projectsRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: { id: 'user_1' } as never,
      });
      projectsRouteDeps.listProjectsForCurrentUser = async () => [
        {
          id: 'project_1',
          title: 'Atlas Launch',
          description: null,
          goal: null,
          createdAt: '2026-03-31T09:00:00.000Z',
          updatedAt: '2026-03-31T09:05:00.000Z',
        },
      ];

      const response = await getProjectsRoute();
      const payload = await parseJson<ProjectListPayload>(response);

      assert.equal(response.status, 200);
      assert.equal(payload.data.projects[0].title, 'Atlas Launch');
    });

    await test('POST /api/projects creates a project and records a trace', async () => {
      const traces: ProjectTraceInput[] = [];
      projectsRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: { id: 'user_1' } as never,
      });
      projectsRouteDeps.createProjectForCurrentUser = async (input) => ({
        id: 'project_2',
        title: input.title,
        description: input.description ?? null,
        goal: input.goal ?? null,
        createdAt: '2026-03-31T09:10:00.000Z',
        updatedAt: '2026-03-31T09:10:00.000Z',
      });
      projectsRouteDeps.recordProjectTrace = async (_supabase, input) => {
        traces.push(input);
      };

      const response = await postProjectsRoute(
        new NextRequest('http://localhost/api/projects', {
          method: 'POST',
          body: JSON.stringify({ title: 'Atlas Launch' }),
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      const payload = await parseJson<ProjectCreatedPayload>(response);

      assert.equal(response.status, 201);
      assert.equal(payload.data.project.id, 'project_2');
      assert.equal(traces[0].action, 'project_created');
    });

    await test('PATCH /api/projects/[id]/sessions/[sessionId] links a session', async () => {
      const traces: ProjectTraceInput[] = [];
      projectSessionRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: { id: 'user_1' } as never,
      });
      projectSessionRouteDeps.assignSessionToProjectForCurrentUser = async () => ({
        id: 'session_1',
        title: 'Launch planning',
        updatedAt: '2026-03-31T09:15:00.000Z',
        luminorId: 'alera',
        modelId: 'claude-sonnet-4',
        projectId: 'project_1',
      });
      projectSessionRouteDeps.recordProjectTrace = async (_supabase, input) => {
        traces.push(input);
      };

      const response = await patchProjectSessionRoute(
        new NextRequest('http://localhost/api/projects/project_1/sessions/session_1', {
          method: 'PATCH',
        }),
        { params: Promise.resolve({ id: 'project_1', sessionId: 'session_1' }) },
      );
      const payload = await parseJson<SessionPayload>(response);

      assert.equal(response.status, 200);
      assert.equal(payload.data.session.id, 'session_1');
      assert.equal(traces[0].metadata?.change, 'session_linked');
    });

    await test('DELETE /api/projects/[id]/sessions/[sessionId] detaches a session', async () => {
      projectSessionRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: { id: 'user_1' } as never,
      });
      projectSessionRouteDeps.detachSessionFromProjectForCurrentUser = async () => true;
      projectSessionRouteDeps.recordProjectTrace = async () => undefined;

      const response = await deleteProjectSessionRoute(
        new NextRequest('http://localhost/api/projects/project_1/sessions/session_1', {
          method: 'DELETE',
        }),
        { params: Promise.resolve({ id: 'project_1', sessionId: 'session_1' }) },
      );
      const payload = await parseJson<DeletePayload>(response);

      assert.equal(response.status, 200);
      assert.equal(payload.data.deleted, true);
    });

    await test('PATCH /api/projects/[id]/creations/[creationId] links a creation', async () => {
      const traces: ProjectTraceInput[] = [];
      projectCreationRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: { id: 'user_1' } as never,
      });
      projectCreationRouteDeps.assignCreationToProjectForCurrentUser = async (_projectId, creationId, sourceSessionId) => ({
        id: creationId,
        title: 'Atlas key visual',
        type: 'image',
        status: 'published',
        thumbnailUrl: null,
        createdAt: '2026-03-31T09:20:00.000Z',
        sourceSessionId: sourceSessionId ?? null,
        projectId: 'project_1',
      });
      projectCreationRouteDeps.recordProjectTrace = async (_supabase, input) => {
        traces.push(input);
      };

      const response = await patchProjectCreationRoute(
        new NextRequest('http://localhost/api/projects/project_1/creations/creation_1', {
          method: 'PATCH',
          body: JSON.stringify({ sourceSessionId: 'session_1' }),
          headers: { 'Content-Type': 'application/json' },
        }),
        { params: Promise.resolve({ id: 'project_1', creationId: 'creation_1' }) },
      );
      const payload = await parseJson<CreationPayload>(response);

      assert.equal(response.status, 200);
      assert.equal(payload.data.creation.id, 'creation_1');
      assert.equal(traces[0].action, 'project_creation_linked');
    });

    await test('DELETE /api/projects/[id]/creations/[creationId] detaches a creation', async () => {
      projectCreationRouteDeps.getProjectAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: { id: 'user_1' } as never,
      });
      projectCreationRouteDeps.detachCreationFromProjectForCurrentUser = async () => true;
      projectCreationRouteDeps.recordProjectTrace = async () => undefined;

      const response = await deleteProjectCreationRoute(
        new NextRequest('http://localhost/api/projects/project_1/creations/creation_1', {
          method: 'DELETE',
        }),
        { params: Promise.resolve({ id: 'project_1', creationId: 'creation_1' }) },
      );
      const payload = await parseJson<DeletePayload>(response);

      assert.equal(response.status, 200);
      assert.equal(payload.data.deleted, true);
    });
  } finally {
    Object.assign(projectsRouteDeps, originalProjectsDeps);
    Object.assign(projectSessionRouteDeps, originalSessionDeps);
    Object.assign(projectCreationRouteDeps, originalCreationDeps);
  }

  if (failed > 0) {
    console.error(`\n${failed} project API action test(s) failed`);
    process.exit(1);
  }

  console.log(`\n${passed} project API action test(s) passed`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
