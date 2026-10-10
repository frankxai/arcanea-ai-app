/**
 * Launch Arcanea fork Electron directly (Arcanea Studio UI).
 * Stock `hermes desktop` packages Nous Hermes.exe — not the fork renderer.
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export function forkDesktopDir(forkRoot) {
  return join(forkRoot, "apps", "desktop");
}

export function arcaneaElectronUserData() {
  if (process.platform === "win32") {
    return join(
      process.env.APPDATA || join(homedir(), "AppData", "Roaming"),
      "Arcanea Agent",
    );
  }
  if (process.platform === "darwin") {
    return join(homedir(), "Library", "Application Support", "Arcanea Agent");
  }
  return join(homedir(), ".config", "Arcanea Agent");
}

/** Pin desktop backend to arcanea-agent profile (replaces brittle HERMES_HOME env). */
export function ensureArcaneaDesktopProfile() {
  const userData = arcaneaElectronUserData();
  mkdirSync(userData, { recursive: true });
  writeFileSync(
    join(userData, "active-profile.json"),
    `${JSON.stringify({ profile: "arcanea-agent" }, null, 2)}\n`,
    "utf8",
  );
  return userData;
}

export async function launchForkDesktop(forkRoot, extraArgs = []) {
  const desktopDir = forkDesktopDir(forkRoot);
  if (!existsSync(join(desktopDir, "package.json"))) {
    throw new Error(`Fork desktop not found: ${desktopDir}`);
  }

  ensureArcaneaDesktopProfile();

  const env = {
    ...process.env,
    ARCANEA_AGENT_FORK_ROOT: forkRoot,
    HERMES_DESKTOP_CWD: process.cwd(),
  };
  // Fork UI only — backend from stock `hermes` on PATH. Never point HERMES_HOME or
  // HERMES_DESKTOP_HERMES_ROOT at the fork (no Python venv → backend timeout).
  delete env.HERMES_DESKTOP_HERMES_ROOT;
  delete env.HERMES_HOME;

  if (!existsSync(join(desktopDir, "dist", "index.html"))) {
    console.log("[arcanea-agent] Building fork desktop dist...");
    await runNpm(["run", "build"], desktopDir, env);
  }

  console.log(`[arcanea-agent] Launching Arcanea Agent from ${desktopDir}`);
  await runNpm(["exec", "--", "electron", ".", ...extraArgs], desktopDir, env);
}

function runNpm(args, cwd, env) {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  return new Promise((resolve, reject) => {
    const child = spawn(npm, args, {
      cwd,
      env,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`npm ${args.join(" ")} exited ${code}`));
    });
  });
}
