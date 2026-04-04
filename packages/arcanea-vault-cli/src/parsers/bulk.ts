import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { importChatGPTFile } from './chatgpt.js';
import { importClaudeFile } from './claude.js';
import { importPerplexityFile } from './perplexity.js';
import { importMarkdownFile } from './markdown.js';

export interface BulkImportResult {
  imported: string[];
  errors: Array<{ file: string; error: string }>;
  total: number;
}

function importSingleFile(filePath: string, inboxPath: string): string[] {
  const ext = extname(filePath).toLowerCase();
  const filename = filePath.toLowerCase();

  // JSON files: check if ChatGPT conversations.json or Perplexity
  if (ext === '.json') {
    if (filename.includes('conversations') || filename.includes('chatgpt')) {
      return importChatGPTFile(filePath, inboxPath);
    }
    if (filename.includes('perplexity')) {
      return importPerplexityFile(filePath, inboxPath);
    }
    // Try ChatGPT format by default for JSON
    try {
      return importChatGPTFile(filePath, inboxPath);
    } catch {
      return importPerplexityFile(filePath, inboxPath);
    }
  }

  // Markdown files
  if (ext === '.md' || ext === '.markdown' || ext === '.txt') {
    // Check if it looks like Claude export
    const { readFileSync } = require('node:fs');
    const content = readFileSync(filePath, 'utf-8');
    if (/^Human:|^Assistant:/m.test(content)) {
      return importClaudeFile(filePath, inboxPath);
    }
    return importMarkdownFile(filePath, inboxPath);
  }

  return [];
}

export function importDirectory(dirPath: string, inboxPath: string): BulkImportResult {
  const result: BulkImportResult = { imported: [], errors: [], total: 0 };

  const entries = readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      const subResult = importDirectory(fullPath, inboxPath);
      result.imported.push(...subResult.imported);
      result.errors.push(...subResult.errors);
      result.total += subResult.total;
      continue;
    }

    result.total++;
    try {
      const files = importSingleFile(fullPath, inboxPath);
      result.imported.push(...files);
    } catch (err) {
      result.errors.push({
        file: fullPath,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return result;
}

export function importZipFile(zipPath: string, inboxPath: string): BulkImportResult {
  // Extract to temp directory
  const tempDir = mkdtempSync(join(tmpdir(), 'vault-import-'));

  try {
    // Use platform-appropriate unzip
    if (process.platform === 'win32') {
      execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${tempDir}' -Force"`, {
        stdio: 'pipe',
      });
    } else {
      execSync(`unzip -o "${zipPath}" -d "${tempDir}"`, { stdio: 'pipe' });
    }

    return importDirectory(tempDir, inboxPath);
  } catch (err) {
    return {
      imported: [],
      errors: [{ file: zipPath, error: err instanceof Error ? err.message : String(err) }],
      total: 1,
    };
  }
}

export function importBulk(path: string, inboxPath: string): BulkImportResult {
  const stat = statSync(path);

  if (stat.isDirectory()) {
    return importDirectory(path, inboxPath);
  }

  if (path.toLowerCase().endsWith('.zip')) {
    return importZipFile(path, inboxPath);
  }

  // Single file
  try {
    const files = importSingleFile(path, inboxPath);
    return { imported: files, errors: [], total: 1 };
  } catch (err) {
    return {
      imported: [],
      errors: [{ file: path, error: err instanceof Error ? err.message : String(err) }],
      total: 1,
    };
  }
}
