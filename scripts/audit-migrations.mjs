#!/usr/bin/env node
/**
 * Baseline-aware Supabase migration audit.
 *
 * Fails on new high-severity findings. Existing findings are recorded in a
 * baseline by fingerprint so the repository can ratchet down without blocking
 * every PR on legacy debt.
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const RANK = { high: 3, medium: 2, low: 1 };

function lineOf(source, index) {
  return source.slice(0, index).split("\n").length;
}

export function scanSql(source, file) {
  const findings = [];
  const add = (rule, severity, index, message) => {
    findings.push({
      rule,
      severity,
      file,
      line: lineOf(source, index),
      message,
    });
  };

  for (const match of source.matchAll(
    /^\s*(drop\s+(table|schema|column)|truncate\b|delete\s+from)/gim,
  )) {
    add(
      "destructive-statement",
      "high",
      match.index ?? 0,
      "Destructive statement",
    );
  }

  for (const match of source.matchAll(
    /create\s+policy[\s\S]{0,400}?(using|with\s+check)\s*\(\s*true\s*\)/gi,
  )) {
    add("policy-allows-everyone", "high", match.index ?? 0, "Policy uses true");
  }

  for (const match of source.matchAll(
    /grant\b[^;]{0,300}\bto\b[^;]{0,120}\banon\b/gi,
  )) {
    const statement = match[0].replace(/\s+/g, " ").slice(0, 100);
    add("grant-to-anon", "high", match.index ?? 0, `Anon grant: ${statement}`);
  }

  for (const chunk of source
    .split(/create\s+(?:or\s+replace\s+)?function/gi)
    .slice(1)) {
    const end = chunk.indexOf("$$;");
    const body = end >= 0 ? chunk.slice(0, end) : chunk;
    if (/security\s+definer/i.test(body) && !/set\s+search_path/i.test(body)) {
      const header = chunk.slice(0, 90).replace(/\s+/g, " ").trim();
      add(
        "security-definer-no-search-path",
        "high",
        Math.max(0, source.indexOf(chunk)),
        `Definer without search_path: ${header}`,
      );
    }
  }

  const doBlockTables = new Set();
  for (const match of source.matchAll(
    /foreach\s+\w+\s+in\s+array\s+array\s*\[([\s\S]*?)\]/gi,
  )) {
    for (const name of match[1].matchAll(/'([^']+)'/g))
      doBlockTables.add(name[1]);
  }

  for (const match of source.matchAll(
    /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:[a-zA-Z_][a-zA-Z0-9_]*\.)?["']?([a-zA-Z0-9_]+)["']?/gi,
  )) {
    const table = match[1];
    if (
      doBlockTables.has(table) &&
      /enable\s+row\s+level\s+security/i.test(source)
    )
      continue;
    const escaped = table.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rls = new RegExp(
      `alter\\s+table\\s+(?:[a-zA-Z_][a-zA-Z0-9_]*\\.)?["']?${escaped}["']?\\s+enable\\s+row\\s+level\\s+security`,
      "i",
    );
    if (!rls.test(source)) {
      add(
        "table-without-rls",
        "high",
        match.index ?? 0,
        `Table without RLS: ${table}`,
      );
    }
  }

  return findings;
}

export function scanPaths(paths) {
  const findings = [];
  let files = 0;
  const walk = (path) => {
    const info = statSync(path);
    if (info.isDirectory()) {
      for (const entry of readdirSync(path)) {
        if (["node_modules", ".git", ".next"].includes(entry)) continue;
        walk(join(path, entry));
      }
      return;
    }
    if (!path.endsWith(".sql")) return;
    files += 1;
    findings.push(
      ...scanSql(readFileSync(path, "utf8"), relative(process.cwd(), path)),
    );
  };
  for (const path of paths) walk(path);
  return { files, findings };
}

export function fingerprint(finding) {
  return `${finding.rule}|${finding.file}|${finding.message}`;
}

function main() {
  const args = process.argv.slice(2);
  const baselineIndex = args.indexOf("--baseline");
  const baselinePath = baselineIndex >= 0 ? args[baselineIndex + 1] : "";
  const writeIndex = args.indexOf("--write-baseline");
  const writePath = writeIndex >= 0 ? args[writeIndex + 1] : "";
  const failIndex = args.indexOf("--fail-on");
  const failOn = failIndex >= 0 ? args[failIndex + 1] : "high";
  const paths = args.filter(
    (arg, index) =>
      !arg.startsWith("--") &&
      args[index - 1] !== "--baseline" &&
      args[index - 1] !== "--write-baseline" &&
      args[index - 1] !== "--fail-on",
  );

  if (!paths.length) {
    console.error(
      "usage: audit-migrations.mjs <sql-dir>... [--baseline file] [--write-baseline file]",
    );
    process.exit(2);
  }

  const { files, findings } = scanPaths(paths);
  if (writePath) {
    const fingerprints = [...new Set(findings.map(fingerprint))].sort();
    writeFileSync(
      writePath,
      `${JSON.stringify({ generatedFor: paths, fingerprints }, null, 2)}\n`,
    );
    console.log(
      `Wrote ${fingerprints.length} baseline fingerprints to ${writePath}`,
    );
    return;
  }

  const baseline = baselinePath
    ? new Set(JSON.parse(readFileSync(baselinePath, "utf8")).fingerprints ?? [])
    : new Set();
  const threshold = failOn === "none" ? 0 : (RANK[failOn] ?? 3);
  const newFindings = findings.filter(
    (finding) =>
      RANK[finding.severity] >= threshold &&
      !baseline.has(fingerprint(finding)),
  );
  const known = findings.filter((finding) =>
    baseline.has(fingerprint(finding)),
  ).length;

  console.log(
    `Scanned ${files} SQL files: ${findings.length} findings, ${known} baselined.`,
  );
  for (const finding of newFindings.slice(0, 20)) {
    console.log(
      `  ${finding.severity} ${finding.rule} ${finding.file}:${finding.line} ${finding.message}`,
    );
  }
  if (newFindings.length > 20)
    console.log(`  ... and ${newFindings.length - 20} more`);
  if (newFindings.length) process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
