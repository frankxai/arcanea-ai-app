// WorldPack audit tools. The server never stores a world: it takes a pack, checks
// it against a canon document it did not get from the pack, and returns findings.

import { readFile, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type * as WorldPackEngine from "@arcanea/world-pack";
import { z } from "zod";
import { RULE_GUIDES, SEVERITY_MEANING } from "../tools/worldpack-rules.js";

type Engine = typeof WorldPackEngine;
type CanonIndex = WorldPackEngine.CanonIndex;
type Severity = WorldPackEngine.Severity;
type PackObject = Record<string, unknown>;
type TransportContext = { sessionId?: string; requestInfo?: unknown };

const VENDOR = new URL("../vendor/", import.meta.url);

// Every input is measured before the engine sees it. The engine is linear in what
// it is given; these caps bound what it can be given.
const BUDGET = {
  packBytes: 5 * 1024 * 1024,
  depth: 32,
  nodes: 5000,
  relationships: 20000,
  stringChars: 32 * 1024,
  canonChars: 1024 * 1024,
  canonTableRows: 2000,
} as const;
const SEVERITY_ORDER: Severity[] = ["blocker", "error", "warning", "info"];
const DEFAULT_LIMIT = 200;

let engine: Promise<Engine> | undefined;
let arcaneaCanon: Promise<CanonIndex> | undefined;

function loadEngine(): Promise<Engine> {
  engine ??= import(
    new URL("world-pack/index.mjs", VENDOR).href
  ) as Promise<Engine>;
  return engine;
}

async function canonFor(
  canonDocument: string | undefined,
): Promise<{ canon: CanonIndex; custom: boolean }> {
  const wp = await loadEngine();
  if (canonDocument !== undefined) {
    assertCanonBudget(canonDocument);
    return { canon: wp.buildCanonIndex(canonDocument), custom: true };
  }
  arcaneaCanon ??= readFile(
    new URL("canon/CANON_LOCKED.md", VENDOR),
    "utf8",
  ).then((md) => wp.buildCanonIndex(md));
  return { canon: await arcaneaCanon, custom: false };
}

class InputError extends Error {}

function assertCanonBudget(md: string): void {
  if (md.length > BUDGET.canonChars)
    throw new InputError(
      `canonDocument exceeds the canon size budget: ${md.length} characters (limit ${BUDGET.canonChars})`,
    );
  const rows = (md.match(/^[ \t]*\|/gm) ?? []).length;
  if (rows > BUDGET.canonTableRows)
    throw new InputError(
      `canonDocument exceeds the canon table budget: ${rows} table rows (limit ${BUDGET.canonTableRows})`,
    );
}

function assertPackBudget(pack: PackObject): void {
  const nodes = Array.isArray(pack.nodes) ? pack.nodes.length : 0;
  if (nodes > BUDGET.nodes)
    throw new InputError(
      `pack exceeds the node budget: ${nodes} nodes (limit ${BUDGET.nodes})`,
    );
  const relationships = Array.isArray(pack.relationships)
    ? pack.relationships.length
    : 0;
  if (relationships > BUDGET.relationships)
    throw new InputError(
      `pack exceeds the relationship budget: ${relationships} relationships (limit ${BUDGET.relationships})`,
    );

  let bytes = 0;
  const stack: Array<[unknown, number]> = [[pack, 1]];
  while (stack.length) {
    const [value, depth] = stack.pop()!;
    if (depth > BUDGET.depth)
      throw new InputError(
        `pack exceeds the depth budget: nested deeper than ${BUDGET.depth} levels`,
      );
    if (typeof value === "string") {
      if (value.length > BUDGET.stringChars)
        throw new InputError(
          `pack exceeds the string budget: a string of ${value.length} characters (limit ${BUDGET.stringChars})`,
        );
      bytes += value.length + 2;
    } else if (Array.isArray(value)) {
      bytes += 2;
      for (const item of value) stack.push([item, depth + 1]);
    } else if (value && typeof value === "object") {
      bytes += 2;
      for (const [key, item] of Object.entries(value)) {
        bytes += key.length + 4;
        stack.push([item, depth + 1]);
      }
    } else {
      bytes += 8;
    }
    if (bytes > BUDGET.packBytes)
      throw new InputError(
        `pack exceeds the size budget: more than ${BUDGET.packBytes} bytes`,
      );
  }
}

function parseJson(text: string, label: string): unknown {
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new InputError(
      `${label} is not valid JSON: ${(err as Error).message}`,
    );
  }
}

