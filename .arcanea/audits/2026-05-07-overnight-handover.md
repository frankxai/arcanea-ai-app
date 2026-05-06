# 🌅 Morning Handover — 2026-05-07

**Frank, good morning.** Here's everything you need in 5 minutes.

---

## ✅ What's done (autonomous, last night)

### Phase 1 ecosystem cleanup — COMPLETE
1. ✅ **PR #94 opened** — `chore(claude): rip claude-flow integration — restore Arcanea sovereignty`
   - URL: https://github.com/frankxai/arcanea-ai-app/pull/94
   - Removed 9 claude-flow lifecycle hooks, 3 permission patterns, 40-line claudeFlow config, and `Co-Authored-By: claude-flow <ruv@ruv.net>` attribution from `Arcanea/.claude/settings.json`
   - File went 6.7KB → 1.1KB (162 lines → 39)
   - Kept: 3 SIS lifecycle hooks (SessionStart, PreCompact, Stop) + Arcanea statusline
   - Status: passes ESLint, Security, Install. Inherits red main from PR #93 (TypeScript+Vercel show as red but root cause is main)

2. ✅ **User-level skill cleanup**
   - Backup: `~/.claude/backups/2026-05-07/skills-pre-cleanup.tar.gz` (3.5MB)
   - Deleted 14 mandatory cull (oracle-* x11, frankx-* x3) + 23 marketplace duplicates = **37 dirs removed**
   - 4 plugins disabled in `~/.claude/settings.json`: `context7`, `code-simplifier`, `serena`, `explanatory-output-style`
   - 21 plugins enabled, 4 disabled. Skill listing pressure drops dramatically.

3. ✅ **Hook duplicate fixed** — `session-start.sh` was firing twice per session. Now fires once.

### Audits + strategy docs (8 files in `.arcanea/audits/`)
- `2026-05-06-skills-inventory.md`
- `2026-05-06-repo-architecture.md`
- `2026-05-06-plugin-overlap.md`
- `2026-05-06-strategic-charter.md` (v1)
- `2026-05-07-strategic-charter-v2.md` ← **read this — supersedes v1, ground-truth verified**
- `2026-05-07-engineering-excellence.md` ← **end-to-end audit + top 10 priorities**
- `2026-05-07-90-day-roadmap.md` ← **week-by-week to 2026-08-05**
- `2026-05-07-overnight-handover.md` ← this file

---

## 🚨 What needs your attention (ranked)

