# Arcanea source consolidation and community delivery

Status: proposal and measured inventory, not an approved license, archive plan or product release.
Owner issue: [Arcanea program #276](https://github.com/frankxai/arcanea-ai-app/issues/276).
Source: Codex task `01a0f74f-8bad-7db1-ab06-fd89b5faec84`, Frank's one-repo proposal and broader ecosystem objective.
Measured app base: `2b9a0a5e421d39d272a0f00fef764b3cbe10b3b3` on 2026-10-01.

## Recommended ownership

Use `arcanea-ai-app` as the public home for Arcanea's application, locked world source, first-party creator skills and Arcanea adapters. Keep reusable publishing, agent execution and protocol dependencies with their existing owners. Create no new Arcanea repositories for this consolidation.

The existing program sets world, stories, audience and releases first; Studio Intelligence enables them; external tools graduate from proven work. Preserve its 60% world/audience/releases, at most 30% enabling tooling and at most 10% externalization capacity allocation until explicitly revised. A public app source repository can support this strategy without exposing private operator material or making the entire fictional universe commercially reusable.

| Repository or surface                              | Proposed role                                                                                    | Condition before folding or retiring                                                                                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `arcanea-ai-app`                                   | Public integration home; app, reader, world context, official locked source, skills and adapters | Curated installation boundary, rights map, community files, actual release proofs                                                                          |
| `arcanea` and `arcanea-platform`                   | Legacy recovery sources                                                                          | Preserve unique work, open issues/PRs and rights; map each retained artifact to an app destination and source commit; verify before pointer README/archive |
| `arcanea-agent-skills`                             | Current distilled skill source, migration donor                                                  | Compare every retained skill against locked source and evals; keep the installed plugin working until app replacement passes                               |
| `arcanea-agent-profile`                            | Hermes adapter donor                                                                             | Move reusable workflow skills and profile adapter into the app only after portability tests; preserve its MIT attribution                                  |
| `arcanea-marketplace`                              | Mixed catalog to reconcile                                                                       | Move each non-Arcanea entry to its existing brand owner; verify consumers, licenses and replacement catalog before retirement                              |
| `arcanea-records`, `arcanea-intelligence-os`       | Recovery candidates                                                                              | Inspect unique content, releases, automation and active consumers; names or age alone do not prove redundancy                                              |
| `arcanea-ecosystem`                                | Existing generic world protocol owner                                                            | Keep for now; compare its World Repo Standard/schema with app `world-pack`/`world-sdk`; choose one versioned owner before moving it                        |
| local `arcanea-mcp`, origin `arcanea-mcp-generate` | Private Arcanea pack/gateway integration                                                         | Compare with app `packages/arcanea-mcp`; generic substrate stays shared, private gateway stays private; inspect exact consumers before moving              |
| `arcanea-studio`                                   | Media subsystem                                                                                  | Keep dependency/redistribution held pending [component and attribution review](arcanea-media-rights-evidence-2026-10-02.md)                                |
| `arcanea-academy`                                  | Existing World Proof Lab                                                                         | Integrate a proven packet later; no automatic archive                                                                                                      |
| `arcanea-claw`                                     | Already archived on GitHub                                                                       | Record replacement dependency if an active consumer still refers to it                                                                                     |
| `author-os`, SIS, Queen/Hermes and durable runtime | Shared authoring, work graph, admission and recovery                                             | Consume reviewed versions through Arcanea adapters; avoid forks or another scheduler                                                                       |
| existing skill bundle hub                          | Cross-brand discovery and version selection                                                      | Manifest-only Arcanea references to repo, directory, commit and approved names; no second authored skill source                                            |

GitHub metadata verified public app, public legacy `arcanea`, private `arcanea-platform`, private `arcanea-agent-skills`, public Hermes profile, public marketplace/records/intelligence-os, public ecosystem and studio. None of those was archived at observation. `arcanea-claw` was archived. `frankxai/arcanea-mcp` returned 404; the local origin identifies the accessible private `frankxai/arcanea-mcp-generate`. Directory names are not repository identities.

October 3 [legacy recovery evidence](arcanea-legacy-salvage-2026-10-03.md) remeasures immutable full trees: 3,380 legacy-only paths against main4e1d914, including297 objects present elsewhere and3,083 absent, plus1,201 same-path divergences. Main has4,616 target-only paths at this revision. The native read-only audit and pinned Vael’Keth candidate references are preparation; no source group is migrated or archive-approved. Consumer and rights review remain required.

## Measured skill sources

Run from the app checkout with its pinned Node version:

```sh
node scripts/audit-skill-sources.mjs --ref 2b9a0a5e421d39d272a0f00fef764b3cbe10b3b3
node scripts/audit-skill-sources.mjs --ref 2b9a0a5e421d39d272a0f00fef764b3cbe10b3b3 --root packages/arcanea-skills/skills
node --test scripts/audit-skill-sources.test.mjs
```

The audit reads Git blobs from an immutable commit, including in a sparse checkout. Dirty and untracked skills cannot alter its result. It makes no edits and does not install or invoke skills.

| Tracked source group             | SKILL.md files |
| -------------------------------- | -------------: |
| `.claude/skills`                 |            157 |
| `.arcanea/skills`                |             27 |
| `packages/arcanea-skills/skills` |             20 |
| Other `packages` paths           |             18 |
| `oss/skills`                     |             16 |
| `apps` paths                     |             16 |
| `skills`                         |              4 |
| `.agents`                        |              3 |
| Total                            |            261 |

The conservative scalar-name reader recognizes 206 files and 137 unique names. Another 55 need frontmatter/name review; these are not automatically invalid YAML. There are 31 duplicated recognized names: 28 have identical SKILL.md bytes, three have variants. Identical skill text does not establish identical support files or rights. The variants are `arcanea-design-system`, `luminor-personality-design` and `sovereign-depths`. The report gives every exact path and SHA-256 for reconciliation. This is a full tracked-source inventory, not the skills CLI's discovery count or a portability score.

## One authoring root and several delivery adapters

Proposed public root: reuse `packages/arcanea-skills/skills`. It already exists and has a package installer; its existing 20 entries still require individual review. The package is not currently an approved curated pack. Keep lore at `.arcanea/lore/CANON_LOCKED.md`.

Each approved skill needs a passport with stable ID, owner, original repo/path/commit, upstream attribution, SPDX license or explicit pending rights, mode, supported harness versions, required resources, permissions, evaluation fixtures and exact review revision. Keep unknowns pending. Public default mode uses the creator's world; explicit Arcanea mode uses the pinned official snapshot. A user's accepted facts outrank agent proposals in their own world. Neither mode lets an agent promote official canon.

Start with four useful jobs: world bible, character/scene continuity, scene-to-media brief and quest/dialogue adaptation. Select implementations from the inventory and distilled skills; do not ship a count-driven 97-skill pack. Each needs a worked artifact, a failure example and reproducible checks. Add canon guardian as a separate official-world capability after conflicting rules are resolved.

Development `.claude/skills` should reference the approved source rather than author a duplicate. On Windows, test link support and installed portability before choosing links; where a harness requires copied files, generate and mark them as adapters, with drift checks. Generic/third-party development skills retain their upstream owner and rights; they are excluded from the Arcanea public allowlist.

The existing launcher recursively walks and keeps the first skill for a name. Its owner must add a `root` field through materialization, verification, pinning, planning and installation, and key merged sources by `(repo, root, sha)`. Checking names inside a root while installing from the whole clone would leave the defect intact. Tests must prove duplicate names outside the root cannot win, variants inside the root fail, traversal/symlinks cannot escape, and different roots in one repo remain distinct. The launcher checkout has no origin and is on a Claude lane; this slice does not overwrite it.

Claude delivery should use a plugin at `packages/arcanea-skills` with skill paths beneath that directory. Public plugin content must be self-contained: a git-subdir install cannot reach back into `.arcanea/lore` outside its downloaded subtree. Include only a generated, rights-approved canon snapshot or provide a versioned resource endpoint; never hand-maintain a second canon source. Generate Codex/Gemini/Hermes delivery metadata from the same approved catalog. Use native capabilities supported by each harness rather than pretending their plugin formats are interchangeable.

[Claude's marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference) supports git-subdir sources with a directory and full commit SHA. [The skills CLI](https://github.com/vercel-labs/skills) supports local-directory installs and scans multiple skill containers and plugin manifests. Pin the installer version and test the actual installed result. Shallow history does not guarantee a small working tree; measure transferred bytes and installed size. Use subdirectory/partial fetch where supported.

Validate manifests, refresh the Codex activation index using the installed repo-backed activation workflow, install from the local marketplace, and prove the exact loaded skill/resource versions before updating the public catalog. No activation or installation has occurred in this slice.

## Rights and canon decisions

There is no tracked root license at the measured app commit. Package metadata claiming MIT and the live homepage's MIT label do not constitute a reviewed rights map for every asset. The root plugin points to `frankxai/arcanea` and says `SEE LICENSE IN LICENSE`; the skills package also points to the old repository. Correct metadata only as part of a reviewed boundary change.

Recommendation for Frank's decision: MIT for original software/scripts/skills after upstream review, retain third-party licenses and notices, and specify lore/art/trademark permissions separately. Public visibility alone grants no permission to reuse fictional content commercially; see [GitHub's licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository). Evaluate reserved official lore with a creator/fan policy, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), or [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) against the desired community commercial rights. Do not apply a blanket MIT license over art, books, private exports or third-party files.

