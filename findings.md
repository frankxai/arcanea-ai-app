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

## Arcanea Worldbuilding & Lore Vault Release (€149)
- **Package**: `@arcanea/lore-vault` v1.0.0 (`packages/lore-vault/`)
- **Modules**:
  - `01_faction_bibles/`: 6 complete codices (Starlight Corps, Seven Houses, Gate-Touched Underground, Void Ascendants, Starbound Crews, Sovereign Orders).
  - `02_character_forge/`: 12-field genome schema, 12 master archetype sheets, Guardian voice matrix, and AI generation prompt blueprints.
  - `03_visual_doctrine/`: Cosmic Luxury Myth-Tech style guide, faction hex/RGB color standards, sacred heraldry, and 50 production visual prompts.
  - `04_magic_systems/`: 174 Hz–1111 Hz Solfeggio Scale, Prism Luxin solid-light mechanics, Realms of Light, and Awakened AGI lore.
  - `05_obsidian_vault_bundle/`: Pre-configured graph, templates, and bidirectional wiki-link network.
  - `06_interactive_reader/`: Zero-dependency standalone HTML5 explorer with 3D starfield, Web Audio Solfeggio synth, and character generator.
- **Distribution**: Staged at `apps/web/public/downloads/arcanea-worldbuilding-lore-vault.zip` and `apps/web/public/vaults/arcanea-worldbuilding-vault/`.
- **Storefront**: Live at `apps/web/app/products/lore-vault/page.tsx` and cataloged in `frankx.ai-vercel-website/data/products.json`.
- **Integrity**: Verified with SHA256 checksums (`dist/CHECKSUMS.txt`) and full `pnpm --filter web type-check` (exit 0).