async function readPack(
  args: { pack?: string | PackObject; path?: string },
  context: TransportContext,
): Promise<PackObject> {
  if ((args.pack === undefined) === (args.path === undefined))
    throw new InputError("Provide exactly one of pack or path.");

  let value: unknown;
  if (args.path !== undefined) {
    // Over HTTP a path would let any caller probe the server's filesystem.
    if (context.sessionId !== undefined || context.requestInfo !== undefined)
      throw new InputError(
        "path is accepted over stdio only. Pass the pack JSON as pack.",
      );
    const file = resolve(args.path);
    if (extname(file).toLowerCase() !== ".json")
      throw new InputError(`path must point at a .json file: ${file}`);
    const info = await stat(file).catch(() => null);
    if (!info?.isFile()) throw new InputError(`no such file: ${file}`);
    if (info.size > BUDGET.packBytes)
      throw new InputError(
        `pack file exceeds the size budget: ${info.size} bytes (limit ${BUDGET.packBytes})`,
      );
    value = parseJson(await readFile(file, "utf8"), file);
  } else if (typeof args.pack === "string") {
    if (args.pack.length > BUDGET.packBytes)
      throw new InputError(
        `pack exceeds the size budget: ${args.pack.length} characters (limit ${BUDGET.packBytes} bytes)`,
      );
    value = parseJson(args.pack, "pack");
  } else {
    value = args.pack;
  }

  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new InputError("A WorldPack must be a JSON object.");
  assertPackBudget(value as PackObject);
  return value as PackObject;
}

function json(value: unknown): CallToolResult {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
}

async function guarded(run: () => Promise<unknown>): Promise<CallToolResult> {
  try {
    return json(await run());
  } catch (err) {
    if (!(err instanceof InputError)) throw err;
    return {
      isError: true,
      content: [{ type: "text", text: JSON.stringify({ error: err.message }) }],
    };
  }
}

function worldName(pack: PackObject): string {
  const name = (pack.world as { name?: unknown } | undefined)?.name;
  return typeof name === "string" ? `'${name}'` : "this pack";
}

function canonLabel(canon: CanonIndex, custom: boolean): string {
  const universe = canon.universeName ?? "untitled";
  return custom ? `your canon (${universe})` : `${universe} canon`;
}

async function checkWorldPack(
  pack: PackObject,
  canonDocument: string | undefined,
  limit: number,
) {
  const wp = await loadEngine();
  const { canon, custom } = await canonFor(canonDocument);

  const structureErrors = [...wp.validatePack(pack).errors];
  let findings: WorldPackEngine.Finding[] = [];
  if (Array.isArray(pack.nodes)) {
    try {
      findings = wp.detectConflicts(
        pack as unknown as WorldPackEngine.WorldPack,
        canon,
        {
          canonBinding: custom ? "foreign" : "required",
        },
      ).findings;
    } catch (err) {
      structureErrors.push(
        `conflict pass stopped on malformed data: ${(err as Error).message}`,
      );
    }
  }

  const summary: Record<Severity, number> = {
    blocker: 0,
    error: 0,
    warning: 0,
    info: 0,
  };
  for (const f of findings) summary[f.severity] += 1;

  const ordered = [...findings]
    .sort(
      (a, b) =>
        SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity),
    )
    .map((f) => ({
      ruleId: f.ruleId,
      severity: f.severity,
      node: f.nodeId || f.nodeName ? { id: f.nodeId, name: f.nodeName } : null,
      message: f.message,
      evidence: f.evidence,
      fix: RULE_GUIDES[f.ruleId]?.fix ?? null,
    }));

  const verdict =
    structureErrors.length || summary.blocker
      ? "blocked"
      : summary.error
        ? "needs-fixes"
        : "pass";

  return {
    verdict,
    headline:
      `${verdict.toUpperCase()}: ${worldName(pack)} against ${canonLabel(canon, custom)} — ` +
      `${structureErrors.length} structural, ${summary.blocker} blocker, ${summary.error} error, ` +
      `${summary.warning} warning, ${summary.info} info`,
    canon: {
      universe: canon.universeName,
      source: custom ? "canonDocument" : "bundled Arcanea CANON_LOCKED.md",
      sourceHash: canon.sourceHash,
      binding: custom
        ? "reported: the pack is not required to be bound to a document you supplied"
        : "enforced: pack.canon.sourceHash must equal the recomputed hash",
    },
    structure: { valid: structureErrors.length === 0, errors: structureErrors },
    summary,
    findings: ordered.slice(0, limit),
    truncated: Math.max(0, ordered.length - limit),
  };
}

