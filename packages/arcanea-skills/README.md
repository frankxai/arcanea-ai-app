# Arcanea creator workflows

This package proposes `packages/arcanea-skills/skills` as the curated source inside
`frankxai/arcanea-ai-app`. It currently has four candidates and zero ready skills.
The package is private while release decisions remain open.

| Candidate          | Creator's job                                                                         | Example                                                           |
| ------------------ | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `world-build`      | Turn supplied material into an editable world bible with accepted facts and proposals | [Tideglass bible](skills/world-build/references/example.md)       |
| `continuity-check` | Find source-backed contradictions and propose small repairs                           | [Bridge conflict](skills/continuity-check/references/example.md)  |
| `scene-to-media`   | Turn a scene into a traceable shot and prompt brief                                   | [Ferry rescue brief](skills/scene-to-media/references/example.md) |
| `quest-adapt`      | Adapt a world into one quest with conditions, consequences and replay cases           | [Last crossing](skills/quest-adapt/references/example.md)         |

The examples use an invented creator-owned world. They are authored walkthroughs;
behavioral evaluation and independent review are pending. The source checkout's
`evals/creator-smoke-2026-10-01.md` records a fresh four-request packet and a review
timeout with zero returned outputs; it provides no sign-off. Official Arcanea canon
remains in `.arcanea/lore/CANON_LOCKED.md` at the repository root.

## Local review

Use Node 22 or newer and the repository's pinned pnpm. The repository develops
and verifies this package on its `.nvmrc` Node 22 runtime. From this package directory:

```sh
node scripts/catalog.cjs
node bin/install.js --list
node bin/install.js --dry-run
node --test tests/catalog.test.mjs
```

With the current catalog, `--dry-run` and installation exit with code 2 and leave
the user's home untouched. `--list` and validation exit with code 0 when valid.
No candidate has been installed or activated by this change.

## Catalog and release evidence

`catalog.json` is the installer allowlist. Each passport records identity, owner,
source history, resources, allowed actions, rights status, evaluation and review.
Candidates retain `metadata.internal: true` for skills CLI discovery. That flag
can be overridden by a consumer; the package installer still excludes candidates.

A ready entry needs a rights decision and evidence, a passing evaluation and an
independent review with distinct maker/reviewer identities. Evaluation and review
must name the same `contentSha256`. To promote a candidate, remove its internal
discovery flag, hash the final files, and obtain evidence against those bytes.
Keep `private: true` until the repository's separate release gate is satisfied.

For each recognized text file (`md`, `json`, `js`, `cjs`, `mjs`, `cts`, `txt`, `sh`,
`py`, `yaml`, `yml`) without NUL bytes, normalize CRLF to LF before hashing.
Other files retain exact bytes. The installer and compiler use this same rule.
Compute SHA-256 of those canonical bytes. Sort relative POSIX paths and compute
the skill hash over `path + NUL + fileHash + LF` for every file. Support files are
included. Source validation rejects links, hidden files, missing resources,
identity mismatches and references escaping the skill directory.

Frontmatter is parsed as YAML. `name` must match the passport, `description` must
be a nonempty string, and a candidate's parsed `metadata.internal` must be the
boolean `true`. An `internal` value in another mapping or inside a string has no
effect. Duplicate keys, invalid mappings and YAML warnings fail validation;
quoted keys and inline metadata mappings are supported. Install this package's
dependencies before running its commands in a standalone checkout.

Evidence fields are maintainer declarations. The validator checks presence and
matching hashes; it does not authenticate a reviewer, establish legal rights or
replace the human release approval tracked by issue #277.

## Installation behavior

Only ready entries are copied to `~/.claude/skills/<name>`, including their
validated support files. The installer snapshots the bytes read during validation
and writes their canonical form with mode `0644`; text CRLF becomes LF, binary bytes
remain exact. It does not reread source files during materialization.
The installer plans all destinations before copying and
refuses existing skill directories, destination links and unknown options.
`--dry-run` performs validation and planning without writing. An I/O failure during
copying exits with code 1 and may leave a partial new directory for inspection;
existing user skills are preserved. It has no automatic overwrite or cleanup mode.
Path checks and copying are separate filesystem operations. Another local process
could replace a source or destination parent between them, including before the
post-creation check detects a junction. Install only from a trusted, stable source
tree into a home directory whose parents other processes are not changing.

The CommonJS API keeps `skills`, `skillCount`, `bundledCount`, `categories`,
`getByCategory` and `getSkillPath`, with ready entries only. `candidates` exposes
the review backlog. Callers that relied on the previous top-20 list must migrate.
`name`, `version` and `skillsDir` also expose package identity and source location.

