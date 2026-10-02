# Arcanea skill fold decisions

Status: historical fold proposals and current canonical-root cleanup in draft; no rights clearance.
Owning issue: [#276](https://github.com/frankxai/arcanea-ai-app/issues/276).
The [evidence map](arcanea-skill-survivors-2026-10-01.json) pins every inspected snapshot,
skill blob and recognized support file. It complements the existing consolidation plan.

## Sources and boundaries

| Source snapshot                                                               |            Entries | Inspection                                                    |
| ----------------------------------------------------------------------------- | -----------------: | ------------------------------------------------------------- |
| App `b48f6ccf94`: `.claude/skills/oss`, `oss/skills`, existing skills package |                 57 | Committed bytes and explicit relative file references         |
| App's remaining three named variant groups                                    | 6 additional paths | Committed bytes, differences and reference relationships      |
| Distilled skills main `e4530e9fba`                                            |                 19 | Committed bytes and explicit relative file references         |
| Distilled local fork `8bd8f50ae1`                                             |                 17 | Committed bytes and explicit relative file references         |
| Legacy `arcanea` pack at `a88b76974a`                                         |                 23 | Complete subtree metadata; skill bodies/references unreviewed |

The 122 entries include copies and versions. They are not 122 proposed public skills.
The map records 192 file identities across snapshots and 31 groups of identical skill
blobs. Matching instruction bytes do not prove matching resources or compatible behavior.

The distilled local checkout is `codex/arcanea-gateway-productization`, not current main.
Its commit is not an ancestor of inspected main. It retains `swarm-of-light`, global
installation and differing gateway/runtime work. Preserve this fork and its ownership;
a migration or archive must account for it even if main is the preferred donor.

## What to fold

| Source family                                                                              | Proposed destination or role                                                                                  | Review before moving                                                                                                  |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `arcanean-worldbuilder`, earlier world-build/world-architect forms                         | Fold useful rule, culture and consequence methods into the existing `world-build` candidate                   | Source fidelity, rights, templates and creator-owned mode; no injected official names                                 |
| Creator-owned review methods in `canon-guardian`                                           | Fold source/authority and impact checks into `continuity-check`                                               | Fresh contradiction and false-positive cases; preserve accepted creator revisions                                     |
| `arcanean-art-director`, `cinematic-image-prompt-master`, `visual-quality-critic`          | Fold briefing and review methods into `scene-to-media`; retain visual-production specialties for later review | Source traceability, support files, current provider contract, provenance and separate generation authorization       |
| Quest/timeline and portable-world templates                                                | Review as supporting material for `quest-adapt`                                                               | Consume existing WorldPack/Realm Graph contracts; runnable import proof before claiming a game                        |
| `emotional-story-architect`, story/character/scene/dialogue/voice skills                   | Retain one reviewed story specialty after comparison                                                          | Scene generation and character arcs are broader than continuity review; the four candidates do not replace these jobs |
| `wonder-series-planner`, `social-asset-forge`, bestiary and other creative specialties     | Retain exact sources; select additions after the core workflows prove repeat use                              | Distinct user result, rights, forward evals, support portability and bounded publication permissions                  |
| `canon-guardian`, `canon-taste`, older canon/lore sources in official mode                 | One official review capability using the app's authorized source-bound canon contract                         | Rights and unresolved canon rulings; starter references cannot become locked authority                                |
| `operate-arcanea-creative-worlds`, `cowork-conductor`, `swarm-of-light`, operator councils | Keep operator material outside the public creator allowlist                                                   | Separate a useful public offline selector from private operator/gateway behavior before proposing a public adapter    |
| Generic coding and development skills                                                      | Keep in the developer working set with existing upstream owners                                               | Attribution and source licence review; exclude from an Arcanea creator install                                        |
| `door-smoke`, `library-honesty`                                                            | Development verification sources                                                                              | Replace historical fixed observations with actual current checks in the existing app quality lane                     |

These are extraction and selection decisions for review. Nothing has been copied from
the donor into the app's installable catalog. The four current candidates remain pending.

## Preserve the support material

Distilled worldbuilder needs six recognized files outside its skill folder, including
canon-state guidance and character/scene templates. Canon guardian needs six; image prompt
and art-direction skills each need eight. The operator's recognized set includes 20
external files and its local agent metadata. Copying only `skills/<name>` would lose these.

Use `auditResources` from `scripts/audit-skill-sources.mjs` to inspect an immutable source:

```js
import { auditResources } from "./scripts/audit-skill-sources.mjs";
const report = auditResources({
  cwd: "/path/to/verified/donor",
  ref: "e4530e9fba35043996ca588f9641755f8db669f4",
  paths: ["skills/arcanean-worldbuilder/SKILL.md"],
});
console.log(JSON.stringify(report, null, 2));
```

The audit follows explicit relative Markdown links and backtick file paths, preserves
committed support bytes and terminates cycles. It reports unresolved files, repository
escapes and nonregular Git resources. It does not inspect runtime imports, prose-only
references or remote content. Zero findings in this subset cannot establish a complete
executable plugin. The old pack's skill bodies and reference closure are still unreviewed.

When moving cleared material, include its retained resources and attribution, rewrite
relative paths inside the downloaded plugin subtree, and bind evaluation/review to the
final bytes. Keep official canon authored only at the app's locked source. Use #278's
generated, source-bound snapshot contract instead of maintaining another canon copy.
Consume #283 world safety and #421/#388 WorldPack/MCP work through their existing owners.

## Three variants need different treatment

- `sovereign-depths`: the seven-line Claude file explicitly points to the 43-line
  `.arcanea` workflow. Preserve this adapter relationship. A copied subdirectory install
  would still need an approved self-contained resource strategy.
- `arcanea-design-system`: the three versions differ in font families and token names.
  Keep them out of the public creator catalog. Reconcile with accepted current runtime
  tokens and visual policy before replacing a working-set source. The root `DESIGN.md`
  also contains local media-pipeline references; it is not a portable pack resource.
- `luminor-personality-design`: the two versions have six-versus-seven headings. Preserve
  them until the authorized persona source is checked; file length or folder order cannot
  choose truth.

The diff checks confirmed substantive differences after CRLF normalization. No canon,
persona, visual workflow or design tokens changed in this slice.

## Rights evidence remains unsettled

The inspected distilled registry declares `UNLICENSED` for plugin 0.3.2, and its tree has
no root license. The older local fork's MIT plugin metadata must not override current
source decisions. [Distilled registry](https://github.com/frankxai/arcanea-agent-skills/blob/e4530e9fba35043996ca588f9641755f8db669f4/registry/arcanea-skills.json).

Legacy `arcanea` has a rights-reserved default notice with separate-component and
historical-grant provisions. Its old pack still declares MIT in package metadata. Record
both and review applicability, historical versions and retained upstream notices before
redistribution. [Root notice](https://github.com/frankxai/arcanea/blob/a88b76974a5a9778346c78861d7dc47f1dad7f8b/LICENSE),
[pack metadata](https://github.com/frankxai/arcanea/blob/a88b76974a5a9778346c78861d7dc47f1dad7f8b/arcanea-skills-opensource/package.json).

The app still has no root license at the inspected commit. No new license is granted by
this evidence map. Frank's software/content choice and an attribution review remain open.
Keep exact historical grants and third-party obligations when an approved move happens.

## Next migration step

Review worldbuilder's six supporting files and the creator-owned canon-review subset
against the current four candidates. Select specific changes only after rights review,
then evaluate fresh creator requests and failure cases against the final pinned bytes.
Preserve the story specialty as a distinct job. Prepare an actual subdirectory install
proof before changing working-set links or replacing the currently installed donor plugin.

Operator/private material, unknown entries, legacy CLI/agents/commands, loose definitions,
upstream developer skills and broader repo salvage remain open. No repo retirement follows
from this skill map alone. Community and revenue outcomes still need real creator use and
the existing release/commerce proofs in program #276.

## Canonical-root duplicate cleanup, October 2

At app source `794e83bb7a2e229c08a25faa980436196879c7e8`, the proposed canonical
root held 23 skill bodies although its catalog listed four candidates. This draft
removes the 19 unlisted single-file copies from that package root. Every removed
file has a byte-identical retained source elsewhere in the app; the evidence map's
`canonicalRootRemediation` records exact paths, Git blobs and SHA-256 values.
No unique skill body or support file is removed. Historical snapshot entries stay
unchanged; source retention does not grant rights or prove equivalent execution.

The root now contains only `world-build`, `continuity-check`, `scene-to-media`
and `quest-adapt`, with their existing examples. Their bytes/passports are unchanged:
four candidates, zero ready. The API/installer/package file list already used the
catalog; broad repository and root-plugin discovery remain separate open work.
Tracked consumer search found only historical evidence-map references to the
removed package paths. Development/specialty sources and installed donor plugins
remain with their existing owners; no global install or working-set link changes.

This subtracts duplicate package copies while retaining story, specialty and
developer work for later selection. It does not fold or approve all donor sources.
Rights, independent evaluation/review, creator acceptance and release gates remain.
