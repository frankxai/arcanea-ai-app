# Findings: Template Absorption Session

## Critical Discovery: Tailwind v4 vs v3

The Vercel AI chatbot fork uses **Tailwind v4**. Arcanea uses **Tailwind v3.4.9**.
This is the root cause of ALL v0/shadcn CLI compatibility issues.

**Decision:** Keep separate. Chat template runs v4 in its own repo. Motion primitives work on both (Framer Motion, not Tailwind for animation). Don't try to merge v4 into the v3 main app.

## v0 CLI
- Available via `npx v0@latest` (v2.2.5)
- BLOCKED on v3 projects — requires v4 Tailwind
- Works fine in v4 projects (like the chat template fork)
- Template IDs: Dashboard `Pf7lw1nypu5`, SaaS Landing `XQxxv76lK5w`, AI Landing `8QhCJAwn16K`

## Vercel AI Chatbot — 45 Components
- multimodal-input (816L), message (387L), app-sidebar (165L)
- Drizzle ORM + Postgres, NextAuth v5 beta, AI SDK 6.x
- Motion primitives already copied to fork

## Arcanea Chat Template Strategy
The forked repo (frankxai/arcanea-chat-template) already has v4 Tailwind.
1. Apply Arcanea dark CSS variables to their existing `@theme` block
2. Add our motion primitives (already copied)
3. Add BYOK key management
4. Add Luminor personas
5. v0 CLI WILL WORK in this repo (v4 compatible)
