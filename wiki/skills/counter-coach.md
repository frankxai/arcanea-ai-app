---
title: /counter-coach — Adversarial Coach (the Loyal Opposition)
domain: meta
created: 2026-04-21
updated: 2026-04-21
author: claude
status: spec
priority: P0
effort: 1 day
links: [daily-brief, prompt-os, ../meta/prompt-os-v1.4.0-architecture]
---

# /counter-coach

**Purpose:** For every prompt the Coach upgrades, the Counter-Coach proposes the *opposite* direction — a steelmanned alternative framing. This is the single highest-leverage addition in v1.4.0. Without it, the Council converges on Frank's existing mental model and can never surprise him.

Naval's rule: "Every good thinking system has a loyal opposition."

**Triggering description (for SKILL.md):**
> Use this skill when the Coach has just produced an upgrade. Runs automatically as part of the 05:30 Council pass. Can also be invoked manually: "counter this", "devil's advocate", "what's the opposite take", "steelman the other side".

## Usage

```
/counter-coach --prompt-id PR-0042              # counter one specific prompt
/counter-coach --coaching-output <text>         # counter a specific Coach suggestion
/counter-coach --run-today                      # counter all top-3 from today's Council pass
```

## The adversarial heuristic (load-bearing)

For each prompt the Coach upgraded, ask:

1. **What if the opposite approach was right?** If Coach suggested more structure, propose less. If Coach suggested more steps, propose fewer. If Coach suggested more detail, propose more abstraction.

2. **What's the second-order effect the Coach missed?** Coach optimizes for yield. Counter-Coach optimizes for compound. Is the "upgrade" actually making the prompt less replayable in new contexts?

3. **What's the constraint the Coach assumed but didn't name?** Coach may have assumed the agent (Claude), the tier (Pro), the audience (Frank). Propose one that breaks each assumption.

4. **What's the shipping-velocity cost?** Coach may propose a better prompt that takes 3× longer to compose. Counter-Coach checks whether the original was "good enough to ship" and the upgrade is overengineering.

5. **What's the false dichotomy?** Sometimes both Coach and original are missing a third option. Propose it.

## Output shape

For each source prompt, write to `Counter Coach` column:

```
COUNTER: {one-sentence alternative framing}

WHY: {the assumption Coach didn't name OR the second-order cost Coach missed}

WHEN COUNTER WINS: {specific scenario where the counter beats both original and Coach}

VERDICT: {"Counter replaces", "Counter complements", "Coach stands"}
```

## Model selection

- Use **Sonnet 4.6** — reasoning required. Haiku produces shallow counters.
- Temperature 0.8 (higher than Coach's 0.3) — we want divergence.
- Prompt template engineered to force a *different* path, not just a critique.

## Integration with Coach

Counter-Coach runs **after** Coach completes. It reads `Coach Suggestion` and the original prompt, then writes `Counter Coach`.

Order matters: Coach first (converge), Counter-Coach second (diverge). Frank reads both in the Daily Brief and picks.

## Brief inclusion

Daily Brief shows both passes under `🧠 COACH` and `⚔️ COUNTER`:

```
🧠 COACH — upgrade for compile-sprint:
  {coach suggestion}

⚔️ COUNTER — what if the opposite:
  {counter suggestion}
  VERDICT: Counter complements
```

Frank's job each morning: pick. This is the skill of a principal — not accepting any single synthesis.

## Success metric

- **≥1 Counter beats Coach per week** (Frank's subjective pick, logged on prompt row)
- If 0 Counters beat Coach for 3 weeks straight, Counter-Coach needs tuning (temperature up, prompt rewrite)
- If >4 Counters beat Coach per week, Coach needs tuning (it's converging too fast)

## Acceptance criteria

- [ ] Every Top-3 Coach upgrade has a paired Counter
- [ ] Counter writes to `Counter Coach` column
- [ ] Brief renders both in paired format
- [ ] Never produces a tautological counter (e.g. "do the same but slower")
- [ ] When it can't produce a meaningful counter, emits "Coach stands" verdict — never pads
- [ ] Logs Frank's pick ("Coach wins" / "Counter wins" / "Both stand") to drive tuning

## Dependencies

- Coach pass has run
- Claude API (Sonnet)
- Write access to Captured Prompts

## Scheduled slot

No separate schedule. Runs inline after Coach in the 05:30 Council pass, which is triggered by `daily-brief` task at 07:00 local.

---

*The Council that only agrees with you is decoration. The Council that disagrees is leverage.*
