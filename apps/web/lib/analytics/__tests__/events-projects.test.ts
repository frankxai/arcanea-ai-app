/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { strict as assert } from 'node:assert';
import { analytics, promptLengthBucket } from '../events';

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
const vercelEvents: Array<[string, unknown?]> = [];

Object.defineProperty(globalThis, 'window', {
  value: {
    posthog,
    va: (event: string, properties?: unknown) => {
      vercelEvents.push([event, properties]);
    },
  },
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

test('prompt length buckets avoid raw prompt telemetry', () => {
  assert.equal(promptLengthBucket(0), 'empty');
  assert.equal(promptLengthBucket(12), 'short');
  assert.equal(promptLengthBucket(120), 'medium');
  assert.equal(promptLengthBucket(400), 'long');
});

test('activation funnel events emit safe payloads', () => {
  posthog.captures = [];
  vercelEvents.length = 0;

  analytics.homepageGenesisCtaClick('hero_send', {
    promptLength: 128,
    destination: '/genesis',
  });
  analytics.genesisPromptPrefillUsed({ source: 'hero_send', promptLength: 128 });
  analytics.genesisProofExport('brief_downloaded', {
    driftFace: 'synthetic-confusion',
    missionLane: 'world',
    repoFileCount: 4,
  });
  analytics.atlasCreaturePromptCopy({
    slug: 'aeralith-sky-grazer',
    promptKind: 'positive',
    rightsTier: 'original',
    generationPolicy: 'approved',
  });
  analytics.studioStorePackageClick('buy_with_credits', {
    packageId: 'cinematic-web-lab',
    packageType: 'Frontend',
    priceCredits: 120,
    tab: 'marketplace',
  });

  assert.deepEqual(posthog.captures, [
    {
      event: 'homepage_genesis_cta_click',
      properties: {
        source: 'hero_send',
        hasPrompt: true,
        promptLengthBucket: 'medium',
        starterLabel: undefined,
        destination: '/genesis',
      },
    },
    {
      event: 'genesis_prompt_prefill_used',
      properties: {
        source: 'hero_send',
        promptLengthBucket: 'medium',
      },
    },
    {
      event: 'genesis_proof_export',
      properties: {
        action: 'brief_downloaded',
        driftFace: 'synthetic-confusion',
        missionLane: 'world',
        repoFileCount: 4,
        status: 'success',
      },
    },
    {
      event: 'atlas_creature_prompt_copy',
      properties: {
        slug: 'aeralith-sky-grazer',
        promptKind: 'positive',
        rightsTier: 'original',
        generationPolicy: 'approved',
      },
    },
    {
      event: 'studio_store_package_click',
      properties: {
        action: 'buy_with_credits',
        packageId: 'cinematic-web-lab',
        packageType: 'Frontend',
        priceCredits: 120,
        priceUsd: undefined,
        tab: 'marketplace',
      },
    },
  ]);

  assert.deepEqual(
    vercelEvents.map((event) => event[1]),
    posthog.captures.map((capture) => ({
      name: capture.event,
      data: capture.properties,
      options: undefined,
    })),
  );
});

if (failed > 0) {
  console.error(`\n${failed} analytics project test(s) failed`);
  process.exit(1);
}

console.log(`\n${passed} analytics project test(s) passed`);
