# Arcanea Arena — Crowd Strategy

*Strategic evaluation | July 2, 2026*

---

## Executive Summary

This document evaluates applying the crowd thesis from McAfee & Brynjolfsson's *Machine, Platform, Crowd* to Arcanea, and lands on one decision:

**Skip model fine-tuning competitions. Build judged tournaments of agentic world-creation workflows.**

The program name is **Arcanea Arena**; the first competition is **Season 0: The Worldsmith Trials**. The name "Crowd Machine" is never used publicly — a defunct crypto company of that name drew SEC enforcement action, and the book's concepts are not protectable (nor do they need naming rights to be used).

---

## I. The crowd thesis, applied honestly

Three claims from the book matter here:

1. **The core beats the crowd on efficiency; the crowd beats the core on diversity of search.** Crowd value appears where the solution space is wide and rugged. "The best workflow for generating a coherent fictional world" is exactly such a space — there is no single right answer, and the interesting solutions come from angles a core team would not try.
2. **Crowds need a platform with clear interfaces and evaluation.** Kaggle works because scoring is automatic. Creative output has no loss function — this is the hard problem, and it is solvable only partially: a shared canon constraint set makes entries comparable, a published rubric plus a model-judge panel makes scoring repeatable, and community signal is capped so it informs but cannot decide.
3. **Non-credentialism requires a standard submission interface.** For Arcanea that interface already exists: the Claude Code skill format. Anyone with the harness can enter; no résumé required.

## II. Why NOT fine-tune competitions

The obvious application — fine-tune a writing model or a character vision model via competition — is rejected:

- **Commoditized.** Kaggle owns metric-scored model competitions. Civitai owns community fine-tunes/LoRAs for characters and styles. Model-provider ecosystems own hosted fine-tuning. Replicating any of these puts Arcanea last into a mature market with no structural edge.
- **Worst IP exposure.** Community fine-tunes trained on Arcanea imagery and canon create maximal entanglement (training-data provenance, derivative-weight ownership, platform ToS conflicts) for minimal differentiation.
- **No compounding.** A winning checkpoint does not improve the Arcanea platform. It sits in a model zoo.

## III. Why agentic-workflow tournaments — the structural edge

An Arena entry is a **Claude Code skill/workflow that generates a world**. This yields three advantages no incumbent competition platform has:

1. **Submission format = distribution format.** The Arcanea plugin marketplace already works (`/plugin install frankxai/arcanea`, 78 skills in `.claude/skills/`). A winning entry is, verbatim, an installable skill. Every season's winners compound the product's core asset — the skill library — and every participant is a plugin user by construction. Kaggle winners' notebooks don't improve Kaggle; Arena winners' workflows *are* Arcanea features.
2. **Canon as the shared constraint set.** `CANON_LOCKED.md` (Gates, Elements, cosmology, LOCKED/STAGING/EVOLVING tiers) plus a fixed world-seed makes wildly different creative entries comparable — the same role a test set plays on Kaggle. `canon-check` already exists as an enforcement skill.
3. **The machinery mostly exists.** Verified in-repo: Worlds + fork API (the remix primitive), `api/arena/run` (a real model-judge eval endpoint), `gate-eval`/`canon-check` (rubric seeds), the `/challenges` Arena UI (front-end shell), plus ecosystem assets (claude-skills-library validators, starlight-evals scorecard contract). What's missing is the competition spine: rules, rubric, submission intake, ledger, judge script. That is what Season 0 builds.

**People and algorithms competing together** is native to this design: an entry is precisely a human's orchestration of algorithms. The leaderboard ranks human+machine systems, not either alone — which is the book's actual endgame.

## IV. Program design (summary — full spec in `docs/superpowers/specs/2026-07-02-worldsmith-trials-season-0-design.md`)

- **Season 0** is GitHub-native: entries are PRs to the OSS repo (`frankxai/arcanea`) under `challenges/season-0/entries/`. No new infrastructure, no auth surface, full auditability.
- **Judging**: workflows are re-run against a **held-out seed** revealed at judging start (the workflow is judged, not a hand-polished artifact), gated by `canon-check`, scored by an anonymized multi-judge model panel against a published rubric, with community signal capped at 10%.
- **Ledger, not database**: results live in a versioned JSON ledger rendered by the `/challenges` page. Every public number traces to a commit. The Supabase schema is spec'd and deferred to Season 1 (in-app submissions).
- **Winners are promoted** into the plugin's community skills tier with attribution — closing the submission→distribution loop.

## V. Season cadence

- **Season 0 (proof)**: one challenge, world-creation workflows, manual maintainer judging, ledger leaderboard. Goal: prove the loop end-to-end with real entries, however few.
- **Season 1 (platform)**: in-app submission + Supabase persistence + persisted judge runs; second track (e.g. character/faction workflows); sponsors/prizes only if funded.
- **Season 2+ (scale)**: automated judging pipeline, seasonal themes tied to canon events, team entries (crews), potential cross-harness tracks.

Advance to the next season only if the previous one produced ≥1 promotable winner and the judging pipeline held up. No vanity expansion.

## VI. Success criteria (no invented numbers)

Season 0 is measured only on things the ledger can prove:

- ≥1 valid external entry (someone outside the core team completes the full flow).
- Judge pipeline runs end-to-end on every valid entry with published per-dimension scores.
- ≥1 winner promoted to the plugin community tier and installable.
- Zero fabricated statistics anywhere on the public surface (the page derives all numbers from the ledger).

No projections of participant counts, prize pools, or revenue appear anywhere until they are real.

## VII. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Judging perceived as arbitrary | Published rubric + anonymized entries + median across judge panel + held-out seed; all scores public in the ledger |
| Prompt-injection in submissions attacking the judge | Injection lint (DQ on hit) + judges scored on outputs, workflows run in fresh sandbox |
| Overfitting to public seeds | Held-out seed is the scored run |
| IP disputes over entries built on canon | `SUBMISSIONS-LICENSE.md` signed-by-PR-checkbox; canon stays Arcanea's; contributors keep their workflow copyright |
| Zero participation | Cost of Season 0 is a few docs + scripts; the fork-route fix and honest challenges page are net wins regardless |
| Naming/trademark | "Arcanea Arena" / "Worldsmith Trials" only; no "Crowd Machine" |

## VIII. What this is not

- Not a fine-tuning platform. Not a model zoo.
- Not on-chain. The previous challenges page copy claiming smart-contract verification was fiction and is removed.
- Not a prize-money program until funding is real and announced separately.

---

*Related: `docs/superpowers/specs/2026-07-02-worldsmith-trials-season-0-design.md` (engineering spec) · `docs/community/season-0-worldsmith-trials.md` (public rules) · `docs/community/judging-rubric.md` · `docs/community/SUBMISSIONS-LICENSE.md` · `docs/superpowers/plans/2026-07-02-worldsmith-trials-season-0-plan.md` (roadmap)*
