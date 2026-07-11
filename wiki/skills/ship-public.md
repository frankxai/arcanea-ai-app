---
title: /ship-public — Promote Library Entry to OSS with Provenance
domain: meta
created: 2026-04-21
updated: 2026-04-21
author: claude
status: spec
priority: P2
effort: 1 day
links: [prompt-curate, weekly-brief, prompt-replay, ../meta/prompt-os-v1.4.0-architecture]
---

# /ship-public

**Purpose:** The distribution action. Promotes a curated Library entry to the OSS layer at `frankxai/starlight-os/prompts/` with full lineage and licensing metadata. This is how private leverage becomes public signal — the funnel into Pro and Atelier tiers.

**Triggering description (for SKILL.md):**
> Use when user says "ship this public", "publish PR-0142 to OSS", "release this prompt", "push to starlight-os", or approves a `/prompt-curate` promotion flagged as Open-tier.

## Publishing model

Three tiers map to three publish destinations:

| Tier | Destination | Access | Revenue link |
|---|---|---|---|
| **Open** | `frankxai/starlight-os/prompts/*.md` + `/llms.txt` | Public | Top-of-funnel — cited by Claude/GPT/Perplexity |
| **Pro** | Notion Marketplace template pack (private GitHub repo: `frankxai/starlight-os-pro`) | Paid (€19/mo or €149/yr) | Direct Pro revenue |
| **Atelier** | Private client workspace clone | Clients only | Atelier retainer |
| **Internal** | Never ships | Frank only | — |

## What does NOT ship public

Hardcoded vetoes enforced in the skill:
- Any prompt containing strings matching `CLIENT_NAME_PATTERN` (loaded from `Business/legal/confidentiality.md`)
- Any prompt with `Tier = Atelier` or `Tier = Internal`
- Any prompt missing a `Source Prompt` / `Parent Prompt` chain (provenance invariant)
- Any prompt with `Sellable = false` AND `Tier = Open` (contradiction — flag for Frank)
- Any prompt whose author is not Frank (future multi-contributor guard)

If any veto hits, emit a structured failure with the specific rule fired.

## Usage

```
/ship-public PR-0142                                  # interactive, defaults to Open tier if Library says so
/ship-public PR-0142 --tier open --license mit
/ship-public PR-0142 --tier pro --marketplace-listing
/ship-public --weekly-brief 2026-W16                  # ship the weekly digest
/ship-public --dry-run PR-0142                        # show MDX + commit message without executing
```

## MDX template (public Open-tier)

```markdown
---
id: PR-0142
slug: open-core-pricing-architecture
title: "Open-Core Pricing Architecture for Operator Tools"
tier: open
license: MIT
author: frankxai
created: 2026-04-20
shipped-public: 2026-04-21
lineage:
  - PR-0089 (parent) — "compile sprint"
  - PR-0142 (self)
  - PR-0142.a (child, replayed for gencreator)
  - PR-0142.b (child, replayed for arcanea)
replay-count: 7
shipped-outcomes:
  - Starlight OS Pro tier pricing finalized at €19/mo / €149/yr
  - GenCreator Studio pricing locked at €297/mo
agents: [claude-sonnet-4.6, claude-code]
council-verdict: "Counter complemented" (Counter-Coach flagged one-time-fee alternative for Notion Marketplace)
---

# Open-Core Pricing Architecture for Operator Tools

**Use this prompt when:** designing a three-tier pricing structure for an operator-grade tool with OSS core, paid Pro tier, and high-touch Atelier tier.

## The Prompt

Design an open-core pricing structure for {{product}} targeting {{audience}}
with three tiers:
- Open (€0) — {{open_scope}}
- Pro (€{{pro_price}}/mo or €{{pro_annual}}/yr) — {{pro_scope}}
- Atelier (€{{atelier_floor}}+) — {{atelier_scope}}

Consider: {{constraint}}.

Surface:
1. Tier boundary rationale (what upgrades someone from Open to Pro?)
2. Atelier trigger (what problem only Atelier solves?)
3. Anti-pattern check (what pricing moves would cannibalize one tier with another?)
4. Competitive frame (one closest analog, and how this differs)

## Example usage

Frank used this to design Starlight OS pricing on 2026-04-19. See output at [weekly-brief 2026-W16](/briefs/2026-04-20-week-16.md).

## Compound track record

- 7 replays across 3 brands
- 3 shipped pricing decisions derived from this prompt
- Counter-Coach beat the Coach once (flagged the Notion Marketplace one-time-fee alternative — now live)

## License

MIT. Credit `frankxai/starlight-os` if derivative.
```

