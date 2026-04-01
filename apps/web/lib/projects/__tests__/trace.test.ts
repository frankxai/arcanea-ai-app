import { strict as assert } from 'node:assert';
import { recordProjectTrace } from '../trace';

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

class ActivityInsertBuilder {
  constructor(
    private readonly log: Array<{ table: string; payload: unknown }>,
  ) {}

  select() {
    return this;
  }

  single() {
    return Promise.resolve({
      data: {
        id: 'activity_1',
        user_id: 'user_1',
        action: 'project_created',
        entity_type: 'project',
        entity_id: 'project_1',
        metadata: { title: 'Atlas Worldbuilding' },
        created_at: '2026-03-30T10:00:00.000Z',
      },
      error: null,
    });
  }

  insert(payload: unknown) {
    this.log.push({ table: 'activity_log', payload });
    return this;
  }
}

function createSupabaseStub(log: Array<{ table: string; payload: unknown }>, shouldFail = false) {
  return {
    from(table: string) {
      assert.equal(table, 'activity_log');
      if (shouldFail) {
        throw new Error('activity_log unavailable');
      }
      return new ActivityInsertBuilder(log);
    },
  };
}

async function main() {
  await test('recordProjectTrace writes a project activity row', async () => {
    const writes: Array<{ table: string; payload: unknown }> = [];
    const supabase = createSupabaseStub(writes);

    await recordProjectTrace(supabase as never, {
      userId: 'user_1',
      projectId: 'project_1',
      action: 'project_created',
      metadata: { title: 'Atlas Worldbuilding' },
    });

    assert.equal(writes.length, 1);
    assert.deepEqual(writes[0], {
      table: 'activity_log',
      payload: {
        user_id: 'user_1',
        action: 'project_created',
        entity_type: 'project',
        entity_id: 'project_1',
        metadata: { title: 'Atlas Worldbuilding' },
      },
    });
  });

  await test('recordProjectTrace swallows activity write failures', async () => {
    const writes: Array<{ table: string; payload: unknown }> = [];
    const supabase = createSupabaseStub(writes, true);
    const warn = console.warn;
    const calls: unknown[] = [];
    console.warn = (...args: unknown[]) => {
      calls.push(args);
    };

    try {
      await recordProjectTrace(supabase as never, {
        userId: 'user_1',
        projectId: 'project_1',
        action: 'project_graph_eval',
      });
    } finally {
      console.warn = warn;
    }

    assert.equal(writes.length, 0);
    assert.equal(calls.length > 0, true);
  });

  await test('recordProjectTrace supports graph view traces', async () => {
    const writes: Array<{ table: string; payload: unknown }> = [];
    const supabase = createSupabaseStub(writes);

    await recordProjectTrace(supabase as never, {
      userId: 'user_1',
      projectId: 'project_1',
      action: 'project_graph_viewed',
      metadata: {
        score: 92,
        source: 'stored',
      },
    });

    assert.equal(writes.length, 1);
    assert.equal((writes[0].payload as Record<string, unknown>).action, 'project_graph_viewed');
  });

  await test('recordProjectTrace supports chat retrieval and provider routing traces', async () => {
    const writes: Array<{ table: string; payload: unknown }> = [];
    const supabase = createSupabaseStub(writes);

    await recordProjectTrace(supabase as never, {
      userId: 'user_1',
      projectId: 'project_1',
      action: 'project_chat_context_loaded',
      metadata: {
        sessionCount: 3,
        memoryCount: 2,
      },
    });

    await recordProjectTrace(supabase as never, {
      userId: 'user_1',
      projectId: 'project_1',
      action: 'project_provider_routed',
      metadata: {
        provider: 'anthropic',
        modelLabel: 'Claude Sonnet 4',
      },
    });

    assert.equal(writes.length, 2);
    assert.equal((writes[0].payload as Record<string, unknown>).action, 'project_chat_context_loaded');
    assert.equal((writes[1].payload as Record<string, unknown>).action, 'project_provider_routed');
  });

  if (failed > 0) {
    console.error(`\n${failed} project trace test(s) failed`);
    process.exit(1);
  }

  console.log(`\n${passed} project trace test(s) passed`);
}

void main();
