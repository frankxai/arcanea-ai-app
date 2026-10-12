# @arcanea/world-sdk

Runtime for the **Arcanea World Repo Standard**. A world is a folder/repo; this SDK is what
lets every layer read and build it. The repo is the source of truth — this is the derived plumbing.

Spec: `arcanea-ecosystem/docs/WORLD_REPO_STANDARD.md` · Schema: `arcanea-ecosystem/schemas/world.arcanea.schema.json`

## What's inside

| Module        | Role                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| `manifest`    | manifest defaults, world id, slug, hashing-canonical form                                                     |
| `validate`    | zero-dep validator mirroring the JSON Schema                                                                  |
| `contenthash` | deterministic sha256 over **public** files — provable before any chain                                        |
| `fs-world`    | read/write a world folder; frontmatter visibility                                                             |
| `genesis`     | one sentence → a World Bible (deterministic offline, LLM-pluggable)                                           |
| `scaffold`    | WorldSpec → a conforming world repo (reuses `@arcanea/world-engine`)                                          |
| `harness`     | agents read assignments from the manifest, write canonical folders, commit                                    |
| `index-build` | world → world-graph nodes + embed-ready chunks (repo → index, one way)                                        |
| `webhook`     | framework-agnostic push handler with HMAC verify                                                              |
| `proof`       | invisible wallet + mint adapters; `claimWorldProof` appends `provenance[]`                                    |
| `evolution`   | private memories in .arcanea/memories and deterministic summaries; legacy canon-promotion entry points reject |

## CLI

```bash
node bin/cli.mjs create "a drowned city where memory is currency"
node bin/cli.mjs validate <dir>
node bin/cli.mjs hash <dir>
node bin/cli.mjs index <dir>
node bin/cli.mjs claim <dir>
```

## The whole chain in code

```js
import {
  createWorld,
  readWorld,
  buildIndex,
  remember,
} from "@arcanea/world-sdk";
import { claimWorldProof, mockChain } from "@arcanea/world-sdk/proof";

const { manifest } = await createWorld(
  "./my-world",
  "a drowned city where memory is currency",
);
const index = buildIndex(await readWorld("./my-world")); // repo → index
await claimWorldProof({ dir: "./my-world", adapter: mockChain("solana") }); // sovereignty button
await remember("./my-world", "She opened the tide-gate for a dying diver.", {
  characterId: "sister-lethe",
  salience: 0.9,
});
```

Swap `mockChain()` for a real Solana (Metaplex/Helius) or EVM (thirdweb) adapter — same interface.

The legacy `evolveCharacter(...)` and `evolve(...)` exports remain callable but
always reject with `ERR_ARCANEA_HUMAN_PROMOTION_REQUIRED` before accessing the
filesystem or caller options. `arcanea-world evolve <character-slug> [dir]` exits
with status 1 and the same code. This intentionally removes their character and
public-lore writes. A caller-supplied approval flag cannot enable them. Use the
scene workflow below to retain private revisions and export them for review.
This SDK does not implement the separate human canon-promotion workflow.

## Test

```bash
node --test tests/*.test.mjs
```

## Source-linked scenes

Memory records now use distinct UUID filenames with exclusive creation. Two
events with the same timestamp remain separate; their recorded timestamps are
preserved. Recording or summarizing memories does not approve them as canon.

Use the existing World SDK to carry a selected world and character into your
writing harness, retain revisions and export a scene with its captured sources.
The scene commands make no model request and read no provider key. Choose and
fund your model in Codex, OpenCode or your own adapter; the SDK does not rank
models, translate harness model names or silently fall back to a paid provider.

Create `scene.json` next to your world folder. Select documents that actually
exist in your world; this example's names are placeholders, not Arcanea canon.

```json
{
  "sceneId": "the-last-crossing",
  "title": "The last crossing",
  "characterPath": "characters/mara.md",
  "sourcePaths": ["canon/rules.md"],
  "brief": "Mara must carry a stranger before the gates shut. Give her a choice with a lasting cost.",
  "author": "your-name"
}
```

From the Arcanea checkout:

```bash
node packages/world-sdk/bin/cli.mjs scene start ./my-world ./scene.json
node packages/world-sdk/bin/cli.mjs scene prompt ./my-world the-last-crossing
node packages/world-sdk/bin/cli.mjs scene show ./my-world the-last-crossing
```

Give the printed context packet to your chosen harness. Save its scene prose,
including your edits, in `draft.md`. Continuity questions can remain in a separate
working note. Copy the returned `sha256` of the draft you edited and supply it
when saving a revision. Producer labels describe what the caller reports; they
are not independently verified provider or billing receipts.

```json
{
  "kind": "model",
  "name": "your-name",
  "harness": "your-harness",
  "model": "your-selected-model"
}
```

Save that label as `producer.json` and revise:

```bash
node packages/world-sdk/bin/cli.mjs scene revise ./my-world the-last-crossing ./draft.md PARENT_SHA256 ./producer.json
node packages/world-sdk/bin/cli.mjs scene export ./my-world the-last-crossing ./scene-export
```

