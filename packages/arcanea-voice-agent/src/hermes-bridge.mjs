/**
 * Bridge arcanea-agent CLI to Hermes Agent + Arcanea profile + fork desktop.
 */

import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { launchForkDesktop } from "./launch-fork-desktop.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../..");
const PROFILE_LOCAL = join(REPO_ROOT, "profiles", "arcanea-agent");
const PROFILE_GITHUB = "github.com/frankxai/arcanea-agent-profile";
const DEFAULT_FORK =
  process.platform === "win32"
    ? "C:/Users/frank/arcanea-agent"
    : join(homedir(), "arcanea-agent");

function forkRoot() {
  if (
    process.env.ARCANEA_AGENT_FORK_ROOT &&
    existsSync(process.env.ARCANEA_AGENT_FORK_ROOT)
  ) {
    return process.env.ARCANEA_AGENT_FORK_ROOT;
  }
  const manifest = join(homedir(), ".arcanea", "agent-setup.json");
  if (existsSync(manifest)) {
    try {
      const j = JSON.parse(readFileSync(manifest, "utf8"));
      const root =
        j?.layers?.desktop?.hermesRoot ?? j?.layers?.runtime?.forkRoot;
      if (root && existsSync(root)) return root;
    } catch {
      /* ignore */
    }
  }
  return existsSync(DEFAULT_FORK) ? DEFAULT_FORK : null;
}

function run(cmd, args, { inherit = true } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, args, {
      stdio: inherit ? "inherit" : "pipe",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${cmd} exited ${code}`));
    });
  });
}

export async function hermesInstall({ fromGithub = false } = {}) {
  const source =
    fromGithub || !existsSync(PROFILE_LOCAL) ? PROFILE_GITHUB : PROFILE_LOCAL;
  console.log(`[arcanea-agent] Layer 1: installing profile from ${source}`);
  await run("hermes", [
    "profile",
    "install",
    source,
    "--name",
    "arcanea-agent",
    "--alias",
    "--force",
    "-y",
  ]);
  await run("hermes", ["profile", "use", "arcanea-agent"]);
  const root = forkRoot();
  if (root) {
    console.log(`[arcanea-agent] Fork found: ${root}`);
    console.log(
      "[arcanea-agent] Desktop: arcanea-agent desktop  (Arcanea fork shell)",
    );
  } else {
    console.log(
      "[arcanea-agent] No fork at ~/arcanea-agent — desktop uses stock Hermes shell",
    );
  }
  console.log("[arcanea-agent] Chat: arcanea-agent chat");
}

export async function hermesChat(extraArgs = []) {
  await run("hermes", ["-p", "arcanea-agent", "chat", ...extraArgs]);
}

export async function hermesDesktop(extraArgs = []) {
  const root = forkRoot();
  if (root) {
    await launchForkDesktop(root, extraArgs);
    return;
  }
  console.log("[arcanea-agent] No fork — launching stock Hermes desktop");
  await run("hermes", ["-p", "arcanea-agent", "desktop", ...extraArgs]);
}

export function printHelp() {
  console.log(`
Arcanea Agent — three layers

  LAYER 1  Profile     arcanea-agent chat     → hermes -p arcanea-agent chat
  LAYER 2  Fork        github.com/frankxai/arcanea-agent (optional runtime)
  LAYER 3  Desktop UI  arcanea-agent desktop  → fork Electron if ~/arcanea-agent exists

Usage:
  arcanea-agent                    Local HTTP gateway (:7777)
  arcanea-agent chat               Profile chat (Layer 1)
  arcanea-agent desktop            Fork desktop if available, else stock Hermes
  arcanea-agent install            Install/update profile
  arcanea-agent install --github   Profile from GitHub

Truth: "arcanea-agent" is a Hermes profile alias for chat. Desktop branding
requires the fork (frankxai/arcanea-agent) via arcanea-agent desktop.

Docs: https://arcanea.ai/agent
`);
}
