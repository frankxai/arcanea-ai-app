#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { preparePlugin, materializePlugin } = require("../scripts/plugin.cjs");

function run(args) {
  if (args.length === 1 && args[0] === "--help") {
    console.log(
      "node bin/plugin.js --commit <full-SHA> --output <new-directory> [--dry-run]\nBuild only catalog-ready skills into <new-directory>/plugin. No installation or publishing.",
    );
    return;
  }
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (
      !["--commit", "--output", "--dry-run"].includes(key) ||
      Object.hasOwn(options, key)
    )
      throw new Error(`Unknown or repeated option: ${key}`);
    if (key === "--dry-run") options[key] = true;
    else {
      const value = args[++i];
      if (!value || value.startsWith("--"))
        throw new Error(`Missing value: ${key}`);
      options[key] = value;
    }
  }
  if (!options["--commit"] || !options["--output"])
    throw new Error("Require --commit and --output; see --help");
  const plan = preparePlugin(
    path.resolve(__dirname, ".."),
    options["--commit"],
  );
  console.log(
    JSON.stringify(
      materializePlugin(plan, options["--output"], {
        dryRun: options["--dry-run"],
      }),
      null,
      2,
    ),
  );
}

try {
  run(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  process.exitCode = error.exitCode ?? 1;
}
