import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

export type AgentRuntime = 'claude' | 'antigravity';

export interface LiveProcess {
  runtime: AgentRuntime;
  name: string;
  pid: number;
  parentPid: number | null;
  executablePath: string | null;
  commandLine: string | null;
}

export interface TranscriptSignal {
  path: string;
  updatedAt: string;
  summary: string | null;
}

export interface WorktreeSignal {
  path: string;
  branch: string;
  head: string | null;
  status: string | null;
  updatedAt: string | null;
}

export interface LiveSurfaceSnapshot {
  timestamp: string;
  host: string;
  repoRoot: string;
  processes: LiveProcess[];
  claude: {
    worktrees: WorktreeSignal[];
    sessions: TranscriptSignal[];
  };
  antigravity: {
    conversations: TranscriptSignal[];
    brains: TranscriptSignal[];
  };
}

export interface LiveSurfaceSummary {
  claude: string[];
  antigravity: string[];
}

const CLAUDE_ROOT = join(homedir(), 'AppData', 'Roaming', 'Claude');
const ANTIGRAVITY_ROOT = join(homedir(), '.gemini', 'antigravity');

function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, ' ').trim();
}

function truncate(input: string, max = 180): string {
  if (input.length <= max) return input;
  return `${input.slice(0, max - 1).trimEnd()}…`;
}

function safeIso(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

async function readTail(path: string, lines = 18): Promise<string[]> {
  try {
    const raw = await fs.readFile(path, 'utf8');
    return raw.split(/\r?\n/).filter(Boolean).slice(-lines);
  } catch {
    return [];
  }
}

function pickNarrative(lines: string[]): string | null {
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i]?.trim();
    if (!line) continue;
    try {
      const parsed = JSON.parse(line) as Record<string, unknown>;
      const candidates = [
        parsed.content,
        parsed.message,
        parsed.prompt,
        parsed.text,
      ];
      for (const candidate of candidates) {
        if (typeof candidate !== 'string') continue;
        const cleaned = normalizeWhitespace(candidate);
        if (cleaned) return truncate(cleaned);
      }
    } catch {
      const cleaned = normalizeWhitespace(line);
      if (cleaned) return truncate(cleaned);
    }
  }
  return null;
}

async function listLatestFiles(root: string, globPattern: string, limit = 5): Promise<Array<{ path: string; updatedAt: string }>> {
  try {
    const output = execFileSync('powershell.exe', [
      '-NoProfile',
      '-Command',
      `Get-ChildItem -Path '${root.replace(/'/g, "''")}' -Recurse -Filter '${globPattern}' -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First ${limit} FullName,LastWriteTime | ConvertTo-Json -Depth 3`,
    ], { encoding: 'utf8', maxBuffer: 1024 * 1024 * 4 }).trim();
    const trimmed = output.trim();
    if (!trimmed) return [];
    const raw = JSON.parse(trimmed) as Array<{ FullName: string; LastWriteTime: string }> | { FullName: string; LastWriteTime: string };
    const entries = Array.isArray(raw) ? raw : [raw];
    return entries.map((entry) => ({
      path: entry.FullName,
      updatedAt: safeIso(entry.LastWriteTime) ?? entry.LastWriteTime,
    }));
  } catch {
    return [];
  }
}

async function walkJsonlSignals(root: string, globPattern: string): Promise<TranscriptSignal[]> {
  const entries = await listLatestFiles(root, globPattern);
  const signals: TranscriptSignal[] = [];
  for (const entry of entries) {
    const lines = await readTail(entry.path);
    signals.push({
      path: entry.path,
      updatedAt: entry.updatedAt,
      summary: pickNarrative(lines),
    });
  }
  return signals;
}

async function walkFileSignals(root: string, globPattern: string): Promise<TranscriptSignal[]> {
  const entries = await listLatestFiles(root, globPattern);
  return entries.map((entry) => ({
    path: entry.path,
    updatedAt: entry.updatedAt,
    summary: null,
  }));
}

async function worktreeSignals(repoRoot: string): Promise<WorktreeSignal[]> {
  try {
    const stdout = execFileSync(
      'git',
      ['worktree', 'list', '--porcelain'],
      { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1024 * 1024 },
    );
    const blocks = stdout.split('\n\n').map((block) => block.trim()).filter(Boolean);
    const entries = blocks.map((block) => {
      const lines = block.split('\n');
      const path = lines.find((line) => line.startsWith('worktree '))?.slice('worktree '.length) ?? '';
      const branch = lines.find((line) => line.startsWith('branch '))?.slice('branch '.length) ?? '(detached)';
      return { path, branch };
    }).filter((entry) => entry.path);

    const relevant = entries.filter((entry) => {
      const normalized = entry.path.replace(/\\/g, '/').toLowerCase();
      return normalized.includes('/.claude/worktrees/');
    });
    const signals: WorktreeSignal[] = [];
    for (const entry of relevant) {
      const head = await gitOutput(repoRoot, ['-C', entry.path, 'rev-parse', '--short', 'HEAD']);
      const status = await gitOutput(repoRoot, ['-C', entry.path, 'status', '--short', '--branch', '--untracked-files=normal']);
      const updatedAt = await statIso(entry.path);
      signals.push({
        path: entry.path,
        branch: entry.branch,
        head: head || null,
        status: status || null,
        updatedAt,
      });
    }
    return signals;
  } catch {
    return [];
  }
}

