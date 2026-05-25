# Strategic Charter — Multi-Vendor Agent Harness Architecture

**Date:** 2026-05-06
**Lens:** Luminor Intelligence (future-informed strategy from 2125 perspective)
**Synthesizes:** skills-inventory + repo-architecture + plugin-overlap audits

---

## The 5-Layer Architecture (locked)

```
Layer 4 — Arcanea (the universe + product)
          ↑ uses
Layer 3 — oh-my-arcanea  (Ten Gates overlay, OpenCode-specific) — NOT a harness
          ↑ extends
Layer 2 — Per-vendor harness repos
          claude-arcanea | codex-arcanea | gemini-arcanea | opencode-arcanea
          (SEO sovereignty per vendor — like shadcn/ui owns React-component install SEO)
          ↑ pulls patterns from
Layer 1 — arcanea-flow (universal coding-agent harness)
          (replaces claude-flow integration; vendor-agnostic; Luminor-wired)
          ↑ sits on
Layer 0 — Starlight Intelligence System (SIS)
          (substrate: memory, context, voice-operator, SIP protocol)
```

**Why this stacks correctly:**
- Layer 0 (SIS) is the substrate — universal across all vendors. **Most active repo today.** Never replace.
- Layer 1 (arcanea-flow) is the *coding* harness — vendor-agnostic intelligence layer with our Luminor prompts and Guardian routing.
- Layer 2 (vendor repos) are the *distribution* layer — each one is a vendor-specific package + landing page that wraps Layer 1 in that vendor's plugin format.
- Layer 3 (oh-my-arcanea) is a **product**, not infrastructure. It's the Ten Gates Guardian overlay for OpenCode users — a specific experience, not the canonical harness.
- Layer 4 (Arcanea) is the consumer-facing universe + app.

---

## Architectural questions answered

### Q1 — Should oh-my-arcanea serve both Claude Code AND OpenCode?

**No.** Audit reality: it's the Ten Gates Guardian overlay specifically for OpenCode users (~7K files, last commit Apr 16). The "canonical harness" framing in older memory was aspirational and is now superseded. Keep oh-my-arcanea **OpenCode-specific** — it's a distinct product. Claude Code users get their experience through `claude-arcanea` (Layer 2) sitting on `arcanea-flow` (Layer 1).

### Q2 — Is arcanea-flow the right call for the universal coding harness?

**Yes — but with a critical warning.** arcanea-flow exists at `C:/Users/frank/arcanea-flow` with **1,530 uncommitted changes** and a stale main branch (last commit 2026-02-26). Before we wire it system-wide, you need a session to triage that delta — committing or discarding before promotion. Once cleaned up, this is the system bus. It replaces 15 claude-flow integration points in `Arcanea/.claude/settings.json`.

### Q3 — Are per-vendor `{vendor}-arcanea` SEO repos a good strategy?

**Yes. Strategic move.** This is the same playbook shadcn/ui used to dominate "React component install" SEO. Each vendor has a search corpus — "best skills for Claude Code", "best Gemini agents", "Codex skill marketplace" — and per-vendor repos are the only way to own that surface. Currently claude-arcanea, codex-arcanea, gemini-arcanea exist as scaffolds (15-21 files each) inside `Arcanea/arcanea-ecosystem/`. **Don't externalize until each scaffold reaches MVP** (~10-15 working skills + README + landing). Premature externalization fragments your maintenance burden.

### Q4 — Is SIS superseded by anything?

**No. SIS is Layer 0 substrate.** It has 92K files, last committed today, and nothing else in the architecture replaces what it does (persistent memory, voice-operator, context substrate, SIP protocol). Build everything else *on top of* SIS. The risk is divergence, not supersession — make sure arcanea-flow integrates SIS rather than re-implementing memory.

### Q5 — claude-flow → ruflow rename: do we adopt it?

**No.** ruvnet renamed his repo to `ruflow`. That's his path. **arcanea-flow IS our rename** — same conceptual replacement, but Arcanea-sovereign. The 15 claude-flow integration points need surgical removal:
- 9 lifecycle hooks
- 3 permission patterns
- 2 git metadata fields (including `Co-Authored-By: claude-flow <ruv@ruv.net>` — **violates user feedback memory `feedback_no_coauthor_contamination.md`**, must remove)
- Plus references in `github-code-review` + `github-multi-repo` skills

---

## Skills strategy — three buckets

| Bucket | Decision | Examples | Count |
|---|---|---|---|
| **Subscribe-marketplace** | Delete native dupes; trust marketplace updates | superpowers, frontend-design, vercel:*, supabase, claude-md-management, code-review, pr-review-toolkit, feature-dev, claude-api, simplify, update-config | 22 native dirs to delete |
| **Arcanize** | Fork to `.arcanea/skills/`, delete marketplace | `arcanea-frontend-excellence` (composes `frontend-design` with Atlantean teal/Geist tokens) | 1 |
| **Native-only / sovereign IP** | Never publish to marketplaces unless we want them in `{vendor}-arcanea` SEO repos | All `arcanea/*`, lumina, faction-system, character-forge, gates, ceremonies, world-forge, swarm-lumina | 28 |

