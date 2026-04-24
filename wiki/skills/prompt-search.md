---
title: /prompt-search — Semantic Search Across Captured + Library
domain: meta
created: 2026-04-21
updated: 2026-04-21
author: claude
status: spec
priority: P1
effort: 0.5 day
links: [prompt-capture, prompt-replay, ../meta/prompt-os-v1.4.0-architecture]
---

# /prompt-search

**Purpose:** Sub-second semantic retrieval across the entire Prompt OS substrate. "What did I say about compile sprints last month?" → answers in 2 seconds with links + Replay Count + Coach Suggestion. Without this, volume-capture is a graveyard.

**Triggering description (for SKILL.md):**
> Use when user asks "have I prompted this before", "did I already write something about X", "find that prompt where I", "what did I do last time with Y", "search my prompts". Also when user starts a new prompt that semantically overlaps past work — proactively surface the closest match.

## Why this exists

Volume capture without search is hoarding. Top operators (Karpathy, Naval) have external-brain discipline precisely because they can retrieve on demand. The discipline is worthless without the retrieval layer.

## Usage

```
/prompt-search "compile sprint starlight"            # free-text semantic
/prompt-search --agent lumina "pricing tier"         # scoped to agent
/prompt-search --project gencreator "session"        # scoped to project
/prompt-search --goal gate-0 "revenue"               # scoped to goal
/prompt-search --since 2026-04-01 --cluster creative-spark
/prompt-search --replay-count-gte 3                  # surface winners
/prompt-search --has-counter-coach                   # where Counter fired
```

## Architecture — native Notion AI, not vector DB

Critical decision: **use Notion AI's native semantic search, not a custom vector DB.**

**Why:** Notion AI Enterprise (now on all plans via AI add-on) has native cross-DB semantic search over workspace content with no additional cost per query, no embedding pipeline, no vector DB to maintain. It searches across:
- Captured Prompts (all fields, including rich text)
- Prompt Library
- Daily/Weekly Briefs
- Goal and Gate pages

For Frank's volume (projected 200/day × 90d = 18k rows at T+3mo), native search is sufficient. Revisit only if recall degrades.

**Fallback:** If Notion AI search returns <3 results and query length >4 tokens, trigger Claude-side rerank: pull top 20 by keyword match, rerank by semantic similarity via Sonnet.

## Output shape

```
🔍 SEARCH: "compile sprint starlight"
   Scope: all | 847 rows scanned | 4 matches (ranked by relevance × replay × recency)

1. [PR-0142] 2026-04-19 · Library · Replay 7× · can-replace-coach
   "Design open-core pricing for Starlight OS compile sprint..."
   → Replay / Open / Fork

2. [PR-0089] 2026-04-12 · Captured · Cluster: creative-spark · Replay 2×
   "Sprint me through the 5-gate compilation..."
   → Promote to Library / Replay / Fork

3. [PR-0034] 2026-04-05 · Captured · Cluster: gate-0 · Replay 0× · DRIFT
   "Let's sprint on the pricing compile..."
   → Drift flagged — off-gate at time of capture

4. [WB-06] 2026-W15 · Weekly Brief
   "...compile sprint pattern showed up 3x this week..."
   → Jump to brief

VERDICT: High overlap with PR-0142. Consider `/prompt-replay PR-0142` instead of re-prompting.
```

## The proactive surface (load-bearing UX)

When Frank types a new prompt via `/prompt-capture`, if the captured text semantically matches an existing Library entry with `Replay Count >= 3`, surface:

```
💡 You've prompted this shape 5 times. Replay [PR-0142]?
   "Design open-core pricing for Starlight OS..."
   (type 'replay' to fork with your new context, 'new' to continue fresh)
```

This is where the OS graduates from note-taker to thinking partner. Reuse > re-invent for patterns proven by replay frequency.

## Scoring model

Relevance score = `0.6 × semantic_similarity + 0.2 × replay_weight + 0.15 × recency_weight + 0.05 × hero_boost`

- `semantic_similarity`: Notion AI's cosine
- `replay_weight`: `min(replay_count / 5, 1.0)`
- `recency_weight`: exponential decay, half-life = 14 days
- `hero_boost`: 1.0 if Hero, 0.0 otherwise

Tune after 30 days of logs.

## Model selection

- **Notion AI (native)** for primary search — no Claude call per query
- **Haiku 4.5** for the rerank path (only fires when <3 native results and query is substantive)
- **Sonnet 4.6** for the proactive surface (it's making a judgment call, not just retrieval)

Cost envelope: ~$0 for 95% of queries, ~$0.002 for the 5% rerank path, ~$0.01 per proactive surface firing. Expected <$5/month.

## Acceptance criteria

- [ ] Query → result in <2s for top-20 recall
- [ ] All scopes (agent, project, goal, cluster, date, replay count) work via flags
- [ ] Proactive surface fires correctly on semantic overlap with Library entries (Replay ≥ 3)
- [ ] Rerank fallback triggers when native returns <3 and query is substantive
- [ ] Never hallucinates results — if nothing matches, says so
- [ ] Output includes Replay Count, Cluster, and DRIFT flag where present
- [ ] Jump-to-source links work for Notion, Obsidian, and Library entries

## Dependencies

- Notion AI active on workspace (all plans)
- Captured Prompts + Prompt Library DBs populated
- Obsidian markdown optionally indexed (v2 — native first)

## Privacy consideration

Searches scoped to Frank's workspace only. Never leaks query text to external LLMs. Rerank path uses Claude API with zero retention headers.

## Future: cross-brand search

v2 will extend scope to `frankxai/starlight-os` OSS repo + wiki, so Frank can search his own published thinking alongside drafts. Out of scope for v1.

---

*A prompt you can't find might as well not exist. Search is the compound interest on capture.*