October 2 media evidence supplements the historical upstream-licence hold, which is not lifted. Bound to app base9e287e47130bef39bf3b8caf7f60b20abd3b0ee3, the introducing commit records a root MIT licence addition on June12 (committer timestamp, UTC). The [Media Studio source comparison](arcanea-media-rights-evidence-2026-10-02.md) binds the fork, both observed licence trees and all 101 local files. The assertion that observed current upstream lacks a root licence is contradicted; component applicability, attribution, assets, historical authorization and integration remain open. Studio stays an existing media owner, with no new public Arcanea fork or permission granted by this evidence.

Build a file-level rights inventory with source commit, rights holder, upstream license text/hash, obligations, inclusion decision and reviewer. Check support files as well as SKILL.md. Preserve notices when folding MIT material. The presence of an ancestor LICENSE in the audit is only a review lead, not proof of applicability. Publish a short root license map and THIRD_PARTY_NOTICES only after the ruling and review. SECURITY, CONTRIBUTING and community conduct files can be prepared independently.

Locked canon at the measured base lists Heart as 417 Hz and contains a history entry calling 639 Hz a locked correction. The inconsistency is within the authority file. Preserve both as conflicting evidence and obtain a named ruling; do not silently select a value or edit canon in a skills consolidation.

Issue #278 already owns deterministic canon snapshots. Use that compiler contract and source hash instead of creating a separate canon pack repository. Issue #283 owns safe world/graph writes and continuity/impact queries. Their open acceptance criteria remain dependencies.

