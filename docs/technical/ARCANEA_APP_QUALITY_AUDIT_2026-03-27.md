# Arcanea App Quality Audit

Date: 2026-03-27
Scope: `apps/web`

## Executive View

Arcanea already has the raw ingredients of a differentiated product:

- a strong thematic layer
- multi-provider chat routing
- tool-capable chat
- image generation
- research and memory primitives
- a broad content and creation surface

The current weakness is not lack of ambition. It is architectural diffusion. The product has multiple overlapping implementations for chat, sessions, history, and image generation. That fragmentation lowers actual quality even when individual pieces are promising.

## What Is Working

- The web app has a meaningful platform shape, not a toy single-page demo.
- The AI route already supports multiple providers and a curated gateway model layer.
- The chat UI has modern affordances: history, tools, branching, attachments, voice, export.
- Imagine has a clear visual identity and a reusable generation library.
- There is real evidence of testing intent, especially around Playwright and AI routing.

## Current Quality Gaps

### 1. Product Architecture

- Chat is split across multiple route patterns and fallback stores.
- Tool-capable chat and plain text chat are mixed through transport switching.
- The codebase contains duplicated message rendering paths.
- Several newer surfaces were added without fully replacing older ones.

Impact:
- regressions are easy to introduce
- confidence is low
- UX can look richer than the underlying behavior really is

### 2. Chat Quality

- Tool toggles were not wired to the actual transport state.
- Structured tool results were not rendered in the active chat path.
- File attachments were being accepted in the UI but stripped before model conversion.
- "Extended thinking" existed as a UI affordance without a real tool mapping.

Impact:
- users cannot trust that chat controls do what they appear to do
- chat quality feels lower than the UI suggests

### 3. Imagine Quality

- Imagine is visually appealing, but still behaves more like an endless generation stream than a high-confidence creation workspace.
- Metadata and generation state are thin compared with the importance of this feature.
- Failure states are better than nothing but still not strong enough for a premium creation product.

Impact:
- output volume is prioritized over creative control and iteration quality

### 4. Verification Quality

- Lint and type-check are blocked by many unrelated pre-existing issues across the app.
- Playwright specs exist, but Playwright is not currently installed in `apps/web`, so E2E verification is not runnable as configured.

Impact:
- the repo has low operational trust
- regressions can hide behind unrelated failures

## Changes Completed In This Pass

### Chat Pipeline

- Wired chat tool toggles to the actual `useConversation()` tool state.
- Preserved file parts on the server by converting UI messages with `convertToModelMessages(...)` instead of flattening everything to text.
- Mapped the "think" toggle to the `deep_research` tool path.

### Chat Rendering

- Added tool-part rendering to the active `ChatArea` path.
- Updated tool result handling to support AI SDK v6 tool parts such as `tool-*` and `dynamic-tool`.
- Updated image tool rendering to support array-based image outputs instead of only a single legacy image object.

### Verification

- The changed files are lint-clean.
- Full repo type-check still fails because of unrelated existing issues elsewhere.
- E2E could not run because Playwright is not installed in `apps/web`.

## Strategic Direction

Arcanea should not compete as "another chat UI plus image tab".

It should become:

1. a creator operating system
2. a high-agency chat workspace
3. a creation pipeline where chat, research, memory, canon, and generation compound each other

That means the next architecture moves should be:

- one canonical chat transport path
- one canonical persistence path
- one canonical tool-rendering path
- one canonical media generation service layer
- one quality bar for verification that actually runs locally and in CI

## Highest-Leverage Next 8 Hours

### Hour 1-2

- Collapse remaining duplicated chat rendering logic.
- Standardize tool-part typing across the chat UI.
- Remove dead or misleading affordances from the input bar.

### Hour 3-4

- Make Imagine a true creation workspace:
- prompt history
- seed or variation controls where provider supports it
- clearer generation metadata
- stronger retry and save flows

### Hour 5-6

- Rationalize persistence:
- choose the canonical session/history store
- reduce fallback sprawl
- document the supported offline/authenticated behavior clearly

### Hour 7

- Repair the verification floor:
- install Playwright in `apps/web`
- make at least one deterministic chat E2E test pass
- isolate a minimal type-safe path for chat/imagine

### Hour 8

- Write a focused product roadmap for the next iteration:
- chat as workspace
- imagine as creative pipeline
- memory as creator context
- research as grounded mode

## Bottom Line

Arcanea is not underpowered because the vision is too small.
It is underpowered because too many promising systems are only partially connected.

The path forward is not more feature spread.
It is tighter architecture, stronger verification, and making chat plus imagine feel like one integrated creative instrument.
