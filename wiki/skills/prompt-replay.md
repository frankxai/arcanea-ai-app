---
title: /prompt-replay — Re-run Library Entries with DAG Provenance
domain: meta
created: 2026-04-21
updated: 2026-04-21
author: claude
status: spec
priority: P1
effort: 1 day
links: [prompt-search, prompt-graph, prompt-curate, ../meta/prompt-os-v1.4.0-architecture]
---

# /prompt-replay

**Purpose:** Forking a Library entry with new context, tracked as a child node in the Prompt DAG via `Parent Prompt` self-relation. Converts one-shot prompts into *composable* primitives. This is the difference between a prompt archive and a prompt *operating system*.

**Triggering description (for SKILL.md):**
> Use when user says "replay that prompt", "fork [PR-0142]", "run the pricing sprint one again with new inputs", "re-use my compile sprint pattern", "same prompt but for gencreator this time". Triggered automatically from `/prompt-search` proactive surface when user accepts suggestion.

## The DAG insight (load-bearing)

Prompts are not linear events — they are **graphs of evolution**. A good prompt begets a better prompt begets a library entry begets three replays begets a shipped product.

Without a `Parent Prompt` self-relation:
- No way to see which Library entries actually compound
- No ability to trace back from a shipped result to the original genesis prompt
- No provenance for Open-tier prompts pushed to OSS (can't credit lineage)

With it:
- Every replay creates `Captured Prompt` row with `Parent Prompt → PR-0142`
- `/prompt-graph` renders the DAG as a Cowork artifact
- Weekly Brief can call out "these 3 prompts all descend from PR-0089"
- Frank can ship a prompt publicly with honest lineage credit

## Usage

```
/prompt-replay PR-0142                               # interactive — prompts for new context
/prompt-replay PR-0142 --context "gencreator pricing tier for $297 Studio"
/prompt-replay PR-0142 --agent claude-code --tier pro
/prompt-replay PR-0142 --dry-run                     # show what would run, don't execute
/prompt-replay --last                                # replay the most recent Library entry
```

## Execution flow

1. **Load source prompt** from Library by ID (`PR-*`) or slug
2. **Prompt for variable substitution** if template has `{{placeholders}}` — interactive unless `--context` supplied
3. **Merge new context** into source prompt shell
4. **Execute via source prompt's declared agent** (Claude, Cursor, etc.) — respects the `Agent` field on the Library entry
5. **Capture output** to new Captured Prompts row:
   - `Parent Prompt` → source Library entry
   - `Replay Count++` on source (triggers Distiller flag at ≥3)
   - `Input Context` = the new variables provided
   - `Output Artifact URL` = where the result went (GitHub PR, Notion page, file path)
6. **Optional:** if `--tier pro`, also export to Prompt Library as derived entry (requires `/prompt-curate` approval)

## DAG integrity rules

- Every replay MUST link `Parent Prompt` — never orphaned
- Child prompts can be further replayed → N-deep lineage tracked
- When Library entry is deleted, children become `Parent Prompt = {archived-id}` — never lost
- `/prompt-graph` visualizes the tree; loops are not allowed (enforced at capture)
- Cross-brand replays are valid — a Library entry from `arcanea` replayed under `gencreator` context is legal and useful

## Template variables (the composability layer)

Library entries can declare `{{placeholders}}` in their prompt body:

```markdown
## Prompt
Design an open-core pricing structure for {{product}} targeting {{audience}}
with three tiers: Open (€0), Pro (€{{pro_price}}/mo), and Atelier (€{{atelier_floor}}+).

Consider {{constraint}}.
```

At replay:
```
/prompt-replay PR-0142
? product: GenCreator Studio
? audience: elite creators shipping multi-brand
? pro_price: 297
? atelier_floor: 2000
? constraint: no upsell funnel, direct approval-invite only
```

Output captured with `Input Context` JSON:
```json
{"product": "GenCreator Studio", "audience": "elite creators shipping multi-brand", ...}
```

This makes Library entries into *functions*, not strings. Top builders (Karpathy especially) have argued prompts should behave like functions with typed inputs.

## Hero detection on replay

If replay produces a notably better output (tracked via `Output Quality Score` auto-set by Brief Composer on next Council pass):

- Flag parent as "pattern" candidate
- Suggest promoting the *replay* to Library as v2
- Credit lineage: new Library entry's `Supersedes` field → original

## Model selection

- **The replay itself uses the source prompt's declared model.** If PR-0142 says Agent = "Claude Code Sonnet", replay invokes Sonnet. Don't downshift silently.
- **Variable substitution UI** uses Haiku — cheap, simple prompting loop
- **Output capture + metadata tagging** uses Haiku — structured JSON extraction
- **Hero detection heuristic** uses Sonnet once per replay — judgment call

## Acceptance criteria

- [ ] `Parent Prompt` relation set on every replay row
- [ ] `Replay Count` increments on source
- [ ] Template variable substitution works interactively and via `--context`
- [ ] Source agent respected (Claude / Cursor / ChatGPT / etc.)
- [ ] Cross-brand replay works (arcanea source → gencreator context)
- [ ] Never creates orphan children (enforced DAG integrity)
- [ ] Output links to actual artifact (not just prompt text — the *result* URL)
- [ ] `--dry-run` prints full merged prompt without execution
- [ ] Loop detection: cannot replay a prompt whose lineage already includes itself

## Integration with Counter-Coach

On replay, Counter-Coach runs against the *merged* prompt (source + context) as if it were new — often finds context-specific issues the Coach pass on the original missed. This is where Counter-Coach adds disproportionate value.

## Integration with /ship-public

Library entries published via `/ship-public` carry their full ancestor chain as a `lineage:` block in the MDX frontmatter. Public prompts show provenance. This is a trust signal the OSS world values.

## Acceptance — DAG depth targets

T+30 days:
- ≥20 Library entries replayed at least once
- ≥5 entries replayed ≥3 times (become patterns)
- Max DAG depth observed ≥3 (a replay of a replay of an original)
- 0 orphan children
- Weekly Brief cites ancestor chain on ≥1 shipped result per week

## Dependencies

- `Parent Prompt` relation in Captured Prompts (shipped v1.4.0)
- `Replay Count` column (existing)
- `Output Artifact URL` column (existing or add — TBD)
- `/prompt-search` for resolving fuzzy Library references
- Prompt Library populated with at least 5 entries (seeded Apr 20)

## Scheduled slot

None. Triggered manually or from `/prompt-search` proactive surface.

---

*A prompt that can't be replayed is a lottery ticket. A prompt that composes is a compounding asset.*
