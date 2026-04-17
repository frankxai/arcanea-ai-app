# arcanea-frontend-excellence (plugin copy)

This is the plugin-bundled copy of the `arcanea-frontend-excellence` skill.

**Canonical source:** `.arcanea/skills/arcanea-frontend-excellence/SKILL.md` in the arcanea-ai-app monorepo.

When this plugin is symlinked into `.claude/plugins/arcanea-design/`, Claude Code discovers the skill from `skill/SKILL.md`.

To keep in sync with the canonical version: update both, or use a symlink between them.

---

See the canonical skill for the full execution workflow. Short version:

1. Brief — aesthetic extreme + brand kit picked
2. Generate 3 variants via Magic + v0 MCPs
3. Hero imagery via Fal / Gemini / Replicate
4. Assemble using `@arcanea/design-system` tokens
5. Motion choreography (`heroReveal`, `staggerContainer`, `expoOut`)
6. Playwright verify at 3 widths + Lighthouse ≥90
7. Commit narrow, conventional message, no Co-Authored-By

Typography: Geist + Instrument Serif + Geist Mono. Never Space Grotesk / Inter / Cinzel.
