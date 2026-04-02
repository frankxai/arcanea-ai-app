#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { SIS_VAULT_NAMES, validateCanonicalSisEntry } from "./sis-schema.mjs";

const sisRoot = process.env.STARLIGHT_HOME || join(homedir(), ".starlight");

function parseJsonl(path) {
  if (!existsSync(path)) return [];
  const raw = readFileSync(path, "utf8").trim();
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        return { entry: JSON.parse(line), line: index + 1 };
      } catch (error) {
        return { entry: null, line: index + 1, parseError: error instanceof Error ? error.message : String(error) };
      }
    });
}

const errors = [];
const warnings = [];
const counts = {};

for (const vault of SIS_VAULT_NAMES) {
  const path = join(sisRoot, "vaults", `${vault}.jsonl`);
  const rows = parseJsonl(path);
  counts[vault] = rows.length;

  for (const row of rows) {
    if (row.parseError) {
      errors.push(`${vault}.jsonl line ${row.line}: invalid JSON (${row.parseError})`);
      continue;
    }
    const result = validateCanonicalSisEntry(vault, row.entry);
    for (const error of result.errors) {
      errors.push(`${vault}.jsonl line ${row.line}: ${error}`);
    }
    for (const warning of result.warnings) {
      warnings.push(`${vault}.jsonl line ${row.line}: ${warning}`);
    }
  }
}

if (errors.length > 0) {
  console.error("SIS schema check failed.");
  for (const error of errors) {
    console.error(error);
  }
  process.exit(1);
}

console.log("SIS schema check passed.");
console.log(
  JSON.stringify(
    {
      sisRoot,
      vaultCounts: counts,
      warningCount: warnings.length,
      warnings,
    },
    null,
    2,
  ),
);