The source package contains four catalog candidates. Other repository discovery
roots and plugin manifests remain separate work; installing from the repository
root does not provide this package's catalog-controlled selection. Consolidation
history and current-tree source mappings are recorded with
[draft #487](https://github.com/frankxai/arcanea-ai-app/pull/487).

## Rights and integration

### Native plugin build

The repository-root plugin is a development bundle: it references
`.claude/skills` and `.claude/commands` and does not enforce this catalog.
Do not list that root as the public curated plugin. Native Claude Code
[skill paths add to the default `skills/` scan](https://code.claude.com/docs/en/plugins-reference#how-each-key-combines-with-its-default-location),
so a manifest placed in this candidate package would also expose candidates.

`bin/plugin.js` builds a separate transport artifact from the same canonical
catalog and source files. It creates no second editable skill root or repository.
Run from the app checkout with its dependencies available:

```sh
node packages/arcanea-skills/bin/plugin.js --commit <full-source-SHA> --output <new-directory> --dry-run
node packages/arcanea-skills/bin/plugin.js --commit <full-source-SHA> --output <new-directory>
claude plugin validate <new-directory>/plugin --strict
```

The source must identify the app through a canonical HTTPS or SSH origin, its package path and
the specified checkout HEAD. Catalog and every declared skill/support folder must match
Git blobs at that commit. Text checkouts may differ only by CRLF-to-LF conversion; output always uses the committed bytes.
Blob reads use `git cat-file blob` by object ID with replace objects disabled;
Git display textconv and clean filters are not invoked.
When at least one skill is ready, all catalog folders are validated, including candidates that will not ship.
An untracked or edited candidate support file blocks compilation. Undeclared
development directories are ignored. The builder snapshots validated bytes before writing; later source
edits cannot change that snapshot. Only ready entries reach the artifact's
default `skills/` folder. No development commands, agents, hooks, MCP setup,
candidate folders or implicit blanket license are copied. `release.json`
identifies input commit, catalog and content hashes, commit-bound CLI/generator/validator/package hashes and resolved YAML version
and complete declared passports. The resolved YAML version must equal the exact dependency pin in the committed package manifest; a mismatch refuses before output.
The distinct plugin name is `arcanea-creator-skills`; its version has a letter-prefixed commit identifier. Skill directory and support paths with Windows-reserved names, invalid characters or case collisions are rejected before output. Git symlink modes are refused even when checked out as plain files.
Ready support files must have Git mode `100644`; executable files require mode-bound
review evidence that this catalog does not provide, so `100755` is refused.
Recognized text blobs committed with CRLF are also refused, ensuring shipped text
bytes equal the canonical hash input. The package's pinned `.gitattributes` uses
`* text=auto eol=lf` for ordinary Git text conversion, including unlisted extensions.
Checkout or renormalize files before obtaining review evidence; existing committed
CRLF is not silently rewritten by the compiler.
Determinism requires the same source and pinned YAML version. Configured origin identity is not remote authentication. These declarations do not authenticate rights
or reviewers and do not replace human publication approval.

With valid pinned engines and dependency, four candidates and zero ready means
exit 2 before source-folder validation or output creation. Engine or dependency
failures happen first and exit 1 without output.
This is not an available public plugin. Synthetic ready fixtures establish
transport behavior only; no real skill has been promoted or installed.

Output parents must exist, be directories without links and stay stable under
one writer. Output anywhere inside this canonical package or the checkout's
`.git`, `.claude`, `.claude-plugin`, root `skills`, `commands`, `agents` or `hooks` is refused
to preserve source and avoid discovery by the development plugin. Use an external
new directory or a separate release directory outside those roots.
The builder exclusively creates a new wrapper, assembles inside
its hidden `.staging` directory, then renames the complete directory to `plugin`.
An interrupted/failed write leaves inspectable new staging without the final
plugin path. A retry requires a new output; existing outputs are never replaced
or automatically deleted. This is not crash-safe durability or defense against
a malicious process replacing parents. Load only the returned `/plugin` path.

The hub should list a future reviewed materialized subdirectory in this same
app repo using a [git-subdir source with a full commit SHA](https://code.claude.com/docs/en/plugins/marketplace-reference#git-subdir-plugin-source).
That consumer SHA must identify the commit containing the artifact; the input
SHA in `release.json` identifies its source. They can differ. No entry is emitted
that falsely claims an artifact exists at its input commit. Materializing a
release directory in the app, proving native installation/discovery and listing
the pinned artifact await ready skill evidence and the separate release gate.

The existing package's `license: MIT` metadata is unchanged. Each candidate's rights
passport remains pending, and no root license has been added. Rights decisions for
earlier sources, official lore and third-party material remain separate work.

The bundle launcher still needs a verified repository origin and coordinated root
selection for both discovery and installation. Future bundle sources should pin
the app repository, this folder and a commit. Working-set links and legacy-repo
salvage have not been applied.

Track the consolidation and product scope in
[Arcanea issue #276](https://github.com/frankxai/arcanea-ai-app/issues/276).
