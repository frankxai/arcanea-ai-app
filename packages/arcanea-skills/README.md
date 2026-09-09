# @arcanea/skills

A bundle of 20 creative and engineering skills with a previewable installer.
The package reports the skills actually present; it does not claim a measured
quality grade or count every skill in the Arcanea ecosystem.

## Release state

This checkout is the **1.1.0 source candidate**. The npm registry reported 1.0.0 on
2026-09-09. A Git commit or preview deployment does not publish this candidate.
The older CLI can overwrite existing skills; use the reviewed candidate artifact
or inspect source before running an installation against a personal registry.

Node.js 22 or later is required. The installer uses Node built-ins and has no
runtime dependencies. From this package directory:

```sh
npm run check
npm test
node bin/install.js --list
node bin/install.js --dry-run --json
```

## Install only what the task needs

No arguments show help. `--dry-run` previews the whole bundle without creating a
registry, parent directories or receipts. Select one or more names to apply:

```sh
node bin/install.js --skill story-weave --skill world-build --dry-run
node bin/install.js --skill story-weave --skill world-build
```

Use `--all` explicitly for the complete bundle. The default destination is the OS
home directory's `.claude/skills`. Select another harness registry explicitly:

```sh
node bin/install.js --skill story-weave --target /absolute/path/to/skills --dry-run
node bin/install.js --skill story-weave --target /absolute/path/to/skills --json
```

The executable in an installed candidate is `arcanea-skills`, with the same flags.
Supply an ordinary directory. A registry managed through a symbolic link or
Windows junction requires a separately reviewed integration; this installer
refuses to write through it.

Every selected destination is inspected before copying starts. Differing files,
extra files, links, junctions, missing source entrypoints and invalid names fail
without overwriting existing skills. An identical installation is a byte-preserving
no-op, including file timestamps. There is no force-overwrite option.

New installs copy references before the entrypoint and then verify the entire
file inventory. A failed write attempts to remove only the files created by that
run whose bytes remain unchanged, plus empty directories it created. Concurrent
or modified content is preserved. This is a local installer, not a filesystem
access-control boundary; do not run competing installers against the same target.

`--json` writes a structured result to stdout: destination, skill state, file paths,
byte counts and SHA-256 hashes. Save it privately if installation evidence is
needed. A dry run and an applied receipt are distinct states. No credentials,
MCP servers, plugins, hooks or provider connections are configured.

## What's bundled

| Category             | Skills                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| Creative writing     | story-weave, character-forge, world-build, scene-craft, dialogue-mastery, voice-alchemy, bestiary-nav         |
| Software development | code-review, tdd, systematic-debug, api-design, architecture-patterns, refactoring-ritual, performance-tuning |
| Arcanea framework    | centaur-mode, prompt-craft, luminor-wisdom, arcanea-creator-academy, creative-flow, deep-work                 |

These are the package's existing skill bodies. The installation checks establish
file delivery, not creative quality, current canon, clinical effectiveness or
working tools mentioned in an older instruction. Review the selected skill in the
context of the task. This package is separate from the nine-skill Arcanea Creative
Worlds plugin in `frankxai/arcanea-agent-skills`.

## Programmatic catalog

```js
const catalog = require("@arcanea/skills");
console.log(catalog.version, catalog.bundledCount);
console.log(catalog.skills);
const development = catalog.getByCategory("development");
const directory = catalog.getSkillPath("story-weave");
```

`skillCount` and `bundledCount` both describe the actual bundle. Category results
are copies; modifying one does not change the catalog. Unknown names are rejected.

## Update and rollback

Inspect a candidate with `--dry-run` first. If a previous full skill differs,
compare it with the candidate and prepare a backed-up, reviewed update outside
this installer. Do not replace custom content or detach a managed link blindly.
For rollback, verify the installed files against the saved receipt before removing
only that installation or restoring the prior backup. Source and user content
remain separate.

Run `npm pack` after validation to create an artifact for a clean consumer test.
Publishing requires the repository's release review and actual npm publication;
this guide does not claim that either has occurred.

License: MIT, as declared by the package.
