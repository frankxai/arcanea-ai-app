# P2 — Fleet Registry (sibling repos)

**Scope:** 38 repos at `C:/Users/frank/*` with own `.git`, **excluding** the 6 already covered in `.arcanea/audits/2026-05-06-repo-architecture.md` (Arcanea, oh-my-arcanea, arcanea-flow, Starlight-Intelligence-System, arcanea-onchain, arcanea-opencode).

**Method:** Disk-walked each repo, captured remote/last-commit/branch/framework/Vercel-link/file-count. JSON snapshot in `tmp/fleet-scan.json`.

## Tier classification

### Tier 1 — Live production websites (commit ≤ 7d, Vercel-linked OR clearly shipping)
| Name | Remote | Last commit | Files | Notes |
|---|---|---|---|---|
| `FrankX` | frankxai/FrankX | 2026-05-05 | 319,009 | Massive — Frank's personal hub, library OS lives here. Vercel-linked. **Tier-1 product.** |
| `gencreator.ai` | frankxai/gencreator.ai | 2026-05-05 | 51,308 | Vercel-linked. **Tier-1 product.** |
| `AnimeLegends.ai` | frankxai/AnimeLegends | 2026-05-06 | 45,133 | Vercel-linked + Speed Insights wired. **Tier-1 product.** |
| `vibeclubs.ai` | frankxai/vibeclubs | 2026-05-05 | 44,996 | Next-MDX security bump just landed. **Tier-1 product.** |

### Tier 2 — Active foundation/vertical (commit ≤ 14d)
| Name | Remote | Last commit | Files | Purpose |
|---|---|---|---|---|
| `frankx.ai-vercel-website` | frankxai/frankx.ai-vercel-website | 2026-05-04 | 92,794 | The "trunk" repo — many `frankx-*` worktrees clone from this |
| `frankx-prod-sync` | frankx.ai-vercel-website (clone) | 2026-05-04 | 21,587 | Clone — piano feature work |
| `agentic-creator-os` | frankxai/agentic-creator-os | 2026-05-03 | 6,346 | ACOS plugin spec, recently externalized |
| `dpi` | frankxai/dpi | 2026-05-01 | 15,917 | Independent product (v0.3.0 just shipped) |
| `jarvis-2-brain` | Starlight-Intelligence-System (clone) | 2026-04-29 | 626 | Cockpit branch worktree — Phase 4 brain viz |
| `frankx-ship-gai` | frankx.ai-vercel-website (clone) | 2026-04-28 | 3,597 | Sitemap routing fix worktree |
| `jarvis-3-cognition` | Starlight-Intelligence-System (clone) | 2026-04-28 | 623 | Cognition CLI branch worktree |
| `jarvis-1-browser` | Starlight-Intelligence-System (clone) | 2026-04-28 | 623 | Browser bridge branch worktree |

