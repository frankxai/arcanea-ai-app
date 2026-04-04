# Canvas / Whiteboard Decision — 2026-04-02

## Question

Should Arcanea use `tldraw`, build a native Next.js canvas/whiteboard, or adopt another OSS base?

## Short Answer

- `tldraw` is the best technical starting point for a serious infinite canvas.
- It is not “free forever” for commercial production in the way many founders assume.
- Arcanea should not rebuild a high-quality infinite canvas from scratch right now.
- Arcanea should use a staged approach:
  1. native lightweight notes and board primitives in Next.js for immediate product value
  2. evaluate `tldraw` for premium/pro canvas if license cost is acceptable
  3. only consider deeper custom canvas work after product fit and usage patterns are clear

## What We Know

- tldraw’s official pricing page says the SDK requires a commercial license for production use and offers a 100-day free trial, with startup pricing available.
- The public GitHub repository states the SDK is under the tldraw license and commercial use in production requires preserving the watermark or purchasing a business license.
- tldraw’s docs also expose collaboration and multiplayer patterns that are strong fits for Arcanea.

Official sources checked:
- https://tldraw.dev/pricing
- https://tldraw.dev/community/license
- https://github.com/tldraw/tldraw

## Decision

### Do Not

- do not rebuild a full Miro/tldraw-class infinite canvas from scratch right now
- do not commit Arcanea’s entire product roadmap to a licensed canvas SDK before validating how central whiteboarding is to active users
- do not assume “source available” means production-commercially-free

### Do

- build a first-party Arcanea note and board system around the project graph now
- keep the first board version intentionally narrow:
  - cards
  - notes
  - images
  - links
  - AI-generated blocks
  - simple connections
- treat true infinite canvas as a premium/pro layer decision
- evaluate `tldraw` after first-party board usage proves strong demand

## Recommended Product Layers

### Layer 1 — Native Arcanea Notes

Use Next.js-native product surfaces for:
- project notes
- story docs
- lore docs
- research docs
- prompt books
- world bibles
- creation briefs

This gives immediate value and aligns with the current project graph.

### Layer 2 — Native Arcanea Board

Build a lightweight board in-house for:
- project cards
- visual outlines
- image references
- idea clusters
- flow arrows
- AI brainstorm outputs

This should be “board enough” without trying to be Miro.

### Layer 3 — Pro Canvas Decision

If usage proves the need for:
- infinite zoom
- heavy freehand drawing
- multiplayer canvas collaboration
- robust shape tools
- advanced canvas plugins

then adopt `tldraw` as a premium/pro canvas surface, assuming the license economics make sense.

## Why This Is Better

### Better Than Full Rebuild

- less time
- less technical risk
- faster product value
- avoids years of whiteboard complexity work

### Better Than Blind SDK Dependence

- Arcanea keeps its own product graph and object model
- notes, memory, provenance, and project continuity stay first-party
- canvas becomes an interchangeable surface, not the architecture

## Engineering Recommendation

### Arcanea Core Objects Must Stay Custom

- workspace
- project
- thread
- doc
- board
- artifact
- memory
- style pack
- agent
- run

This should remain Arcanea-owned regardless of what canvas/editor library is used.

### Notes Stack

Recommended:
- block editor first
- project-linked docs
- typed DB records for docs
- project retrieval can use docs as first-class graph inputs

### Board Stack

Recommended first-party board:
- React + Next.js app surface
- persisted board nodes in Postgres/Supabase
- cards, text, image, link, AI block, connector edge
- later real-time collaboration if needed

## When To Use tldraw

Use `tldraw` if all of these are true:
- whiteboard/canvas proves to be a primary workflow
- startup/commercial pricing is acceptable
- premium canvas can support monetization
- you want faster time-to-quality than custom build

## When Not To Use tldraw

Do not use `tldraw` as the immediate center of Arcanea if:
- you want maximum cost control now
- most user value is still in notes, projects, retrieval, and generation
- whiteboarding is still a hypothesis instead of a proven core behavior

## Arcanea Product Direction

Arcanea should become:
- Notion-like for notes/docs
- Scrivener-like for longform structure
- Claude-like for projects/chat continuity
- Studio-like for generation workflows
- later Miro-like for canvas where it actually matters

That sequencing is stronger than trying to become all of them at once.
