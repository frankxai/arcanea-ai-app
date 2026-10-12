import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { loadBookConfig, runCouncil } from '../src/commands/author-council.js';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import yaml from 'yaml';

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

const require = createRequire(import.meta.url);
const fixtureChapter = 'A captain rejects the crown rather than erase her brother\'s name.';
async function fixtureBook(action: (book: string, entry: string) => Promise<void>) {
  const book = await fs.mkdtemp(path.join(os.tmpdir(), 'council book & fixture '));
  const server = new URL('../../author-council/dist/mcp/server.js', import.meta.url).href;
  const transport = pathToFileURL(require.resolve('@modelcontextprotocol/sdk/server/stdio.js')).href;
  const preload = process.env.ARCANEA_COUNCIL_SOURCE_REGISTER
    ? `await import(${JSON.stringify(process.env.ARCANEA_COUNCIL_SOURCE_REGISTER)});` : '';
  const entry = path.join(book, 'installed council & fixture.mjs');
  await fs.writeFile(entry, `${preload}
const { createMcpServer } = await import(${JSON.stringify(server)});
const { StdioServerTransport } = await import(${JSON.stringify(transport)});
let calls = 0;
globalThis.fetch = async (url, options) => {
  const request = JSON.parse(options.body);
  const index = calls++;
  if (request.model === 'fixture-fail' || (request.model === 'fixture-partial' && index === 0)) return new Response('fixture error', {status:503});
  if (request.model === 'fixture-partial') await new Promise((r) => setTimeout(r, 15));
  const system = request.system ?? request.messages[0].content;
  const match = system.match(/Return only JSON for author (\\S+) and role ([^.]+)\\./);
  const openaiAvailable = Boolean(process.env.OPENAI_API_KEY);
  const anthropicAvailable = Boolean(process.env.ANTHROPIC_API_KEY);
  const critique = {author:match[1], role:match[2], strengths:[String(openaiAvailable), String(anthropicAvailable)], concerns:['The oath needs a visible cost.'], recommendations:[], citations:[], confidence:0.75};
  return new Response(JSON.stringify({id:'fixture-response', model:request.model, choices:[{finish_reason:'stop',message:{content:JSON.stringify(critique)}}], usage:{prompt_tokens:100,completion_tokens:80}}));
};
const instance = await createMcpServer();
await instance.connect(new StdioServerTransport());
`);
  await fs.writeFile(path.join(book, '.author-council.yaml'), 'roster: fiction\nmode: critique\ntrigger: manual_only\nblocker_threshold: 2\n');
  await fs.writeFile(path.join(book, 'chapter.md'), fixtureChapter);
  for (const name of ['ARCANEA_COUNCIL_PROVIDER', 'ARCANEA_COUNCIL_MODEL', 'ARCANEA_COUNCIL_MAX_CALLS', 'ARCANEA_COUNCIL_MAX_OUTPUT_TOKENS', 'ANTHROPIC_API_KEY', 'OPENAI_API_KEY']) delete process.env[name];
  Object.assign(process.env, { ARCANEA_COUNCIL_PROVIDER: 'openai', ARCANEA_COUNCIL_MODEL: 'fixture-success', ARCANEA_COUNCIL_MAX_CALLS: '8', ARCANEA_COUNCIL_MAX_OUTPUT_TOKENS: '1024', OPENAI_API_KEY: 'fixture-selected-credential', ANTHROPIC_API_KEY: 'fixture-other-credential' });
  try { await action(book, entry); }
  finally {
    const absolute = path.resolve(book);
    assert.ok(absolute.startsWith(path.resolve(os.tmpdir()) + path.sep));
    await fs.rm(absolute, { recursive: true, force: true });
  }
}
async function readAudit(file: string) {
  const content = await fs.readFile(file, 'utf8');
  const metadata = yaml.parse(content.split('---')[1]!);
  const record = JSON.parse(content.split('```json\n')[1]!.split('\n```')[0]!);
  return { content, metadata, record };
}

