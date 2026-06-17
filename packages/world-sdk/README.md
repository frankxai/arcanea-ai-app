# @arcanea/world-sdk

Runtime for the **Arcanea World Repo Standard**. A world is a folder/repo; this SDK is what
lets every layer read and build it. The repo is the source of truth — this is the derived plumbing.

Spec: `arcanea-ecosystem/docs/WORLD_REPO_STANDARD.md` · Schema: `arcanea-ecosystem/schemas/world.arcanea.schema.json`

## What's inside
| Module | Role |
|---|---|
| `manifest` | manifest defaults, world id, slug, hashing-canonical form |
| `validate` | zero-dep validator mirroring the JSON Schema |
| `contenthash` | deterministic sha256 over **public** files — provable before any chain |
| `fs-world` | read/write a world folder; frontmatter visibility |
| `genesis` | one sentence → a World Bible (deterministic offline, LLM-pluggable) |
| `scaffold` | WorldSpec → a conforming world repo (reuses `@arcanea/world-engine`) |
| `harness` | agents read assignments from the manifest, write canonical folders, commit |
| `index-build` | world → world-graph nodes + embed-ready chunks (repo → index, one way) |
| `webhook` | framework-agnostic push handler with HMAC verify |
| `proof` | invisible wallet + mint adapters; `claimWorldProof` appends `provenance[]` |
| `evolution` | recordMemory (to .arcanea/memories, hash-safe) → distillOffline → evolveCharacter (char + canonLevel-2 lore); lived-in worlds grow canon visibly |

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
import { createWorld, readWorld, buildIndex } from "@arcanea/world-sdk";
import { claimWorldProof, mockChain } from "@arcanea/world-sdk/proof";

const { manifest } = await createWorld("./my-world", "a drowned city where memory is currency");
const index = buildIndex(await readWorld("./my-world"));   // repo → index
await claimWorldProof({ dir: "./my-world", adapter: mockChain("solana") }); // sovereignty button
await remember("./my-world", "She opened the tide-gate for a dying diver.", { characterId: "sister-lethe", salience: 0.9 });
await evolve("./my-world", "sister-lethe"); // char evolves + public level-2 lore added; hash moves
```

Swap `mockChain()` for a real Solana (Metaplex/Helius) or EVM (thirdweb) adapter — same interface.

## Test
```bash
node --test tests/*.test.mjs
```
