#!/usr/bin/env node
/**
 * Baseline-aware Supabase migration audit.
 *
 * Fails on new high-severity findings. Existing findings are recorded in a
 * baseline by fingerprint so the repository can ratchet down without blocking
 * every PR on legacy debt.
 *
 * The scan is static: it reads SQL text, not a live database. A runtime denial
 * test belongs beside the migration it proves.
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const RANK = { high: 3, medium: 2, low: 1 };

function lineOf(source, index) {
  return source.slice(0, index).split("\n").length;
}

/**
 * Replace comments with spaces, preserving length and newlines.
 *
 * Without this a comment containing `alter table ... enable row level security`
 * makes an unprotected table look protected, and a commented-out grant becomes a
 * finding. Single-quoted strings and dollar-quoted bodies are preserved so a
 * `--` inside a literal is not mistaken for a comment.
 */
export function maskSqlComments(source) {
  let out = "";
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];

    if (ch === "-" && next === "-") {
      while (i < source.length && source[i] !== "\n") {
        out += " ";
        i += 1;
      }
      continue;
    }

    if (ch === "/" && next === "*") {
      out += "  ";
      i += 2;
      while (
        i < source.length &&
        !(source[i] === "*" && source[i + 1] === "/")
      ) {
        out += source[i] === "\n" ? "\n" : " ";
        i += 1;
      }
      if (i < source.length) {
        out += "  ";
        i += 2;
      }
      continue;
    }

    if (ch === "'") {
      out += ch;
      i += 1;
      while (i < source.length) {
        if (source[i] === "'" && source[i + 1] === "'") {
          out += "''";
          i += 2;
          continue;
        }
        out += source[i];
        if (source[i] === "'") {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }

    const dollar = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(source.slice(i));
    if (dollar) {
      const tag = dollar[0];
      const close = source.indexOf(tag, i + tag.length);
      const end = close === -1 ? source.length : close + tag.length;
      out += source.slice(i, end);
      i = end;
      continue;
    }

    out += ch;
    i += 1;
  }
  return out;
}

/** Index of the semicolon ending the statement, skipping quoted bodies. */
function statementEnd(text) {
  let i = 0;
  while (i < text.length) {
    if (text[i] === "'") {
      i += 1;
      while (i < text.length) {
        if (text[i] === "'" && text[i + 1] === "'") {
          i += 2;
          continue;
        }
        if (text[i] === "'") {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }
    const dollar = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(text.slice(i));
    if (dollar) {
      const tag = dollar[0];
      const close = text.indexOf(tag, i + tag.length);
      if (close === -1) return text.length;
      i = close + tag.length;
      continue;
    }
    if (text[i] === ";") return i;
    i += 1;
  }
  return text.length;
}

function policyName(statement) {
  const match = /policy\s+(?:"([^"]+)"|'([^']+)'|([A-Za-z0-9_]+))/i.exec(
    statement,
  );
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? "unnamed";
}

/**
 * Blank the inside of string and dollar-quoted bodies, keeping delimiters and
 * newlines. Used for DDL checks: a body comment that mentions `set search_path`
 * must not make an unpinned definer function look safe.
 */
function maskQuotedBodies(text) {
  let out = "";
  let i = 0;
  while (i < text.length) {
    if (text[i] === "'") {
      out += "'";
      i += 1;
      while (i < text.length) {
        if (text[i] === "'" && text[i + 1] === "'") {
          out += "  ";
          i += 2;
          continue;
        }
        if (text[i] === "'") {
          out += "'";
          i += 1;
          break;
        }
        out += text[i] === "\n" ? "\n" : " ";
        i += 1;
      }
      continue;
    }
    const dollar = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(text.slice(i));
    if (dollar) {
      const tag = dollar[0];
      const close = text.indexOf(tag, i + tag.length);
      if (close === -1) {
        out += tag + " ".repeat(text.length - i - tag.length);
        i = text.length;
        continue;
      }
      out += tag;
      out += text.slice(i + tag.length, close).replace(/[^\n]/g, " ");
      out += tag;
      i = close + tag.length;
      continue;
    }
    out += text[i];
    i += 1;
  }
  return out;
}

