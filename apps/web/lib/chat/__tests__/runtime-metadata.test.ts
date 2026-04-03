import assert from 'node:assert/strict';

import {
  buildArcaneaRuntimeHeaders,
  coerceArcaneaRuntimeMetadata,
  formatArcaneaRuntimeSummary,
  parseArcaneaRuntimeHeaders,
} from '../runtime-metadata';

function testHeaderRoundTrip() {
  const headers = new Headers(
    buildArcaneaRuntimeHeaders({
      modelLabel: 'gpt-5.4',
      provider: 'openai',
      routeMode: 'gateway',
      apiKeySource: 'client-byok',
      retrievalMode: 'graph+selection',
      selectedSessionCount: 2,
      availableSessionCount: 5,
      selectedCreationCount: 1,
      availableCreationCount: 3,
      selectedDocCount: 4,
      availableDocCount: 6,
      selectedMemoryCount: 2,
      availableMemoryCount: 7,
      hasStoredSummary: true,
    }),
  );

  const metadata = parseArcaneaRuntimeHeaders(headers);

  assert.equal(metadata.provider, 'openai');
  assert.equal(metadata.routeMode, 'gateway');
  assert.equal(metadata.apiKeySource, 'client-byok');
  assert.equal(metadata.retrievalMode, 'graph+selection');
  assert.equal(metadata.selectedDocCount, 4);
  assert.equal(metadata.availableMemoryCount, 7);
  assert.equal(metadata.hasStoredSummary, true);
}

function testMetadataCoercion() {
  const metadata = coerceArcaneaRuntimeMetadata({
    provider: 'anthropic',
    routeMode: 'legacy',
    selectedSessionCount: 3,
    selectedDocCount: 1,
    hasStoredSummary: false,
  });

  assert.equal(metadata?.provider, 'anthropic');
  assert.equal(metadata?.routeMode, 'legacy');
  assert.equal(metadata?.selectedSessionCount, 3);
  assert.equal(metadata?.selectedDocCount, 1);
  assert.equal(metadata?.hasStoredSummary, false);
  assert.equal(metadata?.availableDocCount, undefined);
}

function testRuntimeSummaryFormatting() {
  const summary = formatArcaneaRuntimeSummary({
    provider: 'google',
    routeMode: 'gateway',
    selectedSessionCount: 1,
    selectedDocCount: 2,
    selectedMemoryCount: 3,
    hasStoredSummary: true,
  });

  assert.equal(summary, 'google via gateway · context 1 session · 2 docs · 3 memories · stored summary');
}

function main() {
  testHeaderRoundTrip();
  console.log('PASS  runtime metadata header round-trip works');

  testMetadataCoercion();
  console.log('PASS  runtime metadata coercion reads streamed metadata objects');

  testRuntimeSummaryFormatting();
  console.log('PASS  runtime metadata summary formatting is deterministic');

  console.log('\n3 runtime metadata test(s) passed');
}

void main();