async function gitOutput(repoRoot: string, args: string[]): Promise<string | null> {
  try {
    const stdout = execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1024 * 1024 });
    const cleaned = stdout.trim();
    return cleaned || null;
  } catch {
    return null;
  }
}

async function statIso(path: string): Promise<string | null> {
  try {
    const stat = await fs.stat(path);
    return stat.mtime.toISOString();
  } catch {
    return null;
  }
}

interface PsProcess {
  Name?: string;
  ProcessId?: number | string;
  ParentProcessId?: number | string;
  ExecutablePath?: string;
  CommandLine?: string;
}

async function processList(): Promise<LiveProcess[]> {
  try {
    const script = `
$targets = 'claude.exe','Antigravity.exe','agy.exe'
Get-CimInstance Win32_Process |
  Where-Object { $targets -contains $_.Name } |
  Select-Object Name,ProcessId,ParentProcessId,ExecutablePath,CommandLine |
  ConvertTo-Json -Depth 4
`;
    const output = execFileSync('powershell.exe', ['-NoProfile', '-Command', script], {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 6,
    }).trim();
    if (!output) return [];
    const raw = JSON.parse(output) as PsProcess[] | PsProcess;
    const rows = Array.isArray(raw) ? raw : [raw];
    return rows.map((row) => {
      const name = row.Name ?? 'unknown';
      const executablePath = row.ExecutablePath ?? null;
      const commandLine = row.CommandLine ?? null;
      return {
        runtime: classifyRuntime(name, executablePath),
        name,
        pid: Number(row.ProcessId ?? 0),
        parentPid: Number(row.ParentProcessId ?? 0),
        executablePath,
        commandLine,
      } as LiveProcess;
    });
  } catch {
    return [];
  }
}

function classifyRuntime(name: string, executablePath: string | null): AgentRuntime {
  const lowerName = name.toLowerCase();
  const lowerPath = executablePath?.toLowerCase() ?? '';
  if (lowerName === 'antigravity.exe' || lowerName === 'agy.exe' || lowerPath.includes('antigravity')) return 'antigravity';
  return 'claude';
}

async function latestSignals(root: string, globPattern: string): Promise<TranscriptSignal[]> {
  return walkJsonlSignals(root, globPattern);
}

export async function collectLiveSurfaceSnapshot(repoRoot = process.cwd()): Promise<LiveSurfaceSnapshot> {
  const [processes, worktrees, claudeSessions, antigravityConversations, antigravityBrains] = await Promise.all([
    processList(),
    worktreeSignals(repoRoot),
    latestSignals(join(CLAUDE_ROOT, 'local-agent-mode-sessions'), 'transcript.jsonl'),
    walkFileSignals(join(ANTIGRAVITY_ROOT, 'conversations'), '*.pb'),
    latestSignals(join(ANTIGRAVITY_ROOT, 'brain'), 'transcript.jsonl'),
  ]);

  return {
    timestamp: new Date().toISOString(),
    host: process.env.COMPUTERNAME ?? process.env.HOSTNAME ?? 'unknown-host',
    repoRoot: resolve(repoRoot),
    processes,
    claude: {
      worktrees,
      sessions: claudeSessions,
    },
    antigravity: {
      conversations: antigravityConversations,
      brains: antigravityBrains,
    },
  };
}

export function summarizeLiveSurface(snapshot: LiveSurfaceSnapshot): LiveSurfaceSummary {
  const claude: string[] = [];
  const antigravity: string[] = [];

  const claudeCli = snapshot.processes.filter((proc) => proc.runtime === 'claude');
  const antigravityCli = snapshot.processes.filter((proc) => proc.runtime === 'antigravity');

  if (claudeCli.length > 0) {
    claude.push(`${claudeCli.length} process${claudeCli.length === 1 ? '' : 'es'} alive`);
  }
  if (snapshot.claude.worktrees.length > 0) {
    const top = snapshot.claude.worktrees[0];
    claude.push(`worktree ${top.branch} @ ${top.path}`);
  }
  const claudeTask = snapshot.claude.sessions.find((entry) => entry.summary);
  if (claudeTask?.summary) {
    claude.push(`latest session: ${claudeTask.summary}`);
  }

  if (antigravityCli.length > 0) {
    antigravity.push(`${antigravityCli.length} process${antigravityCli.length === 1 ? '' : 'es'} alive`);
  }
  const antigravityTask =
    snapshot.antigravity.brains.find((entry) => entry.summary) ??
    snapshot.antigravity.conversations.find((entry) => entry.summary);
  if (antigravityTask?.summary) {
    antigravity.push(`latest activity: ${antigravityTask.summary}`);
  }
  if (snapshot.antigravity.conversations.length > 0) {
    antigravity.push(`conversations: ${snapshot.antigravity.conversations.length}`);
  }

  return { claude, antigravity };
}
