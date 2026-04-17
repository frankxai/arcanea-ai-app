# Current State — AMCAS — 2026-04-17

## What works end-to-end today

```
✓ packages/router-spec          — builds, validates (14 models, 16 tasks, 7 surfaces, 4 delegations)
✓ packages/arcanea-code         — builds, runs, globally linked via `npm link`
✓ arcanea-code list-models      — prints catalog filtered by tier
✓ arcanea-code list-tasks       — 16 classes grouped by domain
✓ arcanea-code explain <task>   — shows candidate chain + runtime + rationale
✓ arcanea-code doctor           — detected all 4 CLIs + auth tiers correctly
✓ arcanea-code config           — preference write/read works (~/.arcanea/config.yaml)
✓ arcanea-code run --dry-run    — picks right model, right CLI, right argv per surface
```

### Doctor output on this machine (2026-04-17)

| Runtime | Installed | Tier |
|---|---|---|
| claude | ✓ | **sub** (Max — no ANTHROPIC_API_KEY → assumed sub-auth) |
| opencode | ✓ | **free** (Zen) |
| codex | ✓ | **byok** (OPENAI_API_KEY detected) |
| gemini | ✓ | unknown (no GOOGLE/GEMINI_API_KEY) |

### Routing proofs (dry-run, verified)

```
run --task code.debug  --surface claude-arcanea  → claude-opus-4-7 via claude  [auth: sub]
run --task code.debug  --surface oh-my-arcanea   → minimax-m2.5-free via opencode [auth: free]
```

## What's delivered (against original vision)

Original asks (summarized from multi-turn conversation):

| Ask | Status |
|---|---|
| Single source of truth for model routing | ✅ `@arcanea/router-spec` |
| Thin dispatcher that execs the right CLI | ✅ `@arcanea/arcanea-code` |
| Max-sub economics respected | ✅ `claude -p` path → Max sub |
| Free-tier friendly for non-sub users | ✅ `config preference free-first` |
| Multi-sub UX / walk-through | ✅ `doctor` + `config` + install hints |
| Works in terminal-only / low-RAM mode | ✅ no TUI, 50MB resident |
| Agent-readable manifests | ✅ `manifest.schema.yaml` + `AGENTS.md` |
| Curl installer | ✅ `scripts/install.sh` (bash) |
| Archive superseded repos | ✅ `arcanea-opencode` archived |
| Design spec + success criteria | ✅ `planning-with-files/AMCAS_DESIGN_2026-04-17.md` |
| Overlay contract for Phase 2b | ✅ `docs/ops/OVERLAY_CONTRACT_2026-04-17.md` |
| Blog updated (GLM 5, Opus 4.7, Nemotron) | ✅ `/blog/ai-model-arena-free-models-guide` |
| Validate everything builds + runs | ✅ smoke tests passed |
| Global install (`arcanea-code` anywhere) | ✅ `npm link` (local) |

## What's left

| Task | Blocker | Effort |
|---|---|---|
| **Phase 1b: npm publish** both packages | Needs `npm login` + `@arcanea` scope registered | 30 min with auth |
| **Phase 2b: wire 4 overlay repos** (oh-my-arcanea, claude-arcanea, codex-arcanea, gemini-arcanea) to read router-spec | Needs 4 repo clones + PRs | 5-6 hrs |
| **Update `claude-codex-gemini-opencode-settings/install.sh`** to pull router-spec | Needs clone | 1 hr |
| **Verify `claude -p` truly uses Max sub** (not billed BYOK) | Run one small `arcanea-code run` + check token usage | 2 min |
| **Phase 3: real swarm wire** (arcanea-code swarm → `ao batch-spawn`) | Requires `ao` CLI integration testing | 3 hrs |
| **Phase 4: /ops/agents dashboard** | Optional, `apps/web` work | 4 hrs |
| **Port to standalone `frankxai/arcanea-code` repo** | That repo has old OpenCode fork — need to decide: replace or keep as TUI companion | 1 hr decision + work |

## Smoke-test it yourself

```bash
cd ~/Arcanea

# Pull latest
git pull origin main

# Already installed + linked? Just run:
arcanea-code --version         # → 0.1.0
arcanea-code list-tasks
arcanea-code explain world.canon --surface claude-arcanea
arcanea-code doctor

# Verify Max sub actually works (small token cost):
arcanea-code run --task nav.fast "say hi in 3 words"
# → execs: claude -p "say hi in 3 words" --model claude-haiku-4-5
# If Max sub works, this returns without counting against BYOK key.
```

## Commits pushed today

| SHA | Summary |
|---|---|
| `eaa22f03` | feat(amcas): ship Router Spec + arcanea-code dispatcher (Phase 1a) |
| `667a0f9b` | feat(amcas): Phase 2a — multi-sub UX, overlay contract, install.sh |
| `d243db4b` | fix(router-spec): quote yaml flow-collection aliases + main→dist |

## Files of record

- `planning-with-files/AMCAS_DESIGN_2026-04-17.md` — approved end-to-end design
- `docs/ops/ORCHESTRATOR_STACK_2026-04-17.md` — three-orchestrator explainer
- `docs/ops/OVERLAY_CONTRACT_2026-04-17.md` — what Phase 2b overlays must ship
- `packages/router-spec/models.yaml` — canonical routing
- `packages/router-spec/manifest.schema.yaml` — overlay manifest shape
- `packages/arcanea-code/AGENTS.md` — agent-readable dispatcher policy
- `packages/arcanea-code/scripts/install.sh` — bootstrap installer
- `~/.arcanea/config.yaml` — local user config (written by doctor, gitignored)

## Honest risks / open questions

1. **`claude -p` + Max sub assumption** — verified indirectly (no ANTHROPIC_API_KEY → falls through to sub auth) but not billing-verified. One real call resolves this.
2. **npm publish requires org setup** — `@arcanea` scope needs registration at npmjs.org before publish.
3. **Windows install.sh** — bash-only today. Windows native users use `pnpm add -g @arcanea/arcanea-code` directly.
4. **Doctor heuristics** — auth detection is sniff-based, not oracle-based. Good enough to route; not authoritative.
5. **standalone arcanea-code repo conflict** — current contents are a full OpenCode fork. Decision deferred: either reset to dispatcher-only or keep fork as rich-TUI Phase 4 option (user leaned this direction).

## Next suggested session

Highest leverage, lowest RAM:
1. `npm login` + publish both packages (unblocks all Phase 2b/OSS distribution).
2. Add `manifest.yaml` to `oh-my-arcanea` as first overlay proof (via gh api — no clone needed).
3. Verify Max sub with one live `arcanea-code run`.

That's 90 minutes and unblocks everything downstream.
