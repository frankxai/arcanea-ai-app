# Strategic Charter v2 — Refined Architecture (2026-05-07)

**Supersedes:** `2026-05-06-strategic-charter.md`
**Why v2:** Verified ground truth via direct repo reads + GitHub fetches changed several assumptions.

---

## What changed from v1

| Question | v1 answer | v2 answer (verified) |
|---|---|---|
| ruflow rename | "ruvnet renamed to ruflow" | **"Ruflo"** (no 'w') at github.com/ruvnet/ruflo. Confirmed: "Claude Flow is now Ruflo — named by rUv". v3.6.30, May 2026, 45.2k stars |
| oh-my-arcanea | "OpenCode-specific overlay" | **Multi-vendor harness via oh-my-openagent** (upstream renamed from oh-my-opencode and is now multi-vendor — Claude, GPT, Kimi, GLM all supported) |
| arcanea-flow upstream | "fork of claude-flow" | **Fork of claude-flow, but `git remote upstream` still points at OLD URL** (`ruvnet/claude-flow.git`) — needs update to `ruvnet/ruflo.git` |
| oh-my-arcanea upstream | "fork of oh-my-opencode" | **Fork of oh-my-opencode, but upstream renamed to oh-my-openagent** — remote URL stale |

---

## The 5-layer architecture (verified, locked)

```
L4  Arcanea (the universe + product)
    arcanea.ai live, polished, MIT-licensed positioning
    Brand: 16 specialist AI partners + Living Worlds engine + mascots Lyria/Shinkami
          ↑ uses
L3  oh-my-arcanea  (multi-vendor coding-tool overlay)
    Built on oh-my-openagent (vendor-agnostic, formerly oh-my-opencode)
    Adds Guardian detection + statusline + Luminor swarm types
    Last commit: 2026-04-16 dev branch, dirty WIP in doctor/checks
          ↑ extends
L2  {vendor}-arcanea  (per-vendor distribution + SEO)
    claude-arcanea, codex-arcanea, gemini-arcanea, opencode-arcanea
    Currently scaffolds in arcanea-ecosystem/, ASPIRATIONAL
          ↑ pulls patterns from
L1  arcanea-flow  (multi-agent orchestration runtime)
    Fork of claude-flow → ruvnet/ruflo (UPSTREAM REMOTE STALE — points to old URL)
    Last commit 2026-02-26 main, 1530 uncommitted local changes (agents restructure)
    Stale ~10 weeks vs. upstream Ruflo v3.6.30
          ↑ sits on
L0  Starlight Intelligence System (SIS)
    Two-layer: SIP protocol + reference operational build
    v7.6.0 npm package, last commit 2026-05-07 (TODAY)
    Frank DNA codified, sovereignty principle, attestation system
    MOST ACTIVE substrate. Build on top, never replace.
```

---

## Direct answers (refined)

### Q1 — Should oh-my-arcanea serve both Claude Code AND OpenCode?

**Yes — already does, by virtue of upstream evolution.** When `oh-my-opencode` renamed to `oh-my-openagent` it became multi-vendor (Claude, GPT, Kimi, GLM, etc.). oh-my-arcanea inherits that. The CLAUDE.md in our fork still says "OpenCode" — outdated. **Action**: pull upstream, update fork's CLAUDE.md to reflect multi-vendor reality.

### Q2 — arcanea-flow as universal harness?

**Yes, but it needs serious care:**
1. Upstream remote points at old URL (`ruvnet/claude-flow`). Update to `ruvnet/ruflo`.
2. Last commit Feb 26 — 10 weeks behind upstream's v3.6.30 release. Upstream has shipped 1,480 releases.
3. Has 1,530 uncommitted local changes — likely the agents directory restructure (deletions visible: `v3/@claude-flow/agents/architect.yaml` etc).
4. **Decision needed**: rebase Arcanea customizations on top of latest Ruflo, or stay as a snapshot fork. Rebase is the correct answer — fork drift makes upstream pulls harder over time.

### Q3 — {vendor}-arcanea SEO repos strategy?

