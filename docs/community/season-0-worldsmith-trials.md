# Season 0: The Worldsmith Trials

> **Arcanea Arena** — build the best world-creation workflow. The winning workflows ship in the Arcanea plugin, with your name on them.

**Status: draft — the season is not yet open.** Dates, seeds, and the entry window will be announced in this document and on [arcanea.ai/challenges](https://arcanea.ai/challenges) when Season 0 opens.

---

## What this is

Most creative competitions judge an artifact. The Worldsmith Trials judge your **workflow** — the Claude Code skill you build that *generates* a world. You submit the skill plus one sample world; at judging time we re-run your skill against a seed you've never seen. If your workflow is genuinely good, it holds up.

Winners are promoted into the Arcanea plugin's community skills tier (`/plugin install frankxai/arcanea`) with attribution — every future creator who installs the plugin gets your workflow.

## Prize

**Recognition + plugin distribution.** Winning entries are published in the Arcanea plugin with attribution, featured on arcanea.ai, and permanently recorded in the season ledger. There is no cash prize in Season 0; if that ever changes it will be announced explicitly before a season opens.

## How to enter

1. Read the [judging rubric](judging-rubric.md) and the [submission license](SUBMISSIONS-LICENSE.md).
2. Go to the OSS repo: [github.com/frankxai/arcanea](https://github.com/frankxai/arcanea), directory `challenges/season-0/`.
3. Copy `entry-template/` to `entries/<your-github-handle>--<your-skill-name>/`.
4. Build your workflow as `SKILL.md` (standard Claude Code skill format — the template shows the required frontmatter).
5. Run your workflow against **one of the public seeds** (listed in the season README when the season opens) and commit the generated world to `world/` (five files: `cosmology.md`, `systems.md`, `geography.md`, `factions.md`, `timeline.md`).
6. Fill in `entry.json` — including `"license_accepted": "SUBMISSIONS-LICENSE-v1"`, which is how you accept the submission terms.
7. Open a PR. The validation Action checks your entry automatically; fix anything it flags.

One entry per GitHub account. Your directory name must include your own handle (the account opening the PR).

## Canon constraints

Your world must be buildable *within* Arcanea canon: the Gates, the Elements, the Lumina/Nero cosmology. The authoritative reference is [`CANON_LOCKED.md`](https://github.com/frankxai/arcanea-ai-app/blob/main/.arcanea/lore/CANON_LOCKED.md). LOCKED canon may not be contradicted; everything not locked is yours to invent. Entries that break LOCKED canon are ineligible to win (the `canon-check` gate is part of judging).

You do not need to *use* every canon element — you need to not contradict the ones you touch.

## How judging works

Published in full in the [judging rubric](judging-rubric.md). Short version:

1. Your entry is validated (structure, manifest, license acceptance, injection lint).
2. Your skill is re-run in a fresh sandbox against a **held-out seed** revealed only when judging starts. That output is what gets scored.
3. `canon-check` gates canon coherence.
4. An anonymized three-judge model panel scores five dimensions; the median per dimension counts.
5. Community signal (👍 reactions on your entry PR, one per account, snapshotted at judging start) contributes 10% of the final score.
6. All scores and judge rationales are published in the season ledger — every number on the leaderboard traces to a public commit.

## Disqualification

- Prompt-injection attempts against the judging pipeline (instructions embedded in your submission aimed at the judges).
- Plagiarized workflows or worlds.
- Multiple accounts / entry-directory handle not matching the PR author.
- Contradicting LOCKED canon (ineligible to win; entry remains listed with `canon: fail`).

Maintainers review automated flags before any DQ is final.

## Timeline

Announced when the season opens. The sequence is: **open** (entries accepted) → **judging** (entries frozen, held-out seed revealed, community signal snapshotted) → **complete** (leaderboard published, winners promoted).

## Questions

Open a discussion on the [OSS repo](https://github.com/frankxai/arcanea) or an issue tagged `season-0`.
