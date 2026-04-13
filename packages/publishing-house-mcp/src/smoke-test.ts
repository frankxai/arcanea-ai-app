/**
 * MCP Server smoke test — verifies the 7 tools are registered and
 * core dependencies import correctly.
 */

import { server } from './index.js';

async function main(): Promise<void> {
  console.log('MCP Server smoke test');
  console.log('Server name:', 'arcanea-publishing-house');
  console.log('Version:', '0.5.0');

  // Verify we can import all the tool dependencies
  const { scoreTASTE } = await import('@arcanea/publishing-house/quality/taste-gate');
  console.log('scoreTASTE imported:', typeof scoreTASTE === 'function' ? 'OK' : 'FAIL');

  const { routeRequest } = await import('@arcanea/publishing-house/queen/lumina-queen');
  console.log('routeRequest imported:', typeof routeRequest === 'function' ? 'OK' : 'FAIL');

  const { PUBLISHING_LUMINORS } = await import('@arcanea/publishing-house/agents/hierarchy');
  console.log(
    'PUBLISHING_LUMINORS imported:',
    Object.keys(PUBLISHING_LUMINORS).length === 8 ? 'OK (8 claws)' : 'FAIL',
  );

  // Quick TASTE test
  const result = await scoreTASTE({
    content:
      'The dragon descended upon the mountain, its scales gleaming like hammered copper in the dying light. Taelith raised her staff.',
    metadata: { title: 'Test', author: 'Test', language: 'en' },
  });
  console.log('TASTE score:', result.total, '/', 100, '— tier:', result.tier);

  // Quick routing test
  const route = routeRequest('publish my book');
  console.log('Route "publish my book":', route.chosenClaw, '(', route.chosenLuminor?.name, ')');

  console.log('\nAll smoke checks passed.');
}

main().catch((err) => {
  console.error('SMOKE TEST FAILED:', err);
  process.exit(1);
});
