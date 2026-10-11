# @arcanea/world-sdk

Runtime for the **Arcanea World Repo Standard**. A world is a folder/repo; this SDK is what
lets every layer read and build it. The repo is the source of truth — this is the derived plumbing.

Spec: `arcanea-ecosystem/docs/WORLD_REPO_STANDARD.md` · Schema: `arcanea-ecosystem/schemas/world.arcanea.schema.json`

## What's inside

| Module        | Role                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `manifest`    | manifest defaults, world id, slug, hashing-canonical form                                                                                        |
| `validate`    | zero-dep validator mirroring the JSON Schema                                                                                                     |
| `contenthash` | deterministic sha256 over **public** files — provable before any chain                                                                           |
| `fs-world`    | read/write a world folder; frontmatter visibility                                                                                                |
| `genesis`     | one sentence → a World Bible (deterministic offline, LLM-pluggable)                                                                              |
| `scaffold`    | WorldSpec → a conforming world repo (reuses `@arcanea/world-engine`)                                                                             |
| `harness`     | agents read assignments from the manifest, write canonical folders, commit                                                                       |
| `index-build` | world → world-graph nodes + embed-ready chunks (repo → index, one way)                                                                           |
| `webhook`     | framework-agnostic push handler with HMAC verify                                                                                                 |
| `proof`       | invisible wallet + mint adapters; `claimWorldProof` appends `provenance[]`                                                                       |
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
import { createWorld, readWorld, buildIndex, remember } from "@arcanea/world-sdk";
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
