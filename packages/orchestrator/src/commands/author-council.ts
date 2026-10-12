import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'yaml';
import { z } from 'zod';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import kleur from 'kleur';
import { createHash, randomUUID } from 'node:crypto';
import { councilEnvironment } from '../../../author-council/dist/mcp/critique-runner.js';

export const BookConfigSchema = z.object({
  roster: z.string(),
  mode: z.enum(['deliberation', 'critique', 'synthesis', 'debate']),
  trigger: z.enum(['on_chapter_commit', 'manual_only', 'on_milestone']),
  voices_override: z.array(z.string()).default([]),
  blocker_threshold: z.number().int().nonnegative().default(2),
  notes: z.string().optional(),
});

export type BookConfig = z.infer<typeof BookConfigSchema>;

export async function loadBookConfig(bookDir: string): Promise<BookConfig> {
  const configPath = path.join(bookDir, '.author-council.yaml');
  const raw = await fs.readFile(configPath, 'utf8');
  return BookConfigSchema.parse(yaml.parse(raw));
}

export interface RunCouncilInput {
  bookDir: string;
  chapterPath: string; // e.g., "chapters/01-first-flames.md"
  /** Explicit trusted installed MCP entry; never read from manuscript/config data. */
  mcpEntry?: string;
}

export async function runCouncil(input: RunCouncilInput): Promise<{ auditPath: string }> {
  const config = await loadBookConfig(input.bookDir);
  const bookDir = await fs.realpath(input.bookDir);
  const chapterAbsPath = await fs.realpath(path.resolve(bookDir, input.chapterPath));
  const relative = path.relative(bookDir, chapterAbsPath);
  if (!relative || relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) {
    throw new Error('Council chapter must be inside the selected book.');
  }
  const chapterContent = await fs.readFile(chapterAbsPath, 'utf8');
  const chapterSha256 = createHash('sha256').update(chapterContent).digest('hex');
  const auditDir = path.join(bookDir, 'council-audits');
  await fs.mkdir(auditDir, { recursive: true });
  if ((await fs.lstat(auditDir)).isSymbolicLink() || await fs.realpath(auditDir) !== auditDir) {
    throw new Error('Council audit directory must be owned by the selected book.');
  }

  // Spawn MCP server via stdio transport.
  // The server binary location is resolved from this file's location:
  // packages/orchestrator/src/commands/ → up to packages/ → into author-council/dist/mcp/bin.js
  const serverPath = input.mcpEntry
    ? await fs.realpath(input.mcpEntry)
    : path.resolve(import.meta.dirname, '../../../author-council/dist/mcp/bin.js');

  const client = new Client(
    { name: 'orchestrator-author-council', version: '0.1.0' },
    { capabilities: {} }
  );

  let session: unknown;
  let failed = false;
  try {
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [serverPath],
      env: councilEnvironment(),
    });
    await client.connect(transport);

    const result = await client.callTool({
      name: 'deliberate',
      arguments: {
        roster: config.roster,
        mode: config.mode,
        text: chapterContent,
        voicesOverride: config.voices_override,
      },
    });

    const textContent = (result as any).content?.find((c: any) => c.type === 'text') as { text: string } | undefined;
    if (!textContent) {
      throw new Error('No text content returned from deliberate tool');
    }
    session = JSON.parse(textContent.text);
    const execution = (session as any)?.execution;
    if (!execution || execution.chapterSha256 !== chapterSha256 || execution.humanReviewRequired !== true ||
        execution.publicationAllowed !== false || !Array.isArray(execution.attempts) || !Array.isArray(execution.critiques)) {
      throw new Error('Council response lacks a matching chapter-bound review receipt.');
    }
    failed = !!(result as any).isError || execution.status !== 'complete';
  } catch {
    failed = true;
    session ??= { status: 'failed', error: 'Council did not complete; reconcile provider outcomes before retry.', chapterSha256 };
  } finally {
    await client.close();
  }

  const slug = path.basename(input.chapterPath, path.extname(input.chapterPath)).slice(0, 60).replace(/[^a-zA-Z0-9_-]/g, '_') || 'chapter';
  const generated = new Date().toISOString();
  const auditPath = path.join(auditDir, `${generated.replace(/[:.]/g, '-')}-${slug}-${randomUUID()}.md`);
  const metadata = yaml.stringify({
    roster: config.roster, mode: config.mode, chapter: relative, chapter_sha256: chapterSha256, generated,
    execution_status: failed ? 'failed' : 'complete', review_status: 'human_review_required',
    blocker_count: null, blocker_threshold: config.blocker_threshold, blocker: true,
    publication_allowed: false, canon_approved: false,
  });
  // Escape Markdown fence characters without changing the JSON string values.
  const record = JSON.stringify(session, null, 2).replaceAll('`', '\\u0060');
  await fs.writeFile(auditPath, `---\n${metadata}---\n\n# Council review candidate\n\n\`\`\`json\n${record}\n\`\`\`\n`, { encoding: 'utf8', flag: 'wx' });
  if (failed) throw new Error(`Council review failed; attempt retained at ${auditPath}`);
  return { auditPath };
}

export async function authorCouncilCommand(bookDir: string, chapterPath: string, options: { mcpEntry?: string } = {}): Promise<void> {
  console.log(kleur.bold(`\n  [Author Council] Running deliberation...`));
  console.log(`  Book directory: ${kleur.dim(bookDir)}`);
  console.log(`  Chapter: ${kleur.cyan(chapterPath)}`);

  try {
    const result = await runCouncil({ bookDir, chapterPath, ...options });
    console.log(kleur.green(`  ✓ Review candidate written: ${result.auditPath}`));
    console.log('  Human manuscript, canon and publication review remains required.\n');
  } catch (err: any) {
    console.error(kleur.red(`  ✗ Council deliberation failed: ${err.message}`));
    process.exit(1);
  }
}
