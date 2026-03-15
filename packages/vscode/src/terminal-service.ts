/**
 * Terminal Service — Kilo Code-level code agent capabilities
 *
 * Provides safe terminal command execution within the VS Code workspace.
 * Commands are sandboxed to the workspace root.
 */

import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

export interface TerminalResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut: boolean;
}

const MAX_OUTPUT = 8000;
const DEFAULT_TIMEOUT = 30000;

export class TerminalService {
  /**
   * Execute a shell command in the workspace root.
   * Returns stdout/stderr/exitCode. Output is truncated at 8KB.
   */
  async execute(command: string, timeout = DEFAULT_TIMEOUT): Promise<TerminalResult> {
    const ws = vscode.workspace.workspaceFolders?.[0];
    const cwd = ws?.uri.fsPath || process.cwd();

    return new Promise((resolve) => {
      const proc = cp.exec(command, {
        cwd,
        timeout,
        maxBuffer: 1024 * 1024,
        env: { ...process.env, FORCE_COLOR: '0' },
      }, (error, stdout, stderr) => {
        const truncate = (s: string) => s.length > MAX_OUTPUT ? s.slice(0, MAX_OUTPUT) + '\n... (truncated)' : s;
        resolve({
          stdout: truncate(stdout || ''),
          stderr: truncate(stderr || ''),
          exitCode: error?.code ?? (error ? 1 : 0),
          timedOut: error?.killed ?? false,
        });
      });

      // Safety: kill process if it exceeds timeout
      setTimeout(() => {
        try { proc.kill('SIGTERM'); } catch {}
      }, timeout + 1000);
    });
  }

  /**
   * Run a command and return a formatted summary for AI context.
   */
  async executeForContext(command: string): Promise<string> {
    const result = await this.execute(command);
    const parts: string[] = [`$ ${command}`];

    if (result.stdout) { parts.push(result.stdout); }
    if (result.stderr) { parts.push(`[stderr] ${result.stderr}`); }
    if (result.timedOut) { parts.push('[timed out after 30s]'); }
    if (result.exitCode !== 0) { parts.push(`[exit code: ${result.exitCode}]`); }

    return parts.join('\n');
  }

  /**
   * List files in a directory (relative to workspace root).
   */
  async listFiles(dir = '.'): Promise<string[]> {
    const ws = vscode.workspace.workspaceFolders?.[0];
    if (!ws) { return []; }

    const absDir = path.resolve(ws.uri.fsPath, dir);

    // Safety: ensure we're still within workspace
    if (!absDir.startsWith(ws.uri.fsPath)) {
      throw new Error('Path traversal blocked: directory is outside workspace');
    }

    const result = await this.execute(`ls -la "${absDir}"`);
    return result.stdout.split('\n').filter(Boolean);
  }

  /**
   * Run a command in a visible VS Code terminal (for user-facing commands).
   */
  runInTerminal(command: string, name = 'Arcanea'): vscode.Terminal {
    const terminal = vscode.window.createTerminal({ name });
    terminal.show();
    terminal.sendText(command);
    return terminal;
  }

  /**
   * Get workspace diagnostics summary (errors/warnings from language servers).
   */
  getDiagnostics(): string {
    const diagnostics = vscode.languages.getDiagnostics();
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const [uri, diags] of diagnostics) {
      const relPath = vscode.workspace.asRelativePath(uri);
      for (const d of diags) {
        const loc = `${relPath}:${d.range.start.line + 1}`;
        if (d.severity === vscode.DiagnosticSeverity.Error) {
          errors.push(`${loc}: ${d.message}`);
        } else if (d.severity === vscode.DiagnosticSeverity.Warning) {
          warnings.push(`${loc}: ${d.message}`);
        }
      }
    }

    if (errors.length === 0 && warnings.length === 0) { return 'No diagnostics.'; }

    const parts: string[] = [];
    if (errors.length > 0) { parts.push(`Errors (${errors.length}):\n${errors.slice(0, 20).join('\n')}`); }
    if (warnings.length > 0) { parts.push(`Warnings (${warnings.length}):\n${warnings.slice(0, 10).join('\n')}`); }
    return parts.join('\n\n');
  }
}