The new export directory contains exact scene Markdown and
`scene.provenance.json`: the Markdown hash, accepted revision hash, parent link,
source paths, exact source snapshots and their hashes, brief and producer label.
Canon and publication approvals remain false. Exports must be outside the source
world and the directory must not already exist. After an interrupted export,
keep its incomplete directory and retry into a fresh one. A complete pair has
both files; the provenance file is written last.

Revisions live under `.arcanea/drafts/scenes/<scene-id>/`. They neither change
the public content hash nor enter the current Markdown-only public index. The
commands never stage or commit files. A concurrent writer or stale parent is
refused; reopen `scene show` and merge the edits yourself. Changed live sources
stop prompts and new revisions. Start a new scene id to capture the new sources;
the old scene remains exportable for recovery. Unknown scenes do not create
directories. A crashed pending write is ignored, and broken accepted revision
chains are refused rather than repaired by guessing.

Inputs are bounded: ten additional documents, 32,768 bytes per source and 65,536
bytes across sources, an 8,000-byte brief, 128,000-byte prose and 128 revisions
including the initial capture. Source documents must use relative paths in the
supported world folders. Symlinks/junctions in source and draft paths are refused.
The immutable publication step requires filesystem hard-link support. This is a
local creator workflow, not tenant authorization, encryption or signed approval.
Its hashes establish byte identity and parent relationships, not literary quality
or whether a source claim is true. The legacy `evolve` helpers are blocked;
general world writers, signed human promotion and the broader safety work in
issue #283 remain open.

## World-file writes

`writeFiles(dir, files)` now validates every relative path and byte payload before
changing the world. Use `/` between path segments. Traversal, absolute paths,
Windows drive/device/stream names, empty segments and trailing dots or spaces are
refused with `ERR_ARCANEA_WORLD_PATH`. A file cannot also be a parent directory
within the same batch.

The selected root must be an actual directory, rather than a symlink/junction;
use its canonical directory path. Existing directory redirects, file symlinks,
non-file targets and files with additional hard links are refused. Existing files
are opened without truncation, then checked through the open handle and path
before writing. The same checks protect `writeManifest`, harness character/lore/
quest writes and private memory capture.

Ordinary writes may replace an existing regular file. Use
`writeFiles(dir, files, { exclusive: true })` to require new files; an existing
target or duplicate batch path fails with `EEXIST`. Memory capture retains this
exclusive creation behavior.

These safeguards assume a creator-owned folder and a single trusted filesystem
writer. They do not provide an operating-system sandbox against a process that
can concurrently replace ancestor directories or add hard links. Batch input and
existing-path checks happen before writes; disk errors or later filesystem
changes can still interrupt a batch after earlier files have been written.

World files remain editable through the general APIs. Containment does not
approve canon, authorize a tenant, constrain an arbitrary Node process, or
implement signed human promotion. Tracked/source-declared hashing, extension
validation and the remaining graph/promotion work in issue #283 are open.

## Scoped local commits

`harnessContext(...).commit(message)` selects only the paths successfully written
by that context's character, lore and quest tools since its previous successful
commit. Calls within one context run in order, including concurrent calls across
a commit boundary. Failed writes never enter its scope. A failed commit retains
the pending scope; correct the Git or hook error and retry. A context with no
writes leaves unrelated staging alone.

For direct calls, supply exact existing file paths:

```js
const receipt = await commitWorld(worldDir, "Revise Sera", {
  paths: ["characters/sera.md"],
});
```

The old implicit whole-repository commit is removed. Missing scope throws
`ERR_ARCANEA_GIT_SCOPE_REQUIRED`. Paths use the same portable containment checks
as the writer; Git metadata and redirected/non-regular files cannot be selected.
`checkWorldFiles(dir, paths)` exposes this read-only validation and returns the
canonical root and deduplicated paths. The world must be its own Git root;
a folder inside another repository fails with `ERR_ARCANEA_GIT_ROOT`.

Git interprets paths literally, so brackets and leading dashes do not expand the
scope. A partial commit takes the selected working files and preserves unrelated
staged, unstaged and untracked work. Existing staged changes on a selected file
fail with `ERR_ARCANEA_GIT_STAGED_CONFLICT` before staging changes. New files use
intent-to-add, then `git commit --only`; signing and hooks remain active. Selected
files with assume-unchanged or skip-worktree flags fail with
`ERR_ARCANEA_GIT_INDEX_FLAGS`; the SDK leaves those flags intact. Ignored
files are not force-added. Inherited Git repository/index routing variables are
removed from these subprocesses; normal Git configuration is retained.

The receipt reports `committed` with the SHA and paths, `unchanged` when selected
files have no changes, or `not-a-repository` for a non-Git folder. Other Git errors
throw `ERR_ARCANEA_GIT_COMMIT` with the failed operation and exit code, without
returning private hook output. After a failed attempt, new files may retain their
intent-to-add index entry; their draft bytes remain available for retry. The SDK
does not remove index locks, push commits, disable hooks or discard drafts.

This contract assumes trusted Git configuration/hooks and a single filesystem
writer. Hooks can run arbitrary code, and a hostile process can race these path
checks. A commit followed by a receipt-read failure may already exist in history;
inspect local history before retrying. Scoped local commits do not grant tenant
authorization, approve canon or publish an edition.
