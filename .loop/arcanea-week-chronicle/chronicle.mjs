#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const LOOP_DIR = dirname(fileURLToPath(import.meta.url));
const REPOS_ROOT = join(LOOP_DIR, "..", "..", "..");
const REPORTS_DIR = join(REPOS_ROOT, "..", "queen", "reports");

const TRACKED = [
  "arcanea-ai-app", "arcanea-ecosystem", "arcanea-mcp", "arcanea-onchain",
  "arcanea-studio", "arcanea-agent-skills", "arcanea-orchestrator",
  "arcanea-claw", "AnimeLegends",
];

const today = new Date();
const since = new Date(today);
since.setDate(today.getDate() - 7);
const sinceStr = since.toISOString().slice(0, 10);
const dateStr = today.toISOString().slice(0, 10);

const laneOf = (branch, author) => {
  const b = (branch || "").toLowerCase();
  if (b.includes("codex/")) return "codex";
  if (b.includes("agent/claude")) return "claude";
  if (b.includes("agent/grok")) return "grok";
  if (b.includes("agent/gemini") || b.includes("antigravity")) return "antigravity";
  return (author || "").toLowerCase().includes("claude") ? "claude" : "main";
};

const repos = [];
const embedded = [];
for (const name of TRACKED) {
  const dir = join(REPOS_ROOT, name);
  if (!existsSync(dir)) { repos.push({ repo: name, status: "missing" }); continue; }
  if (!existsSync(join(dir, ".git"))) { embedded.push(name); repos.push({ repo: name, status: "embedded", commits: 0, byLane: {} }); continue; }
  let raw = "";
  try {
    raw = execSync(
      `git -C "${dir}" log --all --since=${sinceStr} --pretty=format:"%h|%an|%ad|%D|%s" --date=short`,
      { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }
    );
  } catch { repos.push({ repo: name, status: "git-error" }); continue; }
  const commits = raw.split(/\r?\n/).filter(Boolean).map((l) => {
    const [hash, author, date, refs, ...subj] = l.split("|");
    const branch = (refs || "").split(",").map((r) => r.trim()).find((r) => r && !r.startsWith("tag:")) || "";
    return { hash, author, date, branch, subject: subj.join("|") };
  });
  const byLane = {};
  for (const c of commits) {
    const lane = laneOf(c.branch, c.author);
    byLane[lane] = byLane[lane] || [];
    byLane[lane].push(c);
  }
  repos.push({ repo: name, status: commits.length ? "active" : "quiet", commits: commits.length, byLane });
}

if (embedded.length) {
  try {
    const top = execSync(`git -C "${REPOS_ROOT}" rev-parse --show-toplevel`, { encoding: "utf8" }).trim();
    for (const name of embedded) {
      const entry = repos.find((r) => r.repo === name);
      let touched = [];
      try {
        touched = execSync(
          `git -C "${top}" log --since=${sinceStr} --pretty=format:"%h|%an|%ad|%s" --date=short -- "repos/${name}"`,
          { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }
        ).split(/\r?\n/).filter(Boolean).map((l) => {
          const [hash, author, date, ...subj] = l.split("|");
          return { hash, author, date, branch: "umbrella", subject: subj.join("|") };
        });
      } catch {}
      entry.commits = touched.length;
      entry.status = touched.length ? "active" : "quiet";
      if (touched.length) entry.byLane = { umbrella: touched };
    }
  } catch {}
}

const lab = join(REPOS_ROOT, "arcanea-ai-app", ".arcanea", "image-lab");
const imageRuns = [];
if (existsSync(lab)) {
  for (const d of readdirSync(lab, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name === "approved") continue;
    const ledger = join(lab, d.name, "ledger.csv");
    if (!existsSync(ledger)) continue;
    const rows = readFileSync(ledger, "utf8").split(/\r?\n/).filter((l) => l.trim()).slice(1);
    const approved = rows.filter((r) => /approved|flagship/i.test(r)).length;
    imageRuns.push({ run: d.name, assets: rows.length, approved });
  }
}

