import path from "node:path";
import os from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import {
  discoverSkills,
  planProjection,
  projectionReport,
  applyProjection,
} from "./lib/skill-projection.mjs";

export function main(args = process.argv.slice(2)) {
  const { values, tokens } = parseArgs({
    args,
    allowPositionals: false,
    tokens: true,
    options: {
      repo: { type: "string" },
      target: { type: "string" },
      namespace: { type: "string" },
      skill: { type: "string", multiple: true },
      all: { type: "boolean" },
      list: { type: "boolean" },
      "dry-run": { type: "boolean" },
      check: { type: "boolean" },
      apply: { type: "boolean" },
      update: { type: "boolean" },
      "receipt-dir": { type: "string" },
      json: { type: "boolean" },
      help: { type: "boolean", short: "h" },
    },
  });
  const seen = new Set();
  for (const token of tokens) {
    if (
      token.kind === "option" &&
      token.name !== "skill" &&
      seen.has(token.name)
    )
      throw new Error(`Duplicate option: --${token.name}`);
    if (token.kind === "option") seen.add(token.name);
  }
  const modes = ["list", "dry-run", "check", "apply", "help"].filter(
    (key) => values[key],
  );
  if (modes.length > 1)
    throw new Error("Choose one of --list, --dry-run, --check or --apply");
  if (!args.length || values.help) {
    console.log(`Arcanea repository skill projection

node scripts/sync-claude-codex.mjs --list
node scripts/sync-claude-codex.mjs --skill claude/creative/story-weave --dry-run
node scripts/sync-claude-codex.mjs --skill claude/creative/story-weave --apply --receipt-dir /private/receipts

--repo PATH        Exact checkout; defaults to this script's repository
--target PATH      Exact registry; defaults to CODEX_HOME/skills or OS-home/.codex/skills
--namespace NAME   Adapter-name prefix; default arcanea
--skill KEY        Select a source key; may repeat
--all              Select every discovered source (explicit opt-in)
--check            Read-only check; exits 1 for missing or changed adapters
--update           Allow backed-up updates of recognized, unedited adapters
--json             Structured catalog, plan or receipt on stdout

Without --apply, this command writes nothing. Existing full skills and links are
preserved. Source references stay in the repository. No MCP configuration is read
or changed. The older positional repository argument is replaced by --repo.`);
    return;
  }
  const repo =
    values.repo ??
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  if (values.list) {
    if (
      values.skill ||
      values.all ||
      values.update ||
      values.target ||
      values.namespace ||
      values["receipt-dir"]
    )
      throw new Error("--list does not take installation options");
    const catalog = discoverSkills(repo);
    console.log(
      values.json
        ? JSON.stringify(catalog, null, 2)
        : catalog.entries.map((entry) => entry.key).join("\n"),
    );
    if (!values.json && catalog.issues.length)
      console.error(
        `${catalog.issues.length} source issues; inspect --list --json before selecting --all`,
      );
    return;
  }
  const options = {
    repo,
    target:
      values.target ??
      path.join(
        process.env.CODEX_HOME ?? path.join(os.homedir(), ".codex"),
        "skills",
      ),
    namespace: values.namespace,
    skills: values.skill,
    all: values.all ?? false,
    update: values.update ?? false,
    receiptDir: values["receipt-dir"],
  };
  const plan = planProjection(options);
  const report = values.apply
    ? applyProjection(options)
    : projectionReport(plan, values.check ? "check" : "dry-run");
  if (values.json) console.log(JSON.stringify(report, null, 2));
  else
    for (const entry of report.entries)
      console.log(`${entry.state}: ${entry.sourceKey} -> ${entry.name}`);
  if (
    values.check &&
    report.entries.some((entry) => entry.state !== "unchanged")
  )
    process.exitCode = 1;
}

if (
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
) {
  try {
    main();
  } catch (error) {
    console.error(`skill-projection: ${error.message}`);
    process.exitCode = 1;
  }
}
