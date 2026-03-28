# Arcanea Product Direction

## Position

Arcanea should not copy a single reference product.

It should combine:

- OpenAI's clarity of primary path
- Claude's calm, high-trust interaction quality
- Midjourney's creation-loop obsession
- Grok Imagine's live-feed momentum

The resulting standard is:

- one canonical path for each core workflow
- high signal in every empty, loading, error, and active state
- visible system power without noisy control surfaces
- a product that feels authored, not accreted

## Current Scorecard

### Chat

Strengths:

- canonical `/chat` path is now the active product surface
- tool toggles and request state are wired to the real transport
- message/tool rendering is materially stronger than before

Gaps:

- too many parallel-era chat components still exist in the repo
- active chat quality is better architecturally than it is experientially
- the interface still lacks the level of authored guidance, motion discipline, and conversational confidence seen in best-in-class labs

### Imagine

Strengths:

- no longer just a one-shot form
- infinite feed, retries, remix, resume, and workspace persistence are in place
- favorites create a credible "keep" loop

Gaps:

- the product is now structurally correct, but still needs more polish in curation, ranking, and saved-work flows
- provider/model/timing context is present but not yet elevated into a richer creation-history layer
- favorites are still local-first rather than fully account-native

## Product Rules

1. Arcanea should have exactly one canonical chat flow.
2. Arcanea should have exactly one canonical imagine flow.
3. Any advanced control must improve steering, recovery, or trust.
4. Any secondary UI path that reimplements core behavior should be treated as debt.
5. Empty states must teach the workflow, not restate the obvious.
6. Runtime quality must be enforced with slice verification, not intention.

## Immediate Next Steps

1. Continue pruning legacy chat components that are no longer part of the canonical surface.
2. Add account-backed Imagine persistence for favorites, saved batches, and feed history.
3. Add stronger creation controls around batch continuation:
   - reroll intensity
   - keep/discard signals
   - save batch to collection
4. Raise design consistency between `/chat` and `/imagine` so both feel like one lab, not adjacent tools.
5. Expand browser verification to include one deterministic Imagine flow:
   - first batch
   - reload persistence
   - resume feed
   - favorite and reopen drawer

## Comparison Standard

When evaluating Arcanea, compare against:

- OpenAI for clarity and core-path reduction
- Claude for trust, calm language, and response quality
- Midjourney for creative loop intensity
- xAI/Grok for live image-feed energy

If Arcanea is worse on clarity, trust, or workflow speed than all four at once, the product is not ready.