## Execution flow

1. **Validate** tier + provenance + veto checks
2. **Render MDX** from Library entry with lineage block assembled from DAG walk
3. **Commit** to `frankxai/starlight-os/prompts/{slug}.md`:
   - Commit message: `feat(prompts): ship PR-0142 open-core-pricing-architecture`
   - Conventional commits compliant
4. **Append** to `/llms.txt` under `## Prompts`:
   ```
   - [open-core-pricing-architecture](/prompts/open-core-pricing-architecture) — tier pricing for operator tools with 7 replays, 3 shipped outcomes
   ```
5. **Update Notion** Library entry:
   - `Published Public At` = now
   - `Public URL` = github.com/frankxai/starlight-os/blob/main/prompts/{slug}.md
6. **Post** to `#starlight-announce` Slack with link + 1-line thesis
7. **Optional:** `--tweet` flag posts tweet with prompt title + link + shipped-outcome count

## Pro tier handling

If `--tier pro`:
- Write to `frankxai/starlight-os-pro` (private)
- Generate Notion Marketplace-compatible template JSON
- Bundle into the next Notion Marketplace release
- Never expose prompt text publicly — only the tier badge

## Model selection

- **MDX render:** Haiku — deterministic templating
- **Lineage block assembly:** no LLM, pure Notion fetch + recursive walk
- **Thesis extraction for Slack/tweet:** Sonnet — judgment call
- **Veto check:** no LLM — pure regex + DB query

Cost: <$0.01 per ship.

## Acceptance criteria

- [ ] Vetoes block Atelier / Internal / Missing-provenance ships
- [ ] MDX lineage block correctly shows parent + children recursively (depth ≤ 3)
- [ ] Commit lands on `frankxai/starlight-os` with correct conventional message
- [ ] `/llms.txt` updated idempotently (never double-entries)
- [ ] Library `Published Public At` set on Notion
- [ ] Slack announcement posts
- [ ] `--dry-run` shows full diff without executing
- [ ] Shipping the same prompt twice is a no-op with clear "already shipped" message
- [ ] Pro tier ships never leak to public repo

## Dependencies

- `frankxai/starlight-os` repo exists with `/prompts/` and `/llms.txt`
- `frankxai/starlight-os-pro` repo exists for Pro tier (create or flag)
- Library entry has complete frontmatter + prompt body
- `Parent Prompt` / `Child Prompts` populated for lineage block
- `Business/legal/confidentiality.md` exists with CLIENT_NAME_PATTERN regex list
- GitHub CLI (`gh`) or equivalent
- Slack MCP with post permissions

## Scheduled slot

None. Manual trigger, usually following `/prompt-curate` approval or Sunday Weekly Brief review.

## Integration with Weekly Brief

Weekly Brief auto-lists "Shipped public this week" section sourced from Library `Published Public At` within the week window. No duplicate logic needed.

## The trust moat

Every public prompt shows:
- Real replay count (not vanity)
- Real shipped outcomes (not self-reported wins)
- Counter-Coach engagement (shows the thinking was pressure-tested)
- Full lineage (shows evolution, credits honest ancestry)

This is the differentiator vs the flood of generic "101 ChatGPT prompts" content. Prompts as audited artifacts, not junk.

---

*Public prompts without provenance are noise. Public prompts with proven lineage are signal — and signal compounds.*

## Publishing House Integration (2026-06)
The Arcanea Publishing House (arcanea-publishing-house) extends ship-public and ship-it patterns into full coordinated swarms for books, marketing, influencers, and social.

Install: hermes profile install github.com/frankxai/arcanea-publishing-house --name publishing-house --alias --force -y

See: C:/Users/frank/arcanea-publishing-house/ARCHITECTURE.md

