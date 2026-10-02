# Arcanea creator workflows

This package proposes `packages/arcanea-skills/skills` as the curated source inside
`frankxai/arcanea-ai-app`. It currently has five candidates and zero ready skills.
The package is private while release decisions remain open.

| Candidate          | Creator's job                                                                         | Example                                                           |
| ------------------ | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `world-build`      | Turn supplied material into an editable world bible with accepted facts and proposals | [Tideglass bible](skills/world-build/references/example.md)       |
| `continuity-check` | Find source-backed contradictions and propose small repairs                           | [Bridge conflict](skills/continuity-check/references/example.md)  |
| `scene-to-media`   | Turn a scene into a traceable shot and prompt brief                                   | [Ferry rescue brief](skills/scene-to-media/references/example.md) |
| `quest-adapt`      | Adapt a world into one quest with conditions, consequences and replay cases           | [Last crossing](skills/quest-adapt/references/example.md)         |
| `scene-craft`      | Write a complete dramatic scene with a source-backed choice, cost and turn            | [The second seat](skills/scene-craft/references/example.md)       |

The examples use an invented creator-owned world. They are authored walkthroughs,
not human acceptance or readiness. The scene-craft donor fold and one matched-request
comparison are recorded in [its evaluation report](evals/scene-donor-fold-2026-10-02/report.md);
the passport remains pending. Wider behavioral evaluation remains open. The source checkout's
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

For each file, compute SHA-256 of its bytes. Sort relative POSIX paths and compute
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
validated support files. The installer plans all destinations before copying and
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

The source package contains five catalog candidates. Other repository discovery
roots and plugin manifests remain separate work; installing from the repository
root does not provide this package's catalog-controlled selection. Consolidation
history and current-tree source mappings are recorded with
[draft #487](https://github.com/frankxai/arcanea-ai-app/pull/487).

## Rights and integration

The existing package's `license: MIT` metadata is unchanged. Each candidate's rights
passport remains pending, and no root license has been added. Rights decisions for
earlier sources, official lore and third-party material remain separate work.

The launcher observed at c035e594 already has root selection and a pinned skills CLI,
but its checkout has no verified origin and still lists earlier Arcanea donors.
The older private root patch is stale and has not been applied. Link/ambiguous-pin
refusals, actual installation and coordinated app selection remain unverified. Future bundle sources should pin
the app repository, this folder and a commit. Working-set links and legacy-repo
salvage have not been applied.

Track the consolidation and product scope in
[Arcanea issue #276](https://github.com/frankxai/arcanea-ai-app/issues/276).