**Plugins to disable** (4): `code-simplifier@official`, `context7@official`, `serena@official`, `explanatory-output-style@official`

**Hidden gems already enabled, under-invoked** (start using):
- `superpowers-lab:finding-duplicate-functions`
- `superpowers-lab:windows-vm`
- `pr-review-toolkit:silent-failure-hunter` (relevant to PR #93 5-day red main pattern)
- `feature-dev:code-architect`
- `claude-md-management:claude-md-improver`
- `vercel:vercel-agent`, `vercel:next-cache-components`, `vercel:turbopack`

---

## Phased Execution Roadmap

### Phase 1 — Safe Foundation Cleanup (today, 30 min, all reversible)

1. Remove duplicate `session-start.sh` from `Arcanea/.claude/settings.json` (project-level duplicates user-level)
2. Remove `Co-Authored-By: claude-flow <ruv@ruv.net>` attribution (memory mandate)
3. Delete 14 mandatory cull skills (oracle-* x11, frankx-* x3, agentdb-optimization)
4. Delete 22 native marketplace duplicates (per plugin-overlap audit drop-list)
5. Disable 4 redundant plugins in `enabledPlugins` block
6. Result: ~150 visible skills → ~95, no truncation, clean /doctor

### Phase 2 — claude-flow Surgery + arcanea-flow Promotion (this week, 2-3 hours)

1. Inspect arcanea-flow's 1,530 uncommitted changes — commit, discard, or branch
2. Strip 9 claude-flow lifecycle hooks from `Arcanea/.claude/settings.json` — replace with arcanea-flow equivalents OR remove entirely (depends on what arcanea-flow ships)
3. Strip 3 claude-flow permission patterns
4. Update PR template (drop `Generated with claude-flow` link)
5. Update `github-code-review.SKILL.md` + `github-multi-repo.SKILL.md` — drop `mcp__claude-flow__` references
6. Move `.claude-flow/` state dir to `.arcanea/legacy/` (or delete if not needed)
7. Document deprecation in `.arcanea/CLAUDE.md`

### Phase 3 — Skill Sovereignty (this week, 1 hour)

1. Arcanize 8 user-scope arcanea-* skills → `Arcanea/.arcanea/skills/arcanea/`
2. Document the canonical `.arcanea/skills/` structure in CLAUDE.md
3. Single-file commit: "feat(skills): consolidate Arcanea-native skills under project scope"

### Phase 4 — Vendor Marketplace Buildout (next 2 weeks)

1. Pick first vendor: **claude-arcanea** (Frank's primary tool)
2. Build scaffold to MVP: 10-15 working skills + README + landing page
3. Externalize repo (push to GitHub as `frankxai/claude-arcanea`)
4. Publish to Anthropic plugin marketplace (own the SEO)
5. Replicate template for codex-arcanea, gemini-arcanea, opencode-arcanea
6. Each repo's first launch = 1 SEO landing page article + 1 demo video

### Phase 5 — Operational Excellence (ongoing)

1. **Subscribe-only contract**: only Anthropic/Vercel/Supabase/obra plugins. No experimental marketplaces unless we vet maintenance.
2. **Sovereignty rule**: anything Arcanea-named goes to `.arcanea/skills/` (project), never user-scope. User-scope is for cross-project tooling only.
3. **Quarterly skill audit**: re-run this audit framework every 3 months; cull stale; promote new IP.
4. **Per-vendor health dashboard**: each `{vendor}-arcanea` repo gets a status page (last update, skill count, install count).

---

## Risk callouts

1. **arcanea-flow's 1,530 uncommitted delta** — could be golden WIP or stale junk. Inspect before promotion.
2. **Vendor scaffolds barebones** (~20 files each) — below MVP. Need template/codegen plan or building-by-hand will eat weeks.
3. **`repos.json` registry mismatch** — currently lists vendor harnesses as external, but they're subdirectories. Update or externalize.
4. **SIS not wired to arcanea-flow** — risk of substrate divergence. Make integration explicit in Phase 2.
5. **Memory drift** — `project_harness_consolidation.md` says "oh-my-arcanea is canonical" but audit shows that's outdated. Update the memory after Phase 1 commits.

---

## Sovereignty Doctrine

> *Arcanea is sovereign. Arcanea is the product, the universe, and the brand. Plugins are subscriptions when platform-grade vendors maintain them. Plugins become Arcanea-native ONLY when we customize, embed Luminor logic, or wire them to the universe. Nothing in our codebase carries another tool's authorship attribution.*

This doctrine ends the claude-flow contamination question permanently.

---

## What I need from you NOW

**Phase 1 confirmation** (30 min, all reversible, low risk):
- [ ] Remove duplicate session-start.sh hook
- [ ] Remove Co-Authored-By: claude-flow attribution
- [ ] Delete 14 mandatory cull skills
- [ ] Delete 22 native marketplace duplicates
- [ ] Disable 4 redundant plugins

If you say "go phase 1" I execute the whole batch in one message and we move to Phase 2 next session after you've inspected arcanea-flow's 1,530 uncommitted changes.
