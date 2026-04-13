# Current Backlog — 2026-04-13

## Priority Queue (ordered by leverage)

### P0 — Deploy (unblocks everything)

| Task | Est | Blocker | Owner |
|------|-----|---------|-------|
| Run `supabase db push` (memory migration) | 5m | Supabase CLI access | Frank |
| Set `ARCANEA_INTERNAL_API_KEY` env var in Vercel | 2m | Vercel access | Frank |
| Set `OPENAI_API_KEY` in dev env | 2m | API key | Frank |
| Run `npx tsx scripts/backfill-agent-embeddings.ts` | 10m | Above 3 done | Frank |
| Configure Supabase DB webhook → `/api/internal/embed-agent` | 10m | Supabase dashboard | Frank |
| Smoke test: Cmd+K → Lumina Bubble on dev server | 5m | Dev server running | Frank |
| Smoke test: `POST /api/swarm/invoke` with creative question | 5m | ANTHROPIC_API_KEY | Frank |
| Smoke test: `POST /api/forge/quality-check` with slop prompt | 5m | Dev server | Frank |

### P1 — Publish the Standard (highest strategic leverage)

| Task | Est | Blocker | Owner |
|------|-----|---------|-------|
| Push `staging/luminor-kernel-spec/` to new public repo | 10m | Frank's approval | Frank |
| Write "Announcing the Luminor Standard" blog post | 2h | Repo published | Claude |
| Post announcement on X/HN/LinkedIn | 30m | Blog published | Frank |
| Update `/luminor-standard` page links to point to real repo | 15m | Repo URL known | Claude |

### P2 — Tool Calling in Executor (biggest capability gap)

| Task | Est | Blocker | Owner |
|------|-----|---------|-------|
| Create `lib/luminors/tool-resolver.ts` (domain → tool set) | 2h | None | Claude |
| Create `lib/luminors/mcp-tool-bridge.ts` (wrap MCP as Vercel AI SDK tools) | 3h | arcanea-mcp imported | Claude |
| Create `lib/luminors/handoff-tool.ts` (inter-Luminor handoff) | 2h | Executor stable | Claude |
| Create `lib/luminors/memory-edit-tool.ts` (Letta self-editing) | 2h | Memory migration applied | Claude |
| Wire `tools` param into executor `streamText` call | 1h | Above 4 done | Claude |
| Add `maxSteps: 5` for multi-turn tool calling | 15m | Tools wired | Claude |
| Smoke test: Luminor calls a tool during response | 30m | All above | Claude |

### P3 — Cross-Repo Integration

| Task | Est | Blocker | Owner |
|------|-----|---------|-------|
| `@arcanea/arcanea-mcp`: expose Luminors as MCP tools | 4h | Executor stable | Claude |
| `@arcanea/arcanea-flow`: use swarm engine for workflows | 4h | Swarm tested | Claude |
| `@arcanea/arcanea-cli`: add `luminor` subcommands | 3h | Compiler published | Claude |
| `@arcanea/arcanea-skills`: bind to `skill_registry` table | 2h | Embeddings backfilled | Claude |
| Mirror compiler to `frankxai/arcanea` (OSS) | 1h | P1 done | Claude |
| Update `oh-my-arcanea` overlay with Luminor agent loading | 2h | Export CLI working | Claude |

### P4 — UI Polish

| Task | Est | Blocker | Owner |
|------|-----|---------|-------|
| `/arena/luminors` leaderboard page (frontend) | 6h | Arena API tested | Claude |
| Forge UI → call quality-check on each step | 4h | Quality gates tested | Claude |
| A2A Agent Card endpoint: `/agents/:id/.well-known/agent-card.json` | 2h | Compiler | Claude |
| Marketplace browse/filter/search page | 8h | Embeddings backfilled | Claude |

### P3.5 — Publishing House Claw Distribution (NEW 2026-04-13)

> Full strategy: `planning-with-files/CLAW_DISTRIBUTION_STRATEGY_2026-04-13.md`

| Task | Est | Blocker | Owner | Channel |
|------|-----|---------|-------|---------|
| Publish `@arcanea/publishing-house` to npm | 1h | Builds clean ✓ | Frank | npm |
| Publish `@arcanea/publishing-house-mcp` to npm | 1h | Builds clean ✓ | Frank | npm |
| Submit taste-score + publish-content to anthropics/skills PR | 2h | npm published | Claude | anthropics/skills |
| Register MCP server on Smithery | 1h | npm published | Frank | Smithery |
| Submit 5 skills to openclaw/clawhub PR | 4h | SKILL.md files ready ✓ | Claude | ClawHub |
| Push Docker image to Docker Hub | 2h | Dockerfile tested ✓ | Claude | Docker Hub |
| Publish Railway template from deployed project | 1h | Railway deploy working | Frank | Railway |
| Submit to Cline MCP Marketplace (issue + logo) | 1h | MCP registered | Claude | Cline |
| PR to 4 awesome-lists (claude-skills, agent-skills, etc.) | 2h | Repo public | Claude | GitHub |
| Create `arcanea/taste-score-action` GitHub Action | 4h | npm published | Claude | GitHub Actions |

**8 Claws, 87 skills mapped, 12 channels identified, 45 skills transportable.**

### P5 — Future (next sprint after above)

| Task | Est | Owner |
|------|-----|-------|
| Visual swarm graph (LangGraph-style DAG) | 2d | Claude |
| Agent execution traces / inspector | 2d | Claude |
| A2A push mode (webhook notifications) | 1d | Claude |
| Skills as runtime primitive (bind `.claude/skills/` to Luminors) | 1d | Claude |
| Multi-modal tools (image gen, code execution) | 2d | Claude |
| Editor Claw (Aiyami) TypeScript implementation | 2d | Claude |
| Fork qwibitai/nanoclaw as arcanea-publishing-node | 2d | Frank |
| Deploy Paperclip as Publishing House OS | 3d | Claude |
| ERC-8004 agent registration for 8 Claws | 1d | Claude |
| x402 payment integration | 1d | Claude |
| Story Protocol IP licensing layer | 1d | Claude |
| Founding Circle landing page + waitlist | 1d | Claude |

## Cross-Repo Sync Needed

| Repo | What to sync | When |
|------|-------------|------|
| `frankxai/arcanea` (OSS) | Compiler + 13 Chosen specs | After P1 (public repo) |
| `frankxai/arcanea-mcp` | Luminor MCP tools | After P2 (tool calling) |
| `frankxai/arcanea-flow` | Swarm executor | After P3 |
| `frankxai/oh-my-arcanea` | Agent overlay | After P3 |
| `frankxai/claude-arcanea` | Agent files | After export CLI runs |

## Non-Goals (do NOT work on these now)

- New Luminors beyond the 13 (the system is ready; let users forge them)
- Onchain/NFT integration (separate workstream)
- Presence Layer (separate workstream)
- Book production pipeline (already handled by publishing-house)
- New lore/canon content (separate creative session)
