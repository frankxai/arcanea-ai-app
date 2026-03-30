import { strict as assert } from 'node:assert';
import { analytics } from '../events';

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

class PosthogStub {
  captures: Array<{ event: string; properties?: Record<string, unknown> }> = [];
  identities: Array<{ userId: string; traits?: Record<string, unknown> }> = [];

  capture(event: string, properties?: Record<string, unknown>) {
    this.captures.push({ event, properties });
  }

  identify(userId: string, traits?: Record<string, unknown>) {
    this.identities.push({ userId, traits });
  }
}

const posthog = new PosthogStub();

Object.defineProperty(globalThis, 'window', {
  value: { posthog },
  configurable: true,
});

test('project analytics emit the expected event names and payloads', () => {
  analytics.projectCreated('project_1');
  analytics.projectSelected('project_1');
  analytics.projectSessionLinked('project_1', 'session_1');

  assert.deepEqual(posthog.captures, [
    { event: 'project_created', properties: { projectId: 'project_1' } },
    { event: 'project_selected', properties: { projectId: 'project_1' } },
    {
      event: 'project_session_linked',
      properties: { projectId: 'project_1', sessionId: 'session_1' },
    },
  ]);
});

test('analytics identify keeps the helper wired', () => {
  analytics.identify('user_1', { tier: 'creator' });

  assert.deepEqual(posthog.identities, [
    { userId: 'user_1', traits: { tier: 'creator' } },
  ]);
});

if (failed > 0) {
  console.error(`\n${failed} analytics project test(s) failed`);
  process.exit(1);
}

console.log(`\n${passed} analytics project test(s) passed`);
