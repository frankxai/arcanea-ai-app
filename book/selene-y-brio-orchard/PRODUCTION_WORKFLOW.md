# Selene & Brío — repeatable production workflow

STAGING · 2026-09-09. Designed with Starlight Book Forge: one lead prose writer, independent source and editorial reviewers, explicit authority, complete local endings, and editions generated from a single manuscript.

1. **Freeze the evidence snapshot.** Record repository, commit, exact path, entity ID and per-claim authority. Read full records after search. Record an unresolved search as unresolved. A PR title or generated image is not canon evidence.
2. **Write the volume contract.** Define the adult reader promise, central question, antagonist's material objective, protagonist's consequential mistake, ending, and boundaries inherited from earlier books.
3. **Approve the causal spine through review.** Each chapter must change knowledge, resources, trust, location or time. Every climax tool appears earlier with a failure mode. Avoid a series of interchangeable lessons.
4. **Prove the voice with one chapter.** Check dialogue, humour, place, adult character life and emotional restraint. Repair source/name collisions before drafting a full volume.
5. **Draft from one authority.** One writer owns prose. Researchers and reviewers may work independently on bounded tasks; they do not overwrite chapters or blend competing narrator voices.
6. **Track continuity while writing.** Maintain character knowledge, chronology, rank, Anima use, lens charge, injuries, equipment, animal care, promises and individual outcomes. Distinguish observation, inference and invention.
7. **Direct the images from finished scenes.** Keep reference character identity, wardrobe and phase of Brío's change fixed. Give each plate a distinct camera, palette and dramatic purpose. Inspect anatomy, tack, spatial relationships and visible lore. Save prompts and hashes; generation never validates lore by itself.
8. **Run independent reviews.** Source reviewer checks imported mechanics and authority. Editorial reviewer checks cause/effect, privacy, agency, prose and closure. One lead writer applies concrete repairs and records disposition. Stop optional review once the remaining risks are resolved.
9. **Build all editions from chapter Markdown.** The strict builder requires 14 contiguous unique chapter IDs, valid frontmatter, four to eight referenced new plates, a cover, and existing safe asset paths. Web data reads the same chapter bodies. HTML and EPUB must preserve exact paragraph order and complete endings.
10. **Verify the experience.** Inspect the actual artifact, navigation, image loading, reading persistence and keyboard gallery behavior. Validate EPUB package/XML and compare text and asset counts to source. Run relevant route typing/lint/build checks. Report limitations precisely; a local source check is not a deployment check.
11. **Make a reviewable release.** Respect the publication gate, branch dependencies and repository size limits. Do not merge, bypass checks, claim LOCKED status or claim a preview is production. Separate reproducible tooling from the content PR when that is a coherent review boundary.
12. **Keep the evidence.** Save the reader and EPUB; version manuscript, art provenance, source ledger, bible, review decisions and builder. Retain private research outside public-facing story files. No identifying real-life incidents or correspondence enter the release.

## Artifact ownership

Canonical prose: `book/selene-y-brio-orchard/chapters/*.md` in the integration branch. Source drafting copy: `evolution/manuscript`. Generated edition outputs are derived and should never be edited to fix prose. Update the source, rebuild, then verify the changed result.

`SOURCE_LEDGER.md` holds imported claims and new bridges. `SERIES_BIBLE_V2.md` owns ongoing continuity. `SERIES_ROADMAP.md` contains development material only. `ART_PROVENANCE.json` owns the four plate assignments and rendition hashes. `EDITORIAL_REVIEW.md` records findings and their closure. `build-orchard.py` owns the edition transform, not canon decisions.

## Acceptance record template

Date; source commit; chapter-source digest; reviewer findings and disposition; chapter/paragraph/image counts; artifact hashes; tests actually run; unresolved limits; branch/base/head; preview URL and observed state; production state. Fill from evidence, never from expected tool behavior.