test('native book command preserves selected key, frozen chapter and human review', async () => {
  await fixtureBook(async (book, entry) => {
    const { auditPath } = await runCouncil({ bookDir: book, chapterPath: 'chapter.md', mcpEntry: entry });
    const { content, metadata, record } = await readAudit(auditPath);
    assert.equal(metadata.execution_status, 'complete'); assert.equal(metadata.review_status, 'human_review_required');
    assert.equal(metadata.blocker, true); assert.equal(metadata.blocker_count, null);
    assert.equal(metadata.publication_allowed, false); assert.equal(metadata.canon_approved, false);
    assert.equal(metadata.chapter_sha256, createHash('sha256').update(fixtureChapter).digest('hex'));
    assert.ok(record.critiques.length > 0);
    assert.ok(record.critiques.every((c: any) => c.strengths[0] === 'true' && c.strengths[1] === 'false'));
    assert.ok(!content.includes('fixture-selected-credential'));
    assert.equal(await fs.readFile(path.join(book, 'chapter.md'), 'utf8'), fixtureChapter);
  });
});
test('repeating a successful review writes a distinct audit and preserves the earlier one', async () => {
  await fixtureBook(async (book, entry) => {
    const first = await runCouncil({ bookDir: book, chapterPath: 'chapter.md', mcpEntry: entry });
    const bytes = await fs.readFile(first.auditPath);
    const second = await runCouncil({ bookDir: book, chapterPath: 'chapter.md', mcpEntry: entry });
    assert.notEqual(first.auditPath, second.auditPath);
    assert.deepEqual(await fs.readFile(first.auditPath), bytes);
    assert.equal((await fs.readdir(path.join(book, 'council-audits'))).length, 2);
  });
});
test('native provider failure retains an audit and never marks zero blockers as approval', async () => {
  await fixtureBook(async (book, entry) => {
    process.env.ARCANEA_COUNCIL_MODEL = 'fixture-fail';
    await assert.rejects(runCouncil({ bookDir: book, chapterPath: 'chapter.md', mcpEntry: entry }), /attempt retained/);
    const [name] = await fs.readdir(path.join(book, 'council-audits'));
    const { metadata, record } = await readAudit(path.join(book, 'council-audits', name!));
    assert.equal(metadata.execution_status, 'failed'); assert.equal(metadata.blocker, true);
    assert.equal(metadata.blocker_count, null); assert.deepEqual(record.execution.critiques, []);
    assert.ok(record.execution.attempts.every((a: any) => a.state === 'failed'));
  });
});
test('native partial review retains settled real critiques after another seat fails', async () => {
  await fixtureBook(async (book, entry) => {
    process.env.ARCANEA_COUNCIL_MODEL = 'fixture-partial';
    await assert.rejects(runCouncil({ bookDir: book, chapterPath: 'chapter.md', mcpEntry: entry }), /attempt retained/);
    const [name] = await fs.readdir(path.join(book, 'council-audits'));
    const { metadata, record } = await readAudit(path.join(book, 'council-audits', name!));
    assert.equal(metadata.execution_status, 'failed'); assert.equal(metadata.publication_allowed, false);
    assert.ok(record.execution.critiques.length > 0);
    assert.ok(record.execution.attempts.every((a: any) => a.state !== 'in_flight'));
  });
});
test('missing live configuration retains a failed book attempt without inventing a review', async () => {
  await fixtureBook(async (book, entry) => {
    delete process.env.ARCANEA_COUNCIL_PROVIDER;
    await assert.rejects(runCouncil({ bookDir: book, chapterPath: 'chapter.md', mcpEntry: entry }), /attempt retained/);
    const [name] = await fs.readdir(path.join(book, 'council-audits'));
    const { metadata, record } = await readAudit(path.join(book, 'council-audits', name!));
    assert.equal(metadata.blocker, true); assert.equal(record.status, 'failed');
  });
});
test('book boundary refuses outside chapters before provider dispatch', async () => {
  await fixtureBook(async (book, entry) => {
    const outside = path.join(path.dirname(book), `${path.basename(book)}-outside.md`);
    await fs.writeFile(outside, 'Outside fixture');
    try {
      await assert.rejects(runCouncil({ bookDir: book, chapterPath: outside, mcpEntry: entry }), /inside the selected book/);
      await assert.rejects(fs.readdir(path.join(book, 'council-audits')));
    } finally { await fs.unlink(outside); }
  });
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