async function verifyWorldPack(
  pack: PackObject,
  canonDocument: string | undefined,
) {
  const wp = await loadEngine();
  const { canon, custom } = await canonFor(canonDocument);
  const declaredHash =
    (pack.canon as { sourceHash?: unknown } | undefined)?.sourceHash ?? null;
  const canonBinding = {
    ok: declaredHash === canon.sourceHash,
    declared: declaredHash,
    actual: canon.sourceHash,
    against: custom ? "canonDocument" : "bundled Arcanea CANON_LOCKED.md",
  };

  if (typeof pack.digest !== "string") {
    return {
      verdict: "unsealed",
      headline: `UNSEALED: ${worldName(pack)} has no digest. It is a working pack; export it to seal it, then verify the export.`,
      checks: { canonBinding },
      reasons: ["pack.digest is missing"],
    };
  }

  let result: ReturnType<Engine["verifyExport"]>;
  try {
    result = wp.verifyExport(pack);
  } catch (err) {
    throw new InputError(
      `pack is too malformed to verify: ${(err as Error).message}`,
    );
  }

  const reasons: string[] = [];
  if (!result.representationOk)
    reasons.push(
      `pack is not a pure export (${result.representation}): top-level sources/branches/versions next to a provenance block would let the sealed ledger be edited behind an unchanged digest`,
    );
  if (!result.digestOk)
    reasons.push(
      `content does not match its digest: declared ${result.expected}, recomputed ${result.actual}`,
    );
  if (!result.countsOk)
    reasons.push(
      `declared node counts ${JSON.stringify(result.countsDeclared)} differ from actual ${JSON.stringify(result.countsActual)}`,
    );
  for (const problem of result.agentRoleProblems)
    reasons.push(`agent role: ${problem.reason}`);
  if (!canonBinding.ok)
    reasons.push(
      `canon binding: pack declares ${declaredHash ?? "none"}, the canon document hashes to ${canon.sourceHash}`,
    );

  const sealBroken =
    !result.representationOk ||
    !result.digestOk ||
    !result.countsOk ||
    !result.agentRolesOk;
  const verdict = sealBroken
    ? "tampered"
    : canonBinding.ok
      ? "sealed"
      : "canon-mismatch";
  const headline = {
    sealed: `SEALED: ${worldName(pack)} is unchanged since export and bound to ${canonLabel(canon, custom)}. The seal is not a canon verdict; run worldpack_check for that.`,
    tampered: `TAMPERED: ${worldName(pack)} was edited after export (${reasons.length} failing check${reasons.length === 1 ? "" : "s"}).`,
    "canon-mismatch": `CANON MISMATCH: ${worldName(pack)} is intact but was sealed against a different canon than ${canonLabel(canon, custom)}.`,
  }[verdict];

  return {
    verdict,
    headline,
    digest: result.expected,
    checks: {
      digest: {
        ok: result.digestOk,
        declared: result.expected,
        recomputed: result.actual,
      },
      counts: {
        ok: result.countsOk,
        declared: result.countsDeclared,
        actual: result.countsActual,
      },
      agentRoles: {
        ok: result.agentRolesOk,
        problems: result.agentRoleProblems,
      },
      canonBinding,
    },
    reasons,
  };
}

