import { readdir, readFile, stat } from "fs/promises";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

type CheckItem = {
  label: string;
  ok: boolean;
  detail?: string;
};

type CheckGroup = {
  name: string;
  items: CheckItem[];
};

type MachineReadinessReport = {
  root: string;
  summary: {
    overall: "READY" | "DEGRADED";
    passed: number;
    failed: number;
  };
  groups: CheckGroup[];
};

type WorktreeEntry = {
  path: string;
  head: string;
  branch: string | null;
  detached: boolean;
  prunable: boolean;
};

type CommandProbe = {
  ok: boolean;
  command: string;
  summary: string;
  raw: string;
};

type RepoRegistryEntry = {
  id: string;
  label: string;
  path: string;
  cli?: string[];
  purpose: string;
  repoMode?: string;
  expectedRemoteHints?: string[];
  smokeCommands?: Array<{
    label: string;
    command: string;
  }>;
};

type RepoHealthEntry = {
  id: string;
  label: string;
  purpose: string;
  path: string;
  cli?: string[];
  branch?: string;
  commit?: string;
  dirty: boolean;
  dirtyFileCount: number;
  repoMode: string;
  status: "ok" | "warn" | "error";
  smokeResults: Array<{
    label: string;
    command: string;
    ok: boolean;
    summary: string;
  }>;
  remotes: Record<string, string>;
};

type LightweightHealth = {
  timestamp: string;
  mode: string;
  source: string;
};

export type InternalOpsDashboardData = {
  generatedAt: string;
  machine: MachineReadinessReport;
  health: LightweightHealth;
  repoSummary: {
    total: number;
    ok: number;
    warn: number;
    error: number;
    dirty: number;
    smokePassed: number;
    smokeFailed: number;
    smokeSkipped: number;
    overall: "healthy" | "degraded";
  };
  repos: RepoHealthEntry[];
  worktrees: WorktreeEntry[];
  orchestrator: {
    help: CommandProbe;
    status: CommandProbe;
  };
  flowBridge: CommandProbe;
  handoffs: Array<{
    name: string;
    path: string;
    updatedAt: string;
  }>;
};

function getProjectRoot() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "../../../../");
}

function sanitizeOutput(value: string) {
  return value
    .replace(/\x1B\[[0-9;]*[A-Za-z]/g, "")
    .replace(/[^\x20-\x7E\r\n\t]/g, "")
    .trim();
}

function summarizeOutput(raw: string, fallback: string) {
  return (
    raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => {
        if (!line) return false;
        if (line === "Welcome, Creator.") return false;
        if (line.includes("Dev Control Center")) return false;
        return true;
      }) || fallback
  );
}

function runCommand(command: string, args: string[], cwd: string): CommandProbe {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    timeout: 40000,
    env: { ...process.env },
    windowsHide: true,
  });

  const raw = sanitizeOutput(`${result.stdout || ""}\n${result.stderr || ""}`);
  const summary = summarizeOutput(
    raw,
    (result.status ?? 1) === 0 ? "ok" : "failed",
  );

  return {
    ok: (result.status ?? 1) === 0,
    command: `${command} ${args.join(" ")}`.trim(),
    summary,
    raw,
  };
}

function parseJson<T>(probe: CommandProbe): T {
  try {
    return JSON.parse(probe.raw) as T;
  } catch (error) {
    throw new Error(
      `Failed to parse JSON from ${probe.command}: ${error instanceof Error ? error.message : "unknown error"}`,
    );
  }
}

function parseWorktrees(output: string): WorktreeEntry[] {
  const blocks = output
    .split(/\r?\n\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    const map = new Map<string, string>();
    for (const line of block.split(/\r?\n/)) {
      const [key, ...rest] = line.split(" ");
      map.set(key, rest.join(" ").trim());
    }

    return {
      path: map.get("worktree") || "",
      head: map.get("HEAD") || "",
      branch: map.get("branch")?.replace("refs/heads/", "") || null,
      detached: map.has("detached"),
      prunable: map.has("prunable"),
    };
  });
}

async function listHandoffDocs(root: string) {
  const opsDir = path.join(root, "docs", "ops");
  const names = await readdir(opsDir);
  const selected = names
    .filter((name) => /HANDOFF|PLAN|PICKUP|SESSION/i.test(name))
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 10);

  const items = await Promise.all(
    selected.map(async (name) => {
      const fullPath = path.join(opsDir, name);
      const info = await stat(fullPath);
      return {
        name,
        path: fullPath,
        updatedAt: info.mtime.toISOString(),
      };
    }),
  );

  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function loadRepoRegistry(root: string) {
  const registryPath = path.join(root, ".arcanea", "projects", "repo-constellation.json");
  const raw = await readFile(registryPath, "utf8");
  const parsed = JSON.parse(raw) as { repos?: RepoRegistryEntry[] };
  return {
    registryPath,
    repos: parsed.repos || [],
  };
}

