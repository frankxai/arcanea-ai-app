# Weight of Wonders expansion — independent content verification

Date: 2026-09-09  
Verifier: `/root/wonders_verifier`  
Scope: `work/wow-expansion/entries.json`, `living-crucibles.md`, `generation-records.json`, and the six source/delivery image pairs for `wow-b04`–`wow-b06` and `wow-d04`–`wow-d06`.

## Verdict

**PASS for experimental content integration.** The six records are coherent additions to the proposed watershed, the three boss/dungeon pairs are mechanically distinct, and every victory produces a clear local result. No record claims locked canon, a shipped game, implemented balance, biological simulation, or a published novel.

This verdict is limited to the expansion content and image provenance. It is not a runtime, accessibility, performance, deployment, or canon-promotion approval.

## Structural and provenance evidence

- Reviewed inert PR head `7de0c429fc8be5cb1b4f3a7134237573d4ebbe3c`. Its final commit changes only Markdown table spacing in `living-crucibles.md`; GitHub's one-file patch has no textual content change. The local guide's Git blob is the reviewed `802429f1fdf5142b801202921d465c68381d46a0`.
- Six unique IDs and slugs: three bosses and three dungeons.
- Every `relatedSlug` is present, reciprocal, and crosses boss/dungeon kind.
- Every record is `EXPERIMENTAL`.
- Boss totals are exactly nine phases, nine endings, and three four-item `foodWeb` arrays.
- All six records contain two story seeds, a four-beat session kit, and all four optional growth fields: `practice`, `mastery`, `reward`, and `rematch`.
- All six source PNG hashes and byte counts match `generation-records.json`.
- All six delivery WebP hashes, byte counts, and dimensions match both provenance and `entries.json` (excluding the entry-only `alt` field). Source and delivery dimensions are identical.
- Running `build_entries.py` in an isolated copy with the recorded generation metadata reproduces `entries.json` byte for byte (SHA-256 `dfcf13cf854c8cb98a2e5c8f19ec4e84c3bbdb8f9af5398aa9e0a0e19f951a1b`).
- The recorded transform is same-dimension WebP quality-90 encoding with no crop or creative edit.
- The immutable Glassroot generation prompt still records the initial above-water “buoyancy chamber” intent. The current authored record correctly supersedes that interpretation with a root-anchored, weight-bearing carbonate keel and supported fluid reservoir. Runtime lore must use the current `entries.json`; the prompt remains provenance of generation intent, not approved anatomy.

## Canon and publication boundary

The expansion preserves the authoritative packet's material conflict: water allocation, infrastructure, migration, displacement, and institutional wrongdoing. It adds a downstream proposed campaign without changing the existing three-book proposal.

Othrek remains an ordinary human adversary with chosen political acts. His record expressly says he does not replace Malachar, alter a locked cosmic identity, or establish a universal evil. This is compatible with the locked “only true antagonist” rule because “regional antagonist” is used as a dramatic function, not a new cosmic source. Keep that qualifying paragraph wherever Othrek's history is excerpted; do not surface the label alone as a canon classification.

No boss is recast as a Guardian, Godbeast, deity, Gate, universal power, or new origin class. The local “drowned father's supper call,” “tree's second soul,” and “Salt Regent” language is identified as belief, metaphor, or political title rather than cosmological fact.

## Agency, encounter logic, and victory

| Pair | Agency and learned demand | Clear victory | Persistent consequence |
|---|---|---|---|
| Tharvoss / Spawning Stair | A displaced predator learns a boat-bell association, changes from suction to lateral lunges, and learns repeated lures. Players read foam, throat expansion, planted limbs, current, and gate state. | Stop occupied-boat attacks, restore a usable crossing, and drive out or kill the individual. | Every ending reopens or rebuilds passage; killing the animal alone is explicitly insufficient. |
| Glassroot Hunger / Sepulchre | A distributed colony reallocates feeding and defensive parts while seeking living roots. Players learn a safe feeding sequence, interrupt connected structures, and protect a nursery. | Isolate/destroy, evacuate/purge, or cut supply and contain the giant colony. | Each ending ends nursery access while retaining a restoration or containment burden. Harmless small colonies are distinguished from the exceptional giant. |
| Othrek / Brine Tribunal | A human commander protects a finite pressure supply, directs guards, and attempts a final saline release. Players distinguish weapon cues, secure workers, and control infrastructure. | Defeat or arrest Othrek, stop the bypass, and visibly reopen civilian water. | Records, trained operators, public schedules, and later storm defense turn victory into durable governance rather than a throne swap. |

