import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { resolveVaultPath, readRegistry, ensureDir } from '../utils/files.js';
import { parseFrontmatter } from '../utils/frontmatter.js';

interface ExportOptions {
  vaultPath?: string;
  output?: string;
}

function toJson(data: Record<string, unknown>, body: string): string {
  return JSON.stringify(
    {
      ...data,
      content: body,
    },
    null,
    2,
  );
}

function toHtml(data: Record<string, unknown>, body: string): string {
  // Simple markdown-to-HTML conversion
  let html = body
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.title || 'Vault Export'}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2em auto; padding: 0 1em; line-height: 1.6; }
    pre { background: #1a1a2e; color: #e0e0e0; padding: 1em; border-radius: 8px; overflow-x: auto; }
    code { background: #f0f0f0; padding: 0.2em 0.4em; border-radius: 3px; }
    pre code { background: none; padding: 0; }
    h1, h2, h3 { color: #1a1a2e; }
  </style>
</head>
<body>
  <h1>${data.title || 'Vault Export'}</h1>
  <p class="meta">Source: ${data.source || 'unknown'} | Date: ${data.date || 'unknown'} | Grade: ${data.grade || 'N/A'}</p>
  <p>${html}</p>
</body>
</html>`;
}

function toText(data: Record<string, unknown>, body: string): string {
  const header = [
    `Title: ${data.title || 'Untitled'}`,
    `Source: ${data.source || 'unknown'}`,
    `Date: ${data.date || 'unknown'}`,
    `Type: ${data.type || 'unknown'}`,
    `Grade: ${data.grade || 'N/A'}`,
    '---',
    '',
  ].join('\n');

  // Strip markdown formatting
  const plain = body
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```\w*\n?/g, '').trim())
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#+\s/gm, '');

  return header + plain;
}

export function exportCommand(id: string, format: string, options: ExportOptions): void {
  const vaultPath = resolveVaultPath(options.vaultPath);
  const registry = readRegistry(vaultPath);

  // Find item by ID or partial title match
  const item = registry.items.find(
    i => i.id === id || i.title.toLowerCase().includes(id.toLowerCase()),
  );

  if (!item) {
    console.error(`Item not found: ${id}`);
    console.error('Use "arcanea-vault search" to find items.');
    process.exit(1);
  }

  const raw = readFileSync(item.path, 'utf-8');
  const { data, body } = parseFrontmatter(raw);

  let output: string;
  let ext: string;

  switch (format.toLowerCase()) {
    case 'json':
      output = toJson(data, body);
      ext = '.json';
      break;
    case 'html':
      output = toHtml(data, body);
      ext = '.html';
      break;
    case 'text':
    case 'txt':
      output = toText(data, body);
      ext = '.txt';
      break;
    case 'markdown':
    case 'md':
    default:
      output = raw;
      ext = '.md';
      break;
  }

  if (options.output) {
    ensureDir(dirname(options.output));
    writeFileSync(options.output, output, 'utf-8');
    console.log(`Exported to ${options.output}`);
  } else {
    // Write to processed folder
    const filename = basename(item.path, '.md') + ext;
    const outPath = join(vaultPath, 'processed', 'blog-ready', filename);
    ensureDir(dirname(outPath));
    writeFileSync(outPath, output, 'utf-8');
    console.log(`Exported to ${outPath}`);
  }
}