**Strategy is sound** (shadcn/ui logic for "best skills for [vendor]" SEO). Currently scaffolds (~20 files each) inside `Arcanea/arcanea-ecosystem/`. **Externalize when each scaffold reaches 10-15 working skills + landing page**. Premature externalization fragments maintenance.

### Q4 — Is SIS Layer 0 substrate?

**Confirmed and elevated.** SIS is more developed than v1 charter recognized:
- Two-layer architecture: SIP protocol (substrate) + reference operational build
- `@arcanea/starlight-intelligence-system` v7.6.0 on npm
- Codifies "Frank DNA" (Systems Architect × Composer × Gamer × Builder × GenCreator)
- Sovereignty principle, attestation protocol, command taxonomy (protocol/alliance/vertical/sovereign tiers)
- 6 semantic vaults, 16 skills, MCP server, multi-platform adapters
- Last commit TODAY

This is FAR more than just memory. It's the constitutional layer. Other repos must integrate SIS — never duplicate its functionality.

### Q5 — claude-flow → ruflo absorption?

**Path forward**:
1. Update `arcanea-flow/.git/config` upstream remote to `ruvnet/ruflo.git`
2. `git fetch upstream` to pull 10 weeks of evolution
3. Triage 1,530 local changes — keep what's Arcanea-native, drop what's been upstreamed
4. Rebase Arcanea customizations on Ruflo v3.6.30
5. Then promote to system bus by wiring into per-vendor harness repos (Layer 2)

The 15 claude-flow integration points in `Arcanea/.claude/settings.json` are **already removed** (PR #94 merged into chore branch, awaiting main green to merge — main still red from sitemap PR #93).

---

## Repo health summary (verified 2026-05-07)

| Repo | Branch | Last commit | Status | Action |
|---|---|---|---|---|
| Arcanea (main monorepo) | fix/ci-sitemap-locale-route | 79e23378 (CI fix) | 27 WIP files (brand-color refactor) | PR #93 → merge to unblock main, preserve WIP |
| arcanea-flow | main | 2026-02-26 | 1530 uncommitted, upstream remote STALE | Update remote to ruflo, fetch, rebase |
| oh-my-arcanea | dev | 2026-04-16 | Dirty WIP in doctor/checks | Update upstream URL to oh-my-openagent, sync |
| Starlight-Intelligence-System | main | 2026-05-07 (TODAY) | Active, just shipped AEO/JSON-LD work | Continue — Layer 0 is healthy |
| arcanea-onchain | — | 2026-02-26 | Architecture phase | Defer — separate vertical |
| arcanea-opencode | — | 2026-04-02 | Legacy compat tracker | Archive after oh-my-arcanea catches up |
| Vendor scaffolds (claude/codex/gemini/opencode-arcanea) | — | — | 15-21 files each | Build to MVP, then externalize |

---

## What's broken right now (2026-05-07 ground truth)

1. **main is RED** — has been since 2026-05-05. PR #93 unblocks it (sitemap-[locale].xml route fix). Merge required.
2. **PR #94 (my ecosystem cleanup)** is open but inherits main's red. Will go green once PR #93 lands.
3. **arcanea-flow upstream remote is wrong** — points to URL that may redirect or 404 in future.
4. **oh-my-arcanea upstream remote is wrong** — same issue, oh-my-opencode renamed.
5. **27 files modified WIP on fix branch** — brand-color refactor abandoned. Needs commit OR continuation.

---

## Three-bucket skill strategy (unchanged from v1, validated)

- **Subscribe-marketplace**: 22 native dirs deleted ✓ (Phase 1 done)
- **Arcanize**: 1 skill (`arcanea-frontend-excellence`) — kept
- **Native-only**: All `arcanea/*`, lumina, faction-system, etc. — sovereign IP

---

## Sovereignty Doctrine (locked)

> *Arcanea is sovereign. Plugins are subscriptions when platform-grade vendors maintain them. Plugins become Arcanea-native ONLY when we customize. Nothing in our codebase carries another tool's authorship attribution.*

**Co-Authored-By: claude-flow** removal (Phase 1) was the manifest of this doctrine.
