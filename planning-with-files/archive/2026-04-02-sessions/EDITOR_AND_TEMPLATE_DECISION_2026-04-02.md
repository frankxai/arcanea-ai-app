# Editor and Template Decision — 2026-04-02

## Question

Why not:
- build the docs/editor system fully from scratch
- use Vercel Novel
- use Morphic UI
- absorb more Vercel templates as the product foundation

## Short Answer

- We should not build a serious rich-text editor from scratch right now.
- We should not base Arcanea on `Novel` as the primary product architecture.
- We should not use `Morphic` as the app foundation.
- We should selectively absorb patterns and slices from Vercel templates, not adopt them wholesale.

## Vercel Novel

Official Vercel template page describes Novel as:
- a Notion-style WYSIWYG editor
- built with Tiptap, OpenAI, and Vercel AI SDK
- Apache-2.0 licensed

Source checked:
- https://vercel.com/templates/ai/novel

Important current note:
- the Vercel template page now also shows “This template is unavailable”, which makes it a weak foundation decision even if the GitHub repo still exists.

### Why Novel Is Attractive

- strong proof that Tiptap + AI SDK is a viable pattern
- useful UX ideas for inline AI commands
- useful reference for editor integration

### Why Novel Should Not Be Arcanea’s Foundation

- Novel is editor-first, not project-graph-first
- it is not built around Arcanea’s object model
- it does not solve workspace graph, provenance, project continuity, or creator identity
- it is a great reference repo, not a complete Arcanea product architecture

### Recommendation For Novel

- absorb patterns
- borrow editor interaction ideas
- borrow AI menu UX ideas
- do not adopt its app architecture wholesale

## Morphic

Official Vercel template page describes Morphic as:
- an AI-powered answer engine with generative UI
- multiple model providers
- multiple search providers
- chat history in PostgreSQL
- Supabase Auth

Source checked:
- https://vercel.com/templates/ai/morphic-ai-answer-engine-generative-ui

### Why Morphic Is Attractive

- good search/research UI patterns
- useful multi-provider / BYOK ideas
- useful answer-engine patterns

### Why Morphic Is Not The Right Foundation

- Morphic is research/search-engine centered
- Arcanea is a creator workspace and project graph product
- Morphic solves answer-engine UX better than notes/docs/project-authoring UX
- Arcanea should borrow search/research ideas from Morphic, not become Morphic

### Recommendation For Morphic

- absorb research/search UX and provider patterns later
- do not adopt as the main app foundation

## Why Not Build The Editor From Scratch

Building a serious editor from scratch means taking on:
- schema design
- cursor/selection complexity
- IME/input edge cases
- copy/paste cleanup
- markdown/html/doc conversions
- slash commands
- nested blocks
- history and versioning concerns
- plugin architecture
- collaboration compatibility later

This is expensive and slow.

Arcanea should spend engineering effort on:
- project graph
- provenance
- retrieval
- memory
- creator workflows
- agent crews

Those are the differentiators.

The editor is important, but not where we should invent the lowest-level primitives.

## Why Tiptap Still Wins

Official docs say Tiptap provides:
- open-source headless editor
- 100+ extensions
- collaboration path
- comments
- AI toolkit
- server-side document tooling

Source checked:
- https://tiptap.dev/docs

Why this fits Arcanea:
- headless and customizable
- supports custom document schema
- can fit project graph and provenance model
- can add AI capabilities without surrendering architecture
- good path for future collaboration

## Why More Vercel Templates Are Still Useful

Vercel templates are useful as:
- implementation references
- UX pattern libraries
- isolated feature accelerators

They are not usually suitable as:
- the final product architecture
- the long-term domain model
- the canonical source of truth for a complex system like Arcanea

## Recommended Absorb / Copy Strategy

### Copy As Reference

- Novel for editor/AI UX patterns
- Morphic for answer-engine and research UI patterns
- Vercel AI templates for provider integration patterns

### Keep Custom

- project graph
- provenance model
- memory model
- creator identity
- notes/docs object model
- board object model
- social compounding layer

## Decision

### Notes / Docs

- use Tiptap as foundation
- do not build from scratch
- do not use Novel as the whole architecture

### Search / Research

- absorb Morphic-like ideas later
- do not make it the main app foundation

### Templates

- use Vercel templates as code references and accelerators
- do not let them define Arcanea’s product system

## Product Strategy Fit

Arcanea needs:
- graph-native docs
- project-native workflows
- BYOK-first routing
- provenance and creator continuity

That is why a custom Arcanea model on top of proven subsystems is stronger than adopting template architectures directly.
