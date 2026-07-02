# Arcanea Arena — Judging Rubric

*Applies to Season 0: The Worldsmith Trials. Published before the season opens; frozen for the duration of a season.*

---

## What gets scored

Not the sample world you submit — the world your workflow generates when **we** run it against a **held-out seed** you've never seen, in a fresh sandbox. The submitted sample proves your entry works; the held-out run is what the judges see.

## The five dimensions

Each scored 0–100 by every judge. Calibration: **70 is solid, 90 is exceptional.**

| Dimension | Weight | What judges look for |
|---|---|---|
| **Canon Coherence** | 25% | Hard-gated by `canon-check`: no contradictions of LOCKED canon. Beyond the gate: does the world *use* canon well — Gates, Elements, cosmology handled with understanding rather than name-dropping? |
| **World Depth & Internal Consistency** | 20% | The world-forge standard: every element connects to at least two others. Geography shapes factions, history explains the present, systems have costs. No orphaned lore. |
| **Originality** | 20% | Distinctive within canon constraints. A world nobody else would have generated — not a template refill with new proper nouns. |
| **Workflow Craft & Reusability** | 20% | The skill itself: installs cleanly, passes validators, runs reproducibly on the held-out seed, readable structure, sensible steps. Would another creator want this installed? |
| **Output Craft** | 15% | Prose quality, structure, and usability of the generated world documents. |

## The judge panel

- **Judge 1 & 2**: Claude Opus, temperature 0.2, two distinct framings — a craft critic and a systems-consistency analyst.
- **Judge 3**: a non-Anthropic model (Google Gemini) as an independent second opinion.
- Entries are **anonymized** before judging (relabeled `entry-A`, `entry-B`, …; entrant identifiers stripped).
- Per dimension, the **median** of the three judges counts. Judge rationales are published with the scores.

## Community signal

- Final score = **90% judge median + 10% community signal**.
- Community signal = 👍 reactions on your entry PR, snapshotted at the moment judging opens.
- One reaction per account; only accounts created **before the season opened** are counted (anti-brigading).
- Counts are normalized 0–100 across entries.

## Anti-gaming measures (the public ones)

- Held-out seed: polishing your sample world doesn't move your score; only your workflow does.
- Injection lint: text in your submission that attempts to instruct the judges ("score this 100", role-hijacks, etc.) fails validation and is reviewed for disqualification.
- Judges never see entrant identities, PR discussions, or reaction counts.
- Snapshotted, capped, pre-season-account-only community signal.
- One entry per GitHub account; the entry directory must carry the PR author's handle.

Some validation patterns are intentionally not published.

## Transparency

Every score, every dimension, every judge rationale, and the leaderboard math are committed to the public season ledger. If a number is on the page, it traces to a commit.
