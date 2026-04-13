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

### P5 — Future (next sprint after above)

| Task | Est | Owner |
|------|-----|-------|
| Visual swarm graph (LangGraph-style DAG) | 2d | Claude |
| Agent execution traces / inspector | 2d | Claude |
| A2A push mode (webhook notifications) | 1d | Claude |
| Skills as runtime primitive (bind `.claude/skills/` to Luminors) | 1d | Claude |
| Multi-modal tools (image gen, code execution) | 2d | Claude |
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