function collectRepoHealth(root: string, repo: RepoRegistryEntry): RepoHealthEntry {
  const repoPath = path.resolve(root, repo.path);
  const branchProbe = runCommand("git", ["rev-parse", "--abbrev-ref", "HEAD"], repoPath);
  const commitProbe = runCommand("git", ["rev-parse", "HEAD"], repoPath);
  const dirtyProbe = runCommand("git", ["status", "--short"], repoPath);
  const remoteProbe = runCommand("git", ["remote", "-v"], repoPath);

  const existsAsRepo = branchProbe.ok && commitProbe.ok;
  const dirtyLines = dirtyProbe.ok
    ? dirtyProbe.raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    : [];

  const remotes: Record<string, string> = {};
  for (const line of remoteProbe.raw.split(/\r?\n/)) {
    const match = line.trim().match(/^(\S+)\s+(\S+)\s+\((fetch|push)\)$/);
    if (match && !remotes[match[1]]) remotes[match[1]] = match[2];
  }

  return {
    id: repo.id,
    label: repo.label,
    purpose: repo.purpose,
    path: repoPath,
    cli: repo.cli || [],
    branch: existsAsRepo ? branchProbe.raw : undefined,
    commit: existsAsRepo ? commitProbe.raw : undefined,
    dirty: dirtyLines.length > 0,
    dirtyFileCount: dirtyLines.length,
    repoMode: repo.repoMode || "standalone",
    status: !existsAsRepo ? "error" : dirtyLines.length > 0 ? "warn" : "ok",
    smokeResults: (repo.smokeCommands || []).map((command) => ({
      label: command.label,
      command: command.command,
      ok: true,
      summary: "configured",
    })),
    remotes,
  };
}

export async function getInternalOpsDashboardData(): Promise<InternalOpsDashboardData> {
  const root = getProjectRoot();
  const nodeBinary = process.execPath;

  const machineProbe = runCommand(
    nodeBinary,
    [path.join(root, "scripts", "machine-readiness-check.js"), "--json"],
    root,
  );
  const machine = parseJson<MachineReadinessReport>(machineProbe);

  const registry = await loadRepoRegistry(root);
  const repos = registry.repos.map((repo) => collectRepoHealth(root, repo));

  const worktreeProbe = runCommand("git", ["worktree", "list", "--porcelain"], root);
  const orchestratorRoot = path.join(root, "arcanea-orchestrator");
  const orchestratorHelp = runCommand(
    nodeBinary,
    [path.join(orchestratorRoot, "packages", "cli", "dist", "index.js"), "--help"],
    orchestratorRoot,
  );
  const orchestratorStatus = runCommand(
    nodeBinary,
    [path.join(orchestratorRoot, "packages", "cli", "dist", "index.js"), "status"],
    orchestratorRoot,
  );
  const flowBridge = runCommand(
    "powershell",
    [
      "-NoLogo",
      "-NoProfile",
      "-Command",
      `. '${path.join(process.env.USERPROFILE || "", "Documents", "WindowsPowerShell", "Microsoft.PowerShell_profile.ps1")}'; arcanea-flow ao --dry-run status`,
    ],
    root,
  );
  const handoffs = await listHandoffDocs(root);

  const ok = repos.filter((repo) => repo.status === "ok").length;
  const warn = repos.filter((repo) => repo.status === "warn").length;
  const error = repos.filter((repo) => repo.status === "error").length;
  const dirty = repos.filter((repo) => repo.dirty).length;
  const smokeConfigured = repos.reduce(
    (sum, repo) => sum + repo.smokeResults.length,
    0,
  );

  return {
    generatedAt: new Date().toISOString(),
    machine,
    health: {
      timestamp: new Date().toISOString(),
      mode: "registry+git+machine",
      source: registry.registryPath,
    },
    repoSummary: {
      total: repos.length,
      ok,
      warn,
      error,
      dirty,
      smokePassed: 0,
      smokeFailed: 0,
      smokeSkipped: smokeConfigured,
      overall: warn > 0 || error > 0 ? "degraded" : "healthy",
    },
    repos,
    worktrees: parseWorktrees(worktreeProbe.raw),
    orchestrator: {
      help: orchestratorHelp,
      status: orchestratorStatus,
    },
    flowBridge,
    handoffs,
  };
}

const internalOpsDashboard = {
  getInternalOpsDashboardData,
};

export default internalOpsDashboard;
