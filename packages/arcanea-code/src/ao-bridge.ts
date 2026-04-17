import { execa } from 'execa';

/**
 * Thin bridge to Composio Agent Orchestrator (`ao` CLI + dashboard at :4200).
 *
 * Designed to degrade gracefully: if AO isn't installed or isn't running, the
 * dispatcher keeps working — swarm and status commands just report the AO
 * side as unavailable instead of erroring.
 */

const AO_API = 'http://localhost:4200';

export interface AOStatus {
  cliInstalled: boolean;
  daemonRunning: boolean;
  sessionCount: number;
  projects: string[];
  hint?: string;
}

export interface AOSession {
  id: string;
  project: string;
  state: string;
  branch?: string;
  pr?: number;
}

async function which(binary: string): Promise<boolean> {
  try {
    const cmd = process.platform === 'win32' ? 'where' : 'which';
    const { exitCode } = await execa(cmd, [binary], { reject: false });
    return exitCode === 0;
  } catch {
    return false;
  }
}

async function fetchJson<T>(url: string, timeoutMs = 1500): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function aoStatus(): Promise<AOStatus> {
  const cliInstalled = await which('ao');
  // Probe known endpoints. Exact shape varies by AO version; we fall back to
  // any 200 response as "daemon is up".
  const sessions = await fetchJson<AOSession[]>(`${AO_API}/api/sessions`);
  const daemonRunning = sessions !== null;

  if (!cliInstalled) {
    return {
      cliInstalled,
      daemonRunning,
      sessionCount: 0,
      projects: [],
      hint: 'Install: pnpm add -g @composio/agent-orchestrator  (or see github.com/composio/agent-orchestrator)',
    };
  }
  if (!daemonRunning) {
    return {
      cliInstalled,
      daemonRunning,
      sessionCount: 0,
      projects: [],
      hint: 'Start: `ao start` (daemon listens on :4200).',
    };
  }

  const projects = [...new Set((sessions ?? []).map((s) => s.project))];
  return {
    cliInstalled,
    daemonRunning,
    sessionCount: sessions?.length ?? 0,
    projects,
  };
}

export async function aoSessions(): Promise<AOSession[]> {
  const data = await fetchJson<AOSession[]>(`${AO_API}/api/sessions`);
  return data ?? [];
}

/**
 * Dispatch a batch of tasks via `ao batch-spawn`. Returns the spawned session
 * IDs parsed from stdout. Does NOT wait for workers to complete.
 */
export async function aoBatchSpawn(taskIds: string[]): Promise<{
  ok: boolean;
  sessionIds: string[];
  stdout: string;
  stderr: string;
}> {
  const cliInstalled = await which('ao');
  if (!cliInstalled) {
    return {
      ok: false,
      sessionIds: [],
      stdout: '',
      stderr: 'ao CLI not installed',
    };
  }

  const result = await execa('ao', ['batch-spawn', ...taskIds], { reject: false });
  const sessionIds = (result.stdout.match(/\b[a-z0-9]{2,}-\d+\b/g) ?? []).slice(0, taskIds.length);
  return {
    ok: result.exitCode === 0,
    sessionIds,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}