const loopsDir = join(REPOS_ROOT, "arcanea-ai-app", ".loop");
const loopRuns = [];
if (existsSync(loopsDir)) {
  for (const d of readdirSync(loopsDir, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const runsPath = join(loopsDir, d.name, "runs.jsonl");
    if (!existsSync(runsPath)) continue;
    const runs = readFileSync(runsPath, "utf8").split(/\r?\n/).filter((l) => l.trim()).map((l) => {
      try { return JSON.parse(l); } catch { return null; }
    }).filter(Boolean);
    const inWindow = runs.filter((r) => {
      const ts = r.ts || r.timestamp || r.date || "";
      return String(ts).slice(0, 10) >= sinceStr;
    });
    loopRuns.push({ loop: d.name, runs_total: runs.length, runs_this_week: inWindow.length,
      last_verdict: runs.at(-1)?.verdict ?? runs.at(-1)?.gate ?? null });
  }
}

const report = {
  week_ending: dateStr, since: sinceStr, generated: new Date().toISOString(),
  totals: {
    commits: repos.reduce((s, r) => s + (r.commits || 0), 0),
    active_repos: repos.filter((r) => r.status === "active").length,
    quiet_repos: repos.filter((r) => r.status === "quiet").map((r) => r.repo),
    images: imageRuns.reduce((s, r) => s + r.assets, 0),
    images_approved: imageRuns.reduce((s, r) => s + r.approved, 0),
  },
  repos, image_runs: imageRuns, loop_runs: loopRuns,
};

mkdirSync(REPORTS_DIR, { recursive: true });
const jsonPath = join(REPORTS_DIR, `arcanea-week-${dateStr}.json`);
writeFileSync(jsonPath, JSON.stringify(report, null, 2));

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
const laneRows = repos.filter((r) => r.status === "active").flatMap((r) =>
  Object.entries(r.byLane).map(([lane, cs]) =>
    `<tr><td>${esc(r.repo)}</td><td>${esc(lane)}</td><td class="n">${cs.length}</td><td>${esc(cs[0].subject).slice(0, 96)}</td></tr>`
  )
).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Arcanea week ${dateStr}</title>
<style>
body{background:#09090b;color:#e7e7ea;font-family:Geist,Segoe UI,system-ui,sans-serif;margin:0;padding:48px 24px;line-height:1.6}
main{max-width:920px;margin:0 auto}
h1{font-size:28px;font-weight:500;margin:0 0 4px} h2{font-size:18px;font-weight:500;margin:2.5rem 0 1rem;color:#00bcd4}
.sub{color:#8a8a93;font-size:14px;margin-bottom:2rem}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.kpi{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:16px}
.kpi .l{font-size:13px;color:#8a8a93}.kpi .v{font-size:26px;font-weight:500;color:#ffd700}
table{width:100%;border-collapse:collapse;font-size:14px}
td,th{padding:8px 10px;border-bottom:1px solid rgba(255,255,255,.06);text-align:left;vertical-align:top}
th{color:#8a8a93;font-weight:500}.n{text-align:right;color:#00bcd4}
.quiet{color:#8a8a93;font-size:14px}
</style></head><body><main>
<h1>Arcanea — week ending ${dateStr}</h1>
<div class="sub">Everything every agent shipped across the estate, ${report.since} → ${dateStr}. Generated by the arcanea-week-chronicle loop.</div>
<div class="kpis">
<div class="kpi"><div class="l">Commits</div><div class="v">${report.totals.commits}</div></div>
<div class="kpi"><div class="l">Active repos</div><div class="v">${report.totals.active_repos}</div></div>
<div class="kpi"><div class="l">Images generated</div><div class="v">${report.totals.images}</div></div>
<div class="kpi"><div class="l">Canon approved</div><div class="v">${report.totals.images_approved}</div></div>
</div>
<h2>Work by repo and lane</h2>
<table><tr><th>Repo</th><th>Lane</th><th class="n">Commits</th><th>Latest</th></tr>
${laneRows}
</table>
<h2>Image runs</h2>
<table><tr><th>Run</th><th class="n">Assets</th><th class="n">Approved</th></tr>
${imageRuns.map((r) => `<tr><td>${esc(r.run)}</td><td class="n">${r.assets}</td><td class="n">${r.approved}</td></tr>`).join("\n")}
</table>
<h2>Loop activity</h2>
<table><tr><th>Loop</th><th class="n">Runs this week</th><th class="n">Total</th><th>Last verdict</th></tr>
${loopRuns.map((l) => `<tr><td>${esc(l.loop)}</td><td class="n">${l.runs_this_week}</td><td class="n">${l.runs_total}</td><td>${esc(l.last_verdict ?? "—")}</td></tr>`).join("\n")}
</table>
<h2>Quiet repos</h2>
<div class="quiet">${report.totals.quiet_repos.map(esc).join(" · ") || "none"}</div>
</main></body></html>`;

const htmlPath = join(REPORTS_DIR, `arcanea-week-${dateStr}.html`);
writeFileSync(htmlPath, html);
console.log(`chronicle written:\n- ${jsonPath}\n- ${htmlPath}`);
console.log(`totals: ${report.totals.commits} commits, ${report.totals.active_repos} active repos, ${report.totals.images} images (${report.totals.images_approved} approved)`);