export function scanSql(source, file) {
  const code = maskSqlComments(source);
  const findings = [];
  const add = (rule, severity, index, message) => {
    findings.push({ rule, severity, file, line: lineOf(code, index), message });
  };

  // `drop`/`truncate`/`delete`, plus the column and constraint drops that hide
  // inside ALTER TABLE.
  for (const match of code.matchAll(
    /^\s*(drop\s+(table|schema|column)|truncate\b|delete\s+from)|alter\s+table[^;]{0,300}?\bdrop\s+(column|constraint)\b/gim,
  )) {
    const statement = code
      .slice(
        match.index ?? 0,
        statementEnd(code.slice(match.index ?? 0)) + (match.index ?? 0),
      )
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120);
    add(
      "destructive-statement",
      "high",
      match.index ?? 0,
      `Destructive statement: ${statement}`,
    );
  }

  // Read the whole policy statement, not a fixed window: a long column list can
  // push `using (true)` past any character budget.
  for (const start of code.matchAll(/(?:create|alter)\s+policy\s+/gi)) {
    const index = start.index ?? 0;
    const statement = code.slice(
      index,
      index + statementEnd(code.slice(index)),
    );
    if (!/(using|with\s+check)\s*\(\s*true\s*\)/i.test(statement)) continue;
    add(
      "policy-allows-everyone",
      "high",
      index,
      `Policy "${policyName(statement)}" uses true`,
    );
  }

  const viewsCreated = new Set(
    [
      ...code.matchAll(
        /create\s+(?:or\s+replace\s+)?view\s+(?:[A-Za-z_][A-Za-z0-9_]*\.)?["']?([A-Za-z0-9_]+)["']?/gi,
      ),
    ].map((match) => match[1].toLowerCase()),
  );

  // Exempting a view is an explicit review decision, recorded in the migration
  // as `-- audit: public-view <name>`. Without the marker the grant is reported,
  // so a new view exposing a table cannot pass silently.
  const reviewedPublicViews = new Set(
    [...source.matchAll(/audit:\s*public-view\s+([A-Za-z0-9_]+)/gi)].map(
      (match) => match[1].toLowerCase(),
    ),
  );

  for (const match of code.matchAll(
    /grant\b[^;]{0,300}\bto\b[^;]{0,120}\banon\b/gi,
  )) {
    const statement = match[0];
    // Schema usage is required for the REST API and grants no row or column
    // access by itself; every object privilege is still audited below.
    if (/^grant\s+[^;]*\s+on\s+schema\b/i.test(statement)) continue;
    const object =
      /\bon\s+(?:table\s+)?(?:[A-Za-z_][A-Za-z0-9_]*\.)?["']?([A-Za-z0-9_]+)["']?/i.exec(
        statement,
      );
    const view = object?.[1].toLowerCase();
    if (view && viewsCreated.has(view) && reviewedPublicViews.has(view))
      continue;
    add(
      "grant-to-anon",
      "high",
      match.index ?? 0,
      `Anon grant: ${statement.replace(/\s+/g, " ").slice(0, 100)}`,
    );
  }

  for (const chunk of code
    .split(/create\s+(?:or\s+replace\s+)?function/gi)
    .slice(1)) {
    const statement = chunk.slice(0, statementEnd(chunk));
    const ddl = maskQuotedBodies(statement);
    if (/security\s+definer/i.test(ddl) && !/set\s+search_path/i.test(ddl)) {
      const header = statement.slice(0, 90).replace(/\s+/g, " ").trim();
      add(
        "security-definer-no-search-path",
        "high",
        Math.max(0, code.indexOf(chunk)),
        `Definer without search_path: ${header}`,
      );
    }
  }

  const doBlockTables = new Set();
  // The exemption is bound to the loop body: a table named in an array whose
  // loop does not enable RLS is not protected.
  for (const match of code.matchAll(
    /foreach\s+\w+\s+in\s+array\s+array\s*\[([\s\S]*?)\][\s\S]{0,800}?end\s+loop/gi,
  )) {
    if (!/enable\s+row\s+level\s+security/i.test(match[0])) continue;
    for (const name of match[1].matchAll(/'([^']+)'/g))
      doBlockTables.add(name[1]);
  }

  for (const match of code.matchAll(
    /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:[A-Za-z_][A-Za-z0-9_]*\.)?["']?([A-Za-z0-9_]+)["']?/gi,
  )) {
    const table = match[1];
    if (doBlockTables.has(table)) continue;
    const escaped = table.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rls = new RegExp(
      `alter\\s+table\\s+(?:[A-Za-z_][A-Za-z0-9_]*\\.)?["']?${escaped}["']?\\s+enable\\s+row\\s+level\\s+security`,
      "i",
    );
    if (!rls.test(code)) {
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
  const files = [];
  // Directory entries come from Dirent, so nothing is stat'd before it is read.
  // CodeQL flags a stat-then-read sequence as a file system race.
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (["node_modules", ".git", ".next"].includes(entry.name)) continue;
      const full = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith(".sql")) {
        files.push(full);
      }
    }
  };
  for (const path of paths) {
    if (path.endsWith(".sql")) files.push(path);
    else walk(path);
  }

  const findings = files.flatMap((file) =>
    scanSql(
      readFileSync(file, "utf8"),
      relative(process.cwd(), file).split("\\").join("/"),
    ),
  );
  return { files: files.length, findings };
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
      "usage: audit-migrations.mjs <sql-dir>... [--baseline file] [--write-baseline file] [--fail-on high|medium|none]",
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
