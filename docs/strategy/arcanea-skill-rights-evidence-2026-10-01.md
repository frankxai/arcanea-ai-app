# Imported skill rights evidence, 2026-10-01

The proposed curated package still has four internal candidates and zero ready.
This report records notice evidence for ten existing imports. It grants no rights,
selects no Arcanea licence and does not establish contractual authorization.

Measured app source: `0a04c976d66f2f2d12aa895060f94c6c089f635b`.
Observed app main: `e863be8304fdde9f00ba812d7845d66ec52787b9`.
The ten selected skill bodies and notices are identical between those revisions.
No root `LICENSE`, `LICENSE.md` or `LICENSE.txt` exists in either measured tree.
Package licence declarations and imported notices do not establish blanket terms
for the app, skills, canon or assets. Frank's code and lore licence choices remain open.

## Historical imports at the measured October 1 snapshots

| Import                                         | Existing notice evidence                                                         | Remaining decision or review                             |
| ---------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `.claude/skills/algorithmic-art`               | Apache 2.0 notice; its appendix still contains placeholder copyright             | Historical import, correct attribution and support files |
| `.claude/skills/apple-design`                  | `UPSTREAM-LICENSE`, MIT, Emil Kowalski; bytes match pinned upstream root licence | Imported revision and full resource review               |
| `.claude/skills/{docx,pdf,pptx,xlsx}`          | Four notices with Anthropic restrictive document terms                           | Authorized basis or reviewed current-tree remediation    |
| `.claude/skills/external/{docx,pdf,pptx,xlsx}` | Four additional copies with the same restrictive terms                           | Same review, including consumers of each copy            |

The document notices reserve rights and restrict reproduction, derivative works
and distribution. They are not MIT or Apache notices. The official upstream
[README](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/README.md)
also describes these four document skills as source-available. At those snapshots the eight copies remained outside the proposed curated bundle.
The October 2 current-tree removal proposal supersedes that retention state: all
eight copy trees are absent from this candidate, while their historical notice and
import evidence stays recorded. Authorization and historical rights remain open.

The [machine-readable receipt](arcanea-skill-rights-evidence-2026-10-01.json)
records each local skill and notice blob, SHA-256, immutable upstream commit and
notice comparison. Nine notice bodies match current pinned upstream. The
algorithmic-art difference is the Apache appendix copyright line; it is recorded
rather than replaced from a newer version. None of the ten local skill bodies
matches current upstream bytes. These comparisons cannot identify the historical
import revision or clear support files.

`apple-design` entered through app commit
`73cb4f94ec3c997cc9e4d816bb1b4f7a9478ffb8`, PR #220, whose record references
`frankxai/claude-skills-library` PR #22. Its import pin still needs reconciliation.
Its preserved MIT notice is evidence to retain; it should not be described as
unlicensed merely because its filename differs from `LICENSE`.

## Auditor correction

`scripts/audit-skill-sources.mjs` now recognizes `UPSTREAM-LICENSE` alongside
existing `LICENSE`/`COPYING` forms and records immutable notice blob/SHA-256
identities. Every notice keeps `terms-and-applicability-unreviewed` status. Ancestor
paths remain evidence rather than inferred rights, and notices under resource
folders appear in the inventory without being applied to a parent skill. Symlink
notices are excluded without reading their target.

Focused committed fixtures verify exact notice bytes, nested resource boundaries,
symlink exclusion and independence from dirty/untracked notices. The snapshot
scope remains tracked `SKILL.md` files, not installer discovery or a legal audit.

## Next review

1. Trace imports and inspect supporting resources, including referenced material.
2. Review the October 2 removal's recorded consumer search and remaining indirect,
   name-based and provider compatibility. Preserve historical import records and
   Git history; the eight current-tree copy removals grant no rights.
3. Keep the separately corrected `/skills` and homepage terms scoped to their
   exact source and readiness evidence; preserve legitimate package/import notices.
   These historical import records do not grant app-wide MIT terms.
4. Fold only eligible skills into `packages/arcanea-skills/skills` after rights,
   evaluation and independent-review evidence. Canon stays in place.

Owning issue: [#276](https://github.com/frankxai/arcanea-ai-app/issues/276).
Implementation candidate: draft [#487](https://github.com/frankxai/arcanea-ai-app/pull/487).
Merge/release approval, original Arcanea licensing and Heart frequency remain open.

## Current-tree removal proposal, October 2

Draft #487 removes both tracked copies of each of the four document skills:
`.claude/skills/{docx,pdf,pptx,xlsx}` and their `external/` copies: 260 tracked
files, including skill bodies, support files and notices. The notices are
retained as immutable blob/hash references in the evidence above. Their Git
history is unchanged. This source proposal grants no rights and does not resolve
historical redistribution or establish an independently authorized basis.

The active Claude skill index no longer points at these eight entrypoints. A
tracked-reference audit found only that index plus historical audit/cleanup and
rights records outside the removed trees; those dated records are preserved.
The root plugin's broad skill path now sees the remaining working set. It is
still not a curated or cleared public install. Algorithmic-art, Apple and other
imports remain subject to their recorded provenance/resource review.

This change removes copied document tooling from this candidate; it does not
replace authoring/export implementations. Use separately authorized document
tools through their existing owner/provider. No global skill is uninstalled and
no external tool is activated. Four internal candidates remain zero ready.
App checks and independent review must bind the new head before promotion;
machine admission held the reviewer before invocation in this slice.

## Doc-coauthoring provenance, October 2

The two local bodies are identical, blob `64b962ad16442f65182d80c0b0bf838e5c9a77f7`.
They entered the app together at be859c91a352c942d5b0b82e4acdc5d1cf0ef6c3.
Against observed upstream `8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4`, the only local
change is an added frontmatter version line; removing it restores the exact bytes.
The external duplicate and its index row are removed; the retained body is unchanged.
Its new `UPSTREAM.md` records attribution, hashes, the change and remaining limits.

The pinned upstream snapshot has no root or skill-folder licence. Its README's
generic Apache statement and example-skills membership are evidence, not a verified
skill-specific grant. No sibling licence was copied. The additional JSON evidence
records source/notice observations without changing the original ten historical
entries. Applicable grant/notices and historical import rights remain unresolved;
no clearance, root-licence decision or catalog promotion follows.
