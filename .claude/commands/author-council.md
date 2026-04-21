---
description: Convene a pluggable author council — routes to sub-rosters (fiction / magic-system / worldbuilding / prose / mythic / philosophy) based on question kind, runs critique in 4 deliberation modes, synthesizes with neutral moderator
---

# /author-council

Protocol primitive for pluggable author-voiced craft councils. Built on `@arcanea/author-council`.

## Subcommands

```
/author-council                          → show status + available rosters
/author-council audit <file>             → audit a draft; auto-selects roster by kind
/author-council magic-system <file>      → adversarial magic-system audit
/author-council worldbuilding <file>     → sequential worldbuilding pipeline
/author-council prose <file>             → parallel prose audit
/author-council mythic <file>            → convergence mythic audit
/author-council naming <terms>           → name the terms in author voices
/author-council style-transfer <author> <passage>  → single-author voice analysis
/author-council diverge <question>       → force adversarial split
/author-council roster <id>              → show roster composition
/author-council list-authors             → list all available authors
```

## How it works

1. Read the roster manifest from `packages/author-council/rosters/{id}.json`.
2. For each author in the roster, load their `authors/{slug}/SOUL.md`, `SKILLS.md`, `PATTERNS.md`, `craft.md`, `glossary.json`, `systems.json`, `voice.json`, `sources.md`.
3. Route question to top-K authors via the question-taxonomy router.
4. For each selected author, produce a structured Critique (JSON) using the author's system prompt (see `src/protocol/prompt.ts::buildAuthorPrompt`).
5. Apply deliberation mode (parallel / adversarial / sequential / convergence).
6. Synthesize via neutral moderator — enforces 25% author-mass cap, requires dissent logged when 3+ authors, preserves disagreement.
7. Write the session record to `book/<book-slug>/council-audits/<timestamp>.json` and a human-readable companion `.md`.

## Critique JSON shape (each author returns)

```json
{
  "author": "sanderson",
  "role": "systems",
  "strengths": ["..."],
  "concerns": ["..."],
  "recommendations": [
    {
      "action": "add|remove|rewrite|restructure|clarify|constrain",
      "target": "where in the content",
      "proposal": "what to do",
      "rationale": "why, tied to the author's craft axioms"
    }
  ],
  "citations": [
    { "source": "Sanderson First Law essay", "claim": "...", "tier": 1 }
  ],
  "confidence": 0.7
}
```

## Synthesis rules (Neutral Moderator)

- No single author exceeds 25% of synthesis mass
- Genuine disagreements preserved, not collapsed
- 3+ authors → must log at least one dissent
- Harmonic-mean confidence (penalizes low-confidence critiques)
- Recommendations ordered by (author-weight × confidence)

## Invocation example

```
/author-council audit book/forge-of-ruin/chapters/01-the-forty-seven-names.md
```

Expected output:
1. Router decision (which authors, which mode)
2. Per-author critiques (JSON + rendered markdown)
3. Synthesis with agreements, disagreements, prioritized recommendations
4. Saved artifact path

## Non-Arcanea rosters only

This is the protocol primitive. For the Arcanea locked instance with Lumina synthesis and canon binding, use `/arcanea-author-council` instead.

## See also

- `/fiction-author-council` — curated fiction execution roster (Paolini + Schwartz + Weeks + Sanderson + Le Guin)
- `/arcanea-author-council` — locked instance, Lumina synthesizer, canon-bound