async function ruleCatalog(ruleId: string | undefined) {
  const { RULES } = await loadEngine();
  const entry = (id: string) => ({
    ruleId: id,
    severity: RULES[id],
    ...RULE_GUIDES[id],
  });
  if (ruleId === undefined)
    return {
      severities: SEVERITY_MEANING,
      rules: Object.keys(RULES).map(entry),
    };
  if (!(ruleId in RULES))
    throw new InputError(
      `unknown ruleId '${ruleId}'. Known: ${Object.keys(RULES).join(", ")}`,
    );
  return { severityMeaning: SEVERITY_MEANING[RULES[ruleId]], ...entry(ruleId) };
}

const packSource = {
  pack: z
    .union([z.record(z.string(), z.unknown()), z.string()])
    .optional()
    .describe(
      "The WorldPack.v1 document as a JSON object or JSON string. Working packs and exports are both accepted.",
    ),
  path: z
    .string()
    .optional()
    .describe(
      "Local path to a WorldPack .json file, resolved from the server's working directory. stdio only; over HTTP pass pack.",
    ),
  canonDocument: z
    .string()
    .optional()
    .describe(
      "Markdown of your own canon: a '# <NAME> CANON' title, pipe tables and '**LOCKED TRUTHS:**' bullets. Omit to use Arcanea's canon bundled with this server.",
    ),
};

const readOnly = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

export function registerWorldPackTools(server: McpServer) {
  server.registerTool(
    "worldpack_check",
    {
      title: "Audit a world against its canon",
      description:
        "Audit a WorldPack.v1 world against a canon document without storing it. Returns verdict (pass | needs-fixes | blocked), structural errors, and every canon, rights and provenance finding with ruleId, severity, node, evidence and a fix. The pack is never a witness for itself: a node that declares layer:'canon' is re-derived from the canon document and blocked as canon.layer-claim if it is not canon, and the canon hash is recomputed rather than read. Uses Arcanea's canon by default; pass canonDocument to enforce your own world's locked names and truths. Give pack or path.",
      inputSchema: {
        ...packSource,
        limit: z
          .number()
          .int()
          .min(1)
          .max(1000)
          .optional()
          .describe(
            `Maximum findings returned, most severe first. Default ${DEFAULT_LIMIT}; the rest are counted in truncated.`,
          ),
      },
      annotations: readOnly,
    },
    async (args, extra) =>
      guarded(async () =>
        checkWorldPack(
          await readPack(args, extra),
          args.canonDocument,
          args.limit ?? DEFAULT_LIMIT,
        ),
      ),
  );

  server.registerTool(
    "worldpack_verify",
    {
      title: "Verify an exported world's seal",
      description:
        "Verify that an exported WorldPack has not been edited since export. Recomputes the sha256 digest over nodes, relationships, the provenance ledger and agent roles; re-counts nodes; checks agent roles against the Guardian definitions in code; and recomputes the canon document hash. Returns sealed | tampered | canon-mismatch | unsealed with each failing check. A seal proves integrity, not canon compliance: use worldpack_check for that. Give pack or path.",
      inputSchema: packSource,
      annotations: readOnly,
    },
    async (args, extra) =>
      guarded(async () =>
        verifyWorldPack(await readPack(args, extra), args.canonDocument),
      ),
  );

  server.registerTool(
    "worldpack_rules",
    {
      title: "Explain WorldPack rules",
      description:
        "List every rule worldpack_check enforces, with severity, what it checks and how to clear a finding. Pass ruleId to explain one finding. Read it before generating world content to avoid findings instead of repairing them.",
      inputSchema: {
        ruleId: z
          .string()
          .optional()
          .describe(
            "A ruleId from a worldpack_check finding, e.g. canon.layer-claim.",
          ),
      },
      annotations: readOnly,
    },
    async (args) => guarded(async () => ruleCatalog(args.ruleId)),
  );
}
