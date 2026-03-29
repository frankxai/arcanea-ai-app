import { strict as assert } from 'node:assert';
import {
  assignSessionToProject,
  clearProjectFromSessions,
  getActiveChatSessionId,
  listChatSessions,
  loadChatSession,
  mergeChatSessions,
  saveChatSession,
  setActiveChatSessionId,
  type ChatSession,
} from '../local-store';

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

function finish() {
  if (failed > 0) {
    console.error(`\n${failed} local-store project test(s) failed`);
    process.exit(1);
  }
  console.log(`\n${passed} local-store project test(s) passed`);
}

class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

const localStorageStub = new MemoryStorage();

Object.defineProperty(globalThis, 'window', {
  value: { localStorage: localStorageStub },
  configurable: true,
});

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageStub,
  configurable: true,
});

function resetStorage() {
  localStorageStub.clear();
}

test('saveChatSession persists projectId and active session identity', () => {
  resetStorage();

  saveChatSession('chat_1', [
    { id: 'm1', role: 'user', content: 'Build the Atlas lore bible' },
  ], {
    projectId: 'project_atlas',
    luminorId: 'alera',
    modelId: 'claude-sonnet-4',
  });
  setActiveChatSessionId('chat_1');

  const session = loadChatSession('chat_1');
  assert.equal(session?.projectId, 'project_atlas');
  assert.equal(getActiveChatSessionId(), 'chat_1');
});

test('assignSessionToProject rewires an existing chat into a different project', () => {
  resetStorage();

  saveChatSession('chat_1', [
    { id: 'm1', role: 'user', content: 'Build the Atlas lore bible' },
  ], {
    projectId: 'project_atlas',
  });

  assignSessionToProject('chat_1', 'project_relic');

  const session = loadChatSession('chat_1');
  assert.equal(session?.projectId, 'project_relic');
});

test('clearProjectFromSessions removes deleted project assignments across summaries', () => {
  resetStorage();

  saveChatSession('chat_1', [
    { id: 'm1', role: 'user', content: 'Build the Atlas lore bible' },
  ], {
    projectId: 'project_atlas',
  });
  saveChatSession('chat_2', [
    { id: 'm2', role: 'user', content: 'Draft the relic engine codex' },
  ], {
    projectId: 'project_relic',
  });

  clearProjectFromSessions('project_atlas');

  const sessions = listChatSessions();
  const atlas = sessions.find((session) => session.id === 'chat_1');
  const relic = sessions.find((session) => session.id === 'chat_2');

  assert.equal(atlas?.projectId, null);
  assert.equal(relic?.projectId, 'project_relic');
});

test('mergeChatSessions preserves newer cloud project assignments', () => {
  resetStorage();

  saveChatSession('chat_1', [
    { id: 'm1', role: 'user', content: 'Local Atlas draft' },
  ], {
    projectId: 'project_local',
  });

  const cloudSession: ChatSession = {
    id: 'chat_1',
    title: 'Cloud Atlas draft',
    messages: [
      { id: 'm1', role: 'user', content: 'Cloud Atlas draft' },
      { id: 'm2', role: 'assistant', content: 'Let us refine the world.' },
    ],
    projectId: 'project_cloud',
    luminorId: 'alera',
    modelId: 'gpt-5',
    pinned: false,
    createdAt: '2099-03-29T10:00:00.000Z',
    updatedAt: '2099-03-29T12:00:00.000Z',
  };

  mergeChatSessions([cloudSession]);

  const session = loadChatSession('chat_1');
  assert.equal(session?.projectId, 'project_cloud');
  assert.equal(session?.title, 'Cloud Atlas draft');
});

finish();