### Tier 3 — Recently dormant (14d - 60d)
| Name | Remote | Last commit | Notes |
|---|---|---|---|
| `frankx-prod-libos3`, `frankx-fix-ci`, `frankx-prod-deploy`, `ship-hoffnung` | frankx.ai-vercel-website clones | 2026-04-25 ± | Worktree clones for specific shipping pushes |
| `library-os` | frankxai/library-os | 2026-04-25 | v2 share toolbar branch — semi-active |
| `AnimeLegends-Skills` | frankxai/AnimeLegends-Skills | 2026-04-22 | Marketplace scaffold |
| `cosmic-landing-template`, `arcanea-chat-template`, `arcanea-dashboard-template`, `arcanea-mcp-starter`, `arcanea-templates` | frankxai/* | 2026-04-15 | Template repos — last touched in batched CI workflow add |
| `arcanea-nft-forge` | frankxai/arcanea-nft-forge | 2026-04-03 | Product-market analysis doc only |
| `starlight-horizon-dataset` | frankxai/starlight-horizon-dataset | 2026-04-02 | 3 horizon entries, mostly dormant |

### Tier 4 — Stale / third-party / orphaned
| Name | Status | Reason |
|---|---|---|
| `arcanea-vault` | Chrome ext, last commit 2026-02-26 | Vite, codex baseline branch — stalled |
| `arcanea-realm` | 2026-02-24, points to `arcanea-code.git` remote (mismatch) | Vite — naming/remote mismatch is a smell |
| `arcanea-platform` | 2026-01-31 | Premium README only — never built? |
| `claude-code`, `claude-code-config`, `cline`, `ai-chatbot-study`, `otaku` | 3rd-party clones | Anthropic/cline/Vercel/elizaOS upstream, not Frank's IP |
| `studio-frankx` | 2025-03-20, no remote | Sanity studio bootstrap, abandoned |
| `Business`, `arcanea-tab2`, `arcanea.ai`, `starlight-agent-lab` | No remote, ≤ initial commit | Locally initialized but never used; consider deleting `.git` to recover space |

## Critical insights

1. **Worktree confusion is real.** 7 `frankx-*` and 3 `jarvis-*` directories are clones of 2 source repos (frankx.ai-vercel-website, Starlight-Intelligence-System). They consume ~150K files of duplicate disk. Recommendation: convert to actual `git worktree` setups against single canonical clones, or delete inactive worktrees.

2. **`arcanea-realm` remote mismatch.** Directory says `arcanea-realm` but remote is `arcanea-code.git`. Either the directory was renamed locally without updating remote, or the remote was repurposed. Risk: pushes go to wrong repo.

3. **4 repos have no remote at all.** `Business`, `arcanea-tab2`, `arcanea.ai`, `starlight-agent-lab`. If any have value, push to GitHub. If not, archive locally.

4. **`arcanea.ai` directory at home root is barely-initialized** (10 files, init commit). Yet `arcanea.ai` is the production domain. The actual production code is in `Arcanea/apps/web/` (deployed to `arcanea-ai-appx` Vercel project per memory). The home-root `arcanea.ai` folder is misleading and should be either deleted or repurposed.

5. **Templates are stale (2026-04-15).** 5 template repos (chat, dashboard, mcp-starter, landing, templates index) all last touched on the same day adding GitHub Actions builds. They haven't been used since. Consider: are these the foundation of the marketplace strategy, or abandoned scaffolds?

6. **`FrankX` is the real giant.** 319K files. This is the personal-brand hub, library OS, Sovereign AI work. It's a Tier-1 product and deserves the same CI/CWV/SEO discipline as Arcanea.

## Cross-fleet observations

| Pattern | Count | Notes |
|---|---|---|
| Vercel-linked | 4 | AnimeLegends.ai, gencreator.ai, FrankX, ai-chatbot-study (3rd party) |
| Has GitHub remote | 33 | Most |
| No remote (local only) | 4 | Above |
| Next.js stack | 19 | The dominant framework |
| Vite stack | 2 | arcanea-vault, arcanea-realm |
| 3rd-party clones | 5 | claude-code, claude-code-config, cline, ai-chatbot-study, otaku |
| Empty/init-only | 3 | Business, arcanea-tab2, arcanea.ai |

## Recommended fleet structure

```
~/repos/
├── arcanea/                          # main product family (8 repos)
│   ├── Arcanea (main)
│   ├── arcanea-onchain
│   ├── arcanea-flow
│   ├── arcanea-opencode
│   ├── oh-my-arcanea
│   └── arcanea-{vault,realm,nft-forge}  (status uncertain — review)
│
├── frankx/                           # personal-brand family (3 canonical + worktrees)
│   ├── FrankX                                       # main hub
│   ├── frankx.ai-vercel-website                     # legacy/parallel — decide consolidation
│   ├── library-os
│   └── _worktrees/                                  # frankx-prod-*, ship-hoffnung, etc. as REAL git worktrees
│
├── starlight/                        # intelligence substrate (1 + worktrees)
│   ├── Starlight-Intelligence-System
│   └── _worktrees/jarvis-*           # browser, brain, cognition as worktrees
│
├── products/                         # standalone products (3)
│   ├── gencreator.ai
│   ├── AnimeLegends.ai
│   ├── vibeclubs.ai
│   └── dpi
│
├── templates/                        # template scaffolds (5)
│   ├── arcanea-chat-template
│   ├── arcanea-dashboard-template
│   ├── arcanea-mcp-starter
│   ├── cosmic-landing-template
│   └── arcanea-templates (index)
│
├── third-party/                      # forks/clones (5)
│   ├── claude-code (anthropic)
│   ├── claude-code-config
│   ├── cline (cline upstream)
│   ├── ai-chatbot-study (vercel)
│   └── otaku (elizaOS)
│
└── _archive/                         # not-in-use (4)
    ├── Business
    ├── arcanea-tab2
    ├── arcanea.ai (the empty directory)
    └── studio-frankx
```

This is the **logical** structure. Reorganizing the file system today is risky (breaks paths in countless scripts). Better: build a `repos.json` registry that records this logical mapping, and let agents read from registry rather than from disk-traversal.

## Status: P2 COMPLETE
