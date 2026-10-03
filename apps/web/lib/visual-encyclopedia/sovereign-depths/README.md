# Sovereign Depths source records

These data files compose one collection through `../sovereign-depths.ts`: metadata, two boss arrays and the dungeon array. They are separated for complete, bounded review; no narrative is omitted or stored in a binary archive.

## Generation clock and evidence

`image.generatedAt` records the actual UTC generation session on **9 September 2026**. It is not a target publication date or a placeholder. These timestamps are preserved from the source generation records rather than changed to accommodate an external model’s assumed current date. The GitHub creation timestamp for [the original release packet](https://github.com/frankxai/arcanea-ai-app/pull/361) is also 9 September 2026 (`2026-09-09T01:17:38Z`).

Final source hashes, tool/provider information, exact prompts and generation times are preserved in `docs/worldbuilding/sovereign-depths/final-art-manifest-bosses.json` and `final-art-manifest-dungeons.json`. The separate Git blob manifest identifies the actual delivered WebP bytes.

## Mixed proposal status

A location can carry an EXPERIMENTAL historical claim while an inhabitant’s independently scoped ecology remains STAGING. Status does not automatically propagate through every relationship. It does propagate through nested content: Veyrath (b22), for example, has a STAGING animal description but an EXPERIMENTAL linked story. The public reader recursively withholds the entire dossier when any nested claim is experimental and the caller has not explicitly opted in. No relationship promotes a proposal into locked canon.

These files are data only until the separately reviewed collection integration imports them. Proposed books and authored encounters are not published novels or implemented game systems.