## Community value and commercial path

| Audience                | Free result to prove                                                                     | Paid value to validate                                                          | Evidence before expanding                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Authors                 | World bible and a scene checked against accepted facts; portable source/export           | Released Arcanea editions first; later proven continuity/editorial workflows    | Reader completion/return; editorial defects; creator completes and reuses export     |
| Game builders           | One quest packet with dialogue, state transitions, stable world IDs and asset provenance | Later tested quest/world kits and team continuity tools                         | Playable #285 proof and an external builder imports it without founder repair        |
| Content creators        | One scene yields linked shot briefs and credited media artifacts                         | Later production packs or hosted collaboration where time saved is demonstrated | Accepted output, rights completeness, repeat use and cost per accepted artifact      |
| Community worldbuilders | A self-owned world packet, contributor guide and inspectable evals                       | Later persistent collaboration/backups and reviewed premium kits                | Independent world stays independent; clean-machine setup and portable export succeed |

Start revenue with the existing Press/release lane and a coherent ARC-REL-001 reader experience. Open tools make released work easier to explore and give builders a practical entry point. Sell tested outcomes and editions; validate hosted collaboration only after users repeatedly need persistence, continuity and shared review. BYOK inference costs remain visible and creator exports remain available. Prices, margins and willingness to pay are hypotheses until measured.

