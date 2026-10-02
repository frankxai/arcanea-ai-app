# @arcanea/world-sdk

Runtime for the Arcanea World Repo Standard. A world is a folder/repo; the SDK
provides manifest construction, validation, scaffolding, hashing and a derived
index. The world repo remains its source.

Spec: `arcanea-ecosystem/docs/WORLD_REPO_STANDARD.md`.
Schema: `arcanea-ecosystem/schemas/world.arcanea.schema.json`.
This repair uses the existing contract; it creates no separate world schema.

## Content rights and royalties

`buildManifest`, `scaffoldWorld` and `createWorld` leave `license` and `royalty`
absent by default. No commercial-use grant, remix permission or Arcanea royalty
is selected. The generated README reports those choices as unselected.

Explicit caller values are preserved. For `createWorld`, supply them in its
options; licence/royalty fields returned by an enrichment model are discarded.
For a hand-authored `scaffoldWorld` spec, the caller supplies any declarations.
These are declarations, not authenticated approval or verified source rights.

If the caller selects `licenses/LICENSE.md` or `licenses/royalty.json` as a
pointer, scaffolding writes a declaration summary at that fixed path. The
licence summary is not full licence text. Other pointers stay metadata: the
caller supplies the referenced files. Proof records omit absent pointers rather
than inventing files or terms. Existing worlds and policies are not migrated.

The package's existing licence metadata does not select the licence for a
creator's world or clear imported material. Arcanea's code/lore licence choices
remain separate human decisions.

## Memory and canon

`recordMemory`, `listMemories`, `remember` and `distillOffline` retain the existing
local `.arcanea/memories` workflow. Those memory files are excluded from the
existing content hash.

`evolveCharacter` and `evolve` always reject with the error code
`CANON_PROMOTION_REQUIRES_REVIEW`, before reading or writing a world. The CLI's
`evolve` command exits with status 1 and the same code. Callers must handle this
breaking restriction. A supplied `approved` flag cannot authorize promotion.

Keep proposed changes separate for human review. This SDK has no signed human
promotion-receipt verifier; this change does not add a candidate schema or a
publication workflow. Arcanea's locked canon remains in
`.arcanea/lore/CANON_LOCKED.md`.

Other SDK boundaries remain open in [#283](https://github.com/frankxai/arcanea-ai-app/issues/283):
contained writes, tracked/declared source hashing, exact-path Git staging,
commit error propagation, v1.1 validation and other public-canon writers.
Scaffolds retain their existing public visibility/canon-level defaults.
This narrow repair does not establish general agent safety or release readiness.

## Local use

```bash
node bin/cli.mjs create "a drowned city where memory is currency" ./my-world
node bin/cli.mjs validate ./my-world
node bin/cli.mjs hash ./my-world
node bin/cli.mjs index ./my-world
```

```js
import { createWorld, readWorld, buildIndex } from "@arcanea/world-sdk";

await createWorld("./my-world", "a drowned city where memory is currency", {
  useWorldEngine: false,
});
const index = buildIndex(await readWorld("./my-world"));
```

The existing `claim` command uses a deterministic mock chain. It creates local
test provenance, not a real-chain transaction or proof of legal ownership.
Real adapters and publication require separate review and acceptance.

## Test

```bash
node --test tests/*.test.mjs
```

The native app CI runs this suite under Node22. Fixtures verify omitted policy
defaults, explicit caller declarations, model policy injection and blocked
promotion with unchanged world bytes/hash. They do not demonstrate real creator
acceptance, a game-engine import or a published world.