### 🔴 P0 — Today
1. **Merge PR #93** (sitemap fix) — unblocks 5-day red main. Single-line diff.
2. **Then merge PR #94** (ecosystem cleanup, mine) — will go green once #93 lands.
3. **Decide brand-color WIP fate** — 27 modified files on `fix/ci-sitemap-locale-route-2026-05-06` (NOT included in PR #93). It's GOOD work: `aquamarine #7fffd4 → atlantean teal #00bcd4`, `Space Grotesk/Inter → Geist`, hardcoded hex → CSS vars. Aligned with CLAUDE.md design protocol. Options:
   - Continue + commit on dedicated branch `refactor/brand-color-tokens`
   - Commit-as-is on a clean branch
   - Discard if no longer wanted

### 🟡 P1 — This week
4. **Update arcanea-flow upstream remote** — currently points at OLD `ruvnet/claude-flow.git`. Should be `ruvnet/ruflo.git`. Then fetch + rebase.
5. **Update oh-my-arcanea upstream remote** — currently `code-yeongyu/oh-my-opencode.git`. Should be `code-yeongyu/oh-my-openagent.git` (renamed, now multi-vendor).
6. **Memory updates** — flag stale entries:
   - `project_harness_consolidation.md` — superseded by Charter v2
   - `project_arcanea_flow_plan.md` — refine: arcanea-flow IS the wrapper now, not "wrap claude-flow"
   - Add: `feedback_ruflo_naming` — it's Ruflo (no 'w'), at github.com/ruvnet/ruflo

### 🟢 P2 — Next 2 weeks
7. Build `claude-arcanea` scaffold to MVP (Phase 4 of Charter)
8. Lighthouse-CI gates + lockfile-drift CI check
9. SEO/AEO audit of top-20 pages
10. MEMORY.md trim to <150 lines

---

## 📊 Refined architecture (Charter v2 — verified)

```
L4  Arcanea (universe + product) — arcanea.ai live, polished, MIT
    ↑
L3  oh-my-arcanea — multi-vendor coding-tool overlay (was: OpenCode-only)
    ↑                Built on oh-my-openagent (renamed from oh-my-opencode)
L2  {vendor}-arcanea SEO repos (claude/codex/gemini/opencode) — scaffolds
    ↑
L1  arcanea-flow — multi-agent orchestration runtime
    ↑                Fork of ruvnet/claude-flow (now Ruflo). Stale 10wk + 1530 WIP.
L0  Starlight Intelligence System (SIS) — substrate
                     v7.6.0, last commit TODAY, Frank DNA codified
```

### Q&A you asked

| You asked | Verified answer |
|---|---|
| Is ruflow the new name? | **Ruflo** (no 'w'). github.com/ruvnet/ruflo. v3.6.30 May 2026. |
| oh-my-arcanea vs arcanea-flow purpose? | Different layers. **oh-my-arcanea** = coding-tool UX overlay (Guardian detection, statusline, context). **arcanea-flow** = orchestration runtime (multi-agent, model routing, swarm). |
| oh-my-arcanea a product not harness? | I was wrong in v1. It IS a harness — multi-vendor via upstream rename to oh-my-openagent. |
| oh-my-openagent a harness? | Yes — vendor-agnostic harness. Claude/GPT/Kimi/GLM all supported. v3.17.15, 56k stars. |
| SIS Layer 0 substrate? | **Confirmed and elevated**. Two layers: SIP (substrate protocol) + reference operational build. v7.6.0 npm. Sovereignty principle, attestation. Most active repo. |

---

## ⚠️ Live system state

### CI / main branch
- **Main is RED** since 2026-05-05 (sitemap-[locale].xml route + dup /sitemap.xml issue)
- PR #93 fixes it. Merge first.

### Open PRs (8 today)
- **#93** — fix(ci) sitemap unblock (the unblocker)
- **#94** — chore(claude) ecosystem cleanup (mine, depends on #93)
- **#92** — docs(ops) post-overnight audit artifacts
- **#91** — chore(deps) production-patches (13 updates) — review carefully per `feedback_dependabot_guardrails`
- **#88** — feat(voice+cockpit) Jarvis tool calling
- **#84** — chore(deps-dev) dev-patches (8 updates)

### Vercel deploys
- Recent main runs: 3 failures on 2026-05-05, 1 success on 2026-05-06 (Claude config snapshot — not a real deploy)
- arcanea.ai live homepage looks polished (verified via WebFetch)

### Working tree (your fix branch)
- 27 files modified (brand-color WIP)
- 5 untracked: GEMINI.md, _archive/, packages/arcanea-cli/src/, .arcanea/audits/, planning-with-files/OVERNIGHT_*

---

## 💡 Three insights that will save you time

1. **Plugin marketplace renamed once already** (`@anthropics` → `@claude-plugins-official`). It can rename again. Don't fork what platform-grade vendors maintain — subscribe via marketplace.

2. **Your forks have stale upstream remotes** (arcanea-flow → claude-flow OLD; oh-my-arcanea → oh-my-opencode OLD). Both upstreams renamed. 30 seconds to fix per repo, prevents future fetch confusion.

3. **SIS just shipped JSON-LD + AEO work TODAY** (commit 2b6266b). Your substrate is doing search-engine work the main app should benefit from. Cross-pollinate the patterns.

---

## 📁 Where everything lives

```
Arcanea/
├── .arcanea/
│   ├── audits/                    ← 8 audit docs from this session (not yet committed)
│   ├── CLAUDE.md                  ← shared intelligence hub doc
│   └── MASTER_PLAN.md             ← STALE 5 weeks, refresh
├── .claude/
│   └── settings.json              ← cleaned (claude-flow ripped) — committed on chore branch
├── planning-with-files/
│   ├── OVERNIGHT_2026-05-06_TASK_PLAN.md
│   ├── OVERNIGHT_2026-05-06_FINDINGS.md
│   └── OVERNIGHT_2026-05-06_PROGRESS.md  ← updated with continuation log

~/.claude/
├── settings.json                  ← 4 plugins disabled, claude-mem entry already gone
├── skills/                         ← 37 dirs deleted (verified backup at backups/2026-05-07/)
└── backups/2026-05-07/             ← restore tarball if needed

C:/Users/frank/
├── arcanea-flow/                   ← needs upstream remote update + rebase
├── oh-my-arcanea/                  ← needs upstream remote update
├── Starlight-Intelligence-System/  ← active, healthy, today's commit
├── arcanea-onchain/                ← architecture phase
└── arcanea-opencode/               ← legacy, archive after oh-my-arcanea catches up
```

---

## 🎯 Recommended first move (when you wake)

```bash
cd ~/Arcanea
gh pr merge 93 --squash --delete-branch    # unblock main
gh pr merge 94 --squash --delete-branch    # land cleanup (will be green after #93)
```

Then read `.arcanea/audits/2026-05-07-engineering-excellence.md` for the top-10 priority list.

---

## 🛡️ Discipline followed (as instructed)

- ✓ Read-only audits autonomous
- ✓ Non-destructive commits only (PR #94 = single-file change, fully reversible)
- ✓ NO main pushes, NO force-push, NO `--no-verify`
- ✓ Specific files staged, never `git add .`
- ✓ Audited WIP before any cleanup (memory: feedback_audit_before_stash)
- ✓ Backups before deletes (memory: feedback_mass_revert_protection)
- ✓ Worked on isolated branch off main (preserved fix branch + WIP)

Sleep well. Wake to a cleaner system. ☕
