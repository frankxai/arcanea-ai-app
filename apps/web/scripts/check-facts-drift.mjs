#!/usr/bin/env node
/**
 * check-facts-drift — keeps every public number Arcanea claims tied to one source.
 *
 * Why: the site once claimed 13, 16, and 7 agents — and 42, 43, 80, 97, and
 * 160 tools/skills — at the same time, on different pages. Numbers drift the
 * moment they are typed twice.
 *
 * Three independent checks, because the drift arrives three different ways:
 *
 *   1. FACTS provenance — every FACTS entry whose doc comment names a code
 *      source is recounted from that source. facts.ts is the SSOT only if
 *      something recounts it; otherwise it is one more place a number rots.
 *   2. Source drift — a claim-shaped literal under app/ or components/ must be
 *      an import from lib/facts.ts (or lib/public-repo-registry.ts).
 *   3. Asset consistency — llms.txt, llms-full.txt, ai-plugin.json and
 *      messages/en.json cannot import anything, so their literals are compared
 *      against the resolved value and fail when they disagree. These are the
 *      files agents read; they were previously unscanned entirely.
 *
 * Usage: node apps/web/scripts/check-facts-drift.mjs [--strict]
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const WEB_ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const REPO_ROOT = join(WEB_ROOT, "..", "..");

const findings = [];
const report = (kind, where, message) => findings.push({ kind, where, message });

// ---------------------------------------------------------------------------
// Resolve the values every surface must agree with.
// ---------------------------------------------------------------------------

function readOptional(path) {
  return existsSync(path) ? readFileSync(path, "utf-8") : null;
}

function parseFacts() {
  const src = readFileSync(join(WEB_ROOT, "lib", "facts.ts"), "utf-8");
  const values = {};
  for (const m of src.matchAll(/^\s*(\w+):\s*(\d+),/gm)) values[m[1]] = Number(m[2]);
  return values;
}

/**
 * Count the top-level keys of the object literal a declaration opens, by
 * bracket depth. Regex-per-line counting would also match the nested objects
 * inside each entry, which is how a count like this silently inflates.
 */
function countRecordKeys(src, declaration) {
  const start = src.indexOf(declaration);
  if (start === -1) return null;
  const body = src.slice(start);
  const open = body.indexOf("{");
  if (open === -1) return null;
  let depth = 0;
  let keys = 0;
  for (let i = open; i < body.length; i++) {
    const ch = body[i];
    if (ch === "{" || ch === "[") depth++;
    else if (ch === "}" || ch === "]") {
      depth--;
      if (depth === 0) break;
    } else if (depth === 1 && (ch === "'" || ch === '"')) {
      const close = body.indexOf(ch, i + 1);
      if (close === -1) break;
      if (/^\s*:/.test(body.slice(close + 1))) keys++;
      i = close;
    } else if (depth === 1 && /[A-Za-z_]/.test(ch) && !/[A-Za-z0-9_$]/.test(body[i - 1] ?? " ")) {
      const rest = body.slice(i);
      const m = /^[A-Za-z_][A-Za-z0-9_$]*\s*:/.exec(rest);
      if (m) {
        keys++;
        i += m[0].length - 1;
      }
    }
  }
  return keys;
}

const FACTS = parseFacts();

const luminorConfig = readOptional(join(WEB_ROOT, "lib", "luminors", "config.ts"));
const loaderSrc = readOptional(join(WEB_ROOT, "lib", "content", "loader.ts"));
const mcpIndex = readOptional(join(REPO_ROOT, "packages", "arcanea-mcp", "src", "index.ts"));
const skillsDir = join(REPO_ROOT, "packages", "arcanea-skills", "skills");

/**
 * Recount the FACTS entries whose doc comment names a code source. The canon
 * entries (guardians, gates, elements, wisdoms, teams) have no code to count
 * and are deliberately left unverified rather than fitted to whatever the code
 * happens to contain.
 */
