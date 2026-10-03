# Legacy Arcanea recovery before archive

Status: content-identity inventory and one recovery candidate. No archive, migration, rights grant or canon promotion.
Owner: [program #276](https://github.com/frankxai/arcanea-ai-app/issues/276), existing draft #487.

## Bound sources

- Legacy public `frankxai/arcanea`: `a88b76974a5a9778346c78861d7dc47f1dad7f8b`.
- Public app main: `4e1d914f1916987d0b059be9ca4c35077f9b6d9d`.
- Existing consolidation draft before this delta: `5a2b22af8a77fc3544b071e6970c9a4e314c9858`.

GitHub refs were checked against these commits. Native full Git trees reproduce the preserved nontruncated API trees and corrected classifications. The legacy tree has 5,420 non-tree entries, main 6,656 and the draft 6,421. These are path entries, not distinct content, useful-work counts or skill-discovery counts. Tree nodes are excluded; tracked symlinks and Gitlinks would be recorded without following them. The measured legacy has zero such special entries.

## What survives and what needs review

| Legacy path classification                      | App main | Consolidation base |
| ----------------------------------------------- | -------: | -----------------: |
| Same path, object/type/mode equal               |      839 |                713 |
| Same path, object/type/mode differ              |    1,201 |              1,051 |
| Legacy-only path, object/type present elsewhere |      297 |                297 |
| Legacy-only path, object/type absent            |    3,083 |              3,359 |
| Total legacy entries                            |    5,420 |              5,420 |

Main has 3,380 legacy-only paths and 4,616 app-only paths. The original supplied 4,614 figure came from another comparison; it is not the count at this main SHA. The draft has 3,656 legacy-only and 4,657 target-only paths. Its different counts describe that revision, including separately reviewed development-source subtraction; this audit does not adjudicate those removals.

Across all legacy paths, including same-path divergences, main lacks 3,451 distinct `(type, object)` pairs referenced by 4,273 source paths. The draft lacks 3,527 pairs referenced by 4,399 paths. These are byte/object distinctions, not a semantic uniqueness claim. Eleven of main's same-path divergences have the old object elsewhere. A file preserved under another path may still have different execution mode, missing support files, obsolete dependencies or no migrated consumer. Every row records both the target at the same path and every matching target object.

Among main's path-only absent entries: experiments 907, `.claude` 502, archive 277, `arcanea-skills-opensource` 114, `.arcanea` 107 and sync 97. Do not bulk-import these roots. Some contain legacy instructions, third-party material or abandoned variants. Compare useful source groups and active consumers before assigning a destination or deletion decision.

## Vael'Keth recovery candidate

The nine entries below are absent by object/type from both target trees. Eight are fictional geography, culture, species, conflict, quest and character files; the ninth is a historical character-authoring guide. Links preserve exact source paths and commits without creating another lore pack or turning historical instructions into active agent policy.

| Pinned source file                                                                                                                                                                                                                                          | Git blob                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [characters/CLAUDE.md](https://github.com/frankxai/arcanea/blob/a88b76974a5a9778346c78861d7dc47f1dad7f8b/Arcanea%20World%20Building%20Agents%20and%20workflows/worlds/arcanea/characters/CLAUDE.md)                                                         | `5d4ad0d01f6f3039105632f444627855bef375da` |
| [characters/high-pyromancer-varos.arc](https://github.com/frankxai/arcanea/blob/a88b76974a5a9778346c78861d7dc47f1dad7f8b/Arcanea%20World%20Building%20Agents%20and%20workflows/worlds/arcanea/characters/high-pyromancer-varos.arc)                         | `396e6c5279aff7816f4c664bd473f509140a58c6` |
| [characters/kuroth-soul-smith.arc](https://github.com/frankxai/arcanea/blob/a88b76974a5a9778346c78861d7dc47f1dad7f8b/Arcanea%20World%20Building%20Agents%20and%20workflows/worlds/arcanea/characters/kuroth-soul-smith.arc)                                 | `8b63ad2355b6700620ba583d2206b2bc4e433962` |
| [characters/saria-of-lower-ash.arc](https://github.com/frankxai/arcanea/blob/a88b76974a5a9778346c78861d7dc47f1dad7f8b/Arcanea%20World%20Building%20Agents%20and%20workflows/worlds/arcanea/characters/saria-of-lower-ash.arc)                               | `abce44df879c3d69a67826207924e70ac6bde688` |
| [conflicts/quests/vaelketh-quest-hooks.arc](https://github.com/frankxai/arcanea/blob/a88b76974a5a9778346c78861d7dc47f1dad7f8b/Arcanea%20World%20Building%20Agents%20and%20workflows/worlds/arcanea/conflicts/quests/vaelketh-quest-hooks.arc)               | `8ca5f964414224ffceaabfc0df0f1685e05d020d` |
| [conflicts/vaelketh-ashen-rot.md](https://github.com/frankxai/arcanea/blob/a88b76974a5a9778346c78861d7dc47f1dad7f8b/Arcanea%20World%20Building%20Agents%20and%20workflows/worlds/arcanea/conflicts/vaelketh-ashen-rot.md)                                   | `5a64f827a3065f1392e0b4ed9332818a10de322c` |
| [cultures/vaelketh-culture.arc](https://github.com/frankxai/arcanea/blob/a88b76974a5a9778346c78861d7dc47f1dad7f8b/Arcanea%20World%20Building%20Agents%20and%20workflows/worlds/arcanea/cultures/vaelketh-culture.arc)                                       | `58f8039c04c201f18d6bd506fd17336f0753976d` |
| [geography/locations/vaelketh-volcanic-island.arc](https://github.com/frankxai/arcanea/blob/a88b76974a5a9778346c78861d7dc47f1dad7f8b/Arcanea%20World%20Building%20Agents%20and%20workflows/worlds/arcanea/geography/locations/vaelketh-volcanic-island.arc) | `70548ee46f406218ce7d729e2a712412b105bc25` |
| [species/vaelketh-pyromancers.arc](https://github.com/frankxai/arcanea/blob/a88b76974a5a9778346c78861d7dc47f1dad7f8b/Arcanea%20World%20Building%20Agents%20and%20workflows/worlds/arcanea/species/vaelketh-pyromancers.arc)                                 | `c801e4e49412d9b28f98532315d858a050b552be` |

Editorial sample reading covered the location and Ashen Rot documents, quest resolutions and character material. The island supports a useful campaign premise: a cooling caldera, a ruler hiding infection, a smith guided by a corrupted tool, and an excluded community controlling crucial infrastructure. Five quests connect theft, compelled miners, diplomatic access, forbidden elemental research and a sleeping dragon's distress. That gives a builder choices tied to factions and consequences, rather than just a setting description. This is a lead preservation recommendation, not an accepted or playable campaign.

Before reuse:

- The Ashen Rot file adds a physical Malachar heart, Null-Geode prison engine, Thirteen Lords and Yggdrasil heat-distribution mechanism. Locked app canon describes Malachar's forced Source fusion, sealing in Shadowfen and corruption as the antagonist origin. The source does not authorize these added mechanisms. Reconcile them explicitly; do not call all additional villains an established contradiction merely from their names.
- Drak'kalor/Citadel of Ash and Emberhold labels need a shared place map. Location dimensions claim a 342 km² oval with 24 × 18 km axes; a literal ellipse is approximately 339.3 km². Treat measurements as approximate or specify the intended geometry. Historical numeric quality scores and seamless-integration claims are unvalidated assertions.
- Varos's backstory says three challengers died and four yielded, while his quoted boast says he buried seven. Decide whether the boast is deliberate character rhetoric or a continuity defect; preserve the original while reviewing it.
- The local timeline, remaining lifespan and dragon/rot mechanics need one worked timeline. The source files declare drafts or narrate their own crisis; neither establishes current official status.
- Check full file history and applicable notices. The observed legacy root [LICENSE](https://github.com/frankxai/arcanea/blob/a88b76974a5a9778346c78861d7dc47f1dad7f8b/LICENSE) reserves rights with express exceptions and preserves earlier attached grants. [LICENSING.md](https://github.com/frankxai/arcanea/blob/a88b76974a5a9778346c78861d7dc47f1dad7f8b/LICENSING.md) records an Apache/FSL/proprietary/content split. No license notice was found beneath this historical world-building folder at this commit. These observations do not establish authorship, earlier license applicability or permission for a new community release. Reconcile the earlier MIT proposal against these sources with the owner.

Historical notice evidence is now bound more precisely. Commit `060a27fab44a336f1f4e821154702688ea847d1e` added the root [MIT notice](https://github.com/frankxai/arcanea/blob/060a27fab44a336f1f4e821154702688ea847d1e/LICENSE) on February 14, with the copyright attribution `FrankX` as written. Its blob is `898c8bf4d9b19d5e4900552c3f05f02fa762feae` and SHA-256 `aafd1a9d63c336f5179aa17bd3f6260fac3eede3684d152cc7219cf2669929a6`. All nine indexed Vael'Keth files have identical paths, types, modes and blobs at that revision and the current legacy commit. The August 27 boundary commit `6cfddd2de2cad2b2f3f79461cfc516376322fb06` replaces the root notice; the current text expressly preserves historical attached grants. No earlier root notice was found at the world's introducing commit `bf5dfada5e7c39016a77c3bb3c162d910407e9dc` under the recorded LICENSE/COPYING filename scan. That scan is not a complete search for every possible licensing statement.

Preserve the exact historical MIT text and later boundary evidence during any recovery review. The identical-file observation makes the February snapshot relevant; it does not decide whether fictional prose falls within that notice's Software/documentation wording, prove authorship, normalize the historical attribution or authorize a new release. A blanket current all-rights-reserved or MIT conclusion would both exceed this audit.

Recommended destination after review: existing app lore staging for the fictional sources, with origin commit/path/blob and applicable notices retained. Keep the authoring guide as inert provenance/reference material, outside active instruction discovery. No destination has been populated in this slice. The index preserves retrieval references; it is not a migrated backup or a durability guarantee. The legacy repository remains the source and is unarchived.

## Reproduce the comparison

Use existing local repositories with the specified commits already available. The command reads Git objects and emits JSON to stdout; it does not fetch, clone, install, invoke content, follow links, write a report or change source/index. Fetch missing commits separately in the owning repository under its normal admission. Run with the repository-pinned Node 22:

```sh
node scripts/audit-repo-salvage.mjs --source-repo ../arcanea --source-ref a88b76974a5a9778346c78861d7dc47f1dad7f8b --target-repo . --target-ref 4e1d914f1916987d0b059be9ca4c35077f9b6d9d
node scripts/audit-repo-salvage.mjs --source-repo ../arcanea --source-ref a88b76974a5a9778346c78861d7dc47f1dad7f8b --target-repo . --target-ref 5a2b22af8a77fc3544b071e6970c9a4e314c9858
node --test scripts/audit-repo-salvage.test.mjs
```

`../arcanea` assumes sibling canonical checkouts; use the actual path from a worktree. Full lowercase SHA-1 commits are required. SHA-256 Git repositories and non-UTF-8 paths are unsupported and refuse. Sorting is deterministic, with no timestamp or local path embedded in the report. [Git's NUL tree format](https://git-scm.com/docs/git-ls-tree) preserves unusual filenames; [replacement and lazy-fetch controls](https://git-scm.com/docs/git) bind reads to existing original objects. Bounds are 30 seconds and 32 MiB per Git read. Git failures refuse before emitting a partial report.

The initial private helper accidentally indexed absent source hashes while looking them up: repeated absent content then looked preserved elsewhere. Its wrong snapshot retained 627 such rows against main and 745 against the draft. No public decision used those counts. The corrected helper and native implementation agree on every path/object/mode/type/classification. A regression now asserts repeated absent objects remain absent, with empty matching-target lists. Other tests cover renames with mode differences, same-path divergence with a retained backup, symlinks/Gitlinks, unusual paths, invalid/duplicate/truncated inputs, count/order invariants, explicit CLI arguments and unchanged native Git status.

Local Node 24.16.0 passes nine tests; this differs from the pinned Node 22. The existing native CI receives an explicit audit-test step. Exact resulting-revision CI and independent provider review remain pending until recorded in the owning issue/PR. An initial native-main read refused because that commit was not local; a normal no-tags main fetch supplied it and both comparisons then matched. No package install, build fanout, new worktree, source deletion or global configuration change occurred.

## Archive boundary

This is one reviewed candidate group and a full identity inventory. Semantic overlap, other unique sources, historical releases, active issues/PRs, consumers and automation are still unaudited. Recover selected artifacts into their existing owners and verify their use before a pointer README. Frank's explicit archive choice remains required. Keep one public active app, canon in place and pinned consumer references; shared AuthorOS, world graph, runtime and media ownership remains intact.
