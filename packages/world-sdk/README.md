# @arcanea/world-sdk

Runtime for the **Arcanea World Repo Standard**. A world is a folder/repo; this SDK is what
lets every layer read and build it. The repo is the source of truth — this is the derived plumbing.

Spec: `arcanea-ecosystem/docs/WORLD_REPO_STANDARD.md` · Schema: `arcanea-ecosystem/schemas/world.arcanea.schema.json`

## Manifest validation

`validateManifest(value)` checks core fields and the optional v1.1 `game`,
`memory`, `meaning`, `community` and `mapper` sections. It returns field paths
and errors, without changing data, coercing types, fetching schema URLs or
applying schema defaults. Unknown fields refuse where the shared contract closes
an object. Custom content pointers and open JSON state remain supported.

`buildManifest` preserves an explicit `schemaVersion` and supplied extensions;
its base default remains `1.0.0`. `scaffoldWorld` and `createWorld` refuse an
invalid emitted manifest with `ERR_ARCANEA_WORLD_MANIFEST` before optional
world-engine import or destination writes. Repair the input and retry. Existing
worlds remain readable for inspection and repair; `arcanea-world validate <dir>`
exits 1 for invalid shape and leaves files unchanged. General `writeManifest`
is still a local editing primitive; it does not automatically run validation.

