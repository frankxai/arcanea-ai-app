import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'yaml';
import { z } from 'zod';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import kleur from 'kleur';

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
}

export async function runCouncil(input: RunCouncilInput): Promise<{ auditPath: string }> {
  const config = await loadBookConfig(input.bookDir);
  const chapterAbsPath = path.join(input.bookDir, input.chapterPath);
  const chapterContent = await fs.readFile(chapterAbsPath, 'utf8');

  // Spawn MCP server via stdio transport.
  // The server binary location is resolved from this file's location:
  // packages/orchestrator/src/commands/ → up to packages/ → into author-council/dist/mcp/bin.js
  const serverPath = path.resolve(import.meta.dirname, '../../../author-council/dist/mcp/bin.js');

  const transport = new StdioClientTransport({
    command: 'node',
    args: [serverPath],
  });

  const client = new Client(
    { name: 'orchestrator-author-council', version: '0.1.0' },
    { capabilities: {} }
  );

  try {
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

    const slug = path.basename(input.chapterPath, path.extname(input.chapterPath));
    const today = new Date().toISOString().slice(0, 10);
    const auditPath = path.join(input.bookDir, 'council-audits', `${today}-${slug}.md`);
    await fs.mkdir(path.dirname(auditPath), { recursive: true });

    const textContent = (result as any).content?.find((c: any) => c.type === 'text') as { text: string } | undefined;
    if (!textContent) {
      throw new Error('No text content returned from deliberate tool');
    }
    const session = JSON.parse(textContent.text);

    // Parse blockers
    const contributions = session?.contributions || [];
    const blockerCount = contributions.filter((c: any) => c.severity === 'blocker').length;
    const isBlocked = blockerCount >= config.blocker_threshold;

    const auditContent = `---
roster: ${config.roster}
mode: ${config.mode}
chapter: ${input.chapterPath}
generated: ${new Date().toISOString()}
blocker_count: ${blockerCount}
blocker_threshold: ${config.blocker_threshold}
blocker: ${isBlocked}
---

# Council Audit — ${slug}

\`\`\`json
${JSON.stringify(session, null, 2)}
\`\`\`
`;

    await fs.writeFile(auditPath, auditContent, 'utf8');
    return { auditPath };
  } finally {
    await client.close();
  }
}

export async function authorCouncilCommand(bookDir: string, chapterPath: string): Promise<void> {
  console.log(kleur.bold(`\n  [Author Council] Running deliberation...`));
  console.log(`  Book directory: ${kleur.dim(bookDir)}`);
  console.log(`  Chapter: ${kleur.cyan(chapterPath)}`);

  try {
    const result = await runCouncil({ bookDir, chapterPath });
    console.log(kleur.green(`  ✓ Audit successfully written: ${result.auditPath}\n`));
  } catch (err: any) {
    console.error(kleur.red(`  ✗ Council deliberation failed: ${err.message}`));
    process.exit(1);
  }
}
