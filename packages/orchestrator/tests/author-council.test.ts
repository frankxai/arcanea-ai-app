import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { loadBookConfig } from '../src/commands/author-council.js';

test('loadBookConfig loads and validates a correct config', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'author-council-test-'));
  try {
    const yamlContent = `
roster: arcanea
mode: deliberation
trigger: on_chapter_commit
voices_override:
  - brandon
blocker_threshold: 3
notes: Testing notes.
`;
    await fs.writeFile(path.join(tempDir, '.author-council.yaml'), yamlContent, 'utf8');

    const config = await loadBookConfig(tempDir);
    assert.equal(config.roster, 'arcanea');
    assert.equal(config.mode, 'deliberation');
    assert.equal(config.trigger, 'on_chapter_commit');
    assert.deepEqual(config.voices_override, ['brandon']);
    assert.equal(config.blocker_threshold, 3);
    assert.equal(config.notes?.trim(), 'Testing notes.');
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('loadBookConfig throws error for invalid config schema', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'author-council-test-'));
  try {
    const yamlContent = `
roster: arcanea
mode: invalid_mode_name
trigger: on_chapter_commit
`;
    await fs.writeFile(path.join(tempDir, '.author-council.yaml'), yamlContent, 'utf8');

    await assert.rejects(async () => {
      await loadBookConfig(tempDir);
    });
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