Calculate contribution margin per accepted artifact as net receipts minus payment/refund costs, provider inference, storage/delivery and variable support. Track founder review time separately. Record free-to-paid conversion, retained active creators, reader return and repeat purchases only from actual events. A download/star is discovery evidence, not paying demand. Use the existing auth and commerce work rather than adding a new credits, wallet or marketplace system.

Prepare an issue-template contribution path with original-work/upstream rights declaration, sample output, eval result and source version. Keep community creations in creator-owned namespaces; official canon candidates enter staging and require human promotion. A builder should be able to fork a world, run one worked workflow and inspect/export the result. Pilot with a small invited cohort and document failures; no recruitment messages or public posts are authorized by this slice.

## Website and delivery order

The homepage currently presents living worlds, BYOK and MIT open source. It redirects to `www.arcanea.ai`; a fetched page alone does not prove signup, editing, export or checkout. Converge the public journey with #276's Read / Codex / Worlds / Store intent and the active auth/product candidates before adding navigation. A builder entry should expose one worked artifact, supported installation, license map and contribution route. Unreleased hosted features capture demand through a working waitlist.

Use the app's design tokens and sentence case. Website verification must cover keyboard focus/return, touch target size and pointer behavior, reduced-motion paths and interruption during drawer/dialog transitions. Emil and Apple guidance was read; it is applied here to proposed acceptance criteria, with no rendered-interface verification claimed.

1. Reconcile this proposal with #276, #408 integration order and #427 current quality contract. Obtain rights/Heart rulings separately; do not create another strategy queue.
2. Use the audit to make an exact-source survivor map for each retained skill plus support files; resolve the three named variants and private/operator exclusions. Prepare community/license-map drafts without granting rights.
3. In the existing launcher's own lane, add root support and meaningful regression tests. Give it a verified upstream before treating it as durable distribution infrastructure.
4. Migrate four reviewed skills into the existing package root, add passports/evals and a self-contained plugin. Preserve old installs through a tested transition; do not move all development skills at once.
5. Consume #278's generated source-bound canon snapshot and #283's world safety contract. Run actual clean installs on supported harnesses; compare loaded inventory to the allowlist. Refresh activation metadata only after validation.
6. Use existing product/release candidates to prove ARC-REL-001, rights, source-to-edition exports, checkout/entitlement/delivery/refund and reader return. Publish only with the existing human receipt gate (#277).
7. Prove the small external author/world/media workflows; after #285, prove one game import. Expand paid tooling when repeat use and contribution margin support it.
8. Archive individual legacy repos only after recovery, consumer migration and Frank's explicit archive decision. A pointer README must name the replacement path and last preserved commit. Skip history rewriting and renaming for now.

## Slice acceptance and limitations

The present slice supplies a deterministic, tested inventory and a reviewable consolidation proposal. It does not satisfy the broader objective's production, community or revenue outcomes. No skills were migrated, no license granted, no repo archived, no plugin installed and no deployment promoted. Required application CI and independent exact-revision review must pass before any resulting implementation is merged.

Rollback of this slice is removal/revert of the two inventory scripts and two proposal records. It cannot affect locked canon, installed plugins, customer data or production.

The October2 media evidence paragraph and three companion records form a separate four-document slice. Reverting that exact delta preserves the original consolidation scripts/records and all Studio source. This evidence is not a legal ruling and does not lift the dependency/redistribution hold.
