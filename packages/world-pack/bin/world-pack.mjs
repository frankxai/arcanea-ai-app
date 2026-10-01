#!/usr/bin/env node
// world-pack — the Studio slice on the command line.
//
//   world-pack canon [--json]                     index CANON_LOCKED.md
//   world-pack seed <name> --handle <h> [-o f]    create a world seed
//   world-pack compile <template> --gate 6 ...    compile an APL prompt (no model call)
//   world-pack check <pack.json> [--against c.md] validate + conflict report
//   world-pack export <pack.json> [-o f]          portable, verifiable export
//   world-pack verify <export.json>               re-check the digest
//   world-pack guardians [--evals]                the authority model

import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loadCanonIndex } from "../src/canon-index.mjs";
import { createWorldSeed, exportPack, verifyExport } from "../src/pack.mjs";
import { checkAgainst, detectConflicts } from "../src/conflict.mjs";
import { validatePack } from "../src/validate.mjs";
import { GUARDIAN_ROLES, runGuardianEvals } from "../src/guardians.mjs";
import * as apl from "../src/apl.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CANON = resolve(here, "../../../.arcanea/lore/CANON_LOCKED.md");

const argv = process.argv.slice(2);
const cmd = argv[0];
const flags = {};
const positional = [];
for (let i = 1; i < argv.length; i++) {
  if (argv[i].startsWith("--")) {
    const key = argv[i].slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) flags[key] = true;
    else {
      flags[key] = next;
      i += 1;
    }
  } else if (argv[i] === "-o") {
    flags.out = argv[++i];
  } else positional.push(argv[i]);
}

const canonPath = flags.canon || DEFAULT_CANON;
const out = (obj) =>
  console.log(typeof obj === "string" ? obj : JSON.stringify(obj, null, 2));
const die = (msg) => {
  console.error(msg);
  process.exit(1);
};

/**
 * Every command that loads a pack recomputes the canon hash from the document on
 * disk and compares. A pack's own `canon.sourceHash` is a claim, not evidence —
 * a pack carrying sha256:000…0 used to clear canon and exit 0.
 */
function assertCanonBinding(declared, canon) {
  if (declared === canon.sourceHash) return;
  console.error(
    [
      "CANON BINDING MISMATCH — this pack was not cleared against the canon in front of it",
      `  declared   ${declared ?? "(none)"}`,
      `  actual     ${canon.sourceHash}   ${canonPath}`,
    ].join("\n"),
  );
  process.exit(1);
}