The encounter design supplies agency beyond damage races. Each phase names a cue, response, recovery or environmental operation. Each mastery condition adds protection, evidence, or infrastructure goals. Rematches preserve learned cues and recombine demands rather than hiding information or only increasing health.

Rewards are bounded proposals: a situational brace at marked cover, observation-based opening calls, compatible-anchor grappling, a counter to committed strikes, reopened routes, a saved nursery, and public water. None is presented as a Gate, general immunity, unseen-enemy revelation, or implemented game balance.

## Ecology and research boundary

The real-world reference translations are accurate at the level claimed:

- NOAA states that engineered barriers can prevent migratory fish reaching habitat needed to reproduce and grow, while restoration can preserve useful infrastructure through fish passage.
- MBARI describes siphonophores as marine colonies whose specialized parts handle buoyancy, swimming, feeding, defense, and reproduction.
- The PlayStation combat article supports the guide's interpretation that legible opponent responses, positioning, action/reaction, and satisfying feedback matter in combat.
- The Capcom page was access-blocked during this review, so its narrow “changing environments and apex predators” summary was not independently fetched. It functions as inspiration rather than a factual dependency of the records.

The fiction clearly separates translation from simulation. Tharvoss's scale and suction physics, the Hunger's freshwater rooted giant form and photosynthetic tissue, and all hydraulic values remain invented or unmodeled. The art notes correctly state that paintings cannot prove exact scale, anatomy, water chemistry, structural loads, route continuity, or combat motion.

## Independent visual review

All six source masters were inspected at original resolution.

- **Tharvoss:** strong low, load-bearing silhouette, clear pleated throat, planted limbs, stranded boats, keeper scale, and active flow. The image does not prove eighteen-metre scale or pressure physics; the art note captures this.
- **Spawning Stair:** the continuous cliff stair, central gate, service channel, inhabited bridges, fish concentration, and submerged predator are readable in one vista. Its exact passage hydraulics remain illustrative.
- **Glassroot Hunger:** the broken-question-mark silhouette, large negative space, differentiated bells/cups/ribbons, lifted cover, dry ledge, and seed-vault shelves are distinct and legible. The current root-supported anatomy is the necessary interpretation because the upper reservoir is visibly above water.
- **Glassroot Sepulchre:** healthy moss/bird and salt-crusted/colonized banks create a clear disturbance contrast, while the sampling keeper supplies human action. Color and crust alone do not establish salinity; retained samples and records must remain part of the story.
- **Marshal Othrek:** mature human antagonist, asymmetric mantle, practical plate construction, tool-derived polearm, vented gauntlet, workers, guards, and tidal infrastructure read clearly. The still image establishes identity and equipment, not attack timing.
- **Brine Tribunal:** the causeway, twin gate towers, worker tap, lower service ledge, internal stair, counterweights, separate channels, and salt pans support the route and governance story. Water color does not identify salinity, and exact connectivity requires level design.

All six are finished individual images rather than sheets or placeholders. The alt text describes visible content without treating unproved mechanics as visible fact.

## Conditions carried into integration

1. Preserve `EXPERIMENTAL` on every record and the public statement that these are encounter/story proposals, not a released game, biological simulation, locked canon, or published novels.
2. Preserve each `artNote`, especially the Glassroot reservoir correction and the limits on water chemistry, exact scale, connectivity, and motion.
3. Use `entries.json` as the current narrative source. Do not reconstruct anatomy from the immutable generation prompt.
4. If Othrek's “regional antagonist” phrase is excerpted outside the full history, include the same-context qualification that he does not replace Malachar or establish a universal evil.
5. Keep player techniques framed as optional, unbalanced proposals that require prototyping and playtesting.

No content blocker remains in the reviewed expansion packet.