function verifyFactsProvenance() {
  // A missing or unreadable source is reported, never skipped — a check that
  // quietly drops itself when its input moves is worse than no check.
  const checks = [
    {
      key: "luminors",
      source: "apps/web/lib/luminors/config.ts (LUMINORS entries)",
      actual: luminorConfig === null ? null : countRecordKeys(luminorConfig, "export const LUMINORS"),
    },
    {
      key: "mcpTools",
      source: "packages/arcanea-mcp/src/index.ts (unique registerTool names)",
      actual:
        mcpIndex === null
          ? null
          : new Set([...mcpIndex.matchAll(/server\.registerTool\(\s*["']([^"']+)["']/g)].map((m) => m[1])).size,
    },
    {
      key: "skills",
      source: "packages/arcanea-skills/skills/",
      actual: existsSync(skillsDir)
        ? readdirSync(skillsDir, { withFileTypes: true }).filter((e) => e.isDirectory()).length
        : null,
    },
  ];

  for (const { key, source, actual } of checks) {
    if (!actual) {
      report("provenance", "apps/web/lib/facts.ts", `cannot recount FACTS.${key} from ${source} — the source moved or the shape changed, so the number is unguarded`);
      continue;
    }
    if (FACTS[key] !== actual) {
      report("provenance", "apps/web/lib/facts.ts", `FACTS.${key} = ${FACTS[key]} but ${source} has ${actual}`);
    }
  }
}

/** Collections are owned by loader.ts, not facts.ts — count the array itself, not the whole file. */
function countCollections() {
  if (loaderSrc === null) return null;
  const start = loaderSrc.indexOf("export const COLLECTIONS");
  if (start === -1) return null;
  const end = loaderSrc.indexOf("\n];", start);
  if (end === -1) return null;
  return [...loaderSrc.slice(start, end).matchAll(/^\s+slug:\s*['"][^'"]+['"]/gm)].length || null;
}

const collectionsCount = countCollections();

/**
 * Package and repo counts come from .arcanea/config/repos.json, the same file
 * lib/public-repo-registry.ts imports. Only the two derivations with a single
 * unambiguous definition are reproduced here: the union of published package
 * names, and the range a repo count must fall inside (public ≤ claim ≤ tracked).
 * Reimplementing statusFor()/ROLE_GROUP would create a second copy of the logic
 * that can itself drift.
 */
function resolveRepoConfig() {
  const raw = readOptional(join(REPO_ROOT, ".arcanea", "config", "repos.json"));
  if (!raw) return { packages: null, repoRange: null };
  const repos = JSON.parse(raw).repos ?? [];
  const publicRepos = repos.filter(
    (r) => typeof r.publicUrl === "string" && r.publicUrl.startsWith("https://github.com/"),
  );
  return {
    packages: new Set(repos.flatMap((r) => r.publishes ?? [])).size || null,
    repoRange: repos.length ? { min: publicRepos.length, max: repos.length } : null,
  };
}

const REPO_CONFIG = resolveRepoConfig();

const RESOLVED = {
  "FACTS.luminors": FACTS.luminors,
  "FACTS.guardians": FACTS.guardians,
  "FACTS.gates": FACTS.gates,
  "FACTS.elements": FACTS.elements,
  "FACTS.wisdoms": FACTS.wisdoms,
  "FACTS.teams": FACTS.teams,
  "FACTS.mcpTools": FACTS.mcpTools,
  "FACTS.skills": FACTS.skills,
  "COLLECTIONS.length": collectionsCount,
  "PUBLIC_REPO_SUMMARY.packages": REPO_CONFIG.packages,
  PUBLIC_REPO_SUMMARY: REPO_CONFIG.repoRange,
};

// ---------------------------------------------------------------------------
// Claim-shaped patterns.
// ---------------------------------------------------------------------------

const WORD_NUMBERS = {
  two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
};
const WORD_ALT = Object.keys(WORD_NUMBERS).join("|");

/**
 * `hint` names the value the surface must read. `value` is null for claims with
 * no resolvable source (word counts) — those are reported as drift in source
 * files but cannot be consistency-checked in assets.
 */
const PATTERNS = [
  { re: new RegExp(`\\b(\\d{1,3})\\+?\\s+(?:specialist agents?|specialists|configured specialist|AI specialists|AI personalities|AI companions|companions)\\b`, "gi"), hint: "FACTS.luminors" },
  { re: /\b(\d{1,3})\s+Luminors\b/g, hint: "FACTS.luminors" },
  { re: new RegExp(`\\b(${WORD_ALT})\\s+Luminors\\b`, "gi"), hint: "FACTS.luminors" },
  { re: /\b(\d{1,3})\+?\s+(?:MCP\s+)?tools\b/gi, hint: "FACTS.mcpTools" },
  { re: /\b(\d{1,3})\+?\s+(?:creator\s+)?skills\b/gi, hint: "FACTS.skills" },
  // Commands are not skills — no owner exists yet, so this is listed but never
  // asserted against. Claiming a false contradiction is worse than none.
  { re: /\b(\d{1,3})\+?\s+(?:slash\s+)?commands\b/gi, hint: "a counted source (none owns this yet)", value: null },
  { re: /\b(\d{1,3})\s+(?:npm\s+)?packages\b/gi, hint: "PUBLIC_REPO_SUMMARY.packages" },
  { re: /\b(\d{1,3})\s+(?:public\s+|active\s+)?repos(?:itories)?\b/gi, hint: "PUBLIC_REPO_SUMMARY" },

  // Collection counts — /docs, /library, /glossary and /ecosystem each typed
  // their own; the previous check had no pattern for them at all.
  { re: /\b(\d{1,3})\+?\s+collections\b/gi, hint: "COLLECTIONS.length" },
  { re: new RegExp(`\\b(${WORD_ALT})\\s+collections\\b`, "gi"), hint: "COLLECTIONS.length" },

  // The Ten Gates and Ten Guardians are proper nouns, not counts — they have
  // never drifted and rewriting them as interpolations would damage the prose.
  // Deliberately not patterned.

  // Word counts. No resolvable owner yet — reported so they cannot be typed a
  // ninth time, and so the burn-down list names every file a generator has to
  // replace.
  { re: /\b(\d{1,3}(?:,\d{3})+)\+?\s+words\b/gi, hint: "a generated word count", value: null },
  { re: /\b(\d{1,4})\s?[Kk]\+?\s+words\b/g, hint: "a generated word count", value: null },
];

function claimValue(raw) {
  const key = String(raw).toLowerCase();
  if (key in WORD_NUMBERS) return WORD_NUMBERS[key];
  const n = Number(String(raw).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

// ---------------------------------------------------------------------------
// Check 2 — source drift under app/ and components/.
// ---------------------------------------------------------------------------

// Historical/editorial content may cite numbers as of their publish date.
const EXEMPT = [
  ["app", "blog"],
  ["app", "changelog"],
  ["app", "api"],
].map((p) => p.join(sep));

function scanSource(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const rel = relative(WEB_ROOT, p);
    if (EXEMPT.some((e) => rel.startsWith(e))) continue;
    if (statSync(p).isDirectory()) {
      scanSource(p);
      continue;
    }
    if (!/\.(tsx|ts)$/.test(entry) || /\.(test|spec)\./.test(entry)) continue;
    readFileSync(p, "utf-8")
      .split("\n")
      .forEach((line, i) => {
        // Template-literal interpolations of the resolved values are the fix, not drift.
        if (line.includes("FACTS.") || line.includes("PUBLIC_REPO_SUMMARY") || line.includes("COLLECTIONS.length")) return;
        // `facts-ok` annotates numbers that are contextually correct (skill-tree nodes, per-request caps).
        if (line.includes("facts-ok")) return;
        if (/^\s*(\/\/|\/?\*)/.test(line)) return; // comments
        for (const { re, hint } of PATTERNS) {
          re.lastIndex = 0;
          const m = re.exec(line);
          if (m) {
            report("source", `${rel}:${i + 1}`, `"${m[0]}" → read ${hint}`);
            break;
          }
        }
      });
  }
}

// ---------------------------------------------------------------------------
// Check 3 — asset consistency for the files agents read.
// ---------------------------------------------------------------------------

const ASSETS = [
  join("public", "llms.txt"),
  join("public", "llms-full.txt"),
  join("public", ".well-known", "ai-plugin.json"),
  join("messages", "en.json"),
];

function scanAssets() {
  for (const rel of ASSETS) {
    const src = readOptional(join(WEB_ROOT, rel));
    if (src === null) {
      report("asset", rel, "expected public surface is missing — the check would silently pass without it");
      continue;
    }
    src.split("\n").forEach((line, i) => {
      for (const pattern of PATTERNS) {
        const { re, hint } = pattern;
        // Patterns declared with `value: null` have no resolvable owner, so an
        // asset literal cannot be checked against anything. Skipping them here
        // is the only place this check is allowed to stay silent.
        const expected = "value" in pattern ? null : RESOLVED[hint];
        if (expected === undefined || expected === null) continue;
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(line)) !== null) {
          const claimed = claimValue(m[1]);
          if (claimed === null) continue;
          if (typeof expected === "number") {
            if (claimed !== expected) {
              report("asset", `${rel}:${i + 1}`, `"${m[0].trim()}" contradicts ${hint} = ${expected}`);
            }
          } else if (claimed < expected.min || claimed > expected.max) {
            report("asset", `${rel}:${i + 1}`, `"${m[0].trim()}" is outside every reading of ${hint} (${expected.min}–${expected.max} in .arcanea/config/repos.json)`);
          }
        }
      }
    });
  }
}

