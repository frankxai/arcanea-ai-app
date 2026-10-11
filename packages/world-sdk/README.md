# @arcanea/world-sdk

Runtime for the Arcanea World Repo Standard. A world is a folder/repo; the SDK
provides manifest construction, validation, scaffolding, hashing and a derived
index. The world repo remains its source.

Spec: `arcanea-ecosystem/docs/WORLD_REPO_STANDARD.md`.
Schema: `arcanea-ecosystem/schemas/world.arcanea.schema.json`.
This repair creates no separate world schema. Declared-source hashing uses a
local SDK profile that differs from the pinned standard's tracked-file rule;
its acceptance in the shared proof contract remains pending.

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
licence summary is not full licence text. The caller supplies files for other
relative pointers; they must remain inside the world. Proof records omit absent pointers rather
than inventing files or terms. Existing worlds and policies are not migrated.

The package's existing licence metadata does not select the licence for a
creator's world or clear imported material. Arcanea's code/lore licence choices
remain separate human decisions.

## Memory and canon

`recordMemory`, `listMemories`, `remember` and `distillOffline` retain the existing
local `.arcanea/memories` workflow. Those memory files are excluded from the
existing content hash.

Memory filenames include a unique ID and use exclusive creation, so records
sharing a timestamp cannot overwrite one another. An explicit timestamp must
be a parseable ISO date-time; invalid values fail before creating directories.
Legacy memory files remain readable. Missing memory folders return an empty list;
malformed files and I/O errors reject instead of concealing a failed read.

`evolveCharacter` and `evolve` always reject with the error code
`CANON_PROMOTION_REQUIRES_REVIEW`, before reading or writing a world. The CLI's
`evolve` command exits with status 1 and the same code. Callers must handle this
breaking restriction. A supplied `approved` flag cannot authorize promotion.

`addCharacter`, `appendLore` and `addQuest` now create unique, append-only Markdown
files under `.arcanea/candidates/`, with `visibility: private` and
`status: CANDIDATE`. Caller visibility/canon-level flags cannot promote them.
They leave accepted source files intact. Keep proposals local for human review:
frontmatter does not make a public Git repository confidential. This SDK has no
signed human promotion-receipt verifier or publication workflow. Arcanea's locked canon remains in
`.arcanea/lore/CANON_LOCKED.md`.

## File, source and Git boundaries

World paths use portable relative paths. Reads and writes reject traversal,
absolute paths, Windows aliases, links/junctions and hardlinked files. Write batches
validate every destination before creating files; scaffold refuses existing output
files. Generic writes reject locked frontmatter and the reserved `CANON_LOCKED.md`
filename. These checks require a caller-owned, stable filesystem: another process
can swap ancestors between a check and I/O. Unexpected I/O failures may leave
partial new files; the whole batch is not an atomic transaction.

`readWorld` reads declared `content` roots, the standard README and local
licence/royalty/cover/audio pointers. Optional missing content roots are empty;
an explicit missing file pointer rejects. Hidden/tooling/build files are excluded.
Remote HTTP(S) pointers remain metadata and are not fetched or verified.
Hashing and indexing share this source selection, even for supplied file arrays.
Private/unlisted files and draft/candidate/staging documents are excluded; actual
Markdown metadata overrides supplied public flags. Ambiguous YAML fails closed.
Non-public worlds cannot produce a public hash/index or call proof adapters.
Custom content roots also determine index node sections.

`commitWorld(dir, message, { paths: ["canon/bridge.md"] })` requires explicit
existing regular files at the Git root. It rejects unrelated staged changes,
directory/pathspec inputs and redirected Git environments; it never stages the
whole repository. Git/signing/hook failures reject. A sole Git writer is required.
Failed commits remove paths newly staged by that call and preserve prior selected
index bytes. Cleanup failures surface both errors and require manual index
inspection. Staged rename preflight inspects both names. Git repository/index/ref/
configuration environment variables, including empty values, are rejected;
only host `GIT_PAGER` and `GIT_LFS_PATH` variables are allowed.
`harnessContext.commit` commits only candidates created through that context,
retains pending paths after failure and rejects when there are no new candidates.
It does not push or authorize publication. This is a breaking API change.

Still open in [#283](https://github.com/frankxai/arcanea-ai-app/issues/283): full
v1.1 validation, signed human promotion, locked graph projection and continuity
proofs. Scaffolds retain public visibility/canon-level defaults, and generic
non-locked writes still rely on the caller's authority. A new manifest or public
metadata is not authenticated approval. Release and creator acceptance remain open.

## Hash compatibility and proof claims

`CONTENT_HASH_PROFILE` identifies `arcanea-world-sdk/declared-public-v1`.
The profile label participates in the hash domain, alongside declared public
sources and the stable manifest core. The default declared roots include `game/`;
custom roots and explicit local pointers follow the same selection.

This is a breaking hash change. Old SDK hashes/provenance and World Repo Standard
section4 tracked-file hashes are not interchangeable with this profile. Preserve
the original inputs and pinned SDK revision for historical comparisons. This SDK
does not migrate or re-verify legacy provenance, or label it verified by the new
profile. Existing provenance stays unchanged.

`computeProof` returns a local proposal with `hashProfile`. The current shared
provenance schema has no profile field, so `claimWorldProof` and CLI `claim` always
reject with `WORLD_HASH_PROFILE_REQUIRES_REVIEW` before filesystem access, adapters
or provenance writes, including mock claims. Caller approval flags cannot bypass
this gate. Profile-aware proof-contract acceptance belongs to the existing owner;
the World Repo Standard/schema version is not silently reassigned.

LLM enrichment is limited to creative fields and `theme.prompt`. Model-provided
identity, creator/wallet, provenance, snapshots, hosting, visibility, cover and
external file pointers cannot select those decisions. Caller declarations and
hand-authored scaffolds remain subject to their existing authority limits.

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

The `claim` command is blocked pending hash-profile contract acceptance. The
standalone `mockChain` remains a deterministic local fixture; no mock or real
adapter is called by `claimWorldProof`. Hashes do not establish legal ownership.

## Test

```bash
node --test tests/*.test.mjs
```

The native app CI runs this suite under Node22 with frozen `yaml@2.9.1`.
Fixtures cover rights/promotion, filesystem containment, declared public sources,
ambiguous visibility, exact Git commits and unchanged accepted files. They do not demonstrate real creator
acceptance, a game-engine import or a published world.
