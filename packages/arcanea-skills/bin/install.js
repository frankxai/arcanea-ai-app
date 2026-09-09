#!/usr/bin/env node
"use strict";

const { parseArgs } = require("node:util");
const { installSkills } = require("../lib/installer.js");
const meta = require("../index.js");

function main(args = process.argv.slice(2)) {
  const { values, tokens } = parseArgs({
    args,
    allowPositionals: false,
    tokens: true,
    options: {
      help: { type: "boolean", short: "h" },
      list: { type: "boolean", short: "l" },
      category: { type: "boolean", short: "c" },
      all: { type: "boolean" },
      skill: { type: "string", multiple: true },
      target: { type: "string" },
      "dry-run": { type: "boolean" },
      json: { type: "boolean" },
    },
  });
  const seen = new Set();
  for (const token of tokens.filter((token) => token.kind === "option")) {
    if (token.name !== "skill" && seen.has(token.name))
      throw new Error(`Duplicate option: --${token.name}`);
    seen.add(token.name);
  }
  const informational = ["help", "list", "category"].filter(
    (key) => values[key],
  );
  if (
    informational.length > 1 ||
    (informational.length &&
      (values.all || values.skill || values.target || values["dry-run"]))
  ) {
    throw new Error("Use one information command, or select an installation");
  }
  if (!args.length || values.help) {
    console.log(`@arcanea/skills ${meta.version}

Preview all bundled skills:  arcanea-skills --dry-run
Install selected skills:     arcanea-skills --skill story-weave --skill world-build
Install the whole bundle:    arcanea-skills --all
Choose an exact registry:    add --target /absolute/path/to/skills
Machine-readable receipt:    add --json
List skills or categories:   --list or --category

The default registry is the OS home directory's .claude/skills folder.
Existing differing skills and symbolic links/junctions are preserved with an error.
An identical installation is unchanged. Dry runs create no files or directories.`);
    return;
  }
  if (values.list || values.category) {
    const output = values.category
      ? meta.categories
      : {
          name: meta.name,
          version: meta.version,
          bundledCount: meta.bundledCount,
          skills: meta.skills,
        };
    console.log(JSON.stringify(output, null, 2));
    return;
  }
  const report = installSkills({
    skills: values.skill,
    target: values.target,
    all: values.all || (values["dry-run"] && !values.skill),
    dryRun: values["dry-run"],
  });
  if (values.json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(
      `${report.mode === "dry-run" ? "Preview" : "Verified"}: ${report.destination}`,
    );
    for (const item of report.skills)
      console.log(`  ${item.name}: ${item.state} (${item.files.length} files)`);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`arcanea-skills: ${error.message}`);
    process.exitCode = 1;
  }
}
module.exports = { main };