// ---------------------------------------------------------------------------

verifyFactsProvenance();
if (!collectionsCount) {
  report("provenance", "apps/web/lib/content/loader.ts", "cannot count COLLECTIONS entries — collection claims are unguarded");
}
if (!REPO_CONFIG.packages) {
  report("provenance", ".arcanea/config/repos.json", "cannot resolve published package names — package and repo claims are unguarded");
}
[join(WEB_ROOT, "app"), join(WEB_ROOT, "components")].forEach(scanSource);
scanAssets();

const strict = process.argv.includes("--strict");
const ORDER = ["provenance", "asset", "source"];
const LABEL = {
  provenance: "FACTS provenance — the SSOT disagrees with the code it cites",
  asset: "Asset consistency — an agent-facing file states a number that is false",
  source: "Source drift — a claim typed as a literal instead of imported",
};

if (findings.length) {
  console.error(`\nFacts drift: ${findings.length} finding(s).\n`);
  for (const kind of ORDER) {
    const group = findings.filter((f) => f.kind === kind);
    if (!group.length) continue;
    console.error(`${LABEL[kind]} (${group.length})`);
    for (const f of group) console.error(`  ${f.where}  ${f.message}`);
    console.error("");
  }
  console.error("Import the value from lib/facts.ts / lib/public-repo-registry.ts instead of typing it.");
  if (strict) process.exit(1);
  console.error("\n(advisory mode — pass --strict to fail the build once the long tail is burned down)");
  process.exit(0);
}
console.log("Facts drift: clean — FACTS matches its sources, and no surface contradicts it.");
