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

## Selected imports

| Import                                         | Existing notice evidence                                                         | Remaining decision or review                             |
| ---------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `.claude/skills/algorithmic-art`               | Apache 2.0 notice; its appendix still contains placeholder copyright             | Historical import, correct attribution and support files |
| `.claude/skills/apple-design`                  | `UPSTREAM-LICENSE`, MIT, Emil Kowalski; bytes match pinned upstream root licence | Imported revision and full resource review               |
| `.claude/skills/{docx,pdf,pptx,xlsx}`          | Four notices with Anthropic restrictive document terms                           | Authorized basis or reviewed current-tree remediation    |
| `.claude/skills/external/{docx,pdf,pptx,xlsx}` | Four additional copies with the same restrictive terms                           | Same review, including consumers of each copy            |

The document notices reserve rights and restrict reproduction, derivative works
and distribution. They are not MIT or Apache notices. The official upstream
[README](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/README.md)
also describes these four document skills as source-available. Keep all eight
copies outside curated release bundles while authorization or a removal/replacement
proposal is reviewed. Existing development copies are unchanged by this slice.

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
2. Audit document-skill consumers before proposing current-tree removal or replacement.
   Preserve the import record and skip history rewriting.
3. Review public blanket MIT claims in `/skills` and the homepage separately from
   legitimate scoped package licences. Those claims remain unchanged by this slice.
4. Fold only eligible skills into `packages/arcanea-skills/skills` after rights,
   evaluation and independent-review evidence. Canon stays in place.

Owning issue: [#276](https://github.com/frankxai/arcanea-ai-app/issues/276).
Implementation candidate: draft [#487](https://github.com/frankxai/arcanea-ai-app/pull/487).
Merge/release approval, original Arcanea licensing and Heart frequency remain open.
