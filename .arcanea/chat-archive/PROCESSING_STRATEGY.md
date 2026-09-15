# Processing Strategy — Staging, Token Budget, Model Routing

## Decision: ship the foundation now, defer the deep pass

`canon-recovered/CANON_LOCKED_v6.md` + `gates.yaml` are already a complete, internally
reconciled foundation — one AI session already did the hard reconciliation work across
years of prior chats, and it held up under a fresh continuity check in this session
(no new contradictions found). Don't gate that on finishing the other ~25 chats.

**Now (cheap, fast, mostly non-LLM):**
1. Frank rules on the six §16 OPEN items in `CANON_LOCKED_v6.md` — a conversation, not
   a processing job. Zero meaningful token cost.
2. Fix the git lock, commit + push what's already recovered.
3. Promote v6 → `.arcanea/lore/CANON_LOCKED.md` once §16 is ruled on.
4. Run `canon_check` (once built) against the current repo set using the purge register —
   this is grep/regex, not model calls.

**Later (the deep pass — remaining chats, full provenance, five-pass validation):**
Lower priority, higher token cost, no reason to rush it this week given the limit
situation below. Runs whenever the export lands and weekly limits have room.

## Token budget — order of magnitude, not a precise measurement

| Task | Rough cost | Notes |
|---|---|---|
| Pull remaining ~4 named chats + ~20 inventoried chats (transcript + artifacts) | ~300k–500k tokens total | Based on this session's actual chat 1 (~15k tokens for transcript + 3 artifacts combined); scales with how much each chat contains |
| `process_export.py` / `process_provenance.py` / `dedup_manifest.py` | ~0 tokens | Pure Python, regex-based, no model calls — run these locally, not through any Claude session |
| Five-pass validation (`CANON_VALIDATION_PROTOCOL.md`) run once, over the full corpus | ~250k–600k tokens | Each pass re-reads a growing corpus; costlier the more chats get merged in first |
| Total for the full deep pass | **~600k–1.1M tokens**, roughly | Wide range because it depends on how much of the ~20-chat inventory is redundant with what v6 already reconciled |

This is a rough estimate from observed density in this session, not a token-counted
projection — treat it as "this is a real chunk of a weekly budget," not a firm number.

## Where you actually stand on limits — I can't see this, check directly

I have no tool access to your account's usage dashboard. Two ways to check precisely,
found via search (not memory, since this changes):
- In Claude Code: run `/usage` — shows current session, weekly limit, **and Opus usage
  tracked separately against the weekly cap**.
- On claude.ai: Settings → Usage.

One fact worth knowing for planning: **claude.ai, Claude Code, and Claude Desktop
(including this Cowork session) all draw from the same weekly limit pool.** This
session has been heavy — that's real consumption against the same budget Claude Code
would use. Worth checking `/usage` before deciding whether to run the deep pass this
week at all. ([Claude Help Center — models, usage, and limits](https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code), [Claude Help Center — usage and length limits](https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work))

## Model routing — who processes what

| Task | Recommended | Why |
|---|---|---|
| `process_export.py`, `process_provenance.py`, `dedup_manifest.py` | No model — plain Python | Regex/heuristic, zero reasoning needed |
| Pulling remaining chat artifacts (browser extraction) | Sonnet 5, or offload to Hermes/Grok/Codex if available | Mechanical — open chat, extract text. Doesn't need Opus-tier reasoning |
| Pass 1 — Continuity Auditor (cross-check facts against `gates.yaml`) | Sonnet 5, or offload | Rule-based cross-referencing |
| Pass 2 — Provenance Auditor (Frank-ruled vs Claude-asserted) | **Opus** | Judgment call on ambiguous conversational signal — worth the higher-quality read |
| Pass 3 — Systems/IP Architect (placement per `REPO_PLACEMENT.md`) | Sonnet 5 | Decision tree is already explicit; mechanical application |
| Pass 4 — Story/Creative Editor | Sonnet 5 (Claude specifically — it already holds the voice/context from prior sessions) | Creative judgment benefits from continuity with what's already been established, less from raw model horsepower |
| Pass 5 — Confidentiality check | **Opus**, Claude specifically | Highest-stakes judgment (this is the pass that would catch another Luminor-transmission-style leak); don't offload |
| `INTEGRATION_PROPOSAL.md` final synthesis | **Opus** | Everything upstream funnels here — worth the best model for the last mile |

**On Hermes + Grok 4.5 + Codex/GPT-5.6:** yes, route the mechanical/high-volume passes
(bulk extraction, Pass 1, Pass 3) through those if available — this repo's own
`CLAUDE.md` already establishes OpenRouter as the default external-LLM route, so this
isn't a new pattern, just applying it here. Keep Claude specifically (Sonnet for
creative continuity, Opus for the two judgment-heavy passes) for Pass 2, Pass 4, Pass 5,
and the final synthesis — those benefit from same-model continuity with the context
this session already built, and Pass 5 in particular is not a place to introduce a
model with less established alignment behavior on this specific corpus.
