# Handover — Design Foundation Day (2026-04-18)

Written for the next session (Frank returns evening with API keys, OR another agent picks up).

## What shipped today

Two PRs merged to main:

### PR #39 — v0.2.0 (runtime elevation)
- `@arcanea/design-system` package v0.2.0 (tokens, brand-kits, motion, tokens.css)
- `apps/web` runtime: Space Grotesk + Inter → Geist + Instrument Serif
- AGENTS.md Design System section, .claude/CLAUDE.md + apps/web/CLAUDE.md aligned
- Spec, Cowork template, rollout plan
- `packages/claude-plugin-design/` scaffold (skill + mcp example + basic agents stub)
- Linear project + 9 tracking issues (ARC-176..184)

### PR #42 — v0.3.0 (primitives + design team + Lighthouse CI)
- 5 Magic UI primitives ported by hand into `@arcanea/design-system/primitives`:
  - AnimatedBeam, NumberTicker, Marquee, BorderBeam, Spotlight
- 5 subagents with proper YAML frontmatter in `packages/claude-plugin-design/agents/`:
  - design-architect, design-generator, design-motion, design-imagery, design-verifier
- 4 slash commands in `packages/claude-plugin-design/commands/`:
  - /design-brief, /design-ship, /design-review, /design-verify
- `.arcanea/skills/design/INDEX.md` — canonical vs deprecated routing
- `planning-with-files/AGENT_EXECUTION_PROTOCOL_2026-04-18_DESIGN.md` — orchestration rules
- `.github/workflows/lighthouse.yml` — CI perf gate (≥90 perf, ≥95 a11y/bp/seo)
- Updated `packages/claude-plugin-design/install.md` with symlink instructions

## Linear state

Project: [Design System 2026](https://linear.app/arcanea/project/design-system-2026-073a9aee539c)

| Issue | Status | Notes |
|---|---|---|
| ARC-176 | Done | Merges (both PRs) |
| ARC-177 | Backlog | Homepage hero — UNBLOCKED by today's work, needs API keys |
| ARC-178 | Done | Primitives (ported 5 of planned 1 — ahead of plan) |
| ARC-179 | Backlog | Phase 3: revamp 3 more pages |
| ARC-180 | Backlog | 1 primitive left + Motion v12 migration |
| ARC-181 | Backlog | Phase 4: FrankX adopts |
| ARC-182 | Backlog | Phase 5: Claude plugin publish (scaffold shipped today) |
| ARC-183 | Backlog | Phase 5: OSS mirror |
| ARC-184 | Backlog | Phase 5: shadcn registry |
| ARC-185 | Done | Design team orchestration (today's work) |

## To verify

Production deploy should have the Geist + primitives live within 5 min of PR #42 merge.

- [ ] Open www.arcanea.ai
- [ ] View page source — confirm Geist font files loaded (should see `/_next/static/media/geist-*` references, NOT `space_grotesk`)
- [ ] Check existing pages render without regression
- [ ] Run `pnpm --filter @arcanea/design-system build` locally — should exit 0

If production shows `space_grotesk` still, Vercel may have hit a build failure. Check GitHub Actions for main branch.

## Next session (tonight when API keys arrive)

Frank will drop these via `setx`:
```
! setx V0_API_KEY "..."
! setx FAL_KEY "..."
! setx GEMINI_API_KEY "..."
! setx REPLICATE_API_TOKEN "..."
```

Then fully quit and relaunch Claude Code. **Rotate the 21st.dev key** that was pasted in prior transcript.

After restart, invoke the homepage hero revamp:
```
/design-ship apps/web/app/page.tsx — homepage hero, editorial-cinematic aesthetic, AnimatedBeam connecting Lumina → creator, NumberTicker for stats strip
```

This triggers the full pipeline:
1. design-architect produces brief (user approves)
2. design-generator runs 3 Magic + 1 v0 variant (user picks)
3. design-motion choreographs the reveal
4. design-imagery generates hero visual via Fal FLUX Pro
5. design-verifier screenshots at 3 widths + Lighthouse

Target: 4 hours spec-to-shipped.

## Things NOT done today (deliberate)

- No actual page revamped yet (needs API keys)
- Storybook scaffold (time-boxed)
- axe-core in Playwright verifier (future)
- Chromatic visual regression (future)
- Figma token sync (future)
- OSS repo mirror (Phase 5)
- Style Dictionary multi-platform tokens (future)

## Branch chaos note

Today we saw 5+ branch-flips by parallel agents. Mitigation:
- All design work went through `EnterWorktree` → dedicated `design-evolution` worktree
- Feature branches (`worktree-design-evolution`, `feat/design-excellence`) kept my work isolated
- Never lost a commit to orphaning after I adopted the worktree pattern

Document this in the agent execution protocol (already done).

## One honest gap

The design system is now foundationally world-class, but **zero production pages have been revamped with the MCP stack yet**. Everything is scaffolding. The value-delivery milestone is ARC-177 (homepage hero). Without it, v0.3.0 is potential energy.

Frank: tonight is the unlock. API keys + `/design-ship apps/web/app/page.tsx` = the first real proof.

## Files to know

| Path | Purpose |
|---|---|
| `packages/design-system/` | Tokens, brand-kits, motion, primitives — THE package |
| `packages/claude-plugin-design/` | Distributable Claude Code plugin (agents + commands + skill + MCP recipe) |
| `packages/arcanea-design-preset.js` | Tailwind preset — Geist fontFamily + all keyframes |
| `apps/web/app/layout.tsx` | Geist runtime load via `geist/font/sans` |
| `apps/web/app/globals.css` | CSS var aliases for className compat |
| `.arcanea/skills/design/INDEX.md` | Skill routing |
| `planning-with-files/AGENT_EXECUTION_PROTOCOL_2026-04-18_DESIGN.md` | Execution rules |
| `docs/superpowers/specs/2026-04-17-agentic-design-system-design.md` | Canonical spec |
| `docs/superpowers/specs/claude-cowork-handoff-template.md` | Cowork handoff template |
| `.github/workflows/lighthouse.yml` | Perf CI gate |

## Owner for handover

Frank (product, brand, aesthetics direction) · Claude Code (implementation, orchestration) · ? (QA when humans review).

Next session: start with `/design-brief homepage hero editorial cinematic` after keys arrive. Or `/design-review www.arcanea.ai` to audit current state.
