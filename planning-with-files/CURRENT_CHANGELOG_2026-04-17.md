# Current Changelog — 2026-04-17

## Trust Repair Pass

Honest pass across the 8 marketing-heavy surfaces added in the prior sessions. No new features built; no scope invented; no out-of-plan recommendations.

### What was wrong before

The prior sessions built `/create`, `/studio` (v2), `/apps`, `/creator-economy`, `/community-hub`, `/distribute`, `/storage`, `/profile` — all visually premium, most not wired end-to-end. The `INTEGRATIONS` table marked 30+ tools as "live" that were only designed, not integrated. Homepage teasers repeated claims that weren't live.

### What changed

| File | Change |
|------|--------|
| `components/premium/status-badge.tsx` | **New.** `StatusBadge` + `StatusNotice` primitive. 5 maturity levels: LIVE / BETA / PREVIEW / PLANNED / ROADMAP. |
| `components/premium/integration-grid.tsx` | Audited all 36 integration entries. `live` kept only where the tool is actually wired inside `arcanea-ai-app` today: Claude Code, Anthropic Claude, Google Gemini, Nano Banana 2, Vercel AI SDK, Vercel, Supabase, GitHub. Everything else downgraded to `soon` with honest notes. |
| `app/studio/studio-hub.tsx` | Added `StatusBadge level="preview"` + `StatusNotice` explaining ingestion plumbing is Q2 2026. Links to `/chat` as the working alternative. |
| `app/create/create-hub.tsx` | `StatusBadge preview` + notice: template gallery is a design preview, not instantiable. Points users to `/worlds`. |
| `app/apps/apps-content.tsx` | `StatusBadge preview` + notice: directory today, marketplace (install flows) Q2–Q3 2026. |
| `app/creator-economy/creator-economy-content.tsx` | `StatusBadge roadmap` + notice: none of the 7 revenue streams are live. Explicitly notes **x402 micropayments are preferred over Stripe** per backlog. |
| `app/community-hub/community-hub-content.tsx` | `StatusBadge beta` + notice: Discord + Reddit live, leaderboards/contests/spotlights are representative design. |
| `app/distribute/distribute-content.tsx` | `StatusBadge planned Q3 2026` + notice: pipelines not live; today you publish via your own accounts. |
| `app/storage/storage-hero.tsx` | `StatusBadge beta` + notice: Supabase + pgvector live today; Arweave/S3/Google Drive/Syncthing/Obsidian export Q2 2026. |
| `app/profile/profile-showcase.tsx` | Added example-profile notice so logged-out users know they're viewing Frank's demo, not a real empty state. Links to `/auth/signup`. |
| `app/v3/v3-below-fold.tsx` | EarnTeaser: prepended a ROADMAP badge; subtitle clarifies none shipped yet, tracked on Linear. StackTeaser: subtitle now lists only wired tools as live examples, rest explicitly on backlog. |

### Alignment with current backlog (CURRENT_BACKLOG_2026-04-13.md)

- **P5 list** includes `x402 payment integration` and `Story Protocol IP licensing layer`. Stripe is not on any priority tier. The earlier session's recommendation to "build a Stripe flow" has been retracted; revenue honesty badges now point users to the x402 + Story Protocol path the backlog actually specifies.
- **Non-goals** explicitly list "Onchain/NFT integration" and "Presence Layer" as separate workstreams. The honesty badges on `/apps` and `/integrations` now reflect that — all chain entries are `soon`, no beta/live claims.
- Current P0-P3 items (Supabase migration deploy, Luminor Standard publish, Tool calling in Executor, Cross-Repo integration) were NOT altered by this pass. This was purely marketing-surface honesty.

### What the visitor now sees

- The 8 preview/roadmap pages carry clear maturity labels in the hero area.
- Integration tiles across `/integrations` and `/apps` show only 8 items as `LIVE`, not 30+.
- Homepage earn teaser is explicitly labeled `ROADMAP · rolling out 2026`.
- Logged-out `/profile` users see "This is Frank's example profile" before the identity card.

### What's still on the roadmap to do

Not shipped here — reserved for proper backlog execution:

- P1: Publish `staging/luminor-kernel-spec/` to public repo + announcement blog post
- P2: Tool calling in Executor (tool-resolver, mcp-tool-bridge, handoff-tool, memory-edit-tool)
- P3: Cross-repo integration (@arcanea/arcanea-mcp Luminor tools, @arcanea/arcanea-flow swarm, @arcanea/arcanea-cli luminor commands)
- P4: `/arena/luminors` leaderboard, Forge quality-check UI, A2A Agent Card endpoint, Marketplace browse/filter page
- P5 (future): Visual swarm graph, execution traces, A2A push, Skills as runtime, x402 payment, Story Protocol licensing, Founding Circle waitlist

### Commits this session

1. `feat(web): premium 2026 design system + Living World Engine revamp` (b394f613)
2. `feat(web): Canva-inspired creator ecosystem — 5 new pages + full stack layer` (05b834f0)
3. `feat(web): Canva-scale platform — Studio + Protocol + Apps + Teams + Storage + Profile` (90019314)
4. _pending_: `chore(web): honesty pass — status badges + integration audit` — this change

### Reflection

The earlier sessions over-indexed on adding marketing pages and under-indexed on truthfulness. This pass restores the balance: every visually-premium page now carries a label that matches reality. No silent marketing claims remain. The next session should resume P1/P2 backlog work — publishing the Luminor Standard and wiring Tool Calling — not adding more pages.
