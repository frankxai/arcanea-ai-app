import { strict as assert } from 'node:assert';
import { NextRequest } from 'next/server';
import {
  GET as getProjectDocsRoute,
  POST as postProjectDocsRoute,
  projectDocsRouteDeps,
} from '@/app/api/projects/[id]/docs/route';
import {
  DELETE as deleteProjectDocRoute,
  GET as getProjectDocRoute,
  PATCH as patchProjectDocRoute,
  projectDocRouteDeps,
} from '@/app/api/projects/[id]/docs/[docId]/route';

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

type DocsPayload = {
  success: true;
  data: { docs: Array<{ id: string; title: string; word_count?: number }> };
};

type DocPayload = {
  success: true;
  data: { doc: { id: string; title: string; content?: { word_count: number } | null } };
};

type ErrorPayload = {
  success: false;
  error: { code: string };
};

async function main() {
  const originalProjectDocsDeps = { ...projectDocsRouteDeps };
  const originalProjectDocDeps = { ...projectDocRouteDeps };

  try {
    await test('GET /api/projects/[id]/docs returns unauthorized without user', async () => {
      projectDocsRouteDeps.getDocsAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: null,
      });

      const response = await getProjectDocsRoute(
        new NextRequest('http://localhost/api/projects/project_1/docs'),
        { params: Promise.resolve({ id: 'project_1' }) },
      );
      const payload = await parseJson<ErrorPayload>(response);

      assert.equal(response.status, 401);
      assert.equal(payload.error.code, 'UNAUTHORIZED');
    });

    await test('GET /api/projects/[id]/docs returns normalized docs', async () => {
      const calls: Array<{ table: string; filters: Array<[string, string]> }> = [];
      projectDocsRouteDeps.getDocsAuthContext = async () => ({
        supabase: {} as never,
        user: { id: 'user_1' },
        db: {
          from(table: string) {
            const state = { table, filters: [] as Array<[string, string]> };
            calls.push(state);
            let orderCalls = 0;
            return {
              select() { return this; },
              eq(field: string, value: string) { state.filters.push([field, value]); return this; },
              order() {
                orderCalls += 1;
                if (orderCalls < 2) {
                  return this;
                }
                return Promise.resolve({
                  data: [{ id: 'doc_1', title: 'Atlas Brief', project_doc_content: [{ word_count: 321 }] }],
                  error: null,
                });
              },
            };
          },
        },
      });

      const response = await getProjectDocsRoute(
        new NextRequest('http://localhost/api/projects/project_1/docs'),
        { params: Promise.resolve({ id: 'project_1' }) },
      );
      const payload = await parseJson<DocsPayload>(response);

      assert.equal(response.status, 200);
      assert.equal(payload.data.docs[0].word_count, 321);
      assert.deepEqual(calls[0].filters, [
        ['project_id', 'project_1'],
        ['user_id', 'user_1'],
      ]);
    });

    await test('POST /api/projects/[id]/docs creates project-scoped docs', async () => {
      const inserts: Array<{ table: string; values: Record<string, unknown> }> = [];
      projectDocsRouteDeps.getDocsAuthContext = async () => ({
        supabase: {} as never,
        user: { id: 'user_1' },
        db: {
          from(table: string) {
            return {
              insert(values: Record<string, unknown>) {
                inserts.push({ table, values });
                return this;
              },
              select() { return this; },
              single() {
                if (table === 'project_docs') {
                  return Promise.resolve({ data: { id: 'doc_1', title: 'Untitled' }, error: null });
                }
                return Promise.resolve({ data: null, error: null });
              },
            };
          },
        },
      });

      const response = await postProjectDocsRoute(
        new NextRequest('http://localhost/api/projects/project_1/docs', {
          method: 'POST',
          body: JSON.stringify({ title: 'Untitled', doc_type: 'note' }),
          headers: { 'Content-Type': 'application/json' },
        }),
        { params: Promise.resolve({ id: 'project_1' }) },
      );
      const payload = await parseJson<DocPayload>(response);

      assert.equal(response.status, 201);
      assert.equal(payload.data.doc.id, 'doc_1');
      assert.equal(inserts[0].values.project_id, 'project_1');
      assert.equal(inserts[0].values.workspace_id, 'project_1');
    });

    await test('GET /api/projects/[id]/docs/[docId] enforces project scope', async () => {
      const calls: Array<Array<[string, string]>> = [];
      projectDocRouteDeps.getDocAuthContext = async () => ({
        supabase: {} as never,
        user: { id: 'user_1' },
        db: {
          from() {
            const filters: Array<[string, string]> = [];
            calls.push(filters);
            return {
              select() { return this; },
              eq(field: string, value: string) { filters.push([field, value]); return this; },
              single() {
                return Promise.resolve({
                  data: { id: 'doc_1', title: 'Atlas Brief', project_doc_content: [{ word_count: 42 }] },
                  error: null,
                });
              },
            };
          },
        },
      });

      const response = await getProjectDocRoute(
        new NextRequest('http://localhost/api/projects/project_1/docs/doc_1'),
        { params: Promise.resolve({ id: 'project_1', docId: 'doc_1' }) },
      );
      const payload = await parseJson<DocPayload>(response);

      assert.equal(response.status, 200);
      assert.equal(payload.data.doc.id, 'doc_1');
      assert.deepEqual(calls[0], [
        ['id', 'doc_1'],
        ['project_id', 'project_1'],
        ['user_id', 'user_1'],
      ]);
    });

    await test('PATCH /api/projects/[id]/docs/[docId] rejects unauthenticated access', async () => {
      projectDocRouteDeps.getDocAuthContext = async () => ({
        supabase: {} as never,
        db: {} as never,
        user: null,
      });

      const response = await patchProjectDocRoute(
        new NextRequest('http://localhost/api/projects/project_1/docs/doc_1', {
          method: 'PATCH',
          body: JSON.stringify({ title: 'Atlas Revised' }),
          headers: { 'Content-Type': 'application/json' },
        }),
        { params: Promise.resolve({ id: 'project_1', docId: 'doc_1' }) },
      );
      const payload = await parseJson<ErrorPayload>(response);

      assert.equal(response.status, 401);
      assert.equal(payload.error.code, 'UNAUTHORIZED');
    });

    await test('DELETE /api/projects/[id]/docs/[docId] returns success payload', async () => {
      projectDocRouteDeps.getDocAuthContext = async () => ({
        supabase: {} as never,
        user: { id: 'user_1' },
        db: {
          from() {
            return {
              delete() { return this; },
              eq() { return this; },
              then() {
                return Promise.resolve({ error: null });
              },
            };
          },
        },
      });

      const response = await deleteProjectDocRoute(
        new NextRequest('http://localhost/api/projects/project_1/docs/doc_1', {
          method: 'DELETE',
        }),
        { params: Promise.resolve({ id: 'project_1', docId: 'doc_1' }) },
      );
      const payload = await parseJson<{ success: true; data: { ok: true } }>(response);

      assert.equal(response.status, 200);
      assert.equal(payload.data.ok, true);
    });
  } finally {
    Object.assign(projectDocsRouteDeps, originalProjectDocsDeps);
    Object.assign(projectDocRouteDeps, originalProjectDocDeps);
  }

  if (failed > 0) {
    console.error(`\n${failed} docs API contract test(s) failed`);
    process.exit(1);
  }

  console.log(`\n${passed} docs API contract test(s) passed`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