The offline schema mirror is pinned to [the shared standard at
75a31a6](https://github.com/frankxai/arcanea-ecosystem/blob/75a31a6f101b3c8008a9ac958e9314909e67de3f/schemas/world.arcanea.schema.json),
upstream SHA256
`a53e183ef8d9538863b33d7a706bd6c16a343489f41362b8f88a8fd486a65d04`.
The local copy uses repository formatting with identical parsed schema content;
its SHA256 is
`f217e054810cecd53a31456c87e2c353f38c2e3d786125083ae5dc153a00f0ef`.
The zero-dependency evaluator implements only that schema's keywords and refuses
unsupported schema keywords on load. `format`, including `date-time`, remains
an annotation under its 2020-12 dialect. Existing SDK checks for nonempty SPDX
and provenance timestamps and nonempty royalty splits totaling 10,000 bps also
apply. Validation grants no rights, provider, canon or publication authority.

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
| `proof`       | tagged local proposals and mock adapters; profile-dependent claims refuse                                     |
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

const { manifest } = await createWorld(
  "./my-world",
  "a drowned city where memory is currency",
);
const index = buildIndex(await readWorld("./my-world")); // repo → index
await remember("./my-world", "She opened the tide-gate for a dying diver.", {
  characterId: "sister-lethe",
  salience: 0.9,
});
```

`claimWorldProof(...)` now always rejects with
`WORLD_HASH_PROFILE_REQUIRES_REVIEW` before accessing caller options, the world,
wallet/mint adapters or provenance. This includes mock adapters and CLI `claim`.
The declared-source hash profile changes which files participate, so existing
untagged proof records cannot safely describe it. `computeProof(...)` produces
a local proposal tagged with `hashProfile`; it grants no claim, rights or canon
approval. The shared contract owner must accept a profile-aware contract before
claims can resume. No approval flag can re-enable this claim helper.

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

## Realm continuity and change impact

The local Realm Graph reads the immutable `.arcanea/lore/CANON_LOCKED.md` Git
blob at a full commit. Generator `arcanea.locked-canon-projection.v1` retains the
original Gate/God/Godbeast identifiers and projects 62 entities and 97 facts from
the current approved foundation, Gates, elements, ranks, Wisdoms, Malachar,
Academy Houses and explicitly LOCKED terminology rows. Elements, ranks, Wisdoms
and terms use separate world-rule namespaces; Houses are factions. Wisdoms are
aspects, and Luminor is a rank. Element `Wind` and Wisdom `Air` retain their
actual source wording without inferred equivalence.

The graph also carries 11 source segments: the six current fully LOCKED sections
(including extensibility principles) and five explicitly LOCKED terminology
rows. `realmContinuity(...).canonContext` returns these segments and compiler
ambiguities alongside the scene's facts. Segment text preserves the selected
lines with newline normalization, including prose qualifications about Nero,
Malachar and the institutional Houses. Each citation binds the full Git blob
hash, immutable commit and inclusive line range.

The source's Magic Ranks table assigns Luminor to 9-10 open Gates, while its
LOCKED terminology row requires all 10. `ambiguity:luminor-gates` retains both
citations with `human-resolution-required`; the compiler does not resolve this
discrepancy. This is explicit compiler metadata, not a general semantic
contradiction detector. The source pin remains unchanged. Source drift refuses
until a reviewed compiler update changes the pin. Neither a supplied hash nor a
serialized graph establishes canon authority.

STAGING sections, STAGING terminology rows, auxiliary lore files, the historical
approval log and its unique details are outside this current projection. A
"Locked novel" sentence inside a STAGING Realm section does not promote that
section. Historical entries can require separate reconciliation; their presence
does not replace the current tables. Generated context is read-only, and the host
chooses how much to include in a model request under its privacy and budget rules.

A staging JSON overlay links characters, places, factions, creatures, artifacts,
world rules, events, timelines, series, works, scenes, quests, assets and releases.
It contains metadata and short assertions, with source paths/hashes; keep
manuscript bodies in AuthorOS. Candidate citations are declarations, not verified
source evidence. Only `STAGING` and `CANDIDATE` assertions are accepted. There is
no promotion or canon-write API, and proposed supersessions retain locked facts.

```js
import {
  openRealmGraph,
  realmContinuity,
  realmImpact,
  exportRealmGraph,
} from "@arcanea/world-sdk";

const graph = await openRealmGraph(arcaneaRepo, fullSourceCommit, staging);
const context = realmContinuity(graph, characterId, sceneId);
const impact = realmImpact(graph, proposedAssertionId);
const saved = exportRealmGraph(graph);
// Reload re-verifies Git canon; serialized LOCKED fields are never imported.
const restored = await openRealmGraph(
  arcaneaRepo,
  saved.canonSource.commit,
  saved.staging,
);
```

Continuity requires a declared participant and uses the scene's ordinal moment
on its named timeline. Validity is `[from, to)`; `null` is timeless or an unbounded
end. It returns the character's locked facts and their directly named canon
entities, applicable candidate assertions and conflicts for single-valued
predicates. It compares declared values, not prose meaning. A many-valued
relationship permits several values unless the same group also has a
single-valued constraint. Timeless canon is retained across scenes; candidates
cannot overwrite it or remove it by naming it in `supersedes`.

Impact follows only declared dependency and affected-artifact links. It returns
scenes, books/works, assets, quests, series and releases, with a deterministic
shortest path per artifact. Cycles terminate. Missing links remain missing
coverage; the traversal does not infer every affected work from narrative prose.

The existing CLI provides the same read-only operations:

```text
arcanea-world realm continuity <repo> <full-commit> <staging.json> <character-id> <scene-id>
arcanea-world realm impact <repo> <full-commit> <staging.json> <change-id>
arcanea-world realm export <repo> <full-commit> <staging.json>
```

Export JSON to a creator-chosen destination and preserve the input overlay for
editing/retry. The bundled test fixture is synthetic and uses `ARC-REL-001` only
as a release-lane identifier. Its scenes/proposals are not Dragonborne manuscript
facts or approvals. Shape documentation is `src/realm-graph.schema.json`; runtime
also verifies references, interval ordering, 1 MB/depth bounds and actual pinned
Git bytes. Invalid inputs fail before any repository, graph or canon writes.

This is a local SDK/CLI read boundary. The calling host owns repository access
and tenant authorization. It does not verify human signatures, grant rights,
publish a package, authorize model/provider use or constrain arbitrary Node code.

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
implement signed human promotion. Extension validation and the remaining
graph/promotion work in issue #283 are open.

## Declared sources and private reads

`readWorld(dir)` selects the manifest's `content` roots, `README.md`, and local
license/royalty/cover/audio pointers. It supports ordinary folders without Git.
Unrelated root notes, hidden files and tooling directories are omitted, including
hidden/tooling files inside a declared root. Missing declarations contribute no
file bytes; this does not establish that a declared policy or asset exists.
HTTP(S) pointers are metadata only and are never downloaded. Files selected by
multiple declarations participate once. Aliases, traversal, reserved names and
private/tooling declarations refuse.

`contentHash` and `buildIndex` apply the same declarations to caller-supplied
file arrays. Non-public worlds refuse these public operations. Private/unlisted
documents and `CANDIDATE`, `STAGING` or `DRAFT` documents are excluded. Frontmatter
uses `---` fences and flat scalar fields, with BOM/CRLF, quoted keys and comments
supported. Duplicate keys, invalid visibility/status, nested/compound YAML,
aliases and incomplete headers fail with `ERR_ARCANEA_SOURCE_METADATA`. Complex
metadata must be rewritten to the documented profile before publication;
unsupported syntax is never silently classified as public. Original file bytes
are retained; index text strips supported headers and normalizes BOM/CRLF.

The exported `CONTENT_HASH_PROFILE` is
`arcanea-world-sdk/declared-public-v1`, reused from the existing draft #499 proposal.
The profile marker participates in the hash. This is a breaking hash change:
recompute local snapshots and retain old hashes with their original inputs.
It is not approval of the World Repo Standard's onchain proof contract.

World and memory reads reject redirected roots/ancestors/directories, file
symlinks and additional hard links. File bytes are read through the same checked
open handle. An absent `.arcanea/memories` directory returns an empty list;
permission/I/O failures propagate, and invalid JSON or memory fields raise
`ERR_ARCANEA_MEMORY_INVALID` without including record prose. Safe legacy JSON
filenames and equal-timestamp events remain readable. Invalid new memory input
refuses before creating a record. A creator can retain and repair a corrupt
record, then retry; the reader never deletes or repairs it automatically.
`remember` checks the existing store before appending. A pre-existing corrupt
record therefore cannot turn a refused call into a duplicate append on retry.

These checks require a creator-owned, stable filesystem and one writer. A hostile
process that swaps ancestors during I/O still requires OS isolation. This local
boundary does not establish tenant authorization, Git-host confidentiality,
signed human promotion, package publication or customer acceptance.

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