async function emit(value) {
  if (flags.out) {
    await writeFile(flags.out, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    console.log(`wrote ${flags.out}`);
  } else out(value);
}

switch (cmd) {
  case "canon": {
    const canon = await loadCanonIndex(canonPath);
    if (flags.json) out(canon);
    else {
      out(`canon        ${canonPath}`);
      out(`sourceHash   ${canon.sourceHash}`);
      out(
        `gates        ${canon.gates.length}   ${canon.gates.map((g) => `${g.index}:${g.name}/${g.frequencyHz}Hz`).join("  ")}`,
      );
      out(`elements     ${canon.elements.join(", ")}`);
      out(`houses       ${canon.houses.join(", ")}`);
      out(
        `ranks        ${canon.ranks.map((r) => `${r.rank} ${r.minGates}-${r.maxGates}`).join("  ")}`,
      );
      out(
        `origin       ${canon.originClasses.map((o) => o.name).join(", ")} (closed)`,
      );
      out(`names        ${Object.keys(canon.names).length} indexed`);
      out(`lockedTruths ${canon.lockedTruths.length}`);
    }
    break;
  }
  case "seed": {
    const name =
      positional[0] || die("usage: world-pack seed <name> --handle <handle>");
    const handle = flags.handle || die("--handle is required");
    const canon = await loadCanonIndex(canonPath);
    await emit(
      createWorldSeed({
        name,
        premise: flags.premise || "",
        creator: { handle },
        canonSourceHash: canon.sourceHash,
        createdAt: new Date().toISOString(),
      }),
    );
    break;
  }
  case "compile": {
    const template =
      positional[0] ||
      die(
        `usage: world-pack compile <template>\n  templates: ${Object.keys(apl.TEMPLATES).join(", ")}`,
      );
    const canon = await loadCanonIndex(canonPath);
    const pack = flags.pack
      ? JSON.parse(await readFile(flags.pack, "utf8"))
      : undefined;
    const bindings = { ...flags };
    delete bindings.pack;
    delete bindings.canon;
    delete bindings.out;
    try {
      const compiled = apl.compile(template, bindings, { canon, pack });
      if (flags.json) await emit(compiled);
      else out(compiled.prompt);
    } catch (err) {
      die(String(err.message));
    }
    break;
  }
  case "check": {
    const file = positional[0] || die("usage: world-pack check <pack.json>");
    const pack = JSON.parse(await readFile(file, "utf8"));
    const structure = validatePack(pack);
    // --against runs the same rules on a canon document of your own. The pack's
    // binding is then reported rather than enforced: it is not your canon.
    const custom = flags.against ? await readFile(flags.against, "utf8") : null;
    const { canon, report } = custom
      ? checkAgainst(pack, custom)
      : { canon: await loadCanonIndex(canonPath), report: null };
    const finalReport = report || detectConflicts(pack, canon);
    if (flags.json)
      out({
        structure,
        canon: {
          document: custom ? flags.against : canonPath,
          universe: canon.universeName,
          sourceHash: canon.sourceHash,
        },
        report: finalReport,
      });
    else {
      out(`canon        ${custom ? flags.against : canonPath}`);
      out(
        `             ${canon.universeName ?? "(untitled canon)"} @ ${canon.sourceHash}`,
      );
      out(
        `structure    ${structure.valid ? "valid" : `${structure.errors.length} error(s)`}`,
      );
      for (const e of structure.errors) out(`  - ${e}`);
      out(
        `conflicts    ${finalReport.clean ? "clean" : `${finalReport.blockers} blocker(s), ${finalReport.errors} error(s)`}`,
      );
      for (const f of finalReport.findings)
        out(
          `  ${f.severity.padEnd(8)} ${f.ruleId.padEnd(34)} ${f.nodeName ?? f.nodeId ?? ""} — ${f.message}`,
        );
    }
    process.exit(structure.valid && finalReport.clean ? 0 : 1);
    break;
  }
  case "export": {
    const file = positional[0] || die("usage: world-pack export <pack.json>");
    const pack = JSON.parse(await readFile(file, "utf8"));
    const canon = await loadCanonIndex(canonPath);
    assertCanonBinding(pack.canon?.sourceHash ?? null, canon);
    await emit(exportPack(pack, { exportedAt: new Date().toISOString() }));
    break;
  }
  case "verify": {
    const file = positional[0] || die("usage: world-pack verify <export.json>");
    const exported = JSON.parse(await readFile(file, "utf8"));
    const canon = await loadCanonIndex(canonPath);
    assertCanonBinding(exported.canon?.sourceHash ?? null, canon);
    const result = verifyExport(exported);
    if (result.valid) out(`valid  ${result.expected}`);
    else {
      out("TAMPERED");
      if (!result.digestOk)
        out(
          `  digest declared   ${result.expected}\n  digest recomputed ${result.actual}`,
        );
      if (!result.countsOk)
        out(
          `  counts declared   ${JSON.stringify(result.countsDeclared)}\n  counts actual     ${JSON.stringify(result.countsActual)}`,
        );
      for (const p of result.agentRoleProblems)
        out(`  agentRole         ${p.reason}`);
    }
    process.exit(result.valid ? 0 : 1);
    break;
  }
  case "guardians": {
    if (flags.evals) {
      const evals = runGuardianEvals();
      out(`evals  ${evals.passed} passed, ${evals.failed.length} failed`);
      for (const f of evals.failed) out(`  ${JSON.stringify(f)}`);
      process.exit(evals.failed.length ? 1 : 0);
    }
    for (const g of GUARDIAN_ROLES) {
      out(
        `${String(g.gate).padStart(2)}  ${g.name.padEnd(12)} ${g.role.padEnd(26)} waives<=${g.authority.maxWaivableSeverity}`,
      );
      out(`    scopes  ${g.authority.scopes.join(" ")}`);
      out(`    owns    ${g.authority.owns.join(" ") || "(reports only)"}`);
    }
    break;
  }
  default:
    out(
      [
        "world-pack — Arcanea WorldPack.v1",
        "",
        "  canon [--json]                        index CANON_LOCKED.md",
        "  seed <name> --handle <h> [-o f]       create a world seed",
        "  compile <template> --gate 6 ...       compile an APL prompt (no model call)",
        "  check <pack.json> [--against c.md]    validate + conflict report (against Arcanea, or your own canon)",
        "  export <pack.json> [-o f]             portable, verifiable export",
        "  verify <export.json>                  re-check the digest",
        "  guardians [--evals]                   the authority model",
        "",
        `  --canon <path>   default ${DEFAULT_CANON}`,
      ].join("\n"),
    );
    process.exit(cmd ? 1 : 0);
}
