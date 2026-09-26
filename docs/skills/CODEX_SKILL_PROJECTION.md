# Repository skills in Codex

`scripts/sync-claude-codex.mjs` creates small, explicitly selected source loaders
in a skill registry. Each loader points to the complete procedure in this
checkout, so its reference files and templates stay together. The command uses
Node built-ins and Git; use Node 22 from `.nvmrc`. It works directly in PowerShell
or a POSIX shell. The `.sh` entrypoint forwards arguments to the same Node CLI.

This delivers repository procedures. The separately released Creative Worlds
plugin and `@arcanea/skills` package have their own installers and version
contracts. A loader is not another independent capability, a reviewed skill body,
an installed provider, or permission to execute the source's suggestions.

## Discover and select

Run from this checkout, or pass its exact Git root with `--repo`:

```sh
node scripts/sync-claude-codex.mjs --list
node scripts/sync-claude-codex.mjs --list --json
node scripts/sync-claude-codex.mjs --skill claude/creative/story-weave/SKILL.md --dry-run
```

Discovery reads `.claude/skills` and, when present,
`claude-code-oracle-skills/skills`. It includes nested `SKILL.md`/`skill.md` files
and immediate Markdown procedures at each skill root, excluding known index
files. It does not interpret source prose or certify frontmatter. The catalog
reports skipped links, unsupported paths and unreadable entries; `--all` refuses
to proceed when there are discovery issues. An explicit valid subset can proceed.

Use full keys from `--list`. Short logical keys, such as
`claude/creative/story-weave`, are accepted when unambiguous. Repeat `--skill` to
select several sources. `--all` is an explicit opt-in; review the catalog first.
There is no automatic bulk installation. No arguments show help.

The target defaults to `CODEX_HOME/skills`, or the operating system home directory's
`.codex/skills` when `CODEX_HOME` is unset. `--target` overrides it. Preview and
check modes do not create directories, receipts or configuration files. They do
read the selected source and destination files. Preview is the default whenever
skills are selected without `--apply`.

## Apply and verify

Choose a private receipt directory outside both the checkout and the target
registry. For example, in PowerShell:

```powershell
$projectionReceipts = Join-Path $env:LOCALAPPDATA 'Arcanea/skill-projection-receipts'
node scripts/sync-claude-codex.mjs --skill claude/creative/story-weave/SKILL.md --apply --receipt-dir "$projectionReceipts"
node scripts/sync-claude-codex.mjs --skill claude/creative/story-weave/SKILL.md --check
```

On another operating system, pass your private receipt path to `--receipt-dir`.
Use the same `--repo`, `--target`, `--namespace` and selection for later checks.
`--namespace` defaults to `arcanea`; names include a normalized source key and
short hash, so different procedures with the same internal name remain distinct.
`--json` emits the catalog, plan or completed receipt as structured output.

Each installed directory contains only:

- `SKILL.md`: a valid skill entry with the full source path and loading procedure.
- `INSTALL.json`: deterministic adapter identity, source hash and adapter hash.

The source path is live. Keep the checkout available and review the source's
instructions before using it. Switching its branch can change the loaded skill.
`--check` exits 1 when a selected adapter is missing or its entrypoint hash has
changed; errors also exit nonzero. It exits 0 when the selected entries match.
Reference-file content is not hashed: the loader resolves those files at use time.
Changing the reference content alone will not cause a drift failure.

Only `--apply --update` can replace a recognized, unedited generated adapter. An
update first saves the exact old two files in its private receipt directory.
Identical reruns write nothing, including timestamps and receipts. New changes
produce a unique receipt with source keys, file hashes and planned actions.

## Preservation and recovery

Every selected destination is inspected before writes begin. Full skill folders,
extra files, modified generated files, directory links and Windows junctions are
preserved by failing the operation. `--update` does not override these checks.
The tool never reads or writes MCP configuration and never creates links.
Source, registry and receipt paths may not overlap. Discovery rejects links in
directory ancestry and bounds depth, entries and file sizes.

Use one writer per target registry. The installer rechecks source hashes and
destination bytes before each change, but it is not an operating-system access
control boundary or a crash-atomic multi-file transaction. On a caught failure it
restores or removes only files still matching the bytes it wrote. Unexpected or
partial writes are preserved for inspection. The failed receipt records per-file
recovery states and retains backups; an empty newly created registry parent may
remain. A process crash or unavailable receipt disk can require manual recovery.

To reverse an update, compare the live files with the failed or applied receipt
and restore the backed-up pair only after confirming no later user edits exist.
To remove a newly created loader, first verify its identity and unchanged hashes,
then remove only its two files and empty directory. There is no recursive purge
or automatic uninstall of existing skills.

## Migrating the older shell script

The former positional repository argument is now `--repo`. The checkout defaults
to the script's own repository instead of a machine-specific path. Existing
`claude__*` and `oracle__*` links are left intact; they are not silently adopted,
removed or claimed current. Inspect and retire obsolete links separately after
checking what they point to. The new adapters have distinct names.

Repository bridge indexes from `scripts/generate-codex-claude-bridge.mjs` remain a
separate delivery surface. Intentional source adapters, including Sovereign
Depths' delegation into `.arcanea`, remain intact. This command does not reconcile
different bodies across `.arcanea`, `.claude`, plugins or published packages.

## Verify the implementation

```sh
node --test scripts/tests/skill-projection.test.mjs
node --check scripts/sync-claude-codex.mjs
node --check scripts/lib/skill-projection.mjs
```

The tests use isolated Git repositories and registries, including paths with
spaces. They exercise actual CLI installation, no-op timestamps, full-skill
preservation, source drift, links/junctions, recovery and the Bash wrapper when
available. They do not activate the discovered repository skills or run their
tools. Review the selected source bodies separately before personal installation.
